// owning agent: dev-lead
// TODO: Damage resolution. Phase 1: any enemy contact = game over. Phase 2 adds:
//   - mossplodder/hummerwing kill on hatchet contact (always 1-hit-kill);
//   - hero stepping on fire_low tile = game over;
//   - mossplodder walking onto fire_low = mossplodder dies.
// v0.75 adds:
//   - generalized fatal-tile check (`_heroVsFatalTile`) covers fire_low,
//     water_gap, crystal_vein via the new `isFatal` flag on TileMap tiles;
//   - hero contact with the Bracken Warden's body kills hero (`_bossBodyVsHero`);
//   - hatchet ↔ moss-pulse mutual despawn (`_hatchetVsMossPulse`);
//   - hatchet ↔ boss-chest hitbox decrements boss HP (`_hatchetVsBoss`);
//   - moss-pulse projectile kills hero on contact (existing
//     `_enemyProjectileVsHero` extended to also catch ownerKind === 'boss').

import { CRAWLSPINE, GLASSMOTH, SAPLING } from '../config/PhaseOneTunables.js';
import { MOSSPLODDER, HUMMERWING, FIRE }  from '../config/PhaseTwoTunables.js';
import { BRACKEN_WARDEN }                 from '../config/PhaseThreeTunables.js';

const TILE = 48;
const DAMAGING_SAPLING_STATES = new Set(['windup', 'firing']);

export class CombatSystem {
    update(ecs, state, level = null) {
        if (state.gameState === 'GAME_OVER' || state.gameState === 'STAGE_CLEAR') return;
        // Phase 2: during round-transition fade, Reed is invulnerable (he can't input
        // anyway and the next round is already half-loaded by the time the screen is
        // black). This prevents getting bumped to game-over during the fade.
        if (state.gameState === 'TRANSITIONING') return;
        // v0.50.1 — also skip during RESPAWNING (Reed is mid-respawn / out of play).
        if (state.gameState === 'RESPAWNING') return;

        const players = ecs.query('transform', 'velocity', 'physics', 'player');
        if (!players.length) return;
        const player = players[0];

        // v0.50.1 — guard against RESPAWNING (set by killHero in Phase 2) so we
        // don't double-kill across the same frame.
        const dead = (gs) => gs === 'GAME_OVER' || gs === 'RESPAWNING';
        this._heroVsEnemyContact(ecs, state, player);
        if (dead(state.gameState)) return;
        this._heroProjectileVsEnemy(ecs, state, player);
        if (dead(state.gameState)) return;
        this._enemyProjectileVsHero(ecs, state, player);
        if (dead(state.gameState)) return;

        // v0.75 — boss interactions (only relevant if a boss entity is present).
        this._hatchetVsBoss(ecs, state);
        if (dead(state.gameState)) return;
        this._hatchetVsMossPulse(ecs);
        if (dead(state.gameState)) return;
        this._bossBodyVsHero(ecs, state, player);
        if (dead(state.gameState)) return;

        // Phase 2 + v0.75 fatal-tile interactions
        if (level) {
            this._heroVsFatalTile(ecs, state, player, level);
            if (dead(state.gameState)) return;
            this._mossplodderVsFatalTile(ecs, level);
        }
    }

    _heroVsEnemyContact(ecs, state, player) {
        const ptf = player.transform;

        for (const e of ecs.query('transform', 'enemy')) {
            const en = e.enemy;
            if (en.ai === 'dead') continue;

            // Sapling: harmless when closed
            if (en.type === 'sapling' && !DAMAGING_SAPLING_STATES.has(en.ai)) continue;

            if (!this._overlaps(ptf, e.transform)) continue;
            this._killHero(state, player);
            return;
        }
    }

    _heroProjectileVsEnemy(ecs, state, player) {
        const projectiles = ecs.query('transform', 'projectile').filter(r => r.projectile.ownerKind === 'hero');
        for (const proj of projectiles) {
            for (const e of ecs.query('transform', 'enemy')) {
                if (e.enemy.ai === 'dead') continue;
                if (!this._overlaps(proj.transform, e.transform)) continue;

                const damage = proj.projectile.damage;
                if (damage === 'kill' || (e.enemy.type === 'mossplodder' || e.enemy.type === 'hummerwing')) {
                    this._killEnemyP2(e, state);
                } else {
                    this._damageEnemy(e, damage, state);
                }
                ecs.destroyEntity(proj.id);
                break;
            }
        }
    }

    _enemyProjectileVsHero(ecs, state, player) {
        const ptf = player.transform;
        // v0.75 — also catch boss-owned projectiles (moss-pulse). The kill path
        // is identical to enemy-owned hatchet shrapnel: any contact = death.
        const projectiles = ecs.query('transform', 'projectile').filter(r =>
            r.projectile.ownerKind === 'enemy' || r.projectile.ownerKind === 'boss');
        for (const proj of projectiles) {
            if (!this._overlaps(proj.transform, ptf)) continue;
            this._killHero(state, player);
            // The boss-owned moss-pulse should NOT despawn on hero contact —
            // per boss brief §13 the pulse continues to its left-wall despawn.
            // The hero is already dying; subsequent CombatSystem ticks bail out
            // via the `dead` guard. Keep this branch destroying the projectile
            // for enemy hatchet shrapnel where the hit-once semantics apply.
            if (proj.projectile.ownerKind === 'enemy') ecs.destroyEntity(proj.id);
            return;
        }
    }

    /**
     * v0.75 — generalized fatal-tile check. Tests Reed's body AABB against any
     * tile flagged isFatal (fire_low, water_gap, crystal_vein). Replaces the
     * v0.50 fire-specific path; v0.50 fire still fires through this code path
     * because `isFire` and `isFatal` are both true for FIRE_LOW.
     */
    _heroVsFatalTile(ecs, state, player, level) {
        const ptf = player.transform;
        const cx = ptf.x + ptf.w / 2;
        const xs = [ptf.x + 4, cx, ptf.x + ptf.w - 4];
        const ys = [ptf.y + ptf.h - 4, ptf.y + ptf.h * 0.6, ptf.y + ptf.h * 0.3];
        for (const py of ys) {
            for (const px of xs) {
                const c = Math.floor(px / TILE);
                const r = Math.floor(py / TILE);
                const t = level.getTile(c, r);
                if (!t || !t.isFatal) continue;
                // For visual fairness we shrink each fatal tile's hitbox to the
                // same fire-style footprint (FIRE constants). This means a Reed
                // jumping AT a hazard tile from the side has a survivable gap.
                const hzTop = r * TILE + (TILE - FIRE.hitboxH);
                const hzBot = (r + 1) * TILE;
                const hzLeft  = c * TILE + (TILE - FIRE.hitboxW) / 2;
                const hzRight = hzLeft + FIRE.hitboxW;
                if (ptf.x + ptf.w > hzLeft && ptf.x < hzRight &&
                    ptf.y + ptf.h > hzTop  && ptf.y < hzBot) {
                    this._killHero(state, player);
                    return;
                }
            }
        }
    }

    /** v0.75 — mossplodder dies on fire OR water_gap OR crystal_vein contact. */
    _mossplodderVsFatalTile(ecs, level) {
        for (const e of ecs.query('transform', 'enemy')) {
            const en = e.enemy;
            if (en.type !== 'mossplodder' || en.ai === 'dead') continue;
            const tf = e.transform;
            const xs = [tf.x + 6, tf.x + tf.w / 2, tf.x + tf.w - 6];
            const ys = [tf.y + tf.h - 4, tf.y + tf.h * 0.6, tf.y + 4];
            let dead = false;
            for (const py of ys) {
                if (dead) break;
                for (const px of xs) {
                    const c = Math.floor(px / TILE);
                    const r = Math.floor(py / TILE);
                    const t = level.getTile(c, r);
                    if (t && t.isFatal) {
                        en.ai = 'dead';
                        en.deathFrames = MOSSPLODDER.deathFrames;
                        dead = true;
                        break;
                    }
                }
            }
        }
    }

    /**
     * v0.75 — hatchet vs Bracken Warden chest sigil. AABB-test hero hatchet
     * projectiles against the boss's chest hitbox (BRACKEN_WARDEN.hitboxOffset*).
     * Hit decrements boss.hp, sets a pause timer, swaps sprite anim to 'hurt',
     * and despawns the hatchet. State.addScore awards 200 per hit.
     */
    _hatchetVsBoss(ecs, state) {
        const bosses = ecs.query('transform', 'boss', 'sprite');
        if (!bosses.length) return;
        const b    = bosses[0];
        const boss = b.boss;
        if (boss.ai === 'dead') return;

        const hitbox = {
            x: b.transform.x + BRACKEN_WARDEN.hitboxOffsetX,
            y: b.transform.y + BRACKEN_WARDEN.hitboxOffsetY,
            w: BRACKEN_WARDEN.hitboxWidth,
            h: BRACKEN_WARDEN.hitboxHeight,
        };
        const hatchets = ecs.query('transform', 'projectile').filter(r =>
            r.projectile.type === 'hatchet' && r.projectile.ownerKind === 'hero');
        for (const h of hatchets) {
            if (!this._overlaps(h.transform, hitbox)) continue;
            boss.hp = Math.max(0, boss.hp - 1);
            // Preserve the underlying state so the timer resumes on the same beat.
            if (boss.ai !== 'hurt') boss.prevAi = boss.ai;
            boss.pauseTimer = BRACKEN_WARDEN.hurtFrames;
            b.sprite.anim = 'hurt';
            b.sprite._lastAnim = null;
            ecs.destroyEntity(h.id);
            state.addScore?.(200);
            return;
        }
    }

    /**
     * v0.75 — hatchet ↔ moss-pulse mutual despawn. If a thrown hatchet AABB
     * overlaps an active moss-pulse projectile, both are destroyed. Awards no
     * score (the pulse is a defensive counter, not an enemy kill).
     */
    _hatchetVsMossPulse(ecs) {
        const hatchets = ecs.query('transform', 'projectile')
                            .filter(r => r.projectile.type === 'hatchet'
                                      && r.projectile.ownerKind === 'hero');
        if (!hatchets.length) return;
        const pulses = ecs.query('transform', 'projectile')
                          .filter(r => r.projectile.type === 'moss-pulse');
        if (!pulses.length) return;
        for (const h of hatchets) {
            for (const p of pulses) {
                if (this._overlaps(h.transform, p.transform)) {
                    ecs.destroyEntity(h.id);
                    ecs.destroyEntity(p.id);
                    return;
                }
            }
        }
    }

    /**
     * v0.75 — Reed body-contact with the Bracken Warden's full transform AABB
     * (NOT the chest hitbox) kills hero. Per boss brief §13: "Reed walks into
     * the Warden's body hitbox = state.killHero(player)."
     */
    _bossBodyVsHero(ecs, state, player) {
        const bosses = ecs.query('transform', 'boss');
        if (!bosses.length) return;
        const b = bosses[0];
        if (b.boss.ai === 'dead') return;
        if (this._overlaps(player.transform, b.transform)) {
            this._killHero(state, player);
        }
    }

    // ──────────────────────────────────────────────────────────────────────
    _killHero(state, player) {
        if (state.gameState === 'GAME_OVER' || state.gameState === 'RESPAWNING') return;
        const v  = player.velocity;
        const pl = player.player;
        // v0.50.2 — if already dying, the death FSM is mid-flight; don't reset
        // velocity / aiState. Without this guard the dying knockback arc would
        // be interrupted every frame an enemy AABB still overlaps Reed.
        if ((pl.dyingFrames | 0) > 0) return;
        v.vx = 0;
        v.vy = 0;
        pl.aiState = 'dead';
        // v0.50.1 — pass player so killHero can branch into Phase 2 loseLife flow.
        // v0.50.2 — Phase 2 routes through beginDying via state.killHero.
        state.killHero(player);
    }

    /** Phase 2 — instant kill for mossplodder/hummerwing. */
    _killEnemyP2(e, state) {
        const en = e.enemy;
        if (en.ai === 'dead') return;
        en.ai = 'dead';
        const deathBy = {
            mossplodder: MOSSPLODDER.deathFrames,
            hummerwing:  HUMMERWING.deathFrames,
        };
        en.deathFrames = deathBy[en.type] ?? 30;
        state.addScore?.(100);
    }

    _damageEnemy(e, dmg, state) {
        const en = e.enemy;
        if (en.ai === 'dead') return;
        // Phase 2 enemies: damage 'kill' or any value → instant kill.
        if (en.type === 'mossplodder' || en.type === 'hummerwing') {
            this._killEnemyP2(e, state);
            return;
        }
        en.hp = Math.max(0, en.hp - dmg);
        if (en.hp <= 0) {
            en.ai = 'dead';
            const deathBy = {
                crawlspine: CRAWLSPINE.deathFrames,
                glassmoth:  GLASSMOTH.deathFrames,
                sapling:    SAPLING.deathFrames,
            };
            en.deathFrames = deathBy[en.type] ?? 30;
            state.addScore?.(100);
        } else {
            const hurtBy = {
                crawlspine: CRAWLSPINE.hurtFrames,
                glassmoth:  GLASSMOTH.hurtFrames,
                sapling:    SAPLING.hurtFrames,
            };
            en.hurtFrames = hurtBy[en.type] ?? 4;
        }
    }

    _overlaps(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }
}

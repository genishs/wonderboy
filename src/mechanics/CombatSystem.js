// owning agent: dev-lead
// TODO: Damage resolution. Phase 1: any enemy contact = game over. Phase 2 adds:
//   - mossplodder/hummerwing kill on hatchet contact (always 1-hit-kill);
//   - hero stepping on fire_low tile = game over;
//   - mossplodder walking onto fire_low = mossplodder dies.

import { CRAWLSPINE, GLASSMOTH, SAPLING } from '../config/PhaseOneTunables.js';
import { MOSSPLODDER, HUMMERWING, FIRE }  from '../config/PhaseTwoTunables.js';

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

        // Phase 2 fire-tile interactions
        if (level) {
            this._heroVsFireTile(ecs, state, player, level);
            if (dead(state.gameState)) return;
            this._mossplodderVsFireTile(ecs, level);
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
        const projectiles = ecs.query('transform', 'projectile').filter(r => r.projectile.ownerKind === 'enemy');
        for (const proj of projectiles) {
            if (!this._overlaps(proj.transform, ptf)) continue;
            this._killHero(state, player);
            ecs.destroyEntity(proj.id);
            return;
        }
    }

    _heroVsFireTile(ecs, state, player, level) {
        const ptf = player.transform;
        // Fire tiles live at row = floorRow - 1. Reed's feet are at floorRow but
        // his bbox extends ~1.4 tiles upward — sample both rows under his foot center
        // and lower-body band. AABB-test the actual fire hitbox.
        const cx = ptf.x + ptf.w / 2;
        // Probe column band (left, center, right) at body-mid + foot.
        const xs = [ptf.x + 4, cx, ptf.x + ptf.w - 4];
        const ys = [ptf.y + ptf.h - 4, ptf.y + ptf.h * 0.6, ptf.y + ptf.h * 0.3];
        for (const py of ys) {
            for (const px of xs) {
                const c = Math.floor(px / TILE);
                const r = Math.floor(py / TILE);
                const t = level.getTile(c, r);
                if (!t || !t.isFire) continue;
                const fireTop = r * TILE + (TILE - FIRE.hitboxH);
                const fireBot = (r + 1) * TILE;
                const fireLeft  = c * TILE + (TILE - FIRE.hitboxW) / 2;
                const fireRight = fireLeft + FIRE.hitboxW;
                if (ptf.x + ptf.w > fireLeft && ptf.x < fireRight &&
                    ptf.y + ptf.h > fireTop  && ptf.y < fireBot) {
                    this._killHero(state, player);
                    return;
                }
            }
        }
    }

    _mossplodderVsFireTile(ecs, level) {
        for (const e of ecs.query('transform', 'enemy')) {
            const en = e.enemy;
            if (en.type !== 'mossplodder' || en.ai === 'dead') continue;
            const tf = e.transform;
            // Sample body band; fire tile sits one row above the surface, so probe
            // both the foot-row and the row above (body straddles the boundary).
            const xs = [tf.x + 6, tf.x + tf.w / 2, tf.x + tf.w - 6];
            const ys = [tf.y + tf.h - 4, tf.y + tf.h * 0.6, tf.y + 4];
            let dead = false;
            for (const py of ys) {
                if (dead) break;
                for (const px of xs) {
                    const c = Math.floor(px / TILE);
                    const r = Math.floor(py / TILE);
                    const t = level.getTile(c, r);
                    if (t && t.isFire) {
                        en.ai = 'dead';
                        en.deathFrames = MOSSPLODDER.deathFrames;
                        dead = true;
                        break;
                    }
                }
            }
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

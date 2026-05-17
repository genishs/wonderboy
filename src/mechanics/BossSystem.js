// owning agent: dev-lead
// TODO: BossSystem v0.75 — Bracken Warden FSM + moss-pulse projectile spawn/tick
// + camera-lock orchestration + boss-death → AREA_CLEARED handoff.
//
// FSM (per docs/briefs/phase3-boss-cast.md §3):
//   idle → windup (45f) → attack (18f; pulse spawns at sub-frame 12)
//   → recover (90f, vulnerable) → idle (60f) → loop
//   any non-dead state + hatchet-hit → hurt (10f pauseTimer) → resume prev state
//   hp == 0 → dead (60f anim) → celebrationTimer (60f) → AREA_CLEARED
//
// Owned by game.js wiring; called every mechanics tick AFTER TriggerSystem
// (so a same-frame BOSS_TRIGGER fires the boss spawn) and BEFORE CombatSystem
// (so first-frame collisions resolve).

import {
    BRACKEN_WARDEN,
    MOSS_PULSE,
    BOSS_ARENA,
    REIGNWARDEN,
    CINDER_VOLLEY,
    EMBER_PIT,
} from '../config/PhaseThreeTunables.js';
import { TILE_TYPES } from '../levels/TileMap.js';

const TILE = 48;

// v1.0 — audio singleton fire-and-forget helper.
const _sfx = (name) => {
    if (typeof globalThis !== 'undefined' && globalThis.audio) {
        globalThis.audio.playSFX(name);
    }
};

export class BossSystem {
    constructor() {
        this._active        = false;        // whether the fight is currently armed
        this._bossEntityId  = null;
        this._arenaLeftPx   = 0;            // updated in beginFight; despawn boundary for moss-pulse
        this._areaManager   = null;
        this._areaIndex     = 0;            // v1.0 — which area's boss (1 = Bracken, 2 = Reignwarden)
    }

    /**
     * Called once when Reed crosses Stage 4's BOSS_TRIGGER tile. Sets state to
     * BOSS_FIGHT, locks the camera, and spawns the boss in idle.
     *
     * v1.0 — area-aware. AreaManager.areaIndex===2 spawns the Reignwarden
     * (Area 2 boss) instead of the Bracken Warden.
     */
    beginFight(ecs, level, areaManager, state) {
        if (this._active) return;
        if (!level || !areaManager) return;
        const arenaCol0 = level.bossArenaCol0;
        if (typeof arenaCol0 !== 'number') return;
        this._active      = true;
        this._areaManager = areaManager;
        this._arenaLeftPx = arenaCol0 * TILE;
        this._areaIndex   = areaManager.areaIndex || 1;

        // Camera lock: viewport left edge aligned to arena col 0.
        areaManager.lockCamera(this._arenaLeftPx);
        state.setGameState('BOSS_FIGHT');
        if (this._areaIndex === 2) {
            this._spawnReignwarden(ecs, level);
        } else {
            this._spawnBoss(ecs, level);
        }
    }

    /**
     * Called by AreaManager._loadStage when a new stage is loaded. Resets any
     * stale boss state — needed when Reed dies in arena and respawns at mile_16
     * (the boss entity should be wiped and the next BOSS_TRIGGER spawn it
     * fresh) or when Continue rebuilds Stage 1.
     */
    resetForStageLoad(_stageIndex) {
        this._active       = false;
        this._bossEntityId = null;
        this._arenaLeftPx  = 0;
        this._areaManager  = null;
        this._areaIndex    = 0;
    }

    /**
     * Per-frame update. Driven from game.js mechanics tick.
     */
    update(ecs, level, state, areaManager) {
        // Reed died in the arena? Drop boss + projectiles, unlock camera.
        if (state.gameState === 'RESPAWNING' && this._active) {
            this._resetForRetry(ecs, areaManager);
            return;
        }
        if (!this._active) return;
        // v0.75 — per boss brief §9: camera unlocks immediately when Reed's
        // dyingFrames begin.
        const heroes = ecs.query('player');
        if (heroes.length && (heroes[0].player.dyingFrames | 0) > 0) {
            if (areaManager && areaManager.cameraLocked) areaManager.unlockCamera();
        }
        if (state.gameState === 'AREA_CLEARED') return;

        this._tickBoss(ecs, state, level);
        this._tickMossPulse(ecs);
        // v1.0 — Reignwarden cinder volley + ember-pit tile TTL tick.
        if (this._areaIndex === 2) {
            this._tickCinderProjectiles(ecs, level);
            this._tickEmberPits(level);
        }
    }

    // ── Internals ───────────────────────────────────────────────────────────

    _spawnBoss(ecs, level) {
        const arenaCol0 = level.bossArenaCol0;
        const floorRow  = level.bossArenaFloorRow ?? 9;
        // Boss sprite is 40×48 art × scale 3 = 120×144 display. Anchor (20,47)
        // = bottom-center on the floor row. Hitbox we expose on the boss
        // component is the chest sigil (a 40×40 px box CombatSystem uses);
        // transform is the full sprite footprint so hero-body contact reads
        // against the whole silhouette.
        const w = BRACKEN_WARDEN.bodyWidthPx;
        const h = BRACKEN_WARDEN.bodyHeightPx;
        // Place the boss with feet on floorRow*TILE at arena col 9 (relCol).
        const bossCol = arenaCol0 + (BOSS_ARENA.bossSpawnRelCol - BOSS_ARENA.triggerRelCol);
        // bossSpawnRelCol is global Round-4-4-relative; triggerRelCol is also
        // round-relative so the diff gives the in-arena col index. arenaCol0 in
        // global cols (round-4-4 col 32 == arenaCol0 since round-4-4 starts at
        // the global col where col 32 of round-4-4 maps). For our concat the
        // boss_trigger tile sits at relCol=32 of round-4-4 → arenaCol0 = same
        // global col → so in-arena col index = 9 → boss at arenaCol0 + 9.
        const bossX = bossCol * TILE + (TILE - w);   // align right edge near col 11
        // v0.75.1 — spawn-Y bug fix. Previous formula was `floorRow * TILE - h
        // + TILE` (= (floorRow+1)*TILE - h), which placed the boss's feet at
        // row 10's TOP edge — one full tile BELOW the arena floor surface
        // (which is row 9's top edge at floorRow * TILE). User report: "boss
        // spawns embedded in the ground." Correct formula: feet flush on the
        // floor row's TOP edge → tf.y + tf.h = floorRow * TILE → tf.y =
        // floorRow * TILE - h.
        //
        // Renderer math check: drawY = floor(tf.y + tf.h - (anchor.y + 1) *
        // scale). With anchor.y=47, scale=3, tf.h=144 → drawY = tf.y + 144 -
        // 144 = tf.y. The sprite's 144 px stretch from tf.y to tf.y + 144,
        // putting its bottom row (anchor y=47 → sprite row 47, the floor row
        // of the sprite cell-grid) exactly at the floorRow boundary.
        const bossY = floorRow * TILE - h;

        const id = ecs.createEntity();
        ecs.addComponent(id, 'transform', { x: bossX, y: bossY, w, h });
        ecs.addComponent(id, 'velocity',  { vx: 0, vy: 0 });
        ecs.addComponent(id, 'boss', {
            area:        1,
            ai:          'idle',
            hp:          BRACKEN_WARDEN.hpMax,
            maxHp:       BRACKEN_WARDEN.hpMax,
            timer:       BRACKEN_WARDEN.idleFrames,   // initial pre-fight hold;
                                                      // first cycle starts immediately
            pauseTimer:  0,
            prevAi:      'idle',
            facingLeft:  true,
            celebrationTimer: 0,
            _attackSubFrame: 0,
        });
        ecs.addComponent(id, 'sprite', {
            name: 'bracken-warden', anim: 'idle', frame: 0, scale: 3, flip: false,
        });
        this._bossEntityId = id;
    }

    _tickBoss(ecs, state, level) {
        const bosses = ecs.query('transform', 'boss', 'sprite');
        if (!bosses.length) return;
        const b = bosses[0];
        const boss = b.boss;
        const sp   = b.sprite;
        // v1.0 — boss config dispatched by area. Reignwarden = Area 2, else
        // Bracken Warden = Area 1. Both share the same FSM beat names + timers.
        const cfg = (boss.area === 2) ? REIGNWARDEN : BRACKEN_WARDEN;

        if (boss.pauseTimer > 0) {
            boss.pauseTimer--;
            if (boss.pauseTimer === 0) {
                if (boss.hp <= 0) {
                    this._enterState(boss, sp, 'dead', true, cfg);
                } else {
                    this._enterState(boss, sp, boss.prevAi || 'idle', /*resetTimer=*/false, cfg);
                }
            }
            return;
        }

        if (boss.ai === 'dead') {
            if (boss.timer > 0) {
                boss.timer--;
                if (boss.timer === 0 && boss.celebrationTimer === 0) {
                    boss.celebrationTimer = cfg.celebrationFrames;
                }
            } else if (boss.celebrationTimer > 0) {
                boss.celebrationTimer--;
                if (boss.celebrationTimer === 0) {
                    state.setGameState('AREA_CLEARED');
                    if (this._areaManager) this._areaManager.beginAreaCleared();
                }
            }
            return;
        }

        // Attack sub-frame tracking — pulse / volley spawns on the configured frame.
        if (boss.ai === 'attack') {
            boss._attackSubFrame++;
            if (boss._attackSubFrame === cfg.attackSpawnFrame) {
                const bossTf = b.transform;
                if (boss.area === 2) {
                    // Reignwarden: spawn the 3-cinder volley.
                    this._spawnCinderVolley(ecs, bossTf, level);
                } else {
                    // Bracken Warden: spawn moss-pulse.
                    this._spawnMossPulse(
                        ecs,
                        bossTf.x + MOSS_PULSE.spawnOffsetX,
                        bossTf.y + bossTf.h + MOSS_PULSE.spawnOffsetY,
                    );
                }
                _sfx('boss_attack_thud');
            }
        }

        boss.timer--;
        if (boss.timer > 0) return;

        switch (boss.ai) {
            case 'idle':    this._enterState(boss, sp, 'windup', true, cfg);  return;
            case 'windup':  this._enterState(boss, sp, 'attack', true, cfg);  return;
            case 'attack':  this._enterState(boss, sp, 'recover', true, cfg); return;
            case 'recover': this._enterState(boss, sp, 'idle',    true, cfg); return;
            default:        this._enterState(boss, sp, 'idle',    true, cfg);
        }
    }

    _enterState(boss, sp, next, resetTimer = true, cfg = BRACKEN_WARDEN) {
        boss.ai = next;
        sp.anim = next;
        sp._lastAnim = null;
        if (resetTimer) {
            boss._attackSubFrame = 0;
            const timerMap = {
                idle:    cfg.idleFrames,
                windup:  cfg.windupFrames,
                attack:  cfg.attackFrames,
                recover: cfg.recoverFrames,
                dead:    cfg.deathFrames,
            };
            boss.timer = timerMap[next] || 0;
            if (next === 'windup') _sfx('boss_windup');
            else if (next === 'dead') _sfx('boss_defeat');
        }
    }

    _spawnMossPulse(ecs, x, y) {
        const w = MOSS_PULSE.widthPx;
        const h = MOSS_PULSE.heightPx;
        const id = ecs.createEntity();
        ecs.addComponent(id, 'transform', { x: x - w / 2, y, w, h });
        ecs.addComponent(id, 'velocity',  { vx: MOSS_PULSE.vx, vy: 0 });
        ecs.addComponent(id, 'projectile', {
            type:       'moss-pulse',
            ownerKind:  'boss',
            framesLeft: MOSS_PULSE.lifetimeFrames,
            damage:     'kill',
        });
        ecs.addComponent(id, 'sprite', {
            name: 'moss-pulse', anim: 'travel', frame: 0, scale: 2, flip: false,
        });
        return id;
    }

    _tickMossPulse(ecs) {
        const arenaLeft = this._arenaLeftPx;
        for (const p of ecs.query('transform', 'velocity', 'projectile')) {
            if (p.projectile.type !== 'moss-pulse') continue;
            p.transform.x += p.velocity.vx;
            p.projectile.framesLeft--;
            if (p.projectile.framesLeft <= 0) { ecs.destroyEntity(p.id); continue; }
            if (p.transform.x + p.transform.w < arenaLeft) {
                ecs.destroyEntity(p.id);
                continue;
            }
        }
    }

    _resetForRetry(ecs, areaManager) {
        // Reed died inside the arena. Wipe boss + projectiles, unlock camera.
        if (this._bossEntityId != null) {
            ecs.destroyEntity(this._bossEntityId);
            this._bossEntityId = null;
        }
        for (const p of ecs.query('transform', 'velocity', 'projectile')) {
            const t = p.projectile.type;
            if (t === 'moss-pulse' || t === 'cinder') ecs.destroyEntity(p.id);
        }
        // v1.0 — clean up any active ember-pit hazards in the level grid so the
        // respawning hero doesn't walk into a leftover pit. The pit tiles are
        // stamped FIRE_LOW with `_emberPitTtl` on them; we sweep one row above
        // the boss arena floor and clear any tile with that marker.
        if (areaManager && this._areaIndex === 2) {
            const level = areaManager.lm?.currentLevel;
            if (level) {
                const floorRow = (level.bossArenaFloorRow ?? 8) - 1;
                for (let c = 0; c < level.cols; c++) {
                    const t = level.getTile(c, floorRow);
                    if (t && typeof t._emberPitTtl === 'number') {
                        level.setTile(c, floorRow, TILE_TYPES.EMPTY);
                    }
                }
            }
        }
        if (areaManager) areaManager.unlockCamera();
        this._active = false;
    }

    // Helper for CombatSystem — returns the chest-sigil hitbox of the active boss
    // (or null if no boss). Lives here so CombatSystem doesn't need to know the
    // BRACKEN_WARDEN offsets directly.
    getBossHitbox(b) {
        if (!b || !b.transform) return null;
        return {
            x: b.transform.x + BRACKEN_WARDEN.hitboxOffsetX,
            y: b.transform.y + BRACKEN_WARDEN.hitboxOffsetY,
            w: BRACKEN_WARDEN.hitboxWidth,
            h: BRACKEN_WARDEN.hitboxHeight,
        };
    }

    // ── Area 2 — Reignwarden + cinder volley + ember pits ──────────────────

    _spawnReignwarden(ecs, level) {
        const arenaCol0 = level.bossArenaCol0;
        const floorRow  = level.bossArenaFloorRow ?? 8;
        const w = REIGNWARDEN.bodyWidthPx;
        const h = REIGNWARDEN.bodyHeightPx;
        // Reignwarden stands on a 2-tile pedestal at the right side of the
        // arena. arenaCol1 = arenaCol0 + 11 (right wall). Pedestal sits at
        // arenaCol1 - 2 (so the boss body is 3 tiles wide and clears the wall).
        const bossCol = (level.bossArenaCol1 ?? (arenaCol0 + 11)) - 3;
        const bossX = bossCol * TILE;
        // Body height includes pedestal (5 tiles). bossY puts the pedestal's
        // base on the arena floor row.
        const bossY = floorRow * TILE - h;

        const id = ecs.createEntity();
        ecs.addComponent(id, 'transform', { x: bossX, y: bossY, w, h });
        ecs.addComponent(id, 'velocity',  { vx: 0, vy: 0 });
        ecs.addComponent(id, 'boss', {
            area:        2,
            ai:          'idle',
            hp:          REIGNWARDEN.hpMax,
            maxHp:       REIGNWARDEN.hpMax,
            timer:       REIGNWARDEN.idleFrames,
            pauseTimer:  0,
            prevAi:      'idle',
            facingLeft:  true,
            celebrationTimer: 0,
            _attackSubFrame: 0,
        });
        ecs.addComponent(id, 'sprite', {
            name: 'reignwarden', anim: 'idle', frame: 0, scale: 1, flip: false,
        });
        this._bossEntityId = id;
    }

    _spawnCinderVolley(ecs, bossTf, level) {
        // 3 cinders at the palm-position (CINDER_VOLLEY.spawnOffsetX/Y from
        // boss tf top-left). Each has a distinct [vx, vy] so the volley fans out.
        const palmX = bossTf.x + CINDER_VOLLEY.spawnOffsetX;
        const palmY = bossTf.y + CINDER_VOLLEY.spawnOffsetY;
        const w = CINDER_VOLLEY.widthPx;
        const h = CINDER_VOLLEY.heightPx;
        const volleys = [
            { vx: CINDER_VOLLEY.cinder1Vx, vy: CINDER_VOLLEY.cinder1Vy },
            { vx: CINDER_VOLLEY.cinder2Vx, vy: CINDER_VOLLEY.cinder2Vy },
            { vx: CINDER_VOLLEY.cinder3Vx, vy: CINDER_VOLLEY.cinder3Vy },
        ];
        for (const vk of volleys) {
            const id = ecs.createEntity();
            ecs.addComponent(id, 'transform', { x: palmX, y: palmY, w, h });
            ecs.addComponent(id, 'velocity',  { vx: vk.vx, vy: vk.vy });
            ecs.addComponent(id, 'projectile', {
                type:       'cinder',
                ownerKind:  'boss',
                framesLeft: CINDER_VOLLEY.lifetimeFrames,
                damage:     'kill',
            });
            ecs.addComponent(id, 'sprite', {
                name: 'cinder', anim: 'flight', frame: 0, scale: 2,
                flip: false, color: '#cc6464',
            });
        }
        void level;
    }

    _tickCinderProjectiles(ecs, level) {
        const arenaLeft  = this._arenaLeftPx;
        const arenaRight = arenaLeft + (12 * TILE);
        const floorPx    = (level.bossArenaFloorRow ?? 8) * TILE;
        for (const p of ecs.query('transform', 'velocity', 'projectile')) {
            if (p.projectile.type !== 'cinder') continue;
            // Ballistic motion: vy gets pulled down by gravity each frame.
            p.velocity.vy += CINDER_VOLLEY.gravity;
            p.transform.x += p.velocity.vx;
            p.transform.y += p.velocity.vy;
            p.projectile.framesLeft--;
            if (p.projectile.framesLeft <= 0) { ecs.destroyEntity(p.id); continue; }
            if (p.transform.x + p.transform.w < arenaLeft
                || p.transform.x > arenaRight) {
                ecs.destroyEntity(p.id);
                continue;
            }
            // Floor contact: spawn ember-pit hazard tile at the cinder's column,
            // then despawn the projectile.
            if (p.transform.y + p.transform.h >= floorPx) {
                const col = Math.floor((p.transform.x + p.transform.w / 2) / TILE);
                const row = Math.floor(floorPx / TILE) - 1;   // one row above floor
                this._spawnEmberPit(level, col, row);
                ecs.destroyEntity(p.id);
            }
        }
    }

    _spawnEmberPit(level, col, row) {
        if (!level || col < 0 || col >= level.cols || row < 0 || row >= level.rows) return;
        // Use FIRE_LOW as the underlying tile-type (isFatal=true is what kills hero).
        // Stamp a TTL on the tile object so _tickEmberPits can remove it after expiry.
        level.setTile(col, row, TILE_TYPES.FIRE_LOW);
        const tile = level.getTile(col, row);
        if (tile) tile._emberPitTtl = EMBER_PIT.ttlFrames;
        _sfx('ember_pit_form');
    }

    _tickEmberPits(level) {
        if (!level) return;
        // Walk the recently-modified tiles. We don't store them in a list, so
        // we scan a small window around the arena. Cheap because the arena is
        // only 12 cols × 1 row of ember-pits at a time.
        const floorRow = (level.bossArenaFloorRow ?? 8) - 1;
        for (let c = 0; c < level.cols; c++) {
            const t = level.getTile(c, floorRow);
            if (!t || typeof t._emberPitTtl !== 'number') continue;
            t._emberPitTtl--;
            if (t._emberPitTtl <= 0) {
                level.setTile(c, floorRow, TILE_TYPES.EMPTY);
            }
        }
    }
}

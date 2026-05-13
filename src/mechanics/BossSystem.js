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
} from '../config/PhaseThreeTunables.js';

const TILE = 48;

export class BossSystem {
    constructor() {
        this._active        = false;        // whether the fight is currently armed
        this._bossEntityId  = null;
        this._arenaLeftPx   = 0;            // updated in beginFight; despawn boundary for moss-pulse
        this._areaManager   = null;
    }

    /**
     * Called once when Reed crosses Stage 4's BOSS_TRIGGER tile. Sets state to
     * BOSS_FIGHT, locks the camera, and spawns the Bracken Warden in idle
     * (pre-fight hold).
     */
    beginFight(ecs, level, areaManager, state) {
        if (this._active) return;
        if (!level || !areaManager) return;
        const arenaCol0 = level.bossArenaCol0;
        if (typeof arenaCol0 !== 'number') return;   // not Stage 4
        this._active      = true;
        this._areaManager = areaManager;
        this._arenaLeftPx = arenaCol0 * TILE;

        // Camera lock: viewport left edge aligned to arena col 0.
        areaManager.lockCamera(this._arenaLeftPx);
        state.setGameState('BOSS_FIGHT');
        this._spawnBoss(ecs, level);
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
        // dyingFrames begin. Check the hero entity and unlock here so the
        // death anim plays in normal-scroll context.
        const heroes = ecs.query('player');
        if (heroes.length && (heroes[0].player.dyingFrames | 0) > 0) {
            if (areaManager && areaManager.cameraLocked) areaManager.unlockCamera();
        }
        if (state.gameState === 'AREA_CLEARED') return;

        this._tickBoss(ecs, state);
        this._tickMossPulse(ecs);
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

    _tickBoss(ecs, state) {
        const bosses = ecs.query('transform', 'boss', 'sprite');
        if (!bosses.length) return;
        const b = bosses[0];
        const boss = b.boss;
        const sp   = b.sprite;

        // Hurt overlay pauses every other timer.
        if (boss.pauseTimer > 0) {
            boss.pauseTimer--;
            if (boss.pauseTimer === 0) {
                if (boss.hp <= 0) {
                    this._enterState(boss, sp, 'dead');
                } else {
                    // Resume the prior FSM state WITHOUT resetting its timer —
                    // hurt is a pause, not a state reset. Per plan §6 pseudocode.
                    this._enterState(boss, sp, boss.prevAi || 'idle', /*resetTimer=*/false);
                }
            }
            return;
        }

        // Dead state — tick deathFrames then celebrationFrames then fire AREA_CLEARED.
        if (boss.ai === 'dead') {
            if (boss.timer > 0) {
                boss.timer--;
                if (boss.timer === 0 && boss.celebrationTimer === 0) {
                    boss.celebrationTimer = BRACKEN_WARDEN.celebrationFrames;
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

        // Attack sub-frame tracking — moss-pulse spawns on attackSpawnFrame.
        if (boss.ai === 'attack') {
            boss._attackSubFrame++;
            if (boss._attackSubFrame === BRACKEN_WARDEN.attackSpawnFrame) {
                const bossTf = b.transform;
                this._spawnMossPulse(
                    ecs,
                    bossTf.x + MOSS_PULSE.spawnOffsetX,
                    bossTf.y + bossTf.h + MOSS_PULSE.spawnOffsetY,
                );
            }
        }

        boss.timer--;
        if (boss.timer > 0) return;

        switch (boss.ai) {
            case 'idle':    this._enterState(boss, sp, 'windup');  return;
            case 'windup':  this._enterState(boss, sp, 'attack');  return;
            case 'attack':  this._enterState(boss, sp, 'recover'); return;
            case 'recover': this._enterState(boss, sp, 'idle');    return;
            default:        this._enterState(boss, sp, 'idle');
        }
    }

    _enterState(boss, sp, next, resetTimer = true) {
        boss.ai = next;
        sp.anim = next;
        sp._lastAnim = null;   // force renderer anim restart
        if (resetTimer) {
            boss._attackSubFrame = 0;
            const timerMap = {
                idle:    BRACKEN_WARDEN.idleFrames,
                windup:  BRACKEN_WARDEN.windupFrames,
                attack:  BRACKEN_WARDEN.attackFrames,
                recover: BRACKEN_WARDEN.recoverFrames,
                dead:    BRACKEN_WARDEN.deathFrames,
            };
            boss.timer = timerMap[next] || 0;
        }
        // For hurt-resume (resetTimer=false), boss.timer + _attackSubFrame keep
        // their pre-hurt values so the FSM beat stays predictable.
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
        // Reed died inside the arena. Wipe boss + moss-pulse projectiles, unlock
        // the camera so the death anim plays in normal scroll context. The
        // BOSS_TRIGGER tile is reset by StageManager._handleRespawn so re-crossing
        // it on respawn re-spawns the boss.
        if (this._bossEntityId != null) {
            ecs.destroyEntity(this._bossEntityId);
            this._bossEntityId = null;
        }
        for (const p of ecs.query('transform', 'velocity', 'projectile')) {
            if (p.projectile.type === 'moss-pulse') ecs.destroyEntity(p.id);
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
}

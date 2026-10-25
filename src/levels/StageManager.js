// owning agent: dev-lead
// TODO: StageManager v0.75 — DEMOTED to single-stage lifecycle. v0.50.1's
// area-wide concerns (lives reset, vitality refill, full-area Continue) live
// in AreaManager now. StageManager keeps:
//   - per-stage round overlay (mile-marker "Round N" bilingual title)
//   - per-stage lastCheckpointCol (resets on stage entry per area brief §2)
//   - per-stage roundIndex (derived from mile-markers passed)
//   - RESPAWNING handler (mid-stage respawn at the latest checkpoint with
//     pl.armed preserved). On `_stageRestartPending`, AreaManager observes
//     `_areaRestartPending` FIRST and triggers a full Area reset; if only the
//     stage-restart flag is set (legacy v0.50.x path), StageManager rebuilds
//     this stage from scratch.
//
// The v0.50.x `startArea` + `loadStage` entry points are removed — AreaManager
// builds the TileMap and calls `attachToStage(stageIndex, level, ecs, state,
// armed)` to hand it off.

import { initEnemyP2 } from '../mechanics/Phase2EnemyAI.js';
import { HUMMERWING, MOSSPLODDER, EGG } from '../config/PhaseTwoTunables.js';
import { THREADSHADE, CINDERWISP, QUARRYWIGHT, SKYHOOK }
    from '../config/PhaseThreeTunables.js';

const TILE = 48;

// v0.50.1 — Mile-marker overlay timing. 90 frames @ 60 fps = 1.5 s.
const OVERLAY_TOTAL = 90;

export class StageManager {
    /**
     * @param {object} levelManager  back-pointer for setting `currentLevel`/`scrollX`/`playerEntity`.
     */
    constructor(levelManager) {
        this.lm = levelManager;
        this.areaIndex      = 0;
        this.stageIndex     = 0;
        this.roundIndex     = 1;          // 1..4 once started
        this.stageCleared   = false;

        // Lives / checkpoint (per-stage, reset on stage entry per Phase 3 brief).
        this.lastCheckpointCol = 0;

        // Mile-marker overlay state — read by Renderer.drawHUD overlay path.
        this.overlay = {
            active: false,
            kind:   null,        // 'round_1_1' .. 'round_1_4' (Stage-N is implicit via stageIndex)
            frames: 0,
        };

        // Legacy v0.50 fields kept for renderer back-compat.
        this.transitioning  = false;
        this.transitionTimer = 0;
        this.transitionPhase = null;
    }

    /**
     * v0.75 — attach to a pre-built TileMap for a specific stage. AreaManager
     * builds the level (so it can also wire tileCache.setActiveStage etc); we
     * only handle the within-stage concerns (spawn hero + entities, reset overlay).
     *
     * @param {number} stageIndex
     * @param {TileMap} level
     * @param {ECS} ecs
     * @param {StateManager} state
     * @param {boolean} armed   carry pl.armed across stage transition
     */
    attachToStage(stageIndex, level, ecs, state, armed) {
        this.areaIndex     = 1;
        this.stageIndex    = stageIndex;
        this.roundIndex    = 1;
        this.stageCleared  = false;
        this.lastCheckpointCol = 0;
        this.overlay = { active: false, kind: null, frames: 0 };

        this.lm.currentLevel = level;
        this.lm.scrollX      = 0;

        // Spawn hero at stage spawn with the carried armed bit.
        this._spawnHero(ecs, level, level.spawn.col, level.spawn.row, !!armed);

        // Spawn round entities (mossplodders / hummerwings / dawn-husks).
        for (const e of level.entities ?? []) {
            this._spawnRoundEntity(ecs, e, level);
        }
    }

    /**
     * v0.50.1 — Mile-marker overlay. Called by TriggerSystem on contact. The
     * marker also acts as a checkpoint anchor AND advances the Round HUD chip.
     *
     * v0.75 — markers (`mile_1..mile_4`) live inside EACH stage and announce
     * Round 1..4 of the current stage. Overlay text reads "Round N" via the
     * generic `round_N` key (Renderer maps to bilingual labels).
     */
    fireRoundMarkerOverlay(markerKind, col, state) {
        if (this.overlay.active && this.overlay.kind === markerKind) return;
        const round = (markerKind === 'mile_1') ? 1
                    : (markerKind === 'mile_2') ? 2
                    : (markerKind === 'mile_3') ? 3
                    : (markerKind === 'mile_4') ? 4
                    : this.roundIndex;
        this.roundIndex = round;
        this.lastCheckpointCol = col + 1;

        this.overlay = {
            active: true,
            kind:   `round_${round}`,
            frames: OVERLAY_TOTAL,
        };

        state.hunger = state.maxHunger;
    }

    /**
     * Cairn at end of round 4 (Stage 1's terminal beat pre-v0.75). v0.75 keeps
     * this as a back-compat code path; the only stage that fires it now is
     * Stage 4's cairn tile (if any future round-data places one). For v0.75
     * the boss arena drives Area-Cleared; no cairn is placed in level data.
     */
    clearStage(_ecs, state) {
        if (this.stageCleared) return;
        this.stageCleared = true;
        state.setGameState('STAGE_CLEAR');
    }

    update(_dt, ecs, state) {
        // Drive the overlay timer.
        if (this.overlay.active) {
            this.overlay.frames--;
            if (this.overlay.frames <= 0) {
                this.overlay.active = false;
                this.overlay.kind   = null;
                this.overlay.frames = 0;
            }
        }

        // RESPAWNING handler. _areaRestartPending is observed by AreaManager
        // BEFORE this runs (full-Area reset on Continue). If we get here it's
        // either a mid-stage respawn or a legacy `_stageRestartPending`.
        if (state.gameState === 'RESPAWNING') {
            this._handleRespawn(ecs, state);
        }
    }

    _handleRespawn(ecs, state) {
        const level = this.lm.currentLevel;
        if (!level) return;

        const stageRestart = !!state._stageRestartPending;
        if (stageRestart) {
            // Legacy v0.50.2 path — wipe & rebuild THIS stage. v0.75's Continue
            // path normally routes through AreaManager (full-Area reset); this
            // branch is preserved for any code path that sets only the stage flag.
            state._stageRestartPending = false;
            this.lastCheckpointCol = 0;
            this.roundIndex = 1;
            this.stageCleared = false;
            this.overlay = { active: false, kind: null, frames: 0 };
            // Wipe ALL entities, respawn fresh.
            const allRows = ecs.query();
            for (const row of allRows) ecs.destroyEntity(row.id);
            this._spawnHero(ecs, level, level.spawn.col, level.spawn.row, /*armed*/ false);
            for (const e of level.entities ?? []) {
                this._spawnRoundEntity(ecs, e, level);
            }
            state.setGameState('PLAYING');
            return;
        }

        // Mid-stage respawn: keep entity layout, reposition the existing hero.
        const players = ecs.query('transform', 'velocity', 'player');
        if (!players.length) {
            this._spawnHero(ecs, level, level.spawn.col, level.spawn.row, false);
        } else {
            const p = players[0];
            const tf = p.transform;
            const v  = p.velocity;
            const pl = p.player;
            const col = this.lastCheckpointCol > 0 ? this.lastCheckpointCol : level.spawn.col;
            const row = level.spawn.row;
            tf.x = col * TILE + (TILE - tf.w) / 2;
            tf.y = row * TILE - tf.h;
            v.vx = 0;
            v.vy = 0;
            pl.aiState = 'idle';
            pl.attackCooldown = 0;
            pl.attackOverlayFrames = 0;
            pl.facingRight = true;
            pl.coyoteTimer = 0;
            pl.jumpBuffer = 0;
            pl.stumbleFrames = 0;
            pl.stumbleCooldown = 0;
            pl.dyingFrames = 0;
            // pl.armed PRESERVED.
        }
        state.hunger = state.maxHunger;
        // v0.75 — reset BOSS_TRIGGER's _consumed so re-crossing it re-locks the
        // camera + re-spawns the boss. Other consumed triggers (mile-markers)
        // stay consumed so they don't re-fire on respawn.
        if (this.stageIndex === 4) {
            for (let r = 0; r < level.rows; r++) {
                for (let c = 0; c < level.cols; c++) {
                    const t = level.getTile(c, r);
                    if (t && t.triggerKind === 'boss_trigger') {
                        t._consumed = false;
                    }
                }
            }
        }
        state.setGameState('PLAYING');
    }

    // ── internal ─────────────────────────────────────────────────────────
    _spawnHero(ecs, level, col, row, armed) {
        const pw = 30, ph = 66;
        const px = col * TILE + (TILE - pw) / 2;
        const py = row * TILE - ph;
        const player = ecs.createEntity();
        ecs.addComponent(player, 'transform',  { x: px, y: py, w: pw, h: ph });
        ecs.addComponent(player, 'velocity',   { vx: 0, vy: 0 });
        ecs.addComponent(player, 'physics',    { onGround: false, onIce: false, jumpHoldLeft: 0 });
        ecs.addComponent(player, 'player',     {
            facingRight: true,
            isJumping: false,
            attackCooldown: 0,
            attackOverlayFrames: 0,
            coyoteTimer: 0,
            jumpBuffer: 0,
            aiState: 'idle',
            armed: !!armed,
            stumbleFrames: 0,
            stumbleCooldown: 0,
            dyingFrames: 0,
            _phase1: true,
            _phase2: true,
        });
        // v0.75.1 — hero scale 3 → 2. The 24x36 sprite at scale 3 (72x108 px)
        // visually overflowed Reed's 30x66 hitbox + the world's 48px tile grid;
        // dropping to scale 2 (48x72 px) brings the silhouette back in line
        // with the hatchet-spawn position and the tile world. Anchor (12,35)
        // at scale 2 → drawY = tf.y + 66 - 72 = tf.y - 6, so the sprite still
        // renders with feet flush at tf.y + tf.h (the hitbox bottom). No
        // anchor nudge needed.
        ecs.addComponent(player, 'sprite', {
            name: 'hero', anim: 'idle', frame: 0, scale: 2, flip: false, color: '#4a7c3a',
        });
        this.lm.playerEntity = player;
    }

    _spawnRoundEntity(ecs, e, level) {
        if (e.kind === 'mossplodder') this._spawnMossplodder(ecs, e, level);
        else if (e.kind === 'hummerwing') this._spawnHummerwing(ecs, e, level);
        else if (e.kind === 'dawn-husk')  this._spawnDawnHusk(ecs, e, level);
        // v0.75.1 — Threadshade (vertical-only spider).
        else if (e.kind === 'threadshade') this._spawnThreadshade(ecs, e, level);
        // v0.75.1 — fruit pickups (dewplum / amberfig).
        else if (e.kind === 'dewplum' || e.kind === 'amberfig') {
            this._spawnFruit(ecs, e, level);
        }
        // v1.0 — Area 2 enemies + new pickups.
        else if (e.kind === 'cinderwisp')  this._spawnCinderwisp(ecs, e, level);
        else if (e.kind === 'quarrywight') this._spawnQuarrywight(ecs, e, level);
        else if (e.kind === 'skyhook')     this._spawnSkyhook(ecs, e, level);
        else if (e.kind === 'sunpear')     this._spawnFruit(ecs, e, level);
        else if (e.kind === 'flintchip')   this._spawnFlintchip(ecs, e, level);
    }

    _spawnMossplodder(ecs, def, level) {
        const w = MOSSPLODDER.hitboxW, h = MOSSPLODDER.hitboxH;
        const x = def.col * TILE + (TILE - w) / 2;
        const y = def.row * TILE - h;
        const id = ecs.createEntity();
        ecs.addComponent(id, 'transform', { x, y, w, h });
        ecs.addComponent(id, 'velocity',  { vx: 0, vy: 0 });
        ecs.addComponent(id, 'physics',   { onGround: false, onIce: false, jumpHoldLeft: 0 });
        ecs.addComponent(id, 'enemy',     initEnemyP2('mossplodder', def.dir ?? -1));
        ecs.addComponent(id, 'sprite',    {
            name: 'mossplodder', anim: 'walk', frame: 0, scale: 3,
            flip: (def.dir ?? -1) > 0,
            color: '#6a8030',
        });
    }

    _spawnHummerwing(ecs, def, level) {
        const w = HUMMERWING.hitboxW, h = HUMMERWING.hitboxH;
        const floorY = def.row * TILE;
        const baseY  = floorY + HUMMERWING.driftAltitudeOffset;
        const x = def.col * TILE + (TILE - w) / 2;
        const y = baseY - h / 2;
        const id = ecs.createEntity();
        ecs.addComponent(id, 'transform', { x, y, w, h });
        ecs.addComponent(id, 'velocity',  { vx: 0, vy: 0 });
        ecs.addComponent(id, 'physics',   { onGround: false, onIce: false, jumpHoldLeft: 0 });
        ecs.addComponent(id, 'enemy',     initEnemyP2('hummerwing', def.dir ?? -1, baseY));
        ecs.addComponent(id, 'sprite',    {
            name: 'hummerwing', anim: 'drift', frame: 0, scale: 3,
            flip: (def.dir ?? -1) > 0,
            color: '#e8a040',
        });
    }

    _spawnDawnHusk(ecs, def, level) {
        const w = EGG.hitboxW, h = EGG.hitboxH;
        const x = def.col * TILE + (TILE - w) / 2;
        const y = def.row * TILE - h;
        const id = ecs.createEntity();
        ecs.addComponent(id, 'transform', { x, y, w, h });
        ecs.addComponent(id, 'pickup',    { type: 'dawn-husk', state: 'rest', stateTimer: 0 });
        ecs.addComponent(id, 'sprite',    {
            name: 'dawn-husk', anim: 'rest', frame: 0, scale: 3, flip: false, color: '#e8d4a0',
        });
    }

    /**
     * v0.75.1 — Threadshade spawn. Per story brief §16.6/§16.8: the entity
     * hangs at a fixed x-column with sine vertical bob around baseY centered
     * on the spec'd row. We anchor `baseY` at the spawn row's TOP edge so the
     * 3-tile amplitude swings into (row-1.5 .. row+1.5) — Reed jumping below
     * meets the bottom of the swing.
     */
    _spawnThreadshade(ecs, def, level) {
        const w = THREADSHADE.hitboxW, h = THREADSHADE.hitboxH;
        // baseY = the spec'd row's top edge; the body sine-bobs ±amplitude*TILE
        // around it. (row + 1.5)*TILE would put the midline at row+1.5 — but
        // story brief §16.2 says "yMin = row*TILE, yMax = (row+3)*TILE", so
        // the midpoint is (row + 1.5)*TILE and our sine amplitude is 1.5 tiles.
        const baseY = (def.row + 1.5) * TILE - h / 2;
        const x = def.col * TILE + (TILE - w) / 2;
        const id = ecs.createEntity();
        ecs.addComponent(id, 'transform', { x, y: baseY, w, h });
        ecs.addComponent(id, 'velocity',  { vx: 0, vy: 0 });
        // No `physics` component — Threadshades don't collide with terrain;
        // their motion is hand-driven by Phase2EnemyAI._tickThreadshade.
        ecs.addComponent(id, 'enemy',     initEnemyP2('threadshade', 0, baseY));
        ecs.addComponent(id, 'sprite',    {
            name: 'threadshade', anim: 'drift', frame: 0, scale: 2,
            flip: false, color: '#5a4a6e',
        });
    }

    /**
     * v0.75.1 — fruit pickup spawn (dewplum / amberfig).
     * v1.0 — extended to handle Area 2's sunpear (same shape as amberfig).
     */
    _spawnFruit(ecs, def, level) {
        const w = 24, h = 24;
        const x = def.col * TILE + (TILE - w) / 2;
        const y = def.row * TILE - h;
        const id = ecs.createEntity();
        ecs.addComponent(id, 'transform', { x, y, w, h });
        ecs.addComponent(id, 'pickup',    { type: def.kind, state: 'idle', stateTimer: 0 });
        const color = (def.kind === 'amberfig') ? '#e8a040'
                    : (def.kind === 'sunpear')  ? '#f8d878'
                    : '#3a586a';
        ecs.addComponent(id, 'sprite',    {
            name: def.kind, anim: 'idle', frame: 0, scale: 2,
            flip: false, color,
        });
    }

    /**
     * v1.0 — Flintchip pickup. Transient buff (10 sec, 3-hatchet on-screen cap).
     * Visual hitbox slightly taller than wide (matches the 24×36 sprite spec).
     */
    _spawnFlintchip(ecs, def, level) {
        const w = 24, h = 36;
        const x = def.col * TILE + (TILE - w) / 2;
        const y = def.row * TILE - h;
        const id = ecs.createEntity();
        ecs.addComponent(id, 'transform', { x, y, w, h });
        ecs.addComponent(id, 'pickup',    { type: 'flintchip', state: 'idle', stateTimer: 0 });
        ecs.addComponent(id, 'sprite',    {
            name: 'flintchip', anim: 'idle', frame: 0, scale: 2,
            flip: false, color: '#f8d878',
        });
    }

    /**
     * v1.0 — Cinderwisp spawn (Area 2 windborne drifter). Drift midline is at
     * the spec'd row. The bob amplitude swings ±8 px around baseY.
     */
    _spawnCinderwisp(ecs, def, level) {
        const w = CINDERWISP.hitboxW, h = CINDERWISP.hitboxH;
        const x = def.col * TILE + (TILE - w) / 2;
        const baseY = def.row * TILE + (TILE - h) / 2;
        const id = ecs.createEntity();
        ecs.addComponent(id, 'transform', { x, y: baseY, w, h });
        ecs.addComponent(id, 'velocity',  { vx: 0, vy: 0 });
        // No `physics` — Cinderwisps don't collide; pure hand-driven motion.
        ecs.addComponent(id, 'enemy',     initEnemyP2('cinderwisp', def.dir ?? -1, baseY));
        ecs.addComponent(id, 'sprite',    {
            name: 'cinderwisp', anim: 'drift', frame: 0, scale: 2,
            flip: false, color: '#f49494',
        });
    }

    /**
     * v1.0 — Quarrywight spawn (Area 2 armored walker).
     */
    _spawnQuarrywight(ecs, def, level) {
        const w = QUARRYWIGHT.hitboxW, h = QUARRYWIGHT.hitboxH;
        const x = def.col * TILE + (TILE - w) / 2;
        const y = def.row * TILE - h;
        const id = ecs.createEntity();
        ecs.addComponent(id, 'transform', { x, y, w, h });
        ecs.addComponent(id, 'velocity',  { vx: 0, vy: 0 });
        ecs.addComponent(id, 'physics',   { onGround: false, onIce: false, jumpHoldLeft: 0 });
        ecs.addComponent(id, 'enemy',     initEnemyP2('quarrywight', def.dir ?? -1));
        ecs.addComponent(id, 'sprite',    {
            name: 'quarrywight', anim: 'walk_armored', frame: 0, scale: 2,
            flip: (def.dir ?? -1) > 0, color: '#bdb7a7',
        });
    }

    /**
     * v1.0 — Skyhook spawn (Area 2 cliff dropper). Starts in 'perched' FSM state.
     */
    _spawnSkyhook(ecs, def, level) {
        const w = SKYHOOK.hitboxW, h = SKYHOOK.hitboxH;
        const x = def.col * TILE + (TILE - w) / 2;
        const y = def.row * TILE - h;
        const id = ecs.createEntity();
        ecs.addComponent(id, 'transform', { x, y, w, h });
        ecs.addComponent(id, 'velocity',  { vx: 0, vy: 0 });
        ecs.addComponent(id, 'physics',   { onGround: false, onIce: false, jumpHoldLeft: 0 });
        ecs.addComponent(id, 'enemy',     initEnemyP2('skyhook', def.dir ?? -1));
        ecs.addComponent(id, 'sprite',    {
            name: 'skyhook', anim: 'perched', frame: 0, scale: 2,
            flip: false, color: '#e6e1d8',
        });
    }
}

// owning agent: dev-lead
// TODO: StageManager v0.50.1 — owns Area 1's SINGLE continuous stage.
// LevelManager delegates to this in Phase 2 mode. Major v0.50.1 changes vs v0.50:
//   - All 4 rounds concatenated into one TileMap (buildArea1Stage); no round-load
//     fade transition.
//   - Mile-markers fire a 90-frame "Round 1-X" overlay (visual only, no state lock,
//     no entity reload) via fireRoundMarkerOverlay().
//   - Cairn (final marker) sets STAGE_CLEAR.
//   - Owns lastCheckpointCol for respawn (set on each mile-marker pass).
//   - Drives the lives system: on RESPAWNING, reposition Reed at the latest
//     checkpoint and clear the flag back to PLAYING. On `_stageRestartPending`
//     (lives ran out), also reset checkpoint to 0 AND wipe&respawn entities so
//     the stage is genuinely fresh.
//   - Equipment carryover spirit: pl.armed is preserved across respawns within
//     the same life-loss; only stage-restart wipes entities (and re-introduces
//     the round-1 dawn-husk pickup).
//
// Q6 reversal: only ONE dawn-husk in the stage (round-1-1 area). Once Reed
// picks up the hatchet, he stays armed for the whole stage and through every
// checkpoint respawn within this stage.
//
// Equipment carryover to Stage 2 (Area 2): no Stage 2 yet in v0.50.1, but the
// API is structured so when StageManager.startStage(2) lands, pl.armed will
// persist by default (the new stage's player factory should read state.armed
// or carry the bit forward). Documented for the next dev who wires it.

import { buildArea1Stage } from './area1/index.js';
import { initEnemyP2 } from '../mechanics/Phase2EnemyAI.js';
import { HUMMERWING, MOSSPLODDER, EGG } from '../config/PhaseTwoTunables.js';

const TILE = 48;

// v0.50.1 — Mile-marker overlay timing. 90 frames @ 60 fps = 1.5 s.
// Renderer-side fade widths (15 fade in / 60 hold / 15 fade out) are computed in
// Renderer._drawRoundMarkerOverlay against this same total.
const OVERLAY_TOTAL = 90;

export class StageManager {
    /**
     * @param {object} levelManager  back-pointer for setting `currentLevel`/`scrollX`/`playerEntity`.
     */
    constructor(levelManager) {
        this.lm = levelManager;
        this.areaIndex      = 0;
        // v0.50.1 — `roundIndex` is now a derived "which round-section is Reed in"
        // value purely for the AREA X-Y HUD chip. It updates as he crosses
        // mile-markers; it does NOT load anything.
        this.roundIndex     = 1;          // 1..4 once started
        this.stageCleared   = false;

        // Lives / checkpoint
        this.lastCheckpointCol = 0;       // col index in the concatenated grid

        // Mile-marker overlay state — read by Renderer.drawHUD overlay path.
        this.overlay = {
            active: false,
            kind:   null,        // 'round_1_2' | 'round_1_3' | 'round_1_4'
            frames: 0,           // remaining frames
        };

        // Legacy v0.50 fields kept for renderer back-compat (the fade overlay code
        // path is dormant in v0.50.1 since transitioning is no longer used for
        // round-loads; left in place so a Stage 2 introduction can re-use it).
        this.transitioning  = false;
        this.transitionTimer = 0;
        this.transitionPhase = null;
    }

    /** Begin Area `area` at the stage start. Resets vitality, lives, score-of-area. */
    startArea(area, ecs, state) {
        this.areaIndex     = area;
        this.roundIndex    = 1;
        this.stageCleared  = false;
        this.lastCheckpointCol = 0;
        this.overlay = { active: false, kind: null, frames: 0 };

        // v0.50.1 — Phase 2 lives mode. Refill lives + vitality on stage start.
        state.lives  = state.maxLives;
        state.hunger = state.maxHunger;
        state._stageRestartPending = false;
        state._isPhase2 = true;          // teach state.killHero to route through loseLife

        this.loadStage(ecs, state);
        state.setGameState('PLAYING');
    }

    /** Build the stage's TileMap and spawn fresh entities + a fresh hero. */
    loadStage(ecs, state) {
        if (this.areaIndex !== 1) return;

        // 1. Destroy ALL entities. Stage build is a clean slate.
        const allRows = ecs.query();
        for (const row of allRows) ecs.destroyEntity(row.id);

        // 2. Build the concatenated TileMap.
        const level = buildArea1Stage();
        // Reset trigger _consumed flags (TileMap creates them false; double-safety)
        for (let r = 0; r < level.rows; r++) {
            for (let c = 0; c < level.cols; c++) {
                const t = level.getTile(c, r);
                if (t && t.isTrigger) t._consumed = false;
            }
        }
        this.lm.currentLevel = level;
        this.lm.scrollX      = 0;

        // 3. Spawn the hero at stage start (always unarmed at stage start; the
        //    round-1 dawn-husk gives him the hatchet).
        this._spawnHero(ecs, level, level.spawn.col, level.spawn.row, /*armed*/ false);

        // 4. Spawn round entities.
        for (const e of level.entities ?? []) {
            this._spawnRoundEntity(ecs, e, level);
        }
    }

    /**
     * v0.50.1 — Mile-marker overlay. Called by TriggerSystem on contact. The
     * marker also acts as a checkpoint anchor (lastCheckpointCol = marker col)
     * AND advances the Round HUD chip (1→2 / 2→3 / 3→4).
     *
     * @param {string} markerKind  'mile_1' | 'mile_2' | 'mile_3'
     * @param {number} col         column of the marker tile
     */
    fireRoundMarkerOverlay(markerKind, col, state) {
        if (this.overlay.active && this.overlay.kind === markerKind) return;
        // Map mile-marker → next round chip.
        const nextRound = (markerKind === 'mile_1') ? 2
                        : (markerKind === 'mile_2') ? 3
                        : (markerKind === 'mile_3') ? 4
                        : this.roundIndex;
        this.roundIndex = nextRound;
        this.lastCheckpointCol = col + 1;       // respawn just past the marker

        this.overlay = {
            active: true,
            kind:   `round_1_${nextRound}`,
            frames: OVERLAY_TOTAL,
        };

        // Per-marker vitality refill — same value as the v0.50 ROUND_TRANSITION.
        // Refilling on each landmark gives the player a small reward beat without
        // forcing a fade.
        state.hunger = state.maxHunger;
    }

    /** Cairn at end of round 4 — emit the bilingual stage-clear overlay. */
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

        // v0.50.1 — Phase 2 RESPAWNING handler. State.killHero(player) flips the
        // gameState to RESPAWNING; we observe it here, reposition Reed at the
        // latest checkpoint (or stage start, on stage-restart), preserve armed,
        // and flip back to PLAYING.
        if (state.gameState === 'RESPAWNING') {
            this._handleRespawn(ecs, state);
        }
    }

    _handleRespawn(ecs, state) {
        const level = this.lm.currentLevel;
        if (!level) return;

        const stageRestart = !!state._stageRestartPending;
        if (stageRestart) {
            state._stageRestartPending = false;
            this.lastCheckpointCol = 0;
            this.roundIndex = 1;
            this.stageCleared = false;
            this.overlay = { active: false, kind: null, frames: 0 };
            // Wipe & rebuild entities for a clean stage start; hero is unarmed.
            this.loadStage(ecs, state);
            state.setGameState('PLAYING');
            return;
        }

        // Mid-stage respawn: keep entity layout, reposition the existing hero.
        const players = ecs.query('transform', 'velocity', 'player');
        if (!players.length) {
            // Defensive: if hero entity was destroyed, respawn fresh + unarmed.
            this._spawnHero(ecs, level, level.spawn.col, level.spawn.row, false);
        } else {
            const p = players[0];
            const tf = p.transform;
            const v  = p.velocity;
            const pl = p.player;
            // Use the spawn-row anchor; checkpoint x lives on lastCheckpointCol.
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
            // pl.armed PRESERVED — equipment carries across respawns within a stage.
        }
        // Vitality already refilled by loseLife(); ensure it's full.
        state.hunger = state.maxHunger;
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
            _phase1: true,           // re-uses HeroController Phase 1 path
            _phase2: true,           // marker for Phase 2 systems
        });
        ecs.addComponent(player, 'sprite', {
            name: 'hero', anim: 'idle', frame: 0, scale: 3, flip: false, color: '#4a7c3a',
        });
        this.lm.playerEntity = player;
    }

    _spawnRoundEntity(ecs, e, level) {
        if (e.kind === 'mossplodder') this._spawnMossplodder(ecs, e, level);
        else if (e.kind === 'hummerwing') this._spawnHummerwing(ecs, e, level);
        else if (e.kind === 'dawn-husk')  this._spawnDawnHusk(ecs, e, level);
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
}

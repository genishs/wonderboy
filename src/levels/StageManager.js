// owning agent: dev-lead
// TODO: StageManager — owns Area 1's 4-round FSM. LevelManager delegates to this
// in Phase 2 mode. Responsibilities:
//   - startArea(area, ecs, state): start Round 1 of an area (resets vitality)
//   - loadCurrentRound(ecs, state): clear all entities and rebuild from round data
//   - advanceRound(ecs, state): start the fade timer; swap to next round at midpoint
//   - clearStage(ecs, state): set STAGE_CLEAR for the cairn overlay
//   - update(dt, ecs, state): drive the transition timer

import { buildArea1Round, ROUNDS as AREA1_ROUNDS } from './area1/index.js';
import { initEnemyP2 } from '../mechanics/Phase2EnemyAI.js';
import { ROUND_TRANSITION, HUMMERWING, MOSSPLODDER, EGG } from '../config/PhaseTwoTunables.js';

const TILE = 48;

export class StageManager {
    /**
     * @param {object} levelManager  back-pointer for setting `currentLevel`/`scrollX`/`playerEntity`.
     */
    constructor(levelManager) {
        this.lm = levelManager;
        this.areaIndex      = 0;
        this.roundIndex     = 0;          // 1..4 once started
        this.transitioning  = false;
        this.transitionTimer = 0;
        this.transitionPhase = null;      // 'fade-out' | 'hold' | 'fade-in' | null
        this.stageCleared   = false;
        this._pendingRoundOnSwap = false; // set true during fade-out; flips to false after swap
    }

    /** Begin an area at round 1. Resets vitality + score-of-area. */
    startArea(area, ecs, state) {
        this.areaIndex   = area;
        this.roundIndex  = 1;
        this.transitioning = false;
        this.transitionTimer = 0;
        this.transitionPhase = null;
        this.stageCleared = false;
        // Reset vitality at start of area.
        state.hunger = state.maxHunger;
        this.loadCurrentRound(ecs, state);
        state.setGameState('PLAYING');
    }

    /** Destroy every entity and rebuild from the current round's data. */
    loadCurrentRound(ecs, state) {
        if (this.areaIndex !== 1) return;     // v0.50 ships Area 1 only

        // 1. Destroy ALL entities. We don't carry projectiles or husks across rounds.
        const allRows = ecs.query();          // every entity row
        for (const row of allRows) {
            ecs.destroyEntity(row.id);
        }

        // 2. Build the new TileMap.
        const level = buildArea1Round(this.roundIndex);
        // Reset trigger _consumed flags (TileMap creates them false; double-safety)
        for (let r = 0; r < level.rows; r++) {
            for (let c = 0; c < level.cols; c++) {
                const t = level.getTile(c, r);
                if (t && t.isTrigger) t._consumed = false;
            }
        }
        this.lm.currentLevel = level;
        this.lm.scrollX      = 0;

        // 3. Spawn the hero (always unarmed at round start per Q6).
        // spawn.row in round-data is the row where the SURFACE tile sits — Reed
        // stands on top of it, so foot Y = row * TILE.
        const pw = 30, ph = 66;
        const px = level.spawn.col * TILE + (TILE - pw) / 2;
        const py = level.spawn.row * TILE - ph;
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
            armed: false,            // hard-locked false at round start
            _phase1: true,           // re-uses HeroController Phase 1 path
            _phase2: true,           // marker for Phase 2 systems
        });
        ecs.addComponent(player, 'sprite', {
            name: 'hero', anim: 'idle', frame: 0, scale: 3, flip: false, color: '#4a7c3a',
        });
        this.lm.playerEntity = player;

        // 4. Spawn round entities.
        for (const e of level.entities ?? []) {
            this._spawnRoundEntity(ecs, e, level);
        }
    }

    /** Trigger the round-transition fade. After swap-frame, load round N+1. */
    advanceRound(ecs, state) {
        if (this.transitioning) return;
        if (this.areaIndex !== 1) return;
        if (this.roundIndex >= AREA1_ROUNDS.length) {
            // Already at last round — cairn handler should have run instead.
            return;
        }
        this.transitioning   = true;
        this.transitionTimer = ROUND_TRANSITION.totalFrames;
        this.transitionPhase = 'fade-out';
        this._pendingRoundOnSwap = true;
        state.setGameState('TRANSITIONING');
        // Vitality refill on mile-marker contact (Q15)
        state.hunger = Math.min(state.maxHunger, state.hunger + ROUND_TRANSITION.vitalityRefill);
    }

    /** Cairn at end of round 4 — emit the bilingual stage-clear overlay. */
    clearStage(ecs, state) {
        if (this.stageCleared) return;
        this.stageCleared = true;
        state.setGameState('STAGE_CLEAR');
    }

    update(dt, ecs, state) {
        if (!this.transitioning) return;

        this.transitionTimer--;
        const t = this.transitionTimer;

        if (t > 40)      this.transitionPhase = 'fade-out';
        else if (t > 20) this.transitionPhase = 'hold';
        else             this.transitionPhase = 'fade-in';

        // At the swap frame, load the next round (during the hold-to-fade-in boundary).
        if (this._pendingRoundOnSwap && t === ROUND_TRANSITION.swapAtFrame) {
            this.roundIndex++;
            this.loadCurrentRound(ecs, state);
            this._pendingRoundOnSwap = false;
        }

        if (t <= 0) {
            this.transitioning = false;
            this.transitionPhase = null;
            this.transitionTimer = 0;
            state.setGameState('PLAYING');
        }
    }

    // ── internal ─────────────────────────────────────────────────────────
    _spawnRoundEntity(ecs, e, level) {
        if (e.kind === 'mossplodder') this._spawnMossplodder(ecs, e, level);
        else if (e.kind === 'hummerwing') this._spawnHummerwing(ecs, e, level);
        else if (e.kind === 'dawn-husk')  this._spawnDawnHusk(ecs, e, level);
    }

    _spawnMossplodder(ecs, def, level) {
        const w = MOSSPLODDER.hitboxW, h = MOSSPLODDER.hitboxH;
        const x = def.col * TILE + (TILE - w) / 2;
        // def.row is the surface row; mossplodder stands on top of it.
        const y = def.row * TILE - h;
        const id = ecs.createEntity();
        ecs.addComponent(id, 'transform', { x, y, w, h });
        ecs.addComponent(id, 'velocity',  { vx: 0, vy: 0 });
        ecs.addComponent(id, 'physics',   { onGround: false, onIce: false, jumpHoldLeft: 0 });
        ecs.addComponent(id, 'enemy',     initEnemyP2('mossplodder', def.dir ?? -1));
        ecs.addComponent(id, 'sprite',    {
            name: 'mossplodder', anim: 'walk', frame: 0, scale: 3,
            flip: (def.dir ?? -1) > 0,   // sprite faces left by convention; flip when dir>0
            color: '#6a8030',
        });
    }

    _spawnHummerwing(ecs, def, level) {
        const w = HUMMERWING.hitboxW, h = HUMMERWING.hitboxH;
        // Place body at chest-high above the spawn cell's floor (def.row is the
        // surface row; floor surface y = def.row * TILE).
        const floorY = def.row * TILE;
        const baseY  = floorY + HUMMERWING.driftAltitudeOffset;   // negative offset → above floor
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
        // Husk sits ON TOP of the surface row (def.row is the surface row).
        const y = def.row * TILE - h;
        const id = ecs.createEntity();
        ecs.addComponent(id, 'transform', { x, y, w, h });
        ecs.addComponent(id, 'pickup',    { type: 'dawn-husk', state: 'rest', stateTimer: 0 });
        ecs.addComponent(id, 'sprite',    {
            name: 'dawn-husk', anim: 'rest', frame: 0, scale: 3, flip: false, color: '#e8d4a0',
        });
    }
}

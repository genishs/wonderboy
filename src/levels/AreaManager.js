// owning agent: dev-lead
// TODO: AreaManager v0.75 — top-level Area-1 lifecycle. Owns:
//   - currentStageIndex (1..4) + carry state across stages (lives, pl.armed)
//   - stage-transition overlay + state machine
//   - Area-cleared overlay + state machine
//   - camera-lock flag/x (consumed by LevelManager)
//   - the active StageManager (single-stage lifecycle, swapped on transition)
//
// Phase 2's StageManager-as-the-area is demoted: AreaManager now owns the
// area-wide concerns (lives reset, vitality refill on stage entry, full-area
// Continue from GAME_OVER). StageManager keeps the within-stage concerns
// (mile-marker overlay, checkpoint, respawn-pending RESPAWNING handler).

import { StageManager } from './StageManager.js';
import { buildStage } from './area1/index.js';
import {
    AREA1_STAGES,
    STAGE_TRANSITION,
    AREA_CLEARED,
} from '../config/PhaseThreeTunables.js';

export class AreaManager {
    /**
     * @param {object} levelManager  LevelManager back-ref for scrollX, playerEntity, etc.
     * @param {object} tileCache     TileCache (for setActiveStage on swap).
     * @param {object} parallax      ParallaxBackground (for setStage on swap).
     */
    constructor(levelManager, tileCache = null, parallax = null) {
        this.lm         = levelManager;
        this.tileCache  = tileCache;
        this.parallax   = parallax;
        this.areaIndex  = 0;
        this.currentStageIndex = 0;
        this.currentStage      = null;          // StageManager instance (per-stage)
        this.bossSystem        = null;          // wired by game.js

        // v0.75 — stage transition state.
        this.transition = {
            active: false,
            phase:  null,    // 'input_suspend' | 'fade_out' | 'hold' | 'fade_in'
            frames: 0,
            nextStage: 0,
        };

        // v0.75 — bilingual stage-name overlay (consumed by Renderer._drawStageNameOverlay).
        this.overlay = {
            active: false,
            kind:   null,    // 'stage_name' | 'area_cleared'
            frames: 0,
            payload: null,   // { stageIndex, en, ko }
        };

        // v0.75 — camera lock (consumed by LevelManager.update).
        this.cameraLocked = false;
        this.cameraLockX  = 0;

        // v0.75 — Area-cleared celebration overlay state.
        this.areaCleared = {
            active: false,
            phase:  null,    // 'fade_out' | 'hold'
            frames: 0,
        };
    }

    // ── Public lifecycle ────────────────────────────────────────────────────

    /**
     * Begin Area `area` from a fresh state. Resets lives + vitality + armed.
     * Spawns Reed unarmed at Stage 1 spawn.
     */
    startArea(area, ecs, state) {
        this.areaIndex          = area;
        this.currentStageIndex  = 1;
        this.transition         = { active: false, phase: null, frames: 0, nextStage: 0 };
        this.overlay            = { active: false, kind: null, frames: 0, payload: null };
        this.areaCleared        = { active: false, phase: null, frames: 0 };
        this.cameraLocked       = false;
        this.cameraLockX        = 0;

        state.lives  = state.maxLives;
        state.hunger = state.maxHunger;
        state._stageRestartPending = false;
        state._areaRestartPending  = false;
        state._isPhase2 = true;
        state._isPhase3 = true;

        this._loadStage(1, ecs, state, /*armed*/ false);
        state.setGameState('PLAYING');
    }

    /**
     * Begin a stage-transition ritual to the given next stage. Sets the
     * 30-frame input-suspend phase first; StageTransitionSystem drives the
     * fade-out / swap / hold / fade-in phases.
     */
    beginStageTransition(nextStageIndex) {
        if (this.transition.active) return;
        this.transition = {
            active: true,
            phase:  'input_suspend',
            frames: STAGE_TRANSITION.inputSuspendLead,
            nextStage: nextStageIndex,
        };
    }

    /**
     * Called by StageTransitionSystem during the `swap` phase. Wipes entities,
     * loads the new stage, and respawns the hero at the new stage's spawn
     * preserving pl.armed.
     */
    swapToNextStage(ecs, state) {
        const nextStage = this.transition.nextStage | 0;
        if (nextStage < 1 || nextStage > AREA1_STAGES.count) return;
        // Carry pl.armed forward across the stage boundary.
        let armed = false;
        const players = ecs.query('transform', 'velocity', 'player');
        if (players.length) armed = !!players[0].player.armed;

        this._loadStage(nextStage, ecs, state, armed);
        state.hunger = state.maxHunger;   // vitality refill on stage entry
        this.currentStageIndex = nextStage;

        // Fire the bilingual stage-name overlay (consumed by Renderer during
        // the fade-in phase).
        const names = AREA1_STAGES.stageNames[nextStage];
        if (names) {
            this.overlay = {
                active: true,
                kind:   'stage_name',
                frames: STAGE_TRANSITION.holdFrames + STAGE_TRANSITION.fadeInFrames,
                payload: { stageIndex: nextStage, en: names.en, ko: names.ko },
            };
        }
    }

    /** Begin Area-cleared overlay flow. */
    beginAreaCleared() {
        if (this.areaCleared.active) return;
        this.areaCleared = {
            active: true,
            phase:  'fade_out',
            frames: AREA_CLEARED.fadeOutFrames + AREA_CLEARED.holdFrames,
        };
        // Overlay payload doubles via this.overlay for renderer back-compat.
        this.overlay = {
            active: true,
            kind:   'area_cleared',
            frames: AREA_CLEARED.fadeOutFrames + AREA_CLEARED.holdFrames,
            payload: { en: AREA_CLEARED.textEn, ko: AREA_CLEARED.textKo },
        };
    }

    lockCamera(px) {
        this.cameraLocked = true;
        this.cameraLockX  = px | 0;
    }
    unlockCamera() {
        this.cameraLocked = false;
    }

    /**
     * Per-frame update. Driven from game.js mechanics tick BEFORE StageManager.update,
     * so RESPAWNING + _areaRestartPending is observed first (full-area reset on Continue).
     */
    update(dt, ecs, state) {
        // v0.75 — full-Area reset on Continue (state._areaRestartPending is set
        // by state.continueRun() when _isPhase3 was true at the time of GAME_OVER).
        if (state.gameState === 'RESPAWNING' && state._areaRestartPending) {
            state._areaRestartPending  = false;
            state._stageRestartPending = false;
            this.startArea(this.areaIndex || 1, ecs, state);
            return;
        }

        // Overlay timer tick (stage-name + area-cleared share the same path; phases
        // are managed by StageTransitionSystem / BossSystem; this just decrements
        // the visual hold).
        if (this.overlay.active) {
            this.overlay.frames--;
            if (this.overlay.frames <= 0) {
                this.overlay.active = false;
                this.overlay.kind   = null;
                this.overlay.frames = 0;
                this.overlay.payload = null;
            }
        }

        // Delegate within-stage update to the active StageManager.
        if (this.currentStage) this.currentStage.update(dt, ecs, state);
    }

    // ── Internal ────────────────────────────────────────────────────────────

    _loadStage(stageIndex, ecs, state, armed) {
        // Build the new TileMap.
        const level = buildStage(stageIndex);
        // Reset trigger _consumed flags (TileMap creates them false; double-safety).
        for (let r = 0; r < level.rows; r++) {
            for (let c = 0; c < level.cols; c++) {
                const t = level.getTile(c, r);
                if (t && t.isTrigger) t._consumed = false;
            }
        }

        // Wipe ALL entities. Stage is a clean slate.
        const allRows = ecs.query();
        for (const row of allRows) ecs.destroyEntity(row.id);

        // Activate the matching tileset (if loaded). game.js wires all 4 at init.
        if (this.tileCache && typeof this.tileCache.setActiveStage === 'function') {
            this.tileCache.setActiveStage(stageIndex);
        }
        if (this.parallax && typeof this.parallax.setStage === 'function') {
            this.parallax.setStage(stageIndex);
        }

        this.lm.currentLevel = level;
        this.lm.scrollX      = 0;
        this.cameraLocked    = false;
        this.cameraLockX     = 0;

        // (Re-)instantiate the per-stage StageManager. It owns the round-overlay
        // + checkpoint + RESPAWNING handler for this stage only.
        this.currentStage = new StageManager(this.lm);
        this.currentStage.attachToStage(stageIndex, level, ecs, state, !!armed);

        // Boss system reset (if any) — Stage 4 entry resets the boss FSM; other
        // stages disarm the boss-active flag so a stale arena doesn't trigger.
        if (this.bossSystem && typeof this.bossSystem.resetForStageLoad === 'function') {
            this.bossSystem.resetForStageLoad(stageIndex);
        }
    }
}

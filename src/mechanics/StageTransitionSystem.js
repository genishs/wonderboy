// owning agent: dev-lead
// TODO: StageTransitionSystem v0.75 — drives the inter-stage fade/swap/hold
// ritual triggered by a STAGE_EXIT tile. Phases (consumed by Renderer for
// fade alpha + stage-name overlay):
//
//   input_suspend  → 30 frames; input frozen; physics still runs (mid-jump
//                    arcs complete). gameState stays PLAYING so the dying
//                    FSM remains live if Reed somehow dies during the buffer.
//   fade_out       → 45 frames; alpha 0→1; gameState flips to STAGE_TRANSITION.
//                    HeroController input-lock includes STAGE_TRANSITION, so
//                    physics no longer reads movement input.
//   hold           → 75 frames; alpha = 1; stage swap occurs ON FRAME 1 of
//                    `hold` via AreaManager.swapToNextStage (entities wiped,
//                    new TileMap built, hero respawned at new spawn, parallax
//                    + tilecache flipped). Bilingual "Stage N — Name" overlay
//                    is published to AreaManager.overlay for Renderer to read.
//   fade_in        → 45 frames; alpha 1→0. gameState flips back to PLAYING on
//                    the LAST frame (so input is restored once visible).
//
// Total beat = 30 + 45 + 75 + 45 = 195 frames ≈ 3.25 s.

import { STAGE_TRANSITION } from '../config/PhaseThreeTunables.js';

export class StageTransitionSystem {
    update(ecs, levelManager, state) {
        const am = levelManager?.areaManager;
        if (!am || !am.transition.active) return;

        const tr = am.transition;
        if (tr.frames > 0) tr.frames--;

        if (tr.frames > 0) return;

        // Phase advance.
        switch (tr.phase) {
            case 'input_suspend':
                tr.phase  = 'fade_out';
                tr.frames = STAGE_TRANSITION.fadeOutFrames;
                state.setGameState('STAGE_TRANSITION');
                break;
            case 'fade_out':
                tr.phase  = 'hold';
                tr.frames = STAGE_TRANSITION.holdFrames;
                // Swap to next stage on the boundary into `hold`.
                am.swapToNextStage(ecs, state);
                break;
            case 'hold':
                tr.phase  = 'fade_in';
                tr.frames = STAGE_TRANSITION.fadeInFrames;
                break;
            case 'fade_in':
                tr.active = false;
                tr.phase  = null;
                tr.frames = 0;
                state.setGameState('PLAYING');
                break;
            default:
                tr.active = false;
                tr.phase  = null;
                tr.frames = 0;
        }
    }
}

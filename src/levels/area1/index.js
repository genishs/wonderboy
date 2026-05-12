// owning agent: dev-lead
// TODO: Area 1 stage dispatcher. v0.75 split — each stage owns its own
// builder in `stageN/index.js` (Stages 2-4) or `stage1.js` (Stage 1, the
// previous monolithic builder, now extracted). This module exposes the
// uniform `buildStage(stageIndex)` API consumed by AreaManager.
//
// Legacy `buildArea1Stage()` is preserved as a v0.50.x compatibility shim
// — it points at `buildStage1()` so any out-of-tree caller still resolves.

import { buildStage1, STAGE1_ROUNDS } from './stage1.js';
import { buildStage2 } from './stage2/index.js';
import { buildStage3 } from './stage3/index.js';
import { buildStage4 } from './stage4/index.js';

export const ROUNDS = STAGE1_ROUNDS;

/**
 * v0.75 — return a TileMap for the requested Area 1 stage.
 * stageIndex in {1,2,3,4}. Throws on unknown index.
 *
 * @param {number} stageIndex
 * @returns {TileMap}
 */
export function buildStage(stageIndex) {
    switch (stageIndex) {
        case 1: return buildStage1();
        case 2: return buildStage2();
        case 3: return buildStage3();
        case 4: return buildStage4();
        default: throw new Error(`Area 1 stage ${stageIndex} not defined`);
    }
}

/** @deprecated v0.50.2 — kept for back-compat with any out-of-tree caller. */
export function buildArea1Stage() {
    return buildStage1();
}

/** @deprecated v0.50.1 — kept for back-compat. */
export function buildArea1Round(_n) {
    return buildStage1();
}

// owning agent: dev-lead
// TODO: Area 2 stage dispatcher (v1.0). Per docs/briefs/phase4-area2-cast.md §1.
//
// Area 2 (the Cinder Reach) has 4 stages:
//   2-1  The Switchback   (산허리길)        — climbing terraces, mossy → stone
//   2-2  The Beacon Walk  (봉수대 옛길)      — open ridge, cliff-fall hazard
//   2-3  The Knifing      (협곡)            — narrow rock-gully, enemy density
//   2-4  The Reignward    (봉수대 마루)      — Reignwarden arena
//
// v1.0 minimum-viable scope: Stage 2-1 ships with 1 fully wired round so the
// Area 1 → Area 2 transition has somewhere to land. Stages 2-2..2-4 are
// stubbed via a minimal builder that falls back to a basic flat-floor layout.
// Once design ships the assets, dev follow-up replaces the stubs with proper
// multi-round layouts.

import { buildStage1 as buildArea2Stage1 } from './stage1.js';
import { buildStage2 as buildArea2Stage2 } from './stage2.js';
import { buildStage3 as buildArea2Stage3 } from './stage3.js';
import { buildStage4 as buildArea2Stage4 } from './stage4.js';

/**
 * Returns a TileMap for the requested Area 2 stage. stageIndex in {1..4}.
 * Throws on unknown index (matches Area 1 dispatcher's contract).
 */
export function buildStage(stageIndex) {
    switch (stageIndex) {
        case 1: return buildArea2Stage1();
        case 2: return buildArea2Stage2();
        case 3: return buildArea2Stage3();
        case 4: return buildArea2Stage4();
        default: throw new Error(`Area 2 stage ${stageIndex} not defined`);
    }
}

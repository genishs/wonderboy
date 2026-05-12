// owning agent: dev-lead
// TODO: Stage 1 (Mossline Path — forest) builder. v0.75 — extracted from the
// previous area1/index.js so all 4 stages have a symmetric `buildStage()` API.
// Concatenates rounds 1-1 .. 1-4 end-to-end and emits the final stage_exit
// trigger (replaces v0.50's cairn, which now belongs to Area-cleared semantics).
//
// Stage 1 layout (cumulative col offsets) — UNCHANGED from v0.50.1:
//   round-1-1 → cols  0  ..  47   (48 cols)
//   round-1-2 → cols 48  .. 111   (64 cols)
//   round-1-3 → cols 112 .. 159   (48 cols)
//   round-1-4 → cols 160 .. 223   (64 cols)
//   ────────────────────────────
//   total cols = 224, rows = 12
//
// Q6 reversal (v0.50.1, still active): only ONE dawn-husk in the whole stage
// (the round-1-1 husk at col 7). Once Reed picks up the hatchet he stays
// armed for the whole stage and through every checkpoint respawn within this
// stage. v0.75 extends "armed carries" to cross stage transitions too —
// see AreaManager.loadStage(carry).

import { TileMap, TILE_TYPES } from '../TileMap.js';
import { ROUND as r1 } from './round-1-1.js';
import { ROUND as r2 } from './round-1-2.js';
import { ROUND as r3 } from './round-1-3.js';
import { ROUND as r4 } from './round-1-4.js';

export const STAGE1_ROUNDS = Object.freeze([r1, r2, r3, r4]);

const KIND_TO_TYPE = {
    flat:        TILE_TYPES.FLAT,
    slope_up_22: TILE_TYPES.SLOPE_UP_22,
    slope_up_45: TILE_TYPES.SLOPE_UP_45,
    slope_dn_22: TILE_TYPES.SLOPE_DN_22,
    slope_dn_45: TILE_TYPES.SLOPE_DN_45,
};

const TRIGGER_TO_TYPE = {
    mile_1:     TILE_TYPES.MILE_1,
    mile_2:     TILE_TYPES.MILE_2,
    mile_3:     TILE_TYPES.MILE_3,
    mile_4:     TILE_TYPES.MILE_4,
    cairn:      TILE_TYPES.CAIRN,
    // v0.75 — Stage 1's round-1-4 now ends with stage_exit (nextStage=2) instead
    // of cairn. The cairn entry stays in the map for backwards safety.
    stage_exit: TILE_TYPES.STAGE_EXIT,
};

/**
 * v0.75 — build Stage 1 (Mossline Path forest) as ONE continuous TileMap.
 * Concatenates the four rounds with proper col-offset shifting. Stage 1's
 * spawn/entities/triggers are byte-equivalent to v0.50.2; only the round-1-4
 * terminal trigger changed from `cairn` to `stage_exit { nextStage: 2 }`.
 *
 * Returns a TileMap whose `cols` is the sum of the rounds' cols (224 in
 * v0.50.2; unchanged here).
 *
 * @returns {TileMap}
 */
export function buildStage1() {
    const rows = STAGE1_ROUNDS[0].rows;   // 12
    const allColumns       = [];
    const allDecorations   = [];
    const allTriggers      = [];
    const allFires         = [];
    const allEntities      = [];
    const roundBoundaries  = [];

    let colOffset = 0;
    for (let i = 0; i < STAGE1_ROUNDS.length; i++) {
        const round = STAGE1_ROUNDS[i];
        roundBoundaries.push(colOffset);

        for (let c = 0; c < round.cols; c++) {
            const cell = round.columns[c];
            allColumns.push(cell ? { ...cell } : null);
        }
        for (const d of round.decorations ?? []) {
            allDecorations.push({ ...d, col: d.col + colOffset });
        }
        for (const t of round.triggers ?? []) {
            allTriggers.push({ ...t, col: t.col + colOffset });
        }
        for (const f of round.fires ?? []) {
            allFires.push({ ...f, col: f.col + colOffset });
        }
        // Q6 reversal: only the first round's dawn-husk survives concatenation.
        for (const e of round.entities ?? []) {
            if (i > 0 && e.kind === 'dawn-husk') continue;
            allEntities.push({ ...e, col: e.col + colOffset });
        }
        colOffset += round.cols;
    }
    const totalCols = colOffset;

    const tileData = [];
    for (let c = 0; c < totalCols; c++) {
        const cell = allColumns[c];
        if (!cell) continue;
        const surfaceType = KIND_TO_TYPE[cell.kind];
        if (surfaceType == null) continue;
        const sRow = cell.row;
        if (sRow >= 0 && sRow < rows) {
            tileData.push([c, sRow, surfaceType]);
        }
        for (let r = sRow + 1; r < rows; r++) {
            tileData.push([c, r, TILE_TYPES.FLAT]);
        }
    }

    for (const f of allFires) {
        const fireRow = f.row - 1;
        if (fireRow >= 0 && fireRow < rows) {
            tileData.push([f.col, fireRow, TILE_TYPES.FIRE_LOW]);
        }
    }

    for (const t of allTriggers) {
        const tType = TRIGGER_TO_TYPE[t.kind];
        if (tType == null) continue;
        const trRow = t.row - 1;
        if (trRow < 0 || trRow >= rows) continue;
        // v0.75 — surface optional per-tile extras (e.g. stage_exit's nextStage).
        if (t.kind === 'stage_exit' && typeof t.nextStage === 'number') {
            tileData.push([t.col, trRow, tType, { nextStage: t.nextStage }]);
        } else {
            tileData.push([t.col, trRow, tType]);
        }
    }

    const stageData = {
        id:       'area1-stage1',
        cols:     totalCols,
        rows,
        tileData,
        decorations: allDecorations,
        spawn:       { ...STAGE1_ROUNDS[0].spawn },
        entities:    allEntities,
        theme:       STAGE1_ROUNDS[0].theme,
        playerStart: { col: STAGE1_ROUNDS[0].spawn.col, row: STAGE1_ROUNDS[0].spawn.row },
        items:       [],
        enemies:     [],
        goalX:       totalCols - 1,
    };

    const map = new TileMap(stageData);
    map.roundBoundaries = roundBoundaries;
    map.stageIndex      = 1;
    return map;
}

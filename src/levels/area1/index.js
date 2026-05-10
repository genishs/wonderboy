// owning agent: dev-lead
// TODO: Area 1 stage builder. v0.50.1 changes the model from "4 separate rounds
// loaded with fade transitions" to "ONE continuous scrolling stage" assembled by
// concatenating the 4 round modules end-to-end. Mile-markers remain as in-world
// landmarks (now visual-only — overlay text in TriggerSystem); the cairn at the
// far end fires Stage Cleared.
//
// Layout (cumulative col offsets):
//   round-1-1 → cols  0  ..  47   (48 cols)
//   round-1-2 → cols 48  .. 111   (64 cols)
//   round-1-3 → cols 112 .. 159   (48 cols)
//   round-1-4 → cols 160 .. 223   (64 cols)
//   ────────────────────────────
//   total cols = 224, rows = 12
//
// Q6 reversal (v0.50.1): only ONE dawn-husk in the whole stage (the round-1-1
// husk at col 7). Once Reed picks up the hatchet, he stays armed for the whole
// stage. Rounds 2-4's husk entries are dropped during concatenation.

import { TileMap, TILE_TYPES } from '../TileMap.js';
import { ROUND as r1 } from './round-1-1.js';
import { ROUND as r2 } from './round-1-2.js';
import { ROUND as r3 } from './round-1-3.js';
import { ROUND as r4 } from './round-1-4.js';

export const ROUNDS = Object.freeze([r1, r2, r3, r4]);

const KIND_TO_TYPE = {
    flat:        TILE_TYPES.FLAT,
    slope_up_22: TILE_TYPES.SLOPE_UP_22,
    slope_up_45: TILE_TYPES.SLOPE_UP_45,
    slope_dn_22: TILE_TYPES.SLOPE_DN_22,
    slope_dn_45: TILE_TYPES.SLOPE_DN_45,
};

const TRIGGER_TO_TYPE = {
    mile_1: TILE_TYPES.MILE_1,
    mile_2: TILE_TYPES.MILE_2,
    mile_3: TILE_TYPES.MILE_3,
    mile_4: TILE_TYPES.MILE_4,   // v0.50.2 — Round 4 start marker
    cairn:  TILE_TYPES.CAIRN,
};

/**
 * Build a Phase 2 TileMap for Area 1 as ONE continuous stage. Concatenates all
 * 4 rounds in order with proper col-offset shift on every per-round element
 * (columns, decorations, triggers, fires, entities, spawn).
 *
 * Returns a TileMap whose `cols` is the sum of the rounds' cols. Useful
 * derived data on the returned map (besides standard TileMap fields):
 *   - `roundBoundaries`  : array of column indices that mark the START col of
 *                          each round in the concatenated grid (used by the
 *                          checkpoint system).
 *
 * @returns {TileMap}
 */
export function buildArea1Stage() {
    const rows = r1.rows;   // all 4 rounds share rows = 12
    const allColumns       = [];
    const allDecorations   = [];
    const allTriggers      = [];
    const allFires         = [];
    const allEntities      = [];
    const roundBoundaries  = [];   // [colOffsetForRound1, ..2, ..3, ..4]

    let colOffset = 0;
    for (let i = 0; i < ROUNDS.length; i++) {
        const round = ROUNDS[i];
        roundBoundaries.push(colOffset);

        // Columns: clone each cell so we don't mutate the frozen round module.
        for (let c = 0; c < round.cols; c++) {
            const cell = round.columns[c];
            allColumns.push(cell ? { ...cell } : null);
        }

        // Decorations: shift col by offset.
        for (const d of round.decorations ?? []) {
            allDecorations.push({ ...d, col: d.col + colOffset });
        }

        // Triggers: shift col. (Mile markers / cairn — purpose changes in v0.50.1
        // from "fade-then-load-next-round" to "fire overlay text only", except
        // the final cairn which still fires Stage Cleared.)
        for (const t of round.triggers ?? []) {
            allTriggers.push({ ...t, col: t.col + colOffset });
        }

        // Fires: shift col.
        for (const f of round.fires ?? []) {
            allFires.push({ ...f, col: f.col + colOffset });
        }

        // Entities: shift col. v0.50.1 Q6 reversal — drop dawn-husks from rounds
        // 2, 3, 4 (only the round-1 husk remains; once Reed picks up the hatchet
        // he carries it through the whole stage).
        for (const e of round.entities ?? []) {
            if (i > 0 && e.kind === 'dawn-husk') continue;
            allEntities.push({ ...e, col: e.col + colOffset });
        }

        colOffset += round.cols;
    }
    const totalCols = colOffset;

    // 1. Build flat tileData list from the concatenated columns + loam fill.
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
        // Fill loam below the surface row down to rows-1.
        for (let r = sRow + 1; r < rows; r++) {
            tileData.push([c, r, TILE_TYPES.FLAT]);
        }
    }

    // 2. Fires (animated tile, NOT solid). One row above the surface row.
    for (const f of allFires) {
        const fireRow = f.row - 1;
        if (fireRow >= 0 && fireRow < rows) {
            tileData.push([f.col, fireRow, TILE_TYPES.FIRE_LOW]);
        }
    }

    // 3. Trigger tiles — mile-markers / cairn at (col, row - 1).
    for (const t of allTriggers) {
        const tType = TRIGGER_TO_TYPE[t.kind];
        if (tType == null) continue;
        const trRow = t.row - 1;
        if (trRow >= 0 && trRow < rows) {
            tileData.push([t.col, trRow, tType]);
        }
    }

    const stageData = {
        id:       'area1-stage',
        cols:     totalCols,
        rows,
        tileData,
        decorations: allDecorations,
        spawn:       { ...r1.spawn },           // stage spawn = Round 1 spawn
        entities:    allEntities,
        theme:       r1.theme,
        // Legacy fields kept consistent (unused in Phase 2 path):
        playerStart: { col: r1.spawn.col, row: r1.spawn.row },
        items:       [],
        enemies:     [],
        goalX:       totalCols - 1,
    };

    const map = new TileMap(stageData);
    // Stash boundaries for StageManager / checkpoint logic.
    map.roundBoundaries = roundBoundaries;
    return map;
}

/**
 * @deprecated v0.50.1 — kept only for backward compatibility with any
 * out-of-tree caller. The 4-rounds-as-1-stage flow uses buildArea1Stage().
 * @returns {TileMap}
 */
export function buildArea1Round(_n) {
    return buildArea1Stage();
}

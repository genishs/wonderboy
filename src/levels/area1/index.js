// owning agent: dev-lead
// TODO: Area 1 round registry + TileMap builder. Translates each ROUND object
// (per-column ground spec + sparse decorations/fires/triggers/entities) into the
// flat tileData list expected by TileMap, then constructs a Phase 2 TileMap.

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
    cairn:  TILE_TYPES.CAIRN,
};

/**
 * Build a Phase 2 TileMap for round N (1-indexed) of Area 1.
 * @returns {TileMap}
 */
export function buildArea1Round(n) {
    const round = ROUNDS[n - 1];
    if (!round) throw new Error(`buildArea1Round: no round at index ${n}`);

    const cols = round.cols;
    const rows = round.rows;
    const tileData = [];

    // 1. Surface tiles + loam-fill below.
    for (let c = 0; c < cols; c++) {
        const cell = round.columns[c];
        if (!cell) continue;        // gap
        const surfaceType = KIND_TO_TYPE[cell.kind];
        if (surfaceType == null) continue;
        const sRow = cell.row;
        if (sRow >= 0 && sRow < rows) {
            tileData.push([c, sRow, surfaceType]);
        }
        // Fill below the surface row with FLAT (loam) tiles down to rows-1.
        for (let r = sRow + 1; r < rows; r++) {
            tileData.push([c, r, TILE_TYPES.FLAT]);
        }
    }

    // 2. Fires (animated tile, NOT solid). Place in the column above the surface.
    for (const f of round.fires ?? []) {
        // Place fire one row ABOVE the surface row so Reed standing on the floor
        // touches the fire's bottom hitbox. The round files store {col, row} where
        // row is the surface floor; we draw fire at (row - 1).
        const fireRow = f.row - 1;
        if (fireRow >= 0 && fireRow < rows) {
            // Replace any tile here (typically a FLAT below-fill); fire is non-solid,
            // so removing the loam fill is fine — there is no flat surface tile here
            // to begin with (surface tiles are at the column's surface row).
            tileData.push([f.col, fireRow, TILE_TYPES.FIRE_LOW]);
        }
    }

    // 3. Trigger tiles (mile-marker / cairn). Render at (col, row - 1) so they
    //    stand ON the floor and Reed walks INTO them at floor level.
    for (const t of round.triggers ?? []) {
        const tType = TRIGGER_TO_TYPE[t.kind];
        if (tType == null) continue;
        const trRow = t.row - 1;
        if (trRow >= 0 && trRow < rows) {
            tileData.push([t.col, trRow, tType]);
        }
    }

    const stageData = {
        id:       `area1-round-${round.id}`,
        cols, rows,
        tileData,
        // Phase 2 fields:
        decorations: (round.decorations ?? []).map(d => ({ ...d })),
        spawn:       { ...round.spawn },
        entities:    (round.entities ?? []).map(e => ({ ...e })),
        theme:       round.theme,
        // Legacy fields (unused in Phase 2 path but kept consistent):
        playerStart: { col: round.spawn.col, row: round.spawn.row },
        items:       [],
        enemies:     [],
        goalX:       cols - 1,
    };

    return new TileMap(stageData);
}

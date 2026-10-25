// owning agent: dev-lead
// TODO: Area 2 Stage 1 (the Switchback) builder. Per docs/briefs/phase4-area2-cast.md §1.
//
// 4 rounds (mirrors Area 1 Stage 1 structure). The climbing-zig-zag silhouette
// is approximated by slope tiles + flat platform sections at switchback corners.
// Mossplodder spawns reused at lower switchbacks; Cinderwisp introductions at
// the higher tier so the player meets the new Area 2 enemy as the terrain
// shifts from mossy to bare rock.
//
// Stage 2-1 ends with a stage_exit tile (nextStage = 2) — same convention as
// Area 1 stage_exit tiles.

import { TileMap, TILE_TYPES } from '../TileMap.js';
import { ROUND as r1 } from './round-2-1-1.js';
import { ROUND as r2 } from './round-2-1-2.js';
import { ROUND as r3 } from './round-2-1-3.js';
import { ROUND as r4 } from './round-2-1-4.js';

const STAGE_ROUNDS = [r1, r2, r3, r4];

const KIND_TO_TYPE = {
    flat:        TILE_TYPES.FLAT,
    slope_up_22: TILE_TYPES.SLOPE_UP_22,
    slope_up_45: TILE_TYPES.SLOPE_UP_45,
    slope_dn_22: TILE_TYPES.SLOPE_DN_22,
    slope_dn_45: TILE_TYPES.SLOPE_DN_45,
};

const TRIGGER_TO_TYPE = {
    mile_1:       TILE_TYPES.MILE_1,
    mile_2:       TILE_TYPES.MILE_2,
    mile_3:       TILE_TYPES.MILE_3,
    mile_4:       TILE_TYPES.MILE_4,
    cairn:        TILE_TYPES.CAIRN,
    stage_exit:   TILE_TYPES.STAGE_EXIT,
    boss_trigger: TILE_TYPES.BOSS_TRIGGER,
};

const HAZARD_TO_TYPE = {
    fire_low:     TILE_TYPES.FIRE_LOW,
    water_gap:    TILE_TYPES.WATER_GAP,
    crystal_vein: TILE_TYPES.CRYSTAL_VEIN,
};

export function buildStage1() {
    const rows = STAGE_ROUNDS[0].rows;
    const allColumns       = [];
    const allDecorations   = [];
    const allTriggers      = [];
    const allFires         = [];
    const allHazards       = [];
    const allEntities      = [];
    const roundBoundaries  = [];

    let colOffset = 0;
    for (let i = 0; i < STAGE_ROUNDS.length; i++) {
        const round = STAGE_ROUNDS[i];
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
        for (const h of round.hazards ?? []) {
            allHazards.push({ ...h, col: h.col + colOffset });
        }
        for (const e of round.entities ?? []) {
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
    for (const h of allHazards) {
        const hType = HAZARD_TO_TYPE[h.kind];
        if (hType == null) continue;
        const hRow = h.row - 1;
        if (hRow < 0 || hRow >= rows) continue;
        tileData.push([h.col, hRow, hType]);
    }
    for (const t of allTriggers) {
        const tType = TRIGGER_TO_TYPE[t.kind];
        if (tType == null) continue;
        const trRow = t.row - 1;
        if (trRow < 0 || trRow >= rows) continue;
        if (t.kind === 'stage_exit' && typeof t.nextStage === 'number') {
            tileData.push([t.col, trRow, tType, { nextStage: t.nextStage }]);
        } else {
            tileData.push([t.col, trRow, tType]);
        }
    }

    const stageData = {
        id:       'area2-stage1',
        cols:     totalCols,
        rows,
        tileData,
        decorations: allDecorations,
        spawn:       { ...STAGE_ROUNDS[0].spawn },
        entities:    allEntities,
        theme:       STAGE_ROUNDS[0].theme,
        playerStart: { col: STAGE_ROUNDS[0].spawn.col, row: STAGE_ROUNDS[0].spawn.row },
        items:       [],
        enemies:     [],
        goalX:       totalCols - 1,
    };

    const map = new TileMap(stageData);
    map.roundBoundaries = roundBoundaries;
    map.stageIndex      = 1;
    map.areaIndex       = 2;
    return map;
}

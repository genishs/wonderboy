// owning agent: dev-lead
// TODO: Area 2 Stage 3 (the Knifing) — narrow rock-gully with high enemy
// density. Per phase4-area2-cast.md §1. v1.0 ships a single-round stub.

import { TileMap, TILE_TYPES } from '../TileMap.js';

const FLAT = TILE_TYPES.FLAT;
const MILE_1 = TILE_TYPES.MILE_1;
const STAGE_EXIT = TILE_TYPES.STAGE_EXIT;

export function buildStage3() {
    const cols = 48;
    const rows = 12;
    const tileData = [];
    // Flat row 8 — gully floor.
    for (let c = 0; c < cols; c++) {
        tileData.push([c, 8, FLAT]);
        for (let r = 9; r < rows; r++) tileData.push([c, r, FLAT]);
    }
    tileData.push([3, 7, MILE_1]);
    tileData.push([44, 7, STAGE_EXIT, { nextStage: 4 }]);

    const stageData = {
        id: 'area2-stage3',
        cols, rows, tileData,
        decorations: [],
        spawn:       { col: 1, row: 8 },
        entities:    [
            // Mixed cast — Cinderwisp + Quarrywight + Skyhook (the brief's
            // intended peak-density stage; v1.0 ships a representative slice).
            { kind: 'cinderwisp',  col: 12, row: 3, dir: -1 },
            { kind: 'cinderwisp',  col: 26, row: 4, dir: -1 },
            { kind: 'quarrywight', col: 18, row: 8, dir: -1 },
            { kind: 'skyhook',     col: 32, row: 2, dir: -1 },
            // Flintchip mid-stage so the player can enter Stage 2-4 with the
            // option to use the 3-hatchet buff in the gully. Per cast brief §4.2
            // the buff clears on stage transition, so it won't carry into the boss.
            { kind: 'flintchip',   col: 36, row: 8 },
        ],
        theme:       'knifing',
        playerStart: { col: 1, row: 8 },
        items:       [],
        enemies:     [],
        goalX:       cols - 1,
    };

    const map = new TileMap(stageData);
    map.roundBoundaries = [0];
    map.stageIndex = 3;
    map.areaIndex  = 2;
    return map;
}

// owning agent: dev-lead
// TODO: Area 2 Stage 2 (the Beacon Walk) builder. Per phase4-area2-cast.md §1.
// Open ridge with cliff-fall hazards (one-tile-wide pits, fatal). One Sunpear
// pickup mid-stage at a beacon-tower wreck (col ~32 per brief §4.1).
//
// For v1.0 we ship a single-round stage (48 cols). The stage_exit at col 44
// links to Stage 2-3.

import { TileMap, TILE_TYPES } from '../TileMap.js';

const FLAT = TILE_TYPES.FLAT;
const WATER_GAP = TILE_TYPES.WATER_GAP;
const MILE_1 = TILE_TYPES.MILE_1;
const STAGE_EXIT = TILE_TYPES.STAGE_EXIT;

export function buildStage2() {
    const cols = 48;
    const rows = 12;
    const tileData = [];

    // Base floor: flat row 8, with 1-tile-wide cliff-fall pits every ~8 cols.
    // Hazard tile sits ONE row above the floor (matches Area 1 Stage 2 water_gap
    // convention). Pits are NOT solid below — the player falls through to the
    // off-screen-bottom death path.
    const pitCols = new Set([10, 18, 26, 34, 42]);
    for (let c = 0; c < cols; c++) {
        if (pitCols.has(c)) {
            // Hazard tile at row 7 (one above floor), no solid floor here.
            tileData.push([c, 7, WATER_GAP]);
            continue;
        }
        // Solid floor row 8 and everything below.
        tileData.push([c, 8, FLAT]);
        for (let r = 9; r < rows; r++) tileData.push([c, r, FLAT]);
    }

    // Mile-marker
    tileData.push([3, 7, MILE_1]);
    // Stage exit at col 44 → next stage 3
    tileData.push([44, 7, STAGE_EXIT, { nextStage: 3 }]);

    const stageData = {
        id:       'area2-stage2',
        cols, rows, tileData,
        decorations: [],
        spawn:       { col: 1, row: 8 },
        entities:    [
            // Sunpear pickup (best food in the run).
            { kind: 'sunpear', col: 22, row: 8 },
            // A few enemies along the ridge.
            { kind: 'cinderwisp',  col: 30, row: 3, dir: -1 },
            { kind: 'quarrywight', col: 38, row: 8, dir: -1 },
        ],
        theme:       'beaconwalk',
        playerStart: { col: 1, row: 8 },
        items:       [],
        enemies:     [],
        goalX:       cols - 1,
    };

    const map = new TileMap(stageData);
    map.roundBoundaries = [0];
    map.stageIndex = 2;
    map.areaIndex  = 2;
    return map;
}

// owning agent: dev-lead
// TODO: hand-coded one-screen Phase 1 test stage (16x12 tiles, no scroll).
//
// Layout (rows 0=top, 11=bottom; cols 0..15):
//   floor: rows 10-11 fully solid (ground)
//   left platform : row 7 cols 5-7  (one-way)
//   right platform: row 7 cols 11-13 (one-way)
//   player spawn  : col 1 row 9 (just above floor)
//   crawlspine A  : col 4  row 9
//   crawlspine B  : col 11 row 9
//   glassmoth     : col 8  drifting at altitude
//   sapling       : col 6  row 6 (sitting on left platform)

import { TileMap, TILE_TYPES } from './TileMap.js';

export const PHASE1_STAGE_DATA = {
    id: 'phase1-test',
    cols: 16,
    rows: 12,
    tileData: buildTiles(),
    items: [],
    enemies: [
        // [col, row, type, dir]
        [4,  9, 'crawlspine', -1],
        [11, 9, 'crawlspine',  1],
        [8,  3, 'glassmoth',   1], // drifts at altitude
        [6,  6, 'sapling',    -1], // on left platform; faces left initially
    ],
    playerStart: { col: 1, row: 9 },
    goalX: 99, // off-stage; phase 1 has no goal
};

export const buildPhase1TestMap = () => new TileMap(PHASE1_STAGE_DATA);

function buildTiles() {
    const tiles = [];
    const COLS = 16;

    // Solid floor rows 10 and 11
    for (let c = 0; c < COLS; c++) {
        tiles.push([c, 10, TILE_TYPES.GROUND]);
        tiles.push([c, 11, TILE_TYPES.GROUND]);
    }

    // Left one-way platform (row 7, cols 5..7)
    for (let c = 5; c <= 7; c++) tiles.push([c, 7, TILE_TYPES.PLATFORM]);

    // Right one-way platform (row 7, cols 11..13)
    for (let c = 11; c <= 13; c++) tiles.push([c, 7, TILE_TYPES.PLATFORM]);

    return tiles;
}

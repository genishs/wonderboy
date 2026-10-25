// owning agent: dev-lead
// TODO: hand-coded Phase 1 test stage (32x12 tiles, scrolls horizontally).
//
// Layout (rows 0=top, 11=bottom; cols 0..31):
//   floor: rows 10-11 fully solid (cols 0..31)
//   platform A (one-way) row 7  cols 5..7
//   platform B (one-way) row 7  cols 11..13
//   platform C (one-way) row 5  cols 12..14    (high middle)
//   platform D (one-way) row 7  cols 18..20
//   platform E (one-way) row 5  cols 23..25    (high right)
//   platform F (one-way) row 7  cols 27..29
//
// Spawns:
//   playerStart  : col 1, row 9
//   crawlspine   : col 5  row 9  dir +1
//   sapling      : col 6  row 6   (on platform A)
//   glassmoth    : col 14 row 3  dir +1
//   sapling      : col 19 row 6   (on platform D)
//   crawlspine   : col 22 row 9  dir -1
//   glassmoth    : col 26 row 3  dir -1
//
// Walls at col 0 and col 31 are implicit — Crawlspines turn at the canvas edge.

import { TileMap, TILE_TYPES } from './TileMap.js';

export const PHASE1_STAGE_DATA = {
    id: 'phase1-test',
    cols: 32,
    rows: 12,
    tileData: buildTiles(),
    items: [],
    enemies: [
        // [col, row, type, dir]
        [5,  9, 'crawlspine',  1],
        [6,  6, 'sapling',    -1], // on platform A
        [14, 3, 'glassmoth',   1], // mid-air drift, baseY ~ row 3
        [19, 6, 'sapling',     1], // on platform D
        [22, 9, 'crawlspine', -1],
        [26, 3, 'glassmoth',  -1], // mid-air drift on right
    ],
    playerStart: { col: 1, row: 9 },
    goalX: 99, // off-stage; phase 1 has no goal
};

export const buildPhase1TestMap = () => new TileMap(PHASE1_STAGE_DATA);

function buildTiles() {
    const tiles = [];
    const COLS = 32;

    // Solid floor rows 10 and 11 across the whole stage
    for (let c = 0; c < COLS; c++) {
        tiles.push([c, 10, TILE_TYPES.GROUND]);
        tiles.push([c, 11, TILE_TYPES.GROUND]);
    }

    // Platform A (one-way) row 7  cols 5..7
    for (let c = 5; c <= 7; c++) tiles.push([c, 7, TILE_TYPES.PLATFORM]);

    // Platform B (one-way) row 7  cols 11..13
    for (let c = 11; c <= 13; c++) tiles.push([c, 7, TILE_TYPES.PLATFORM]);

    // Platform C (one-way) row 5  cols 12..14   (high middle)
    for (let c = 12; c <= 14; c++) tiles.push([c, 5, TILE_TYPES.PLATFORM]);

    // Platform D (one-way) row 7  cols 18..20
    for (let c = 18; c <= 20; c++) tiles.push([c, 7, TILE_TYPES.PLATFORM]);

    // Platform E (one-way) row 5  cols 23..25   (high right)
    for (let c = 23; c <= 25; c++) tiles.push([c, 5, TILE_TYPES.PLATFORM]);

    // Platform F (one-way) row 7  cols 27..29
    for (let c = 27; c <= 29; c++) tiles.push([c, 7, TILE_TYPES.PLATFORM]);

    return tiles;
}

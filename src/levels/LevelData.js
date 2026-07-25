/**
 * Agent 4 (Level Design Analyst) owns this file.
 *
 * Tile format: [col, row, tileType]
 * Item format: [col, row, itemType]
 * Enemy format: [col, row, enemyType, dir]   dir: 1=right, -1=left
 *
 * TILE_TYPES:  0=empty  1=ground  2=platform  3=spike  4=water  5=bush  6=wall  7=ice  8=goal
 * ITEM_TYPES:  'apple' 'melon' 'cherry' 'skateboard' 'axe' 'angel_egg' 'devil_egg'
 * ENEMY_TYPES: 'snail' 'bee' 'cobra' 'frog' 'stone'
 *
 * Canvas is 768×576 px.  Tile = 48 px.  Visible area = 16 cols × 12 rows.
 * Each stage extends to stageData.cols tiles (scrolls horizontally).
 */

export const AREA_DATA = {
    // ──────────────────────────────────────────────────────────────────────
    1: {
        name:    'Area 1 — Green Forest',
        bgColor: '#5C94FC',
        music:   'area1',
        stages: [
            // ── Stage 1-1 ─────────────────────────────────────────────────
            {
                id:   '1-1',
                cols: 52,
                rows: 12,
                tileData: buildArea1Stage1(),
                items: [
                    [3,  9, 'apple'],
                    [6,  9, 'apple'],
                    [10, 8, 'melon'],
                    [14, 7, 'apple'],
                    [16, 8, 'skateboard'],
                    [20, 9, 'apple'],
                    [24, 9, 'apple'],
                    [29, 7, 'angel_egg'],
                    [33, 9, 'apple'],
                    [37, 9, 'melon'],
                    [42, 9, 'apple'],
                    [46, 9, 'apple'],
                    [50, 9, 'melon'],
                ],
                enemies: [
                    [7,  10, 'snail',  -1],
                    [12, 10, 'snail',  -1],
                    [18, 10, 'frog',    1],
                    [23, 10, 'snail',  -1],
                    [27, 10, 'cobra',  -1],
                    [32,  8, 'bee',     0],
                    [38, 10, 'snail',  -1],
                    [43, 10, 'cobra',  -1],
                    [48, 10, 'snail',  -1],
                ],
                playerStart: { col: 1, row: 10 },
                goalX: 51,
            },

            // ── Stage 1-2 ─────────────────────────────────────────────────
            {
                id:   '1-2',
                cols: 55,
                rows: 12,
                tileData: buildArea1Stage2(),
                items: [
                    // Fewer fruits — harder stage
                    [3,  9, 'apple'],
                    [9,  9, 'apple'],
                    // Angel eggs on elevated platforms (harder to reach)
                    [19, 6, 'angel_egg'],
                    [38, 5, 'angel_egg'],
                    [47, 6, 'angel_egg'],
                    // Scattered fruit
                    [24, 9, 'apple'],
                    [31, 9, 'melon'],
                    [44, 9, 'apple'],
                    [52, 9, 'apple'],
                ],
                enemies: [
                    // More enemies, harder types
                    [6,  10, 'snail',  -1],
                    [11, 10, 'snail',  -1],
                    [14, 10, 'cobra',  -1],
                    [20,  7, 'bee',     0],
                    [25, 10, 'snail',  -1],
                    [28, 10, 'cobra',   1],
                    [33, 10, 'snail',  -1],
                    [36, 10, 'frog',    1],
                    [40,  6, 'bee',    -1],
                    [43, 10, 'cobra',  -1],
                    [48, 10, 'snail',  -1],
                    [51, 10, 'snail',   1],
                ],
                playerStart: { col: 1, row: 9 },
                goalX: 54,
            },
        ]
    },
    // Areas 2–7: to be implemented by Agent 4 (Level Design Analyst)
    // Template:
    // 2: { name: 'Area 2 — ...', bgColor: '#...', music: 'area2', stages: [...] },
};

// ── Area 1 Stage 1 terrain builder ─────────────────────────────────────────
function buildArea1Stage1() {
    const tiles = [];
    const COLS = 52, ROWS = 12;

    // Solid ground base (rows 10 & 11)
    for (let c = 0; c < COLS; c++) {
        tiles.push([c, 10, 1]);
        tiles.push([c, 11, 1]);
    }

    // Raised hills (fill from hill top down to row 9 with ground)
    const hills = [
        [4, 9], [5, 9], [6, 9],
        [11, 8], [12, 8], [13, 8],
        [20, 9], [21, 9], [22, 9], [23, 9],
        [30, 8], [31, 8], [32, 8],
        [40, 9], [41, 9],
    ];
    for (const [c, r] of hills) {
        for (let row = r; row < 10; row++) tiles.push([c, row, 1]);
    }

    // One-way platforms
    const platforms = [
        [2, 8], [3, 8],
        [8, 7], [9, 7], [10, 7],
        [15, 8], [16, 8],
        [25, 7], [26, 7], [27, 7],
        [35, 8], [36, 8],
        [44, 7], [45, 7], [46, 7],
    ];
    for (const [c, r] of platforms) tiles.push([c, r, 2]);

    // Spikes
    tiles.push([14, 10, 3]);
    tiles.push([15, 10, 3]);
    tiles.push([28, 10, 3]);

    // Bush decorations on top of raised hills (type 5 = decorative, no collision)
    const bushes = [
        [4, 8],  [6, 8],           // first hill group
        [11, 7], [13, 7],          // second hill group
        [20, 8], [22, 8],          // third hill group (wide)
        [30, 7], [32, 7],          // fourth hill group
        [40, 8], [41, 8],          // fifth hill group
        // Extra bushes along ground level for atmosphere
        [1, 9],  [18, 9], [34, 9], [49, 9],
    ];
    for (const [c, r] of bushes) tiles.push([c, r, 5]);

    // Goal post
    tiles.push([51, 10, 8]);

    return tiles;
}

// ── Area 1 Stage 2 terrain builder ─────────────────────────────────────────
//
// Layout overview (cols 0–54, rows 0–11):
//   Ground base:   rows 10–11 everywhere except pit cols 16–20 (water/spikes)
//   Hills:         col 4–6 (r9), col 11–13 (r8), col 22–25 (r9), col 34–36 (r8), col 45–47 (r9)
//   Platforms:     [2,8] [8,7][9,7][10,7]  [18,7][19,7]  [27,7][28,7][29,7]
//                  [38,6][39,6]  [46,6][47,6][48,6]
//   Pit (water):   cols 16–20 row 11 (water); spikes cols 17–19 row 10
//   Wall:          col 32 rows 8–9 (wall obstacle)
//   Goal:          col 54 row 10
//
function buildArea1Stage2() {
    const tiles = [];
    const COLS = 55, ROWS = 12;

    // Solid ground base (rows 10 & 11) — skip pit area cols 16–20
    for (let c = 0; c < COLS; c++) {
        if (c >= 16 && c <= 20) {
            // Pit: water at bottom row, no ground row 10
            tiles.push([c, 11, 4]); // water
        } else {
            tiles.push([c, 10, 1]);
            tiles.push([c, 11, 1]);
        }
    }

    // Spikes inside/around pit
    tiles.push([17, 10, 3]);
    tiles.push([18, 10, 3]);
    tiles.push([19, 10, 3]);

    // Raised hills
    const hills = [
        [4, 9], [5, 9], [6, 9],
        [11, 8], [12, 8], [13, 8],
        [22, 9], [23, 9], [24, 9], [25, 9],
        [34, 8], [35, 8], [36, 8],
        [45, 9], [46, 9], [47, 9],
    ];
    for (const [c, r] of hills) {
        for (let row = r; row < 10; row++) tiles.push([c, row, 1]);
    }

    // One-way platforms — two sets at different heights for vertical challenge
    const platforms = [
        [2, 8], [3, 8],                        // near start — safe hop
        [8, 7], [9, 7], [10, 7],               // over early ground
        [18, 7], [19, 7],                       // escape platform above pit
        [27, 7], [28, 7], [29, 7],             // mid-stage elevation
        [38, 6], [39, 6],                       // higher platform for angel egg
        [46, 6], [47, 6], [48, 6],             // high platform near goal
    ];
    for (const [c, r] of platforms) tiles.push([c, r, 2]);

    // Wall obstacle — forces player to jump or go around
    tiles.push([32, 9, 6]);
    tiles.push([32, 8, 6]);

    // Additional spikes at chokepoints
    tiles.push([26, 10, 3]);   // spike just after hill exit
    tiles.push([41, 10, 3]);   // spike before final section
    tiles.push([42, 10, 3]);

    // Bush decorations on top of hills and ground
    const bushes = [
        [4, 8],  [6, 8],              // hill 1
        [11, 7], [13, 7],             // hill 2
        [22, 8], [25, 8],             // hill 3
        [34, 7], [36, 7],             // hill 4
        [45, 8], [47, 8],             // hill 5
        // Ground-level atmosphere
        [1, 9],  [30, 9], [50, 9],
    ];
    for (const [c, r] of bushes) tiles.push([c, r, 5]);

    // Goal post
    tiles.push([54, 10, 8]);

    return tiles;
}

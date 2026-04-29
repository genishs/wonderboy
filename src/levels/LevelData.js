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
            }
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

    // Goal post
    tiles.push([51, 10, 8]);

    return tiles;
}

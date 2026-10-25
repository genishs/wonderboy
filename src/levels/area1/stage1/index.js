/**
 * Wonder Boy (1986) - Stage Builder for Area 1: Village Outskirts
 * Original name: "Green Forest" → Renamed to "Village Outskirts"
 * 4 rounds with boss on round 4
 */

import { TileMap, TILE_TYPES } from '../TileMap.js';

// Round 1: Forest Entrance
const ROUND_1_DATA = {
    cols: 64,
    rows: 12,
    theme: 'forest',
    spawn: { col: 2, row: 9 },
    decorations: [
        { type: 'tree', col: 15, row: 8 },
        { type: 'tree', col: 22, row: 8 },
        { type: 'tree', col: 35, row: 8 },
        { type: 'tree', col: 48, row: 8 },
        { type: 'rock', col: 8, row: 10 },
        { type: 'rock', col: 28, row: 10 },
        { type: 'bush', col: 12, row: 10 },
        { type: 'bush', col: 32, row: 10 },
        { type: 'bush', col: 45, row: 10 }
    ],
    enemies: [
        { type: 'red_slime', col: 20, row: 9, patrol: [15, 25] },
        { type: 'red_slime', col: 35, row: 9, patrol: [30, 40] },
        { type: 'bat', col: 18, row: 6, patrol: [15, 22] },
        { type: 'bat', col: 40, row: 5, patrol: [35, 45] }
    ],
    items: [
        { type: 'fruit', col: 12, row: 7 },
        { type: 'fruit', col: 28, row: 7 },
        { type: 'fruit', col: 42, row: 7 }
    ],
    triggers: [
        { type: 'mile_1', col: 48, row: 10 }
    ],
    hazards: []
};

// Round 2: Forest Clearing
const ROUND_2_DATA = {
    cols: 64,
    rows: 12,
    theme: 'forest',
    spawn: { col: 2, row: 9 },
    decorations: [
        { type: 'tree', col: 12, row: 8 },
        { type: 'tree', col: 25, row: 8 },
        { type: 'tree', col: 38, row: 8 },
        { type: 'tree', col: 52, row: 8 },
        { type: 'bush', col: 18, row: 10 },
        { type: 'bush', col: 32, row: 10 },
        { type: 'bush', col: 46, row: 10 }
    ],
    enemies: [
        { type: 'scorpion', col: 22, row: 9, patrol: [18, 28] },
        { type: 'bat', col: 20, row: 5, patrol: [15, 25] },
        { type: 'bat', col: 35, row: 6, patrol: [30, 40] },
        { type: 'bat', col: 50, row: 4, patrol: [45, 55] }
    ],
    items: [
        { type: 'fruit', col: 15, row: 7 },
        { type: 'fruit', col: 30, row: 7 },
        { type: 'fruit', col: 45, row: 7 },
        { type: 'mushroom', col: 25, row: 10 }
    ],
    triggers: [
        { type: 'mile_2', col: 52, row: 10 }
    ],
    hazards: []
};

// Round 3: Forest Path
const ROUND_3_DATA = {
    cols: 64,
    rows: 12,
    theme: 'forest',
    spawn: { col: 2, row: 9 },
    decorations: [
        { type: 'tree', col: 10, row: 8 },
        { type: 'tree', col: 23, row: 8 },
        { type: 'tree', col: 36, row: 8 },
        { type: 'tree', col: 49, row: 8 },
        { type: 'rock', col: 16, row: 10 },
        { type: 'rock', col: 32, row: 10 },
        { type: 'rock', col: 48, row: 10 }
    ],
    enemies: [
        { type: 'red_slime', col: 18, row: 9, patrol: [14, 22] },
        { type: 'red_slime', col: 30, row: 9, patrol: [26, 34] },
        { type: 'scorpion', col: 42, row: 9, patrol: [38, 46] },
        { type: 'bat', col: 25, row: 5, patrol: [20, 30] }
    ],
    items: [
        { type: 'fruit', col: 14, row: 7 },
        { type: 'fruit', col: 30, row: 7 },
        { type: 'fruit', col: 46, row: 7 },
        { type: 'mushroom', col: 20, row: 10 },
        { type: 'mushroom', col: 40, row: 10 }
    ],
    triggers: [
        { type: 'mile_3', col: 56, row: 10 }
    ],
    hazards: []
};

// Round 4: Forest Edge (Boss)
const ROUND_4_DATA = {
    cols: 80,
    rows: 12,
    theme: 'forest',
    spawn: { col: 2, row: 9 },
    decorations: [
        { type: 'tree', col: 10, row: 8 },
        { type: 'tree', col: 22, row: 8 },
        { type: 'tree', col: 34, row: 8 },
        { type: 'tree', col: 46, row: 8 },
        { type: 'rock', col: 58, row: 10 },
        { type: 'rock', col: 65, row: 10 },
        { type: 'bush', col: 72, row: 10 }
    ],
    enemies: [
        { type: 'scorpion', col: 15, row: 9, patrol: [10, 20] },
        { type: 'bat', col: 20, row: 5, patrol: [15, 25] },
        { type: 'bat', col: 30, row: 6, patrol: [25, 35] },
        { type: 'bat', col: 40, row: 4, patrol: [35, 45] }
    ],
    items: [
        { type: 'fruit', col: 12, row: 7 },
        { type: 'fruit', col: 28, row: 7 },
        { type: 'fruit', col: 44, row: 7 }
    ],
    triggers: [
        { type: 'boss_trigger', col: 68, row: 10 },
        { type: 'mile_4', col: 78, row: 10 }
    ],
    hazards: []
};

export const AREA1_ROUNDS = [ROUND_1_DATA, ROUND_2_DATA, ROUND_3_DATA, ROUND_4_DATA];

export function buildArea1(stageIndex) {
    if (stageIndex < 1 || stageIndex > 4) return null;
    
    const roundIndex = stageIndex - 1;
    const roundData = AREA1_ROUNDS[roundIndex];
    
    const KIND_TO_TYPE = {
        flat: TILE_TYPES.FLAT,
        slope_up_22: TILE_TYPES.SLOPE_UP_22,
        slope_up_45: TILE_TYPES.SLOPE_UP_45,
        slope_dn_22: TILE_TYPES.SLOPE_DN_22,
        slope_dn_45: TILE_TYPES.SLOPE_DN_45,
    };

    const HAZARD_TO_TYPE = {
        fire_low: TILE_TYPES.FIRE_LOW,
        water_gap: TILE_TYPES.WATER_GAP,
        crystal_vein: TILE_TYPES.CRYSTAL_VEIN,
    };

    const tileData = [];
    
    // Build floor
    for (let c = 0; c < roundData.cols; c++) {
        const cell = roundData.columns?.[c];
        if (cell) {
            const surfaceType = KIND_TO_TYPE[cell.kind];
            if (surfaceType) {
                const sRow = cell.row;
                if (sRow >= 0 && sRow < roundData.rows) {
                    tileData.push([c, sRow, surfaceType]);
                }
                for (let r = sRow + 1; r < roundData.rows; r++) {
                    tileData.push([c, r, TILE_TYPES.FLAT]);
                }
            }
        }
    }

    // Add hazards
    for (const h of roundData.hazards ?? []) {
        const hType = HAZARD_TO_TYPE[h.kind];
        if (hType) {
            const hRow = h.row - 1;
            if (hRow >= 0 && hRow < roundData.rows) {
                tileData.push([h.col, hRow, hType]);
            }
        }
    }

    const stageData = {
        id: `area1-stage${stageIndex}`,
        cols: roundData.cols,
        rows: roundData.rows,
        tileData,
        decorations: roundData.decorations,
        spawn: { ...roundData.spawn },
        entities: roundData.enemies,
        theme: roundData.theme,
        playerStart: { col: roundData.spawn.col, row: roundData.spawn.row },
        items: roundData.items,
        enemies: roundData.enemies,
        goalX: roundData.cols - 1,
        mileTriggers: roundData.triggers?.filter(t => t.type.startsWith('mile_')) ?? []
    };

    const map = new TileMap(stageData);
    map.stageIndex = stageIndex;
    map.areaIndex = 1;
    
    return map;
}

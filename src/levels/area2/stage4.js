// owning agent: dev-lead
// TODO: Area 2 Stage 4 (the Reignward) — Reignwarden arena. Per
// docs/briefs/phase4-area2-cast.md §1 and §3.6.
//
// 8-10 col approach + 12 col arena. boss_trigger at the arena's first column
// fires BossSystem.beginFight (area-aware: BossSystem dispatches on
// boss.area, and AreaManager.areaIndex===2 routes to the Reignwarden branch).
// The arena has a solid right wall (mirror of Area 1 Stage 4).

import { TileMap, TILE_TYPES } from '../TileMap.js';
import { BOSS_ARENA } from '../../config/PhaseThreeTunables.js';

const FLAT = TILE_TYPES.FLAT;
const WALL = TILE_TYPES.WALL;
const MILE_1 = TILE_TYPES.MILE_1;
const BOSS_TRIGGER = TILE_TYPES.BOSS_TRIGGER;

export function buildStage4() {
    // 10-col anteroom + 12-col arena = 22 cols total. Floor row 8.
    const anteroomCols = 10;
    const arenaWidth   = BOSS_ARENA.widthTiles;   // 12
    const cols = anteroomCols + arenaWidth;
    const rows = 12;
    const arenaCol0 = anteroomCols;               // boss_trigger col
    const floorRow  = 8;

    const tileData = [];
    for (let c = 0; c < cols; c++) {
        tileData.push([c, floorRow, FLAT]);
        for (let r = floorRow + 1; r < rows; r++) tileData.push([c, r, FLAT]);
    }
    // Mile-marker at the start.
    tileData.push([3, floorRow - 1, MILE_1]);
    // Boss trigger at the arena's first column (one row above the floor).
    tileData.push([arenaCol0, floorRow - 1, BOSS_TRIGGER]);
    // Solid right wall to pin the boss.
    const wallCol = arenaCol0 + arenaWidth - 1;
    for (let r = 0; r < rows; r++) {
        tileData.push([wallCol, r, WALL]);
    }

    const stageData = {
        id:       'area2-stage4',
        cols, rows, tileData,
        decorations: [],
        spawn:       { col: 1, row: floorRow },
        entities:    [],
        theme:       'reignward',
        playerStart: { col: 1, row: floorRow },
        items:       [],
        enemies:     [],
        goalX:       cols - 1,
    };

    const map = new TileMap(stageData);
    map.roundBoundaries = [0];
    map.stageIndex = 4;
    map.areaIndex  = 2;
    map.bossArenaCol0     = arenaCol0;
    map.bossArenaCol1     = arenaCol0 + arenaWidth - 1;
    map.bossArenaFloorRow = floorRow;
    return map;
}

// owning agent: dev-lead
// TODO: Stage 4 (The Old Threshold — dark forest) builder.
// Concatenates rounds 4-1..4-4 + appends a 12-col boss arena at the end.
// Per docs/briefs/phase3-area1-expansion.md §7-§8 + plan §1.3.
//
// Stage 4 is short by design: rounds total ~152 cols; arena adds 12 more.
// The arena spans cols [arenaCol0 .. arenaCol0+11] inclusive. The rightmost
// col (arenaCol0+11) is a solid WALL stack (full 11 rows tall) — Reed cannot
// push past it; the Bracken Warden is pinned with no retreat. BOSS_TRIGGER
// is placed by round-4-4 at its col 32 (rel) = arenaCol0 (global), so
// crossing it fires both the camera lock AND the boss spawn.
//
// No stage_exit, no cairn. Stage 4's terminal beat = boss death (BossSystem
// fires AREA_CLEARED), so the round modules omit those triggers.

import { TileMap, TILE_TYPES } from '../../TileMap.js';
import { BOSS_ARENA } from '../../../config/PhaseThreeTunables.js';
import { ROUND as r1 } from './round-4-1.js';
import { ROUND as r2 } from './round-4-2.js';
import { ROUND as r3 } from './round-4-3.js';
import { ROUND as r4 } from './round-4-4.js';

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

export function buildStage4() {
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
    const roundsEndCol = colOffset;

    // ── Boss arena extension ────────────────────────────────────────────────
    // Append 12 cols of flat floor at row 9 (mirrors round-4-4's spawn/floor
    // row 9 — the anteroom plateau is at row 7 but tapers DOWN into the arena
    // at row 9 so the boss sits on a clean floor). Actually round-4-4 ends at
    // row 7. To keep the boss arena floor at a stable row aligned with the
    // anteroom approach, place the arena floor at row 9 (the lowest row Reed
    // walks at in this stage). That means the arena floor is one tile lower
    // than the anteroom's plateau end — Reed visually steps down into the
    // arena, which is consistent with "the wood narrows" + "canopy parts."
    //
    // For simplicity we ramp from row 7 to row 9 within the first arena column
    // by treating it as a slope. But that complicates the boss-trigger col
    // semantics. Cleaner: the boss arena floor stays at row 9, and the entry
    // step is a single-tile drop (Reed falls 2 tiles into the arena entry).
    // Reed's existing gravity + collision handles this cleanly.
    const arenaCol0       = roundsEndCol;
    const arenaWidth      = BOSS_ARENA.widthTiles;        // 12
    const arenaFloorRow   = 9;
    const rightWallRelCol = BOSS_ARENA.rightWallRelCol;    // 11 (last arena col)

    // Build the arena floor: every arena column gets a flat surface at
    // arenaFloorRow, with FLAT fill below. The right-wall column's FLAT
    // entries (rows 0..rows-1) are overwritten by explicit WALL pushes below.
    for (let i = 0; i < arenaWidth; i++) {
        allColumns.push({ kind: 'flat', row: arenaFloorRow });
    }
    const totalCols = arenaCol0 + arenaWidth;

    // ── Emit tile data ──────────────────────────────────────────────────────
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
    // Right-wall column: stack WALL tiles for the full stage height (rows 0..rows-1).
    // The loop above pushed FLAT for the right-wall column too; pushing WALL after
    // those entries overwrites them in TileMap's constructor (last write wins).
    const wallCol = arenaCol0 + rightWallRelCol;
    for (let r = 0; r < rows; r++) {
        tileData.push([wallCol, r, TILE_TYPES.WALL]);
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
        id:       'area1-stage4',
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
    map.stageIndex      = 4;
    // v0.75 — surface the arena's global col bounds so BossSystem + LevelManager
    // can compute the camera-lock x and arena-left-edge px without re-deriving
    // from BOSS_ARENA constants + roundBoundaries.
    map.bossArenaCol0   = arenaCol0;
    map.bossArenaCol1   = arenaCol0 + arenaWidth - 1;
    map.bossArenaFloorRow = arenaFloorRow;
    return map;
}

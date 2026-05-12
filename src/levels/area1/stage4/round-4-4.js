// owning agent: dev-lead
// TODO: Round 4-4 — "The Moonlit Path". Per docs/briefs/phase3-area1-expansion.md §7.4.
// ~32 cols of anteroom + a 12-col boss-arena extension appended by stage4/index.js.
//
// This module ships the anteroom (cols 0..31) plus the BOSS_TRIGGER tile at
// col 32 (the camera-lock + boss-spawn event). The arena tiles (cols 32..43
// floor + cols 43 right wall) are added by stage4/index.js after concatenation.
//
// No stage_exit, no cairn — Stage 4's terminal beat is the Bracken Warden's
// death + AREA_CLEARED overlay (handled by BossSystem, not a level-data tile).

const flat   = (row) => ({ kind: 'flat',          row });
const upGen  = (row) => ({ kind: 'slope_up_22',   row });

const COLUMNS = [];
// cols 0-3: flat row 9 (spawn / mile_16 area)
for (let c = 0; c < 4; c++) COLUMNS.push(flat(9));
// col 4: gentle uphill (row 9 → row 8)
COLUMNS.push(upGen(8));
// cols 5-11: flat row 8 (moonlit path visible)
for (let c = 0; c < 7; c++) COLUMNS.push(flat(8));
// cols 12-15: flat row 8 (continued)
for (let c = 0; c < 4; c++) COLUMNS.push(flat(8));
// col 16: gentle uphill (row 8 → row 7)
COLUMNS.push(upGen(7));
// cols 17-19: flat row 7
for (let c = 0; c < 3; c++) COLUMNS.push(flat(7));
// cols 20-23: flat row 7 (anteroom plateau — canopy thins)
for (let c = 0; c < 4; c++) COLUMNS.push(flat(7));
// cols 24-31: flat row 7 (approach to boss arena)
for (let c = 0; c < 8; c++) COLUMNS.push(flat(7));

// Total cols here = 32. Stage 4 builder appends 12 arena cols + a right wall.

export const ROUND = Object.freeze({
    id:    '4-4',
    cols:  32,
    rows:  12,
    theme: 'darkforest',
    columns: COLUMNS,
    decorations: [
        { col: 16, row: 7, kind: 'rock_small' },     // root-knot
        // Long unbroken moonlight path along the anteroom floor.
        { col:  8, row: 8, kind: 'moonlight_streak' },
        { col: 13, row: 8, kind: 'moonlight_streak' },
        { col: 19, row: 7, kind: 'moonlight_streak' },
        { col: 24, row: 7, kind: 'moonlight_streak' },
        { col: 30, row: 7, kind: 'moonlight_streak' },
    ],
    triggers: [
        { col: 3, row: 9, kind: 'mile_4' },          // → "Round 4" (mile_16 globally)
        // v0.75 — boss arena entry trigger. One-shot (TileMap _consumed flag).
        // TriggerSystem fires BossSystem.beginFight() + AreaManager.lockCamera().
        { col: 32, row: 7, kind: 'boss_trigger' },
    ],
    fires: [],
    hazards: [],
    spawn:    { col: 1, row: 9 },
    entities: [
        { kind: 'mossplodder', col: 10, row: 8, dir: -1 },
        { kind: 'mossplodder', col: 22, row: 7, dir: -1 },
    ],
});

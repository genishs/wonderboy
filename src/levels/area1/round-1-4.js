// owning agent: dev-lead
// TODO: Round 1-4 — "To the Boundary". Per docs/briefs/phase2-areas.md §7.
// 64 columns; synthesis round; alternating crest-and-valley + right-facing
// Mossplodder; ends in boundary cairn.
// Slope-tile convention: see round-1-1.js header.

const flat   = (row) => ({ kind: 'flat',          row });
const upGen  = (row) => ({ kind: 'slope_up_22',   row });
const upStp  = (row) => ({ kind: 'slope_up_45',   row });
const dnGen  = (row) => ({ kind: 'slope_dn_22',   row });
const dnStp  = (row) => ({ kind: 'slope_dn_45',   row });

const COLUMNS = [];
// cols 0-5: flat row 9 (spawn)
for (let c = 0; c < 6; c++) COLUMNS.push(flat(9));
// col 6: gentle uphill (row 9 → row 8)
COLUMNS.push(upGen(8));
// cols 7-12: flat crest #1 row 8
for (let c = 0; c < 6; c++) COLUMNS.push(flat(8));
// col 13: gentle downhill (row 8 → row 9)
COLUMNS.push(dnGen(9));
// cols 14-16: flat row 9
for (let c = 0; c < 3; c++) COLUMNS.push(flat(9));
// cols 17-18: gap (2 tiles)
for (let c = 0; c < 2; c++) COLUMNS.push(null);
// cols 19-23: flat valley #1 row 9
for (let c = 0; c < 5; c++) COLUMNS.push(flat(9));
// col 24: gentle uphill (row 9 → row 8)
COLUMNS.push(upGen(8));
// cols 25-27: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// col 28: steep uphill (row 8 → row 7)
COLUMNS.push(upStp(7));
// cols 29-35: flat crest #2 row 7
for (let c = 0; c < 7; c++) COLUMNS.push(flat(7));
// col 36: steep downhill (row 7 → row 8)
COLUMNS.push(dnStp(8));
// cols 37-39: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// cols 40-42: gap (3 tiles)
for (let c = 0; c < 3; c++) COLUMNS.push(null);
// cols 43-47: flat valley #2 row 9 (right-facing Mossplodder lives here)
for (let c = 0; c < 5; c++) COLUMNS.push(flat(9));
// col 48: gentle uphill (row 9 → row 8)
COLUMNS.push(upGen(8));
// cols 49-54: flat crest #3 row 8 (cairn approach)
for (let c = 0; c < 6; c++) COLUMNS.push(flat(8));
// col 55: gentle downhill (row 8 → row 9)
COLUMNS.push(dnGen(9));
// cols 56-59: flat row 9
for (let c = 0; c < 4; c++) COLUMNS.push(flat(9));
// cols 60-61: gap (2 tiles)
for (let c = 0; c < 2; c++) COLUMNS.push(null);
// cols 62-63: flat row 9 (cairn)
for (let c = 0; c < 2; c++) COLUMNS.push(flat(9));

export const ROUND = Object.freeze({
    id:    '1-4',
    cols:  64,
    rows:  12,
    theme: 'forest',
    columns: COLUMNS,
    decorations: [
        { col: 21, row: 9, kind: 'rock_small' },
        { col: 44, row: 9, kind: 'rock_small' },
        { col: 53, row: 8, kind: 'rock_small' },
    ],
    triggers: [
        // v0.50.2 — Round 4 sign at the START of round-1-4 (NEW; uses mile_4 tile
        // shipped by design-lead in PR #22).
        { col: 2, row: 9, kind: 'mile_4' },
        // v0.75 — final tile changed from `cairn` (Stage Cleared) to `stage_exit`
        // with nextStage=2. Walking into it fires AreaManager.beginStageTransition(2)
        // → fade-out → swap → "Stage 2 — Sumphollow" overlay → fade-in.
        { col: 63, row: 9, kind: 'stage_exit', nextStage: 2 },
    ],
    fires: [
        { col: 33, row: 7 },     // on the steep crest plateau
        { col: 50, row: 8 },     // on the cairn-approach crest
    ],
    spawn: { col: 1, row: 9 },
    entities: [
        { kind: 'dawn-husk',   col: 4,  row: 9 },
        { kind: 'mossplodder', col: 11, row: 8, dir: -1 },  // crest #1
        { kind: 'mossplodder', col: 22, row: 9, dir: -1 },  // valley #1
        { kind: 'mossplodder', col: 38, row: 8, dir: -1 },  // post-steep-descent
        { kind: 'mossplodder', col: 52, row: 8, dir: -1 },  // crest #3
        { kind: 'mossplodder', col: 47, row: 9, dir: 1 },   // RIGHT-facing — synthesis beat
        { kind: 'hummerwing',  col: 18, row: 8, dir: -1 },
        { kind: 'hummerwing',  col: 32, row: 7, dir: -1 },
        { kind: 'hummerwing',  col: 58, row: 8, dir: -1 },
        // v0.75.1 — amberfig (rare +50) on crest #2 row 7 (cols 29-35 are flat
        // row 7). Placed at col 30 — between the steep climb at col 28 and
        // the fire at col 33, so the reach feels like a choice: jump up to
        // the crest, grab the fruit, jump back down past the fire.
        { kind: 'amberfig',    col: 30, row: 7 },
    ],
});

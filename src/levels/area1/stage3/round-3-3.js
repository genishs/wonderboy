// owning agent: dev-lead
// TODO: Round 3-3 — "The Warm Pocket". Per docs/briefs/phase3-area1-expansion.md §6.3.
// 48 columns; density round — warm-pocket plateau with two crystal_vein hazards.

const flat   = (row) => ({ kind: 'flat',          row });
const upGen  = (row) => ({ kind: 'slope_up_22',   row });
const upStp  = (row) => ({ kind: 'slope_up_45',   row });
const dnGen  = (row) => ({ kind: 'slope_dn_22',   row });

const COLUMNS = [];
// cols 0-3: flat (spawn-after-mile_2)
for (let c = 0; c < 4; c++) COLUMNS.push(flat(9));
// cols 4-6: cave-gap pool (3 tiles) — mandatory jump
for (let c = 0; c < 3; c++) COLUMNS.push(null);
// col 7: gentle uphill
COLUMNS.push(upGen(8));
// cols 8-9: flat row 8
for (let c = 0; c < 2; c++) COLUMNS.push(flat(8));
// col 10: steep uphill (row 8 → row 7)
COLUMNS.push(upStp(7));
// cols 11-33: flat plateau row 7 (warm-pocket combat zone)
for (let c = 0; c < 23; c++) COLUMNS.push(flat(7));
// col 34: gentle downhill (row 7 → row 8)
COLUMNS.push(dnGen(8));
// cols 35-37: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// cols 38-41: cave-gap pool (more cols of fall — closes round-3-3 with a pool jump)
for (let c = 0; c < 4; c++) COLUMNS.push(null);
// cols 42-47: flat row 9 (round end)
for (let c = 0; c < 6; c++) COLUMNS.push(flat(9));

export const ROUND = Object.freeze({
    id:    '3-3',
    cols:  48,
    rows:  12,
    theme: 'cave',
    columns: COLUMNS,
    decorations: [
        { col: 21, row: 7, kind: 'rock_small' },   // pins col-22 Mossplodder
        { col: 33, row: 7, kind: 'rock_small' },
    ],
    triggers: [
        { col: 3, row: 9, kind: 'mile_3' },
    ],
    fires: [],
    hazards: [
        { col: 16, row: 7, kind: 'crystal_vein' },
        { col: 26, row: 7, kind: 'crystal_vein' },
    ],
    spawn:    { col: 1, row: 9 },
    entities: [
        { kind: 'mossplodder', col: 16, row: 7, dir: -1 },
        { kind: 'mossplodder', col: 22, row: 7, dir: -1 },  // rock-pinned at col 21
        { kind: 'mossplodder', col: 28, row: 7, dir: -1 },
        { kind: 'hummerwing',  col: 18, row: 7, dir: -1 },
        { kind: 'hummerwing',  col: 30, row: 7, dir: -1 },
    ],
});

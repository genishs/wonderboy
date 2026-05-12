// owning agent: dev-lead
// TODO: Round 3-2 — "Stepping Stones". Per docs/briefs/phase3-area1-expansion.md §6.2.
// 64 columns; Stage 3 hard beat — four cave-gap-pools + first crystal_vein hazard.

const flat   = (row) => ({ kind: 'flat',          row });
const upGen  = (row) => ({ kind: 'slope_up_22',   row });
const dnGen  = (row) => ({ kind: 'slope_dn_22',   row });

const COLUMNS = [];
// cols 0-5: flat row 9 (spawn-after-mile_1)
for (let c = 0; c < 6; c++) COLUMNS.push(flat(9));
// cols 6-9: flat shelf
for (let c = 0; c < 4; c++) COLUMNS.push(flat(9));
// cols 10-12: cave-gap pool (3 tiles)
for (let c = 0; c < 3; c++) COLUMNS.push(null);
// cols 13-17: flat shelf
for (let c = 0; c < 5; c++) COLUMNS.push(flat(9));
// cols 18-20: cave-gap pool (3 tiles)
for (let c = 0; c < 3; c++) COLUMNS.push(null);
// cols 21-24: flat shelf
for (let c = 0; c < 4; c++) COLUMNS.push(flat(9));
// cols 25-27: cave-gap pool (3 tiles)
for (let c = 0; c < 3; c++) COLUMNS.push(null);
// cols 28-33: flat shelf
for (let c = 0; c < 6; c++) COLUMNS.push(flat(9));
// col 34: gentle uphill (row 9 → row 8)
COLUMNS.push(upGen(8));
// cols 35-37: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// cols 38-41: flat crest (contains crystal_vein at col 38)
for (let c = 0; c < 4; c++) COLUMNS.push(flat(8));
// col 42: gentle downhill (row 8 → row 9)
COLUMNS.push(dnGen(9));
// cols 43-44: flat row 9
for (let c = 0; c < 2; c++) COLUMNS.push(flat(9));
// cols 45-47: cave-gap pool (3 tiles)
for (let c = 0; c < 3; c++) COLUMNS.push(null);
// cols 48-53: flat shelf
for (let c = 0; c < 6; c++) COLUMNS.push(flat(9));
// col 54: gentle uphill (row 9 → row 8)
COLUMNS.push(upGen(8));
// cols 55-57: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// cols 58-63: flat row 8 (round end)
for (let c = 0; c < 6; c++) COLUMNS.push(flat(8));

export const ROUND = Object.freeze({
    id:    '3-2',
    cols:  64,
    rows:  12,
    theme: 'cave',
    columns: COLUMNS,
    decorations: [
        { col: 32, row: 9, kind: 'rock_small' },
        { col: 53, row: 9, kind: 'rock_small' },
    ],
    triggers: [
        { col: 3, row: 9, kind: 'mile_2' },
    ],
    fires: [],
    hazards: [
        { col: 38, row: 8, kind: 'crystal_vein' },
    ],
    spawn:    { col: 1, row: 9 },
    entities: [
        { kind: 'mossplodder', col: 16, row: 9, dir: -1 },
        { kind: 'mossplodder', col: 24, row: 9, dir: -1 },
        { kind: 'mossplodder', col: 32, row: 9, dir: -1 },
        { kind: 'hummerwing',  col: 14, row: 9, dir: -1 },
        { kind: 'hummerwing',  col: 46, row: 8, dir: -1 },
    ],
});

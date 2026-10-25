// owning agent: dev-lead
// TODO: Round 3-4 — "To the Stair". Per docs/briefs/phase3-area1-expansion.md §6.4.
// 64 columns; synthesis round, ends in stage_exit (nextStage = 4 → Old Threshold).

const flat   = (row) => ({ kind: 'flat',          row });
const upGen  = (row) => ({ kind: 'slope_up_22',   row });
const upStp  = (row) => ({ kind: 'slope_up_45',   row });
const dnGen  = (row) => ({ kind: 'slope_dn_22',   row });
const dnStp  = (row) => ({ kind: 'slope_dn_45',   row });

const COLUMNS = [];
// cols 0-5: flat row 9 (spawn-after-mile_3)
for (let c = 0; c < 6; c++) COLUMNS.push(flat(9));
// col 6: gentle uphill (row 9 → row 8)
COLUMNS.push(upGen(8));
// cols 7-9: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// cols 10-13: flat shelf #1
for (let c = 0; c < 4; c++) COLUMNS.push(flat(8));
// col 14: gentle downhill (row 8 → row 9)
COLUMNS.push(dnGen(9));
// cols 15-16: flat row 9
for (let c = 0; c < 2; c++) COLUMNS.push(flat(9));
// cols 17-19: cave-gap pool (3 tiles)
for (let c = 0; c < 3; c++) COLUMNS.push(null);
// cols 20-24: flat shelf #2
for (let c = 0; c < 5; c++) COLUMNS.push(flat(9));
// col 25: gentle uphill (row 9 → row 8)
COLUMNS.push(upGen(8));
// cols 26-28: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// col 29: steep uphill (row 8 → row 7)
COLUMNS.push(upStp(7));
// cols 30-32: flat row 7
for (let c = 0; c < 3; c++) COLUMNS.push(flat(7));
// cols 33-36: flat shelf #3
for (let c = 0; c < 4; c++) COLUMNS.push(flat(7));
// col 37: steep downhill (row 7 → row 8)
COLUMNS.push(dnStp(8));
// cols 38-40: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// cols 41-43: cave-gap pool (3 tiles)
for (let c = 0; c < 3; c++) COLUMNS.push(null);
// cols 44-48: flat shelf #4
for (let c = 0; c < 5; c++) COLUMNS.push(flat(9));
// col 49: gentle uphill (row 9 → row 8)
COLUMNS.push(upGen(8));
// cols 50-52: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// cols 53-56: flat shelf #5 (transition approach)
for (let c = 0; c < 4; c++) COLUMNS.push(flat(8));
// col 57: gentle downhill (row 8 → row 9)
COLUMNS.push(dnGen(9));
// cols 58-60: flat row 9
for (let c = 0; c < 3; c++) COLUMNS.push(flat(9));
// col 61: cave-gap pool (narrow 1-tile token jump)
COLUMNS.push(null);
// cols 62-63: flat row 9 (stage_exit tile here)
for (let c = 0; c < 2; c++) COLUMNS.push(flat(9));

export const ROUND = Object.freeze({
    id:    '3-4',
    cols:  64,
    rows:  12,
    theme: 'cave',
    columns: COLUMNS,
    decorations: [
        { col: 26, row: 8, kind: 'rock_small' },
        { col: 50, row: 8, kind: 'rock_small' },
    ],
    triggers: [
        { col: 3, row: 9, kind: 'mile_4' },
        // v0.75 — stage_exit at col 63 carries nextStage=4 (→ The Old Threshold).
        { col: 63, row: 9, kind: 'stage_exit', nextStage: 4 },
    ],
    fires: [],
    hazards: [
        { col: 35, row: 7, kind: 'crystal_vein' },
    ],
    spawn:    { col: 1, row: 9 },
    entities: [
        { kind: 'mossplodder', col: 12, row: 8, dir: -1 },
        { kind: 'mossplodder', col: 22, row: 9, dir: -1 },
        { kind: 'mossplodder', col: 36, row: 7, dir: -1 },
        { kind: 'mossplodder', col: 45, row: 9, dir: 1 },      // right-facing
        { kind: 'hummerwing',  col: 16, row: 8, dir: -1 },
        { kind: 'hummerwing',  col: 32, row: 7, dir: -1 },
        { kind: 'hummerwing',  col: 58, row: 9, dir: -1 },
        // v0.75.1 — Threadshade between the cave-gap-pool zone and the post-
        // pool shelf (story brief §16.6: "above a gap; player must jump AND
        // time the Threadshade's swing"). col 28 is mid-shelf row 8.
        { kind: 'threadshade', col: 28, row: 3 },
    ],
});

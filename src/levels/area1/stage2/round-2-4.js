// owning agent: dev-lead
// TODO: Round 2-4 — "To the Brink". Per docs/briefs/phase3-area1-expansion.md §5.4.
// 64 columns; synthesis round, ends in stage_exit tile (nextStage = 3 → Stage 3
// Brinklane).

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
// cols 10-13: flat crest #1
for (let c = 0; c < 4; c++) COLUMNS.push(flat(8));
// col 14: gentle downhill (row 8 → row 9)
COLUMNS.push(dnGen(9));
// cols 15-16: flat row 9
for (let c = 0; c < 2; c++) COLUMNS.push(flat(9));
// cols 17-18: gap (2 tiles)
for (let c = 0; c < 2; c++) COLUMNS.push(null);
// cols 19-23: flat valley #1
for (let c = 0; c < 5; c++) COLUMNS.push(flat(9));
// col 24: gentle uphill (row 9 → row 8)
COLUMNS.push(upGen(8));
// cols 25-27: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// col 28: steep uphill (row 8 → row 7)
COLUMNS.push(upStp(7));
// cols 29-31: flat row 7
for (let c = 0; c < 3; c++) COLUMNS.push(flat(7));
// cols 32-35: flat crest #2
for (let c = 0; c < 4; c++) COLUMNS.push(flat(7));
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
// cols 49-51: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// cols 52-55: flat crest #3
for (let c = 0; c < 4; c++) COLUMNS.push(flat(8));
// col 56: gentle downhill (row 8 → row 9)
COLUMNS.push(dnGen(9));
// cols 57-59: flat row 9
for (let c = 0; c < 3; c++) COLUMNS.push(flat(9));
// cols 60-61: gap (2 tiles)
for (let c = 0; c < 2; c++) COLUMNS.push(null);
// cols 62-63: flat row 9 (transition tile)
for (let c = 0; c < 2; c++) COLUMNS.push(flat(9));

export const ROUND = Object.freeze({
    id:    '2-4',
    cols:  64,
    rows:  12,
    theme: 'shore',
    columns: COLUMNS,
    decorations: [
        { col: 44, row: 9, kind: 'rock_small' },
        { col: 55, row: 8, kind: 'rock_small' },
    ],
    triggers: [
        { col: 3, row: 9, kind: 'mile_4' },                    // → "Round 4"
        // v0.75 — stage_exit at col 63 carries nextStage=3 (→ Brinklane).
        { col: 63, row: 9, kind: 'stage_exit', nextStage: 3 },
    ],
    fires: [],
    hazards: [
        { col: 50, row: 8, kind: 'water_gap' },
    ],
    spawn:    { col: 1, row: 9 },
    entities: [
        { kind: 'mossplodder', col: 12, row: 8, dir: -1 },
        { kind: 'mossplodder', col: 22, row: 9, dir: -1 },
        { kind: 'mossplodder', col: 38, row: 8, dir: -1 },
        { kind: 'mossplodder', col: 54, row: 8, dir: -1 },
        { kind: 'mossplodder', col: 47, row: 9, dir: 1 },      // right-facing synthesis beat
        { kind: 'hummerwing',  col: 20, row: 8, dir: -1 },
        { kind: 'hummerwing',  col: 58, row: 8, dir: -1 },
    ],
});

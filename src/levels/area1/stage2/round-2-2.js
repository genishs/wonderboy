// owning agent: dev-lead
// TODO: Round 2-2 — "The Warm Surf". Per docs/briefs/phase3-area1-expansion.md §5.2.
// 64 columns; doubled-valley puzzle with two water_gap hazards + first
// shore-Hummerwings.

const flat   = (row) => ({ kind: 'flat',          row });
const upGen  = (row) => ({ kind: 'slope_up_22',   row });
const dnGen  = (row) => ({ kind: 'slope_dn_22',   row });

const COLUMNS = [];
// cols 0-5: flat row 9 (spawn-after-mile_1)
for (let c = 0; c < 6; c++) COLUMNS.push(flat(9));
// col 6: gentle uphill (row 9 → row 8)
COLUMNS.push(upGen(8));
// cols 7-9: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// cols 10-13: flat crest
for (let c = 0; c < 4; c++) COLUMNS.push(flat(8));
// col 14: gentle downhill (row 8 → row 9)
COLUMNS.push(dnGen(9));
// cols 15-16: flat row 9
for (let c = 0; c < 2; c++) COLUMNS.push(flat(9));
// cols 17-18: gap (2 tiles)
for (let c = 0; c < 2; c++) COLUMNS.push(null);
// cols 19-24: flat valley row 9 (contains first water_gap hazard)
for (let c = 0; c < 6; c++) COLUMNS.push(flat(9));
// col 25: gentle uphill (row 9 → row 8)
COLUMNS.push(upGen(8));
// cols 26-28: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// cols 29-32: flat crest #2
for (let c = 0; c < 4; c++) COLUMNS.push(flat(8));
// col 33: gentle downhill (row 8 → row 9)
COLUMNS.push(dnGen(9));
// cols 34-36: flat row 9
for (let c = 0; c < 3; c++) COLUMNS.push(flat(9));
// cols 37-39: gap (3 tiles)
for (let c = 0; c < 3; c++) COLUMNS.push(null);
// cols 40-45: flat row 9 (second water_gap)
for (let c = 0; c < 6; c++) COLUMNS.push(flat(9));
// col 46: gentle uphill (row 9 → row 8)
COLUMNS.push(upGen(8));
// cols 47-49: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// cols 50-63: flat row 8 (final stretch to round end)
for (let c = 0; c < 14; c++) COLUMNS.push(flat(8));

export const ROUND = Object.freeze({
    id:    '2-2',
    cols:  64,
    rows:  12,
    theme: 'shore',
    columns: COLUMNS,
    decorations: [
        { col: 27, row: 8, kind: 'rock_small' },
        { col: 48, row: 8, kind: 'rock_small' },
    ],
    triggers: [
        { col: 3, row: 9, kind: 'mile_2' },        // → renderer maps to "Round 2"
    ],
    fires: [],
    hazards: [
        { col: 21, row: 9, kind: 'water_gap' },
        { col: 43, row: 9, kind: 'water_gap' },
    ],
    spawn:    { col: 1, row: 9 },
    entities: [
        { kind: 'mossplodder', col: 12, row: 8, dir: -1 },
        { kind: 'mossplodder', col: 30, row: 8, dir: -1 },
        { kind: 'hummerwing',  col: 22, row: 8, dir: -1 },
        { kind: 'hummerwing',  col: 44, row: 8, dir: -1 },
        // v0.75.1 — dewplum on dune crest #2 row 8 (cols 26-32 are flat row 8;
        // brief §15.2 suggests "second dune crest just past first tidal_edge").
        { kind: 'dewplum',     col: 28, row: 8 },
    ],
});

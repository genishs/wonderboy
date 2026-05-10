// owning agent: dev-lead
// TODO: Round 1-3 — "The Pinned Path". Per docs/briefs/phase2-areas.md §6.
// 48 columns; rock-pin beat + multiple fires + plateau combat density.
// Slope-tile convention: see round-1-1.js header.

const flat   = (row) => ({ kind: 'flat',          row });
const upGen  = (row) => ({ kind: 'slope_up_22',   row });
const upStp  = (row) => ({ kind: 'slope_up_45',   row });
const dnGen  = (row) => ({ kind: 'slope_dn_22',   row });

const COLUMNS = [];
// cols 0-5: flat (spawn)
for (let c = 0; c < 6; c++) COLUMNS.push(flat(9));
// cols 6-8: gap (3 tiles)
for (let c = 0; c < 3; c++) COLUMNS.push(null);
// col 9: gentle uphill (row 9 → row 8)
COLUMNS.push(upGen(8));
// cols 10-12: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// col 13: steep uphill (row 8 → row 7)
COLUMNS.push(upStp(7));
// cols 14-34: flat plateau row 7 (the round's combat zone)
for (let c = 0; c < 21; c++) COLUMNS.push(flat(7));
// col 35: gentle downhill (row 7 → row 8)
COLUMNS.push(dnGen(8));
// cols 36-38: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// col 39: gentle downhill (row 8 → row 9)
COLUMNS.push(dnGen(9));
// cols 40-47: flat row 9
for (let c = 0; c < 8; c++) COLUMNS.push(flat(9));

export const ROUND = Object.freeze({
    id:    '1-3',
    cols:  48,
    rows:  12,
    theme: 'forest',
    columns: COLUMNS,
    decorations: [
        { col: 23, row: 7, kind: 'rock_small' },
        { col: 33, row: 7, kind: 'rock_small' },
    ],
    triggers: [
        { col: 47, row: 9, kind: 'mile_3' },
    ],
    fires: [
        { col: 19, row: 7 },
        { col: 29, row: 7 },
    ],
    spawn: { col: 1, row: 9 },
    entities: [
        { kind: 'dawn-husk',   col: 4,  row: 9 },
        { kind: 'mossplodder', col: 17, row: 7, dir: -1 },
        { kind: 'mossplodder', col: 24, row: 7, dir: -1 },
        { kind: 'mossplodder', col: 31, row: 7, dir: -1 },
        { kind: 'hummerwing',  col: 27, row: 7, dir: -1 },
        { kind: 'hummerwing',  col: 38, row: 8, dir: -1 },
    ],
});

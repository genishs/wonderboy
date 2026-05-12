// owning agent: dev-lead
// TODO: Round 4-3 — "The Inner Grove". Per docs/briefs/phase3-area1-expansion.md §7.3.
// 48 columns; Stage 4 density beat — long inner-grove plateau with 5 Mossplodders.

const flat   = (row) => ({ kind: 'flat',          row });
const upGen  = (row) => ({ kind: 'slope_up_22',   row });
const upStp  = (row) => ({ kind: 'slope_up_45',   row });
const dnGen  = (row) => ({ kind: 'slope_dn_22',   row });

const COLUMNS = [];
// cols 0-3: flat row 9 (spawn)
for (let c = 0; c < 4; c++) COLUMNS.push(flat(9));
// cols 4-6: gap (3 tiles)
for (let c = 0; c < 3; c++) COLUMNS.push(null);
// col 7: gentle uphill (row 9 → row 8)
COLUMNS.push(upGen(8));
// cols 8-9: flat row 8
for (let c = 0; c < 2; c++) COLUMNS.push(flat(8));
// col 10: steep uphill (row 8 → row 7)
COLUMNS.push(upStp(7));
// cols 11-29: flat plateau row 7 (inner grove)
for (let c = 0; c < 19; c++) COLUMNS.push(flat(7));
// col 30: gentle downhill (row 7 → row 8)
COLUMNS.push(dnGen(8));
// cols 31-33: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// cols 34-36: gap (3 tiles)
for (let c = 0; c < 3; c++) COLUMNS.push(null);
// cols 37-47: flat row 9 (round end)
for (let c = 0; c < 11; c++) COLUMNS.push(flat(9));

export const ROUND = Object.freeze({
    id:    '4-3',
    cols:  48,
    rows:  12,
    theme: 'darkforest',
    columns: COLUMNS,
    decorations: [
        { col: 17, row: 7, kind: 'rock_small' },
        { col: 35, row: 9, kind: 'rock_small' },
        { col: 22, row: 7, kind: 'moonlight_streak' },
    ],
    triggers: [
        { col: 3, row: 9, kind: 'mile_3' },
    ],
    fires: [],
    hazards: [],
    spawn:    { col: 1, row: 9 },
    entities: [
        { kind: 'mossplodder', col: 14, row: 7, dir: -1 },
        { kind: 'mossplodder', col: 20, row: 7, dir: -1 },
        { kind: 'mossplodder', col: 26, row: 7, dir: -1 },
        { kind: 'mossplodder', col: 28, row: 7, dir: -1 },
        { kind: 'mossplodder', col: 25, row: 7, dir: 1 },   // right-facing — collides with col-26
    ],
});

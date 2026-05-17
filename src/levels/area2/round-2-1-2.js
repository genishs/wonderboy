// owning agent: dev-lead
// TODO: Round 2-1-2 — second switchback. Quarrywight introduction (armored
// ground walker, requires 2 hatchets). Per docs/briefs/phase4-area2-cast.md §2.2.

const flat   = (row) => ({ kind: 'flat',          row });
const upGen  = (row) => ({ kind: 'slope_up_22',   row });
const dnGen  = (row) => ({ kind: 'slope_dn_22',   row });

const COLUMNS = [];
// cols 0-15: flat row 7 (continued from round 1's exit)
for (let c = 0; c < 16; c++) COLUMNS.push(flat(7));
// col 16: downhill (row 7 → row 8) — pseudo-switchback corner
COLUMNS.push(dnGen(8));
// cols 17-30: flat row 8
for (let c = 0; c < 14; c++) COLUMNS.push(flat(8));
// col 31: uphill (row 8 → row 7)
COLUMNS.push(upGen(7));
// cols 32-47: flat row 7
for (let c = 0; c < 16; c++) COLUMNS.push(flat(7));

export const ROUND = Object.freeze({
    id:    '2-1-2',
    cols:  48,
    rows:  12,
    theme: 'switchback',
    columns: COLUMNS,
    decorations: [],
    triggers: [
        { col: 3, row: 7, kind: 'mile_2' },
    ],
    fires: [],
    hazards: [],
    spawn:    { col: 1, row: 7 },
    entities: [
        // First Quarrywight — slow, armored. 2 hatchets to kill.
        { kind: 'quarrywight', col: 22, row: 8, dir: -1 },
        // Second Cinderwisp for difficulty layering.
        { kind: 'cinderwisp',  col: 40, row: 3, dir: -1 },
    ],
});

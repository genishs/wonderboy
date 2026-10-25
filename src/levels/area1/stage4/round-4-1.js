// owning agent: dev-lead
// TODO: Round 4-1 — "Beyond the Steps". Per docs/briefs/phase3-area1-expansion.md §7.1.
// 48 columns; Stage 4 entry — dark-forest outer rim, no hazards, no Hummerwings.

const flat   = (row) => ({ kind: 'flat',          row });
const upGen  = (row) => ({ kind: 'slope_up_22',   row });
const dnGen  = (row) => ({ kind: 'slope_dn_22',   row });

const COLUMNS = [];
// cols 0-5: flat row 9 (spawn)
for (let c = 0; c < 6; c++) COLUMNS.push(flat(9));
// col 6: gentle uphill (row 9 → row 8) — last of root-broken steps
COLUMNS.push(upGen(8));
// cols 7-9: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// cols 10-27: flat outer-rim row 8 (wide quiet stretch)
for (let c = 0; c < 18; c++) COLUMNS.push(flat(8));
// col 28: gentle downhill (row 8 → row 9)
COLUMNS.push(dnGen(9));
// cols 29-31: flat row 9
for (let c = 0; c < 3; c++) COLUMNS.push(flat(9));
// cols 32-34: gap (3 tiles) — sinkhole between root-knots
for (let c = 0; c < 3; c++) COLUMNS.push(null);
// cols 35-47: flat row 9 (round end)
for (let c = 0; c < 13; c++) COLUMNS.push(flat(9));

export const ROUND = Object.freeze({
    id:    '4-1',
    cols:  48,
    rows:  12,
    theme: 'darkforest',
    columns: COLUMNS,
    decorations: [
        { col: 24, row: 8, kind: 'rock_small' },   // root-knot stand-in
    ],
    triggers: [
        { col: 3, row: 9, kind: 'mile_1' },
    ],
    fires: [],
    hazards: [],
    spawn:    { col: 1, row: 9 },
    entities: [
        // dark-wood Mossplodder variants (palette reskin handled by SpriteCache;
        // entity kind stays 'mossplodder' to reuse the v0.50 sprite + AI).
        { kind: 'mossplodder', col: 18, row: 8, dir: -1 },
        { kind: 'mossplodder', col: 40, row: 9, dir: -1 },
    ],
});

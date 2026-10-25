// owning agent: dev-lead
// TODO: Round 4-2 — "Moonlight Slits". Per docs/briefs/phase3-area1-expansion.md §7.2.
// 48 columns; introduces moonlight_streak decoration (non-fatal animated tile).

const flat   = (row) => ({ kind: 'flat',          row });
const upGen  = (row) => ({ kind: 'slope_up_22',   row });
const dnGen  = (row) => ({ kind: 'slope_dn_22',   row });

const COLUMNS = [];
// cols 0-5: flat row 9 (spawn)
for (let c = 0; c < 6; c++) COLUMNS.push(flat(9));
// col 6: gentle uphill (row 9 → row 8)
COLUMNS.push(upGen(8));
// cols 7-9: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// cols 10-12: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// col 13: gentle downhill (row 8 → row 9)
COLUMNS.push(dnGen(9));
// cols 14-16: flat row 9
for (let c = 0; c < 3; c++) COLUMNS.push(flat(9));
// cols 17-18: gap (2 tiles)
for (let c = 0; c < 2; c++) COLUMNS.push(null);
// cols 19-24: flat row 9
for (let c = 0; c < 6; c++) COLUMNS.push(flat(9));
// col 25: gentle uphill (row 9 → row 8)
COLUMNS.push(upGen(8));
// cols 26-28: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// cols 29-33: flat plateau row 8
for (let c = 0; c < 5; c++) COLUMNS.push(flat(8));
// col 34: gentle downhill (row 8 → row 9)
COLUMNS.push(dnGen(9));
// cols 35-37: flat row 9
for (let c = 0; c < 3; c++) COLUMNS.push(flat(9));
// cols 38-47: flat row 9 (round end)
for (let c = 0; c < 10; c++) COLUMNS.push(flat(9));

// v0.75 — moonlight_streak decorations carried separately on `decorations`.
// They render at the (col, row-1) position via TileCache (same as rock_small)
// but are NON-COLLIDING and non-fatal. Renderer / decoration overlay handles
// them; CollisionSystem ignores them.

export const ROUND = Object.freeze({
    id:    '4-2',
    cols:  48,
    rows:  12,
    theme: 'darkforest',
    columns: COLUMNS,
    decorations: [
        { col: 28, row: 8, kind: 'rock_small' },
        { col: 36, row: 9, kind: 'rock_small' },
        { col: 14, row: 9, kind: 'moonlight_streak' },
        { col: 32, row: 8, kind: 'moonlight_streak' },
    ],
    triggers: [
        { col: 3, row: 9, kind: 'mile_2' },
    ],
    fires: [],
    hazards: [],
    spawn:    { col: 1, row: 9 },
    entities: [
        { kind: 'mossplodder', col: 14, row: 9, dir: -1 },
        { kind: 'mossplodder', col: 24, row: 9, dir: -1 },
        { kind: 'mossplodder', col: 32, row: 8, dir: -1 },
        // v0.75.1 — dewplum in the moonlit slit zone (story brief §15.2:
        // "the fruit catches the moonlight-silver rim"). cols 19-24 are flat
        // row 9 between the gap and the upGen.
        { kind: 'dewplum',     col: 21, row: 9 },
        // v0.75.1 — Threadshade hangs in the moonlight slit zone (story brief
        // §16.6: "the dark forest is where the Threadshade reads at its most
        // native"). Sine bob 192..336 px ≈ rows 4..7 — passes above Reed.
        { kind: 'threadshade', col: 16, row: 4 },
    ],
});

// owning agent: dev-lead
// TODO: Round 3-1 — "First Descent" (cave entry). Per docs/briefs/phase3-area1-expansion.md §6.1.
// 48 columns; introduces cave-gap pools (normal gaps; falling = death) + one
// cave-shell Mossplodder that walks into the pool and drowns (classroom beat).
//
// NOTE on the low-ceiling beat per brief: the cave's signature "ceiling drops
// to 6 tiles" effect is a renderer-time decoration concern; the tile grid
// itself stays rows = 12 (collision math is unchanged). For v0.75 we ship the
// terrain rhythm without the ceiling overlay — design can layer it in via the
// parallax pass later.

const flat   = (row) => ({ kind: 'flat',          row });
const upGen  = (row) => ({ kind: 'slope_up_22',   row });

const COLUMNS = [];
// cols 0-5: flat row 9 (spawn)
for (let c = 0; c < 6; c++) COLUMNS.push(flat(9));
// col 6: gentle uphill
COLUMNS.push(upGen(8));
// cols 7-13: flat row 8 (low-ceiling segment per brief)
for (let c = 0; c < 7; c++) COLUMNS.push(flat(8));
// cols 14-16: flat row 9 (ceiling restored)
for (let c = 0; c < 3; c++) COLUMNS.push(flat(9));
// cols 17-18: cave-gap pool (2 tiles)
for (let c = 0; c < 2; c++) COLUMNS.push(null);
// cols 19-24: flat shelf #2
for (let c = 0; c < 6; c++) COLUMNS.push(flat(9));
// cols 25-27: cave-gap pool (3 tiles)
for (let c = 0; c < 3; c++) COLUMNS.push(null);
// cols 28-33: flat shelf #3
for (let c = 0; c < 6; c++) COLUMNS.push(flat(9));
// col 34: gentle uphill (row 9 → row 8)
COLUMNS.push(upGen(8));
// cols 35-47: flat row 8 (round end)
for (let c = 0; c < 13; c++) COLUMNS.push(flat(8));

export const ROUND = Object.freeze({
    id:    '3-1',
    cols:  48,
    rows:  12,
    theme: 'cave',
    columns: COLUMNS,
    decorations: [
        { col: 32, row: 9, kind: 'rock_small' },
    ],
    triggers: [
        { col: 3, row: 9, kind: 'mile_1' },
    ],
    fires: [],
    hazards: [],
    spawn:    { col: 1, row: 9 },
    entities: [
        { kind: 'mossplodder', col: 12, row: 8, dir: -1 },
        // Col-22 walks toward the cave-gap-pool at col 25 and drowns — feature.
        { kind: 'mossplodder', col: 22, row: 9, dir: -1 },
    ],
});

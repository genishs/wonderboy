// owning agent: dev-lead
// TODO: Round 2-1 — "First Descent". Per docs/briefs/phase3-area1-expansion.md §5.1.
// 48 columns; teach water_gap (shore hazard, fatal on contact) + re-introduce
// shore-shell Mossplodder. Mile-marker `mile_1` at col 3 (round-start convention,
// per v0.50.2 + plan note: each stage reuses mile_1..mile_4 keys; renderer reads
// them as "Round 1..4 of the active stage").

const flat   = (row) => ({ kind: 'flat',          row });
const upGen  = (row) => ({ kind: 'slope_up_22',   row });
const dnGen  = (row) => ({ kind: 'slope_dn_22',   row });

const COLUMNS = [];
// cols 0-3: flat row 9 (spawn area)
for (let c = 0; c < 4; c++) COLUMNS.push(flat(9));
// col 4: gentle downhill (row 9 → row 10) — entry slope onto sand
COLUMNS.push(dnGen(10));
// cols 5-7: flat sand row 10
for (let c = 0; c < 3; c++) COLUMNS.push(flat(10));
// cols 8-13: flat sand (tidal/water_gap zone — see hazards)
for (let c = 0; c < 6; c++) COLUMNS.push(flat(10));
// cols 14-17: flat sand
for (let c = 0; c < 4; c++) COLUMNS.push(flat(10));
// col 18: gentle uphill (row 10 → row 9)
COLUMNS.push(upGen(9));
// cols 19-21: flat row 9
for (let c = 0; c < 3; c++) COLUMNS.push(flat(9));
// cols 22-25: flat
for (let c = 0; c < 4; c++) COLUMNS.push(flat(9));
// cols 26-27: gap (2 tiles)
for (let c = 0; c < 2; c++) COLUMNS.push(null);
// cols 28-33: flat row 9
for (let c = 0; c < 6; c++) COLUMNS.push(flat(9));
// col 34: gentle downhill (row 9 → row 10)
COLUMNS.push(dnGen(10));
// cols 35-37: flat row 10
for (let c = 0; c < 3; c++) COLUMNS.push(flat(10));
// cols 38-47: flat row 10 (10 cols to round end)
for (let c = 0; c < 10; c++) COLUMNS.push(flat(10));

export const ROUND = Object.freeze({
    id:    '2-1',
    cols:  48,
    rows:  12,
    theme: 'shore',
    columns: COLUMNS,
    decorations: [
        { col: 16, row: 10, kind: 'rock_small' },  // driftwood-bleach (rendered via stage 2 tileset palette)
    ],
    triggers: [
        // mile_1 → renderer maps to "Round 1" overlay. Reed sees "Round 1" inside
        // Stage 2 right after the stage-name overlay set the "Sumphollow" context.
        { col: 3, row: 9, kind: 'mile_1' },
    ],
    fires: [],
    // v0.75 — hazards is a new field for Phase 3 stages. Same shape as `fires`
    // but with a `kind` selecting the hazard tile type. The stage builder
    // expands these into tileData via HAZARD_TO_TYPE.
    hazards: [
        { col: 10, row: 10, kind: 'water_gap' },   // first tidal-edge teaching beat
    ],
    spawn:    { col: 1, row: 9 },
    entities: [
        { kind: 'mossplodder', col: 32, row: 9, dir: -1 },  // shore-shell variant
    ],
});

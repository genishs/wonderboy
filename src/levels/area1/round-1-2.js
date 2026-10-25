// owning agent: dev-lead
// TODO: Round 1-2 — "Through the Hummers". Per docs/briefs/phase2-areas.md §5.
// 64 columns; introduce Hummerwing + fire; valley puzzle gap→rock→fire→Hummerwing.
// Slope-tile placement: each slope tile is at the row of its DESTINATION flat
// (see CollisionSystem.floorYAt and round-1-1.js header for the convention).

const flat   = (row) => ({ kind: 'flat',          row });
const upGen  = (row) => ({ kind: 'slope_up_22',   row });
const upStp  = (row) => ({ kind: 'slope_up_45',   row });
const dnGen  = (row) => ({ kind: 'slope_dn_22',   row });

const COLUMNS = [];
// cols 0-7: flat row 9 (spawn)
for (let c = 0; c < 8; c++) COLUMNS.push(flat(9));
// col 8: gentle uphill (transitions row 9 → row 8)
COLUMNS.push(upGen(8));
// cols 9-11: flat row 8
for (let c = 0; c < 3; c++) COLUMNS.push(flat(8));
// col 12: steep uphill (transitions row 8 → row 7)
COLUMNS.push(upStp(7));
// cols 13-19: flat crest row 7
for (let c = 0; c < 7; c++) COLUMNS.push(flat(7));
// col 20: gentle downhill (transitions row 7 → row 8)
COLUMNS.push(dnGen(8));
// cols 21-22: flat row 8
for (let c = 0; c < 2; c++) COLUMNS.push(flat(8));
// col 23: gentle downhill (transitions row 8 → row 9)
COLUMNS.push(dnGen(9));
// cols 24-25: gap
for (let c = 0; c < 2; c++) COLUMNS.push(null);
// cols 26-33: flat valley row 9 (8 cols incl. fire patch)
for (let c = 0; c < 8; c++) COLUMNS.push(flat(9));
// col 34: gentle uphill (row 9 → row 8)
COLUMNS.push(upGen(8));
// cols 35-46: flat row 8 (second crest stretch — 12 cols)
for (let c = 0; c < 12; c++) COLUMNS.push(flat(8));
// col 47: gentle downhill (row 8 → row 9)
COLUMNS.push(dnGen(9));
// cols 48-49: flat row 9
for (let c = 0; c < 2; c++) COLUMNS.push(flat(9));
// cols 50-52: gap (3 tiles)
for (let c = 0; c < 3; c++) COLUMNS.push(null);
// cols 53-63: flat row 9 (final stretch + mile-marker)
for (let c = 0; c < 11; c++) COLUMNS.push(flat(9));

export const ROUND = Object.freeze({
    id:    '1-2',
    cols:  64,
    rows:  12,
    theme: 'forest',
    columns: COLUMNS,
    decorations: [
        { col: 28, row: 9, kind: 'rock_small' },
    ],
    triggers: [
        // v0.50.2 — Round 2 sign at the START of round-1-2 (was col 63 at the
        // round end). Markers at round STARTS feel right; v0.50.1 had them
        // mid-stride between rounds.
        { col: 2, row: 9, kind: 'mile_2' },
    ],
    fires: [
        { col: 31, row: 9 },
    ],
    spawn: { col: 1, row: 9 },
    entities: [
        { kind: 'dawn-husk',   col: 6,  row: 9 },
        { kind: 'mossplodder', col: 22, row: 8, dir: -1 },
        // v0.75.1 fix — col 50 was inside the 3-tile gap (cols 50-52). Spawned
        // Mossplodder fell straight through on frame 1 and was never visible
        // to the player. Moved to col 55 on the post-gap flat (cols 53-63).
        { kind: 'mossplodder', col: 55, row: 9, dir: -1 },
        { kind: 'hummerwing',  col: 30, row: 9, dir: -1 },
        { kind: 'hummerwing',  col: 44, row: 8, dir: -1 },
        // v0.75.1 — dewplum on the row-7 crest (mid-round reward, off the
        // optimal sprint line per story brief §15.2). cols 13-19 are flat
        // row 7 between the upStp at col 12 and the dnGen at col 20.
        { kind: 'dewplum',     col: 17, row: 7 },
    ],
});

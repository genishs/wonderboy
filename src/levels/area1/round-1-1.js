// owning agent: dev-lead
// TODO: Round 1-1 — "The First Steps". Per docs/briefs/phase2-areas.md §4.
// 48 columns; teach walk → egg → slope → gap → kill → mile-marker.
//
// Slope-tile placement convention (v0.50): each slope tile spans one full row
// of vertical change inside ONE tile (collision profile: localY = 48 → 0). The
// slope tile occupies the SAME row as the destination flat (i.e., the higher
// flat for `up`, the lower flat for `dn`). This keeps the floor surface
// continuous across the slope ↔ flat boundary. See CollisionSystem.floorYAt.

const flat   = (row) => ({ kind: 'flat',          row });
const upGen  = (row) => ({ kind: 'slope_up_22',   row });
const dnGen  = (row) => ({ kind: 'slope_dn_22',   row });

const COLUMNS = [];
// cols 0-10: flat at row 9 (spawn + first walk)
for (let c = 0; c < 11; c++) COLUMNS.push(flat(9));
// col 11: gentle uphill slope (climbs from row 9 to row 8)
COLUMNS.push(upGen(8));
// cols 12-17: flat crest at row 8 (6 cols)
for (let c = 0; c < 6; c++)  COLUMNS.push(flat(8));
// col 18: gentle downhill slope (descends from row 8 to row 9)
COLUMNS.push(dnGen(8));
// cols 19-24: flat row 9
for (let c = 0; c < 6; c++)  COLUMNS.push(flat(9));
// cols 25-27: gap
for (let c = 0; c < 3; c++)  COLUMNS.push(null);
// cols 28-47: flat row 9
for (let c = 0; c < 20; c++) COLUMNS.push(flat(9));

export const ROUND = Object.freeze({
    id:    '1-1',
    cols:  48,
    rows:  12,
    theme: 'forest',
    columns: COLUMNS,
    decorations: [
        { col: 38, row: 9, kind: 'rock_small' },
    ],
    triggers: [
        { col: 47, row: 9, kind: 'mile_1' },
    ],
    fires: [],
    spawn: { col: 1, row: 9 },
    entities: [
        { kind: 'dawn-husk',   col: 7,  row: 9 },
        { kind: 'mossplodder', col: 32, row: 9, dir: -1 },
    ],
});

// owning agent: dev-lead
// TODO: Round 2-1-1 — "Out of the Glade". Per docs/briefs/phase4-area2-cast.md §5.
// 48 columns; teach the first cinderwisp + an early uphill slope. The Switchback
// stage opens at the canopy edge (we reuse Area 1 stage1 forest tiles for the
// bottom rows; tileCache.setActiveStage(1, 2) will pick the stone-terrace set
// once design ships it, and the placeholder rectangle path keeps coverage).
//
// Mile-marker `mile_1` at col 3 (round-start convention from Area 1).

const flat   = (row) => ({ kind: 'flat',          row });
const upGen  = (row) => ({ kind: 'slope_up_22',   row });

const COLUMNS = [];
// cols 0-10: flat at row 9 (spawn + intro walk — mossy forest-edge feel)
for (let c = 0; c < 11; c++) COLUMNS.push(flat(9));
// col 11: gentle uphill (row 9 → row 8) — climbing begins
COLUMNS.push(upGen(8));
// cols 12-22: flat row 8 (first switchback shelf)
for (let c = 0; c < 11; c++) COLUMNS.push(flat(8));
// col 23: uphill again (row 8 → row 7)
COLUMNS.push(upGen(7));
// cols 24-40: flat row 7
for (let c = 0; c < 17; c++) COLUMNS.push(flat(7));
// cols 41-47: flat row 7 (7 cols to round end)
for (let c = 0; c < 7; c++) COLUMNS.push(flat(7));

export const ROUND = Object.freeze({
    id:    '2-1-1',
    cols:  48,
    rows:  12,
    theme: 'switchback',
    columns: COLUMNS,
    decorations: [],
    triggers: [
        { col: 3, row: 9, kind: 'mile_1' },
    ],
    fires: [],
    hazards: [],
    spawn:    { col: 1, row: 9 },
    entities: [
        // First Cinderwisp encounter — drifts in from the right edge after
        // the player crests the second slope. Cinderwisps are placed at the
        // upper third of the playfield; row 4 puts the drift midline at the
        // 4th tile from the top, which the sine bob then swings around.
        { kind: 'cinderwisp', col: 36, row: 4, dir: -1 },
    ],
});

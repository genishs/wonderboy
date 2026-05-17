// owning agent: dev-lead
// TODO: Round 2-1-3 — Skyhook introduction (cliff-dropper). Per
// docs/briefs/phase4-area2-cast.md §2.3.

const flat   = (row) => ({ kind: 'flat', row });

const COLUMNS = [];
// cols 0-47: flat row 7 (open stone-terrace shelf — Skyhook arena)
for (let c = 0; c < 48; c++) COLUMNS.push(flat(7));

export const ROUND = Object.freeze({
    id:    '2-1-3',
    cols:  48,
    rows:  12,
    theme: 'switchback',
    columns: COLUMNS,
    decorations: [],
    triggers: [
        { col: 3, row: 7, kind: 'mile_3' },
    ],
    fires: [],
    hazards: [],
    spawn:    { col: 1, row: 7 },
    entities: [
        // Skyhook perched at row 2 (mid-air), drops when hero crosses col-6
        // to its left. Trigger logic is in Phase2EnemyAI._tickSkyhook.
        { kind: 'skyhook',     col: 24, row: 2, dir: -1 },
        { kind: 'cinderwisp',  col: 36, row: 4, dir: -1 },
    ],
});

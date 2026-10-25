// owning agent: dev-lead
// TODO: Round 2-1-4 — Stage 2-1 closure. stage_exit (nextStage = 2) at the
// far end leads into Stage 2-2.

const flat = (row) => ({ kind: 'flat', row });

const COLUMNS = [];
// cols 0-47: flat row 7 (final summit-flat shelf for the Switchback stage)
for (let c = 0; c < 48; c++) COLUMNS.push(flat(7));

export const ROUND = Object.freeze({
    id:    '2-1-4',
    cols:  48,
    rows:  12,
    theme: 'switchback',
    columns: COLUMNS,
    decorations: [],
    triggers: [
        { col: 3,  row: 7, kind: 'mile_4' },
        // stage_exit at col 44 (near the end). When the hero crosses it,
        // AreaManager.beginStageTransition(2) fires and we advance to Stage 2-2.
        { col: 44, row: 7, kind: 'stage_exit', nextStage: 2 },
    ],
    fires: [],
    hazards: [],
    spawn:    { col: 1, row: 7 },
    entities: [
        // Mixed final wave — Cinderwisp + Quarrywight to test all encounters.
        { kind: 'cinderwisp',  col: 16, row: 3, dir: -1 },
        { kind: 'quarrywight', col: 28, row: 8, dir: -1 },
        // Item placement: a Flintchip mid-round to reward the player before
        // they reach the stage exit. Per cast brief §4.2 placement guidance.
        { kind: 'flintchip',   col: 22, row: 7 },
    ],
});

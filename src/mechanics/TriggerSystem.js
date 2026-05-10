// owning agent: dev-lead
// TODO: TriggerSystem — sample tile under hero foot. If MILE_{1,2,3} for the
// matching round, fire stageManager.advanceRound. If CAIRN on round 4, fire
// stageManager.clearStage. Each trigger tile is one-shot per round (the tile's
// _consumed flag prevents re-fires during the transition).

const TILE = 48;

export class TriggerSystem {
    update(ecs, levelManager, state) {
        if (!levelManager || !levelManager._isPhase2) return;
        const sm = levelManager.stageManager;
        if (!sm) return;
        if (state.gameState !== 'PLAYING') return;
        const playerId = levelManager.playerEntity;
        if (playerId == null) return;
        const tf = ecs.getComponent(playerId, 'transform');
        if (!tf) return;
        const level = levelManager.currentLevel;
        if (!level) return;

        // Trigger tiles are placed at row = floorRow - 1 (the tile that sits on top
        // of the floor; Reed walks INTO it). Probe both the body-row band and the
        // foot-row band so we catch the trigger whether Reed's bbox is straddling.
        // ys: head, mid, near-foot, foot — covers a 66px-tall hero across two rows.
        const ys = [tf.y + 4, tf.y + tf.h * 0.35, tf.y + tf.h * 0.7, tf.y + tf.h - 8];
        const xs = [tf.x + 4, tf.x + tf.w / 2, tf.x + tf.w - 4];

        for (const py of ys) {
            for (const px of xs) {
                const c = Math.floor(px / TILE);
                const r = Math.floor(py / TILE);
                const t = level.getTile(c, r);
                if (!t || !t.isTrigger || t._consumed) continue;

                const kind = t.triggerKind;
                if (kind === 'mile_1' && sm.roundIndex === 1) {
                    t._consumed = true;
                    sm.advanceRound(ecs, state);
                    return;
                }
                if (kind === 'mile_2' && sm.roundIndex === 2) {
                    t._consumed = true;
                    sm.advanceRound(ecs, state);
                    return;
                }
                if (kind === 'mile_3' && sm.roundIndex === 3) {
                    t._consumed = true;
                    sm.advanceRound(ecs, state);
                    return;
                }
                if (kind === 'cairn' && sm.roundIndex === 4) {
                    t._consumed = true;
                    sm.clearStage(ecs, state);
                    return;
                }
            }
        }
    }
}

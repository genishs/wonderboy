// owning agent: dev-lead
// TODO: TriggerSystem v0.50.1 — sample tile under hero foot. If MILE_{1,2,3},
// fire the new "Round 1-X" overlay (visual only, no level reload, no fade) and
// register the marker col as the next checkpoint. If CAIRN, fire stage-clear.
// Each trigger tile is one-shot per stage (the tile's _consumed flag prevents
// re-fires).

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

        // Probe Reed's bbox at multiple sample points so we catch the trigger
        // whether the body straddles the trigger row.
        const ys = [tf.y + 4, tf.y + tf.h * 0.35, tf.y + tf.h * 0.7, tf.y + tf.h - 8];
        const xs = [tf.x + 4, tf.x + tf.w / 2, tf.x + tf.w - 4];

        for (const py of ys) {
            for (const px of xs) {
                const c = Math.floor(px / TILE);
                const r = Math.floor(py / TILE);
                const t = level.getTile(c, r);
                if (!t || !t.isTrigger || t._consumed) continue;

                const kind = t.triggerKind;
                if (kind === 'mile_1' || kind === 'mile_2' || kind === 'mile_3') {
                    t._consumed = true;
                    sm.fireRoundMarkerOverlay(kind, c, state);
                    return;
                }
                if (kind === 'cairn') {
                    t._consumed = true;
                    sm.clearStage(ecs, state);
                    return;
                }
            }
        }
    }
}

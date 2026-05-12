// owning agent: dev-lead
// TODO: TriggerSystem v0.75 — sample tile under hero. Handles:
//   - mile_1..mile_4 → StageManager.fireRoundMarkerOverlay (per-stage round HUD)
//   - cairn         → StageManager.clearStage (legacy v0.50 path; no v0.75 tile
//                     places one, but back-compat preserved)
//   - stage_exit    → AreaManager.beginStageTransition(tile.nextStage) NEW v0.75
//   - boss_trigger  → BossSystem.beginFight(...) NEW v0.75
//
// Each trigger tile is one-shot via the tile's _consumed flag. The
// stage_exit / boss_trigger paths are also one-shot per stage load.

const TILE = 48;

export class TriggerSystem {
    /**
     * @param {ECS} ecs
     * @param {LevelManager} levelManager
     * @param {StateManager} state
     * @param {object} bossSystem  v0.75 — optional, fires on boss_trigger
     */
    update(ecs, levelManager, state, bossSystem = null) {
        if (!levelManager || !levelManager._isPhase2) return;
        const am = levelManager.areaManager;
        const sm = levelManager.stageManager;
        if (!sm) return;
        // v0.75 — also allow trigger detection during BOSS_FIGHT (so mile-markers
        // inside the arena don't re-fire — they're already consumed; just guarding
        // against state-locked frames where TriggerSystem should silently no-op).
        // PLAYING is the canonical state; STAGE_TRANSITION and BOSS_FIGHT freeze
        // most input/movement so the trigger has nothing to fire under.
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
                if (kind === 'mile_1' || kind === 'mile_2' || kind === 'mile_3' || kind === 'mile_4') {
                    t._consumed = true;
                    sm.fireRoundMarkerOverlay(kind, c, state);
                    return;
                }
                if (kind === 'cairn') {
                    // Legacy v0.50 path. v0.75 does not place cairns in level data
                    // — Stage 4's terminal beat is the boss arena, not a cairn.
                    t._consumed = true;
                    sm.clearStage(ecs, state);
                    return;
                }
                if (kind === 'stage_exit') {
                    // v0.75 — fire the inter-stage transition ritual.
                    t._consumed = true;
                    const next = (typeof t.nextStage === 'number') ? t.nextStage : 0;
                    if (am && next > 0) am.beginStageTransition(next);
                    return;
                }
                if (kind === 'boss_trigger') {
                    // v0.75 — camera lock + boss spawn.
                    t._consumed = true;
                    if (bossSystem && typeof bossSystem.beginFight === 'function') {
                        bossSystem.beginFight(ecs, level, am, state);
                    }
                    return;
                }
            }
        }
    }
}

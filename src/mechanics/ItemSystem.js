// owning agent: dev-lead
// TODO: ItemSystem v0.75.1 — fruit pickup collection. On hero-vs-pickup AABB
//   overlap, restore vitality (state.restoreHunger) and despawn the pickup.
//   dewplum: +20, amberfig: +50 (per story brief §15).
//
// Wired in game.js after HuskSystem.update so the husk → hatchet pickup path
// and the fruit pickup path don't collide on the same frame. Skipped during
// respawn / stage-clear / game-over / stage-transition / area-cleared windows
// (handled by the mechanics-tick gate in game.js).

// Vitality restore amounts per story brief §15.1.
const FRUIT_RESTORE = Object.freeze({
    dewplum:  20,
    amberfig: 50,
});

export class ItemSystem {
    update(ecs, state, playerEntityId) {
        if (playerEntityId == null) return;
        const ptf = ecs.getComponent(playerEntityId, 'transform');
        if (!ptf) return;

        for (const row of ecs.query('transform', 'pickup')) {
            const pu = row.pickup;
            const restore = FRUIT_RESTORE[pu.type];
            if (typeof restore !== 'number') continue;   // not a fruit pickup
            if (!this._overlaps(ptf, row.transform)) continue;
            // Restore vitality (clamped to maxHunger inside StateManager).
            if (typeof state.restoreHunger === 'function') {
                state.restoreHunger(restore);
            }
            // Small score reward so collection feels like progress.
            state.addScore?.(restore * 2);
            ecs.destroyEntity(row.id);
        }
    }

    _overlaps(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x &&
               a.y < b.y + b.h && a.y + a.h > b.y;
    }
}

// owning agent: dev-lead
// TODO: ItemSystem v1.0 — fruit pickup collection + Flintchip transient buff.
//   On hero-vs-pickup AABB overlap, restore vitality (state.restoreHunger) for
//   fruit, or arm the Flintchip buff (pl.flintchipFrames). Despawn the pickup.
//
//   v0.75.1: dewplum +20, amberfig +50.
//   v1.0:    sunpear  +50 (Area 2's brightest fruit; same value as amberfig
//                          per cast brief §4.1 — "the Sunpear is amberfig's
//                          Cinder Reach counterpart; function is identical").
//   v1.0:    flintchip — transient buff. Sets pl.flintchipFrames = 600 (~10 s
//                        @ 60fps). HatchetSystem.tryThrow reads pl.flintchipFrames
//                        > 0 to lift the on-screen cap from 2 to 3.
//                        AreaManager._loadStage clears pl.flintchipFrames on
//                        stage transition (buff does not survive stage swaps).
//
// Wired in game.js after HuskSystem.update so the husk → hatchet pickup path
// and the fruit pickup path don't collide on the same frame. Skipped during
// respawn / stage-clear / game-over / stage-transition / area-cleared windows
// (handled by the mechanics-tick gate in game.js).

// Vitality restore amounts. Per story briefs §15.1 (v0.75.1) and §4.1 (v1.0).
const FRUIT_RESTORE = Object.freeze({
    dewplum:  20,
    amberfig: 50,
    sunpear:  50,   // v1.0 — Area 2's brightest food.
});

// v1.0 — Flintchip buff. Per phase4-area2-cast.md §4.2 / §9.
const FLINTCHIP_DURATION_FRAMES = 600;    // ~10 sec @ 60 fps

// v1.0 — audio singleton fire-and-forget helper.
const _sfx = (name) => {
    if (typeof globalThis !== 'undefined' && globalThis.audio) {
        globalThis.audio.playSFX(name);
    }
};

export class ItemSystem {
    update(ecs, state, playerEntityId) {
        if (playerEntityId == null) return;
        const ptf = ecs.getComponent(playerEntityId, 'transform');
        const pl  = ecs.getComponent(playerEntityId, 'player');
        if (!ptf) return;

        // v1.0 — Flintchip buff tick. Decrement pl.flintchipFrames each tick;
        // when it crosses 1→0 fire the buff-end SFX. The HatchetSystem reads
        // pl.flintchipFrames > 0 to know whether the on-screen cap is bumped.
        if (pl && (pl.flintchipFrames | 0) > 0) {
            pl.flintchipFrames--;
            if (pl.flintchipFrames === 0) {
                _sfx('flintchip_end');
            }
        }

        for (const row of ecs.query('transform', 'pickup')) {
            const pu = row.pickup;
            if (!this._overlaps(ptf, row.transform)) continue;

            // Fruit pickups (dewplum / amberfig / sunpear) → restore vitality.
            const restore = FRUIT_RESTORE[pu.type];
            if (typeof restore === 'number') {
                if (typeof state.restoreHunger === 'function') {
                    state.restoreHunger(restore);
                }
                state.addScore?.(restore * 2);
                ecs.destroyEntity(row.id);
                // v1.0 — per-fruit SFX (each has a distinct arpeggio).
                if (pu.type === 'dewplum')       _sfx('fruit_dewplum');
                else if (pu.type === 'amberfig') _sfx('fruit_amberfig');
                else if (pu.type === 'sunpear')  _sfx('fruit_sunpear');
                continue;
            }

            // v1.0 — Flintchip transient buff.
            if (pu.type === 'flintchip' && pl) {
                pl.flintchipFrames = FLINTCHIP_DURATION_FRAMES;
                state.addScore?.(200);
                ecs.destroyEntity(row.id);
                _sfx('flintchip_get');
                continue;
            }
        }
    }

    _overlaps(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x &&
               a.y < b.y + b.h && a.y + a.h > b.y;
    }
}

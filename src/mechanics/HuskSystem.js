// owning agent: dev-lead
// TODO: HuskSystem — dawn-husk lifecycle. On Reed contact (rest → break), play the
//   3-frame break animation. v0.75.1: a NEW `burst` phase follows `break` and
//   plays the design-shipped 3-frame burst animation while spawning 2-4 shell-
//   fragment particle entities; the hatchet pickup drops at the end of `burst`.
//   HatchetSystem owns the pickup-vs-hero contact step.
//
// Lifecycle (v0.75.1):
//   rest    →  Reed contact → break  (EGG.breakFrames)
//   break   →  timer → 0   → burst   (EGG_BURST.burstFrames)
//                              + spawn shell-fragment entities once at entry
//   burst   →  timer → 0   → hatchet pickup spawned, husk despawned
//
// Shell fragments are small `shell` entities driven by this system's own
// per-frame physics (gravity, off-screen despawn). They do NOT carry a
// `pickup` or `enemy` component — they never interact with the player or with
// CombatSystem — they're pure visual particles.

import { EGG } from '../config/PhaseTwoTunables.js';
import { EGG_BURST } from '../config/PhaseThreeTunables.js';

const TILE = 48;

export class HuskSystem {
    /**
     * @param {HatchetSystem} hatchetSystem  reference for spawnPickup hand-off
     */
    constructor(hatchetSystem) {
        this.hatchetSystem = hatchetSystem;
    }

    update(ecs, state, playerEntityId) {
        // Tick shell-fragment particles every frame (independent of player
        // presence, so the burst still plays cleanly during the spawn frame).
        this._tickShellFragments(ecs);

        if (playerEntityId == null) return;
        const ptf = ecs.getComponent(playerEntityId, 'transform');
        if (!ptf) return;

        for (const row of ecs.query('transform', 'pickup')) {
            const pu = row.pickup;
            if (pu.type !== 'dawn-husk') continue;

            if (pu.state === 'rest') {
                if (this._overlaps(ptf, row.transform)) {
                    pu.state = 'break';
                    pu.stateTimer = EGG.breakFrames;
                }
            } else if (pu.state === 'break') {
                pu.stateTimer--;
                if (pu.stateTimer <= 0) {
                    // v0.75.1 — enter burst phase. Spawn shell fragments
                    // ONCE at the entry frame; the rest of burst plays out
                    // visually via the design-shipped 3-frame `burst` anim.
                    pu.state = 'burst';
                    pu.stateTimer = EGG_BURST.burstFrames;
                    this._spawnShellFragments(ecs, row.transform);
                    // v1.0 — husk-burst SFX (noise pop + bright chime).
                    if (typeof globalThis !== 'undefined' && globalThis.audio) {
                        globalThis.audio.playSFX('husk_burst');
                    }
                }
            } else if (pu.state === 'burst') {
                pu.stateTimer--;
                if (pu.stateTimer <= 0) {
                    // Hatchet pickup spawns at the husk's center-top position.
                    const cx = row.transform.x + row.transform.w / 2;
                    const cy = row.transform.y + row.transform.h;
                    ecs.destroyEntity(row.id);
                    this.hatchetSystem.spawnPickup(ecs, cx, cy - 4);
                }
            }
        }
    }

    /**
     * v0.75.1 — spawn EGG_BURST.shellCount husk-shell fragments at the egg's
     * center, each with a random outward kick. Per design preview-husk-shell
     * spec: 8×8 art at scale 2 = 16×16 display, tumble anim, anchor center.
     */
    _spawnShellFragments(ecs, huskTf) {
        const cx = huskTf.x + huskTf.w / 2;
        const cy = huskTf.y + huskTf.h * 0.4;
        const count = EGG_BURST.shellCount;
        for (let i = 0; i < count; i++) {
            const id = ecs.createEntity();
            const w = 16, h = 16;
            ecs.addComponent(id, 'transform', { x: cx - w / 2, y: cy - h / 2, w, h });
            ecs.addComponent(id, 'velocity', {
                vx: (Math.random() - 0.5) * 2 * EGG_BURST.vxRangeAbs,
                vy: EGG_BURST.vyMin + Math.random() * (EGG_BURST.vyMax - EGG_BURST.vyMin),
            });
            // v0.75.1 — shell-fragment marker. NOT a `pickup` (so HuskSystem
            // won't re-iterate it) and NOT an `enemy` / `projectile` (so
            // CombatSystem ignores it). The Renderer draws via the `sprite`
            // component and the husk-shell cache entry; this system handles
            // physics + despawn directly.
            ecs.addComponent(id, 'shell', {
                framesLeft: EGG_BURST.shellLifetime,
            });
            ecs.addComponent(id, 'sprite', {
                name: 'husk-shell', anim: 'tumble', frame: 0, scale: 2,
                flip: false, color: '#a8794a',
            });
        }
    }

    _tickShellFragments(ecs) {
        for (const row of ecs.query('transform', 'velocity', 'shell')) {
            const sh = row.shell;
            const tf = row.transform;
            const v  = row.velocity;
            v.vy += EGG_BURST.shellGravity;
            tf.x += v.vx;
            tf.y += v.vy;
            sh.framesLeft--;
            if (sh.framesLeft <= 0) { ecs.destroyEntity(row.id); continue; }
            // Off-screen-bottom despawn (well below the rendered area).
            if (tf.y > 48 * 16) { ecs.destroyEntity(row.id); continue; }
        }
    }

    _overlaps(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x &&
               a.y < b.y + b.h && a.y + a.h > b.y;
    }
}

void TILE;

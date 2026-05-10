// owning agent: dev-lead
// TODO: HuskSystem — dawn-husk lifecycle. On Reed contact (rest → break), play the
//   3-frame break animation (~12 frames). On break end, destroy the husk and spawn
//   a hatchet pickup at the same position. HatchetSystem owns the pickup-vs-hero
//   contact step.

import { EGG } from '../config/PhaseTwoTunables.js';

const TILE = 48;

export class HuskSystem {
    /**
     * @param {HatchetSystem} hatchetSystem  reference for spawnPickup hand-off
     */
    constructor(hatchetSystem) {
        this.hatchetSystem = hatchetSystem;
    }

    update(ecs, state, playerEntityId) {
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
                    // Hatchet pickup spawns at the husk's center-top position.
                    const cx = row.transform.x + row.transform.w / 2;
                    const cy = row.transform.y + row.transform.h;
                    ecs.destroyEntity(row.id);
                    this.hatchetSystem.spawnPickup(ecs, cx, cy - 4);
                }
            }
        }
    }

    _overlaps(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x &&
               a.y < b.y + b.h && a.y + a.h > b.y;
    }
}

void TILE;

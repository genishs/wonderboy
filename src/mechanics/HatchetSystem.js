// owning agent: dev-lead
// TODO: HatchetSystem — combined pickup + projectile pipeline for the stone hatchet.
//   (a) tryThrow(ecs, heroTf, pl): spawn a thrown projectile (parabolic, no bounce).
//   (b) update(ecs, level, state, player): step thrown projectiles + dispatch ground-pickup
//       contact (hero overlap → arm hero, despawn pickup).
//   (c) spawnPickup(ecs, x, y): spawn a static pickup entity (consumed on hero contact).

import { HATCHET, EGG } from '../config/PhaseTwoTunables.js';

const TILE = 48;

export class HatchetSystem {
    constructor() {
        // No internal state.
    }

    /**
     * Try to spawn a thrown hatchet. Returns true if spawned.
     * Rules: hero must be armed (caller should also check), max 2 on screen.
     */
    tryThrow(ecs, heroTf, pl) {
        if (!pl || pl.armed !== true) return false;
        const live = ecs.query('projectile').filter(r => r.projectile.type === 'hatchet');
        if (live.length >= HATCHET.maxOnScreen) return false;

        const facing = pl.facingRight ? 1 : -1;
        const w = 24, h = 24;     // 12*2 = 24 (sprite scale=2)
        const spawnX = heroTf.x + (pl.facingRight ? heroTf.w : -8) - w / 2;
        const spawnY = heroTf.y + heroTf.h * 0.35 - h / 2;

        const id = ecs.createEntity();
        ecs.addComponent(id, 'transform', { x: spawnX, y: spawnY, w, h });
        ecs.addComponent(id, 'velocity',  { vx: facing * HATCHET.vx0, vy: HATCHET.vy0 });
        ecs.addComponent(id, 'projectile', {
            type:        'hatchet',
            lifetime:    HATCHET.lifetimeMax / 60,
            framesLeft:  HATCHET.lifetimeMax,
            bouncesLeft: 0,
            ownerKind:   'hero',
            damage:      'kill',
            distanceTraveled: 0,
        });
        ecs.addComponent(id, 'sprite', {
            name: 'hatchet', anim: 'fly', frame: 0, scale: 2,
            flip: !pl.facingRight, color: '#b0a090',
        });
        return true;
    }

    /**
     * Spawn a ground-pickup hatchet at (x, y). The pickup persists until the hero
     * overlaps it, at which point this.update flips pl.armed=true and despawns.
     */
    spawnPickup(ecs, x, y) {
        const w = 28, h = 28;
        const id = ecs.createEntity();
        ecs.addComponent(id, 'transform', { x: x - w / 2, y: y - h, w, h });
        ecs.addComponent(id, 'pickup',    { type: 'hatchet', state: 'idle', stateTimer: 0 });
        ecs.addComponent(id, 'sprite',    {
            name: 'hatchet', anim: 'fly', frame: 0, scale: 2, flip: false, color: '#b0a090',
        });
        return id;
    }

    /**
     * Per-frame: step thrown hatchets + check pickup contact.
     */
    update(ecs, level, state, playerEntityId) {
        // 1. Step thrown projectiles
        for (const row of ecs.query('transform', 'velocity', 'projectile')) {
            if (row.projectile.type !== 'hatchet') continue;
            this._tickProjectile(row, level, ecs);
        }

        // 2. Pickup contact
        if (playerEntityId == null) return;
        const ptf = ecs.getComponent(playerEntityId, 'transform');
        const pl  = ecs.getComponent(playerEntityId, 'player');
        if (!ptf || !pl) return;
        for (const row of ecs.query('transform', 'pickup')) {
            if (row.pickup.type !== 'hatchet') continue;
            if (!this._overlaps(ptf, row.transform)) continue;
            pl.armed = true;
            ecs.destroyEntity(row.id);
            // Award a small score so pickup feels like progress.
            state?.addScore?.(50);
        }
    }

    _tickProjectile({ id, transform: tf, velocity: v, projectile: p }, level, ecs) {
        v.vy += HATCHET.gravity;
        tf.x += v.vx;
        tf.y += v.vy;

        p.framesLeft--;
        if (p.framesLeft <= 0) { ecs.destroyEntity(id); return; }

        const ts = TILE;

        // Wall: any horizontal solid contact = despawn (no bounce).
        const cxRight = Math.floor((tf.x + tf.w) / ts);
        const cxLeft  = Math.floor(tf.x / ts);
        const rowMid  = Math.floor((tf.y + tf.h / 2) / ts);
        if (v.vx > 0) {
            const tile = level.getTile(cxRight, rowMid);
            if (tile?.solid && !tile.slopeProfile) { ecs.destroyEntity(id); return; }
        }
        if (v.vx < 0) {
            const tile = level.getTile(cxLeft, rowMid);
            if (tile?.solid && !tile.slopeProfile) { ecs.destroyEntity(id); return; }
        }

        // Ground: any solid below at foot Y = despawn.
        const footY = tf.y + tf.h;
        const fr    = Math.floor(footY / ts);
        for (let c = Math.floor(tf.x / ts); c <= Math.floor((tf.x + tf.w - 1) / ts); c++) {
            const t = level.getTile(c, fr);
            if (t?.solid && !t.slopeProfile && v.vy >= 0) {
                ecs.destroyEntity(id);
                return;
            }
            // Slope ground: check the slope profile and despawn if foot crosses it.
            if (t?.slopeProfile && v.vy >= 0) {
                const lx = ((Math.floor(tf.x + tf.w / 2) % ts) + ts) % ts;
                const profileY = (() => {
                    switch (t.slopeProfile) {
                        case 'up22': return Math.max(32, 48 - Math.floor(lx / 3));
                        case 'up45': return Math.max(0, 48 - lx - 1);
                        case 'dn22': return Math.max(32, 48 - Math.floor((47 - lx) / 3));
                        case 'dn45': return Math.max(0, lx);
                        default:     return 48;
                    }
                })();
                const slopeAbsY = fr * ts + profileY;
                if (footY >= slopeAbsY) { ecs.destroyEntity(id); return; }
            }
        }

        // Decoration (rock) hit — AABB test against any rock in the level.
        if (level.decorations && level.decorations.length) {
            for (const d of level.decorations) {
                if (d.kind !== 'rock_small') continue;
                const dw = 32, dh = 32;
                const dx = d.col * ts + (ts - dw) / 2;
                const dy = d.row * ts - dh;
                if (tf.x + tf.w > dx && tf.x < dx + dw &&
                    tf.y + tf.h > dy && tf.y < dy + dh) {
                    ecs.destroyEntity(id);
                    return;
                }
            }
        }

        // Off-screen
        if (tf.x < -96 || tf.x > level.cols * ts + 96 || tf.y > level.rows * ts + 200) {
            ecs.destroyEntity(id);
            return;
        }
    }

    _overlaps(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x &&
               a.y < b.y + b.h && a.y + a.h > b.y;
    }
}

// Reference EGG so build tools don't strip the import (used for documentation
// of the pickup hand-off in the cast brief; numbers come from PhaseTwoTunables).
void EGG;

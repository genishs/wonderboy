// owning agent: dev-lead
// TODO: Sapling seed-dart spawn/fall/despawn.
//
// Seeddarts ignore PhysicsEngine. Each dart has its own gravity (lighter than the
// hero's), travels until it hits hero / wall / lifetime budget runs out.
// SAPLING fires three darts in a fan: -15° / 0° / +15° (in facing direction).

import { SEEDDART } from '../config/PhaseOneTunables.js';
import { CollisionSystem } from '../physics/CollisionSystem.js';

const TILE = 48;
const DEG2RAD = Math.PI / 180;

export class SeeddartSystem {
    constructor() {
        this.collision = new CollisionSystem();
    }

    spawnFan(ecs, saplingTf, dir) {
        // Spawn at the bristle crown (top center of sapling)
        const cx = saplingTf.x + saplingTf.w / 2;
        const cy = saplingTf.y + saplingTf.h * 0.20;
        for (const ang of SEEDDART.fanAngles) {
            // ang in degrees; positive = upward (vy negative).
            // Plan: -15°, 0°, +15° fan. Per brief: -15° = down, +15° = up.
            // Use +up convention here (consistent with vy negative-is-up).
            const radians = ang * DEG2RAD;
            const vx = dir * SEEDDART.speed * Math.cos(radians);
            const vy = -SEEDDART.speed * Math.sin(radians);
            this._spawnOne(ecs, cx, cy, vx, vy, dir);
        }
    }

    _spawnOne(ecs, cx, cy, vx, vy, dir) {
        const id = ecs.createEntity();
        const w = 18, h = 12;
        ecs.addComponent(id, 'transform', { x: cx - w / 2, y: cy - h / 2, w, h });
        ecs.addComponent(id, 'velocity', { vx, vy });
        ecs.addComponent(id, 'projectile', {
            type: 'seeddart',
            lifetime: 2.0,
            framesLeft: 240, // safety cap
            bouncesLeft: 0,
            ownerKind: 'enemy',
            damage: SEEDDART.damage,
            distanceTraveled: 0,
        });
        ecs.addComponent(id, 'sprite', {
            name: 'seeddart', // not in cache — renderer will draw placeholder rect
            anim: 'fly',
            frame: 0,
            scale: 2,
            flip: dir < 0,
            color: '#f0e8c8', // bone-white, matches design palette
        });
    }

    update(ecs, level) {
        for (const row of ecs.query('transform', 'velocity', 'projectile')) {
            if (row.projectile.type !== 'seeddart') continue;
            this._tick(row, level, ecs);
        }
    }

    _tick({ id, transform: tf, velocity: v, projectile: p }, level, ecs) {
        v.vy += SEEDDART.gravity;
        const dx = v.vx, dy = v.vy;
        tf.x += dx;
        tf.y += dy;
        p.distanceTraveled += Math.hypot(dx, dy);

        p.framesLeft--;
        if (p.framesLeft <= 0 || p.distanceTraveled >= SEEDDART.lifetimePx) {
            ecs.destroyEntity(id);
            return;
        }

        // Solid-tile collision = despawn (no bounce)
        const ts = TILE;
        const ccol = Math.floor((tf.x + tf.w / 2) / ts);
        const crow = Math.floor((tf.y + tf.h / 2) / ts);
        if (level.getTile(ccol, crow)?.solid) {
            ecs.destroyEntity(id);
            return;
        }

        if (tf.x < -64 || tf.x > level.cols * ts + 64 || tf.y > level.rows * ts + 200) {
            ecs.destroyEntity(id);
        }
    }
}

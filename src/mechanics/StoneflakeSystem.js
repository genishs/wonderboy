// owning agent: dev-lead
// TODO: Hero projectile (stoneflake) spawn/arc/bounce/despawn.
//
// Stoneflakes ignore PhysicsEngine and step themselves here. They have a hard
// on-screen cap (HERO.maxProjectiles) and despawn on:
//   - second ground contact (bounceFactor on first, maxBounces=1)
//   - any wall contact
//   - lifetimeMax frames
//   - first enemy hit (handled by CombatSystem)

import { HERO, STONEFLAKE } from '../config/PhaseOneTunables.js';
import { CollisionSystem }  from '../physics/CollisionSystem.js';

const TILE = 48;

export class StoneflakeSystem {
    constructor() {
        this.collision = new CollisionSystem();
    }

    update(ecs, level) {
        for (const row of ecs.query('transform', 'velocity', 'projectile')) {
            if (row.projectile.type !== 'stoneflake') continue;
            this._tick(row, level, ecs);
        }
    }

    tryThrow(ecs, heroTf, pl) {
        // Cap on-screen stoneflakes
        const live = ecs.query('projectile').filter(r => r.projectile.type === 'stoneflake');
        if (live.length >= HERO.maxProjectiles) return false;

        const facing = pl.facingRight ? 1 : -1;
        const id = ecs.createEntity();
        const w = 16, h = 16;
        const spawnX = heroTf.x + (pl.facingRight ? heroTf.w : -8) - w / 2;
        const spawnY = heroTf.y + heroTf.h * 0.45 - h / 2;
        ecs.addComponent(id, 'transform',  { x: spawnX, y: spawnY, w, h });
        ecs.addComponent(id, 'velocity',   { vx: facing * STONEFLAKE.vx0, vy: STONEFLAKE.vy0 });
        ecs.addComponent(id, 'projectile', {
            type: 'stoneflake',
            lifetime: STONEFLAKE.lifetimeMax / 60, // legacy seconds field
            framesLeft: STONEFLAKE.lifetimeMax,
            bouncesLeft: STONEFLAKE.maxBounces,
            ownerKind: 'hero',
            damage: STONEFLAKE.damage,
            distanceTraveled: 0,
        });
        ecs.addComponent(id, 'sprite', { name: 'stoneflake', anim: 'fly', frame: 0, scale: 3, flip: !pl.facingRight, color: '#d8c8a8' });
        return true;
    }

    _tick({ id, transform: tf, velocity: v, projectile: p }, level, ecs) {
        // Step
        v.vy += STONEFLAKE.gravity;
        const prevX = tf.x, prevY = tf.y;
        tf.x += v.vx;
        tf.y += v.vy;

        p.framesLeft--;
        if (p.framesLeft <= 0) { ecs.destroyEntity(id); return; }

        // Wall: any horizontal collision = despawn
        const ts = TILE;
        const cxRight = Math.floor((tf.x + tf.w) / ts);
        const cxLeft  = Math.floor(tf.x / ts);
        const rowMid  = Math.floor((tf.y + tf.h / 2) / ts);
        if (v.vx > 0 && level.getTile(cxRight, rowMid)?.solid) { ecs.destroyEntity(id); return; }
        if (v.vx < 0 && level.getTile(cxLeft, rowMid)?.solid)  { ecs.destroyEntity(id); return; }

        // Ground: bounce if bouncesLeft > 0, else despawn
        const footY = tf.y + tf.h;
        const fr = Math.floor(footY / ts);
        let groundedThisStep = false;
        for (let c = Math.floor(tf.x / ts); c <= Math.floor((tf.x + tf.w - 1) / ts); c++) {
            const t = level.getTile(c, fr);
            if (t?.solid && v.vy >= 0) {
                tf.y = fr * ts - tf.h;
                groundedThisStep = true;
                break;
            }
        }
        if (groundedThisStep) {
            if (p.bouncesLeft > 0) {
                v.vy = -Math.abs(v.vy) * STONEFLAKE.bounceFactor;
                p.bouncesLeft--;
            } else {
                ecs.destroyEntity(id);
                return;
            }
        }

        // Off-screen / out-of-level kill
        if (tf.x < -64 || tf.x > level.cols * ts + 64 || tf.y > level.rows * ts + 200) {
            ecs.destroyEntity(id);
            return;
        }
    }
}

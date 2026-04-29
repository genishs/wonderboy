import { CollisionSystem } from './CollisionSystem.js';
import { C }              from './PhysicsConstants.js';

/**
 * Agent 2 (Physics & Controller Engineer) owns this file.
 * Tune constants in PhysicsConstants.js — not here.
 */
export class PhysicsEngine {
    constructor() {
        this.collision = new CollisionSystem();
    }

    update(dt, ecs, state, level, input) {
        if (!level) return;

        for (const p of ecs.query('transform', 'velocity', 'physics', 'player')) {
            this._updatePlayer(p, state, level, input);
        }
        for (const proj of ecs.query('transform', 'velocity', 'projectile')) {
            this._updateProjectile(proj, level, ecs);
        }
        for (const e of ecs.query('transform', 'velocity', 'physics', 'enemy')) {
            this._updateEnemy(e, level, ecs);
        }
    }

    _updatePlayer({ transform: tf, velocity: v, physics: ph, player: pl }, state, level, input) {
        const onBoard  = state.hasSkateboard;
        const maxSpeed = C.MAX_WALK_SPEED * (onBoard ? C.BOARD_SPEED_MULT : 1);
        const friction = ph.onIce    ? C.FRICTION_ICE
                       : onBoard     ? C.BOARD_FRICTION
                       : ph.onGround ? C.FRICTION_GROUND : C.FRICTION_AIR;

        if (input.right) {
            v.vx = Math.min(v.vx + C.WALK_ACCEL, maxSpeed);
            pl.facingRight = true;
        } else if (input.left) {
            v.vx = Math.max(v.vx - C.WALK_ACCEL, -maxSpeed);
            pl.facingRight = false;
        } else {
            v.vx *= friction;
            if (Math.abs(v.vx) < 0.05) v.vx = 0;
        }

        if (input.jumpPressed && ph.onGround) {
            v.vy            = C.JUMP_VELOCITY;
            ph.onGround     = false;
            ph.jumpHoldLeft = C.JUMP_HOLD_FRAMES;
            pl.isJumping    = true;
        }
        if (ph.jumpHoldLeft > 0) {
            if (input.jump) { v.vy += C.JUMP_HOLD_BOOST; ph.jumpHoldLeft--; }
            else             { ph.jumpHoldLeft = 0; }
        }

        if (!ph.onGround) v.vy = Math.min(v.vy + C.GRAVITY, C.MAX_FALL_SPEED);

        tf.x += v.vx;
        tf.y += v.vy;

        ph.onGround = false;
        ph.onIce    = false;
        this.collision.resolveTiles(tf, v, ph, level);

        if (tf.x < 0) { tf.x = 0; v.vx = 0; }
        if (tf.y > level.height * C.TILE + 300) state.takeDamage();
    }

    _updateProjectile({ id, transform: tf, velocity: v }, level, ecs) {
        v.vy += C.GRAVITY * 0.55;
        tf.x += v.vx;
        tf.y += v.vy;
        if (this.collision.solidAt(tf.x + tf.w / 2, tf.y + tf.h / 2, level)) {
            ecs.destroyEntity(id);
        }
    }

    _updateEnemy({ id, transform: tf, velocity: v, physics: ph, enemy: en }, level, ecs) {
        v.vy = Math.min(v.vy + C.GRAVITY, C.MAX_FALL_SPEED);
        tf.x += v.vx;
        tf.y += v.vy;

        ph.onGround = false;
        this.collision.resolveTiles(tf, v, ph, level);

        if (ph.onGround && en.ai === 'patrol') {
            const probe = tf.x + (en.dir > 0 ? tf.w + 1 : -1);
            if (!this.collision.solidAt(probe, tf.y + tf.h + 1, level) ||
                 this.collision.solidAt(tf.x + (en.dir > 0 ? tf.w : -1), tf.y + tf.h / 2, level)) {
                en.dir  *= -1;
                v.vx     = en.dir * Math.abs(v.vx || 1.5);
            }
        }
    }
}

import { CollisionSystem } from './CollisionSystem.js';

/**
 * Physics constants tuned to replicate original Wonder Boy's "slippery" feel.
 * Agent 2 (Physics & Controller Engineer) is responsible for fine-tuning these values.
 */
export const C = Object.freeze({
    GRAVITY:           0.40,   // px / frame²
    MAX_FALL_SPEED:    10.0,
    WALK_ACCEL:        0.50,
    MAX_WALK_SPEED:    3.50,
    FRICTION_GROUND:   0.80,   // deceleration multiplier per frame
    FRICTION_AIR:      0.95,
    FRICTION_ICE:      0.97,   // Area 4 ice stages
    JUMP_VELOCITY:    -8.50,   // initial vy on jump
    JUMP_HOLD_BOOST:  -0.15,   // extra upward each held frame
    JUMP_HOLD_FRAMES:  12,     // max frames variable jump is active
    BOARD_SPEED_MULT:  1.60,
    BOARD_FRICTION:    0.90,
    TILE:              48,      // display px per tile
});

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

    _updatePlayer({ id, transform: tf, velocity: v, physics: ph, player: pl }, state, level, input) {
        const onBoard  = state.hasSkateboard;
        const maxSpeed = C.MAX_WALK_SPEED * (onBoard ? C.BOARD_SPEED_MULT : 1);
        const friction = ph.onIce    ? C.FRICTION_ICE
                       : onBoard     ? C.BOARD_FRICTION
                       : ph.onGround ? C.FRICTION_GROUND : C.FRICTION_AIR;

        // Horizontal
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

        // Jump
        if (input.jumpPressed && ph.onGround) {
            v.vy             = C.JUMP_VELOCITY;
            ph.onGround      = false;
            ph.jumpHoldLeft  = C.JUMP_HOLD_FRAMES;
            pl.isJumping     = true;
        }
        if (ph.jumpHoldLeft > 0) {
            if (input.jump) { v.vy += C.JUMP_HOLD_BOOST; ph.jumpHoldLeft--; }
            else             { ph.jumpHoldLeft = 0; }
        }

        // Gravity
        if (!ph.onGround) v.vy = Math.min(v.vy + C.GRAVITY, C.MAX_FALL_SPEED);

        // Integrate
        tf.x += v.vx;
        tf.y += v.vy;

        // Collide
        ph.onGround = false;
        ph.onIce    = false;
        this.collision.resolveTiles(tf, v, ph, level);

        // Left-edge boundary
        if (tf.x < 0) { tf.x = 0; v.vx = 0; }

        // Fell into pit
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

        // Reverse at edges / walls when patrol AI
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

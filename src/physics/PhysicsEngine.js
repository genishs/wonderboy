import { C }               from './PhysicsConstants.js';
import { CollisionSystem }  from './CollisionSystem.js';

// ── Re-export C so existing importers (CollisionSystem, etc.) keep working ──
export { C };

/**
 * PhysicsEngine
 * Owned by Agent 2 (Physics & Controller Engineer).
 *
 * Handles per-frame integration, tile collision, player controller
 * (coyote time + jump buffer), and enemy AI (patrol / fly / frog).
 */
export class PhysicsEngine {
    constructor() {
        this.collision = new CollisionSystem();
    }

    // ── Debug hitbox visualiser ────────────────────────────────────────────
    /**
     * Set to true to enable hitbox rendering.
     * The Renderer reads PhysicsEngine.debugDrawCalls after drawing entities
     * and overlays each { x, y, w, h, color } rect.
     */
    static debugMode      = false;
    static debugDrawCalls = [];   // populated each frame when debugMode is true

    /**
     * Register an AABB for debug rendering this frame.
     * No-op when debugMode is false.
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @param {string} [color='rgba(0,255,0,0.5)']
     */
    static _debugDraw(x, y, w, h, color = 'rgba(0,255,0,0.5)') {
        if (PhysicsEngine.debugMode) {
            PhysicsEngine.debugDrawCalls.push({ x, y, w, h, color });
        }
    }

    // ── Main update ────────────────────────────────────────────────────────
    update(dt, ecs, state, level, input) {
        if (!level) return;

        // Clear debug draw list at the start of each frame
        PhysicsEngine.debugDrawCalls = [];

        for (const p of ecs.query('transform', 'velocity', 'physics', 'player')) {
            this._updatePlayer(p, state, level, input, ecs);
        }
        for (const proj of ecs.query('transform', 'velocity', 'projectile')) {
            this._updateProjectile(proj, level, ecs);
        }
        for (const e of ecs.query('transform', 'velocity', 'physics', 'enemy')) {
            this._updateEnemy(e, level, ecs);
        }
    }

    // ── Player ─────────────────────────────────────────────────────────────
    _updatePlayer({ id, transform: tf, velocity: v, physics: ph, player: pl }, state, level, input, ecs) {
        const onBoard  = state.hasSkateboard;
        const maxSpeed = C.MAX_WALK_SPEED * (onBoard ? C.BOARD_SPEED_MULT : 1);
        const friction = ph.onIce    ? C.FRICTION_ICE
                       : onBoard     ? C.BOARD_FRICTION
                       : ph.onGround ? C.FRICTION_GROUND : C.FRICTION_AIR;

        // ── Initialise coyote / buffer counters the first time ─────────────
        if (ph.coyoteFrames    === undefined) ph.coyoteFrames    = 0;
        if (ph.jumpBufferFrames === undefined) ph.jumpBufferFrames = 0;

        // ── Coyote-time counter ────────────────────────────────────────────
        // While on the ground the counter is kept full.
        // As soon as the player leaves the ground (without jumping) it counts
        // down to zero, and a jump is still permitted during that window.
        if (ph.onGround) {
            ph.coyoteFrames = C.COYOTE_FRAMES;
        } else if (ph.coyoteFrames > 0) {
            ph.coyoteFrames--;
        }

        // ── Jump-buffer counter ────────────────────────────────────────────
        // Pressing jump at any point charges the buffer; it decays each frame.
        // When the player lands (onGround becomes true later this frame) we
        // spend the buffer to trigger an immediate jump.
        if (input.jumpPressed) {
            ph.jumpBufferFrames = C.JUMP_BUFFER_FRAMES;
        } else if (ph.jumpBufferFrames > 0) {
            ph.jumpBufferFrames--;
        }

        // ── Horizontal ────────────────────────────────────────────────────
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

        // ── Jump trigger ──────────────────────────────────────────────────
        // A jump fires when:
        //   (a) jump was just pressed AND player is on ground or within coyote window, OR
        //   (b) player just landed AND the jump buffer is still active.
        const canJump         = ph.onGround || ph.coyoteFrames > 0;
        const jumpRequested   = input.jumpPressed || ph.jumpBufferFrames > 0;

        if (jumpRequested && canJump) {
            v.vy              = C.JUMP_VELOCITY;
            ph.onGround       = false;
            ph.coyoteFrames   = 0;   // consume coyote window
            ph.jumpBufferFrames = 0; // consume buffered input
            ph.jumpHoldLeft   = C.JUMP_HOLD_FRAMES;
            pl.isJumping      = true;
        }

        // ── Variable-height jump hold ─────────────────────────────────────
        if (ph.jumpHoldLeft > 0) {
            if (input.jump) { v.vy += C.JUMP_HOLD_BOOST; ph.jumpHoldLeft--; }
            else             { ph.jumpHoldLeft = 0; }
        }

        // ── Gravity ───────────────────────────────────────────────────────
        if (!ph.onGround) v.vy = Math.min(v.vy + C.GRAVITY, C.MAX_FALL_SPEED);

        // ── Integrate ─────────────────────────────────────────────────────
        tf.x += v.vx;
        tf.y += v.vy;

        // ── Tile collision ────────────────────────────────────────────────
        ph.onGround = false;
        ph.onIce    = false;
        this.collision.resolveTiles(tf, v, ph, level);

        // If we just landed and the buffer is still hot — trigger jump next frame
        // (the buffer counter will be spent at the top of the next frame's jump check)

        // ── Left-edge boundary ────────────────────────────────────────────
        if (tf.x < 0) { tf.x = 0; v.vx = 0; }

        // ── Fell into pit ─────────────────────────────────────────────────
        if (tf.y > level.height * C.TILE + 300) state.takeDamage();

        // ── Debug hitbox ──────────────────────────────────────────────────
        PhysicsEngine._debugDraw(tf.x, tf.y, tf.w, tf.h, 'rgba(0,255,0,0.6)');
    }

    // ── Projectile ─────────────────────────────────────────────────────────
    _updateProjectile({ id, transform: tf, velocity: v }, level, ecs) {
        v.vy += C.GRAVITY * 0.55;
        tf.x += v.vx;
        tf.y += v.vy;
        if (this.collision.solidAt(tf.x + tf.w / 2, tf.y + tf.h / 2, level)) {
            ecs.destroyEntity(id);
        }
    }

    // ── Enemy dispatcher ───────────────────────────────────────────────────
    _updateEnemy(entity, level, ecs) {
        const { enemy: en } = entity;

        if (en.ai === 'fly') {
            this._updateBee(entity, level, ecs);
        } else if (en.ai === 'frog') {
            this._updateFrog(entity, level, ecs);
        } else {
            this._updatePatrol(entity, level, ecs);
        }
    }

    // ── Patrol enemy (original walking AI) ────────────────────────────────
    _updatePatrol({ id, transform: tf, velocity: v, physics: ph, enemy: en }, level, ecs) {
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

        PhysicsEngine._debugDraw(tf.x, tf.y, tf.w, tf.h, 'rgba(255,80,80,0.6)');
    }

    // ── Bee enemy (ai: 'fly') ──────────────────────────────────────────────
    // Bees are not affected by gravity. They glide horizontally at constant
    // speed and oscillate vertically using a sine wave, mimicking the way the
    // original WB bees bobbed up and down while tracking the player.
    _updateBee({ id, transform: tf, velocity: v, physics: ph, enemy: en }, level, ecs) {
        // Initialise timer if absent
        if (en.timer === undefined) en.timer = 0;
        if (en.dir   === undefined) en.dir   = 1;

        // Vertical sine-wave motion — no gravity applied
        v.vy = Math.sin(en.timer * 3) * 1.5;
        en.timer += 0.016; // approximate dt; real dt passed only when available

        // Horizontal constant speed
        v.vx = en.dir * (en.speed ?? 1.5);

        // Integrate
        tf.x += v.vx;
        tf.y += v.vy;

        // Reverse direction at solid tile walls (horizontal collision only)
        const leadX = tf.x + (en.dir > 0 ? tf.w + 1 : -1);
        const midY  = tf.y + tf.h / 2;
        if (this.collision.solidAt(leadX, midY, level)) {
            en.dir *= -1;
            v.vx    = en.dir * (en.speed ?? 1.5);
        }

        PhysicsEngine._debugDraw(tf.x, tf.y, tf.w, tf.h, 'rgba(255,255,0,0.6)');
    }

    // ── Frog enemy (ai: 'frog') ────────────────────────────────────────────
    // Frogs sit still for 1.5 s then leap toward the player, just like the
    // original Wonder Boy frogs that would wait and pounce.
    _updateFrog({ id, transform: tf, velocity: v, physics: ph, enemy: en }, level, ecs) {
        // Initialise frog-specific state
        if (en.waitTimer  === undefined) en.waitTimer  = 0;
        if (en.frogsState === undefined) en.frogsState = 'sit'; // 'sit' | 'jump'

        // Gravity always applies so the frog lands after its leap
        v.vy = Math.min(v.vy + C.GRAVITY, C.MAX_FALL_SPEED);

        if (en.frogsState === 'sit') {
            // Sitting: count up toward 1.5 s (assuming ~60 fps, 1.5 s ≈ 90 frames)
            v.vx = 0;
            en.waitTimer++;

            if (en.waitTimer >= 90) {
                // Find the player to determine jump direction
                const players = ecs.query('transform', 'player');
                let sign = 1;
                if (players.length > 0) {
                    const pt = players[0].transform;
                    sign = pt.x >= tf.x ? 1 : -1;
                }

                // Launch the frog
                v.vx           = sign * 2.5;
                v.vy           = -6;
                en.frogsState  = 'jump';
                en.waitTimer   = 0;
                ph.onGround    = false;
            }
        }

        // Integrate
        tf.x += v.vx;
        tf.y += v.vy;

        ph.onGround = false;
        this.collision.resolveTiles(tf, v, ph, level);

        // When the frog lands after its jump, reset to sitting
        if (en.frogsState === 'jump' && ph.onGround) {
            en.frogsState = 'sit';
            v.vx = 0;
        }

        PhysicsEngine._debugDraw(tf.x, tf.y, tf.w, tf.h, 'rgba(0,180,255,0.6)');
    }
}

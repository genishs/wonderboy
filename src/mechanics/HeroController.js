// owning agent: dev-lead
// TODO: Hero (Reed) FSM + variable-jump + attack overlay.
//
// v0.25.2: HP / iframes / hurt-lock / knockback removed.
//   - Hero state goes straight to 'dead' on any damage (CombatSystem flips it).
//   - Vitality is the single life-line; StateManager.killHero() owns the GAME_OVER trigger.
//   - This module only owns movement, jump, and attack-spawn. Damage is resolved in CombatSystem.

import { HERO } from '../config/PhaseOneTunables.js';
import { CollisionSystem } from '../physics/CollisionSystem.js';

const TILE = 48;
const FRICTION_GROUND = 0.80;
const FRICTION_AIR    = 0.95;
const MAX_FALL        = 12.0;

export class HeroController {
    constructor() {
        this.collision = new CollisionSystem();
    }

    update(ecs, level, input, state, stoneflakeSystem) {
        const players = ecs.query('transform', 'velocity', 'physics', 'player');
        if (!players.length || !level) return;
        const { transform: tf, velocity: v, physics: ph, player: pl } = players[0];
        if (!pl._phase1) return; // legacy path handled by PhysicsEngine

        if (pl.attackCooldown > 0) pl.attackCooldown--;
        if (pl.attackOverlayFrames > 0) pl.attackOverlayFrames--;

        // Death state — terminal in Phase 1
        if (state.gameState === 'GAME_OVER') {
            pl.aiState = 'dead';
            v.vx = 0;
            this._applyGravity(v, ph);
            tf.x += v.vx; tf.y += v.vy;
            ph.onGround = false;
            this.collision.resolveTiles(tf, v, ph, level);
            return;
        }

        // ── Horizontal input ─────────────────────────────────────────────
        if (input.right) {
            v.vx = HERO.walkSpeed;
            pl.facingRight = true;
        } else if (input.left) {
            v.vx = -HERO.walkSpeed;
            pl.facingRight = false;
        } else {
            const fric = ph.onGround ? FRICTION_GROUND : FRICTION_AIR;
            v.vx *= fric;
            if (Math.abs(v.vx) < 0.05) v.vx = 0;
        }

        // ── Jump (variable height) ───────────────────────────────────────
        if (ph.onGround) pl.coyoteTimer = HERO.coyoteFrames;
        else if (pl.coyoteTimer > 0) pl.coyoteTimer--;

        if (input.jumpPressed) pl.jumpBuffer = HERO.bufferFrames;
        else if (pl.jumpBuffer > 0) pl.jumpBuffer--;

        if (pl.jumpBuffer > 0 && pl.coyoteTimer > 0) {
            v.vy = HERO.jumpVy0;
            pl.isJumping = true;
            ph.onGround  = false;
            pl.jumpBuffer = 0;
            pl.coyoteTimer = 0;
        }

        // Jump-cut
        if (input.jumpReleased && v.vy < 0) {
            v.vy *= HERO.jumpCutFactor;
        }

        // ── Gravity ──────────────────────────────────────────────────────
        this._applyGravity(v, ph);

        // ── Attack spawn ─────────────────────────────────────────────────
        if (pl.attackCooldown === 0 && input.attack && stoneflakeSystem) {
            const spawned = stoneflakeSystem.tryThrow(ecs, tf, pl);
            if (spawned) {
                pl.attackCooldown = HERO.attackCooldown;
                pl.attackOverlayFrames = HERO.attackOverlay;
            }
        }

        // ── Apply velocity, resolve tiles ────────────────────────────────
        tf.x += v.vx;
        tf.y += v.vy;
        ph.onGround = false;
        ph.onIce    = false;
        this.collision.resolveTiles(tf, v, ph, level);

        // ── Movement state for renderer animation pick ───────────────────
        if (!ph.onGround) pl.aiState = (v.vy < 0) ? 'jump_rising' : 'jump_falling';
        else if (Math.abs(v.vx) > 0.1) pl.aiState = 'walk';
        else pl.aiState = 'idle';

        // ── Bounds: prevent leaving canvas ───────────────────────────────
        if (tf.x < 0) { tf.x = 0; v.vx = 0; }
        const maxX = level.cols * TILE - tf.w;
        if (tf.x > maxX) { tf.x = maxX; v.vx = 0; }

        // Death by pit (none on Phase 1 stage but keep guard)
        if (tf.y > level.rows * TILE + 200) {
            state.killHero();
        }
    }

    _applyGravity(v, ph) {
        if (!ph.onGround) v.vy = Math.min(v.vy + HERO.gravity, MAX_FALL);
    }
}

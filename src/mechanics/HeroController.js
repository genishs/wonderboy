// owning agent: dev-lead
// TODO: Hero (Reed) FSM + variable-jump + attack overlay.
//
// v0.25.2: HP / iframes / hurt-lock / knockback removed. Vitality is the single life-line.
// v0.50:   Phase 2 path adds `pl.armed` gating for X (no-op when unarmed) and freezes
//          input during state.gameState === 'TRANSITIONING' / 'STAGE_CLEAR'. The Phase 2
//          path also routes attack through HatchetSystem instead of StoneflakeSystem.

import { HERO }            from '../config/PhaseOneTunables.js';
import { HERO_P2 }         from '../config/PhaseTwoTunables.js';
import { CollisionSystem } from '../physics/CollisionSystem.js';

const TILE = 48;
const FRICTION_GROUND = 0.80;
const FRICTION_AIR    = 0.95;
const MAX_FALL        = 12.0;

export class HeroController {
    constructor() {
        this.collision = new CollisionSystem();
    }

    /**
     * @param {ECS} ecs
     * @param {TileMap} level
     * @param {InputHandler} input
     * @param {StateManager} state
     * @param {*} stoneflakeSystem  Phase 1 projectile (legacy; ignored when hatchetSystem provided)
     * @param {*} hatchetSystem     Phase 2 projectile (preferred when present)
     */
    update(ecs, level, input, state, stoneflakeSystem, hatchetSystem = null) {
        const players = ecs.query('transform', 'velocity', 'physics', 'player');
        if (!players.length || !level) return;
        const { transform: tf, velocity: v, physics: ph, player: pl } = players[0];
        if (!pl._phase1) return; // legacy path handled by PhysicsEngine

        if (pl.attackCooldown > 0) pl.attackCooldown--;
        if (pl.attackOverlayFrames > 0) pl.attackOverlayFrames--;

        // Phase 2: freeze input during transitions / stage-clear, but still apply gravity.
        const transitionLock = (state.gameState === 'TRANSITIONING' || state.gameState === 'STAGE_CLEAR');

        // Death state — terminal in Phase 1+2
        if (state.gameState === 'GAME_OVER') {
            pl.aiState = 'dead';
            v.vx = 0;
            this._applyGravity(v, ph, pl);
            tf.x += v.vx; tf.y += v.vy;
            ph.onGround = false;
            this.collision.resolveTiles(tf, v, ph, level);
            return;
        }

        // ── Horizontal input ─────────────────────────────────────────────
        if (transitionLock) {
            // No directional input; let friction settle vx.
            const fric = ph.onGround ? FRICTION_GROUND : FRICTION_AIR;
            v.vx *= fric;
            if (Math.abs(v.vx) < 0.05) v.vx = 0;
        } else {
            const ws = pl._phase2 ? HERO_P2.walkSpeed : HERO.walkSpeed;
            if (input.right) {
                v.vx = ws;
                pl.facingRight = true;
            } else if (input.left) {
                v.vx = -ws;
                pl.facingRight = false;
            } else {
                const fric = ph.onGround ? FRICTION_GROUND : FRICTION_AIR;
                v.vx *= fric;
                if (Math.abs(v.vx) < 0.05) v.vx = 0;
            }
        }

        // ── Jump (variable height) ───────────────────────────────────────
        if (ph.onGround) pl.coyoteTimer = HERO.coyoteFrames;
        else if (pl.coyoteTimer > 0) pl.coyoteTimer--;

        if (!transitionLock && input.jumpPressed) pl.jumpBuffer = HERO.bufferFrames;
        else if (pl.jumpBuffer > 0) pl.jumpBuffer--;

        if (!transitionLock && pl.jumpBuffer > 0 && pl.coyoteTimer > 0) {
            v.vy = HERO.jumpVy0;
            pl.isJumping = true;
            ph.onGround  = false;
            pl.jumpBuffer = 0;
            pl.coyoteTimer = 0;
        }

        // Jump-cut
        if (!transitionLock && input.jumpReleased && v.vy < 0) {
            v.vy *= HERO.jumpCutFactor;
        }

        // ── Gravity ──────────────────────────────────────────────────────
        this._applyGravity(v, ph, pl);

        // ── Attack spawn ─────────────────────────────────────────────────
        if (!transitionLock && pl.attackCooldown === 0 && input.attack) {
            if (hatchetSystem && pl._phase2) {
                if (pl.armed === true) {
                    const spawned = hatchetSystem.tryThrow(ecs, tf, pl);
                    if (spawned) {
                        pl.attackCooldown      = HERO_P2.attackCooldown;
                        pl.attackOverlayFrames = HERO_P2.attackOverlay;
                    }
                }
                // else: silent no-op; do not burn cooldown or play attack overlay.
            } else if (stoneflakeSystem) {
                const spawned = stoneflakeSystem.tryThrow(ecs, tf, pl);
                if (spawned) {
                    pl.attackCooldown      = HERO.attackCooldown;
                    pl.attackOverlayFrames = HERO.attackOverlay;
                }
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

        // Death by pit
        if (tf.y > level.rows * TILE + 200) {
            state.killHero();
        }
    }

    _applyGravity(v, ph, pl) {
        const g = (pl && pl._phase2) ? HERO_P2.gravity : HERO.gravity;
        if (!ph.onGround) v.vy = Math.min(v.vy + g, MAX_FALL);
    }
}

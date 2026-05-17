// owning agent: dev-lead
// TODO: Hero (Reed) FSM + variable-jump + attack overlay.
//
// v0.25.2: HP / iframes / hurt-lock / knockback removed. Vitality is the single life-line.
// v0.50:   Phase 2 path adds `pl.armed` gating for X (no-op when unarmed) and freezes
//          input during state.gameState === 'TRANSITIONING' / 'STAGE_CLEAR'. The Phase 2
//          path also routes attack through HatchetSystem instead of StoneflakeSystem.
// v0.50.2: Phase 2 adds:
//   - 'sprint' aiState (X-held while moving on ground), wired to the new sprint /
//     sprint_armed sprite anims.
//   - 'stumble' aiState (rock-trip from CollisionSystem._heroRockContacts) with
//     vitality drain + brief input lock.
//   - 'dying' aiState — death sequence (knockback + fall) before loseLife() fires.
//   - GAME_OVER continue-input handling: any of jump/attack/sprint resumes via
//     state.continueRun() and rebuilds the stage from scratch.

import { HERO }              from '../config/PhaseOneTunables.js';
import { HERO_P2, ROCK }     from '../config/PhaseTwoTunables.js';
import { CollisionSystem }   from '../physics/CollisionSystem.js';

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
        if ((pl.stumbleFrames | 0) > 0) pl.stumbleFrames--;
        if ((pl.stumbleCooldown | 0) > 0) pl.stumbleCooldown--;
        // NOTE: dyingFrames is decremented inside the dying block below so we
        // can detect the 1→0 edge cleanly and fire loseLife() on the same frame.

        // Phase 2 / v0.75: freeze input during transitions / stage-clear, but still
        // apply gravity. STAGE_TRANSITION is the v0.75 inter-stage fade ritual; input
        // stays frozen for the whole ritual. AREA_CLEARED is the post-boss closure
        // overlay; input frozen too (any key dismisses to TITLE via the overlay path,
        // handled separately below).
        const transitionLock = (state.gameState === 'TRANSITIONING'
                             || state.gameState === 'STAGE_CLEAR'
                             || state.gameState === 'STAGE_TRANSITION'
                             || state.gameState === 'AREA_CLEARED');

        // Death state — terminal in Phase 1; respawn-pending in Phase 2.
        // v0.50.1 — Phase 2 RESPAWNING freezes the hero in place; StageManager
        // owns the actual repositioning + state flip back to PLAYING.
        if (state.gameState === 'GAME_OVER') {
            // v0.50.2 — Phase 2 "press any key to continue" path. Any of the
            // gameplay action / direction inputs resumes via state.continueRun(),
            // which StageManager observes (RESPAWNING + _stageRestartPending →
            // wipe & rebuild stage from scratch). We deliberately accept the
            // sprint key as a level-triggered input (not edge-triggered) so a
            // player who died with X held can release-and-keep-holding to
            // resume — but jump/attack stay edge-triggered to prevent an
            // accidental immediate retry on a stuck key.
            if (pl._phase2 && state.continueRun &&
                (input.jumpPressed || input.attack || input.sprintHeld ||
                 input.left || input.right)) {
                state.continueRun();
                return;
            }
            pl.aiState = 'dead';
            v.vx = 0;
            this._applyGravity(v, ph, pl);
            tf.x += v.vx; tf.y += v.vy;
            ph.onGround = false;
            this.collision.resolveTiles(tf, v, ph, level, !!pl._phase2);
            return;
        }
        if (state.gameState === 'RESPAWNING') {
            pl.aiState = 'dead';
            v.vx = 0;
            v.vy = 0;
            // Clear any pending stumble/dying timers so the post-respawn hero
            // doesn't inherit a stumble lock from the moment they died.
            pl.stumbleFrames = 0;
            pl.stumbleCooldown = 0;
            pl.dyingFrames = 0;
            return;
        }
        // v1.0 — CREDITS dismiss. Any input → trigger a fresh run from Area 1
        // (the user has finished the game and chosen to start again). Re-uses
        // the dismissAreaCleared-style "advance to Area" pending flag — we set
        // _nextAreaPending = 1 and flip to RESPAWNING so AreaManager rebuilds.
        if (state.gameState === 'CREDITS') {
            if (input.jumpPressed || input.attack || input.sprintHeld ||
                input.left || input.right) {
                state.lives  = state.maxLives;
                state.hunger = state.maxHunger;
                state._nextAreaPending     = 1;
                state._areaRestartPending  = true;
                state._stageRestartPending = false;
                state._creditsPending      = false;
                state.setGameState('RESPAWNING');
            }
            pl.aiState = 'idle';
            v.vx = 0;
            return;
        }
        if (state.gameState === 'AREA_CLEARED') {
            // v0.75 — Area-cleared overlay holds. Any of the gameplay action /
            // direction inputs dismisses the overlay.
            //
            // v0.75.1 — instead of dropping to TITLE, the run LOOPS back to
            // Stage 1 fresh (Area 2 isn't built yet). state.dismissAreaCleared
            // reuses the GAME_OVER → continueRun full-Area reset path: lives
            // refill to 3, vitality refills to max, pl.armed clears, and
            // AreaManager.update sees RESPAWNING + _areaRestartPending on the
            // next tick and rebuilds Area 1 Stage 1 from scratch.
            if (pl._phase2 && state.dismissAreaCleared &&
                (input.jumpPressed || input.attack || input.sprintHeld ||
                 input.left || input.right)) {
                state.dismissAreaCleared();
                return;
            }
            pl.aiState = 'idle';
            v.vx = 0;
            return;
        }
        if (state.gameState === 'STAGE_TRANSITION') {
            // v0.75 — physics & input frozen during the inter-stage ritual.
            // StageTransitionSystem advances the phases.
            v.vx = 0;
            v.vy = 0;
            pl.aiState = 'idle';
            return;
        }

        // v0.50.2 — vitality-zero death deferred from state.update (Phase 2).
        // state.update can't call beginDying(player) without an ECS handle, so it
        // sets _dyingPending and we consume here.
        if (pl._phase2 && state._dyingPending) {
            state._dyingPending = false;
            state.beginDying({ player: pl, transform: tf, velocity: v });
            // Fall through into the dyingFrames block below on the same frame.
        }

        // v0.50.2 — dying sequence: knockback + fall, no input. State stays
        // PLAYING during this beat so the renderer doesn't drop the death anim
        // into the GAME_OVER overlay path. When dyingFrames decays from 1 to 0
        // on this frame, fire state.loseLife() at the end of the block.
        if ((pl.dyingFrames | 0) > 0) {
            pl.aiState = 'dying';
            // Apply gravity; let Reed fall and settle. Don't damp vx to allow
            // the knockback arc to read.
            this._applyGravity(v, ph, pl);
            // Mild horizontal friction so Reed doesn't slide forever after impact.
            const fric = ph.onGround ? FRICTION_GROUND : FRICTION_AIR;
            v.vx *= fric;
            if (Math.abs(v.vx) < 0.05) v.vx = 0;
            tf.x += v.vx; tf.y += v.vy;
            ph.onGround = false;
            ph.onIce    = false;
            this.collision.resolveTiles(tf, v, ph, level, true);
            // Bounds (don't fly out of stage during the knockback arc).
            if (tf.x < 0) { tf.x = 0; v.vx = 0; }
            const maxX = level.cols * TILE - tf.w;
            if (tf.x > maxX) { tf.x = maxX; v.vx = 0; }
            // Decrement at the END of the block so we observe the 1→0 edge.
            pl.dyingFrames--;
            if (pl.dyingFrames === 0) {
                // Hand off to the lives system. loseLife() flips gameState to
                // RESPAWNING (or GAME_OVER on the final life via state.killHero
                // wrapper — see StateManager.loseLife v0.50.2).
                state.loseLife();
            }
            return;
        }

        // v0.50.2 — stumble FSM: input locked, gravity normal, decrement timer
        // already done above. We still apply gravity / collision below the input
        // block.
        const stumbleLock = ((pl.stumbleFrames | 0) > 0);

        // ── Horizontal input ─────────────────────────────────────────────
        let sprintActive = false;
        if (transitionLock || stumbleLock) {
            // No directional input; let friction settle vx.
            const fric = ph.onGround ? FRICTION_GROUND : FRICTION_AIR;
            v.vx *= fric;
            if (Math.abs(v.vx) < 0.05) v.vx = 0;
        } else {
            // v0.50.1: X-held = sprint modifier (Phase 2 only). Phase 1 retro debug
            // ignores sprintHeld and keeps legacy behavior.
            sprintActive       = !!(pl._phase2 && input.sprintHeld);
            const sprintMult   = sprintActive ? HERO_P2.sprintMultiplier : 1;
            const baseWs       = pl._phase2 ? HERO_P2.walkSpeed : HERO.walkSpeed;
            const ws           = baseWs * sprintMult;
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

        if (!transitionLock && !stumbleLock && pl.jumpBuffer > 0 && pl.coyoteTimer > 0) {
            // v0.50.1: Phase 2 — X held at jump-start gives a 15% higher peak.
            // Phase 1 retro debug keeps legacy HERO.jumpVy0 unconditionally.
            const baseJumpVy0 = pl._phase2 ? HERO_P2.jumpVy0 : HERO.jumpVy0;
            // sprintActive computed once at the top of input handling above.
            v.vy = sprintActive ? baseJumpVy0 * HERO_P2.sprintJumpMultiplier : baseJumpVy0;
            pl.isJumping = true;
            ph.onGround  = false;
            pl.jumpBuffer = 0;
            pl.coyoteTimer = 0;
            // v1.0 — jump SFX. Fired here (not on input.jumpPressed) so the
            // sound matches the actual takeoff, not the buffered intent.
            if (typeof globalThis !== 'undefined' && globalThis.audio) {
                globalThis.audio.playSFX('jump');
            }
        }

        // Jump-cut
        if (!transitionLock && !stumbleLock && input.jumpReleased && v.vy < 0) {
            v.vy *= HERO.jumpCutFactor;
        }

        // ── Gravity ──────────────────────────────────────────────────────
        this._applyGravity(v, ph, pl);

        // ── Attack spawn ─────────────────────────────────────────────────
        if (!transitionLock && !stumbleLock && pl.attackCooldown === 0 && input.attack) {
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
        // v0.50.2 — pass isHero=true so the collision pass enables auto-step-up
        // (issue 6) and rock-pass-through-with-event (issue 5) for Phase 2 hero.
        // Phase 1 retro debug also benefits from step-up; the rock-event path is
        // a no-op when there are no decorations.
        this.collision.resolveTiles(tf, v, ph, level, true);

        // ── Rock contact → stumble FSM (Phase 2, v0.50.2) ────────────────
        // CollisionSystem populates level._heroRockContacts during the sweep when
        // isHero=true. We consume them here. Re-trigger guard: a single rock
        // can only trip Reed once per "visit." We remember the (col,row) of the
        // last tripped rock in pl._lastRockTripKey and only re-arm when the
        // current frame has NO contact with that rock (Reed has fully walked
        // off it). Combined with stumbleFrames/stumbleCooldown this handles
        // both "still standing on the rock" and "wandering back onto it."
        if (pl._phase2 && level._heroRockContacts && level._heroRockContacts.length > 0) {
            // Check if last-tripped rock is still in contact this frame.
            const lastKey = pl._lastRockTripKey || null;
            let stillOnLast = false;
            for (const rc of level._heroRockContacts) {
                const k = `${rc.col},${rc.row}`;
                if (k === lastKey) { stillOnLast = true; break; }
            }
            const canTrip = ((pl.stumbleFrames | 0) === 0)
                         && ((pl.stumbleCooldown | 0) === 0)
                         && !stillOnLast;
            if (canTrip) {
                const first = level._heroRockContacts[0];
                pl._lastRockTripKey = `${first.col},${first.row}`;
                pl.stumbleFrames   = ROCK.stumbleFrames;
                pl.stumbleCooldown = ROCK.stumbleFrames + ROCK.cooldownFrames;
                v.vx *= ROCK.velocityKill;
                if (Math.abs(v.vx) < 0.05) v.vx = 0;
                state.hunger = Math.max(0, (state.hunger | 0) - ROCK.vitalityDrain);
            }
        } else if (pl._phase2) {
            // No contacts this frame — Reed has walked clear; the next rock
            // will be a fresh trip.
            pl._lastRockTripKey = null;
        }

        // ── Movement state for renderer animation pick ───────────────────
        // v0.50.2 — sprint replaces walk when X is held; stumble overrides
        // everything ground-side (dying handled at top of update; never reaches
        // here). Sprint requires real horizontal velocity AND ground contact —
        // matches the design brief recipe in preview-hero-reed-v0502.md.
        if ((pl.stumbleFrames | 0) > 0) {
            pl.aiState = 'stumble';
        } else if (!ph.onGround) {
            pl.aiState = (v.vy < 0) ? 'jump_rising' : 'jump_falling';
        } else if (sprintActive && Math.abs(v.vx) > 0.1) {
            pl.aiState = 'sprint';
        } else if (Math.abs(v.vx) > 0.1) {
            pl.aiState = 'walk';
        } else {
            pl.aiState = 'idle';
        }

        // ── Bounds: prevent leaving canvas ───────────────────────────────
        if (tf.x < 0) { tf.x = 0; v.vx = 0; }
        const maxX = level.cols * TILE - tf.w;
        if (tf.x > maxX) { tf.x = maxX; v.vx = 0; }

        // Death by pit
        if (tf.y > level.rows * TILE + 200) {
            // v0.50.1 — pass player so Phase 2 routes through loseLife/RESPAWNING.
            // v0.50.2 — Phase 2 routes through state.beginDying (knockback +
            // dying anim before lives decrement). Phase 1 / GAME_OVER unchanged.
            if (pl._phase2 && state.beginDying) {
                state.beginDying({ player: pl, transform: tf, velocity: v });
            } else {
                state.killHero({ player: pl });
            }
        }
    }

    _applyGravity(v, ph, pl) {
        const g = (pl && pl._phase2) ? HERO_P2.gravity : HERO.gravity;
        if (!ph.onGround) v.vy = Math.min(v.vy + g, MAX_FALL);
    }
}

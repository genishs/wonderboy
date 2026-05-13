// owning agent: dev-lead
// TODO: Phase 2 enemies — Mossplodder (forward-only crawler) + Hummerwing (low-altitude
// flier with sine bob). Both die in 1 hatchet hit; both deal contact damage in their
// alive state. Mossplodder uses gravity + slope-aware ground pinning; Hummerwing
// drifts at fixed baseY with a small sine bob. On death, Hummerwing falls under
// hero-gravity until ground contact, then despawns at the end of deathFrames.

import { MOSSPLODDER, HUMMERWING } from '../config/PhaseTwoTunables.js';
import { THREADSHADE }              from '../config/PhaseThreeTunables.js';
import { CollisionSystem }         from '../physics/CollisionSystem.js';

const TILE     = 48;
const MAX_FALL = 12.0;

/**
 * Initial-state factory for Phase 2 enemies. baseY is required for Hummerwing
 * (the absolute world-Y the bob centers on); ignored for Mossplodder.
 */
export const initEnemyP2 = (type, dir, baseY = null) => {
    if (type === 'mossplodder') {
        return {
            type, dir, ai: 'walk',
            hp: 1, hpMax: 1,
            stateTimer: 0, cooldown: 0, aiTimer: 0,
            baseY: null, deathFrames: 0, hurtFrames: 0,
        };
    }
    if (type === 'hummerwing') {
        return {
            type, dir, ai: 'drift',
            hp: 1, hpMax: 1,
            stateTimer: 0, cooldown: 0, aiTimer: 0,
            baseY, deathFrames: 0, hurtFrames: 0,
        };
    }
    // v0.75.1 — Threadshade. Hangs from a fixed x; baseY is the sine midpoint.
    // `aiTimer` is randomized per-spawn so multiple Threadshades in the same
    // stage don't bob in lockstep (story brief §16.8). dir is unused.
    if (type === 'threadshade') {
        return {
            type, dir: 0, ai: 'swing',
            hp: 1, hpMax: 1,
            stateTimer: 0, cooldown: 0,
            aiTimer: Math.floor(Math.random() * 100),
            baseY, deathFrames: 0, hurtFrames: 0,
        };
    }
    return { type, dir, ai: 'walk', hp: 1, hpMax: 1, stateTimer: 0, cooldown: 0, aiTimer: 0, baseY, deathFrames: 0, hurtFrames: 0 };
};

export class Phase2EnemyAI {
    constructor() {
        this.collision = new CollisionSystem();
        this._t = 0;
    }

    update(ecs, level) {
        if (!level) return;
        this._t++;
        for (const row of ecs.query('transform', 'velocity', 'enemy')) {
            const en = row.enemy;
            if (en.type === 'mossplodder') this._tickMossplodder(row, level);
            else if (en.type === 'hummerwing') this._tickHummerwing(row, level);
            else if (en.type === 'threadshade') this._tickThreadshade(row, level);
        }

        // Death cleanup
        for (const row of ecs.query('enemy')) {
            const en = row.enemy;
            if (en.type !== 'mossplodder' && en.type !== 'hummerwing' && en.type !== 'threadshade') continue;
            if (en.ai === 'dead') {
                en.deathFrames = Math.max(0, (en.deathFrames || 0) - 1);
                if (en.deathFrames === 0) ecs.destroyEntity(row.id);
            }
        }
    }

    // ── Mossplodder ──────────────────────────────────────────────────────
    _tickMossplodder({ id, transform: tf, velocity: v, physics: ph, enemy: en }, level) {
        if (en.ai === 'dead') {
            v.vx = 0;
            // Gentle settle
            v.vy = Math.min(v.vy + MOSSPLODDER.gravity, MAX_FALL);
            tf.y += v.vy;
            return;
        }

        // Forward-only motion at constant horizontal speed.
        v.vx = en.dir * MOSSPLODDER.walkSpeed;

        // Apply gravity always; slope/floor pinning will zero vy.
        v.vy = Math.min(v.vy + MOSSPLODDER.gravity, MAX_FALL);

        tf.x += v.vx;
        tf.y += v.vy;
        if (ph) {
            ph.onGround = false;
            ph.onIce    = false;
            this.collision.resolveTiles(tf, v, ph, level);
        }

        // Wall stop: on full horizontal halt against a solid wall, vx is already 0
        // (collision sets it). Hold walk frame 1 (renderer uses aiTimer for animation
        // timing; we simply leave aiTimer alone — animation frames cycle naturally).

        // Despawn ~2 tiles below the level's bottom.
        if (tf.y > level.rows * TILE + 96) {
            // Use undefined-id-safety
            // (id is on the row, captured above)
            // eslint-disable-next-line no-unused-expressions
            id;
            // Caller's ecs is closed over via this.update's loop — but we don't have
            // direct access here. Schedule via a flag on the enemy and let the death-
            // cleanup pass remove it cleanly: set ai='dead' and frames=0.
            en.ai = 'dead';
            en.deathFrames = 0;
        }

        // Despawn off the right edge if the right-facing one walks past round end.
        if (tf.x > level.cols * TILE + 96) {
            en.ai = 'dead';
            en.deathFrames = 0;
        }
    }

    // ── Hummerwing ───────────────────────────────────────────────────────
    _tickHummerwing({ transform: tf, velocity: v, enemy: en }, level) {
        if (en.ai === 'dead') {
            // Body falls under hero-gravity; despawn on ground contact (or after
            // deathFrames) — for simplicity, just apply gravity here; cleanup pass
            // destroys it.
            v.vx = 0;
            v.vy = Math.min(v.vy + HUMMERWING.gravity, MAX_FALL);
            tf.y += v.vy;
            // Stop at floor row when we hit it (bottom of level).
            const floorY = level.rows * TILE - 1;
            if (tf.y + tf.h >= floorY) {
                tf.y = floorY - tf.h;
                v.vy = 0;
            }
            return;
        }

        en.aiTimer = (en.aiTimer || 0) + 1;
        if (en.baseY == null) en.baseY = tf.y + tf.h / 2;
        tf.x += en.dir * HUMMERWING.driftVx;
        const bob = Math.sin(en.aiTimer * HUMMERWING.bobFrequency) * HUMMERWING.bobAmplitude;
        tf.y = en.baseY + bob - tf.h / 2;
        v.vx = 0;
        v.vy = 0;

        // Despawn off-screen extremes.
        if (tf.x < -96 || tf.x > level.cols * TILE + 96) {
            en.ai = 'dead';
            en.deathFrames = 0;
        }
    }

    // ── Threadshade (v0.75.1) ────────────────────────────────────────────
    // Vertical-only oscillator. Fixed x-column at spawn; sine bob around
    // baseY with frequency 0.04 rad/frame and amplitude 1.5 tiles. Per story
    // brief §16: "patient breath, not buzz." Body contact = 1-hit-kill on
    // hero (CombatSystem._heroVsEnemyContact already handles this); hatchet
    // hit = 1-hit-kill on Threadshade (CombatSystem._killEnemyP2 also handles
    // this via the type-list extension below).
    _tickThreadshade({ transform: tf, velocity: v, enemy: en }, level) {
        if (en.ai === 'dead') {
            // Death = thread snap + gravity drop. Body falls under gravity
            // until it hits the floor row, then settles for the rest of the
            // death anim. dyingFrames countdown is owned by the cleanup pass.
            v.vx = 0;
            v.vy = Math.min((v.vy || 0) + 0.45, MAX_FALL);
            tf.y += v.vy;
            const floorY = level.rows * TILE - 1;
            if (tf.y + tf.h >= floorY) {
                tf.y = floorY - tf.h;
                v.vy = 0;
            }
            return;
        }

        en.aiTimer = (en.aiTimer || 0) + 1;
        if (en.baseY == null) en.baseY = tf.y;
        // Sine vertical motion. Amplitude in pixels = 1.5 tiles = 72 px.
        const amplitudePx = THREADSHADE.amplitude * TILE;
        const bob = Math.sin(en.aiTimer * THREADSHADE.frequency) * amplitudePx;
        tf.y = en.baseY + bob;
        v.vx = 0;
        v.vy = 0;
    }
}

// owning agent: dev-lead
// TODO: Phase 2 enemies — Mossplodder (forward-only crawler) + Hummerwing (low-altitude
// flier with sine bob). Both die in 1 hatchet hit; both deal contact damage in their
// alive state. Mossplodder uses gravity + slope-aware ground pinning; Hummerwing
// drifts at fixed baseY with a small sine bob. On death, Hummerwing falls under
// hero-gravity until ground contact, then despawns at the end of deathFrames.

import { MOSSPLODDER, HUMMERWING } from '../config/PhaseTwoTunables.js';
import { THREADSHADE, CINDERWISP, QUARRYWIGHT, SKYHOOK }
    from '../config/PhaseThreeTunables.js';
import { CollisionSystem }         from '../physics/CollisionSystem.js';

const TILE     = 48;
const MAX_FALL = 12.0;

// v1.0 — audio singleton fire-and-forget helper.
const _sfx = (name) => {
    if (typeof globalThis !== 'undefined' && globalThis.audio) {
        globalThis.audio.playSFX(name);
    }
};

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
    // v1.0 — Cinderwisp. Windborne drifter at upper third. baseY is the sine
    // midpoint; aiTimer randomized for desync.
    if (type === 'cinderwisp') {
        return {
            type, dir: -1, ai: 'drift',
            hp: 1, hpMax: 1,
            stateTimer: 0, cooldown: 0,
            aiTimer: Math.floor(Math.random() * 60),
            baseY, deathFrames: 0, hurtFrames: 0,
        };
    }
    // v1.0 — Quarrywight. Armored stone walker. armor=true → first hatchet hit
    // strips armor; second kills.
    if (type === 'quarrywight') {
        return {
            type, dir: -1, ai: 'walk',
            hp: QUARRYWIGHT.totalHp, hpMax: QUARRYWIGHT.totalHp,
            armored: true,
            stateTimer: 0, cooldown: 0, aiTimer: 0,
            baseY, deathFrames: 0, hurtFrames: 0,
        };
    }
    // v1.0 — Skyhook. FSM (perched → triggered → falling → landed → walking).
    // perchedCol/perchedRow store the original tile so the AI can re-anchor.
    if (type === 'skyhook') {
        return {
            type, dir: -1, ai: 'perched',
            hp: 1, hpMax: 1,
            stateTimer: 0, cooldown: 0, aiTimer: 0,
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
        // v1.0 — find hero entity once so the Skyhook trigger check has a
        // reference. Cached on every tick (cheap).
        const heroes = ecs.query('transform', 'player');
        const heroTf = heroes.length ? heroes[0].transform : null;

        for (const row of ecs.query('transform', 'velocity', 'enemy')) {
            const en = row.enemy;
            if (en.type === 'mossplodder')       this._tickMossplodder(row, level);
            else if (en.type === 'hummerwing')   this._tickHummerwing(row, level);
            else if (en.type === 'threadshade')  this._tickThreadshade(row, level);
            else if (en.type === 'cinderwisp')   this._tickCinderwisp(row, level);
            else if (en.type === 'quarrywight')  this._tickQuarrywight(row, level);
            else if (en.type === 'skyhook')      this._tickSkyhook(row, level, heroTf);
        }

        // Death cleanup
        const cleanupTypes = new Set([
            'mossplodder', 'hummerwing', 'threadshade',
            'cinderwisp',  'quarrywight', 'skyhook',
        ]);
        for (const row of ecs.query('enemy')) {
            const en = row.enemy;
            if (!cleanupTypes.has(en.type)) continue;
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

    // ── Cinderwisp (v1.0) ────────────────────────────────────────────────
    // Windborne drifter. Drifts LEFT at fixed speed while bobbing on a sine
    // curve centered on baseY. Per docs/briefs/phase4-area2-cast.md §2.1.
    _tickCinderwisp({ transform: tf, velocity: v, enemy: en }, level) {
        if (en.ai === 'dead') {
            // Ember-scatter fall — drift sideways slightly, no gravity (the
            // bundle dissipates rather than falls). deathFrames countdown is
            // owned by the cleanup pass.
            v.vx = 0; v.vy = 0;
            return;
        }
        en.aiTimer = (en.aiTimer || 0) + 1;
        if (en.baseY == null) en.baseY = tf.y + tf.h / 2;
        tf.x -= CINDERWISP.driftXPerFrame;
        const bob = Math.sin(en.aiTimer * (Math.PI * 2 / CINDERWISP.bobPeriodFrames))
                  * CINDERWISP.bobAmpPx;
        tf.y = en.baseY + bob - tf.h / 2;
        v.vx = 0;
        v.vy = 0;
        // Despawn off the left edge.
        if (tf.x < -96) {
            en.ai = 'dead';
            en.deathFrames = 0;
        }
    }

    // ── Quarrywight (v1.0) ───────────────────────────────────────────────
    // Armored slow walker. Falls off cliffs (no edge turn-around). Per cast
    // brief §2.2. CombatSystem handles the 2-hit kill flow; this method just
    // moves the entity.
    _tickQuarrywight({ id, transform: tf, velocity: v, physics: ph, enemy: en }, level) {
        if (en.ai === 'dead') {
            v.vx = 0;
            v.vy = Math.min(v.vy + 0.5, MAX_FALL);
            tf.y += v.vy;
            return;
        }
        v.vx = en.dir * QUARRYWIGHT.walkXPerFrame;
        v.vy = Math.min(v.vy + 0.5, MAX_FALL);
        tf.x += v.vx;
        tf.y += v.vy;
        if (ph) {
            ph.onGround = false;
            ph.onIce    = false;
            this.collision.resolveTiles(tf, v, ph, level);
        }
        // Despawn off the left edge or below the level.
        if (tf.x < -96 || tf.y > level.rows * TILE + 96) {
            en.ai = 'dead';
            en.deathFrames = 0;
            void id;
        }
    }

    // ── Skyhook (v1.0) ───────────────────────────────────────────────────
    // FSM: perched → triggered → falling → landed → walking → off-screen-left.
    // Per cast brief §2.3. Hero-trigger checks hero col distance.
    _tickSkyhook({ transform: tf, velocity: v, physics: ph, enemy: en }, level, heroTf) {
        if (en.ai === 'dead') {
            v.vx = 0;
            v.vy = Math.min((v.vy || 0) + 0.5, MAX_FALL);
            tf.y += v.vy;
            return;
        }
        if (en.ai === 'perched') {
            // Wait for hero to come within trigger distance.
            if (heroTf) {
                const heroCol = Math.floor((heroTf.x + heroTf.w / 2) / TILE);
                const enCol   = Math.floor((tf.x + tf.w / 2) / TILE);
                const dist    = enCol - heroCol;
                if (dist >= 0 && dist <= SKYHOOK.triggerDistanceTiles) {
                    en.ai = 'triggered';
                    en.stateTimer = SKYHOOK.windupFrames;
                    _sfx('skyhook_warn');
                }
            }
            v.vx = 0; v.vy = 0;
            return;
        }
        if (en.ai === 'triggered') {
            en.stateTimer--;
            if (en.stateTimer <= 0) {
                en.ai = 'falling';
                v.vy = SKYHOOK.fallYPerFrame;
            }
            v.vx = 0;
            return;
        }
        if (en.ai === 'falling') {
            v.vx = 0;
            v.vy = SKYHOOK.fallYPerFrame;
            tf.y += v.vy;
            if (ph) {
                ph.onGround = false;
                ph.onIce    = false;
                this.collision.resolveTiles(tf, v, ph, level);
                if (ph.onGround) {
                    en.ai = 'landed';
                    en.stateTimer = SKYHOOK.landedFrames;
                }
            } else {
                // No physics → fake a floor check. Land on the floor row of
                // the level (rows-3 by convention).
                const floorRow = level.rows - 3;
                if (tf.y + tf.h >= floorRow * TILE) {
                    tf.y = floorRow * TILE - tf.h;
                    en.ai = 'landed';
                    en.stateTimer = SKYHOOK.landedFrames;
                }
            }
            return;
        }
        if (en.ai === 'landed') {
            en.stateTimer--;
            v.vx = 0;
            if (en.stateTimer <= 0) {
                en.ai = 'walking';
            }
            // Apply gravity in case it landed mid-air briefly.
            v.vy = Math.min(v.vy + 0.5, MAX_FALL);
            tf.y += v.vy;
            if (ph) {
                ph.onGround = false;
                ph.onIce = false;
                this.collision.resolveTiles(tf, v, ph, level);
            }
            return;
        }
        if (en.ai === 'walking') {
            v.vx = -SKYHOOK.walkXPerFrame;
            v.vy = Math.min(v.vy + 0.5, MAX_FALL);
            tf.x += v.vx;
            tf.y += v.vy;
            if (ph) {
                ph.onGround = false;
                ph.onIce = false;
                this.collision.resolveTiles(tf, v, ph, level);
            }
            if (tf.x < -96) {
                en.ai = 'dead';
                en.deathFrames = 0;
            }
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

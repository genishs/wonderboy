// owning agent: dev-lead
// TODO: per-archetype FSMs for Crawlspine, Glassmoth, and Sapling.
//
// Each archetype has its own ai-state vocabulary (see docs/briefs/phase1-cast.md §3).
// The PhysicsEngine handles only enemy.ai === 'patrol' (Crawlspine walking).
// Glassmoth and Sapling movement/state lives entirely here. Stoneflakes and
// seeddarts are stepped by their own systems, not the PhysicsEngine.

import { CRAWLSPINE, GLASSMOTH, SAPLING } from '../config/PhaseOneTunables.js';

const TILE = 48;

export class EnemyAI {
    constructor() {
        this._t = 0; // global frame counter (for sine drift, animation timing)
    }

    update(ecs, level, playerEntityId, seeddartSystem) {
        this._t += 1;
        const playerTf = ecs.getComponent(playerEntityId, 'transform');

        for (const row of ecs.query('transform', 'velocity', 'enemy')) {
            const en = row.enemy;
            if (en.type === 'crawlspine')      this._tickCrawlspine(row, level);
            else if (en.type === 'glassmoth')  this._tickGlassmoth(row, level, playerTf);
            else if (en.type === 'sapling')    this._tickSapling(row, level, playerTf, ecs, seeddartSystem);
        }

        // Death cleanup: when deathFrames countdown finishes, remove entity
        for (const row of ecs.query('enemy')) {
            const en = row.enemy;
            if (en.ai === 'dead') {
                en.deathFrames = Math.max(0, (en.deathFrames || 0) - 1);
                if (en.deathFrames === 0) ecs.destroyEntity(row.id);
            }
        }
    }

    // ──────────────────────────────────────────────────────────────────────
    _tickCrawlspine({ transform: tf, velocity: v, enemy: en }, level) {
        if (en.ai === 'dead') { v.vx = 0; return; }

        if (en.hurtFrames > 0) en.hurtFrames--;

        if (en.ai === 'turn') {
            v.vx = 0;
            en.stateTimer--;
            if (en.stateTimer <= 0) {
                en.dir *= -1;
                en.ai = 'patrol';
            }
            return;
        }

        // patrol/walk
        en.ai = 'patrol';
        v.vx = en.dir * CRAWLSPINE.walkSpeed;

        // Edge / wall detection — same probe pattern as PhysicsEngine but trigger 'turn'.
        // Probe is evaluated before the next physics step.
        // (PhysicsEngine still runs and may flip too — keep this idempotent.)
        const probeX = tf.x + (en.dir > 0 ? tf.w + 1 : -1);
        const probeY = tf.y + tf.h + 1;
        const ts = TILE;
        const ahead = level.getTile(Math.floor(probeX / ts), Math.floor(probeY / ts));
        const wallTile = level.getTile(
            Math.floor((tf.x + (en.dir > 0 ? tf.w : -1)) / ts),
            Math.floor((tf.y + tf.h / 2) / ts),
        );
        if (!ahead?.solid || wallTile?.solid) {
            en.ai = 'turn';
            en.stateTimer = CRAWLSPINE.turnFrames;
            v.vx = 0;
        }
    }

    // ──────────────────────────────────────────────────────────────────────
    _tickGlassmoth({ transform: tf, velocity: v, enemy: en }, level, playerTf) {
        if (en.ai === 'dead') { v.vx = 0; v.vy = 0; return; }

        if (en.hurtFrames > 0) en.hurtFrames--;
        if (en.cooldown > 0)   en.cooldown--;

        // Glassmoth manages its own motion (no physics gravity).
        // We DO probe tiles manually for the soft-bounce on solids.

        // Drift: sinusoidal vertical bob around baseY.
        if (en.baseY == null) en.baseY = tf.y;

        // Horizontal screen-relative bounds: flip on solid wall ahead OR at canvas edge.
        const nextX = tf.x + en.dir * GLASSMOTH.driftVx;
        const ts = TILE;
        const probeWallY = tf.y + tf.h / 2;
        const wallTile = level.getTile(
            Math.floor((nextX + (en.dir > 0 ? tf.w : 0)) / ts),
            Math.floor(probeWallY / ts),
        );
        if (wallTile?.solid || nextX < 0 || nextX + tf.w > level.cols * ts) {
            en.dir *= -1;
        }

        if (en.ai === 'recover') {
            // Rise back toward baseY over recoverFrames; cooldown blocks re-swoop.
            v.vy = -2.0;
            tf.x += en.dir * GLASSMOTH.driftVx;
            tf.y += v.vy;
            en.stateTimer--;
            if (en.stateTimer <= 0 || tf.y <= en.baseY) {
                tf.y = en.baseY;
                en.ai = 'drift';
                en.aiTimer = 0;
            }
            return;
        }

        if (en.ai === 'swoop') {
            v.vy = GLASSMOTH.swoopVy;
            tf.x += en.dir * GLASSMOTH.driftVx;
            tf.y += v.vy;
            en.stateTimer--;

            // Bounce off any solid below (manual probe — physics engine is bypassed here)
            const footY = tf.y + tf.h;
            const fr = Math.floor(footY / ts);
            for (let c = Math.floor(tf.x / ts); c <= Math.floor((tf.x + tf.w - 1) / ts); c++) {
                const t = level.getTile(c, fr);
                if (t?.solid) {
                    tf.y = fr * ts - tf.h;
                    en.ai = 'recover';
                    en.stateTimer = GLASSMOTH.recoverFrames;
                    en.cooldown   = GLASSMOTH.recoverFrames;
                    return;
                }
            }
            if (en.stateTimer <= 0) {
                en.ai = 'recover';
                en.stateTimer = GLASSMOTH.recoverFrames;
                en.cooldown   = GLASSMOTH.recoverFrames;
            }
            return;
        }

        // drift
        en.ai = 'drift';
        en.aiTimer = (en.aiTimer || 0) + 1;
        tf.x += en.dir * GLASSMOTH.driftVx;
        tf.y = en.baseY + Math.sin(en.aiTimer * GLASSMOTH.driftFrequency) * GLASSMOTH.driftAmplitude;
        v.vx = 0;
        v.vy = 0;

        // Swoop trigger
        if (en.cooldown <= 0 && playerTf) {
            const dx = (playerTf.x + playerTf.w / 2) - (tf.x + tf.w / 2);
            const above = (tf.y + tf.h) < (playerTf.y + playerTf.h * 0.5);
            if (Math.abs(dx) < GLASSMOTH.sightRangeX && above) {
                en.dir = Math.sign(dx) || en.dir;
                en.ai = 'swoop';
                en.stateTimer = GLASSMOTH.swoopFrames;
            }
        }
    }

    // ──────────────────────────────────────────────────────────────────────
    _tickSapling({ transform: tf, enemy: en }, level, playerTf, ecs, seeddartSystem) {
        if (en.ai === 'dead') return;

        if (en.hurtFrames > 0) en.hurtFrames--;

        // Stationary — no velocity application.
        if (en.ai === 'closed' || en.ai == null) {
            if (en.ai == null) { en.ai = 'closed'; en.stateTimer = SAPLING.closedFrames; }
            en.stateTimer--;
            if (en.stateTimer <= 0) {
                en.ai = 'windup';
                en.stateTimer = SAPLING.windupFrames;
                // Lock direction at windup-start
                if (playerTf) {
                    const dx = (playerTf.x + playerTf.w / 2) - (tf.x + tf.w / 2);
                    en.dir = Math.sign(dx) || 1;
                }
            }
            return;
        }

        if (en.ai === 'windup') {
            en.stateTimer--;
            if (en.stateTimer <= 0) {
                en.ai = 'firing';
                en.stateTimer = SAPLING.firingFrames;
                // Spawn 3 darts in fan
                if (seeddartSystem) {
                    seeddartSystem.spawnFan(ecs, tf, en.dir);
                }
            }
            return;
        }

        if (en.ai === 'firing') {
            en.stateTimer--;
            if (en.stateTimer <= 0) {
                en.ai = 'cooldown';
                en.stateTimer = SAPLING.cooldownFrames;
            }
            return;
        }

        if (en.ai === 'cooldown') {
            en.stateTimer--;
            if (en.stateTimer <= 0) {
                en.ai = 'closed';
                en.stateTimer = SAPLING.closedFrames;
            }
            return;
        }
    }
}

/** Initial-state helper used by LevelManager._spawnPhase1 to seed enemy components consistently. */
export const initEnemy = (type, dir) => {
    if (type === 'crawlspine') {
        return {
            type, dir, ai: 'patrol', hp: CRAWLSPINE.hp, hpMax: CRAWLSPINE.hp,
            stateTimer: 0, cooldown: 0, aiTimer: 0,
            baseY: null, deathFrames: 0, hurtFrames: 0,
        };
    }
    if (type === 'glassmoth') {
        return {
            type, dir, ai: 'drift', hp: GLASSMOTH.hp, hpMax: GLASSMOTH.hp,
            stateTimer: 0, cooldown: 0, aiTimer: 0,
            baseY: null, deathFrames: 0, hurtFrames: 0,
        };
    }
    if (type === 'sapling') {
        return {
            type, dir, ai: 'closed', hp: SAPLING.hp, hpMax: SAPLING.hp,
            stateTimer: SAPLING.closedFrames, cooldown: 0, aiTimer: 0,
            baseY: null, deathFrames: 0, hurtFrames: 0,
        };
    }
    // legacy fallback — preserves existing snail/bee/etc spawns
    return { type, dir, ai: 'patrol', hp: 1, hpMax: 1, stateTimer: 0, cooldown: 0, aiTimer: 0, baseY: null, deathFrames: 0, hurtFrames: 0 };
};

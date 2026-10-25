// owning agent: dev-lead
// TODO: AABB tile collision + Phase 2 slope-aware floor pinning + decoration AABB.
//
// Phase 1: flat-tile bottom/top/horizontal sweeps unchanged.
// Phase 2: when the foot is over a slope tile (or directly above one), pin the foot
//   to the slope profile via floorYAt(profile, localX). Slopes are NEVER solid sideways
//   (the diagonal "open" triangle of the ramp is walked through).
//
// v0.50.2 fixes (issues 1a, 5, 6):
//   1a — flat-tile bottom-sweep used `footY > tileTop` strict inequality. When Reed
//        stood still, gravity dropped him 0.55 px below the tile top, the snap
//        re-pulled him up, and the next frame the cycle repeated → 1-px jitter.
//        Changed to `>=` so equality snaps cleanly.
//   6  — horizontal sweep auto step-up: when blocked by a flat tile whose top is
//        within MAX_STEP_UP px below Reed's foot, lift him onto the tile instead of
//        blocking. Lets walking up a slope-then-flat seam succeed without jumping.
//        Threshold tuned to allow 1-tile gentle rises but reject real walls.
//   5  — rocks no longer block hero motion. The decoration sweep now collects rock
//        contacts on `level._heroRockContacts` for HeroController to consume; the
//        hero is NOT repositioned. Other entities (projectiles handled separately
//        in HatchetSystem) and non-hero callers still get the legacy block path.
//
// Rocks are decorations (not in the ground grid); we sweep them after the wall pass.

import { TILE_TYPES } from '../levels/TileMap.js';
import { C }          from './PhysicsConstants.js';

/**
 * Slope floor profile — given a slope-tile profile name and a localX in [0..47],
 * return the floor's localY in [0..48]. Smaller localY = higher floor.
 *
 * v0.50.1: `up22` / `dn22` are now SMOOTH 1-px ramps spanning the full tile
 * (48→0), matching `up45` / `dn45` in geometry. The previous 4-step staircase
 * (12 px chunks) caused Reed to vibrate visibly while walking up — a 12-px Y-jump
 * every ~3 px X-traveled at walk speed. v0.50.1 tames that to a true linear
 * ramp; the 22° vs 45° distinction now lives ONLY in the tile art, not in
 * collision. (Both span one full tile of vertical change for clean connection
 * against integer-row flats — see round-1-1.js header.)
 *
 * The two paths produce the same floor curve — they're kept as separate cases
 * so future v0.75 work can reintroduce a true gentler 22° (e.g. spread across
 * two tiles) without re-routing call sites.
 */
export function floorYAt(profile, localX) {
    switch (profile) {
        case 'up22': return Math.max(0, 48 - localX - 1);  // smooth 1-px linear ramp
        case 'up45': return Math.max(0, 48 - localX - 1);  // smooth 1-px linear ramp
        case 'dn22': return Math.max(0, localX);           // smooth 1-px linear ramp (mirror)
        case 'dn45': return Math.max(0, localX);           // smooth 1-px linear ramp (mirror)
        default:     return 48;
    }
}

// Maximum vertical rise (in px) the horizontal sweep will auto step-up over.
// Just over a third of a tile — covers the seam between a 48-px slope ramp and
// the destination flat (where pixel rounding can leave Reed's foot 1-2 px below
// the next flat's tile-top), but well under a wall (which is 48 px or more).
const MAX_STEP_UP = 18;

export class CollisionSystem {
    /**
     * Resolve AABB vs tile map for an entity.
     * Mutates transform (position) and velocity on collision.
     * Sets physics.onGround and physics.onIce flags.
     *
     * @param {boolean} [isHero=false]  Hero-only behaviors (step-up, rock pass-through
     *   collected as event for stumble FSM). Other entities use the legacy block path.
     */
    resolveTiles(tf, v, ph, level, isHero = false) {
        const ts = C.TILE;

        // ── Vertical: bottom sweep (slope-aware) ─────────────────────────
        if (v.vy >= 0) {
            const footY       = tf.y + tf.h;
            const footCenterX = tf.x + tf.w / 2;
            const col         = Math.floor(footCenterX / ts);
            const row         = Math.floor(footY / ts);

            // Slope candidate: prefer the cell containing the foot. If that cell
            // has no slope profile, look one row above (slope tile may sit one row
            // higher than where the foot Y lands).
            let slopeTile = null;
            let slopeRow  = -1;
            const here = level.getTile(col, row);
            if (here && here.slopeProfile) {
                slopeTile = here; slopeRow = row;
            } else {
                const above = level.getTile(col, row - 1);
                if (above && above.slopeProfile) {
                    slopeTile = above; slopeRow = row - 1;
                }
            }

            let snappedToSlope = false;
            if (slopeTile) {
                // localX = footCenterX modulo tile, clamped to [0,47].
                const lx         = Math.max(0, Math.min(47, ((Math.floor(footCenterX) % ts) + ts) % ts));
                const localY     = floorYAt(slopeTile.slopeProfile, lx);
                const floorYAbs  = slopeRow * ts + localY;
                // Snap if foot is at or just past the slope line, with a tolerance band
                // covering one fall-step plus a slope-step at walk speed (12 px stair).
                if (footY >= floorYAbs - 1 && footY <= floorYAbs + 16) {
                    tf.y        = floorYAbs - tf.h;
                    v.vy        = 0;
                    ph.onGround = true;
                    ph.onIce    = false;
                    snappedToSlope = true;
                }
            }

            if (!snappedToSlope) {
                // Standard flat-tile bottom sweep.
                // v0.50.2: changed `footY > tileTop` to `footY >= tileTop` so that
                // the equality case (Reed exactly seated on the tile-top after a
                // previous snap) re-asserts onGround instead of being missed —
                // which would let the next frame's gravity drop him 0.55 px below
                // the surface, causing visible 1-px jitter while idle.
                const cmin = Math.floor(tf.x / ts);
                const cmax = Math.floor((tf.x + tf.w - 1) / ts);
                for (let c = cmin; c <= cmax; c++) {
                    const tile = level.getTile(c, row);
                    if (!tile?.solid) continue;
                    if (tile.slopeProfile) continue; // slopes resolved above
                    const tileTop = row * ts;
                    if (footY >= tileTop && footY <= tileTop + ts + Math.abs(v.vy) + 1) {
                        tf.y        = tileTop - tf.h;
                        v.vy        = 0;
                        ph.onGround = true;
                        ph.onIce    = tile.type === TILE_TYPES.ICE;
                    }
                }
            }
        }

        // ── Vertical: top sweep ──────────────────────────────────────────
        if (v.vy < 0) {
            const headY = tf.y;
            const row   = Math.floor(headY / ts);
            for (let col = Math.floor(tf.x / ts); col <= Math.floor((tf.x + tf.w - 1) / ts); col++) {
                const tile = level.getTile(col, row);
                if (!tile?.solid) continue;
                if (tile.slopeProfile) continue; // slopes are not solid from below
                tf.y = (row + 1) * ts;
                v.vy = 0;
            }
        }

        // ── Horizontal ───────────────────────────────────────────────────
        // v0.50.2 (issue 6): when blocked by a flat solid tile and the tile's
        // top is within MAX_STEP_UP px of the foot, lift the entity onto the
        // tile instead of blocking. Hero-only — keeps Mossplodder bounded by
        // walls cleanly. This makes walking-up-a-slope succeed across the seam
        // where a slope ramp meets a flat row above (without it the foot is
        // 1-2 px below the next flat's tile-top after pixel rounding, and the
        // horizontal sweep treats that flat as a wall).
        const rowT = Math.floor(tf.y / ts);
        const rowB = Math.floor((tf.y + tf.h - 1) / ts);

        if (v.vx > 0) {
            const col = Math.floor((tf.x + tf.w) / ts);
            for (let row = rowT; row <= rowB; row++) {
                const tile = level.getTile(col, row);
                if (tile?.solid && !tile.slopeProfile) {
                    if (isHero && this._tryStepUp(tf, ph, level, col, row, ts)) {
                        // Stepped up — abort the block; allow horizontal motion.
                        continue;
                    }
                    tf.x = col * ts - tf.w;
                    v.vx = 0;
                }
            }
        }
        if (v.vx < 0) {
            const col = Math.floor(tf.x / ts);
            for (let row = rowT; row <= rowB; row++) {
                const tile = level.getTile(col, row);
                if (tile?.solid && !tile.slopeProfile) {
                    if (isHero && this._tryStepUp(tf, ph, level, col, row, ts)) {
                        continue;
                    }
                    tf.x = (col + 1) * ts;
                    v.vx = 0;
                }
            }
        }

        // ── Rock decoration sweep (Phase 2) ──────────────────────────────
        // Solid AABB inside the tile cell. Probe the cells the entity overlaps and
        // resolve by axis. Cheap: at most 2 cells horizontally x 2 vertically.
        // v0.50.2 (issue 5): for the hero, rocks no longer block — overlaps are
        // recorded on `level._heroRockContacts` and HeroController consumes them
        // to drive the stumble FSM. Non-hero callers keep the block path.
        if (level.decorations && level.decorations.length > 0) {
            this._resolveDecorations(tf, v, ph, level, isHero);
        }
    }

    /**
     * Step-up helper: if the blocking tile's top is within MAX_STEP_UP px of the
     * entity's foot, lift the entity onto it. Verifies the lifted position is
     * not itself blocked by a solid tile (so we never step UP into a ceiling).
     * Returns true on success.
     */
    _tryStepUp(tf, ph, level, col, row, ts) {
        const footY = tf.y + tf.h;
        const tileTop = row * ts;
        const rise = footY - tileTop;
        if (rise <= 0 || rise > MAX_STEP_UP) return false;

        // Verify clearance above the blocking tile for the entity's full height
        // — otherwise we'd telefrag into a wall stack.
        const newY = tileTop - tf.h;
        const newRowT = Math.floor(newY / ts);
        for (let r = newRowT; r < row; r++) {
            const probeTile = level.getTile(col, r);
            if (probeTile && probeTile.solid && !probeTile.slopeProfile) {
                return false;
            }
        }
        tf.y = newY;
        ph.onGround = true;
        return true;
    }

    _resolveDecorations(tf, v, ph, level, isHero = false) {
        const ts = C.TILE;
        // Hero rock-contact event sink: HeroController consumes this each frame
        // to drive the stumble FSM. Reset every collision pass so stale contacts
        // from a prior frame don't trigger.
        if (isHero) level._heroRockContacts = [];
        // Iterate sparse decorations, AABB-test each. Cheap: ≤3 per round.
        for (const d of level.decorations) {
            if (d.kind !== 'rock_small') continue;
            const w = 32, h = 32;
            // Rock sits ON TOP of the floor at row d.row (so its bottom = d.row*TS,
            // its top = d.row*TS - h).
            const box = {
                x: d.col * ts + (ts - w) / 2,
                y: d.row * ts - h,
                w, h,
            };
            // AABB overlap
            const overlapL = (tf.x + tf.w) - box.x;
            const overlapR = (box.x + box.w) - tf.x;
            const overlapT = (tf.y + tf.h) - box.y;
            const overlapB = (box.y + box.h) - tf.y;
            if (overlapL <= 0 || overlapR <= 0 || overlapT <= 0 || overlapB <= 0) continue;

            // v0.50.2 (issue 5): hero walks THROUGH rocks. Record the contact for
            // HeroController to act on (stumble + small vitality drain). Don't
            // mutate transform/velocity for the hero.
            if (isHero) {
                level._heroRockContacts.push({ col: d.col, row: d.row });
                continue;
            }

            // Resolve along smallest penetration axis (legacy path — non-hero
            // entities, e.g. Mossplodder, still bump rocks).
            const minH = Math.min(overlapL, overlapR);
            const minV = Math.min(overlapT, overlapB);
            if (minH < minV) {
                if (overlapL < overlapR) {
                    tf.x = box.x - tf.w;
                    if (v.vx > 0) v.vx = 0;
                } else {
                    tf.x = box.x + box.w;
                    if (v.vx < 0) v.vx = 0;
                }
            } else {
                if (overlapT < overlapB) {
                    tf.y = box.y - tf.h;
                    v.vy = 0;
                    ph.onGround = true;
                } else {
                    tf.y = box.y + box.h;
                    if (v.vy < 0) v.vy = 0;
                }
            }
        }
    }

    solidAt(px, py, level) {
        return level.getTile(Math.floor(px / C.TILE), Math.floor(py / C.TILE))?.solid ?? false;
    }

    overlaps(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x &&
               a.y < b.y + b.h && a.y + a.h > b.y;
    }
}

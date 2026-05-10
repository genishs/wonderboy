// owning agent: dev-lead
// TODO: AABB tile collision + Phase 2 slope-aware floor pinning + decoration AABB.
//
// Phase 1: flat-tile bottom/top/horizontal sweeps unchanged.
// Phase 2: when the foot is over a slope tile (or directly above one), pin the foot
//   to the slope profile via floorYAt(profile, localX). Slopes are NEVER solid sideways
//   (the diagonal "open" triangle of the ramp is walked through).
//
// Rocks are decorations (not in the ground grid); we sweep them after the wall pass.

import { TILE_TYPES } from '../levels/TileMap.js';
import { C }          from './PhysicsConstants.js';

/**
 * Slope floor profile — given a slope-tile profile name and a localX in [0..47],
 * return the floor's localY in [0..48]. Smaller localY = higher floor.
 *
 * Both `up22` and `up45` span the full tile vertically (48→0): each slope tile
 * connects two integer rows of flat ground. `up22` uses a stepped (gentler-feel)
 * progression so the play retains a "less aggressive" cadence than `up45`, while
 * still chaining cleanly against integer-row flat neighbors. `dn22`/`dn45` mirror.
 *
 * (Plan §6 specified a 16px intra-tile rise for `up22`, but with integer row
 * pitch of 48px that produces an unwalkable vertical discontinuity at the slope
 * <-> flat boundary. v0.50 makes both slope variants span the full tile; the
 * "gentle vs steep" distinction is preserved via tile art rather than collision.
 * Flagged in PR body as a deviation; revisit for true 22° in v0.75.)
 */
export function floorYAt(profile, localX) {
    switch (profile) {
        case 'up22': {
            // Stepped ramp: 4 even steps of 12 px across 48 px. Reads as "gentler"
            // because the foot lifts in 12px chunks instead of every pixel.
            const step = Math.floor(localX / 12);          // 0..3
            return Math.max(0, 48 - (step + 1) * 12);      // 36, 24, 12, 0
        }
        case 'up45': return Math.max(0, 48 - localX - 1);  // 1px linear ramp
        case 'dn22': {
            const step = Math.floor((47 - localX) / 12);   // 0..3 (mirror)
            return Math.max(0, 48 - (step + 1) * 12);
        }
        case 'dn45': return Math.max(0, localX);
        default:     return 48;
    }
}

export class CollisionSystem {
    /**
     * Resolve AABB vs tile map for an entity.
     * Mutates transform (position) and velocity on collision.
     * Sets physics.onGround and physics.onIce flags.
     */
    resolveTiles(tf, v, ph, level) {
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
                // Standard flat-tile bottom sweep
                const cmin = Math.floor(tf.x / ts);
                const cmax = Math.floor((tf.x + tf.w - 1) / ts);
                for (let c = cmin; c <= cmax; c++) {
                    const tile = level.getTile(c, row);
                    if (!tile?.solid) continue;
                    if (tile.slopeProfile) continue; // slopes resolved above
                    const tileTop = row * ts;
                    if (footY > tileTop && footY <= tileTop + ts + Math.abs(v.vy) + 1) {
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
        const rowT = Math.floor(tf.y / ts);
        const rowB = Math.floor((tf.y + tf.h - 1) / ts);

        if (v.vx > 0) {
            const col = Math.floor((tf.x + tf.w) / ts);
            for (let row = rowT; row <= rowB; row++) {
                const tile = level.getTile(col, row);
                if (tile?.solid && !tile.slopeProfile) {
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
                    tf.x = (col + 1) * ts;
                    v.vx = 0;
                }
            }
        }

        // ── Rock decoration sweep (Phase 2) ──────────────────────────────
        // Solid AABB inside the tile cell. Probe the cells the entity overlaps and
        // resolve by axis. Cheap: at most 2 cells horizontally x 2 vertically.
        if (level.decorations && level.decorations.length > 0) {
            this._resolveDecorations(tf, v, ph, level);
        }
    }

    _resolveDecorations(tf, v, ph, level) {
        const ts = C.TILE;
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

            // Resolve along smallest penetration axis
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

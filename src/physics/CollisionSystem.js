import { TILE_TYPES } from '../levels/TileMap.js';
import { C }          from './PhysicsEngine.js';

export class CollisionSystem {
    /**
     * Resolve AABB vs tile map for an entity.
     * Mutates transform (position) and velocity on collision.
     * Sets physics.onGround and physics.onIce flags.
     */
    resolveTiles(tf, v, ph, level) {
        const ts = C.TILE;

        // ── Vertical: bottom sweep ───────────────────────────────────────
        if (v.vy >= 0) {
            const footY = tf.y + tf.h;
            const row   = Math.floor(footY / ts);
            for (let col = Math.floor(tf.x / ts); col <= Math.floor((tf.x + tf.w - 1) / ts); col++) {
                const tile = level.getTile(col, row);
                if (!tile?.solid) continue;
                const tileTop = row * ts;
                if (footY > tileTop && footY <= tileTop + ts + Math.abs(v.vy) + 1) {
                    tf.y        = tileTop - tf.h;
                    v.vy        = 0;
                    ph.onGround = true;
                    ph.onIce    = tile.type === TILE_TYPES.ICE;
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
                if (level.getTile(col, row)?.solid) { tf.x = col * ts - tf.w; v.vx = 0; }
            }
        }
        if (v.vx < 0) {
            const col = Math.floor(tf.x / ts);
            for (let row = rowT; row <= rowB; row++) {
                if (level.getTile(col, row)?.solid) { tf.x = (col + 1) * ts; v.vx = 0; }
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

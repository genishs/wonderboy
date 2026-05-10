// owning agent: dev-lead
// TODO: TileCache — convert design tile modules (PALETTE + TILES + META) into per-frame
// canvases at displayPx resolution. Mirrors SpriteCache pattern.
//
// Per design contract (docs/design/contracts.md):
//   TILES[key] = matrix                        (static)
//   TILES[key] = { frames: [matrix...], fps }  (animated, v0.50+)
// Renderer uses frameIndexAt(key, simFrame) to pick a frame for animated tiles.

const _hex2rgba = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = hex.length >= 9 ? parseInt(hex.slice(7, 9), 16) : 255;
    return [r, g, b, a];
};

export class TileCache {
    constructor() {
        // tileKey -> { frames: HTMLCanvasElement[], fps: number, isAnimated: boolean, displayPx: number }
        this._entries = new Map();
        this._displayPx = 48;
    }

    /**
     * Loads an Area's tile module (mod = { PALETTE, TILES, META }).
     * Builds one canvas per matrix at META.displayPx (or META.tile * scale) size.
     * Uses ImageData fill at the matrix resolution then ctx.drawImage upscale with
     * imageSmoothingEnabled=false to avoid bleeding.
     */
    async loadArea(mod) {
        if (!mod || !mod.PALETTE || !mod.TILES || !mod.META) {
            throw new Error('TileCache.loadArea: module missing PALETTE/TILES/META');
        }
        const palette  = mod.PALETTE.map(_hex2rgba);
        const meta     = mod.META;
        const tile     = meta.tile;
        const scale    = meta.scale ?? 1;
        const displayPx = meta.displayPx ?? (tile * scale);
        this._displayPx = displayPx;

        for (const key of Object.keys(mod.TILES)) {
            const entry = mod.TILES[key];
            const isAnimated = !Array.isArray(entry) && entry && Array.isArray(entry.frames);
            if (isAnimated) {
                const fps = entry.fps || 8;
                const frames = entry.frames.map(matrix => this._buildCanvas(matrix, palette, tile, displayPx));
                this._entries.set(key, { frames, fps, isAnimated: true, displayPx });
            } else {
                const matrix = entry;
                const canvas = this._buildCanvas(matrix, palette, tile, displayPx);
                this._entries.set(key, { frames: [canvas], fps: 0, isAnimated: false, displayPx });
            }
        }
    }

    has(key)            { return this._entries.has(key); }
    get(key)            { return this._entries.get(key); }
    get displayPx()     { return this._displayPx; }

    /**
     * Returns the frame index to use for an animated tile at the given simulation frame.
     * Lockstep — every instance of a given key shows the same frame this tick.
     */
    frameIndexAt(key, simFrame) {
        const e = this._entries.get(key);
        if (!e) return 0;
        if (!e.isAnimated || e.frames.length <= 1) return 0;
        return Math.floor(simFrame * e.fps / 60) % e.frames.length;
    }

    /** Returns the canvas to draw for `key` at `simFrame`. Null if missing. */
    canvasAt(key, simFrame) {
        const e = this._entries.get(key);
        if (!e) return null;
        const idx = (e.isAnimated && e.frames.length > 1)
            ? (Math.floor(simFrame * e.fps / 60) % e.frames.length)
            : 0;
        return e.frames[idx];
    }

    // ── internal ─────────────────────────────────────────────────────────
    _buildCanvas(matrix, paletteRgba, tile, displayPx) {
        // Step 1: fill an offscreen at art resolution (`tile` x `tile`) via ImageData.
        const src = document.createElement('canvas');
        src.width  = tile;
        src.height = tile;
        const sctx = src.getContext('2d');
        const img  = sctx.createImageData(tile, tile);
        const data = img.data;
        for (let row = 0; row < tile; row++) {
            const r = matrix[row];
            if (!r) continue;
            for (let col = 0; col < tile; col++) {
                const idx = r[col] | 0;
                const c = paletteRgba[idx];
                if (!c) continue;
                const o = (row * tile + col) * 4;
                data[o]     = c[0];
                data[o + 1] = c[1];
                data[o + 2] = c[2];
                data[o + 3] = c[3];
            }
        }
        sctx.putImageData(img, 0, 0);

        if (displayPx === tile) return src;

        // Step 2: upscale to displayPx via nearest-neighbor drawImage.
        const dst = document.createElement('canvas');
        dst.width  = displayPx;
        dst.height = displayPx;
        const dctx = dst.getContext('2d');
        dctx.imageSmoothingEnabled = false;
        dctx.drawImage(src, 0, 0, displayPx, displayPx);
        return dst;
    }
}

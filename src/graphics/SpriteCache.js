// owning agent: dev-lead
// TODO: convert Design sprite modules (PALETTE + FRAMES + META) into per-frame canvases
//       so the renderer can drawImage() without re-walking palette indices each tick.
//
// API:
//   const cache = new SpriteCache();
//   await cache.load('hero', heroReedModule);     // module-shaped: { PALETTE, FRAMES, META }
//   const entry = cache.get('hero');               // { frames: { idle: [canvas, ...], ... }, meta, palette }
//   cache.has('hero');                              // boolean
//   pickAnim(entry, 'jump_rising', ['jump','idle','walk']) -> first key with frames present
//
// Frame canvases store the sprite at native (META.w x META.h) resolution and
// face right by convention. Flipping is the renderer's responsibility (ctx.scale(-1,1)).

const _hex2rgba = (hex) => {
    // Accept '#rrggbb' or '#rrggbbaa'. Index-0 entries with full alpha 00 are transparent.
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = hex.length >= 9 ? parseInt(hex.slice(7, 9), 16) : 255;
    return [r, g, b, a];
};

export class SpriteCache {
    constructor() {
        this._entries = new Map(); // name -> { frames, meta, palette }
    }

    async load(name, mod) {
        const palette = mod.PALETTE;
        const frames  = mod.FRAMES;
        const meta    = mod.META;
        if (!palette || !frames || !meta) {
            throw new Error(`SpriteCache.load(${name}): module missing PALETTE / FRAMES / META`);
        }

        // Pre-decode palette to RGBA once
        const rgba = palette.map(_hex2rgba);

        const builtFrames = {};
        for (const animKey of Object.keys(frames)) {
            const animFrames = frames[animKey];
            builtFrames[animKey] = animFrames.map(matrix => this._buildFrameCanvas(matrix, rgba, meta));
        }
        this._entries.set(name, { frames: builtFrames, meta, palette });
    }

    get(name) { return this._entries.get(name); }
    has(name) { return this._entries.has(name); }

    _buildFrameCanvas(matrix, rgba, meta) {
        const w = meta.w, h = meta.h;
        const canvas = document.createElement('canvas');
        canvas.width  = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        const img = ctx.createImageData(w, h);
        const data = img.data;
        for (let row = 0; row < h; row++) {
            const r = matrix[row];
            if (!r) continue;
            for (let col = 0; col < w; col++) {
                const idx = r[col] | 0;
                const c = rgba[idx];
                if (!c) continue;
                const o = (row * w + col) * 4;
                data[o]     = c[0];
                data[o + 1] = c[1];
                data[o + 2] = c[2];
                data[o + 3] = c[3];
            }
        }
        ctx.putImageData(img, 0, 0);
        return canvas;
    }
}

/**
 * Pick the first existing animation key for a request.
 * cacheEntry  : SpriteCache entry from .get(name)
 * requested   : string preferred animation name
 * fallbackChain : array of fallback names tried after `requested`
 * Returns the matched key (string) or null.
 */
export const pickAnim = (cacheEntry, requested, fallbackChain = ['idle', 'walk', 'drift', 'closed', 'fly']) => {
    if (!cacheEntry) return null;
    const f = cacheEntry.frames;
    if (requested && f[requested]) return requested;
    for (const k of fallbackChain) {
        if (f[k]) return k;
    }
    const keys = Object.keys(f);
    return keys.length > 0 ? keys[0] : null;
};

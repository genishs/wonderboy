// owning agent: dev-lead
// TODO: TileCache — convert design tile modules (PALETTE + TILES + META) into per-frame
// canvases at displayPx resolution. Mirrors SpriteCache pattern.
//
// v0.75 — multi-stage support. Phase 2 used `loadArea(mod)` and a single
// per-key entry table. Phase 3 needs up to 4 active tilesets (Stages 1-4 of
// Area 1). Each stageIndex (1..N) gets its own per-key Map; `setActiveStage`
// flips which map services `has` / `canvasAt` / `frameIndexAt`. The legacy
// `loadArea` is preserved as a thin shim that loads into stage 1 + activates it.
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
        // stageIndex -> Map<key, { frames: HTMLCanvasElement[], fps, isAnimated, displayPx }>
        // v1.0 — `_stageSets` is now keyed by composite "areaIndex:stageIndex"
        // (e.g. "1:2" = Area 1 Stage 2, "2:1" = Area 2 Stage 1). Calls that pass
        // only stageIndex fall through with areaIndex defaulting to 1 for
        // back-compat. `_activeKey` is the active composite key.
        this._stageSets   = new Map();
        this._activeStage = 1;     // legacy stage index (kept for back-compat reads)
        this._activeArea  = 1;     // v1.0 area index
        this._displayPx   = 48;
    }

    /** v1.0 — compose a stage-set key from area + stage. */
    _key(stageIndex, areaIndex = 1) {
        return `${areaIndex}:${stageIndex}`;
    }

    /**
     * Loads an Area's tile module (mod = { PALETTE, TILES, META }) into the
     * stage-1 slot and activates stage 1. Preserved for back-compat with v0.50
     * game.js wiring; new code should use loadStageSet + setActiveStage.
     */
    async loadArea(mod) {
        await this.loadStageSet(1, mod);
        this.setActiveStage(1);
    }

    /**
     * v0.75 — load a tile module into a specific stage slot.
     * v1.0  — accepts optional areaIndex so Area 1 and Area 2 can both have a
     *         "Stage 2" without colliding.
     * Idempotent; subsequent calls for the same (area, stage) overwrite the slot.
     */
    async loadStageSet(stageIndex, mod, areaIndex = 1) {
        if (!mod || !mod.PALETTE || !mod.TILES || !mod.META) {
            throw new Error('TileCache.loadStageSet: module missing PALETTE/TILES/META');
        }
        const palette  = mod.PALETTE.map(_hex2rgba);
        const meta     = mod.META;
        const tile     = meta.tile;
        const scale    = meta.scale ?? 1;
        const displayPx = meta.displayPx ?? (tile * scale);
        this._displayPx = displayPx;

        const slot = new Map();
        for (const key of Object.keys(mod.TILES)) {
            const entry = mod.TILES[key];
            const isAnimated = !Array.isArray(entry) && entry && Array.isArray(entry.frames);
            if (isAnimated) {
                const fps = entry.fps || 8;
                const frames = entry.frames.map(matrix => this._buildCanvas(matrix, palette, tile, displayPx));
                slot.set(key, { frames, fps, isAnimated: true, displayPx });
            } else {
                const matrix = entry;
                const canvas = this._buildCanvas(matrix, palette, tile, displayPx);
                slot.set(key, { frames: [canvas], fps: 0, isAnimated: false, displayPx });
            }
        }
        // v1.0 — store under composite key. Back-compat read-paths fall back to
        // the area=1 key when areaIndex is omitted.
        this._stageSets.set(this._key(stageIndex, areaIndex), slot);
    }

    /**
     * v0.75 — switch which stage's tile slot services has/canvasAt/frameIndexAt.
     * v1.0  — accepts optional areaIndex; previous single-arg signature still works
     *         and is treated as area 1.
     */
    setActiveStage(stageIndex, areaIndex = 1) {
        this._activeStage = stageIndex;
        this._activeArea  = areaIndex;
    }

    get activeStage() { return this._activeStage; }
    get activeArea()  { return this._activeArea; }
    get displayPx()   { return this._displayPx; }

    _activeSlot() {
        // v1.0 — prefer the composite key; fall back to legacy single-stage key
        // for back-compat with any caller that loaded into area=undefined.
        return this._stageSets.get(this._key(this._activeStage, this._activeArea));
    }

    has(key) {
        const slot = this._activeSlot();
        return !!(slot && slot.has(key));
    }

    /**
     * Returns the frame index to use for an animated tile at the given simulation frame.
     * Lockstep — every instance of a given key shows the same frame this tick.
     */
    frameIndexAt(key, simFrame) {
        const slot = this._activeSlot();
        const e = slot?.get(key);
        if (!e) return 0;
        if (!e.isAnimated || e.frames.length <= 1) return 0;
        return Math.floor(simFrame * e.fps / 60) % e.frames.length;
    }

    /** Returns the canvas to draw for `key` at `simFrame`. Null if missing. */
    canvasAt(key, simFrame) {
        const slot = this._activeSlot();
        const e = slot?.get(key);
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

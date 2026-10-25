// owning agent: dev-lead
// TODO: ParallaxBackground — Phase 1 procedural themes preserved as fallback.
//       Phase 2 loadArea(1) loads three SVGs (sky / mountains / trees) and draws
//       them with the documented scroll factors (0.0 / 0.3 / 0.7). Trees factor 0.7
//       per docs/briefs/phase2-areas.md §9.2 (authoritative over CLAUDE.md's 0.6).

const TS = 48;

export class ParallaxBackground {
    /**
     * @param {number} w  canvas width
     * @param {number} h  canvas height
     * @param {string} theme  procedural theme key (Phase 1 fallback)
     */
    constructor(w, h, theme = 'forest') {
        this.w     = w;
        this.h     = h;
        this.theme = theme;
        this._layers    = this._buildLayers(theme);
        this._svgLayers = null;   // [{img, factor}] — Phase 2 SVG mode
    }

    /**
     * Phase 2 / v0.75.1 — load Area 1 SVGs for ALL 4 stages and switch to
     * image-mode parallax. Stage 1 keeps the original forest set; Stages 2-4
     * use the v0.75.1 shore / cave / dark-forest sets shipped by Design.
     *
     * `_layersByStage[stageIndex]` stores the per-stage array. `setStage`
     * flips `_svgLayers` to the active set so `draw()` reads from the right
     * layers without re-loading SVGs on every transition.
     */
    async loadArea(_areaIndex) {
        const stageSpecs = {
            1: [
                { src: 'assets/bg/area1-sky.svg',                          factor: 0.0 },
                { src: 'assets/bg/area1-mountains.svg',                    factor: 0.3 },
                { src: 'assets/bg/area1-trees.svg',                        factor: 0.7 },
            ],
            2: [
                { src: 'assets/bg/area1-stage2-shore-sky.svg',             factor: 0.0 },
                { src: 'assets/bg/area1-stage2-shore-mid.svg',             factor: 0.3 },
                { src: 'assets/bg/area1-stage2-shore-fg.svg',              factor: 0.7 },
            ],
            3: [
                { src: 'assets/bg/area1-stage3-cave-sky.svg',              factor: 0.0 },
                { src: 'assets/bg/area1-stage3-cave-mid.svg',              factor: 0.3 },
                { src: 'assets/bg/area1-stage3-cave-fg.svg',               factor: 0.7 },
            ],
            4: [
                { src: 'assets/bg/area1-stage4-darkforest-sky.svg',        factor: 0.0 },
                { src: 'assets/bg/area1-stage4-darkforest-mid.svg',        factor: 0.3 },
                { src: 'assets/bg/area1-stage4-darkforest-fg.svg',         factor: 0.7 },
            ],
        };

        this._layersByStage = this._layersByStage || {};
        for (const stageIndex of Object.keys(stageSpecs)) {
            const paths = stageSpecs[stageIndex];
            const loaded = await Promise.all(paths.map(p =>
                this._loadImage(p.src).then(img => ({ img, factor: p.factor }))));
            // Filter out failed loads (image will be null).
            // v1.0 — store under both the legacy numeric key (for setStage
            // back-compat) AND the composite "1:stageIndex" key.
            const filtered = loaded.filter(l => l.img);
            this._layersByStage[stageIndex]         = filtered;
            this._layersByStage[`1:${stageIndex}`]  = filtered;
        }
        // Start on Stage 1's SVG set (game opens at Stage 1 spawn).
        this._svgLayers = this._layersByStage[1] || [];
    }

    /**
     * v1.0 — loadArea2 loads Area 2's parallax SVGs (4 stages, 3 layers each).
     * Each load is silently tolerant of missing files; design ships them in a
     * parallel PR. Per-stage SVGs are stored under "2:stageIndex".
     */
    async loadArea2() {
        const stageSpecs = {
            1: [
                { src: 'assets/bg/area2-stage1-switchback-sky.svg',          factor: 0.0 },
                { src: 'assets/bg/area2-stage1-switchback-mid.svg',          factor: 0.3 },
                { src: 'assets/bg/area2-stage1-switchback-fg.svg',           factor: 0.7 },
            ],
            2: [
                { src: 'assets/bg/area2-stage2-beaconwalk-sky.svg',          factor: 0.0 },
                { src: 'assets/bg/area2-stage2-beaconwalk-mid.svg',          factor: 0.3 },
                { src: 'assets/bg/area2-stage2-beaconwalk-fg.svg',           factor: 0.7 },
            ],
            3: [
                { src: 'assets/bg/area2-stage3-knifing-sky.svg',             factor: 0.0 },
                { src: 'assets/bg/area2-stage3-knifing-mid.svg',             factor: 0.3 },
                { src: 'assets/bg/area2-stage3-knifing-fg.svg',              factor: 0.7 },
            ],
            4: [
                { src: 'assets/bg/area2-stage4-reignward-sky.svg',           factor: 0.0 },
                { src: 'assets/bg/area2-stage4-reignward-mid.svg',           factor: 0.3 },
                { src: 'assets/bg/area2-stage4-reignward-fg.svg',            factor: 0.7 },
            ],
        };
        this._layersByStage = this._layersByStage || {};
        for (const stageIndex of Object.keys(stageSpecs)) {
            const paths = stageSpecs[stageIndex];
            const loaded = await Promise.all(paths.map(p =>
                this._loadImage(p.src).then(img => ({ img, factor: p.factor }))));
            const filtered = loaded.filter(l => l.img);
            this._layersByStage[`2:${stageIndex}`] = filtered;
            if (filtered.length === 0) {
                console.error(`[ParallaxBackground] Area 2 Stage ${stageIndex}: 0 SVGs loaded (asset shipping pending).`);
            }
        }
    }

    draw(ctx, scrollX) {
        if (this._svgLayers && this._svgLayers.length) {
            this._drawSvg(ctx, scrollX);
            return;
        }
        for (const layer of this._layers) {
            layer.draw(ctx, scrollX * layer.speed, this.w, this.h);
        }
    }

    setTheme(theme) {
        this.theme   = theme;
        this._layers = this._buildLayers(theme);
    }

    /**
     * v0.75 / v0.75.1 — switch parallax to a different stage of the current
     * Area. v0.75.1 ships per-stage SVG sets (shore / cave / dark-forest);
     * `_layersByStage` is populated by `loadArea`, and `setStage` flips the
     * active `_svgLayers` reference. The procedural fallback theme is also
     * updated for the rare case where SVG loads failed.
     *
     * Wired in AreaManager._loadStage so it fires on every stage transition
     * (including the initial Stage 1 load).
     */
    setStage(stageIndex, areaIndex = 1) {
        // Map per-stage themes for the procedural fallback (used if SVG load
        // failed). This gives the player a hue cue across stages even without
        // SVG art.
        // v1.0 — Area 2 stages use stone/sky/wind hues.
        const fallbackThemes = (areaIndex === 2)
            ? { 1: 'beach', 2: 'forest', 3: 'cave', 4: 'forest' }  // stone-ish hues
            : { 1: 'forest', 2: 'beach', 3: 'cave', 4: 'forest' };
        const t = fallbackThemes[stageIndex] ?? 'forest';
        this.theme   = t;
        this._layers = this._buildLayers(t);
        // v1.0 — flip active SVG layer set. Per-area composite key
        // ("a:s") mirrors TileCache's pattern. If the per-area set is missing,
        // fall back to area-1 stage set; if THAT is missing too, keep the
        // existing _svgLayers so the player sees something rather than blank.
        if (this._layersByStage) {
            const compositeKey = `${areaIndex}:${stageIndex}`;
            const legacyKey    = String(stageIndex);
            if (this._layersByStage[compositeKey]) {
                this._svgLayers = this._layersByStage[compositeKey];
            } else if (areaIndex === 1 && this._layersByStage[legacyKey]) {
                this._svgLayers = this._layersByStage[legacyKey];
            }
            // If neither is present, leave _svgLayers unchanged so the
            // procedural fallback above carries the visual.
        }
    }

    // ── Phase 2: SVG draw ──────────────────────────────────────────────────
    _drawSvg(ctx, scrollX) {
        for (const { img, factor } of this._svgLayers) {
            if (!img || !img.width) continue;
            if (factor === 0) {
                // Static — draw once, stretched to canvas
                ctx.drawImage(img, 0, 0, this.w, this.h);
                continue;
            }
            const imgW = img.width;
            const offset = scrollX * factor;
            // Wrap with two blits to cover the right edge.
            let x = -((offset % imgW + imgW) % imgW);
            // Vertical anchor: align the SVG bottom to the canvas bottom (typical
            // tileable strip background).
            const drawH = this.h;
            const drawW = imgW;
            ctx.drawImage(img, x, 0, drawW, drawH);
            ctx.drawImage(img, x + drawW, 0, drawW, drawH);
            // Cover wider canvases if needed
            if (x + drawW * 2 < this.w) {
                ctx.drawImage(img, x + drawW * 2, 0, drawW, drawH);
            }
        }
    }

    _loadImage(src) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload  = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
        });
    }

    // ── Phase 1 procedural fallback (unchanged) ────────────────────────────
    _buildLayers(theme) {
        const themes = {
            forest: [
                { speed: 0.0, draw: this._drawSky('#5C94FC', '#87CEEB') },
                { speed: 0.3, draw: this._drawMountains('#4A7A30', '#3A6A20') },
                { speed: 0.7, draw: this._drawTrees('#2E5A18', '#1E4A08') },
            ],
            cave: [
                { speed: 0.0, draw: this._drawSky('#111', '#222') },
                { speed: 0.3, draw: this._drawMountains('#333', '#444') },
                { speed: 0.7, draw: this._drawTrees('#222', '#333') },
            ],
            beach: [
                { speed: 0.0, draw: this._drawSky('#87CEEB', '#E0F0FF') },
                { speed: 0.3, draw: this._drawMountains('#F4D47C', '#E8C86C') },
                { speed: 0.7, draw: this._drawTrees('#D2A054', '#C29044') },
            ],
            ice: [
                { speed: 0.0, draw: this._drawSky('#B8D8F8', '#D8F0FF') },
                { speed: 0.3, draw: this._drawMountains('#E8F4FF', '#C8E8FF') },
                { speed: 0.7, draw: this._drawTrees('#A8D0F0', '#88C0E8') },
            ],
        };
        return themes[theme] ?? themes.forest;
    }

    _drawSky(topColor, bottomColor) {
        return (ctx, _sx, w, h) => {
            const grad = ctx.createLinearGradient(0, 0, 0, h * 0.7);
            grad.addColorStop(0, topColor);
            grad.addColorStop(1, bottomColor);
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);
        };
    }

    _drawMountains(color1, _color2) {
        return (ctx, sx, w, h) => {
            ctx.fillStyle = color1;
            const peaks = [0.1, 0.28, 0.45, 0.62, 0.78, 0.95, 1.1, 1.25];
            const totalW = w * 1.5;
            const offset = sx % totalW;
            for (const t of peaks) {
                const mx = t * totalW - offset;
                const my = h * 0.45;
                ctx.beginPath();
                ctx.moveTo(mx - 80, h * 0.75);
                ctx.lineTo(mx, my);
                ctx.lineTo(mx + 80, h * 0.75);
                ctx.fill();
            }
        };
    }

    _drawTrees(color1, _color2) {
        return (ctx, sx, w, h) => {
            ctx.fillStyle = color1;
            const spacing = 90;
            const totalW  = Math.ceil(w / spacing + 2) * spacing;
            const offset  = sx % totalW;
            for (let x = -spacing; x < w + spacing; x += spacing) {
                const tx = x - (offset % spacing);
                const ty = h * 0.68;
                ctx.fillRect(tx - 4, ty, 8, 32);
                ctx.beginPath();
                ctx.arc(tx, ty - 10, 22, 0, Math.PI * 2);
                ctx.fill();
            }
        };
    }
}
// Local stub to avoid lint error on unused TS const (TILE size; reference for future use)
void TS;

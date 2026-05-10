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
     * Phase 2 — load Area 1 SVGs and switch to image-mode parallax.
     */
    async loadArea(_areaIndex) {
        const paths = [
            { src: 'assets/bg/area1-sky.svg',       factor: 0.0 },
            { src: 'assets/bg/area1-mountains.svg', factor: 0.3 },
            { src: 'assets/bg/area1-trees.svg',     factor: 0.7 },
        ];
        const loaded = await Promise.all(paths.map(p => this._loadImage(p.src).then(img => ({ img, factor: p.factor }))));
        // Filter out failed loads (image will be null)
        this._svgLayers = loaded.filter(l => l.img);
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

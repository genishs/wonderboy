/**
 * Agent 3 (Graphics & Animation Director) owns this file.
 *
 * Parallax scroll speeds (fraction of camera scrollX):
 *   Layer 0 (sky/clouds)   0.0  — static
 *   Layer 1 (mountains)    0.3
 *   Layer 2 (trees/bushes) 0.6
 *   Layer 3 (tiles)        1.0  — drawn by Renderer.drawTiles()
 *
 * Current state: procedural canvas drawing for each layer.
 * TODO (Agent 3): replace with image-based layers once assets/sprites/bg_*.png exist.
 */

export class ParallaxBackground {
    /**
     * @param {number} w  canvas width
     * @param {number} h  canvas height
     * @param {string} theme  'forest' | 'cave' | 'beach' | 'ice' | 'sky' | 'castle' | 'final'
     */
    constructor(w, h, theme = 'forest') {
        this.w     = w;
        this.h     = h;
        this.theme = theme;
        this._layers = this._buildLayers(theme);
    }

    draw(ctx, scrollX) {
        for (const layer of this._layers) {
            layer.draw(ctx, scrollX * layer.speed, this.w, this.h);
        }
    }

    setTheme(theme) {
        this.theme   = theme;
        this._layers = this._buildLayers(theme);
    }

    // ── Procedural layer definitions per theme ─────────────────────────────
    _buildLayers(theme) {
        const themes = {
            forest: [
                { speed: 0.0, draw: this._drawSky('#5C94FC', '#87CEEB') },
                { speed: 0.3, draw: this._drawMountains('#4A7A30', '#3A6A20') },
                { speed: 0.6, draw: this._drawTrees('#2E5A18', '#1E4A08') },
            ],
            cave: [
                { speed: 0.0, draw: this._drawSky('#111', '#222') },
                { speed: 0.3, draw: this._drawMountains('#333', '#444') },
                { speed: 0.6, draw: this._drawTrees('#222', '#333') },
            ],
            beach: [
                { speed: 0.0, draw: this._drawSky('#87CEEB', '#E0F0FF') },
                { speed: 0.3, draw: this._drawMountains('#F4D47C', '#E8C86C') },
                { speed: 0.6, draw: this._drawTrees('#D2A054', '#C29044') },
            ],
            ice: [
                { speed: 0.0, draw: this._drawSky('#B8D8F8', '#D8F0FF') },
                { speed: 0.3, draw: this._drawMountains('#E8F4FF', '#C8E8FF') },
                { speed: 0.6, draw: this._drawTrees('#A8D0F0', '#88C0E8') },
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

    _drawMountains(color1, color2) {
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
                // trunk
                ctx.fillRect(tx - 4, ty, 8, 32);
                // canopy
                ctx.beginPath();
                ctx.arc(tx, ty - 10, 22, 0, Math.PI * 2);
                ctx.fill();
            }
        };
    }
}

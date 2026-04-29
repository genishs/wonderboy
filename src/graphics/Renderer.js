/**
 * Agent 3 (Graphics & Animation Director) owns this file.
 * Current state: placeholder rectangles for all sprites.
 * Replace _drawEntity() and drawBackground() with SpriteSheet calls once assets land in assets/sprites/.
 */

const TILE_COLORS = {
    1: '#7B4F2E',  // ground / earth
    2: '#4CAF50',  // one-way platform
    3: '#FF3300',  // spike
    4: '#1E90FF',  // water
    5: '#2E8B1A',  // bush (decorative, non-solid)
    6: '#5A4030',  // wall block
    7: '#C8E8FF',  // ice
    8: '#FFD700',  // goal post
};

export class Renderer {
    constructor(ctx, w, h) {
        this.ctx    = ctx;
        this.width  = w;
        this.height = h;
        this._imgs  = new Map(); // name → HTMLImageElement
    }

    // ── Frame lifecycle ────────────────────────────────────────────────────
    clear() {
        this.ctx.fillStyle = '#5C94FC';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // ── Title / start screen ───────────────────────────────────────────────
    drawTitle() {
        const ctx = this.ctx;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 52px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('WONDER BOY', this.width / 2, this.height / 2 - 50);

        ctx.fillStyle = '#FF8C00';
        ctx.font = '22px monospace';
        ctx.fillText('LEGACY REBIRTH', this.width / 2, this.height / 2);

        ctx.fillStyle = '#FFF';
        ctx.font = '16px monospace';
        ctx.fillText('PRESS ANY KEY OR CLICK TO START', this.width / 2, this.height / 2 + 60);
    }

    // ── Parallax background (Agent 3: implement ParallaxBackground layers) ─
    drawBackground(scrollX = 0) {
        // TODO: Agent 3 — replace with multi-layer parallax scrolling
        // Layer 0 (far): sky (already drawn in clear())
        // Layer 1 (mid): distant mountains / clouds at 0.3× scroll
        // Layer 2 (near): trees / hills at 0.6× scroll
    }

    // ── Tile map ───────────────────────────────────────────────────────────
    drawTiles(level, scrollX = 0) {
        if (!level) return;
        const ctx  = this.ctx;
        const ts   = 48;
        const col0 = Math.floor(scrollX / ts);
        const col1 = Math.ceil((scrollX + this.width) / ts);

        for (let row = 0; row < level.rows; row++) {
            for (let col = col0; col <= col1; col++) {
                const tile = level.getTile(col, row);
                if (!tile || tile.type === 0) continue;
                const sx = col * ts - scrollX;
                const sy = row * ts;
                ctx.fillStyle = TILE_COLORS[tile.type] ?? '#888';
                ctx.fillRect(sx, sy, ts, ts);
                ctx.strokeStyle = 'rgba(0,0,0,0.15)';
                ctx.lineWidth = 1;
                ctx.strokeRect(sx, sy, ts, ts);
            }
        }
    }

    // ── Entities ───────────────────────────────────────────────────────────
    drawEntities(ecs, scrollX = 0) {
        for (const e of ecs.query('transform', 'sprite')) {
            this._drawEntity(e, scrollX);
        }
    }

    _drawEntity({ transform: tf, sprite: sp, player: pl, enemy: en }, scrollX) {
        const ctx = this.ctx;
        const sx  = tf.x - scrollX;
        const sy  = tf.y;

        if (sp.image && this._imgs.has(sp.sheet)) {
            // TODO: Agent 3 — draw from SpriteSheet using sp.frame
        } else {
            // Placeholder: colored rectangle
            ctx.fillStyle = sp.color ?? '#FF8C00';
            ctx.fillRect(sx, sy, tf.w, tf.h);

            // Direction indicator
            if (pl) {
                ctx.fillStyle = '#FFF';
                const eyeX = pl.facingRight ? sx + tf.w - 10 : sx + 4;
                ctx.fillRect(eyeX, sy + 8, 6, 6);
            }
        }
    }

    // ── HUD ────────────────────────────────────────────────────────────────
    drawHUD(state) {
        const ctx = this.ctx;
        const PAD = 8;

        ctx.font = '16px monospace';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#FFF';
        ctx.fillText(`SCORE ${String(state.score).padStart(6,'0')}`, PAD, 20);
        ctx.fillText(`HI    ${String(state.highScore).padStart(6,'0')}`, PAD, 38);

        ctx.textAlign = 'right';
        ctx.fillText(`♥ × ${state.lives}`, this.width - PAD, 20);

        // Vitality bar
        const bw = 140, bh = 14;
        const bx = (this.width - bw) / 2, by = 6;
        const ratio = state.hunger / state.maxHunger;
        ctx.fillStyle = '#222';
        ctx.fillRect(bx, by, bw, bh);
        ctx.fillStyle = ratio > 0.3 ? '#00DD44' : '#FF2222';
        ctx.fillRect(bx, by, bw * ratio, bh);
        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, bw, bh);

        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFF';
        ctx.fillText('VITALITY', this.width / 2, by + bh + 11);

        // Axe count & skateboard
        ctx.font = '14px monospace';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#FFF';
        ctx.fillText(`AXE×${state.axeCount}`, PAD, this.height - 10);
        if (state.hasSkateboard) {
            ctx.fillStyle = '#FFD700';
            ctx.fillText('[SKATEBOARD]', PAD + 80, this.height - 10);
        }

        // Pause / Game Over overlays
        if (state.gameState === 'PAUSED') {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fillStyle = '#FFF';
            ctx.font = '36px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('PAUSED', this.width / 2, this.height / 2);
        }

        if (state.gameState === 'GAME_OVER') {
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.fillStyle = '#FF2222';
            ctx.font = '48px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 20);
            ctx.fillStyle = '#FFF';
            ctx.font = '18px monospace';
            ctx.fillText('PRESS ANY KEY', this.width / 2, this.height / 2 + 30);
        }
    }

    // ── Asset loading helper ───────────────────────────────────────────────
    loadImage(name, src) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => { this._imgs.set(name, img); resolve(); };
            img.onerror = resolve; // graceful fallback to placeholders
            img.src = src;
        });
    }
}

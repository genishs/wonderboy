// owning agent: dev-lead
// TODO: Renderer — Phase 1 placeholder + cached-sprite path + Phase 2 (v0.50)
//   tile-cache draw, decoration overlay, parallax SVG layers, transition fade,
//   stage-clear bilingual overlay, hero armed-state animation key.

import { pickAnim } from './SpriteCache.js';

const TILE_COLORS = {
    1: '#7B4F2E',  // ground / earth
    2: '#4CAF50',  // one-way platform
    3: '#FF3300',  // spike
    4: '#1E90FF',  // water
    5: '#2E8B1A',  // bush (decorative, non-solid)
    6: '#5A4030',  // wall block
    7: '#C8E8FF',  // ice
    8: '#FFD700',  // goal post
    // Phase 2 fallbacks (only used when TileCache hasn't been wired)
    100: '#7B4F2E',  // FLAT
    101: '#7B4F2E',  // SLOPE_UP_22
    102: '#7B4F2E',  // SLOPE_UP_45
    103: '#7B4F2E',  // SLOPE_DN_22
    104: '#7B4F2E',  // SLOPE_DN_45
    105: '#C8A060',  // MILE_1
    106: '#C8A060',  // MILE_2
    107: '#C8A060',  // MILE_3
    108: '#9098A0',  // CAIRN
    109: '#FF6020',  // FIRE_LOW
    110: '#7A8088',  // ROCK_SMALL
};

export class Renderer {
    constructor(ctx, w, h) {
        this.ctx          = ctx;
        this.width        = w;
        this.height       = h;
        this._imgs        = new Map(); // legacy image registry (unused for Phase 1)
        this.spriteCache  = null;       // wired by game.js after init
        this.tileCache    = null;       // wired by game.js after Phase 2 init
        this.parallax     = null;       // ParallaxBackground instance (wired by game.js)
        this.stageManager = null;       // wired by game.js for transition / stage-clear overlays
        this._frame       = 0;          // (legacy) render-rate frame counter
        this._simFrame    = 0;          // fixed-step simulation frame counter (driven by GameLoop.tick())
    }

    // ── Frame lifecycle ────────────────────────────────────────────────────
    tick() {
        this._simFrame++;
    }

    clear() {
        this.ctx.fillStyle = '#5C94FC';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this._frame++;
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

    // ── Parallax background ────────────────────────────────────────────────
    drawBackground(scrollX = 0) {
        if (this.parallax && typeof this.parallax.draw === 'function') {
            this.parallax.draw(this.ctx, scrollX);
        }
    }

    // ── Tile map (cache-aware) ─────────────────────────────────────────────
    drawTiles(level, scrollX = 0) {
        if (!level) return;
        const ctx  = this.ctx;
        const ts   = 48;
        const col0 = Math.max(0, Math.floor(scrollX / ts));
        const col1 = Math.min(level.cols - 1, Math.ceil((scrollX + this.width) / ts));

        for (let row = 0; row < level.rows; row++) {
            for (let col = col0; col <= col1; col++) {
                const tile = level.getTile(col, row);
                if (!tile || tile.type === 0) continue;
                const sx = col * ts - scrollX;
                const sy = row * ts;

                let drew = false;
                if (this.tileCache && tile.tileKey && this.tileCache.has(tile.tileKey)) {
                    const canvas = this.tileCache.canvasAt(tile.tileKey, this._simFrame);
                    if (canvas) {
                        ctx.drawImage(canvas, sx, sy, ts, ts);
                        drew = true;
                    }
                }
                if (!drew) {
                    ctx.fillStyle = TILE_COLORS[tile.type] ?? '#888';
                    ctx.fillRect(sx, sy, ts, ts);
                    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(sx, sy, ts, ts);
                }
            }
        }

        // Decoration overlay (rocks). Drawn after ground. Rock sits ON TOP of the
        // floor at d.row, so render the tile one row higher (visually overlapping
        // the body of the row above).
        if (level.decorations && level.decorations.length > 0 && this.tileCache) {
            for (const d of level.decorations) {
                if (d.col < col0 - 1 || d.col > col1 + 1) continue;
                const sx = d.col * ts - scrollX;
                const sy = (d.row - 1) * ts;
                if (this.tileCache.has(d.kind)) {
                    const c = this.tileCache.canvasAt(d.kind, this._simFrame);
                    if (c) ctx.drawImage(c, sx, sy, ts, ts);
                }
            }
        }
    }

    // ── Entities ───────────────────────────────────────────────────────────
    drawEntities(ecs, scrollX = 0) {
        for (const e of ecs.query('transform', 'sprite')) {
            e.player     = ecs.getComponent(e.id, 'player');
            e.enemy      = ecs.getComponent(e.id, 'enemy');
            e.projectile = ecs.getComponent(e.id, 'projectile');
            e.pickup     = ecs.getComponent(e.id, 'pickup');
            this._drawEntity(e, scrollX);
        }
    }

    _drawEntity({ transform: tf, sprite: sp, player: pl, enemy: en, projectile: pj, pickup: pu }, scrollX) {
        const ctx = this.ctx;
        const sx  = tf.x - scrollX;
        const sy  = tf.y;

        const cache = this.spriteCache;
        const entry = (sp.name && cache?.has(sp.name)) ? cache.get(sp.name) : null;

        if (entry) {
            this._drawCached(entry, sp, tf, scrollX, pl, en, pj, pu);
            return;
        }

        // Placeholder rectangle
        const color = sp.color ?? this._fallbackColor(en, pj, pu) ?? '#FF8C00';
        let alpha = 1;
        if (en && en.ai === 'dead') {
            const f = en.deathFrames || 0;
            const max = (en.type === 'crawlspine' ? 30 : 45);
            alpha = Math.max(0, f / max);
            ctx.globalAlpha = alpha;
        }
        ctx.fillStyle = color;
        ctx.fillRect(sx, sy, tf.w, tf.h);

        if (pl) {
            ctx.fillStyle = '#FFF';
            const eyeX = pl.facingRight ? sx + tf.w - 10 : sx + 4;
            ctx.fillRect(eyeX, sy + 8, 6, 6);
        }
        ctx.globalAlpha = 1;
    }

    _drawCached(entry, sp, tf, scrollX, pl, en, pj, pu) {
        const ctx = this.ctx;
        const meta = entry.meta;
        const scale = sp.scale || 2;

        const requested = this._animKeyFor(sp, pl, en, pj, pu);
        const animKey = pickAnim(entry, requested);
        const frames = animKey ? entry.frames[animKey] : null;
        if (!frames || frames.length === 0) return;

        if (sp._lastAnim !== animKey) {
            sp._lastAnim = animKey;
            sp._animStartFrame = this._simFrame;
        }

        const fps = meta.fps || 8;
        const elapsed = this._simFrame - (sp._animStartFrame ?? this._simFrame);
        const f = Math.floor(elapsed * fps / 60) % frames.length;
        const canvas = frames[f];

        const drawW = meta.w * scale;
        const drawH = meta.h * scale;
        const drawX = tf.x + tf.w / 2 - meta.anchor.x * scale - scrollX;
        const drawY = Math.floor(tf.y + tf.h - (meta.anchor.y + 1) * scale);

        let restoreAlpha = false;
        if (en && en.ai === 'dead') {
            const max = (en.type === 'crawlspine' ? 30
                       : en.type === 'mossplodder' ? 30
                       : en.type === 'hummerwing'  ? 30
                       : 45);
            ctx.globalAlpha = Math.max(0, (en.deathFrames || 0) / max);
            restoreAlpha = true;
        }
        if (en && en.hurtFrames > 0 && (en.hurtFrames % 2 === 0)) {
            ctx.globalCompositeOperation = 'lighter';
        }

        const flip = sp.flip === true || (pl && !pl.facingRight);
        if (flip) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(canvas, -(drawX + drawW), drawY, drawW, drawH);
            ctx.restore();
        } else {
            ctx.drawImage(canvas, drawX, drawY, drawW, drawH);
        }

        // Hero attack overlay (frames played on top of locomotion)
        if (pl && pl.attackOverlayFrames > 0) {
            const atkAnim = pickAnim(entry, 'attack', ['attack', 'idle']);
            if (atkAnim && atkAnim !== animKey) {
                const af = entry.frames[atkAnim];
                if (!sp._attackOverlayWasActive || sp._lastAttackAnim !== atkAnim) {
                    sp._lastAttackAnim = atkAnim;
                    sp._attackStartFrame = this._simFrame;
                }
                const atkElapsed = this._simFrame - (sp._attackStartFrame ?? this._simFrame);
                const aIdx = Math.floor(atkElapsed * fps / 60) % af.length;
                const aCanvas = af[aIdx];
                if (flip) {
                    ctx.save();
                    ctx.scale(-1, 1);
                    ctx.drawImage(aCanvas, -(drawX + drawW), drawY, drawW, drawH);
                    ctx.restore();
                } else {
                    ctx.drawImage(aCanvas, drawX, drawY, drawW, drawH);
                }
            }
            sp._attackOverlayWasActive = true;
        } else if (pl) {
            sp._attackOverlayWasActive = false;
        }

        if (restoreAlpha) ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
    }

    _animKeyFor(sp, pl, en, pj, pu) {
        if (pl) {
            const s = pl.aiState || 'idle';
            const armed = pl.armed === true;
            if (s === 'jump_rising' || s === 'jump_falling') return armed ? 'jump_armed' : 'jump';
            if (s === 'walk') return armed ? 'walk_armed' : 'walk';
            if (s === 'idle') return armed ? 'idle_armed' : 'idle';
            if (s === 'attack' || s === 'hurt' || s === 'dead') return s;
            return s;
        }
        if (en) {
            if (en.ai === 'dead')   return 'dead';
            if (en.type === 'mossplodder') return 'walk';
            if (en.type === 'hummerwing')  return 'drift';
            if (en.ai === 'patrol' || en.ai === 'turn') return 'walk';
            if (en.type === 'glassmoth') {
                if (en.ai === 'swoop')   return 'dive';
                if (en.ai === 'recover') return 'drift';
                return 'drift';
            }
            if (en.type === 'sapling') return en.ai;
            return en.ai;
        }
        if (pu) {
            // dawn-husk: 'rest' or 'break'
            if (pu.type === 'dawn-husk') return pu.state || 'rest';
            // hatchet pickup uses the projectile sprite's `fly` (slowly spinning on ground)
            if (pu.type === 'hatchet')   return 'fly';
            return sp.anim || 'idle';
        }
        if (pj) return sp.anim || 'fly';
        return sp.anim || 'idle';
    }

    _fallbackColor(en, pj, pu) {
        if (pj?.type === 'stoneflake')  return '#d8c8a8';
        if (pj?.type === 'seeddart')    return '#f0e8c8';
        if (pj?.type === 'hatchet')     return '#b0a090';
        if (pu?.type === 'dawn-husk')   return '#e8d4a0';
        if (pu?.type === 'hatchet')     return '#b0a090';
        if (en?.type === 'crawlspine')  return '#7a5c2e';
        if (en?.type === 'glassmoth')   return '#e0c0d8';
        if (en?.type === 'sapling')     return '#3a6024';
        if (en?.type === 'mossplodder') return '#6a8030';
        if (en?.type === 'hummerwing')  return '#e8a040';
        const m = { snail: '#4488FF', bee: '#FFAA00', cobra: '#00CC44', frog: '#33BB33', stone: '#999' };
        if (en) return m[en.type] ?? '#FF0000';
        return null;
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

        // Round indicator (Phase 2): top-right when stage manager wired
        if (this.stageManager && this.stageManager.areaIndex > 0) {
            ctx.font = '14px monospace';
            ctx.textAlign = 'right';
            ctx.fillStyle = '#FFD878';
            ctx.fillText(
                `AREA ${this.stageManager.areaIndex}-${this.stageManager.roundIndex}`,
                this.width - PAD, 20,
            );
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
            ctx.fillText('REFRESH TO RETRY', this.width / 2, this.height / 2 + 30);
        }

        if (state.gameState === 'TRANSITIONING') {
            this.drawTransition(state);
        }

        if (state.gameState === 'STAGE_CLEAR') {
            this.drawStageClear();
        }
    }

    /**
     * Round-transition fade overlay. StageManager owns the timer; renderer reads.
     * Timeline (frames remaining out of 60):
     *   60 -> 41   fade out (alpha 0 -> 1)
     *   40 -> 21   hold black (alpha = 1)
     *   20 -> 1    fade in   (alpha 1 -> 0)
     */
    drawTransition(state) {
        const sm = this.stageManager;
        if (!sm) return;
        const t = sm.transitionTimer | 0;
        if (t <= 0) return;
        let alpha = 0;
        if (t > 40)      alpha = (60 - t) / 20;       // fading out (0..1)
        else if (t > 20) alpha = 1;
        else             alpha = t / 20;              // fading in  (1..0)
        alpha = Math.max(0, Math.min(1, alpha));

        const ctx = this.ctx;
        ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        ctx.fillRect(0, 0, this.width, this.height);
    }

    /** Cairn / stage-clear bilingual overlay. */
    drawStageClear() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.textAlign = 'center';
        ctx.fillStyle = '#f8d878';
        ctx.font = '32px monospace';
        ctx.fillText('STAGE CLEARED', this.width / 2, this.height / 2 - 40);

        ctx.fillStyle = '#FFF';
        ctx.font = '16px monospace';
        ctx.fillText('The path continues — soon.', this.width / 2, this.height / 2 + 8);
        ctx.fillText('길은 이어진다 — 곧.',          this.width / 2, this.height / 2 + 32);
    }

    // ── Asset loading helper (legacy) ──────────────────────────────────────
    loadImage(name, src) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload  = () => { this._imgs.set(name, img); resolve(); };
            img.onerror = resolve;
            img.src = src;
        });
    }
}

// owning agent: dev-lead
// TODO: Renderer — placeholder rectangles for unmapped entities; SpriteCache draws
//       for entities the Design team has shipped. Phase 1 adds anchor-formula draws,
//       facing-flip via ctx.scale(-1, 1), and iframe-blink for hurt hero.

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
};

export class Renderer {
    constructor(ctx, w, h) {
        this.ctx          = ctx;
        this.width        = w;
        this.height       = h;
        this._imgs        = new Map(); // legacy image registry (unused for Phase 1)
        this.spriteCache  = null;       // wired by game.js after init
        this._frame       = 0;          // (legacy) render-rate frame counter — unused for anim timing
        this._simFrame    = 0;          // fixed-step simulation frame counter (driven by GameLoop.tick())
    }

    // ── Frame lifecycle ────────────────────────────────────────────────────
    /**
     * Called once per fixed-step simulation frame from GameLoop._update.
     * Drives animation indices so they stay locked to the 60 Hz simulation rate
     * regardless of the host monitor's refresh rate.
     */
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

    // ── Parallax background (placeholder for Phase 2) ─────────────────────
    drawBackground(scrollX = 0) {
        // intentionally empty — sky already painted by clear()
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
            // Pull supplemental components for renderer logic
            e.player = ecs.getComponent(e.id, 'player');
            e.enemy  = ecs.getComponent(e.id, 'enemy');
            e.projectile = ecs.getComponent(e.id, 'projectile');
            this._drawEntity(e, scrollX);
        }
    }

    _drawEntity({ transform: tf, sprite: sp, player: pl, enemy: en, projectile: pj }, scrollX) {
        const ctx = this.ctx;
        const sx  = tf.x - scrollX;
        const sy  = tf.y;

        // v0.25.2: iframe blink removed — hero is 1-hit-kill, no invincibility.

        // Resolve sprite-cache entry by sp.name (Phase 1 path) or fall back to placeholder.
        const cache = this.spriteCache;
        const entry = (sp.name && cache?.has(sp.name)) ? cache.get(sp.name) : null;

        if (entry) {
            this._drawCached(entry, sp, tf, scrollX, pl, en, pj);
            return;
        }

        // Placeholder: colored rectangle
        const color = sp.color ?? this._fallbackColor(en, pj) ?? '#FF8C00';
        // Death fade for enemies waiting on deathFrames
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

    _drawCached(entry, sp, tf, scrollX, pl, en, pj) {
        const ctx = this.ctx;
        const meta = entry.meta;
        const scale = sp.scale || 2;

        // Pick animation key based on entity state
        const requested = this._animKeyFor(sp, pl, en, pj);
        const animKey = pickAnim(entry, requested);
        const frames = animKey ? entry.frames[animKey] : null;
        if (!frames || frames.length === 0) return;

        // Reset anim cycle when the chosen anim key changes — keeps idle→walk→jump
        // transitions from popping into a random mid-cycle frame.
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

        // Death fade
        let restoreAlpha = false;
        if (en && en.ai === 'dead') {
            const max = (en.type === 'crawlspine' ? 30 : 45);
            ctx.globalAlpha = Math.max(0, (en.deathFrames || 0) / max);
            restoreAlpha = true;
        }
        // Hurt flash for enemies (every-other frame brighter)
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

        // Draw attack overlay for hero on top of locomotion frame
        if (pl && pl.attackOverlayFrames > 0) {
            const atkAnim = pickAnim(entry, 'attack', ['attack', 'idle']);
            if (atkAnim && atkAnim !== animKey) {
                const af = entry.frames[atkAnim];
                // Reset attack-overlay cycle on each fresh attack (overlay went 0 -> positive
                // since the last render) or when the resolved attack-anim key changes.
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

    _animKeyFor(sp, pl, en, pj) {
        if (pl) {
            // Map hero FSM state → sprite animation key (sprite has 'jump' but no 'jump_rising'/'jump_falling')
            const s = pl.aiState || 'idle';
            if (s === 'jump_rising' || s === 'jump_falling') return 'jump';
            if (s === 'walk' || s === 'idle' || s === 'attack' || s === 'hurt' || s === 'dead') return s;
            return s;
        }
        if (en) {
            if (en.ai === 'dead')   return 'dead';
            if (en.ai === 'patrol' || en.ai === 'turn') return 'walk';
            if (en.type === 'glassmoth') {
                if (en.ai === 'swoop')   return 'dive';     // sprite uses 'dive' (single frame)
                if (en.ai === 'recover') return 'drift';
                return 'drift';
            }
            if (en.type === 'sapling') return en.ai; // closed | windup | firing | cooldown
            return en.ai;
        }
        if (pj) return sp.anim || 'fly';
        return sp.anim || 'idle';
    }

    _fallbackColor(en, pj) {
        if (pj?.type === 'stoneflake') return '#d8c8a8';
        if (pj?.type === 'seeddart')   return '#f0e8c8';
        if (en?.type === 'crawlspine') return '#7a5c2e';
        if (en?.type === 'glassmoth')  return '#e0c0d8';
        if (en?.type === 'sapling')    return '#3a6024';
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

        // v0.25.2: HP heart row removed. Vitality bar is the single life-line in Phase 1.

        // Vitality bar — Phase 1 single life-line (depletes over time; reaching 0 = game over).
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
    }

    // ── Asset loading helper (legacy; not used in Phase 1) ─────────────────
    loadImage(name, src) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload  = () => { this._imgs.set(name, img); resolve(); };
            img.onerror = resolve;
            img.src = src;
        });
    }
}

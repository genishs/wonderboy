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
        this.stageManager = null;       // legacy back-pointer; v0.75 prefers areaManager
        this.areaManager  = null;       // v0.75 — wired by game.js after AreaManager init
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

        // v0.50.1: per-anim fps override. If META.animFps[animKey] is defined, use it;
        // otherwise fall back to META.fps. This lets `idle/idle_armed` breathe slowly
        // while keeping snappier walk/attack cycles, and tames over-fast wing flaps.
        const animFpsMap = meta.animFps || null;
        const fps = (animFpsMap && typeof animFpsMap[animKey] === 'number')
            ? animFpsMap[animKey]
            : (meta.fps || 8);
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
                // v0.50.1: attack overlay uses its own per-anim fps (default META.fps for snap).
                const atkFps = (animFpsMap && typeof animFpsMap[atkAnim] === 'number')
                    ? animFpsMap[atkAnim]
                    : (meta.fps || 8);
                const aIdx = Math.floor(atkElapsed * atkFps / 60) % af.length;
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
            // v0.50.2 — death/stumble/sprint take priority over locomotion picks.
            // Death anim plays during the dying FSM (timer > 0 OR aiState ===
            // 'dying'); we map both to the new 4-frame `death` key.
            if (s === 'dying' || (pl.dyingFrames | 0) > 0) return 'death';
            if (s === 'stumble') return 'stumble';
            if (s === 'sprint') return armed ? 'sprint_armed' : 'sprint';
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

        // Round indicator (Phase 2/3): top-right when stage manager wired.
        // v0.75 — chip reads "AREA 1-(stageIndex)-(roundIndex)" when AreaManager
        // is active so the player can see which stage AND which round they're in.
        if (this.stageManager && this.stageManager.areaIndex > 0) {
            ctx.font = '14px monospace';
            ctx.textAlign = 'right';
            ctx.fillStyle = '#FFD878';
            const am = this.areaManager;
            const text = am
                ? `AREA ${am.areaIndex}-${am.currentStageIndex}-${this.stageManager.roundIndex}`
                : `AREA ${this.stageManager.areaIndex}-${this.stageManager.roundIndex}`;
            ctx.fillText(text, this.width - PAD, 20);
        }

        // v0.50.1 — Lives hearts. Render to the right of the score, top area.
        // 3 heart slots; filled red = available, hollow gray = used. Vertical
        // baseline aligned with the score line.
        this._drawLivesHearts(state);

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
            // v0.50.2 — Phase 2 has unlimited continues; v0.25.x Phase 1 stays
            // terminal (no continueRun method on the v0.25.x path, only set in
            // v0.50.2 StateManager). The bilingual prompt nudges the player to
            // press any of the gameplay action keys; HeroController watches.
            ctx.fillStyle = '#FFF';
            ctx.font = '18px monospace';
            if (typeof state.continueRun === 'function') {
                ctx.fillText('Press any key to continue', this.width / 2, this.height / 2 + 26);
                ctx.font = '14px monospace';
                ctx.fillText('아무 키나 눌러 계속', this.width / 2, this.height / 2 + 50);
            } else {
                ctx.fillText('REFRESH TO RETRY', this.width / 2, this.height / 2 + 30);
            }
        }

        if (state.gameState === 'TRANSITIONING') {
            this.drawTransition(state);
        }

        if (state.gameState === 'STAGE_CLEAR') {
            this.drawStageClear();
        }

        // v0.75 — STAGE_TRANSITION fade. Reads AreaManager.transition phase to
        // compute the alpha. Phase progression:
        //   input_suspend → no fade (alpha 0)
        //   fade_out      → alpha 0 → 1
        //   hold          → alpha 1 (stage name overlay drawn)
        //   fade_in       → alpha 1 → 0
        if (state.gameState === 'STAGE_TRANSITION') {
            this._drawStageTransition();
        }

        // v0.75 — Boss HP bar (BOSS_FIGHT only).
        if (state.gameState === 'BOSS_FIGHT') {
            this._drawBossHpBar();
        }

        // v0.75 — Area-cleared overlay (terminal closure after boss death).
        if (state.gameState === 'AREA_CLEARED') {
            this._drawAreaCleared();
        }

        // v0.50.1 — Mile-marker overlay (Round 1-X bilingual title). Driven by
        // StageManager.overlay; renders above all HUD chrome but does NOT lock
        // input — gameplay continues underneath.
        if (this.stageManager && this.stageManager.overlay && this.stageManager.overlay.active) {
            this._drawRoundMarkerOverlay();
        }
    }

    _drawLivesHearts(state) {
        const ctx = this.ctx;
        const max = state.maxLives ?? 3;
        const cur = Math.max(0, Math.min(max, state.lives ?? 0));
        const size = 12, gap = 4;
        const totalW = max * size + (max - 1) * gap;
        // Place under the score lines (y=46), left-aligned with the score.
        const startX = 8;
        const startY = 46;
        for (let i = 0; i < max; i++) {
            const x = startX + i * (size + gap);
            const filled = i < cur;
            // Heart shape — two small circles + triangle. Cheap with Canvas2D.
            ctx.save();
            ctx.fillStyle   = filled ? '#FF3344' : '#3a3a3a';
            ctx.strokeStyle = '#FFF';
            ctx.lineWidth   = 1;
            const cx = x + size / 2;
            const cy = startY + size / 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy + size * 0.4);
            ctx.bezierCurveTo(cx + size * 0.7, cy - size * 0.1,
                              cx + size * 0.4, cy - size * 0.7,
                              cx,              cy - size * 0.15);
            ctx.bezierCurveTo(cx - size * 0.4, cy - size * 0.7,
                              cx - size * 0.7, cy - size * 0.1,
                              cx,              cy + size * 0.4);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
        // Reference totalW so a future tweak (right-align) can use it without
        // unused-var lint warnings.
        void totalW;
    }

    _drawRoundMarkerOverlay() {
        const sm = this.stageManager;
        const o  = sm.overlay;
        if (!o || !o.active) return;

        // v0.75 — generic round_N key works for any stage. v0.50.2 round_1_N
        // keys are preserved as aliases for back-compat.
        const labels = {
            round_1:   ['Round 1', '라운드 1'],
            round_2:   ['Round 2', '라운드 2'],
            round_3:   ['Round 3', '라운드 3'],
            round_4:   ['Round 4', '라운드 4'],
            round_1_1: ['Round 1', '라운드 1'],
            round_1_2: ['Round 2', '라운드 2'],
            round_1_3: ['Round 3', '라운드 3'],
            round_1_4: ['Round 4', '라운드 4'],
        };
        const pair = labels[o.kind];
        if (!pair) return;

        // Alpha curve: fade in over 15 frames, hold 60, fade out over 15.
        // o.frames counts DOWN from 90.
        const t = o.frames;
        let alpha = 1;
        if (t > 75)      alpha = (90 - t) / 15;        // 0..1 over fade-in window
        else if (t > 15) alpha = 1;
        else             alpha = t / 15;               // 1..0 over fade-out window
        alpha = Math.max(0, Math.min(1, alpha));

        const ctx = this.ctx;
        // Semi-transparent backing strip — keep it light so gameplay stays visible.
        const bandY = 56;
        const bandH = 76;
        ctx.save();
        ctx.globalAlpha = alpha * 0.55;
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fillRect(0, bandY, this.width, bandH);
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 32px monospace';
        ctx.fillText(pair[0], this.width / 2, bandY + 36);

        ctx.fillStyle = '#FFF';
        ctx.font = '18px monospace';
        ctx.fillText(pair[1], this.width / 2, bandY + 62);
        ctx.restore();
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

    /**
     * v0.75 — STAGE_TRANSITION fade overlay. Reads AreaManager.transition phase
     * + frames. Renders a full-screen black quad with alpha curve:
     *   fade_out: 0..1 over fadeOutFrames
     *   hold:     1 (with bilingual stage-name text drawn on top)
     *   fade_in:  1..0 over fadeInFrames
     */
    _drawStageTransition() {
        const am = this.areaManager;
        if (!am || !am.transition.active) return;
        const tr = am.transition;
        const ctx = this.ctx;

        // Read STAGE_TRANSITION timing from the tunables file via dynamic read
        // would be cleaner; we duplicate the fadeOut/hold/fadeIn frame counts
        // here so this method is self-contained. Numbers come from
        // PhaseThreeTunables.STAGE_TRANSITION (must stay in sync).
        const FADE_OUT = 45, HOLD = 75, FADE_IN = 45;

        let alpha = 0;
        if (tr.phase === 'fade_out') {
            const t = tr.frames | 0;
            alpha = 1 - (t / FADE_OUT);
        } else if (tr.phase === 'hold') {
            alpha = 1;
        } else if (tr.phase === 'fade_in') {
            const t = tr.frames | 0;
            alpha = (t / FADE_IN);
        }
        alpha = Math.max(0, Math.min(1, alpha));

        ctx.fillStyle = `rgba(0,0,0,${alpha})`;
        ctx.fillRect(0, 0, this.width, this.height);

        // Bilingual stage-name overlay during hold + fade_in.
        if ((tr.phase === 'hold' || tr.phase === 'fade_in')
            && am.overlay.active && am.overlay.kind === 'stage_name'
            && am.overlay.payload) {
            const p = am.overlay.payload;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.textAlign   = 'center';
            ctx.fillStyle   = '#FFD700';
            ctx.font        = 'bold 28px monospace';
            ctx.fillText(p.en, this.width / 2, this.height / 2 - 12);
            ctx.fillStyle   = '#FFF';
            ctx.font        = '18px monospace';
            ctx.fillText(p.ko, this.width / 2, this.height / 2 + 18);
            ctx.restore();
        }

        void HOLD;   // referenced for documentation; HOLD-phase has alpha=1 above.
    }

    /**
     * v0.75 — boss HP bar HUD. Top-center, 6 pips. Filled pip = sigil-amber
     * (`#f8d878`); empty pip = velvet-shadow (`#3a2e4a`). 1px violet outline.
     */
    _drawBossHpBar() {
        // Walk ECS to find a `boss` component. (Renderer doesn't hold an ECS
        // ref — drawHUD is called from GameLoop with state; the ecs walk lives
        // in drawEntities. For the HP read we expose a reader through window.ecs
        // (always wired in game.js) but that's a hidden dep. Cleaner: stash the
        // boss row on AreaManager.bossSystem when active. We keep this simple
        // by walking the renderer's last-drawn entity set if available; failing
        // that, render a placeholder bar at max HP so the player still has the
        // visual cue.)
        const am = this.areaManager;
        const ecs = (typeof window !== 'undefined') ? window.ecs : null;
        let hp = 6, maxHp = 6;
        if (ecs) {
            const bosses = ecs.query('boss');
            if (bosses.length) {
                hp    = bosses[0].boss.hp | 0;
                maxHp = bosses[0].boss.maxHp | 0;
            }
        }
        if (maxHp <= 0) return;

        const ctx = this.ctx;
        const pipW = 26, pipH = 12, gap = 4;
        const totalW = maxHp * pipW + (maxHp - 1) * gap;
        const startX = (this.width - totalW) / 2;
        const y      = 56;

        ctx.save();
        ctx.font      = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FFD878';
        ctx.fillText('BRACKEN WARDEN', this.width / 2, y - 4);
        for (let i = 0; i < maxHp; i++) {
            const x = startX + i * (pipW + gap);
            const filled = i < hp;
            ctx.fillStyle = filled ? '#f8d878' : '#3a2e4a';
            ctx.fillRect(x, y, pipW, pipH);
            ctx.strokeStyle = '#3a2e4a';
            ctx.lineWidth   = 1;
            ctx.strokeRect(x, y, pipW, pipH);
        }
        ctx.restore();
        void am;
    }

    /**
     * v0.75 — Area-cleared closure overlay. Fade-out (60f) → hold (300f) with
     * bilingual closure text. Triggered when boss dies + celebrationFrames elapse.
     */
    _drawAreaCleared() {
        const am = this.areaManager;
        if (!am || !am.overlay.active || am.overlay.kind !== 'area_cleared') {
            // Fallback: render a black screen so the player isn't left with the
            // last frame of gameplay if overlay wiring fails.
            const ctx = this.ctx;
            ctx.fillStyle = 'rgba(0,0,0,0.95)';
            ctx.fillRect(0, 0, this.width, this.height);
            return;
        }
        const p = am.overlay.payload;
        const ctx = this.ctx;

        // Fade alpha — first 60 frames count down from total; we want alpha to
        // ramp from 0 to ~0.92 over those 60, then hold.
        const total    = am.overlay.frames;
        const FADE_OUT = 60;
        // overlay.frames started at fadeOutFrames + holdFrames; current value
        // counts DOWN. When total > holdFrames we're in fade_out.
        let alpha = 0.92;
        if (total > 300) {
            // fade-out window
            const t = total - 300;          // 60..1
            alpha = (1 - (t / FADE_OUT)) * 0.92;
        }
        alpha = Math.max(0, Math.min(0.92, alpha));

        ctx.fillStyle = `rgba(10,8,18,${alpha})`;
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.save();
        ctx.globalAlpha = alpha / 0.92;
        ctx.textAlign   = 'center';
        ctx.fillStyle   = '#f8d878';
        ctx.font        = 'bold 28px monospace';
        ctx.fillText('AREA 1 — CLEARED', this.width / 2, this.height / 2 - 36);
        ctx.fillStyle   = '#FFF';
        ctx.font        = '16px monospace';
        if (p) {
            ctx.fillText(p.en, this.width / 2, this.height / 2 + 4);
            ctx.fillText(p.ko, this.width / 2, this.height / 2 + 28);
        }
        ctx.font = '12px monospace';
        ctx.fillStyle = '#aaa';
        ctx.fillText('Press any key', this.width / 2, this.height / 2 + 64);
        ctx.restore();
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

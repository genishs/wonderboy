// owning agent: dev-lead
// TODO: LevelManager — legacy Area 1 loader + Phase 1 single-stage loader +
//       Phase 2 (v0.50) area/round loader. Phase 1/2 modes bypass legacy item/enemy/
//       hazard/goal checks (those run inline in HeroController + CombatSystem +
//       EnemyAI / Phase2EnemyAI / TriggerSystem). Phase 2 delegates the round FSM
//       to StageManager.

import { AREA_DATA } from './LevelData.js';
import { TileMap }   from './TileMap.js';
import { buildPhase1TestMap, PHASE1_STAGE_DATA } from './TestStage.js';
import { initEnemy } from '../mechanics/EnemyAI.js';
import { HERO } from '../config/PhaseOneTunables.js';
import { AreaManager } from './AreaManager.js';

const TILE = 48;
const VIEWPORT_W = 768;

const ITEM_COLORS = {
    apple: '#FF3333', melon: '#33CC33', cherry: '#CC0044',
    skateboard: '#FFD700', axe: '#C0C0C0',
    angel_egg: '#FFFACD', devil_egg: '#CC00FF',
};

export class LevelManager {
    constructor() {
        this.currentLevel  = null;
        this.scrollX       = 0;
        this.playerEntity  = null;
        this._areaIndex    = 1;
        this._isPhase1Test = false;
        this._isPhase2     = false;
        // v0.75 — AreaManager replaces direct stageManager wiring. The
        // `stageManager` getter below returns AreaManager.currentStage so
        // existing renderer reads (`renderer.stageManager.overlay`, etc.)
        // continue to resolve without changes.
        this.areaManager   = null;
    }
    get stageManager() { return this.areaManager ? this.areaManager.currentStage : null; }

    loadLevel(area, ecs, state) {
        this._isPhase1Test = false;
        this._isPhase2     = false;
        const areaData = AREA_DATA[area];
        if (!areaData) throw new Error(`Area ${area} not defined in LevelData.js`);
        this._areaIndex   = area;
        const stageData   = areaData.stages[0];
        this.currentLevel = new TileMap(stageData);
        this.scrollX      = 0;

        if (ecs && state) this._spawnAll(ecs, state);
    }

    /** Phase 1 single-screen test stage. Bypasses scroll, items, hazards, goals. */
    loadPhase1Test(ecs, state) {
        this._isPhase1Test = true;
        this._isPhase2     = false;
        this.currentLevel = buildPhase1TestMap();
        this.scrollX = 0;

        if (ecs && state) this._spawnPhase1(ecs, state);
    }

    /**
     * Phase 2 — start an Area as a single continuous stage. v0.50.1 collapses
     * the 4 rounds into one TileMap, so `round` is no longer used to switch
     * levels.
     *
     * v0.75 — delegates to AreaManager (which owns the multi-stage lifecycle).
     * Signature preserved for back-compat with game.js.
     *
     * @param {object} opts  optional { tileCache, parallax } passed to AreaManager
     */
    loadAreaRound(area, _round, ecs, state, opts = null) {
        this._isPhase2     = true;
        this._isPhase1Test = false;
        this._areaIndex    = area;
        if (!this.areaManager) {
            this.areaManager = new AreaManager(this,
                opts?.tileCache ?? null,
                opts?.parallax  ?? null);
        }
        this.areaManager.startArea(area, ecs, state);
    }

    update(dt, ecs, state) {
        if (!this.currentLevel || !this.playerEntity) return;

        const tf = ecs.getComponent(this.playerEntity, 'transform');
        if (!tf) return;

        // v0.75 — camera lock during boss arena fight. AreaManager sets
        // cameraLocked + cameraLockX when BOSS_TRIGGER fires; cleared on
        // hero death (RESPAWNING handler) or stage swap.
        if (this.areaManager && this.areaManager.cameraLocked) {
            this.scrollX = this.areaManager.cameraLockX;
        } else {
            // Smooth camera: player locked ~1/3 from left.
            const target    = tf.x - Math.floor(VIEWPORT_W / 3);
            const maxScroll = Math.max(0, (this.currentLevel.cols - 16) * TILE);
            this.scrollX    = Math.max(0, Math.min(target, maxScroll));
        }

        // Phase 2: AreaManager.update is driven from the mechanics tick. Skip
        // legacy item/enemy/hazard/goal checks — Phase 2 systems run them.
        if (this._isPhase2) {
            return;
        }

        // Phase 1 owns its own collision/spawn paths.
        if (this._isPhase1Test) return;

        this._checkItems(ecs, state);
        this._checkEnemies(ecs, state);
        this._checkHazards(ecs, state);
        this._checkGoal(ecs, state);
    }

    // ── Spawn (Phase 1) ────────────────────────────────────────────────────
    _spawnPhase1(ecs, state) {
        const lvl = this.currentLevel;

        // Player (Reed) — hitbox 30 x 66, sprite 16x24 @ scale 3
        const player = ecs.createEntity();
        const pw = 30, ph = 66;
        const px = lvl.playerStart.col * TILE + (TILE - pw) / 2;
        const py = lvl.playerStart.row * TILE + TILE - ph;
        ecs.addComponent(player, 'transform',  { x: px, y: py, w: pw, h: ph });
        ecs.addComponent(player, 'velocity',   { vx: 0, vy: 0 });
        ecs.addComponent(player, 'physics',    { onGround: false, onIce: false, jumpHoldLeft: 0 });
        ecs.addComponent(player, 'player',     {
            facingRight: true,
            isJumping: false,
            attackCooldown: 0,
            attackOverlayFrames: 0,
            coyoteTimer: 0,
            jumpBuffer: 0,
            aiState: 'idle',
            // v0.50.2 — ECS extensions present on every player so HeroController
            // can rely on `(pl.X | 0)` reads. Phase 1 path never increments them.
            stumbleFrames: 0,
            stumbleCooldown: 0,
            dyingFrames: 0,
            _phase1: true,
        });
        ecs.addComponent(player, 'sprite', { name: 'hero', anim: 'idle', frame: 0, scale: 3, flip: false, color: '#4a7c3a' });
        this.playerEntity = player;

        // v0.25.2: HP system removed. Vitality (state.hunger) is the single life-line.

        // Enemies
        for (const [col, row, type, dir] of PHASE1_STAGE_DATA.enemies) {
            const d = dir ?? -1;

            let w, h, ax, ay;
            if (type === 'crawlspine') { w = 44; h = 22; }
            else if (type === 'glassmoth') { w = 36; h = 28; }
            else if (type === 'sapling') { w = 28; h = 66; }
            else { w = 36; h = 36; }

            // Place feet/anchor on the row tile-bottom
            ax = col * TILE + (TILE - w) / 2;
            ay = (row + 1) * TILE - h;
            // Glassmoth flies — keep at requested cell (airborne)
            if (type === 'glassmoth') {
                ay = row * TILE; // body around the cell top (will compute baseY later)
            }

            const e = ecs.createEntity();
            ecs.addComponent(e, 'transform', { x: ax, y: ay, w, h });
            ecs.addComponent(e, 'velocity',  { vx: 0, vy: 0 });
            ecs.addComponent(e, 'physics',   { onGround: false, onIce: false, jumpHoldLeft: 0 });
            ecs.addComponent(e, 'enemy',     initEnemy(type, d));

            const spriteName = type;
            ecs.addComponent(e, 'sprite', {
                name: spriteName,
                anim: 'walk',
                frame: 0,
                scale: (type === 'sapling' ? 3 : 2),
                flip: d < 0,
                color: this._enemyColor(type),
            });
        }
    }

    // ── Spawn (Legacy Area 1) ──────────────────────────────────────────────
    _spawnAll(ecs, state) {
        const lvl = this.currentLevel;

        // Player
        const player = ecs.createEntity();
        ecs.addComponent(player, 'transform',  { x: lvl.playerStart.col * TILE, y: lvl.playerStart.row * TILE, w: 36, h: 44 });
        ecs.addComponent(player, 'velocity',   { vx: 0, vy: 0 });
        ecs.addComponent(player, 'physics',    { onGround: false, onIce: false, jumpHoldLeft: 0 });
        ecs.addComponent(player, 'player',     { facingRight: true, isJumping: false });
        ecs.addComponent(player, 'sprite',     { sheet: 'player', frame: 0, color: '#FF8C00' });
        this.playerEntity = player;

        // Items
        for (const [col, row, type] of lvl.items) {
            const item = ecs.createEntity();
            ecs.addComponent(item, 'transform', { x: col * TILE + 12, y: row * TILE + 8, w: 24, h: 28 });
            ecs.addComponent(item, 'item',       { type, collected: false });
            ecs.addComponent(item, 'sprite',     { sheet: 'items', frame: 0, color: ITEM_COLORS[type] ?? '#FFF' });
        }

        // Enemies
        for (const [col, row, type, dir] of lvl.enemies) {
            const d = dir ?? -1;
            const e = ecs.createEntity();
            ecs.addComponent(e, 'transform', { x: col * TILE, y: row * TILE - TILE, w: 36, h: 36 });
            ecs.addComponent(e, 'velocity',  { vx: d * 1.4, vy: 0 });
            ecs.addComponent(e, 'physics',   { onGround: false, onIce: false, jumpHoldLeft: 0 });
            ecs.addComponent(e, 'enemy',     { type, dir: d, ai: type === 'bee' ? 'fly' : 'patrol', hp: 1 });
            ecs.addComponent(e, 'sprite',    { sheet: 'enemies', frame: 0, color: this._enemyColor(type) });
        }
    }

    // ── Collision checks (legacy only) ─────────────────────────────────────
    _checkItems(ecs, state) {
        const ptf = ecs.getComponent(this.playerEntity, 'transform');
        for (const { id, transform: tf, item } of ecs.query('transform', 'item')) {
            if (item.collected || !this._overlaps(ptf, tf)) continue;
            item.collected = true;
            this._collectItem(item.type, state);
            ecs.destroyEntity(id);
        }
    }

    _checkEnemies(ecs, state) {
        const ptf = ecs.getComponent(this.playerEntity, 'transform');
        const pv  = ecs.getComponent(this.playerEntity, 'velocity');

        for (const { id, transform: etf } of ecs.query('transform', 'enemy')) {
            if (!this._overlaps(ptf, etf)) continue;

            // Stomp: player descending, feet above enemy center
            if (pv.vy > 1 && ptf.y + ptf.h < etf.y + etf.h * 0.5) {
                ecs.destroyEntity(id);
                pv.vy = -5;
                state.addScore(100);
            } else {
                state.takeDamage();
            }
        }
    }

    _checkHazards(ecs, state) {
        const ptf = ecs.getComponent(this.playerEntity, 'transform');
        const col = Math.floor((ptf.x + ptf.w / 2) / TILE);
        const row = Math.floor((ptf.y + ptf.h - 4) / TILE);
        const tile = this.currentLevel.getTile(col, row);
        if (tile?.hazard) state.takeDamage();
    }

    _checkGoal(ecs, state) {
        const tf = ecs.getComponent(this.playerEntity, 'transform');
        if (tf.x + tf.w >= this.currentLevel.goalX) {
            state.addScore(1000);
            state.setGameState('STAGE_CLEAR');
        }
    }

    // ── Helpers ────────────────────────────────────────────────────────────
    _collectItem(type, state) {
        const map = {
            apple:      () => { state.restoreHunger(10); state.addScore(100);  },
            melon:      () => { state.restoreHunger(30); state.addScore(500);  },
            cherry:     () => { state.restoreHunger(15); state.addScore(200);  },
            skateboard: () => { state.hasSkateboard = true; state.addScore(300); },
            axe:        () => { state.axeCount = Math.min(state.axeCount + 1, state.maxAxes); },
            angel_egg:  () => { state.restoreHunger(50); state.addScore(1000); },
            devil_egg:  () => { state.takeDamage(); },
        };
        map[type]?.();
    }

    _overlaps(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }

    _enemyColor(type) {
        const m = {
            snail: '#4488FF', bee: '#FFAA00', cobra: '#00CC44', frog: '#33BB33', stone: '#999',
            crawlspine: '#7a5c2e', glassmoth: '#e0c0d8', sapling: '#3a6024',
        };
        return m[type] ?? '#FF0000';
    }
}

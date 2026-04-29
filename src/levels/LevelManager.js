import { AREA_DATA } from './LevelData.js';
import { TileMap }   from './TileMap.js';

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
    }

    loadLevel(area, ecs, state) {
        const areaData = AREA_DATA[area];
        if (!areaData) throw new Error(`Area ${area} not defined in LevelData.js`);
        this._areaIndex   = area;
        const stageData   = areaData.stages[0];
        this.currentLevel = new TileMap(stageData);
        this.scrollX      = 0;

        if (ecs && state) this._spawnAll(ecs, state);
    }

    update(dt, ecs, state) {
        if (!this.currentLevel || !this.playerEntity) return;

        const tf = ecs.getComponent(this.playerEntity, 'transform');
        if (!tf) return;

        // Smooth camera: player locked ~1/3 from left
        const target = tf.x - Math.floor(VIEWPORT_W / 3);
        this.scrollX = Math.max(0, Math.min(target, (this.currentLevel.cols - 16) * TILE));

        this._checkItems(ecs, state);
        this._checkEnemies(ecs, state);
        this._checkHazards(ecs, state);
        this._checkGoal(ecs, state);
    }

    // ── Spawn ──────────────────────────────────────────────────────────────
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

    // ── Collision checks ───────────────────────────────────────────────────
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
        const m = { snail: '#4488FF', bee: '#FFAA00', cobra: '#00CC44', frog: '#33BB33', stone: '#999' };
        return m[type] ?? '#FF0000';
    }
}

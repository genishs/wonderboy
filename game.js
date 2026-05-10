// owning agent: dev-lead
// TODO: top-level wiring — Phase 2 (v0.50) Area 1 default + Phase 1 retro debug.

import { GameLoop }      from './src/core/GameLoop.js';
import { ECS }           from './src/core/ECS.js';
import { StateManager }  from './src/core/StateManager.js';
import { InputHandler }  from './src/core/InputHandler.js';
import { PhysicsEngine } from './src/physics/PhysicsEngine.js';
import { Renderer }      from './src/graphics/Renderer.js';
import { SpriteCache }   from './src/graphics/SpriteCache.js';
import { TileCache }     from './src/graphics/TileCache.js';
import { ParallaxBackground } from './src/graphics/ParallaxBackground.js';
import { LevelManager }  from './src/levels/LevelManager.js';
import { GameMechanics } from './src/mechanics/GameMechanics.js';
import { AudioManager }  from './src/audio/AudioManager.js';

import { HeroController }    from './src/mechanics/HeroController.js';
import { StoneflakeSystem }  from './src/mechanics/StoneflakeSystem.js';
import { SeeddartSystem }    from './src/mechanics/SeeddartSystem.js';
import { EnemyAI }           from './src/mechanics/EnemyAI.js';
import { CombatSystem }      from './src/mechanics/CombatSystem.js';
import { HatchetSystem }     from './src/mechanics/HatchetSystem.js';
import { HuskSystem }        from './src/mechanics/HuskSystem.js';
import { Phase2EnemyAI }     from './src/mechanics/Phase2EnemyAI.js';
import { TriggerSystem }     from './src/mechanics/TriggerSystem.js';

// Phase 1 sprite modules (kept loaded for retro debug entry)
import * as heroReedModule       from './assets/sprites/hero-reed.js';
import * as crawlspineModule     from './assets/sprites/enemy-crawlspine.js';
import * as glassmothModule      from './assets/sprites/enemy-glassmoth.js';
import * as saplingModule        from './assets/sprites/enemy-bristlecone-sapling.js';
import * as stoneflakeModule     from './assets/sprites/projectile-stoneflake.js';

// Phase 2 sprite + tile modules
import * as mossplodderModule    from './assets/sprites/enemy-mossplodder.js';
import * as hummerwingModule     from './assets/sprites/enemy-hummerwing.js';
import * as dawnHuskModule       from './assets/sprites/item-dawn-husk.js';
import * as hatchetModule        from './assets/sprites/projectile-stone-hatchet.js';
import * as area1TilesModule     from './assets/tiles/area1.js';

const CANVAS_W = 768;
const CANVAS_H = 576;

const canvas = document.getElementById('gameCanvas');

function resizeCanvas() {
    const sx = window.innerWidth  / CANVAS_W;
    const sy = window.innerHeight / CANVAS_H;
    const scale = Math.min(sx, sy);
    canvas.width  = CANVAS_W;
    canvas.height = CANVAS_H;
    canvas.style.width  = `${CANVAS_W * scale}px`;
    canvas.style.height = `${CANVAS_H * scale}px`;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

// ── Instantiate all subsystems ──────────────────────────────────────────────
const ecs          = new ECS();
const state        = new StateManager();
const input        = new InputHandler();
const physics      = new PhysicsEngine();
const renderer     = new Renderer(ctx, CANVAS_W, CANVAS_H);
const spriteCache  = new SpriteCache();
const tileCache    = new TileCache();
const parallax     = new ParallaxBackground(CANVAS_W, CANVAS_H, 'forest');
const levelManager = new LevelManager();
const mechanics    = new GameMechanics(state, renderer);
const audio        = new AudioManager();

// Phase 1 systems
const heroController   = new HeroController();
const stoneflakeSystem = new StoneflakeSystem();
const seeddartSystem   = new SeeddartSystem();
const enemyAI          = new EnemyAI();
const combat           = new CombatSystem();

// Phase 2 systems
const hatchetSystem    = new HatchetSystem();
const huskSystem       = new HuskSystem(hatchetSystem);
const phase2EnemyAI    = new Phase2EnemyAI();
const triggerSystem    = new TriggerSystem();

// Wire renderer references
renderer.tileCache    = tileCache;
renderer.parallax     = parallax;

// Patch GameMechanics.update to drive Phase 1 / Phase 2 paths via the existing GameLoop.
const _origMechanicsUpdate = mechanics.update.bind(mechanics);
mechanics.update = (dt, ecsArg, stateArg, inputArg) => {

    // ── Phase 2 (v0.50) ────────────────────────────────────────────────
    if (levelManager._isPhase2) {
        // Pause toggle still useful
        if (inputArg.pause) {
            if (stateArg.gameState === 'PLAYING') stateArg.setGameState('PAUSED');
            else if (stateArg.gameState === 'PAUSED') stateArg.setGameState('PLAYING');
        }
        if (stateArg.gameState === 'PAUSED') return;

        // Drive Phase 2 systems. HeroController honors the TRANSITIONING /
        // STAGE_CLEAR guard internally.
        heroController.update(ecsArg, levelManager.currentLevel, inputArg, stateArg, null, hatchetSystem);
        hatchetSystem.update(ecsArg, levelManager.currentLevel, stateArg, levelManager.playerEntity);
        huskSystem.update(ecsArg, stateArg, levelManager.playerEntity);
        phase2EnemyAI.update(ecsArg, levelManager.currentLevel);
        // Phase 1 EnemyAI is a no-op for Phase 2 enemy types; safe to call.
        enemyAI.update(ecsArg, levelManager.currentLevel, levelManager.playerEntity, seeddartSystem);
        combat.update(ecsArg, stateArg, levelManager.currentLevel);
        triggerSystem.update(ecsArg, levelManager, stateArg);
        // Vitality tick (state heartbeat). Note: state.update only ticks during PLAYING,
        // so it's automatically frozen during TRANSITIONING / STAGE_CLEAR.
        stateArg.update(dt);
        return;
    }

    // ── Phase 1 (retro debug entry; unchanged) ─────────────────────────
    if (levelManager._isPhase1Test) {
        if (inputArg.pause) {
            if (stateArg.gameState === 'PLAYING') stateArg.setGameState('PAUSED');
            else if (stateArg.gameState === 'PAUSED') stateArg.setGameState('PLAYING');
        }
        if (stateArg.gameState === 'PAUSED') return;

        heroController.update(ecsArg, levelManager.currentLevel, inputArg, stateArg, stoneflakeSystem);
        stoneflakeSystem.update(ecsArg, levelManager.currentLevel);
        seeddartSystem.update(ecsArg, levelManager.currentLevel);
        enemyAI.update(ecsArg, levelManager.currentLevel, levelManager.playerEntity, seeddartSystem);
        combat.update(ecsArg, stateArg);
        stateArg.update(dt);
        return;
    }

    // ── Legacy ─────────────────────────────────────────────────────────
    _origMechanicsUpdate(dt, ecsArg, stateArg, inputArg);
};

const gameLoop = new GameLoop({ ecs, state, input, physics, renderer, levelManager, mechanics, audio });

// ── Init ────────────────────────────────────────────────────────────────────
let _initFired = false;
async function init() {
    if (_initFired) return;
    _initFired = true;
    document.removeEventListener('click',      init);
    document.removeEventListener('keydown',    init);
    document.removeEventListener('touchstart', init);

    await audio.init();

    // Sprite cache — Phase 1 + Phase 2 modules
    await spriteCache.load('hero',        heroReedModule);
    await spriteCache.load('crawlspine',  crawlspineModule);
    await spriteCache.load('glassmoth',   glassmothModule);
    await spriteCache.load('sapling',     saplingModule);
    await spriteCache.load('stoneflake',  stoneflakeModule);
    await spriteCache.load('mossplodder', mossplodderModule);
    await spriteCache.load('hummerwing',  hummerwingModule);
    await spriteCache.load('dawn-husk',   dawnHuskModule);
    await spriteCache.load('hatchet',     hatchetModule);
    renderer.spriteCache = spriteCache;

    // Tile cache + parallax (Phase 2)
    await tileCache.loadArea(area1TilesModule);
    await parallax.loadArea(1);

    // Phase 2 entry: Area 1 Round 1
    levelManager.loadAreaRound(1, 1, ecs, state);
    renderer.stageManager = levelManager.stageManager;

    gameLoop.start();
}
document.addEventListener('click',      init, { once: true });
document.addEventListener('keydown',    init, { once: true });
document.addEventListener('touchstart', init, { once: true });

renderer.drawTitle();

// Expose key internals for retro debug + manual smoke poking.
window.ecs          = ecs;
window.state        = state;
window.lm           = levelManager;
window.gameLoop     = gameLoop;
window.renderer     = renderer;

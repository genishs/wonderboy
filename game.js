// owning agent: dev-lead
// TODO: top-level wiring — Phase 1 hero + 3 enemies + sprite cache on test stage.

import { GameLoop }      from './src/core/GameLoop.js';
import { ECS }           from './src/core/ECS.js';
import { StateManager }  from './src/core/StateManager.js';
import { InputHandler }  from './src/core/InputHandler.js';
import { PhysicsEngine } from './src/physics/PhysicsEngine.js';
import { Renderer }      from './src/graphics/Renderer.js';
import { SpriteCache }   from './src/graphics/SpriteCache.js';
import { LevelManager }  from './src/levels/LevelManager.js';
import { GameMechanics } from './src/mechanics/GameMechanics.js';
import { AudioManager }  from './src/audio/AudioManager.js';

import { HeroController }    from './src/mechanics/HeroController.js';
import { StoneflakeSystem }  from './src/mechanics/StoneflakeSystem.js';
import { SeeddartSystem }    from './src/mechanics/SeeddartSystem.js';
import { EnemyAI }           from './src/mechanics/EnemyAI.js';
import { CombatSystem }      from './src/mechanics/CombatSystem.js';

import * as heroReedModule       from './assets/sprites/hero-reed.js';
import * as crawlspineModule     from './assets/sprites/enemy-crawlspine.js';
import * as glassmothModule      from './assets/sprites/enemy-glassmoth.js';
import * as saplingModule        from './assets/sprites/enemy-bristlecone-sapling.js';
import * as stoneflakeModule     from './assets/sprites/projectile-stoneflake.js';

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
const levelManager = new LevelManager();
const mechanics    = new GameMechanics(state, renderer);
const audio        = new AudioManager();

// Phase 1 systems
const heroController   = new HeroController();
const stoneflakeSystem = new StoneflakeSystem();
const seeddartSystem   = new SeeddartSystem();
const enemyAI          = new EnemyAI();
const combat           = new CombatSystem();

// Patch GameMechanics.update to also drive Phase 1 systems via the existing GameLoop.
// (We don't modify GameLoop or GameMechanics class signatures; we wrap.)
const _origMechanicsUpdate = mechanics.update.bind(mechanics);
mechanics.update = (dt, ecsArg, stateArg, inputArg) => {
    // Phase 1 hero owns its own movement; legacy axe-throw should NOT trigger when in Phase 1.
    if (levelManager._isPhase1Test) {
        // Pause toggle still useful
        if (inputArg.pause) {
            if (stateArg.gameState === 'PLAYING') stateArg.setGameState('PAUSED');
            else if (stateArg.gameState === 'PAUSED') stateArg.setGameState('PLAYING');
        }
        // GameLoop now calls mechanics.update even while PAUSED so the toggle
        // above can fire. After handling that, short-circuit so the rest of the
        // Phase 1 systems (hero, projectiles, AI, combat, state heartbeat) freeze.
        if (stateArg.gameState === 'PAUSED') return;

        // Drive hero, projectiles, AI, combat
        heroController.update(ecsArg, levelManager.currentLevel, inputArg, stateArg, stoneflakeSystem);
        stoneflakeSystem.update(ecsArg, levelManager.currentLevel);
        seeddartSystem.update(ecsArg, levelManager.currentLevel);
        enemyAI.update(ecsArg, levelManager.currentLevel, levelManager.playerEntity, seeddartSystem);
        combat.update(ecsArg, stateArg);
        // Keep state.update() heartbeat for invincibleTimer + (legacy) hunger decay
        stateArg.update(dt);
        return;
    }
    _origMechanicsUpdate(dt, ecsArg, stateArg, inputArg);
};

const gameLoop = new GameLoop({ ecs, state, input, physics, renderer, levelManager, mechanics, audio });

// ── Init ────────────────────────────────────────────────────────────────────
async function init() {
    await audio.init();

    // Build sprite cache from Design's modules
    await spriteCache.load('hero',       heroReedModule);
    await spriteCache.load('crawlspine', crawlspineModule);
    await spriteCache.load('glassmoth',  glassmothModule);
    await spriteCache.load('sapling',    saplingModule);
    await spriteCache.load('stoneflake', stoneflakeModule);
    renderer.spriteCache = spriteCache;

    // Phase 1 stage
    levelManager.loadPhase1Test(ecs, state);
    gameLoop.start();
}
document.addEventListener('click',      init, { once: true });
document.addEventListener('keydown',    init, { once: true });
document.addEventListener('touchstart', init, { once: true });

renderer.drawTitle();

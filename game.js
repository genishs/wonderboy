// owning agent: dev-lead
// TODO: top-level wiring — Phase 3 (v0.75) Area 1 (4 stages + Bracken Warden
// boss) default + Phase 2 fall-through + Phase 1 retro debug.

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
// v0.75 — new systems
import { BossSystem }            from './src/mechanics/BossSystem.js';
import { StageTransitionSystem } from './src/mechanics/StageTransitionSystem.js';
// v0.75.1 — fruit pickup collection.
import { ItemSystem }            from './src/mechanics/ItemSystem.js';

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

// v0.75 — Phase 3 sprite + tile modules (Stage 2-4 + boss + projectile)
import * as bossBrackenModule    from './assets/sprites/boss-bracken-warden.js';
import * as mossPulseModule      from './assets/sprites/projectile-moss-pulse.js';
import * as area1Stage2TilesModule from './assets/tiles/area1-stage2-shore.js';
import * as area1Stage3TilesModule from './assets/tiles/area1-stage3-cave.js';
import * as area1Stage4TilesModule from './assets/tiles/area1-stage4-darkforest.js';

// v0.75.1 — fruit pickups + Threadshade enemy + shell-fragment particle.
import * as dewplumModule        from './assets/sprites/item-dewplum.js';
import * as amberfigModule       from './assets/sprites/item-amberfig.js';
import * as threadshadeModule    from './assets/sprites/enemy-threadshade.js';
import * as huskShellModule      from './assets/sprites/item-husk-shell.js';

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

// v0.75 — Phase 3 systems
const stageTransitionSystem = new StageTransitionSystem();
const bossSystem            = new BossSystem();

// v0.75.1 — fruit pickup system (dewplum / amberfig vitality restore).
const itemSystem            = new ItemSystem();

// Wire renderer references
renderer.tileCache    = tileCache;
renderer.parallax     = parallax;

// Patch GameMechanics.update to drive Phase 1 / Phase 2 paths via the existing GameLoop.
const _origMechanicsUpdate = mechanics.update.bind(mechanics);
mechanics.update = (dt, ecsArg, stateArg, inputArg) => {

    // ── Phase 2 / Phase 3 (v0.50 / v0.75) ──────────────────────────────
    if (levelManager._isPhase2) {
        // Pause toggle still useful
        if (inputArg.pause) {
            if (stateArg.gameState === 'PLAYING') stateArg.setGameState('PAUSED');
            else if (stateArg.gameState === 'PAUSED') stateArg.setGameState('PLAYING');
        }
        if (stateArg.gameState === 'PAUSED') return;

        // v0.75 — AreaManager observes RESPAWNING + _areaRestartPending and
        // routes a Continue into a full Stage-1 reset. Run FIRST so the same
        // tick can pick up the new stage's state.
        levelManager.areaManager?.update(dt, ecsArg, stateArg);

        // v0.75 — stage transition state machine. Reads AreaManager.transition;
        // advances phases. Runs BEFORE HeroController so the transition gate
        // sets gameState before the hero's input-lock check.
        stageTransitionSystem.update(ecsArg, levelManager, stateArg);

        // Skip combat + AI during respawn / stage-clear / game-over /
        // stage-transition / area-cleared / boss-fight-with-no-fight-yet.
        const respawnLock = (stateArg.gameState === 'RESPAWNING'
                          || stateArg.gameState === 'STAGE_CLEAR'
                          || stateArg.gameState === 'GAME_OVER'
                          || stateArg.gameState === 'STAGE_TRANSITION'
                          || stateArg.gameState === 'AREA_CLEARED');

        heroController.update(ecsArg, levelManager.currentLevel, inputArg, stateArg, null, hatchetSystem);
        if (!respawnLock) {
            hatchetSystem.update(ecsArg, levelManager.currentLevel, stateArg, levelManager.playerEntity);
            huskSystem.update(ecsArg, stateArg, levelManager.playerEntity);
            // v0.75.1 — fruit pickup overlap check. Runs AFTER HuskSystem so a
            // husk → hatchet spawn this frame still gets its hero-overlap pass
            // via HatchetSystem next frame; fruits are independent entities so
            // there's no ordering hazard.
            itemSystem.update(ecsArg, stateArg, levelManager.playerEntity);
            phase2EnemyAI.update(ecsArg, levelManager.currentLevel);
            enemyAI.update(ecsArg, levelManager.currentLevel, levelManager.playerEntity, seeddartSystem);
            // v0.75 — TriggerSystem AFTER AI but BEFORE BossSystem so a
            // same-frame BOSS_TRIGGER crossing fires the boss spawn in the
            // same tick. Pass bossSystem so boss_trigger has a handler.
            triggerSystem.update(ecsArg, levelManager, stateArg, bossSystem);
            // v0.75 — BossSystem: spawn / FSM tick / moss-pulse tick. Runs
            // BEFORE CombatSystem so same-frame collisions resolve cleanly.
            bossSystem.update(ecsArg, levelManager.currentLevel, stateArg, levelManager.areaManager);
            combat.update(ecsArg, stateArg, levelManager.currentLevel);
        }

        // Camera tick still runs even during respawn/transition so the
        // viewport follows the (possibly re-positioned) hero on the very
        // next frame.
        levelManager.update(dt, ecsArg, stateArg);

        // Vitality tick (state heartbeat). state.update only ticks during PLAYING,
        // so it's automatically frozen during TRANSITIONING / STAGE_CLEAR / RESPAWNING.
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

    // Sprite cache — Phase 1 + Phase 2 + Phase 3 modules
    await spriteCache.load('hero',            heroReedModule);
    await spriteCache.load('crawlspine',      crawlspineModule);
    await spriteCache.load('glassmoth',       glassmothModule);
    await spriteCache.load('sapling',         saplingModule);
    await spriteCache.load('stoneflake',      stoneflakeModule);
    await spriteCache.load('mossplodder',     mossplodderModule);
    await spriteCache.load('hummerwing',      hummerwingModule);
    await spriteCache.load('dawn-husk',       dawnHuskModule);
    await spriteCache.load('hatchet',         hatchetModule);
    // v0.75 boss + projectile
    await spriteCache.load('bracken-warden',  bossBrackenModule);
    await spriteCache.load('moss-pulse',      mossPulseModule);
    // v0.75.1 — fruit + spider + shell-fragment sprites.
    await spriteCache.load('dewplum',         dewplumModule);
    await spriteCache.load('amberfig',        amberfigModule);
    await spriteCache.load('threadshade',     threadshadeModule);
    await spriteCache.load('husk-shell',      huskShellModule);
    renderer.spriteCache = spriteCache;

    // Tile cache — load all 4 tilesets up front, then activate stage 1.
    await tileCache.loadStageSet(1, area1TilesModule);
    await tileCache.loadStageSet(2, area1Stage2TilesModule);
    await tileCache.loadStageSet(3, area1Stage3TilesModule);
    await tileCache.loadStageSet(4, area1Stage4TilesModule);
    tileCache.setActiveStage(1);
    await parallax.loadArea(1);

    // Phase 3 entry: Area 1, starting at Stage 1.
    levelManager.loadAreaRound(1, 1, ecs, state, { tileCache, parallax });
    // Wire renderer back-pointers (stageManager getter on LevelManager returns
    // AreaManager.currentStage — old reads keep working).
    renderer.stageManager = levelManager.stageManager;
    renderer.areaManager  = levelManager.areaManager;
    // Wire BossSystem into AreaManager so stage swaps can call resetForStageLoad.
    if (levelManager.areaManager) levelManager.areaManager.bossSystem = bossSystem;

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
window.bossSystem   = bossSystem;
window.tileCache    = tileCache;

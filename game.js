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

// v1.0 — Area 2 sprite + tile modules (the Cinder Reach).
import * as cinderwispModule     from './assets/sprites/enemy-cinderwisp.js';
import * as quarrywightModule    from './assets/sprites/enemy-quarrywight.js';
import * as skyhookModule        from './assets/sprites/enemy-skyhook.js';
import * as bossReignwardenModule from './assets/sprites/boss-reignwarden.js';
import * as cinderModule         from './assets/sprites/projectile-cinder.js';
import * as sunpearModule        from './assets/sprites/item-sunpear.js';
import * as flintchipModule      from './assets/sprites/item-flintchip.js';
import * as area2Stage1TilesModule from './assets/tiles/area2-stage1-switchback.js';
import * as area2Stage2TilesModule from './assets/tiles/area2-stage2-beaconwalk.js';
import * as area2Stage3TilesModule from './assets/tiles/area2-stage3-knifing.js';
import * as area2Stage4TilesModule from './assets/tiles/area2-stage4-reignward.js';

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
        // stage-transition / area-cleared / credits.
        const respawnLock = (stateArg.gameState === 'RESPAWNING'
                          || stateArg.gameState === 'STAGE_CLEAR'
                          || stateArg.gameState === 'GAME_OVER'
                          || stateArg.gameState === 'STAGE_TRANSITION'
                          || stateArg.gameState === 'AREA_CLEARED'
                          || stateArg.gameState === 'CREDITS'
                          || stateArg.gameState === 'TITLE');

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
//
// v1.0 — two-phase init. First user-gesture (click / key / touchstart) unlocks
// AudioContext and starts the `title` BGM (no gameplay yet — Renderer.drawTitle
// is still on screen). Second user-input dismisses the title and starts the
// game proper (loading sprites + tiles + bgs, then gameLoop.start()).
let _audioReady   = false;
let _gameLaunched = false;

async function _firstGesture() {
    if (_audioReady) return;
    _audioReady = true;
    try {
        await audio.init();
        audio.playBGM('title');
    } catch (_e) { /* AudioContext failed; the game still runs silently */ }
}

async function _launchGame() {
    if (_gameLaunched) return;
    _gameLaunched = true;
    document.removeEventListener('click',      _onUserInput);
    document.removeEventListener('keydown',    _onUserInput);
    document.removeEventListener('touchstart', _onUserInput);
    // Title-confirm SFX before BGM swap (so the title chime is still audible
    // over the title track during the brief overlap).
    audio.playSFX('title_confirm');
    audio.playBGM('area1');
    await init();
}

function _onUserInput(_ev) {
    if (!_audioReady) {
        // First gesture: unlock audio + start title BGM. The second gesture
        // (next click / keypress) starts the game.
        _firstGesture();
        return;
    }
    if (!_gameLaunched) _launchGame();
}

async function init() {
    document.removeEventListener('click',      _onUserInput);
    document.removeEventListener('keydown',    _onUserInput);
    document.removeEventListener('touchstart', _onUserInput);

    if (!audio.initialized) await audio.init();

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
    // v1.0 — Area 2 sprites (Cinder Reach cast + boss + projectile + 2 pickups).
    await spriteCache.load('cinderwisp',      cinderwispModule);
    await spriteCache.load('quarrywight',     quarrywightModule);
    await spriteCache.load('skyhook',         skyhookModule);
    await spriteCache.load('reignwarden',     bossReignwardenModule);
    await spriteCache.load('cinder',          cinderModule);
    await spriteCache.load('sunpear',         sunpearModule);
    await spriteCache.load('flintchip',       flintchipModule);
    renderer.spriteCache = spriteCache;

    // Tile cache — load all 4 Area 1 tilesets up front.
    await tileCache.loadStageSet(1, area1TilesModule, 1);
    await tileCache.loadStageSet(2, area1Stage2TilesModule, 1);
    await tileCache.loadStageSet(3, area1Stage3TilesModule, 1);
    await tileCache.loadStageSet(4, area1Stage4TilesModule, 1);
    // v1.0 — Area 2 tile modules (the Cinder Reach: switchback / beacon walk /
    // knifing / reignward). All four registered up-front so stage transitions
    // can swap them via TileCache.setActiveStage(stage, area).
    await tileCache.loadStageSet(1, area2Stage1TilesModule, 2);
    await tileCache.loadStageSet(2, area2Stage2TilesModule, 2);
    await tileCache.loadStageSet(3, area2Stage3TilesModule, 2);
    await tileCache.loadStageSet(4, area2Stage4TilesModule, 2);
    tileCache.setActiveStage(1, 1);
    await parallax.loadArea(1);
    // v1.0 — Area 2 parallax (silently tolerant of missing files).
    try {
        await parallax.loadArea2();
    } catch (e) {
        console.error('[game] parallax.loadArea2 failed:', e);
    }

    // Phase 3 entry: Area 1, starting at Stage 1.
    levelManager.loadAreaRound(1, 1, ecs, state, { tileCache, parallax });
    // Wire renderer back-pointers (stageManager getter on LevelManager returns
    // AreaManager.currentStage — old reads keep working).
    renderer.stageManager = levelManager.stageManager;
    renderer.areaManager  = levelManager.areaManager;
    // Wire BossSystem into AreaManager so stage swaps can call resetForStageLoad.
    if (levelManager.areaManager) levelManager.areaManager.bossSystem = bossSystem;

    // v1.0 — set state to PLAYING here (formerly done in GameLoop.start). The
    // state listener below drives BGM switches per state-change.
    state.setGameState('PLAYING');
    gameLoop.start();
}

// v1.0 — state-driven BGM dispatcher. Bridges StateManager state changes to
// AudioManager.playBGM. Mapping per docs/briefs/phase4-audio.md §4.1.
//   PLAYING        → area1 (Area 1) or area2 (Area 2)
//   BOSS_FIGHT     → boss-fight
//   GAME_OVER      → game-over (one-shot)
//   AREA_CLEARED   → area-cleared (one-shot stinger; main BGM continues
//                    underneath, so we don't switch the main loop here;
//                    instead BossSystem fires boss_defeat and AreaManager
//                    fires area_cleared SFX/stinger directly).
state.on('stateChange', ({ next }) => {
    if (!audio.initialized) return;
    if (next === 'PLAYING' || next === 'STAGE_TRANSITION') {
        const areaIdx = levelManager.areaManager?.areaIndex || 1;
        const bgm = (areaIdx === 2) ? 'area2' : 'area1';
        audio.playBGM(bgm);
    } else if (next === 'BOSS_FIGHT') {
        audio.playBGM('boss-fight');
    } else if (next === 'GAME_OVER') {
        audio.playBGM('game-over');
    } else if (next === 'TITLE' || next === 'CREDITS') {
        // CREDITS uses the title BGM (warm and welcoming closes the run);
        // an explicit dismiss back to TITLE keeps the same track.
        audio.playBGM('title');
    }
    // RESPAWNING / AREA_CLEARED / PAUSED / STAGE_CLEAR don't switch main BGM
    // — they leave the current track playing.
});

document.addEventListener('click',      _onUserInput);
document.addEventListener('keydown',    _onUserInput);
document.addEventListener('touchstart', _onUserInput);

renderer.drawTitle();

// Expose key internals for retro debug + manual smoke poking.
window.ecs          = ecs;
window.state        = state;
window.lm           = levelManager;
window.gameLoop     = gameLoop;
window.renderer     = renderer;
window.bossSystem   = bossSystem;
window.tileCache    = tileCache;
// v1.0 — audio is a singleton accessed from gameplay systems via window.audio.
// Cleaner than threading the ref through every System.update() signature for a
// per-event side-effect; matches the existing pattern for `window.ecs` etc.
window.audio        = audio;

import { GameLoop }      from './src/core/GameLoop.js';
import { ECS }           from './src/core/ECS.js';
import { StateManager }  from './src/core/StateManager.js';
import { InputHandler }  from './src/core/InputHandler.js';
import { PhysicsEngine } from './src/physics/PhysicsEngine.js';
import { Renderer }      from './src/graphics/Renderer.js';
import { LevelManager }  from './src/levels/LevelManager.js';
import { GameMechanics } from './src/mechanics/GameMechanics.js';
import { AudioManager }  from './src/audio/AudioManager.js';

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
const levelManager = new LevelManager();
const mechanics    = new GameMechanics(state, renderer);
const audio        = new AudioManager();

const gameLoop = new GameLoop({ ecs, state, input, physics, renderer, levelManager, mechanics, audio });

// Web Audio API requires user gesture before init
async function init() {
    await audio.init();
    levelManager.loadLevel(1, ecs, state);
    gameLoop.start();
}
document.addEventListener('click',    init, { once: true });
document.addEventListener('keydown',  init, { once: true });
document.addEventListener('touchstart', init, { once: true });

renderer.drawTitle();

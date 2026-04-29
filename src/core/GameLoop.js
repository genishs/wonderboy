const TARGET_FPS  = 60;
const FRAME_MS    = 1000 / TARGET_FPS;

export class GameLoop {
    constructor(systems) {
        this.systems  = systems;
        this.running  = false;
        this.lastTime = 0;
        this.accum    = 0;
    }

    start() {
        this.running  = true;
        this.lastTime = performance.now();
        this.systems.state.setGameState('PLAYING');
        this.systems.audio.playBGM('area1');
        requestAnimationFrame(ts => this._tick(ts));
    }

    _tick(ts) {
        if (!this.running) return;

        const delta = Math.min(ts - this.lastTime, 50); // clamp to avoid spiral of death
        this.lastTime = ts;
        this.accum   += delta;

        while (this.accum >= FRAME_MS) {
            this._update(FRAME_MS / 1000);
            this.accum -= FRAME_MS;
        }

        this._render();
        requestAnimationFrame(ts2 => this._tick(ts2));
    }

    _update(dt) {
        const { ecs, state, input, physics, levelManager, mechanics, audio } = this.systems;
        if (state.gameState === 'PAUSED') return;

        input.update();
        mechanics.update(dt, ecs, state, input);
        physics.update(dt, ecs, state, levelManager.currentLevel, input);
        levelManager.update(dt, ecs, state);
        audio.update(dt, state);
    }

    _render() {
        const { renderer, ecs, state, levelManager } = this.systems;
        renderer.clear();
        renderer.drawBackground(levelManager.scrollX);
        renderer.drawTiles(levelManager.currentLevel, levelManager.scrollX);
        renderer.drawEntities(ecs, levelManager.scrollX);
        renderer.drawHUD(state);
    }

    pause()  { this.systems.state.setGameState('PAUSED');  }
    resume() { this.systems.state.setGameState('PLAYING'); }
    stop()   { this.running = false; }
}

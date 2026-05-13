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
        const { ecs, state, input, physics, levelManager, mechanics, audio, renderer } = this.systems;

        // mechanics.update owns the pause toggle (in the Phase 1 wrapper) so it must
        // run even when state is PAUSED — otherwise we can pause but never unpause.
        mechanics.update(dt, ecs, state, input);

        if (state.gameState !== 'PAUSED') {
            physics.update(dt, ecs, state, levelManager.currentLevel, input);
            levelManager.update(dt, ecs, state);
            audio.update(dt, state);
            if (renderer && typeof renderer.tick === 'function') renderer.tick();
        }

        // Edge detection requires _prev to reflect the PREVIOUS fixed-step frame.
        // Calling update() at the END leaves _prev populated correctly for the next
        // frame — including paused frames so isPressed/isReleased stay correct.
        input.update();
    }

    _render() {
        const { renderer, ecs, state, levelManager, input } = this.systems;
        renderer.clear();
        renderer.drawBackground(levelManager.scrollX);
        renderer.drawTiles(levelManager.currentLevel, levelManager.scrollX);
        renderer.drawEntities(ecs, levelManager.scrollX);
        renderer.drawHUD(state);
        // v0.75.1 — visible on-screen touch buttons. Drawn LAST so they sit on
        // top of HUD chrome and stay tappable even when overlays (PAUSED,
        // STAGE_TRANSITION, AREA_CLEARED) dim the playfield underneath.
        renderer.drawTouchControls(input);
    }

    pause()  { this.systems.state.setGameState('PAUSED');  }
    resume() { this.systems.state.setGameState('PLAYING'); }
    stop()   { this.running = false; }
}

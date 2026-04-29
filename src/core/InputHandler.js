export class InputHandler {
    constructor() {
        this._keys = {};
        this._prev = {};

        window.addEventListener('keydown', e => { this._keys[e.code] = true;  e.preventDefault(); });
        window.addEventListener('keyup',   e => { this._keys[e.code] = false; });

        this._setupTouch();
    }

    update() {
        this._prev = { ...this._keys };
    }

    // ── Raw key queries ────────────────────────────────────────────────────
    isDown(code)     { return !!this._keys[code]; }
    isPressed(code)  { return !!this._keys[code] && !this._prev[code]; }
    isReleased(code) { return !this._keys[code]  &&  !!this._prev[code]; }

    // ── Logical actions ────────────────────────────────────────────────────
    get left()         { return this.isDown('ArrowLeft')  || this.isDown('KeyA'); }
    get right()        { return this.isDown('ArrowRight') || this.isDown('KeyD'); }
    get jump()         { return this.isDown('ArrowUp')    || this.isDown('KeyW') || this.isDown('Space'); }
    get jumpPressed()  { return this.isPressed('ArrowUp') || this.isPressed('KeyW') || this.isPressed('Space'); }
    get jumpReleased() { return this.isReleased('ArrowUp')|| this.isReleased('KeyW')|| this.isReleased('Space'); }
    get attack()       { return this.isPressed('KeyX')    || this.isPressed('ControlLeft'); }
    get pause()        { return this.isPressed('Escape')  || this.isPressed('KeyP'); }

    // ── Mobile virtual D-pad (Agent 3 — Graphics Director — implements UI) ─
    _setupTouch() {
        // Touch zone layout (portrait):
        //   Left  30% width → left
        //   Right 30% width → right/attack
        //   Bottom-right corner → jump
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;

        canvas.addEventListener('touchstart', e => {
            for (const t of e.changedTouches) {
                const rect  = canvas.getBoundingClientRect();
                const rx    = (t.clientX - rect.left)  / rect.width;
                const ry    = (t.clientY - rect.top)   / rect.height;
                if (rx < 0.3)               this._keys['ArrowLeft']  = true;
                else if (rx > 0.7 && ry > 0.6) this._keys['Space']   = true;
                else if (rx > 0.7)          this._keys['KeyX']        = true;
            }
        }, { passive: true });

        canvas.addEventListener('touchend', e => {
            for (const t of e.changedTouches) {
                const rect  = canvas.getBoundingClientRect();
                const rx    = (t.clientX - rect.left)  / rect.width;
                const ry    = (t.clientY - rect.top)   / rect.height;
                if (rx < 0.3)               this._keys['ArrowLeft']  = false;
                else if (rx > 0.7 && ry > 0.6) this._keys['Space']   = false;
                else if (rx > 0.7)          this._keys['KeyX']        = false;
            }
        }, { passive: true });
    }
}

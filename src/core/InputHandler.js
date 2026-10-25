// owning agent: dev-lead
// TODO: InputHandler — keyboard edge-detection + v0.75.1 visible on-screen
//   touch buttons (←/→/Z/X) for mobile.

/**
 * v0.75.1 — visible on-screen touch button table.
 *
 * Coordinates are in CANVAS-LOGICAL space (768 × 576). Renderer.drawTouchControls
 * reads the same table to draw the overlay so the hitbox and the visible button
 * stay in lock-step.
 *
 * `key` is the keyboard code the button presses into `_keys` while a touch sits
 * on it. Re-using the same `_keys` map means HeroController / sprintHeld /
 * jumpPressed / etc. all work via the existing edge-detection path without
 * changing a single line of consumer code.
 */
const BUTTONS = Object.freeze([
    { id: 'left',   key: 'ArrowLeft',  x:  20, y: 460, w: 80, h: 80, label: '←' },
    { id: 'right',  key: 'ArrowRight', x: 120, y: 460, w: 80, h: 80, label: '→' },
    { id: 'jump',   key: 'KeyZ',       x: 568, y: 460, w: 80, h: 80, label: 'Z'      },
    { id: 'attack', key: 'KeyX',       x: 668, y: 460, w: 80, h: 80, label: 'X'      },
]);

export class InputHandler {
    constructor() {
        this._keys = {};
        this._prev = {};

        window.addEventListener('keydown', e => { this._keys[e.code] = true;  e.preventDefault(); });
        window.addEventListener('keyup',   e => { this._keys[e.code] = false; });

        // Per-touch button assignment. Map<touchIdentifier, button>. Lets a
        // finger SLIDE off a button (releases that key) or onto another (presses
        // the new one) while other fingers keep their own assignments.
        this._touchButtons = new Map();
        this._canvas = null;
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
    // Phase 1 (v0.25.2+) keymap:
    //   Move   : ArrowLeft / ArrowRight (or KeyA / KeyD)
    //   Jump   : KeyZ  (Space kept as accessibility alt)
    //   Attack : KeyX
    //   Pause  : Escape / KeyP
    get left()         { return this.isDown('ArrowLeft')  || this.isDown('KeyA'); }
    get right()        { return this.isDown('ArrowRight') || this.isDown('KeyD'); }
    get jump()         { return this.isDown('KeyZ')       || this.isDown('Space'); }
    get jumpPressed()  { return this.isPressed('KeyZ')    || this.isPressed('Space'); }
    get jumpReleased() { return this.isReleased('KeyZ')   || this.isReleased('Space'); }
    get attack()       { return this.isPressed('KeyX'); }
    // v0.50.1: X tap = throw (single-shot via attack edge); X hold = sprint modifier.
    // HeroController consumes sprintHeld every frame for walk-speed multiplier and to
    // compute the jump-start vy multiplier when X is held at the moment of jump.
    get sprintHeld()   { return this.isDown('KeyX'); }
    get pause()        { return this.isPressed('Escape')  || this.isPressed('KeyP'); }

    // ── Shared with Renderer.drawTouchControls (v0.75.1) ───────────────────
    /** @returns {ReadonlyArray} button table — Renderer reads to draw overlay. */
    get buttons() { return BUTTONS; }

    // ── Mobile virtual on-screen buttons ───────────────────────────────────
    /**
     * v0.75.1 — visible touch buttons. Each registered touch is mapped to a
     * BUTTON entry; while the finger overlaps a button, that button's `key`
     * stays set in `_keys`. Supports multi-touch (one finger holds → while
     * another taps Z to jump, etc.).
     *
     * Replaces the v0.25 zone-based blind layout (left-third / bottom-right /
     * top-right) which had no visual feedback and no right-direction button.
     */
    _setupTouch() {
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;
        this._canvas = canvas;

        // touchstart: assign each new touch to whichever button (if any) it lands on.
        canvas.addEventListener('touchstart', e => {
            for (const t of e.changedTouches) {
                const { lx, ly } = this._canvasToLogical(t.clientX, t.clientY);
                const b = this._buttonAt(lx, ly);
                if (b) {
                    this._touchButtons.set(t.identifier, b);
                    this._keys[b.key] = true;
                }
            }
            // Prevent the gesture from scrolling the page on mobile when the
            // user's finger lands on a control. Without this, a drag could
            // pull the whole page or trigger pull-to-refresh.
            e.preventDefault();
        }, { passive: false });

        // touchmove: a finger may slide between buttons. Release the old
        // button's key and press the new one as needed.
        canvas.addEventListener('touchmove', e => {
            for (const t of e.changedTouches) {
                const { lx, ly } = this._canvasToLogical(t.clientX, t.clientY);
                const newB = this._buttonAt(lx, ly);
                const oldB = this._touchButtons.get(t.identifier) || null;
                if (newB === oldB) continue;
                if (oldB) this._releaseButtonIfNotHeld(oldB);
                if (newB) {
                    this._touchButtons.set(t.identifier, newB);
                    this._keys[newB.key] = true;
                } else {
                    this._touchButtons.delete(t.identifier);
                }
            }
            e.preventDefault();
        }, { passive: false });

        const endOrCancel = e => {
            for (const t of e.changedTouches) {
                const oldB = this._touchButtons.get(t.identifier);
                this._touchButtons.delete(t.identifier);
                if (oldB) this._releaseButtonIfNotHeld(oldB);
            }
        };
        canvas.addEventListener('touchend',    endOrCancel, { passive: true });
        canvas.addEventListener('touchcancel', endOrCancel, { passive: true });
    }

    /**
     * Release the key bound to `btn` only if NO OTHER currently-tracked touch
     * is still on the same button. This keeps multi-touch correct: if two
     * fingers happen to sit on the same button and one lifts, the key stays
     * pressed until the second finger lifts too.
     */
    _releaseButtonIfNotHeld(btn) {
        for (const other of this._touchButtons.values()) {
            if (other === btn) return; // still held by another touch
        }
        this._keys[btn.key] = false;
    }

    _canvasToLogical(clientX, clientY) {
        const rect = this._canvas.getBoundingClientRect();
        const lx = ((clientX - rect.left) / rect.width)  * 768;
        const ly = ((clientY - rect.top)  / rect.height) * 576;
        return { lx, ly };
    }

    _buttonAt(lx, ly) {
        for (const b of BUTTONS) {
            if (lx >= b.x && lx < b.x + b.w && ly >= b.y && ly < b.y + b.h) return b;
        }
        return null;
    }
}

export const GAME_STATES = Object.freeze({
    TITLE:        'TITLE',
    PLAYING:      'PLAYING',
    PAUSED:       'PAUSED',
    GAME_OVER:    'GAME_OVER',
    STAGE_CLEAR:  'STAGE_CLEAR',
    TRANSITIONING:'TRANSITIONING',
});

export class StateManager {
    constructor() {
        this.gameState   = GAME_STATES.TITLE;
        this.score       = 0;
        this.highScore   = parseInt(localStorage.getItem('wb_hi') || '0', 10);
        this.lives       = 3;
        this.currentArea = 1;

        // ── Hunger / vitality system (Agent 5 owns the decay logic) ──────
        this.hunger          = 100;
        this.maxHunger       = 100;
        this.hungerDecayRate = 1.5;   // units per second

        // ── Inventory ────────────────────────────────────────────────────
        this.hasSkateboard = false;
        this.axeCount      = 3;
        this.maxAxes       = 5;

        // ── Hit invincibility ─────────────────────────────────────────────
        this.invincibleTimer = 0;     // frames

        this._listeners = {};
    }

    // ── State machine ──────────────────────────────────────────────────────
    setGameState(next) {
        const prev = this.gameState;
        this.gameState = next;
        this._emit('stateChange', { prev, next });
    }

    // ── Score ──────────────────────────────────────────────────────────────
    addScore(pts) {
        this.score += pts;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('wb_hi', String(this.highScore));
        }
        this._emit('scoreChange', this.score);
    }

    // ── Damage ─────────────────────────────────────────────────────────────
    takeDamage() {
        if (this.invincibleTimer > 0) return false;

        if (this.hasSkateboard) {
            this.hasSkateboard   = false;
            this.invincibleTimer = 120;
            this._emit('skateboardBroken');
            return false;
        }

        this.lives--;
        this.invincibleTimer = 120;
        this._emit('playerDied');

        if (this.lives <= 0) this.setGameState(GAME_STATES.GAME_OVER);
        return true;
    }

    // ── Hunger ─────────────────────────────────────────────────────────────
    restoreHunger(amount) {
        this.hunger = Math.min(this.maxHunger, this.hunger + amount);
        this._emit('hungerChange', this.hunger);
    }

    // ── Per-frame update (called by GameLoop) ──────────────────────────────
    update(dt) {
        if (this.gameState !== GAME_STATES.PLAYING) return;

        if (this.invincibleTimer > 0) this.invincibleTimer--;

        this.hunger = Math.max(0, this.hunger - this.hungerDecayRate * dt);
        this._emit('hungerChange', this.hunger);

        if (this.hunger <= 0) {
            const died = this.takeDamage();
            if (!died) this.hunger = 30;  // small refill if skateboard blocked
            else        this.hunger = 40;
        }
    }

    // ── Reset for new game ─────────────────────────────────────────────────
    reset() {
        this.score           = 0;
        this.lives           = 3;
        this.hunger          = 100;
        this.hasSkateboard   = false;
        this.axeCount        = 3;
        this.currentArea     = 1;
        this.invincibleTimer = 0;
        this.setGameState(GAME_STATES.PLAYING);
    }

    // ── Event bus (lightweight) ────────────────────────────────────────────
    on(event, cb)         { (this._listeners[event] ||= []).push(cb); }
    _emit(event, data)    { this._listeners[event]?.forEach(cb => cb(data)); }
}

export const GAME_STATES = Object.freeze({
    TITLE:        'TITLE',
    PLAYING:      'PLAYING',
    PAUSED:       'PAUSED',
    GAME_OVER:    'GAME_OVER',
    STAGE_CLEAR:  'STAGE_CLEAR',
    TRANSITIONING:'TRANSITIONING',
    // v0.50.1 — Phase 2 lives system. RESPAWNING is set by killHero() in Phase 2 mode
    // when lives > 0; the next mechanics tick repositions Reed at the latest checkpoint.
    RESPAWNING:   'RESPAWNING',
});

export class StateManager {
    constructor() {
        this.gameState   = GAME_STATES.TITLE;
        this.score       = 0;
        this.highScore   = parseInt(localStorage.getItem('wb_hi') || '0', 10);
        // v0.50.1 — Phase 2 lives system. 3 lives per stage; checkpoint respawn within;
        // last-life loss restarts the stage with lives refilled. `maxLives` exposed for
        // HUD rendering and reset() refills.
        this.maxLives    = 3;
        this.lives       = this.maxLives;
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

        // ── Phase 1: hero HP (additive — does not replace `lives`) ────────
        this.heroHp    = 3;
        this.heroMaxHp = 3;

        this._listeners = {};
    }

    setHeroHp(hp, hpMax) {
        // v0.25.2: HP system removed for Phase 1; vitality is the single life-line.
        // Keep this setter as a no-op for backward compatibility with the legacy
        // Area-1 spawn path (which has not been reactivated in Phase 1).
        this.heroHp    = hp;
        if (typeof hpMax === 'number') this.heroMaxHp = hpMax;
        this._emit('heroHpChange', this.heroHp);
    }

    /**
     * v0.25.2: any contact with an enemy / enemy projectile, or vitality reaching 0,
     * triggers an immediate game over. No HP, no iframes, no knockback, no skateboard
     * absorb in Phase 1.
     *
     * v0.50.1 — Phase 2 mode (any player whose `_phase2 === true`) routes through
     * loseLife() instead, which decrements `lives` and either RESPAWNs at the latest
     * checkpoint or refills lives + stage-restarts. Callers that hold a player
     * reference can pass it; CombatSystem already does. For callers that don't
     * (e.g. pit-death in HeroController), lookup is via the ECS query for `player`.
     */
    killHero(player = null) {
        if (this.gameState === GAME_STATES.GAME_OVER) return;
        if (this.gameState === GAME_STATES.RESPAWNING) return; // already pending
        // Phase 2 detection: explicit player flag OR a state-level `_isPhase2` bit
        // set by LevelManager. The bit covers vitality-zero (state.update has no
        // player handle) and any other ECS-less callers.
        const phase2 = !!(this._isPhase2 || (player && player.player && player.player._phase2));
        if (phase2) {
            this.loseLife();
            return;
        }
        this.setGameState(GAME_STATES.GAME_OVER);
        this._emit('playerDied');
    }

    /**
     * v0.50.1 — decrement a life. If lives remain, set RESPAWNING (StageManager picks
     * Reed up at the latest checkpoint and clears the flag). If lives drop to 0,
     * refill lives to maxLives, reset the stage's checkpoint progress (handled by
     * StageManager when it observes the flag), and RESPAWN at stage start.
     *
     * Vitality is fully refilled on every life loss.
     */
    loseLife() {
        this.lives = Math.max(0, this.lives - 1);
        this.hunger = this.maxHunger;
        this._emit('playerDied');
        if (this.lives <= 0) {
            // Stage restart: refill lives. StageManager reads `_stageRestartPending`
            // on the next RESPAWNING tick to also reset checkpoint progress.
            this.lives = this.maxLives;
            this._stageRestartPending = true;
        }
        this.setGameState(GAME_STATES.RESPAWNING);
    }

    /** @deprecated v0.25.2 — use killHero() in Phase 1. Retained for legacy path only. */
    damageHero(amount = 1) {
        this.killHero();
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
            // v0.25.2: vitality reaching 0 = immediate game over (Phase 1 single life-line).
            this.killHero();
        }
    }

    // ── Reset for new game ─────────────────────────────────────────────────
    reset() {
        this.score           = 0;
        this.lives           = this.maxLives;
        this.hunger          = 100;
        this.hasSkateboard   = false;
        this.axeCount        = 3;
        this.currentArea     = 1;
        this.invincibleTimer = 0;
        this._stageRestartPending = false;
        this.setGameState(GAME_STATES.PLAYING);
    }

    // ── Event bus (lightweight) ────────────────────────────────────────────
    on(event, cb)         { (this._listeners[event] ||= []).push(cb); }
    _emit(event, data)    { this._listeners[event]?.forEach(cb => cb(data)); }
}

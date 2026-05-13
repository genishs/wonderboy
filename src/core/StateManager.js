export const GAME_STATES = Object.freeze({
    TITLE:             'TITLE',
    PLAYING:           'PLAYING',
    PAUSED:            'PAUSED',
    GAME_OVER:         'GAME_OVER',
    STAGE_CLEAR:       'STAGE_CLEAR',
    TRANSITIONING:     'TRANSITIONING',
    // v0.50.1 — Phase 2 lives system. RESPAWNING is set by killHero() in Phase 2 mode
    // when lives > 0; the next mechanics tick repositions Reed at the latest checkpoint.
    RESPAWNING:        'RESPAWNING',
    // v0.75 — Phase 3 multi-stage + boss states.
    //   STAGE_TRANSITION : drives the inter-stage fade-out → swap → hold → fade-in ritual.
    //                      Input frozen for the entire window; physics frozen during
    //                      fade-out/hold/fade-in (handled in HeroController input-lock).
    //   BOSS_FIGHT       : camera locked, boss FSM active. PLAYING-like input/physics
    //                      semantics; only CombatSystem + BossSystem fire boss-specific paths.
    //   AREA_CLEARED     : terminal closure overlay after Bracken Warden death. Holds
    //                      AREA_CLEARED.fadeOutFrames + holdFrames; any input dismisses to TITLE.
    STAGE_TRANSITION:  'STAGE_TRANSITION',
    BOSS_FIGHT:        'BOSS_FIGHT',
    AREA_CLEARED:      'AREA_CLEARED',
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
     *
     * v0.50.2 — Phase 2 mode now routes through beginDying() instead of loseLife
     * directly, so the new 4-frame death animation + knockback play before the
     * life decrement. Phase 1 path unchanged. The HeroController dying FSM calls
     * loseLife() once dyingFrames decays to 0.
     */
    killHero(player = null) {
        if (this.gameState === GAME_STATES.GAME_OVER) return;
        if (this.gameState === GAME_STATES.RESPAWNING) return; // already pending
        // v0.50.2 — already dying? no-op so subsequent enemy-contact frames
        // don't restart the FSM (which would zero the knockback velocity).
        if (player && player.player && (player.player.dyingFrames | 0) > 0) return;
        // Phase 2 detection: explicit player flag OR a state-level `_isPhase2` bit
        // set by LevelManager. The bit covers vitality-zero (state.update has no
        // player handle) and any other ECS-less callers.
        const phase2 = !!(this._isPhase2 || (player && player.player && player.player._phase2));
        if (phase2) {
            this.beginDying(player);
            return;
        }
        this.setGameState(GAME_STATES.GAME_OVER);
        this._emit('playerDied');
    }

    /**
     * v0.50.2 — start the dying sequence. Sets up knockback velocity + dyingFrames
     * timer on the player component. HeroController owns the per-frame tick of
     * dyingFrames; when it hits 0, HeroController calls loseLife().
     *
     * Callers may pass an ECS row containing { player, transform, velocity } OR
     * just { player } / null. When velocity is missing we still set the timer;
     * HeroController computes knockback with whatever vx/vy it sees.
     */
    beginDying(player = null) {
        if (this.gameState === GAME_STATES.GAME_OVER) return;
        if (this.gameState === GAME_STATES.RESPAWNING) return;
        const pl = player?.player ?? null;
        if (!pl) {
            // No player handle — fall back to immediate life-loss path. This
            // covers the vitality-zero pit case where the caller is state.update.
            this.loseLife();
            return;
        }
        if ((pl.dyingFrames | 0) > 0) return; // already dying
        // Lazy import would create a cycle; the constants are tiny so we hard-
        // code them here. Keep the values in sync with PhaseTwoTunables.DEATH.
        // (Knockback is applied to the velocity if present so the renderer/FSM
        // sees motion immediately on the next frame.)
        const DYING_FRAMES   = 45;
        const KNOCKBACK_VX   = 5.0;
        const KNOCKBACK_VY   = -6.0;
        pl.dyingFrames = DYING_FRAMES;
        pl.aiState     = 'dying';
        pl.attackCooldown      = 0;
        pl.attackOverlayFrames = 0;
        pl.stumbleFrames       = 0;
        pl.stumbleCooldown     = 0;
        const v = player?.velocity ?? null;
        if (v) {
            v.vx = (pl.facingRight ? -1 : 1) * KNOCKBACK_VX;
            v.vy = KNOCKBACK_VY;
        }
        this._emit('playerDying');
    }

    /**
     * v0.50.1 — decrement a life. If lives remain, set RESPAWNING (StageManager picks
     * Reed up at the latest checkpoint and clears the flag).
     *
     * v0.50.2 — when lives drop to 0, transition to GAME_OVER (with the
     * "press any key to continue" overlay). state.continueRun() resumes from
     * stage start. Previously v0.50.1 silently restarted the stage on lives-0;
     * v0.50.2 makes it an explicit player-input beat.
     *
     * Vitality is fully refilled on every life loss.
     */
    loseLife() {
        this.lives = Math.max(0, this.lives - 1);
        this.hunger = this.maxHunger;
        this._dyingPending = false;
        this._emit('playerDied');
        if (this.lives <= 0) {
            // v0.50.2 — GAME OVER. The continueRun() entry point refills lives
            // and re-flags _stageRestartPending so the stage rebuilds from
            // scratch on the next StageManager tick.
            this._stageRestartPending = false;
            this.setGameState(GAME_STATES.GAME_OVER);
            return;
        }
        this.setGameState(GAME_STATES.RESPAWNING);
    }

    /**
     * v0.50.2 — exit GAME_OVER and rebuild the stage from scratch with full
     * lives + vitality. Wired from HeroController on any of jump / attack /
     * sprint input while gameState === GAME_OVER and _phase2.
     *
     * v0.75 — when AreaManager is active (`_isPhase3` set by AreaManager.startArea),
     * we set BOTH `_stageRestartPending` (for legacy StageManager paths that still
     * observe it) AND `_areaRestartPending` (which AreaManager.update consumes to
     * route Continue back to Stage 1 regardless of which stage the player died in).
     * Per the area expansion brief §2: "if Reed loses all three lives and is
     * offered Continue, he restarts at Stage 1 spawn unarmed."
     */
    continueRun() {
        if (this.gameState !== GAME_STATES.GAME_OVER) return;
        this.lives  = this.maxLives;
        this.hunger = this.maxHunger;
        this._stageRestartPending = true;
        if (this._isPhase3) this._areaRestartPending = true;
        this.setGameState(GAME_STATES.RESPAWNING);
    }

    /**
     * v0.75.1 — dismiss the AREA_CLEARED overlay and loop back to Stage 1
     * (Area 2 isn't built yet). Re-uses the GAME_OVER → continueRun
     * full-Area reset path so lives refill, vitality refills, pl.armed
     * clears, and Stage 1 rebuilds from scratch via AreaManager.startArea.
     * Per phase3-boss-cast.md Changelog: "the run loops back to Stage 1
     * col 0 with state.lives refilled to 3, state.vitality refilled to max,
     * and pl.armed cleared — i.e., the same world state as a fresh new-game
     * launch from title, re-using the existing GAME OVER → Continue full-
     * reset flow."
     */
    dismissAreaCleared() {
        if (this.gameState !== GAME_STATES.AREA_CLEARED) return;
        this.lives  = this.maxLives;
        this.hunger = this.maxHunger;
        this._stageRestartPending = true;
        if (this._isPhase3) this._areaRestartPending = true;
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
            // v0.50.2 — Phase 2 needs a player handle to play the dying animation.
            //   We don't have one here, so we set _dyingPending and let
            //   HeroController.update consume it next frame with its own player ref.
            //   Phase 1 path (no _isPhase2) still calls killHero() directly for the
            //   immediate game-over. (HeroController guards against re-firing if a
            //   dying FSM is already in progress, but we also debounce here.)
            if (this._isPhase2) {
                if (!this._dyingPending) this._dyingPending = true;
            } else {
                this.killHero();
            }
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
        this._areaRestartPending  = false;   // v0.75
        this._dyingPending        = false;
        this.setGameState(GAME_STATES.PLAYING);
    }

    // ── Event bus (lightweight) ────────────────────────────────────────────
    on(event, cb)         { (this._listeners[event] ||= []).push(cb); }
    _emit(event, data)    { this._listeners[event]?.forEach(cb => cb(data)); }
}

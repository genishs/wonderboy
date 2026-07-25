/**
 * Agent 5 — HungerSystem
 *
 * Standalone class that owns all hunger decay and warning logic,
 * extracted from StateManager so it can be updated/tuned independently.
 *
 * Thresholds
 *   'ok'       hunger >= 40
 *   'low'      hunger <  40 (and >= 20)
 *   'critical' hunger <  20
 *
 * Decay rate scales with area: base + (area * 0.1) units/sec
 *   Area 1 → 1.5 u/s   Area 2 → 1.6 u/s   Area 3 → 1.7 u/s ...
 *
 * Events emitted on state (state.on / state._emit compatible):
 *   'hungerLow'      – first frame hunger drops below 40
 *   'hungerCritical' – first frame hunger drops below 20
 *   'hungerRestored' – hunger rises back to >= 40 after being low
 */
export class HungerSystem {
    constructor() {
        /** Base decay units per second (matches StateManager default). */
        this.baseDecayRate = 1.5;

        // Internal warning-level cache to avoid emitting the same event repeatedly
        this._lastWarning = 'ok';
    }

    /**
     * Call once per game frame while the game is PLAYING.
     *
     * @param {number} dt        – delta-time in seconds
     * @param {object} state     – StateManager instance
     */
    update(dt, state) {
        if (state.gameState !== 'PLAYING') return;

        const area      = state.currentArea ?? 1;
        const decayRate = this.baseDecayRate + area * 0.1;

        state.hunger = Math.max(0, state.hunger - decayRate * dt);
        state._emit('hungerChange', state.hunger);

        // Emit level-change events
        const current = this.getWarningLevel(state);
        if (current !== this._lastWarning) {
            if (current === 'low')      state._emit('hungerLow',      state.hunger);
            if (current === 'critical') state._emit('hungerCritical', state.hunger);
            if (current === 'ok')       state._emit('hungerRestored', state.hunger);
            this._lastWarning = current;
        }

        // Starvation damage
        if (state.hunger <= 0) {
            const died = state.takeDamage();
            // Give a small hunger buffer so the next frame isn't immediately fatal
            if (!died) state.hunger = 30;  // skateboard absorbed the hit
            else        state.hunger = 40;
            // Warning level may have changed after restore
            this._lastWarning = this.getWarningLevel(state);
        }
    }

    /**
     * Returns the warning level string for the current hunger value.
     *
     * @param {object} state – StateManager instance (needs .hunger)
     * @returns {'ok'|'low'|'critical'}
     */
    getWarningLevel(state) {
        if (state.hunger < 20) return 'critical';
        if (state.hunger < 40) return 'low';
        return 'ok';
    }
}

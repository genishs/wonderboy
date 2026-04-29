import { WeaponSystem } from './WeaponSystem.js';

/**
 * Agent 5 (Mechanics Specialist) owns this directory.
 * GameMechanics orchestrates all mechanics sub-systems.
 */
export class GameMechanics {
    constructor(state, renderer) {
        this.state    = state;
        this.weapons  = new WeaponSystem();
    }

    update(dt, ecs, state, input) {
        state.update(dt);
        this.weapons.update(dt, ecs);

        // Throw axe on attack input
        if (input.attack && state.axeCount > 0) {
            const players = ecs.query('transform', 'player');
            if (players.length > 0) {
                const { transform: tf, player: pl } = players[0];
                this.weapons.throwAxe(ecs, tf, pl.facingRight);
                state.axeCount = Math.max(0, state.axeCount - 1);
            }
        }

        // Pause toggle
        if (input.pause) {
            if (state.gameState === 'PLAYING') state.setGameState('PAUSED');
            else if (state.gameState === 'PAUSED') state.setGameState('PLAYING');
        }

        this._checkAxeHits(ecs, state);
    }

    _checkAxeHits(ecs, state) {
        const axes    = ecs.query('transform', 'projectile');
        const enemies = ecs.query('transform', 'enemy');

        for (const axe of axes) {
            for (const enemy of enemies) {
                if (!this._overlaps(axe.transform, enemy.transform)) continue;
                ecs.destroyEntity(axe.id);
                ecs.destroyEntity(enemy.id);
                state.addScore(150);
                break;
            }
        }
    }

    _overlaps(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }
}

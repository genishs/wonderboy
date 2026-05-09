// owning agent: dev-lead
// TODO: Phase 1 damage resolution.
//
// v0.25.2: HP / iframes / knockback removed.
//   - Any contact between hero and a damaging enemy = immediate game over.
//   - Any contact between hero and an enemy projectile = immediate game over.
//   - Sapling closed state still deals zero damage (timing-puzzle design intent).
//   - Stoneflake despawns on first enemy hit; enemies still have HP for their kill count.

import { CRAWLSPINE, GLASSMOTH, SAPLING } from '../config/PhaseOneTunables.js';

const DAMAGING_SAPLING_STATES = new Set(['windup', 'firing']);

export class CombatSystem {
    update(ecs, state) {
        if (state.gameState === 'GAME_OVER') return;

        const players = ecs.query('transform', 'velocity', 'physics', 'player');
        if (!players.length) return;
        const player = players[0];

        this._heroVsEnemyContact(ecs, state, player);
        this._heroProjectileVsEnemy(ecs, state, player);
        this._enemyProjectileVsHero(ecs, state, player);
    }

    _heroVsEnemyContact(ecs, state, player) {
        const ptf = player.transform;

        for (const e of ecs.query('transform', 'enemy')) {
            const en = e.enemy;
            if (en.ai === 'dead') continue;

            // Sapling: harmless when closed
            if (en.type === 'sapling' && !DAMAGING_SAPLING_STATES.has(en.ai)) continue;

            if (!this._overlaps(ptf, e.transform)) continue;
            this._killHero(state, player);
            return;
        }
    }

    _heroProjectileVsEnemy(ecs, state, player) {
        const projectiles = ecs.query('transform', 'projectile').filter(r => r.projectile.ownerKind === 'hero');
        for (const proj of projectiles) {
            for (const e of ecs.query('transform', 'enemy')) {
                if (e.enemy.ai === 'dead') continue;
                if (!this._overlaps(proj.transform, e.transform)) continue;

                this._damageEnemy(e, proj.projectile.damage, state);
                ecs.destroyEntity(proj.id);
                break;
            }
        }
    }

    _enemyProjectileVsHero(ecs, state, player) {
        const ptf = player.transform;
        const projectiles = ecs.query('transform', 'projectile').filter(r => r.projectile.ownerKind === 'enemy');
        for (const proj of projectiles) {
            if (!this._overlaps(proj.transform, ptf)) continue;
            this._killHero(state, player);
            ecs.destroyEntity(proj.id);
            return;
        }
    }

    // ──────────────────────────────────────────────────────────────────────
    _killHero(state, player) {
        if (state.gameState === 'GAME_OVER') return;
        const v  = player.velocity;
        const pl = player.player;
        v.vx = 0;
        v.vy = 0;
        pl.aiState = 'dead';
        state.killHero();
    }

    _damageEnemy(e, dmg, state) {
        const en = e.enemy;
        if (en.ai === 'dead') return;
        en.hp = Math.max(0, en.hp - dmg);
        if (en.hp <= 0) {
            en.ai = 'dead';
            const deathBy = {
                crawlspine: CRAWLSPINE.deathFrames,
                glassmoth:  GLASSMOTH.deathFrames,
                sapling:    SAPLING.deathFrames,
            };
            en.deathFrames = deathBy[en.type] ?? 30;
            state.addScore?.(100);
        } else {
            const hurtBy = {
                crawlspine: CRAWLSPINE.hurtFrames,
                glassmoth:  GLASSMOTH.hurtFrames,
                sapling:    SAPLING.hurtFrames,
            };
            en.hurtFrames = hurtBy[en.type] ?? 4;
        }
    }

    _overlaps(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }
}

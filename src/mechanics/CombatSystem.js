// owning agent: dev-lead
// TODO: Phase 1 damage resolution — hero contact, hero projectile vs enemy,
//       enemy projectile vs hero. Manages iframes, knockback, hp, hurt-lock.
//
// Damage rules (per docs/briefs/phase1-cast.md §):
//   - Hero with iframes > 0 ignores all incoming damage.
//   - Stoneflake despawns on first enemy hit.
//   - Sapling closed = zero contact damage; windup/firing = full contact damage.
//   - Enemies do not friendly-fire each other (ownerKind === 'enemy' passes through enemies).

import { HERO, CRAWLSPINE, GLASSMOTH, SAPLING } from '../config/PhaseOneTunables.js';

const DAMAGING_SAPLING_STATES = new Set(['windup', 'firing']);

export class CombatSystem {
    update(ecs, state) {
        const players = ecs.query('transform', 'velocity', 'physics', 'player');
        if (!players.length) return;
        const player = players[0];

        this._heroVsEnemyContact(ecs, state, player);
        this._heroProjectileVsEnemy(ecs, state, player);
        this._enemyProjectileVsHero(ecs, state, player);
    }

    _heroVsEnemyContact(ecs, state, player) {
        const ptf = player.transform;
        const pl  = player.player;
        if (pl.iframes > 0 || pl.hp <= 0) return;

        for (const e of ecs.query('transform', 'enemy')) {
            const en = e.enemy;
            if (en.ai === 'dead') continue;

            // Sapling: harmless when closed
            if (en.type === 'sapling' && !DAMAGING_SAPLING_STATES.has(en.ai)) continue;

            if (!this._overlaps(ptf, e.transform)) continue;
            this._damageHero(state, player, e.transform.x + e.transform.w / 2);
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
        const pl  = player.player;
        const projectiles = ecs.query('transform', 'projectile').filter(r => r.projectile.ownerKind === 'enemy');
        for (const proj of projectiles) {
            if (!this._overlaps(proj.transform, ptf)) continue;
            // Iframed hero: dart passes through (don't despawn) — gives a coverage cushion.
            if (pl.iframes > 0 || pl.hp <= 0) continue;
            this._damageHero(state, player, proj.transform.x + proj.transform.w / 2);
            ecs.destroyEntity(proj.id);
        }
    }

    // ──────────────────────────────────────────────────────────────────────
    _damageHero(state, player, sourceX) {
        const tf = player.transform, v = player.velocity, pl = player.player;
        if (pl.iframes > 0 || pl.hp <= 0) return;

        pl.hp = Math.max(0, pl.hp - 1);
        state.heroHp = pl.hp;
        pl.iframes = HERO.iframesHurt;
        pl.hurtFrames = HERO.hurtLockFrames;
        pl.hurtSourceX = sourceX;

        const sign = Math.sign((tf.x + tf.w / 2) - sourceX) || (pl.facingRight ? -1 : 1);
        v.vx = sign * HERO.knockbackVx;
        v.vy = HERO.knockbackVy;

        if (pl.hp <= 0) {
            state.setGameState('GAME_OVER');
        }
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
            // Sapling does not knockback (rooted) — already no v.vx mutation here.
        }
    }

    _overlaps(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }
}

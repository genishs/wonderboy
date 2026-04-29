/**
 * Agent 5 — Boss AI patterns (one per area).
 *
 * Each boss is an entity with components: transform, velocity, physics, boss, sprite, health.
 * Hitbox is the boss head (top 25% of sprite height) — matches original.
 *
 * TODO (Agent 5): Implement area bosses 1–7.
 * Boss spawn is triggered by LevelManager when player reaches goalX of the last stage.
 */

export class BossPatterns {
    /**
     * @param {ECS} ecs
     * @param {number} area  1–7
     * @param {number} spawnX
     * @param {number} spawnY
     * @returns {number} entityId
     */
    spawnBoss(ecs, area, spawnX, spawnY) {
        const configs = {
            1: { hp: 3, color: '#8B0000', ai: 'charge',  speed: 2.5 },
            2: { hp: 4, color: '#006400', ai: 'jump',    speed: 3.0 },
            3: { hp: 4, color: '#00008B', ai: 'charge',  speed: 3.5 },
            4: { hp: 5, color: '#4B0082', ai: 'fly',     speed: 3.0 },
            5: { hp: 5, color: '#8B4500', ai: 'charge',  speed: 4.0 },
            6: { hp: 6, color: '#000080', ai: 'pattern', speed: 3.5 },
            7: { hp: 8, color: '#220022', ai: 'pattern', speed: 4.0 },
        };
        const cfg = configs[area] ?? configs[1];

        const boss = ecs.createEntity();
        ecs.addComponent(boss, 'transform', { x: spawnX, y: spawnY, w: 64, h: 80 });
        ecs.addComponent(boss, 'velocity',  { vx: -cfg.speed, vy: 0 });
        ecs.addComponent(boss, 'physics',   { onGround: false, onIce: false, jumpHoldLeft: 0 });
        ecs.addComponent(boss, 'boss',      { area, ai: cfg.ai, hp: cfg.hp, maxHp: cfg.hp, timer: 0 });
        ecs.addComponent(boss, 'enemy',     { type: `boss${area}`, dir: -1, ai: cfg.ai, hp: cfg.hp });
        ecs.addComponent(boss, 'sprite',    { sheet: 'bosses', frame: 0, color: cfg.color });
        return boss;
    }

    /**
     * Per-frame boss logic. Called by GameMechanics.update().
     * Each AI type should be implemented here.
     */
    update(dt, ecs, state) {
        for (const { id, transform: tf, velocity: v, boss } of ecs.query('transform', 'velocity', 'boss')) {
            boss.timer += dt;

            switch (boss.ai) {
                case 'charge':  this._aiCharge(tf, v, boss, dt);  break;
                case 'jump':    this._aiJump(tf, v, boss, dt);    break;
                case 'fly':     this._aiFly(tf, v, boss, dt);     break;
                case 'pattern': this._aiPattern(tf, v, boss, dt); break;
            }

            if (boss.hp <= 0) {
                state.addScore(5000 * boss.area);
                ecs.destroyEntity(id);
                state.setGameState('STAGE_CLEAR');
            }
        }
    }

    // ── AI stubs (Agent 5: flesh these out) ───────────────────────────────
    _aiCharge(tf, v, boss, dt) {
        // Move horizontally, reverse at screen edges
        if (tf.x < 48 || tf.x > 700) v.vx *= -1;
    }

    _aiJump(tf, v, boss, dt) {
        if (boss.timer > 2.0) { v.vy = -9; boss.timer = 0; }
    }

    _aiFly(tf, v, boss, dt) {
        // Sine wave vertical movement
        v.vy = Math.sin(boss.timer * 3) * 2;
    }

    _aiPattern(tf, v, boss, dt) {
        // TODO: multi-phase attack pattern
    }
}

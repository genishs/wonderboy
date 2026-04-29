/**
 * Agent 5 — Stone axe projectile system.
 *
 * Original Wonder Boy: max 1 axe on screen, parabolic arc, disappears on tile hit.
 * KEY CONSTANTS (tune to match original):
 *   AXE_VX   = 7    horizontal speed
 *   AXE_VY   = -3   initial upward arc
 *   MAX_AXES = 1    max simultaneous projectiles (original limit)
 *   LIFETIME = 2.0  seconds before auto-despawn
 */

const AXE_VX    = 7;
const AXE_VY    = -3;
const MAX_AXES  = 1;
const LIFETIME  = 2.0;

export class WeaponSystem {
    update(dt, ecs) {
        for (const { id, projectile: p } of ecs.query('projectile')) {
            p.lifetime -= dt;
            if (p.lifetime <= 0) ecs.destroyEntity(id);
        }
    }

    throwAxe(ecs, playerTf, facingRight) {
        if (ecs.query('projectile').length >= MAX_AXES) return;

        const dir = facingRight ? 1 : -1;
        const axe = ecs.createEntity();
        ecs.addComponent(axe, 'transform',  {
            x: playerTf.x + (facingRight ? playerTf.w : -20),
            y: playerTf.y + 8,
            w: 18, h: 18,
        });
        ecs.addComponent(axe, 'velocity',   { vx: dir * AXE_VX, vy: AXE_VY });
        ecs.addComponent(axe, 'projectile', { type: 'axe', lifetime: LIFETIME });
        ecs.addComponent(axe, 'sprite',     { sheet: 'items', frame: 0, color: '#C0C0C0' });
    }
}

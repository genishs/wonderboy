# Preview — `assets/sprites/projectile-stoneflake.js`

| Field   | Value                          |
|---------|--------------------------------|
| Path    | `assets/sprites/projectile-stoneflake.js` |
| Size    | 8 × 8 px                       |
| Anchor  | `{ x: 4, y: 4 }` (body center) |
| FPS     | 12                             |
| Palette | 6 entries                      |

> Size note: brief calls this `proj-stoneflake.js` at 12 × 12; per user-instructions
> the module is named `projectile-stoneflake.js` at 8 × 8. The smaller size keeps the
> stoneflake from feeling like a magic bolt; an 8 × 8 pebble at TILE=48 reads as
> "small enough to throw, big enough to land a hit."

## Frames

### `fly` (2 frames)

- **`fly0`** — long-axis horizontal. The stone is drawn as a flat oval, three cells
  tall, six cells wide. The cream specular highlight (`5`) sits on the upper-left
  rim; the dark wash (`2`) on the underside. This is the "broad face of the
  pebble" view.
- **`fly1`** — slight tilt. The same stone, now angled ~15° clockwise: highlight has
  migrated one cell rightward, the underside dark band rotates with it, and the
  outline catches an extra cell on the upper-right and lower-left. Played back at 12
  fps the two frames cycle so the stone reads as spinning along its long axis while
  flying — like a real skipping stone, not a fireball.

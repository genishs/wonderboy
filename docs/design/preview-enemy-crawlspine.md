# Preview — `assets/sprites/enemy-crawlspine.js`

| Field   | Value                          |
|---------|--------------------------------|
| Path    | `assets/sprites/enemy-crawlspine.js` |
| Size    | 24 × 12 px                     |
| Anchor  | `{ x: 12, y: 11 }` (feet center, bottom-center) |
| FPS     | 6                              |
| Palette | 8 entries                      |

> Size note: brief suggested 48 × 24; user-instructions specify 24 × 12 as the
> sprite-cell size. At TILE=48 the Crawlspine reads as a half-tile-tall flat shape
> spanning roughly half a tile horizontally — "moving terrain" silhouette per brief.

## Frames

### `walk` (2 frames)

- **`walk0`** — ridge ripple at the front-third. The bronze (`4`) and bright-bronze
  (`5`) plates run as a continuous zig-zag across the back, but in this frame the
  *front-third* of the body is one row taller than the rest. Read: the leading edge
  has just lifted, like a wave moving back-to-front. The body itself is a flat
  6-row-tall bark (`2/3`) blob with a moss-green underside (`6`) and a ground shadow
  (`7`) tucked just above the moss.
- **`walk1`** — ridge ripple at the back-third. Same body shape, same plate count,
  but now the *back-third* is the lifted region — the wave has rolled rearward.
  Looped at 6 fps this gives the "moving piece of ground" read called for in the
  brief: the silhouette barely changes, but the rippling ridge tells the player the
  thing is alive.

### `dead` (1 frame)

- **`dead0`** — belly-up. The body has flipped onto its back: moss undertone (`6`)
  is now on top, the ridge plates have collapsed and are no longer visible, and the
  bark base (`2`) sits underneath. Two violet (`7`) cells show on the upper edge as
  the now-exposed under-shadow. The whole shape sinks one row down compared to the
  walk frames — the Crawlspine has settled. Dev's 30-frame fade ramps the alpha of
  this single frame to zero.

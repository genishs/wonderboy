# Preview — `assets/sprites/enemy-bristlecone-sapling.js`

| Field   | Value                          |
|---------|--------------------------------|
| Path    | `assets/sprites/enemy-bristlecone-sapling.js` |
| Size    | 16 × 24 px                     |
| Anchor  | `{ x: 8, y: 23 }` (root center, bottom-center) |
| FPS     | 6                              |
| Palette | 10 entries                     |

> Size note: brief suggested 48 × 48; user-instructions specify 16 × 24, matching
> Reed's hero cell so the two assets share an anchor convention. The Sapling reads
> as roughly half a tile wide and one tile tall in the playfield.

## Silhouette discipline (release-master Q4)

Closed and flared states are visibly *different silhouettes*, not the same shape with
a color swap. The closed state has bristles drawn DOWN over the core (narrow ~6-cell
crown, no amber visible), so the player can crouch-walk past one safely if they time
it. The flared states (`windup`, `firing`) widen the crown to ~10–14 cells and
expose the dawn-amber inner core — visually rhyming with Reed's own warmth so the
"this is now dangerous" read happens before the dart spawns.

## Frames

### `closed` (1 frame)

- **`closed0`** — narrow tense cone. Bristles fold downward against the trunk; the
  crown is ~6 cells wide and the core is hidden. The silhouette is a *spiked
  half-egg* — vegetable, no eyes, no mouth. Bark base (`7`) and shadow (`8`) sit
  beneath, with a single violet (`9`) ground-shadow row at the bottom of the frame.

### `windup` (1 frame)

- **`windup0`** — bristles separating, half-flared. Crown widens to ~10 cells; a
  hint of amber (`4`) is now visible through gaps in the bristles, and the bright
  amber (`5`) and seed-bone-white (`6`) start to pinprick the center. The bristles
  themselves are still mostly downward but begin to angle outward. This is the
  unmistakable telegraph the brief asked for — the player can read "danger
  arming" in one glance.

### `firing` (1 frame)

- **`firing0`** — full sunburst. Crown widens horizontally to span 14 cells; the
  bristles flare like a halo with the amber core glowing at the center and a
  bright seed-bone-white pip at the very middle. Three exposed seed-darts (`6`) sit
  in a vertical column on the right edge of the frame, indicating the volley fan
  has *just spawned* — Dev should spawn three projectile entities at the column-15
  cells in this frame and then play `cooldown` next.

### `cooldown` (1 frame)

- **`cooldown0`** — bristles snapping back, no amber on rim. Crown narrowed to ~9
  cells, dimmer amber (`4`) only at the inner-most center, no seed-darts on the
  edges. Reads as a mid-state between firing and closed: the player should know
  "the volley is over, threat receding." Brief notes this state may reference
  `closed` — we instead authored a distinct frame because the snap-back read is
  important for the player to learn the cadence.

### `dead` (1 frame)

- **`dead0`** — wilted. Bristles have collapsed outward and downward into a single
  rounded green dome ~12 cells wide, sunk by ~10 rows from the standing pose. No
  amber, no bristle highlights, no inner core. The bark/root base remains as a
  small footprint at the bottom. Dev's 45-frame fade dissolves this single frame
  to zero alpha.

# Preview — `assets/sprites/enemy-glassmoth.js`

| Field   | Value                          |
|---------|--------------------------------|
| Path    | `assets/sprites/enemy-glassmoth.js` |
| Size    | 20 × 16 px                     |
| Anchor  | `{ x: 10, y: 8 }` (body center, airborne) |
| FPS     | 6                              |
| Palette | 9 entries (3 with partial alpha) |

> Size note: brief suggested 48 × 32; user-instructions specify 20 × 16. The smaller
> footprint actually helps the "floating pale comma" read — the moth needs to feel
> light against a parallax sky, not heavy.

## Translucency strategy

This is the only Phase 1 sprite using `#rrggbbaa` palette entries. Three alpha values
are baked into the palette:
- `#f4e8f0a0` — pearl-glass inner fill (~63 % opacity).
- `#e0c8d870` — pearl-glass deeper fill, used for the "see-through" patches near wing
  centers (~44 % opacity).
- `#fff4f0c0` — wing dust trail behind the moth (~75 % opacity).

A single 1-px violet ink (`#3a2e4a`) traces the wing outline so the silhouette stays
legible against bright sky tiles, per the brief's "one-pixel inner highlight"
instruction. The renderer (`SpriteCache`) uses `putImageData` directly — partial-alpha
indices land in the canvas's premultiplied alpha channel without extra compositing.

## Frames

### `drift` (3 frames)

- **`drift0`** — wings fully spread, mid-bend. Both wings extend to the outermost
  columns (1, 18). A morning-haze highlight (`5`) sits at the top of each wing.
  Body is a 4-cell-tall bug shape in the center (`6/7`). One cell of dust trail (`8`)
  tails behind the right wing. Read: cruising horizontally.
- **`drift1`** — wings tucked higher. The wing tips have lifted by 1 row (now visible
  in row 0); the wing edge color (`4` dust-pink) bites into the silhouette at the
  rim. The wings appear *narrower* and more vertical. Read: upbeat of the flicker.
- **`drift2`** — wings at the downstroke. Wing tips bend low (now visible in row 11);
  the deeper translucent fill (`3`) expands across more cells. Read: downbeat,
  wider, "settling lower" momentarily.

The 3-frame cycle (0 → 1 → 2 → 0) plus 6 fps gives the "lighter than air" flicker
the brief calls for — wings register as flickering in place rather than flapping
hard. Dust trail flickers between drift0 and drift2 as a 1-px tell.

### `dive` (1 frame)

- **`dive0`** — wings folded back hard, body angled down. The wing arc compresses to
  a steep "/\\" with both wings pulled toward the rear, body now drawn vertically
  (head at top, tail at bottom). Reads as a "falling pale comma." This is the
  swoop-attack pose; Dev locks it for ~24 frames per the brief.

### `dead` (1 frame)

- **`dead0`** — wings detached. Two free wing-triangles drift on opposite sides of
  the frame, separated from the central body by 5 columns of transparency. The body
  has curled into a 3-row clump in the middle. Two cells of dust trail fall below
  the body. This is the showcase Phase 1 death — Dev's 45-frame fade cross-dissolves
  the wings drifting apart and sinking, then the body fades last.

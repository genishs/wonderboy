# Preview — `assets/sprites/hero-reed.js`

> Reviewer note: this file describes each frame in words so the brief can be sanity-checked
> without rendering. ASCII silhouettes are inside the `.js` file as leading comments.

| Field   | Value             |
|---------|-------------------|
| Path    | `assets/sprites/hero-reed.js` |
| Size    | 16 × 24 px        |
| Anchor  | `{ x: 8, y: 23 }` (feet center) |
| FPS     | 8                 |
| Palette | 13 entries        |

> Note on size: the brief suggested 36 × 48; this module uses **16 × 24**, the
> sprite-cell size mandated in the user-instructions for Phase 1. Reed reads as a
> ~2/3-tile-tall figure at TILE = 48 (because the Dev renderer is expected to scale
> sprite cells up to logical pixels at draw time).

## Frames

### `idle` (2 frames, played at 8 fps → ~4 fps observed)

- **`idle0`** — neutral stand. Hair tufted forward over a 2-px-wide hairline shadow
  band. Both feet planted. Tunic hem reaches mid-shin; cuff-cream highlight crosses
  the chest as a single horizontal stripe. Pouch sits on the right hip with one dark
  cell of buckle. Arms hang beside the body, hands tucked into the silhouette so the
  outline reads clean.
- **`idle1`** — small breath rise. Head row shifts up by 1 cell, hairline up by 1,
  and the tunic loses one row at the cuff so the body subtly elongates. Foot pose
  unchanged. The intent is "barely-perceptible breathing" — the reviewer should read
  this as the same boy, half a heartbeat later.

### `walk` (3 frames)

- **`walk0`** — contact pose. Lead leg (right at +1 cell) is forward; trailing leg
  is back at -1 cell. The free arm swings *opposite* to the lead leg per traditional
  contrapposto. Tunic shifts left by 1 cell to read the body lean.
- **`walk1`** — passing pose. Both feet under the hips, body upright, arms low. This
  is the "neutral inbetween" frame; if Dev only plays 2 of 3 frames at low fps, this
  + walk0 still reads as a walk cycle.
- **`walk2`** — opposite contact. Mirrors `walk0` — trailing leg now leads, free arm
  swings the other way. Together with walk0 the cycle alternates between left-foot-
  forward and right-foot-forward, with passing as the breath in between.

### `jump` (1 frame, combined rise/fall)

- **`jump0`** — knees tucked up to chest level, both arms swept forward and slightly
  out (one ahead, one back), head tilted slightly to read "I am committed to this
  jump." Tunic body compacts vertically. This single frame serves both the rising and
  falling halves of the arc; Dev may flash it identically for both `jump_rising` and
  `jump_falling`. Feet draw underneath the body so the anchor still reads as the
  belly center, NOT the soles — Dev should rely on the anchor in META, not on visual
  alignment with the floor.

### `attack` (1 frame, overlay)

- **`attack0`** — release pose. Lead arm extends fully forward; the stoneflake (a
  single cream `12` index pixel) sits one cell ahead of the fingertips so the throw
  reads as "just released." Head and tunic match the idle pose otherwise — this lets
  Dev flash this overlay over either an idle or a walk frame without the body popping
  out of place. Feet slightly wider apart (right foot 1 cell forward) to register the
  throw weight.

### `hurt` (1 frame)

- **`hurt0`** — head back, shoulders back, arms thrown out wide. The cuff-cream
  highlight has been pushed up to the collar (where on the idle frame it was lower
  on the chest) to give the silhouette a "lifted" read. Feet stay planted but the
  body stretches by ~1 cell in height. Pouch dark cell still visible. Dev's 8-fps
  blink on i-frames will alternate this frame with full-skip transparency.

### `dead` (1 frame, settled)

- **`dead0`** — final crumple. Body lowered by ~9 cells from the standing pose; head
  is bowed onto the chest, arms flopped to the sides spread wide across the bottom
  rows. Tunic now drapes loose over the legs. This is the *settle* frame, not the
  fall — Dev may interpolate from `hurt0` to here over ~30 frames if a death-jolt
  sub-animation is wanted later.

# Preview — `assets/sprites/enemy-mossplodder.js`

> **한국어 버전:** [`preview-enemy-mossplodder.ko.md`](./preview-enemy-mossplodder.ko.md)

| Field   | Value                                 |
|---------|---------------------------------------|
| Path    | `assets/sprites/enemy-mossplodder.js` |
| Size    | 24 × 16 px                            |
| Anchor  | `{ x: 12, y: 14 }` (feet center; bottom-of-belly seam ≈ row 14) |
| FPS     | 6 (slow-plod cadence per cast §3)     |
| Palette | 9 entries                             |

> Size note: cast brief §11 suggested 48 × 36; user-instructions allowed
> "24 × 16 or 28 × 18" and we ship at 24 × 16. At TILE = 48 the Mossplodder
> renders as a half-tile-tall, full-tile-wide loaf — exactly the silhouette the
> brief calls for ("waist-high lump of overgrown shell, low to the ground").
> Default facing: LEFT (toward Reed). Renderer mirrors for the rare right-
> facing spawn in round 1-4.

## Silhouette intent

A roughly one-tile-wide loaf of overgrown shell. Asymmetric: a high rounded
dome at the leading (left) edge tapering down to a long trailing slope covered
in moss. **NO eyes** (cast brief §3.1). The threat read comes entirely from
forward motion + the bright cuff-cream belly seam running along the bottom row.
Moss strands trail back from the trailing edge, lagging one frame behind the
body undulation cycle so even idle frames read "in motion."

## Frames

### `walk` (4 frames, looped at 6 fps)

The shell undulation is a four-phase cycle: front-rise → passing → back-rise →
settle. Moss strands always lag one frame behind the body.

- **`walk0`** — **front-rise**. The leading-edge dome is lifted ~1 cell higher
  than passing. The wave is starting from the front. Moss strands trail back
  along rows 4-6 of the trailing slope. Reads: "the front of the body just
  pushed up."
- **`walk1`** — **passing**. Dome and trailing slope both at neutral height; the
  moss patch on top redistributes (one moss-shadow cell shifts back). Strands
  at neutral length. This is the inbetween frame.
- **`walk2`** — **back-rise**. The trailing slope lifts ~1 cell higher than
  passing; dome at neutral. The wave has rolled rearward. Moss strands trail
  visibly (frame-lagged, longer than walk0). Reads: "the back of the body has
  caught up and risen."
- **`walk3`** — **settle**. Body returns to neutral, ready to cycle back to
  front-rise. Visually nearly identical to walk1 but with strands neutral-
  trailing and the moss patch's shadow cells in different positions for cycle
  continuity (so the renderer doesn't produce a visible "stutter" frame at the
  loop boundary).

When the Mossplodder hits a wall (cast §3.2), Dev should hold `walk0` — the
front-rise frame reads as "plodding-in-place against the obstacle."

### `dead` (3 frames, fades over ~30 frames per cast §3.7)

The hatchet contact frame IS the death frame; no flash-then-die. On contact:

- **`dead0`** — **tilt-forward off-balance**. The dome dips, the trailing slope
  rises as if the body is pitching forward. Moss strands flop loose on the far
  right. No eyes to roll, so the threat-read just goes still. The silhouette
  has shifted ~3 cells forward of the walk pose.
- **`dead1`** — **shell flat / moss splayed**. The body settles flat onto the
  ground; moss strands fan out left/right from the trailing edge as 1-cell
  pale-green strips. The dome no longer reads as a dome — the silhouette is
  now a low loaf, fully sunk into the loam. Two violet under-shadow cells
  (Phase 1 hex shared) appear at the far edges as the under-shell ground
  shadow.
- **`dead2`** — **fade-out**. The silhouette has compacted; only the bottom-
  most belly seam + ground shadow remain visible. Moss has flattened into the
  loam color (the moss-green cells have all been replaced with shell-loam
  shadow). Dev's 30-frame fade ramps the alpha of this single frame to zero.

A small **dust puff VFX** at the contact point is the only emphasis (cast
§3.4) — Dev's responsibility, not authored as a sprite frame.

## Forward-only — what's NOT here

Per cast brief §3.2 the Mossplodder has NO `turn`, `hurt`, or `idle` animation.
This sprite ships exactly the two state machines the cast brief calls for:
`walk` (continuous while alive) + `dead` (3-frame collapse and fade). If a
later Area wants to revive a "Mossplodder turns" or "Mossplodder yelps when
shoved by another Mossplodder" beat, that's a separate Phase 3+ ask.

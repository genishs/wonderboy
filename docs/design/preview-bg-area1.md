# Preview — Area 1 parallax backgrounds

> **한국어 버전:** [`preview-bg-area1.ko.md`](./preview-bg-area1.ko.md)

| Layer                | Path                              | Scroll factor   | Mood keyword              |
|----------------------|-----------------------------------|-----------------|---------------------------|
| Sky                  | `assets/bg/area1-sky.svg`         | 0.0 (static)    | kettle-warm dawn          |
| Mid-distance / mountains | `assets/bg/area1-mountains.svg` | 0.3            | layered cool greens + ruin-stone |
| Near foliage / trees | `assets/bg/area1-trees.svg`       | 0.6 (or 0.7 — see note) | violet-cool foreground frame |

All three layers are SVG (text), authored as a 768 × 576 canvas matching the
game's logical resolution. Designed to **tile horizontally** so the parallax
scroll never meets a hard edge: paths and ellipse centres are positioned so
the right and left edges of each layer compose continuously when the layer is
repeated.

## `area1-sky.svg` — sky / dawn (scroll 0.0)

Per cast brief + `world.md`'s Mossline notes: a soft amber strip at the top
fading into morning haze beneath. NO sun disc (story-fiction is dawn).

- **Linear gradient** runs top-to-bottom across the full canvas with five
  stops: `#f8d068` (zenith dawn-warm) → `#f8b878` (dawn-amber band) →
  `#e8a888` (dust-rose mid) → `#c89a98` (lower haze) → `#8a8aa8` (lowest
  violet-haze).
- **Cloud bands** — six low-frequency ellipses across the upper third of the
  canvas in `#fff4e8`, `#f8e4d0`, `#f0d4c0`, `#e8c4b8`. Opacity 0.55 so they
  read as soft haze, not hard cloud. Edges of each band feather to zero at
  the canvas left/right so horizontal tiling is seamless.
- **Cool wash** at the very bottom (`#9aa0b8` at 20% opacity) so the sky
  reads as "open above, settling into morning haze before the canopy line."

Implemented as static (scroll 0.0) — the sky is always the same; only its
position relative to the canopy changes as the player walks.

## `area1-mountains.svg` — mid-distance ridges + ruin (scroll 0.3)

A mid-frequency layer that scrolls slowly with the player (0.3× the player's
horizontal velocity) so the ridge line gently parallaxes against the canopy.

- **Far ridge** — a subtle stair-stepped path at y≈300 in `#6e8868` with 65%
  opacity. The cool palest green band; sits at upper-canopy level.
- **Mid ridge** — a slightly warmer path at y≈340 in `#5a7858`. Anchors the
  ridge silhouette against the gradient.
- **Near treetops** — nine rounded-blob ellipses across the canvas in
  `#4a7c3a` (Phase 1 tunic moss — shared verbatim). Each blob ~50-60 px wide
  with under-shadow ellipses in `#2e5028` at 55% opacity for depth.
- **Two ruin-stone silhouettes** surface through the canopy line at x≈270
  and x≈570 — small flat stone slabs in `#7a8088` (river-stone-grey) with a
  highlight in `#a8b0b8` and a violet ink stroke (`#3a2e4a`). Per
  `world.md`: "the Verdant Ruin first leaks out of itself: a few stone
  shoulders surface through the loam." These are the only narrative beats
  in the parallax.

## `area1-trees.svg` — near foliage band (scroll 0.6 or 0.7)

The fastest-moving parallax layer; sits between the player and the tile
foreground. Per cast brief + `phase2-areas.md` §9.2: ~20% of canvas height,
"slightly violet-cool" so the warm Hummerwing reads as a spark against this
layer.

- **Drooping leaf clusters** — three left, two mid, three right; each
  cluster is a quad-curve path in `#3e6a3a` at 85% opacity. Tileable: the
  far-left and far-right clusters spill slightly off-canvas so the layer
  composes seamlessly when repeated.
- **Violet under-shadow** — six secondary paths in `#5a4a6e` at 45% opacity
  underneath the leaf clusters. This is the "violet-cool" the brief calls
  for: it desaturates the foreground so Hummerwing amber pops as a warm
  spark.
- **Tall grass tufts** — fourteen small quad-curve strokes in moss-green
  (`#4a7c3a`) along the lowest visible row; eight have a single dawn-amber
  dewdrop tip (`#e8a040`) for morning catch-light. Provides the busy
  foreground texture without competing with the player's visual centre.

> Scroll-factor note: `CLAUDE.md` discussion mentions 0.6×;
> `phase2-areas.md` §9.2 logs 0.7×. Difference is left for dev-lead's
> tuning during integration. Either reads correctly with the layer's
> current visual density.

## How the three layers compose at runtime

1. Sky drawn first (canvas-fixed; never moves).
2. Mountains layer drawn at `(camera_x * 0.3) % canvas_width` offset, tiled.
3. Tile foreground drawn next (this is the gameplay layer).
4. Trees layer drawn last over the foreground at `(camera_x * 0.6 or 0.7) %
   canvas_width` offset.

The trees layer over the foreground rather than under is a deliberate choice
— it lets the player walk *through* the foliage rather than alongside it,
which thickens the Mossline's "soft seam between river-cooled lowland and
dawn-warmed terraces above" mood from `world.md`.

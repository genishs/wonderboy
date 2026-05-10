# Preview — `assets/tiles/area1.js`

> **한국어 버전:** [`preview-tile-area1.ko.md`](./preview-tile-area1.ko.md)

| Field         | Value                              |
|---------------|------------------------------------|
| Path          | `assets/tiles/area1.js`            |
| Tile matrix   | 16 × 16 art-pixels per tile        |
| Display size  | 48 × 48 canvas px (3× scale; matches `TILE = 48` in src) |
| Palette       | 16 entries                         |
| Tile keys     | 12 keys (11 static + 1 animated) — v0.50.2 added `mile_4` |

> Size / scale note: per the contracts.md extension shipped in this PR family,
> tile modules now declare `META = { tile, scale, displayPx }`. The Area 1
> module uses `tile: 16, scale: 3, displayPx: 48` so the matrix is authored at
> 16 × 16 pixels and rendered at 48 × 48 canvas pixels — the displayPx exactly
> matches `TILE = 48` in src/.

## Tile keys

### Static tiles

- **`flat`** — Standard flat ground tile. Top 2 rows are moss-green (the
  dawn-warm "Mossline" surface). Next 4 rows are loam-soil base with scattered
  darker shadow cells for grain. Below that the wet-bark side fill carries the
  side of the soil column down to the bottom; two dawn-amber root highlights
  surface in the bark for warmth, and a couple of loam-shadow cells anchor the
  bottom row as the ground line. Sits across most of every round.
- **`slope_up_22`** — Gentle 22° uphill (1 vertical rise per 3 horizontal). The
  top edge rises ~5-6 px from left to right across the tile; cells above the
  rising edge are transparent so the sky / parallax shows through. The
  silhouette starts at the top-right corner and stair-steps down to the
  middle-left; under-loam fills the body below. Reads as "gentle uphill"
  visually.
- **`slope_up_45`** — Steep 45° uphill (1:1). The top edge rises diagonally
  across the entire tile, from middle-right at the top to bottom-left at the
  bottom. A heavier root-knot at the top-right crest — a single dawn-amber
  highlight cell — telegraphs the steep beat.
- **`slope_dn_22`** — Gentle downhill, mirror of `slope_up_22` along the Y
  axis. The top edge falls left-to-right across the tile.
- **`slope_dn_45`** — Steep downhill, mirror of `slope_up_45`. Heavier
  root-knot at the top-left crest.
- **`rock_small`** — One-tile-tall standalone boulder. Wider at the base; a
  rounded top with a river-stone highlight catching dawn light on the upper-
  left, and a moss patch on the shaded right side. Designed to composite ON
  TOP of a flat-ground tile beneath it: rows below 12 are transparent so the
  underlying floor shows through. (Authoring rule for level-data: place
  `rock_small` in the same column as a `flat` ground tile.)
- **`mile_1`**, **`mile_2`**, **`mile_3`**, **`mile_4`** — Per release-master
  decision Q4, the round-numerals are baked as **digits** (NOT notch marks).
  Each tile shows a weathered wooden post (wet-bark-brown shaft + cuff-cream
  plank crossbar). The plank face carries the digit in violet ink:
  - **`mile_1`**: a single vertical bar with a small serif at top (rows 4-7,
    columns 5-8). Reads "1".
  - **`mile_2`**: top horizontal + top-right vertical + middle horizontal +
    bottom-left vertical + bottom horizontal. Reads "2".
  - **`mile_3`**: top horizontal + right-side vertical + middle horizontal +
    right-side vertical + bottom horizontal. Reads "3".
  - **`mile_4`** *(v0.50.2)*: top-left vertical + top-right vertical + middle
    horizontal joining them + bottom-right vertical descending below the
    middle. Classic 7-segment "4" — three ink-cells per side at the top, then
    a one-cell horizontal joiner, then a single ink column on the right
    descending. Reads "4".

  The plank face uses cuff-cream (`#e8d4a0`) so the digit reads dark-on-light;
  a dawn-amber notch above the post-shaft head catches morning sun (per cast
  brief §9.1). Mile-markers are entities in level-data; the tile keys here are
  the visual component the entity renders.

  > **v0.50.2 mile-marker shift.** v0.50.1 placed `mile_1` / `_2` / `_3`
  > between rounds (post-Round-1 = Round 2 marker, etc.). v0.50.2 shifts
  > markers to round STARTS — Round 1 marker at the stage entry, Round 2
  > marker at the screen where Round 2 begins, Round 3 marker at Round 3,
  > Round 4 marker at Round 4. Hence the new `mile_4` tile: there are now
  > four start-markers and one boundary cairn. The cairn at the end of
  > Round 4 (at the stage-clear boundary) is unchanged in art.

- **`cairn`** — Boundary cairn. Stack of three river-stones, sigil-stone
  topmost. Larger silhouette than the mile-marker — the cairn occupies a wider
  chunk of the tile (rows 1-15, columns 1-15). Stones render in three river-
  stone tones for stack readability: base stones use river-stone-grey
  (`#7a8088`) with highlight (`#a8b0b8`) and shadow (`#4a5058`); the topmost
  stone uses cuff-cream (`#e8d4a0`) for the carved sigil — picked to visually
  echo the mile-marker plank face so the player reads "this is the same kind
  of trail-marker, larger and more permanent."

### Animated tile

- **`fire_low`** — **animated**, `{ frames: [3 matrices], fps: 8 }`. A flickering
  low fire patch with three flame-tongues. NO smoke layer (cast §8 said
  "smoke-curl velvet-shadow" optional; we omit it for visual cleanliness — the
  velvet under-flame wash on the bottom row carries the same mood). NO PURE
  BLACK — the lowest cell is `velvet under-flame` (`#5a4a6e`), per `world.md`.
  - **frame 0** — neutral: center tongue tallest, side tongues shorter.
    Three discrete tongues read "low patch fire."
  - **frame 1** — lean-left: tongues all bend slightly leftward; right-side
    tongue is shortest in this frame. Center tongue's tip migrates one cell
    left.
  - **frame 2** — lean-right: mirror of frame 1; center tip migrates right,
    left-side tongue shortest.
  Looped F0→F1→F2→F0 at 8 fps reads as flicker. Per cast §8.1 the brief allowed
  4 frames; we ship 3 frames for module size + readability — the cycle loop
  feels just as alive at 3 frames and is cheaper to cache.

## Animated-tile contract change

This PR extends `docs/design/contracts.md` to allow `TILES[key]` to be either:

```js
TILES[key] = matrix                            // static (existing)
TILES[key] = { frames: [matrix, ...], fps }    // animated (new)
```

`fire_low` is the only animated tile in v0.50. The matrix shape is unchanged
(16 × 16 art-pixels per matrix). Old static tiles remain valid; renderer
detects animated entries by `Array.isArray(value) === false && value.frames`.

## Palette overlap with Phase 1

9 hex values are reused verbatim from Phase 1 modules (per
[`palette-phase2.md`](./palette-phase2.md)): `#3a2e4a` (violet ink), `#4a7c3a`
(moss-green base), `#2e5028` (moss-green dark), `#e8d4a0` (cuff-cream),
`#e8a040` (dawn-amber), `#f8d878` (pale-gold), `#5a3a22` (bark base),
`#4a3422` (wet-bark — shared with Mossplodder), and the universal
`#00000000` transparent index. The remaining 7 hexes in this tile module are
new to Phase 2 (loam tones, fire warmth, river-stone family).

# Preview — `assets/tiles/area1-stage2-shore.js`

> **한국어 버전:** [`preview-tile-stage2-shore.ko.md`](./preview-tile-stage2-shore.ko.md)

| Field         | Value                                       |
|---------------|---------------------------------------------|
| Path          | `assets/tiles/area1-stage2-shore.js`        |
| Stage         | Stage 2 — beach / shore                     |
| Tile matrix   | 16 × 16 art-pixels per tile                 |
| Display size  | 48 × 48 canvas px (3× scale; matches `TILE = 48`) |
| Palette       | 18 entries                                  |
| Tile keys     | 12 keys (10 static + 1 animated + stage_exit) |

Per the v0.75 theme remap, the shore is now Stage 2 in the sequence
forest → shore → cave → dark forest (the slot was a waterside in the
previous build). The module rename was `git mv area1-stage3-water.js
area1-stage2-shore.js`. The palette hex values, matrix data, and tile
keys are retained verbatim — the same wet-stone + sea-water + dawn-amber
reflection grammar reads as sun-warmed beach just as well as it read as
riverside, so only header labels and tile-key narration shifted.

The shore tileset mirrors `assets/tiles/area1.js` and
`area1-stage3-cave.js` in structure (same locomotion shapes, same mile-
marker chain, same META). Stage 2's signature is **water-as-hazard**: the
`water_gap` tile draws visible sea-water (instead of empty sky) below the
playable floor, and falling into it is 1-hit-kill (same death rule as a
normal gap — Reed falls below the playable row and the existing v0.50.2
dying FSM fires).

## Tile keys

### Static tiles

- **`flat`** — Sun-warmed shore-shelf floor. Top 2 rows are the shore-moss
  strip — salt-tolerant tide-line moss that grows along the shelf-top
  where dawn sun reaches it (sea-tinged green, slightly cooler than the
  forest's moss). Next 4 rows are wet-shelf-stone main face. Below that,
  deeper shadow with occasional ripple-pale or cave-stone catchlight
  specks (the shelf is damp from the tide — it catches light at random
  points). Bottom 3 rows are the shelf shadow band.
- **`slope_up_22`** — Gentle 22° uphill, wet-shelf-stone palette.
- **`slope_up_45`** — Steep 45° uphill. A dawn-amber catch on the upper-
  right crest reads as "the sea-water below catches the dawn sun and the
  reflection lands on the slope's crest" — the visual touchstone of the
  shore (warm-from-above + cool-from-below).
- **`slope_dn_22`** — Gentle downhill.
- **`slope_dn_45`** — Steep downhill. Catchlight on the top-left crest.
- **`rock_small`** — Tide-line boulder. Same authoring convention
  (transparent below row 12 to composite over a flat tile). Uses Stage 1/
  Stage 3's river-stone palette verbatim with a single **shore-moss** patch
  on the shaded side (sea-tinged green, slightly cooler than Stage 1's
  forest-moss patch).
- **`mile_1`-`mile_4`** — Round signposts, shared chain. Same post +
  plank + digit shape as Stages 1, 3, 4.
- **`stage_exit`** — Within-area transition gate, shore variant. Same
  arch silhouette as `area1-stage3-cave.js`'s `stage_exit`, retinted: the
  supporting pillars are wet-shelf-stone (paler than cave-stone) and the
  crossbeam is the same dawn-amber + pale-gold glow with a moss-dark sigil
  cell. Reads as "doorway to the next stretch of trail."

### Animated tile

- **`water_gap`** — **animated**, `{ frames: [3 matrices], fps: 3 }`. The
  Stage 2 signature hazard. Visually sea-water (NOT empty sky), kills
  Reed if he falls into it (same death rule as a normal gap-fall per
  v0.50.2 dying FSM). The renderer draws this tile where Stage 1 would
  have drawn nothing (transparent).

  Visual layout:
  - **Top row:** dawn-amber + pale-gold reflection band (the dawn sun
    catches the open water surface).
  - **Surface band (rows 2-7):** sea-deep main face with subtle ripple-
    pale highlights scattered across the surface (sea-foam catching the
    morning light). A few sea-deep-dark cells at the surface-to-body
    transition.
  - **Body (rows 8-15):** sea-deep-dark — the water is deep enough to
    read "do not enter." A few sea-deep highlights migrate across the
    body for subtle wave motion.

  Decision recorded:
  - **`water_gap` IS animated** (3 frames @ 3 fps). The brief allowed
    static or 2-3 frames at low fps; we ship 3 frames to give the water
    the same visual aliveness the fire and crystal-vein hazards have in
    Stages 1 and 3. The 3 fps is slower than `crystal_vein`'s 6 fps and
    much slower than `fire_low`'s 8 fps — water at the shore moves with
    a tide rhythm, not the quick flicker of fire.
  - **`water_gap` is the only hazard tile in Stage 2.** No fire-
    equivalent, no crystal-vein-equivalent. Stage 2's signature beat is
    the tide-water rhythm — adding an inland hazard would crowd that
    read.

  Frame cycle:
  - **frame 0** — neutral water surface. Surface highlights at scattered
    positions; reflection band has a mix of dawn-amber and pale-gold
    sparkles across the top row.
  - **frame 1** — ripple-shifted left. Surface highlights migrate 1 cell
    left; reflection sparkle distribution rotates.
  - **frame 2** — ripple-shifted right. Surface highlights migrate 1 cell
    right; reflection sparkles distribute differently again. Loop
    F0→F1→F2→F0 at 3 fps reads as slow tide motion.

## Decision recorded — palette retained verbatim

The previous PR's water palette already read as open water under dawn
light. We kept all 18 hex values byte-for-byte identical across the
rename — `#3a586a` (renamed in this header from "river-deep" to "sea-
deep"), `#6a8a4a` ("bank-moss" → "shore-moss / sea-tinged"), `#6a90a8`
("ripple-pale" / "sea-foam"), etc. This keeps the cumulative project
palette stable across the theme remap (no Phase 3 hexes added or removed
on the Stage 2 side). The narrative labels shifted; the actual pixels did
not.

## Palette overlap with earlier phases

11 of the 18 hex entries are reused verbatim from Phases 1, 2, and the
Phase 3 cave tileset. Per `palette-phase3.md`:

- Phase 1 + 2 shared: violet ink, dawn-amber, pale-gold, cuff-cream,
  wet-bark, loam-shadow, moss-green dark, transparent.
- Phase 2-only shared (from `area1.js`): river-stone-grey base, river-
  stone shadow, river-stone highlight.
- Phase 3 shared (from `area1-stage3-cave.js`): cave-stone catchlight
  (`#c8d4c8`) — used here as the shelf catch-light highlight.

The remaining 6 hexes are new to Phase 3 shore: `#8a9a96`, `#5a6a6a`
(wet-shelf-stone family); `#6a8a4a` (shore-moss / sea-tinged); `#3a586a`,
`#2a4258` (sea-deep family); `#6a90a8` (ripple-pale / sea-foam).

## Cross-stage consistency notes

- Locomotion + signpost shapes carry over from Stage 1 verbatim.
- `rock_small` is composite-on-flat — same authoring rule.
- `water_gap` plays the *same role* as Stage 1's `fire_low` and Stage 3's
  `crystal_vein` in level-data placement: dev-lead puts the entity in a
  column that breaks the playable floor, and Reed dies if he falls into
  it. The death mechanism is the existing gap-fall (Reed falls below the
  playable row → v0.50.2 dying FSM fires); the visual is the new water
  surface drawn under the playable row.

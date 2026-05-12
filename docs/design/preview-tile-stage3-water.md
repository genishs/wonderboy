# Preview — `assets/tiles/area1-stage3-water.js`

> **한국어 버전:** [`preview-tile-stage3-water.ko.md`](./preview-tile-stage3-water.ko.md)

| Field         | Value                                       |
|---------------|---------------------------------------------|
| Path          | `assets/tiles/area1-stage3-water.js`        |
| Stage         | Stage 3 — Brinklane (waterside)             |
| Tile matrix   | 16 × 16 art-pixels per tile                 |
| Display size  | 48 × 48 canvas px (3× scale; matches `TILE = 48`) |
| Palette       | 18 entries                                  |
| Tile keys     | 12 keys (10 static + 1 animated + stage_exit) |

The waterside tileset mirrors `area1.js` / `area1-stage2-cave.js` in
structure (same locomotion shapes, same mile-marker chain, same META).
Stage 3's signature is **water-as-hazard**: the new `water_gap` tile draws
visible river-water (instead of empty sky) below the playable floor, and
falling into it is 1-hit-kill (same death rule as a normal gap — Reed
falls below the playable row and the existing v0.50.2 dying FSM fires).

## Tile keys

### Static tiles

- **`flat`** — Stone-shelf floor. Top 2 rows are the bank-moss strip — moss
  that grows along the shelf-top where sunlight from the sky-strip overhead
  reaches it (greener than Stage 2's cave moss). Next 4 rows are wet-shelf-
  stone main face. Below that, deeper shadow with occasional ripple-pale or
  cave-stone catchlight specks (the shelf is wet — it catches light at
  random points). Bottom 3 rows are the shelf shadow band.
- **`slope_up_22`** — Gentle 22° uphill, wet-shelf-stone palette.
- **`slope_up_45`** — Steep 45° uphill. A dawn-amber catch on the upper-
  right crest reads as "the river-water below catches the sky-strip from
  above and that reflection lands on the slope's crest" — the visual
  touchstone of Brinklane (warm-from-above + cool-from-below).
- **`slope_dn_22`** — Gentle downhill.
- **`slope_dn_45`** — Steep downhill. Catchlight on the top-left crest.
- **`rock_small`** — Bank-edge boulder. Same authoring convention (transparent
  below row 12 to composite over a flat tile). Uses Stage 1/2's river-stone
  palette verbatim with a single **bank-moss** patch on the shaded side
  (greener than Stage 2's cave-rock moss, reflecting that the bank gets
  sunlight from the sky-strip).
- **`mile_1`-`mile_4`** — Round signposts, shared chain. Same post + plank +
  digit shape as Stages 1, 2, 4.
- **`stage_exit`** — Within-area transition gate, waterside variant. Same
  arch silhouette as `area1-stage2-cave.js`'s `stage_exit`, retinted: the
  supporting pillars are wet-shelf-stone (paler than cave-stone) and the
  crossbeam is the same dawn-amber + pale-gold glow with a bank-moss-dark
  sigil cell. Reads as "the cave's door out, now seen from above water."

### Animated tile

- **`water_gap`** — **animated**, `{ frames: [3 matrices], fps: 3 }`. The
  signature Brinklane hazard. Visually water (NOT empty sky), kills Reed
  if he falls into it (same death rule as a normal gap-fall per v0.50.2
  dying FSM). The renderer draws this tile where Stage 1 would have drawn
  nothing (transparent).

  Visual layout:
  - **Top row:** dawn-amber + pale-gold reflection band (the sky-strip from
    overhead catches the water surface).
  - **Surface band (rows 2-7):** river-deep main face with subtle ripple-
    pale highlights scattered across the surface. A few river-deep-dark
    cells at the surface-to-body transition.
  - **Body (rows 8-15):** river-deep-dark — the river is deep enough to
    read "do not enter." A few river-deep highlights migrate across the
    body for subtle wave motion.

  Decision recorded:
  - **`water_gap` IS animated** (3 frames @ 3 fps). The brief allowed
    static or 2-3 frames at low fps; we ship 3 frames to give the water
    the same visual aliveness the fire and crystal-vein hazards have in
    Stages 1 and 2. The 3 fps is slower than `crystal_vein`'s 6 fps and
    much slower than `fire_low`'s 8 fps — water moves more slowly than
    fire, by mood and physics both.
  - **`water_gap` is the only hazard tile in Stage 3.** No fire-equivalent,
    no crystal-vein-equivalent. Per story brief §6 hazard tables, Stage 3's
    signature beat is the water rhythm — adding an inland hazard would
    crowd that read. The brief explicitly leaves it open ("Re-read the
    brief to confirm"); story brief §6 hazard tables list only `water_gap`
    as Stage 3's hazard (`crystal_vein` lives in Stage 2; `water_gap`
    lives in Stage 3; no overlap).

  Frame cycle:
  - **frame 0** — neutral water surface. Surface highlights at scattered
    positions; reflection band has a mix of dawn-amber and pale-gold
    sparkles across the top row.
  - **frame 1** — ripple-shifted left. Surface highlights migrate 1 cell
    left; reflection sparkle distribution rotates.
  - **frame 2** — ripple-shifted right. Surface highlights migrate 1 cell
    right; reflection sparkles distribute differently again. Loop
    F0→F1→F2→F0 at 3 fps reads as slow water motion.

## Decision recorded — optional `bank_reed` deferred

The brief mentions `bank_reed` as an optional Stage 3 decoration (tall
reeds along the bank-edge, static or 2-frame breeze). **Not shipped in
this PR.** Reasoning: design-lead defers it to a future patch once Stage 3
round-data confirms a concrete placement requirement. The story brief's
round-data tables (§6.1-6.4) reference Mossplodders, Hummerwings, rocks,
and water-gaps — no `bank_reed` placement is called out. Adding the
decoration with no placement would be data with no caller.

## Palette overlap with earlier phases

11 of the 18 hex entries are reused verbatim from Phases 1, 2, and the
Phase 3 cave tileset. Per `palette-phase3.md`:

- Phase 1 + 2 shared: violet ink, dawn-amber, pale-gold, cuff-cream,
  wet-bark, loam-shadow, moss-green dark, transparent.
- Phase 2-only shared (from `area1.js`): river-stone-grey base, river-stone
  shadow, river-stone highlight.
- Phase 3 shared (from `area1-stage2-cave.js`): cave-stone catchlight
  (`#c8d4c8`) — used here as the shelf catch-light highlight.

The remaining 6 hexes are new to Phase 3 waterside: `#8a9a96`, `#5a6a6a`
(wet-shelf-stone family); `#6a8a4a` (bank-moss); `#3a586a`, `#2a4258`
(river-deep family); `#6a90a8` (ripple-pale).

## Cross-stage consistency notes

- Locomotion + signpost shapes carry over from Stage 1/2 verbatim.
- `rock_small` is composite-on-flat — same authoring rule.
- `water_gap` plays the *same role* as Stage 1's `fire_low` and Stage 2's
  `crystal_vein` in level-data placement: dev-lead puts the entity in a
  column that breaks the playable floor, and Reed dies if he falls into
  it. The death mechanism is the existing gap-fall (Reed falls below the
  playable row → v0.50.2 dying FSM fires); the visual is the new water
  surface drawn under the playable row.

# Preview — `assets/tiles/area1-stage3-cave.js`

> **한국어 버전:** [`preview-tile-stage3-cave.ko.md`](./preview-tile-stage3-cave.ko.md)

| Field         | Value                                       |
|---------------|---------------------------------------------|
| Path          | `assets/tiles/area1-stage3-cave.js`         |
| Stage         | Stage 3 — Sumphollow (cave)                 |
| Tile matrix   | 16 × 16 art-pixels per tile                 |
| Display size  | 48 × 48 canvas px (3× scale; matches `TILE = 48`) |
| Palette       | 18 entries                                  |
| Tile keys     | 13 keys (11 static + 1 animated + 1 cairn reserved) |

Per the v0.75 theme remap, the cave is now Stage 3 in the sequence
forest → shore → cave → dark forest (it was Stage 2 in the previous build).
The file rename was `git mv area1-stage2-cave.js area1-stage3-cave.js`;
the matrix data, palette, and animation frames are byte-for-byte identical
to the previous PR — only the stage slot and header references shifted.

The cave tileset mirrors `assets/tiles/area1.js` in structure (same locomotion
shapes, mile-marker chain, same `META = { tile: 16, scale: 3, displayPx: 48 }`)
and adds two stage-specific keys: `crystal_vein` (animated hazard) and
`stage_exit` (within-area transition gate). `cairn` is declared for schema
symmetry but is not emitted by Stage 3 round-data.

## Tile keys

### Static tiles

- **`flat`** — Standard cave-floor. Top 2 rows are the cave-moss-blue-green
  strip (the cave's signature: moss that's gone blue-green because less sun
  reaches it). Next 4 rows are wet-cave-stone main face; below that, deeper
  stone shadow with occasional cave-stone catchlight specks (the cave is wet,
  so mineral grains catch what little light finds its way down). The bottom
  two rows are the cave under-base, a deep grey-blue that is **emphatically
  not black** per `docs/story/world.md`.
- **`slope_up_22`** — Gentle 22° uphill. Same stair-step rise as Stage 1's
  slope_up_22 but cave-tinted: cave-moss strip on the rising lip, wet-cave-
  stone body, cave under-base in the footing rows.
- **`slope_up_45`** — Steep 45° uphill. A single dawn-amber catch-light at
  the upper-right crest reads as "the vein-glow finding the rising edge."
  This replaces Stage 1's dawn-amber root-knot at the crest with a slightly
  warmer cave-equivalent.
- **`slope_dn_22`** — Gentle downhill, mirror of `slope_up_22`.
- **`slope_dn_45`** — Steep downhill, mirror of `slope_up_45`. Catchlight on
  the top-left crest.
- **`rock_small`** — Standalone cave-rock. Same authoring convention as
  Stage 1: transparent below row 12 so it composites on top of a `flat`
  tile. Uses the river-stone palette (shared verbatim with Stage 1) but
  the moss patch on the shaded side is **cave-moss-blue-green dark** instead
  of forest moss. Reads as "same rock geometry, cave-tinted environment."
- **`mile_1`**, **`mile_2`**, **`mile_3`**, **`mile_4`** — Round signposts.
  The post (wet-bark + cuff-cream plank + violet-ink digit) is **shared
  verbatim** with Stage 1's mile-markers; only the digit value changes.
  Design rationale: the mile-marker is the trail chain across all four
  stages of Area 1 — the player reads "the same trail, my count continues."
  Per-stage retinting of the post would break that read. Digits 1-4 use the
  same baked-pixel digit shapes as Stage 1 (see `preview-tile-area1.md` for
  digit-shape details).
- **`stage_exit`** — **NEW Phase 3 tile key.** Within-area stage-to-stage
  transition gate. Visually: a short cave-stone arch with a glowing dawn-
  amber + pale-gold crossbeam spanning two river-stone-grey pillars. A
  single moss-green-dark sigil cell inside the crossbeam echoes the stage's
  own palette so the player reads "this is the cave's door out." Reads as
  "doorway you walk through," distinct from `mile_1..4` (post + plank +
  digit) and from `cairn` (stone stack).

  **Decision recorded.** The brief allowed either (a) reusing the `cairn`
  key with stage-3 palette retint, or (b) introducing a new `stage_exit`
  key. We chose (b) for clearer semantics: in level-data, `cairn` always
  means *end-of-Area Cleared trigger*; `stage_exit` always means *within-
  area chain to next stage*. The same `stage_exit` key + visual is used by
  the Stage 2 shore tileset (retinted to wet-shelf-stone).

- **`cairn`** — Reserved for end-of-Area (end of Stage 4). Defined in this
  module for schema parity with `assets/tiles/area1.js` so renderer + dev
  code can scan a uniform key set across tilesets. **In practice Stage 3
  round-data never emits this key.** The end of Round 3-4 emits
  `stage_exit`. If a future tileset wants to refer to the cave-tinted cairn
  art (decorative use, not gameplay), it is here; for the actual Area-clear
  beat, see `area1-stage4-darkforest.js`'s cairn (which is the canonical
  Area 1 closure marker).

### Animated tile

- **`crystal_vein`** — **animated**, `{ frames: [3 matrices], fps: 6 }`.
  The cave's fire-equivalent hazard: a hairline glowing crack in the cave
  floor that's **1-hit-kill on Reed contact** (same rule as Stage 1's
  `fire_low`). Visually distinct from fire: **no flame tongues, no upward
  rise.** It is a steady glow on the stone surface — dawn-amber main band
  with pale-gold sparkle clusters, a velvet under-flame wash on the lowest
  row (no pure black). The cave version is **slower than fire** (6 fps
  versus fire's 8 fps) — the cave breathes more slowly than the forest.

  **Tile key chosen as `crystal_vein`** (recommended by release-master
  alongside `amber_vein`). Decision rationale: `crystal_vein` reads
  crystalline / mineral, matching the cave's "amber leaking through rock"
  fiction; `amber_vein` would imply biological. The crystalline read is
  also slightly more legible at 16-cell resolution — the sparkle clusters
  look like mineral facets, not flame.

  - **frame 0** — neutral pulse. A hairline crack running diagonally across
    the floor; main band dawn-amber with two pale-gold cluster points (left
    cluster centered around col 6, right cluster around col 13).
  - **frame 1** — brighter pulse: more pale-gold sparkles surface in both
    clusters (the vein "breathes in"). The crack outline stays the same;
    sparkle distribution rotates and grows.
  - **frame 2** — dim pulse (the vein "breathes out"): only the central
    cluster + the base wash remain visible; outer sparkles fade. Loop
    F0→F1→F2→F0 reads as a slow respiratory glow.

## Palette overlap with earlier phases

11 of the 18 hex entries in this tile module are **reused verbatim** from
Phases 1 and 2 (per `palette-phase3.md`):

- Phase 1 + 2 shared: `#3a2e4a` (ink), `#e8a040` (dawn-amber), `#f8d878`
  (pale-gold), `#e8d4a0` (cuff-cream), `#4a3422` (wet-bark), `#5a3a22`
  (loam-shadow), `#2e5028` (moss-green dark), `#00000000` (transparent).
- Phase 2-only shared (from `assets/tiles/area1.js`): `#7a8088` (river-
  stone-grey), `#4a5058` (river-stone shadow), `#a8b0b8` (river-stone
  highlight), `#5a4a6e` (velvet under-flame).

The remaining 6 hexes are new to Phase 3 and form the cave's signature
palette: `#3a5e58` and `#284844` (cave-moss-blue-green base + dark);
`#6a7878`, `#4a5860`, `#3a4248` (wet-cave-stone family + under-base);
`#c8d4c8` (cave-stone catchlight). See `palette-phase3.md` for the full
palette inventory.

## Cross-stage consistency notes

- Locomotion shapes (`flat`, `slope_*`) are visually distinct from Stage 1's
  but **gameplay-identical**: same tile dimensions, same slope angles, same
  authoring rule (slopes' transparent cells let sky/parallax show through).
- `rock_small` shares Stage 1's silhouette and the same composite-onto-flat
  authoring rule — Reed's collision behavior is unchanged.
- `crystal_vein` shares Stage 1's `fire_low` *interaction contract*: 1-hit-
  kill on Reed contact, Mossplodder walks-into-it dies, Hummerwing untouched.
  Renderer treats both the same; only the visual differs.
- The mile-marker post is identical across all four stages by design (see
  `mile_1`-`mile_4` notes above).

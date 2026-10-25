# Preview — `assets/tiles/area1-stage4-darkforest.js`

> **한국어 버전:** [`preview-tile-stage4-darkforest.ko.md`](./preview-tile-stage4-darkforest.ko.md)

| Field         | Value                                       |
|---------------|---------------------------------------------|
| Path          | `assets/tiles/area1-stage4-darkforest.js`   |
| Stage         | Stage 4 — The Old Threshold (dark forest)   |
| Tile matrix   | 16 × 16 art-pixels per tile                 |
| Display size  | 48 × 48 canvas px (3× scale; matches `TILE = 48`) |
| Palette       | 21 entries                                  |
| Tile keys     | 12 keys (10 static + 1 animated decoration + cairn) |

Per the v0.75 theme remap, Stage 4's theme is a moonlit dark forest
instead of the previously contemplated ancient ruins. Mood keywords: deep
blue-green canopy shadow, violet-black undertones, silver moonlight,
gnarled root system. The palette is the **opposite tonal corner** of
Stage 1's "kettle-warm forest morning" — same forest grammar (moss top +
earth body + bark + occasional highlight), opposite tonal mood. The
sequence forest → shore → cave → dark forest is a universal action-
platformer cadence; every tile design here is authored fresh for this
project — no tracing, no recoloring of any reference imagery, no original-
game visual motifs reused.

## Tile keys

### Static tiles

- **`flat`** — Dark-forest floor. Top 2 rows: dark-canopy blue-green moss
  strip (the moonlit cousin of Stage 1's kettle-warm moss — same role,
  cooler hue). Rows 2-5: dry-bark-pale main face — the weathered trunk-
  toned floor surface, a warm-cool grey that reads as "bark of an old
  tree felled across the path." Rows 6-13: bark-shadow body with
  occasional moonlit-lichen overlay specks and rare moonlight catch
  highlights where dew finds a level surface. Bottom 2 rows: dark-forest
  under-base — a violet-black undertone (`#1e2032`) that is deliberately
  **NOT pure black** per `docs/story/world.md`. Among all four stages'
  flat tiles this is the darkest, but it still has a violet bias rather
  than reading as void.
- **`slope_up_22`** — Gentle uphill, dark-forest-tinted. Same stair-step
  rise as Stage 1's `slope_up_22`.
- **`slope_up_45`** — Steep uphill. A single moonlight-silver-cream catch
  on the upper-right crest reads as "moonlight finding the rising edge"
  — the dark forest's equivalent of Stage 1's dawn-amber root catchlight
  and Stage 3's amber vein-glow at the crest. The mood-equivalent is
  cool instead of warm.
- **`slope_dn_22`** — Gentle downhill.
- **`slope_dn_45`** — Steep downhill. Moonlight catchlight on the top-
  left crest.
- **`rock_small`** — Gnarled dark-forest boulder. Same authoring
  convention as Stages 1-3 (transparent below row 12 to composite over a
  flat tile). The silhouette differs visually from Stage 1's warm-brown
  rock: cooler river-stone-grey base with a clear **canopy-shadow-violet
  undercut** on the right (the under-canopy violet shadow that lives
  under any object in this forest) and sparse **pale-moss highlights** on
  the moonlit upper-left (the only green on the rock — moonlit moss
  rather than the sun-fed moss of Stage 1). Reads as "the same rock
  geometry, deep-night tonal corner." **Gameplay role unchanged** — same
  stumble behavior as Stage 1's rock.
- **`mile_1`-`mile_4`** — Round signposts, shared chain. Same post +
  plank + digit shape as Stages 1, 2, 3. The plank face is the same
  cuff-cream and the digit is the same violet-ink shape — under canopy
  the cream stays bright enough to read clearly even though the post
  itself fades into the dark-forest tonality. `mile_4` is the last round
  of Area 1 — the marker that points the player toward the boss's
  ante-clearing.
- **`cairn`** — **END-OF-AREA boundary cairn.** Stack of three moss-
  flecked stones with a single dawn-amber sigil-fleck on the topmost
  stone (the only amber in the Stage 4 tileset outside the boss arena,
  by deliberate foreshadowing — the player walks past the moonlight-
  streak decorations all stage and reads "nothing warm here," then this
  cairn reveals one ember at the top, and immediately after the Bracken
  Warden's chest sigil rises in that same amber family). The cairn body
  is river-stone-grey with tree-bark-shadow undercuts and pale-moss
  accents on the moonlit upper faces; the topmost stone carries a cuff-
  cream rim with the dawn-amber sigil-fleck nested inside.

  Visually distinct from `stage_exit` (the cave/shore arch with a
  horizontal crossbeam — used in Stages 2-3) so the player reads "this
  is the end of the road, not just another door." Visually distinct
  from Stage 1's cairn (Stage 1: pure cream sigil; Stage 4: amber-fleck
  sigil) so the player reads "the journey has accumulated; the marker
  has warmed by one ember." The Stage 4 cairn is the Area 1 closure
  marker — fired by dev-lead's level-data only after the Bracken Warden
  is defeated.

### Animated decoration (NOT a hazard)

- **`moonlight_streak`** — **animated**, `{ frames: [3 matrices], fps: 3 }`.
  A subtle horizontal streak across the upper portion of the tile,
  showing moonlight catching dew or phosphorescent moss along a forest-
  floor path. **Decoration only** — Reed walks over it without
  consequence. Used in Round 4-2, 4-3 (decorative runs) and especially
  Round 4-4 (the long convergent stripe approaching the boss arena
  entrance).

  Visual layout:
  - **Top region (rows 1-6):** the streak itself — a 14-cell-wide band
    of dark-canopy blue-green with scattered moonlight-silver-cream and
    dark-canopy-mid specks. Cells outside the streak (rows 0 and the
    sides) are transparent so the surrounding `flat` tiles show through.
  - **Mid + bottom (rows 7-15):** the dark-forest floor body — same
    content as `flat`'s lower portion, so a `moonlight_streak` tile slots
    into a `flat`-tile row without a visual seam. The streak reads as
    "moonlight finding a level patch of forest floor between roots."

  Decision recorded:
  - **3 frames @ 3 fps** — the same rhythm slot as the cave's
    `crystal_vein` (replacing the previous build's ruin `dawn_channel` at
    2 fps). Three frames give a clearer "dew sparkles shift" rhythm than
    two would; the 3 fps is gentle enough for a dark-forest atmosphere
    (faster than 2 fps would feel "fizzy" against the slow canopy mood).
  - **NOT a hazard.** Decorative only. Reed walks over it. The only
    place dawn-amber appears in Stage 4 outside the boss arena is the
    cairn sigil-fleck (see above) — moonlight_streak deliberately uses
    silver-cream instead of amber for that pre-foreshadowing read.

  Frame cycle:
  - **frame 0** — neutral pulse. Streak shows a scattered mix of dark-
    canopy mid and silver-cream specks distributed evenly across the
    band.
  - **frame 1** — denser sparkle. More silver-cream specks surface (the
    dew has shifted to catch more facets). Same streak silhouette,
    sparkle distribution densifies.
  - **frame 2** — sparse sparkle. Sparkles concentrate to a small
    central cluster; outer cells return to dark-canopy. Loop F0→F1→F2→F0
    reads as "moonlight catches dew, dew shifts, catches again."

## Decisions recorded — no hazard tiles

**Stage 4 has no hazard tiles.** No `fire_low`, no `crystal_vein`, no
`amber_vein`, no `water_gap`. Reed's death paths in Stage 4 are
exclusively:
- Mossplodder body contact (existing v0.50 rule)
- Boss body contact (added in `phase3-boss-cast.md`)
- Moss-pulse shockwave contact (added in `phase3-boss-cast.md`)
- Gap-fall (existing v0.50.2 rule)

The `moonlight_streak` is the only Phase 3 tile in this module that is
*not* in the locomotion or signpost set, and it is decoration only.

## Decision recorded — no boss-arena-floor variant

The story brief left open a "boss-arena-floor variant for the 12-tile-
wide arena." **Not shipped.** Reasoning: the boss arena uses the same
`flat` dark-forest floor (cols 32-43 of Round 4-4). The upper rows of
the arena stay visually quiet because the `flat` tile is already quiet
at its top (just the 2-row dark-canopy strip); the HUD strip needs ~76
px of clear space at the top of the screen, and the existing `flat`
reads correctly under the Warden's silhouette. Adding a unique "boss-
arena floor" tile would add data with no visual benefit.

## Palette overlap and new hexes — Phase 3 dark-forest

21 of the palette entries overall. Of these:

- **8 reused from Phase 1 + 2** (universal): violet ink (`#3a2e4a`),
  moss-green base (`#4a7c3a`), moss-green dark (`#2e5028`), cuff-cream
  (`#e8d4a0`), wet-bark-brown (`#4a3422`), loam-soil shadow (`#5a3a22`),
  dawn-amber (`#e8a040`), transparent.
- **3 reused from Phase 2 `area1.js`**: river-stone-grey (`#7a8088`),
  river-stone shadow (`#4a5058`), river-stone highlight (`#a8b0b8`).
- **5 hexes re-roled from the previous PR's ruin / boss palettes** (hex
  values kept identical so the cumulative project palette stays stable):
  `#684e6e` (was "pillar-shadow-violet" — now "canopy-shadow-violet,"
  the deep undergrowth violet), `#8a8478` (was "carved-stone-pale" —
  now "dry-bark-pale," weathered trunk face), `#a89c80` (was "carved-
  stone highlight" — now "moonlit bark crest"), `#5a5448` (was "carved-
  stone shadow" — now "tree-bark-shadow"), `#7a7080` (was "mosaic-cool"
  — now "moonlit-lichen overlay").
- **1 reused from the boss sprite**: `#5a8a4a` (pale-moss highlight,
  same value as the boss's "cairn-mantle moss" — sparse on the dark-
  forest rocks).
- **4 hexes new to Phase 3 (introduced by this dark-forest module)**:
  - `#1e2032` — dark-forest under-base (deepest fill; not black; the
    only completely new dark hex in this tileset)
  - `#2a3a3a` — dark-canopy blue-green dark (canopy shadow body)
  - `#3e5a52` — dark-canopy blue-green mid (canopy moss top strip)
  - `#cfd8dc` — moonlight-silver-cream (moonlight catch / dew sparkle —
    the brightest single hex in this tileset, used for the slope crest
    catches and the moonlight_streak sparkles)

Total of 14 tile matrices (10 static + 3 frames of `moonlight_streak` +
1 cairn). See `palette-phase3.md` for the rolled-up project palette
inventory.

## Cross-stage consistency notes

- The mile-marker post is identical across all four stages (post +
  plank + digit shapes shared verbatim).
- `cairn` is reserved exclusively for end-of-Area. Stage 4 is the only
  stage that emits a `cairn` placement in level-data; Stages 1, 2, 3
  emit `stage_exit` at end-of-stage in v0.75.
- The canopy-shadow-violet hex (`#684e6e`) is shared with the Bracken
  Warden boss sprite (under-bracken / under-stone shadow). The player
  reads "the Warden is made of the same material as this forest" — the
  re-roling of the previous PR's pillar-shadow-violet into canopy-
  shadow-violet preserves that thematic continuity across the theme
  remap.
- The `dry-bark-pale` family (`#8a8478` / `#a89c80` / `#5a5448`) is
  shared with the Bracken Warden's stone joinery for the same reason
  — the boss sprite is intentionally built from the dark-forest floor's
  material vocabulary.

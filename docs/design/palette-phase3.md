# Phase 3 master palette

> Owner: design-lead. Companion to `docs/briefs/phase3-area1-expansion.md` and
> `docs/briefs/phase3-boss-cast.md`. Mood anchor: `docs/story/world.md` ("kettle-
> warm morning, woody not metallic, gentle not grim. Shadows are violet-grey,
> never black"). Phase 3 expands Area 1 from the forest seam (Stage 1) into the
> sun-warmed shore (Stage 2), the cave (Stage 3), and the moonlit dark forest
> (Stage 4), and adds the Area 1 boss — the Bracken Warden — plus a moss-pulse
> shockwave projectile.
>
> **Phase 1 doc:** [`palette.md`](./palette.md) — closed; do not modify.
> **Phase 2 doc:** [`palette-phase2.md`](./palette-phase2.md) — closed; do not modify.
> **한국어 버전:** [`palette-phase3.ko.md`](./palette-phase3.ko.md)

This file inventories every distinct hex value used by the **Phase 3** sprite
and tile modules added in v0.75, and notes which hexes are reused verbatim from
Phases 1 and 2 (so the project's visual chord stays unified). Per-module
palettes live inside each `.js` file and are tuned independently for byte cost;
this doc rolls them up.

## v0.75 hero rebuild addendum (24×36 res)

A second amendment in PR #27 rebuilt the hero sprite (`assets/sprites/hero-reed.js`)
from 16 × 24 art-pixels to 24 × 36 art-pixels, with calmer per-anim fps. Two new
palette concerns:

- **One genuinely new hex** introduced for higher-resolution skin shading:
  `#f4c898` (skin highlight — forehead / cheekbone / knuckle catchlight,
  one pale step lighter than the existing dawn-amber skin `#e8a878`). Stays
  inside the dawn-amber family so the warmth chord is preserved.
- **One existing Phase 3 hex reused** for tunic shoulder catchlight:
  `#5a8a4a` (cairn-mantle moss / pale moss highlight, originally introduced
  by `boss-bracken-warden.js` and the dark-forest tileset). No new hex; the
  reuse strengthens the tunic-as-moss-cloth read.

Both palette additions are inside `hero-reed.js`; no other Phase 3 module
gains an entry from this amendment.

The hero module's per-file PALETTE entry count grew from 18 (v0.50.2) to 20
(v0.75): +1 new hex `#f4c898`, +1 reused-from-Phase-3 hex `#5a8a4a`. Only the
former counts toward the cumulative project total.

## v0.75 theme remap notice

The Stage-2 / Stage-3 / Stage-4 themes were remapped mid-PR to the sequence
**forest → shore → cave → dark forest** (Stage 1 unchanged). The hex values
themselves were retained verbatim across the remap to keep the cumulative
project palette stable; the narrative labels and stage slot bindings shifted.
Specifically:
- The cave tileset (`area1-stage3-cave.js`) is the same content that previously
  shipped as `area1-stage2-cave.js` — palette unchanged, file renamed.
- The shore tileset (`area1-stage2-shore.js`) is the same content that
  previously shipped as `area1-stage3-water.js` — palette unchanged, hex
  labels in the source comments retuned (e.g. "river-deep" → "sea-deep",
  "bank-moss" → "shore-moss / sea-tinged"). The water-as-hazard role and
  the matrix data are byte-for-byte identical.
- The previous ruin tileset (`area1-stage4-ruins.js`) was deleted and replaced
  with the dark-forest tileset (`area1-stage4-darkforest.js`). Of the 5 hexes
  the ruin tileset had introduced, 4 are still used by the boss (`#684e6e`,
  `#8a8478`, `#a89c80`, `#5a5448`) and have been re-roled in the dark-forest
  tileset (pillar-shadow-violet → canopy-shadow-violet, carved-stone family
  → bark family). The 5th (`#7a7080`, mosaic-cool) is also re-roled in the
  dark-forest tileset as "moonlit-lichen overlay." All 5 hex values are
  unchanged across the theme remap.
- The dark-forest tileset introduces **4 genuinely new hex values**:
  `#1e2032` (dark-forest under-base), `#2a3a3a` (dark-canopy blue-green dark),
  `#3e5a52` (dark-canopy blue-green mid), `#cfd8dc` (moonlight-silver-cream).

## Phase 3 module roster

| Module                                              | Type   | Per-module palette length |
|-----------------------------------------------------|--------|--------------------------:|
| `assets/tiles/area1-stage2-shore.js`                | tile   | 18                        |
| `assets/tiles/area1-stage3-cave.js`                 | tile   | 18                        |
| `assets/tiles/area1-stage4-darkforest.js`           | tile   | 21                        |
| `assets/sprites/boss-bracken-warden.js`             | sprite | 18                        |
| `assets/sprites/projectile-moss-pulse.js`           | sprite | 9                         |
| `assets/sprites/hero-reed.js` (v0.75 rebuild)       | sprite | 20                        |

## Totals

| Metric                                                | Count |
|-------------------------------------------------------|------:|
| Distinct hex values introduced in Phase 3 (new)       | **27**|
| Distinct hex values reused verbatim from Phase 1 or 2 | **11**|
| Total distinct hexes touched by Phase 3 modules       | 38    |
| Sum of per-module entries (sprites + tiles)           | 104   |

The cumulative project palette (Phase 1 + Phase 2 + Phase 3 distinct) is
**92** hex values (Phase 1's 34 + Phase 2's 31 + Phase 3's 27 = 92).
**28 colors of headroom** against the 120-color project budget.

The Phase 3 count of 27 = 26 from the theme remap (Stage 2 shore / Stage 3
cave / Stage 4 dark forest + boss + moss-pulse) + 1 from the v0.75 hero
rebuild (`#f4c898` skin highlight).

## Hexes shared verbatim with Phases 1 or 2

These eleven hex values appear in Phase 3 modules **and** in at least one
earlier-phase module. Re-using them is intentional so the visual identity
stays unified.

| Hex          | Earlier-phase role                                                | Phase 3 reuse                                                          |
|--------------|-------------------------------------------------------------------|------------------------------------------------------------------------|
| `#00000000`  | transparent (every module)                                        | every Phase 3 module reserves index 0                                  |
| `#3a2e4a`    | universal violet ink (P1+P2)                                      | ink for all three tilesets + boss outline + moss-pulse outline         |
| `#4a7c3a`    | moss-green base (P1+P2)                                           | Bracken Warden bracken-frond mid + dark-forest moss patches            |
| `#2e5028`    | moss-green dark (P1+P2)                                           | Bracken Warden bracken-frond shadow + dark-forest moss shadow          |
| `#e8d4a0`    | cuff-cream / mile-marker plank (P1+P2)                            | mile-marker plank face (carried verbatim into all Phase 3 tilesets) + dark-forest cairn rim |
| `#e8a040`    | dawn-amber root highlight / sapling flare core (P1+P2)            | crystal-vein mid, shore-water reflection band, dark-forest cairn sigil-fleck, boss sigil mid, moss-pulse glow |
| `#f8d878`    | sapling amber-bright / fire tongue tip (P1+P2)                    | crystal-vein peak, shore-water reflection peak, **boss sigil-peak**    |
| `#5a3a22`    | bark base / loam-soil shadow (P1+P2)                              | wet-bark in Phase 3 mile-marker bases (carried verbatim)               |
| `#4a3422`    | wet-bark-brown (P1+P2)                                            | mile-marker shaft (carried verbatim into all three Phase 3 tilesets)   |
| `#5a4a6e`    | velvet under-flame wash (P2 — fire_low, Mossplodder ground shade) | crystal-vein base wash, moss-pulse trailing edge, boss under-bracken   |
| `#7a8088`    | river-stone-grey base (P2)                                        | cave rock_small base, shore rock_small base, dark-forest rock_small base, boss deeper joinery rim |

## Hexes new in Phase 3

These 26 hex values are introduced for the first time in Phase 3. Each is
documented with mood role and originating module.

### Cave (Stage 3 — Sumphollow) — `cave-moss-blue-green` family

| Hex       | Role                                                       | First used by                  |
|-----------|------------------------------------------------------------|--------------------------------|
| `#3a5e58` | cave-moss-blue-green base — top mossy strip                | tiles/area1-stage3-cave        |
| `#284844` | cave-moss-blue-green dark — moss shadow under the strip    | tiles/area1-stage3-cave        |
| `#6a7878` | wet-cave-stone — cooler cousin of river-stone-grey         | tiles/area1-stage3-cave        |
| `#4a5860` | wet-cave-stone shadow — deep cave-stone shadow             | tiles/area1-stage3-cave        |
| `#3a4248` | cave under-base — the deepest cave fill (not black)        | tiles/area1-stage3-cave        |
| `#c8d4c8` | cave-stone catchlight — pale on rock highlight             | tiles/area1-stage3-cave        |

### Shore (Stage 2 — beach) — `reflection-amber` over `sea-deep`

| Hex       | Role                                                       | First used by                   |
|-----------|------------------------------------------------------------|---------------------------------|
| `#3a586a` | sea-deep base — slow open-water main face                  | tiles/area1-stage2-shore        |
| `#2a4258` | sea-deep dark — under-water shadow body                    | tiles/area1-stage2-shore        |
| `#6a90a8` | ripple-pale / sea-foam — sky-amber catchlight skim         | tiles/area1-stage2-shore        |
| `#8a9a96` | wet-shelf-stone — slightly warmer cousin of cave stone     | tiles/area1-stage2-shore        |
| `#5a6a6a` | wet-shelf-stone shadow                                     | tiles/area1-stage2-shore        |
| `#6a8a4a` | shore-moss / sea-tinged — sun-fed tide-line moss           | tiles/area1-stage2-shore        |

### Dark forest (Stage 4 — The Old Threshold) — re-roled and new

These five hex values were introduced in the previous PR's ruin/boss
build and are **retained verbatim** with re-roled labels in the dark-
forest tileset:

| Hex       | Earlier (ruin) label                | Re-roled (dark-forest) label                                            | Also used by                  |
|-----------|-------------------------------------|-------------------------------------------------------------------------|-------------------------------|
| `#684e6e` | pillar-shadow-violet                | canopy-shadow-violet (deep undergrowth violet)                          | boss (under-bracken shadow)   |
| `#8a8478` | carved-stone-pale (mosaic floor)    | dry-bark-pale (weathered trunk face)                                    | boss (stone joinery main)     |
| `#a89c80` | carved-stone highlight              | moonlit bark crest                                                      | boss (joinery sun highlight)  |
| `#5a5448` | carved-stone shadow                 | tree-bark-shadow                                                        | boss (joinery deep shadow)    |
| `#7a7080` | mosaic-cool (moss-on-mosaic)        | moonlit-lichen overlay                                                  | (sole use in dark-forest)     |

These four hex values are **genuinely new in Phase 3** (introduced
exclusively by the dark-forest tileset):

| Hex       | Role                                                       | First used by                   |
|-----------|------------------------------------------------------------|---------------------------------|
| `#1e2032` | dark-forest under-base — deepest fill (NOT black)          | tiles/area1-stage4-darkforest   |
| `#2a3a3a` | dark-canopy blue-green dark — canopy shadow body           | tiles/area1-stage4-darkforest   |
| `#3e5a52` | dark-canopy blue-green mid — canopy moss top strip         | tiles/area1-stage4-darkforest   |
| `#cfd8dc` | moonlight-silver-cream — moonlight catch / dew sparkle     | tiles/area1-stage4-darkforest   |

### Bracken Warden + moss-pulse

| Hex       | Role                                                       | First used by                   |
|-----------|------------------------------------------------------------|---------------------------------|
| `#3e6a3a` | bracken-frond deep — fern fronds at hips and spine         | boss-bracken-warden             |
| `#5a8a4a` | cairn-mantle moss — outer moss silhouette / pale moss on dark rock | boss-bracken-warden (also dark-forest rock highlights) |
| `#a8744a` | stone-joinery warm — visible carved-stone joints (warm-grey, lifted from the carved-stone-pale family) | boss-bracken-warden |
| `#fff2c0` | sigil core-bright — the chest-sigil inner flare during `attack` (brightest single hex in Phase 3) | boss-bracken-warden |
| `#a4d098` | moss-pulse leading-edge — wavefront moss-glow             | projectile-moss-pulse           |

## Color groups (mood → role → hex) — Phase 3 only

### Cave — `cave-moss-blue-green` + `wet-cave-stone`

The cave palette anchors **cooler** than the forest. Moss has gone blue-green
because less sun reaches it; stone is pale-grey-with-a-blue-cast rather than
the loam-warm earth of Stage 1. The `amber-vein` highlight (`crystal_vein` —
the cave's fire-equivalent hazard) reuses dawn-amber `#e8a040` and pale-gold
`#f8d878` verbatim — when the player looks for warmth in the cave, they find
the same family they found in the forest, just rarer.

### Shore — `sea-deep` + `reflection-amber`

The Stage 2 shore palette is where Reed sees the open sky and open water at
dawn. The signature contrast: dawn-amber from above ↘ amber-pale reflection
on water ↘ blue-grey sea-deep ↘ wet-shelf stone underfoot. `water_gap`
mixes `sea-deep` and `ripple-pale` to read clearly as fatal water rather
than a regular gap.

### Dark forest — re-roled stone family + new canopy hues

The Stage 4 dark-forest palette is the **coolest** Phase 3 palette — deep
blue-green canopy shadow, violet-black undertones, silver moonlight,
gnarled rocks with violet undercuts. Dawn-amber appears **only** in the
end-of-Area cairn sigil-fleck — by deliberate foreshadowing, the player
walks the whole stage seeing only silver-cream moonlight, then meets the
amber on the cairn and immediately after on the Bracken Warden's chest
sigil. The dry-bark family (`#8a8478` / `#a89c80` / `#5a5448`) is shared
with the boss's stone joinery, so the player reads "the Warden is made
of the same material as this forest."

### Boss — bracken layered over stone joinery

The Bracken Warden's palette layers cool moss + bracken green over warm
stone joinery and a hot amber sigil. The boss reuses the dark-forest's
stone-family hexes (and the canopy-shadow-violet) so the Warden looks
made of the same material as the surrounding floor. The bracken greens
introduce three new tones warmer-and-deeper than Stage 1's forest moss,
and the sigil core-bright (`#fff2c0`) is the brightest single hex in
Phase 3 by design.

## Inks & shadow (Phase 3 — re-used verbatim from Phases 1 + 2)

Phase 3 introduces **no new ink color**. Every silhouette in v0.75 — boss,
projectile, all three new tilesets — uses the unifying violet `#3a2e4a` as
ink. This is the same rule applied in Phases 1 and 2 and is by design: the
four stages of Area 1 must read as one continuous chord.

The dark-forest tileset and the boss both use `#684e6e` as a **deeper
violet** for under-canopy / under-bracken shadow. This hex is **not** an
ink (it never outlines a silhouette) but a shadow hue, sitting between
`velvet-shadow` and the bark/joinery face. It is the only "additional
violet" anywhere in the project.

## Translucency policy

Phase 3 introduces no new alpha-blended hexes. The boss + moss-pulse use
fully opaque palettes; the cave / shore / dark-forest tilesets use fully
opaque palettes. The Glassmoth alpha policy carried over to Hummerwing in
Phase 2 remains the project's only translucent layer; if Phase 3 ships
Hummerwing cave/dark-forest reskins, they reuse the same `#f4e8f0a0` /
`#e0c8d870` / `#fff4f0c0` triple unchanged.

## Cross-sprite consistency rules — Phase 3

- **Violet ink everywhere.** All Phase 3 silhouette outlines use `#3a2e4a`.
  Carried verbatim from Phases 1 + 2 — this is the universal rule of the
  project. No exceptions for the boss, no exceptions for any tile.
- **Dawn amber stays reserved for warmth.** Crystal-vein (cave), shore
  water reflection, dark-forest cairn sigil-fleck, boss chest sigil, and
  moss-pulse inner glow — all five warmth slots in Phase 3 share the
  `dawn-amber` / `sigil-peak` family (`#e8a040` / `#f8d878`). The new hex
  `#fff2c0` is the **boss-only** brightest sibling, used solely for the
  sigil core during `attack`. When the player sees brightest amber, they
  are looking at the Warden's living core.
- **No pure black anywhere.** Even the deepest dark-forest fill (`#1e2032`)
  and deepest cave fill (`#3a4248`) are violet-grey, not black. The
  Warden's under-bracken shadow uses `velvet under-flame` (`#5a4a6e`) —
  carried over from Phase 2 fire-shadow by deliberate consistency.
- **Stage palettes rhyme but do not blur.** Each stage has one signature
  warmth slot (shore: reflection-amber band; cave: crystal-vein; dark
  forest: cairn sigil-fleck only) and one signature cool slot (shore:
  sea-deep; cave: blue-green moss; dark forest: dark-canopy blue-green).
  The four signature warmths share the amber family; the four signature
  cools do not — each stage cools toward its own mood (forest moss /
  sea-deep / cave blue-moss / dark-canopy).
- **Boss palette bridges dark-forest + warmth.** The Warden's stone
  joinery (`#a8744a`) is warm — a slightly lifted cousin of the dark-
  forest's dry-bark-pale. The bracken greens (`#3e6a3a`, `#5a8a4a`) are
  deeper than the forest moss. The sigil amber is the brightest in the
  project. Together the Warden reads as "a piece of the dark-forest
  clearing stood up."

## Budget

- Cap (project): ≤ 120 distinct colors total.
- Phase 1: 34 distinct hexes.
- Phase 2: 30 new distinct hexes (v0.50) + 1 new hex (v0.50.2, sprint trail) = 31.
- Phase 3: **27 new distinct hexes** (v0.75 after the theme remap + the
  hero-rebuild amendment).
- Cumulative: **92 distinct hexes.** **28 colors of headroom** for Phase 4.

The Phase 3 addition is the largest single-phase delta in the project so
far because Phase 3 ships three new tilesets + a boss + a projectile.
The headroom is still comfortable for v1.0 Phase 4 work (multi-area +
audio integration + polish).

---

## Per-module palette tables

### `assets/tiles/area1-stage2-shore.js` — 18 entries

| Idx | Hex          | Role                                          | Origin                  |
|----:|--------------|-----------------------------------------------|-------------------------|
|   0 | `#00000000`  | transparent                                   | universal               |
|   1 | `#3a2e4a`    | velvet ink                                    | shared P1+P2            |
|   2 | `#8a9a96`    | wet-shelf-stone                               | **new P3**              |
|   3 | `#5a6a6a`    | wet-shelf-stone shadow                        | **new P3**              |
|   4 | `#6a8a4a`    | shore-moss / sea-tinged                       | **new P3**              |
|   5 | `#2e5028`    | moss-green dark                               | shared P1+P2            |
|   6 | `#3a586a`    | sea-deep                                      | **new P3**              |
|   7 | `#2a4258`    | sea-deep dark                                 | **new P3**              |
|   8 | `#6a90a8`    | ripple-pale / sea-foam                        | **new P3**              |
|   9 | `#e8a040`    | dawn-amber (water reflection band)            | shared P1+P2            |
|  10 | `#f8d878`    | pale-gold (brightest reflection skim)         | shared P1+P2            |
|  11 | `#7a8088`    | river-stone-grey (rock-small base)            | shared P2               |
|  12 | `#4a5058`    | river-stone shadow                            | shared P2               |
|  13 | `#a8b0b8`    | river-stone highlight                         | shared P2               |
|  14 | `#e8d4a0`    | cuff-cream (mile-marker plank face)           | shared P1+P2            |
|  15 | `#4a3422`    | wet-bark-brown (mile-marker shaft)            | shared P1+P2            |
|  16 | `#5a3a22`    | loam-soil shadow (mile-marker footing)        | shared P1+P2            |
|  17 | `#c8d4c8`    | cave-stone catchlight (shelf catch-light)     | shared with stage3-cave |

### `assets/tiles/area1-stage3-cave.js` — 18 entries

| Idx | Hex          | Role                                          | Origin                  |
|----:|--------------|-----------------------------------------------|-------------------------|
|   0 | `#00000000`  | transparent                                   | universal               |
|   1 | `#3a2e4a`    | velvet ink                                    | shared P1+P2 (ink)      |
|   2 | `#3a5e58`    | cave-moss-blue-green base                     | **new P3**              |
|   3 | `#284844`    | cave-moss-blue-green dark                     | **new P3**              |
|   4 | `#6a7878`    | wet-cave-stone                                | **new P3**              |
|   5 | `#4a5860`    | wet-cave-stone shadow                         | **new P3**              |
|   6 | `#3a4248`    | cave under-base                               | **new P3**              |
|   7 | `#c8d4c8`    | cave-stone catchlight                         | **new P3**              |
|   8 | `#7a8088`    | river-stone-grey base (rock-small reuse)      | shared P2 (tiles/area1) |
|   9 | `#4a5058`    | river-stone shadow (rock-small)               | shared P2 (tiles/area1) |
|  10 | `#5a4a6e`    | velvet under-flame (vein base wash)           | shared P2 (fire_low)    |
|  11 | `#e8a040`    | dawn-amber (vein mid)                         | shared P1+P2            |
|  12 | `#f8d878`    | pale-gold (vein peak / mile-marker notch)     | shared P1+P2            |
|  13 | `#e8d4a0`    | cuff-cream (mile-marker plank face)           | shared P1+P2            |
|  14 | `#4a3422`    | wet-bark-brown (mile-marker shaft)            | shared P1+P2            |
|  15 | `#5a3a22`    | loam-soil shadow (mile-marker footing)        | shared P1+P2            |
|  16 | `#2e5028`    | moss-green dark (cairn / stage-exit moss)     | shared P1+P2            |
|  17 | `#a8b0b8`    | river-stone highlight (rock catch-light)      | shared P2 (tiles/area1) |

### `assets/tiles/area1-stage4-darkforest.js` — 21 entries

| Idx | Hex          | Role                                          | Origin                  |
|----:|--------------|-----------------------------------------------|-------------------------|
|   0 | `#00000000`  | transparent                                   | universal               |
|   1 | `#3a2e4a`    | velvet ink                                    | shared P1+P2            |
|   2 | `#1e2032`    | dark-forest under-base                        | **new P3**              |
|   3 | `#2a3a3a`    | dark-canopy blue-green dark                   | **new P3**              |
|   4 | `#3e5a52`    | dark-canopy blue-green mid                    | **new P3**              |
|   5 | `#684e6e`    | canopy-shadow-violet                          | new P3 (shared w/ boss) |
|   6 | `#8a8478`    | dry-bark-pale                                 | new P3 (shared w/ boss) |
|   7 | `#a89c80`    | moonlit bark crest                            | new P3 (shared w/ boss) |
|   8 | `#5a5448`    | tree-bark-shadow                              | new P3 (shared w/ boss) |
|   9 | `#7a7080`    | moonlit-lichen overlay                        | new P3 (re-roled from prior mosaic-cool) |
|  10 | `#cfd8dc`    | moonlight-silver-cream                        | **new P3**              |
|  11 | `#2e5028`    | moss-green dark                               | shared P1+P2            |
|  12 | `#4a7c3a`    | moss-green base                               | shared P1+P2            |
|  13 | `#5a8a4a`    | pale moss highlight (sparse on dark rocks)    | shared with boss        |
|  14 | `#7a8088`    | river-stone-grey (rock body)                  | shared P2               |
|  15 | `#4a5058`    | river-stone shadow                            | shared P2               |
|  16 | `#a8b0b8`    | river-stone highlight                         | shared P2               |
|  17 | `#e8d4a0`    | cuff-cream (mile plank / cairn rim)           | shared P1+P2            |
|  18 | `#4a3422`    | wet-bark-brown (mile-marker shaft)            | shared P1+P2            |
|  19 | `#5a3a22`    | loam-soil shadow (mile-marker footing)        | shared P1+P2            |
|  20 | `#e8a040`    | dawn-amber (cairn sigil-fleck ONLY)           | shared P1+P2            |

### `assets/sprites/boss-bracken-warden.js` — 18 entries

| Idx | Hex          | Role                                          | Origin                  |
|----:|--------------|-----------------------------------------------|-------------------------|
|   0 | `#00000000`  | transparent                                   | universal               |
|   1 | `#3a2e4a`    | velvet ink (silhouette)                       | shared P1+P2            |
|   2 | `#5a4a6e`    | under-bracken violet shadow                   | shared P2 (fire_low)    |
|   3 | `#684e6e`    | canopy-shadow-violet (under stone joinery)    | shared with stage4-darkforest |
|   4 | `#8a8478`    | dry-bark-pale (stone joinery main face)       | shared with stage4-darkforest |
|   5 | `#5a5448`    | tree-bark-shadow (joinery deep)               | shared with stage4-darkforest |
|   6 | `#a8744a`    | stone-joinery warm (carved warm-grey)         | **new P3**              |
|   7 | `#a89c80`    | moonlit bark crest (joinery sun)              | shared with stage4-darkforest |
|   8 | `#2e5028`    | moss-green dark (bracken shadow / outer moss) | shared P1+P2            |
|   9 | `#4a7c3a`    | moss-green base (bracken mid)                 | shared P1+P2            |
|  10 | `#3e6a3a`    | bracken-frond deep                            | **new P3**              |
|  11 | `#5a8a4a`    | cairn-mantle moss / pale moss highlight       | **new P3** (shared with stage4-darkforest) |
|  12 | `#e8a040`    | sigil-amber mid                               | shared P1+P2            |
|  13 | `#f8d878`    | sigil-amber peak                              | shared P1+P2            |
|  14 | `#fff2c0`    | sigil core-bright (brightest amber)           | **new P3**              |
|  15 | `#e8d4a0`    | cuff-cream (sigil rim highlight)              | shared P1+P2            |
|  16 | `#7a8088`    | river-stone-grey (deeper joinery rim)         | shared P2               |
|  17 | `#a8b0b8`    | river-stone highlight (rare highlight on shoulder stone) | shared P2     |

### `assets/sprites/hero-reed.js` (v0.75 rebuild) — 20 entries

| Idx | Hex          | Role                                          | Origin                  |
|----:|--------------|-----------------------------------------------|-------------------------|
|   0 | `#00000000`  | transparent                                   | universal               |
|   1 | `#1a2618`    | deep moss outline (silhouette ink)            | Phase 1 hero            |
|   2 | `#3a2e4a`    | violet undershadow                            | Phase 1 hero (=P1+P2 ink) |
|   3 | `#e8a878`    | dawn-amber skin                               | Phase 1 hero            |
|   4 | `#a8704a`    | skin shadow                                   | Phase 1 hero            |
|   5 | `#c25a30`    | hair ginger-warm                              | Phase 1 hero            |
|   6 | `#7a2e18`    | hair shadow                                   | Phase 1 hero            |
|   7 | `#4a7c3a`    | tunic moss-green base                         | Phase 1 hero (P1+P2)    |
|   8 | `#2e5028`    | tunic shadow                                  | Phase 1 hero (P1+P2)    |
|   9 | `#e8d4a0`    | cuff-cream highlight                          | Phase 1 hero (P1+P2)    |
|  10 | `#6e7a82`    | pouch river-stone-grey                        | Phase 1 hero            |
|  11 | `#3e4850`    | pouch dark                                    | Phase 1 hero            |
|  12 | `#d8c8a8`    | river-stone pebble / belt buckle highlight    | Phase 1 hero            |
|  13 | `#7e858e`    | chip-stone-grey (hatchet head main)           | Phase 2 hero            |
|  14 | `#5a6068`    | chip-stone-grey shadow (hatchet head dark)    | Phase 2 hero            |
|  15 | `#c89a68`    | cloth-wrap-tan (hatchet handle binding)       | Phase 2 hero            |
|  16 | `#f8b860`    | amber-underglow wisp (sprint trail)           | v0.50.2 hero (=Hummerwing) |
|  17 | `#a888b0`    | pale-violet wisp (sprint trail)               | v0.50.2 hero            |
|  18 | `#f4c898`    | skin highlight (cheek/nose catchlight)        | **new v0.75 (P3 amendment)** |
|  19 | `#5a8a4a`    | moss-mid highlight (shoulder catchlight)      | reuse of Phase 3 cairn-mantle moss |

### `assets/sprites/projectile-moss-pulse.js` — 9 entries

| Idx | Hex          | Role                                          | Origin                  |
|----:|--------------|-----------------------------------------------|-------------------------|
|   0 | `#00000000`  | transparent                                   | universal               |
|   1 | `#3a2e4a`    | velvet ink (wavefront outline)                | shared P1+P2            |
|   2 | `#2e5028`    | moss-green dark (trailing moss particles)     | shared P1+P2            |
|   3 | `#4a7c3a`    | moss-green base (mid wave-body)               | shared P1+P2            |
|   4 | `#a4d098`    | moss-pulse leading-edge (wavefront glow)      | **new P3**              |
|   5 | `#e8a040`    | dawn-amber (inner wave-glow)                  | shared P1+P2            |
|   6 | `#f8d878`    | pale-gold (brightest inner spark)             | shared P1+P2            |
|   7 | `#5a4a6e`    | velvet under-flame (trailing edge wash)       | shared P2               |
|   8 | `#684e6e`    | canopy-shadow-violet (deepest trail)          | shared with stage4-darkforest |

---

## Open questions

None at publication. All Phase 3 hexes were committed in the same PR as
the assets that use them — there are no orphan colors waiting on a future
asset. If Hummerwing cave/dark-forest reskins are added later, they can
either extend the existing `enemy-hummerwing.js` palette or coin new
hexes; this palette doc must be updated in that PR.

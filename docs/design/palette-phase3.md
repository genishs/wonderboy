# Phase 3 master palette

> Owner: design-lead. Companion to `docs/briefs/phase3-area1-expansion.md` and
> `docs/briefs/phase3-boss-cast.md`. Mood anchor: `docs/story/world.md` ("kettle-
> warm morning, woody not metallic, gentle not grim. Shadows are violet-grey,
> never black"). Phase 3 expands Area 1 from the forest seam (Stage 1) into the
> cave (Stage 2), waterside (Stage 3), and ancient ruins (Stage 4), and adds the
> Area 1 boss — the Bracken Warden — plus a moss-pulse shockwave projectile.
>
> **Phase 1 doc:** [`palette.md`](./palette.md) — closed; do not modify.
> **Phase 2 doc:** [`palette-phase2.md`](./palette-phase2.md) — closed; do not modify.
> **한국어 버전:** [`palette-phase3.ko.md`](./palette-phase3.ko.md)

This file inventories every distinct hex value used by the **Phase 3** sprite
and tile modules added in v0.75, and notes which hexes are reused verbatim from
Phases 1 and 2 (so the project's visual chord stays unified). Per-module
palettes live inside each `.js` file and are tuned independently for byte cost;
this doc rolls them up.

## Phase 3 module roster

| Module                                              | Type   | Per-module palette length |
|-----------------------------------------------------|--------|--------------------------:|
| `assets/tiles/area1-stage2-cave.js`                 | tile   | 18                        |
| `assets/tiles/area1-stage3-water.js`                | tile   | 18                        |
| `assets/tiles/area1-stage4-ruins.js`                | tile   | 17                        |
| `assets/sprites/boss-bracken-warden.js`             | sprite | 18                        |
| `assets/sprites/projectile-moss-pulse.js`           | sprite | 9                         |

## Totals

| Metric                                                | Count |
|-------------------------------------------------------|------:|
| Distinct hex values introduced in Phase 3 (new)       | **22**|
| Distinct hex values reused verbatim from Phase 1 or 2 | **11**|
| Total distinct hexes touched by Phase 3 modules       | 33    |
| Sum of per-module entries (sprites + tiles)           | 80    |

The cumulative project palette (Phase 1 + Phase 2 + Phase 3 distinct) is
**87** hex values (Phase 1's 34 + Phase 2's 31 + Phase 3's 22 = 87).
**33 colors of headroom** against the 120-color project budget.

## Hexes shared verbatim with Phases 1 or 2

These eleven hex values appear in Phase 3 modules **and** in at least one
earlier-phase module. Re-using them is intentional so the visual identity
stays unified.

| Hex          | Earlier-phase role                                                | Phase 3 reuse                                                          |
|--------------|-------------------------------------------------------------------|------------------------------------------------------------------------|
| `#00000000`  | transparent (every module)                                        | every Phase 3 module reserves index 0                                  |
| `#3a2e4a`    | universal violet ink (P1+P2)                                      | ink for all three tilesets + boss outline + moss-pulse outline         |
| `#4a7c3a`    | moss-green base (P1+P2)                                           | Bracken Warden bracken-frond mid + ruin floor moss patches             |
| `#2e5028`    | moss-green dark (P1+P2)                                           | Bracken Warden bracken-frond shadow + ruin moss shadow                 |
| `#e8d4a0`    | cuff-cream / mile-marker plank (P1+P2)                            | mile-marker plank face (carried verbatim into all Phase 3 tilesets)    |
| `#e8a040`    | dawn-amber root highlight / sapling flare core (P1+P2)            | crystal-vein mid, dawn-channel-amber mid, sigil mid, moss-pulse glow   |
| `#f8d878`    | sapling amber-bright / fire tongue tip (P1+P2)                    | crystal-vein peak, dawn-channel-amber peak, **boss sigil-peak**        |
| `#5a3a22`    | bark base / loam-soil shadow (P1+P2)                              | wet-bark in Phase 3 mile-marker bases (carried verbatim)               |
| `#4a3422`    | wet-bark-brown (P1+P2)                                            | mile-marker shaft (carried verbatim into all three Phase 3 tilesets)   |
| `#5a4a6e`    | velvet under-flame wash (P2 — fire_low, Mossplodder ground shade) | crystal-vein base wash, moss-pulse trailing edge, boss under-bracken   |
| `#7a8088`    | river-stone-grey base (P2)                                        | cave rock_small base, ruin pillar-fragment base                        |

## Hexes new in Phase 3

These 22 hex values are introduced for the first time in Phase 3. Each is
documented with mood role and originating module.

### Cave (Stage 2 — Sumphollow) — `cave-moss-blue-green` family

| Hex       | Role                                                       | First used by                  |
|-----------|------------------------------------------------------------|--------------------------------|
| `#3a5e58` | cave-moss-blue-green base — top mossy strip                | tiles/area1-stage2-cave         |
| `#284844` | cave-moss-blue-green dark — moss shadow under the strip    | tiles/area1-stage2-cave         |
| `#6a7878` | wet-cave-stone — cooler cousin of river-stone-grey         | tiles/area1-stage2-cave         |
| `#4a5860` | wet-cave-stone shadow — deep cave-stone shadow             | tiles/area1-stage2-cave         |
| `#3a4248` | cave under-base — the deepest cave fill (not black)        | tiles/area1-stage2-cave         |
| `#c8d4c8` | cave-stone catchlight — pale on rock highlight             | tiles/area1-stage2-cave         |

### Waterside (Stage 3 — Brinklane) — `reflection-amber` over `river-deep`

| Hex       | Role                                                       | First used by                   |
|-----------|------------------------------------------------------------|---------------------------------|
| `#3a586a` | river-deep base — slow river-water main face               | tiles/area1-stage3-water        |
| `#2a4258` | river-deep dark — under-river shadow body                  | tiles/area1-stage3-water        |
| `#6a90a8` | ripple-pale — sky-amber catchlight skim on water surface   | tiles/area1-stage3-water        |
| `#8a9a96` | wet-shelf-stone — slightly warmer cousin of cave stone     | tiles/area1-stage3-water        |
| `#5a6a6a` | wet-shelf-stone shadow                                     | tiles/area1-stage3-water        |
| `#6a8a4a` | bank-moss — sun-fed green (greener than cave moss)         | tiles/area1-stage3-water        |

### Ruins (Stage 4 — The Old Threshold) — `dawn-channel-amber`

| Hex       | Role                                                       | First used by                   |
|-----------|------------------------------------------------------------|---------------------------------|
| `#8a8478` | carved-stone-pale — mosaic floor base (cool cream-grey)    | tiles/area1-stage4-ruins        |
| `#a89c80` | carved-stone highlight — sun-touched mosaic ridge          | tiles/area1-stage4-ruins        |
| `#5a5448` | carved-stone shadow — mosaic grout / pillar undercut       | tiles/area1-stage4-ruins        |
| `#684e6e` | pillar-shadow-violet — deeper than `velvet-shadow`, under broken pillars | tiles/area1-stage4-ruins |
| `#7a7080` | mosaic-cool — moss-on-mosaic overlay (centuries-undisturbed) | tiles/area1-stage4-ruins      |

### Bracken Warden + moss-pulse

| Hex       | Role                                                       | First used by                   |
|-----------|------------------------------------------------------------|---------------------------------|
| `#3e6a3a` | bracken-frond deep — fern fronds at hips and spine         | boss-bracken-warden             |
| `#5a8a4a` | cairn-mantle moss — outer moss silhouette over stone joinery | boss-bracken-warden           |
| `#a8744a` | stone-joinery warm — visible carved-stone joints (warm-grey, lifted from carved-stone-pale family) | boss-bracken-warden |
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

### Waterside — `river-deep` + `reflection-amber`

The Brinklane palette is the only Phase 3 palette where Reed sees the sky
again (through the cave-roof crack). The signature contrast: dawn-amber from
above ↘ amber-pale reflection on water ↘ blue-grey river-deep ↘ wet-shelf
stone underfoot. `water_gap` mixes `river-deep` and `ripple-pale` to read
clearly as fatal water rather than a regular gap.

### Ruins — `carved-stone-pale` + `dawn-channel-amber`

The Old Threshold palette is the **driest** Phase 3 palette — the mosaic
floor is desaturated stone, the pillars are stone, the broken fragments are
stone. Dawn-amber appears only in the carved channels (`dawn_channel`) —
where the ruin's stored heat still bleeds through the floor. The Warden's
sigil core (`#fff2c0`) is the brightest single hex in Phase 3 by design: it
is the visual exclamation mark of Area 1.

### Boss — bracken layered over stone joinery

The Bracken Warden's palette layers cool moss + bracken green over warm stone
joinery and a hot amber sigil. The brief calls for "the boss should look made
of the same material as the floor and pillars, just animated" — so the
warden's stone joinery reuses the ruin's `carved-stone` family while the
moss/bracken introduces three new greens warmer-and-deeper than Stage 1's
forest moss.

## Inks & shadow (Phase 3 — re-used verbatim from Phases 1 + 2)

Phase 3 introduces **no new ink color**. Every silhouette in v0.75 — boss,
projectile, all three tilesets — uses the unifying violet `#3a2e4a` as ink.
This is the same rule applied in Phases 1 and 2 and is by design: the four
stages of Area 1 must read as one continuous chord.

The ruins introduce `#684e6e` as a **deeper violet** for pillar undercuts —
this is **not** an ink (it never outlines a silhouette) but a shadow
hue, sitting between `velvet-shadow` and the pillar's stone face. It is
the only "additional violet" anywhere in the project.

## Translucency policy

Phase 3 introduces no new alpha-blended hexes. The boss + moss-pulse use
fully opaque palettes; the cave / waterside / ruin tilesets use fully
opaque palettes. The Glassmoth alpha policy carried over to Hummerwing in
Phase 2 remains the project's only translucent layer; if Phase 3 ships
Hummerwing cave/ruin reskins, they reuse the same `#f4e8f0a0` / `#e0c8d870`
/ `#fff4f0c0` triple unchanged.

## Cross-sprite consistency rules — Phase 3

- **Violet ink everywhere.** All Phase 3 silhouette outlines use `#3a2e4a`.
  Carried verbatim from Phases 1 + 2 — this is the universal rule of the
  project. No exceptions for the boss, no exceptions for any tile.
- **Dawn amber stays reserved for warmth.** Crystal-vein (cave), dawn-channel
  (ruin), boss chest sigil, moss-pulse inner glow — all four warmth slots in
  Phase 3 share the `dawn-amber` / `sigil-peak` family (`#e8a040` / `#f8d878`).
  The new hex `#fff2c0` is the **boss-only** brightest sibling, used solely
  for the sigil core during `attack`. When the player sees brightest amber,
  they are looking at the Warden's living core.
- **No pure black anywhere.** Even the deepest cave fill (`#3a4248`) is a
  cool stone-grey, not black. The Warden's under-bracken shadow uses
  `velvet under-flame` (`#5a4a6e`) — carried over from Phase 2 fire-shadow
  by deliberate consistency.
- **Stage palettes rhyme but do not blur.** Each stage has one signature
  warmth slot (cave: crystal-vein; water: reflection-amber band; ruin:
  dawn-channel) and one signature cool slot (cave: blue-green moss; water:
  river-deep; ruin: pillar-shadow-violet). The four signature warmths share
  the amber family; the four signature cools do not — each stage cools
  toward its own mood (forest moss / cave blue-moss / river / pillar).
- **Boss palette bridges ruin + warmth.** The Warden's stone joinery
  (`#a8744a`) is warm — a slightly lifted cousin of the ruin's carved-stone.
  The bracken greens (`#3e6a3a`, `#5a8a4a`) are deeper and cooler than the
  ruin's moss overlay. The sigil amber is the brightest in the project.
  Together the Warden reads as "a piece of the ruin floor stood up."

## Budget

- Cap (project): ≤ 120 distinct colors total.
- Phase 1: 34 distinct hexes.
- Phase 2: 30 new distinct hexes (v0.50) + 1 new hex (v0.50.2, sprint trail) = 31.
- Phase 3: **22 new distinct hexes** (v0.75).
- Cumulative: **87 distinct hexes.** **33 colors of headroom** for Phase 4.

The Phase 3 addition is the largest single-phase delta in the project so
far (vs. Phase 2's 31 and Phase 1's 34) because Phase 3 ships three new
tilesets + a boss + a projectile. The headroom is still comfortable for
the v1.0 Phase 4 work (multi-area + audio integration + polish).

---

## Per-module palette tables

### `assets/tiles/area1-stage2-cave.js` — 18 entries

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

### `assets/tiles/area1-stage3-water.js` — 18 entries

| Idx | Hex          | Role                                          | Origin                  |
|----:|--------------|-----------------------------------------------|-------------------------|
|   0 | `#00000000`  | transparent                                   | universal               |
|   1 | `#3a2e4a`    | velvet ink                                    | shared P1+P2            |
|   2 | `#8a9a96`    | wet-shelf-stone                               | **new P3**              |
|   3 | `#5a6a6a`    | wet-shelf-stone shadow                        | **new P3**              |
|   4 | `#6a8a4a`    | bank-moss (sun-fed green)                     | **new P3**              |
|   5 | `#2e5028`    | moss-green dark                               | shared P1+P2            |
|   6 | `#3a586a`    | river-deep                                    | **new P3**              |
|   7 | `#2a4258`    | river-deep dark                               | **new P3**              |
|   8 | `#6a90a8`    | ripple-pale (water surface highlight)         | **new P3**              |
|   9 | `#e8a040`    | dawn-amber (water reflection band)            | shared P1+P2            |
|  10 | `#f8d878`    | pale-gold (brightest reflection skim)         | shared P1+P2            |
|  11 | `#7a8088`    | river-stone-grey (rock-small base)            | shared P2               |
|  12 | `#4a5058`    | river-stone shadow                            | shared P2               |
|  13 | `#a8b0b8`    | river-stone highlight                         | shared P2               |
|  14 | `#e8d4a0`    | cuff-cream (mile-marker plank face)           | shared P1+P2            |
|  15 | `#4a3422`    | wet-bark-brown (mile-marker shaft)            | shared P1+P2            |
|  16 | `#5a3a22`    | loam-soil shadow (mile-marker footing)        | shared P1+P2            |
|  17 | `#c8d4c8`    | cave-stone catchlight (shelf catch-light)     | shared with stage2-cave |

### `assets/tiles/area1-stage4-ruins.js` — 17 entries

| Idx | Hex          | Role                                          | Origin                  |
|----:|--------------|-----------------------------------------------|-------------------------|
|   0 | `#00000000`  | transparent                                   | universal               |
|   1 | `#3a2e4a`    | velvet ink                                    | shared P1+P2            |
|   2 | `#8a8478`    | carved-stone-pale (mosaic floor base)         | **new P3**              |
|   3 | `#a89c80`    | carved-stone highlight                        | **new P3**              |
|   4 | `#5a5448`    | carved-stone shadow                           | **new P3**              |
|   5 | `#684e6e`    | pillar-shadow-violet                          | **new P3**              |
|   6 | `#7a7080`    | mosaic-cool (moss overlay)                    | **new P3**              |
|   7 | `#4a7c3a`    | moss-green (occasional moss patch)            | shared P1+P2            |
|   8 | `#2e5028`    | moss-green dark                               | shared P1+P2            |
|   9 | `#e8a040`    | dawn-amber (carved-channel mid)               | shared P1+P2            |
|  10 | `#f8d878`    | pale-gold (carved-channel peak)               | shared P1+P2            |
|  11 | `#7a8088`    | river-stone-grey (pillar-fragment base)       | shared P2               |
|  12 | `#a8b0b8`    | river-stone highlight                         | shared P2               |
|  13 | `#4a5058`    | river-stone shadow                            | shared P2               |
|  14 | `#e8d4a0`    | cuff-cream (mile-marker / cairn sigil)        | shared P1+P2            |
|  15 | `#4a3422`    | wet-bark-brown (mile-marker shaft)            | shared P1+P2            |
|  16 | `#5a3a22`    | loam-soil shadow (mile-marker footing)        | shared P1+P2            |

### `assets/sprites/boss-bracken-warden.js` — 18 entries

| Idx | Hex          | Role                                          | Origin                  |
|----:|--------------|-----------------------------------------------|-------------------------|
|   0 | `#00000000`  | transparent                                   | universal               |
|   1 | `#3a2e4a`    | velvet ink (silhouette)                       | shared P1+P2            |
|   2 | `#5a4a6e`    | under-bracken violet shadow                   | shared P2 (fire_low)    |
|   3 | `#684e6e`    | pillar-shadow-violet (under stone joinery)    | shared with stage4-ruins|
|   4 | `#8a8478`    | carved-stone-pale (stone joinery main face)   | shared with stage4-ruins|
|   5 | `#5a5448`    | carved-stone shadow (joinery deep)            | shared with stage4-ruins|
|   6 | `#a8744a`    | stone-joinery warm (carved warm-grey)         | **new P3**              |
|   7 | `#a89c80`    | carved-stone highlight (joinery sun)          | shared with stage4-ruins|
|   8 | `#2e5028`    | moss-green dark (bracken shadow / outer moss) | shared P1+P2            |
|   9 | `#4a7c3a`    | moss-green base (bracken mid)                 | shared P1+P2            |
|  10 | `#3e6a3a`    | bracken-frond deep                            | **new P3**              |
|  11 | `#5a8a4a`    | cairn-mantle moss (outer moss silhouette)     | **new P3**              |
|  12 | `#e8a040`    | sigil-amber mid                               | shared P1+P2            |
|  13 | `#f8d878`    | sigil-amber peak                              | shared P1+P2            |
|  14 | `#fff2c0`    | sigil core-bright (brightest amber)           | **new P3**              |
|  15 | `#e8d4a0`    | cuff-cream (sigil rim highlight)              | shared P1+P2            |
|  16 | `#7a8088`    | river-stone-grey (deeper joinery rim)         | shared P2               |
|  17 | `#a8b0b8`    | river-stone highlight (rare highlight on shoulder stone) | shared P2     |

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
|   8 | `#684e6e`    | pillar-shadow-violet (deepest trail)          | shared with stage4-ruins|

---

## Open questions

None at publication. All Phase 3 hexes were committed in the same PR as
the assets that use them — there are no orphan colors waiting on a future
asset. If Hummerwing cave/ruin reskins are added later, they can either
extend the existing `enemy-hummerwing.js` palette or coin new hexes; this
palette doc must be updated in that PR.

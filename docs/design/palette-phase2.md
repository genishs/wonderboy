# Phase 2 master palette

> Owner: design-lead. Companion to `docs/briefs/phase2-cast-revision.md` and
> `docs/briefs/phase2-areas.md`. Mood anchor: `docs/story/world.md` ("kettle-warm
> morning, woody not metallic, gentle not grim. Layered greens cooled by river-
> blue and warmed by dawn-amber. Shadows are violet-grey, never black").
>
> **Phase 1 doc:** [`palette.md`](./palette.md) — closed; do not modify.
> **한국어 버전:** [`palette-phase2.ko.md`](./palette-phase2.ko.md)

This file inventories every distinct hex value used by the **Phase 2** sprite,
tile, and SVG modules added in v0.50, and notes which hexes are reused verbatim
from Phase 1 (so we don't drift apart visually). Per-module palettes live inside
each `.js` / `.svg` file and are tuned independently for byte cost; this doc
rolls them up.

## Phase 2 module roster

| Module                                       | Type   | Per-module palette length |
|----------------------------------------------|--------|--------------------------:|
| `assets/sprites/hero-reed.js` (extended)      | sprite | 16 (was 13; +3 hatchet)   |
| `assets/sprites/projectile-stone-hatchet.js` | sprite | 10                        |
| `assets/sprites/enemy-mossplodder.js`        | sprite | 9                         |
| `assets/sprites/enemy-hummerwing.js`         | sprite | 9 (incl. 3 alpha entries) |
| `assets/sprites/item-dawn-husk.js`           | sprite | 8                         |
| `assets/tiles/area1.js`                      | tile   | 16                        |
| `assets/bg/area1-sky.svg`                    | svg    | 6 distinct fills          |
| `assets/bg/area1-mountains.svg`              | svg    | 7 distinct fills          |
| `assets/bg/area1-trees.svg`                  | svg    | 4 distinct fills          |

## Totals

| Metric                                                | Count |
|-------------------------------------------------------|------:|
| Distinct hex values introduced in Phase 2 (new)       | **30**|
| Distinct hex values reused verbatim from Phase 1      | **9** |
| Total distinct hexes touched by Phase 2 modules       | 39    |
| Sum of per-module entries (sprites + tiles)           | 68    |

The cumulative project palette (Phase 1 + Phase 2 distinct) is **64** hex values
(Phase 1's 34 + Phase 2's 30 new). Comfortable headroom against the 120-color
project budget noted in `palette.md`.

## Hexes shared verbatim with Phase 1

These nine hex values appear in BOTH Phase 1 and Phase 2 modules — re-using them
is intentional so the visual identity stays unified. They form the chord the
project plays in every scene.

| Hex          | Phase 1 role                          | Phase 2 reuse                                           |
|--------------|---------------------------------------|---------------------------------------------------------|
| `#00000000`  | transparent (every module)            | every Phase 2 module reserves index 0                   |
| `#3a2e4a`    | Reed/Crawlspine/Glassmoth/Sapling unifying violet shadow | hatchet ink, Mossplodder ink, Hummerwing ink, husk ink, tile ink, ruin-stone outline in mountains.svg |
| `#4a7c3a`    | Reed tunic moss-green base            | Mossplodder top moss patch, Area 1 tile moss-top, mountains canopy, trees-layer base |
| `#2e5028`    | Reed tunic shadow / Sapling needle base | Mossplodder moss-shadow, Area 1 tile moss-dark, mountains canopy under-shadow |
| `#e8d4a0`    | Reed cuff-cream highlight             | Mossplodder belly seam, dawn-husk speckle, mile-marker plank face, cairn sigil-stone |
| `#e8a040`    | Sapling dawn-amber inner core (flare) | hatchet splash spark, Hummerwing thorax base, dawn-husk dawn-rim, area1 root highlight, trees-layer dewdrop tips |
| `#f8d878`    | Sapling amber-bright (flare peak)     | hatchet splash tip, dawn-husk break-flash, fire tongue tip                 |
| `#5a3a22`    | Crawlspine/Sapling bark base          | dawn-husk dark fleck, area1 loam-soil shadow                              |
| `#f4e8f0a0`  | Glassmoth pearl-glass translucent fill (~63% α) | Hummerwing wing-haze inner translucent — same translucent policy           |
| `#e0c8d870`  | Glassmoth pearl-glass deeper (~44% α) | Hummerwing wing-haze deeper translucent                                    |
| `#fff4f0c0`  | Glassmoth wing dust trail (~75% α)    | Hummerwing wing-haze edge                                                  |

(Eleven entries total — `#00000000` plus ten hue values. We count this as "9
shared" for the totals row above to match the Phase 1 doc's accounting style,
which excluded the transparent index and the alpha siblings from the
distinct-color budget.)

## Color groups (mood → role → hex) — Phase 2 only

### Forest greens — "moss-green"

Phase 2 introduces no new pure-green hexes; the Mossplodder's top moss, the area1
tile moss strip, and the parallax canopy all reuse Phase 1's `#4a7c3a` (tunic
base) and `#2e5028` (tunic shadow). One new pale moss-strand color is added:

| Hex       | Role                              | Used by                       |
|-----------|-----------------------------------|-------------------------------|
| `#a0b878` | moss-strand pale (Mossplodder trailing strands) | enemy-mossplodder           |
| `#3e6a3a` | foliage near-canopy (parallax)    | bg/area1-trees                |
| `#6e8868` | distant-ridge cool green          | bg/area1-mountains            |
| `#5a7858` | mid-ridge cool green              | bg/area1-mountains            |

### Loam / bark / earth — "loam-warm"

The area1 ground-tile palette anchors here.

| Hex       | Role                                         | Used by                  |
|-----------|----------------------------------------------|--------------------------|
| `#8a6038` | loam-soil base                               | tiles/area1 (flat, slopes) |
| `#4a3422` | wet-bark-brown (also Mossplodder shell-loam shadow) | enemy-mossplodder, tiles/area1 |
| `#7a5238` | shell-loam base / dawn-husk under-base       | enemy-mossplodder, item-dawn-husk |
| `#a8794a` | shell-loam mid (dawn-husk speckled face)     | item-dawn-husk           |

### Stone — "river-stone-grey / chip-stone-grey"

| Hex       | Role                          | Used by                                        |
|-----------|-------------------------------|------------------------------------------------|
| `#7e858e` | chip-stone-grey base (hatchet head) | hero-reed (extended), projectile-stone-hatchet |
| `#5a6068` | chip-stone-grey shadow        | hero-reed (extended), projectile-stone-hatchet |
| `#b8c0c8` | chip-stone-grey highlight     | projectile-stone-hatchet                       |
| `#7a8088` | river-stone-grey base         | tiles/area1 (rock_small, cairn), bg/area1-mountains |
| `#a8b0b8` | river-stone highlight         | tiles/area1, bg/area1-mountains                |
| `#4a5058` | river-stone shadow            | tiles/area1                                    |

### Cloth — "cloth-wrap-tan"

| Hex       | Role                          | Used by                                  |
|-----------|-------------------------------|------------------------------------------|
| `#c89a68` | cloth-wrap-tan (hatchet handle binding) | hero-reed (extended), projectile-stone-hatchet |
| `#7a5a3a` | cloth-wrap shadow             | projectile-stone-hatchet                 |

### Fire — "fire-warmth"

Per cast brief §8 + world.md: NO PURE BLACK; even fire shadow is violet.

| Hex       | Role                                | Used by                  |
|-----------|-------------------------------------|--------------------------|
| `#e85020` | fire base orange (hottest core)     | tiles/area1 (fire_low)   |
| `#f8a040` | fire mid (close cousin of dawn-amber, slightly redder) | tiles/area1 (fire_low) |
| `#5a4a6e` | velvet under-flame wash (replaces the black under-flame line) | tiles/area1 (fire_low), Mossplodder ground shadow |

### Hummerwing — "sunwarm-amber"

| Hex       | Role                       | Used by             |
|-----------|----------------------------|---------------------|
| `#a86018` | sunwarm-amber shadow       | enemy-hummerwing    |
| `#f8d4c8` | dust-pink dorsal sheen (brightened sibling of Phase 1 `#d89aa8`) | enemy-hummerwing    |
| `#f8b860` | amber-underglow            | enemy-hummerwing    |

### Dawn (sky / atmosphere)

| Hex       | Role                          | Used by         |
|-----------|-------------------------------|-----------------|
| `#f8d068` | sky dawn-warm zenith          | bg/area1-sky    |
| `#f8b878` | sky dawn-amber band           | bg/area1-sky    |
| `#e8a888` | sky dust-rose mid-band        | bg/area1-sky    |
| `#c89a98` | sky lower haze (dust-rose dim)| bg/area1-sky    |
| `#8a8aa8` | sky lowest violet-haze        | bg/area1-sky    |
| `#9aa0b8` | sky cool-wash band             | bg/area1-sky    |
| `#fff4e8` | cloud-band warm-cream         | bg/area1-sky    |
| `#f8e4d0` | cloud-band peach              | bg/area1-sky    |
| `#f0d4c0` | cloud-band rose-dim           | bg/area1-sky    |
| `#e8c4b8` | cloud-band lowest             | bg/area1-sky    |

(Sky layer uses gradient stops + ellipse fills — a richer sub-palette than the
sprite modules, but constrained to a single layer.)

## Inks & shadow (Phase 2 — re-used from Phase 1)

Phase 2 introduces no new ink color. Every silhouette in v0.50 uses Phase 1's
unifying violet `#3a2e4a` as ink. This is by design: the Mossline Path should
read as one continuous visual chord with whatever Reed (already established in
Phase 1) carries with him.

The Phase 1 ink dialect (Reed/Sapling pine `#1a2618` / `#1a2418`, Crawlspine
deep-bark `#1a1410`) is NOT re-used in Phase 2 active gameplay because none of
those silhouettes appear: Phase 1 enemies are retired (cast §10). The unified
violet ink is the v0.50 rule.

## Translucency policy

Hummerwing reuses the Glassmoth alpha policy verbatim — the same three alpha hex
values (`#f4e8f0a0`, `#e0c8d870`, `#fff4f0c0`) for the wing-haze layer. Per the
Phase 1 contract: index 0 stays reserved for fully transparent; partial-alpha
indices are not subject to that reservation. This keeps Hummerwing wings
visually rhyming with Glassmoth wings should the latter ever return in a later
Area — they should look like cousins of each other.

## Cross-sprite consistency rules — Phase 2

- **Violet ink everywhere.** All Phase 2 silhouette outlines use `#3a2e4a`.
- **Dawn amber stays reserved for warmth.** Reed's skin (Phase 1), Hummerwing
  thorax, dawn-husk eastern rim, fire tongues, sapling-flare echo (`#e8a040`)
  all share the same family — when the player looks for warmth in Area 1, they
  always find amber.
- **No pure black anywhere, including under fire.** Fire's lowest cell uses
  `#5a4a6e` (velvet under-flame wash) — the world.md rule is enforced even for
  the most "earned-black" sprite in v0.50.
- **Cool-green parallax + warm-amber Hummerwing = "warm spark falls cool"** on
  the kill frame. Cast brief §4.5 explicitly calls out this contrast frame; the
  palette is tuned so it lands.

## Budget

- Cap (project): ≤ 120 distinct colors total.
- Phase 1: 34 distinct hexes.
- Phase 2: 30 new distinct hexes (39 touched, 9 shared).
- Cumulative: 64 distinct hexes. **56 colors of headroom** for Phases 3-4.

---

## v0.50.2 addendum — sprint trail wisps

The v0.50.2 patch adds two palette entries to `assets/sprites/hero-reed.js`
(now 18 entries, was 16) for the new `sprint` / `sprint_armed` motion-line
trails. No other module is touched.

| Hex          | Index | Role                                       | Notes                                   |
|--------------|------:|--------------------------------------------|-----------------------------------------|
| `#f8b860`    | 16    | amber-underglow wisp — sprint trail inner  | **Reused verbatim** from `enemy-hummerwing.js` (Hummerwing thorax amber-underglow). Trail visually rhymes with the warm-spark-falls-cool kill frame; no new distinct color. |
| `#a888b0`    | 17    | pale-violet wisp — sprint trail outer/cool | **New hex.** Cool sibling of the project-wide violet-shadow ink `#3a2e4a` (lighter, softer, ~30% lift). One new color in v0.50.2. |

### Why these choices

The brief's "amber/violet trail" guidance pointed naturally at the existing
warmth-and-cool chord in the Phase 2 palette. Rather than introduce two
brand-new hues:

- **Amber inner** picks `#f8b860` because it is *already in the project*
  (Hummerwing) and Reed's sprint trail should feel like a sibling phenomenon
  to a flier's underglow — warmth that briefly hovers in the air. Zero new
  hexes from this slot.
- **Violet outer** could not reuse `#3a2e4a` directly — that ink is a hard
  silhouette outline, too heavy as a translucent trail. A new pale-violet
  `#a888b0` lands in the same hue family at significantly higher lightness,
  reading as "cool shadow that fades quickly" rather than "outline."

### Updated budget

- Phase 1: 34 hexes.
- Phase 2 (v0.50): 30 new hexes (39 touched, 9 shared).
- Phase 2 (v0.50.2): **+1 new hex** (`#a888b0`). `#f8b860` reused verbatim
  from Hummerwing — does not count as new.
- Cumulative: **65 distinct hexes.** **55 colors of headroom** for Phases 3-4.

### `hero-reed.js` per-module palette length

| Version  | Length | Note                                  |
|----------|-------:|---------------------------------------|
| Phase 1  | 13     | (closed)                              |
| v0.50    | 16     | +3 for hatchet head/grip + grip-shadow|
| v0.50.2  | 18     | +2 trail wisps (one reused, one new)  |

The Phase 2 module roster table at the top of this doc still shows
`hero-reed.js` at 16 — that count reflects v0.50 baseline; v0.50.2 raises it
to 18 as noted here.

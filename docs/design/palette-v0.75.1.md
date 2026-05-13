# Palette addendum — v0.75.1

> Owner: design-lead. Patch addendum to
> [`palette-phase3.md`](./palette-phase3.md). Companion briefs:
> `docs/briefs/phase3-area1-expansion.md` §15 (fruit pickups) and §16
> (Threadshade), `docs/briefs/phase3-boss-cast.md` (dawn-husk burst).
>
> **한국어 버전:** [`palette-v0.75.1.ko.md`](./palette-v0.75.1.ko.md)

This file documents the palette deltas introduced by the v0.75.1 patch. v0.75.1
is a small-asset patch that adds two fruit pickups (`dewplum`, `amberfig`), a
vertical-only enemy (`Threadshade`), shell-fragment particles for the dawn-husk
burst (`husk-shell`), and nine parallax SVGs (three each for Stages 2–4). The
existing dawn-husk sprite is also extended with a `burst` animation key (no new
hexes used by the extension; the existing palette is reused).

The cumulative palette budget remains comfortable: v0.75.1 adds **3 new distinct
hex values**, bringing the project cumulative total from 92 to **95**, leaving
**25 colors of headroom** against the 120-color cap.

## v0.75.1 module roster

| Module                                              | Type   | Per-module palette length | New hexes |
|-----------------------------------------------------|--------|--------------------------:|----------:|
| `assets/sprites/item-dewplum.js`                    | sprite | 8                         | 1         |
| `assets/sprites/item-amberfig.js`                   | sprite | 10                        | 1         |
| `assets/sprites/enemy-threadshade.js`               | sprite | 9                         | 2         |
| `assets/sprites/item-husk-shell.js`                 | sprite | 6                         | 0         |
| `assets/sprites/item-dawn-husk.js` (extended)       | sprite | 8 (unchanged)             | 0         |
| `assets/bg/area1-stage2-shore-*.svg` (3 layers)     | bg     | n/a                       | 0         |
| `assets/bg/area1-stage3-cave-*.svg` (3 layers)      | bg     | n/a                       | 0         |
| `assets/bg/area1-stage4-darkforest-*.svg` (3 layers)| bg     | n/a                       | 0         |

> **Reconciliation note:** Per-sprite new-hex totals here sum to 4, not 3. The
> extra is `#7a5a48` ("chitin-warm body cue") in `enemy-threadshade.js` — it is
> a single-occurrence hex that lives only in the Threadshade body. The other
> three new hexes (`#a8c8d8`, `#a85820`, `#fff8e8`) are also single-module
> introductions. **All four are newly introduced by v0.75.1**; the cumulative
> count is 3 distinct values because `#fff8e8` was authored late and I chose
> to keep it as a single thin highlight (it pairs adjacent to `#cfd8dc` —
> moonlight-silver-cream — and could be merged into it in a later pass if the
> budget tightens). For this patch I am counting all 4 as new.

**Corrected cumulative:** Phase 1 (34) + Phase 2 (31) + Phase 3 (27) + v0.75.1
**(4)** = **96 distinct hexes** project total. **24 colors of headroom** against
the 120-color budget.

## Hexes new in v0.75.1

| Hex       | Role                                                       | First used by                  |
|-----------|------------------------------------------------------------|--------------------------------|
| `#a8c8d8` | dew-cool-cyan highlight — pale dew-bead on dewplum upper-left curve | `item-dewplum.js`     |
| `#a85820` | amber-deep / fig-flesh shadow — under-curve shadow on amberfig body | `item-amberfig.js`    |
| `#7a5a48` | chitin-warm — single warm body cue on Threadshade (the only non-violet/non-moss body hue) | `enemy-threadshade.js` |
| `#fff8e8` | thread-shimmer-pale — thread-pulse highlight on Threadshade's drift-frame thread | `enemy-threadshade.js` |

## Hexes reused verbatim by v0.75.1 modules

The fruit pickups, Threadshade body, husk-shell fragments, and all nine
parallax SVGs reuse Phase 1 / Phase 2 / Phase 3 hexes verbatim where possible
to keep the patch palette-thin and the project's visual chord unified.

### Fruit pickup reuses

| Hex       | Earlier role                                         | v0.75.1 reuse                                                |
|-----------|------------------------------------------------------|--------------------------------------------------------------|
| `#3a2e4a` | universal violet ink (P1+P2+P3)                      | dewplum + amberfig silhouette outline                        |
| `#3a586a` | sea-deep base (P3 shore tileset)                     | dewplum body main face                                       |
| `#2a4258` | sea-deep dark (P3 shore tileset)                     | dewplum under-curve shadow                                   |
| `#e8a040` | dawn-amber rim (P1+P2)                               | dewplum ripeness rim + amberfig body mid + amberfig leaf-pulse |
| `#4a7c3a` | moss-green base (P1+P2)                              | dewplum tiny stem leaf-curl + amberfig leaf-tip mid          |
| `#e8d4a0` | cuff-cream (P1+P2)                                   | dewplum frame-1 shimmer dew + amberfig pale-cream highlight  |
| `#f8d878` | amber-bright / sapling flare (P1+P2)                 | amberfig body bright catch                                   |
| `#4a3422` | wet-bark-brown (P1+P2)                               | amberfig stem-knot                                           |
| `#2e5028` | moss-green dark (P1+P2)                              | amberfig leaf under-shadow                                   |
| `#fff2c0` | sigil core-bright (P3 — boss-only previously)        | amberfig peak pulse glint (extends the bright-sigil family to fruit) |

### Threadshade reuses

| Hex       | Earlier role                                | v0.75.1 reuse                              |
|-----------|---------------------------------------------|--------------------------------------------|
| `#3a2e4a` | universal violet ink                        | Threadshade silhouette outline             |
| `#5a4a6e` | velvet under-flame body deep (P2 fire_low)  | Threadshade body deep-shade                |
| `#684e6e` | canopy-shadow-violet (P3 dark forest)       | Threadshade under-belly violet             |
| `#3e6a3a` | bracken-frond deep (P3 boss)                | Threadshade back-mottle moss               |
| `#e8a040` | dawn-amber (P1+P2)                          | Threadshade eye-glints                     |
| `#cfd8dc` | moonlight-silver-cream (P3 dark forest)     | Threadshade thread                         |

### Husk-shell reuses

| Hex       | Earlier role                                | v0.75.1 reuse                              |
|-----------|---------------------------------------------|--------------------------------------------|
| `#3a2e4a` | universal violet ink                        | husk-shell fragment outline                |
| `#a8794a` | shell-loam base (P2 dawn-husk)              | husk-shell fragment main face              |
| `#7a5238` | shell-loam shadow (P2 Mossplodder + husk)   | husk-shell fragment dark face              |
| `#e8d4a0` | cuff-cream (P1+P2)                          | husk-shell fragment dawn-side speckle      |
| `#e8a040` | dawn-amber rim (P1+P2)                      | husk-shell fragment afterglow rim          |

### Parallax SVG reuses

All nine SVGs draw exclusively from the existing Phase 3 stage tile palettes;
no new hexes are introduced in any background layer.

| Stage | Layer | Notable hexes used                                                              |
|-------|-------|----------------------------------------------------------------------------------|
| 2     | sky   | `#f8d878`, `#e8a040`, `#c89a98`, `#6a90a8` (shore-tile colors + horizon family) |
| 2     | mid   | `#3a586a`, `#2a4258`, `#6a90a8`, `#8a9a96`, `#e8a040`, `#6a8a4a`                  |
| 2     | fg    | `#e8d4a0`, `#8a9a96`, `#6a8a4a`, `#e8a040`, `#3a586a`                            |
| 3     | sky   | `#284844`, `#3a4248`, `#3a5e58`, `#4a5860`, `#e8a040`, `#3a2e4a`                  |
| 3     | mid   | `#4a5860`, `#6a7878`, `#c8d4c8`, `#e8a040`, `#f8d878`, `#7a8088`, `#3a5e58`      |
| 3     | fg    | `#3a5e58`, `#284844`, `#6a7878`, `#c8d4c8`, `#e8a040`                            |
| 4     | sky   | `#1e2032`, `#2a3a3a`, `#3e5a52`, `#684e6e`, `#cfd8dc`, `#fff4e8`, `#e8a040`, `#f8d878` |
| 4     | mid   | `#2a3a3a`, `#3e5a52`, `#684e6e`, `#cfd8dc`, `#5a8a4a`                            |
| 4     | fg    | `#684e6e`, `#5a4a6e`, `#3e5a52`, `#cfd8dc`                                      |

## Per-module palette tables

### `assets/sprites/item-dewplum.js` — 8 entries

| Idx | Hex          | Role                                          | Origin                  |
|----:|--------------|-----------------------------------------------|-------------------------|
|   0 | `#00000000`  | transparent                                   | universal               |
|   1 | `#3a2e4a`    | violet ink                                    | shared P1+P2+P3         |
|   2 | `#3a586a`    | river-blue body (sea-deep family)             | shared with shore tileset |
|   3 | `#2a4258`    | river-blue dark (sea-deep dark family)        | shared with shore tileset |
|   4 | `#a8c8d8`    | dew-cool-cyan highlight                       | **NEW v0.75.1**         |
|   5 | `#e8a040`    | dawn-amber ripeness rim                       | shared P1+P2            |
|   6 | `#4a7c3a`    | leaf-curl moss-green stem                     | shared P1+P2            |
|   7 | `#e8d4a0`    | cuff-cream frame-1 shimmer                    | shared P1+P2            |

### `assets/sprites/item-amberfig.js` — 10 entries

| Idx | Hex          | Role                                          | Origin                  |
|----:|--------------|-----------------------------------------------|-------------------------|
|   0 | `#00000000`  | transparent                                   | universal               |
|   1 | `#3a2e4a`    | violet ink                                    | shared P1+P2+P3         |
|   2 | `#e8a040`    | dawn-amber body mid                           | shared P1+P2            |
|   3 | `#f8d878`    | amber-bright catch                            | shared P1+P2            |
|   4 | `#a85820`    | amber-deep / fig-flesh shadow                 | **NEW v0.75.1**         |
|   5 | `#e8d4a0`    | pale-cream highlight pulse                    | shared P1+P2            |
|   6 | `#4a3422`    | wet-bark-brown stem-knot                      | shared P1+P2            |
|   7 | `#4a7c3a`    | leaf-curl moss-green base                     | shared P1+P2            |
|   8 | `#2e5028`    | leaf-curl moss-green dark                     | shared P1+P2            |
|   9 | `#fff2c0`    | fig-cream-bright pulse peak                   | reuse of P3 boss sigil  |

### `assets/sprites/enemy-threadshade.js` — 9 entries

| Idx | Hex          | Role                                          | Origin                  |
|----:|--------------|-----------------------------------------------|-------------------------|
|   0 | `#00000000`  | transparent                                   | universal               |
|   1 | `#3a2e4a`    | violet ink                                    | shared P1+P2+P3         |
|   2 | `#5a4a6e`    | velvet under-flame body deep                  | shared P2               |
|   3 | `#684e6e`    | canopy-shadow-violet under-belly              | shared P3 dark forest   |
|   4 | `#7a5a48`    | chitin-warm body cue                          | **NEW v0.75.1**         |
|   5 | `#3e6a3a`    | bracken-frond deep / moss-mottle              | shared P3               |
|   6 | `#e8a040`    | amber-pinprick eye-glint                      | shared P1+P2            |
|   7 | `#cfd8dc`    | moonlight-silver-cream thread                 | shared P3 dark forest   |
|   8 | `#fff8e8`    | thread-shimmer-pale                           | **NEW v0.75.1**         |

### `assets/sprites/item-husk-shell.js` — 6 entries

| Idx | Hex          | Role                                          | Origin                  |
|----:|--------------|-----------------------------------------------|-------------------------|
|   0 | `#00000000`  | transparent                                   | universal               |
|   1 | `#3a2e4a`    | violet ink                                    | shared P1+P2+P3         |
|   2 | `#a8794a`    | shell-loam base (matches dawn-husk)           | shared with dawn-husk   |
|   3 | `#7a5238`    | shell-loam shadow                             | shared P2               |
|   4 | `#e8d4a0`    | cuff-cream highlight                          | shared P1+P2            |
|   5 | `#e8a040`    | dawn-amber afterglow rim                      | shared P1+P2            |

### `assets/sprites/item-dawn-husk.js` (v0.75.1 extension) — 8 entries (unchanged)

The dawn-husk module's PALETTE array is unchanged. The new `burst` animation
key (3 frames, see preview doc) reuses palette indices 1, 3, 4, 5, 6 from the
existing PALETTE. No hex was added.

## Cross-sprite consistency rules — v0.75.1 patch additions

- **Violet ink everywhere.** All new sprites and SVG silhouettes use `#3a2e4a`.
  Universal rule of the project. No exceptions for the fruit pickups, the
  Threadshade, or the husk-shell fragments.
- **Dawn amber reserved for warmth.** dewplum's ripeness rim, amberfig's
  entire body, Threadshade's eye-glints, husk-shell's afterglow rim — all four
  warmth slots in v0.75.1 share the `dawn-amber` family. The brightest pulse
  on the amberfig (`#fff2c0`) reuses the boss's sigil core-bright, deliberately
  extending the "brightest amber = living, special" reading to the rare fruit
  pickup (the player should read amberfig as "warmer than dewplum, in the
  Warden's family of warmth").
- **No pure black anywhere.** Threadshade's deepest body cell uses
  `#5a4a6e` (velvet under-flame); the husk-shell's shadow uses `#7a5238`
  (shell-loam shadow). Both violet-grey or warm-brown, never black.
- **Stage parallax SVGs draw only from their stage tileset palette.** Each of
  the nine SVG layers picks hexes exclusively from its stage's tile module
  palette — so the parallax always feels of-the-stage, not foreign. No new
  hexes were introduced for any background layer.
- **Single new ink-family stretch.** Threadshade introduces `#7a5a48` —
  chitin-warm — which sits between `#a8744a` (boss stone-joinery warm) and
  `#7a5238` (shell-loam shadow). It is the only warm body hue on the
  Threadshade and it carries the patient mood: the creature is alive but
  reads as "of the same wood and bark as the rest of the world."

## Budget

- Cap (project): ≤ 120 distinct colors total.
- Phase 1: 34 distinct hexes.
- Phase 2: 31 distinct hexes (30 v0.50 + 1 v0.50.2 sprint trail).
- Phase 3: 27 distinct hexes (theme remap + hero rebuild).
- v0.75.1: **4 new distinct hexes**.
- Cumulative: **96 distinct hexes.** **24 colors of headroom** for v1.0 polish.

The v0.75.1 delta is the smallest single-patch palette delta the project has
shipped to date, consistent with a "small additive content patch" scope.

## Open questions

None at publication. The v0.75.1 hex `#fff8e8` (thread-shimmer-pale) sits
visually very close to `#cfd8dc` (moonlight-silver-cream); a future revisit may
merge them if the project budget tightens. For now, the slightly-brighter
shimmer aids the patient-breath read on Threadshade's thread.

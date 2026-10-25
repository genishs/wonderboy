# Phase 1 master palette

> Owner: design-lead. Companion to `docs/briefs/phase1-cast.md`.
> Mood anchor: `docs/story/world.md` — "kettle-warm morning, woody not metallic, gentle
> not grim. Layered greens cooled by river-blue and warmed by dawn-amber. Shadows are
> violet-grey, never black."

This file is the canonical inventory of every distinct hex value used by the five Phase 1
sprite modules. Per-sprite palettes live inside each `.js` file and are tuned
independently for byte cost; this doc rolls them up so reviewers can confirm the visual
identity is consistent across enemies and that we are nowhere near the 120-color budget.

## Totals

| Metric                                | Count |
|---------------------------------------|------:|
| Distinct hex values across Phase 1    |  **34** |
| Per-module palette length (Reed)      | 13 (incl. transparent) |
| Per-module palette length (Stoneflake)|  6 |
| Per-module palette length (Crawlspine)|  8 |
| Per-module palette length (Glassmoth) |  9 (incl. 3 alpha entries) |
| Per-module palette length (Sapling)   | 10 |
| Sum of per-module entries             | 46 |

The distinct count (34) is below the per-module sum (46) because seven hex values are
shared by more than one module:

| Hex          | Used by (n)        | Why shared                                    |
|--------------|--------------------|-----------------------------------------------|
| `#00000000`  | all 5              | transparent — every module reserves index 0   |
| `#3a2e4a`    | 4 (R/Cs/Gm/Sp)     | unifying violet shadow                        |
| `#1a2618`    | 2 (R/Sp ?)         | see note — Reed pine ink                      |
| `#5a3a22`    | 2 (Cs/Sp)          | bark base                                     |
| `#3a2410`    | 2 (Cs/Sp)          | bark shadow                                   |
| `#2e5028`    | 2 (R/Sp)           | foliage shadow / needle-pine base             |
| `#d8c8a8`    | 2 (R/St)           | river-stone cream pebble                      |

Note: Reed uses `#1a2618` and the Sapling uses `#1a2418` — these are intentionally
distinct outline inks (warmer for Reed, cooler for the Sapling) so the two greens don't
collapse into the same silhouette ink in tight foliage. The Crawlspine uses a third
distinct outline (`#1a1410`, deep bark).

## Color groups (mood → role → hex)

### Skin / hero warmth — "dawn-amber"

| Hex       | Role                          | Used by    |
|-----------|-------------------------------|------------|
| `#e8a878` | dawn-amber skin (face/arm/foot)| Reed (3)  |
| `#a8704a` | skin shadow                    | Reed (4)  |
| `#e8a040` | dawn-amber inner core (flared) | Sapling (4) |
| `#f8d878` | amber bright (flare peak)      | Sapling (5) |

### Hair / heat-accent

| Hex       | Role               | Used by   |
|-----------|--------------------|-----------|
| `#c25a30` | hair ginger-warm   | Reed (5)  |
| `#7a2e18` | hair shadow        | Reed (6)  |

### Foliage greens — "moss-green / needle-pine"

| Hex       | Role                              | Used by      |
|-----------|-----------------------------------|--------------|
| `#4a7c3a` | tunic moss-green base             | Reed (7)     |
| `#2e5028` | tunic shadow / needle-pine base   | Reed (8), Sapling (2) |
| `#3a5a28` | moss undertone                    | Crawlspine (6) |
| `#5a8a3a` | needle-pine highlight             | Sapling (3)  |

### Cuff / cream / bone — "cuff-cream / seed-bone-white"

| Hex       | Role                | Used by       |
|-----------|---------------------|---------------|
| `#e8d4a0` | cuff-cream highlight| Reed (9)      |
| `#e8e0c0` | seed-bone-white     | Sapling (6)   |

### River-stone family — pebble & pouch

| Hex       | Role                          | Used by              |
|-----------|-------------------------------|----------------------|
| `#6e7a82` | river-stone-grey (pouch)      | Reed (10)            |
| `#3e4850` | pouch dark                    | Reed (11)            |
| `#d8c8a8` | river-stone pebble (cream)    | Reed (12), Stoneflake(4) |
| `#6e6258` | pebble dark                   | Stoneflake (2)       |
| `#a89880` | pebble mid                    | Stoneflake (3)       |
| `#f0e8c8` | pebble specular               | Stoneflake (5)       |

### Bark / wood — "bark-brown"

| Hex       | Role                | Used by                    |
|-----------|---------------------|----------------------------|
| `#5a3a22` | bark base           | Crawlspine (2), Sapling (7) |
| `#3a2410` | bark shadow         | Crawlspine (3), Sapling (8) |
| `#1a1410` | deep bark outline   | Crawlspine (1)             |

### Chitin — "chitin-bronze"

| Hex       | Role                  | Used by         |
|-----------|-----------------------|-----------------|
| `#a87838` | chitin-bronze ridge   | Crawlspine (4)  |
| `#e8c060` | ridge highlight (dawn)| Crawlspine (5)  |

### Pearl / glass / haze — Glassmoth identity (the only translucent set)

| Hex          | Alpha  | Role                          | Used by         |
|--------------|--------|-------------------------------|-----------------|
| `#f4e8f0a0`  | ~63 %  | pearl-glass translucent fill  | Glassmoth (2)   |
| `#e0c8d870`  | ~44 %  | pearl-glass deeper fill       | Glassmoth (3)   |
| `#fff4f0c0`  | ~75 %  | wing dust trail               | Glassmoth (8)   |
| `#d89aa8`    | opaque | dust-pink wing edge           | Glassmoth (4)   |
| `#f8e8e8`    | opaque | morning-haze highlight        | Glassmoth (5)   |
| `#7a5c4a`    | opaque | body chitin (warm dust)       | Glassmoth (6)   |
| `#3a2820`    | opaque | body shadow                   | Glassmoth (7)   |

### Inks & shadow (mood-accents)

| Hex       | Role                                  | Used by                                  |
|-----------|---------------------------------------|------------------------------------------|
| `#1a2618` | deep moss outline (one-step-darker pine)| Reed (1)                              |
| `#1a2418` | needle-pine outline                   | Sapling (1)                              |
| `#3a2e4a` | violet undershadow / inner outline    | Reed (2), Crawlspine (7), Glassmoth (1), Sapling (9) |

Reed and the Sapling use visually-adjacent but intentionally distinct dark inks. Reed
leans warmer (`#1a2618`) because it sits next to skin tones; the Sapling's outline
(`#1a2418`) leans cooler to read against its own greens. They are not supposed to share
an ink — having two near-identical pine inks separates the silhouettes when a Reed
walks past a Sapling in tight foliage.

### Reserved

| Hex          | Role             | Used by                |
|--------------|------------------|------------------------|
| `#00000000`  | full transparent | every module, index 0  |

## Translucency policy

Glassmoth is the only Phase 1 sprite using `#rrggbbaa` palette entries. Three alpha
values are in use (`a0`, `70`, `c0`) so the wings can fade from inner-fill to
outer-edge without requiring a per-pixel blend mode. Per `docs/design/contracts.md`,
index 0 is reserved for fully transparent; partial alpha indices are not subject to
that reservation. Renderer (`SpriteCache`) should `putImageData` directly — no extra
compositing needed.

## Cross-sprite consistency rules

- **No pure-black ink anywhere.** All "outlines" are one step darker than the local
  field. Reed/Sapling pine ink hovers around `#1a26xx`; Crawlspine bark ink is
  `#1a1410`; Glassmoth uses violet ink instead of black.
- **Dawn amber is reserved for warmth.** Skin (Reed) and danger-flare (Sapling core)
  share the amber family on purpose — when the Sapling flares, it should briefly
  visually rhyme with Reed himself, spiking the player's "this matters" radar.
- **Violet shadow** is the unifying mood-accent: Reed's underjaw, Crawlspine's plate
  shadow, Glassmoth's silhouette ink, Sapling's ground-shadow. It carries the
  morning-haze tone of `world.md` through every sprite.

## Budget

- Cap: ≤ 120 distinct colors total across Phase 1.
- Current: **34 distinct hex values**. Comfortable headroom (~86 colors) for Phase 2
  (terrain tilesets, parallax, additional fauna).

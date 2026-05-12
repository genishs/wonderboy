# Preview — `assets/tiles/area1-stage4-ruins.js`

> **한국어 버전:** [`preview-tile-stage4-ruins.ko.md`](./preview-tile-stage4-ruins.ko.md)

| Field         | Value                                       |
|---------------|---------------------------------------------|
| Path          | `assets/tiles/area1-stage4-ruins.js`        |
| Stage         | Stage 4 — The Old Threshold (ancient ruins) |
| Tile matrix   | 16 × 16 art-pixels per tile                 |
| Display size  | 48 × 48 canvas px (3× scale; matches `TILE = 48`) |
| Palette       | 17 entries                                  |
| Tile keys     | 12 keys (10 static + 1 animated decoration + cairn) |

The ruins tileset is the **driest** Phase 3 palette — the mosaic floor is
desaturated stone, the pillars are stone, the broken fragments are stone.
Dawn-amber appears only in the carved channels (`dawn_channel`) — where
the ruin's stored heat still bleeds through the floor. Stage 4 has **no
fire-equivalent / amber-vein / water hazard tile**; threat in this stage
lives entirely with Mossplodders + the boss arena beat at Round 4-4 col 32.

## Tile keys

### Static tiles

- **`flat`** — Mosaic-floor tile. Top 2 rows: carved-stone-pale with a
  mosaic-cool moss overlay strip (the moss that has crept over the floor in
  undisturbed centuries). Rows 2-5: carved-stone-pale main face with grout-
  line accents (carved-stone shadow cells at occasional column boundaries —
  reads as "mosaic tile pattern"). Rows 6-13: continuing mosaic with
  occasional small moss patches (the room is patient; the moss is patient
  with it). Bottom: pillar-shadow-violet band — a deeper violet than the
  Stage 1/2/3 ground shadows, reading as "the floor has a long memory."
- **`slope_up_22`** — Gentle uphill, ruins-tinted.
- **`slope_up_45`** — Steep uphill. A dawn-amber catch on the upper-right
  crest reads as "the ruin's stored heat surfaces along the rising edge" —
  the same warmth motif as Stage 2's crystal-vein and the carved channels.
- **`slope_dn_22`** — Gentle downhill.
- **`slope_dn_45`** — Steep downhill.
- **`rock_small`** — Pillar-fragment (broken pillar stub). Same authoring
  convention (transparent below row 12 to composite over a flat tile). The
  silhouette differs from Stages 1-3's `rock_small`: a flat-topped column
  segment with a clear pillar-cap (carved-stone highlight + river-stone-
  highlight crown) and a clear pillar-shadow-violet undercut at the base.
  Reads as "this was once part of something taller." **Gameplay role is
  unchanged** — same stumble + vitality-drain behavior as the forest rock.

  **Decision recorded.** We kept the tile KEY as `rock_small` (not
  `pillar_fragment` as the story brief tentatively called it) so dev-lead's
  level-data code can use the same key across all four stages. The brief's
  intent ("broken pillar segment") is honored visually; only the in-code
  key stays uniform.

- **`mile_1`-`mile_4`** — Round signposts, shared chain. `mile_4` is the
  last round of Area 1 — the marker that points the player toward the
  boss's anteroom.
- **`cairn`** — **END-OF-AREA boundary cairn.** Stack of three carved-stone
  stones with a dawn-amber-tinted sigil-stone topmost. The carved-channel
  motif gathers here: the sigil-stone reads as "the ruin's stored heat
  surfaces in one stone as the Area-clear blessing." Visually distinct from
  `stage_exit` (used in Stages 2-3 — a cave/water arch with a horizontal
  crossbeam) so the player reads "this is the end of the road, not just
  another door."

  The Stage 4 `cairn` is the Area 1 closure marker — fired by dev-lead's
  level-data only after the Bracken Warden is defeated. The cairn replaces
  the Stage 1 `cairn` (which was the v0.50 Stage-Cleared trigger) as the
  v0.75 Area-Cleared trigger. Visual differs from the Stage 1 cairn in
  palette (Stage 1: river-stone grey + cuff-cream sigil; Stage 4: carved-
  stone-pale + dawn-amber-tinted sigil) so the player reads "the journey
  has accumulated; the marker has warmed."

### Animated decoration (NOT a hazard)

- **`dawn_channel`** — **animated**, `{ frames: [2 matrices], fps: 2 }`.
  An amber-glowing channel carved into the mosaic floor. **Decoration only**
  — Reed walks over it without consequence. Used in Round 4-2, 4-3
  (decorative runs) and especially Round 4-4 (the long convergent stripe
  approaching the boss arena entrance at col 32).

  Visual layout:
  - **Top region (rows 0-7):** the channel itself — a 1-tile-wide carved
    strip surrounded by velvet ink at the floor's surface. Channel interior
    is dawn-amber with pale-gold sparkle clusters; cells outside the
    channel (rows 0 and the sides) are transparent so the surrounding
    `flat` tiles show through.
  - **Mid + bottom (rows 8-15):** the mosaic floor body — same content as
    `flat`'s lower portion, so a `dawn_channel` tile slots into a `flat`-
    tile row without a visual seam. The channel reads as "set into the
    floor."

  Decision recorded:
  - **2 frames @ 2 fps** per brief §11.4 ("2-frame slow pulse ~2 fps").
    The slowest animation in Phase 3 by a wide margin (fire 8 fps, vein
    6 fps, water 3 fps, channel 2 fps) — appropriate for "the ruin's
    stored heat is ancient, patient." The two frames differ only in
    sparkle density: frame 0 = sparse sparkles, frame 1 = denser sparkle
    spread (the warmth has come up another notch). Loop F0↔F1 reads as a
    very slow respiratory glow.

  - **NOT a hazard.** Per story brief §11.4: the ruin's stored heat is
    decorative; it does not damage Reed. This is the **only place dawn-
    amber appears in Stage 4 outside the boss arena**, by deliberate
    foreshadowing — the player walks past the carved channels in Rounds
    4-2 and 4-3 and reads "something warm is buried here," then at the
    boss arena in Round 4-4 the Bracken Warden's chest sigil rises in
    the same amber family.

## Decisions recorded — no hazard tiles

Per story brief §7 + §11: **The Old Threshold has no hazard tiles.** No
`fire_low`, no `crystal_vein`, no `amber_vein`, no `water_gap`. Reed's
death paths in Stage 4 are exclusively:
- Mossplodder body contact (existing v0.50 rule)
- Boss body contact (added in `phase3-boss-cast.md`)
- Moss-pulse shockwave contact (added in `phase3-boss-cast.md`)
- Gap-fall (existing v0.50.2 rule — Stage 4 has a few non-water gaps)

The `dawn_channel` is the only Phase 3 tile in this module that is *not*
in the locomotion or signpost set, and it is decoration only.

## Decision recorded — no boss-arena-floor variant

The story brief §11.5 left open a "boss-arena-floor variant for the 12-tile-
wide arena." **Not shipped.** Reasoning: the boss arena uses the same
`flat` mosaic floor (cols 32-43 of Round 4-4). The upper rows of the arena
stay visually quiet because the `flat` tile is already visually quiet at
its top (just the 2-row moss overlay strip + mosaic-cool); the HUD strip
needs ~76 px of clear space at the top of the screen, and the existing
`flat` reads correctly under the Warden's silhouette. Adding a unique
"boss-arena floor" tile would add data with no visual benefit.

## Palette overlap with earlier phases

11 of the 17 hex entries are reused verbatim from Phases 1, 2, and the
Phase 3 cave/water tilesets. Per `palette-phase3.md`:

- Phase 1 + 2 shared: violet ink, dawn-amber, pale-gold, cuff-cream,
  wet-bark, loam-shadow, moss-green base, moss-green dark, transparent.
- Phase 2-only shared (from `area1.js`): river-stone-grey base, river-
  stone shadow, river-stone highlight.

The remaining 5 hexes are new to Phase 3 ruins: `#8a8478`, `#a89c80`,
`#5a5448` (carved-stone-pale family — base, highlight, shadow); `#684e6e`
(pillar-shadow-violet — deeper than `velvet-shadow`, only used under
broken pillars); `#7a7080` (mosaic-cool — moss-on-mosaic overlay).

## Cross-stage consistency notes

- The mile-marker post is identical across all four stages (post + plank +
  digit shapes shared verbatim).
- `cairn` is reserved exclusively for end-of-Area. Stage 4 is the only
  stage that emits a `cairn` placement in level-data; Stages 1, 2, 3 emit
  `stage_exit` at end-of-stage in v0.75.
- The pillar-shadow-violet hex (`#684e6e`) is **NEW Phase 3** and is the
  only additional violet anywhere in the project. It is shared with the
  Bracken Warden boss sprite (under-stone-joinery shadow) so the player
  reads "the Warden is made of the same material as this floor."

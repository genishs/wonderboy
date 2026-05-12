// owning agent: design-lead
// TODO: original tile module for Area 1 Stage 3 — "Brinklane" (Phase 3, v0.75).
// Consumed by dev-lead's tile-cache renderer per docs/design/contracts.md.
// Each TILES entry is either a 16x16 matrix of palette indices (static) OR an
// {frames, fps} object (animated — water_gap). Renderer scales 3x to canvas TILE=48.
//
// Tile keys & intent (per docs/briefs/phase3-area1-expansion.md §6 + §11):
//   flat          — stone-shelf floor (wet-shelf-stone with bank-moss top strip
//                   and occasional ripple-pale catchlight where the shelf is
//                   damp from the river)
//   slope_up_22   — gentle uphill (22°)
//   slope_up_45   — steep uphill (45°)
//   slope_dn_22   — gentle downhill
//   slope_dn_45   — steep downhill
//   rock_small    — bank-edge boulder (wet-stone toned, river-stone body)
//   water_gap     — animated water-gap, 3 frames @ ~3 fps. The signature
//                   Brinklane hazard: visually water (NOT empty sky), kills
//                   Reed if he falls into it (same death rule as a normal
//                   gap-fall per v0.50.2 dying FSM). Renderer draws this tile
//                   where Stage 1 would have drawn nothing (transparent).
//                   Top edge carries a dawn-amber reflection band; main body
//                   is river-deep blue-grey with subtle ripple highlights.
//   mile_1.._4    — round signposts (shared post + plank-with-digit shape
//                   from Stage 1, carried verbatim — the mile-marker is the
//                   trail chain across all stages)
//   stage_exit    — within-area transition gate (same key as Stage 2 for
//                   consistency; visual is the wet-shelf-stone variant of
//                   the cave's amber-arch).
//
// Decision recorded: NO fire-equivalent / inland hazard in Stage 3. Story
// brief §6.x hazard tables list ONLY `water_gap` as Stage 3's hazard
// (crystal_vein lives in Stage 2; water_gap lives in Stage 3; no overlap).
// The brief's prose mentions Stage 4 explicitly drops fire-equivalents, and
// Stage 3's signature beat is the water rhythm — adding an inland hazard
// would crowd that read. So Stage 3 has exactly one hazard: water_gap.
//
// Decision recorded: water_gap IS animated (3 frames @ 3 fps). The brief
// allows static or 2-3 frames at low fps; we ship 3 frames for the same
// visual aliveness the fire/vein hazards have. The ripple band drifts
// slowly across the surface.
//
// Decision recorded: the brief mentions `bank_reed` as an optional Stage 3
// decoration. NOT shipped in this PR; design-lead defers to a future patch
// when Stage 3 round-data confirms a use case (no current placement
// requirement).
//
// Frame ASCII legend (per palette index):
//   .  = 0   transparent
//   o  = 1   velvet ink (#3a2e4a)
//   s  = 2   wet-shelf-stone (#8a9a96)        — shelf main face
//   S  = 3   wet-shelf-stone shadow (#5a6a6a) — shelf deep face
//   m  = 4   bank-moss (#6a8a4a)              — sun-fed bank moss
//   M  = 5   moss-green dark (#2e5028)        — moss shadow (shared)
//   w  = 6   river-deep (#3a586a)             — water main face
//   W  = 7   river-deep dark (#2a4258)        — water deep shadow
//   p  = 8   ripple-pale (#6a90a8)            — surface catchlight
//   a  = 9   dawn-amber (#e8a040)             — reflection band mid
//   g  = a   pale-gold (#f8d878)              — brightest reflection skim
//   r  = b   river-stone-grey (#7a8088)       — rock_small base (shared)
//   k  = c   river-stone shadow (#4a5058)     — rock dark (shared)
//   R  = d   river-stone highlight (#a8b0b8)  — rock catch-light (shared)
//   c  = e   cuff-cream (#e8d4a0)             — mile-marker plank face
//   b  = f   wet-bark-brown (#4a3422)         — mile-marker shaft
//   L  = 10  loam-soil shadow (#5a3a22)       — mile-marker footing
//   C  = 11  cave-stone catchlight (#c8d4c8)  — shelf catch-light highlight

export const PALETTE = [
  '#00000000', //  0 transparent
  '#3a2e4a',   //  1 velvet ink
  '#8a9a96',   //  2 wet-shelf-stone
  '#5a6a6a',   //  3 wet-shelf-stone shadow
  '#6a8a4a',   //  4 bank-moss
  '#2e5028',   //  5 moss-green dark (shared)
  '#3a586a',   //  6 river-deep
  '#2a4258',   //  7 river-deep dark
  '#6a90a8',   //  8 ripple-pale
  '#e8a040',   //  9 dawn-amber (shared)
  '#f8d878',   // 10 pale-gold (shared)
  '#7a8088',   // 11 river-stone-grey (shared)
  '#4a5058',   // 12 river-stone shadow (shared)
  '#a8b0b8',   // 13 river-stone highlight (shared)
  '#e8d4a0',   // 14 cuff-cream (shared)
  '#4a3422',   // 15 wet-bark-brown (shared)
  '#5a3a22',   // 16 loam-soil shadow (shared)
  '#c8d4c8',   // 17 cave-stone catchlight (shared w/ stage2-cave)
];

// flat — stone-shelf floor. Top 2 rows: bank-moss strip with moss-dark accents
// (the moss grows along the shelf-top where sunlight from the sky-strip reaches
// it). Next 4 rows: wet-shelf-stone main face. Below that: deeper shadow with
// occasional ripple-pale or shelf catchlight specks (the shelf is wet, so it
// catches light at random points). Bottom: shelf shadow band.
// mmmmmmmmmmmmmmmm
// MMmMmmmMmmmMmmmM
// ssssssssssssssss
// ssssssssssssssss
// SsSsSssSsssSsSsS
// SSSSSSSSSSSSSSSS
// ssssssssssssssss
// sCsssssssspssss.
// ssssssssssssssss
// ssspsssssssspsss
// SSSSSSSSSSSSSSSS
// SsCsssssssssCsss
// ssssssssssssssss
// SSSSSSSSSSSSSSSS
// SSSSSSSSSSSSSSSS
// SSSSSSSSSSSSSSSS
const flat = [
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [5,5,4,5,4,4,4,5,4,4,4,5,4,4,4,5],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [3,2,3,2,3,2,2,3,2,2,2,3,2,3,2,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,17,2,2,2,2,2,2,2,2,8,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,8,2,2,2,2,2,2,2,2,8,2,2,2],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,2,17,2,2,2,2,2,2,2,2,2,17,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
];

// slope_up_22 — gentle 22° uphill. Same stair-step shape as Stage 1/2.
const slope_up_22 = [
  [0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4],
  [0,0,0,0,0,0,0,0,0,4,4,2,2,2,2,4],
  [0,0,0,0,0,0,0,4,4,2,2,2,2,2,2,2],
  [0,0,0,0,0,4,4,2,2,2,2,2,2,2,2,3],
  [0,0,0,0,4,2,2,2,2,2,2,2,2,2,3,2],
  [0,0,4,4,2,2,2,2,2,2,2,2,2,3,3,3],
  [0,4,2,2,2,2,2,2,2,3,3,3,3,3,3,3],
  [4,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,17,2,2,2,2,2,2,2,2,2,2,2,17,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,8,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
];

// slope_up_45 — steep 45° uphill. Dawn-amber catch on the upper-right crest
// (the river-water below catches the sky-strip and that reflection lands on
// the slope's crest — the visual touchstone of Brinklane).
const slope_up_45 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,4,4,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,4,4,2,2,2],
  [0,0,0,0,0,0,0,0,0,0,4,4,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,4,4,2,2,2,2,2],
  [0,0,0,0,0,0,0,0,4,4,2,2,2,2,2,9],
  [0,0,0,0,0,0,0,4,4,2,2,2,2,2,2,3],
  [0,0,0,0,0,0,4,4,2,2,2,2,2,3,3,3],
  [0,0,0,0,0,4,4,2,2,2,2,2,3,3,3,3],
  [0,0,0,0,4,4,2,2,2,3,3,3,3,3,3,3],
  [0,0,0,4,4,2,2,3,3,3,3,3,3,3,3,3],
  [0,0,4,4,2,3,3,3,3,3,3,3,3,3,3,3],
  [0,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
];

// slope_dn_22 — gentle downhill (mirror of slope_up_22).
const slope_dn_22 = [
  [4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0],
  [4,2,2,2,2,4,4,0,0,0,0,0,0,0,0,0],
  [2,2,2,2,2,2,2,4,4,0,0,0,0,0,0,0],
  [3,2,2,2,2,2,2,2,2,4,4,0,0,0,0,0],
  [2,3,2,2,2,2,2,2,2,2,4,0,0,0,0,0],
  [3,3,3,2,2,2,2,2,2,2,2,4,4,0,0,0],
  [3,3,3,3,3,3,3,2,2,2,2,2,2,4,0,0],
  [3,3,3,3,3,3,3,3,3,3,3,2,2,2,4,0],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,8,2,2,2,2,2,2,2,17,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,8,2,2],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
];

// slope_dn_45 — steep downhill (mirror of slope_up_45).
const slope_dn_45 = [
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,2,4,4,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,2,2,4,4,0,0,0,0,0,0,0,0,0,0,0],
  [2,2,2,2,4,4,0,0,0,0,0,0,0,0,0,0],
  [2,2,2,2,2,4,4,0,0,0,0,0,0,0,0,0],
  [9,2,2,2,2,2,4,4,0,0,0,0,0,0,0,0],
  [3,2,2,2,2,2,2,4,4,0,0,0,0,0,0,0],
  [3,3,3,2,2,2,2,2,4,4,0,0,0,0,0,0],
  [3,3,3,3,2,2,2,2,2,4,4,0,0,0,0,0],
  [3,3,3,3,3,3,3,2,2,2,4,4,0,0,0,0],
  [3,3,3,3,3,3,3,3,3,2,2,4,4,0,0,0],
  [3,3,3,3,3,3,3,3,3,3,2,4,4,0,0,0],
  [3,3,3,3,3,3,3,3,3,3,3,3,4,4,0,0],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,0],
];

// rock_small — bank-edge boulder. Same authoring convention: transparent below
// row 12 to composite over a flat tile. Uses Stage 1's river-stone palette
// (shared verbatim) with a single bank-moss patch on the shaded side.
const rock_small = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,12,1,1,0,0,0,0,0],
  [0,0,0,0,1,13,13,13,12,12,12,1,0,0,0,0],
  [0,0,0,1,11,13,13,13,11,11,12,12,1,0,0,0],
  [0,0,1,11,5,13,13,13,11,11,12,12,12,1,0,0],
  [0,0,1,5,5,13,13,11,11,11,12,12,12,1,0,0],
  [0,1,11,4,11,11,11,11,11,11,11,12,12,12,1,0],
  [0,1,11,4,11,11,11,11,11,11,11,12,12,12,1,0],
  [0,1,12,12,12,12,12,12,12,12,12,12,12,12,1,0],
  [0,0,1,1,1,12,12,12,12,12,12,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// water_gap frame 0 — neutral water surface. Top row carries a dawn-amber +
// pale-gold reflection band (the sky-strip from above catches the water).
// Body rows are river-deep with subtle ripple-pale highlights. Bottom rows
// fade to river-deep dark — the river is deep enough to read "do not enter."
// Reed dies on contact via the existing v0.50.2 dying FSM (falling below the
// playable row). The tile renders the visible water surface.
// gagaaaagaaaaagag
// aaaaaaaaaaaaaaaa
// pwwpwwwwwwpwwwpw
// wwwwwwwwwwwwwwww
// wwpwwwwpwwwwpwww
// wwwwwwwwwwwwwwww
// WwwwwwWwwwwwWwww
// wwwwwwwwwwwwwwww
// WWWWWWWWWWWWWWWW
// WwWwwwWwwwWwWwwW
// WWWWWWWWWWWWWWWW
// WWWWWWWWWWWWWWWW
// WWWWWWWWWWWWWWWW
// WWWWWWWWWWWWWWWW
// WWWWWWWWWWWWWWWW
// WWWWWWWWWWWWWWWW
const water_gap_0 = [
  [10,9,10,9,9,9,9,10,9,9,9,9,9,10,9,10],
  [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
  [8,6,6,8,6,6,6,6,6,6,8,6,6,6,8,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,6,8,6,6,6,6,8,6,6,6,6,8,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [7,6,6,6,6,6,7,6,6,6,6,6,7,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [7,6,7,6,6,6,7,6,6,6,7,6,7,6,6,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
];

// water_gap frame 1 — ripple-shifted left. Surface highlights migrate 1 cell
// left across the row. Reflection band sparkle distribution rotates.
const water_gap_1 = [
  [9,10,9,9,9,9,10,9,9,9,9,10,9,9,9,9],
  [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
  [6,8,6,6,6,8,6,6,6,8,6,6,6,8,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,8,6,6,6,6,8,6,6,6,6,8,6,6,6,8],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,6,7,6,6,6,6,6,7,6,6,6,6,6,7,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [6,7,6,6,6,7,6,6,6,7,6,7,6,6,7,6],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
];

// water_gap frame 2 — ripple-shifted right. Surface highlights migrate 1 cell
// right across the row. Reflection sparkles distribute differently again.
const water_gap_2 = [
  [9,9,9,10,9,9,9,9,10,9,9,9,9,10,9,9],
  [9,9,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
  [6,6,6,8,6,6,6,8,6,6,6,6,8,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [8,6,6,6,6,8,6,6,6,6,8,6,6,6,6,8],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,7,6,6,6,7,6,6,6,6,7,6,6,6,6,7],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [6,6,7,6,7,6,6,7,6,7,6,6,7,6,7,6],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
  [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
];

// mile_1 — digit "1" (shared signpost shape across all stages).
const mile_1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,14,14,14,14,14,14,14,14,14,14,14,14,1,0],
  [0,1,14,14,14,14,14,14,14,14,14,14,14,14,1,0],
  [0,1,14,14,14,14,1,14,14,14,14,14,14,14,1,0],
  [0,1,14,14,14,1,1,14,14,14,14,14,14,14,1,0],
  [0,1,14,14,14,14,1,14,14,14,14,14,14,14,1,0],
  [0,1,14,14,1,1,1,1,1,14,14,14,14,14,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,1,10,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,15,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,15,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,15,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,16,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,16,16,16,16,16,1,0,0,0,0,0],
  [0,0,0,1,16,16,16,16,16,16,16,1,0,0,0,0],
];

// mile_2 — digit "2".
const mile_2 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,14,14,14,14,14,14,14,14,14,14,14,14,1,0],
  [0,1,14,14,14,1,1,1,1,1,14,14,14,14,1,0],
  [0,1,14,14,14,14,14,14,14,1,14,14,14,14,1,0],
  [0,1,14,14,14,1,1,1,1,1,14,14,14,14,1,0],
  [0,1,14,14,14,1,14,14,14,14,14,14,14,14,1,0],
  [0,1,14,14,14,1,1,1,1,1,14,14,14,14,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,1,10,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,15,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,15,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,15,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,16,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,16,16,16,16,16,1,0,0,0,0,0],
  [0,0,0,1,16,16,16,16,16,16,16,1,0,0,0,0],
];

// mile_3 — digit "3".
const mile_3 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,14,14,14,14,14,14,14,14,14,14,14,14,1,0],
  [0,1,14,14,14,1,1,1,1,1,14,14,14,14,1,0],
  [0,1,14,14,14,14,14,14,14,1,14,14,14,14,1,0],
  [0,1,14,14,14,14,1,1,1,1,14,14,14,14,1,0],
  [0,1,14,14,14,14,14,14,14,1,14,14,14,14,1,0],
  [0,1,14,14,14,1,1,1,1,1,14,14,14,14,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,1,10,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,15,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,15,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,15,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,16,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,16,16,16,16,16,1,0,0,0,0,0],
  [0,0,0,1,16,16,16,16,16,16,16,1,0,0,0,0],
];

// mile_4 — digit "4".
const mile_4 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,14,14,14,14,14,14,14,14,14,14,14,14,1,0],
  [0,1,14,14,14,1,14,14,14,1,14,14,14,14,1,0],
  [0,1,14,14,14,1,14,14,14,1,14,14,14,14,1,0],
  [0,1,14,14,14,1,1,1,1,1,14,14,14,14,1,0],
  [0,1,14,14,14,14,14,14,14,1,14,14,14,14,1,0],
  [0,1,14,14,14,14,14,14,14,1,14,14,14,14,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,1,10,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,15,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,15,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,15,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,16,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,16,16,16,16,16,1,0,0,0,0,0],
  [0,0,0,1,16,16,16,16,16,16,16,1,0,0,0,0],
];

// stage_exit — within-area transition gate, waterside variant. The same arch
// silhouette as the cave's stage_exit, retinted: the supporting pillars are
// wet-shelf-stone (paler than cave-stone) and the crossbeam is the same
// dawn-amber + pale-gold glow with a bank-moss-dark sigil cell. Reads as
// "doorway to the next room" with stage-correct material under it.
const stage_exit = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,10,10,10,10,10,10,10,10,10,10,10,10,10,1],
  [0,1,10,10,9,9,9,9,9,9,9,9,9,10,10,1],
  [0,1,10,9,9,9,5,9,9,5,9,9,9,10,10,1],
  [0,1,10,10,9,9,9,9,9,9,9,9,9,10,10,1],
  [0,1,10,10,10,10,10,10,10,10,10,10,10,10,10,1],
  [0,1,3,0,0,0,0,0,0,0,0,0,0,3,0,1],
  [0,1,3,0,0,0,0,0,0,0,0,0,0,3,0,1],
  [0,1,3,0,0,0,0,0,0,0,0,0,0,3,0,1],
  [0,1,3,0,0,0,0,0,0,0,0,0,0,3,0,1],
  [0,1,3,0,0,0,0,0,0,0,0,0,0,3,0,1],
  [0,1,3,3,0,0,0,0,0,0,0,0,0,3,3,0],
  [16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16],
  [16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16],
];

export const TILES = {
  flat,
  slope_up_22,
  slope_up_45,
  slope_dn_22,
  slope_dn_45,
  rock_small,
  water_gap: { frames: [water_gap_0, water_gap_1, water_gap_2], fps: 3 },
  mile_1,
  mile_2,
  mile_3,
  mile_4,
  stage_exit,
};

export const META = {
  tile: 16,        // cell-matrix dimension in art-pixels (square)
  scale: 3,        // art-pixel → canvas-pixel scale; 16 × 3 = 48 = src TILE
  displayPx: 48,   // resulting on-canvas tile size; matches `TILE = 48` in src
};

// owning agent: design-lead
// TODO: original tile module for Area 1 Stage 2 — beach / shore (Phase 3, v0.75).
// Consumed by dev-lead's tile-cache renderer per docs/design/contracts.md.
// Each TILES entry is either a 16x16 matrix of palette indices (static) OR an
// {frames, fps} object (animated — water_gap). Renderer scales 3x to canvas TILE=48.
//
// Theme sequence reminder: forest → shore → cave → dark forest. This module
// is the sun-warmed shore (Stage 2), arriving after the forest seam (Stage 1)
// and before the cave (Stage 3). Per the v0.75 theme remap, the shore took
// over what was previously the waterside slot — visually the bones are very
// similar (wet stone + sea-water at gaps + reflection band) but the read is
// "open sea, tide-line, dawn sun on sea-foam" rather than "underground river
// shelf at noon." The lethal-water role at gaps is identical (Reed dies if
// he falls into it per the existing v0.50.2 gap-fall FSM).
//
// Tile keys & intent:
//   flat          — sun-warmed shore-floor (wet-shelf-stone with sea-moss
//                   top strip and occasional ripple-pale catchlight where
//                   the shelf is damp from the tide)
//   slope_up_22   — gentle uphill (22°)
//   slope_up_45   — steep uphill (45°)
//   slope_dn_22   — gentle downhill
//   slope_dn_45   — steep downhill
//   rock_small    — tide-line boulder (wet-stone toned, river-stone body)
//   water_gap     — animated sea-water gap, 3 frames @ ~3 fps. Visually
//                   sea-water (NOT empty sky), kills Reed if he falls into
//                   it (same death rule as a normal gap-fall per v0.50.2
//                   dying FSM). Renderer draws this tile where Stage 1 would
//                   have drawn nothing (transparent). Top edge carries a
//                   dawn-amber reflection band; main body is sea-deep blue-
//                   grey with subtle ripple highlights.
//   mile_1.._4    — round signposts (shared post + plank-with-digit shape
//                   from Stage 1, carried verbatim — the mile-marker is the
//                   trail chain across all stages)
//   stage_exit    — within-area transition gate (same key as Stage 3 cave
//                   tileset for consistency; visual is the wet-shelf-stone
//                   variant of the cave's amber-arch).
//
// Decision recorded: water_gap IS animated (3 frames @ 3 fps). We ship 3
// frames for the same visual aliveness the fire/vein hazards have. The
// ripple band drifts slowly across the surface — tide rhythm at dawn.
//
// Decision recorded: palette retained verbatim from the previous "Brinklane
// waterside" build. The hex set already reads as open water under dawn
// light — `#3a586a` reads as sea-deep just as well as river-deep, and
// `#6a8a4a` reads as sea-tinged shore-moss just as well as sun-fed bank-
// moss. We rename labels in this header comment without touching the hex
// values; this keeps the cumulative project palette stable across the
// theme remap. See `docs/design/palette-phase3.md` for the rolled-up table.
//
// Frame ASCII legend (per palette index):
//   .  = 0   transparent
//   o  = 1   velvet ink (#3a2e4a)
//   s  = 2   wet-shelf-stone (#8a9a96)        — shelf main face
//   S  = 3   wet-shelf-stone shadow (#5a6a6a) — shelf deep face
//   m  = 4   shore-moss / sea-tinged (#6a8a4a) — sun-fed tide-line moss
//   M  = 5   moss-green dark (#2e5028)        — moss shadow (shared)
//   w  = 6   sea-deep (#3a586a)               — water main face
//   W  = 7   sea-deep dark (#2a4258)          — water deep shadow
//   p  = 8   ripple-pale (#6a90a8)            — surface catchlight / sea-foam
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
  '#8a9a96',   //  2 wet-shelf-stone (paler than cave-stone — daylight tide rock)
  '#5a6a6a',   //  3 wet-shelf-stone shadow
  '#6a8a4a',   //  4 shore-moss / sea-tinged (sun-fed tide-line moss)
  '#2e5028',   //  5 moss-green dark (shared)
  '#3a586a',   //  6 sea-deep (slow open water; reads same as river-deep, repurposed)
  '#2a4258',   //  7 sea-deep dark
  '#6a90a8',   //  8 ripple-pale / sea-foam (surface catchlight)
  '#e8a040',   //  9 dawn-amber (shared) — sun-on-sea reflection band mid
  '#f8d878',   // 10 pale-gold (shared) — brightest sun-on-sea skim
  '#7a8088',   // 11 river-stone-grey (shared)
  '#4a5058',   // 12 river-stone shadow (shared)
  '#a8b0b8',   // 13 river-stone highlight (shared)
  '#e8d4a0',   // 14 cuff-cream (shared)
  '#4a3422',   // 15 wet-bark-brown (shared)
  '#5a3a22',   // 16 loam-soil shadow (shared)
  '#c8d4c8',   // 17 cave-stone catchlight (shared w/ stage3-cave)
];

// flat — sun-warmed shore-shelf floor. Top 2 rows: shore-moss strip with
// moss-dark accents (the salt-tolerant tide-line moss that grows along the
// shelf-top where dawn sun catches it). Next 4 rows: wet-shelf-stone main
// face. Below that: deeper shadow with occasional ripple-pale or shelf
// catchlight specks (the shelf is wet from the tide and catches light at
// random points). Bottom: shelf shadow band.
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

// slope_up_22 — gentle 22° uphill. Same stair-step shape as Stage 1.
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
// (the sea-water below catches the dawn sun and the reflection lands on the
// slope's crest — the visual touchstone of the shore).
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

// rock_small — tide-line boulder. Same authoring convention: transparent
// below row 12 to composite over a flat tile. Uses Stage 1's river-stone
// palette (shared verbatim) with a single shore-moss patch on the shaded
// side (sea-tinged green, slightly cooler than the forest's moss).
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

// water_gap frame 0 — neutral sea surface. Top row carries a dawn-amber +
// pale-gold reflection band (the dawn sun catches the open water). Body
// rows are sea-deep with subtle ripple-pale highlights. Bottom rows fade
// to sea-deep dark — the open water is deep enough to read "do not enter."
// Reed dies on contact via the existing v0.50.2 dying FSM (falling below
// the playable row). The tile renders the visible water surface.
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

// stage_exit — within-area transition gate, shore variant. The same arch
// silhouette as the cave's stage_exit, retinted: the supporting pillars are
// wet-shelf-stone (paler than cave-stone) and the crossbeam is the same
// dawn-amber + pale-gold glow with a moss-dark sigil cell. Reads as "doorway
// to the next room" with stage-correct material under it.
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

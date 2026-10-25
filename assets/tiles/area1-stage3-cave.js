// owning agent: design-lead
// TODO: original tile module for Area 1 Stage 3 — "Sumphollow" (cave) (Phase 3, v0.75).
// Consumed by dev-lead's tile-cache renderer per docs/design/contracts.md.
// Each TILES entry is either a 16x16 matrix of palette indices (static) OR an
// {frames, fps} object (animated — crystal_vein). Renderer scales 3x to canvas TILE=48.
//
// Theme sequence reminder: forest → shore → cave → dark forest. This module
// is the cave (Stage 3), arriving after the shore (Stage 2) and before the
// dark forest (Stage 4). The cave-content authoring is unchanged from the
// previous PR iteration; only the stage slot moved (cave was Stage 2, now
// Stage 3 per the v0.75 theme remap).
//
// Tile keys & intent:
//   flat          — standard cave-floor (cave-moss-blue-green top, cave-stone body)
//   slope_up_22   — gentle uphill (22°)
//   slope_up_45   — steep uphill (45°)
//   slope_dn_22   — gentle downhill (mirror of slope_up_22)
//   slope_dn_45   — steep downhill (mirror of slope_up_45)
//   rock_small    — standalone cave-rock (cooler-toned river-stone)
//   crystal_vein  — animated amber-vein hazard, 3 frames @ ~6 fps. 1-hit-kill.
//                   Glowing hairline crack in the cave floor (NO flame
//                   tongues — just a steady amber pulse on the stone surface).
//   mile_1.._4    — round signposts (digits unchanged from Stage 1; the post
//                   uses Stage 1's wet-bark/cuff-cream verbatim — mile markers
//                   are a shared trail-language across all stages so the player
//                   reads "same chain of markers, same world").
//   stage_exit    — stage-to-stage transition gate (NEW Phase 3 tile key).
//                   A short cave-stone arch with a glowing amber crossbeam.
//                   Used at end of Stage 3 → Stage 4. Visually distinct from
//                   `cairn` which is reserved for the end of Stage 4 / Area-
//                   clear beat.
//
// Decision recorded: hazard tile key chosen as `crystal_vein` per release-master
// brief (recommended `crystal_vein` or `amber_vein`). `crystal_vein` reads
// crystalline / mineral, matching the cave's "amber leaking through rock"
// fiction; `amber_vein` would imply biological. Chose crystalline.
//
// Decision recorded: introduced new key `stage_exit` (NOT reusing `cairn`).
// Brief allows either approach; new key gives renderer + dev-lead clearer
// semantic separation — `cairn` always means area-clear; `stage_exit` always
// means within-area stage chain. `cairn` is still defined here in case
// downstream tooling needs the key but in practice no Stage 3 round emits a
// `cairn` tile placement — it lives only at end-of-Stage-4.
//
// Frame ASCII legend (per palette index):
//   .  = 0   transparent
//   o  = 1   velvet ink (#3a2e4a)               — universal silhouette ink
//   m  = 2   cave-moss-blue-green base (#3a5e58) — top-edge moss strip
//   M  = 3   cave-moss-blue-green dark (#284844) — moss shadow
//   s  = 4   wet-cave-stone (#6a7878)           — stone main face
//   S  = 5   wet-cave-stone shadow (#4a5860)    — stone deep face
//   u  = 6   cave under-base (#3a4248)          — deepest cave fill (NO black)
//   C  = 7   cave-stone catchlight (#c8d4c8)    — pale highlight
//   r  = 8   river-stone-grey (#7a8088)         — rock_small base (shared w/ Stage 1)
//   k  = 9   river-stone shadow (#4a5058)       — rock dark
//   v  = a   velvet under-flame (#5a4a6e)       — vein base wash (NO black)
//   a  = b   dawn-amber (#e8a040)               — vein mid / shared warmth
//   g  = c   pale-gold (#f8d878)                — vein peak / shared warmth
//   c  = d   cuff-cream (#e8d4a0)               — mile-marker plank face
//   b  = e   wet-bark-brown (#4a3422)           — mile-marker shaft
//   L  = f   loam-soil shadow (#5a3a22)         — mile-marker footing
//   T  = 10  moss-green dark (#2e5028)          — stage_exit / cairn moss accent
//   R  = 11  river-stone highlight (#a8b0b8)    — rock highlight (shared)

export const PALETTE = [
  '#00000000', //  0 transparent
  '#3a2e4a',   //  1 velvet ink (shared w/ all phases — universal silhouette ink)
  '#3a5e58',   //  2 cave-moss-blue-green base
  '#284844',   //  3 cave-moss-blue-green dark
  '#6a7878',   //  4 wet-cave-stone
  '#4a5860',   //  5 wet-cave-stone shadow
  '#3a4248',   //  6 cave under-base (NO black, per world.md)
  '#c8d4c8',   //  7 cave-stone catchlight
  '#7a8088',   //  8 river-stone-grey base (shared w/ Stage 1 tiles)
  '#4a5058',   //  9 river-stone shadow (shared)
  '#5a4a6e',   // 10 velvet under-flame (shared w/ Stage 1 fire_low; NO black)
  '#e8a040',   // 11 dawn-amber (shared)
  '#f8d878',   // 12 pale-gold (shared)
  '#e8d4a0',   // 13 cuff-cream (shared)
  '#4a3422',   // 14 wet-bark-brown (shared)
  '#5a3a22',   // 15 loam-soil shadow (shared)
  '#2e5028',   // 16 moss-green dark (shared)
  '#a8b0b8',   // 17 river-stone highlight (shared)
];

// flat — standard cave-floor tile. Top 2 rows are cave-moss strip (the
// blue-green moss that grows in the dim wet of the cave). Next 4 rows are
// wet-cave-stone main face. Below that, deeper cave-stone shadow with
// occasional catchlight specks where mineral grains catch what little light
// finds its way down here. Bottom band is the cave under-base — a deep
// grey-blue that is emphatically NOT black per world.md.
// mmmmmmmmmmmmmmmm
// MMmMmmmMmmmMmmmM
// ssssssssssssssss
// ssssssssssssssss
// SsSssSsssSsssSsS
// SSSSSSSSSSSSSSSS
// ssssssssssssssss
// sCsssssssssCssss
// ssssssssssssssss
// sSsssssssssssSss
// SSSSSSSSSSSSSSSS
// SssSssssCssSssss
// ssssssssssssssss
// SSSSSSSSSSSSSSSS
// uuuuuuuuuuuuuuuu
// uuuuuuuuuuuuuuuu
const flat = [
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [3,3,2,3,2,2,2,3,2,2,2,3,2,2,2,3],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [5,4,5,4,4,5,4,4,4,5,4,4,4,5,4,5],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,7,4,4,4,4,4,4,4,4,4,7,4,4,4,4],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,5,4,4,4,4,4,4,4,4,4,4,4,4,5,4],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  [5,4,4,5,4,4,4,4,7,4,4,5,4,4,4,4],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
];

// slope_up_22 — gentle 22° uphill (1 vertical rise per 3 horizontal).
// Same stair-step rise as Stage 1's slope_up_22 but cave-tinted: moss on the
// rising lip, cave-stone body, cave under-base in the footing rows.
// ...........mmmmm
// .........mmssssm
// .......mmsssssss
// .....mmssssssssS
// ....mssssssssSsS
// ..mssssssssSSSSS
// .msssssssSSSSSSS
// msssSSSSSSSSSSSS
// SSSSSSSSSSSSSSSS
// ssssssssssssssss
// sCsssssssssssCss
// ssssssssssssssss
// sSssssssssssssss
// SSSSSSSSSSSSSSSS
// uuuuuuuuuuuuuuuu
// uuuuuuuuuuuuuuuu
const slope_up_22 = [
  [0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,2,2,4,4,4,4,2],
  [0,0,0,0,0,0,0,2,2,4,4,4,4,4,4,4],
  [0,0,0,0,0,2,2,4,4,4,4,4,4,4,4,5],
  [0,0,0,0,2,4,4,4,4,4,4,4,4,4,5,4],
  [0,0,2,2,4,4,4,4,4,4,4,4,4,5,5,5],
  [0,2,4,4,4,4,4,4,4,5,5,5,5,5,5,5],
  [2,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,7,4,4,4,4,4,4,4,4,4,4,4,7,4,4],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
];

// slope_up_45 — steep 45° uphill (1:1). Top edge rises diagonally; a single
// dawn-amber catch-light at the upper-right crest (the vein-glow finding the
// rising edge — replaces Stage 1's root-knot at the crest).
const slope_up_45 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,4],
  [0,0,0,0,0,0,0,0,0,0,0,0,2,2,4,4],
  [0,0,0,0,0,0,0,0,0,0,0,2,2,4,4,4],
  [0,0,0,0,0,0,0,0,0,0,2,2,4,4,4,4],
  [0,0,0,0,0,0,0,0,0,2,2,4,4,4,4,4],
  [0,0,0,0,0,0,0,0,2,2,4,4,4,4,4,11],
  [0,0,0,0,0,0,0,2,2,4,4,4,4,4,4,5],
  [0,0,0,0,0,0,2,2,4,4,4,4,4,5,5,5],
  [0,0,0,0,0,2,2,4,4,4,4,4,5,5,5,5],
  [0,0,0,0,2,2,4,4,4,5,5,5,5,5,5,5],
  [0,0,0,2,2,4,4,5,5,5,5,5,5,5,5,5],
  [0,0,2,2,4,5,5,5,5,5,5,5,5,5,5,5],
  [0,2,2,5,5,5,5,5,5,5,5,5,5,5,5,5],
  [2,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
];

// slope_dn_22 — gentle downhill (mirror of slope_up_22 along Y axis).
const slope_dn_22 = [
  [2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0],
  [2,4,4,4,4,2,2,0,0,0,0,0,0,0,0,0],
  [4,4,4,4,4,4,4,2,2,0,0,0,0,0,0,0],
  [5,4,4,4,4,4,4,4,4,2,2,0,0,0,0,0],
  [4,5,4,4,4,4,4,4,4,4,2,0,0,0,0,0],
  [5,5,5,4,4,4,4,4,4,4,4,2,2,0,0,0],
  [5,5,5,5,5,5,5,4,4,4,4,4,4,2,0,0],
  [5,5,5,5,5,5,5,5,5,5,5,4,4,4,2,0],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,4,4,4,7,4,4,4,4,4,4,4,7,4,4,4],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,5,4,4],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
];

// slope_dn_45 — steep downhill (mirror of slope_up_45). Catchlight on the
// top-left crest (the rising-front for a westbound traveler).
const slope_dn_45 = [
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [4,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [4,4,2,2,0,0,0,0,0,0,0,0,0,0,0,0],
  [4,4,4,2,2,0,0,0,0,0,0,0,0,0,0,0],
  [4,4,4,4,2,2,0,0,0,0,0,0,0,0,0,0],
  [4,4,4,4,4,2,2,0,0,0,0,0,0,0,0,0],
  [11,4,4,4,4,4,2,2,0,0,0,0,0,0,0,0],
  [5,4,4,4,4,4,4,2,2,0,0,0,0,0,0,0],
  [5,5,5,4,4,4,4,4,2,2,0,0,0,0,0,0],
  [5,5,5,5,4,4,4,4,4,2,2,0,0,0,0,0],
  [5,5,5,5,5,5,5,4,4,4,2,2,0,0,0,0],
  [5,5,5,5,5,5,5,5,5,4,4,2,2,0,0,0],
  [5,5,5,5,5,5,5,5,5,5,4,2,2,0,0,0],
  [5,5,5,5,5,5,5,5,5,5,5,5,2,2,0,0],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,2,2,0],
];

// rock_small — standalone cave-rock. Same authoring convention as Stage 1:
// transparent below row 12 so it composites on top of a flat tile. Slightly
// cooler-toned than the forest rock (more shadow, less moss). A single
// cave-moss-blue-green patch on the shaded side instead of forest-moss.
// ................
// ................
// ................
// .....oookoo.....
// ....oRRRkkko....
// ...orRRRrrkko...
// ..orMRRRrrkkko..
// ..oMMRRrrrkkko..
// .orMrrrrrrrkkko.
// .orrrrrrrrrkkko.
// .okkkkkkkkkkkko.
// ..oookkkkkkoo...
// ................
// ................
// ................
// ................
const rock_small = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,9,1,1,0,0,0,0,0],
  [0,0,0,0,1,17,17,17,9,9,9,1,0,0,0,0],
  [0,0,0,1,8,17,17,17,8,8,9,9,1,0,0,0],
  [0,0,1,8,3,17,17,17,8,8,9,9,9,1,0,0],
  [0,0,1,3,3,17,17,8,8,8,9,9,9,1,0,0],
  [0,1,8,3,8,8,8,8,8,8,8,9,9,9,1,0],
  [0,1,8,8,8,8,8,8,8,8,8,9,9,9,1,0],
  [0,1,9,9,9,9,9,9,9,9,9,9,9,9,1,0],
  [0,0,1,1,1,9,9,9,9,9,9,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// crystal_vein frame 0 — neutral pulse. A hairline crack running diagonally
// across the cave floor, glowing dawn-amber with pale-gold highlights at
// crystalline cluster points. NO flame tongues — the cave hazard is a
// **steady glow** on the floor, not a fire. Velvet under-flame wash on the
// lowest row replaces any black. Replaces Stage 1's fire_low as the
// 1-hit-kill hazard tile. 3 frames @ ~6 fps (slower than fire's 8 fps —
// the cave breathes more slowly than the forest).
// ................
// ................
// ................
// ................
// ................
// ................
// .....g..........
// ....gag.........
// ....agag.....g..
// ...aagag....gag.
// .gaaaagagaagaag.
// .gaaaaaaaaaaaag.
// .vvvvvvvvvvvvvv.
// ................
// ................
// ................
const crystal_vein_0 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,12,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,12,11,12,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,11,12,11,12,0,0,0,0,0,12,0,0],
  [0,0,0,11,11,12,11,12,0,0,0,0,12,11,12,0],
  [0,12,11,11,11,11,12,11,12,11,11,12,11,11,12,0],
  [0,12,11,11,11,11,11,11,11,11,11,11,11,11,12,0],
  [0,10,10,10,10,10,10,10,10,10,10,10,10,10,10,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// crystal_vein frame 1 — brighter pulse: more pale-gold sparkles surface in
// the cluster points (the vein "breathes in"). Same crack outline; sparkle
// distribution rotates.
const crystal_vein_1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,12,0,0,0,0,0,0,0,12,0,0],
  [0,0,0,0,12,12,12,0,0,0,0,0,12,12,12,0],
  [0,0,0,0,12,12,12,0,0,0,0,12,12,12,12,0],
  [0,0,0,12,12,12,12,12,0,0,12,12,12,12,12,0],
  [0,0,12,11,12,12,11,12,12,12,12,11,12,12,11,0],
  [12,11,11,11,11,12,11,11,12,11,11,12,11,11,12,0],
  [12,11,11,11,11,11,11,11,11,11,11,11,11,11,11,0],
  [0,10,10,10,10,10,10,10,10,10,10,10,10,10,10,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// crystal_vein frame 2 — dim pulse (the vein "breathes out"): only the central
// cluster + base wash remain visible; outer sparkles fade. Loop F0→F1→F2→F0
// reads as a slow respiratory glow.
const crystal_vein_2 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,12,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,11,11,11,0,0,0,0,0,0,0,0],
  [0,0,0,0,11,11,11,11,0,0,0,0,0,0,0,0],
  [0,0,11,11,11,11,11,11,11,11,11,11,11,11,0,0],
  [0,11,11,11,11,11,11,11,11,11,11,11,11,11,11,0],
  [0,10,10,10,10,10,10,10,10,10,10,10,10,10,10,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// mile_1 — cave variant of the mile-marker post. SAME wood shaft (wet-bark
// + loam-soil shadow) and SAME cuff-cream plank face with violet-ink digit
// "1" as Stage 1. The mile-marker is a chain across all stages — the
// player reads it as "the same trail, my count continues." Only the
// underlying floor (when the marker entity is placed) changes per-stage.
const mile_1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,13,13,13,13,13,13,13,13,13,13,13,13,1,0],
  [0,1,13,13,13,13,13,13,13,13,13,13,13,13,1,0],
  [0,1,13,13,13,13,1,13,13,13,13,13,13,13,1,0],
  [0,1,13,13,13,1,1,13,13,13,13,13,13,13,1,0],
  [0,1,13,13,13,13,1,13,13,13,13,13,13,13,1,0],
  [0,1,13,13,1,1,1,1,1,13,13,13,13,13,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,1,12,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,14,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,14,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,14,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,15,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,15,15,15,15,15,1,0,0,0,0,0],
  [0,0,0,1,15,15,15,15,15,15,15,1,0,0,0,0],
];

// mile_2 — digit "2" (same digit shape as Stage 1).
const mile_2 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,13,13,13,13,13,13,13,13,13,13,13,13,1,0],
  [0,1,13,13,13,1,1,1,1,1,13,13,13,13,1,0],
  [0,1,13,13,13,13,13,13,13,1,13,13,13,13,1,0],
  [0,1,13,13,13,1,1,1,1,1,13,13,13,13,1,0],
  [0,1,13,13,13,1,13,13,13,13,13,13,13,13,1,0],
  [0,1,13,13,13,1,1,1,1,1,13,13,13,13,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,1,12,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,14,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,14,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,14,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,15,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,15,15,15,15,15,1,0,0,0,0,0],
  [0,0,0,1,15,15,15,15,15,15,15,1,0,0,0,0],
];

// mile_3 — digit "3".
const mile_3 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,13,13,13,13,13,13,13,13,13,13,13,13,1,0],
  [0,1,13,13,13,1,1,1,1,1,13,13,13,13,1,0],
  [0,1,13,13,13,13,13,13,13,1,13,13,13,13,1,0],
  [0,1,13,13,13,13,1,1,1,1,13,13,13,13,1,0],
  [0,1,13,13,13,13,13,13,13,1,13,13,13,13,1,0],
  [0,1,13,13,13,1,1,1,1,1,13,13,13,13,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,1,12,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,14,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,14,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,14,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,15,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,15,15,15,15,15,1,0,0,0,0,0],
  [0,0,0,1,15,15,15,15,15,15,15,1,0,0,0,0],
];

// mile_4 — digit "4" (classic 7-segment 4; same as Stage 1).
const mile_4 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,13,13,13,13,13,13,13,13,13,13,13,13,1,0],
  [0,1,13,13,13,1,13,13,13,1,13,13,13,13,1,0],
  [0,1,13,13,13,1,13,13,13,1,13,13,13,13,1,0],
  [0,1,13,13,13,1,1,1,1,1,13,13,13,13,1,0],
  [0,1,13,13,13,13,13,13,13,1,13,13,13,13,1,0],
  [0,1,13,13,13,13,13,13,13,1,13,13,13,13,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,1,12,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,14,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,14,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,14,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,15,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,15,15,15,15,15,1,0,0,0,0,0],
  [0,0,0,1,15,15,15,15,15,15,15,1,0,0,0,0],
];

// stage_exit — within-area stage-to-stage transition gate. NEW Phase 3 tile
// key. Visually: a short cave-stone arch — two vertical river-stone pillars
// supporting a glowing dawn-amber crossbeam. The amber crossbeam reads as
// "doorway you walk through," distinct from the mile-marker (post + plank +
// digit) and the cairn (stone stack). A single moss-green-dark sigil cell
// inside the crossbeam echoes the stage's own moss palette so the player
// reads "this is the cave's door out."
// ................
// ................
// ..ooooooooooooo.
// .ogggggggggggggo
// .oggaaaaaaaaaggo
// .ogaaaTaaaTaaago
// .oggaaaaaaaaaggo
// .ogggggggggggggo
// .ok.........k.o.
// .ok.........k.o.
// .ok.........k.o.
// .ok.........k.o.
// .ok.........k.o.
// .okk.......kko..
// LLLLLLLLLLLLLLLL
// LLLLLLLLLLLLLLLL
const stage_exit = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,12,12,12,12,12,12,12,12,12,12,12,12,12,1],
  [0,1,12,12,11,11,11,11,11,11,11,11,11,12,12,1],
  [0,1,12,11,11,11,16,11,11,16,11,11,11,12,12,1],
  [0,1,12,12,11,11,11,11,11,11,11,11,11,12,12,1],
  [0,1,12,12,12,12,12,12,12,12,12,12,12,12,12,1],
  [0,1,9,0,0,0,0,0,0,0,0,0,0,9,0,1],
  [0,1,9,0,0,0,0,0,0,0,0,0,0,9,0,1],
  [0,1,9,0,0,0,0,0,0,0,0,0,0,9,0,1],
  [0,1,9,0,0,0,0,0,0,0,0,0,0,9,0,1],
  [0,1,9,0,0,0,0,0,0,0,0,0,0,9,0,1],
  [0,1,9,9,0,0,0,0,0,0,0,0,0,9,9,0],
  [15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15],
  [15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15],
];

// cairn — RESERVED for end-of-Area (end of Stage 4). Defined here for
// schema completeness and so a future stage-3 round COULD emit it as the
// final stage-4 transit. In practice Stage 3 round-data never emits this
// key; it is exported for renderer parity with `assets/tiles/area1.js`
// only. Same matrix as Stage 1 cairn, retinted to cave-stone palette.
// (Note: dev-lead's level-data for Stage 3 should use `stage_exit` at the
// end of Round 3-4, NOT `cairn`. The cairn is the Area-clear marker; in
// Phase 3 it lives only at the end of Stage 4.)
const cairn = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,9,9,9,1,0,0,0,0,0],
  [0,0,0,0,0,1,17,13,17,17,1,0,0,0,0,0],
  [0,0,0,0,0,1,13,13,13,17,9,1,0,0,0,0],
  [0,0,0,0,0,1,9,17,13,13,17,9,1,0,0,0],
  [0,0,0,0,1,9,17,17,17,17,17,9,1,0,0,0],
  [0,0,0,0,1,17,17,17,9,9,9,17,17,1,0,0],
  [0,0,0,1,9,17,17,9,9,9,9,17,17,9,1,0],
  [0,0,0,1,9,17,9,9,9,9,9,9,17,9,1,0],
  [0,0,1,17,17,17,17,17,9,9,9,17,17,17,17,1],
  [0,0,1,17,17,17,17,17,17,9,17,17,17,17,17,1],
  [0,1,9,9,9,9,9,9,9,9,9,9,9,9,9,1],
  [0,1,9,17,17,17,9,17,17,9,17,17,9,9,17,1],
  [0,1,9,9,9,9,9,9,9,9,9,9,9,9,9,9],
  [0,1,9,9,15,15,15,15,15,9,9,9,15,15,15,9],
  [15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15],
];

export const TILES = {
  flat,
  slope_up_22,
  slope_up_45,
  slope_dn_22,
  slope_dn_45,
  rock_small,
  crystal_vein: { frames: [crystal_vein_0, crystal_vein_1, crystal_vein_2], fps: 6 },
  mile_1,
  mile_2,
  mile_3,
  mile_4,
  stage_exit,
  cairn,
};

export const META = {
  tile: 16,        // cell-matrix dimension in art-pixels (square)
  scale: 3,        // art-pixel → canvas-pixel scale; 16 × 3 = 48 = src TILE
  displayPx: 48,   // resulting on-canvas tile size; matches `TILE = 48` in src
};

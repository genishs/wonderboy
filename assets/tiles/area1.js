// owning agent: design-lead
// TODO: original tile module for Area 1 — "The Mossline Path" (Phase 2, v0.50).
// Consumed by dev-lead's tile-cache renderer per docs/design/contracts.md.
// Each TILES entry is either a 16x16 matrix of palette indices (static) OR an
// {frames, fps} object (animated — fire_low). Renderer scales 3x to canvas TILE=48.
//
// Tile keys & intent (per docs/briefs/phase2-areas.md §2.1, §9.1 + cast §7-§9):
//   flat          — standard flat ground (loam top, bark side)
//   slope_up_22   — gentle uphill (22°, rise 1 in 3)        [right-tilted ramp profile]
//   slope_up_45   — steep uphill (45°, rise 1 in 1)         [diagonal ramp]
//   slope_dn_22   — gentle downhill (mirror of slope_up_22)
//   slope_dn_45   — steep downhill (mirror of slope_up_45)
//   rock_small    — one-tile-tall standalone rock (boulder)
//   fire_low      — animated low flame (3 frames, ~8 fps)
//   mile_1, _2, _3 — wooden mile-marker post w/ digit (rounds 1-1, 1-2, 1-3)
//   cairn         — boundary cairn (stack of three river-stones, sigil-stone topmost)
//
// Frame ASCII legend (per palette index):
//   .  = 0  transparent
//   o  = 1  velvet-shadow ink (#3a2e4a)            — universal silhouette ink
//   l  = 2  loam-soil base (#8a6038)               — dirt base
//   L  = 3  loam-soil shadow (#5a3a22)             — under-loam (Phase 1 bark base hex)
//   m  = 4  moss-green top (#4a7c3a)               — top-edge moss strip (Phase 1 tunic)
//   M  = 5  moss-green dark (#2e5028)              — moss shadow (Phase 1 tunic shadow)
//   b  = 6  wet-bark-brown (#4a3422)               — root/side fill (shared w/ Mossplodder)
//   d  = 7  dawn-amber root highlight (#e8a040)    — exposed root catching dawn (shared)
//   r  = 8  river-stone-grey base (#7a8088)        — rock/boulder/cairn-stone face
//   R  = 9  river-stone highlight (#a8b0b8)        — rock catch-light
//   k  = 10 river-stone shadow (#4a5058)           — rock dark face
//   c  = 11 cuff-cream plank / cairn-sigil (#e8d4a0) — wood plank face / sigil stone
//   F  = 12 fire base orange (#e85020)             — flame core
//   f  = 13 dawn-amber flame mid (#f8a040)         — flame mid-tongue
//   g  = 14 pale-gold flame tip (#f8d878)          — flame brightest tip
//   v  = 15 velvet under-flame (#5a4a6e)           — under-flame purple cool wash (NO black)

export const PALETTE = [
  '#00000000', // 0 transparent
  '#3a2e4a',   // 1 velvet ink
  '#8a6038',   // 2 loam-soil base
  '#5a3a22',   // 3 loam-soil shadow (== Phase 1 bark base; shared)
  '#4a7c3a',   // 4 moss-green top (== Phase 1 tunic moss; shared)
  '#2e5028',   // 5 moss-green dark (== Phase 1 tunic shadow; shared)
  '#4a3422',   // 6 wet-bark-brown (shared w/ Mossplodder shell-loam shadow)
  '#e8a040',   // 7 dawn-amber root highlight (shared w/ sapling-flare)
  '#7a8088',   // 8 river-stone-grey base
  '#a8b0b8',   // 9 river-stone highlight
  '#4a5058',   // 10 river-stone shadow
  '#e8d4a0',   // 11 cuff-cream (== Phase 1 cuff highlight; shared)
  '#e85020',   // 12 fire base orange
  '#f8a040',   // 13 fire mid (close to dawn-amber)
  '#f8d878',   // 14 fire tip pale-gold (== Phase 1 sapling flare-bright; shared)
  '#5a4a6e',   // 15 velvet under-flame (NO pure black, per world.md)
];

// flat — standard flat ground tile. Top 2 rows are moss-green, next 4 are loam, the
// rest is wet-bark side fill with occasional dawn-amber root highlights.
// mmmmmmmmmmmmmmmm
// MMmMmmmMmmmMmmmM
// llllllllllllllll
// llllllllllllllll
// LllLllLlllLlllLl
// LLLLLLLLLLLLLLLL
// bbbbbbbbbbbbbbbb
// bbdbbbbbbbdbbbbb
// bbbbbbbbbbbbbbbb
// bLbbbbbbbbbbbbLb
// bbbbbbbbbbbbbbbb
// bbbdbbbbbbbbbbbb
// bbbbbbbbbbbbbbbb
// bbbbbbbbbbbbbbbb
// LLLLLLLLLLLLLLLL
// LLLLLLLLLLLLLLLL
const flat = [
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [5,5,4,5,4,4,4,5,4,4,4,5,4,4,4,5],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [3,2,2,3,2,2,3,2,2,2,3,2,2,2,3,2],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,6,7,6,6,6,6,6,6,6,7,6,6,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,3,6,6,6,6,6,6,6,6,6,6,6,6,3,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,6,6,7,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
];

// slope_up_22 — gentle 22° uphill (1 vertical rise per 3 horizontal). Within a single
// tile of width 16, the top edge rises ~5-6 px from left to right. The slope-line
// shows a leading leaf-curl on the rising-front edge.
// ...........mmmmm
// .........mmllllm
// .......mmlllllll
// .....mmllllllllL
// ....mlllllllllLl
// ..mlllllllllLLLL
// .mlllllllLLLLLLL
// mlllLLLLLLLLLLLL
// LLLLLLLLLLLLLLLL
// bbbbbbbbbbbbbbbb
// bbdbbbbbbbbdbbbb
// bbbbbbbbbbbbbbbb
// bLbbbbbbbbbbbbbb
// bbbbbbbbbbbbbbbb
// LLLLLLLLLLLLLLLL
// LLLLLLLLLLLLLLLL
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
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,6,7,6,6,6,6,6,6,6,6,7,6,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,3,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
];

// slope_up_45 — steep 45° uphill (1:1). Top edge rises diagonally across the tile.
// A heavier root-knot at the crest (top-right) telegraphs the steep beat.
// ...............m
// ..............mm
// .............mml
// ............mmll
// ...........mmlll
// ..........mmllll
// .........mmlllll
// ........mmllllld
// .......mmllllllL
// ......mmlllllLLL
// .....mmlllllLLLL
// ....mmlllLLLLLLL
// ...mmllLLLLLLLLL
// ..mmlLLLLLLLLLLL
// .mmLLLLLLLLLLLLL
// mLLLLLLLLLLLLLLL
const slope_up_45 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,4,4,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,4,4,2,2,2],
  [0,0,0,0,0,0,0,0,0,0,4,4,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,4,4,2,2,2,2,2],
  [0,0,0,0,0,0,0,0,4,4,2,2,2,2,2,7],
  [0,0,0,0,0,0,0,4,4,2,2,2,2,2,2,3],
  [0,0,0,0,0,0,4,4,2,2,2,2,2,3,3,3],
  [0,0,0,0,0,4,4,2,2,2,2,2,3,3,3,3],
  [0,0,0,0,4,4,2,2,2,3,3,3,3,3,3,3],
  [0,0,0,4,4,2,2,3,3,3,3,3,3,3,3,3],
  [0,0,4,4,2,3,3,3,3,3,3,3,3,3,3,3],
  [0,4,4,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [4,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
];

// slope_dn_22 — gentle downhill (mirror of slope_up_22 along Y axis).
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
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,6,6,6,7,6,6,6,6,6,6,6,7,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,3,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
];

// slope_dn_45 — steep downhill (mirror of slope_up_45). Heavier root-knot at the
// top-left crest (the rising-front for a westbound traveler).
const slope_dn_45 = [
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,2,4,4,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,2,2,4,4,0,0,0,0,0,0,0,0,0,0,0],
  [2,2,2,2,4,4,0,0,0,0,0,0,0,0,0,0],
  [2,2,2,2,2,4,4,0,0,0,0,0,0,0,0,0],
  [7,2,2,2,2,2,4,4,0,0,0,0,0,0,0,0],
  [3,2,2,2,2,2,2,4,4,0,0,0,0,0,0,0],
  [3,3,3,2,2,2,2,2,4,4,0,0,0,0,0,0],
  [3,3,3,3,2,2,2,2,2,4,4,0,0,0,0,0],
  [3,3,3,3,3,3,3,2,2,2,4,4,0,0,0,0],
  [3,3,3,3,3,3,3,3,3,2,2,4,4,0,0,0],
  [3,3,3,3,3,3,3,3,3,3,2,4,4,0,0,0],
  [3,3,3,3,3,3,3,3,3,3,3,3,4,4,0,0],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,0],
];

// rock_small — one-tile-tall standalone rock. Wider at the base; rounded top with a
// catch-light highlight and a moss patch on the shaded side. Sits above a transparent
// "ground line" so it composites onto a flat-ground tile beneath it. (Authoring
// convention: rock_small is meant to be drawn ON TOP of a ground tile — fully solid
// pixels above row 8 only; lower rows are transparent so the underlying floor reads.)
// ................
// ................
// ................
// .....oookoo.....
// ....oRRRkkko....
// ...orRRRrrkko...
// ..orMRRRrrkkko..
// ..oMMRRrrrkkko..
// .ormrrrrrrrkkko.
// .ormrrrrrrrkkko.
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
  [0,0,0,0,0,1,1,1,10,1,1,0,0,0,0,0],
  [0,0,0,0,1,9,9,9,10,10,10,1,0,0,0,0],
  [0,0,0,1,8,9,9,9,8,8,10,10,1,0,0,0],
  [0,0,1,8,5,9,9,9,8,8,10,10,10,1,0,0],
  [0,0,1,5,5,9,9,8,8,8,10,10,10,1,0,0],
  [0,1,8,4,8,8,8,8,8,8,8,10,10,10,1,0],
  [0,1,8,4,8,8,8,8,8,8,8,10,10,10,1,0],
  [0,1,10,10,10,10,10,10,10,10,10,10,10,10,1,0],
  [0,0,1,1,1,10,10,10,10,10,10,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// fire_low frame 0 — low flame: three flame-tongues. Center tongue tallest, side
// tongues shorter. Base sits on rows 13-15 (the "ground line"); flame body in rows
// 7-12. Velvet under-flame wash on the lowest row instead of any black.
// ................
// ................
// .......g........
// ......gFg.......
// ......gFg.......
// .....gFFFg......
// ..g..gFFFg..g...
// .gFg.gFfFg.gFg..
// .gFg.gffFg.gFg..
// .gffggffffggffg.
// .gffffffffffffg.
// .vvvvvvvvvvvvvv.
// ................
// ................
// ................
// ................
const fire_low_0 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,14,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,14,12,14,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,14,12,14,0,0,0,0,0,0,0],
  [0,0,0,0,0,14,12,12,12,14,0,0,0,0,0,0],
  [0,0,14,0,0,14,12,12,12,14,0,0,14,0,0,0],
  [0,14,12,14,0,14,12,13,12,14,0,14,12,14,0,0],
  [0,14,12,14,0,14,13,13,12,14,0,14,12,14,0,0],
  [0,14,13,13,14,14,13,13,13,13,14,14,13,13,14,0],
  [0,14,13,13,13,13,13,13,13,13,13,13,13,13,14,0],
  [0,15,15,15,15,15,15,15,15,15,15,15,15,15,15,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// fire_low frame 1 — lean-left: tongues all bend slightly leftward; the right-side
// tongue is shortest in this frame. Center tongue's tip migrates one cell left.
const fire_low_1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,14,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,14,12,14,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,14,12,14,0,0,0,0,0,0,0,0],
  [0,0,0,0,14,12,12,12,14,0,0,0,0,0,0,0],
  [0,14,0,0,14,12,12,12,14,0,0,0,0,0,0,0],
  [14,12,14,0,14,12,13,12,14,0,0,14,14,0,0,0],
  [14,12,14,0,14,13,13,12,14,0,0,14,12,14,0,0],
  [14,13,13,14,14,13,13,13,13,14,14,13,13,14,0,0],
  [0,14,13,13,13,13,13,13,13,13,13,13,13,14,0,0],
  [0,15,15,15,15,15,15,15,15,15,15,15,15,15,15,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// fire_low frame 2 — lean-right: mirror of frame 1; center tongue's tip migrates one
// cell right, left-side tongue shortest. Looped F0→F1→F2→F0 reads as flicker.
const fire_low_2 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,14,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,14,12,14,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,14,12,14,0,0,0,0,0,0],
  [0,0,0,0,0,0,14,12,12,12,14,0,0,0,0,0],
  [0,0,0,0,0,0,14,12,12,12,14,0,0,14,0,0],
  [0,0,0,14,14,0,14,12,13,12,14,0,14,12,14,0],
  [0,0,14,12,14,0,14,13,13,12,14,0,14,12,14,0],
  [0,0,14,13,13,14,14,13,13,13,13,14,14,13,13,14],
  [0,0,14,13,13,13,13,13,13,13,13,13,13,13,13,14],
  [0,15,15,15,15,15,15,15,15,15,15,15,15,15,15,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// mile_marker_base — shared body of mile_1/2/3. A weathered wooden post with a plank
// crossbar near the top displaying a digit (the digit varies per round). Post stands
// on the floor — bottom rows are wet-bark; main shaft + crossbar fill the upper half.
// We bake the digit directly into the matrix (per release-master Q4: digits, not notches).
// Helper: build a marker matrix for a given digit-painter (rows 4-6 of plank face).
//
// Layout:
//   row 0:    sky / transparent
//   rows 1-2: plank crossbar top edge + bottom edge (cuff-cream face, dark ink ends)
//   rows 3-7: plank face (with digit baked in middle 3 rows)
//   rows 8-9: post top + dawn-amber notch
//   rows 10-13: post shaft (wet-bark with shadow)
//   rows 14-15: ground footing (loam shadow)

// Digit-1 painter: a single vertical bar in cells 7-8 of rows 4-6 + serif at top.
const mile_1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,11,11,11,11,11,11,11,11,11,11,11,11,1,0],
  [0,1,11,11,11,11,11,11,11,11,11,11,11,11,1,0],
  [0,1,11,11,11,11,1,11,11,11,11,11,11,11,1,0],
  [0,1,11,11,11,1,1,11,11,11,11,11,11,11,1,0],
  [0,1,11,11,11,11,1,11,11,11,11,11,11,11,1,0],
  [0,1,11,11,1,1,1,1,1,11,11,11,11,11,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,1,7,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,6,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,6,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,6,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,3,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,3,3,3,3,3,1,0,0,0,0,0],
  [0,0,0,1,3,3,3,3,3,3,3,1,0,0,0,0],
];

// Digit-2 painter: top horizontal, top-right vertical, middle horizontal, bottom-left
// vertical, bottom horizontal — rendered in dark-ink (1) cells across the plank face.
const mile_2 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,11,11,11,11,11,11,11,11,11,11,11,11,1,0],
  [0,1,11,11,11,1,1,1,1,1,11,11,11,11,1,0],
  [0,1,11,11,11,11,11,11,11,1,11,11,11,11,1,0],
  [0,1,11,11,11,1,1,1,1,1,11,11,11,11,1,0],
  [0,1,11,11,11,1,11,11,11,11,11,11,11,11,1,0],
  [0,1,11,11,11,1,1,1,1,1,11,11,11,11,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,1,7,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,6,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,6,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,6,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,3,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,3,3,3,3,3,1,0,0,0,0,0],
  [0,0,0,1,3,3,3,3,3,3,3,1,0,0,0,0],
];

// Digit-3 painter: top, top-right, middle, bottom-right, bottom — both horizontals
// and the right-side vertical are inked, middle horizontal partial. Reads as "3".
const mile_3 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,11,11,11,11,11,11,11,11,11,11,11,11,1,0],
  [0,1,11,11,11,1,1,1,1,1,11,11,11,11,1,0],
  [0,1,11,11,11,11,11,11,11,1,11,11,11,11,1,0],
  [0,1,11,11,11,11,1,1,1,1,11,11,11,11,1,0],
  [0,1,11,11,11,11,11,11,11,1,11,11,11,11,1,0],
  [0,1,11,11,11,1,1,1,1,1,11,11,11,11,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,1,7,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,6,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,6,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,6,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,3,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,3,3,3,3,3,1,0,0,0,0,0],
  [0,0,0,1,3,3,3,3,3,3,3,1,0,0,0,0],
];

// cairn — boundary cairn: stack of three river-stones with a sigil-stone topmost.
// Larger silhouette than the mile-marker (occupies a wider chunk of the tile).
// Stones render in three different river-stone tones for stack readability; the
// topmost stone is cuff-cream / dawn-amber for the carved sigil. Sits on the floor.
// ................
// ......okkko.....
// .....oRcRRo.....
// .....occcRko....
// .....okRccRko...
// ....okRRRRRko...
// ....oRRRkkkRRo..
// ...okRRkkkkRRko.
// ...okRkkkkkkRko.
// ..oRRRRRkkkRRRRo
// ..oRRRRRRkRRRRRo
// .okkkkkkkkkkkkko
// .okRRRkRRkRRkkRo
// .okkkkkkkkkkkkkk
// .okkLLLLLkkkLLLk
// LLLLLLLLLLLLLLLL
const cairn = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,10,10,10,1,0,0,0,0,0],
  [0,0,0,0,0,1,9,11,9,9,1,0,0,0,0,0],
  [0,0,0,0,0,1,11,11,11,9,10,1,0,0,0,0],
  [0,0,0,0,0,1,10,9,11,11,9,10,1,0,0,0],
  [0,0,0,0,1,10,9,9,9,9,9,10,1,0,0,0],
  [0,0,0,0,1,9,9,9,10,10,10,9,9,1,0,0],
  [0,0,0,1,10,9,9,10,10,10,10,9,9,10,1,0],
  [0,0,0,1,10,9,10,10,10,10,10,10,9,10,1,0],
  [0,0,1,9,9,9,9,9,10,10,10,9,9,9,9,1],
  [0,0,1,9,9,9,9,9,9,10,9,9,9,9,9,1],
  [0,1,10,10,10,10,10,10,10,10,10,10,10,10,10,1],
  [0,1,10,9,9,9,10,9,9,10,9,9,10,10,9,1],
  [0,1,10,10,10,10,10,10,10,10,10,10,10,10,10,10],
  [0,1,10,10,3,3,3,3,3,10,10,10,3,3,3,10],
  [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
];

export const TILES = {
  flat,
  slope_up_22,
  slope_up_45,
  slope_dn_22,
  slope_dn_45,
  rock_small,
  fire_low: { frames: [fire_low_0, fire_low_1, fire_low_2], fps: 8 },
  mile_1,
  mile_2,
  mile_3,
  cairn,
};

export const META = {
  tile: 16,        // cell-matrix dimension in art-pixels (square)
  scale: 3,        // art-pixel → canvas-pixel scale; 16 × 3 = 48 = src TILE
  displayPx: 48,   // resulting on-canvas tile size; matches `TILE = 48` in src
};

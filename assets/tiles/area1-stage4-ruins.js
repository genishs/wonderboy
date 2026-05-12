// owning agent: design-lead
// TODO: original tile module for Area 1 Stage 4 — "The Old Threshold" (Phase 3, v0.75).
// Consumed by dev-lead's tile-cache renderer per docs/design/contracts.md.
// Each TILES entry is either a 16x16 matrix of palette indices (static) OR an
// {frames, fps} object (animated — dawn_channel). Renderer scales 3x to canvas TILE=48.
//
// Tile keys & intent (per docs/briefs/phase3-area1-expansion.md §7 + §11):
//   flat          — mosaic-floor tile (carved-stone-pale base + occasional
//                   mosaic-cool moss patches + pillar-shadow-violet grout)
//   slope_up_22   — gentle uphill (22°)
//   slope_up_45   — steep uphill (45°)
//   slope_dn_22   — gentle downhill
//   slope_dn_45   — steep downhill
//   rock_small    — pillar-fragment (broken pillar stub; replaces forest rock
//                   semantically — same stumble + vitality-drain behavior)
//   dawn_channel  — animated decorative tile. NOT a hazard. 2 frames @ ~2 fps.
//                   An amber-glowing channel carved into the mosaic floor —
//                   reads as "the ruin still keeps its stored heat down here."
//                   Used in Round 4-2, 4-3 (decorative runs) and especially
//                   Round 4-4 (the long convergent stripe approaching the
//                   boss arena). Reed walks over it without consequence.
//   mile_1.._4    — round signposts (shared chain).
//   cairn         — END-OF-AREA cairn. Visually distinct from `stage_exit`
//                   (used in Stages 2-3). The cairn is the SAME stack-of-stones
//                   shape as Stage 1's cairn, retinted to the ruins' carved-
//                   stone palette + a dawn-amber sigil-stone topmost echoing
//                   the carved-channel motif. Used at end of Stage 4 to
//                   trigger the Area-clear ritual (boss already dead by then
//                   — the cairn is the visual closure of Area 1).
//
// Decision recorded: dawn_channel ships as a 2-frame animated tile (per brief
// §11.4 — "2-frame slow pulse ~2 fps"). The two frames differ subtly: amber
// glow intensity shifts; the channel's visual "breath." NOT a 1-hit-kill
// hazard. Renderer treats it like any animated decoration.
//
// Decision recorded: NO fire-equivalent / amber-vein / water hazard tile is
// defined here. Per brief §7 + §11: "The Old Threshold has no hazard tiles."
// Threat in Stage 4 is entirely Mossplodders + the boss. The dawn_channel is
// decoration only.
//
// Decision recorded: rock_small key carries the visual of a broken pillar
// segment (not a boulder). Same gameplay role as Stage 1/2/3 rock_small
// (stumble, no kill). The brief's "pillar_fragment" naming is honored
// visually but we keep the tile KEY as `rock_small` so dev-lead's level-data
// code can use the same key across all four stages without per-stage rename.
//
// Decision recorded: the boss arena floor is NOT shipped as a separate tile
// key. The boss arena uses `flat` mosaic floor (cols 32-43 of Round 4-4)
// per brief §8; the upper rows of the arena stay visually quiet (no busy
// tile detail) so the HUD strip reads cleanly at the top of the screen.
// Story brief allowed a "boss-arena-floor variant" — we don't need one;
// the existing `flat` reads correctly under the boss silhouette.
//
// Frame ASCII legend (per palette index):
//   .  = 0   transparent
//   o  = 1   velvet ink (#3a2e4a)
//   s  = 2   carved-stone-pale (#8a8478)     — mosaic floor base
//   S  = 3   carved-stone highlight (#a89c80) — sun-touched ridge
//   k  = 4   carved-stone shadow (#5a5448)   — grout / pillar undercut
//   p  = 5   pillar-shadow-violet (#684e6e)  — pillar deep shadow
//   M  = 6   mosaic-cool (#7a7080)           — moss-on-mosaic overlay
//   m  = 7   moss-green base (#4a7c3a)       — occasional moss patch
//   T  = 8   moss-green dark (#2e5028)       — moss patch shadow
//   a  = 9   dawn-amber (#e8a040)            — carved-channel mid
//   g  = a   pale-gold (#f8d878)             — carved-channel peak
//   r  = b   river-stone-grey (#7a8088)      — pillar-fragment base
//   R  = c   river-stone highlight (#a8b0b8) — pillar fragment catch-light
//   K  = d   river-stone shadow (#4a5058)    — pillar fragment shadow
//   c  = e   cuff-cream (#e8d4a0)            — mile-marker plank / cairn sigil
//   b  = f   wet-bark-brown (#4a3422)        — mile-marker shaft
//   L  = 10  loam-soil shadow (#5a3a22)      — mile-marker footing

export const PALETTE = [
  '#00000000', //  0 transparent
  '#3a2e4a',   //  1 velvet ink
  '#8a8478',   //  2 carved-stone-pale
  '#a89c80',   //  3 carved-stone highlight
  '#5a5448',   //  4 carved-stone shadow
  '#684e6e',   //  5 pillar-shadow-violet
  '#7a7080',   //  6 mosaic-cool
  '#4a7c3a',   //  7 moss-green base (shared)
  '#2e5028',   //  8 moss-green dark (shared)
  '#e8a040',   //  9 dawn-amber (shared)
  '#f8d878',   // 10 pale-gold (shared)
  '#7a8088',   // 11 river-stone-grey (shared)
  '#a8b0b8',   // 12 river-stone highlight (shared)
  '#4a5058',   // 13 river-stone shadow (shared)
  '#e8d4a0',   // 14 cuff-cream (shared)
  '#4a3422',   // 15 wet-bark-brown (shared)
  '#5a3a22',   // 16 loam-soil shadow (shared)
];

// flat — mosaic-floor tile. Top 2 rows: carved-stone-pale with a mosaic-cool
// moss overlay strip (the moss that has crept over the floor in undisturbed
// centuries). Rows 2-5: carved-stone-pale main face with grout-line accents
// (carved-stone shadow at cell boundaries — reads as "mosaic tile pattern").
// Rows 6-13: continuing mosaic with occasional small moss patches. Bottom:
// pillar-shadow-violet shadow band (the under-floor undercut — deeper
// than the Stage 1/2/3 ground shadows).
// MsMMsMMMsMMMsMMs
// sssssssssssssssM
// kssskssssksssssk
// ssssssssssssssss
// sSssssksssssSsss
// ksssssssssssssss
// ssssssksssssssss
// sssssssTsssssssm
// ssssssTTsssssss.
// ssssssssssssssss
// kssssssssksssssk
// ssMssssssssssMss
// ssssssssssssssss
// kkkkkkkkkkkkkkkk
// pppppppppppppppp
// pppppppppppppppp
const flat = [
  [6,2,6,6,2,6,6,6,2,6,6,6,2,6,6,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,6],
  [4,2,2,2,4,2,2,2,2,4,2,2,2,2,2,4],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,3,2,2,2,2,4,2,2,2,2,2,3,2,2,2],
  [4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,4,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,8,2,2,2,2,2,2,2,7],
  [2,2,2,2,2,2,8,8,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [4,2,2,2,2,2,2,2,2,4,2,2,2,2,2,4],
  [2,2,6,2,2,2,2,2,2,2,2,2,2,6,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
];

// slope_up_22 — gentle uphill, ruins-tinted.
const slope_up_22 = [
  [0,0,0,0,0,0,0,0,0,0,0,6,2,6,2,6],
  [0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2],
  [0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2],
  [0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,4],
  [0,0,0,0,2,2,2,2,2,2,2,2,2,2,4,2],
  [0,0,2,2,2,2,2,2,2,2,2,2,2,4,4,4],
  [0,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4],
  [2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,6,2,2,2,2,2,2,2,2,2,2,6,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
];

// slope_up_45 — steep uphill. A dawn-amber crest highlight reads as "the
// stored heat surfaces along the rising edge" — the same warmth motif as
// Stage 2's vein and the carved channels.
const slope_up_45 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2],
  [0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2],
  [0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,9],
  [0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,4],
  [0,0,0,0,0,0,2,2,2,2,2,2,2,4,4,4],
  [0,0,0,0,0,2,2,2,2,2,2,2,4,4,4,4],
  [0,0,0,0,2,2,2,2,2,4,4,4,4,4,4,4],
  [0,0,0,2,2,2,2,4,4,4,4,4,4,4,4,4],
  [0,0,2,2,2,4,4,4,4,4,4,4,4,4,4,4],
  [0,2,2,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
];

// slope_dn_22 — gentle downhill.
const slope_dn_22 = [
  [6,2,6,2,6,0,0,0,0,0,0,0,0,0,0,0],
  [2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0],
  [2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0],
  [4,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0],
  [2,4,2,2,2,2,2,2,2,2,2,2,0,0,0,0],
  [4,4,4,2,2,2,2,2,2,2,2,2,2,2,0,0],
  [4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,0],
  [4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,6,2,2,2,2,2,2,2,2,2,2,6,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
];

// slope_dn_45 — steep downhill.
const slope_dn_45 = [
  [2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0],
  [2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0],
  [2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0],
  [9,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0],
  [4,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0],
  [4,4,4,2,2,2,2,2,2,2,0,0,0,0,0,0],
  [4,4,4,4,2,2,2,2,2,2,2,0,0,0,0,0],
  [4,4,4,4,4,4,4,2,2,2,2,2,0,0,0,0],
  [4,4,4,4,4,4,4,4,4,2,2,2,2,0,0,0],
  [4,4,4,4,4,4,4,4,4,4,2,2,2,2,0,0],
  [4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,0],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2],
];

// rock_small — pillar-fragment (broken pillar stub). Authoring: transparent
// below row 12 to composite over a flat tile. Visually a low broken column
// stub with river-stone toning + carved-stone-pale cap + a pillar-shadow-
// violet undercut. Reads "this was once part of something taller."
// ................
// ................
// ................
// ....oRRRSSRRRo..
// ....oSsssssssSo.
// ....oSsssssssSo.
// ....oksssssssko.
// ....okssssssskKo
// ....okkkkkkkkKo.
// ....okkkkkkkkKo.
// ....opppppppKKo.
// ....opppppppppo.
// ................
// ................
// ................
// ................
const rock_small = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,12,12,12,3,3,12,12,12,1,0,0],
  [0,0,0,0,1,3,2,2,2,2,2,2,2,3,1,0],
  [0,0,0,0,1,3,2,2,2,2,2,2,2,3,1,0],
  [0,0,0,0,1,4,2,2,2,2,2,2,2,4,1,0],
  [0,0,0,0,1,4,2,2,2,2,2,2,2,4,13,1],
  [0,0,0,0,1,4,4,4,4,4,4,4,4,13,1,0],
  [0,0,0,0,1,4,4,4,4,4,4,4,4,13,1,0],
  [0,0,0,0,1,5,5,5,5,5,5,5,13,13,1,0],
  [0,0,0,0,1,5,5,5,5,5,5,5,5,5,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// dawn_channel frame 0 — neutral pulse. A 1-tile-wide amber strip carved into
// the mosaic floor. The channel sits across the floor's top region (rows
// 0-7 — visible at the floor's surface; rows 8-15 are mosaic floor body so
// the channel composites onto an adjacent flat tile when both render in the
// same column). Center cells are pale-gold (the deepest part of the carved
// glow); outer cells are dawn-amber; the channel's edges are bounded by
// velvet ink. Decorative ONLY — Reed walks over it.
// ................
// .oooooooooooooo.
// .oaaaaaaaaaaaao.
// .oaggaaaaaaggao.
// .oaaaggaaaaaaao.
// .oagaagaaaaaaao.
// .oaaaaagaagaaao.
// .oooooooooooooo.
// ssssssssssssssss
// kssssssssksssssk
// ssssssssssssssss
// ssMssssssssssMss
// ssssssssssssssss
// kkkkkkkkkkkkkkkk
// pppppppppppppppp
// pppppppppppppppp
const dawn_channel_0 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,9,9,9,9,9,9,9,9,9,9,9,9,1,0],
  [0,1,9,10,10,9,9,9,9,9,9,10,10,9,1,0],
  [0,1,9,9,9,10,10,9,9,9,9,9,9,9,1,0],
  [0,1,9,10,9,9,10,9,9,9,9,9,9,9,1,0],
  [0,1,9,9,9,9,9,10,9,9,10,9,9,9,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [4,2,2,2,2,2,2,2,2,4,2,2,2,2,2,4],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,6,2,2,2,2,2,2,2,2,2,2,6,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
];

// dawn_channel frame 1 — breathed-bright pulse. More pale-gold sparkles
// surface across the channel; the warmth has come up another notch. Loop
// F0↔F1 at 2 fps reads as a very slow respiratory glow (much slower than
// crystal_vein, much slower still than fire_low) — appropriate for "the
// ruin's stored heat is ancient, patient."
const dawn_channel_1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,9,10,9,9,10,9,9,10,9,9,10,9,1,0],
  [0,1,10,9,10,10,9,10,9,9,10,10,9,10,1,0],
  [0,1,9,10,10,9,10,9,10,9,9,10,10,10,1,0],
  [0,1,10,9,10,10,10,9,10,9,10,9,10,9,1,0],
  [0,1,9,10,9,10,9,10,10,10,10,9,10,10,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [4,2,2,2,2,2,2,2,2,4,2,2,2,2,2,4],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,6,2,2,2,2,2,2,2,2,2,2,6,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
];

// mile_1 — digit "1" (shared signpost shape).
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

// mile_4 — digit "4" (the last round of Area 1; the marker that points
// the player toward the boss's anteroom).
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

// cairn — END-OF-AREA boundary cairn. Stack of three carved-stone stones
// with a dawn-amber sigil-stone topmost (the carved-channel motif gathered
// into one stone — the ruin's stored heat surfaces here as the Area-clear
// blessing). Sigil reads as cuff-cream + dawn-amber rather than just cream
// (Stage 1's cairn was pure cuff-cream; the ruins variant warms it).
// Visually distinct from `stage_exit` (cave/water arch with horizontal
// crossbeam) so the player reads "this is the end of the road, not just
// another door."
// ................
// ......okcko.....
// .....ocaccko....
// .....oaccccko...
// .....ocSccSCko..
// ....okSScccSkS..
// ....oSSScccSSSo.
// ...okSSkSSSScSo.
// ...okSkSSSSSSco.
// ..oSSSSSSSScSSSc
// ..oSSSSSScSSSSSo
// .oKKKKKKKKKKKKKo
// .oKSSSKSSKSSKKKo
// .oKKKKKKKKKKKKKK
// .oKKLLLLLKKKLLLK
// LLLLLLLLLLLLLLLL
const cairn = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,14,9,14,1,0,0,0,0,0],
  [0,0,0,0,0,1,14,9,9,14,14,1,0,0,0,0],
  [0,0,0,0,0,1,9,14,14,14,14,1,0,0,0,0],
  [0,0,0,0,0,1,14,3,14,14,3,12,1,0,0,0],
  [0,0,0,0,1,12,3,3,14,14,14,3,1,0,0,0],
  [0,0,0,0,1,3,3,3,14,14,14,3,3,3,1,0],
  [0,0,0,1,12,3,3,13,3,3,3,3,3,14,1,0],
  [0,0,0,1,12,3,13,3,3,3,3,3,3,14,1,0],
  [0,0,1,3,3,3,3,3,3,3,3,3,14,3,3,14],
  [0,0,1,3,3,3,3,3,3,14,3,3,3,3,3,1],
  [0,1,13,13,13,13,13,13,13,13,13,13,13,13,13,1],
  [0,1,13,3,3,3,13,3,3,13,3,3,13,13,3,1],
  [0,1,13,13,13,13,13,13,13,13,13,13,13,13,13,13],
  [0,1,13,13,16,16,16,16,16,13,13,13,16,16,16,13],
  [16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16],
];

export const TILES = {
  flat,
  slope_up_22,
  slope_up_45,
  slope_dn_22,
  slope_dn_45,
  rock_small,
  dawn_channel: { frames: [dawn_channel_0, dawn_channel_1], fps: 2 },
  mile_1,
  mile_2,
  mile_3,
  mile_4,
  cairn,
};

export const META = {
  tile: 16,        // cell-matrix dimension in art-pixels (square)
  scale: 3,        // art-pixel → canvas-pixel scale; 16 × 3 = 48 = src TILE
  displayPx: 48,   // resulting on-canvas tile size; matches `TILE = 48` in src
};

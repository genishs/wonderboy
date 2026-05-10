// owning agent: design-lead
// TODO: original 18x12 sprite for the Hummerwing — Phase 2 (v0.50) low-altitude flier
//       (drift x3, dead x3). Cast brief §4.
//
// Frame ASCII legend (per palette index):
//   .  = 0  transparent
//   o  = 1  velvet-shadow ink (#3a2e4a)         — 1px outline (Phase 1 unifying violet)
//   a  = 2  sunwarm-amber base (#e8a040)        — thorax main face
//   A  = 3  sunwarm-amber shadow (#a86018)      — thorax under-shade
//   p  = 4  dust-pink highlight (#f8d4c8)       — thorax dorsal sheen
//   u  = 5  amber-underglow (#f8b860)            — bottom underglow band
//   w  = 6  wing-haze inner translucent (#f4e8f0a0)  — ~63% alpha (matches Phase 1 Glassmoth pearl)
//   W  = 7  wing-haze deeper translucent (#e0c8d870) — ~44% alpha
//   h  = 8  wing-haze edge (#fff4f0c0)           — ~75% alpha (Phase 1 Glassmoth dust trail)
//
// Hummerwing reads as a small warm round thorax with two pairs of fast-blurred wings
// fanning above and below. Default facing: LEFT (toward Reed). NO landing legs visible
// at this scale; just a fist-sized pollinator drifting forward at chest-high to a
// running boy. The dust-pink dorsal sheen + dawn-amber underglow are deliberate:
// players should feel "warm spark" against the cool forest parallax. Translucent wings
// re-use the Glassmoth alpha-palette policy (same hex values where shared).

export const PALETTE = [
  '#00000000', // 0 transparent
  '#3a2e4a',   // 1 velvet ink (shared with Phase 1 violet shadow)
  '#e8a040',   // 2 sunwarm-amber base (shared with Phase 1 sapling-flare amber)
  '#a86018',   // 3 sunwarm-amber shadow
  '#f8d4c8',   // 4 dust-pink highlight (close cousin of Phase 1 dust-pink #d89aa8 — brightened)
  '#f8b860',   // 5 amber-underglow
  '#f4e8f0a0', // 6 wing-haze inner translucent (~63% alpha) — shared exact hex w/ Phase 1 Glassmoth
  '#e0c8d870', // 7 wing-haze deeper translucent (~44% alpha) — shared exact hex w/ Phase 1 Glassmoth
  '#fff4f0c0', // 8 wing-haze edge (~75% alpha) — shared exact hex w/ Phase 1 Glassmoth dust trail
];

// drift frame 0 — wings up-blur: upper wing pair extended high above body (rows 0-3),
// lower wing pair tucked close (row 5). Body horizontal centre row 5-7.
// ..................
// .....hwww.h.......
// ....hwwwWwh.......
// .....wwwww........
// ......opo.........
// .....oapao........
// ....oapppao.......
// .....oAAAo........
// ......ouo.........
// ........hh........
// ..................
// ..................
const drift0 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,8,6,6,6,0,8,0,0,0,0,0,0,0],
  [0,0,0,0,8,6,6,6,7,6,8,0,0,0,0,0,0,0],
  [0,0,0,0,0,6,6,6,6,6,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,4,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,2,4,2,1,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,2,4,4,4,2,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,3,3,3,1,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,5,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,8,8,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// drift frame 1 — wings down-blur: upper wing pair tucked close (row 3), lower wing
// pair extended below body (rows 8-10). Inverse of frame 0; played at fps=12 the
// alternation reads as fast wing buzz.
// ..................
// .....h............
// ......W.h.........
// ......www.........
// ......opo.........
// .....oapao........
// ....oapppao.......
// .....oAAAo........
// ......ouo.........
// .....hwwwwWh......
// ....hwwwww........
// ..................
const drift1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,7,0,8,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,6,6,6,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,4,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,2,4,2,1,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,2,4,4,4,2,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,3,3,3,1,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,5,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,8,6,6,6,6,7,8,0,0,0,0,0,0],
  [0,0,0,0,8,6,6,6,6,6,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// drift frame 2 — passing-blur: wings symmetric (one cell each side), body
// translates 0; this frame breaks the perfect 2-frame loop and gives the buzz a
// subtle organic break so the sine-bob vertical motion (in Dev code) doesn't visually
// rhyme with the wing cycle.
// ..................
// .....h.....h......
// ....hw.....wh.....
// .....w......w.....
// ......opo.........
// .....oapao........
// ....oapppao.......
// .....oAAAo........
// ......ouo.........
// .....h......h.....
// ....hw.....wh.....
// ..................
const drift2 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,8,0,0,0,0,0,8,0,0,0,0,0,0],
  [0,0,0,0,8,6,0,0,0,0,0,6,8,0,0,0,0,0],
  [0,0,0,0,0,6,0,0,0,0,0,0,6,0,0,0,0,0],
  [0,0,0,0,0,0,1,4,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,2,4,2,1,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,2,4,4,4,2,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,3,3,3,1,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,5,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,8,0,0,0,0,0,0,8,0,0,0,0,0],
  [0,0,0,0,8,6,0,0,0,0,0,6,8,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// dead frame 0 — wings cease / body tilts: both wing pairs collapse to short stubs
// against the body; thorax tilts ~15° forward (the dorsal sheen migrates one cell
// ahead of centre). The amber underglow has gone — first absence of warmth.
const dead0 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,4,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,4,4,2,1,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,2,4,2,1,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,8,2,2,2,8,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,3,3,3,1,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,3,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// dead frame 1 — mid-fall, body upright: thorax has fallen one logical row and is
// now upright (centred on the spawn column); wing stubs trail above as the body
// drops. A single amber-underglow cell briefly returns at the bottom — the warmth
// catching one last time before the ground hit.
const dead1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,6,8,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,4,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,2,4,2,1,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,2,4,4,4,2,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,3,3,3,1,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,5,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// dead frame 2 — ground hit, fade: body has flattened against the ground (last row);
// dust puff cells radiate outward. The thorax has lost its amber (now mostly shadow
// + ink). Dev's 30-frame fade ramps the whole frame's alpha to zero.
const dead2 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,8,0,0,0,0,0,0,0,0,8,0,0,0,0,0],
  [0,0,8,1,1,1,3,3,3,3,1,1,1,8,0,0,0,0],
  [0,0,0,8,0,1,3,3,3,3,1,0,8,0,0,0,0,0],
];

export const FRAMES = {
  drift: [drift0, drift1, drift2],
  dead:  [dead0, dead1, dead2],
};

export const META = {
  w: 18,
  h: 12,
  anchor: { x: 8, y: 6 }, // body center — Hummerwing is airborne, anchor on thorax
  fps: 12,                // fast wing-blur cycle per cast brief §4.6
};

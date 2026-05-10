// owning agent: design-lead
// TODO: original 12x12 sprite for the hero's stone hatchet projectile — fly cycle (2 frames)
//       + splash (2 frames). Phase 2 (v0.50). Consumed by the Hatchet projectile system.
//
// Frame ASCII legend (per palette index):
//   .  = 0  transparent
//   o  = 1  violet undershadow / silhouette ink (#3a2e4a)   — never pure black
//   k  = 2  chip-stone-grey shadow (#5a6068)                — head dark face
//   K  = 3  chip-stone-grey base (#7e858e)                  — head main face
//   H  = 4  chip-stone-grey highlight (#b8c0c8)             — head bright edge
//   t  = 5  cloth-wrap-tan shadow (#7a5a3a)                 — handle binding shadow
//   T  = 6  cloth-wrap-tan base (#c89a68)                   — handle binding mid
//   d  = 7  dawn-amber spark (#e8a040)                      — splash spark / flash
//   D  = 8  pale-gold spark tip (#f8d878)                   — splash bright tip
//   p  = 9  morning-haze puff (#f8e8e8)                     — splash dust puff
//
// Reads as a wedge-headed hand-axe with a wrapped grip, spinning end-over-end. Bigger
// and more decisive than the retired stoneflake. Splash frames render on first contact
// (ground / wall / enemy) — a small dawn-amber spark + dust puff, never a fireball.
// Anchor is the visual centre so spin is symmetric about the body origin.

export const PALETTE = [
  '#00000000', // 0 transparent
  '#3a2e4a',   // 1 violet ink (matches Phase 1 unifying violet shadow)
  '#5a6068',   // 2 chip-stone shadow
  '#7e858e',   // 3 chip-stone base
  '#b8c0c8',   // 4 chip-stone highlight
  '#7a5a3a',   // 5 cloth-wrap shadow
  '#c89a68',   // 6 cloth-wrap base
  '#e8a040',   // 7 dawn-amber spark (Phase 1 sapling-flare amber)
  '#f8d878',   // 8 pale-gold spark tip (Phase 1 sapling-flare bright)
  '#f8e8e8',   // 9 morning-haze puff (Phase 1 Glassmoth haze, opaque variant)
];

// fly frame 0 — head-up: the wedge head sits high (rows 1-4), grip below (rows 6-9).
// Visible silhouette at 12 fps spin reads "axe head leading on top half of cycle."
// ............
// ...oooo.....
// ..oKKKHo....
// ..oKKKHo....
// ..oKKKko....
// ..ooKko.....
// ...otTo.....
// ...otTo.....
// ...otTo.....
// ...otTo.....
// ...oTTo.....
// ....oo......
const fly0 = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,1,1,1,0,0,0,0,0],
  [0,0,1,3,3,3,4,1,0,0,0,0],
  [0,0,1,3,3,3,4,1,0,0,0,0],
  [0,0,1,3,3,3,2,1,0,0,0,0],
  [0,0,1,1,3,2,1,0,0,0,0,0],
  [0,0,0,1,5,6,1,0,0,0,0,0],
  [0,0,0,1,5,6,1,0,0,0,0,0],
  [0,0,0,1,5,6,1,0,0,0,0,0],
  [0,0,0,1,5,6,1,0,0,0,0,0],
  [0,0,0,1,6,6,1,0,0,0,0,0],
  [0,0,0,0,1,1,0,0,0,0,0,0],
];

// fly frame 1 — head-down: full 180° spin. Wedge head at the bottom (rows 7-10), grip
// above (rows 2-5). Highlight side flips from upper-right to lower-left so the spin
// reads as rotation, not just vertical hop.
// ............
// ....oo......
// ...oTTo.....
// ...oTto.....
// ...oTto.....
// ...oTto.....
// ...oTto.....
// ..ooKko.....
// ..oKKKko....
// ..oHKKKo....
// ..oHKKKo....
// ...oooo.....
const fly1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,1,0,0,0,0,0,0],
  [0,0,0,1,6,6,1,0,0,0,0,0],
  [0,0,0,1,6,5,1,0,0,0,0,0],
  [0,0,0,1,6,5,1,0,0,0,0,0],
  [0,0,0,1,6,5,1,0,0,0,0,0],
  [0,0,0,1,6,5,1,0,0,0,0,0],
  [0,0,1,1,3,2,1,0,0,0,0,0],
  [0,0,1,3,3,3,2,1,0,0,0,0],
  [0,0,1,4,3,3,3,1,0,0,0,0],
  [0,0,1,4,3,3,3,1,0,0,0,0],
  [0,0,0,1,1,1,1,0,0,0,0,0],
];

// splash frame 0 — impact spark: a four-pointed dawn-amber star with pale-gold core,
// bracketed by puff cells. Plays on any first solid contact (enemy/wall/ground/rock).
// ............
// .....p......
// ....pdp.....
// ...pdDdp....
// ..pdDDDdp...
// ...pdDdp....
// ....pdp.....
// .....p......
// ............
// ............
// ............
// ............
const splash0 = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,9,0,0,0,0,0,0],
  [0,0,0,0,9,7,9,0,0,0,0,0],
  [0,0,0,9,7,8,7,9,0,0,0,0],
  [0,0,9,7,8,8,8,7,9,0,0,0],
  [0,0,0,9,7,8,7,9,0,0,0,0],
  [0,0,0,0,9,7,9,0,0,0,0,0],
  [0,0,0,0,0,9,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
];

// splash frame 1 — dissipating: the spark has gone, only a thin ring of haze puff
// remains, drifting outward. After this frame the projectile despawns.
// ............
// ....p.p.....
// ...p...p....
// ..p..d..p...
// ..p.....p...
// ..p.....p...
// ...p...p....
// ....p.p.....
// ............
// ............
// ............
// ............
const splash1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,9,0,9,0,0,0,0,0],
  [0,0,0,9,0,0,0,9,0,0,0,0],
  [0,0,9,0,0,7,0,0,9,0,0,0],
  [0,0,9,0,0,0,0,0,9,0,0,0],
  [0,0,9,0,0,0,0,0,9,0,0,0],
  [0,0,0,9,0,0,0,9,0,0,0,0],
  [0,0,0,0,9,0,9,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
];

export const FRAMES = {
  fly:    [fly0, fly1],
  splash: [splash0, splash1],
};

export const META = {
  w: 12,
  h: 12,
  anchor: { x: 6, y: 6 }, // body center — spin axis
  fps: 16,                // high spin rate per cast brief §6.2 ("blur read")
};

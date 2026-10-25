// owning agent: design-lead
// TODO: original 14x14 sprite for the dewplum fruit pickup — Phase 3, v0.75.1.
//       Common fruit, +20 vitality. Story-lead spec: `phase3-area1-expansion.md`
//       §15 (v0.75.1 addition — fruit pickups).
//
// Frame ASCII legend (per palette index):
//   .  = 0  transparent
//   o  = 1  violet ink (#3a2e4a)                — universal silhouette outline
//   v  = 2  river-blue body (#3a586a)           — main plum body (sea-deep family)
//   V  = 3  river-blue dark (#2a4258)           — under-curve plum shadow
//   c  = 4  dew-cool-cyan highlight (#a8c8d8)   — single dew-bead on upper-left
//   r  = 5  dawn-amber rim (#e8a040)            — warm ripeness rim under-belly
//   l  = 6  leaf-curl moss-green (#4a7c3a)      — tiny stem leaf-curl on top
//   d  = 7  cuff-cream highlight (#e8d4a0)      — frame-1 shimmer dew-pulse
//
// dewplum reads as a small rounded plum-shape, deep river-blue body. A single
// pale-cyan dew-bead on the upper-left curve catches the light. A thin warm-
// amber rim along the lower curve says "ripe, not raw." Tiny moss-green leaf-
// curl on top so the player reads a stem (per story-lead spec: "subtle leaf-
// curl on top"). About one-third tile across. No eyes; not a creature.
//
// META.fps = 4 (subtle shimmer; story-lead spec 16.5 §15.3 / brief item spec).
// 2 idle frames: frame 0 is base; frame 1 migrates the dew highlight by 1 px
// for the shimmer read.

export const PALETTE = [
  '#00000000', // 0 transparent
  '#3a2e4a',   // 1 violet ink (shared P1+P2)
  '#3a586a',   // 2 river-blue body (shared P3 — sea-deep family)
  '#2a4258',   // 3 river-blue dark (shared P3)
  '#a8c8d8',   // 4 dew-cool-cyan highlight (NEW v0.75.1)
  '#e8a040',   // 5 dawn-amber rim (shared P1+P2)
  '#4a7c3a',   // 6 leaf-curl moss-green (shared P1+P2)
  '#e8d4a0',   // 7 cuff-cream highlight (shared P1+P2)
];

// idle frame 0 — neutral plum: tiny leaf-curl stem at top, dew-bead on upper-
// left, warm amber rim along the lower curve.
// ..............
// ......l.......
// .....loo......
// ....oovvoo....
// ...ocvvvvvo...
// ...ovvvvvvo...
// ..ocvvvvvvvo..
// ..ovvvvvvvvo..
// ..ovvvvvvvVo..
// ..ovvvvvvVVo..
// ...ovvvvVVro..
// ...orVVVVVro..
// ....orrrrro...
// ..............
const idle0 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,6,0,0,0,0,0,0,0],
  [0,0,0,0,0,6,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,2,2,1,1,0,0,0,0],
  [0,0,0,1,4,2,2,2,2,2,1,0,0,0],
  [0,0,0,1,2,2,2,2,2,2,1,0,0,0],
  [0,0,1,4,2,2,2,2,2,2,2,1,0,0],
  [0,0,1,2,2,2,2,2,2,2,2,1,0,0],
  [0,0,1,2,2,2,2,2,2,2,3,1,0,0],
  [0,0,1,2,2,2,2,2,2,3,3,1,0,0],
  [0,0,0,1,2,2,2,2,3,3,5,1,0,0],
  [0,0,0,1,5,3,3,3,3,3,5,1,0,0],
  [0,0,0,0,1,5,5,5,5,5,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// idle frame 1 — dew shimmer pulse: the dew-cool-cyan highlight migrates from
// the (3,4) cell to a slightly brighter cuff-cream pixel at (4,3) — reads as
// the dew-bead catching a brighter glint as the morning rotates. Amber rim
// unchanged.
// ..............
// ......l.......
// .....loo......
// ....oocvvoo...
// ...ovvvvvvo...
// ...ovvvvvvo...
// ..ocvvvvvvvo..
// ..ovvvvvvvvo..
// ..ovvvvvvvVo..
// ..ovvvvvvVVo..
// ...ovvvvVVro..
// ...orVVVVVro..
// ....orrrrro...
// ..............
const idle1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,6,0,0,0,0,0,0,0],
  [0,0,0,0,0,6,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,7,2,2,1,1,0,0,0],
  [0,0,0,1,2,2,2,2,2,2,1,0,0,0],
  [0,0,0,1,2,2,2,2,2,2,1,0,0,0],
  [0,0,1,4,2,2,2,2,2,2,2,1,0,0],
  [0,0,1,2,2,2,2,2,2,2,2,1,0,0],
  [0,0,1,2,2,2,2,2,2,2,3,1,0,0],
  [0,0,1,2,2,2,2,2,2,3,3,1,0,0],
  [0,0,0,1,2,2,2,2,3,3,5,1,0,0],
  [0,0,0,1,5,3,3,3,3,3,5,1,0,0],
  [0,0,0,0,1,5,5,5,5,5,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

export const FRAMES = {
  idle: [idle0, idle1],
};

export const META = {
  w: 14,
  h: 14,
  anchor: { x: 7, y: 13 }, // base-center; sits flush on the ground
  fps: 4,                  // subtle shimmer (per story-lead §15.3)
};

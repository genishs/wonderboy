// owning agent: design-lead
// TODO: original 18x18 sprite for the amberfig fruit pickup — Phase 3, v0.75.1.
//       Rare fruit, +50 vitality. Story-lead spec: `phase3-area1-expansion.md`
//       §15 (v0.75.1 addition — fruit pickups).
//
// Frame ASCII legend (per palette index):
//   .  = 0  transparent
//   o  = 1  violet ink (#3a2e4a)                — universal silhouette outline
//   r  = 2  dawn-amber body mid (#e8a040)       — main fig body
//   R  = 3  amber-bright (#f8d878)              — bright catch on upper-right curve
//   d  = 4  amber-deep (#a85820)                — shadow under-curve (NEW v0.75.1)
//   c  = 5  pale-cream highlight (#e8d4a0)      — bright dew-glint (frame-2 pulse peak)
//   b  = 6  wet-bark-brown (#4a3422)            — stem-knot at top
//   l  = 7  leaf-curl moss-green base (#4a7c3a) — curled leaf-tip
//   L  = 8  leaf-curl moss-green dark (#2e5028) — leaf under-shadow
//   B  = 9  fig-cream-bright (#fff2c0)          — brightest pulse highlight (reuse from boss sigil)
//
// amberfig reads as a slightly larger teardrop fig-shape, warm dawn-amber body
// with a deep wet-bark stem-knot at the top and a single curled leaf-tip that
// catches a moss-green tone (per story-lead spec: "warmest small object on
// screen aside from Reed himself"). About half a tile across. The amberfig
// signals from afar via a bright pulsing highlight cycle.
//
// META.fps = 4. 3 idle frames cycle a brighter highlight from mid to peak
// to back, giving the player a "this one is special" read from a distance.

export const PALETTE = [
  '#00000000', // 0 transparent
  '#3a2e4a',   // 1 violet ink (shared P1+P2)
  '#e8a040',   // 2 dawn-amber body mid (shared P1+P2)
  '#f8d878',   // 3 amber-bright (shared P1+P2)
  '#a85820',   // 4 amber-deep / fig-flesh shadow (NEW v0.75.1)
  '#e8d4a0',   // 5 pale-cream highlight (shared P1+P2)
  '#4a3422',   // 6 wet-bark-brown stem-knot (shared P1+P2)
  '#4a7c3a',   // 7 leaf-curl moss-green base (shared P1+P2)
  '#2e5028',   // 8 leaf-curl moss-green dark (shared P1+P2)
  '#fff2c0',   // 9 fig-cream-bright (reuse from boss sigil — shared P3)
];

// idle frame 0 — base read: teardrop body, dark stem-knot at top, curled leaf
// extending up-right; lower body warmer at the base, slightly cooler at the
// upper round. Pale-cream catch on upper-right curve.
// ..................
// ........bbb.......
// .......bllL.......
// .......bllL.......
// ......oblLLo......
// .....orrRRRro.....
// ....orrrRRRrro....
// ...orRRRRRRRRro...
// ...orRRRRRRRRro...
// ..orrRRRrrRRRrro..
// ..orrRRrrrrRRrro..
// ..orrrrrrrrrrrro..
// ..orrrrdddrrrrro..
// ..orrrddrrrdrrro..
// ...orrddrrrdrro...
// ...oorddrrddroo...
// ....ooorddrooo....
// ..................
const idle0 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,6,6,6,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,6,7,7,8,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,6,7,7,8,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,6,7,8,8,1,0,0,0,0,0,0],
  [0,0,0,0,0,1,2,2,3,3,3,2,1,0,0,0,0,0],
  [0,0,0,0,1,2,2,2,3,3,3,2,2,1,0,0,0,0],
  [0,0,0,1,2,3,3,3,3,3,3,3,3,2,1,0,0,0],
  [0,0,0,1,2,3,3,3,3,3,3,3,3,2,1,0,0,0],
  [0,0,1,2,2,3,3,3,2,2,3,3,3,2,2,1,0,0],
  [0,0,1,2,2,3,3,2,2,2,2,3,3,2,2,1,0,0],
  [0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0],
  [0,0,1,2,2,2,2,4,4,4,2,2,2,2,2,1,0,0],
  [0,0,1,2,2,2,4,4,2,2,2,4,2,2,2,1,0,0],
  [0,0,0,1,2,2,4,4,2,2,2,4,2,2,1,0,0,0],
  [0,0,0,1,1,2,4,2,2,2,2,4,2,1,1,0,0,0],
  [0,0,0,0,1,1,1,2,4,4,2,1,1,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// idle frame 1 — pulse rising: cream highlight extends across the upper-right
// curve, signalling "this fruit is special." Lower amber-deep shadow stays the
// same; the body becomes a brighter cream-bright on top.
// ..................
// ........bbb.......
// .......bllL.......
// .......bllL.......
// ......oblLLo......
// .....orrRcRro.....
// ....orrRccRrro....
// ...orRRccccRRro...
// ...orRRcccRRRro...
// ..orrRRRrrRRRrro..
// ..orrRRrrrrRRrro..
// ..orrrrrrrrrrrro..
// ..orrrrdddrrrrro..
// ..orrrddrrrdrrro..
// ...orrddrrrdrro...
// ...oorddrrddroo...
// ....ooorddrooo....
// ..................
const idle1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,6,6,6,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,6,7,7,8,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,6,7,7,8,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,6,7,8,8,1,0,0,0,0,0,0],
  [0,0,0,0,0,1,2,2,3,5,3,2,1,0,0,0,0,0],
  [0,0,0,0,1,2,2,2,3,5,5,2,2,1,0,0,0,0],
  [0,0,0,1,2,3,3,3,5,5,5,5,3,2,1,0,0,0],
  [0,0,0,1,2,3,3,3,5,5,5,3,3,2,1,0,0,0],
  [0,0,1,2,2,3,3,3,2,2,3,3,3,2,2,1,0,0],
  [0,0,1,2,2,3,3,2,2,2,2,3,3,2,2,1,0,0],
  [0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0],
  [0,0,1,2,2,2,2,4,4,4,2,2,2,2,2,1,0,0],
  [0,0,1,2,2,2,4,4,2,2,2,4,2,2,2,1,0,0],
  [0,0,0,1,2,2,4,4,2,2,2,4,2,2,1,0,0,0],
  [0,0,0,1,1,2,4,2,2,2,2,4,2,1,1,0,0,0],
  [0,0,0,0,1,1,1,2,4,4,2,1,1,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// idle frame 2 — pulse peak: a single fig-cream-bright pixel-cluster (palette
// index 9) glints at the very center of the upper-right curve. This is the
// brightest single pixel on the amberfig; visible from a distance, telling
// the player "this is the special one." Same body otherwise.
// ..................
// ........bbb.......
// .......bllL.......
// .......bllL.......
// ......oblLLo......
// .....orrRcBro.....
// ....orrRcBBRrro...
// ...orRRcBBcRRro...
// ...orRRccccRRRo...
// ..orrRRRrrRRRrro..
// ..orrRRrrrrRRrro..
// ..orrrrrrrrrrrro..
// ..orrrrdddrrrrro..
// ..orrrddrrrdrrro..
// ...orrddrrrdrro...
// ...oorddrrddroo...
// ....ooorddrooo....
// ..................
const idle2 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,6,6,6,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,6,7,7,8,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,6,7,7,8,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,6,7,8,8,1,0,0,0,0,0,0],
  [0,0,0,0,0,1,2,2,3,5,9,2,1,0,0,0,0,0],
  [0,0,0,0,1,2,2,2,3,5,9,9,2,1,0,0,0,0],
  [0,0,0,1,2,3,3,3,5,9,9,5,3,2,1,0,0,0],
  [0,0,0,1,2,3,3,3,5,5,5,5,3,2,1,0,0,0],
  [0,0,1,2,2,3,3,3,2,2,3,3,3,2,2,1,0,0],
  [0,0,1,2,2,3,3,2,2,2,2,3,3,2,2,1,0,0],
  [0,0,1,2,2,2,2,2,2,2,2,2,2,2,2,1,0,0],
  [0,0,1,2,2,2,2,4,4,4,2,2,2,2,2,1,0,0],
  [0,0,1,2,2,2,4,4,2,2,2,4,2,2,2,1,0,0],
  [0,0,0,1,2,2,4,4,2,2,2,4,2,2,1,0,0,0],
  [0,0,0,1,1,2,4,2,2,2,2,4,2,1,1,0,0,0],
  [0,0,0,0,1,1,1,2,4,4,2,1,1,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

export const FRAMES = {
  idle: [idle0, idle1, idle2],
};

export const META = {
  w: 18,
  h: 18,
  anchor: { x: 9, y: 17 }, // base-center
  fps: 4,                  // pulse glow cycle (per story-lead §15.3)
};

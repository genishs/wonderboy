// owning agent: design-lead
// TODO: original 8x8 sprite for the hero's stoneflake projectile — fly cycle (2 frames).
//
// Frame ASCII legend (per palette index):
//   .  = 0  transparent
//   o  = 1  deep moss outline (#1a2618)
//   p  = 2  pebble dark (#6e6258)
//   r  = 3  pebble mid (#a89880)
//   c  = 4  pebble cream (#d8c8a8)
//   h  = 5  pebble specular highlight (#f0e8c8)
//
// Each frame shows a small flat skipping stone tilting slightly between frames so it
// reads as "spinning along its long axis" while in flight. No magical glow, no fire —
// it's a pebble. Anchor is the visual centre.

export const PALETTE = [
  '#00000000', // 0 transparent
  '#1a2618',   // 1 deep moss outline (matches hero outline family)
  '#6e6258',   // 2 pebble dark
  '#a89880',   // 3 pebble mid
  '#d8c8a8',   // 4 pebble cream
  '#f0e8c8',   // 5 pebble specular highlight
];

// fly frame 0 — long-axis horizontal: stone reads as a flat oval, highlight on upper-left.
// ........
// ..ooo...
// .ohhcc..
// .occcc..
// .occcr..
// .oprrro.
// ..oppo..
// ........
const fly0 = [
  [0,0,0,0,0,0,0,0],
  [0,0,1,1,1,0,0,0],
  [0,1,5,5,4,4,0,0],
  [0,1,4,4,4,4,0,0],
  [0,1,4,4,4,3,0,0],
  [0,1,2,3,3,3,1,0],
  [0,0,1,2,2,1,0,0],
  [0,0,0,0,0,0,0,0],
];

// fly frame 1 — slight rotation: long-axis tilted ~15°, highlight migrates right.
// ........
// ...oo...
// ..ohcc..
// ..occco.
// .occcc..
// .oprrr..
// .oprro..
// ..oo....
const fly1 = [
  [0,0,0,0,0,0,0,0],
  [0,0,0,1,1,0,0,0],
  [0,0,1,5,4,4,0,0],
  [0,0,1,4,4,4,1,0],
  [0,1,4,4,4,4,0,0],
  [0,1,2,3,3,3,0,0],
  [0,1,2,3,3,1,0,0],
  [0,0,1,1,0,0,0,0],
];

export const FRAMES = {
  fly: [fly0, fly1],
};

export const META = {
  w: 8,
  h: 8,
  anchor: { x: 4, y: 4 }, // body center
  fps: 12,
};

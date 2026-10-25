// owning agent: design-lead
// TODO: original 24x12 sprite for the Crawlspine — Phase 1 ground crawler (walk x2, dead x1).
//
// Frame ASCII legend (per palette index):
//   .  = 0  transparent
//   o  = 1  outline (one-step-darker bark, never pure black) (#1a1410)
//   b  = 2  bark base (#5a3a22)
//   B  = 3  bark shadow (#3a2410)
//   r  = 4  ridge chitin-bronze (#a87838)
//   R  = 5  ridge highlight (#e8c060)
//   m  = 6  underside moss-green (#3a5a28)
//   v  = 7  violet undershade (#3a2e4a)
//
// Crawlspine reads as "moving terrain": a flat armored loaf of bread with a single bright
// ridge of bronze plates running front-to-back. No legs visible at this scale — only the
// rippling ridge tells the player it's alive. Facing right by default; renderer mirrors
// for left.

export const PALETTE = [
  '#00000000', // 0 transparent
  '#1a1410',   // 1 deep bark outline
  '#5a3a22',   // 2 bark base
  '#3a2410',   // 3 bark shadow
  '#a87838',   // 4 chitin-bronze ridge
  '#e8c060',   // 5 ridge highlight (catches dawn)
  '#3a5a28',   // 6 moss undertone
  '#3a2e4a',   // 7 violet undershade
];

// walk frame 0 — ridge plates lifted at front-third (1, 2 high), low at back-third.
// ........................
// ..............oooo......
// .........ooooorrroo.....
// ......oooorRRRrrrrroo...
// ....oorrrrRrRrRRrrRrro..
// ..oobbbbbbbbbbbbbbbbboo.
// .obBBBbBBBBBBBBBBBBBBBo.
// .obBBBBBBBBBBBBBBBBBBBo.
// .obvvBBvvBBvvBBvvBBvvbo.
// ..ommBBmmBBmmBBmmBBmmo..
// ...oommmmmmmmmmmmmmoo...
// .....oooooooooooooo.....
const walk0 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,1,1,1,1,1,4,4,4,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,1,1,5,5,5,4,4,4,4,4,4,1,1,0,0,0],
  [0,0,0,0,1,1,4,4,4,4,5,4,5,4,5,5,4,4,5,4,4,1,0,0],
  [0,0,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0],
  [0,1,2,3,3,3,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,1],
  [0,1,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,1],
  [0,1,2,7,7,3,3,7,7,3,3,7,7,3,3,7,7,3,3,7,7,2,1,0],
  [0,0,1,6,6,3,3,6,6,3,3,6,6,3,3,6,6,3,3,6,6,1,0,0],
  [0,0,0,1,1,6,6,6,6,6,6,6,6,6,6,6,6,6,6,1,1,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
];

// walk frame 1 — ripple shifted: ridge plates lifted at back-third now, lower at front-third.
const walk1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,4,4,4,4,1,1,1,1,1,0,0,0,0,0,0,0],
  [0,0,0,1,1,1,4,4,4,5,5,5,4,4,4,4,1,1,1,0,0,0,0,0],
  [0,1,1,4,4,5,4,5,4,5,5,5,4,5,5,4,4,4,4,1,1,0,0,0],
  [1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,0,0],
  [1,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,1,0],
  [1,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,1,0],
  [1,2,7,7,3,3,7,7,3,3,7,7,3,3,7,7,3,3,7,7,3,2,1,0],
  [0,1,6,6,3,3,6,6,3,3,6,6,3,3,6,6,3,3,6,6,1,0,0,0],
  [0,0,1,1,6,6,6,6,6,6,6,6,6,6,6,6,6,6,1,1,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
];

// dead frame 0 — belly-up settle: body flipped, moss underside now on top, ridge gone (tucked).
// One-frame poof per release-master Q5; this is the resting belly-up read.
const dead0 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,0,0,1,6,6,6,6,6,6,6,6,6,6,6,6,6,6,1,0,0,0,0],
  [0,0,0,1,6,6,7,7,6,6,7,7,6,6,7,7,6,6,7,6,1,0,0,0],
  [0,0,1,6,6,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,6,1,0,0],
  [0,1,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,1,0],
  [0,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,0],
  [0,0,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

export const FRAMES = {
  walk: [walk0, walk1],
  dead: [dead0],
};

export const META = {
  w: 24,
  h: 12,
  anchor: { x: 12, y: 11 }, // feet center (bottom-center)
  fps: 6,
};

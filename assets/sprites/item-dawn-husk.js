// owning agent: design-lead
// TODO: original 12x12 sprite for the dawn-husk pickup — Phase 2 (v0.50). Reed runs
//       into it and it cracks open, the stone hatchet appears in his hand. Cast
//       brief §5.
//
// Frame ASCII legend (per palette index):
//   .  = 0  transparent
//   o  = 1  violet undershadow / silhouette ink (#3a2e4a)
//   l  = 2  shell-loam shadow (#7a5238)            — base under-shade (matches Mossplodder shell-loam)
//   L  = 3  shell-loam base (#a8794a)              — speckled shell main face
//   c  = 4  cuff-cream highlight (#e8d4a0)         — dorsal speckle highlight (Phase 1 cuff)
//   r  = 5  dawn-amber rim (#e8a040)               — eastern dawn-rim glow (shared)
//   R  = 6  dawn-amber bright (#f8d878)            — flash-of-amber between halves (shared)
//   d  = 7  dark fleck (#5a3a22)                   — sparse darker speckle (Phase 1 bark base)
//
// Resting on the ground, not hovering. Oval with slightly heavier base (the lower
// rows are wider so the silhouette reads "nested into the loam"). Two-tone speckle:
// shell-loam base with sparse darker fleck and cuff-cream highlight cells. Faint
// dawn-amber along the eastern (right-facing) arc keeps the silhouette unmistakable
// at low contrast. After break, the dev system spawns Reed armed; the husk halves
// do not persist.

export const PALETTE = [
  '#00000000', // 0 transparent
  '#3a2e4a',   // 1 violet ink
  '#7a5238',   // 2 shell-loam shadow
  '#a8794a',   // 3 shell-loam base
  '#e8d4a0',   // 4 cuff-cream speckle highlight
  '#e8a040',   // 5 dawn-amber rim
  '#f8d878',   // 6 dawn-amber bright (flash)
  '#5a3a22',   // 7 dark fleck
];

// rest frame 0 — intact husk: oval, base wider than top, eastern dawn-rim catching
// light on the right side. Two cuff-cream speckle cells on the dorsal face; one
// dark-fleck cell on the western side for the "river-stone" read.
// ............
// ....oooo....
// ...oLcLLo...
// ..oLLLLLLr..
// ..oLdLLLLr..
// .oLLLLLLLLr.
// .oLLLLcLLLr.
// .olllllllllr
// ..ollllllll.
// ..ooollllo..
// .....oooo...
// ............
const rest0 = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,0,0,0,0],
  [0,0,0,1,3,4,3,3,1,0,0,0],
  [0,0,1,3,3,3,3,3,3,5,0,0],
  [0,0,1,3,7,3,3,3,3,5,0,0],
  [0,1,3,3,3,3,3,3,3,3,5,0],
  [0,1,3,3,3,3,4,3,3,3,5,0],
  [0,1,2,2,2,2,2,2,2,2,2,5],
  [0,0,1,2,2,2,2,2,2,2,2,0],
  [0,0,1,1,1,2,2,2,2,1,0,0],
  [0,0,0,0,0,1,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
];

// rest frame 1 — slow shimmer: identical body shape but the dawn-rim brightens by
// one cell down the eastern arc, and one extra cuff-cream speckle migrates to a
// new dorsal cell. Played at fps=2 (META.fps overrides — see suggested egg.shimmerFps
// = 2 in cast brief §5.5) it reads as the stone slowly catching morning sun.
const rest1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,0,0,0,0],
  [0,0,0,1,3,3,4,3,1,0,0,0],
  [0,0,1,3,4,3,3,3,3,5,0,0],
  [0,0,1,3,3,3,3,3,3,5,0,0],
  [0,1,3,3,3,3,3,3,3,3,5,0],
  [0,1,3,3,7,3,3,3,3,3,5,0],
  [0,1,2,2,2,2,2,2,2,2,5,5],
  [0,0,1,2,2,2,2,2,2,2,5,0],
  [0,0,1,1,1,2,2,2,2,1,0,0],
  [0,0,0,0,0,1,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
];

// break frame 0 — fissure opens diagonally (top-left to bottom-right). The husk
// silhouette is still whole; a single column of transparent + dawn-amber bright
// cells cuts diagonally across the body where the crack line will widen.
// ............
// ....oooo....
// ...oLRcLo...
// ..oLLRLLLr..
// ..oLLLRLLr..
// .oLLLLRLLLr.
// .oLLLLLRcLr.
// .ollllllRll.
// ..ollllllRl.
// ..ooollllo..
// .....oooo...
// ............
const break0 = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,0,0,0,0],
  [0,0,0,1,3,6,4,3,1,0,0,0],
  [0,0,1,3,3,6,3,3,3,5,0,0],
  [0,0,1,3,3,3,6,3,3,5,0,0],
  [0,1,3,3,3,3,6,3,3,3,5,0],
  [0,1,3,3,3,3,3,6,4,3,5,0],
  [0,1,2,2,2,2,2,2,6,2,2,0],
  [0,0,1,2,2,2,2,2,2,6,2,0],
  [0,0,1,1,1,2,2,2,2,1,0,0],
  [0,0,0,0,0,1,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
];

// break frame 1 — halves separate slightly: fissure widens to 2 cells of dawn-amber
// bright, halves drift apart by 1 cell (left half shifts left, right half shifts right).
// The flash-of-amber between them is the visual climax of the break.
// ............
// ....o..oo...
// ...oL..cLo..
// ..oLL..LLr..
// ..oLL..RLLr.
// .oLLL..RLLr.
// .oLLLL..LLr.
// .ollll..lll.
// ..olll..llo.
// ..ooo..llo..
// .....oooo...
// ............
const break1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,1,0,0,1,1,0,0,0],
  [0,0,0,1,3,6,6,4,3,1,0,0],
  [0,0,1,3,3,6,6,3,3,3,5,0],
  [0,0,1,3,3,6,6,6,3,3,5,0],
  [0,1,3,3,3,6,6,6,3,3,3,5],
  [0,1,3,3,3,3,6,6,3,3,3,5],
  [0,1,2,2,2,2,6,6,2,2,2,0],
  [0,0,1,2,2,2,6,6,2,2,1,0],
  [0,0,1,1,1,6,6,2,2,2,1,0],
  [0,0,0,0,0,1,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
];

// break frame 2 — halves fall apart and fade: only thin shell remnants on far left
// and far right; centre is empty. Faint dawn-amber dust radiates outward. After
// this frame the egg entity despawns and player.armed flips true (Dev system).
// ............
// ............
// ...o.....o..
// ..oL.....Lr.
// ...l..R..l..
// .o.l..R..l.r
// .o.l.....l.r
// ...l.....l..
// ..o.......o.
// ..o.......o.
// .....rR.....
// ............
const break2 = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,0,0,0,0,0,1,0,0],
  [0,0,1,3,0,0,0,0,0,3,5,0],
  [0,0,0,2,0,0,6,0,0,2,0,0],
  [0,1,0,2,0,0,6,0,0,2,0,5],
  [0,1,0,2,0,0,0,0,0,2,0,5],
  [0,0,0,2,0,0,0,0,0,2,0,0],
  [0,0,1,0,0,0,0,0,0,0,1,0],
  [0,0,1,0,0,0,0,0,0,0,1,0],
  [0,0,0,0,0,0,5,6,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
];

// burst frame 0 — v0.75.1 extension. Fissure cracks deeper than `break2`: the
// halves are still in-frame but the dawn-amber bright cells have widened into
// a 4-cell-wide flare at the center, and the cuff-cream halo has begun ringing
// the inner edges of both halves. Dev-lead spawns the husk-shell fragment
// entities at this frame (anchored to the husk's center, with random outward
// velocity per shell — see `assets/sprites/item-husk-shell.js`).
// ............
// ...o....o...
// ..oL.RR.Lr..
// ..oL.RR.Lr..
// ..oL.RR.Lr..
// .oLLcRRcLLr.
// .oLLcRRcLLr.
// .ollcRRcllr.
// ..oll.RR.ll.
// ..oo..RR..o.
// .....rRRr...
// ............
const burst0 = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,1,0,0,0,0,1,0,0,0],
  [0,0,1,3,0,6,6,0,3,5,0,0],
  [0,0,1,3,0,6,6,0,3,5,0,0],
  [0,0,1,3,0,6,6,0,3,5,0,0],
  [0,1,3,3,4,6,6,4,3,3,5,0],
  [0,1,3,3,4,6,6,4,3,3,5,0],
  [0,1,2,2,4,6,6,4,2,2,5,0],
  [0,0,1,2,2,0,6,6,0,2,2,0],
  [0,0,1,1,0,0,6,6,0,0,1,0],
  [0,0,0,0,0,5,6,6,5,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
];

// burst frame 1 — halves opening explosively: each half drifts further from
// center; a 2-cell flash of cuff-cream (palette 4) surrounds the dawn-amber
// flare core. The left half slides one cell left, the right half slides one
// cell right relative to `break2`'s position. Reads as the husk visibly
// fragmenting at the apex of the burst.
// ............
// .o......o...
// .oL....c.Lr.
// .oL....c.Lr.
// oL.cccRRccc.
// oL.cccRRcccr
// .lcccRRRccclr
// ..l...RR...l
// .o....RR....o
// .o.....rR....
// .....rR.....
// ............
const burst1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,0,0,0,0,0,0,1,0,0,0],
  [0,1,3,0,0,0,0,4,0,3,5,0],
  [0,1,3,0,0,0,0,4,0,3,5,0],
  [1,3,0,4,4,4,6,6,4,4,4,0],
  [1,3,0,4,4,4,6,6,4,4,4,5],
  [0,2,4,4,4,6,6,6,4,4,4,5],
  [0,0,2,0,0,0,6,6,0,0,0,2],
  [0,1,0,0,0,0,6,6,0,0,0,1],
  [0,1,0,0,0,0,0,5,6,0,0,0],
  [0,0,0,0,0,5,6,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
];

// burst frame 2 — halves about to leave the frame: only thin shell remnants
// at the far left and far right edges of the sprite; the center is filled
// with dawn-amber afterglow and cuff-cream sparkles. The hatchet pickup
// (rendered by dev-lead as a separate sprite) is what the player sees after
// this frame disposes. The husk entity despawns at the end of this frame.
// ............
// ............
// o........5..
// oL.cRRRRc.Lr
// .o.cRRRRc.r.
// ...cRRRRc...
// ...cRRRRc...
// .o.cRRRRc.r.
// oL.cRRRRc.Lr
// o........5..
// ............
// ............
const burst2 = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,0,0,5,0],
  [1,3,0,4,6,6,6,6,4,0,3,5],
  [0,1,0,4,6,6,6,6,4,0,5,0],
  [0,0,0,4,6,6,6,6,4,0,0,0],
  [0,0,0,4,6,6,6,6,4,0,0,0],
  [0,1,0,4,6,6,6,6,4,0,5,0],
  [1,3,0,4,6,6,6,6,4,0,3,5],
  [1,0,0,0,0,0,0,0,0,0,5,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
];

export const FRAMES = {
  rest:  [rest0, rest1],
  break: [break0, break1, break2],
  burst: [burst0, burst1, burst2], // v0.75.1 extension — dramatic separation; dev-lead spawns husk-shell fragments at burst0
};

export const META = {
  w: 12,
  h: 12,
  anchor: { x: 6, y: 11 }, // base center — egg sits flush on ground
  fps: 4,                  // break plays ~12 frames at 4 fps over 3 frames; shimmer~ 2fps in Dev. `burst` plays at 8 fps (override in dev-lead's anim system).
};

// owning agent: design-lead
// TODO: original 8x8 sprite for the husk-shell fragment — Phase 3, v0.75.1.
//       Shell-shard entities spawned 2-4 at a time when the dawn-husk bursts.
//       Story-lead v0.75.1 ask: refine the egg-break to read more dramatic;
//       this sprite is the particle-sized debris.
//
// Frame ASCII legend (per palette index):
//   .  = 0  transparent
//   o  = 1  violet ink (#3a2e4a)                — universal silhouette outline
//   L  = 2  shell-loam base (#a8794a)           — shell main face (reuses dawn-husk palette idx)
//   l  = 3  shell-loam shadow (#7a5238)         — shell darker face
//   c  = 4  cuff-cream highlight (#e8d4a0)      — bright dawn-side speckle
//   r  = 5  dawn-amber rim (#e8a040)            — warm afterglow rim on shell-fragment
//
// husk-shell reads as a tiny shell-shard tumbling in the air, ~half a tile.
// dev-lead spawns 2-4 of these entities at the moment the dawn-husk's
// `burst0` frame plays. Each fragment is given a random `velocity` (vx ±2-4,
// vy -3 to -5), gravity applies, despawn off-screen or after lifetimeMax.
//
// The four tumble frames rotate the shell-shard silhouette through ~90° each
// so the fragment reads as spinning in mid-air. The shell-loam palette here
// is the same as dawn-husk's so the player reads "this is a piece of THAT
// egg." Dawn-amber rim catches the same warmth as the egg's flash.
//
// META.fps = 8 (faster tumble than the fruit shimmer; matches dev-lead's
// per-frame entity update budget).

export const PALETTE = [
  '#00000000', // 0 transparent
  '#3a2e4a',   // 1 violet ink (shared P1+P2)
  '#a8794a',   // 2 shell-loam base (shared with item-dawn-husk)
  '#7a5238',   // 3 shell-loam shadow (shared with Mossplodder / dawn-husk)
  '#e8d4a0',   // 4 cuff-cream highlight (shared P1+P2)
  '#e8a040',   // 5 dawn-amber rim (shared P1+P2)
];

// tumble frame 0 — shell-shard "right-edge view": a slightly curved sliver,
// the convex face catching cuff-cream highlight, the concave face dark.
// ........
// ..ooo...
// .oLLcr..
// .oLLLr..
// .ollLr..
// .olllr..
// ..ool...
// ........
const tumble0 = [
  [0,0,0,0,0,0,0,0],
  [0,0,1,1,1,0,0,0],
  [0,1,2,2,4,5,0,0],
  [0,1,2,2,2,5,0,0],
  [0,1,3,3,2,5,0,0],
  [0,1,3,3,3,5,0,0],
  [0,0,1,1,3,0,0,0],
  [0,0,0,0,0,0,0,0],
];

// tumble frame 1 — shell-shard "top-down view": a flatter, broader sliver as
// the shard rotates ~90°. Mostly shell-loam-shadow with one cuff-cream catch.
// ........
// ........
// .oooooo.
// .oLLLLLr
// .ollllLr
// .ooooooo
// ........
// ........
const tumble1 = [
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,0],
  [0,1,2,4,2,2,2,5],
  [0,1,3,3,3,3,2,5],
  [0,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
];

// tumble frame 2 — shell-shard "left-edge view": mirror of tumble0, with the
// convex face now on the left side (silhouette has rotated another ~90°). The
// dawn-amber rim moved to the trailing edge.
// ........
// ..ooo...
// .rLcLLo.
// .rLLLLo.
// .rllLLo.
// .rlllLo.
// ..ool...
// ........
const tumble2 = [
  [0,0,0,0,0,0,0,0],
  [0,0,1,1,1,0,0,0],
  [0,5,2,4,2,2,1,0],
  [0,5,2,2,2,2,1,0],
  [0,5,3,3,2,2,1,0],
  [0,5,3,3,3,2,1,0],
  [0,0,1,1,3,1,0,0],
  [0,0,0,0,0,0,0,0],
];

// tumble frame 3 — shell-shard "bottom-up view": mirror of tumble1, convex
// face below. Final frame in the rotation loop before tumble0 plays again.
// dev-lead may choose to randomize the start-frame per fragment so multiple
// shells don't all rotate in lockstep.
// ........
// ........
// .rooooooo
// .rLlllllo
// .rLLLLLLo
// .oooooo..
// ........
// ........
const tumble3 = [
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,5,1,1,1,1,1,1],
  [0,5,2,3,3,3,3,1],
  [0,5,2,2,2,4,2,1],
  [0,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
];

export const FRAMES = {
  tumble: [tumble0, tumble1, tumble2, tumble3],
};

export const META = {
  w: 8,
  h: 8,
  anchor: { x: 4, y: 4 }, // center anchor — fragments tumble around their middle
  fps: 8,                 // brisk tumble
};

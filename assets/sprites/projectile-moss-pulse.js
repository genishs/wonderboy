// owning agent: design-lead
// TODO: original 24x16 sprite for the moss-pulse shockwave — Phase 3 (v0.75).
//       The Bracken Warden's primary attack: a floor-hugging shockwave that
//       spawns at the Warden's feet on the impact frame of `attack`, travels
//       LEFT along the floor toward Reed at -3.5 px/frame, and despawns on
//       the arena's left wall or hatchet contact (mutual despawn).
//
//       Spec: docs/briefs/phase3-boss-cast.md §4 (attack pattern) + §10
//       (asset table — projectile entry).
//
// Final dimensions: 24 × 16 art-pixels. Per user prompt: "Suggested size
// 24 × 16 px (1 tile wide, half-tile tall)". Renderer scales to ~48 × 32
// canvas-px (1 tile × half-tile) for in-arena placement. The wave is
// FLOOR-HUGGING — anchor is at bottom-center so the renderer can place
// it directly on the arena floor row.
//
// Anchor: (12, 15) — bottom-center, on the floor line.
//
// FRAMES (per brief §10 asset table):
//   travel:  3 frames, looping cycle while the wave is active. Renderer
//            cycles at META.fps (8 fps) — the wave reads as a rolling
//            moss-light wavefront.
//   (No despawn anim shipped in this revision — Dev can fade-alpha the
//   last `travel` frame for one render-step at mutual-despawn or left-wall
//   contact. Brief allows this; story-lead's table mentions a 2-frame
//   `despawn` but story brief §4 also says "wave despawns on contact" with
//   no explicit visual; a simple alpha fade is enough and matches the v0.50
//   hatchet-despawn handling.)
//
// Direction: the moss-pulse always travels LEFT in the arena. Sprite art is
// drawn LEFT-FACING by default (the leading-edge / wavefront is on the LEFT
// side of the matrix). Renderer does NOT mirror.
//
// Visual intent (per brief §4 "Wave visuals"):
//   - A short upward burst of moss-and-stone particles at the leading face
//     (1-tile-tall, on the left side of the sprite)
//   - A trailing ground-blur that fades over ~10 px behind the leading face
//     (the right side of the sprite)
//   - Inner-glow dawn-amber at the wave's base (the warmth of the Warden's
//     sigil traveling along the floor)
//   - Velvet under-flame trailing edge wash (the violet-grey "smoke" that
//     fades into the floor) — NO pure black per world.md
//
// Frame ASCII legend (per palette index):
//   .  = 0   transparent
//   o  = 1   velvet ink #3a2e4a              — wavefront outline
//   M  = 2   moss-green dark #2e5028         — trailing moss particles
//   m  = 3   moss-green base #4a7c3a         — mid wave-body
//   l  = 4   moss-pulse leading-edge #a4d098 — wavefront glow (NEW P3)
//   a  = 5   dawn-amber #e8a040              — inner wave-glow
//   g  = 6   pale-gold #f8d878               — brightest inner spark
//   v  = 7   velvet under-flame #5a4a6e      — trailing edge wash (NO black)
//   V  = 8   pillar-shadow-violet #684e6e    — deepest trail tail

export const PALETTE = [
  '#00000000', // 0 transparent
  '#3a2e4a',   // 1 velvet ink
  '#2e5028',   // 2 moss-green dark
  '#4a7c3a',   // 3 moss-green base
  '#a4d098',   // 4 moss-pulse leading-edge (NEW P3)
  '#e8a040',   // 5 dawn-amber
  '#f8d878',   // 6 pale-gold
  '#5a4a6e',   // 7 velvet under-flame
  '#684e6e',   // 8 pillar-shadow-violet
];

export const META = {
  w: 24,
  h: 16,
  anchor: { x: 12, y: 15 },
  fps: 8,
};

// travel frame 0 — leading edge tall + crest particles flung up. Trail
// fades over the right ~10 cells from base-glow through under-flame to
// pillar-shadow-violet.
// ........................
// ........................
// .Ml.....................
// .ll.M...................
// .lll....................
// ollloM..M...............
// ollllo..ooMo............
// olllllooollloMM.........
// olllllamlllllllMo.......
// ollllggalllllllllM......
// ollgggalmlllllllllMo....
// olllggallllllllllllllo..
// olllaaallllllllllllllo..
// .ovvvvvvvvvvvvvvvvVvvVo.
// .oVVVVVVVVVVVVVVVVVVVVo.
// ........................
const travel0 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,2,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,4,4,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,4,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,4,4,4,4,2,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,4,4,4,4,4,0,0,1,1,2,1,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,4,4,4,4,4,4,1,1,1,1,4,4,2,2,0,0,0,0,0,0,0,0,0],
  [1,4,4,4,4,4,5,3,4,4,4,4,4,4,4,2,1,0,0,0,0,0,0,0],
  [1,4,4,4,4,6,6,5,4,4,4,4,4,4,4,4,4,2,0,0,0,0,0,0],
  [1,4,4,6,6,6,5,4,3,4,4,4,4,4,4,4,4,4,2,1,0,0,0,0],
  [1,4,4,4,6,6,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,0,0],
  [1,4,4,4,5,5,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,0,0],
  [0,1,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,8,7,7,8,1,0],
  [0,1,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// travel frame 1 — wavefront a touch shorter; crest particles re-flung at
// different positions; trailing edge curls. Reads as the wave continuing
// to roll while traveling left.
const travel1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,2,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,4,4,2,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,4,4,4,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,4,4,4,4,0,2,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
  [1,4,4,4,4,4,0,0,2,1,1,3,4,4,2,0,0,0,0,0,0,0,0,0],
  [1,4,4,4,4,4,5,1,1,1,4,4,4,4,4,2,1,0,0,0,0,0,0,0],
  [1,4,4,4,4,6,5,3,4,4,4,4,4,4,4,4,2,0,0,0,0,0,0,0],
  [1,4,4,6,6,5,4,4,4,4,4,4,4,4,4,4,4,4,1,0,0,0,0,0],
  [1,4,4,4,6,5,4,4,3,4,4,4,4,4,4,4,4,4,4,4,1,0,0,0],
  [1,4,4,4,5,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,0,0],
  [0,1,7,7,7,7,7,7,7,8,7,7,7,8,7,7,7,7,7,7,7,7,1,0],
  [0,1,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// travel frame 2 — wavefront re-builds height; inner spark brightens to
// pale-gold at the base; new particles flung from the trailing curl.
// Looped F0→F1→F2→F0 at 8 fps reads as a continuous rolling wave.
const travel2 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,4,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,4,4,4,0,0,0,2,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,4,4,4,4,0,0,0,0,0,2,1,2,0,0,0,0,0,0,0,0,0,0,0],
  [1,4,4,4,4,4,2,0,0,1,1,1,1,3,0,0,0,0,0,0,0,0,0,0],
  [1,4,4,4,4,4,4,1,1,1,3,4,4,4,2,2,0,0,0,0,0,0,0,0],
  [1,4,4,4,4,4,6,3,3,4,4,4,4,4,4,4,2,0,0,0,0,0,0,0],
  [1,4,4,4,4,6,6,5,4,4,4,4,4,4,4,4,4,1,0,0,0,0,0,0],
  [1,4,4,6,6,6,5,4,3,4,4,4,4,4,4,4,4,4,4,1,0,0,0,0],
  [1,4,4,6,6,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,0,0],
  [1,4,4,5,5,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,1,0,0],
  [0,1,7,7,8,7,7,8,7,7,7,7,7,7,7,7,7,7,7,7,7,7,1,0],
  [0,1,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

export const FRAMES = {
  travel: [travel0, travel1, travel2],
};

// owning agent: design-lead
// TODO: original 18x24 sprite for the Threadshade enemy — Phase 3, v0.75.1.
//       Vertical-only hanging enemy. Story-lead spec:
//       `phase3-area1-expansion.md` §16 (v0.75.1 addition — Threadshade).
//
// Frame ASCII legend (per palette index):
//   .  = 0  transparent
//   o  = 1  violet ink (#3a2e4a)                — universal silhouette outline
//   v  = 2  velvet under-flame (#5a4a6e)        — body deep shade (ink-family cousin)
//   V  = 3  canopy-shadow-violet (#684e6e)      — under-belly violet (understory)
//   c  = 4  chitin-warm (#7a5a48)               — single warm body hue (NEW v0.75.1)
//   m  = 5  moss-mottle (#3e6a3a)               — sparse back mottle (bracken-frond deep)
//   a  = 6  amber-pinprick (#e8a040)            — two eye-glints, low on body
//   s  = 7  moonlight-silver-cream (#cfd8dc)    — thread + faint shimmer
//   t  = 8  thread-shimmer-pale (#fff8e8)       — thread pulse highlight (NEW v0.75.1)
//
// Threadshade reads as: pale-silver thread descending vertically from the top
// of the sprite, ending in a compact rounded body suspended low. The body
// silhouette is dark violet with a single chitin-warm body cue; six short
// leg-fingers radiate from the lower half; two amber pinprick eye-glints sit
// low on the body. The threat is positional, not perceptual — eyes do NOT
// track Reed (matches Mossplodder's "no aim" convention per story-lead spec).
//
// Per story-lead §16.5: 2 idle frames at 6 fps + dead anim (2 keyframes here;
// dev-lead will handle the falling-body motion procedurally via velocity).
// The mood word from story-lead is "patient-hush" — breath, not attack.
//
// META.fps = 6 (slower than Hummerwing's 8 fps — patient pacing).

export const PALETTE = [
  '#00000000', // 0 transparent
  '#3a2e4a',   // 1 violet ink (shared P1+P2)
  '#5a4a6e',   // 2 velvet under-flame body deep (shared P2)
  '#684e6e',   // 3 canopy-shadow-violet under-belly (shared P3)
  '#7a5a48',   // 4 chitin-warm body cue (NEW v0.75.1)
  '#3e6a3a',   // 5 bracken-frond deep / moss-mottle (shared P3)
  '#e8a040',   // 6 amber-pinprick eye-glint (shared P1+P2)
  '#cfd8dc',   // 7 moonlight-silver-cream thread (shared P3)
  '#fff8e8',   // 8 thread-shimmer-pale (NEW v0.75.1)
];

// drift frame 0 — hang_a: body centered, four-to-six leg-fingers tucked close,
// thread fully visible above. Eye-glints low on the body (rows 14-15). The
// thread runs through cols 8-9, rows 0-9.
// ..................
// .........s........
// .........s........
// .........s........
// .........s........
// .........s........
// .........s........
// .........s........
// ........osso......
// .......ovVVVo.....
// ......ovVcVVVo....
// .....ovVcccVVVo...
// .....ovVcccVVVo...
// ....ovvVcmcVVVvo..
// ....ovvVcacVVVvo..
// ....ovvVcacVVVvo..
// .....ovvVcVVVvo...
// ......ovvVVvvo....
// ......o.ovvo.o....
// .....o..ovo..o....
// ....o....o....o...
// ...o.....o.....o..
// ..................
// ..................
const drift0 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,7,7,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,2,3,3,3,1,0,0,0,0,0],
  [0,0,0,0,0,0,1,2,3,4,3,3,3,1,0,0,0,0],
  [0,0,0,0,0,1,2,3,4,4,4,3,3,3,1,0,0,0],
  [0,0,0,0,0,1,2,3,4,4,4,3,3,3,1,0,0,0],
  [0,0,0,0,1,2,2,3,4,5,4,3,3,3,2,1,0,0],
  [0,0,0,0,1,2,2,3,4,6,4,3,3,3,2,1,0,0],
  [0,0,0,0,1,2,2,3,4,6,4,3,3,3,2,1,0,0],
  [0,0,0,0,0,1,2,2,3,4,3,3,3,2,1,0,0,0],
  [0,0,0,0,0,0,1,2,2,3,3,2,2,1,0,0,0,0],
  [0,0,0,0,0,0,1,0,1,2,2,1,0,1,0,0,0,0],
  [0,0,0,0,0,1,0,0,1,2,1,0,0,1,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0],
  [0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// drift frame 1 — hang_b: body shifted ~1 px (near-imperceptible breath); two
// of the four leg-fingers extended ~1 px outward (leg-shimmer); thread shows
// a single shimmer-segment (palette-8 thread-shimmer-pale) ~1/3 down its
// length. Mood is breath, not attack.
// ..................
// .........s........
// .........s........
// .........s........
// .........t........
// .........s........
// .........s........
// .........s........
// ........osso......
// .......ovVVVo.....
// ......ovVcVVVo....
// .....ovVcccVVVo...
// .....ovVcccVVVo...
// ....ovvVcmcVVVvo..
// ....ovvVcacVVVvo..
// ....ovvVcacVVVvo..
// .....ovvVcVVVvo...
// ......ovvVVvvo....
// ......o.ovvo.o....
// .....o..ovo..o....
// ...o.....o.....o..
// ..o......o......o.
// ..................
// ..................
const drift1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,7,7,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,2,3,3,3,1,0,0,0,0,0],
  [0,0,0,0,0,0,1,2,3,4,3,3,3,1,0,0,0,0],
  [0,0,0,0,0,1,2,3,4,4,4,3,3,3,1,0,0,0],
  [0,0,0,0,0,1,2,3,4,4,4,3,3,3,1,0,0,0],
  [0,0,0,0,1,2,2,3,4,5,4,3,3,3,2,1,0,0],
  [0,0,0,0,1,2,2,3,4,6,4,3,3,3,2,1,0,0],
  [0,0,0,0,1,2,2,3,4,6,4,3,3,3,2,1,0,0],
  [0,0,0,0,0,1,2,2,3,4,3,3,3,2,1,0,0,0],
  [0,0,0,0,0,0,1,2,2,3,3,2,2,1,0,0,0,0],
  [0,0,0,0,0,0,1,0,1,2,2,1,0,1,0,0,0,0],
  [0,0,0,0,0,1,0,0,1,2,1,0,0,1,0,0,0,0],
  [0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0],
  [0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// dead frame 0 — thread-snap-mid: thread cut at top, body slumping. The legs
// curl inward; the body's chitin warmth dims to violet-shadow. The thread is
// still visible mid-air but disconnected from the top of the sprite.
// ..................
// ..................
// ..................
// ..................
// ..................
// .........s........
// .........s........
// .........s........
// ........osso......
// .......ovVVVo.....
// ......ovvVVVvo....
// .....ovvVVVVvvo...
// .....ovvVVVVvvo...
// ....ovvVVVVVVvvo..
// ....ovvVVaaVVvvo..
// ....ovvVVVVVVvvo..
// .....ovvVVVVvvo...
// ......ovvVVvvo....
// .......ovvvvo.....
// ........oooo......
// ..................
// ..................
// ..................
// ..................
const dead0 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,7,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,7,7,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,2,3,3,3,1,0,0,0,0,0],
  [0,0,0,0,0,0,1,2,2,3,3,3,2,1,0,0,0,0],
  [0,0,0,0,0,1,2,2,3,3,3,3,2,2,1,0,0,0],
  [0,0,0,0,0,1,2,2,3,3,3,3,2,2,1,0,0,0],
  [0,0,0,0,1,2,2,3,3,3,3,3,3,2,2,1,0,0],
  [0,0,0,0,1,2,2,3,3,6,6,3,3,2,2,1,0,0],
  [0,0,0,0,1,2,2,3,3,3,3,3,3,2,2,1,0,0],
  [0,0,0,0,0,1,2,2,3,3,3,3,2,2,1,0,0,0],
  [0,0,0,0,0,0,1,2,2,3,3,2,2,1,0,0,0,0],
  [0,0,0,0,0,0,0,1,2,2,2,2,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// dead frame 1 — collapsed: body flattened against the floor row (dev-lead
// renders this once the entity has settled). Legs splayed; eye-glints faded.
// Thread gone. This is a "lying still on the floor" pose; dev-lead may hold
// this frame for ~10 frames before triggering the hit-spark dissolve.
// ..................
// ..................
// ..................
// ..................
// ..................
// ..................
// ..................
// ..................
// ..................
// ..................
// ..................
// ..................
// ..................
// ..................
// ..................
// ..................
// ..ooo..........ooo
// .ovvvoo......oovvo
// .ovvVVvooooovvVVvo
// .ovvVVVVvvvvVVVVvo
// .oovvVVVVvvVVVVvvo
// ..ooovvvvvvvvvvoo.
// ....ooooooooooo...
// ..................
const dead1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0],
  [0,1,2,2,2,1,1,0,0,0,0,0,0,1,2,2,1,0],
  [0,1,2,2,3,3,2,1,1,1,1,1,2,2,3,3,2,1],
  [0,1,2,2,3,3,3,3,2,2,2,2,3,3,3,3,2,1],
  [0,1,1,2,2,3,3,3,3,2,2,3,3,3,3,2,2,1],
  [0,0,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

export const FRAMES = {
  drift: [drift0, drift1],
  dead:  [dead0, dead1],
};

export const META = {
  w: 18,
  h: 24,
  anchor: { x: 9, y: 23 }, // base-center; for hanging entities the anchor is
                           //  still spec'd at base for consistency with other
                           //  enemies. dev-lead's AI clamps y by adding the
                           //  oscillation around `baseY` (per §16.8) so the
                           //  anchor's role is just a draw-origin reference.
  fps: 6,                  // patient pacing (per story-lead §16.5)
};

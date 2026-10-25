// owning agent: design-lead
// TODO: original 12x12 sprite for the cinder projectile — Phase 4, v1.0.
//       Boss projectile of the Reignwarden (Area 2 boss). Spawns in a 3-cluster
//       volley from the Warden's palms, arcs to the floor, leaves an ember pit.
//       Story-lead spec: `phase4-area2-cast.md` §3.4 (cinder volley).
//
// Frame ASCII legend (per palette index):
//   .  = 0  transparent
//   o  = 1  velvet ink (#3a2e4a)               — universal silhouette outline
//   r  = 2  ember-rose mid (#cc6464)           — cinder body (NEW v1.0 — ember-rose)
//   R  = 3  ember-rose deep (#882c2c)          — cinder under-shadow
//   a  = 4  dawn-amber mid (#e4b25c)           — warm core / heat-trail
//   A  = 5  dawn-amber highlight (#f8d878)     — bright inner core
//   g  = 6  dawn-amber-glow 75% (#f8d878c0)    — soft glow halo (alpha)
//   G  = 7  dawn-amber-glow 40% (#f8d87880)    — softer outer glow (alpha)
//   c  = 8  cream-bright (#fff2c0)             — peak hot-flicker pixel
//
// Cinder reads as a small round ember roughly the size of one tile/4 wide,
// with a glowing inner core and a soft amber halo around the silhouette.
// During flight the inner core flickers between three frames so the projectile
// reads as live, hot, and dangerous. On impact, the ember bursts into a low
// rosette of ember-rose pixels that fade outward over 3 frames.
//
// META.fps = 10 for flight (matches brief §6 spec). impact: 8 fps (one-shot).

export const PALETTE = [
  '#00000000', // 0 transparent
  '#3a2e4a',   // 1 velvet ink (shared P1+P2+P3 silhouette)
  '#cc6464',   // 2 ember-rose mid (NEW v1.0 — Area 2 palette)
  '#882c2c',   // 3 ember-rose deep (NEW v1.0)
  '#e4b25c',   // 4 dawn-amber mid (shared with boss family)
  '#f8d878',   // 5 dawn-amber highlight (shared)
  '#f8d878c0', // 6 dawn-amber-glow 75% alpha (NEW v1.0)
  '#f8d87880', // 7 dawn-amber-glow 40% alpha (NEW v1.0)
  '#fff2c0',   // 8 cream-bright peak (shared with boss sigil family)
];

// flight frame 0 — core compact. The ember body fills the central 8x8 area
// with a bright cream-bright pixel at the centre. Soft amber halo (G/g) just
// outside the silhouette gives the cinder a glowing read against the arena.
// ............
// ....GgGg....
// ...gaAAag...
// ..GaArrAaG..
// ..gArrrrAg..
// ..GAArrAAG..
// ..gaArrAag..
// ...gaAAag...
// ....GgGg....
// ............
// ............
// ............
const flight0 = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,7,6,7,6,0,0,0,0],
  [0,0,0,6,4,5,5,4,6,0,0,0],
  [0,0,7,4,5,2,2,5,4,7,0,0],
  [0,0,6,4,2,8,2,2,4,6,0,0],
  [0,0,7,5,5,2,2,5,5,7,0,0],
  [0,0,6,4,4,2,3,4,4,6,0,0],
  [0,0,0,6,4,5,5,4,6,0,0,0],
  [0,0,0,0,7,6,7,6,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
];

// flight frame 1 — core flicker. Center cream-bright migrates 1 px down-left,
// the bright cluster shifts to a different cell to give the player a sense of
// the ember swirling mid-flight.
const flight1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,6,7,6,7,0,0,0,0],
  [0,0,0,7,5,5,4,4,7,0,0,0],
  [0,0,6,5,2,8,5,2,5,6,0,0],
  [0,0,7,4,8,2,2,5,4,7,0,0],
  [0,0,6,5,2,2,2,2,5,6,0,0],
  [0,0,7,4,3,2,2,3,4,7,0,0],
  [0,0,0,7,4,5,5,4,7,0,0,0],
  [0,0,0,0,6,7,6,7,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
];

// flight frame 2 — core swell. Center cream-bright at row 5 col 6 (down-right),
// halo glows slightly larger (G expands by 1 cell). The 3-frame loop reads as
// "swirl, flicker, swell" — alive heat.
const flight2 = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,7,6,6,7,6,7,0,0,0],
  [0,0,7,5,4,5,5,5,4,7,0,0],
  [0,0,6,4,2,2,2,2,4,6,0,0],
  [0,0,7,5,2,2,8,2,5,7,0,0],
  [0,0,6,5,2,8,8,2,5,6,0,0],
  [0,0,7,4,3,2,2,3,4,7,0,0],
  [0,0,0,7,4,4,5,5,7,0,0,0],
  [0,0,0,0,7,6,6,7,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
];

// impact frame 0 — first burst. The ember explodes against the floor; the
// center splits into a low rosette, with five outward-radiating ember-rose
// petals (one each at the cardinal-ish points). The amber halo expands
// outward but dims by one alpha-step.
// ............
// ............
// ............
// .....r......
// ....rRr.....
// ...rRArRr...
// ..rRARARr...
// .rrrARArrr..
// ...rrarrr...
// ....rrr.....
// ............
// ............
const impact0 = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,7,2,7,0,0,0,0],
  [0,0,0,0,7,2,3,2,7,0,0,0],
  [0,0,0,7,2,3,5,3,2,7,0,0],
  [0,0,7,2,3,5,4,5,3,2,7,0],
  [0,7,2,2,2,5,4,5,2,2,2,7],
  [0,0,0,2,2,4,5,4,2,2,0,0],
  [0,0,0,0,7,2,2,2,7,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
];

// impact frame 1 — burst expand. Petals push outward; alpha-halo recedes.
// The center fades to ember-rose deep, the outer ring of pixels lights up.
const impact1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,7,2,2,7,0,0,0,0],
  [0,0,0,7,2,3,3,2,7,0,0,0],
  [0,0,7,2,3,3,3,3,2,7,0,0],
  [0,7,2,3,3,2,2,3,3,2,7,0],
  [0,2,3,3,2,4,4,2,3,3,2,0],
  [0,7,2,3,3,2,2,3,3,2,7,0],
  [0,0,7,2,3,3,3,3,2,7,0,0],
  [0,0,0,7,2,3,3,2,7,0,0,0],
  [0,0,0,0,7,2,2,7,0,0,0,0],
  [0,0,0,0,0,7,7,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
];

// impact frame 2 — dissipate. Just a sparse scatter of ember-rose pixels and
// fading alpha halos. After this frame the impact animation ends; the ember-
// pit hazard tile (dev-lead) takes over the on-floor visual for the next 120
// frames.
const impact2 = [
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,7,7,0,0,0,0,0],
  [0,0,0,7,7,3,3,7,7,0,0,0],
  [0,0,7,3,7,2,2,7,3,7,0,0],
  [0,7,3,7,0,7,7,0,7,3,7,0],
  [0,3,7,0,0,0,0,0,0,7,3,0],
  [0,7,3,7,0,0,0,0,7,3,7,0],
  [0,0,7,3,7,0,0,7,3,7,0,0],
  [0,0,0,7,3,7,7,3,7,0,0,0],
  [0,0,0,0,7,7,7,7,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0],
];

export const FRAMES = {
  flight: [flight0, flight1, flight2],
  impact: [impact0, impact1, impact2],
};

export const META = {
  w: 12,
  h: 12,
  anchor: { x: 6, y: 6 }, // center of the ember (in-flight); dev-lead positions
                          //  the cinder by its center, not its base
  fps: 10,                // flight playback (per brief §6 sprite table)
};

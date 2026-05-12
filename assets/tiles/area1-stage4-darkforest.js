// owning agent: design-lead
// TODO: original tile module for Area 1 Stage 4 — "The Old Threshold" (dark forest) (Phase 3, v0.75).
// Consumed by dev-lead's tile-cache renderer per docs/design/contracts.md.
// Each TILES entry is either a 16x16 matrix of palette indices (static) OR an
// {frames, fps} object (animated — moonlight_streak). Renderer scales 3x to
// canvas TILE=48.
//
// Theme sequence reminder: forest → shore → cave → dark forest. This module
// is the dark forest (Stage 4), arriving after the cave (Stage 3) and ending
// at the boss arena. Per the v0.75 theme remap, Stage 4 became a moonlit
// dark-forest clearing instead of ancient ruins. Mood: deep blue-green canopy
// shadow, violet-black undertones, silver moonlight, gnarled root system.
// Cooler palette than Stage 1's "kettle-warm forest morning" — same forest
// grammar (moss top + earth body + bark + occasional root catchlight), but
// the opposite tonal corner of the same world.
//
// Tile keys & intent:
//   flat               — dark-forest floor (canopy-moss top, dry-bark body
//                        with moonlit-lichen overlay and occasional dark-
//                        canopy patches in the under-base shadow band)
//   slope_up_22        — gentle uphill (22°)
//   slope_up_45        — steep uphill (45°)
//   slope_dn_22        — gentle downhill (mirror of slope_up_22)
//   slope_dn_45        — steep downhill (mirror of slope_up_45)
//   rock_small         — gnarled dark-mossy boulder. Deep canopy-violet
//                        shadowed surface with sparse pale-moss highlights
//                        on the moonlit side. Visually distinct from
//                        Stage 1's warm brown rock — same composite-onto-
//                        flat authoring rule, cooler palette.
//   moonlight_streak   — animated decorative tile, 3 frames @ ~3 fps.
//                        Subtle moonlight catching dew or phosphorescent
//                        moss along a forest-floor path. NOT a hazard;
//                        Reed walks over it without consequence. Used in
//                        Round 4-2, 4-3 (decorative runs) and especially
//                        Round 4-4 (the long convergent stripe approaching
//                        the boss arena).
//   mile_1.._4         — round signposts. Same post + plank + digit shape
//                        as Stages 1-3 — the mile-marker chain is shared
//                        across all stages. Plank face is the same cuff-
//                        cream; the post is dim under the canopy but
//                        digits stay legible.
//   cairn              — END-OF-AREA boundary cairn. Visually distinct
//                        from Stage 1's river-stone cairn: this dark-
//                        forest cairn is a moss-flecked charcoal-and-
//                        silver stack with a single dawn-amber sigil-
//                        fleck on the topmost stone (the only amber in
//                        Stage 4 outside the boss arena — intentional
//                        foreshadowing of the Bracken Warden's chest
//                        sigil). Used at end of Stage 4 to trigger the
//                        Area-clear ritual (boss already dead by then —
//                        the cairn is the visual closure of Area 1).
//
// Decision recorded: moonlight_streak ships as 3 frames @ 3 fps (faster
// than the previous ruin's `dawn_channel` at 2 fps, slower than crystal_
// vein's 6 fps). The breath rhythm reads as "dew catches the moonlight,
// shifts, catches again." NOT a 1-hit-kill hazard. Renderer treats it
// like any animated decoration.
//
// Decision recorded: NO fire-equivalent / amber-vein / water hazard tile.
// Stage 4 has no hazard tiles. Threat in Stage 4 is entirely Mossplodders
// + the boss + the existing v0.50.2 gap-fall rule.
//
// Decision recorded: rock_small key carries the visual of a gnarled dark
// rock (not a boulder, not a pillar fragment). Same gameplay role as Stage
// 1/2/3 rock_small (stumble, no kill). Tile KEY stays as `rock_small` so
// dev-lead's level-data code uses the same key across all four stages.
//
// Decision recorded: the boss arena floor is NOT shipped as a separate tile
// key. The boss arena uses `flat` dark-forest floor; the upper rows of the
// arena stay visually quiet so the HUD strip reads cleanly at the top of
// the screen.
//
// Decision recorded: dawn-amber appears only on the cairn sigil-fleck in
// this tileset (NOT in moonlight_streak — the streak is cool moonlight,
// not warm). This keeps "the only amber in Stage 4 outside the boss arena
// is the Area-clear cairn fleck" as the visual touchstone — the player
// reads the cairn and the Warden's chest sigil as the same warmth family.
//
// Frame ASCII legend (per palette index):
//   .  = 0   transparent
//   o  = 1   velvet ink (#3a2e4a)             — universal silhouette ink
//   u  = 2   dark-forest under-base (#1e2032) — deepest fill (NOT black)
//   d  = 3   dark-canopy blue-green dark (#2a3a3a) — canopy shadow body
//   D  = 4   dark-canopy blue-green mid (#3e5a52)  — canopy-moss top strip
//   v  = 5   canopy-shadow-violet (#684e6e)   — under-rock / undercut violet
//   s  = 6   dry-bark-pale (#8a8478)          — weathered trunk face (warm cool grey)
//   S  = 7   moonlit bark crest (#a89c80)     — bark catchlight
//   k  = 8   tree-bark-shadow (#5a5448)       — bark deep
//   l  = 9   moonlit-lichen overlay (#7a7080) — cool-violet lichen patch
//   M  = a   moonlight-silver-cream (#cfd8dc) — moonlight catch / dew sparkle
//   m  = b   moss-green dark (#2e5028)        — moss shadow (shared)
//   g  = c   moss-green base (#4a7c3a)        — moss mid (shared)
//   G  = d   pale moss highlight (#5a8a4a)    — sparse moss on dark rock (shared w/ boss)
//   r  = e   river-stone-grey base (#7a8088)  — rock body (shared)
//   K  = f   river-stone shadow (#4a5058)     — rock dark (shared)
//   R  = 10  river-stone highlight (#a8b0b8)  — rock catch-light (shared)
//   c  = 11  cuff-cream (#e8d4a0)             — mile-marker plank face / cairn rim
//   b  = 12  wet-bark-brown (#4a3422)         — mile-marker shaft
//   L  = 13  loam-soil shadow (#5a3a22)       — mile-marker footing
//   a  = 14  dawn-amber (#e8a040)             — cairn sigil-fleck (the ONLY
//                                                amber in this tileset)

export const PALETTE = [
  '#00000000', //  0 transparent
  '#3a2e4a',   //  1 velvet ink (shared P1+P2 — universal silhouette ink)
  '#1e2032',   //  2 dark-forest under-base (NEW P3 — deepest fill, not black)
  '#2a3a3a',   //  3 dark-canopy blue-green dark (NEW P3)
  '#3e5a52',   //  4 dark-canopy blue-green mid (NEW P3)
  '#684e6e',   //  5 canopy-shadow-violet (shared with boss; previously pillar-shadow)
  '#8a8478',   //  6 dry-bark-pale (shared with boss; previously carved-stone-pale)
  '#a89c80',   //  7 moonlit bark crest (shared with boss; previously carved-stone highlight)
  '#5a5448',   //  8 tree-bark-shadow (shared with boss; previously carved-stone shadow)
  '#7a7080',   //  9 moonlit-lichen overlay (re-roled mosaic-cool from prior ruin build)
  '#cfd8dc',   // 10 moonlight-silver-cream (NEW P3 — moonlight catch / dew sparkle)
  '#2e5028',   // 11 moss-green dark (shared P1+P2)
  '#4a7c3a',   // 12 moss-green base (shared P1+P2)
  '#5a8a4a',   // 13 pale moss highlight (shared with boss; sparse moss on dark rocks)
  '#7a8088',   // 14 river-stone-grey (shared P2)
  '#4a5058',   // 15 river-stone shadow (shared P2)
  '#a8b0b8',   // 16 river-stone highlight (shared P2)
  '#e8d4a0',   // 17 cuff-cream (shared P1+P2)
  '#4a3422',   // 18 wet-bark-brown (shared P1+P2)
  '#5a3a22',   // 19 loam-soil shadow (shared P1+P2)
  '#e8a040',   // 20 dawn-amber (shared P1+P2 — cairn sigil-fleck ONLY)
];

// flat — dark-forest floor. Top 2 rows are dark-canopy blue-green: the
// moonlit moss strip in the colder half of the day (greener-blue than
// Stage 1's warm forest moss). Rows 2-5 are dry-bark-pale main face,
// the weathered trunk-toned floor surface. Rows 6-13 are bark-shadow
// body with occasional moonlit-lichen overlay specks and rare moonlight
// catchlights where dew finds a level surface. Bottom 2 rows are the
// dark-forest under-base — a violet-black undertone that is deliberately
// NOT pure black per docs/story/world.md.
// DDDDDDDDDDDDDDDD
// ddDdDDDdDDDdDDDd
// ssssssssssssssss
// ssssssssssssssss
// ksksskssssksskks
// kkkkkkkkkkkkkkkk
// ssssssssssssssss
// slssssssssMssss.
// ssssssssssssssss
// ssMssssssssssssl
// kkkkkkkkkkkkkkkk
// kkssskssssskksss
// ssssssssssssssss
// kkkkkkkkkkkkkkkk
// uuuuuuuuuuuuuuuu
// uuuuuuuuuuuuuuuu
const flat = [
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  [3,3,4,3,4,4,4,3,4,4,4,3,4,4,4,3],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [8,6,8,6,6,8,6,6,6,6,8,6,6,8,8,6],
  [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,9,6,6,6,6,6,6,6,6,10,6,6,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,6,10,6,6,6,6,6,6,6,6,6,6,6,6,9],
  [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
  [8,8,6,6,6,8,6,6,6,6,6,8,8,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

// slope_up_22 — gentle 22° uphill. Same stair-step rise as Stage 1's
// slope_up_22 but dark-forest-tinted: canopy-moss strip on the rising
// lip, dry-bark body, dark-forest under-base in the footing rows.
const slope_up_22 = [
  [0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,4],
  [0,0,0,0,0,0,0,0,0,4,4,6,6,6,6,4],
  [0,0,0,0,0,0,0,4,4,6,6,6,6,6,6,6],
  [0,0,0,0,0,4,4,6,6,6,6,6,6,6,6,8],
  [0,0,0,0,4,6,6,6,6,6,6,6,6,6,8,6],
  [0,0,4,4,6,6,6,6,6,6,6,6,6,8,8,8],
  [0,4,6,6,6,6,6,6,6,8,8,8,8,8,8,8],
  [4,6,6,6,8,8,8,8,8,8,8,8,8,8,8,8],
  [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,9,6,6,6,6,6,6,6,6,6,6,6,9,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,10,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

// slope_up_45 — steep 45° uphill. A single moonlight-silver-cream catch on
// the upper-right crest reads as "moonlight finding the rising edge" — the
// dark forest's equivalent of Stage 1's dawn-amber root catchlight.
const slope_up_45 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,6],
  [0,0,0,0,0,0,0,0,0,0,0,0,4,4,6,6],
  [0,0,0,0,0,0,0,0,0,0,0,4,4,6,6,6],
  [0,0,0,0,0,0,0,0,0,0,4,4,6,6,6,6],
  [0,0,0,0,0,0,0,0,0,4,4,6,6,6,6,6],
  [0,0,0,0,0,0,0,0,4,4,6,6,6,6,6,10],
  [0,0,0,0,0,0,0,4,4,6,6,6,6,6,6,8],
  [0,0,0,0,0,0,4,4,6,6,6,6,6,8,8,8],
  [0,0,0,0,0,4,4,6,6,6,6,6,8,8,8,8],
  [0,0,0,0,4,4,6,6,6,8,8,8,8,8,8,8],
  [0,0,0,4,4,6,6,8,8,8,8,8,8,8,8,8],
  [0,0,4,4,6,8,8,8,8,8,8,8,8,8,8,8],
  [0,4,4,8,8,8,8,8,8,8,8,8,8,8,8,8],
  [4,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
];

// slope_dn_22 — gentle downhill (mirror of slope_up_22 along Y axis).
const slope_dn_22 = [
  [4,4,4,4,4,0,0,0,0,0,0,0,0,0,0,0],
  [4,6,6,6,6,4,4,0,0,0,0,0,0,0,0,0],
  [6,6,6,6,6,6,6,4,4,0,0,0,0,0,0,0],
  [8,6,6,6,6,6,6,6,6,4,4,0,0,0,0,0],
  [6,8,6,6,6,6,6,6,6,6,4,0,0,0,0,0],
  [8,8,8,6,6,6,6,6,6,6,6,4,4,0,0,0],
  [8,8,8,8,8,8,8,6,6,6,6,6,6,4,0,0],
  [8,8,8,8,8,8,8,8,8,8,8,6,6,6,4,0],
  [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,6,6,6,9,6,6,6,6,6,6,6,9,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,10,6,6],
  [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

// slope_dn_45 — steep downhill (mirror of slope_up_45). Moonlight catchlight
// on the top-left crest.
const slope_dn_45 = [
  [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [6,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [6,6,4,4,0,0,0,0,0,0,0,0,0,0,0,0],
  [6,6,6,4,4,0,0,0,0,0,0,0,0,0,0,0],
  [6,6,6,6,4,4,0,0,0,0,0,0,0,0,0,0],
  [6,6,6,6,6,4,4,0,0,0,0,0,0,0,0,0],
  [10,6,6,6,6,6,4,4,0,0,0,0,0,0,0,0],
  [8,6,6,6,6,6,6,4,4,0,0,0,0,0,0,0],
  [8,8,8,6,6,6,6,6,4,4,0,0,0,0,0,0],
  [8,8,8,8,6,6,6,6,6,4,4,0,0,0,0,0],
  [8,8,8,8,8,8,8,6,6,6,4,4,0,0,0,0],
  [8,8,8,8,8,8,8,8,8,6,6,4,4,0,0,0],
  [8,8,8,8,8,8,8,8,8,8,6,4,4,0,0,0],
  [8,8,8,8,8,8,8,8,8,8,8,8,4,4,0,0],
  [8,8,8,8,8,8,8,8,8,8,8,8,8,4,4,0],
];

// rock_small — gnarled dark-forest boulder. Authoring: transparent below
// row 12 to composite over a flat tile. Body is river-stone-grey with
// deep canopy-shadow-violet undercut on the right (the shaded side under
// canopy) and a single pale-moss highlight on the moonlit upper-left.
// Visually distinct from Stage 1's warm-brown rock: cooler tones, sparser
// highlights, with the violet undercut clearly visible.
// ................
// ................
// ................
// .....oRRRkoo....
// ....oRRRRRkko...
// ...oRrrrrrrkvo..
// ..oRrrrrrrrkvvo.
// ..oGrrrrrrrkvvo.
// .oGGrrrrrrrkkvvo
// .orrrrrrrrkkvvvo
// .okkkkkkkkkkkkvo
// ..oookkkkkkkkoo.
// ................
// ................
// ................
// ................
const rock_small = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,16,16,16,15,1,1,0,0,0,0],
  [0,0,0,0,1,16,16,16,16,16,15,15,1,0,0,0],
  [0,0,0,1,16,14,14,14,14,14,14,14,15,5,1,0],
  [0,0,1,16,14,14,14,14,14,14,14,14,15,5,5,1],
  [0,0,1,13,14,14,14,14,14,14,14,14,15,5,5,1],
  [0,1,13,13,14,14,14,14,14,14,14,14,15,15,5,5],
  [0,1,14,14,14,14,14,14,14,14,14,15,15,5,5,5],
  [0,1,15,15,15,15,15,15,15,15,15,15,15,15,5,1],
  [0,0,1,1,1,15,15,15,15,15,15,15,15,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// moonlight_streak frame 0 — neutral pulse. A subtle horizontal streak
// across the floor-surface region of the tile (rows 1-6, occupying ~half
// the visible top of the tile). Center band is dark-canopy mid with
// scattered moonlight-silver-cream specks where dew or phosphorescent
// moss catches the light. Below the streak, the tile continues as a
// dark-forest floor body so the streak composites cleanly into a `flat`-
// tile row without a seam. Decorative ONLY — Reed walks over it.
// ................
// ...dddDdddDddd..
// ..dDdMdddDdMdDd.
// ..dDdddMddddDdd.
// ..dMddddDdddMdd.
// ..dddddDdMddddd.
// ................
// ssssssssssssssss
// ksksskssssksskks
// kkkkkkkkkkkkkkkk
// ssssssssssssssss
// kkssskssssskksss
// ssssssssssssssss
// kkkkkkkkkkkkkkkk
// uuuuuuuuuuuuuuuu
// uuuuuuuuuuuuuuuu
const moonlight_streak_0 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,3,3,3,4,3,3,3,4,3,3,3,0,0],
  [0,0,3,4,3,10,3,3,3,4,3,10,3,4,3,0],
  [0,0,3,4,3,3,3,10,3,3,3,3,4,3,3,0],
  [0,0,3,10,3,3,3,3,4,3,3,3,10,3,3,0],
  [0,0,3,3,3,3,3,4,3,10,3,3,3,3,3,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [8,6,8,6,6,8,6,6,6,6,8,6,6,8,8,6],
  [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [8,8,6,6,6,8,6,6,6,6,6,8,8,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

// moonlight_streak frame 1 — breathed-bright pulse. More moonlight-silver-
// cream specks surface across the streak (the dew sparkles have rotated;
// more facets catch the light). Same streak silhouette; sparkle distribution
// densifies.
const moonlight_streak_1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,3,4,10,4,3,10,3,4,10,3,3,0,0],
  [0,0,3,10,4,4,10,3,4,4,3,4,10,4,3,0],
  [0,0,3,4,10,3,4,10,4,3,10,3,4,10,3,0],
  [0,0,3,10,4,4,10,3,4,10,3,3,10,4,3,0],
  [0,0,3,3,10,3,4,4,3,10,4,10,3,3,3,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [8,6,8,6,6,8,6,6,6,6,8,6,6,8,8,6],
  [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [8,8,6,6,6,8,6,6,6,6,6,8,8,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

// moonlight_streak frame 2 — dim pulse. The sparkles fade back to just the
// center band; outer specks return to dark canopy. Loop F0→F1→F2→F0 reads
// as "moonlight catching dew, dew shifts, catches again." 3 fps — same
// rhythm slot as the cave's `crystal_vein` though cooler and gentler.
const moonlight_streak_2 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,3,3,3,3,3,3,3,3,3,3,3,0,0],
  [0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,0],
  [0,0,3,3,3,3,4,3,4,3,3,3,3,3,3,0],
  [0,0,3,3,3,4,10,4,4,10,4,3,3,3,3,0],
  [0,0,3,3,3,3,3,4,3,3,3,3,3,3,3,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [8,6,8,6,6,8,6,6,6,6,8,6,6,8,8,6],
  [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [8,8,6,6,6,8,6,6,6,6,6,8,8,6,6,6],
  [6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6],
  [8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
];

// mile_1 — digit "1" (shared signpost shape across all stages). Plank face
// is cuff-cream with violet-ink digit; the post is wet-bark + loam-soil
// shadow. Digits stay legible against the dark-forest background.
const mile_1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,17,17,17,17,17,17,17,17,17,17,17,17,1,0],
  [0,1,17,17,17,17,17,17,17,17,17,17,17,17,1,0],
  [0,1,17,17,17,17,1,17,17,17,17,17,17,17,1,0],
  [0,1,17,17,17,1,1,17,17,17,17,17,17,17,1,0],
  [0,1,17,17,17,17,1,17,17,17,17,17,17,17,1,0],
  [0,1,17,17,1,1,1,1,1,17,17,17,17,17,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,1,18,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,18,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,18,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,18,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,19,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,19,19,19,19,19,1,0,0,0,0,0],
  [0,0,0,1,19,19,19,19,19,19,19,1,0,0,0,0],
];

// mile_2 — digit "2".
const mile_2 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,17,17,17,17,17,17,17,17,17,17,17,17,1,0],
  [0,1,17,17,17,1,1,1,1,1,17,17,17,17,1,0],
  [0,1,17,17,17,17,17,17,17,1,17,17,17,17,1,0],
  [0,1,17,17,17,1,1,1,1,1,17,17,17,17,1,0],
  [0,1,17,17,17,1,17,17,17,17,17,17,17,17,1,0],
  [0,1,17,17,17,1,1,1,1,1,17,17,17,17,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,1,18,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,18,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,18,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,18,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,19,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,19,19,19,19,19,1,0,0,0,0,0],
  [0,0,0,1,19,19,19,19,19,19,19,1,0,0,0,0],
];

// mile_3 — digit "3".
const mile_3 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,17,17,17,17,17,17,17,17,17,17,17,17,1,0],
  [0,1,17,17,17,1,1,1,1,1,17,17,17,17,1,0],
  [0,1,17,17,17,17,17,17,17,1,17,17,17,17,1,0],
  [0,1,17,17,17,17,1,1,1,1,17,17,17,17,1,0],
  [0,1,17,17,17,17,17,17,17,1,17,17,17,17,1,0],
  [0,1,17,17,17,1,1,1,1,1,17,17,17,17,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,1,18,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,18,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,18,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,18,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,19,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,19,19,19,19,19,1,0,0,0,0,0],
  [0,0,0,1,19,19,19,19,19,19,19,1,0,0,0,0],
];

// mile_4 — digit "4" (the last round of Area 1; the marker that points
// the player toward the boss's anteroom).
const mile_4 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,17,17,17,17,17,17,17,17,17,17,17,17,1,0],
  [0,1,17,17,17,1,17,17,17,1,17,17,17,17,1,0],
  [0,1,17,17,17,1,17,17,17,1,17,17,17,17,1,0],
  [0,1,17,17,17,1,1,1,1,1,17,17,17,17,1,0],
  [0,1,17,17,17,17,17,17,17,1,17,17,17,17,1,0],
  [0,1,17,17,17,17,17,17,17,1,17,17,17,17,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,1,18,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,18,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,18,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,18,1,0,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,19,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,19,19,19,19,19,1,0,0,0,0,0],
  [0,0,0,1,19,19,19,19,19,19,19,1,0,0,0,0],
];

// cairn — END-OF-AREA boundary cairn. Stack of three moss-flecked stones
// with a single dawn-amber sigil-fleck topmost (the only amber in the
// Stage 4 tileset outside the boss arena, by deliberate foreshadowing).
// The cairn is built from river-stone-grey body with tree-bark-shadow
// undercuts and pale-moss accents on the moonlit upper faces; the topmost
// stone carries a cuff-cream rim with the dawn-amber sigil-fleck nested
// inside. Visually distinct from `stage_exit` (the cave/water arch) and
// from Stage 1's cairn (warmer cream-on-grey) — this cairn reads as
// "the journey has accumulated into a quiet, moonlit pile, and one stone
// keeps a single ember alive at the top."
// ................
// ......orarro....
// .....orcaccro...
// .....orcaccrRo..
// .....oRRccRRko..
// ....okRRRRRkks..
// ....oRRRGRRkkRo.
// ...okRRGGRRRkRo.
// ...okRGGGRRRRso.
// ..oRRRGGRRRRRkk.
// ..oRRRRRRRRkkkko
// .okkkkkkkkkkkkko
// .okRRRkRRkRRkkko
// .okkkkkkkkkkkkkk
// .okkLLLLLkkkLLLk
// LLLLLLLLLLLLLLLL
const cairn = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,16,20,16,16,1,0,0,0,0],
  [0,0,0,0,0,1,16,17,20,17,17,16,1,0,0,0],
  [0,0,0,0,0,1,16,17,20,17,17,16,16,1,0,0],
  [0,0,0,0,0,1,16,16,17,17,16,16,15,1,0,0],
  [0,0,0,0,1,15,16,16,16,16,16,15,15,6,1,0],
  [0,0,0,0,1,16,16,16,13,16,16,15,15,16,1,0],
  [0,0,0,1,15,16,16,13,13,16,16,16,15,16,1,0],
  [0,0,0,1,15,16,13,13,13,16,16,16,16,6,1,0],
  [0,0,1,16,16,16,13,13,16,16,16,16,16,15,15,1],
  [0,0,1,16,16,16,16,16,16,16,16,15,15,15,15,1],
  [0,1,15,15,15,15,15,15,15,15,15,15,15,15,15,1],
  [0,1,15,16,16,16,15,16,16,15,16,16,15,15,15,1],
  [0,1,15,15,15,15,15,15,15,15,15,15,15,15,15,15],
  [0,1,15,15,19,19,19,19,19,15,15,15,19,19,19,15],
  [19,19,19,19,19,19,19,19,19,19,19,19,19,19,19,19],
];

export const TILES = {
  flat,
  slope_up_22,
  slope_up_45,
  slope_dn_22,
  slope_dn_45,
  rock_small,
  moonlight_streak: { frames: [moonlight_streak_0, moonlight_streak_1, moonlight_streak_2], fps: 3 },
  mile_1,
  mile_2,
  mile_3,
  mile_4,
  cairn,
};

export const META = {
  tile: 16,        // cell-matrix dimension in art-pixels (square)
  scale: 3,        // art-pixel → canvas-pixel scale; 16 × 3 = 48 = src TILE
  displayPx: 48,   // resulting on-canvas tile size; matches `TILE = 48` in src
};

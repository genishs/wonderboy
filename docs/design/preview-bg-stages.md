# Preview — Per-stage parallax backgrounds (v0.75.1)

> Owner: design-lead. Spec: deliverables required by the v0.75.1 patch —
> three-layer parallax for Stages 2 (shore), 3 (cave), 4 (dark forest).
> Stage 1 retains its existing `area1-{sky,mountains,trees}.svg` layers from
> Phase 2.
> **한국어 버전:** [`preview-bg-stages.ko.md`](./preview-bg-stages.ko.md)

This patch ships **9 new SVG parallax layers** organized as 3 layers per
stage × 3 stages. All SVGs are 768 × 576 to match the project's logical
resolution; tileable horizontally; total weight per file under ~3 KB. Scroll
factors are applied by `src/graphics/ParallaxBackground.js` — recommended
factors per layer below.

## Layer naming and scroll-factor convention

| Layer suffix | Recommended scroll factor | Role                                  |
|--------------|--------------------------:|---------------------------------------|
| `-sky`       | **0.0**                   | Static background; fills full canvas. |
| `-mid`       | **0.3**                   | Slow parallax; horizon-level detail.  |
| `-fg`        | **0.7**                   | Fast parallax; near-foreground band.  |

These factors mirror the existing Stage 1 / Phase 2 convention (sky 0.0,
mountains 0.3, trees 0.6–0.7 per the existing `area1-trees.svg` header note).
Dev-lead may tune per-file in `ParallaxBackground.js`; the values above are
what each SVG was authored against.

## Stage 2 — shore (sun-warmed dawn on open sea)

Files:
- `assets/bg/area1-stage2-shore-sky.svg` (factor 0.0)
- `assets/bg/area1-stage2-shore-mid.svg` (factor 0.3)
- `assets/bg/area1-stage2-shore-fg.svg`  (factor 0.7)

### `-sky` (factor 0.0)

A vertical dawn gradient: pale gold-amber at the very top (`#f8d878`),
deepening through warm amber (`#e8a040`) into mauve haze (`#c89a98`), then
cooling into sea-mist blue (`#8a9aa8`) and sea-deep ripple-pale (`#6a90a8`) at
the bottom. Three soft cream-white cloud bands at the top and middle break up
the gradient; their edges fade to zero opacity so the layer tiles horizontally.
A thin sun-amber catch sits at row 386 where sky meets sea — this is the
horizon line. Below the horizon, a faint reflection band continues the warmth
two pixels into the upper sea. A small **lighthouse silhouette** sits at
(548, 360) — three stacked rectangles for base + tower + lantern, all in
violet ink (`#3a2e4a`), with a small amber lantern catch and two soft amber
glow patches at the lantern level. This is the Stage 2 signature beat per
the story brief.

### `-mid` (factor 0.3)

The distant ocean: a flat sea-deep band (`#3a586a`) fills the middle of the
canvas, deepening into sea-deep dark (`#2a4258`) beneath. A thin dawn-amber
reflection skim (`#e8a040`, then `#f8d878`) glints along the wave-tops just
below the horizon. Thirteen small ripple-pale slashes (`#6a90a8`) distribute
across the sea surface, suggesting wave-tops. Five amber-tipped wave-peaks
sit near the horizon for the dawn reflection cue. Two faint wet-shelf-stone
landmasses recede into the sea-mist at the bottom-left and bottom-right
corners — distant headlands receding into haze, with a thin shore-moss
(`#6a8a4a`) accent along the closer edge.

### `-fg` (factor 0.7)

The near coast: a thin damp-sand band (`#e8d4a0`) at row 525, followed by a
slightly cooler wet-shelf-stone strip (`#8a9a96`) below. Twenty long
dune-grass blade strokes (`#6a8a4a` shore-moss) rise from the bottom edge,
each ~25 pixels long, curving as if windblown. Ten of the twenty blades
carry a dawn-amber tip catch (`#e8a040`) for morning light. Four dune-curve
violet shadows (`#3a586a` sea-deep, low opacity) at the very base soften the
silhouette and pull the foreground cool so the hero's warmth pops.

## Stage 3 — cave (enclosed underground with distant amber-vein glow)

Files:
- `assets/bg/area1-stage3-cave-sky.svg` (factor 0.0)
- `assets/bg/area1-stage3-cave-mid.svg` (factor 0.3)
- `assets/bg/area1-stage3-cave-fg.svg`  (factor 0.7)

### `-sky` (factor 0.0)

The cave ceiling. A vertical gradient from cave-moss-blue-green dark
(`#284844`) at the very top, through cave under-base (`#3a4248`), into
cave-moss-blue-green base (`#3a5e58`), settling at wet-cave-stone shadow
(`#4a5860`) at the bottom. A soft amber wash centered at the middle horizon
(`#e8a040`, low opacity) reads as a distant amber-vein glow somewhere
behind the rock — telling the player "warmth exists down here, just not
nearby." Ten violet-ink stalactites of varying depths hang from the top
edge — these are the cave's signature ceiling texture. Seven softer
cave-stone-shadow stalactites sit behind them for depth. Five small
stalagmites rise from the lower horizon, far enough to read as distant
floor formations rather than the player-traversable foreground.

### `-mid` (factor 0.3)

The deep cave wall. A wet-cave-stone shadow (`#4a5860`) band fills the
middle-to-lower vertical extent, with a slightly warmer wet-cave-stone
(`#6a7878`) overlay in front. Six soft vertical mineral-deposit stripes
(`#c8d4c8` cave-stone catchlight, low opacity) distribute across the wall
at ~110-pixel intervals, reading as crystalline columns receding into the
depth. Four amber-vein striations (`#e8a040`, low opacity) thread through
the wall vertically; each carries a single brighter peak-amber pinpoint
(`#f8d878`) at its midpoint, echoing the cave tileset's `crystal_vein`
hazard. Five distant cave-stone outcrops (`#7a8088` river-stone-grey, low
opacity) sit at the base, three carrying sparse cave-moss-blue-green
(`#3a5e58`) accents on top.

### `-fg` (factor 0.7)

The near cave wall. Six hanging cave-moss strands (`#3a5e58`) drape from the
upper edge of this layer, each a teardrop-curve about 110 pixels tall —
reads as overgrown cave-mouth foliage seen from inside the cave. Six darker
cave-moss-blue-green under-strands (`#284844`) sit behind for depth. Four
broken cave-stone fragments along the very base — chunky wedge silhouettes
in wet-cave-stone with a cave-stone-catchlight upper face. Four amber-vein
pinpoints (`#e8a040`) glint at the base of each stone, restating the cave's
signature warmth slot at near-foreground depth.

## Stage 4 — dark forest (moonlit canopy with fireflies)

Files:
- `assets/bg/area1-stage4-darkforest-sky.svg` (factor 0.0)
- `assets/bg/area1-stage4-darkforest-mid.svg` (factor 0.3)
- `assets/bg/area1-stage4-darkforest-fg.svg`  (factor 0.7)

### `-sky` (factor 0.0)

The deep night sky over the canopy. A vertical gradient from dark-forest
under-base (`#1e2032`) at the top, through dark-canopy blue-green dark
(`#2a3a3a`) and mid (`#3e5a52`), settling at canopy-shadow-violet (`#684e6e`)
at the bottom. A **moon glow** radial gradient is layered on top, centered
at (50%, 18%) of the canvas — a soft moonlight-silver-cream (`#cfd8dc`)
radial fade. The moon itself sits as a small pale disc at (384, 100), with
a brighter white catch (`#fff4e8`) on its upper-left. A faint vertical
moonlight column extends from the moon downward through the lower canvas,
suggesting the moonlight column that descends into the boss arena.
**Six firefly points** (`#e8a040`) sprinkle across the upper-middle
canvas; three carry brighter peak-amber catches (`#f8d878`) for the closer
fireflies. A faint canopy band at the bottom (`#1e2032`, low opacity)
hints at the next parallax layer.

### `-mid` (factor 0.3)

The middle-distance forest. A dark-canopy blue-green dark (`#2a3a3a`) far
canopy ridge runs across the upper-third, with a slightly lighter
dark-canopy mid (`#3e5a52`) below filling the bottom 60%. **Seven twisted-
trunk silhouettes** rise vertically through the canopy in canopy-shadow-violet
(`#684e6e`); their irregular wavy shape suggests aged wood. Five carry a
moonlight-silver rim stroke (`#cfd8dc`, low opacity) along their moon-ward
sides. Five sparse pale-moss highlight clusters (`#5a8a4a`, low opacity)
sit on the trunks, restating the cairn-mantle moss family the boss shares.

### `-fg` (factor 0.7)

The near foliage. Seven drooping canopy-shadow-violet (`#684e6e`) foliage
clusters drape along the upper edge of this layer. Six velvet under-flame
violet (`#5a4a6e`) under-foliage stripes sit behind them, deepening the
silhouette. Ten dark-moss tuft strokes (`#3e5a52`) rise from the very base.
Seven of the tufts carry a moonlight-silver-cream catch (`#cfd8dc`) at
their tip — this is the dark forest's signature warmth slot, which is
**moonlight silver**, NOT dawn-amber (per palette-phase3.md cross-sprite
consistency rules: the dark forest cools toward silver-cream and reserves
amber for the final cairn sigil-fleck).

## Reading notes for reviewers

- Each stage's three layers should read as **one mood** from a distance.
  If a layer in isolation looks too cold or too warm relative to its
  companions, the layer-to-layer interplay can be adjusted via the
  ParallaxBackground.js opacity overrides.
- The dark forest is the only Stage 4 layer set that uses moonlight-silver
  as its signature warmth instead of amber. This is per the Phase 3
  palette rules — the player walks the whole stage seeing only silver,
  then meets the amber on the cairn at stage-end and immediately after on
  the Bracken Warden's chest sigil. Resisting amber in Stage 4 is a
  deliberate foreshadowing choice.
- The lighthouse silhouette in Stage 2 sky is the **only narrative
  silhouette** in the v0.75.1 parallax set — per the story brief signature
  beat for Stage 2. The cave (Stage 3) has no equivalent signature
  silhouette; its mood comes from the amber-vein glow far back. The dark
  forest (Stage 4) has the moon as its signature silhouette.

## Cumulative parallax SVG inventory after v0.75.1

| Stage | Sky                                                | Mid                                                  | Fg                                                  |
|-------|----------------------------------------------------|------------------------------------------------------|-----------------------------------------------------|
| 1     | `area1-sky.svg` (Phase 2)                          | `area1-mountains.svg` (Phase 2)                      | `area1-trees.svg` (Phase 2)                         |
| 2     | `area1-stage2-shore-sky.svg` (v0.75.1)             | `area1-stage2-shore-mid.svg` (v0.75.1)               | `area1-stage2-shore-fg.svg` (v0.75.1)               |
| 3     | `area1-stage3-cave-sky.svg` (v0.75.1)              | `area1-stage3-cave-mid.svg` (v0.75.1)                | `area1-stage3-cave-fg.svg` (v0.75.1)                |
| 4     | `area1-stage4-darkforest-sky.svg` (v0.75.1)        | `area1-stage4-darkforest-mid.svg` (v0.75.1)          | `area1-stage4-darkforest-fg.svg` (v0.75.1)          |

**Total parallax SVGs in the project: 12** (3 Stage 1 + 9 new in v0.75.1).

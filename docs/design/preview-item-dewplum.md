# Preview — `item-dewplum.js` (v0.75.1)

> Owner: design-lead. Spec: `docs/briefs/phase3-area1-expansion.md` §15.
> **한국어 버전:** [`preview-item-dewplum.ko.md`](./preview-item-dewplum.ko.md)

Sprite module: `assets/sprites/item-dewplum.js`. Dimensions: **14 × 14
art-pixels**. Anchor: `{ x: 7, y: 13 }` (base-center). FPS: **4** (subtle
shimmer per story-lead §15.3). Animation keys: `idle` (2 frames).

## Frame-by-frame description

### `idle` frame 0 — base read

A small rounded plum-shape, deep river-blue body (`#3a586a`). A tiny moss-green
leaf-curl (`#4a7c3a`) sits at the very top, one cell wide, suggesting a stem.
On the upper-left curve, a single pale-cyan dew-bead pixel (`#a8c8d8`) catches
imagined morning light — the only cool highlight on the silhouette. Along the
lower curve, a thin warm dawn-amber rim (`#e8a040`) reads as ripeness — the
plum is ready to be picked. Universal violet ink (`#3a2e4a`) outlines the
entire silhouette. Sitting flush on the ground via the base-center anchor.

### `idle` frame 1 — dew shimmer pulse

Identical silhouette to frame 0, but the dew-bead highlight has migrated by
one pixel from row 4 to row 3 and shifted to a brighter cuff-cream
(`#e8d4a0`) — reading as the dew-bead catching a brighter glint as the morning
rotates one degree. The amber ripeness rim along the bottom is unchanged. The
plum is otherwise still. At 4 fps the two-frame cycle reads as breath, not
sparkle.

## Reading notes for reviewers

- The dewplum should read as **calm and ordinary** from a distance — a common
  pickup, not a special prize.
- The single dew-bead highlight is what tells the player "fresh, edible." It
  should be visible at the canvas's default render scale; if not, the dew-bead
  pixel may need to migrate to a more central row.
- The amber rim along the bottom is **deliberately thin** — 5 pixels in a
  horizontal arc. It's the warm-side cue without competing with the cooler
  river-blue body.
- No eyes; the dewplum is not a creature.

## Dev-side handling (informative)

`item` component: `{ type: 'fruit_dewplum', collected: false }`. On hero
contact, `state.vitality = Math.min(state.vitalityMax, state.vitality + 20)`;
flip `collected = true`; play the collect anim (story-lead §15.3 — 3-frame
collect at 12 fps, reuse hit-spark sparkles); despawn at anim end. Persists
across mid-stage respawn (per story-lead spec).

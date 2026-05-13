# Preview — `item-amberfig.js` (v0.75.1)

> Owner: design-lead. Spec: `docs/briefs/phase3-area1-expansion.md` §15.
> **한국어 버전:** [`preview-item-amberfig.ko.md`](./preview-item-amberfig.ko.md)

Sprite module: `assets/sprites/item-amberfig.js`. Dimensions: **18 × 18
art-pixels** (visibly larger than dewplum). Anchor: `{ x: 9, y: 17 }`
(base-center). FPS: **4** (pulse glow cycle per story-lead §15.3). Animation
keys: `idle` (3 frames).

## Frame-by-frame description

### `idle` frame 0 — base read

A teardrop fig-shape, fuller than the dewplum. Warm dawn-amber body
(`#e8a040`) with a brighter amber catch (`#f8d878`) on the upper round of the
silhouette. A wet-bark-brown stem-knot (`#4a3422`) sits at the top with a
small curled moss-green leaf (`#4a7c3a` mid, `#2e5028` shadow) extending up-
left and folding back. The lower half of the body is dotted with amber-deep
(`#a85820`) shadow pockets that read as the fig's flesh-shadow under skin —
deeper than the rim, giving the body weight. Violet ink (`#3a2e4a`) outlines
the silhouette.

### `idle` frame 1 — pulse rising

The body shape is unchanged. On the upper-right quadrant of the body, the
amber-bright catch has bloomed into a pale-cream (`#e8d4a0`) highlight cluster
that extends across about 5 cells. The player reading this frame should
notice "this fruit is brighter than the dewplum — it might be the special
one." The lower amber-deep shadows are unchanged; the warmth is concentrated
on the upper-right.

### `idle` frame 2 — pulse peak

The pale-cream highlight from frame 1 stays, plus a fig-cream-bright
(`#fff2c0`) glint at the center of the upper-right curve — three pixels in a
small cluster. This is the brightest single pixel-cluster on the amberfig and
the brightest single hex in the v0.75.1 patch (reused from the boss's sigil
core-bright). The player should be able to spot the amberfig **from across the
screen** by this pulse — that's its design intent: the rare fruit advertises
itself from afar. From frame 2 the animation cycles back to frame 0 at 4 fps,
giving a slow 0.75-second pulse.

## Reading notes for reviewers

- The amberfig should read **distinctly brighter and warmer** than the
  dewplum. If a side-by-side render shows them at similar tone, the amber-deep
  shadows in the amberfig may need to deepen further (`#a85820` → a touch
  more saturated).
- The leaf-tip on the amberfig is asymmetric (extending up-left from the
  stem-knot). This is deliberate — the eye reads "natural, not stamped."
- The brightest pulse pixel-cluster on frame 2 reuses the boss-sigil family
  hex (`#fff2c0`), extending the "brightest amber = living and special"
  reading to the rare fruit. This is intentional cross-sprite consistency
  (see palette-v0.75.1 §"Cross-sprite consistency rules").

## Dev-side handling (informative)

`item` component: `{ type: 'fruit_amberfig', collected: false }`. On hero
contact, `state.vitality = Math.min(state.vitalityMax, state.vitality + 50)`;
flip `collected = true`; play the collect anim (3 frames at 12 fps, brighter
bloom than dewplum to match the bigger reward); despawn at anim end. Persists
across mid-stage respawn.

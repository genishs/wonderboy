# Preview — `item-husk-shell.js` (v0.75.1)

> Owner: design-lead. Spec context: the v0.75.1 dawn-husk burst refinement
> requires shell-fragment particles that fly off when the egg bursts. This
> sprite supplies them.
> **한국어 버전:** [`preview-item-husk-shell.ko.md`](./preview-item-husk-shell.ko.md)

Sprite module: `assets/sprites/item-husk-shell.js`. Dimensions: **8 × 8
art-pixels** (particle-sized fragments). Anchor: `{ x: 4, y: 4 }` (center
anchor — fragments tumble around their middle). FPS: **8**. Animation keys:
`tumble` (4 frames).

## Frame-by-frame description

### `tumble` frame 0 — right-edge view

A small curved shell-shard with its convex face to the right. Cuff-cream
(`#e8d4a0`) catches morning light on the upper convex curve; shell-loam base
(`#a8794a`) fills the main face; shell-loam shadow (`#7a5238`) darkens the
lower concave half. A dawn-amber rim (`#e8a040`) traces the right (convex)
edge. Violet ink (`#3a2e4a`) outlines the silhouette.

### `tumble` frame 1 — top-down view

The shard has rotated ~90° and now shows its top-down face: a flatter, broader
sliver. Mostly shell-loam-shadow with a single cuff-cream catch at the left
edge of the upper face, dawn-amber rim along the right.

### `tumble` frame 2 — left-edge view

Mirror of frame 0. The convex face is now on the left side (the silhouette
has rotated another ~90°). The dawn-amber rim has moved to the left edge —
this is the trailing rim as the shard rotates.

### `tumble` frame 3 — bottom-up view

Mirror of frame 1. The convex face is now below; the shard shows its
under-face. Final frame in the rotation loop before frame 0 plays again.

## Reading notes for reviewers

- Each fragment is tiny (8 × 8); per dev-lead's spawn, 2–4 fragments are
  created at the moment `burst0` of the dawn-husk plays. Each fragment gets
  a random initial frame so they don't all rotate in lockstep.
- The fragment palette is identical to dawn-husk's main face hexes — the
  player should read each fragment as "a piece of THAT egg, flying away."
- Dawn-amber rim catches the same warmth as the burst flash, tying the
  fragments visually to the climax frame.
- At anchor (4, 4), the fragment tumbles around its center — gravity tugs
  the center down, but the fragment's perceived rotation is around the
  visual middle of the sprite.

## Dev-side handling (informative — required for this asset to ship)

Per the v0.75.1 brief: dev-lead should spawn **2–4 husk-shell entities** when
the dawn-husk's `burst` animation reaches frame 0. Each entity:

- Spawn position: same as the dawn-husk's center.
- Velocity: `vx = random ±2 to ±4 px/frame`, `vy = -3 to -5 px/frame` (up + outward).
- Gravity: standard project gravity applies.
- Lifetime: despawn off-screen, or after `lifetimeMax ≈ 60 frames`.
- Sprite frame: random initial frame from 0–3 so the 2–4 fragments rotate
  with offset phases.

After the dawn-husk's `burst2` frame, the husk entity itself despawns; the
shell fragments continue independently until they fall off-screen.

# Preview — `enemy-threadshade.js` (v0.75.1)

> Owner: design-lead. Spec: `docs/briefs/phase3-area1-expansion.md` §16.
> **한국어 버전:** [`preview-enemy-threadshade.ko.md`](./preview-enemy-threadshade.ko.md)

Sprite module: `assets/sprites/enemy-threadshade.js`. Dimensions: **18 × 24
art-pixels** (legs span horizontal + body vertical + thread above). Anchor:
`{ x: 9, y: 23 }` (base-center draw reference; dev's AI computes `y` per the
sine-wave oscillator). FPS: **6** (slower than Hummerwing's 8 fps to match the
patient pacing per story-lead §16.5). Animation keys: `drift` (2 frames),
`dead` (2 frames).

## Frame-by-frame description

### `drift` frame 0 — `hang_a`

A pale moonlight-silver-cream thread (`#cfd8dc`) descends vertically from the
top of the sprite (rows 1–8). Below it, a compact rounded body suspended low
in the sprite (rows 9–17): canopy-shadow-violet (`#684e6e`) under-belly,
velvet under-flame (`#5a4a6e`) outer body, a small chitin-warm (`#7a5a48`)
body cue along the center column, a single moss-mottle (`#3e6a3a`) cell along
the back. Six short leg-fingers radiate from the lower half of the body
(rows 17–22) in violet under-shade and ink. The two pinprick amber eye-glints
(`#e8a040`) sit low on the body (rows 14–15), centered on the chitin-warm
column — these are the only warm note on the creature. Eyes are pinpricks,
NOT directional — they do not look at the player (matches Mossplodder's "no
aim" convention).

### `drift` frame 1 — `hang_b`

Near-imperceptible change. The thread shows a single pulse segment at row 4
(thread-shimmer-pale `#fff8e8`) — a brighter cell that travels ~1/3 down the
thread's length, suggesting the thread is alive enough to pulse. Two of the
six leg-fingers extend ~1 pixel outward (the outermost left and outermost
right legs swap to row-21 instead of row-20), giving a barely-visible
"leg-shimmer." The body itself does not visibly shift. The mood is **breath,
not attack** — the Threadshade is patient, not predatory.

### `dead` frame 0 — thread-snap-mid

The thread has been severed at the top of the sprite (no thread cells in rows
1–4). The remaining thread is visible in rows 5–7. The body has slumped: the
chitin-warm body cue is gone (replaced with canopy-shadow-violet `#684e6e`),
the legs have curled inward (no longer radiating outward — they pull close to
the body's central column), and the eye-glints have dimmed but remain visible
on the front face (rows 14, centered). The Threadshade reads as "freshly hit,
about to fall" in this frame. Dev-lead applies gravity to the entity at this
point per §16.3, so the sprite drops downward toward the floor row over the
next ~10 frames.

### `dead` frame 1 — collapsed

The Threadshade is now flat against the floor row. The body lies horizontally
across the bottom of the sprite (rows 16–22), legs splayed outward on both
sides, eye-glints faded. No thread is visible. This frame is held for ~10
frames before dev-lead triggers the standard Mossplodder-style hit-spark
dissolve (per §16.3 — "frame 16–20 dissolves into the same hit-spark sparkles
as Mossplodder kills"). If the Threadshade is killed below the floor line
(e.g., swung over a gap), dev-lead may skip this frame and despawn the entity
off-screen instead.

## Reading notes for reviewers

- The Threadshade is **patient, not predatory**. If a side-by-side render
  shows it reading as "horror element," the chitin-warm body cue may need to
  cool slightly, or the moss-mottle along the back may need to extend.
- Eye-glints are deliberately tiny (single pinpricks) and do not track the
  player. They are the only warm note on the body and they should *just*
  catch the player's attention before the silhouette does (per story brief
  §16.1).
- The thread is **visual only** — dev-lead's spec (§16.8) says collision is
  the body hitbox alone (~32 × 32 px, inset from the 48 × 48 sprite tile that
  the body sits within). The thread does not damage the player.
- The thread continues UP from the sprite top in real placement — dev-lead's
  renderer can clip the thread cells to the visible viewport. The 24-pixel
  height of the sprite is the *body region* including legs; the thread is the
  upper portion of those 24 pixels.

## Dev-side handling (informative)

`enemy` component: `{ type: 'threadshade', dir: 0, ai: 'threadshade', hp: 1 }`.
AI step (per story-lead §16.8): `phase += 0.04; y = baseY + Math.sin(phase) *
(3 * TILE / 2);` where `baseY` is the midpoint of the 3-tile vertical range
the Threadshade swings within. Initial `phase` may be randomized per-spawn so
multiple Threadshades in the same stage don't all bob in lockstep. On hatchet
hit → `enemy.hp -= 1` → 0 → play `dead` frames + hit-spark dissolve → despawn.

# Preview — `assets/sprites/item-dawn-husk.js`

> **한국어 버전:** [`preview-item-dawn-husk.ko.md`](./preview-item-dawn-husk.ko.md)

| Field   | Value                              |
|---------|------------------------------------|
| Path    | `assets/sprites/item-dawn-husk.js` |
| Size    | 12 × 12 px                         |
| Anchor  | `{ x: 6, y: 11 }` (base center — egg sits flush on ground) |
| FPS     | 4 (break plays ~12 frames at 4 fps; Dev shimmer override at 2 fps for `rest`) |
| Palette | 8 entries                          |

> Size note: cast brief §11 suggested 24 × 24; user-instructions allowed
> halving precedent — we ship at 12 × 12 to match the dawn-husk's "small ovoid
> the size of Reed's head" intent (cast §5). At TILE = 48 the husk renders as
> a quarter-tile object that nests into the loam.

## Silhouette intent

An oval with a slightly heavier base — *resting on the ground*, not hovering.
Lower rows are 1-cell wider than upper rows so the silhouette reads "nested
into the loam." Two-tone speckle: shell-loam base with sparse darker fleck
(`#5a3a22` — the Phase 1 bark base, shared) and cuff-cream highlight cells.
Faint dawn-amber rim along the eastern (right-facing) arc keeps the
silhouette unmistakable at low contrast.

## Frames

### `rest` (2 frames, looped at 2 fps for slow shimmer)

- **`rest0`** — **intact husk**. Static oval, base wider than top, eastern
  dawn-rim catching light on the right side. Two cuff-cream speckle cells on
  the dorsal face; one dark-fleck cell on the western side for the
  "river-stone" read.
- **`rest1`** — **slow shimmer**. Identical body shape but the dawn-rim
  brightens by one cell down the eastern arc, and one cuff-cream speckle has
  migrated to a new dorsal cell. Per cast §5.3 + §5.5 the Dev shimmer fps is 2
  (very slow); at that rate the player reads the husk as "stone slowly catching
  morning sun."

Implemented as a true 2-frame animation rather than a static rest because the
brief allowed it ("Design may add a 2-frame slow shimmer if budget allows" —
budget allowed).

### `break` (3 frames, ~12 frame total duration per cast §5.5)

The crack-open sequence triggered on Reed contact. Stone hatchet appears in
Reed's hand on the same logical frame as `break2`; the husk halves do not
persist (cast §5.2).

- **`break0`** — **fissure**. A diagonal crack opens across the husk from
  upper-left to lower-right. The husk silhouette is still whole; a single
  column of dawn-amber bright cells (`#f8d878`, the brightest in the palette)
  cuts diagonally across the body where the crack line will widen on the next
  frame. The crack reads as a glowing seam, not a void.
- **`break1`** — **halves separate**. The fissure widens to 2 cells of
  dawn-amber bright; halves drift apart by 1 cell each (left half shifts left,
  right half shifts right). The flash-of-amber between them is the **visual
  climax** of the break — this is the frame the player remembers as "the egg
  cracked open."
- **`break2`** — **halves fall apart and fade**. Only thin shell remnants on
  far left and far right; the centre is empty. Faint dawn-amber dust radiates
  outward — two single cells at the bottom-centre. After this frame the egg
  entity despawns and `player.armed` flips true (Dev's PickupSystem). Reed
  walks out of the break already armed (cast §2.1 — "no intermediate picking-
  up pose").

## Break animation feel

Three beats: crack appears, halves separate with a flash, halves fade. Total
~12 frames at the target fps gives the player ~200 ms — short enough to feel
like one event, long enough that the eye registers the warmth of the flash. The
dawn-amber palette ties this beat to Reed's own warmth (cast brief §5.1) — the
hero is *catching* something his own color, not picking up a foreign object.

---

## v0.75.1 extension — `burst` (3 frames, ~12 frames at 8 fps)

The v0.75.1 patch refines the egg's climax. Player feedback from the v0.75
in-browser playtest was that the existing `break` animation read as **gentle**
when it should read as **dramatic** — Reed catching his weapon should feel
like an event. The `burst` key adds three frames played *after* the existing
`break` sequence completes (or as an alternative climax — dev-lead's call on
the FSM stitching). This animation is paired with the new
[`item-husk-shell.js`](./preview-item-husk-shell.md) shell-fragment particle:
dev-lead spawns 2–4 husk-shell entities at `burst` frame 0, each with random
outward velocity + gravity, so the egg visibly *fragments* rather than just
*opens*.

### `burst` (3 frames at 8 fps — faster than `break`'s 4 fps for the percussive read)

- **`burst0`** — **cracking deeper**. The halves are still in-frame but the
  dawn-amber bright cells widen into a 4-cell-wide flare at the center. A
  cuff-cream halo has begun ringing the inner edges of both halves. This is
  the moment dev-lead spawns the shell-fragment entities — the player should
  read this frame as "the egg is committing to break apart, not just crack."
- **`burst1`** — **halves opening explosively**. Each half drifts further
  from center than in `break1`'s position; a 2-cell flash of cuff-cream
  surrounds the dawn-amber flare core. The left half slides one cell left,
  the right half slides one cell right. This is the climax frame — the
  brightest single moment in the egg's life. The amber flare reads as living
  warmth being released, not just light.
- **`burst2`** — **halves about to leave the frame**. Only thin shell
  remnants at the far left and far right edges of the sprite; the center is
  filled with dawn-amber afterglow and cuff-cream sparkles arranged in a
  symmetric ring. The hatchet pickup (rendered by dev-lead as a separate
  sprite) is what the player sees after this frame disposes. The husk entity
  despawns at the end of this frame; the shell fragments continue
  independently.

### Visual reading — why the burst is bigger than the break

- The `break` sequence had the halves drift by ~1 cell; `burst` has them
  drift by ~2 cells plus a wider amber flare core. Visually, `burst` reads
  as "the egg threw itself open."
- The cuff-cream halo on `burst1` is a NEW visual element not present in any
  `break` frame — it's the bright shock-ring that signals "this is the loud
  moment."
- The shell fragments (separate sprite) are visible at the same time as
  `burst0`, so the player sees pieces of the egg in flight while the egg
  itself is still mid-burst. This is what makes the burst feel like an
  *event* rather than an *animation*.

### Why this is appended, not a replacement

The existing `break` frames are preserved verbatim — the FSM stitching of
"break ➜ burst" is dev-lead's call. The dev-lead may choose to:

1. **Append:** Play `break0 → break1 → break2 → burst0 → burst1 → burst2`
   for a total of 6 frames (~750 ms at the mixed fps); dramatic, slow.
2. **Replace:** Skip `break2` entirely and jump directly from `break1` to
   `burst0` for a total of 5 frames; tighter pacing.
3. **Alternative:** Use only `burst` frames when the dev wants the loudest
   egg-break (e.g., the very first one Reed encounters) and the older `break`
   frames for any subsequent eggs, so the first one feels special.

This preview doc does not prescribe; dev-lead picks per the in-game feel.

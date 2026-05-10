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

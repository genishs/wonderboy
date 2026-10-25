# Preview — `assets/sprites/projectile-stone-hatchet.js`

> **한국어 버전:** [`preview-projectile-stone-hatchet.ko.md`](./preview-projectile-stone-hatchet.ko.md)

| Field   | Value                              |
|---------|------------------------------------|
| Path    | `assets/sprites/projectile-stone-hatchet.js` |
| Size    | 12 × 12 px                         |
| Anchor  | `{ x: 6, y: 6 }` (body center — spin axis) |
| FPS     | 16 (high-spin per cast brief §6.2) |
| Palette | 10 entries                         |

> Size note: brief calls for "12×12 or similar" — we ship at 12 × 12. At
> TILE = 48 the hatchet renders as a quarter-tile chunk that reads as "real
> tool, not magic spark." The retired stoneflake was 8 × 8; the hatchet is 50%
> bigger by linear dimension and visibly more menacing.

## Frames

### `fly` (2 frames, played at 16 fps for blur read)

- **`fly0`** — **head-up**. The wedge head sits high (rows 1-4), head shape
  drawn as a roughly trapezoidal stack of `chip-stone` cells with a highlight
  on the upper-right (catching dawn) and a shadow on the lower-left. The handle
  binding (`cloth-wrap-tan`) runs vertically below the head, rows 6-10. This is
  the "axe head leading on top half of cycle" frame.
- **`fly1`** — **head-down**. A full 180° spin: the wedge head is now at the
  bottom (rows 7-10), the grip above (rows 2-5). Highlight side flips from
  upper-right to lower-left so the spin reads as **rotation**, not just a
  vertical hop. At 16 fps the [0,1,0,1...] cycle blurs in the eye to a
  spinning axe shape.

The trajectory itself (parabolic arc, 6-7 tile range, no bounce) is owned by
dev-lead's HatchetSystem. The sprite just provides the spinning silhouette.

### `splash` (2 frames, plays on first contact then despawn)

- **`splash0`** — **impact spark**. A four-pointed dawn-amber star (`#e8a040`)
  with a pale-gold core (`#f8d878`), bracketed by morning-haze puff cells on
  the diagonal points. This is the *reward frame* — the player just landed a
  hit, and the sprite confirms it with a single-frame burst. Per cast §6.2 the
  hatchet despawns on first contact regardless of target, so this frame plays
  for ground / wall / enemy hits alike.
- **`splash1`** — **dissipating**. The amber spark has faded; only a thin ring
  of haze puff cells remains, drifting outward. Mostly transparent — about 8
  visible cells. After this frame the entity despawns.

### Trajectory feel (one sentence)

A heavier, committed throw: the hatchet rises in a low parabolic arc, peaks
about 4-5 tiles ahead of the throw point, and lands once with a dawn-amber
spark — no bounce, no skip, the player paid for this throw and the world
remembers it.

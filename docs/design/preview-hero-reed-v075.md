# Preview — Reed v0.75 rebuild (`hero-reed.js`, 24 × 36)

> Reviewer note: this is a **full rebuild** of the hero sprite, superseding the
> 16 × 24 art in [`preview-hero-reed.md`](./preview-hero-reed.md) /
> [`preview-hero-reed-armed.md`](./preview-hero-reed-armed.md) /
> [`preview-hero-reed-v0502.md`](./preview-hero-reed-v0502.md). Those earlier
> documents are kept as historical record; the live shipping sprite from v0.75
> onward is described HERE.
>
> **한국어 버전:** [`preview-hero-reed-v075.ko.md`](./preview-hero-reed-v075.ko.md)

## Headline change

| Aspect              | v0.50.2 (before)    | v0.75 (this rebuild)            |
|---------------------|---------------------|---------------------------------|
| Art-pixel grid      | **16 × 24**         | **24 × 36**                     |
| Logical render size (at `sprite.scale = 3`) | 48 × 72 px | **72 × 108 px** |
| Anchor              | `{ x: 8, y: 23 }`   | `{ x: 12, y: 35 }` (feet center)|
| Default fps         | 8                   | 6                                |
| Hitbox (dev-owned)  | 30 × 66             | 30 × 66 (UNCHANGED)              |
| Palette entries     | 18                  | 20 (+1 new `#f4c898`, +1 reuse `#5a8a4a`) |
| Frame count         | 31                  | 38                               |

## Why this rebuild

After playtesting v0.50.2 the project owner reported:

> "그리고 이번 버전에서 플레이어 애니메이션도 바꾸면 좋겠어. 그래픽이
> 뭉개져서 프레임도 너무 빨라서 미친듯이 춤추는 모습으로만 나와."
>
> Translation: "I'd also like the player animation changed in this version.
> The graphics look mushed and the frames are too fast, so the character only
> looks like it's dancing wildly."

Two root causes:

1. **"뭉개져서" (mushed):** the 16 × 24 art-pixel grid did not have enough
   resolution to express 12 distinct animation keys (idle / idle_armed / walk
   / walk_armed / jump / jump_armed / sprint / sprint_armed / attack / hurt
   / stumble / death). Frame-to-frame body deltas at that resolution smeared
   into a generic blob silhouette.
2. **"프레임 빠르다" (frames too fast):** the per-anim fps values added in
   v0.50.2 were tuned for the smaller grid. At Reed's actual sprint speed
   (3.5 × 1.4 = 4.9 px/frame physics → 294 px/sec), the 12 fps × 4-frame
   sprint cycle was running ~3 strides/sec. Real running at that ground speed
   is ~2 strides/sec; the over-fast cadence read as "dancing."

This rebuild addresses both by **growing the cells** to 24 × 36 and **slowing
per-anim fps** to land each cycle at a real cadence.

## Animation cadence — v0.75 vs v0.50.2

| Key            | Frames | v0.50.2 fps | v0.75 fps | v0.75 cycle | v0.75 strides/sec |
|----------------|-------:|------------:|----------:|------------:|------------------:|
| `idle`         | 3 (was 2) | 4         | **3**     | 1.00 s      | n/a (breath)      |
| `idle_armed`   | 3        | 4           | **3**     | 1.00 s      | n/a (breath)      |
| `walk`         | 4 (was 3)| 8           | **5**     | 0.80 s      | **~1.25 strides/sec** (calm walk) |
| `walk_armed`   | 4        | 8           | **5**     | 0.80 s      | **~1.25**         |
| `sprint`       | 4        | 12          | **8**     | 0.50 s      | **2.00 strides/sec** (real run)   |
| `sprint_armed` | 4        | 12          | **8**     | 0.50 s      | **2.00**          |
| `jump`         | 2 (was 1)| 8           | **6**     | 0.33 s      | n/a (one-shot)    |
| `jump_armed`   | 2        | 8           | **6**     | 0.33 s      | n/a               |
| `attack`       | 3        | 8           | **6**     | 0.50 s      | n/a (snappy cleave) |
| `hurt`         | 2 (was 1)| 8           | **6**     | 0.33 s      | n/a               |
| `stumble`      | 3        | 8           | **6**     | 0.50 s      | n/a (one-shot)    |
| `death`        | 4        | 8           | **4**     | 1.00 s      | n/a (one-shot)    |

The sprint cadence is the headline: **8 fps × 4 frames = 0.5 s per cycle =
2 strides/sec**, which matches the physics speed (4.9 px/frame × 60 fps =
294 px/sec ≈ 2 paces/sec for a small running boy). The "dancing wildly"
complaint should be gone.

The walk cadence (5 fps × 4 frames = 0.8 s per cycle ≈ 1.25 strides/sec) is
**deliberately slower than v0.50.2's walk** because Reed's walk speed
(unmodified, ~3.5 px/frame physics) is closer to a brisk-but-not-running pace.

## Frame coherence (the "dancing" fix on the silhouette side)

The v0.50.2 walk cycle redrew the head and torso every frame; small subpixel
shifts at 16 × 24 read as a flickering body. This rebuild fixes that by
making **rows 0–22 (head + torso) byte-identical across all four walk
frames**. Only rows 23–35 (legs and feet) and the free-arm cuff cells on
the torso sides change per frame.

- `walk0` — right leg leads (heel-strike forward, contact pose). Free arm
  swings forward on the LEFT (across the body) for natural counter-swing.
- `walk1` — passing pose: both feet under hips, both arms low.
- `walk2` — left leg leads (mirror contact). Free arm swings forward on
  the RIGHT.
- `walk3` — passing pose (mirror of walk1); identical head + torso.

Same principle for sprint (with wider stride and a forward-lean upper body)
and jump (with knees tucked in jump0 and spread in jump1).

## Silhouette intent — at 24 × 36

Reed reads as a small, springy, forward-leaning boy:

- **Hair tuft** (rows 2–5) sits forward of head center — 6 cells wide,
  giving room for a hair-shadow `#7a2e18` band that wasn't possible at
  16 × 24.
- **Face** (rows 5–9) gets dedicated cells for cheekbone, eye-band
  (skin-shadow at cols 10 and 15), chin, and the new skin-highlight
  catchlights at the forehead corners (`#f4c898`).
- **Tunic shoulders** (rows 12–14) get a moss-mid highlight `#5a8a4a` on
  the inner-shoulder corners — same hex shared with the boss + dark-forest,
  so Reed's tunic visibly belongs to the same cloth family as the world
  he's walking through.
- **Cuff-cream chest panel** (rows 11–14) is now 4 cells wide instead of
  3, giving the eye a clear belt-of-light cue.
- **Belt** (row 20) is a 7-pebble row in `#d8c8a8`; readable as
  river-stones strung on a cord, not just a buckle highlight.
- **Pouch** on the right hip (rows 16–19) keeps the same composition as
  v0.50.2 but with one extra dark-pouch cell `#3e4850` for depth.
- **Legs** (rows 23–32) are 2 cells apart at the hip, reading as a
  distinct pair rather than a single fused leg block.
- **Feet** (rows 33–35) get 3 rows instead of 1; the toe shadow band
  at row 35 is the ground-contact line.

## Frames — `idle` / `idle_armed` (3 frames @ 3 fps)

`idle0` neutral → `idle1` breath in (chest catchlight rises 1 cell, cuff
highlight pops on rows 12–13) → `idle2` breath out (returns to mid). The
3-frame `in / hold / out` reads as a calm 1-second breath. `idle_armed`
adds the stone hatchet hanging from the belt at the right hip — handle in
`#c89a68` cloth-wrap visible alongside the pouch.

## Frames — `walk` / `walk_armed` (4 frames @ 5 fps)

Described above. The armed variant carries the hatchet in counter-phase
to the trailing leg:

- `walkArmed0` (right leg leads): hatchet **swings FORWARD** (head visible
  2 cells past the body's right edge).
- `walkArmed1` (passing): hatchet at hip.
- `walkArmed2` (left leg leads): hatchet **swings BACK** on the trailing
  side (head visible at rows 16–17, cols 3–5).
- `walkArmed3` (passing): hatchet at hip; sets up next forward swing.

## Frames — `sprint` / `sprint_armed` (4 frames @ 8 fps)

Distinct from walk in five ways:

1. **Wider stride.** Lead foot reaches 4–5 columns further out; trailing
   foot pushed 3 columns further back.
2. **Knee lifted.** Sprint contact frames have the knee at row 26 instead
   of row 28, with a visible thigh-shin angle.
3. **Forward lean.** The head + torso shift one column to the right on
   sprint frames (built by `lean_forward` in the source generator) — the
   pose registers "covering ground."
4. **Trail wisps.** Behind the trailing foot, behind the body's back:
   - Contact frames (sprint0, sprint2): 4-cell trail — amber inner
     `#f8b860` + pale-violet outer `#a888b0`.
   - Passing frames (sprint1, sprint3): 2-cell trail — single amber +
     single violet.
5. **Hair tuft windblown.** Inherited from the lean-forward shift; the
   hair forelock visibly leads the face.

Armed sprint same body cycle; the hatchet swings on the same rhythm as
armed walk but does NOT swing wide (the head would clip the trailing
arm) — it pivots forward-neutral-back-neutral with the stride.

## Frames — `jump` / `jump_armed` (2 frames @ 6 fps)

- `jump0` (rise): knees tucked under, arms thrown wide. The instant of
  lift-off.
- `jump1` (fall): legs splay forward and back for landing, arms come down
  by sides. Reads "coming down."

Armed: hatchet pinned tight against the torso left side in both frames
(can't clip the lean-forward arm). The renderer's existing jump-state
dispatcher can play either frame for the whole airborne phase, or pick
`jump0` for `vy < 0` and `jump1` for `vy > 0` if the dev-team wants a
distinct fall pose.

## Frames — `attack` (3 frames @ 6 fps)

Same overhand cleave as v0.50.2, redrawn at 24 × 36 for cleaner read:

- `attack0` (windup): hatchet raised overhead-right, body braced (right
  foot planted forward, left foot back). Head tilts forward.
- `attack1` (release): arm and hatchet sweep forward at head height. The
  hatchet head visible at rows 7–9, cols 20–22 — clearly past the body
  silhouette.
- `attack2` (recover): hatchet relaxes back to hip; stance returns to idle.

Note: the released hatchet becomes a projectile entity (dev-team owned);
the visual hatchet in `attack1` is the **swing arc**, not the projectile.

## Frames — `hurt` (2 frames @ 6 fps)

`hurt0` recoil → `hurt1` recover. v0.50.2 had a single frame; the rebuild
gives two so the hit reads as more than a 1-tick flash:

- `hurt0`: arms thrown wide to both sides, eyes squinted (skin-shadow at
  brow-line cols 10–11 and 14–15), legs splayed for balance.
- `hurt1`: arms come down slightly, legs return to idle stance. Bridges
  back to idle without a hard cut.

## Frames — `stumble` (3 frames @ 6 fps)

Shared between unarmed and armed (same as v0.50.2).

- `stumble0` (forward lean): head dropped, free arm flailing forward, lead
  foot mid-air, trailing foot skidding.
- `stumble1` (full fall): body laid horizontal across mid-frame (rows
  14–22), palms catching forward, head pointing right, hips at left.
- `stumble2` (push-up): body partly vertical again, one knee bent under,
  arms catching weight. Bridges back to walk.

## Frames — `death` (4 frames @ 4 fps)

Slower than v0.50.2 (was 8 fps) so the death moment reads as a real beat,
not a quick slump.

- `death0` (knockback rise): arms thrown over head (visible above the
  hairline at rows 0–3), feet leaving ground. The instant of being struck.
- `death1` (airborne tilt): body laid horizontal, head pointing LEFT
  (rows 14–17, cols 2–10), feet pointing RIGHT. Eyes closed.
- `death2` (ground impact): body crashed to the lower rows of the frame
  (rows 28–35). Hair splayed left, feet trailing right.
- `death3` (settle): same composition as death2 with the silhouette
  compacted by 1 cell each side. **Fade-friendly**: the center of mass
  is identical to death2, so an alpha cross-fade reads as stillness, not
  a position pop.

The `dead` key (Phase 1 alias) resolves to `[death3]` — the renderer's
old fallback chain still works for any consumer that asks for `dead`.

## Renderer note for dev-lead

The `pickAnim(state)` rules from v0.50.2 still apply unchanged:

```
unarmed + ground + vx≠0, X held → 'sprint'
unarmed + ground + vx≠0          → 'walk'
unarmed + ground + vx=0          → 'idle'
unarmed + airborne               → 'jump'  (jump0 for rising, jump1 for falling)
armed + ground + vx≠0, X held    → 'sprint_armed'
armed + ground + vx≠0            → 'walk_armed'
armed + ground + vx=0            → 'idle_armed'
armed + airborne                 → 'jump_armed'
attacking (any state, X tap)     → 'attack' (overlay; 3-frame; no movement lock)
stumble (rock-trip / respawn)    → 'stumble' (one-shot; 3-frame)
dying (lives system, on death)   → 'death'   (one-shot; 4-frame)
hurt                             → 'hurt'    (2-frame, plays at 6 fps)
```

**Hitbox is unchanged.** The renderer aligns the sprite by `tf.x + tf.w/2 -
meta.anchor.x * scale`. With `anchor.x = 12` and `tf.w = 30` logical px,
the sprite's center column lands at the same logical x as before; the
extra width (24 - 16 = 8 art-px → 24 logical-px at scale 3) spills 12
logical-px to each side. That's intentional headroom for hair lift, arm
swing, and the death rise — no collision change required.

## Module-size impact

| File              | v0.50.2 | v0.75 rebuild |
|-------------------|--------:|--------------:|
| Frame count       | 31      | 38            |
| Rows per frame    | 24      | 36            |
| Cols per frame    | 16      | 24            |
| Cells per frame   | 384     | 864           |
| Total cell ints   | 11,904  | 32,832        |
| `hero-reed.js` lines | ~525 | ~1,725        |
| Uncompressed JS   | ~25 KB  | ~75 KB        |

The file is ~3× larger but still ships as a single ES module with no build
step. Gzip compresses the high-run-length integer arrays aggressively.

## Palette additions in this rebuild

| Index | Hex          | Role                                      | Status                                |
|------:|--------------|-------------------------------------------|---------------------------------------|
| 18    | `#f4c898`    | skin highlight (forehead/cheek catchlight) | **NEW** — adds to cumulative project palette |
| 19    | `#5a8a4a`    | moss-mid highlight (tunic shoulder)        | REUSE — Phase 3 cairn-mantle moss (boss + dark-forest) |

Cumulative project palette: 91 → **92** distinct hexes. Headroom against
the 120-color budget: 29 → **28**. See
[`palette-phase3.md`](./palette-phase3.md) for the full inventory.

## What was deliberately NOT changed

- Reed's silhouette identity (small forward-leaning boy, hair-tuft-forward,
  moss tunic with cream cuff, river-stone belt, sling pouch on right hip,
  stone hatchet when armed).
- Reed's name (Bramblestep), age-read, color-mood keywords.
- The hitbox (30 × 66 logical px) — dev-team owns this and the rebuild
  keeps it identical so jump/walk/collision tuning carries over.
- Any other sprite, tile, boss, or projectile module in this PR.
- The `dead` Phase 1 key (kept as `[death3]` alias).

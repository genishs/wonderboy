# Preview — Reed v0.50.2 extensions (`hero-reed.js`)

> Reviewer note: this file describes the NEW frames added in v0.50.2 — `sprint`,
> `sprint_armed`, `stumble`, and a refined 4-frame `death`. The Phase 1 frames
> (`idle`, `walk`, `jump`, `hurt`) and the Phase 2 armed states + overhand
> cleave (`idle_armed`, `walk_armed`, `jump_armed`, `attack`) are unchanged and
> live in [`preview-hero-reed.md`](./preview-hero-reed.md) /
> [`preview-hero-reed-armed.md`](./preview-hero-reed-armed.md). ASCII intent
> notes are inside the `.js` file as leading comments per frame.
>
> **한국어 버전:** [`preview-hero-reed-v0502.ko.md`](./preview-hero-reed-v0502.ko.md)

| Field         | Value                                            |
|---------------|--------------------------------------------------|
| Path          | `assets/sprites/hero-reed.js`                    |
| Size          | 16 × 24 px (unchanged)                           |
| Anchor        | `{ x: 8, y: 23 }` (feet center, unchanged)       |
| Default fps   | 8 (unchanged); per-anim overrides per `META.animFps` |
| Palette       | 18 entries (was 16; +2 trail-wisp colors at indices 16–17) |
| New frames    | 15 (sprint × 4 + sprint_armed × 4 + stumble × 3 + death × 4) |

## Why this PR exists

After browser-testing v0.50.1 the user noted three things:

1. The X-held sprint was using the same 4-frame walk cycle, just played faster
   — visually indistinguishable from a fast walk. We needed a real "running"
   silhouette with a wider stride and motion-line trails.
2. The dev team's planned rock-trip flow and respawn-knockback flow had no
   sprite for "Reed loses balance and recovers" — they were going to fall
   back to `hurt`, which reads as too-violent for a small trip.
3. The single-frame `dead0` slump felt under-weighted as the moment
   immediately after losing a life. The lives system wanted a real beat.

The 15 new frames address all three. No body proportions, palette ratios, or
silhouette grammar are changed; this is additive work on top of an established
character.

## Idle decision (kept)

The existing 3-frame `idle` / `idle_armed` breath cycle at 4 fps stays as it
shipped in v0.50.1. The optional "collapse to a static single frame" path was
considered and rejected: the breath cycle is the only animation that conveys
"Reed is alive but waiting" (he doesn't have an idle weapon-twirl or
fidget-loop), and at 4 fps the head-and-cuff bob is small enough that it
doesn't strobe on the eye. Keeping it costs us nothing — the 3 frames already
exist.

## Trail-wisp palette additions

Two new palette entries support the sprint trail:

| Index | Hex          | Role                                            |
|-------|--------------|-------------------------------------------------|
| 16    | `#f8b860`    | amber-underglow wisp — same hex as the Hummerwing thorax underglow, so the trail visually rhymes with the warm-spark-falls-cool kill frame. |
| 17    | `#a888b0`    | pale-violet wisp — cool sibling of `#3a2e4a` (the project-wide violet-shadow ink). Used for the outer/cooler trail cell. |

Both colors are introduced ONLY for the sprint trail; they are not used by any
other animation in `hero-reed.js`. Per the project palette policy, the amber
hex is reused verbatim from the Hummerwing palette (cumulative palette stays
within budget — see [`palette-phase2.md`](./palette-phase2.md) for the v0.50.2
addendum). The pale-violet is a new hex (one new color this PR).

## Frames — `sprint` (4 frames, 12 fps)

The X-held running cycle. Visually distinct from `walk` in three ways:

1. **Wider stride.** Lead-foot pixel reaches one column further forward than
   `walk0`; trailing foot pushed one column further back. The hip-line stays
   the same so the silhouette doesn't bob more than walk — Reed is *covering
   ground*, not *bouncing*.
2. **Knee lift.** On the contact poses (frames 0 and 2) the leading knee is
   one cell higher than `walk0`'s lead knee, and the standing leg's tunic
   shadow (`T` cells) shows underneath where the knee has lifted clear. Reads
   "running form" not "fast walking."
3. **Hair tufted forward.** Reed's forelock (already a feature of his idle
   silhouette) is pushed one extra cell ahead of the head — wind-pressed by
   forward motion.
4. **Trail wisps.** A 1- or 2-pixel motion line trails the rear heel:
   - Frame 0 (contact): 2-cell trail — amber inner + pale-violet outer,
     reading as "warm spark + cool shadow." 4 wisp cells total.
   - Frame 1 (passing-1): single amber cell — peak of stride loses the
     violet outer.
   - Frame 2 (opposite contact): 2-cell trail again, this time mirrored to
     the body's other side because the trailing-foot has reversed.
   - Frame 3 (passing-2): single amber cell on the new trailing side.

   At 12 fps these read as "speed lines" — present long enough to register but
   not so persistent that they look like flame.

The 4-beat cycle (sprint0 → sprint1 → sprint2 → sprint3 → sprint0) at 12 fps
runs through one full sprint stride every ~0.33 s. Compared to `walk`'s
8 fps × 4 frames (= 0.5 s per stride), the sprint reads ~33% faster on screen
even before any horizontal-velocity boost — which is exactly what we want
because the dev team already gives sprint 1.4× walk speed at the physics
layer; the visuals should agree.

## Frames — `sprint_armed` (4 frames, 12 fps)

Same body / leg cycle as `sprint` (mechanically armed and unarmed sprint use
identical motion); the difference is the held hatchet. The hatchet head is
held tight at the hip but **rotates with the stride** instead of swinging
out from the body — armed Reed running can't afford a wide-arc swing because
the head would clip past his stride line.

- **Frame 0** (contact, trailing leg back): hatchet swings FORWARD past the
  hip, head visible 2 cells ahead of the body's right edge (rows 12-14, cols
  12-14). Trail wisps as in `sprint0`.
- **Frame 1** (passing-1): hatchet at neutral hip, head flush against the
  side. Single amber wisp behind.
- **Frame 2** (opposite contact, lead leg forward): hatchet swings BACK,
  head trailing on the back-left side (rows 13-14, cols 1-3). 2-cell trail
  on the new heel side.
- **Frame 3** (passing-2): hatchet swings forward again; single amber wisp
  behind. Sets up the next forward swing on the loop.

Played at 12 fps the held weight bobs once per cycle (head flips
forward-neutral-back-neutral) — readable as a controlled-but-bouncing carry
rather than a wild swing.

## Frames — `stumble` (3 frames, 8 fps)

The shared "rock-trip and respawn-knockback" sequence. Plays regardless of
armed state — design choice (cast brief allowed it as simplest): the moment
is too brief to swap atlases, and the held hatchet would be off-frame
anyway because Reed is doubled forward.

- **`stumble0`** — forward lean. Reed's head has dropped (hairline near row 2)
  and his upper body has pivoted forward by ~30°. Leading foot (right) is
  mid-air, trailing foot (left) still on the ground but skidding. Free arm
  flails forward. The pose registers "I just hit something."
- **`stumble1`** — full forward fall. The most extreme moment: body almost
  horizontal, palms catching forward, head lowered (Reed reads as "almost
  face-planted"). The torso runs across the middle of the frame from row 9
  through row 17 — this is intentionally the lowest-energy moment in the
  cycle, the visual cost of the trip.
- **`stumble2`** — pushing back up. Body regaining vertical, head still bent,
  one knee bent under, one foot back on the ground. Bridges back to walk.

The dev team plays this as a 3-frame one-shot (~24 frames at 8 fps =
~0.4 s). Long enough to read; short enough that the player isn't punished
beyond the small vitality penalty the trip already inflicts.

## Frames — `death` (4 frames, 8 fps)

Replaces the v0.50 single-frame `dead0` slump with a true knockback-and-fall
sequence. The lives system plays this once before respawning Reed at the last
mile-marker.

- **`death0`** — knockback rise. Head back, arms thrown up over the head
  (visible as 4 raised arm-cells above the hairline), feet leaving the ground.
  Hair lifts. The instant of being struck. Body still upright but tilting
  back; reads "thrown."
- **`death1`** — airborne tilt. The full 90° pivot: Reed is laid out
  horizontally across the frame, head pointing left, feet pointing right.
  Eyes closed (no visible iris/pupil cells — head reads as a smooth hair-and-
  skin profile). This is the apex of the knockback arc; Reed is unconscious
  in the air.
- **`death2`** — ground impact. Reed crashed to the ground, body flat on its
  side. Hair splayed left, feet trailing right. The body sits on the lower
  rows (15-23) of the frame — the ground-line. One arm twisted under the
  torso (cells absent on the body's underside).
- **`death3`** — settle. Same composition as `death2` with the silhouette
  compacted by 1 cell on each side (small twitches removed). Holds before the
  lives system advances. **Fade-friendly:** the center-of-mass is identical
  to frame 2, so an alpha cross-fade reads as stillness rather than a
  position pop.

`META.animFps.death = 8` runs the 4-frame cycle in ~0.5 s; the dev team can
hold on `death3` for additional time before the respawn fade if desired.

### Backward-compat: `dead` key alias

The existing `dead` key in `FRAMES` now resolves to `[death3]` (the settle
frame). Renderer's existing fallback chain — any consumer that asks for
`dead` — still gets a valid 1-frame matrix without changing their code path.
The full 4-frame sequence is opt-in under the new `death` key.

## Renderer note for dev-lead

Recommended `pickAnim(state)` extension:

```
unarmed + ground + vx≠0, X held → 'sprint'
unarmed + ground + vx≠0          → 'walk'
unarmed + ground + vx=0          → 'idle'
unarmed + airborne               → 'jump'
armed + ground + vx≠0, X held   → 'sprint_armed'
armed + ground + vx≠0           → 'walk_armed'
armed + ground + vx=0           → 'idle_armed'
armed + airborne                → 'jump_armed'
attacking (any state, X tap)    → 'attack' (overlay; 3-frame; no movement lock)
stumble  (rock-trip OR respawn-knockback) → 'stumble' (one-shot; 3-frame)
dying    (lives system, on death)         → 'death'   (one-shot; 4-frame)
hurt     (Phase 1 — unchanged)            → 'hurt'
```

If a renderer asks for `dead` and falls through, it still gets the settle
frame (the v0.50 behavior is preserved by the alias above).

## Module-size impact

| Before v0.50.2 | After v0.50.2 |
|----------------|---------------|
| 16 frames × 24 rows = 384 row-arrays | 31 frames × 24 rows = 744 row-arrays |

Roughly doubles the hero sprite module's array-literal count. Still well
within reasonable file size for a hero (the file lands around ~25 KB
uncompressed JS, gzip-friendly given the high run-length in palette
indices). No build-tooling impact (we still ship raw ES modules).

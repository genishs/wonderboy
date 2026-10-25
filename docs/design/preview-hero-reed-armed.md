# Preview — Reed armed states + overhand cleave (`hero-reed.js` extension)

> Reviewer note: this file describes each NEW frame added in Phase 2 (v0.50) plus
> the replaced `attack` overhand cleave. The Phase 1 frames (`idle`, `walk`,
> `jump`, `hurt`, `dead`) are unchanged and described in
> [`preview-hero-reed.md`](./preview-hero-reed.md). ASCII silhouettes are inside
> the `.js` file as leading comments.
>
> **한국어 버전:** [`preview-hero-reed-armed.ko.md`](./preview-hero-reed-armed.ko.md)

| Field         | Value                              |
|---------------|------------------------------------|
| Path          | `assets/sprites/hero-reed.js`      |
| Size          | 16 × 24 px (unchanged)             |
| Anchor        | `{ x: 8, y: 23 }` (feet center)    |
| FPS           | 8                                   |
| Palette       | 16 entries (was 13 in Phase 1; +3 for hatchet head/grip + grip-shadow) |
| Approach      | Full new matrices per frame (NOT composite). Body cells share Phase 1 silhouette where possible; the hatchet is painted directly on each new frame so the renderer can flash a single key without an overlay layer. |

## Authoring approach

The cast brief (§2.3) allowed Design to share underlying body frames between
unarmed and armed and only swap the held-tool layer. We chose **full new
matrices per armed frame** (12 new frames total). Reasoning:

1. The renderer pickAnim helper already swaps anims by armed flag — it does not
   need a composite layer, so adding one would only complicate the cache.
2. With full matrices we can fine-tune the hatchet position frame-by-frame (e.g.
   the hatchet swings forward 1 cell on `walk_armed[0]` and back on
   `walk_armed[2]`), which a pure overlay couldn't do without authoring the
   overlay set anyway.
3. Module size impact is small: 12 new 24-row frames = 288 array literals, well
   within reasonable file size for a hero sprite.

## Frames — replaced `attack` (overhand cleave, 3 frames)

Replaces Phase 1's single side-arm flick. Per cast brief §2.2:

- **`attack0`** — **windup**. The hatchet is held above and behind the head:
  head/handle stack runs from row 0 (`13 14 14 13` — head wedge) up the right-
  side column 12-15 down through `15 1` (cloth-wrap into ink). Body shifts a
  hair backward; the trailing-foot heel pulled back ~1 cell. Reed's head tilts
  forward (the hairline drops by 1 cell), reading "weight loaded over the
  shoulder."
- **`attack1`** — **release**. Arm fully extended at head height. The hatchet is
  airborne — only a faint trailing handle cell (`13 13 14 15`) remains as a
  motion line on row 9 columns 12-15. Body opens forward; lead foot ~1 cell
  forward. The pose registers "throw weight committed."
- **`attack2`** — **recover**. Arm relaxes back along the body. The hatchet is
  gone (it's a projectile entity now). Stance returns to idle — feet planted,
  tunic upright. This frame is the bridge back to `idle_armed` /
  `walk_armed` after the throw. The throw still does NOT lock movement (cast
  §2.2); Dev plays this 3-frame sequence as an overlay over whatever the body
  is currently doing.

## Frames — `idle_armed` (3 frames)

Same body as Phase 1's `idle` but the hatchet rests at the hip in the throwing
hand. The hatchet column appears at columns 11-14 of row 14 (head) + row 15
(more head) + row 16 (handle dropping into ink).

- **`idleArmed0`** — neutral stand + hatchet at hip. Body identical to Phase 1
  `idle0`. Hatchet head sits beside the hip pouch as 2 stone cells; cloth-wrap
  binds it to the (implied, off-frame) hand.
- **`idleArmed1`** — breath rise + hatchet rests at hip. Body identical to Phase 1
  `idle1` (head/hairline up 1 cell). The hatchet position is unchanged (it's
  hanging from the hand, not breathing) — visually it stays anchored to the hip
  while the torso bobs.
- **`idleArmed2`** — exhale + hatchet bobs forward. Same body as `idleArmed0`
  but the hatchet has migrated one cell forward (the carry-hand swung
  infinitesimally on the exhale). Played at 8 fps the three frames cycle as
  breath-out / breath-in / breath-out with the hatchet bobbing once per cycle.

## Frames — `walk_armed` (4 frames)

Same legs as Phase 1's `walk0/1/2`, plus a 4th passing-pose mirror frame so the
counter-phase hatchet swing has 4 distinct positions per cycle.

- **`walkArmed0`** — **contact pose**, trailing leg back. The hatchet swings
  FORWARD past the hip (counter-phase to the trailing leg). Hatchet head visible
  2 cells ahead of the body's right side, columns 12-14 of rows 12-14. Reads
  "weight in left hand, swinging right" (mirror via renderer for left-facing
  travel).
- **`walkArmed1`** — **passing pose**, both feet under hips. Hatchet at neutral
  hip — the counter-phase cycle is at its midpoint. Hatchet head sits flush
  against the side, like in `idleArmed0`.
- **`walkArmed2`** — **opposite contact**, lead leg forward. Hatchet swings BACK
  behind the hip (now lagging behind the body). Two hatchet head cells appear
  *behind* Reed at columns 1-3 of rows 13-15 — a clear silhouette inversion from
  walk0.
- **`walkArmed3`** — **return passing**, the start of the next half-cycle. Body
  identical to walkArmed1 but the hatchet is one cell forward of neutral —
  setting up the next forward swing. Played 0→1→2→3→0 at 8 fps the cycle reads
  as a four-beat carry-walk.

## Frames — `jump_armed` (2 frames)

Same body as Phase 1's `jump0` (the single combined rise/fall frame). Two
hatchet positions so Dev can flash [0,1] for rising and [1,0] for falling.

- **`jumpArmed0`** — **rising**. Body identical to Phase 1 `jump0`. Hatchet
  pinned tight to the torso along the right flank — head cell at row 12
  column 12, handle running down through rows 13-16. Visually compact: airborne
  Reed reads as a closed silhouette with a held weight.
- **`jumpArmed1`** — **falling**. Body identical. Hatchet position has shifted
  slightly: head down at row 13, handle through rows 14-17 — the held weight
  has settled lower in the falling-arc pose. Subtle, but it lets the renderer
  alternate without needing two distinct body frames.

## Renderer note for dev-lead

The renderer's `pickAnim(state)` helper should map:

```
unarmed + ground + vx≠0 → 'walk'
unarmed + ground + vx=0 → 'idle'
unarmed + airborne      → 'jump'
armed + ground + vx≠0   → 'walk_armed'
armed + ground + vx=0   → 'idle_armed'
armed + airborne        → 'jump_armed'
attacking (any state)   → 'attack' (overlay; 3-frame sequence; does NOT lock movement)
hurt                    → 'hurt'  (Phase 1 — unchanged; 1-hit-kill so brief flash)
dead                    → 'dead'  (Phase 1 — unchanged)
```

The `hurt` / `dead` frames intentionally do NOT have armed variants — death
removes the hatchet (cast §2.5) and `hurt` is too brief to require an armed
overlay in v0.50.

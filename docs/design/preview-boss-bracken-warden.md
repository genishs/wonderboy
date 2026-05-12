# Preview — `assets/sprites/boss-bracken-warden.js`

> **한국어 버전:** [`preview-boss-bracken-warden.ko.md`](./preview-boss-bracken-warden.ko.md)

| Field        | Value                                                 |
|--------------|-------------------------------------------------------|
| Path         | `assets/sprites/boss-bracken-warden.js`               |
| Size         | 40 × 48 art-pixels                                    |
| Anchor       | `{ x: 20, y: 47 }` (bottom-center, on the floor line) |
| Default FPS  | 6 (per-animation overrides via `META.animFps`)        |
| Palette      | 18 entries                                            |
| Frame total  | 17 frames across 6 animations                         |

The Bracken Warden is the Area 1 boss — a kneeling moss-and-bracken colossus
at the back wall of the boss arena, a **moonlit dark-forest clearing** at the
end of Stage 4 (Round 4-4 cols 41-42). Spec source:
`docs/briefs/phase3-boss-cast.md`. The sprite ships **all 6 FSM states**
called for in §3 of the boss brief: `idle`, `windup`, `attack`, `recover`,
`hurt`, `dead`.

Per the v0.75 theme remap, the boss arena is now a dark-forest clearing
under the canopy rather than the ruin chamber the previous PR iteration
contemplated. **The sprite itself is unchanged** — a moss-covered stone-
and-bracken guardian reads as well in a dark forest as it did in a ruin
arena (the moss + bracken + dim warm-stone joinery now read as "an old
stone shrine the forest has reclaimed" instead of "a piece of the ruin
floor stood up"). Only the surrounding arena context shifted in the
preview docs; the silhouette, animations, and palette are byte-for-byte
identical to the previous PR.

## Final dimensions (decision recorded)

The boss brief §10 suggested 144 × 192 art-pixels (3 tiles × 4 tiles when
risen). The user prompt explicitly offered "32 × 40 px or 40 × 48 px" as
the design-lead's choice; the brief's §10 frame-size note also permits the
design-lead to "ship the Warden as a multi-part sprite to reduce per-frame
data — implementation detail, not story-lead's call."

**We ship at 40 × 48 art-pixels.** Rationale:
- 144 × 192 would be ~27,648 cells per frame × 17 frames ≈ 470K cells of
  hand-authored palette indices. Tractable but very expensive to maintain.
- 40 × 48 is ~1,920 cells per frame × 17 = ~32K cells — comparable to a
  large Phase 2 sprite (Hero Reed armed is 18 × 24 × ~30 frames ≈ 13K).
- Dev-lead's `SpriteCache` already renders Reed-the-sprite at a non-1:1
  scale (Reed is 16 × 24 art and renders at ~36 × 48 canvas ≈ 2.25× scale).
  The Warden will render at ~3× scale → 120 × 144 canvas px ≈ 2.5 × 3
  tiles, close enough to the brief's "3 tiles × 4 tiles risen" intent
  that the clearing reads correctly. The Warden visibly dominates the
  clearing's right wall (col 9 to col 11 area of the arena viewport).
- The brief's silhouette intent ("kneeling colossus" / "head bowed" /
  "moss-covered cairn shape") reads cleanly at 40 × 48 — we've designed
  the silhouette so each major silhouette element (head, torso, knee,
  forearm, sigil slit) occupies an area large enough to be unambiguous.
  The shape continues to read in a dark-forest clearing: against the
  moonlit canopy floor the moss-and-stone silhouette stands out by
  contrast (warm-grey joinery + warm sigil amber pop against the cool
  canopy mid-tones).

## Anchor

`{ x: 20, y: 47 }` — bottom-center, on the floor line. The Warden's feet
are always on the floor row regardless of pose (kneeling at rest, standing
in windup, slumped in death). All pose variation composes the silhouette
*above* the anchor. Dev-lead places the sprite at the floor-row in the
clearing (Round 4-4 col 41-42, floor row 10) and the renderer aligns to
anchor automatically.

## Sigil flare visual approach (decision recorded)

The chest sigil is a vertical 1-cell-wide × 4-cell-tall slit in the
Warden's torso center, framed by cuff-cream rim cells. The sigil's **color
index shifts across states** to render the flare without changing the
silhouette:

| State    | Sigil interior color                       | Eye-slit color           |
|----------|--------------------------------------------|--------------------------|
| `idle`   | pillar-shadow-violet (`#684e6e`) — dim     | dark (ink)               |
| `windup` | dim → stone-joinery warm → amber-mid → peak-bright across 4 frames | dark → amber-mid → pale-gold |
| `attack` | core-bright (`#fff2c0`, **brightest in project**) at frame 0; dims one notch on the impact frame (peak); mid at slump | pale-gold at peak; mid afterward |
| `recover`| mid → mid → dim → dim across 4 frames      | mid → mid → dark → dark  |
| `hurt`   | core-bright on flash frame; dim on hold     | peak on flash; dark on hold |
| `dead`   | core-bright at rupture frame; collapses to pillar-violet at settled | peak then dark |

At peak/core levels, an outer halo of dawn-amber surrounds the slit rim
(cells immediately outside the cuff-cream rim become amber-mid). This
gives the player two clear visual cues for "the Warden is winding up":
sigil interior brightens AND a halo appears.

## Animations

### `idle` — 3 frames, 3 fps (slow breath)

The kneeling pose: head bowed forward, both forearms resting on the bent
leading knee, body hunched. The Warden is sleeping.

- **`idle0`** — neutral. Head fully bowed, eye-slit dark, sigil dim. Outer-
  moss curls drape over the bowed crown of the head and the shoulder caps.
  Stone joinery is visible at the shoulders (small carved-stone-pale
  rectangles), at the leading knee crown, and at the folded rear knee.
  Hip-fronds of bracken hang between the legs.
- **`idle1`** — breath rise. The head shifts up by one cell (subtle, but
  the only Warden motion in `idle`); the sigil flickers one notch warmer
  (stone-joinery warm instead of pillar-violet) before sinking back. Reads
  as "a slow breath under moss."
- **`idle2`** — back to neutral. Same as `idle0`. Cycle loop.

### `windup` — 4 frames, 12 fps (~45-frame telegraph)

The Warden raises its head, opens its chest, lifts one arm overhead. The
chest sigil flares from dim to peak-bright over the four frames.

- **`windup0`** — head lifts; eye-slit kindles to dawn-amber mid. Sigil
  warms one notch (stone-joinery warm). Arms still resting on knee.
- **`windup1`** — chest opens. Sigil flares to dawn-amber mid; an outer
  halo begins to form. Arms still resting; head fully up.
- **`windup2`** — right arm begins to rise (out of the lap, angled up
  from the right shoulder). Sigil to pale-gold peak; eye-slit to pale-
  gold. Head at maximum lift.
- **`windup3`** — arm at apex (vertical column above the right shoulder).
  Sigil at **core-bright** (`#fff2c0`, the brightest amber in the entire
  project). Eye-slit at pale-gold. Outer halo fully surrounds the sigil.
  This frame is the player's "throw a hatchet NOW or jump" cue. Bracken
  tufts curl from the wrist of the raised arm.

### `attack` — 3 frames, 16 fps (~12-frame swing, impact on frame 1)

The slam. The raised arm comes down hard onto the ground; on the contact
frame, a moss-pulse shockwave entity spawns at the Warden's feet (the
shockwave is `assets/sprites/projectile-moss-pulse.js`).

- **`attack0`** — arm mid-swing. The right arm is drawn as a diagonal band
  of joinery cells from the shoulder (rows 18, cols 27-33) down toward the
  floor (rows 36, cols 10-16). Sigil still core-bright; body twisting
  forward; head at maximum lift.
- **`attack1`** — **arm landing (impact frame).** The raised arm has come
  down and is now lying extended on the ground in front of the Warden
  (rows 33-38, cols 0-14). Moss-particle burst (bracken-frond deep and
  cairn-mantle moss specks) erupts from the impact point at cols 0-5.
  Sigil dims one notch (pale-gold peak instead of core-bright) as the
  wave separates away. The shockwave entity spawns at the Warden's feet
  on this frame (per boss brief §4 spawning sequence; dev-lead handles
  the spawn).
- **`attack2`** — arm flat on ground; shockwave has separated and is now
  a separate entity. Sigil at amber-mid. Eye-slit at amber-mid. Head
  comes down one cell as the body re-settles.

### `recover` — 4 frames, 3 fps (~90-frame vulnerability window)

The arm stays slumped against the floor; the sigil fades from mid-bright
to dim over the entire `recover` window. **The Warden is most vulnerable
during `recover`** — the chest sigil is the hatchet hitbox, and it stays
visibly exposed for the player to read and aim at.

- **`recover0`** — arm slumped on ground (lying flat in front of the
  Warden). Sigil at amber-mid; eye-slit at amber-mid. Head down to
  rise-level 4 (not fully bowed; the body is sitting upright but settling).
- **`recover1`** — torso eases back toward kneel pose. Sigil still at
  amber-mid (the player's main hatchet window). Head drops another cell.
- **`recover2`** — arm lifts off ground. Sigil dims to stone-joinery warm
  (still visible). Eye-slit darkens.
- **`recover3`** — Warden settles back to kneel. Sigil at minimum bright
  (stone-joinery warm). Arms returning to resting position on the knee.
  Head almost fully bowed. Next state: re-enter `idle`.

### `hurt` — 2 frames, 16 fps (~10-frame stagger)

A brief stagger when a hatchet hits the chest sigil. The Warden's HP
decrements by 1; the current-state timer pauses for `hurtFrames` (~10
frames per boss brief §11.1).

- **`hurt0`** — **all-lighter palette flash.** Every dark-tier color in
  the Warden's silhouette is bumped up one brightness notch: ink (`#3a2e4a`)
  → pillar-shadow-violet (`#684e6e`); under-bracken (`#5a4a6e`) → pillar-
  shadow-violet; joinery shadow → joinery base; moss-dark → moss-base;
  bracken-deep → cairn-mantle moss; river-stone-grey → river-stone-
  highlight. This produces the v0.50 Mossplodder hit-flash effect — a
  single bright frame that reads as "ouch." Sigil at core-bright.
- **`hurt1`** — hold prior state's last frame; sigil faded to stone-joinery
  warm. Eye-slit dark. The 9 hold-frames in the 10-frame hurt window all
  render this single matrix.

### `dead` — 5 frames, 5 fps (~60-frame collapse)

The Warden's final beat. Plays through after the 6th hatchet hit lands; the
death animation precedes the 60-frame celebratory pause + fade-to-black +
Area Cleared overlay sequence (boss brief §12).

- **`dead0`** — **sigil ruptures.** The Warden is still upright; the sigil
  is at core-bright with sparks erupting around the chest (cells at rows
  16-18, cols 16-23, dawn-amber and pale-gold). Eye-slit at peak. The
  player's "I did it" frame.
- **`dead1`** — body tilts backward. Sigil at peak; eye-slit at pale-gold.
  Violet shadow added along the body's lower-left side as the silhouette
  shifts backward off-balance.
- **`dead2`** — collapse begins. The torso falls back — a compressed
  horizontal body now occupying rows 22-30 instead of the upright 14-27.
  The head has turned upward (small head block at rows 18-22, cols 26-32,
  on the right side as the Warden tipped over). Sigil at amber-mid;
  eye-slit faint amber.
- **`dead3`** — Warden flat against the rear wall. Body is a long low
  block at rows 26-34. Bracken fronds splay outward at cols 6, 12, 19,
  25, 32. Sigil reduced to dim pillar-shadow-violet. Head off to the
  side at rows 20-25.
- **`dead4`** — **settled.** Moss layer thickens visibly over the
  silhouette (heavy moss-dark patches at multiple positions across the
  body). Sigil dark (pillar-shadow-violet — sleeping, not glowing). No
  head visible; the moss has covered it. This is the post-fight
  silhouette — the body remains visible until the fade-to-black per
  boss brief §3 "the Warden does not despawn during the death anim;
  the body remains visible until the fade-to-black."

## Palette overlap with earlier phases

11 of the 18 hex entries are reused verbatim from Phases 1, 2, and the
Phase 3 stage tilesets. Per `palette-phase3.md`:

- Phase 1 + 2 universal ink: `#3a2e4a` (silhouette outline; ALL Warden
  silhouette pixels reuse this hex — no boss-specific ink).
- Phase 1 + 2 shared: dawn-amber (`#e8a040`), pale-gold (`#f8d878`),
  cuff-cream (`#e8d4a0`), moss-green base (`#4a7c3a`), moss-green dark
  (`#2e5028`), transparent.
- Phase 2 shared (from `assets/tiles/area1.js`): river-stone-grey
  (`#7a8088`), river-stone highlight (`#a8b0b8`), velvet under-flame
  (`#5a4a6e` — under-bracken shadow, carried over from Phase 2 fire-
  shadow by deliberate consistency).
- Phase 3 shared (from `area1-stage4-darkforest.js`): canopy-shadow-violet
  (`#684e6e`), dry-bark-pale (`#8a8478`), tree-bark-shadow (`#5a5448`),
  moonlit bark crest (`#a89c80`). The Warden visibly shares material with
  the dark-forest floor and trunks — re-roled hexes from the previous PR's
  ruin-floor build (the values are the same; their narrative role moved
  from "carved stone in a ruin chamber" to "weathered bark + violet
  undercut in a moonlit clearing"). The brief's "made of the same material
  as the floor and pillars, just animated" still holds — the Warden looks
  like a piece of the clearing that stood up.

The remaining 4 hexes are new to the boss + Phase 3:
- `#a8744a` (stone-joinery warm — carved warm-grey, sun-touched joinery)
- `#3e6a3a` (bracken-frond deep)
- `#5a8a4a` (cairn-mantle moss — outer moss silhouette)
- `#fff2c0` (sigil core-bright — the brightest amber in the entire
  project, used SOLELY for the sigil-core during `windup3` / `attack0`
  / `hurt0` flash / `dead0` rupture)

## Forward-only — what's NOT here

Per boss brief §3 the Warden has no `walk`, no `turn`, no `idle_armed`
analog. The Warden is fixed-position; it does not chase Reed. The 6
animations + 17 frames shipped here cover every state in the FSM.

The brief allowed design-lead's discretion on adding *more* frames per
state ("Design may add more frames if it preserves the cue read; do not
add fewer"). We ship exactly the brief's minimums per state — the
silhouette communicates the cue clearly at the minimum frame count and
extra frames would inflate module size without playtest-justified gain.

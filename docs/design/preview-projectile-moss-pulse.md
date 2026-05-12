# Preview — `assets/sprites/projectile-moss-pulse.js`

> **한국어 버전:** [`preview-projectile-moss-pulse.ko.md`](./preview-projectile-moss-pulse.ko.md)

| Field        | Value                                                |
|--------------|------------------------------------------------------|
| Path         | `assets/sprites/projectile-moss-pulse.js`            |
| Size         | 24 × 16 art-pixels                                   |
| Anchor       | `{ x: 12, y: 15 }` (bottom-center, on the floor line)|
| FPS          | 8                                                    |
| Palette      | 9 entries                                            |
| Frame total  | 3 frames in 1 animation (`travel`)                   |

The moss-pulse is the Bracken Warden's primary attack: a floor-hugging
shockwave that spawns at the Warden's feet on the impact frame of `attack`
(per boss brief §4 spawning sequence), travels LEFT at -3.5 px/frame
toward Reed, and despawns on the arena's left wall or on hatchet contact
(mutual-despawn). See `docs/briefs/phase3-boss-cast.md` §4 for the full
attack pattern.

## Final dimensions and direction

**24 × 16 art-pixels** per the user prompt suggestion ("1 tile wide, half-
tile tall"). At TILE = 48 the moss-pulse renders at ~48 × 32 canvas px ≈
1 tile × half-tile. The sprite is drawn LEFT-FACING by default — the
leading wavefront is on the LEFT side of the matrix, the trailing edge
on the RIGHT. **The renderer does not mirror this sprite** because the
moss-pulse always travels left in the arena (the Warden faces left and
its arena is at the right side of the screen; the wave moves toward
Reed who's on the left).

## Anchor

`{ x: 12, y: 15 }` — bottom-center, on the floor line. The wave is
floor-hugging; dev-lead places the projectile entity at the arena floor
row, and the renderer aligns the bottom-center of the sprite to that
row. The waveform composes upward from the floor.

## Animation

### `travel` — 3 frames, 8 fps (loops while wave is active)

The wave reads as a rolling moss-light wavefront: a tall, leading-edge
glow on the left side, an inner amber band at the wave's base, and a
trailing ground-blur that fades through velvet under-flame into pillar-
shadow-violet on the right side. Crest particles (moss-green-dark and
bracken-frond-deep specks) are flung upward from the leading edge each
frame at slightly different positions, giving the wave its rolling
visual texture.

- **`travel0`** — leading edge tall (rows 2-12, cols 1-5); crest particles
  at cols 4-15. Inner amber band at rows 7-12 with a pale-gold core
  cluster centered around cols 3-6. Trail fades over cols 13-22 from
  velvet under-flame (rows 13) through pillar-shadow-violet (row 14)
  into transparency at the right edge.
- **`travel1`** — leading edge a touch shorter; crest particles re-flung
  at different positions (col 5, 11, 12). Inner amber band cells shift
  slightly. Trail picks up a violet ribbon variation at col 9-13.
- **`travel2`** — leading edge re-builds height; inner spark brightens to
  pale-gold at the base (rows 8-12). New particles flung from the trailing
  curl (cols 8, 11, 13). Looped F0→F1→F2→F0 at 8 fps reads as a
  continuous rolling wave traveling left across the arena floor.

## Visual identity

Per boss brief §4 "Wave visuals":
- **Leading face** — a short upward burst of moss-and-stone particles
  (1-tile-tall, on the left side of the sprite). The leading wavefront is
  the brightest, most-articulated edge — the wave's "face" that Reed sees
  approaching.
- **Inner glow** — dawn-amber at the wave's base, pale-gold at the
  brightest spark point. This is the warmth of the Warden's chest sigil
  traveling along the floor. Visually rhymes with the Warden's sigil
  flare during `attack`.
- **Trailing edge** — velvet under-flame and pillar-shadow-violet fading
  over ~10 cells behind the leading face. The trail reads as "smoke that
  fades into the floor" — NO pure black per world.md.

## Decision recorded — no separate `despawn` animation

The boss brief §10 asset table mentions a 2-frame `despawn` animation
slot. **Not shipped in this revision.** Reasoning: the brief §4 prose
says only "wave despawns on contact" with no explicit visual; the cleanest
implementation is for dev-lead to fade-alpha the last `travel` frame for
one render-step at mutual-despawn or left-wall contact, matching the
v0.50 hatchet-despawn handling (hatchet has no `despawn` anim either —
it just stops rendering). If playtest reveals the despawn moment is
visually unclear, design-lead can add a 1-2 frame `despawn` cluster in a
follow-up PR; the FRAMES export is a plain object so the addition is
non-breaking.

## Palette overlap with earlier phases

8 of the 9 hex entries are reused verbatim from Phases 1, 2, and Phase 3:

- Phase 1 + 2 universal: violet ink (`#3a2e4a`), transparent.
- Phase 1 + 2 shared: dawn-amber (`#e8a040`), pale-gold (`#f8d878`),
  moss-green base (`#4a7c3a`), moss-green dark (`#2e5028`), velvet
  under-flame (`#5a4a6e`).
- Phase 3 shared (from `area1-stage4-ruins.js`): pillar-shadow-violet
  (`#684e6e`) — the deepest trail tail.

The one **new Phase 3 hex** introduced by this sprite is `#a4d098`
(moss-pulse leading-edge) — a pale green-gold that gives the wavefront
its distinctive "moss-light" glow. It is the only entry in the moss-pulse
palette without a Phase 1/2 ancestor.

## Cross-sprite consistency notes

The wave's amber base + violet trail mirrors the **warm-spark-falls-cool**
chord called out in the Phase 2 cast brief — when the player sees warmth
fading into violet, they are looking at a Warden-spawned entity (boss
sigil, sigil-flare halo, moss-pulse wave-base). The moss-pulse extends
this chord with one new green hex for the wavefront identity.

The wave's silhouette ink (`#3a2e4a`) matches the Warden's silhouette ink
and the universal Phase 1/2 ink: when the moss-pulse and the Warden
share-screen, the player reads them as one cohesive event-pair.

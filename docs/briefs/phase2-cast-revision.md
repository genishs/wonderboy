# Phase 2 — Cast revision (v0.50)

> **Authoring agent:** story-lead
> **Consumers:** design-lead, dev-lead
> **Reviewer:** release-master
> **Companion docs:** `docs/briefs/phase2-areas.md`, `docs/briefs/phase1-cast.md` (closed), `docs/story/world.md`
> **한국어 버전:** [phase2-cast-revision.ko.md](./phase2-cast-revision.ko.md)

This brief supersedes Phase 1's combat cast for v0.50. Reed Bramblestep is unchanged
in identity and silhouette; what shifts is **how he gets armed each round** and **who
walks the world he's crossing**. Phase 1's stationary-and-airborne archetypes are
retired from active gameplay (§10); v0.50 is populated by **two simpler forward-only
enemies** plus environment objects (egg, hatchet, rock, fire, mile-marker, cairn).

> **Tribute, not a port.** Every name and silhouette here is original. The two new
> enemies evoke universal "ground crawler" and "low flier" reads; their names,
> palettes, and animation cues are invented for this project.

---

## 1. What changed since Phase 1

| Aspect                | Phase 1 (v0.25.x)                              | Phase 2 (v0.50)                                          |
|-----------------------|------------------------------------------------|----------------------------------------------------------|
| Hero weapon at spawn  | Always armed (stoneflake)                      | **Unarmed.** Picks up a **stone hatchet** mid-round from a breakable **dawn-husk** (egg) |
| Hero projectile       | Stoneflake — skipping arc, 1 bounce, 2 cap     | **Stone hatchet** — overhand parabolic arc, no bounce, 2 cap |
| Active enemies        | Crawlspine, Glassmoth, Bristlecone Sapling     | **Mossplodder** (crawler), **Hummerwing** (flier). Phase 1 trio retired but reserved (§10) |
| Enemy AI              | Edge-turn, sine-drift+swoop, timed volley      | **Forward-only.** No turn, no swoop, no projectiles      |
| Static obstacles      | None                                            | **Rocks** (block, no damage), **Fire** (1-hit-kill)      |
| Stage flow            | Single 32×12 flat test stage                   | Multi-screen scrolling rounds (`phase2-areas.md`)        |
| Round end             | n/a                                            | **Mile-marker** (rounds 1–3), **boundary cairn** (round 4) |
| Hero life-line        | Vitality, 1-hit-kill, no iframes               | **Unchanged.**                                           |
| Controls              | Z = jump, X = attack (Space alt)               | **Unchanged.**                                           |

**Two design intents drive this revision:** (1) the stage should feel like a
journey, not an arena — forward-only enemies + slope terrain make the player read
the ground as something they're crossing; (2) earning the weapon should feel like
a small reward inside each round — spawning unarmed and breaking an egg ~one screen
in turns the first screen into careful-walking and the rest into action.

---

## 2. Hero — Reed Bramblestep (revised)

Identity, silhouette, color-mood, walk/jump/idle/dead animations, and movement FSM
**unchanged from Phase 1 §2**. This section adds the **armed/unarmed** state and a
revised throw pose.

### 2.1 Armed vs. unarmed states

- **Unarmed Reed** — both hands free. Spawn pose at the start of every round.
  Silhouette reads as *empty-handed*. Vulnerable but not crippled — can jump, dodge,
  just not kill.
- **Armed Reed** — stone hatchet held low and slightly behind in the throwing hand.
  Hatchet rests at the hip in `idle`, swings counter-phase to the trailing leg in
  `walk`, pinned tight to the torso during `jump_rising`/`jump_falling`. Read:
  *carrying weight in one hand*.

Armed state is acquired exactly once per round when Reed contacts the egg (§5). No
intermediate "picking up" pose — the egg cracks open in a quick frame burst and
Reed walks out already armed.

### 2.2 Throw pose — overhand cleave

Phase 1's `attack` was a side-arm pebble flick. Phase 2's hatchet throw is a more
decisive **overhand cleave**. 3 overlay frames:

1. **Windup** — hatchet up over the shoulder, weight back, head tilted forward.
2. **Release** — arm fully extended at head height, hatchet just leaving the hand.
3. **Recover** — arm relaxes back along the body.

Throw still does NOT lock movement. Walk-throw and jump-throw both still work.

### 2.3 Animation cues — additions only

| State          | Frames | What changes vs. unarmed                                                    |
|----------------|-------:|-----------------------------------------------------------------------------|
| `idle_armed`   |      3 | Same breath cycle; hatchet held at hip in all 3 frames.                     |
| `walk_armed`   |      4 | Same step cycle; hatchet swings counter-phase to the trailing leg.          |
| `jump_armed`   |      2 | Same as `jump_rising/falling`; hatchet pinned tight to torso.               |
| `attack`       |      3 | Replaces Phase 1's side-arm. See §2.2.                                      |

Design may share underlying body frames between unarmed/armed and only swap the
held-tool layer.

### 2.4 Hit reaction — unchanged

1-hit-kill from v0.25.2 still applies. No iframes, no knockback, no hurt overlay.
Death FSM unchanged.

### 2.5 Death-while-armed

When Reed dies armed, the hatchet does **not** persist into respawn — game over
is terminal in v0.50. (If continue/restart ships later: respawn unarmed at round
start.) Flagged in §11 Q3.

---

## 3. Crawler-type enemy — **Mossplodder**

A waist-high lump of overgrown shell, low to the ground, perpetually rolling
forward. Originally something with legs, now mostly *moss*. The **floor of the
threat lattice**: cannot turn, cannot jump, walks off ledges into pits.

### 3.1 Silhouette intent

Roughly one tile wide and three-quarter-tile tall — slightly larger than Phase 1's
Crawlspine, deliberately so, because the Mossplodder is the *terrain-reading
anchor* for the eye. From distance: a soft mound with slow undulation. Up close:
a lobed shell with moss strands trailing back from the leading edge, a pale belly
seam at ground level. **No eyes.** Threat read comes from forward motion only —
never "watching." Asymmetric shell (higher dome leading, longer slope trailing)
so even idle frames read "in motion."

### 3.2 Movement FSM

States: `walk`, `dead`. **No `turn`. No `hurt`.**

- **No edge detection.** Walks off ledges; despawn ~2 tiles below camera bottom.
- **No wall-turn.** Hitting a rock or solid tile sets vx to 0; the Mossplodder
  idles against the obstacle, plodding-in-place animation continuing. (Feature:
  rocks become Mossplodder traps for level choreography.)
- **No facing flip.** Always travels in spawn-direction for its entire life.
  Default in `phase2-areas.md` is **left-facing** (toward Reed).

### 3.3 Attack pattern — contact only

Pure contact damage. Touching a Mossplodder in `walk` ends the run. In `dead`
the corpse is harmless and fades within ~30 frames.

### 3.4 Hit reaction — instant

- 1 hatchet hit kills. Hatchet contact frame IS the death frame; no flash-then-
  die. On death: shell tilts forward off-balance, moss strands flop, fades over
  ~30 frames. Small **dust puff VFX** at the contact point is the only emphasis.
- Sound mood: a soft *thump-and-rustle* — wet wood under leaves.

### 3.5 Color-mood keywords

`shell-loam` · `moss-green` · `wet-bark-brown` · `cuff-cream` (belly seam highlight)

### 3.6 Animation cue list

| State  | Frames | What changes between frames                                              |
|--------|-------:|--------------------------------------------------------------------------|
| `walk` |      4 | shell undulation: front-rise / passing / back-rise / settle. Moss strands trail one frame behind body cycle. |
| `dead` |      3 | (1) tilt-forward off-balance, (2) shell flat / moss splayed, (3) fade-out|

(No `turn`, `hurt`, or `idle`. `walk` plays continuously while `vx != 0`; on
wall contact, holds frame 1.)

### 3.7 Suggested tunables

| Parameter                | Suggested start | Units    | Notes                                  |
|--------------------------|----------------:|----------|----------------------------------------|
| `mossplodder.walkSpeed`  |             0.7 | px/frame | Slower than Phase 1 Crawlspine.        |
| `mossplodder.contactDmg` |            kill | n/a      | 1-hit-kill on contact.                 |
| `mossplodder.deathFrames`|              30 | frames   |                                        |
| `mossplodder.gravity`    |            0.55 | px/frame²| Same as hero — falls off ledges normally.|

---

## 4. Flier-type enemy — **Hummerwing**

A sun-warmed flier the size of a clenched fist, drifting forward at fixed altitude.
Where Phase 1's Glassmoth taught swoops, the Hummerwing teaches **read-the-altitude-
and-duck**: it never deviates from its flight path, but it cruises at exactly the
wrong height — chest-high to a running boy.

### 4.1 Silhouette intent

A round thorax with two short, fast-vibrating wings and a soft amber underglow.
Three-quarter-tile wide, half-tile tall. Wings blur into translucent ovals (one
inner highlight pixel keeps it readable on bright sky). From distance: *a small
warm dot drifting forward at hat-brim height*. **Purposeful, not predatory** —
not hunting, just commuting. Threat lives in the player's choice of how to handle
it crossing their lane.

### 4.2 Movement FSM

States: `drift`, `dead`. **No `swoop`. No `hurt`. No altitude change.**

- **Constant vx** in spawn direction; no facing flip.
- **No swoop.** Vertical position is a small sine bob around `driftAltitude`.
  Decorative — clamp so the bottom of the hitbox stays at chest-high to a
  standing Reed (~1 tile above the floor).
- **No detection of the player.** Drifts the same regardless of Reed's position.
- **No wall collision in air.** Rocks live on the ground; flier paths above.

### 4.3 Attack pattern — contact only

Pure contact damage. No projectile, no dive. Touching a Hummerwing ends the run.

### 4.4 Hit reaction — instant

- 1 hatchet hit kills. On death: wings cease, body **falls** under hero-gravity
  to the ground, fades on impact. ~30 frames. Player should feel "I made it
  drop."
- Sound mood: a tiny *snap* on the strike, then a *plff* on ground hit.

### 4.5 Color-mood keywords

`sunwarm-amber` · `wing-haze` · `velvet-shadow` · `dust-pink` (highlight)

Hummerwings should pop slightly warm against the cool forest parallax — a clean
shot rewards the player with a *warm spark falls cool* contrast frame.

### 4.6 Animation cue list

| State   | Frames | What changes between frames                                          |
|---------|-------:|----------------------------------------------------------------------|
| `drift` |      2 | wing blur cycle (1 wings up-blur, 2 wings down-blur). Body translates per sine bob in Dev code, not animation. |
| `dead`  |      3 | (1) wings cease / body tilts; (2) mid-fall, body upright; (3) ground hit, fade. |

### 4.7 Suggested tunables

| Parameter                   | Suggested start | Units    | Notes                                       |
|-----------------------------|----------------:|----------|---------------------------------------------|
| `hummerwing.driftVx`        |             1.4 | px/frame | Constant in spawn direction.                |
| `hummerwing.driftAltitude`  |              96 | px       | ~2 tiles above local floor — chest-high.    |
| `hummerwing.bobAmplitude`   |              10 | px       |                                             |
| `hummerwing.bobFrequency`   |            0.05 | rad/frm  |                                             |
| `hummerwing.contactDmg`     |            kill | n/a      |                                             |
| `hummerwing.deathFrames`    |              30 | frames   |                                             |
| `hummerwing.gravity`        |            0.55 | px/frame²| Used only after death (body falls).         |

---

## 5. Egg pickup — the **dawn-husk**

A small ovoid the size of Reed's head, sitting on the ground roughly one screen
into each round (placements in `phase2-areas.md`). Speckled like a river-stone,
faintly luminous on the eastern face. Reed runs into it, it cracks open, hatchet
appears in his hand same frame.

> Functionally: **container item that becomes a weapon on first contact.**

### 5.1 Visual intent

Oval with a slightly heavier base — *resting on the ground*, not hovering. Two-
tone speckle (`shell-loam`/`dawn-amber` base + sparse darker fleck). Faint dawn-
rim along the eastern arc keeps the silhouette unmistakable at low contrast.
One frame for the resting state.

### 5.2 Break animation — 3 frames, ~12 frame duration

| Frame | What happens                                                           |
|------:|------------------------------------------------------------------------|
|     1 | Crack — fissure opens diagonally across the husk. Body still whole.    |
|     2 | Halves separate slightly; a flash of `dawn-amber` between them.        |
|     3 | Halves fall apart and fade; the **stone hatchet** is now in Reed's hand. Husk halves do not persist. |

The hatchet does NOT exist as a free pickup item between frames 2 and 3. Contact
= arm. Keeps flow clean (no item-on-ground entity for the hatchet).

### 5.3 Animation cue list

| State   | Frames | What changes                                                                    |
|---------|-------:|---------------------------------------------------------------------------------|
| `rest`  |      1 | static (Design may add a 2-frame slow shimmer if budget allows)                 |
| `break` |      3 | per §5.2                                                                         |

### 5.4 Behavior summary

- Not attackable; hatchet doesn't exist yet. Not harmful.
- Only Reed contact triggers the break — Mossplodders pass through. (Authoring
  rule: don't spawn enemies on a path crossing the egg before the player. See
  `phase2-areas.md`.)
- Once broken, gone for the round. Respawn-on-restart open (§11 Q2).

### 5.5 Suggested tunables

| Parameter             | Suggested start | Units    | Notes                                |
|-----------------------|----------------:|----------|--------------------------------------|
| `egg.breakFrames`     |              12 | frames   | Total break-and-arm duration.        |
| `egg.shimmerFps`      |               2 | fps      | If Design implements 2-frame shimmer.|

---

## 6. Hero projectile — **stone hatchet**

A short-handled, chipped-edge stone hatchet roughly half-tile in span. Where the
stoneflake was a *skipping pebble*, the hatchet is a **decisive overhand throw** —
heavier arc, no bounce, lands once and that's it.

### 6.1 Silhouette intent

A wedge head with a wrapped-cloth handle. At this size: just a recognizable *axe
shape that spins*. Clearly larger and more menacing than the stoneflake without
crowding the screen.

### 6.2 Trajectory — overhand parabolic arc

- Initial velocity: forward (hero facing) and slightly upward — lower angle than
  the stoneflake, but **higher gravity** so it falls cleanly.
- **No bounce.** First ground/wall contact = despawn (puff). First enemy contact
  = enemy dies, hatchet despawns.
- Range: ~6-7 tiles before it drops below the spawn line. The stoneflake skipped;
  the hatchet **commits**. Spin during flight: 2 frames at high fps (~16) for blur read.

Intentionally less forgiving than the stoneflake. Phase 1 let you spam-skip past
Crawlspines; Phase 2 wants you to commit a throw at a forward-walking Mossplodder,
miss it, and feel the cost.

### 6.3 Animation cue list

| State    | Frames | What changes between frames                                         |
|----------|-------:|---------------------------------------------------------------------|
| `fly`    |      2 | spin: head-up / head-down. Played at high fps for blur read.        |
| `splash` |      2 | (1) impact puff at contact, (2) puff dissipating. On any despawn.   |

### 6.4 Cooldown and limit

**2 hatchets max on screen** (same cap as Phase 1). `attackCooldown` ~12 frames
(slightly slower than Phase 1's 10 to match the heavier feel). Cooldown does NOT
lock movement.

### 6.5 Damage

1-hit-kill on Mossplodder and Hummerwing.

### 6.6 Suggested tunables

| Parameter                  | Suggested start | Units      | Notes                                  |
|----------------------------|----------------:|------------|----------------------------------------|
| `hatchet.vx0`              |             6.5 | px/frame   | Direction = hero facing.                |
| `hatchet.vy0`              |            -3.5 | px/frame   | Higher initial rise than stoneflake.    |
| `hatchet.gravity`          |            0.55 | px/frame²  | Same as hero — clean parabolic arc.     |
| `hatchet.maxOnScreen`      |               2 | count      |                                        |
| `hatchet.lifetimeMax`      |             100 | frames     | Hard cap (~1.7 s).                     |
| `hatchet.attackCooldown`   |              12 | frames     |                                        |
| `hatchet.spinFps`          |              16 | fps        |                                        |

> **Note for dev-lead:** Phase 1 `stoneflake` data path can be reused as substrate;
> only bounce logic + tunables differ. Keep `projectile.type === 'hatchet'`
> distinct from `'stoneflake'` so future Areas can mix weapon pickups.

---

## 7. Rock obstacle

A waist-high stone hump in Reed's path. **Blocks horizontal movement; does not
damage.** Reed can stop against it, jump over, or use it to bottle up a
Mossplodder.

- **Visual:** weather-rounded boulder, base wider than top, slight moss patch on
  the shaded side. Half-tile to one-tile tall. Reads as part of the landscape,
  not a placed obstacle.
- **Behavior:** solid for Reed and Mossplodders. Hummerwings drift over (rocks
  are short; flier altitude is above). Hatchets despawn on contact (counts as
  wall). No damage.
- **Tile vs. entity:** **tile.** Implement in the Area 1 tileset. Suggested
  names: `rock_small`, `rock_large`. Static; no animation. No tunables.

---

## 8. Fire obstacle

A patch of low flame on the ground. **1-hit-kill on contact.** Fixed position;
visibly **animated** so the player reads "dangerous *now*, not just decoration."

- **Visual:** dancing low flame with three or four flame-tongues, base in
  `dawn-amber`, tips in `pale-gold`, smoke-curl `velvet-shadow`. Half-tile tall,
  one-tile wide footprint. **Pure black is forbidden** per `docs/story/world.md`
  — even fire shadow is violet. World fiction allows "the ruins, half-asleep,
  leak fire from where they used to keep it" — Design may add a faint sigil-glow
  under each flame, optional.
- **Behavior:** 1-hit-kill on Reed contact regardless of state. Mossplodders
  walking into fire **die instantly** (re-use Mossplodder `dead`). Useful
  tactical tool. Hummerwings drifting over fire are untouched (altitude is above
  flame tips). Hatchets pass through harmlessly.
- **Tile vs. entity:** **animated tile** (preferred), entity (fallback).
  Cleanest data home is "animated tile," but that requires extending
  `docs/design/contracts.md` to allow tiles to declare an animation track.
  Decision flagged in §11 Q1. Suggested tile name: `fire_low`.

### 8.1 Animation cue list

| State    | Frames | What changes between frames                                          |
|----------|-------:|----------------------------------------------------------------------|
| `flicker`|      4 | flame-tongue cycle: low / lean-left / high / lean-right. ~6 fps. Loops; never goes out, never lights up. |

### 8.2 Suggested tunables

| Parameter             | Suggested start | Units    | Notes                                |
|-----------------------|----------------:|----------|--------------------------------------|
| `fire.flickerFps`     |               6 | fps      |                                      |
| `fire.contactDmg`     |            kill | n/a      | 1-hit-kill, all states.              |

---

## 9. Mile-marker (round transition) and boundary cairn (stage clear)

Two structurally similar trigger objects: a **vertical post** at the end of rounds
1, 2, 3, and a **stacked cairn** at the end of round 4. Reed walks into the
hitbox; the system fires the transition. No combat interaction; no damage.

### 9.1 Mile-marker

A weathered wooden post chest-high to Reed, with a plank crossbar near the top
displaying the round number in a stylized notch-carving (digits or notches —
flagged §11 Q4). Stands at the rightmost tile column of the round, on the floor.

- ~one tile tall. Wider at the base. `wet-bark-brown` post, `cuff-cream` plank,
  `dawn-amber` numeral notches. Reads as *something a traveler would touch*, not
  a threat.
- Reed contact triggers fade-to-black + round-number overlay + load next round
  (`phase2-areas.md` §3.1). Single-use.
- **Implement as entity** (one per round), small trigger hitbox.

| State   | Frames | What changes                                                            |
|---------|-------:|-------------------------------------------------------------------------|
| `idle`  |      2 | gentle 2-frame breeze: plank tilts ±1 px. Slow (~2 fps).                |
| `pulse` |      3 | (1) standard, (2) glow-warm, (3) standard. Plays on Reed's approach (~2 tiles before hitbox). Optional flourish. |

### 9.2 Boundary cairn

A waist-high stack of three river-stones, the topmost carrying a small carved
sigil. Replaces the mile-marker at the end of round 4 only.

- ~one tile tall, one tile wide footprint. `river-stone-grey` base stones
  (slightly different tone per stone), `dawn-amber` top sigil-stone,
  `velvet-shadow` line. Reads as *more permanent* than the mile-marker — a thing
  built, not carried.
- Reed contact fires the stage-clear ritual (`phase2-areas.md` §3.2). Single-use.
- **Implement as entity** (one per Area).

| State   | Frames | What changes                                                                |
|---------|-------:|-----------------------------------------------------------------------------|
| `idle`  |      2 | sigil-stone pulses gently. ~1 fps.                                          |
| `clear` |      4 | (1) standard, (2) sigil flares, (3) full-glow, (4) settled. On contact, before overlay. |

---

## 10. Cast retirement note (Phase 1 trio)

Crawlspine, Glassmoth, and Bristlecone Sapling are **retired from active gameplay
in v0.50**. Their sprite modules (`assets/sprites/enemy-crawlspine.js`,
`enemy-glassmoth.js`, `enemy-sapling.js`, `proj-seeddart.js`) **stay in the
repository** as reserve material for later Areas — too mechanically interesting
to throw away. The stoneflake projectile (`proj-stoneflake.js`) is also retired
from active gameplay; sprite stays.

For v0.50:

- Phase 1 trio is **not** spawned in any round of Area 1.
- `LevelManager` should not reference Phase 1 enemy types in Area 1 round data.
- `PhaseOneTunables.js` Crawlspine/Glassmoth/Sapling/Seeddart blocks remain in
  the repo (touch only if cleanup desired); no v0.50 system reads them.
- Phase 1 sprite modules SHOULD remain wired into `SpriteCache` so a future Area
  doesn't have to re-plumb the import path. (Dev's call on lazy-load.)

A future Area wanting to revive any of the trio (or the stoneflake) should open
its own Phase 3+ brief.

---

## 11. For Design

Concrete asset list for v0.50. Sizes are *target in-canvas dimensions*; canvas
logical resolution is 768 × 576 with `TILE = 48`. All sprite modules follow
`docs/design/contracts.md`.

| Asset                          | Path                                  | Frame size (w × h) | Anchor (px, top-left) | Animations                                                    |
|--------------------------------|---------------------------------------|--------------------|-----------------------|---------------------------------------------------------------|
| Hero — Reed armed overlay      | `assets/sprites/hero-reed.js` (extend) | 36 × 48            | (18, 47) — feet center| `idle_armed:3, walk_armed:4, jump_armed:2, attack:3` (replaces existing `attack`) |
| Stone hatchet                  | `assets/sprites/proj-hatchet.js`      | 16 × 16            | (8, 8) — center       | `fly:2, splash:2`                                             |
| Enemy — Mossplodder            | `assets/sprites/enemy-mossplodder.js` | 48 × 36            | (24, 35) — feet center| `walk:4, dead:3`                                              |
| Enemy — Hummerwing             | `assets/sprites/enemy-hummerwing.js`  | 36 × 24            | (18, 12) — body center| `drift:2, dead:3`                                             |
| Pickup — dawn-husk             | `assets/sprites/item-dawnhusk.js`     | 24 × 24            | (12, 23) — base center| `rest:1, break:3`                                             |
| Trigger — mile-marker          | `assets/sprites/marker-mile.js`       | 36 × 48            | (18, 47) — base center| `idle:2, pulse:3`                                             |
| Trigger — boundary cairn       | `assets/sprites/marker-cairn.js`      | 48 × 48            | (24, 47) — base center| `idle:2, clear:4`                                             |
| Tile — Area 1 ground / slopes  | `assets/tiles/area1.js`               | 48 × 48 per tile   | n/a                   | static; slope variants per `phase2-areas.md` §2.1             |
| Tile — rock obstacle           | (in `area1.js` as `rock_small`/`rock_large`) | 48×48 / 48×96 | n/a                   | static                                                         |
| Tile — fire obstacle           | (in `area1.js` as `fire_low`)         | 48 × 48            | n/a                   | `flicker:4` — animated tile (§8 fallback)                     |
| Background — Area 1 sky        | `assets/bg/area1-sky.svg`             | full-canvas SVG    | n/a                   | static parallax layer 0 (slowest)                              |
| Background — Area 1 trees      | `assets/bg/area1-trees.svg`           | tileable SVG       | n/a                   | parallax layer 1                                               |
| Background — Area 1 fore-foliage| `assets/bg/area1-fore.svg`           | tileable SVG       | n/a                   | parallax layer 2 (fastest)                                     |

**Palette guidance per entity** (Design picks hex):

- **Reed armed:** add `chip-stone-grey` and `cloth-wrap-tan` for hatchet head/grip; Phase 1 palette otherwise unchanged.
- **Mossplodder:** `shell-loam`, `moss-green`, `wet-bark-brown`, `cuff-cream` (belly seam), `velvet-shadow`.
- **Hummerwing:** `sunwarm-amber` (body), `wing-haze` (translucency — 8-digit alpha hex per contract), `dust-pink` (highlight), `velvet-shadow` (1px outline).
- **Dawn-husk:** `shell-loam` (base), `dawn-amber` (rim glow), `cuff-cream` (speckle highlights), `wet-bark-brown` (shadow).
- **Stone hatchet:** `chip-stone-grey` (head), `cloth-wrap-tan` (grip), `velvet-shadow` (line).
- **Mile-marker:** `wet-bark-brown` (post), `cuff-cream` (plank), `dawn-amber` (numeral notches).
- **Boundary cairn:** `river-stone-grey` (three tonal variations), `dawn-amber` (sigil-stone), `velvet-shadow`.
- **Fire:** `dawn-amber` (base), `pale-gold` (tongue tips), `velvet-shadow` (smoke curl). **No pure black.**
- **Area 1 tileset:** `loam-soil`, `moss-green`, `wet-bark-brown`, `dawn-amber` (root highlights), `velvet-shadow`.
- **Background:** cool greens dominate parallax; `morning-haze` and `dawn-amber` warm the sky; foreground foliage layer pulls slightly violet.

**Notes:** anchor convention unchanged from Phase 1 (feet-center for grounded
entities and triggers; body-center for airborne and projectiles). No pure black
ink. Hummerwing wings benefit from a partial-alpha palette index. Phase 2 enemy
`hurt` frames not needed (1-hit-kill, no flash).

---

## 12. For Dev

### 12.1 ECS components — additions for Phase 2

```js
// Existing 'player' — add armed flag:
player: {
  facingRight, isJumping,
  attackCooldown, coyoteTimer, jumpBuffer,   // Phase 1 fields (post-v0.25.2 cleanup)
  armed,           // Phase 2: false at round start, true after egg pickup
}

// Existing 'enemy' — re-used; type field gets new values:
enemy: {
  type,        // 'mossplodder' | 'hummerwing'  (Phase 1 types valid for reserve sprites)
  dir,         // -1 | 1; locked at spawn; no flip in v0.50
  ai,          // 'walk' | 'drift' | 'dead'
  hp, hpMax,   // unused in Phase 2 — present for back-compat
  stateTimer,  // frames remaining in 'dead' before despawn
  cooldown,    // unused
}

// Existing 'projectile' — re-used; new type:
projectile: {
  type,        // 'hatchet'  (Phase 1 types valid for reserve)
  lifetime,
  bouncesLeft, // 0 for hatchet
  ownerKind,   // 'hero'
  damage,      // 'kill'
}

// New 'pickup' (Phase 2):
pickup: { type, state, stateTimer }   // type: 'dawn-husk'; state: 'rest' | 'break'

// New 'trigger' (Phase 2):
trigger: { kind, roundIndex, consumed }
// kind: 'mile-marker' | 'boundary-cairn'; roundIndex: 1|2|3 for marker, n/a for cairn

// New 'obstacle' (only if fire ships as entity — see §8):
obstacle: { kind, contactDmg }   // kind: 'fire'; contactDmg: 'kill'
```

### 12.2 FSMs to implement

- **Hero:** Phase 1 FSM unchanged. Add `player.armed` boolean. Renderer chooses
  `idle` vs. `idle_armed` (etc.) by armed flag. Attack cooldown / projectile
  spawn gated on `armed`. When `armed === false` and player presses X,
  **suppress the throw entirely** — no animation, no sound. (Pressing attack
  with no weapon should feel like a no-op, not a missed beat.)
- **Mossplodder:** trivial — single `walk` constant-velocity state, `dead` on
  hatchet or fire contact.
- **Hummerwing:** trivial — single `drift` constant-velocity state with sine
  bob, `dead` on hatchet contact. After `dead`, body falls under gravity.
- **Egg / dawn-husk:** `rest` → (Reed contact) → `break` → (after `breakFrames`)
  → despawn + flip `player.armed = true`.
- **Mile-marker / boundary cairn:** static `idle` until Reed enters trigger
  hitbox → `consumed = true` → fire transition event up to `LevelManager`.

### 12.3 New systems suggested

- **`StageManager`** (or extend `LevelManager`): owns 4-round Area 1 progression.
  Loads round data, fires fade-to-black on mile-marker trigger, advances
  `currentRound`, loads next round. After round 4 cairn trigger, displays "Stage
  Cleared" overlay (`phase2-areas.md` §3.2) and idles until input or refresh.
- **`SlopeCollision`** (extend physics): support sloped ground tiles. Suggested
  scheme: each ground tile carries a `slope` field (`flat | up45 | down45 | up22
  | down22`); resolver interpolates floor Y by player X within the tile. Final
  encoding is dev-lead's call.
- **`PickupSystem`**: handles egg break and `player.armed` flip.
- **`TriggerSystem`**: handles mile-marker / cairn detection, fires transition
  events.

### 12.4 Tunable parameter blocks

Suggest extending `src/config/PhaseOneTunables.js` (or splitting into
`PhaseTwoTunables.js`):

```
HERO_PHASE2  = { (existing HERO unchanged, plus:) armedStartOfRound: false }
HATCHET      = { vx0, vy0, gravity, maxOnScreen, lifetimeMax,
                 attackCooldown, spinFps }
MOSSPLODDER  = { walkSpeed, deathFrames, gravity }
HUMMERWING   = { driftVx, driftAltitude, bobAmplitude, bobFrequency,
                 deathFrames, gravity }
EGG          = { breakFrames, shimmerFps }
FIRE         = { flickerFps }
TRIGGERS     = { milePulseRange, cairnIdleFps }
```

### 12.5 Damage resolution rules

- All Phase 2 enemies die on first hatchet contact. No hp counter, no flash, no
  friendly-fire.
- Hatchet despawns on first solid contact (enemy / wall / ground / rock) OR on
  `lifetimeMax`. **No bounce.**
- Hero contact with a Mossplodder (in `walk`), a Hummerwing (in `drift`), or a
  fire tile = immediate game over. (Per v0.25.2.)
- Mossplodder + fire = Mossplodder dies. Hummerwing + fire = not possible by
  altitude design.

### 12.6 Stage smoke checks (v0.50 quartile gate)

1. Round 1-1 loads. Reed unarmed; press X → no throw.
2. Walk into dawn-husk → 3-frame break, `player.armed = true`. Press X →
   hatchet on parabolic arc, lands once, despawns with puff.
3. Hatchet kills Mossplodder in 1 hit. Walking into Mossplodder unarmed =
   instant game over.
4. Jump-throw at a Hummerwing; it dies and falls.
5. Rock blocks path; jump over. Mossplodder pinned against another rock holds
   `walk` frame 1. Hatchet kills it.
6. Fire tile = game over on Reed contact. Mossplodder + fire = Mossplodder dies.
7. Mile-marker at end of round 1-1 → fade + round-1-2 load. Repeat through 1-3.
8. Boundary cairn at end of round 1-4 → fade + "Stage Cleared" overlay.

---

## 13. Open questions for release-master

1. **Fire as animated tile vs. entity (§8).** Cleanest is "animated tile," but
   that requires extending `docs/design/contracts.md`. Two paths: (a) extend
   the contract this PR family — cleanest long-term; design-lead and dev-lead
   must concur. (b) ship fire as an entity for v0.50 — faster, but adds an
   entity type that's "really just a tile." Recommend (a); defer to release-
   master on scope.
2. **Egg respawn on death.** v0.25 made game-over terminal. If continue/restart
   ships in v0.50, egg should respawn at round-start. If continue is deferred
   to v0.75, no change needed.
3. **Death-while-armed semantics.** §2.5 says hatchet does not persist into
   respawn. If continue ships and respawning unarmed feels punishing, consider
   "respawn at last mile-marker, armed if armed at death" — v0.75 mechanics
   call. For v0.50 the cleanest rule is "respawn unarmed at round 1-N start."
4. **Mile-marker round numerals.** Actual digits ("1", "2", "3") or notch-marks
   (one notch, two notches, three notches)? Numerals read fast to a global
   audience; notches feel period-correct but could read as decorative scratch.
   Flag now to avoid asset rework.
5. **Cairn overlay copy.** "Stage Cleared" + "Area 2 ahead in v0.75." is
   release-honest but maybe too meta. Alternates: "The next boundary waits."
   / "The path continues — soon." Bilingual parallel needs authoring either way.
6. **Hatchet pickup persistence on round transition.** Reset to unarmed at each
   round start (recommended; matches `armedStartOfRound: false`) — keeps the
   egg-break beat present in every round, gives Design four pickup moments.
   Or persist across rounds — feels like richer progression but burns three of
   four egg moments. Recommend reset.

---

## Cast retirement note

(See §10. Phase 1 trio + Phase 1 stoneflake projectile retired from active
gameplay in v0.50; sprite modules remain in `assets/sprites/` as reserve.)

---

## Changelog

(None at publication.)

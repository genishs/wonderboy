# Phase 1 — Cast brief

> **Authoring agent:** story-lead
> **Consumers:** design-lead, dev-lead
> **Reviewer:** release-master
> **Companion docs:** `docs/story/world.md`

This is the canonical Phase 1 cast brief. It defines exactly one hero and three
mechanically distinct enemies, plus the silhouette intent, FSMs, attack patterns,
hit reactions, color-mood keywords, animation cues, and suggested tunables that
Design and Dev consume. Nothing here is sprite data or code; every numeric value
is a *suggestion* the dev-lead is expected to tune in code.

> **Tribute, not a port.** All names, fauna, and weapon ideas in this document are
> original to this project. No public character/asset names from the inspirational
> series have been reused.

---

## 1. World-fiction blurb

Dawn over the Verdant Ruin. Terraces of cracked stone, half-claimed by moss and
slow river, hum with fauna that mistakes a passing boy for weather. Reed Bramblestep
walks east through this gentle, insistent landscape on the trail of his sister's
last-heard voice — and the ruins, half-asleep, throw whatever they have at him.
Tone: **kettle-warm morning, woody not metallic, gentle not grim.**

---

## 2. Hero — **Reed Bramblestep**

A barefoot, river-tanned twelve-year-old with a rolled-cuff tunic and a sling-pouch
of skipping stones. He is the warmest object on screen — Design should let him
read like a struck match against the foliage.

### 2.1 Silhouette intent

On first sight the player should feel *small but springy*. The pose is forward-leaning,
weight on the balls of the feet, one hand low and slightly behind for the throw, the
other free. Hair tufted forward as if the wind is always at his back. He should look
like he could break into a run before the player has finished pressing the d-pad — the
read is **kinetic potential, not stance**. No cape, no helmet, no weapon strapped on:
his only tool is what's in his pouch. Negative space around the head/shoulders should
be generous so the silhouette stays legible against busy parallax.

### 2.2 Movement FSM

States: `idle`, `walk`, `jump_rising`, `jump_falling`, `attack`, `hurt`, `dead`.
A separate `attack` overlay can fire from `idle`, `walk`, `jump_rising`, or
`jump_falling` without interrupting locomotion (see 2.4).

```
              ┌──────────────── input.left/right ─────────────────┐
              │                                                   │
              ▼                                                   │
        ┌──────────┐  input.left/right released   ┌──────────┐    │
        │   idle   │ ◄─────────────────────────── │   walk   │ ───┘
        └────┬─────┘                              └────┬─────┘
             │                                         │
             │ input.jump            input.jump        │
             ▼                                         ▼
        ┌──────────────┐    vy >= 0    ┌──────────────────┐
        │ jump_rising  │ ────────────► │  jump_falling    │
        └──────────────┘               └────────┬─────────┘
                                                │ onGround = true
                                                ▼
                                        (back to idle / walk)

   any state ──── took damage & hp > 0 ──► hurt ── timer expires ──► idle
   any state ──── took damage & hp == 0 ─► dead  (terminal; respawn handled by Dev)
   any state ──── input.attack & cooldown==0 ─► spawns projectile, plays attack overlay
```

Notes for Dev:
- `attack` is an **overlay**, not a state that blocks movement. The player should be able
  to walk-throw and jump-throw. Attack-while-hurt is suppressed.
- `hurt` locks input for `iframes_hurt` and applies horizontal knockback opposite to the
  damage source (see 2.5). Vertical velocity is not zeroed — getting clipped mid-jump
  shouldn't dump the player to the floor.
- `jump_rising → jump_falling` switches when `vy >= 0`. Hold-to-jump is variable-height
  by cutting `vy` if the jump button is released early during `jump_rising`.

### 2.3 Attack pattern — *stoneflake*

Reed's only weapon is a **stoneflake**: a flat river-pebble he side-arms forward. It is
NOT a fireball, NOT a boomerang, NOT a magical bolt — just a stone with a good arc.

- **Trajectory.** Skipping-stone arc. Flat horizontal launch with slight rise (peaks
  ~3 tiles forward), then a gentle fall. On contact with ground tiles it **bounces
  once** at ~60% incoming speed, then despawns on the second contact or at lifetime end.
  Bounce gives Reed a small reach bonus on flat ground without making him a sniper.
- **On-screen instance limit.** **Two** stoneflakes maximum. The third press is silently
  ignored (no buffered queue). Two is enough to feel generous; three turns the screen
  into a pebble cloud and trivializes the timed-hazard enemy.
- **Recovery frames.** ~10 frames of throw windup-and-release where a new throw is
  rejected, but movement is uninterrupted. Hitting a wall despawns the stoneflake on
  contact (no infinite hop loops).
- **Damage.** 1 HP per hit (all Phase 1 enemies are 1–2 HP).

### 2.4 Hit reaction

- Knockback magnitude: **moderate horizontal, tiny vertical pop.** Enough that the
  player visibly registers the hit but not enough to launch them off a platform from a
  single touch on flat ground.
- I-frames: **~36 frames (~0.6 s)** of post-hurt invulnerability. During i-frames, Reed
  blinks at 8 fps (alternating visible/skipped frames) and contact damage is suppressed.
- Sound mood: a soft *thock* with a half-step downward chirp. Not a scream, not a thud.

### 2.5 Color-mood keywords

`moss-green` · `dawn-amber` · `river-stone-grey` · `violet-shade` · `cuff-cream`

(Design picks the actual hex values; these are mood anchors.)

### 2.6 Animation cue list

| State          | Frames | What changes between frames                                            |
|----------------|-------:|------------------------------------------------------------------------|
| `idle`         |      3 | (1) neutral stand, (2) tiny breath rise, (3) one foot scuffs the ground|
| `walk`         |      4 | classic 4-step cycle: contact / down / passing / up; arm sway opposite to lead leg |
| `jump_rising`  |      2 | (1) push-off — knees up, arms forward; (2) apex tuck — body compact     |
| `jump_falling` |      2 | (1) arms reaching slightly back; (2) anticipation crouch as ground nears|
| `attack`       |      3 | (1) windup (hand at hip, weight back); (2) release (arm extended, body open); (3) recover (arm relaxes, weight forward) |
| `hurt`         |      2 | (1) jolt: head back, arms out; (2) recover blink-frame                  |
| `dead`         |      3 | (1) jolt + fall start; (2) seated-crumple; (3) head bowed, settle       |

Design may add tween frames; the counts above are the *minimum* readable.

---

## 3. Enemy archetypes

Three archetypes that the player must read differently. They are mechanically distinct
on purpose — a ground crawler, an airborne swooper, and a stationary timed hazard —
not three reskins.

### 3.1 **Crawlspine** — ground crawler

A flat, plate-armored beetle the size of a loaf of bread. Always on the floor, always
moving, always turning at edges so it never falls off a platform. The **starter enemy**:
the player's first lesson in "stoneflakes work, but you have to lead the target."

#### 3.1.1 Silhouette intent

Low and wide, the silhouette barely rises above one tile. From distance it should read
as a *moving piece of ground*. Spiny ridge along the back catches the dawn light. No
visible legs at this scale — it scuttles, it doesn't walk.

#### 3.1.2 Movement FSM

States: `walk`, `turn`, `hurt`, `dead`.

```
        ┌────── walk ────── reaches edge or wall ──────► turn
        ▲                                                  │
        │                                                  │
        └────── turn complete (~6 frames) ◄────────────────┘

        any state ── took damage & hp > 0 ──► hurt ── timer expires ──► walk
        any state ── took damage & hp == 0 ─► dead
```

- `walk` is constant horizontal velocity in the current facing direction. No idle pause.
- `turn` flips facing and pauses horizontal motion for ~6 frames so the player can read
  the change.
- Crawlspines **do not** chase or jump. They are a *layout* element, not a hunter.

#### 3.1.3 Attack pattern — contact only

No projectile, no lunge. Pure contact damage. This is the floor of the threat lattice.

#### 3.1.4 Hit reaction

- 1 HP. Dies on first stoneflake.
- Hurt FSM lasts ~6 frames (just long enough for a death-confirm flash if hp == 0).
- On death: small upward pop, 180° flip onto its back, fades over ~30 frames. No gibs.
- Sound mood: a dry *tock* on hit; on death a small puff like a kicked acorn.

#### 3.1.5 Color-mood keywords

`bark-brown` · `moss-green` · `chitin-bronze`

#### 3.1.6 Animation cue list

| State  | Frames | What changes                                                      |
|--------|-------:|-------------------------------------------------------------------|
| `walk` |      4 | scuttle cycle — ridge plates ripple front-to-back across 4 frames |
| `turn` |      2 | (1) plates fan up as it pivots; (2) settled into new facing       |
| `hurt` |      1 | full silhouette flashed lighter; one frame only                   |
| `dead` |      3 | (1) upward pop, (2) mid-flip, (3) belly-up settle                 |

#### 3.1.7 Combat stats

- Contact damage: 1 HP (Reed has 3 HP in Phase 1; see tunables).
- Sight range: **n/a** — does not perceive the player.
- HP: 1.
- On-death behavior: pop-flip + fade; no drops in Phase 1.

---

### 3.2 **Glassmoth** — airborne swooper

A translucent moth the span of two tiles. Drifts horizontally in a sine-wave pattern at
~3 tiles altitude above the platform Reed is on, and once per pass dips toward Reed.
The **positional pressure** enemy: it teaches the player that vertical space is never
safe.

#### 3.2.1 Silhouette intent

Two soft-edged wings, body almost invisible, dust trail behind it. From a distance
it reads as a *floating pale comma*. Wings should flicker rather than flap — the
animation should imply "lighter than air" rather than "trying hard to stay up."
Glassmoth is the only enemy in Phase 1 with translucent fill; Design should give it
a one-pixel inner highlight so it doesn't disappear into bright sky tiles.

#### 3.2.2 Movement FSM

States: `drift`, `swoop`, `recover`, `hurt`, `dead`.

```
                ┌──────── drift ────────┐
                │  (sine-wave horizontal)│
                ▼                       │
        player within sight_range_x?   │
                │ yes                  │ no
                ▼                       │
            ┌──────┐  reaches dive low   │
            │swoop │ ──────────────────► recover ──── back to drift
            └──────┘                     ▲
                                         │
        any state ── damage & hp > 0 ──► hurt ── timer ──► drift
        any state ── damage & hp == 0 ─► dead
```

- `drift`: constant vx in current facing, vy = `A * sin(t * f)` (small amplitude).
- `swoop`: trigger when |player.x - self.x| < `sight_range_x` AND self.y < player.y
  AND `swoop_cooldown == 0`. Set vy positive (toward player), keep vx. Lock for
  ~24 frames or until vertical floor is reached, whichever first.
- `recover`: rise back to drift altitude over ~30 frames; cannot swoop again during
  this window.
- Glassmoth **cannot land**. If it ever touches a solid tile while not in `dead`, it
  bounces back upward (treat as a soft ceiling collision).

#### 3.2.3 Attack pattern — swoop dive (contact)

Contact damage on the swoop. The dive itself IS the attack — no projectile, no claws.
Reed's stoneflake arcs, so a Glassmoth at altitude is a real shot to make.

#### 3.2.4 Hit reaction

- 1 HP. One stoneflake kills.
- On hit: flash + immediate `dead` (Phase 1 enemies are fragile by design).
- On death: wings detach as two slow-falling triangles, body fades. ~45 frames total.
  This is the *prettiest* death in Phase 1 — Design should treat it as the showcase.
- Sound mood: a small *tic* on the stone-strike, then a soft chime as the wings
  drift down.

#### 3.2.5 Color-mood keywords

`pearl-glass` · `dust-pink` · `morning-haze`

#### 3.2.6 Animation cue list

| State    | Frames | What changes                                                   |
|----------|-------:|----------------------------------------------------------------|
| `drift`  |      4 | wing flicker — 4 phases of wing translucency / bend            |
| `swoop`  |      2 | (1) wings folded back, body angled down; (2) wings fully back  |
| `recover`|      3 | (1) pull-up, (2) wings spread, (3) back to neutral altitude    |
| `hurt`   |      1 | full silhouette flash; one frame                               |
| `dead`   |      3 | (1) wings detach mid-air, (2) body curls, (3) fade-out         |

#### 3.2.7 Combat stats

- Contact damage: 1 HP.
- Sight range (`sight_range_x`): ~5 tiles horizontal. Vertical sight is unbounded —
  if Reed is below and within horizontal range, swoop is eligible.
- HP: 1.
- On-death behavior: animated dissolve, no drops in Phase 1.

---

### 3.3 **Bristlecone Sapling** — stationary timed hazard

A waist-high cone of bristled needles rooted in the path. It does not move. Every few
seconds it fans its needles open and **fires a short volley of three seed-darts** in a
forward fan. The **timing/positioning** enemy: it teaches the player that *not all
threats can be reached* — sometimes you just have to walk past on the right beat.

#### 3.3.1 Silhouette intent

A spiked half-egg, slightly wider at the base, with a crown of inward-bristled needles
when closed and a flared sunburst when open. It should look *vegetable, not animal* —
no eyes, no mouth. Threat read comes entirely from the open/closed state, not from a
face. Design should pick a resting silhouette that's clearly *plant* even at one-tile
distance, so the player learns to scan for them in busy foliage.

#### 3.3.2 Movement FSM

States: `closed`, `windup`, `firing`, `cooldown`, `hurt`, `dead`.

```
            ┌──────── closed ────────┐
            │  (timer counting down) │
            ▼                        │
       timer hits 0?                 │
            │ yes                    │
            ▼                        │
        ┌────────┐  ~12 frames    ┌─────────┐  spawns 3 darts   ┌──────────┐
        │ windup │ ─────────────► │ firing  │ ─────────────────►│ cooldown │
        └────────┘                └─────────┘                   └────┬─────┘
                                                                     │ (~90 frames)
                                                                     ▼
                                                                   closed

        any state ── damage & hp > 0 ──► hurt ── timer ──► closed
        any state ── damage & hp == 0 ─► dead
```

- `closed`: bristles in. Stoneflakes pass over and miss. **Hitbox is the inner core
  only** — players can't shoot it from above without thinking about the arc.
- `windup`: bristles begin to flare. Hitbox expands. This is the "danger telegraph"
  — Design must make it unmistakable. ~12 frames.
- `firing`: spawn 3 seed-darts in a forward fan: one straight, one +15° up, one -15°
  down. Each dart travels ~6 tiles horizontally then falls (gravity ~half of Reed's).
  Spawn-and-done: the Sapling does not track during the volley.
- `cooldown`: bristles snap closed. Hitbox shrinks back to core. ~90 frames before
  the next windup.

#### 3.3.3 Attack pattern — fan volley

Three darts, simultaneous spawn, in a -15° / 0° / +15° fan from the bristle crown,
forward-only (toward Reed's last-known X side at windup-start; locked once windup
begins — the Sapling does not turn during firing).

- Dart speed: medium, slower than a stoneflake.
- Dart lifetime: 6 tiles or screen edge or first solid tile, whichever first.
- Darts deal 1 HP contact damage and despawn on hit.

#### 3.3.4 Hit reaction

- 2 HP — the only Phase 1 enemy with more than 1 HP. Two well-timed stoneflakes
  while it's flared, OR three perfect ones while closed (the closed core is small).
- On hit: bristles flash, no positional knockback (it's rooted).
- On death: bristles wilt outward, body sinks ~half a tile and fades over ~45 frames.
- Sound mood: a soft *crisp* on hit; on death a long sigh.

#### 3.3.5 Color-mood keywords

`needle-pine` · `dawn-amber` · `seed-bone-white`

#### 3.3.6 Animation cue list

| State      | Frames | What changes                                                          |
|------------|-------:|-----------------------------------------------------------------------|
| `closed`   |      2 | gentle 2-frame breath — bristles tilt 1 px in/out                     |
| `windup`   |      3 | (1) bristles separate, (2) crown half-open, (3) crown fully flared    |
| `firing`   |      2 | (1) full sunburst with 3 darts spawned, (2) recoil back toward closed |
| `cooldown` |      3 | (1) crown closing, (2) half-closed, (3) closed-tense                  |
| `hurt`     |      1 | full silhouette flash                                                 |
| `dead`     |      3 | (1) wilt outward, (2) sink, (3) fade                                  |

#### 3.3.7 Combat stats

- Contact damage: 1 HP (only when flared — touching a closed Sapling deals nothing,
  so you can crouch-walk past one if you time it).
- Sight range: **n/a** — fires on a fixed timer, not on detection. Direction is
  re-evaluated only at windup-start.
- HP: 2.
- On-death behavior: wilt + sink + fade; no drops in Phase 1.

---

## 4. Suggested tunables

> **Every cell below is "Dev to tune."** Numbers are starting points based on a 60 fps
> fixed-step loop and 48-px tiles (`TILE = 48`, per `CLAUDE.md`). Velocities are
> `px/frame`. Times are *frames* (not seconds) for consistency with the loop.

### 4.1 Hero — Reed

| Parameter             | Suggested start | Units      | Notes                                              |
|-----------------------|----------------:|------------|----------------------------------------------------|
| `hero.maxHp`          |               3 | HP         | Three taps to game-over keeps Phase 1 tight.       |
| `hero.walkSpeed`      |             3.5 | px/frame   | ~210 px/s; about 4.4 tiles/sec.                    |
| `hero.runSpeed`       |             5.0 | px/frame   | Optional Phase 1 stretch; gate behind a button.    |
| `hero.jumpVy0`        |           -11.0 | px/frame   | Initial jump impulse (negative = up).              |
| `hero.gravity`        |            0.55 | px/frame²  | Tune jointly with `jumpVy0` for a 3-tile peak.     |
| `hero.jumpCutFactor`  |            0.45 | (multiply) | On early release: `vy *= jumpCutFactor` if `vy<0`. |
| `hero.coyoteFrames`   |               6 | frames     | Late-jump grace.                                   |
| `hero.bufferFrames`   |               6 | frames     | Early-press jump buffer.                           |
| `hero.attackCooldown` |              10 | frames     | Stoneflake throw recovery.                         |
| `hero.maxProjectiles` |               2 | count      | Hard cap on simultaneous stoneflakes.              |
| `hero.iframesHurt`    |              36 | frames     | Post-hit invulnerability (~0.6 s).                 |
| `hero.knockbackVx`    |             3.0 | px/frame   | Horizontal kick away from damage source.           |
| `hero.knockbackVy`    |            -2.0 | px/frame   | Tiny vertical pop on hit.                          |

### 4.2 Hero projectile — stoneflake

| Parameter                  | Suggested start | Units      | Notes                                          |
|----------------------------|----------------:|------------|------------------------------------------------|
| `stoneflake.vx0`           |             6.0 | px/frame   | Direction = hero facing.                        |
| `stoneflake.vy0`           |            -2.5 | px/frame   | Slight initial rise — peaks ~3 tiles forward.   |
| `stoneflake.gravity`       |            0.40 | px/frame²  | Lighter than hero gravity (it skips, not drops).|
| `stoneflake.bounceFactor`  |            0.60 | (multiply) | Vy on first ground contact.                    |
| `stoneflake.maxBounces`    |               1 | count      | Despawn on second ground contact.              |
| `stoneflake.lifetimeMax`   |             120 | frames     | Hard cap (~2 s).                               |
| `stoneflake.damage`        |               1 | HP         |                                                |

### 4.3 Crawlspine

| Parameter                | Suggested start | Units    | Notes                                  |
|--------------------------|----------------:|----------|----------------------------------------|
| `crawlspine.hp`          |               1 | HP       |                                        |
| `crawlspine.contactDmg`  |               1 | HP       |                                        |
| `crawlspine.walkSpeed`   |             1.0 | px/frame | Slow on purpose — "moving terrain."    |
| `crawlspine.turnFrames`  |               6 | frames   | Pause at edge/wall; flips facing.      |
| `crawlspine.hurtFrames`  |               6 | frames   |                                        |
| `crawlspine.deathFrames` |              30 | frames   | Pop-flip + fade.                       |

### 4.4 Glassmoth

| Parameter                  | Suggested start | Units    | Notes                                       |
|----------------------------|----------------:|----------|---------------------------------------------|
| `glassmoth.hp`             |               1 | HP       |                                             |
| `glassmoth.contactDmg`     |               1 | HP       |                                             |
| `glassmoth.driftVx`        |             1.5 | px/frame | Direction flips at screen-relative bounds.  |
| `glassmoth.driftAmplitude` |              16 | px       | Sine vertical bob.                          |
| `glassmoth.driftFrequency` |            0.06 | rad/frm  | ~one full bob per ~100 frames.              |
| `glassmoth.swoopVy`        |             4.0 | px/frame | Downward dive velocity.                     |
| `glassmoth.swoopFrames`    |              24 | frames   | Lock duration of dive.                      |
| `glassmoth.recoverFrames`  |              30 | frames   | Cannot re-swoop during this window.         |
| `glassmoth.sightRangeX`    |             240 | px       | ~5 tiles horizontal trigger.                |
| `glassmoth.driftAltitude`  |             144 | px       | Above ground in current screen.             |
| `glassmoth.hurtFrames`     |               4 | frames   |                                             |
| `glassmoth.deathFrames`    |              45 | frames   |                                             |

### 4.5 Bristlecone Sapling

| Parameter                       | Suggested start | Units    | Notes                                       |
|---------------------------------|----------------:|----------|---------------------------------------------|
| `sapling.hp`                    |               2 | HP       |                                             |
| `sapling.contactDmg`            |               1 | HP       | Only when state ∈ {`windup`, `firing`}.    |
| `sapling.windupFrames`          |              12 | frames   | Telegraph window.                           |
| `sapling.firingFrames`          |               4 | frames   | Spawn-and-done.                             |
| `sapling.cooldownFrames`        |              90 | frames   | Time between volleys.                       |
| `sapling.dartsPerVolley`        |               3 | count    | -15° / 0° / +15° fan.                       |
| `sapling.dartSpeed`             |             4.0 | px/frame |                                             |
| `sapling.dartGravity`           |            0.27 | px/frame²| ~half of hero gravity.                      |
| `sapling.dartLifetimePx`        |             288 | px       | ~6 tiles or first solid hit.                |
| `sapling.dartDamage`            |               1 | HP       |                                             |
| `sapling.hurtFrames`            |               6 | frames   |                                             |
| `sapling.deathFrames`           |              45 | frames   |                                             |

---

## For Design

Concrete asset list. All sprite modules follow `docs/design/contracts.md` — palette
indices + frame matrices. **One sprite module per entity below.** Sizes are *target
in-canvas dimensions* in pixels; the canvas logical resolution is 768×576 with
`TILE = 48`, so a 36×48 hero is roughly three-quarters of a tile wide and one tile tall.

| Asset                          | Path                                  | Target frame size (w × h) | Anchor (px, top-left) | Animations (state : frame count)                                                  |
|--------------------------------|---------------------------------------|---------------------------|-----------------------|-----------------------------------------------------------------------------------|
| Hero — Reed Bramblestep        | `assets/sprites/hero-reed.js`         | 36 × 48                   | (18, 47) — feet center| `idle:3, walk:4, jump_rising:2, jump_falling:2, attack:3, hurt:2, dead:3`         |
| Stoneflake (hero projectile)   | `assets/sprites/proj-stoneflake.js`   | 12 × 12                   | (6, 6) — center       | `fly:2, splash:2` (splash on bounce / wall hit)                                   |
| Enemy — Crawlspine             | `assets/sprites/enemy-crawlspine.js`  | 48 × 24                   | (24, 23) — feet center| `walk:4, turn:2, hurt:1, dead:3`                                                  |
| Enemy — Glassmoth              | `assets/sprites/enemy-glassmoth.js`   | 48 × 32                   | (24, 16) — body center| `drift:4, swoop:2, recover:3, hurt:1, dead:3`                                     |
| Enemy — Bristlecone Sapling    | `assets/sprites/enemy-sapling.js`     | 48 × 48                   | (24, 47) — root center| `closed:2, windup:3, firing:2, cooldown:3, hurt:1, dead:3`                         |
| Sapling seed-dart              | `assets/sprites/proj-seeddart.js`     | 12 × 8                    | (6, 4) — center       | `fly:2`                                                                           |
| (Optional) Hit-spark VFX       | `assets/sprites/vfx-hitspark.js`      | 16 × 16                   | (8, 8) — center       | `pop:3` — for any contact resolution                                              |
| (Optional) Death-puff VFX      | `assets/sprites/vfx-deathpuff.js`     | 24 × 16                   | (12, 12) — center     | `puff:4` — small dust on enemy fade                                               |

Palette guidance per entity (Design picks hex values):

- **Reed:** `dawn-amber` (skin/cuffs), `moss-green` (tunic), `river-stone-grey` (pouch/sling), `cuff-cream` (highlights), `violet-shade` (shadow tones).
- **Crawlspine:** `bark-brown` (shell base), `chitin-bronze` (ridge), `moss-green` (under-edge), `violet-shade` (shadow).
- **Glassmoth:** `pearl-glass` (wing fill, semi-transparent palette index OK), `dust-pink` (wing edge), `morning-haze` (highlight), `violet-shade` (1 px inner outline).
- **Sapling:** `needle-pine` (bristles), `dawn-amber` (inner core when flared), `seed-bone-white` (darts), `bark-brown` (base/root).

Notes:

- **Anchor convention:** feet-center for grounded entities (hero, Crawlspine, Sapling),
  body-center for airborne (Glassmoth) and projectiles. Match the contract in
  `docs/design/contracts.md`.
- **No pure black ink** — see `docs/story/world.md` tone guidance.
- The Glassmoth's wings benefit from one transparent palette index for readability.
- Phase 1 doesn't need full enemy hurt-frames — a single all-lighter silhouette
  swap is enough for the hit flash.

---

## For Dev

Concrete entity/component layout. Where component names already exist in `CLAUDE.md`,
this brief uses them verbatim — adding *fields* rather than new components where it
can be helped.

### ECS components — new fields

These fit on existing components from the contract in `CLAUDE.md`. No new components
required for Phase 1.

```js
// On the existing 'enemy' component:
enemy: {
  type,        // 'crawlspine' | 'glassmoth' | 'sapling'
  dir,         // -1 | 1   (facing)
  ai,          // per-archetype FSM state (string from the FSMs below)
  hp,          // current HP
  // Phase 1 additions:
  hpMax,       // for hurt-flash and future UI
  stateTimer,  // frames remaining in current ai state (0 = transition eligible)
  cooldown,    // frames remaining before next 'attack-like' action (sapling volley, glassmoth swoop)
}

// On the existing 'projectile' component:
projectile: {
  type,        // 'stoneflake' | 'seeddart'
  lifetime,    // frames remaining
  // Phase 1 additions:
  bouncesLeft, // stoneflake: 1 → 0; seeddart: 0 (no bounce)
  ownerKind,   // 'hero' | 'enemy'  (for friendly-fire suppression)
  damage,      // 1
}

// On the existing 'player' component:
player: {
  facingRight,
  isJumping,
  // Phase 1 additions:
  hp, hpMax,
  iframes,         // frames remaining of post-hurt invulnerability
  attackCooldown,  // frames remaining
  coyoteTimer,     // frames since last grounded
  jumpBuffer,      // frames since last jump press (for input buffering)
}
```

### FSMs to implement

- **Hero:** see §2.2. Use `player.iframes`, `physics.onGround`, and input edges.
- **Crawlspine:** `walk` ↔ `turn`, edge/wall detection on the next-tile probe ahead.
  Hurt overlay handled at the damage-resolution step, not as a primary state.
- **Glassmoth:** `drift` → `swoop` (gated on `sight_range_x`, vertical-above-player,
  and `cooldown == 0`) → `recover` → `drift`. No landing — bounce off solid tiles.
- **Sapling:** timer-driven loop `closed → windup → firing → cooldown → closed`.
  Direction is locked at `windup`-start by sampling sign(`player.x - self.x`).

### Tunable parameter names (single config file recommended)

Suggest `src/config/PhaseOneTunables.js`. Names per §4 tables. Example shape (no
implementation):

```
HERO = { maxHp, walkSpeed, runSpeed, jumpVy0, gravity, jumpCutFactor,
         coyoteFrames, bufferFrames, attackCooldown, maxProjectiles,
         iframesHurt, knockbackVx, knockbackVy }
STONEFLAKE = { vx0, vy0, gravity, bounceFactor, maxBounces,
               lifetimeMax, damage }
CRAWLSPINE = { hp, contactDmg, walkSpeed, turnFrames, hurtFrames, deathFrames }
GLASSMOTH  = { hp, contactDmg, driftVx, driftAmplitude, driftFrequency,
               swoopVy, swoopFrames, recoverFrames, sightRangeX,
               driftAltitude, hurtFrames, deathFrames }
SAPLING    = { hp, contactDmg, windupFrames, firingFrames, cooldownFrames,
               dartsPerVolley, dartSpeed, dartGravity, dartLifetimePx,
               dartDamage, hurtFrames, deathFrames }
```

### Damage resolution rules

- A hero with `iframes > 0` ignores all enemy contact and projectile contact.
- A stoneflake despawns on the first enemy hit OR on second ground contact OR on
  any wall contact OR on `lifetimeMax`. Whichever first.
- A seed-dart despawns on hero hit OR on any solid tile OR on `dartLifetimePx`.
- Enemies do not friendly-fire each other (`ownerKind === 'enemy'` projectiles
  pass through enemy hitboxes).
- Sapling in `closed` has zero contact damage; in `windup`/`firing` it has full
  contact damage. Stoneflake hits land in any state — but the `closed` hitbox is
  intentionally smaller (the inner core).

### Test-stage acceptance (Phase 1 quartile gate)

Per `CLAUDE.md` v0.25 row: "player + ≥3 enemies move/attack on a single test stage;
no console errors." Suggested smoke check for the dev-lead:

1. Place 2 Crawlspines on a flat platform with a gap between them; both should turn
   at the gap edge without falling.
2. Place 1 Glassmoth above. It should sine-drift, swoop when Reed is below within
   range, miss-or-hit, and recover. Hitting the floor mid-swoop must not pin it.
3. Place 1 Sapling on a ledge. It should fire a 3-dart fan on a regular cadence with
   a visible windup. Stoneflakes must be able to kill it from below in ≥2 hits.
4. Reed must lose HP, gain i-frames, blink visibly, and recover. Three hits in a
   row should hit `hp == 0` exactly, not 4 (i-frame coverage check).

---

## Open questions for release-master

1. **Hero HP at Phase 1.** I've suggested `maxHp = 3` to keep the test stage tight.
   If the project intent is for the v0.25 build to feel forgiving (showcase build,
   not playtest build), bump to 5 — but say so before Design starts so the HUD
   art is sized once.
2. **Run vs. walk for Phase 1.** I've listed `runSpeed` as optional. If the dev-lead
   would rather omit a run button for v0.25 to keep input scope minimal, drop the
   parameter and the Hero brief stands as-is. Decide before Design hooks input
   prompts into the title screen.
3. **Translucent palette index for Glassmoth.** The contract reserves index 0 for
   transparent. Glassmoth wings *want* a partial-alpha index. Confirm with
   design-lead whether the contract permits more than one alpha-channel index, or
   whether we should fake translucency with a noise-stipple in the wing fill.
4. **Sapling closed-state damage.** I've ruled "closed = zero contact damage" so
   the player has a non-combat option (walk past on the right beat). If
   release-master wants the stage to be more aggressive, change `closed` to also
   deal contact damage — but the silhouette intent will need a redesign so the
   threat read is unambiguous when closed.
5. **Death drops in Phase 1.** I've left all enemies with no drops (no health, no
   currency). If v0.25 is meant to demo a pickup loop, we need a "stoneflake
   pebble" or "moss-fruit" pickup spec — that's a Phase 2 mechanic in my read,
   but flag it now if you want it pulled forward.

---

## Changelog

Edits after the brief was first published (per `docs/briefs/README.md`).

### 2026-05-09 — v0.25.2 (post-browser-smoke pivot)

Driven by user feedback after browser-testing v0.25.1. Three of the five "Open
questions" above are now decided differently from the original publication:

- **Q1 Hero HP at Phase 1 — REVISED.** The hero's HP system is **removed**.
  Vitality (the existing hunger gauge) is the **single life-line**: any contact
  with a damaging enemy state, any enemy projectile hit, or vitality reaching
  zero triggers an immediate game over. No hp counter, no i-frames, no
  knockback, no hit-blink. The intent is "one wrong step ends the run, but
  vitality keeps you moving."
- **Q2 Run vs. walk — DECIDED.** No run button in v0.25.x. May be revisited
  in v0.50 (Phase 2).
- **Q3 Glassmoth translucency — DECIDED in v0.25.** 8-digit hex `#rrggbbaa`
  permitted in palette entries (see `docs/design/contracts.md`).
- **Q4 Sapling closed-state damage — UNCHANGED.** Closed = 0 contact damage
  remains. Even with 1-hit-kill, the closed silhouette is still a navigable
  rest-beat in the rhythm.
- **Q5 Death drops — DECIDED.** No drops in Phase 1; revisit in Phase 3
  mechanics work.

**Key bindings updated** (v0.25.2):

- Jump: `Z` (Space kept as accessibility alternate). `↑` and `W` no longer jump.
- Attack: `X`. `Ctrl` removed (avoided browser-shortcut collision).

**Smoke check #4 in §"Test-stage acceptance" above is now obsolete.** With HP
removed, "three hits exactly to die" no longer applies. New smoke gate: any
single hit ends the run.

The cast itself (Reed Bramblestep + Crawlspine + Glassmoth + Bristlecone Sapling)
is unchanged in identity, silhouette, FSM topology, and color-mood. Only the
hero's hurt FSM and tunable set changed.

# Phase 3 — Boss cast brief: the Bracken Warden (v0.75)

> **Authoring agent:** story-lead
> **Consumers:** design-lead, dev-lead
> **Reviewer:** release-master
> **Companion docs:** `docs/briefs/phase3-area1-expansion.md`, `docs/briefs/phase2-cast-revision.md`, `docs/story/world.md`
> **한국어 버전:** [phase3-boss-cast.ko.md](./phase3-boss-cast.ko.md)

This brief defines **Area 1's boss** — a single end-of-Area encounter spec'd in full for v0.75. The boss fight lives at the end of Stage 4 (`The Old Threshold`) and is handed off to from `phase3-area1-expansion.md` §8. Boss spec includes silhouette intent, movement FSM, attack pattern, hit reaction, color-mood keywords, animation cue list, arena layout, camera behavior, win/lose conditions, and a tunable parameters table. Numeric quantities are *suggestions* for dev-lead to tune in code.

> **Tribute, not a port.** The boss is **original to this project**. The name (Bracken Warden), the silhouette (a kneeling moss-and-stone guardian rising from rest), the attack (a ground-pulse shockwave), and the arena beat are all invented for the Wonder Boy Tribute project. The "end-of-stage boss fight in a small locked room" beat is a universal action-platformer convention; its execution here uses only original art, original ECS structure, and original audio/timing.

---

## 1. Boss original name — **the Bracken Warden**

The Old Threshold was once watched by something. Long after the people of the Verdant Ruin stepped sideways out of the world, what they posted in their last room kept its post. Mosses grew over its shoulders, bracken fronds rooted in its joints, stone joinery slumped into stone joinery — but the **Warden** stayed. It does not chase Reed; it does not hate him; it raises its head only because the room woke it. **Threat-read: a part of the room raising up.**

**Coined-name etymology.**
- *Bracken* — the wild, broad-leaved ferns that have grown into the Warden over centuries. Original to this work; not a copyrighted creature name.
- *Warden* — a generic English word ("guardian of a place"); not a proper noun in any IP we know.
- Combined, **Bracken Warden** reads in both English and Korean without phonetic overlap with any specific Wonder Boy boss (we verified against the v0.50 cast — Mossplodder, Hummerwing, dawn-husk, Reed Bramblestep — and against `docs/story/world.md` lore). Korean rendering: **브랙큰 워든** (transliteration; the name stays verbatim per `CLAUDE.md` bilingual policy).

**Why this name and not another.**
- It is **rooted** — the boss is moss and stone, not metallic or aggressive.
- It is **descriptive** without being a job-title — "Warden" is what it does, "Bracken" is what it looks like.
- It is **not a creature class** — the player does not later fight more "Brackens." This is *the* Bracken Warden. Singular.
- It is **gentle in posture** — consistent with `docs/story/world.md` ("gentle, not grim"). The Warden is not malicious; it is *insistent*.

---

## 2. Silhouette intent

A **kneeling humanoid colossus** at the back wall of the arena. ~3 tiles wide × 4 tiles tall when fully risen (in the larger end of the brief's "3-4 tiles per side" range — see §10 for asset dimensions). When at rest (initial state, before Reed enters): the Warden sits hunched-forward, **one knee on the ground, both forearms resting on the bent knee, head bowed**. The silhouette reads as a **moss-covered cairn shape** — a stack of rounded forms, the topmost being the bowed head. The casual viewer's eye should read it as part of the room's terrain (a statue, a moss-mound) until it moves.

When **risen** (any state past `idle`): the head lifts, the chest opens, both arms unfold. The chest reveals a **carved dawn-amber sigil** — a vertical slit-shape that pulses warm. This is the Warden's living core; it is also the **visual telegraph hub** — every wind-up to an attack flares the sigil.

**Posture should read "guarding," not "predator."** The Warden does not crouch low or coil; it stands and waits. The arena belongs to it. Reed is the one who came in.

**Materials read:**
- Stone joinery showing through moss at the shoulders, elbows, knees — places where the bracken couldn't cover.
- Bracken fronds (broad fan-leaf curls) at the hips, between fingers, along the spine.
- Moss everywhere else — thick, layered, occasionally drooping.
- Carved-stone face: featureless except for a horizontal slit where eyes would be. The slit glows the same dawn-amber as the chest sigil only when the Warden is fully `windup` or `attack` — at `idle`, the slit is dark.

**Scale read.** Reed is 1 tile tall (36 × 48 sprite). Bracken Warden is ~3 tiles wide × 4 tiles tall when risen, ~3 tiles wide × 3 tiles tall when kneeling. The size ratio is ~1:4 — large enough to dominate the arena's 12 × 11 tile rectangle without filling it.

---

## 3. Movement FSM

States: `idle`, `windup`, `attack`, `recover`, `hurt`, `dead`.

```
        ┌───────── idle ──────────┐
        │ (kneeling, head bowed)  │
        ▼                         │
   Reed enters arena? OR          │
   recover timer expires?         │
        │ yes                     │
        ▼                         │
   ┌─────────┐  ~45 frames   ┌─────────┐  spawns shockwave  ┌──────────┐
   │ windup  │ ────────────► │ attack  │ ──────────────────►│ recover  │
   │ (sigil  │               │ (slam   │                     │ (sigil   │
   │  flares)│               │  arm)   │                     │  fades)  │
   └─────────┘               └─────────┘                     └────┬─────┘
                                                                   │ (~90 frames)
                                                                   ▼
                                                                  idle

   any non-dead state ── hatchet hit ──► hurt ── (~10 frames) ──► last state
   any state ── 7th hatchet hit ───────► dead   (terminal)
```

Notes for Dev:
- **`idle` is the rest state**, not a wandering state. The Warden does **not** move in `idle`. The kneeling pose is held. The first entry into `idle` (the initial pre-fight rest) is special: it remains `idle` indefinitely until Reed crosses the arena trigger col. All subsequent `idle` re-entries (after `recover`) hold for `idleFrames` ≈ 60 frames before re-entering `windup`.
- **`windup` is the telegraph.** The Warden raises its head, then raises one arm overhead. The chest sigil flares from dim to bright amber over the entire `windup` window. This is the player's reaction window — they have ~45 frames (~0.75 sec) to jump, sprint past, or position a hatchet throw.
- **`attack` is the slam.** The raised arm comes down hard onto the ground; on contact-frame, a **moss-pulse shockwave** spawns at the Warden's feet and travels left along the floor toward Reed (see §4 for the attack pattern).
- **`recover` is the cooldown.** The arm stays slumped against the floor; the sigil fades from bright to dim over the entire `recover` window. The Warden is most vulnerable to hatchet hits during `recover` (Design should depict the chest sigil as visibly exposed during this state). ~90 frames.
- **`hurt` is a brief stagger.** ~10 frames during which the Warden's silhouette flashes (1-frame all-lighter swap, à la v0.50 Mossplodder hit-flash, then 9 frames hold). The Warden's current state-position is preserved — the windup timer doesn't restart, just pauses for the hurt window. This keeps the attack cycle on a predictable beat regardless of how many hits the player lands.
- **`dead` is terminal.** Plays the death animation (§5) and then triggers the Area Cleared overlay flow (`phase3-area1-expansion.md` §8). The Warden does not despawn during the death anim; the body remains visible until the fade-to-black.

**State-transition triggers — formal.**

| From → To           | Trigger                                     |
|---------------------|---------------------------------------------|
| pre-`idle` → `idle` | Boss arena spawn — kneeling pose held.     |
| `idle` → `windup`   | Pre-fight: Reed crosses `bossArenaTriggerCol`. Post-recover: `idleFrames` elapsed. |
| `windup` → `attack` | `windupFrames` elapsed (~45 frames).        |
| `attack` → `recover`| Shockwave spawned on contact-frame (~12 frames into `attack`). After ~6 more frames of arm-slumped-on-ground, transition to `recover`. |
| `recover` → `idle`  | `recoverFrames` elapsed (~90 frames).       |
| any (not dead) → `hurt` | Hatchet hits the Warden's hitbox. Hurt is a brief overlay; state-machine returns to the prior state. |
| any (not dead) → `dead` | `hp` reaches 0 after a hatchet hit.      |

---

## 4. Attack pattern — the **moss-pulse shockwave**

ONE primary attack. Telegraphed by the `windup` arm-raise + chest-sigil flare. Spawned at the start of `attack` on a single contact-frame.

**Description.** On the slam, the ground at the Warden's feet **pulses outward** in a wave of moss-and-stone fragments. The wave travels **left along the floor** (toward Reed's spawn side) at constant velocity. It is **a single ground-hugging entity** — Reed can jump over it, dash past it (sprint = X-held), or block it with a hatchet (the hatchet absorbs the pulse and despawns; both die in the same frame). The wave despawns on the **arena's left wall** if it reaches.

**Why this attack, not others.**
- **Original to this project** — not a fire-spit (Drancon), not a fireball (Hottentots), not a swooping dive (no flying boss). Ground-pulse + jump-over is a universal platformer beat, not a copyrighted move.
- **Plays to Reed's existing kit.** Jump (Z), sprint (X-held), hatchet (X-tap). All three counter the wave. The player uses what they already know.
- **Telegraphed clearly.** ~45 frames of `windup` (~0.75 sec) is plenty of time for an experienced player and exactly enough for a fresh player.
- **Spatially readable.** The wave hugs the floor, travels in one direction, doesn't track Reed's altitude. A Reed who's airborne at the contact-frame is safe; a Reed on the floor must respond.
- **Lets the player counterattack.** During `recover` (~90 frames), the Warden's chest sigil is exposed. Reed has roughly 1.5 seconds per attack-cycle to throw a hatchet at the sigil.

**Wave properties.**

| Property                  | Suggested value          | Notes                                           |
|---------------------------|--------------------------|-------------------------------------------------|
| `wave.heightTiles`        | 1                        | Single-tile-tall. Reed jumps over it.           |
| `wave.widthTiles`         | 1                        | Single-tile-wide forward face.                  |
| `wave.vx`                 | -3.5 px/frame            | Travels left. Same speed as Reed's walk — *the player can outrun the wave by sprinting*. (Sprint at 1.4× = 4.9 px/frame > 3.5.) |
| `wave.contactDmg`         | kill                     | 1-hit-kill on Reed contact (per v0.25.2 rule).  |
| `wave.lifetimeFrames`     | 240                      | Hard cap (~4 sec). Despawns on left wall first. |
| `wave.hatchetInteraction` | mutual-despawn           | Hatchet kills wave; wave kills hatchet.         |

**Spawning sequence (frame-by-frame).**

| Frame from `attack` start | Event                                                                |
|---------------------------|----------------------------------------------------------------------|
| 0                         | `attack` state begins. Sigil at peak brightness. Arm at apex.        |
| 0-11                      | Arm swings down (3 frames of animation, 4 frames each).               |
| 12 (contact-frame)        | **Shockwave entity spawns at Warden's feet, vx = -3.5.** Sigil dims one notch. |
| 12-17                     | Arm rests on the ground (6 frames of hold).                          |
| 18                        | Transition to `recover` state.                                       |

**Wave visuals.** A short upward burst of moss-and-stone particles at the leading face (1-tile-tall), with a trailing ground-blur that fades over ~10 px behind the leading face. Color: `mosaic-cool` for the moss particles, `dawn-channel-amber` for the warm glow at the wave's base, `velvet-shadow` for the trailing blur. The wave should read distinctly different from any v0.50 entity — there is no hazard or projectile in v0.50 that hugs the ground horizontally.

**Edge case: Reed inside the wave on spawn.** If Reed is on the floor at the Warden's feet when the wave spawns (improbable but possible — Reed walked directly into the windup and didn't jump out), Reed dies on the contact-frame. There is no shockwave-grace-frame; this is consistent with the v0.50 instant-kill posture.

---

## 5. Hit reaction

**Hatchet hits stagger the Warden briefly.** When a hatchet hits the Warden's hitbox:

- The current state's timer **pauses** for `hurtFrames` (≈ 10 frames).
- The Warden's silhouette flashes: frame 1 = all-lighter palette swap (1-frame; matches v0.50 hit-flash convention), frames 2-10 = hold prior state's last visible frame with the sigil briefly fading.
- HP decrements by 1.
- The hatchet **despawns on contact**, same as any other Phase 2 hatchet hit on any entity (no bounce; per `phase2-cast-revision.md` §6).
- **Knockback: none.** The Warden does not get pushed around. It is a kneeling colossus; it stays put.

**HP: 6 hits.** Suggested starting value (Dev tunes). Inside the brief's 5-7 hits range. At 6 hits with a 2-hatchet on-screen cap and a 12-frame attack cooldown, a player can land 1-2 hits per `recover` window (~90 frames). The fight runs roughly:

- Attack cycle = 45 (windup) + 18 (attack-with-spawn) + 90 (recover) + 60 (idle) ≈ 213 frames (~3.55 sec) per loop.
- Player lands 1 clean hit per cycle = 6 cycles to kill = ~21 sec, plus dodging time.
- Player lands 2 clean hits per cycle = 3 cycles to kill = ~10 sec, requires perfect throw timing.

**Hitbox.** The Warden's hatchet-vulnerable hitbox is centered on the **chest sigil** (a roughly 1-tile-tall × 1-tile-wide area in the center of the silhouette). Hatchets that miss the sigil and strike moss/bracken should despawn harmlessly. This places skill into the throw: a clean throw at chest height during `recover` lands; a low-arc throw at the kneeling Warden's feet does not.

**On the final hit (HP → 0).** The Warden enters `dead`. Plays death animation §6. Boss arena flow proceeds per `phase3-area1-expansion.md` §8.

---

## 6. Color-mood keywords

For Design (hex picked per `docs/design/palette-phase2.md` conventions; this brief specifies mood anchors only):

- `old-stone amber` — the warm light leaking from the chest sigil and the eye-slit. Slightly deeper than Stage 1's `dawn-amber`; reads as **stored heat**, not direct sunlight. Hex sibling family: `e8a040` / `f8d878`-adjacent.
- `moss-shadowed violet` — the violet-grey shade beneath the moss layer where bracken can't reach. Stage 4's `pillar-shadow-violet` (per area-expansion brief §7); should be reused verbatim. Hex sibling family: `3a2e4a` / `5a4a6e`-adjacent.
- `bracken-frond green` — broad-leafed fern green. A **slightly cooler, more saturated** cousin of Stage 1's `moss-green` — the bracken has grown deeper than the path moss has. Hex sibling family: `4a7c3a` / `3e6a3a`-adjacent.
- `stone-joinery pale` — the visible carved-stone joints (shoulders, elbows, knees). A pale, slightly-warm grey lifted from Stage 4's `carved-stone-pale`. Reads as **the boss is made of ruin**.
- `cairn-mantle cool` — the moss-mantled outer silhouette at rest. A deeper cousin of `bracken-frond green`; the moss has layered over the bracken over the years.
- `sigil-amber peak` — the chest sigil at full flare during `attack`. Should be the brightest amber in the entire boss palette — reuse `#f8d878` (Sapling amber-bright, retired but available; per `palette-phase2.md` shared-hex policy).

The palette should rhyme with the Stage 4 ruin tile palette without copying it — the Warden should look **made of the same material** as the floor and pillars, just animated.

**Cross-palette consistency rules (per `palette-phase2.md` §"Cross-sprite consistency rules — Phase 2"):**

- **Violet ink:** the Warden's silhouette outline uses `#3a2e4a` (the universal Phase 2 ink). No exceptions.
- **Dawn amber for warmth:** the sigil, the eye-slit, and the shockwave's base glow all share the `dawn-amber` / `sigil-amber peak` family. Warmth = sigil family. No new amber hue introduced for the boss.
- **No pure black anywhere:** the moss-shadows under the Warden's bracken are violet-grey, not black. Per `docs/story/world.md`.

---

## 7. Animation cue list (minimum frames per state)

| State    | Frames | What changes between frames                                                                                                                |
|----------|-------:|----------------------------------------------------------------------------------------------------------------------------------------------|
| `idle`   |      3 | (1) head-bowed neutral, (2) tiny breath rise — chest sigil flickers 1 px brighter then back, (3) head-bowed neutral. Loops at low fps (~3 fps). The Warden looks like it's sleeping. |
| `windup` |      4 | (1) head lifts, eye-slit kindles, (2) chest opens, sigil flares from dim to mid, (3) right arm rises overhead, (4) arm at apex — sigil at peak brightness. ~12 fps. The 4 frames spread evenly across the 45-frame windup so the player sees a continuous wind-up. |
| `attack` |      3 | (1) arm mid-swing — body twisting forward, (2) arm landing — moss particles bursting from impact, (3) arm flat on ground — shockwave separating away. ~16 fps. Each frame holds for 4 frames of the 12-frame `attack` lead-in. |
| `recover`|      4 | (1) arm slumped on ground, sigil mid-bright, (2) Warden's torso eases back toward kneel pose, sigil dimming, (3) arm lifts off ground, sigil dim, (4) Warden settles back to kneel — sigil minimum bright. Spread across the 90-frame recover. ~3 fps. |
| `hurt`   |      2 | (1) full-silhouette lighter palette flash (1 frame), (2) hold prior state's last frame with sigil briefly faded (9 frames). |
| `dead`   |      5 | (1) Warden's chest sigil ruptures — bright flare, (2) Warden tilts backward, head turning to face up, (3) collapse begins — torso falls back against the rear wall, (4) Warden flat against the wall, bracken splayed outward, (5) settled — moss layer thickens visibly (the room is reclaiming it). Plays across ~60 frames at ~5 fps. |

**Design's discretion on tween frames.** The counts above are minimums per `phase1-cast.md` §2.6 convention. Design may add more frames if it preserves the cue read; do not add fewer.

---

## 8. Arena layout

**Arena dimensions.** ~12 tiles wide × 11 tiles tall. Slightly less than the viewport's 16 × 12 tile space so an HUD strip stays visible at the top of the screen.

```
                          (HUD strip — top 1 tile reserved for lives/vitality)
        ┌───────────────────────────────────────────────────────────┐ (row 0 — out of arena, HUD only)
        ▕                                                            ▕
        ▕   (closed roof — ruin chamber's domed ceiling — visual)    ▕
        ▕                                                            ▕
        ▕                                                            ▕
        ▕                                                            ▕
        ▕                                                            ▕
        ▕         (open arena interior — empty floor + walls)        ▕
        ▕                                                            ▕
        ▕                                                            ▕
        ▕    R (Reed enters here)                              W →   ▕  W = Warden, kneeling, faces left
        ▕    →                                                       ▕
        █████████████████████████████████████████████████████████████  (row 11 — solid arena floor)
        col 0                                                     col 11
                                                                       (arena right wall is solid; Warden cannot move past it; Reed cannot escape past it)
```

**Specifics.**
- **Arena interior:** cols 0-11 (12 tiles wide), rows 0-10 within the arena (11 rows tall). Floor row = row 10 (one tile tall).
- **Walls:** the arena's left wall is the **camera-lock boundary**, not a solid tile per se — Reed enters from the anteroom continuously; the camera locks once Reed is fully inside. The arena's right wall **is solid**: a 1-tile-thick column at col 11, full 11 rows tall.
- **Ceiling:** decorative (drawn as the ruin's domed ceiling). Reed cannot reach it with a jump (jump apex ≈ 2.3 tiles ≪ 11 tiles).
- **Reed spawn:** col 1, row 9 (one tile above the floor, one tile in from the left edge). Reed enters facing right.
- **Warden spawn (kneeling pose):** col 9, row 7 (one tile in from the right wall, with the kneeling silhouette occupying ~rows 7-10). Faces left.
- **Camera lock position:** the camera anchors with the arena's left edge at viewport col 0. The viewport is 16 tiles wide; the arena is 12 tiles; the remaining 4 viewport columns to the right show the anteroom's continuation or the closed ceiling extending right, design-lead's call.

**Why this layout.**
- 12 wide gives Reed ~10 tiles of running space at one tile per side margin — enough to outrun the shockwave by sprinting, not so much that he can ignore it.
- 11 tall preserves the verticality Reed has been training in across Stages 1-3 (his jump apex matters; the shockwave is jump-overable).
- Solid right wall = the Warden cannot retreat; the fight ends one way.
- No floor gaps inside the arena = the Warden's shockwave can travel cleanly along the floor without falling into a hole. Spatially clean.

---

## 9. Camera behavior during the fight

**Pre-fight.** Standard v0.50.1 camera lerp: player ~1/3 from left, clamped to stage edges. Camera tracks Reed normally as he walks through the Stage 4 Round 4-4 anteroom.

**At arena entry (Reed crosses col 32 of Round 4-4).** Camera **locks** with the arena's left edge aligned to viewport col 0. The camera does not scroll for the duration of the fight. Reed's free movement is preserved; only the camera is fixed.

**During the fight.** Camera locked. No scroll.

**At boss death (HP → 0).** Camera remains locked for the death animation (~60 frames). After the death anim, a ~60-frame celebratory pause (Reed can move, but there is nothing left to do). Then the Area Cleared overlay fade fires (`phase3-area1-expansion.md` §8).

**On Reed's death inside the arena.** Camera **unlocks immediately** when the dying-frames begin (so the death animation plays in normal scroll context). After respawn at `mile_16` (Round 4-4 col 3), camera tracks Reed normally back through the anteroom; on re-crossing col 32, camera re-locks.

**Why unlock on Reed's death and not on boss spawn-retry?** Two reasons: (1) the boss returning to its post-spawn kneel needs no camera scroll, but Reed walking back to the arena does; (2) the player's death animation deserves the same screen treatment as deaths anywhere else in the stage — a locked camera during death would make Reed's death feel different from a stage death, which is confusing.

---

## 10. Boss asset spec

Per `docs/design/contracts.md` and v0.50 module precedents.

| Asset                          | Path                                  | Frame size (w × h)                 | Anchor (px, top-left)              | Animations                                                           |
|--------------------------------|---------------------------------------|------------------------------------|------------------------------------|----------------------------------------------------------------------|
| Boss — Bracken Warden          | `assets/sprites/boss-bracken-warden.js` | **144 × 192** (3 tiles × 4 tiles when risen; the kneeling pose occupies the lower portion) | **(72, 191)** — feet center, aligned to floor row | `idle:3, windup:4, attack:3, recover:4, hurt:2, dead:5` |
| Shockwave projectile           | `assets/sprites/proj-mosspulse.js`    | 48 × 48 (1 tile × 1 tile)          | (24, 47) — feet center             | `travel:2, despawn:2`                                                |

**Per-anim fps.** Use the v0.50.1 `animFps` override pattern per-key. Suggested values:

| Animation | fps   | Why                                                       |
|-----------|-------|-----------------------------------------------------------|
| `idle`    | 3     | Slow breath — the Warden is sleeping.                     |
| `windup`  | 12    | Snappy rise — the player needs to read the telegraph.     |
| `attack`  | 16    | High fps on the slam contact frame.                       |
| `recover` | 3     | Slow settle — the Warden is vulnerable; show the cool-down. |
| `hurt`    | 16    | Single flash frame at high fps.                           |
| `dead`    | 5     | Mid-tempo collapse.                                       |

**Palette anchors.** Per §6 mood keywords. Design picks hex per `docs/design/palette-phase2.md`. Boss palette is the **largest single new palette in v0.75**; suggested ~12-18 distinct hex entries (boss silhouette, sigil, eye-slit, moss layers, bracken-frond fans, stone joinery, shockwave particles). Reuse `#3a2e4a` (ink), `#f8d878` (sigil-peak), `#e8a040` (sigil-mid) verbatim per cross-palette consistency.

**Frame-size note.** 144 × 192 is large for a sprite module. Design-lead may choose to ship the Warden as a multi-part sprite (kneeling-body fixed, arm/head as overlay layers) to reduce per-frame data — implementation detail, not story-lead's call. The sprite contract per `docs/design/contracts.md` permits any frame size; the cache will allocate one OffscreenCanvas per frame.

---

## 11. Suggested tunables (Dev to tune)

All values are starting points based on the 60 fps fixed-step loop and `TILE = 48`.

### 11.1 Bracken Warden — state timing

| Parameter                          | Suggested start | Units    | Notes                                                                  |
|------------------------------------|----------------:|----------|------------------------------------------------------------------------|
| `bracken.hp`                       |               6 | hits     | Within brief's 5-7 range. Tune up for harder, down for forgiving.       |
| `bracken.hpMax`                    |               6 | hits     | For boss HUD if dev-lead ships one (recommended; flag §15 Q3).         |
| `bracken.idleFrames`               |              60 | frames   | Time held in `idle` between attack cycles (after the first).            |
| `bracken.windupFrames`             |              45 | frames   | Telegraph window (~0.75 sec). Tune up for forgiving, down for hard.    |
| `bracken.attackFrames`             |              18 | frames   | Total `attack` state duration. Shockwave spawns at frame 12.            |
| `bracken.attackSpawnFrame`         |              12 | frames   | Sub-frame within `attack` when shockwave entity spawns.                 |
| `bracken.recoverFrames`            |              90 | frames   | Vulnerable window (~1.5 sec). Tune up to give player more hatchet time.  |
| `bracken.hurtFrames`               |              10 | frames   | Hit-flash hold; pauses other timers during.                              |
| `bracken.deathFrames`              |              60 | frames   | Total death animation duration. ~1.0 sec.                              |
| `bracken.celebrationFrames`        |              60 | frames   | Pause after death anim, before Area Cleared overlay fade-out.            |

### 11.2 Bracken Warden — spatial

| Parameter                          | Suggested start | Units    | Notes                                                                  |
|------------------------------------|----------------:|----------|------------------------------------------------------------------------|
| `bracken.bodyWidthTiles`           |               3 | tiles    | Risen silhouette width.                                                 |
| `bracken.bodyHeightTilesRisen`     |               4 | tiles    | Risen silhouette height.                                                 |
| `bracken.bodyHeightTilesKneel`     |               3 | tiles    | Kneeling silhouette height.                                              |
| `bracken.hitboxOffsetX`            |              48 | px       | Center of chest sigil from sprite left edge (~1 tile in).               |
| `bracken.hitboxOffsetY`            |              72 | px       | Center of chest sigil from sprite top edge (~1.5 tiles down).            |
| `bracken.hitboxWidth`              |              48 | px       | 1 tile wide.                                                             |
| `bracken.hitboxHeight`             |              48 | px       | 1 tile tall.                                                             |
| `bracken.spawnTileCol`             |               9 | tiles    | Spawn position in arena (col 9, kneeling at right side).                 |
| `bracken.spawnTileRow`             |               7 | tiles    | Spawn position in arena (row 7, kneeling base at row 10).                |

### 11.3 Moss-pulse shockwave

| Parameter                          | Suggested start | Units      | Notes                                                                  |
|------------------------------------|----------------:|------------|------------------------------------------------------------------------|
| `mosspulse.vx`                     |            -3.5 | px/frame   | Direction = left (toward Reed). Speed = Reed's walk.                    |
| `mosspulse.lifetimeFrames`         |             240 | frames     | Hard cap (~4 sec). Despawns earlier on left-wall contact.               |
| `mosspulse.heightPx`               |              48 | px         | 1 tile tall.                                                            |
| `mosspulse.widthPx`                |              48 | px         | 1 tile wide.                                                            |
| `mosspulse.contactDmg`             |            kill | n/a        | 1-hit-kill on Reed contact.                                             |
| `mosspulse.hatchetInteraction`     | mutual-despawn  | enum       | Wave + hatchet both die on contact.                                     |

### 11.4 Boss arena

| Parameter                          | Suggested start | Units     | Notes                                                                  |
|------------------------------------|----------------:|-----------|------------------------------------------------------------------------|
| `arena.widthTiles`                 |              12 | tiles     | Arena interior width.                                                   |
| `arena.heightTiles`                |              11 | tiles     | Arena interior height.                                                  |
| `arena.cameraLockCol`              |              32 | tiles     | Round 4-4 column at which camera locks (see §7.4 of expansion brief).   |
| `arena.bossSpawnCol`               |              41 | tiles     | Round 4-4 column where Warden's spawn is (arena's col 9 + cameraLockCol). |
| `arena.heroSpawnCol`               |              33 | tiles     | Round 4-4 column where Reed appears in the arena (arena's col 1 + cameraLockCol). |
| `arena.rightWallCol`               |              43 | tiles     | Round 4-4 column where arena's right wall is.                            |

### 11.5 Player interaction (no new tunables — verifying carry-over)

- Reed retains existing tunables. `HERO.walkSpeed`, `HERO.jumpVy0`, `HERO.gravity`, `HATCHET.*` — all unchanged. Sprint via X-held still works inside the arena.
- Hatchet attack cooldown remains `HATCHET.attackCooldown = 12` frames; 2-on-screen cap remains. Player can fire two hatchets in quick succession during boss `recover`.

---

## 12. Win condition

**Boss HP reaches 0 → death animation plays → celebratory pause → Area Cleared overlay.**

Detailed sequence (per `phase3-area1-expansion.md` §8):

1. Hatchet contact on `bracken.hp = 1` causes `bracken.hp → 0`. Transition to `dead`.
2. `dead` animation plays (~60 frames per §11.1 `deathFrames`).
3. Celebratory pause (~60 frames per §11.1 `celebrationFrames`). Reed can move but cannot attack (the only attackable target is gone; the camera is still locked).
4. Fade-to-black over ~60 frames.
5. **Area 1 Cleared overlay** holds ~5 seconds (or until any input):
   ```
   Area 1 — The Mossline Path
   Cleared.

   The threshold opens. Reed walks on.

   Area 2 ahead in v0.85.
   ```
   Bilingual parallel in the KO file. The "v0.85" line is release-honest copy — see Open Questions §15.
6. Terminal beat: title screen, or hold the overlay indefinitely (dev-lead's call; consistent with v0.50 cairn-clear ritual).

**Run-best capture.** Out of scope for v0.75. If release-master wants a future leaderboard feature, the values to capture at this beat are: `state.lives` remaining, total elapsed frames since Area 1 spawn, hatchet-hits taken to kill the Warden. None of these affect overlay copy in v0.75.

---

## 13. Lose conditions

Two ways Reed loses inside the boss arena. Both are the standard v0.50.2 dying + respawn flow; nothing new.

**1. Boss contact (`bracken` in any state except `dead`).** Reed walks into the Warden's body hitbox = `state.killHero(player)` via the standard contact-damage path. Hero contact hitbox vs. Warden body hitbox; per v0.25.2 rule, any non-dead enemy state deals 1-hit-kill.

**2. Moss-pulse shockwave contact.** Reed touches the active shockwave entity = `state.killHero(player)`. Per `mosspulse.contactDmg = kill`. Reed mid-air (above the shockwave's 1-tile silhouette) is **safe**; Reed must be at floor altitude to die.

**Respawn flow** (per `phase3-area1-expansion.md` §8 + v0.50.2 dying FSM):

- `state.beginDying(player)` → 45-frame dying timer + knockback + death anim.
- `state.loseLife()` → `state.lives -= 1` → respawn at `mile_16` (Round 4-4 col 3) with `pl.armed` preserved.
- **Boss resets:** Warden returns to `idle` at spawn, full HP, all timers cleared. Camera unlocks (Reed is back in the anteroom).
- **Re-entry:** Reed walks the anteroom again, re-crosses col 32, camera re-locks, Warden begins `idle → windup` cycle from scratch.

**GAME OVER path.** If `state.lives` hits 0 inside the boss fight, the v0.50.2 GAME OVER flow runs. After Continue:
- Lives refill to 3.
- Vitality fills to max.
- StageManager rebuilds **the full Area from Stage 1 spawn**, unarmed. Per `phase3-area1-expansion.md` §2 — full Area reset.
- Boss has no memory of damage taken across Continue.

**No Stage 4 restart shortcut.** A player who runs out of lives at the boss does NOT get a "restart from Stage 4 spawn" mercy. They restart at Stage 1. This is consistent with the Phase 2 spirit — the run is the journey; the boss is the reward beat. Release-master may want to soften this for accessibility — flag in §15.

---

## 14. Smoke checks (v0.75 quartile gate — boss-specific)

Per the area-expansion brief §13.6 + this brief:

1. **Boss entry.** Reed crosses Round 4-4 col 32. Camera locks at viewport col 0 = Round 4-4 col 32. Warden plays `idle → windup` transition; sigil flares.
2. **Telegraph read.** Watch the `windup` animation play across 45 frames; verify the arm rises overhead by the last frame. Sigil at peak brightness.
3. **Shockwave spawn.** At frame 12 of `attack`, shockwave entity spawns at the Warden's feet (Round 4-4 col ≈ 41-42), vx = -3.5. Wave travels left along the floor.
4. **Jump over.** Reed jumps before the wave reaches him. Wave passes under; Reed lands safely.
5. **Sprint past.** Reed sprints (X-held) past the wave at 4.9 px/frame; the wave at -3.5 px/frame doesn't catch him. Verify Reed clears the wave traveling right while wave travels left.
6. **Hatchet hit on boss.** Reed throws a hatchet at the Warden's chest sigil during `recover`. Hatchet contacts hitbox → boss flashes hurt → `bracken.hp` decrements → hatchet despawns.
7. **Hatchet vs. shockwave.** Reed throws a hatchet at an active shockwave. Wave + hatchet both despawn. Reed lives.
8. **Boss kill.** Six hatchet hits land cleanly during `recover` windows. Sixth hit triggers `dead` state. Death anim plays (60 frames). Celebratory pause (60 frames). Fade to black. Area Cleared overlay appears.
9. **Reed dies (boss contact).** Reed walks into the Warden's body. Dying anim + respawn at `mile_16` + boss resets to full HP + camera unlocks. Reed walks back to col 32; camera re-locks; fight restarts.
10. **Reed dies (shockwave).** Reed is on the floor at the contact-frame. Same flow as #9.
11. **GAME OVER inside boss.** Lose 3 lives in the arena. GAME OVER overlay appears. Press any key → Continue → full Area reset → Reed spawns at Stage 1 col 0 unarmed.
12. **No console errors at any beat.**

---

## 15. Open questions for release-master

1. **Boss difficulty calibration.** I've suggested HP 6, windup 45 frames, recover 90 frames. If first-pass playtest shows the fight is too short (clears in 2 attack cycles), raise HP to 7 and consider windup → 30 frames. If too long, drop HP to 5. Decide a target clear-time before Design ships final animations — the windup-frame count drives the animation pacing.

2. **Boss HP display.** Should Reed see the Warden's HP via a visible bar (top-of-screen secondary HUD, below lives) or read it only from the boss's silhouette (sigil fades / cracks visible as HP drops)? Recommendation: **silhouette read** for v0.75 (more elegant, no new HUD asset); add explicit bar in a later patch if playtest reports confusion. Flag now to avoid late HUD-art work.

3. **Continue → boss room shortcut.** Currently Continue restarts the full Area from Stage 1. Consider an alternative for accessibility: **first** Continue restarts from Stage 1 (the intended run); **subsequent** Continues in the same session start at Stage 4 spawn (the "I just want to fight the boss" mercy). Not recommended for v0.75 (out of scope, dilutes the journey), but flag if release-master wants to pull forward.

4. **Area 2 ahead in v0.85.** The Area Cleared overlay copy claims a v0.85 patch. Per `CLAUDE.md` quartile table, v0.75 is the multi-area quartile and v1.0 is full-content; there is no v0.85 quartile. The copy reads release-honest but the patch number doesn't exist. Pick a real future-pointer: **"more terrain ahead in v1.0"**, **"the threshold opens onto another road — for now"**, or **"the path continues — soon"** (re-using v0.50.1's Stage-Cleared softer copy). Bilingual parallel needs authoring either way.

5. **Boss audio.** Out of scope for this brief (story-lead doesn't spec audio). But: the Warden's `windup` should have a distinctive build-up sound (low rumble), the `attack` slam should be a percussive thud (woody/wet per `docs/story/world.md`), and the `dead` animation should end with the world's signature "small inhale" rather than a roar or scream. Flag for design-lead's audio companion (if briefed).

---

## Changelog

(None at publication.)

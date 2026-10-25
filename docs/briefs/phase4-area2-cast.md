# Phase 4 — Area 2 cast brief: the Cinder Reach (v1.0)

> **Authoring agent:** story-lead
> **Consumers:** design-lead, dev-lead
> **Reviewer:** release-master
> **Companion docs:** `docs/briefs/phase3-area1-expansion.md`, `docs/briefs/phase3-boss-cast.md`, `docs/briefs/phase4-audio.md`, `docs/story/world.md`
> **한국어 버전:** [phase4-area2-cast.ko.md](./phase4-area2-cast.ko.md)

This brief defines **Area 2 — the Cinder Reach** for the v1.0 release, layered on top of v0.75.1 Area 1 (the Mossline Path). It covers (1) the area's narrative posture and four-stage thematic progression, (2) three new enemy archetypes spec'd with FSM and tunables, (3) the Area 2 boss (the **Reignwarden**) spec'd at the same fidelity as Phase 3's Bracken Warden, and (4) two new pickup items. Numeric quantities are *suggestions* for dev-lead to tune in code; visual specs are *intent*, not pixel-exact prescriptions.

> **Tribute, not a port.** Every name, silhouette, attack pattern, and arena beat in this brief is original to this project. The "next area is a different biome with new cast and a final boss" structure is a universal action-platformer convention; the execution here uses only original art, original FSMs, and original audio cues (see `phase4-audio.md`). No Wonder Boy character, location, enemy, or boss name appears in this brief.

---

## 0. Where Area 2 sits in the run

Area 1 closes with the Bracken Warden falling silent in the canopy glade at the end of Stage 4 (the Old Threshold dark forest). The Area-Cleared overlay (v0.75) currently loops the run back to Stage 1; in v0.75.1 this was tweaked to loop to Area 1 Stage 1. **For v1.0 we replace that loop with a real Area 1 → Area 2 transition.**

Narratively: when the Warden lay down again, the canopy let a shaft of dawn light through that had not touched the glade floor in a generation. Reed steps through it and finds an **old switchback path** climbing out of the glade, up the cliffside the Old Threshold had been sitting under all along. The Verdant Ruin (Area 1) is in a sunken bowl; **the world above is what Reed is climbing into for the first time.** That elevated landscape is **the Cinder Reach** — wind-scoured upland the Ruin's people once posted beacons on, before the Warden took station.

Palette and mood are **maximally different from Area 1**:

| Axis           | Area 1 (Mossline Path)         | Area 2 (the Cinder Reach)                                   |
|----------------|--------------------------------|-------------------------------------------------------------|
| Dominant hues  | mossy green, dawn amber on dark soil | stone-bone, dawn-amber, ember-rose at boss                 |
| Light          | filtered through canopy        | overhead, harsh on bare rock; shafts at switchbacks         |
| Terrain        | flat-to-rolling forest, slopes | climbing terraces, narrow ridges, cliff-edges                |
| Hazards        | water gaps, crystal veins, dark | wind pressure, cliff-falls, ember-pits (boss only)          |
| Atmosphere     | enclosed, intimate             | exposed, vertical, breathy                                  |

The Cinder Reach is **not hostile**. The wind blows because the air does, not because it is hunting Reed. The enemies are *occupants* of the upland — they were here before Reed climbed up. The boss (the Reignwarden) is a stone-and-ember twin of the Bracken Warden, posted on the highest beacon-tower. Same posture intent: *guarding, not predatory.* Same closure beat: it lays down when defeated.

---

## 1. Four-stage thematic progression

Area 2 has **4 stages**, numbered 1-4 within the area (dev-lead: stage index resets to 1 per area; the bilingual stage name is what the player sees in the overlay). Each stage continues the climb from Area 1's canopy glade up to the beacon-tower summit.

| Stage | Internal name      | Korean (overlay)        | Theme & terrain                                                                                  |
|-------|--------------------|-------------------------|--------------------------------------------------------------------------------------------------|
| 2-1   | The Switchback    | 산허리길                  | The climbing stage. Stone steps zig-zagging up the cliff. Mossy at the bottom, drier near the top. Slope-heavy. Old wooden waystones (decorative). |
| 2-2   | The Beacon Walk   | 봉수대 옛길                | Open ridge. Cliff-fall hazard on one side (water_gap-style fatal tiles). Mild horizontal wind (visual only — drifting embers + slight palette shift). Beacon-tower wrecks dot the ridge. |
| 2-3   | The Knifing        | 협곡                     | A narrow rock-gully cut into the upland's spine. Strong wind pressure (visual: more aggressive ember drift). Peak enemy density of the area. Tight platforming. |
| 2-4   | The Reignward      | 봉수대 마루                | Windless summit flat. A beacon-tower pedestal at far right (the arena). Cinder pits in the floor of the arena once the boss attacks. The view opens — the whole Verdant Ruin is visible below. |

**Stage 2-1 visual notes (design):** The cliffside on the left rises beyond the viewport (tall stone wall, mossy at the bottom, drier at the top — a vertical gradient). The path has 22°/45° slope tiles for the zig-zag; flat platforms at switchback corners. **Reuse area1-stage1 forest tileset for the bottom 3 tile rows** — the Switchback starts at the forest edge and exits onto open rock by mid-stage. Top tile rows use a new **stone-terrace tileset** (see asset checklist §6). One mile-marker per round (so 4 mile-markers in Stage 2-1, matching Area 1).

**Stage 2-2 visual notes:** Wide-open ridge. Background parallax is **distant sky + far-mountains + closer-mesa** (no canopy). Decorative beacon-tower wrecks every ~12-16 columns (broken stone arches, dawn-amber lens-fragments embedded in stone). Foreground tile is a **bare-rock platform tileset** (stone-bone palette). **One stage-spanning cliff-fall hazard:** every ~8 columns there is a one-tile-wide pit edged with `fatal` tile type (treated like water_gap in CombatSystem._heroVsFatalTile). Stage-wide: keep the player engaged but not punishing — the platform widths are forgiving (3-4 tile gaps minimum).

**Stage 2-3 visual notes:** The gully has rock walls on both sides (tall vertical stone columns, mid-distance parallax tighter than 2-2). Foreground tile is **gully-floor tileset** (variants on the bare-rock with darker shadow on top). Enemy density: ~7-9 spawns across the stage (Area 1 stages averaged 5-7). Mix all three Area 2 enemy types here. **No new hazard tiles** — the difficulty comes from enemy density + tight platforming + the harsher wind visual (faster ember drift in parallax).

**Stage 2-4 visual notes:** Summit-flat. **Pre-boss section is 8-10 tile columns long** — the player approaches the beacon-tower pedestal across a windless flat. Floor is **the boss tileset** (warmer dawn-amber stone, see §6). Decorative beacon-tower wrecks tightly clustered (this is the ceremonial top of the ridge). Background parallax shows the **Verdant Ruin sunken bowl** in the far distance (a callback) and a wide open sky with a single beacon-tower pedestal at the horizon. The boss arena is the right ~16 tile columns; camera locks at trigger col like Area 1.

---

## 2. Three new enemy archetypes

The three Area 2 enemies share Area 1's tribute aesthetic but are **visually and mechanically distinct** from Area 1's Mossplodder / Hummerwing / Threadshade cast. Quick read:

| Enemy        | Role                 | Movement                 | HP | Stomp-vuln? | Hatchet-kill |
|--------------|----------------------|--------------------------|----|-------------|--------------|
| Cinderwisp   | windborne drifter    | sine-path, slow drift left | 1  | yes         | 1 hit        |
| Quarrywight  | armored ground walker | slow walk, ~0.5× speed   | 2  | **no**      | 2 hits (first chips armor) |
| Skyhook      | cliff dropper        | FSM (perch → fall → walk) | 1  | yes (walking phase only) | 1 hit |

### 2.1 Cinderwisp — windborne ember drifter

A small, weightless ember-bound creature that has drifted up from the cinder pits at the summit. **Visually:** a horizontal-oval bundle of bracken-husk and dawn-amber ember-grit, ~24×24 px, with two trailing wisps of smoke behind it. The wisp-trail should clearly read as *not solid* — design hint: trail uses palette indices that include alpha values (similar to v0.75 moss-pulse fringe) and animate as 2 trailing frames offsetting back by 1-2 px.

**Movement:** Spawns at the right viewport edge at a random vertical position within the upper third of the playfield. Drifts **left** at ~`drift_x_per_frame = 1.4 px` while bobbing on a sine curve (`amp = 8 px, period = 60 frames`). Wind-modulated: in Stage 2-3 (the Knifing), drift speed and bob amplitude both bump up by 25%. Despawn when off the left viewport edge by >2 tile widths.

**Hit reaction:**
- Hatchet hit → 1-hit kill. Death animation: 3 frames of ember-scatter (the bundle splits into 4-6 small embers that fly outward then fade) over 18 frames, then despawn.
- Hero stomp → 1-hit kill. Same death animation (the bundle dissipates from above).
- Hero overlap (touch) without stomp → hero hurt path (HuskSystem-equivalent loseLife flow). Cinderwisps deal contact damage, not projectile damage.

**AI:** Pure drift. No targeting, no chase, no projectile. The challenge is timing the jump-or-throw against the bob curve.

**Sprite frames needed (design):**
- `drift` (3 frames, 6 fps) — the bundle pulses slightly; wisp-trail offsets back.
- `dead`  (3 frames, 8 fps) — ember scatter.

**Hitbox suggestion:** 18 × 16, centered.

### 2.2 Quarrywight — armored stone walker

A stone-armored squat humanoid the size of a tall barrel. **Visually:** ~36×48 px, hunched silhouette, broad shoulders, no visible head (the head is recessed into the shoulder plate). Stone-bone palette with mossy joinery at the elbows. **Two visual states:** `armored` (intact) and `cracked` (after first hatchet hit — a diagonal crack across the chest plate, persistent until death).

**Movement:** Walks **left** at ~`walk_x_per_frame = 1.2 px` (about 0.5× Mossplodder speed). Does not turn around at platform edges — falls off cliffs (this is a deliberate hazard for the player to use, see Stage 2-2 cliff edges). Heavy ground-stride animation (4 frames @ 5 fps, designed to feel weighty).

**Hit reaction:**
- Hatchet hit (first) → `armored` → `cracked`. **Plays the hurt-flash for 8 frames.** The Quarrywight continues to walk; the crack stays visible for the rest of its life.
- Hatchet hit (second, while `cracked`) → death animation. The stone plates fall away (3 frames of plate-shed) over 30 frames, the mossy joinery underneath crumbles, then despawn.
- Hero stomp → **deflected**. The Quarrywight is **not stomp-vulnerable**. On stomp contact, the hero bounces up (Z-impulse equivalent) and **takes no damage**; the Quarrywight is unmoved. (Design tell: the shoulder-plate flash on bounce.) This is the player's hint that stomp does not work here.
- Hero overlap (side) without stomp → hero hurt path.

**AI:** Pure walk-left. No turn-around, no jump, no projectile. The challenge is committing **two** hatchets before the Quarrywight closes distance, while Cinderwisps drift around the playfield. **First multi-hit enemy in the run.**

**Sprite frames needed (design):**
- `walk_armored`  (4 frames, 5 fps)
- `walk_cracked`  (4 frames, 5 fps) — same silhouette, crack visible
- `hurt_armored`  (1 frame, used as overlay flash) — lighter plate palette
- `hurt_cracked`  (1 frame, used as overlay flash) — lighter joinery palette
- `dead`           (3 frames, 6 fps) — plate-shed + joinery crumble.

**Hitbox suggestion:** 28 × 44, centered.

### 2.3 Skyhook — cliff dropper

A perched bird-of-prey-like creature with crystal claws hooked into the cliff face. **Visually:** ~32×36 px when perched (compact, folded silhouette); ~32×36 when walking (legs unfolded). Stone-bone body with dawn-amber crystal-claw highlights. The claws are the visual signature; design should make them readable at the silhouette scale.

**Movement FSM:**
```
   perched ──(hero crosses trigger col)──► triggered ──(20 frames windup)──► falling ──(lands on platform)──► landed ──(15 frames)──► walking ──(off-screen left)──► despawn
```

- `perched` — sits at a fixed `(col, row)` on a cliff face or beacon-tower wreck. The trigger col is `hero_col + 6` (i.e., the Skyhook drops when the hero gets within 6 tiles to its left). Once triggered, the perch is consumed (the Skyhook can't re-perch).
- `triggered` — flashes the crystal claws (the visual telegraph for the drop) for 20 frames. The Skyhook does not yet move.
- `falling` — drops **straight down** at `fall_y_per_frame = 4 px/frame` (terminal velocity). The Skyhook does not track the hero horizontally. The fall is interruptible: if a hatchet hits during `falling`, the Skyhook dies mid-air.
- `landed` — once the Skyhook's feet contact a floor tile (or stops by colliding with terrain), it stands for 15 frames. Hurtbox is active during all of `landed`.
- `walking` — walks **left** at `walk_x_per_frame = 1.6 px` (faster than Mossplodder). Walks indefinitely until off-screen left or killed.

**Hit reaction:**
- Hatchet hit (any state past `triggered`) → 1-hit kill. Death animation: 3 frames of crystal-scatter + feather-tumble over 24 frames.
- Hero stomp (only valid during `walking`) → 1-hit kill. During `falling` or `landed`, hero overlap from above is **hero-hurt** (the Skyhook is dropping at terminal velocity; the hero is not allowed to land on it).
- Hero overlap (side) during `walking` → hero hurt path.

**AI:** Trigger-and-drop. The Skyhook is a positional puzzle: hero learns to spot perched silhouettes and either back away (lose progress) or commit to a hatchet throw before drop.

**Sprite frames needed (design):**
- `perched`    (2 frames, 2 fps) — slight wing-rustle
- `triggered`  (3 frames, 6 fps) — claw-flash + body coil
- `falling`    (1 frame) — wings folded, body streamlined
- `landed`     (2 frames, 4 fps) — wings unfold, claws settle
- `walking`    (4 frames, 6 fps) — bipedal walk cycle
- `dead`       (3 frames, 8 fps) — crystal scatter + feather tumble

**Hitbox suggestion:**
- `perched` / `triggered` — 24 × 28, top-center
- `falling`                — 22 × 32, top-center
- `landed` / `walking`     — 26 × 30, top-center

---

## 3. Area 2 boss — the **Reignwarden**

A standing humanoid colossus posted on a beacon-tower pedestal at the right edge of Stage 2-4's arena. The Reignwarden is the **Cinder Reach's counterpart** to the Bracken Warden — same `guarding-not-predatory` posture, same FSM shape, but a completely different attack and a different silhouette.

> The Bracken Warden lay down because the wood woke it; the Reignwarden was never asleep. It has been standing at this beacon-tower for as long as the canopy below has been still. When Reed crosses the trigger col, the Reignwarden **does not move from its pedestal**; it raises its arms and the beacons relight.

### 3.1 Name and palette

**Coined-name etymology.**
- *Reign* — old English root for ruling / royal authority; here it refers to *the sovereign post* (the highest beacon on the ridge). Not a copyrighted term.
- *Warden* — same as the Bracken Warden. Generic English. Bracken Warden and Reignwarden share the *Warden* suffix as a deliberate parallel — both are guardians of a place, not aggressors. Their pairing is one of the v1.0 narrative beats.
- Combined, **Reignwarden** reads in both English and Korean (한글 표기: **레인워든**, transliteration, name stays verbatim per `CLAUDE.md` bilingual policy).

**Palette (dawn-amber + ember-rose + stone-bone).** Where the Bracken Warden was moss-green-on-stone, the Reignwarden is **dawn-amber-on-stone**. The chest sigil glows the same warm amber color (the families are connected) but the body color is bone-white stone with **ember-rose** accent (a slightly cooler red than dawn-amber, used at the joint-cracks). Design hint: use a 12-color palette that overlaps Area 1 boss only at the dawn-amber sigil; rest is unique to this boss.

### 3.2 Silhouette intent

A **standing humanoid colossus** at the right edge of the boss arena, posted on a **2-tile-tall stone pedestal** (the beacon-tower base). Dimensions: ~3 tiles wide × 5 tiles tall **including pedestal** (the pedestal is part of the asset; it does not animate). The Warden-body proper is ~3 tiles wide × 4 tiles tall above the pedestal.

The pedestal is **fixed in the world** — design should depict the pedestal as visibly carved into a base of stones that match the Stage 2-4 floor tiles. The Reignwarden stands on top of the pedestal; its feet do not animate (it does not walk).

**At rest (`idle`):** Body straight, arms folded across the chest, head level. The chest sigil is dim. The slits in the helm/face area are dark. **Posture reads "sentinel,"** not "fighter."

**At `windup`:** Arms unfold and rise overhead; the chest sigil flares bright dawn-amber; the helm-slits ignite the same color. The pose is **arms-up, palms forward** — the cinder volley is gathering between the palms. Design hint: a small visual halo of dawn-amber particles in the palm-space during the entire `windup`.

**At `attack`:** Arms come together overhead, then sweep forward and out. On the sweep-forward contact-frame, **three cinder projectiles** spawn in a tight cluster at the palm-position and fan out toward the floor (see §3.4 for the attack pattern).

**At `recover`:** Arms drop to the sides (not folded — distinct from `idle`). The chest sigil fades back to dim. The Reignwarden is most vulnerable to hatchet hits during `recover` — design should depict the chest sigil as exposed.

**At `hurt`:** 10-frame stagger. 1-frame all-lighter palette swap (the bone-white tone shifts toward almost-white), then 9 frames hold. The Reignwarden does not move on the pedestal during `hurt`.

**At `dead`:** The Reignwarden's head bows forward; the arms drop; the chest sigil pulses three times slowly and goes dark. Over the final 30 frames the body lowers itself to a kneeling pose on the pedestal — **a deliberate echo of the Bracken Warden's resting posture, but on top of the pedestal not at the floor.** Then the Area-Cleared overlay flow fires (see §6 of `phase4-area2-cast.md`).

### 3.3 Movement FSM — identical shape to the Bracken Warden

```
        ┌───────── idle ──────────┐
        │ (standing, arms folded) │
        ▼                         │
   Reed crosses trigger col? OR   │
   recover timer expires?         │
        │ yes                     │
        ▼                         │
   ┌─────────┐  ~45 frames   ┌─────────┐  spawns 3-cinder volley  ┌──────────┐
   │ windup  │ ────────────► │ attack  │ ────────────────────────►│ recover  │
   │ (arms   │               │ (sweep  │                          │ (arms    │
   │  rise)  │               │  arms)  │                          │  drop)   │
   └─────────┘               └─────────┘                          └────┬─────┘
                                                                       │ (~90 frames)
                                                                       ▼
                                                                      idle

   any non-dead state ── hatchet hit ──► hurt ── (~10 frames) ──► last state
   any state ── 9th hatchet hit ──────► dead   (terminal)
```

Tunables (suggested):
- `bossArenaTriggerCol` — set per-stage when registering the boss (Stage 2-4 specific).
- `idleFrames` ≈ 60 (between attacks)
- `windupFrames` ≈ 45 (reaction window for player)
- `attackFrames` ≈ 18 (sweep + spawn cinder volley on the contact-frame, ~12 frames in)
- `recoverFrames` ≈ 90 (vulnerable to hatchet)
- `hurtFrames` ≈ 10
- `hp` = **9** (one more than the Bracken Warden's 6; HP scaling is a deliberate climb)

### 3.4 Attack pattern — the **cinder volley**

ONE primary attack. Telegraphed by `windup` arms-up + chest-sigil flare. The volley spawns on a single contact-frame inside `attack`.

**The volley:** three small **cinder projectiles** spawn at the Reignwarden's palms in a tight cluster and fan out at three different angles toward the floor of the arena.

- Cinder 1 — leftward-down angle (~205° from horizontal-right), `speed = 4.5 px/frame`
- Cinder 2 — straight-down angle (~270°), `speed = 4.0 px/frame`
- Cinder 3 — leftward-flatter angle (~190°), `speed = 5.0 px/frame`

The cinders fly along a **gravity-modulated ballistic arc** — start fast, gravity pulls down at `0.18 px/frame²`. The cinders land in three different floor positions across the arena (cinder 3 lands closest to the Warden, cinder 1 lands middle-arena, cinder 2 lands beneath the Warden — design hint: this means the player has approximately 1 tile-width safe zone immediately to the left of the pedestal, but only during the windup-into-attack window; once cinders land, that zone has a pit).

**On floor contact:** Each cinder spawns a **ember-pit hazard tile** at its landing position. The pit is a `fatal` tile type for `~120 frames` (~2 sec), then dissipates. While active, the pit is visually marked by ember-glow particles (4 frames @ 8 fps; design hint: red-orange particles drifting up). Hero contact with the pit triggers the fatal-tile path (death + loseLife).

**Cinders are not directly hatchet-able.** They are pure-projectile, in-flight only. The hazard is what the player must avoid; the source (the Reignwarden) is the player's target.

**Tile-coordinate hint for design/dev:** assume the boss pedestal is at `arenaCol = arenaWidthCols - 4` (i.e., 4 tiles in from the right edge of the arena). Cinder volley targets are approximately:
- Cinder 1 → `arenaCol - 5` (5 tiles left of pedestal)
- Cinder 2 → `arenaCol - 1` (1 tile left of pedestal — immediately below the Warden's feet)
- Cinder 3 → `arenaCol - 3` (3 tiles left of pedestal — the "trap" zone, narrow)

The arena is 16 tile columns wide (full viewport). The hero has roughly 10 tile columns of moveable floor in front of the pedestal, with cinder pits opening at the three positions above on each volley.

### 3.5 Hit reaction and death

- **Hatchet hit** → `hurt` overlay (10-frame stagger). HP decrements by 1. The state machine resumes where it was after `hurt` clears. The Reignwarden cannot be stunlocked — `windup` and `recover` cannot be cancelled. The player's optimal window is `recover` (the longest state, with the sigil exposed).
- **HP reaches 0** → `dead`. The death animation plays for 60 frames (sigil pulse + body kneel-down), then the Area-Cleared overlay flow fires (see §6).

**Cinder volley cannot be cancelled** by a hatchet hit during `attack`. Once the volley spawns, it travels. A well-timed hatchet hit during `windup` will, however, hurt-stagger the Warden and **delay** the attack (it resumes from where it was when hurt fires; the cinder spawn timer continues from its current frame, not restarted).

### 3.6 Arena layout

| Item                  | Position / spec                                                                                             |
|-----------------------|-------------------------------------------------------------------------------------------------------------|
| Arena width           | 16 tile columns (full viewport)                                                                             |
| Arena floor           | Solid bone-white stone, 1 row of flat tiles (no slopes, no gaps until the boss attacks)                     |
| Camera                | Locked at the trigger col (the camera does not scroll right during the fight)                               |
| Boss spawn position   | `bossY = arenaFloorRow * TILE - bossH - pedestalH` (sits on top of pedestal; pedestal is 2 tile-rows tall) |
| Hero start position   | Left side of arena, ~2 tile-cols from the left edge                                                         |
| Hazards               | Ember pits spawned by cinder volleys (transient, ~2 sec each). No persistent hazards.                       |
| Music                 | `boss-fight` BGM (see `phase4-audio.md` §1.3)                                                                |
| Exit                  | On boss death → Area-Cleared overlay → transition to next-Area / credits                                    |

### 3.7 Win condition

- Hatchet hits the Reignwarden 9 times before vitality reaches 0 → boss death animation → Area-Cleared overlay.

### 3.8 Lose conditions

- Hero touches a cinder volley pit (fatal tile) → loseLife. Camera stays locked; the hero respawns at the arena entry col with full vitality. **Lives are not refilled** (this is the same Continue model as Area 1).
- Hero takes contact damage from the Reignwarden's body (if the player tries to stand directly under the Warden — design hint: there's no contact hitbox for the pedestal itself, but the Warden's feet ARE a contact hurtbox during the `attack` sweep) → loseLife.
- Hero runs out of vitality from low-vitality death → loseLife.

If lives reach 0 → `GAME_OVER` → state.continueRun() → `RESPAWNING` → AreaManager.startArea(2) (re-enters Stage 2-1 from scratch, NOT the arena directly).

---

## 4. Two new pickup items

| Pickup    | Effect                          | Sprite size | Stage    |
|-----------|---------------------------------|-------------|----------|
| Sunpear   | +50 vitality (best food in run) | 36×36       | Stage 2-2 |
| Flintchip | Hatchet on-screen cap 2 → 3 for ~10 sec (transient buff). Clears on stage transition. | 24×36 | Stage 2-3 |

### 4.1 Sunpear

A roundish gold-skinned fruit hanging from a beacon-tower wreck on Stage 2-2 (the Beacon Walk ridge). Brighter palette than the amberfig; the Sunpear is the brightest food in the run. **Visually:** spherical with a slight pear-taper, ~36×36 px, dawn-amber outer skin with ember-rose blush on the sun-side. 3 idle frames @ 4 fps (slight gleam shift).

**Effect:** +50 vitality (matches amberfig — the Sunpear is amberfig's Cinder Reach counterpart; design palette and silhouette are different, function is identical). One Sunpear placed in Stage 2-2 at a beacon-tower wreck (col ~32, mid-stage).

**ItemSystem integration:** Adds a new `pickup.type === 'sunpear'` case. Sprite cache key `sunpear`.

### 4.2 Flintchip

A small dawn-amber crystal shard, ~24×36 px (thin and tall, like a chunk of sharpened flint). **Visually:** translucent dawn-amber crystal with ember-rose veining; 2 idle frames @ 3 fps (a soft inner-glow pulse).

**Effect (transient buff):** While active, the on-screen hatchet cap increases from 2 to 3 — so Reed can have 3 hatchets airborne simultaneously. Duration: **~10 sec real-time** (600 frames @ 60fps). After 600 frames, the buff expires and the cap reverts to 2. **The buff clears on stage transition** — Flintchip-buff does NOT carry into the boss fight if picked up in Stage 2-3.

**Visual telegraph for active buff:** Reed's hatchet projectile sprite shifts to a brighter palette (dawn-amber inner-flash) for the buff's duration. HUD treatment: a small Flintchip icon next to the lives display + a countdown bar (10 sec). Design should provide both a sprite and a HUD icon variant (16×16 for HUD).

**Placement:** one Flintchip in Stage 2-3 (the Knifing), mid-stage, in a position that rewards risk-taking (near a Skyhook perch or between Quarrywights).

**ItemSystem integration:** Adds a new `pickup.type === 'flintchip'` case. State carry: store buff state on the player component (`pl.flintchipFrames`). HatchetSystem reads `pl.flintchipFrames > 0` to decide the on-screen cap. AreaManager.swapToNextStage / _loadStage clears `pl.flintchipFrames`.

---

## 5. Stage 2-1 — Mossline-Path-to-Cinder-Reach transition

Stage 2-1 (the Switchback) needs to **visually bridge** from the Old Threshold dark-forest (end of Area 1, Stage 1-4) to the open upland (Stage 2-2 onward). For v1.0 the simplest implementation:

- Stage 2-1 starts at the **forest edge** (last 4 columns of forest tileset on the left).
- The middle 16-20 columns are **mixed forest-and-stone** — patches of moss on stone-step tiles, occasional bracken-frond decorations at switchback corners.
- The last 12-16 columns are **pure stone-terrace** — no forest decorations, open sky beginning to show in the parallax.

**Reuse policy:** Stage 2-1 can reuse `area1-stage1-forest` tile types for the bottom 3-tile rows of the leftmost ~16 cols. The new **stone-terrace** tileset (see §6) covers the rest. Parallax for Stage 2-1 transitions from canopy-fragments (left) to open-sky (right) — design has the option to author a single SVG with a gradient, or two SVGs and crossfade based on scrollX.

---

## 6. Asset checklist (design-lead)

### Sprites

| Asset                        | Dimensions    | Frames                                                                                  |
|------------------------------|---------------|-----------------------------------------------------------------------------------------|
| enemy-cinderwisp.js          | 24×24         | drift (3 @ 6fps), dead (3 @ 8fps)                                                       |
| enemy-quarrywight.js         | 36×48         | walk_armored (4 @ 5fps), walk_cracked (4 @ 5fps), hurt_armored (1), hurt_cracked (1), dead (3 @ 6fps) |
| enemy-skyhook.js             | 32×36         | perched (2 @ 2fps), triggered (3 @ 6fps), falling (1), landed (2 @ 4fps), walking (4 @ 6fps), dead (3 @ 8fps) |
| boss-reignwarden.js          | 144×240 (3w × 5h tiles, includes pedestal) | idle (2 @ 2fps), windup (4 @ 8fps), attack (3 @ 10fps), recover (3 @ 5fps), hurt (1), dead (4 @ 4fps) |
| projectile-cinder.js         | 12×12         | flight (3 @ 10fps, looped during flight), impact (3 @ 8fps, plays once on floor contact) |
| item-sunpear.js              | 36×36         | idle (3 @ 4fps)                                                                          |
| item-flintchip.js            | 24×36         | idle (2 @ 3fps); HUD variant 16×16 (1 frame static)                                     |

### Tilesets

| Asset                         | Notes                                                                                      |
|-------------------------------|--------------------------------------------------------------------------------------------|
| tiles/area2-stage1-switchback.js | Stone-terrace tiles (flat + 22°/45° slope variants). Mossy-bottom variants for cols 0-15. |
| tiles/area2-stage2-beaconwalk.js | Bare-rock platform tiles + cliff-edge variant + fatal-pit variant (palette-differentiated from water_gap). Beacon-tower wreck decoration tile (16×16, sits ON TOP of floor tile). |
| tiles/area2-stage3-knifing.js | Gully-floor tiles (darker stone, narrow). No fatal tiles. Rock-wall variant. |
| tiles/area2-stage4-reignward.js | Warmer dawn-amber stone tiles + pedestal tile (16×16, 2-tile-row composite for the beacon-tower base). |

### Parallax SVGs (3 layers per stage)

| Stage | Far layer            | Mid layer              | Near layer                |
|-------|----------------------|------------------------|---------------------------|
| 2-1   | sky-with-canopy-bleed | distant-cliffs         | switchback-stones-near    |
| 2-2   | distant-mountains    | far-mesa               | beacon-tower-wrecks-near  |
| 2-3   | sky-narrow-strip     | rock-wall-mid          | rock-wall-near-tighter    |
| 2-4   | full-sky-with-ruin-below | beacon-pedestal-far | beacon-tower-wrecks-near  |

**Total new SVGs: 12.** Same parallax-layer architecture as v0.75.1 Area 1 stages.

### Palette guidance

- **stone-bone:** `#e6e1d8` (highlight), `#bdb7a7` (mid), `#8e8878` (shadow), `#6a6457` (deep)
- **dawn-amber (shared with Area 1 boss):** `#f8d878` (highlight), `#e4b25c` (mid), `#a87838` (shadow)
- **ember-rose (NEW, Area 2 only):** `#f49494` (highlight), `#cc6464` (mid), `#882c2c` (deep) — used at ember-pit hazards, cinder projectiles, Reignwarden joint accents
- **dawn-amber-glow (alpha for particles):** `#f8d87880` (40%), `#f8d878c0` (75%) — for the sigil/halo/glow effects

12 colors per asset is the upper bound (matches Phase 3 spec). Most assets can ship with 6-8 colors.

---

## 7. Dev integration (dev-lead)

### 7.1 AreaManager generalization

Current state: `AreaManager` is hard-coded to Area 1 via `import { buildStage } from './area1/index.js'`. For v1.0 it needs to dispatch by `areaIndex`:

- Move the `buildStage` import into a per-area registry, OR add a top-level `src/levels/buildStage.js` that switches on `areaIndex`.
- `AreaManager.startArea(areaIndex)` already accepts the param — wire it through to the build path.
- `AreaManager._loadStage` should resolve the area-specific tileset from `tileCache.setActiveStage(stageIndex, areaIndex)` — TileCache needs a per-area dispatch too (Stage 1-1 vs Stage 2-1 use different tile keys).
- `ParallaxBackground.setStage(stageIndex)` needs `areaIndex` as well.

### 7.2 Area 1 → Area 2 transition

Current state: after Bracken Warden dies, `AreaManager.beginAreaCleared()` fires the Area-Cleared overlay. In v0.75.1 the overlay dismisses by looping back to Stage 1 of the same area.

For v1.0:
- When Area 1's Area-Cleared overlay dismisses, instead of `startArea(1)` to loop, call `startArea(2)` to advance.
- When Area 2's Area-Cleared overlay dismisses, instead of advancing, fire a **`CREDITS`** state (new). Credits scroll for ~12 sec, then dismiss to `TITLE`.

### 7.3 Enemy systems

- **Cinderwisp:** spawn handler in `Phase2EnemyAI` (or a new `Area2EnemyAI` if cleaner). Sine-path movement. Wind-modulated factor read from a per-stage constant. Same enemy-component shape as Threadshade (`enemy.type === 'cinderwisp'`).
- **Quarrywight:** spawn handler + walk-left + first-hit-armor-strip logic. Add a `enemy.armored` boolean on the component; CombatSystem._hatchetVsEnemy decrements armor first, then HP. Sprite frame selection in Renderer reads `enemy.armored ? 'walk_armored' : 'walk_cracked'`.
- **Skyhook:** spawn handler + FSM. Add `enemy.aiState` to track FSM phase. Trigger col check in `Phase2EnemyAI.update`. Drop physics: `velocity.vy = 4` while `aiState === 'falling'`. Land detection: collision with floor tile → `aiState = 'landed', timer = 15`. Walking phase identical to Mossplodder logic.

### 7.4 Boss system

- **Reignwarden:** new `BossSystem` branch keyed on `boss.area === 2`. FSM identical-shape to Bracken Warden, attack handler is cinder-volley spawn instead of moss-pulse spawn. Cinder physics: independent gravity-modulated trajectory. Cinder floor-impact: spawn an `ember-pit` fatal tile via TileMap mutation (replicate v0.75 fatal-tile pattern).
- **Ember-pit hazard:** add a new tile type `EMBER_PIT` (or reuse `FATAL_TRANSIENT` if generalized). Transient: 120-frame TTL stored per-tile. Renderer animates with the ember particle frames.

### 7.5 Audio wiring (see `phase4-audio.md` for full spec)

- `AudioManager.playBGM('title')` on title screen entry.
- `AudioManager.playBGM('area1')` on Area 1 entry (already in place).
- `AudioManager.playBGM('area2')` on Area 2 entry (NEW).
- `AudioManager.playBGM('boss-fight')` on boss-arena entry (NEW, both Area 1 and Area 2 — Area 1 currently has no boss-specific BGM).
- `AudioManager.playBGM('game-over')` on GAME_OVER entry.
- `AudioManager.playSFX(<name>)` at all 22 events listed in `phase4-audio.md` §2.

### 7.6 Polish (game-over / title / credits)

- **Title screen:** update text from "WONDER BOY / LEGACY REBIRTH" to a tribute-tone label that does not directly reproduce a trademark. Recommended (story-lead choice): **"WONDER BOY TRIBUTE"** as the line-1 title (matches repo README), with **"The Mossline Path"** as the line-2 subtitle. This makes the tribute posture readable on-screen.
- **Game-over screen:** keep current "GAME OVER" + bilingual "Press any key to continue" / "아무 키나 눌러 계속". Add a small line showing the current Area and Stage as run-stats (e.g., "Area 2 — Stage 2-3").
- **Credits screen (new):** triggered after Area 2 cleared. Scrolling text (~12 sec). Content: project credits + a short note thanking the original team (without naming specific copyrighted works — see §8).

---

## 8. IP safety note (release-master)

- **No Wonder Boy character names appear in this brief.** All names (Reignwarden, Cinderwisp, Quarrywight, Skyhook, Sunpear, Flintchip, Cinder Reach, the Switchback, the Beacon Walk, the Knifing, the Reignward) are coined for this project.
- **No Wonder Boy boss silhouette is reproduced.** The Reignwarden is a standing humanoid colossus on a pedestal — a universal silhouette convention. Specific reference assets are not used.
- **The credits screen** should reference "the spirit of 1986/87 platformers" or similar generic phrasing; it should NOT reference specific copyrighted titles, character names, or original BGM track names.
- **Cinder volley attack** is intentionally distinct from any specific reference boss attack we are aware of. The three-cinder-fan + transient floor hazard pattern is universal action-platformer vocabulary.

---

## 9. Tunables summary

```js
// Cinderwisp
drift_x_per_frame:        1.4   (Stage 2-3: 1.75)
bob_amp_px:               8     (Stage 2-3: 10)
bob_period_frames:        60

// Quarrywight
walk_x_per_frame:         1.2
armor_hits:               1     (first hatchet hit chips armor)
total_hp:                 2     (so 2 hatchet hits to kill)

// Skyhook
trigger_distance_tiles:   6
windup_frames:            20
fall_y_per_frame:         4
landed_frames:            15
walk_x_per_frame:         1.6

// Reignwarden boss
hp:                       9
idle_frames:              60
windup_frames:            45
attack_frames:            18    (cinder volley spawns ~12 frames in)
recover_frames:           90
hurt_frames:              10
cinder_speed_1:           4.5
cinder_speed_2:           4.0
cinder_speed_3:           5.0
cinder_gravity_pps:       0.18  (px/frame²)
ember_pit_ttl_frames:     120

// Flintchip buff
flintchip_duration_frames: 600  (10 sec @ 60fps)
flintchip_hatchet_cap:     3    (default 2)
```

---

## 10. Cross-references

- `docs/briefs/phase3-area1-expansion.md` — Area 1 four-stage spec (template for Area 2).
- `docs/briefs/phase3-boss-cast.md` — Bracken Warden spec (template for Reignwarden).
- `docs/briefs/phase4-audio.md` — Web Audio synthesis spec for v1.0 BGM + SFX.
- `docs/story/world.md` — world lore (Verdant Ruin, the canopy glade, the Cinder Reach context).
- `docs/design/contracts.md` — sprite/tile/parallax data contract (unchanged for v1.0).
- `src/levels/AreaManager.js` — top-level Area lifecycle (needs Area 2 wiring).
- `src/audio/AudioManager.js` — Web Audio scaffold (needs Area 2 + boss-fight + title + game-over BGM additions; needs 22 SFX wirings).

---

**Approved by user for autonomous v1.0 development.**

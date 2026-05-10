# Phase 2 — Area 1 layout brief (v0.50)

> **Authoring agent:** story-lead
> **Consumers:** design-lead, dev-lead
> **Reviewer:** release-master
> **Companion docs:** `docs/briefs/phase2-cast-revision.md`, `docs/story/world.md`
> **한국어 버전:** [phase2-areas.ko.md](./phase2-areas.ko.md)

This brief defines Area 1's four-round structure for v0.50: terrain rhythm of each
round (slopes, gaps, flats), enemy and obstacle spawn tables, and mile-marker /
cairn placements. Numeric quantities are *suggestions* for dev-lead to tune in code;
spatial intent is the load-bearing content.

> **Tribute, not a port.** Round layouts, enemy rhythms, and obstacle placements
> here are original. We use universal platformer terrain grammar (uphill / downhill
> / gap / flat) for inspiration, never specific original-game stage layouts.

---

## 1. Area 1 — **The Mossline Path**

A sun-warm forest morning at the foot of the Verdant Ruin. The Mossline Path is the
softest entry into the world: thinned-out canopy, cool layered greens above and warm
loam below, the occasional glint of a stone-worn ruin edge surfacing through the
ground. This is where Reed Bramblestep starts the journey east — the path is gentle,
but it is **moving**. Mossplodders roll forward through the loam; warm Hummerwings
drift through the chest-high air. The ruins, half-asleep, leak small fires in
cracked patches of ground. Stone shoulders and roots form bumps Reed must clear.

**Mood keywords for Design:** kettle-warm morning · layered cool greens · loam-and-
dawn · gentle insistence · forward travel. Eye on the ground; sky is a soft amber
strip; foreground foliage layer pulls slightly violet to cool the read.

**Tone:** Area 1 is the *teaching ground*. The four rounds together teach
**read-the-terrain → fight-the-pace → handle-the-static-threats → put-it-all-
together**. Each round is short enough to learn and long enough to scroll. Nothing
in Area 1 should feel cruel; threats are insistent.

---

## 2. Round structure (four rounds × multi-screen scroll)

Each round is a **multi-screen scrolling stage** running left-to-right. The viewport
is 16 tiles wide × 12 tiles tall (`TILE = 48`). Length is measured in tile-columns
where 16 columns = 1 viewport ("screen").

### 2.1 Terrain vocabulary

Phase 1 was flat with stacked platforms. Phase 2 replaces stacking with **slope-
based ground** and **occasional jump gaps**:

| Element        | Description                                                                                       | Frequency in Area 1 |
|----------------|---------------------------------------------------------------------------------------------------|---------------------|
| `flat`         | Standard flat ground tile.                                                                        | ~60 % of all ground tiles |
| `slope_up_22`  | Gentle 22° uphill (1 vertical tile rise per 3 horizontal). Keeps Reed's run feel intact.          | Common               |
| `slope_up_45`  | Steep 45° uphill (1:1). Used for short crests, not long climbs.                                   | 1-2 per round        |
| `slope_dn_22`  | Gentle 22° downhill, mirror of above.                                                             | Common               |
| `slope_dn_45`  | Steep 45° downhill.                                                                              | Occasional           |
| `gap`          | A break in the floor — Reed must jump across. Area 1 gaps are 2–4 tiles wide.                     | 1–3 per round        |
| `rock_small`   | One-tile-tall solid rock obstacle. Blocks horizontal movement, no damage. (Cast §7.)              | 1–4 per round        |
| `fire_low`     | Animated fire tile. 1-hit-kill on contact. (Cast §8.)                                             | Rounds 1-2 → 1-4 only; round 1-1 has none |

Slope steepness keywords (Design vocabulary): **gentle = 22°, steep = 45°.** No
slopes steeper than 45° in Area 1. **No stacked platforms** in Area 1 — single
continuous ground line that rises and falls. Vertical interest comes from slope
crests + Hummerwing altitudes, not from a second floor.

### 2.2 Spawn-direction convention

Reed travels **right** (east). All enemies spawn **left-facing** (toward Reed) by
default — head-on course with each threat the moment it scrolls into view.
Exception: a few late-round Mossplodders may spawn right-facing (away from Reed)
to create "catch up to it" beats — explicitly called out where used.

### 2.3 Position notation

Positions inside a round use **tile-column index** (`x = column from round start,
0-indexed`). For a ~96-column round, `x = 0` is spawn and `x = 95` is the last
column (mile-marker / cairn).

---

## 3. Round-transition ritual

### 3.1 Mile-marker hits (rounds 1-1 → 1-2, 1-2 → 1-3, 1-3 → 1-4)

When Reed walks into a mile-marker hitbox at the end of rounds 1-1, 1-2, or 1-3:

1. Player input suspended ~30 frames (Reed continues facing forward).
2. Fade-to-black ~30 frames.
3. Round-number overlay ~60 frames at full opacity:
   ```
   Round 1-2
   ```
   Centered, in the bilingual title typeface. (Korean overlay reads `라운드 1-2`
   if Design ships a localized HUD pass; English-only is fine for v0.50.)
4. StageManager swaps the active level data.
5. Fade-from-black ~30 frames.
6. Reed's spawn pose appears at new round's `x = 0`. **Reed respawns unarmed**
   per cast §11 Q6 recommendation. (The mile-marker is a rebirth beat; the next
   round has its own egg.)
7. Player input restored.

Total: ~120 frames (~2 seconds).

### 3.2 Boundary cairn hit (end of round 1-4)

When Reed walks into the boundary cairn at the end of round 1-4:

1. Input suspended (~30 frames).
2. Cairn `clear` animation plays (~16 frames).
3. Fade-to-black over ~60 frames (longer than mile-marker; weightier beat).
4. **"Stage Cleared" overlay**:
   ```
   Area 1 — The Mossline Path
   Cleared.

   The boundary holds. Reed walks on.

   Area 2 ahead in v0.75.
   ```
   Centered, holds for ~5 seconds or until any input.
5. Return to title screen (or hold the overlay indefinitely if title isn't ready
   in v0.50; dev-lead's call).

The "Area 2 ahead in v0.75" line is a release-honest message; release-master may
prefer to soften this string (cast brief §11 Q5).

---

## 4. Round 1-1 — **The First Steps**

**Theme intent:** First 30 seconds. Teach **walk, jump, hit the egg, get the
hatchet, kill one Mossplodder**. No fire. No surprises.

### 4.1 Length and shape

- **~3 screens, ~48 columns wide.**
- Vertical profile: starts flat, gentle uphill in the middle, returns flat for
  the last screen. Crest sits ~2 tiles above the start floor.
- One small jump gap on the way down (2 tiles).

### 4.2 Terrain rhythm

```
columns 0–10   : flat (spawn + first walk)
columns 10–14  : gentle uphill (slope_up_22)
columns 14–18  : flat crest (lookout)
columns 18–22  : gentle downhill (slope_dn_22)
columns 22–25  : flat
columns 25–28  : gap (3 tiles, skip)
columns 28–48  : flat (final stretch + mile-marker)
```

Slope keywords: **gentle throughout. No steep slopes.**

### 4.3 Egg placement

- **Dawn-husk at column 7** (spawn-flat, before the first uphill). Reed reaches
  it within ~2 seconds. Armed by the time he hits the slope.

### 4.4 Enemy spawn table

| Type        | Count | Approx column(s) | Direction | Notes                                                  |
|-------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder |     1 | 32               | left      | Forward-walking through the post-gap flat. Reed kills it with one hatchet from across the gap. |
| Hummerwing  |     0 | —                | —         | Round 1-1 has no fliers — keep the floor read clean.   |

One enemy in the entire first round. Intentional — mechanics introduction, not
combat density.

### 4.5 Static obstacle table

| Kind | Count | Approx column(s) | Notes                                            |
|------|------:|------------------|--------------------------------------------------|
| Rock |     1 | 38               | Single rock between Mossplodder corpse and mile-marker. Reed jumps it. |
| Fire |     0 | —                | Round 1-1 has no fire. Reserve for later rounds. |

### 4.6 Mile-marker placement

- **Mile-marker at column 47.**

### 4.7 Threat curve / intent

A single slow inhale: spawn flat → egg (first power) → uphill / crest (look
around) → downhill / gap (first jump-with-consequence) → Mossplodder (first
kill) → rock + mile-marker (small final puzzle, cleared progress). If the
player dies in round 1-1, it's the gap or the Mossplodder — and either failure
should feel like *the world taught me*, not *the world ambushed me*.

---

## 5. Round 1-2 — **Through the Hummers**

**Theme intent:** Introduce **Hummerwing** and **fire** at staggered points.
Teach jump-throw and "duck under the hummer line." Slightly longer round, more
terrain variety.

### 5.1 Length and shape

- **~4 screens, ~64 columns wide.**
- Two crests (column ~18, column ~46) with a valley between. Valley contains
  the fire patch.
- Two gaps: one on the descent of the first crest (2 tiles), one near the end
  (3 tiles).

### 5.2 Terrain rhythm

```
columns 0–8    : flat (spawn)
columns 8–12   : gentle uphill (slope_up_22)
columns 12–16  : steep uphill (slope_up_45) — round 1-2's first steep beat
columns 16–20  : flat crest
columns 20–24  : gentle downhill (slope_dn_22)
columns 24–26  : gap (2 tiles)
columns 26–34  : flat valley (contains the fire patch)
columns 34–40  : gentle uphill (slope_up_22)
columns 40–46  : flat second crest
columns 46–50  : gentle downhill (slope_dn_22)
columns 50–53  : gap (3 tiles)
columns 53–64  : flat (final stretch + mile-marker)
```

Slope keywords: **gentle, with one steep beat at columns 12–16.**

### 5.3 Egg placement

- **Dawn-husk at column 6** (spawn flat). Same pattern as 1-1.

### 5.4 Enemy spawn table

| Type        | Count | Approx column(s) | Direction | Notes                                                  |
|-------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder |     2 | 22, 50           | left      | One on first descent (ground-throw practice before the gap), one on second descent. |
| Hummerwing  |     2 | 30, 44           | left      | Column-30 drifts above the fire — split-attention beat (player must read fire AND flier). Column-44 drifts over the second crest. |

### 5.5 Static obstacle table

| Kind | Count | Approx column(s) | Notes                                                |
|------|------:|------------------|------------------------------------------------------|
| Rock |     1 | 28               | Inside the valley, between gap landing and fire. Slows the player so they can't sprint through fire blindly. |
| Fire |     1 | 31               | Single fire patch in the valley. Round 1-2's hard beat: gap (24-26) → rock (28) → fire (31) → Hummerwing (30 above) all in 10 columns. |

### 5.6 Mile-marker placement

- **Mile-marker at column 63.**

### 5.7 Threat curve / intent

Three small increments: (1) first crest's steep beat — "you can walk up steep
but it costs momentum"; (2) valley puzzle — first time the player thinks about
altitude and ground simultaneously; if they're going to die a lot in Area 1,
this is where; (3) final descent + 3-tile gap — *commit the throw before you
commit the jump*.

---

## 6. Round 1-3 — **The Pinned Path**

**Theme intent:** Introduce **rock-pinned Mossplodder** and **multiple fire
patches**. Density round; same length as 1-1, half a screen denser.

### 6.1 Length and shape

- **~3 screens, ~48 columns wide.**
- Long shallow uphill from spawn, plateau, gentle downhill at the end. Plateau
  is where most of the round happens.
- One jump gap near the start (3 tiles), enforcing armed-and-ready before
  plateau combat begins.

### 6.2 Terrain rhythm

```
columns 0–6    : flat (spawn)
columns 6–9    : gap (3 tiles) — early-round mandatory jump
columns 9–13   : gentle uphill (slope_up_22)
columns 13–17  : steep uphill (slope_up_45)
columns 17–35  : flat plateau (the round's combat zone)
columns 35–40  : gentle downhill (slope_dn_22)
columns 40–48  : flat (final stretch + mile-marker)
```

Slope keywords: **gentle entering, steep crest, then long flat.**

### 6.3 Egg placement

- **Dawn-husk at column 4** (spawn flat, *before* the gap). Reed must be armed
  for the early gap because the next thing past it is a slope with a Mossplodder
  rolling down.

### 6.4 Enemy spawn table

| Type        | Count | Approx column(s) | Direction | Notes                                                  |
|-------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder |     3 | 17, 24, 31       | left      | Three on the plateau. Column-24 plods into rock at column 23 and stalls — the **rock-pin beat**, classroom example. |
| Hummerwing  |     2 | 27, 38           | left      | One mid-plateau (duck or shoot through), one over the descent. |

### 6.5 Static obstacle table

| Kind | Count | Approx column(s) | Notes                                                     |
|------|------:|------------------|-----------------------------------------------------------|
| Rock |     2 | 23, 33           | Column-23 pins the column-24 Mossplodder (feature, not bug). Column-33 blocks the player at the plateau exit, forcing a jump near column-31 Mossplodder. |
| Fire |     2 | 19, 29           | Two patches on the plateau, framing the rock-pin. Path puzzle: "fire → rock → Mossplodder → fire → rock-Mossplodder → Mossplodder." |

### 6.6 Mile-marker placement

- **Mile-marker at column 47.**

### 6.7 Threat curve / intent

The path is full but it has rules. Mossplodders walk in straight lines and stop
at rocks — **use the rocks** to position throws. Fires never move. Hummerwings
cruise at chest-height — jump-throw or duck (no crouch in v0.50; "duck" = stand
still under their drift line on a slope-low spot). A clean clear of round 1-3
means the player has learned everything Area 1 has to teach.

---

## 7. Round 1-4 — **To the Boundary**

**Theme intent:** Synthesis. Use everything 1-1 → 1-3 taught. Slightly longer,
fewer obstacles per column than 1-3 (so it doesn't feel cramped) but a higher
proportion of multi-threat moments. Ends at the **boundary cairn**.

### 7.1 Length and shape

- **~4 screens, ~64 columns wide.**
- Alternating crest-and-valley. Three crests, two valleys.
- Three jump gaps total: short-medium-medium, all on descents.

### 7.2 Terrain rhythm

```
columns 0–6    : flat (spawn)
columns 6–10   : gentle uphill (slope_up_22)
columns 10–14  : flat crest #1
columns 14–17  : gentle downhill (slope_dn_22)
columns 17–19  : gap (2 tiles)
columns 19–24  : flat valley #1
columns 24–28  : gentle uphill (slope_up_22)
columns 28–32  : steep uphill (slope_up_45)
columns 32–36  : flat crest #2
columns 36–40  : steep downhill (slope_dn_45)
columns 40–43  : gap (3 tiles)
columns 43–48  : flat valley #2
columns 48–52  : gentle uphill (slope_up_22)
columns 52–56  : flat crest #3 (cairn approach)
columns 56–60  : gentle downhill (slope_dn_22)
columns 60–62  : gap (2 tiles)
columns 62–64  : flat (cairn here)
```

Slope keywords: **gentle and steep, alternating. Most slope variety in Area 1.**

### 7.3 Egg placement

- **Dawn-husk at column 4** (spawn flat). Standard pattern.

### 7.4 Enemy spawn table

| Type        | Count | Approx column(s) | Direction | Notes                                                       |
|-------------|------:|------------------|-----------|-------------------------------------------------------------|
| Mossplodder |     4 | 13, 22, 38, 54   | left      | One on each crest/plateau. Column-38 rolls down the steep descent (slope_dn_45) toward Reed — first Mossplodder gaining momentum on a steep slope. |
| Mossplodder |     1 | 47               | **right** | A right-facing Mossplodder rolling AWAY from Reed in valley #2. Reed must catch up and throw before it falls into the next gap (60-62). The "save it / kill it / let it fall" decision moment. |
| Hummerwing  |     3 | 20, 34, 58       | left      | One per crest-or-valley span. Column-58 is the **last threat before the cairn** — clean, dramatic. |

### 7.5 Static obstacle table

| Kind | Count | Approx column(s) | Notes                                                          |
|------|------:|------------------|----------------------------------------------------------------|
| Rock |     3 | 21, 44, 55       | Valley-1 rock pre-stages column-22 Mossplodder. Valley-2 rock at 44 blocks Reed after the gap landing (beat to plan the right-facing Mossplodder catch). Crest-3 rock at 55 sits between Reed and column-54 Mossplodder, blocking the easy throw. |
| Fire |     2 | 25, 50           | One in late uphill of crest #2 (under column-22 Mossplodder's path — ignore it and it walks into the fire). One on the cairn approach uphill (last fire in Area 1, deliberate visual closure). |

### 7.6 Boundary cairn placement

- **Boundary cairn at column 63** (final tile of the round). Reed walks into it
  → stage-clear ritual (§3.2).

### 7.7 Threat curve / intent

The final exam: (1) crest #1 + valley #1 — callback to 1-2's valley puzzle,
slightly harder; (2) crest #2 + steep descent — hardest spatial read in Area 1,
the player throws *up the slope* at the descending Mossplodder; (3) valley #2 +
right-facing Mossplodder — first non-default direction, rewards reading-speed;
(4) crest #3 + cairn approach — last fire, last Hummerwing, last gap, then
cairn. Pacing is intentionally **higher early, gentler late** — the player
should pass the cairn breathing out, not gasping.

---

## 8. Encounter pacing across Area 1

Difficulty curve in one table:

| Round | Length | Mossplodders | Hummerwings | Rocks | Fire | Slopes (steep / total) | Gaps | Notes |
|-------|-------:|-------------:|------------:|------:|-----:|-----------------------:|-----:|-------|
| 1-1   |   ~48c |            1 |           0 |     1 |    0 |              0 / 6     |    1 | Teaching round, single threat |
| 1-2   |   ~64c |            2 |           2 |     1 |    1 |              1 / 8     |    2 | Hummerwing + fire introduced; valley puzzle is the hard beat |
| 1-3   |   ~48c |            3 |           2 |     2 |    2 |              1 / 6     |    1 | Density round; rock-pin beat introduced |
| 1-4   |   ~64c |            5 |           3 |     3 |    2 |              2 / 12    |    3 | Synthesis; right-facing Mossplodder and steep-descent throw |

**1-1 → 1-2:** sharp jump in count (1 → 4 enemies; 1 → 3 hazards). Steepest
single-round increase in Area 1 — but round 1-1 is so light that this leap
feels right. **1-2 → 1-3:** density-up at constant length. Same hazard count,
more Mossplodders, tighter spacing. **1-3 → 1-4:** length-up at modest
density. New beats: steep-descent enemy, right-facing enemy. Synthesis, not
escalation.

If first-pass playtest shows 1-2 too hard, cleanest fix: remove column-30
Hummerwing (split-attention removed; Hummerwing returns in 1-3). Flag in §11 Q1.

---

## 9. For Design

Layout-and-tileset hand-off (sprite-level art is in `phase2-cast-revision.md`
§11).

### 9.1 Tileset — `assets/tiles/area1.js`

| Tile key       | Type    | Visual intent                                                                                   |
|----------------|---------|--------------------------------------------------------------------------------------------------|
| `flat`         | static  | Loam soil top, root-and-bark side.                                                              |
| `slope_up_22`  | static  | Flat with top edge rising 1 tile in 3; leaf-curl at leading edge.                                |
| `slope_up_45`  | static  | 1:1 ramp; heavier root-knot at the crest to telegraph the steep beat.                            |
| `slope_dn_22`  | static  | Mirror of `slope_up_22`.                                                                         |
| `slope_dn_45`  | static  | Mirror of `slope_up_45`.                                                                         |
| `flat_crest`   | static  | Optional `flat` variant for slope tops (a few visible roots/stones); helps eye read "I'm on a peak now." Not required. |
| `flat_valley`  | static  | Optional `flat` variant for valley bottoms (slightly damper, mossier). Same.                     |
| `rock_small`   | static  | One-tile rock. (Cast §7.)                                                                        |
| `rock_large`   | static  | Two-tile-tall variant — optional; one or two in Area 1 for visual variety.                       |
| `fire_low`     | animated| 4-frame flicker. (Cast §8.)                                                                     |
| `gap`          | n/a     | Not a tile — gaps are the absence of any ground tile in a column.                                |

Palette: `loam-soil` (warm tan), `moss-green` (top-edge highlight), `wet-bark-
brown` (side fill), `dawn-amber` (root highlights, fire base), `pale-gold` (fire
tongue tips), `velvet-shadow` (line work — never pure black). See
`docs/story/world.md`.

### 9.2 Parallax backgrounds — `assets/bg/area1-*.svg`

| Layer file              | Content intent                                                        | Scroll factor |
|-------------------------|-----------------------------------------------------------------------|---------------|
| `area1-sky.svg`         | Soft amber-warm sky strip across the top ~30 % of the canvas; faint horizontal cloud bands. No sun disc (story-fiction is dawn). | 0.0 (static)  |
| `area1-trees.svg`       | Horizontally tileable strip of distant tree canopy in cool greens, with one or two stylized ruin-stone silhouettes. ~50 % of canvas height. | 0.3            |
| `area1-fore.svg`        | Foreground foliage — drooping leaves and grasses framing the bottom edge. Slightly violet-cool. ~20 % of canvas height. | 0.7            |

Backgrounds are SVG (per `docs/design/contracts.md`), tileable horizontally.
Should feel **simple and looping** per the project owner's note. Don't over-
detail; the eye is on the ground.

### 9.3 Round-data file (level data)

Suggest **one module per round** under a new directory `assets/levels/area1/`
(final path is dev-lead's call):

```
assets/levels/area1/round1.js
assets/levels/area1/round2.js
assets/levels/area1/round3.js
assets/levels/area1/round4.js
```

Each module exports a level descriptor with at minimum: tile-column data (per
column: floor height, tile-key, slope metadata); entity placements (`{ type, x,
y?, dir }`); spawn position; mile-marker / cairn position. Story-lead is not
authoring the actual data files (that's design-lead / dev-lead territory), but
the placement tables in §4–§7 are **source-of-truth** for whoever does. If a
placement doesn't make sense in the final tilemap, flag it to story-lead before
adjusting.

---

## 10. For Dev

### 10.1 New / extended systems

- **`StageManager`** — owns 4-round Area 1 progression. (Cast §12.3.) Loads
  round-data on round-start. Spawns Reed at `column 0` with `player.armed =
  false`. Spawns entities per the round's placement list. Listens for `mile-
  marker triggered` events → runs round-transition ritual (§3.1) → loads next
  round. Listens for `cairn triggered` event → runs stage-clear ritual (§3.2).
  Tracks current round (1–4) for the round-number overlay.
- **`SlopeCollision`** — extends physics for sloped ground. (Cast §12.3.)
- **`PickupSystem`** — handles dawn-husk break + `player.armed` flip.
- **`TriggerSystem`** — handles mile-marker + cairn detection.
- **`CameraSystem`** — already exists per v0.25.1 (camera lerp, player at
  ~1/3 from left). Reuse. Each round's stage-extent = round-length × 48 px.
- **`ParallaxBackground`** — already exists per `docs/design/contracts.md`.
  Reuse with the three new SVG layers.

### 10.2 Edge cases

- **Hatchet vs. slope.** The parabolic trajectory lands short on uphill and
  travels further on downhill — that's a **feature**. Round 1-4's steep-
  descent Mossplodder (column 38) is balanced around this: Reed is below the
  descending Mossplodder, throws hatchet up, hatchet's parabolic peak crosses
  the Mossplodder's path. Don't flatten this by ignoring floor altitude.
- **Mossplodder + slope.** Should accelerate down a slope (gravity on slope).
  Up a slope: walks at constant `walkSpeed` *along the slope normal*, not
  constant horizontal speed. Same convention as Reed.
- **Fire under a Mossplodder.** Round 1-3 places fires near Mossplodder paths
  intentionally — ignore the Mossplodder, it walks into a flame patch and dies.
  Verify in smoke check.
- **Off-screen despawn.** Mossplodders falling into a gap despawn ~2 tiles
  below the lowest floor. Hummerwings drifting past the round's right edge
  (only happens on backtrack) also despawn — they don't loop.
- **Reed off the bottom.** Mistimed gap jump = game over. No respawn (per
  v0.25.x).
- **Round transition mid-throw.** Hatchet despawns silently with the round.
  Don't carry projectiles across rounds.

### 10.3 Smoke checks (v0.50 quartile gate, full Area 1)

Per `CLAUDE.md` v0.50: "Phase 2: Area→Round table, stage transitions; Area 1
fully playable."

1. **Round 1-1:** Walk right from spawn. Hit egg at col 7 → armed. Slopes →
   gap (cols 25-28) → kill Mossplodder at col 32 with one hatchet → jump rock
   at col 38 → mile-marker at col 47. Verify fade + "Round 1-2" overlay + load.
2. **Round 1-2:** Spawn unarmed (verify). Egg at col 6. Steep crest. Land first
   gap. In valley: avoid fire (col 31), jump rock (col 28), jump-throw or duck
   col-30 Hummerwing, kill col-22 Mossplodder. Repeat across second crest +
   second gap. Mile-marker at col 63.
3. **Round 1-3:** Spawn unarmed. Egg at col 4. Jump early gap. Up the plateau.
   Verify col-24 Mossplodder pins against col-23 rock (walk-against-wall idle,
   vx=0). Throw hatchet, kill it. Navigate fire+rock+Mossplodder+Hummerwing
   density. Mile-marker at col 47.
4. **Round 1-4:** Spawn unarmed. Egg at col 4. Three crests. Verify col-38
   Mossplodder rolls down steep descent and hatchet arc reaches it from valley
   below. Verify col-47 right-facing Mossplodder either falls into col-60-62
   gap or can be killed before. Cairn at col 63 → "Stage Cleared" overlay.
5. **Total run:** all four rounds back-to-back, no console errors. Game-over
   from any single hit at any point. Clean-run target: ~3 minutes for an
   experienced playtester.

---

## 11. Open questions for release-master

1. **Round 1-2 difficulty calibration.** Valley puzzle (gap → rock → fire →
   Hummerwing in 10 columns) is the hardest beat. If first-pass playtest shows
   it's a wall, cleanest fix is to delete column-30 Hummerwing (Hummerwing
   returns later or in 1-3). Decide before Design starts so round-data isn't
   reworked.
2. **Multi-round armed persistence.** Cast brief §11 Q6 — should `player.armed`
   reset to false at every round start? Recommendation **yes** (every round
   opens with an egg). If release-master prefers persistence, the eggs in
   rounds 1-2 / 1-3 / 1-4 should be replaced or removed. Decide before Design
   draws four egg sprites needlessly.
3. **Stage-cleared overlay copy.** `"Area 2 ahead in v0.75."` is release-honest
   but maybe too meta. Alternates: "The next boundary waits." / "The path
   continues — soon." Pick before Design renders the overlay; bilingual
   parallel needs authoring either way.
4. **Round-overlay typeface.** Use existing in-game HUD font (recommended for
   v0.50) or commission a new title-card typeface.
5. **Animated tile contract extension.** Fire tile (cast §8) needs the tile
   module to support an animation track — a `docs/design/contracts.md` change.
   Design-lead should sign off in this PR family or a sibling PR. Without it,
   fire ships as an entity-with-sprite + a `obstacle` ECS component.
6. **Background music for Area 1.** Cast brief §1 calls the Area "kettle-warm
   morning"; audio direction is in `docs/story/world.md` ("woody/wet, not
   metallic"). Out of scope for this brief, but flag if release-master wants
   story-lead to sketch a melodic-mood note alongside.

---

## Changelog

(None at publication.)

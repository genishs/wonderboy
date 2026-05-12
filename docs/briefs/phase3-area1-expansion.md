# Phase 3 — Area 1 expansion brief (v0.75)

> **Authoring agent:** story-lead
> **Consumers:** design-lead, dev-lead
> **Reviewer:** release-master
> **Companion docs:** `docs/briefs/phase3-boss-cast.md`, `docs/briefs/phase2-areas.md`, `docs/briefs/phase2-cast-revision.md`, `docs/story/world.md`
> **한국어 버전:** [phase3-area1-expansion.ko.md](./phase3-area1-expansion.ko.md)

This brief expands Area 1 from a single multi-screen stage (the Mossline Path forest) into a **four-stage Area**: forest → shore → cave → dark forest. Stage 1 is held verbatim from Phase 2. Stages 2-4 are authored fresh here. The final round of Stage 4 hands the player off to the boss arena spec'd in the companion brief `phase3-boss-cast.md`. Numeric quantities are *suggestions* for dev-lead to tune in code; spatial intent and pacing are load-bearing.

> **Tribute, not a port.** The 4-stages-per-area shape and "boss at the end of the final stage" beat are universal action-platformer conventions and are used here as such. The four-biome sequence (forest → shore → cave → dark forest) likewise is a universal action-platformer cadence used across many games; we use the *sequence*, not anyone else's execution. Every biome theme execution (shore / cave / dark-forest) is invented for this project; specific stage layouts and signature beats from the inspirational original series are not consulted or referenced. Where prior briefs coined original vocabulary (Mossplodder, Hummerwing, dawn-husk, stone hatchet, mile-marker, boundary cairn, the Mossline Path), this brief continues that vocabulary and adds Stage 2-4 keywords to the same family.

---

## 1. Area 1 expansion overview

Area 1 stops being a single morning walk. It becomes a **half-day journey east through the Verdant Ruin's outer layer** — four stages strung along a single line of travel, each opening into a different terrain at the foot of the ruin the player has only seen the edge of.

**Stage 1 — The Mossline Path** (held verbatim from Phase 2). The forest seam at the foot of the Verdant Ruin: warm loam, cool canopy, Mossplodders rolling across the path, Hummerwings drifting at chest height, a few cracked patches of old fire surfacing through the soil. This is the teaching ground — see `phase2-areas.md` for the full spec, and `phase2-cast-revision.md` §10 Changelog for v0.50.1's "one continuous 224-column stage" + v0.50.2's mile-marker-at-round-start positions. **Nothing in Stage 1 changes for v0.75.** Reed simply now passes through the end-of-stage transition (rather than the v0.50 terminal `Stage Cleared`) and the next stage loads.

**Stage 2 — Sumphollow** (new — shore). Past the Mossline's last cairn, the forest opens out and the path tips downward onto a sun-warmed strip of shore. The Sumphollow is the Verdant Ruin's first *outer-edge* room: a long horizontal stretch of pale sand and bleached driftwood, with the slow lift-and-fall of a tidal edge along the seaward side and a tall **lighthouse silhouette** standing on the far horizon line. The shore does not feel hostile — it feels *open*, like a porch someone left a chair on. Mossplodders down here are slightly paler and salt-bleached (shore-shell); Hummerwings drift in the warm sea-air near the dune crests. The fauna read as cousins of Stage 1's, not new species. **Reed is learning that the Verdant Ruin opens onto a sea it never names.**

**Stage 3 — Brinklane** (new — cave). The Sumphollow's far end ends at a cave-mouth carved into the cliff-foot at the edge of the shore, and Reed climbs down into it. The Brinklane is the Verdant Ruin's first underground room: a long horizontal cave with a low stone ceiling in places, drip-fed pools at the floor, and hairline cracks in the rock that still glow faintly amber from whatever the ruins used to keep there. The cave does not feel hostile — it feels *quiet*, like a cellar someone left the door open on. Stage 3's signature beat is the **low-ceiling crawl section** in Round 3-1 (the cave's only one); the rest of the round opens back to standard headroom. Mossplodders down here are slightly larger and shell-paler (cave-moss); Hummerwings drift in the warmer pockets near the ceiling-cracks. Cave gap-pools (still water below the cave-floor breaks) replace the open-air gaps of Stage 1 — fall in, drown in the dark; same 1-hit-kill rule. Mossplodders along the bank tend to walk *into* the gap-pools and drown (feature, classroom example). **Reed is learning that the Verdant Ruin has interiors.**

**Stage 4 — The Old Threshold** (new — dark forest). The Brinklane's far end climbs back up a flight of root-broken steps and emerges into a **dark-forest interior** — a tall canopy of leaves so layered overhead that almost no daylight reaches the floor. This is the deep wood the Verdant Ruin grew around. Gnarled roots web the ground; occasional silver slits of moonlight reach between the leaves and stripe the floor; the air is cold and the colour-cast is blue-green with violet undertones. There are no Hummerwings here; the canopy crowds out their flight. There are no fires, because the dark forest keeps its warmth somewhere Reed cannot read. The room **wakes up** as Reed approaches the back of the wood — and what wakes is the **Bracken Warden** in a small open **glade clearing** at the center of the canopy (see `phase3-boss-cast.md`). Stage 4 is short, ritual, and ends at the boss arena beat.

The four stages together form one day's walk: morning forest, mid-morning shore, late-morning underground, noon at the threshold of something older than the path. The "boundary cairn" of Phase 2 turns out, in retrospect, to have been a roadside marker — not a boundary — and the real boundary is the Old Threshold's dark-forest glade.

---

## 2. Carrying state across stages

Decisions already-locked (see project context); encoded here so dev-lead has the contract in one place.

| What carries                            | Reset on stage entry?                    | Reset on death?                              | Notes |
|-----------------------------------------|------------------------------------------|----------------------------------------------|-------|
| `pl.armed` (stone hatchet possession)   | No — carries Stage 1 → 2 → 3 → 4         | No (preserved across mid-stage respawn)      | Same rule as v0.50.1 within Stage 1; now extends across stages. |
| `state.vitality`                        | **Yes** — refills to max on stage entry. | No (vitality is the per-life pressure clock) | Small reward beat. The mile-marker-pass refill from v0.50.1 stays inside a stage; stage-transition refill is a stronger reward. |
| `state.lives`                           | No — carries Stage 1 → 2 → 3 → 4         | Yes (life decrements on death)               | Lives only refill on full Area restart via Continue (per v0.50.2 GAME OVER semantics) or on Area completion. |
| `pl.lastCheckpointCol` (mile-marker)    | **Yes** — reset to Stage N's spawn col   | No (used for respawn within stage)           | Each stage has its own mile-marker chain; the chain does not carry between stages. |
| `pl.aiState`, `pl.dyingFrames`, etc.    | Yes — fresh spawn pose                   | n/a                                          | Fresh frame budget on each stage load. |

**Why `pl.armed` carries but vitality doesn't:** the hatchet is the player's equipment (earning it is the Stage 1 ritual); vitality is their fatigue. Stepping from Mossline down onto the Sumphollow shore refreshes the body but the tool stays in the hand.

**On the egg in Stages 2-4.** Stages 2, 3, and 4 do **not** contain a dawn-husk. Reed enters each of those stages already armed (carried from Stage 1). If Reed loses a life in Stages 2-4, he respawns at the latest mile-marker in that stage *still armed* (consistent with v0.50.1's within-stage rule). If Reed loses all three lives and is offered Continue, he restarts at Stage 1 spawn unarmed, the way the run started — full reset.

---

## 3. Stage transition ritual (new — between Stages 1→2, 2→3, 3→4)

At the end of Stages 1, 2, and 3 the rightmost tile is **not** the v0.50 boundary cairn but a new trigger tile — the **stage-transition tile** (working name; see §10). Reed walks into it; the system fires:

1. Player input suspended ~30 frames (Reed continues facing forward; if mid-jump, completes the arc and lands before suspension takes effect — dev-lead's call on the exact gate).
2. Stage-transition tile plays its `clear` animation (~16 frames) — same animation slot as the cairn's `clear` (see §10 / Design hand-off).
3. Fade-to-black over ~45 frames (between the 30-frame mile-marker fade and the 60-frame cairn fade of Phase 2 — this is a between-stage beat, not within-stage and not end-of-area).
4. Stage-name overlay holds ~75 frames:
   ```
   Stage 2 — Sumphollow
   스테이지 2 — Sumphollow
   ```
   Centered. Bilingual parallel (EN above KO; small caption font for KO; same typeface family as the existing `Round N` mile-marker overlay). The stage's coined name ("Sumphollow", "Brinklane", "The Old Threshold") stays verbatim in both halves — original names per `CLAUDE.md` bilingual policy.
5. StageManager swaps the active stage data (Stage 2 / 3 / 4's `buildStageN()`).
6. Vitality refills to max (§2).
7. Fade-from-black ~45 frames.
8. Reed's spawn pose appears at Stage N's `x = 0` with `pl.armed` carried.
9. Player input restored.

Total: ~210 frames (~3.5 seconds). Slightly longer than the v0.50 within-stage round-overlay (90 frames) because between-stage beats are heavier.

**At the end of Stage 4** (defeat of the Bracken Warden in the boss arena, not a transition tile), the ritual is different — see §8 and `phase3-boss-cast.md`.

---

## 4. Stage 1 — The Mossline Path (UNCHANGED)

Held verbatim from Phase 2. See `docs/briefs/phase2-areas.md` for the full round-by-round spec and `docs/briefs/phase2-cast-revision.md` §11 Changelog (v0.50.1 and v0.50.2 entries) for the as-shipped continuous-stage layout, mile-marker positions, and lives/checkpoint semantics. The only delta in v0.75 is the **end-of-stage trigger**: the boundary cairn at the rightmost column of Stage 1 is **replaced by a stage-transition tile** (§3) so Reed advances to Stage 2 instead of seeing the "Stage Cleared" overlay. The cairn art and behavior are reserved for end-of-Area beats (currently end of Stage 4 + Area 1 cleared, but Design may park the cairn module on disk for future Areas).

Mile-marker chain inside Stage 1 unchanged: `mile_1` col 3, `mile_2` col 50, `mile_3` col 114, `mile_4` col 162 (per v0.50.2). Stage 1's stage-transition tile sits at col 223 (the column that previously held the boundary cairn).

---

## 5. Stage 2 — **Sumphollow** (shore)

**Theme intent:** First *outer-edge* room. Teach **read a tidal hazard, fight along an open horizon line, recognize variant skins of the same enemies**. Wider and brighter than Stage 1's enclosed forest; never harsh-bright — Sumphollow should feel like a porch at mid-morning, not a noon beach.

**Mood / palette keywords for Design:**
- `sun-warmed-sand` (pale warm cream — the dry sand of the shelf Reed walks on; warmer cousin of Stage 1's `loam-soil`)
- `sea-foam-cool` (the broken-wave edge along the tidal line — a near-white blue-green with a fine warm rim)
- `tide-line-deep` (the deeper water beyond the foam — a saturated cool blue-green; deep enough to read "I should not enter this")
- `driftwood-bleach` (pale sun-bleached wood of stranded planks and old pilings; warm-grey, never grey-grey)
- `lighthouse-silhouette` (the distant lighthouse on the parallax horizon — drawn as a single slim shape in `velvet-shadow`, never a tower the player can reach; a *landmark*, not geometry)

The shore should **share verbatim** the `velvet-shadow` (`#3a2e4a`) ink convention from Stage 1 — the eye reads "same world, different room." Avoid introducing any saturated sky-cyan that would feel like a different game's beach; keep the sea cool-but-quiet, not vacation-postcard. Per `docs/story/world.md`: no pure black, even in the shore's deepest water.

**Length:** ~192 tile-columns total across four rounds (slightly shorter than Stage 1's 224; the shore is a transit room, not a teaching room). Stage 1 was 4 rounds × ~3-4 screens each ≈ 4.7 screens-per-round average; Stage 2 holds the same rhythm with one less screen of total run.

### 5.1 Round 2-1 — "First Descent"

**Length:** ~3 screens, ~48 columns. The Sumphollow's entry: Reed steps off the Mossline's final slope onto open sand and gets his first read of the **tidal edge** (see §5.5) — the round's signature beat. The terrain is calm; the new mechanic does the teaching.

**Terrain rhythm:**

```
columns 0–4    : flat (spawn — Reed enters from the forest path, armed)
columns 4–8    : gentle downhill (slope_dn_22) — the entry slope onto sand
columns 8–14   : flat sand (the round's signature tidal_edge sits along the seaward face — see §5.5)
columns 14–18  : flat sand (the tide retreats; safe footing returns)
columns 18–22  : gentle uphill (slope_up_22)
columns 22–26  : flat
columns 26–28  : gap (2 tiles) — first shore gap; falling = into the surf, 1-hit-kill
columns 28–34  : flat
columns 34–38  : gentle downhill (slope_dn_22)
columns 38–48  : flat (round end + mile-marker)
```

**Mile-marker placement:** `mile_5` at col 3 (this stage's first marker — round-start position per v0.50.2 convention; the global checkpoint index `mile_5` follows from Stage 1's `mile_1`-`mile_4`. Dev-lead may rename the in-asset key as needed).

**Enemy spawn table:**

| Type             | Count | Approx column(s) | Direction | Notes                                                  |
|------------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder (shore-shell variant) | 1 | 32 | left | First contact with the shore-shell variant — see §11. Meeting it just past the first tidal-edge lets the player practice "read the tide" right before "jump over rolling shell." |
| Hummerwing       |     0 | —                | —         | No fliers in 2-1 — let the player read the tidal_edge rhythm first. Hummerwings begin in 2-2.|

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small`|     1 | 16               | One rock (driftwood-bleach pale here) just past the tidal-edge zone. Soft re-introduction to stumble (per v0.50.2 rock behavior). |
| Tidal-edge hazard | 1 | 10              | The round's signature beat — a sea-foam wash that pulses across the seaward floor on a wave rhythm (see §5.5 + §11). Reed reads the pulse, waits, walks. |

**Threat curve / intent:** the round teaches one new thing (tidal-edge rhythm) and re-introduces one old thing (Mossplodder). Death is unlikely if the player has cleared Stage 1.

### 5.2 Round 2-2 — "The Warm Surf"

**Length:** ~4 screens, ~64 columns. The Sumphollow's main body. The doubled-tidal beat: two low valleys along the sand, each holding a **`tidal_edge`** wash (see §11). Same 1-hit-kill rule as fire — read the wave, walk on the dry frame.

**Terrain rhythm:**

```
columns 0–6    : flat (spawn-after-mile_5)
columns 6–10   : gentle uphill (slope_up_22) — over a dune crest
columns 10–14  : flat crest
columns 14–17  : gentle downhill (slope_dn_22)
columns 17–19  : gap (2 tiles)
columns 19–25  : flat valley (contains the first tidal_edge)
columns 25–29  : gentle uphill (slope_up_22)
columns 29–33  : flat crest #2
columns 33–37  : gentle downhill (slope_dn_22)
columns 37–40  : gap (3 tiles) — second shore gap; longer than 2-1's
columns 40–46  : flat (contains the second tidal_edge)
columns 46–50  : gentle uphill (slope_up_22)
columns 50–64  : flat (round end + mile-marker)
```

**Mile-marker placement:** `mile_6` at col 51.

**Enemy spawn table:**

| Type             | Count | Approx column(s) | Direction | Notes                                                  |
|------------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder (shore-shell variant) | 2 | 12, 30 | left | One on the first dune crest, one on the second. Standard left-facing forward roll. |
| Hummerwing (shore variant — see §11) | 2 | 22, 44 | left | First flier in Stage 2: the col-22 Hummerwing drifts above the first tidal_edge, the col-44 drifts above the second. **Split-attention beat:** the shore version is recolored slightly cooler against the sun-warmed sand (see §11), letting Design play the warm-spark-falls-cool kill-frame against the sea-foam palette. |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small`|     2 | 27, 48           | Driftwood-bleach rock stand-ins. Round-mid and round-end. Stumble + vitality drain per v0.50.2. |
| Tidal-edge  |     2 | 21, 43           | The shore's fire replacement. 1-hit-kill on contact. See §11. |

**Threat curve / intent:** the Stage 2 hard beat. Re-runs the v0.50 Round 1-2 valley puzzle (gap → flat → hazard → flier above) in shore dressing, twice. If first-pass playtest shows the doubled valley is a wall, cleanest fix is dropping the col-44 Hummerwing (Hummerwing returns in 2-4).

### 5.3 Round 2-3 — "Pinned and Washed"

**Length:** ~3 screens, ~48 columns. Stage 2's density round, structural parallel to v0.50 Round 1-3 (rock-pinned Mossplodder beat + multiple hazards). The tidal_edge replaces fire one-for-one.

**Terrain rhythm:**

```
columns 0–4    : flat (spawn-after-mile_6)
columns 4–7    : gap (3 tiles) — early mandatory jump
columns 7–10   : gentle uphill (slope_up_22)
columns 10–13  : steep uphill (slope_up_45)
columns 13–34  : flat plateau (combat zone)
columns 34–38  : gentle downhill (slope_dn_22)
columns 38–48  : flat (round end + mile-marker)
```

**Mile-marker placement:** `mile_7` at col 39.

**Enemy spawn table:**

| Type             | Count | Approx column(s) | Direction | Notes                                                  |
|------------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder (shore-shell variant) | 3 | 14, 22, 28 | left | Three on the plateau. Col-22 pins against rock at col-21 — the rock-pin classroom example, restaged on shore. |
| Hummerwing (shore variant) | 2 | 18, 31 | left | Mid-plateau and plateau-exit. Col-18 drifts over the first Mossplodder's path. |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small`|     2 | 21, 32           | Driftwood-bleach rock stand-ins. Col-21 pins the col-22 Mossplodder (feature, not bug). Col-32 blocks the plateau exit, forcing a stumble or a jump near the col-31 hazard. |
| Tidal-edge  |     2 | 16, 26           | Two tidal_edges on the plateau, framing the rock-pin. Path puzzle parallels v0.50 Round 1-3. |

**Threat curve / intent:** density round. By round end, the player has handled shore-shell Mossplodder + shore Hummerwing + tidal_edge + rock-pin in close quarters. Round 2-3 is also the round where Reed-vs-Mossplodder-vs-tidal_edge interaction is most useful — tide-pin a Mossplodder by walking it into a wave-wash.

### 5.4 Round 2-4 — "To the Brink"

**Length:** ~4 screens, ~64 columns. Synthesis round. Less dense than 2-3, longer than 2-1, ends at a **stage-transition tile** (the shore's brink — the cave-mouth carved into the cliff-foot at the seaward edge, leading into Brinklane).

**Terrain rhythm:**

```
columns 0–6    : flat (spawn-after-mile_7)
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
columns 52–56  : flat crest #3 (transition approach)
columns 56–60  : gentle downhill (slope_dn_22)
columns 60–62  : gap (2 tiles)
columns 62–64  : flat (transition tile here)
```

**Mile-marker placement:** `mile_8` at col 3.

**Enemy spawn table:**

| Type             | Count | Approx column(s) | Direction | Notes                                                  |
|------------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder (shore-shell variant) | 4 | 12, 22, 38, 54 | left | One on each crest/plateau. Col-38 rolls down the steep descent — first shore-Mossplodder gaining speed on a slope. |
| Mossplodder (shore-shell variant) | 1 | 47 | **right** | Right-facing variant in valley #2. The same "save it / kill it / let it fall" decision as v0.50 Round 1-4. |
| Hummerwing (shore variant) | 2 | 20, 58 | left | Col-58 is the last threat before the stage-transition tile. |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small`|     2 | 44, 55           | Driftwood-bleach stand-ins. Valley-2 rock blocks Reed after the gap landing. Crest-3 rock sits between Reed and the col-54 Mossplodder. |
| Tidal-edge  |     1 | 50               | Single hazard on the brink-approach uphill (deliberate visual closure of the shore's hazards). |

**Stage-transition tile placement:** col 63 (final tile of the round; final tile of the stage). Reed walks in → ritual §3 → Stage 3 loads.

**Threat curve / intent:** parallels v0.50 Round 1-4. Stage 2's exam ends on a downhill into the next stage; the player should pass the threshold breathing out, not gasping.

### 5.5 New hazard idea — the tidal-edge wave-rhythm

Sumphollow's **signature beat** — the shore's only new mechanic beyond Stage 1's vocabulary. A short stretch of seaward floor (~6 tiles wide) where the **`tidal_edge`** hazard pulses on a wave rhythm: roughly 60 frames "wet" (active, 1-hit-kill) → 60 frames "drying" (visible foam receding, still lethal) → 60 frames "dry" (safe to walk) → 60 frames "rising" (foam returning, safe early then lethal late). Introduced in Round 2-1 and used as the round's signature read; reappears as ordinary tidal_edge tiles in later rounds (the wave-rhythm is the same in every instance, all instances of the tile sharing the global wave timer so the player learns *one* rhythm).

- **Implementation:** the `tidal_edge` tile is a normal animated hazard tile (per `fire_low` shape — see §11.3), with a 4-frame anim cycle running at ~3 fps. The kill-window vs. safe-window is read off the tile's current frame; Dev can either gate the hazard with a tile-state-tied collider or simulate it as four contiguous tile variants the StageManager swaps in lockstep (Dev's call — story-lead expresses the rhythm, not the implementation). Reed's existing walk/jump speeds remain unchanged.
- **Hummerwing read:** Hummerwings drift above the tidal_edge unaffected — the foam doesn't reach their altitude. Visually, the wave's spray crest reflects in the Hummerwing's body amber for a frame, giving Design a chance to play warm-against-cool.
- **Visual cue:** Design hints the active wave with crested sea-foam highlights and a subtle warm rim where the dawn-amber catches the spray. When the wave is "dry," only damp sand reads — a darker `sun-warmed-sand` shade — so the player sees the difference between "safe right now" and "wet but receded" without HUD copy.

### 5.6 Stage 2 threat curve summary

| Round | Length | Mossplodder | Hummerwing | Rocks | Tidal-edge | Slopes (steep / total) | Gaps | Notes |
|-------|-------:|------------:|-----------:|------:|-----------:|-----------------------:|-----:|-------|
| 2-1   |  ~48c  |          1  |         0  |    1  |        1   |              0 / 4    |    1 | Tidal-edge teaching beat. |
| 2-2   |  ~64c  |          2  |         2  |    2  |        2   |              0 / 8    |    2 | Doubled valley puzzle. Stage 2 hard beat. |
| 2-3   |  ~48c  |          3  |         2  |    2  |        2   |              1 / 6    |    1 | Density / rock-pin classroom. |
| 2-4   |  ~64c  |          5  |         2  |    2  |        1   |              2 / 12   |    3 | Synthesis. |

---

## 6. Stage 3 — **Brinklane** (cave)

**Theme intent:** First underground room. The shore ends at a cave-mouth carved into the cliff-foot, and Reed climbs down into the Verdant Ruin's first interior. The signature beat is the **low-ceiling crawl section** in Round 3-1 — the cave's only one; the rest of the round opens back to standard headroom. Brinklane is **darker, cooler, more enclosed** than Sumphollow; the player should feel they've come down out of the sun. Slightly tighter than Stage 1's open forest; never claustrophobic — Brinklane should feel like a barn at dawn, not a tomb.

**Mood / palette keywords for Design:**
- `wet-cave-stone` (cool blue-grey, slightly lifted from `river-stone-grey`)
- `cave-moss-blue-green` (the cave's signature: moss that's gone slightly more blue than forest moss because there's less sun)
- `amber-vein` (warm amber light leaking through hairline cracks in the stone — never a full open fire, just a glow)
- `pool-wet` (puddle highlights on the floor; reflective spots over gap-pools)
- `loam-dampened` (a deeper, more saturated cousin of Stage 1's `loam-soil`)

The cave should **share verbatim** the `velvet-shadow` (`#3a2e4a`) ink convention from Stage 1 — the eye reads "same world, different room." Avoid introducing any cool/dark hue that would feel like a different game. Per `docs/story/world.md`: no pure black, even in cave interior.

**Length:** ~192 tile-columns across four rounds (matching Stage 2's total).

### 6.1 Round 3-1 — "First Descent"

**Length:** ~3 screens, ~48 columns. The Brinklane's entry — Reed climbs down from Sumphollow's cliff-foot cave-mouth and the round's signature beat is the cave's only **low-ceiling crawl section** (see §6.5). After that, the ceiling lifts back to standard 12-tile height for the remainder. Cave gap-pools appear at the shelf breaks — visibly water but enclosed by stone, not the open river.

**Terrain rhythm:**

```
columns 0–6    : flat (spawn — Reed steps out of Sumphollow's cliff-foot cave-mouth, armed)
columns 6–10   : gentle uphill (slope_up_22)
columns 10–14  : LOW-CEILING flat — ceiling drops to 6 tiles (so vertical headroom is 6 tiles instead of 12)
columns 14–17  : flat (ceiling restored to full)
columns 17–19  : cave-gap-pool (2 tiles) — first gap-pool, dark still water below the cave-floor break
columns 19–25  : flat shelf #2
columns 25–28  : cave-gap-pool (3 tiles)
columns 28–34  : flat shelf #3
columns 34–38  : gentle uphill (slope_up_22)
columns 38–48  : flat (round end + mile-marker)
```

**Mile-marker placement:** `mile_9` at col 3.

**Enemy spawn table:**

| Type             | Count | Approx column(s) | Direction | Notes                                                  |
|------------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder (cave-shell variant) | 2 | 12, 22 | left | First contact with the cave-shell variant — see §11. Col-22 walks toward the cave-gap-pool at col 25 — if the player ignores it, **it walks off into the dark pool and drowns**. Classroom example of the Brinklane's signature interaction. |
| Hummerwing       |     0 | —                | —         | No fliers in 3-1 — the low ceiling would crowd the read. Hummerwings begin in 3-2. |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small`|     1 | 32               | Single rock on shelf #3. Stumble per v0.50.2. |
| Cave-gap-pool | 2 | 17–19, 25–28     | The cave's gap-pool variant: a normal gap with **dark still water visibly drawn underneath**, two tiles below shelf top. Same mechanic as a normal gap — falling in ends the run. See §11. |

**Threat curve / intent:** introduce the low-ceiling read + the cave-gap-pool rhythm. Reed has jumped gaps in Stage 1 already; now the gap has visible consequence under it. The drowning-Mossplodder beat is the round's "look what the world does."

### 6.2 Round 3-2 — "Stepping Stones"

**Length:** ~4 screens, ~64 columns. Stage 3's hard beat. Multiple short cave-shelf platforms separated by cave-gap-pools the player must clear, with **`amber-vein`** hazards (see §11) introduced on the flat shelves between the gaps. Hummerwings drift in low — close enough to reflect off the pool surfaces, far enough that a hatchet-throw arc can clear them.

**Terrain rhythm:**

```
columns 0–6    : flat (spawn-after-mile_9)
columns 6–10   : flat shelf
columns 10–13  : cave-gap-pool (3 tiles)
columns 13–18  : flat shelf
columns 18–21  : cave-gap-pool (3 tiles)
columns 21–25  : flat shelf
columns 25–28  : cave-gap-pool (3 tiles)
columns 28–34  : flat shelf
columns 34–38  : gentle uphill (slope_up_22)
columns 38–42  : flat crest
columns 42–45  : gentle downhill (slope_dn_22)
columns 45–48  : cave-gap-pool (3 tiles)
columns 48–54  : flat shelf
columns 54–58  : gentle uphill (slope_up_22)
columns 58–64  : flat (round end + mile-marker)
```

**Mile-marker placement:** `mile_10` at col 51.

**Enemy spawn table:**

| Type             | Count | Approx column(s) | Direction | Notes                                                  |
|------------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder (cave-shell variant) | 3 | 16, 24, 32 | left | One per middle shelf. Col-16 and col-24 will drown into the cave-gap-pools if ignored; col-32 has nowhere to drown (rock-pin would help — see obstacles). |
| Hummerwing (cave variant)       |     2 | 14, 46           | left      | Col-14 drifts above the second cave-gap-pool (reflects on the still-water surface); col-46 drifts past the fourth. Both are jump-throw targets. |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small`|     2 | 32, 53           | Col-32 pins the col-32 Mossplodder (small rock-pin reprise). Col-53 stumble before mile-marker. |
| Cave-gap-pool | 4 | 10–13, 18–21, 25–28, 45–48 | The round's signature: four cave-gap-pools in 50 columns. Reed has practiced two in 3-1; here he sustains the rhythm. |
| Amber-vein  |     1 | 38               | First `amber-vein` of Stage 3 — sits at the flat crest between cave-gap-pools so the player has a still moment to read it. 1-hit-kill on contact. See §11. |

**Threat curve / intent:** Stage 3 hard beat. Player must sustain hatchet-on-Mossplodder cadence while reading gap-pool spacing and the first amber-vein. Hummerwings add altitude pressure. If first-pass playtest shows it's a wall, cleanest fix is removing the col-32 Mossplodder (the rock-pin is a teaching beat, not a synthesis beat — let it land in 3-3 instead).

### 6.3 Round 3-3 — "The Warm Pocket"

**Length:** ~3 screens, ~48 columns. Density round, structural parallel to 1-3 / 2-3. The "warm pocket" is the visual signature: a long stretch of cave wall where the **amber-vein cracks cluster** along the floor, the brightest amber moment in Stage 3, and the cave's stored heat reads visibly on the wet stone. Combat density at the highest in Stage 3.

**Terrain rhythm:**

```
columns 0–4    : flat (spawn-after-mile_10)
columns 4–7    : cave-gap-pool (3 tiles) — early mandatory jump
columns 7–10   : gentle uphill (slope_up_22)
columns 10–13  : steep uphill (slope_up_45)
columns 13–34  : flat plateau (combat zone — the "warm pocket" plateau, amber-vein cracks underfoot)
columns 34–38  : gentle downhill (slope_dn_22)
columns 38–42  : cave-gap-pool (3 tiles)
columns 42–48  : flat (round end + mile-marker)
```

**Mile-marker placement:** `mile_11` at col 43.

**Enemy spawn table:**

| Type             | Count | Approx column(s) | Direction | Notes                                                  |
|------------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder (cave-shell variant) | 3 | 16, 22, 28 | left      | Three on the plateau. Col-22 pins against rock at col-21. |
| Hummerwing (cave variant)        |     2 | 18, 30           | left      | Two over the plateau. The "warm pocket" is brightest along the plateau floor; design should let the Hummerwings catch a touch of amber glow as they pass over the veins. |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small`|     2 | 21, 33           | Col-21 pins col-22 Mossplodder; col-33 forces a stumble or jump near col-28 Mossplodder. |
| Cave-gap-pool | 2 | 4–7, 38–42       | Bookend the plateau. Mandatory jumps. |
| Amber-vein  |     2 | 16, 26           | Two veins on the plateau, framing the rock-pin. Path puzzle parallels v0.50 Round 1-3 + the previous publication's amber-vein density beat. |

**Threat curve / intent:** density round. The warm-pocket plateau is a deliberate emotional beat — the brightest amber moment in Area 1 outside the boss arena — and the highest enemy density. Player should feel "this is the cave's heart" while keeping their throw cadence.

### 6.4 Round 3-4 — "To the Stair"

**Length:** ~4 screens, ~64 columns. Synthesis. Three crest-and-shelf groupings; the final shelf approaches the root-broken stairway that climbs out of the cave and into Stage 4.

**Terrain rhythm:**

```
columns 0–6    : flat (spawn-after-mile_11)
columns 6–10   : gentle uphill (slope_up_22)
columns 10–14  : flat shelf #1
columns 14–17  : gentle downhill (slope_dn_22)
columns 17–20  : cave-gap-pool (3 tiles)
columns 20–25  : flat shelf #2
columns 25–29  : gentle uphill (slope_up_22)
columns 29–33  : steep uphill (slope_up_45)
columns 33–37  : flat shelf #3
columns 37–41  : steep downhill (slope_dn_45)
columns 41–44  : cave-gap-pool (3 tiles)
columns 44–49  : flat shelf #4
columns 49–53  : gentle uphill (slope_up_22)
columns 53–57  : flat shelf #5 (transition approach)
columns 57–61  : gentle downhill (slope_dn_22)
columns 61–62  : cave-gap-pool (1 tile — narrowest gap in Area 1, a token-jump before the transition)
columns 62–64  : flat (transition tile here)
```

**Mile-marker placement:** `mile_12` at col 3.

**Enemy spawn table:**

| Type             | Count | Approx column(s) | Direction | Notes                                                  |
|------------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder (cave-shell variant) | 3 | 12, 22, 36 | left | One on each shelf. Col-36 rolls down the steep descent (slope_dn_45) toward col-41 cave-gap-pool — drowns into the dark if ignored. |
| Mossplodder (cave-shell variant) | 1 | 45 | **right** | Right-facing in shelf #4. Walks toward col-44 cave-gap-pool — the catch-or-let-it-drown beat. |
| Hummerwing (cave variant)        |     3 | 16, 32, 58       | left      | Col-32 drifts above the steep crest; col-58 is the last threat before the transition. |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small`|     2 | 26, 50           | Mid-round stumble beats. |
| Cave-gap-pool | 3 | 17–20, 41–44, 61–62 | The jump rhythm tapers into a narrow token-jump before transition. |
| Amber-vein  |     1 | 35               | Single hazard on flat shelf #3 (deliberate visual closure of cave hazards — the deeper into the cave the player walks, the rarer the warm pockets become). |

**Stage-transition tile placement:** col 63.

**Threat curve / intent:** structural parallel to v0.50 Round 1-4 and Stage 2's Round 2-4. Brinklane's last shelf reads quieter than Round 3-3's warm pocket — the cave is cooling toward the stairway. The narrowest cave-gap-pool (1 tile) is a small mercy on the way to Stage 4.

### 6.5 Stage 3 threat curve summary

| Round | Length | Mossplodder | Hummerwing | Rocks | Cave-gap-pools | Amber-vein | Slopes (steep / total) | Notes |
|-------|-------:|------------:|-----------:|------:|---------------:|-----------:|-----------------------:|-------|
| 3-1   |  ~48c  |          2  |         0  |    1  |             2  |         0  |              0 / 4     | Low-ceiling beat; teaching round. |
| 3-2   |  ~64c  |          3  |         2  |    2  |             4  |         1  |              0 / 6     | Stage 3 hard beat. |
| 3-3   |  ~48c  |          3  |         2  |    2  |             2  |         2  |              1 / 4     | Density / warm-pocket plateau. |
| 3-4   |  ~64c  |          4  |         3  |    2  |             3  |         1  |              2 / 10    | Synthesis. |

---

## 7. Stage 4 — **The Old Threshold** (dark forest)

**Theme intent:** the deep wood the Verdant Ruin grew around. Layered canopy overhead, gnarled root-floor, silver moonlight reaching the ground in narrow vertical slits, blue-green colour-cast with violet undertones, cold air. **No Hummerwings, no fire-equivalent hazard** — the canopy is too crowded for fliers and the air is too cold to keep a flame. The enemy density tapers; rocks remain (as moss-covered stumps and fallen root-knots); the path leads through three rounds of a longer dark-wood interior and culminates in a fourth round that is half-length and ends at the boss-arena glade entrance.

**Mood / palette keywords for Design:**
- `canopy-shadow-bluegreen` (the dominant colour-cast — deep, layered, the ground reads as twilight even when the canopy is "midday")
- `root-bark-deep` (the gnarled root-knots and stumps Reed walks around; cold-brown with a violet rim, never warm-bark)
- `moonlight-silver` (the narrow vertical slits of light that reach the floor between the leaves — drawn as pale, almost-white silver strokes, the warmest moments in Stage 4 outside the boss arena)
- `understory-violet` (the violet-grey shadow between root-knots; deeper than Stage 1's general violet-shade, the deepest non-ink shadow in Area 1)
- `wood-hush` (a mood word, not a color: Design should pick a palette that reads "quiet enough you can hear your footsteps press a leaf")

The Old Threshold should feel **older** than the shore and the cave — like the rest of the Verdant Ruin is the suburb and this is the forest everyone forgot. Use the **moonlight-silver palette warmth sparingly**; this is a stage where the silver streaks are rare and therefore weighted. The boss arena (§8) is where the moonlight returns in force, opening into a full glade clearing.

**Length:** ~152 tile-columns across four rounds (4-4 is half-length to leave room for the boss arena beat). Slightly shorter than Stages 2 and 3.

### 7.1 Round 4-1 — "Beyond the Steps"

**Length:** ~3 screens, ~48 columns. Stage 4 entry — Reed climbs a flight of root-broken steps and emerges into the dark-forest's outer rim. Wide, calm, foreshadowing rather than dense.

**Terrain rhythm:**

```
columns 0–6    : flat (spawn — Reed steps onto the dark-forest floor, armed)
columns 6–10   : gentle uphill (slope_up_22) — the last of the root-broken steps
columns 10–28  : flat (the outer rim; wide and quiet, root-knots scattered)
columns 28–32  : gentle downhill (slope_dn_22)
columns 32–35  : gap (3 tiles) — a sinkhole between root-knots in the wood floor
columns 35–48  : flat (round end + mile-marker)
```

**Mile-marker placement:** `mile_13` at col 3.

**Enemy spawn table:**

| Type             | Count | Approx column(s) | Direction | Notes                                                  |
|------------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder (dark-wood variant — see §11) | 2 | 18, 40 | left | Two on the outer rim. Slightly larger silhouette + silver moonlight catching the shell-ridge (see §11). |
| Hummerwing       |     0 | —                | —         | **No Hummerwings anywhere in Stage 4.** Canopy is too crowded; the dark forest's air is "too cold for hummers." |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small` (root-knot variant — see §11) | 1 | 24 | Single fallen root-knot. Stumble per v0.50.2. |
| (no fire / no amber-vein / no tidal-edge / no cave-gap-pool) | — | — | The dark forest has no hazard tiles. Threat lives entirely in Mossplodders + the boss. |

**Threat curve / intent:** Stage 4's quietest round. The player should feel they've arrived somewhere different — and the brief, dense Stages 2-3 are visibly past.

### 7.2 Round 4-2 — "Moonlight Slits"

**Length:** ~3 screens, ~48 columns. Introduces **moonlight streaks** as a visual element (not a hazard — see §11; moonlight streaks are a Stage 4 tile decoration that pours silver light across narrow vertical slits of floor but does not damage). The round has slightly more Mossplodders than 4-1, no new hazard.

**Terrain rhythm:**

```
columns 0–6    : flat (spawn-after-mile_13)
columns 6–10   : gentle uphill (slope_up_22)
columns 10–13  : flat
columns 13–17  : gentle downhill (slope_dn_22)
columns 17–19  : gap (2 tiles)
columns 19–25  : flat
columns 25–29  : gentle uphill (slope_up_22)
columns 29–34  : flat plateau
columns 34–38  : gentle downhill (slope_dn_22)
columns 38–48  : flat (round end + mile-marker)
```

**Mile-marker placement:** `mile_14` at col 3.

**Enemy spawn table:**

| Type             | Count | Approx column(s) | Direction | Notes                                                  |
|------------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder (dark-wood) | 3 | 14, 24, 32 | left | One per zone. Standard left-facing roll. |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small` (root-knot) | 2 | 28, 36 | Stumble beats. |
| Moonlight-streak decoration | 2 | 12-15 (slit), 30-33 (slit) | Visual only — these tiles render a narrow vertical silver light-shaft from the canopy down to the floor, drawn as pale `moonlight-silver`, but they do **not** damage Reed. They are the only place silver light appears in Stage 4 outside the boss-arena glade, and that's intentional pre-foreshadowing. See §11. |

**Threat curve / intent:** the round walks. No new mechanic, slightly more Mossplodders, more silhouette variety in tiles.

### 7.3 Round 4-3 — "The Inner Grove"

**Length:** ~3 screens, ~48 columns. The deepest mid-stage — the wood beyond the outer rim. Density highest in Stage 4 but still gentler than Stage 2 / 3 density rounds; the threshold's pace is measured.

**Terrain rhythm:**

```
columns 0–4    : flat (spawn-after-mile_14)
columns 4–7    : gap (3 tiles)
columns 7–10   : gentle uphill (slope_up_22)
columns 10–13  : steep uphill (slope_up_45)
columns 13–30  : flat plateau (inner grove)
columns 30–34  : gentle downhill (slope_dn_22)
columns 34–37  : gap (3 tiles)
columns 37–48  : flat (round end + mile-marker)
```

**Mile-marker placement:** `mile_15` at col 3.

**Enemy spawn table:**

| Type             | Count | Approx column(s) | Direction | Notes                                                  |
|------------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder (dark-wood) | 4 | 14, 20, 26, 32 | left | Four on the inner grove plateau. Rhythm: one every ~6 columns. The plateau is long; the player has time to throw, recover, advance, throw. |
| Mossplodder (dark-wood) | 1 | 25 | **right** | One right-facing in the grove. Approaches a Mossplodder coming from the left at col-26 — the two will collide mid-plateau (Mossplodders don't attack each other; they just stop against one another). Classroom example of "the world has its own physics." |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small` (root-knot) | 2 | 17, 35 | Stumble beats. |
| Moonlight-streak decoration | 1 | 20-25 (long slit) | Decoration only; one long silver shaft pours down between the colliding Mossplodders for a "the canopy parts for a moment" visual. |

**Threat curve / intent:** Stage 4 density beat. Forward-facing and right-facing Mossplodders together create a small puzzle: throw at the right-facing one first (it will block your forward path) or the left-facing one first (it will reach you sooner)?

### 7.4 Round 4-4 — "The Moonlit Path" (short — opens into boss arena)

**Length:** **~2 screens, ~32 columns** (shorter than every other round in Area 1 — by design, to leave room for the boss arena). The wood narrows. Trunks taller. The canopy parts overhead in a single long vertical slit, and a **moonlight-streak path** pours down the center of the floor in pale silver, running unbroken from the round's start to the boss-arena glade entrance — the round's signature beat. At the far end of the path, the wood **wakes**.

**Terrain rhythm:**

```
columns 0–4    : flat (spawn-after-mile_15)
columns 4–8    : gentle uphill (slope_up_22)
columns 8–12   : flat (the moonlit path visible underfoot, silver on dark earth)
columns 12–16  : flat (continued; gnarled trunks lean in from both sides)
columns 16–20  : gentle uphill (slope_up_22)
columns 20–24  : flat (the boss-arena glade's anteroom — the canopy thins overhead)
columns 24–32  : flat → BOSS ARENA ENTRY at col 32
```

**Mile-marker placement:** `mile_16` at col 3 (this is the **last** mile-marker before the boss; if Reed dies inside the boss arena, respawn returns him to `mile_16` and he re-walks the short anteroom — see §8 + `phase3-boss-cast.md` §13).

**Enemy spawn table:**

| Type             | Count | Approx column(s) | Direction | Notes                                                  |
|------------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder (dark-wood) | 2 | 10, 22 | left | Two on the anteroom. The last two enemies in Area 1 outside the boss. |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small` (root-knot) | 1 | 16 | Centered between the two Mossplodders. |
| Moonlight-streak decoration | 1 | 8-24 (long unbroken slit) | The full-length silver path down the floor — visual climax of the moonlight-streak motif. The path *points* the player at the boss-arena glade; following the silver is following the way in. |

**Boss arena entry placement:** col 32 — Reed walks past col 32 and the **boss arena trigger** fires (see §8). This is **not** a mile-marker and **not** a stage-transition tile; it is a one-way camera-lock event. There is no fade-to-black or stage-name overlay; the arena is contiguous with the anteroom (camera scrolls until the boss is on-screen, then locks).

**Threat curve / intent:** the ritual approach. Two Mossplodders are spaced so the player kills them at a relaxed cadence — the round should feel like the final reading of the wood before the canopy closes behind them.

### 7.5 Stage 4 threat curve summary

| Round | Length | Mossplodder | Hummerwing | Rocks | Hazards | Slopes (steep / total) | Notes |
|-------|-------:|------------:|-----------:|------:|--------:|-----------------------:|-------|
| 4-1   |  ~48c  |          2  |         0  |    1  |       0 |              0 / 2     | Calm entry. |
| 4-2   |  ~48c  |          3  |         0  |    2  |       0 (moonlight-streak decoration only) | 0 / 4 | Calm middle. |
| 4-3   |  ~48c  |          5  |         0  |    2  |       0 | 1 / 4 | Density beat. |
| 4-4   |  **~32c**  |       2  |         0  |    1  |       0 | 0 / 2 | Moonlit path + boss-arena entry. |

---

## 8. Boss arena beat (end of Stage 4 — Round 4-4)

The boss arena's full spec is in `phase3-boss-cast.md`. This section covers only the **stage-level** transition: how Round 4-4 hands off to the boss fight.

**Camera lock.** When Reed's x-position passes column 32 of Round 4-4 (`bossArenaTriggerCol`), the camera **stops scrolling** at the position that places the arena's left edge at the viewport's left. The arena is the next 12 tiles to the right (cols 32-43 of Round 4-4 layout, or equivalently, "the boss arena" as a self-contained 12×11 tile rectangle — a small **dark-forest glade clearing** — see boss brief §8). Reed continues to have control; the camera does not move until the boss is defeated.

**Boss spawn.** The Bracken Warden is pre-placed at the far end of the glade (col ≈ 41-42 of the round, near the glade's far edge at col 43). When the camera lock fires, the Warden plays its **wake** animation (`idle → windup` transition; see boss brief §3) and becomes active. Reed enters the glade from the moonlit path (col 32) facing right; the Warden faces left across the clearing.

**No fade.** Unlike the stage-transition ritual (§3), there is no fade-to-black before the boss fight. The wood is the wood; the boss is in it. Reed walks into the glade, the canopy closes behind him (camera lock = the way back vanishing).

**Death inside the arena.** If Reed dies inside the boss arena (boss contact, boss attack), the normal v0.50.2 dying + respawn flow runs:
- `state.beginDying(player)` → 45-frame dying timer
- `state.loseLife()` → lives -- → respawn at `mile_16` (Round 4-4 col 3)
- Camera unlock (because Reed is no longer at the trigger col)
- Boss resets: the Warden returns to `idle` at its spawn position, full HP, all timers cleared (it goes back to sleep)
- Reed walks the anteroom again; boss arena re-enters when he passes col 32 again

If Reed runs out of lives, the standard GAME OVER → Continue path applies; Continue rebuilds the full Area from Stage 1 spawn (per §2 — full area reset). The boss does **not** preserve damage taken across a Continue.

**Boss death.** On the Bracken Warden's death (boss brief §4.3), camera lock holds for the boss's death animation (~60 frames). After the death anim resolves and a ~60-frame celebratory pause:

1. Fade-to-black ~60 frames.
2. **Area 1 Cleared overlay** holds ~5 seconds or until any input:
   ```
   Area 1 — The Mossline Path
   Cleared.

   The threshold opens. Reed walks on.

   Area 2 ahead in v0.85.
   ```
   (Bilingual parallel: see KO file. The "v0.85" line is release-honest copy — flag in §12 if release-master prefers softer wording. The KO file uses the localized stage-name pattern; bracket the boss name in the EN block.)
3. Terminal beat — title screen, or hold the overlay indefinitely (dev-lead's call; consistent with the v0.50 cairn ritual).

**Lives on Area completion.** Lives carry only **into** the Area Cleared overlay. There is no Area 2 in v0.75, so lives are not carried forward; the next run starts via title-screen / refresh with fresh lives (3). Release-master may want to record run-best (lives remaining) for future leaderboards — out of scope for v0.75, flag in §12.

---

## 9. Encounter pacing across Area 1 (Stages 1-4 in one table)

Difficulty curve in one table — for cross-reference between this brief and `phase2-areas.md` §8:

| Stage    | Rounds | Total cols | Mossplodder | Hummerwing | Rocks | Hazards (fire / tidal / vein) | Slopes (steep) | Boss |
|----------|-------:|-----------:|------------:|-----------:|------:|------------------------------:|---------------:|------|
| Stage 1 (Mossline — forest) | 4 | ~224 | 11 | 5 | 7 | 5 fire | 4 | — |
| Stage 2 (Sumphollow — shore) | 4 | ~192 | 11 | 6 | 7 | 6 tidal-edge | 3 | — |
| Stage 3 (Brinklane — cave) | 4 | ~192 | 11 | 5 | 7 | 11 cave-gap-pools + 4 amber-vein | 3 | — |
| Stage 4 (Old Threshold — dark forest) | 4 | ~152 | **12** | **0** | **6** | **0** | 1 | Bracken Warden |
| **Area 1 total** | **16** | **~760** | **45** | **16** | **27** | **5 fire + 6 tidal + 11 cave-pools + 4 vein** | **11** | **1 boss** |

**Curve intent:**
- Stages 1-3 hold roughly equal enemy density (~16 enemies / 192-224 cols) and rotating hazard themes (fire / tidal-edge / cave-gap-pools + amber-vein).
- Stage 4 *drops* Hummerwings (the canopy crowds them out) and *drops* hazard tiles (the dark forest has no fire/tidal/cave-pool analog) and *adds* the boss. Density of Mossplodders alone is slightly up — the wood is more populated by the slow-and-rolling enemy archetype.
- The boss fight is the synthesis exam Stages 1-3 have been preparing the player for.

**A note on length.** Total Area 1 = ~760 tile-columns ≈ 47.5 viewports. At Reed's walking speed (~3.5 px/frame ≈ 0.073 tiles/frame ≈ 4.4 tiles/sec walking, faster sprinting), a clean run is roughly 3 minutes per stage = ~12 minutes Area total, plus the boss fight. Death + checkpoint adds time. Roughly aligned with classic action-platformer pacing; release-master may scale lives count if playtest reveals the run-length is brittle on a fresh player.

---

## 10. New trigger entity — the stage-transition tile

The four-stage Area structure needs an entity that **chains stages within an Area** in a way the boundary cairn (which announces area-clear) doesn't.

**Visual intent:** the post is a **carved wooden archway** spanning roughly 1.5 tiles wide and 1 tile tall, with two upright posts and a horizontal crossbeam. Reads as "doorway you walk through," not "marker you pass." A second symbolic post on the right side reads "the next room is past me." Color: `wet-bark-brown` posts, `dawn-amber` crossbeam (visually distinct from the mile-marker's plank-and-numeral motif and the boundary cairn's stone-stack). On Reed's approach the archway plays a brief **glow-warm** pulse, the same `clear` animation slot as the cairn but with archway art.

**Behavior:** identical to v0.50 boundary cairn except it fires the stage-transition ritual (§3) instead of the Stage-Cleared ritual. Single-use per stage; resets if Reed dies before the trigger and respawns at the latest mile-marker.

**Quantity:** **three** stage-transition tiles total in Area 1 (end of Stage 1, end of Stage 2, end of Stage 3). The end of Stage 4 has the **boss arena entry** (§8), not a transition tile.

**Implementation as ECS entity** (per design-lead's call) — same `trigger` component as the v0.50 cairn. Add a new `trigger.kind = 'stage-transition'` value. Properties:

```
trigger: { kind: 'stage-transition', nextStage: 2 | 3 | 4, consumed: false }
```

The `nextStage` field tells StageManager which stage to load.

**Animation cue list:**

| State    | Frames | What changes |
|----------|-------:|--------------|
| `idle`   |      2 | gentle 2-frame breeze: crossbeam tilts ±1 px. Slow (~2 fps).  |
| `clear`  |      4 | (1) standard, (2) crossbeam glow-warm, (3) full-glow, (4) settled. On contact, before fade. |

---

## 11. New cast / variant / decoration roster (additive — no new archetypes)

Per project constraints, **no new enemy archetypes** are introduced in v0.75. Mossplodder and Hummerwing remain the only enemy classes, with **per-stage visual reskins**. Hazards and decorations are stage-specific.

### 11.1 Mossplodder visual variants (silhouette + palette reskins; behavior identical)

Three variants share the v0.50 Mossplodder FSM, hitbox, tunables, and animation cue counts. They differ only in **shell color, silhouette stamp, and one decorative detail**:

| Variant            | Stage  | Silhouette change                                  | Color-mood keywords                                  |
|--------------------|--------|----------------------------------------------------|------------------------------------------------------|
| Mossplodder (default) | Stage 1 | Per v0.50 spec — `phase2-cast-revision.md` §3.   | `shell-loam · moss-green · wet-bark-brown · cuff-cream` (unchanged) |
| Mossplodder (shore-shell) | Stage 2 | Same silhouette as default; the shell reads slightly **paler and salt-bleached** — the moss patches replaced by a pale, almost-driftwood overlay where the sun has worked the shell. | `shell-loam · driftwood-bleach (overlay) · sea-foam-cool (highlight) · velvet-shadow` |
| Mossplodder (cave-shell) | Stage 3 | Slightly larger shell silhouette (1.1× scale OK if Design wants; otherwise hold scale and reskin only). Moss strands on the shell are pale and slightly luminous (cave-moss bioluminescence read). | `cave-moss-blue-green · shell-loam-pale · amber-vein-tint (highlight) · velvet-shadow` |
| Mossplodder (dark-wood) | Stage 4 | Same silhouette as default; the shell carries a faint silver-moonlight ridge where the canopy slits catch the moss-top (the moonlight knows the Mossplodder is here). | `shell-loam · canopy-shadow-bluegreen (overlay) · moonlight-silver (top-ridge) · understory-violet` |

Design owns the per-variant sprite module (or per-variant `palette` slot in the existing `enemy-mossplodder.js`; design-lead's choice on whether one module with multiple palettes or separate modules — Phase 3 brief expresses intent, not implementation).

### 11.2 Hummerwing visual variants

Two variants. Stage 4 has none. Stages 2 and 3 each have a stage-specific variant.

| Variant            | Stages | Silhouette change                                                                                | Color-mood keywords                                  |
|--------------------|--------|--------------------------------------------------------------------------------------------------|------------------------------------------------------|
| Hummerwing (default) | Stage 1 | Per v0.50 spec.                                                                                  | `sunwarm-amber · wing-haze · velvet-shadow · dust-pink` (unchanged) |
| Hummerwing (shore variant) | Stage 2 | Same silhouette. Body amber reads slightly cooler against the sun-warmed sand; wing-haze takes on a faint sea-foam tinge. | `sunwarm-amber-cool · wing-haze-foam · velvet-shadow · dust-pink-pale` |
| Hummerwing (cave variant) | Stage 3 | Same silhouette. Body amber reads slightly cooler (toward `amber-vein-tint`); wing-haze deepens slightly toward `cave-moss-blue-green`. | `amber-vein-tint · wing-haze-cool · velvet-shadow · pale-cave-pink` |

Design choice: same module / palette swap, per §11.1.

### 11.3 New stage-specific hazards (tile-level — extends v0.50 contract)

Each new hazard is structurally a `fire_low`-equivalent: **1-hit-kill on Reed contact**, Mossplodder dies when walking into it, Hummerwing untouched. Implementation: same `{frames, fps}` animated-tile shape as `fire_low` (`docs/design/contracts.md` §"Animated tiles (v0.50+)"). All-stage hazard contract:

| Hazard          | Stage   | Visual intent                                                                                                | Tile name suggestion |
|-----------------|---------|--------------------------------------------------------------------------------------------------------------|----------------------|
| `tidal_edge`    | Stage 2 | Sea-foam wave-wash along the seaward floor. 4-frame slow pulse (~3 fps) on a wave-rhythm: wet (lethal) → drying (still lethal) → dry (safe) → rising (safe early, lethal late). All `tidal_edge` instances on screen share the same global wave timer so the player learns *one* rhythm. See §5.5 for the full beat. | `tidal_edge` (or design-lead's preferred key) |
| `amber_vein`    | Stage 3 | Hairline glowing crack in the cave floor. 4-frame slow flicker (~4 fps — slower than fire's 6 fps). No flame tongues; just a steady amber glow that pulses subtly. | `amber_vein` (or design-lead's preferred key) |
| `cave_gap_pool` | Stage 3 | Dark still water visible where the cave-shelf breaks. **Not technically a foreground hazard tile** — `cave_gap_pool` is a normal gap (no floor tile) with **dark cave-pool water** drawn underneath as a slow-scroll bottom layer. Functionally identical to v0.50 gap-fall = 1-hit-kill, but with a visible still-water surface 2-3 tiles below the cave-shelf top. 4-frame slow ripple animation on the pool surface (~2 fps — barely moving). | `cave_pool_surface_anim` (background-layer animated, not a foreground hazard tile) |
| (no hazard)     | Stage 4 | The Old Threshold has none. |  |

**Design note on `cave_gap_pool` implementation.** A cave-gap-pool is not a hazard tile because Reed doesn't *touch* the water surface under normal conditions — he's either on a shelf or falling. The death trigger is the same as a normal gap (falling below the level's lowest playable row). The pool surface beneath is a **decorative parallax element**, animated, drawn at a slow scroll factor so it reads as deep and still. Implementing it this way reuses the v0.50 gap mechanic verbatim; visual texture is the only new asset.

### 11.4 New stage-specific decorations (visual only; no gameplay)

These are tile decorations — purely cosmetic, no collision, no hazard:

| Decoration         | Stage  | Visual intent                                                                                            |
|--------------------|--------|----------------------------------------------------------------------------------------------------------|
| `moonlight_streak` | Stage 4 | Silver vertical light-shaft from canopy to floor in narrow slits. 2-frame slow pulse (~2 fps) as a leaf sways overhead. Decoration only — Reed walks through it without consequence. Carries the "the Old Threshold parts its canopy for a moment" world fiction. |
| `drift_spray`      | Stage 2 (decorative, optional) | Single-tile foreground tile of sea-foam flick particles near the tidal-edge zones. Static or 2-frame ripple. No collision; aesthetic only. Design's call on whether to ship in v0.75 or defer. |
| `cave_drip`        | Stage 3 (decorative, optional) | Single-tile ceiling tile with a slow water drip animation. ~2 fps. No collision; aesthetic only. Design's call on whether to ship in v0.75 or defer. |

### 11.5 New tile-set roster

Beyond v0.50's `assets/tiles/area1.js`, Stages 2-4 each need a tileset:

| Tileset path                | Stage | Tiles needed (sketch — design-lead final call)                                                  |
|-----------------------------|-------|--------------------------------------------------------------------------------------------------|
| `assets/tiles/area1-stage2.js` | 2 | `flat_sand`, `slope_up_22`, `slope_up_45`, `slope_dn_22`, `slope_dn_45`, `rock_small_drift` (driftwood-bleach reskin), `tidal_edge` (animated, wave-rhythm), `drift_spray` (optional, animated) |
| `assets/tiles/area1-stage3.js` | 3 | `flat_cave`, `slope_up_22`, `slope_up_45`, `slope_dn_22`, `slope_dn_45`, `rock_small_cave`, `amber_vein` (animated), `low_ceiling`, `cave_pool_surface_anim` (animated background), `cave_drip` (optional, animated) |
| `assets/tiles/area1-stage4.js` | 4 | `flat_wood`, `slope_up_22`, `slope_up_45`, `slope_dn_22`, `slope_dn_45`, `root_knot` (replaces rock_small), `moonlight_streak` (animated decoration), boss-arena-glade-floor variant |

Reuse across stages: `slope_up_22 / _45 / slope_dn_22 / _45` shapes can share underlying matrix and reskin via tileset palette — design-lead's call. The `flat_*` tiles and `rock_*`-equivalents are visually distinct per stage.

### 11.6 New backgrounds (parallax)

Three new SVG sets, parallel to v0.50's `area1-sky / -mountains / -trees / -fore`:

| Stage | Files (sketch) | Mood |
|-------|----------------|------|
| Stage 2 | `area1-stage2-sea-far.svg`, `area1-stage2-lighthouse-mid.svg`, `area1-stage2-dune-near.svg` | Top: flat sea horizon with low warm sky. Mid: distant `lighthouse-silhouette` standing on a far point of land (slim shape in `velvet-shadow`). Foreground: low dunes + driftwood-bleach pilings. |
| Stage 3 | `area1-stage3-cave-deep.svg`, `area1-stage3-cave-mid.svg`, `area1-stage3-cave-fore.svg` | Three layers of cave-stone — distant veins / middle stone / near outcrops. No sky. |
| Stage 4 | `area1-stage4-canopy-deep.svg`, `area1-stage4-canopy-mid.svg`, `area1-stage4-trunks-near.svg` | Three layers of dark-forest silhouettes — deep canopy / mid-canopy with occasional `moonlight-silver` slits / near gnarled trunks. No sky; the canopy is a closed ceiling of leaves. |

---

## 12. For Design

Concrete asset list for v0.75 Area 1 expansion. Sizes/anchors follow `docs/design/contracts.md` and the precedents in v0.50 (see `phase2-cast-revision.md` §11).

### 12.1 Sprite modules (new + extended)

| Asset                          | Path                                          | Frame size (w × h)   | Anchor (px, top-left) | Animations                                                                          |
|--------------------------------|-----------------------------------------------|----------------------|-----------------------|-------------------------------------------------------------------------------------|
| Mossplodder (shore-shell variant) | `assets/sprites/enemy-mossplodder.js` (extend palette) or `enemy-mossplodder-shore.js` (new module) | 48 × 36 | (24, 35) — feet center | Same as v0.50 (`walk:4, dead:3`); palette reskin |
| Mossplodder (cave-shell variant) | `assets/sprites/enemy-mossplodder.js` (extend palette) or `enemy-mossplodder-cave.js` (new module) | 48 × 36 | (24, 35) — feet center | Same as v0.50 (`walk:4, dead:3`); palette reskin |
| Mossplodder (dark-wood variant) | `assets/sprites/enemy-mossplodder.js` (extend) or `enemy-mossplodder-darkwood.js` (new) | 48 × 36 | (24, 35) | Same as v0.50; palette reskin + moonlight-silver top-ridge overlay |
| Hummerwing (shore variant)      | `assets/sprites/enemy-hummerwing.js` (extend) or `enemy-hummerwing-shore.js` (new) | 36 × 24 | (18, 12) — body center | Same as v0.50 (`drift:2, dead:3`); palette reskin |
| Hummerwing (cave variant)      | `assets/sprites/enemy-hummerwing.js` (extend) or `enemy-hummerwing-cave.js` (new) | 36 × 24 | (18, 12) — body center | Same as v0.50 (`drift:2, dead:3`); palette reskin |
| Stage-transition tile (trigger entity) | `assets/sprites/marker-archway.js` | 72 × 48 (1.5 tiles wide × 1 tile tall) | (36, 47) — base center | `idle:2, clear:4` |
| Boss — Bracken Warden          | `assets/sprites/boss-bracken-warden.js`       | see `phase3-boss-cast.md` §10 | see boss brief | see boss brief (multi-state) |

**Palette anchors for new modules** (Design picks hex per `docs/design/palette-phase2.md` conventions):

- **Mossplodder (shore-shell):** `shell-loam` (base), `driftwood-bleach` (overlay), `sea-foam-cool` (highlight under shell), `velvet-shadow` (ink — `#3a2e4a` re-used).
- **Mossplodder (cave-shell):** `cave-moss-blue-green` (moss top), `shell-loam-pale` (shell base), `amber-vein-tint` (highlight under shell), `velvet-shadow` (ink — `#3a2e4a` re-used).
- **Mossplodder (dark-wood):** `shell-loam` (base — same as default), `canopy-shadow-bluegreen` (moss overlay), `moonlight-silver` (top-ridge ribbon along shell), `understory-violet` (ink).
- **Hummerwing (shore variant):** `sunwarm-amber-cool` (body — slightly cooler amber), `wing-haze-foam` (translucent — possibly extends Glassmoth-policy 8-digit alpha), `velvet-shadow` (1 px outline), `dust-pink-pale` (highlight).
- **Hummerwing (cave variant):** `amber-vein-tint` (body — cooler amber), `wing-haze-cool` (translucent — possibly extends Glassmoth-policy 8-digit alpha), `velvet-shadow` (1 px outline), `pale-cave-pink` (highlight).
- **Stage-transition tile:** `wet-bark-brown` (posts), `dawn-amber` (crossbeam), `velvet-shadow` (line). Visually distinct from mile-marker (plank + numeral) and cairn (stone stack).

### 12.2 Tile modules (new)

| Tileset path                | Stage  | Notes                                                                                              |
|-----------------------------|--------|----------------------------------------------------------------------------------------------------|
| `assets/tiles/area1-stage2.js` | 2  | Shore tileset per §11.5. `tidal_edge` is an animated tile on a wave-rhythm (matches `fire_low` shape, slower fps; all instances share a global wave timer). |
| `assets/tiles/area1-stage3.js` | 3  | Cave tileset per §11.5. `amber_vein` is an animated tile (matches `fire_low` shape). Includes `cave_pool_surface_anim` (background-layer animated). |
| `assets/tiles/area1-stage4.js` | 4  | Dark-forest tileset per §11.5. Includes `moonlight_streak` (animated decoration). Includes boss-arena-glade-floor variant for the 12-tile-wide glade clearing. |

**Palette guidance (Stages 2-4):** keep `velvet-shadow` (`#3a2e4a`) as the universal ink (per `palette-phase2.md` consistency rule). Each stage may introduce 4-6 new hex values per the v0.50 budget pattern; rough estimate is ~15-20 new hexes total across Stages 2-4 + the boss, well within the 56-color headroom (`palette-phase2.md` §"Budget").

### 12.3 Backgrounds (parallax SVG)

Per §11.6. Three layers per stage, matching v0.50's pattern. Slow / mid / fast scroll factors recommended at `0.0 / 0.3 / 0.7` (same as v0.50; dev-lead may tune).

### 12.4 Boss assets

See `phase3-boss-cast.md` §10 for the full boss asset spec — frame sizes, anchor, animation set, palette anchors.

### 12.5 Stage-name overlay typography

The stage-name overlays ("Stage 2 — Sumphollow" / "스테이지 2 — Sumphollow", etc.) should reuse the v0.50 mile-marker overlay typeface (per `phase2-areas.md` Open Question 4, decided in v0.50.1's bilingual overlay). No new typeface needed. The overlay needs **three new strings per stage** in the bilingual pair (EN heading, KO heading, stage name). The stage name itself ("Sumphollow", "Brinklane", "The Old Threshold") stays verbatim in both halves per `CLAUDE.md` bilingual policy.

---

## 13. For Dev

### 13.1 ECS / engine additions

- **`trigger.kind = 'stage-transition'`** (new value on existing `trigger` component, per §10). Carries `nextStage` field.
- **`pl.armed`** carry-across-stages: the existing `pl.armed` flag (introduced in `phase2-cast-revision.md` §2.1, persisted across mid-stage respawn in v0.50.1) is now also persisted across the stage-transition ritual. **Implementation:** when StageManager loads a new stage, read `pl.armed` from the outgoing stage's player entity and apply to the incoming stage's spawn-player entity. Same goes for `state.lives` (which is on `state`, not `pl`; less work).
- **`state.vitality`** refill on stage entry: StageManager calls `state.refillVitality()` after loading stage N (N ≥ 2).
- **`stageManager.currentStage`** advances from 1 to 4. The overlay text picker reads this to render the right stage name + the right `Round N` overlay number (continuing the mile-marker chain).
- **Boss entity** (`boss` component already in the ECS contract per `CLAUDE.md`): see boss brief §13 for the field layout the Bracken Warden uses.
- **Camera lock** at boss arena: new flag in CameraSystem or a per-level `cameraLockCol` field. When set, camera stops scrolling regardless of player x. Released on boss death.
- **`level.bossArenaTriggerCol`** new round-data field on Round 4-4 (= col 32 per §7.4). Crossing it fires the camera-lock + boss-spawn event.

### 13.2 New systems suggested

- **`StageTransitionSystem`** (or extend `TriggerSystem`): detects the new `trigger.kind = 'stage-transition'` and fires the §3 ritual (fade + overlay + load next stage + carry state).
- **`BossArenaSystem`** (or extend `StageManager`): detects Reed crossing `bossArenaTriggerCol`; locks camera; spawns/wakes boss entity; manages boss-death sequence and Area Cleared overlay (§8). Releases on boss death.
- **`BossAI`** (new): see boss brief §13 for the FSM. Owned by Dev; story-lead defines the FSM shape and timer ranges.

### 13.3 Tunable parameter blocks (suggested additions to `PhaseTwoTunables.js` or new `PhaseThreeTunables.js`)

```
STAGE_TRANSITION = { fadeOutFrames: 45, overlayFrames: 75, fadeInFrames: 45 }
                                                                      # total ~210 frames
BOSS_ARENA       = { arenaWidthTiles: 12, arenaHeightTiles: 11,
                     cameraLockCol: 32, bossSpawnCol: 41 }
                                                                      # Round 4-4 columns
BRACKEN_WARDEN   = { ... }                                            # see boss brief §11
```

### 13.4 Level data files

New round-data files following the v0.50.1 pattern (`src/levels/area1/round-1-{1..4}.js`). Each stage exports its own concatenated stage builder; the area builder concatenates all four:

```
src/levels/area1/round-2-{1..4}.js      # Stage 2 (Sumphollow) rounds
src/levels/area1/round-3-{1..4}.js      # Stage 3 (Brinklane) rounds
src/levels/area1/round-4-{1..4}.js      # Stage 4 (Old Threshold) rounds
src/levels/area1/stage2.js              # buildStage2() — concat 2-1 .. 2-4 + stage-transition tile
src/levels/area1/stage3.js              # buildStage3() — concat 3-1 .. 3-4 + stage-transition tile
src/levels/area1/stage4.js              # buildStage4() — concat 4-1 .. 4-4 + boss-arena-trigger-col
src/levels/area1/index.js               # buildArea1() — top-level Area builder; selects current stage
```

Story-lead does not author the actual data files; the placement tables in §5-§7 are source-of-truth for whoever does. Same convention as `phase2-areas.md` §9.3.

### 13.5 Edge cases

- **Hatchet vs. cave low-ceiling.** Reed's hatchet arc peaks ~3 tiles above launch (per v0.50 `HATCHET.vy0 = -3.5`, gravity `0.55`); inside the 6-tile-tall low-ceiling section in Stage 3 Round 3-1, a hatchet thrown from the floor will land short. **This is a feature** — the low ceiling restricts both Reed's jump arc and his throw arc. Don't auto-clip the arc to the ceiling; let it pass through (hatchet ignores ceilings, just as it ignores Hummerwing tiles).
- **Mossplodder vs. cave-gap-pool.** Mossplodder walks off cave-shelf into the still water → dies. Reuse `dead` FSM with a 0-frame splash variant if Design supplies one; otherwise fall back to standard `dead` animation (the Mossplodder dies a frame early because vertically it never reaches the pool surface — Design's call on whether to add a splash overlay).
- **Tidal_edge wave-rhythm timer.** All on-screen `tidal_edge` tiles share one global wave-rhythm clock so the player learns *one* rhythm — Dev should drive the tile's current frame from a global beat counter, not from a per-instance timer. Same applies on respawn: the clock keeps ticking, so a Reed who respawns mid-wave reads the rhythm in progress rather than getting a free reset window.
- **Boss arena death + camera unlock.** When Reed dies inside the arena, camera unlocks immediately on the dying-frames start (not on respawn). The death animation should not be camera-locked. After respawn at `mile_16`, camera follows Reed normally back through the anteroom; on re-crossing col 32, camera re-locks.
- **Reed off the bottom in Stage 3.** Standard gap-fall handling — falling below the level's lowest playable row triggers `state.killHero()`. No special "drowning" overlay in v0.75; the death is the same dying FSM, just with a cave-gap-pool surface underneath visually (per v0.50.2 dying FSM).
- **Boss carries to subsequent runs?** No. Each Continue rebuilds the full Area from Stage 1; the boss reappears at full HP. (Per §2 + §8.)

### 13.6 Smoke checks (v0.75 quartile gate, full Area 1)

Per `CLAUDE.md` v0.75 row: "Multi-area + hunger/weapon mechanics + parallax + audio integration." This brief covers the **multi-stage Area 1** portion; design-lead and dev-lead may also need separate briefs for hunger and audio (out of scope here).

1. **Stage 1 (full):** clear all four rounds + walk into the new stage-transition tile at col 223. Verify fade + "Stage 2 — Sumphollow" overlay + Stage 2 spawn. `pl.armed` preserved; vitality refilled.
2. **Stage 2 (Sumphollow, shore):** verify `tidal_edge` wave-rhythm in 2-1 (lethal during wet/drying frames, safe during dry/rising-early; all instances share one global wave timer). Mossplodder walks into tidal_edge and dies. Shore-shell Mossplodder + shore Hummerwing render with the new palettes. Distant `lighthouse-silhouette` renders on the parallax horizon. Stage-transition at col 191 → Stage 3.
3. **Stage 3 (Brinklane, cave):** verify low-ceiling section in 3-1 (Reed walks under without head-bumping; cannot jump above ceiling). Verify `amber_vein` hazard kills Reed; Mossplodder walks into vein and dies. Verify `cave_gap_pool` kill (Reed falls in and dies via standard dying FSM). Mossplodder drowns into the pool (col-22 of 3-1 walks into the cave-gap-pool). `cave_pool_surface_anim` renders behind the shelf. Cave-shell Mossplodder + cave Hummerwing render with the new palettes. Stage-transition at col 191 → Stage 4.
4. **Stage 4 (Old Threshold, dark forest):** no Hummerwings spawn; no hazards spawn. `moonlight_streak` decoration renders (animated, no collision). Walk through to Round 4-4 col 32 → camera locks; Bracken Warden wakes in the glade clearing. Boss fight per `phase3-boss-cast.md` §14 smoke checks.
5. **Boss death:** camera unlock, Area Cleared overlay holds; pressing any input either returns to title or holds the overlay.
6. **Death + Continue full reset:** lose all three lives inside Stage 3 / 4 → GAME OVER → Continue → respawn at Stage 1 col 0 unarmed with 3 lives, vitality full. Boss HP reset (verified on Stage 4 re-run).
7. **Total run:** all four stages back-to-back, no console errors. Clean-run target: ~12 minutes for an experienced playtester (stages) + ~30-60 sec boss = ~13-14 min.

---

## 14. Open questions for release-master

1. **Stage-transition tile name.** I'm calling it the **stage-transition tile** (informal/working name; "archway" as visual shorthand). Final entity / tile key for dev-lead's data — `archway`, `gate`, `stage-marker`, `threshold`, something else? Pick before Design renders the asset.

2. **Boss brief is published separately.** See `phase3-boss-cast.md`. That brief carries its own Open Questions list — release-master should review both briefs together as one PR family.

(Single open question intended in §14 above; further calibration questions live in the boss brief.)

---

## Changelog

**v0.75 — theme remap** (post-PR-#26, this PR). Per user direction after the initial publication, the Stage 2-4 theme sequence was corrected. Stage 1 (forest) is unchanged. Stages 2-4 shift one biome along: Stage 2 becomes the **shore**, Stage 3 the **cave**, Stage 4 the **dark forest**. The per-round terrain rhythms, enemy spawn columns, mile-marker positions, and threat-curve totals are preserved; only the mood overlay (palette keywords, signature beats, hazard skin, decoration motif, tile-set / sprite-variant naming) changes. The boss arena's spatial spec, FSM, and attack pattern (`phase3-boss-cast.md`) are unchanged; only its visual setting moves from a ruin chamber to a dark-forest glade clearing — the moss-and-stone Bracken Warden reads at least as naturally against a moonlit canopy as it did against carved stone, see `phase3-boss-cast.md` Changelog for the boss-side rationale.

Before / after (theme + signature beat + new hazard / decoration):

| Stage | Before (PR #26) | After (this PR) |
|-------|------------------|------------------|
| 2     | cave (Sumphollow) — low-ceiling crawl + `amber_vein` hazard | shore (Sumphollow) — tidal-edge wave-rhythm + `tidal_edge` hazard + distant lighthouse-silhouette landmark |
| 3     | waterside (Brinklane) — water-gap rhythm + sky-strip + `water_surface_anim` | cave (Brinklane) — low-ceiling crawl (carried from prev. Stage 2) + `amber_vein` (carried) + `cave_gap_pool` + warm-pocket plateau |
| 4     | ancient ruins (Old Threshold) — carved-channel convergence in Round 4-4 + ruin chamber arena | dark forest (Old Threshold) — moonlit-path streak in Round 4-4 + glade-clearing arena under canopy |

Stage 1 (forest, Mossline Path) is held verbatim from Phase 2 in both versions of this brief.

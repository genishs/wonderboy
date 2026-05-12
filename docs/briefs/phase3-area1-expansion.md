# Phase 3 — Area 1 expansion brief (v0.75)

> **Authoring agent:** story-lead
> **Consumers:** design-lead, dev-lead
> **Reviewer:** release-master
> **Companion docs:** `docs/briefs/phase3-boss-cast.md`, `docs/briefs/phase2-areas.md`, `docs/briefs/phase2-cast-revision.md`, `docs/story/world.md`
> **한국어 버전:** [phase3-area1-expansion.ko.md](./phase3-area1-expansion.ko.md)

This brief expands Area 1 from a single multi-screen stage (the Mossline Path forest) into a **four-stage Area**: forest → cave → waterside → ancient ruins. Stage 1 is held verbatim from Phase 2. Stages 2-4 are authored fresh here. The final round of Stage 4 hands the player off to the boss arena spec'd in the companion brief `phase3-boss-cast.md`. Numeric quantities are *suggestions* for dev-lead to tune in code; spatial intent and pacing are load-bearing.

> **Tribute, not a port.** The 4-stages-per-area shape and "boss at the end of the final stage" beat are universal action-platformer conventions and are used here as such. Every biome theme execution (cave / waterside / ruin) is invented for this project; specific stage layouts from the inspirational original series are not consulted or referenced. Where prior briefs coined original vocabulary (Mossplodder, Hummerwing, dawn-husk, stone hatchet, mile-marker, boundary cairn, the Mossline Path), this brief continues that vocabulary and adds Stage 2-4 keywords to the same family.

---

## 1. Area 1 expansion overview

Area 1 stops being a single morning walk. It becomes a **half-day journey east through the Verdant Ruin's outer layer** — four stages strung along a single line of travel, each opening one room deeper into the ruin the player has only seen the edge of.

**Stage 1 — The Mossline Path** (held verbatim from Phase 2). The forest seam at the foot of the Verdant Ruin: warm loam, cool canopy, Mossplodders rolling across the path, Hummerwings drifting at chest height, a few cracked patches of old fire surfacing through the soil. This is the teaching ground — see `phase2-areas.md` for the full spec, and `phase2-cast-revision.md` §10 Changelog for v0.50.1's "one continuous 224-column stage" + v0.50.2's mile-marker-at-round-start positions. **Nothing in Stage 1 changes for v0.75.** Reed simply now passes through the end-of-stage transition (rather than the v0.50 terminal `Stage Cleared`) and the next stage loads.

**Stage 2 — Sumphollow** (new). Past the Mossline's last cairn, the ground opens into a cave-mouth and Reed climbs down. The Sumphollow is the Verdant Ruin's first underground room: a long horizontal cave with a low stone ceiling, drip-fed pools at the floor, and cracks in the rock that still glow faintly amber from whatever the ruins used to keep there. The cave does not feel hostile — it feels *quiet*, like a cellar someone left the door open on. Mossplodders down here are slightly larger and shell-paler (cave-moss); Hummerwings drift in the warmer pockets near the ceiling-cracks. The fauna read as cousins of Stage 1's, not new species. **Reed is learning that the Verdant Ruin has interiors.**

**Stage 3 — Brinklane** (new). Sumphollow's far end opens onto a strip of river-edge: a band of damp stone shelf running alongside a slow underground river. Reed walks the bank; the river is to his right (visible but never entered). The Brinklane brings back open sky overhead through a long crack in the cave-roof — a strip of dawn-amber that follows the player from above. Stage 3's signature beat is the **water-stepping rhythm**: short stone-shelf platforms separated by river-water gaps the player must clear (water = 1-hit-kill, same death rule as fire). Mossplodders along the bank tend to walk *into* the water and drown (feature, classroom example); a few Hummerwings drift over the surface and reflect on it. **Reed is learning that the ruin sits on water it remembers.**

**Stage 4 — The Old Threshold** (new). Brinklane's last shelf climbs back up a flight of root-broken steps into a domed inner chamber — the ancient ruin proper, the room the Verdant Ruin was named for. Half the floor is mosaic tile under moss, half is open ruin-floor with carved channels Reed can read but not understand. There are no Hummerwings here; the ceiling is too high. There are no fires, because the ruin still keeps its heat down at the heart of the chamber. The room **wakes up** as Reed approaches the back wall — and what wakes is the **Bracken Warden** (see `phase3-boss-cast.md`). Stage 4 is short, ritual, and ends at the boss arena beat.

The four stages together form one day's walk: morning forest, mid-morning underground, late-morning waterline, noon at the threshold of something older than the path. The "boundary cairn" of Phase 2 turns out, in retrospect, to have been a roadside marker — not a boundary — and the real boundary is the Old Threshold.

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

**Why `pl.armed` carries but vitality doesn't:** the hatchet is the player's equipment (earning it is the Stage 1 ritual); vitality is their fatigue. Climbing from Mossline into Sumphollow refreshes the body but the tool stays in the hand.

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

## 5. Stage 2 — **Sumphollow** (cave)

**Theme intent:** First underground room. Teach **read a low ceiling, fight in tighter vertical space, recognize variant skins of the same enemies**. Slightly tighter than Stage 1's open forest; never claustrophobic — Sumphollow should feel like a barn at dawn, not a tomb.

**Mood / palette keywords for Design:**
- `wet-cave-stone` (cool blue-grey, slightly lifted from `river-stone-grey`)
- `cave-moss-blue-green` (the cave's signature: moss that's gone slightly more blue than forest moss because there's less sun)
- `amber-vein` (warm amber light leaking through hairline cracks in the stone — never a full open fire, just a glow)
- `pool-wet` (puddle highlights on the floor; reflective spots)
- `loam-dampened` (a deeper, more saturated cousin of Stage 1's `loam-soil`)

The cave should **share verbatim** the `velvet-shadow` (`#3a2e4a`) ink convention from Stage 1 — the eye reads "same world, different room." Avoid introducing any cool/dark hue that would feel like a different game. Per `docs/story/world.md`: no pure black, even in cave interior.

**Length:** ~192 tile-columns total across four rounds (slightly shorter than Stage 1's 224; cave is a transit room, not a teaching room). Stage 1 was 4 rounds × ~3-4 screens each ≈ 4.7 screens-per-round average; Stage 2 holds the same rhythm with one less screen of total run.

### 5.1 Round 2-1 — "First Descent"

**Length:** ~3 screens, ~48 columns. The Sumphollow's mouth: a small entry chamber with the only **low-ceiling crawl section** in Stage 2 (see §5.5). After that, the ceiling lifts back to standard 12-tile height for the remainder.

**Terrain rhythm:**

```
columns 0–4    : flat (spawn — Reed enters from the surface, armed)
columns 4–8    : gentle downhill (slope_dn_22) — the entry slope
columns 8–14   : LOW-CEILING flat — ceiling drops to 6 tiles (so vertical headroom is 6 tiles instead of 12)
columns 14–18  : flat (ceiling restored to full)
columns 18–22  : gentle uphill (slope_up_22)
columns 22–26  : flat
columns 26–28  : gap (2 tiles) — first cave gap; falling = drowns in a dark pool, 1-hit-kill
columns 28–34  : flat
columns 34–38  : gentle downhill (slope_dn_22)
columns 38–48  : flat (round end + mile-marker)
```

**Mile-marker placement:** `mile_5` at col 3 (this stage's first marker — round-start position per v0.50.2 convention; the global checkpoint index `mile_5` follows from Stage 1's `mile_1`-`mile_4`. Dev-lead may rename the in-asset key as needed).

**Enemy spawn table:**

| Type             | Count | Approx column(s) | Direction | Notes                                                  |
|------------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder (cave-shell variant) | 1 | 32 | left | First contact with the cave-shell variant — see §11. Walking forward through the low-ceiling section then meeting the Mossplodder lets the player practice "jump under low ceiling" right before "jump over rolling shell." |
| Hummerwing       |     0 | —                | —         | No fliers in 2-1 — the low ceiling would crowd the read. Hummerwings begin in 2-2.|

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small`|     1 | 16               | One rock just past the ceiling-restore point. Soft re-introduction to stumble (per v0.50.2 rock behavior). |
| Amber-vein hazard | 0 | —              | Round 2-1 has no fire-equivalent. Calm room. |

**Threat curve / intent:** the round teaches one new thing (low ceiling) and re-introduces one old thing (Mossplodder). Death is unlikely if the player has cleared Stage 1.

### 5.2 Round 2-2 — "The Warm Cracks"

**Length:** ~4 screens, ~64 columns. The Sumphollow's main body. Introduces **amber-vein** — the cave's fire-replacement hazard (see §11): a hairline crack in the stone floor that glows warm and burns on contact. Same 1-hit-kill rule as fire.

**Terrain rhythm:**

```
columns 0–6    : flat (spawn-after-mile_5)
columns 6–10   : gentle uphill (slope_up_22)
columns 10–14  : flat crest
columns 14–17  : gentle downhill (slope_dn_22)
columns 17–19  : gap (2 tiles)
columns 19–25  : flat valley (contains the first amber-vein)
columns 25–29  : gentle uphill (slope_up_22)
columns 29–33  : flat crest #2
columns 33–37  : gentle downhill (slope_dn_22)
columns 37–40  : gap (3 tiles) — second-cave-gap; longer than 2-1's
columns 40–46  : flat (contains the second amber-vein)
columns 46–50  : gentle uphill (slope_up_22)
columns 50–64  : flat (round end + mile-marker)
```

**Mile-marker placement:** `mile_6` at col 51.

**Enemy spawn table:**

| Type             | Count | Approx column(s) | Direction | Notes                                                  |
|------------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder (cave-shell variant) | 2 | 12, 30 | left | One on the first crest, one on the second. Standard left-facing forward roll. |
| Hummerwing (cave variant — see §11) | 2 | 22, 44 | left | First flier in Stage 2: the col-22 Hummerwing drifts above the first amber-vein, the col-44 drifts above the second. **Split-attention beat:** the cave version is recolored cooler (see §11), giving Design a chance to play the warm-spark-falls-cool kill-frame against the cool cave palette. |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small`|     2 | 27, 48           | Round-mid and round-end. Stumble + vitality drain per v0.50.2. |
| Amber-vein  |     2 | 21, 43           | The cave's fire replacement. 1-hit-kill on contact. See §11. |

**Threat curve / intent:** the Stage 2 hard beat. Re-runs the v0.50 Round 1-2 valley puzzle (gap → flat → hazard → flier above) in cave dressing, twice. If first-pass playtest shows the doubled valley is a wall, cleanest fix is dropping the col-44 Hummerwing (Hummerwing returns in 2-4).

### 5.3 Round 2-3 — "Pinned and Cracked"

**Length:** ~3 screens, ~48 columns. Stage 2's density round, structural parallel to v0.50 Round 1-3 (rock-pinned Mossplodder beat + multiple hazards). The amber-vein replaces fire one-for-one.

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
| Mossplodder (cave-shell variant) | 3 | 14, 22, 28 | left | Three on the plateau. Col-22 pins against rock at col-21 — the rock-pin classroom example, restaged in cave dressing. |
| Hummerwing (cave variant) | 2 | 18, 31 | left | Mid-plateau and plateau-exit. Col-18 drifts over the first Mossplodder's path. |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small`|     2 | 21, 32           | Col-21 pins the col-22 Mossplodder (feature, not bug). Col-32 blocks the plateau exit, forcing a stumble or a jump near the col-31 hazard. |
| Amber-vein  |     2 | 16, 26           | Two veins on the plateau, framing the rock-pin. Path puzzle parallels v0.50 Round 1-3. |

**Threat curve / intent:** density round. By round end, the player has handled cave-shell Mossplodder + cave Hummerwing + amber-vein + rock-pin in close quarters. Round 2-3 is also the round where Reed-vs-Mossplodder-vs-amber-vein interaction is most useful — vein-pin a Mossplodder by walking it into a glow crack.

### 5.4 Round 2-4 — "To the Brink"

**Length:** ~4 screens, ~64 columns. Synthesis round. Less dense than 2-3, longer than 2-1, ends at a **stage-transition tile** (the cave's mouth into Brinklane's first shelf).

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
| Mossplodder (cave-shell variant) | 4 | 12, 22, 38, 54 | left | One on each crest/plateau. Col-38 rolls down the steep descent — first cave-Mossplodder gaining speed on a slope. |
| Mossplodder (cave-shell variant) | 1 | 47 | **right** | Right-facing variant in valley #2. The same "save it / kill it / let it fall" decision as v0.50 Round 1-4. |
| Hummerwing (cave variant) | 2 | 20, 58 | left | Col-58 is the last threat before the stage-transition tile. |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small`|     2 | 44, 55           | Valley-2 rock blocks Reed after the gap landing. Crest-3 rock sits between Reed and the col-54 Mossplodder. |
| Amber-vein  |     1 | 50               | Single hazard on the cairn-approach uphill (deliberate visual closure of cave hazards). |

**Stage-transition tile placement:** col 63 (final tile of the round; final tile of the stage). Reed walks in → ritual §3 → Stage 3 loads.

**Threat curve / intent:** parallels v0.50 Round 1-4. Stage 2's exam ends on a downhill into the next stage; the player should pass the threshold breathing out, not gasping.

### 5.5 New terrain idea — low-ceiling section

Sumphollow's **only** new geometry beyond Stage 1's vocabulary. A **6-tile-tall ceiling segment** (versus the standard 12-tile ceiling-or-sky in Stage 1), introduced in Round 2-1 and never repeated in Stages 2-4. Rationale: cave should feel cave-like at least once, but turning the entire stage into low-ceiling combat would crowd the existing FSM and force new jump tunables. One signature beat is enough.

- **Implementation:** the low-ceiling tile is a normal solid tile at row 6 (counting from the top, 0-indexed). Reed's jump apex must stay below it. With current `HERO.jumpVy0 = -11.0`, gravity `0.55`, peak rise ≈ 110 px ≈ 2.3 tiles — well clear of 6-tile headroom. No tunable change required.
- **Hummerwing exclusion:** no Hummerwings in the low-ceiling section (Round 2-1 has zero anyway). If a future revision adds them, their default `driftAltitude` (96 px ≈ 2 tiles) plus bob amplitude would clip the ceiling — Dev should clamp altitude per-section in that case.
- **Visual cue:** Design hints the low ceiling with hanging cave-moss strands or amber-vein highlights along the top edge so the player reads "ceiling here" before they hit it.

### 5.6 Stage 2 threat curve summary

| Round | Length | Mossplodder | Hummerwing | Rocks | Amber-vein | Slopes (steep / total) | Gaps | Notes |
|-------|-------:|------------:|-----------:|------:|-----------:|-----------------------:|-----:|-------|
| 2-1   |  ~48c  |          1  |         0  |    1  |        0   |              0 / 4    |    1 | Low-ceiling beat; teaching round. |
| 2-2   |  ~64c  |          2  |         2  |    2  |        2   |              0 / 8    |    2 | Doubled valley puzzle. Stage 2 hard beat. |
| 2-3   |  ~48c  |          3  |         2  |    2  |        2   |              1 / 6    |    1 | Density / rock-pin classroom. |
| 2-4   |  ~64c  |          5  |         2  |    2  |        1   |              2 / 12   |    3 | Synthesis. |

---

## 6. Stage 3 — **Brinklane** (waterside)

**Theme intent:** Open sky returns. The cave's roof has cracked open along a long seam, and Reed walks a stone shelf alongside a slow underground river. The signature beat is **water-as-hazard**: gaps in the shelf reveal the river below, and falling into water is 1-hit-kill (same rule as fire, same rule as cave gap-pools — water is just the visible version). Brinklane is **brighter, wetter, more reflective** than Sumphollow; the player should feel they've come up out of the dark.

**Mood / palette keywords for Design:**
- `river-deep` (the water surface — deeper, more saturated cousin of `river-stone-grey`, with subtle blue lift; deep enough to read "I should not enter this")
- `wet-shelf-stone` (the platform tops — Stage 2's `wet-cave-stone` carried over, slightly warmer because the sky reaches it)
- `ripple-pale` (small static highlight strokes on the water surface where the river catches dawn-amber from above)
- `reflection-amber` (warm amber glow on the water from the sky-strip above; the only place in Stages 2-4 where the player sees the sky directly)
- `bank-moss` (cousin of `cave-moss-blue-green` but greener because sunlight reaches it)

The signature visual contrast is **warm-from-above + cool-from-below**: dawn-amber sky strip ↘ amber reflection on water ↘ cool blue-green river ↘ wet-stone shelves underfoot. This is the visually richest stage in Area 1.

**Length:** ~192 tile-columns across four rounds (matching Stage 2's total).

### 6.1 Round 3-1 — "The First Shelf"

**Length:** ~3 screens, ~48 columns. The Brinklane's entry — Reed steps out of the cave onto the first stone shelf, with the river to his right (visually present but not mechanically accessible: the river is *under* the playable floor, exposed only where the shelf breaks).

**Terrain rhythm:**

```
columns 0–6    : flat (spawn — Reed steps out of Sumphollow's mouth, armed)
columns 6–10   : gentle uphill (slope_up_22)
columns 10–14  : flat shelf #1
columns 14–17  : gentle downhill (slope_dn_22)
columns 17–19  : water-gap (2 tiles) — first water gap, visible river below
columns 19–25  : flat shelf #2
columns 25–28  : water-gap (3 tiles)
columns 28–34  : flat shelf #3
columns 34–38  : gentle uphill (slope_up_22)
columns 38–48  : flat (round end + mile-marker)
```

**Mile-marker placement:** `mile_9` at col 3.

**Enemy spawn table:**

| Type             | Count | Approx column(s) | Direction | Notes                                                  |
|------------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder      |     2 | 12, 22           | left      | Standard left-facing roll. Col-22 walks toward water-gap at col 25 — if the player ignores it, **it walks off into the water and drowns**. Classroom example of the Brinklane's signature interaction. |
| Hummerwing       |     0 | —                | —         | No fliers in 3-1 — let the player read the water rhythm first. |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small`|     1 | 32               | Single rock on shelf #3. Stumble per v0.50.2. |
| Water-gap   |     2 | 17–19, 25–28     | The signature Brinklane hazard. Same mechanic as a normal gap — falling into one ends the run — but visibly water, not just empty space. See §11. |

**Threat curve / intent:** introduce the water-gap rhythm. Reed has jumped gaps in Stage 1 already; now the gap has visible consequence under it. The drowning-Mossplodder beat is the round's "look what the world does."

### 6.2 Round 3-2 — "Stepping Stones"

**Length:** ~4 screens, ~64 columns. Stage 3's hard beat. Multiple short shelf-platforms separated by water-gaps the player must clear. Hummerwings drift in low over the water surface — close enough to reflect, far enough that a hatchet-throw arc can clear them.

**Terrain rhythm:**

```
columns 0–6    : flat (spawn-after-mile_9)
columns 6–10   : flat shelf
columns 10–13  : water-gap (3 tiles)
columns 13–18  : flat shelf
columns 18–21  : water-gap (3 tiles)
columns 21–25  : flat shelf
columns 25–28  : water-gap (3 tiles)
columns 28–34  : flat shelf
columns 34–38  : gentle uphill (slope_up_22)
columns 38–42  : flat crest
columns 42–45  : gentle downhill (slope_dn_22)
columns 45–48  : water-gap (3 tiles)
columns 48–54  : flat shelf
columns 54–58  : gentle uphill (slope_up_22)
columns 58–64  : flat (round end + mile-marker)
```

**Mile-marker placement:** `mile_10` at col 51.

**Enemy spawn table:**

| Type             | Count | Approx column(s) | Direction | Notes                                                  |
|------------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder      |     3 | 16, 24, 32       | left      | One per middle shelf. Col-16 and col-24 will drown if ignored; col-32 has nowhere to drown (rock-pin would help — see obstacles). |
| Hummerwing       |     2 | 14, 46           | left      | Col-14 drifts above the second water-gap (reflects); col-46 drifts past the fourth. Both are jump-throw targets. |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small`|     2 | 32, 53           | Col-32 pins the col-32 Mossplodder (small rock-pin reprise). Col-53 stumble before mile-marker. |
| Water-gap   |     4 | 10–13, 18–21, 25–28, 45–48 | The round's signature: four water-gaps in 50 columns. Reed has practiced two in 3-1; here he sustains the rhythm. |

**Threat curve / intent:** Stage 3 hard beat. Player must sustain hatchet-on-Mossplodder cadence while reading water-gap spacing. Hummerwings add altitude pressure. If first-pass playtest shows it's a wall, cleanest fix is removing the col-32 Mossplodder (the rock-pin is a teaching beat, not a synthesis beat — let it land in 3-3 instead).

### 6.3 Round 3-3 — "The Sky Strip"

**Length:** ~3 screens, ~48 columns. Density round, structural parallel to 1-3 / 2-3. The "sky strip" is the visual signature: a long crack in the cave-roof overhead means the dawn-amber sky is brightest here, and the water reflects it strongest. Combat density at the highest in Stage 3.

**Terrain rhythm:**

```
columns 0–4    : flat (spawn-after-mile_10)
columns 4–7    : water-gap (3 tiles) — early mandatory water-jump
columns 7–10   : gentle uphill (slope_up_22)
columns 10–13  : steep uphill (slope_up_45)
columns 13–34  : flat plateau (combat zone — the "sky-strip" plateau)
columns 34–38  : gentle downhill (slope_dn_22)
columns 38–42  : water-gap (3 tiles)
columns 42–48  : flat (round end + mile-marker)
```

**Mile-marker placement:** `mile_11` at col 43.

**Enemy spawn table:**

| Type             | Count | Approx column(s) | Direction | Notes                                                  |
|------------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder      |     3 | 16, 22, 28       | left      | Three on the plateau. Col-22 pins against rock at col-21. |
| Hummerwing       |     2 | 18, 30           | left      | Two over the plateau. The "sky strip" is brightest above the plateau; design should let the Hummerwings glow warm here. |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small`|     2 | 21, 33           | Col-21 pins col-22 Mossplodder; col-33 forces a stumble or jump near col-28 Mossplodder. |
| Water-gap   |     2 | 4–7, 38–42       | Bookend the plateau. Mandatory jumps. |

**Threat curve / intent:** density round. The sky strip is a deliberate emotional beat — the brightest, most-overlooked-by-the-player moment in Area 1 — and the highest enemy density. Player should feel "this is the open lane" while keeping their throw cadence.

### 6.4 Round 3-4 — "The Last Shelf"

**Length:** ~4 screens, ~64 columns. Synthesis. Three crest-and-shelf groupings; final shelf approaches the stairway that climbs to Stage 4.

**Terrain rhythm:**

```
columns 0–6    : flat (spawn-after-mile_11)
columns 6–10   : gentle uphill (slope_up_22)
columns 10–14  : flat shelf #1
columns 14–17  : gentle downhill (slope_dn_22)
columns 17–20  : water-gap (3 tiles)
columns 20–25  : flat shelf #2
columns 25–29  : gentle uphill (slope_up_22)
columns 29–33  : steep uphill (slope_up_45)
columns 33–37  : flat shelf #3
columns 37–41  : steep downhill (slope_dn_45)
columns 41–44  : water-gap (3 tiles)
columns 44–49  : flat shelf #4
columns 49–53  : gentle uphill (slope_up_22)
columns 53–57  : flat shelf #5 (transition approach)
columns 57–61  : gentle downhill (slope_dn_22)
columns 61–62  : water-gap (1 tile — narrowest gap in Area 1, a token-jump before the transition)
columns 62–64  : flat (transition tile here)
```

**Mile-marker placement:** `mile_12` at col 3.

**Enemy spawn table:**

| Type             | Count | Approx column(s) | Direction | Notes                                                  |
|------------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder      |     3 | 12, 22, 36       | left      | One on each shelf. Col-36 rolls down the steep descent (slope_dn_45) toward col-41 water-gap — drowns if ignored. |
| Mossplodder      |     1 | 45               | **right** | Right-facing in shelf #4. Walks toward col-44 water-gap — the catch-or-let-it-drown beat. |
| Hummerwing       |     3 | 16, 32, 58       | left      | Col-32 drifts above the steep crest; col-58 is the last threat before the transition. |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small`|     2 | 26, 50           | Mid-round stumble beats. |
| Water-gap   |     3 | 17–20, 41–44, 61–62 | The water-jump rhythm tapers into a narrow token-jump before transition. |

**Stage-transition tile placement:** col 63.

**Threat curve / intent:** structural parallel to v0.50 Round 1-4 and Stage 2's Round 2-4. Brinklane's last shelf is the brightest moment in Stage 3 — and the moment the player realizes the underground river goes *under* the threshold ahead. The narrowest water-gap (1 tile) is a small mercy on the way to Stage 4.

### 6.5 Stage 3 threat curve summary

| Round | Length | Mossplodder | Hummerwing | Rocks | Water-gaps | Slopes (steep / total) | Notes |
|-------|-------:|------------:|-----------:|------:|-----------:|-----------------------:|-------|
| 3-1   |  ~48c  |          2  |         0  |    1  |        2   |              0 / 4     | Teaching round (water-gap rhythm). |
| 3-2   |  ~64c  |          3  |         2  |    2  |        4   |              0 / 6     | Stage 3 hard beat. |
| 3-3   |  ~48c  |          3  |         2  |    2  |        2   |              1 / 4     | Density / sky-strip. |
| 3-4   |  ~64c  |          4  |         3  |    2  |        3   |              2 / 10    | Synthesis. |

---

## 7. Stage 4 — **The Old Threshold** (ancient ruins)

**Theme intent:** the room the Verdant Ruin was named for. Mosaic tile under moss, carved channels, broken pillars. **No Hummerwings, no fire-equivalent hazard** — the threshold is too holy / too cold for both. The enemy density tapers; rocks remain (as broken pillar fragments); the path leads through three rounds of a longer ruin chamber and culminates in a fourth round that is half-length and ends at the boss arena entrance.

**Mood / palette keywords for Design:**
- `mosaic-cool` (a desaturated, slightly-cooler cousin of forest moss — moss that's been undisturbed for centuries)
- `carved-stone-pale` (the pillar/tile material — a pale `river-stone-grey` with a faint amber underlight where the ruin's stored heat still bleeds through)
- `dawn-channel-amber` (warm amber strips along carved channels in the floor — like a vein in the stone)
- `pillar-shadow-violet` (the violet-grey shadow under broken pillars; deeper than Stage 1's general violet-shade)
- `threshold-hush` (a mood word, not a color: Design should pick a palette that reads "quiet enough you can hear your footsteps")

The Old Threshold should feel **older** than the cave and the waterside — like the rest of the Verdant Ruin is the suburb and this is the building everyone forgot. Use the **dawn-amber palette warmth sparingly**; this is a stage where amber is rare and therefore weighted. The boss arena (§8) is where amber returns in force.

**Length:** ~152 tile-columns across four rounds (4-4 is half-length to leave room for the boss arena beat). Slightly shorter than Stages 2 and 3.

### 7.1 Round 4-1 — "Beyond the Steps"

**Length:** ~3 screens, ~48 columns. Stage 4 entry — Reed climbs a flight of root-broken steps and emerges into the ruin chamber's outer aisle. Wide, calm, foreshadowing rather than dense.

**Terrain rhythm:**

```
columns 0–6    : flat (spawn — Reed steps onto the ruin floor, armed)
columns 6–10   : gentle uphill (slope_up_22) — the last of the root-broken steps
columns 10–28  : flat (the outer aisle; wide and quiet)
columns 28–32  : gentle downhill (slope_dn_22)
columns 32–35  : gap (3 tiles) — a broken-tile gap in the mosaic floor
columns 35–48  : flat (round end + mile-marker)
```

**Mile-marker placement:** `mile_13` at col 3.

**Enemy spawn table:**

| Type             | Count | Approx column(s) | Direction | Notes                                                  |
|------------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder (ruin-shell variant — see §11) | 2 | 18, 40 | left | Two on the outer aisle. Slightly larger silhouette + warmer amber underlight (see §11). |
| Hummerwing       |     0 | —                | —         | **No Hummerwings anywhere in Stage 4.** Ceiling is too high; the threshold's air is "too cold for hummers." |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small` (pillar-fragment variant — see §11) | 1 | 24 | Single broken pillar segment. Stumble per v0.50.2. |
| (no fire / no amber-vein / no water-gap) | — | — | The threshold has no hazard hazards. Threat lives entirely in Mossplodders + the boss. |

**Threat curve / intent:** Stage 4's quietest round. The player should feel they've arrived somewhere different — and the brief, dense Stages 2-3 are visibly past.

### 7.2 Round 4-2 — "Carved Channels"

**Length:** ~3 screens, ~48 columns. Introduces **carved channels** as a visual element (not a hazard — see §11; carved channels are a Stage 4 tile decoration that glows dawn-amber but does not damage). The round has slightly more Mossplodders than 4-1, no new hazard.

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
| Mossplodder (ruin-shell) | 3 | 14, 24, 32 | left | One per zone. Standard left-facing roll. |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small` (pillar-fragment) | 2 | 28, 36 | Stumble beats. |
| Carved-channel decoration | 2 | 12-15 (run), 30-33 (run) | Visual only — these tiles glow dawn-amber along the floor surface but do **not** damage Reed. They are the only place dawn-amber appears in Stage 4 outside the boss arena, and that's intentional pre-foreshadowing. See §11. |

**Threat curve / intent:** the round walks. No new mechanic, slightly more Mossplodders, more silhouette variety in tiles.

### 7.3 Round 4-3 — "The Inner Aisle"

**Length:** ~3 screens, ~48 columns. The deepest mid-stage — the room beyond the outer aisle. Density highest in Stage 4 but still gentler than Stage 2 / 3 density rounds; the threshold's pace is measured.

**Terrain rhythm:**

```
columns 0–4    : flat (spawn-after-mile_14)
columns 4–7    : gap (3 tiles)
columns 7–10   : gentle uphill (slope_up_22)
columns 10–13  : steep uphill (slope_up_45)
columns 13–30  : flat plateau (inner aisle)
columns 30–34  : gentle downhill (slope_dn_22)
columns 34–37  : gap (3 tiles)
columns 37–48  : flat (round end + mile-marker)
```

**Mile-marker placement:** `mile_15` at col 3.

**Enemy spawn table:**

| Type             | Count | Approx column(s) | Direction | Notes                                                  |
|------------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder (ruin-shell) | 4 | 14, 20, 26, 32 | left | Four on the inner aisle. Rhythm: one every ~6 columns. The plateau is long; the player has time to throw, recover, advance, throw. |
| Mossplodder (ruin-shell) | 1 | 25 | **right** | One right-facing in the inner aisle. Approaches a Mossplodder coming from the left at col-26 — the two will collide mid-aisle (Mossplodders don't attack each other; they just stop against one another). Classroom example of "the world has its own physics." |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small` (pillar-fragment) | 2 | 17, 35 | Stumble beats. |
| Carved-channel decoration | 1 | 20-25 (long run) | Decoration only; runs underneath the colliding Mossplodders for an "ancient circuit lights up" visual. |

**Threat curve / intent:** Stage 4 density beat. Forward-facing and right-facing Mossplodders together create a small puzzle: throw at the right-facing one first (it will block your forward path) or the left-facing one first (it will reach you sooner)?

### 7.4 Round 4-4 — "The Threshold" (short — opens into boss arena)

**Length:** **~2 screens, ~32 columns** (shorter than every other round in Area 1 — by design, to leave room for the boss arena). The room narrows. Pillars taller. The carved channels converge in a long amber stripe down the center of the floor. At the far right wall, the ruin **wakes**.

**Terrain rhythm:**

```
columns 0–4    : flat (spawn-after-mile_15)
columns 4–8    : gentle uphill (slope_up_22)
columns 8–12   : flat (the convergent channels visible underfoot)
columns 12–16  : flat (continued; pillar-fragments lean in from both sides)
columns 16–20  : gentle uphill (slope_up_22)
columns 20–24  : flat (the boss arena's anteroom)
columns 24–32  : flat → BOSS ARENA ENTRY at col 32
```

**Mile-marker placement:** `mile_16` at col 3 (this is the **last** mile-marker before the boss; if Reed dies inside the boss arena, respawn returns him to `mile_16` and he re-walks the short anteroom — see §8 + `phase3-boss-cast.md` §13).

**Enemy spawn table:**

| Type             | Count | Approx column(s) | Direction | Notes                                                  |
|------------------|------:|------------------|-----------|--------------------------------------------------------|
| Mossplodder (ruin-shell) | 2 | 10, 22 | left | Two on the anteroom. The last two enemies in Area 1 outside the boss. |

**Static obstacle table:**

| Kind        | Count | Approx column(s) | Notes                                                |
|-------------|------:|------------------|------------------------------------------------------|
| `rock_small` (pillar-fragment) | 1 | 16 | Centered between the two Mossplodders. |
| Carved-channel decoration | 1 | 8-24 (long convergent run) | The full-length amber stripe down the floor — visual climax of the carved-channel motif. |

**Boss arena entry placement:** col 32 — Reed walks past col 32 and the **boss arena trigger** fires (see §8). This is **not** a mile-marker and **not** a stage-transition tile; it is a one-way camera-lock event. There is no fade-to-black or stage-name overlay; the arena is contiguous with the anteroom (camera scrolls until the boss is on-screen, then locks).

**Threat curve / intent:** the ritual approach. Two Mossplodders are spaced so the player kills them at a relaxed cadence — the round should feel like the final reading of the room before the door closes behind them.

### 7.5 Stage 4 threat curve summary

| Round | Length | Mossplodder | Hummerwing | Rocks | Hazards | Slopes (steep / total) | Notes |
|-------|-------:|------------:|-----------:|------:|--------:|-----------------------:|-------|
| 4-1   |  ~48c  |          2  |         0  |    1  |       0 |              0 / 2     | Calm entry. |
| 4-2   |  ~48c  |          3  |         0  |    2  |       0 (decoration only) | 0 / 4 | Calm middle. |
| 4-3   |  ~48c  |          5  |         0  |    2  |       0 | 1 / 4 | Density beat. |
| 4-4   |  **~32c**  |       2  |         0  |    1  |       0 | 0 / 2 | Anteroom + boss-arena entry. |

---

## 8. Boss arena beat (end of Stage 4 — Round 4-4)

The boss arena's full spec is in `phase3-boss-cast.md`. This section covers only the **stage-level** transition: how Round 4-4 hands off to the boss fight.

**Camera lock.** When Reed's x-position passes column 32 of Round 4-4 (`bossArenaTriggerCol`), the camera **stops scrolling** at the position that places the arena's left edge at the viewport's left. The arena is the next 12 tiles to the right (cols 32-43 of Round 4-4 layout, or equivalently, "the boss arena" as a self-contained 12×11 tile rectangle — see boss brief §6). Reed continues to have control; the camera does not move until the boss is defeated.

**Boss spawn.** The Bracken Warden is pre-placed at the right wall of the arena (col ≈ 41-42 of the round, near the wall at col 43). When the camera lock fires, the Warden plays its **wake** animation (`idle → windup` transition; see boss brief §3) and becomes active. Reed enters the arena from the left (col 32) facing right; the Warden faces left across the room.

**No fade.** Unlike the stage-transition ritual (§3), there is no fade-to-black before the boss fight. The room is the room; the boss is in it. Reed walks in, the door closes behind him (camera lock = door closing).

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

| Stage    | Rounds | Total cols | Mossplodder | Hummerwing | Rocks | Hazards (fire / vein / water) | Slopes (steep) | Boss |
|----------|-------:|-----------:|------------:|-----------:|------:|------------------------------:|---------------:|------|
| Stage 1 (Mossline) | 4 | ~224 | 11 | 5 | 7 | 5 fire | 4 | — |
| Stage 2 (Sumphollow) | 4 | ~192 | 11 | 6 | 7 | 7 amber-vein | 3 | — |
| Stage 3 (Brinklane) | 4 | ~192 | 11 | 5 | 7 | 11 water-gaps | 3 | — |
| Stage 4 (Old Threshold) | 4 | ~152 | **12** | **0** | **6** | **0** | 1 | Bracken Warden |
| **Area 1 total** | **16** | **~760** | **45** | **16** | **27** | **5 fire + 7 vein + 11 water** | **11** | **1 boss** |

**Curve intent:**
- Stages 1-3 hold roughly equal enemy density (~16 enemies / 192-224 cols) and rotating hazard themes (fire / vein / water).
- Stage 4 *drops* Hummerwings (the threshold has no fliers) and *drops* hazards (the threshold has no fire/vein/water analog) and *adds* the boss. Density of Mossplodders alone is slightly up — the room is more populated by the slow-and-rolling enemy archetype.
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
| Mossplodder (cave-shell) | Stage 2 | Slightly larger shell silhouette (1.1× scale OK if Design wants; otherwise hold scale and reskin only). Moss strands on the shell are pale and slightly luminous (cave-moss bioluminescence read). | `cave-moss-blue-green · shell-loam-pale · amber-vein-tint (highlight) · velvet-shadow` |
| Mossplodder (ruin-shell) | Stage 4 | Same silhouette as default; the shell carries a faint dawn-amber underlight where the carved-channel motif is most active (the carved channels know the Mossplodder is here). | `shell-loam · mosaic-cool (overlay) · dawn-channel-amber (underlight) · pillar-shadow-violet` |

Design owns the per-variant sprite module (or per-variant `palette` slot in the existing `enemy-mossplodder.js`; design-lead's choice on whether one module with three palettes or three modules — Phase 3 brief expresses intent, not implementation).

### 11.2 Hummerwing visual variants

Two variants. Stage 3 also uses the default; Stage 4 has none. Stage 2 introduces the cave variant.

| Variant            | Stages | Silhouette change                                                                                | Color-mood keywords                                  |
|--------------------|--------|--------------------------------------------------------------------------------------------------|------------------------------------------------------|
| Hummerwing (default) | Stage 1, Stage 3 | Per v0.50 spec.                                                                                  | `sunwarm-amber · wing-haze · velvet-shadow · dust-pink` (unchanged) |
| Hummerwing (cave variant) | Stage 2 | Same silhouette. Body amber reads slightly cooler (toward `amber-vein-tint`); wing-haze deepens slightly toward `cave-moss-blue-green`. | `amber-vein-tint · wing-haze-cool · velvet-shadow · pale-cave-pink` |

Design choice: same module / palette swap, per §11.1.

### 11.3 New stage-specific hazards (tile-level — extends v0.50 contract)

Each new hazard is structurally a `fire_low`-equivalent: **1-hit-kill on Reed contact**, Mossplodder dies when walking into it, Hummerwing untouched. Implementation: same `{frames, fps}` animated-tile shape as `fire_low` (`docs/design/contracts.md` §"Animated tiles (v0.50+)"). All-stage hazard contract:

| Hazard          | Stage   | Visual intent                                                                                                | Tile name suggestion |
|-----------------|---------|--------------------------------------------------------------------------------------------------------------|----------------------|
| `amber-vein`    | Stage 2 | Hairline glowing crack in the cave floor. 4-frame slow flicker (~4 fps — slower than fire's 6 fps). No flame tongues; just a steady amber glow that pulses subtly. | `amber_vein` (or design-lead's preferred key) |
| `water-gap`     | Stage 3 | Visible water surface where the shelf breaks. **Not technically an animated tile** — water-gap is a normal gap (no floor tile) with the **river** drawn underneath as a parallax-fast bottom layer. Functionally identical to v0.50 gap-fall = 1-hit-kill, but with a visible water surface 2-3 tiles below the shelf top. 4-frame ripple animation on the water surface (~3 fps — slower still). | `water_surface_anim` (background-layer animated, not a foreground hazard tile) |
| (no hazard)     | Stage 4 | The Old Threshold has none. |  |

**Design note on water-gap implementation.** A "water-gap" is not a hazard tile because Reed doesn't *touch* it under normal conditions — he's either on a shelf or falling. The death trigger is the same as a normal gap (falling below the level's lowest playable row). The water surface beneath is a **decorative parallax element**, animated, drawn at a faster-than-foreground scroll factor so it reads as moving. Implementing it this way reuses the v0.50 gap mechanic verbatim; visual texture is the only new asset.

### 11.4 New stage-specific decorations (visual only; no gameplay)

These are tile decorations — purely cosmetic, no collision, no hazard:

| Decoration       | Stage  | Visual intent                                                                                            |
|------------------|--------|----------------------------------------------------------------------------------------------------------|
| `carved-channel` | Stage 4 | Amber-glowing channel cut into the mosaic floor — runs along the bottom of certain floor-tile columns. 2-frame slow pulse (~2 fps). Decoration only — Reed walks over it without consequence. Carries the "Old Threshold has stored heat" world fiction. |
| `cave-drip`      | Stage 2 (decorative, optional) | Single-tile ceiling tile with a slow water drip animation. ~2 fps. No collision; aesthetic only. Design's call on whether to ship in v0.75 or defer. |
| `bank-reed`      | Stage 3 (decorative, optional) | Foreground tile of tall reeds along the bank-edge. Static or 2-frame breeze. Design's call. |

### 11.5 New tile-set roster

Beyond v0.50's `assets/tiles/area1.js`, Stages 2-4 each need a tileset:

| Tileset path                | Stage | Tiles needed (sketch — design-lead final call)                                                  |
|-----------------------------|-------|--------------------------------------------------------------------------------------------------|
| `assets/tiles/area1-stage2.js` | 2 | `flat_cave`, `slope_up_22`, `slope_up_45`, `slope_dn_22`, `slope_dn_45`, `rock_small_cave`, `amber_vein` (animated), `low_ceiling`, `cave_drip` (optional, animated) |
| `assets/tiles/area1-stage3.js` | 3 | `flat_shelf`, `slope_up_22`, `slope_up_45`, `slope_dn_22`, `slope_dn_45`, `rock_small_shelf`, `water_surface_anim` (animated background), `bank_reed` (optional) |
| `assets/tiles/area1-stage4.js` | 4 | `flat_mosaic`, `slope_up_22`, `slope_up_45`, `slope_dn_22`, `slope_dn_45`, `pillar_fragment` (replaces rock_small), `carved_channel` (animated decoration), boss-arena-floor variant |

Reuse across stages: `slope_up_22 / _45 / slope_dn_22 / _45` shapes can share underlying matrix and reskin via tileset palette — design-lead's call. The `flat_*` tiles and `rock_*`-equivalents are visually distinct per stage.

### 11.6 New backgrounds (parallax)

Three new SVG sets, parallel to v0.50's `area1-sky / -mountains / -trees / -fore`:

| Stage | Files (sketch) | Mood |
|-------|----------------|------|
| Stage 2 | `area1-stage2-cave-deep.svg`, `area1-stage2-cave-mid.svg`, `area1-stage2-cave-fore.svg` | Three layers of cave-stone — distant veins / middle stone / near pillars. No sky. |
| Stage 3 | `area1-stage3-sky-strip.svg`, `area1-stage3-river-far.svg`, `area1-stage3-bank-near.svg` | Top: narrow dawn-amber sky strip (the crack in the cave-roof). Middle: river extending into the distance. Foreground: bank moss + reeds. |
| Stage 4 | `area1-stage4-pillars-deep.svg`, `area1-stage4-pillars-mid.svg`, `area1-stage4-arch-near.svg` | Three layers of broken-pillar / ruin-arch silhouettes. No sky; the threshold has a closed ceiling. |

---

## 12. For Design

Concrete asset list for v0.75 Area 1 expansion. Sizes/anchors follow `docs/design/contracts.md` and the precedents in v0.50 (see `phase2-cast-revision.md` §11).

### 12.1 Sprite modules (new + extended)

| Asset                          | Path                                          | Frame size (w × h)   | Anchor (px, top-left) | Animations                                                                          |
|--------------------------------|-----------------------------------------------|----------------------|-----------------------|-------------------------------------------------------------------------------------|
| Mossplodder (cave-shell variant) | `assets/sprites/enemy-mossplodder.js` (extend palette) or `enemy-mossplodder-cave.js` (new module) | 48 × 36 | (24, 35) — feet center | Same as v0.50 (`walk:4, dead:3`); palette reskin |
| Mossplodder (ruin-shell variant) | `assets/sprites/enemy-mossplodder.js` (extend) or `enemy-mossplodder-ruin.js` (new) | 48 × 36 | (24, 35) | Same as v0.50; palette reskin + dawn-channel-amber underlight overlay |
| Hummerwing (cave variant)      | `assets/sprites/enemy-hummerwing.js` (extend) or `enemy-hummerwing-cave.js` (new) | 36 × 24 | (18, 12) — body center | Same as v0.50 (`drift:2, dead:3`); palette reskin |
| Stage-transition tile (trigger entity) | `assets/sprites/marker-archway.js` | 72 × 48 (1.5 tiles wide × 1 tile tall) | (36, 47) — base center | `idle:2, clear:4` |
| Boss — Bracken Warden          | `assets/sprites/boss-bracken-warden.js`       | see `phase3-boss-cast.md` §10 | see boss brief | see boss brief (multi-state) |

**Palette anchors for new modules** (Design picks hex per `docs/design/palette-phase2.md` conventions):

- **Mossplodder (cave-shell):** `cave-moss-blue-green` (moss top), `shell-loam-pale` (shell base), `amber-vein-tint` (highlight under shell), `velvet-shadow` (ink — `#3a2e4a` re-used).
- **Mossplodder (ruin-shell):** `shell-loam` (base — same as default), `mosaic-cool` (moss overlay), `dawn-channel-amber` (underlight ribbon along shell), `pillar-shadow-violet` (ink).
- **Hummerwing (cave variant):** `amber-vein-tint` (body — cooler amber), `wing-haze-cool` (translucent — possibly extends Glassmoth-policy 8-digit alpha), `velvet-shadow` (1 px outline), `pale-cave-pink` (highlight).
- **Stage-transition tile:** `wet-bark-brown` (posts), `dawn-amber` (crossbeam), `velvet-shadow` (line). Visually distinct from mile-marker (plank + numeral) and cairn (stone stack).

### 12.2 Tile modules (new)

| Tileset path                | Stage  | Notes                                                                                              |
|-----------------------------|--------|----------------------------------------------------------------------------------------------------|
| `assets/tiles/area1-stage2.js` | 2  | Cave tileset per §11.5. `amber_vein` is an animated tile (matches `fire_low` shape).               |
| `assets/tiles/area1-stage3.js` | 3  | Waterside tileset per §11.5. Includes `water_surface_anim` (background-layer animated).            |
| `assets/tiles/area1-stage4.js` | 4  | Ruin tileset per §11.5. Includes `carved_channel` (animated decoration). Includes boss-arena-floor variant for the 12-tile-wide arena. |

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

- **Hatchet vs. cave low-ceiling.** Reed's hatchet arc peaks ~3 tiles above launch (per v0.50 `HATCHET.vy0 = -3.5`, gravity `0.55`); inside the 6-tile-tall low-ceiling section in Round 2-1, a hatchet thrown from the floor will land short. **This is a feature** — the low ceiling restricts both Reed's jump arc and his throw arc. Don't auto-clip the arc to the ceiling; let it pass through (hatchet ignores ceilings, just as it ignores Hummerwing tiles).
- **Mossplodder vs. water-gap.** Mossplodder walks off shelf into water → dies. Reuse `dead` FSM with a 0-frame splash variant if Design supplies one; otherwise fall back to standard `dead` animation (the Mossplodder dies a frame early because vertically it never reaches the water surface — Design's call on whether to add a splash overlay).
- **Boss arena death + camera unlock.** When Reed dies inside the arena, camera unlocks immediately on the dying-frames start (not on respawn). The death animation should not be camera-locked. After respawn at `mile_16`, camera follows Reed normally back through the anteroom; on re-crossing col 32, camera re-locks.
- **Reed off the bottom in Stage 3.** Standard gap-fall handling — falling below the level's lowest playable row triggers `state.killHero()`. No special "drowning" overlay in v0.75; the death is the same dying FSM, just with a water-gap underneath visually (per v0.50.2 dying FSM).
- **Boss carries to subsequent runs?** No. Each Continue rebuilds the full Area from Stage 1; the boss reappears at full HP. (Per §2 + §8.)

### 13.6 Smoke checks (v0.75 quartile gate, full Area 1)

Per `CLAUDE.md` v0.75 row: "Multi-area + hunger/weapon mechanics + parallax + audio integration." This brief covers the **multi-stage Area 1** portion; design-lead and dev-lead may also need separate briefs for hunger and audio (out of scope here).

1. **Stage 1 (full):** clear all four rounds + walk into the new stage-transition tile at col 223. Verify fade + "Stage 2 — Sumphollow" overlay + Stage 2 spawn. `pl.armed` preserved; vitality refilled.
2. **Stage 2 (Sumphollow):** verify low-ceiling section in 2-1 (Reed walks under without head-bumping; cannot jump above ceiling). Verify amber-vein hazard kills Reed; Mossplodder walks into vein and dies. Cave-shell Mossplodder + cave Hummerwing render with the new palettes. Stage-transition at col 191 → Stage 3.
3. **Stage 3 (Brinklane):** verify water-gap kill (Reed falls into water-gap and dies via standard dying FSM). Mossplodder drowns on shelf-end (col-22 of 3-1 walks into the water-gap). Water surface anim renders behind the shelf. Stage-transition at col 191 → Stage 4.
4. **Stage 4 (Old Threshold):** no Hummerwings spawn; no hazards spawn. Carved-channel decoration renders (animated, no collision). Walk through to Round 4-4 col 32 → camera locks; Bracken Warden wakes. Boss fight per `phase3-boss-cast.md` §14 smoke checks.
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

(None at publication.)

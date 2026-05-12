# Release notes

> **한국어 버전:** [release-notes.ko.md](./release-notes.ko.md)

Owned by `release-master`. One section per quartile tag, newest on top.

---

## v0.75 — Phase 3: Area 1 = 4 stages + Bracken Warden boss + hero anim rebuild

**Released:** 2026-05-13 (planned)
**Tag:** `v0.75` on `main`
**Pages:** https://genishs.github.io/wonderboy/

Third quartile milestone. Area 1 grows from one continuous 224-column stage to a **4-stage Area** (forest → beach/shore → cave → dark forest), each with its own 4 rounds + mile-marker overlays, connected by `stage_exit` tile transitions. Stage 4 ends with the **Bracken Warden** boss fight in a camera-locked arena. Reed's sprite is rebuilt at higher resolution (24×36) with slower, more grounded animation cadence to address v0.50.2's "looks like dancing" feedback.

### What's playable

- **Area 1 — "The Mossline Path"**, expanded to 4 stages:
  - **Stage 1** (forest, unchanged) — the existing Mossline Path content from v0.50.x. 4 rounds (1-1 to 1-4) ending in `stage_exit` instead of cairn.
  - **Stage 2** (beach/shore) — 4 rounds (2-1 to 2-4). Sun-warmed sand surface, sea-foam tide-line, `water_gap` 1-hit-kill water at gaps.
  - **Stage 3** (cave) — 4 rounds (3-1 to 3-4). Deeper-greens-cooled-by-mineral palette. `crystal_vein` 1-hit-kill animated hazard (Stage 1's fire repurposed). Low-ceiling crawl section in 3-1 as the signature beat.
  - **Stage 4** (dark forest) — 4 rounds (4-1 to 4-4) + boss arena. Deep blue-green canopy, violet undertones, `moonlight_streak` decorative tiles in 4-4 leading the eye to the boss.
- **Stage transitions** — crossing a `stage_exit` tile triggers a 195-frame stage-transition ritual (input lock 30 / fade-out 45 / hold + bilingual overlay "Stage N / 스테이지 N" 75 / fade-in 45) then loads next stage. Vitality refills. Lives + score + `pl.armed` all carry.
- **Bracken Warden boss fight** — moss-covered stone-and-bracken guardian at the back of a 12×11 dark-forest clearing. FSM: idle → windup (45 f telegraph; chest sigil flares) → attack (slam, spawns moss-pulse projectile at sub-frame 12) → recover (90 f). HP 6 (hatchet hits). Hatchet/moss-pulse mutual despawn on overlap.
- **moss-pulse projectile** — boss-spawned shockwave entity. Travels left at walk speed (3.5 px/frame). Sprint outruns it; hatchet despawns it. 1-hit-kill on hero contact.
- **Boss arena camera lock** — when Reed crosses the boss-trigger column in Round 4-4, camera locks at the arena entry and boss spawns. Reed cannot retreat past the lock-left. Right wall solid.
- **HP bar HUD during boss fight** — 6 pip bar at top-center under vitality bar, "BRACKEN WARDEN" title above. Sigil-amber filled / velvet-shadow empty.
- **Area cleared overlay** — after boss death (60-f death anim + 60-f celebratory beat), shows bilingual "Area 1 cleared — the path continues. / Area 1 클리어 — 길은 이어진다." Any input dismisses to title. Terminal (Area 2 not built; deferred to a future quartile).
- **Hero sprite rebuild** — 24×36 art-pixels (was 16×24), anchor (12, 35). META.animFps slowed across the board (idle 3 fps, walk 5 fps, sprint 8 fps, etc.) so the silhouette reads as grounded motion rather than rapid cycling. Walk = ~1.25 strides/sec, sprint = 2 strides/sec at the actual physics speeds.
- **Lives system + all v0.50.2 semantics** preserved (vitality = one life, 3 lives per Area; mile-marker checkpoints; dying FSM with knockback; GAME OVER unlimited continue → returns to Area 1 Stage 1 start with refilled lives; sprint via X-held; rock stumble; slope step-up).

### Engine additions / changes

- **New modules**: `src/levels/AreaManager.js`, `src/levels/area1/stage{2,3,4}/index.js` + `round-{N}-{1..4}.js` (12 new round modules), `src/mechanics/BossSystem.js`, `src/mechanics/StageTransitionSystem.js`, `src/config/PhaseThreeTunables.js`.
- **Major rewrites**: `src/levels/StageManager.js` (now handles ONE stage's lifecycle; multi-stage flow moved to AreaManager), `src/levels/area1/index.js` (now delegates to per-stage builders), `src/graphics/TileCache.js` (loads all 4 tilesets at init; active palette swaps on stage transition), `src/mechanics/{TriggerSystem, CombatSystem, HeroController}.js`, `src/graphics/Renderer.js` (boss HP bar, stage-transition overlay, area-cleared overlay).
- **TileMap new types**: `WATER_GAP` (Stage 2 hazard), `CRYSTAL_VEIN` (Stage 3 hazard, animated), `MOONLIGHT_STREAK` (Stage 4 decoration, animated), `STAGE_EXIT` (mid-stage transition trigger), `BOSS_TRIGGER` (boss arena entry trigger). `tile.isFatal` flag generalizes `tile.isFire` across all hazard tiles.
- **GAME_STATES** added: `STAGE_TRANSITION`, `BOSS_FIGHT`, `AREA_CLEARED`.
- **ECS** field additions on `player`: none new for v0.75 (uses v0.50.2's `dyingFrames`, `stumbleFrames`, etc.). New `boss` component on the Bracken Warden entity (state, hp, maxHp, stateTimer, facingRight).
- **CI required-files list** extended in `.github/workflows/pr-feature-to-develop.yml` with the new src files.

### Known limitations carried to v1.0 backlog

- Stage 4's right-wall column at the boss arena uses the renderer's `TILE_COLORS[6]` brown fallback instead of an art-tile; visually quiet, but Design can ship a dark-forest wall tile in a follow-up.
- Inside Stages 2/3/4, mile-marker overlays still read "Round 1/2/3/4" (matches the v0.50.2 convention preserved by the plan); could be re-themed as "Round 2-3" etc. for clarity in a polish patch.
- **No in-browser smoke ran during dev** — Node unavailable on the dev workstation. Static analysis (paren/brace balance + import resolution) PASS on all 49 changed JS files; round/stage builder simulation PASS on all 4 stages. **Live URL post-deploy is the first real run.**
- Area 2 not yet built. The area-cleared overlay is intentionally terminal.
- Audio integration deferred to v1.0 (still no BGM / SFX).
- Parallax: existing forest 3-layer parallax used in all stages (no per-stage parallax variation yet; design could ship per-stage bg modules in a follow-up).

### PRs in this quartile

- #26 `story(phase3): Area 1 expansion — 4 stages (forest/cave/water/ruin) + boss (EN+KO)` (themes later corrected by #28)
- #27 `design(phase3): shore + cave + dark-forest tilesets + Bracken Warden boss + moss-pulse (+ hero rebuild + theme remap absorbed)`
- #28 `story(phase3-correction): theme remap — Stage 2 beach / Stage 3 cave / Stage 4 dark forest (EN+KO)`
- #29 `dev(v0.75): Phase 3 — multi-stage Area 1 + Bracken Warden boss + hero anim wire`
- next: `chore(release): v0.75 release notes` (this PR family)
- next: `release(v0.75): Phase 3 quartile merge` (the develop→main merge)

### Tribute posture

All v0.75 characters, sprites, world fiction, level layouts, and boss design are original to this project. The Bracken Warden, moss-pulse, the Stage 2/3/4 themes (executed with our own palette/silhouette decisions), and the dark-forest arena composition are coined for this work. Generic action-platformer conventions (multi-stage areas, end-of-area boss fights, camera-lock arenas) are universal. No reproduction of copyrighted material.

---

## v0.50.2 — Phase 2 patch: jitter fix + slope step-up + new anims + mile-marker shift + death FSM + rock stumble

**Released:** 2026-05-10 (planned)
**Tag:** `v0.50.2` on `main`
**Pages:** https://genishs.github.io/wonderboy/

User feedback after browser-testing v0.50.1 surfaced six issues. v0.50.2 lands all six in a design + dev pair.

### Fixes

- **Standing-still jitter eliminated.** Root cause: `CollisionSystem` flat-bottom-sweep used strict `footY > tileTop`, missing the equality case. Each frame Reed's `ph.onGround` was reset to false, gravity dropped him 0.55 px, then snap re-pulled — visible 1-px oscillation. Fix: change to `>=`. One-character delta.
- **New hero animations.** `sprint` (4 fr @ 12 fps), `sprint_armed` (4 fr @ 12 fps), `stumble` (3 fr @ 8 fps, shared armed/unarmed), refined `death` (4 fr @ 8 fps — knockback rise → airborne tilt → ground impact → settle). Legacy `dead` aliased to the last death frame so existing fallbacks resolve. Idle stays as a 3-frame breath at 4 fps (no longer needs to be static now that the jitter is gone).
- **Slope step-up.** `CollisionSystem.resolveTiles` now auto-steps the hero up to a flat-tile top when blocked by ≤18 px of rise (covers slope→flat seam pixel rounding). Hero-only via `isHero` arg; Mossplodder still bumps walls cleanly. Walking up slopes with arrow keys alone now works without jumping.
- **Mile-marker positions shifted to round STARTS** (per user request "팻말은 라운드 시작에"):
  - Round 1-1 → `mile_1` at col 3 (right after spawn) — overlay "Round 1 / 라운드 1"
  - Round 1-2 → `mile_2` at col 50 (round-relative col 2 + offset 48)
  - Round 1-3 → `mile_3` at col 114
  - Round 1-4 → `mile_4` at col 162 (NEW tile shipped in design PR #22)
  - End-of-stage cairn unchanged (still triggers Stage Cleared)
  - StageManager overlay mapping updated: `mile_N` fires "Round N" overlay; `lastCheckpointCol = mile_N.col + 1` so respawn is just past the marker entering the announced round.
- **Death = knockback + animation + delayed respawn.** `state.killHero(player)` in Phase 2 routes through new `state.beginDying(player)` instead of immediate life decrement. Knockback velocity (vx ±5, vy −6) applied; `pl.dyingFrames = 45` timer; HeroController plays the new `death` anim while the timer decrements. On 1→0 edge, HeroController calls `state.loseLife()` which respawns at the latest passed mile-marker (with `pl.armed` preserved).
- **GAME OVER + unlimited continue** (per user request). Lives reach 0 → state transitions to `GAME_OVER` (no auto-restart). Renderer paints `GAME OVER` centered red 48 px + `Press any key to continue / 아무 키나 눌러 계속`. Listening for jump (Z/Space), attack (X), sprint (X), or movement (←/→ / A/D) → `state.continueRun()` refills lives, sets `_stageRestartPending`, re-enters RESPAWNING. StageManager rebuilds the stage. Unlimited retries.
- **Rock = stumble + small vitality drain + walk-through** (per user request). Rocks no longer block hero motion. `CollisionSystem` records overlap on `level._heroRockContacts`; HeroController consumes the contacts and triggers stumble FSM:
  - `pl.stumbleFrames = 30`, vitality −10, `pl.aiState = 'stumble'`, `v.vx *= 0.3` (momentum loss)
  - During stumble: input ignored, gravity normal
  - 30-frame cooldown + per-rock token (`pl._lastRockTripKey = "col,row"`) prevents re-trip on the same rock until Reed walks fully off
- **`pl.dyingFrames` and `pl.stumbleFrames`** added to the player ECS component (additive — see PR body).

### Files touched

- 16 files; +457 / −53 lines (PR #23) + 8 files; +1060 / −21 (design PR #22)
- Briefly: `src/physics/CollisionSystem.js`, `src/mechanics/{HeroController, CombatSystem, TriggerSystem}.js`, `src/levels/{StageManager, LevelManager, TileMap, area1/index.js, area1/round-1-{1..4}.js}.js`, `src/core/StateManager.js`, `src/graphics/Renderer.js`, `src/config/PhaseTwoTunables.js`, `game.js`, `assets/sprites/hero-reed.js` (new keys), `assets/tiles/area1.js` (mile_4)

### What did NOT change

- Cast identity (Reed Bramblestep, Mossplodder, Hummerwing, dawn-husk, stone hatchet, mile-markers, boundary cairn, "The Mossline Path"). v0.50.1's lives system stays intact.
- Round terrain/spawn data (only mile-marker col positions shifted; everything else identical).
- CI workflow + bilingual policy.
- README control table (Z=jump / X=tap-throw, X-hold-sprint / Z+X-higher-jump unchanged).

### Known limitations carried to v0.75

- Stage transition between Areas (Area 2) still unbuilt; equipment-carries-to-Stage-2 remains structural-only.
- `PhysicsEngine.update` no-ops in Phase 2 mode (negligible CPU cost).
- No in-browser smoke ran during v0.50.2 dev (workstation lacked Node / `npx serve`); CI's `node --check` covers parse correctness, live URL is the first real run.
- Step-up clearance check only verifies the blocking column; entities wider than one tile could miss a wall in the unchecked column. Reed is one tile wide — non-issue today, but future entity sizes need re-validation.

### PRs in this patch

- #22 `design(v0.50.2): hero sprint + stumble + refined death + mile_4 tile (EN+KO)`
- #23 `dev(v0.50.2): jitter fix + slope step-up + new anims + mile-marker shift + death FSM + rock stumble`
- next: `chore(release): v0.50.2 release docs` (this PR family — brief Changelog + release-notes)
- next: `release(v0.50.2): patch quartile merge` (the develop→main merge)

### Tribute posture

All v0.50.2 changes apply to original characters introduced in v0.50 (Reed Bramblestep, Mossplodder, Hummerwing). The added behaviours — death-knockback animations, signpost-at-round-start, GAME OVER + continue, stumble obstacles, slope step-up — are universal platformer conventions executed with original art and original code. No reproduction of copyrighted material.

---

## v0.50.1 — Phase 2 patch: continuous Area 1 + 3-lives + smooth slope + X-modifier + animation tuning

**Released:** 2026-05-10 (planned)
**Tag:** `v0.50.1` on `main`
**Pages:** https://genishs.github.io/wonderboy/

User feedback after browser-testing v0.50 surfaced four directional pivots. v0.50.1 lands all four in one dev PR.

### Fixes

- **Animation jitter / "shaky character" eliminated.** Two root causes addressed:
  - Per-anim fps override added to the sprite META contract. `hero-reed.js` now ships `idle` / `idle_armed` / `dead` at 4 fps for breathy stillness while keeping `walk` / `attack` at 8 fps for snap. `enemy-hummerwing.js` dropped from 12 → 9 fps to tame wing-flap strobe.
  - `slope_up_22` collapsed to a smooth 1-px linear ramp (matching `slope_up_45`'s shape, just shipped at the same gentleness via tile art rather than collision). The previous 4-step 12-px stair was the source of the "vibration" feel on uphill traversal.
- **Area 1 is now ONE continuous 224-column stage.** The four rounds are still authored separately (`src/levels/area1/round-1-{1..4}.js`) and concatenated by `buildArea1Stage()` in `src/levels/area1/index.js`. Mile-marker tiles stay in-world but no longer trigger fade-to-black — they fire a 90-frame bilingual `Round 1-2` / `라운드 1-2` overlay (and 1-3 / 1-4) and serve as checkpoint anchors. The boundary cairn at the far end fires the existing `Stage Cleared` overlay.
- **Hatchet pickup persists for the whole stage** (Q6 reversal). Only the round-1 dawn-husk remains in Area 1; rounds 2-4 dawn-husks dropped during concat. Once Reed picks up the hatchet, he stays armed across mid-stage respawns and (structurally) across stage transitions to future areas.
- **Lives system (3 lives) replaces single-life-line.** Vitality is treated as ONE life. Any death (vitality 0, enemy contact, fire, dart) calls `state.loseLife()` → vitality refills, lives decrements, Reed respawns at the latest mile-marker (or stage start if not yet reached) with `pl.armed` preserved. Zero lives → lives refill to 3, stage rebuilds from scratch (entities re-spawn, hero starts unarmed). Infinite retries; `GAME_OVER` is no longer reachable in Phase 2.
- **Heart HUD top-right** showing `state.lives` of `state.maxLives`. Vitality bar stays top-center as the in-life pressure clock.
- **Mile-marker = checkpoint** (mid-stage respawn anchor). Crossing a marker also refills vitality — small reward beat without a forced fade.
- **X is now dual-mode** (`PhaseTwoTunables.HERO_P2.sprintMultiplier = 1.4`, `sprintJumpMultiplier = 1.15`):
  - `X` tap = throw hatchet (existing).
  - `X` held = sprint while horizontal-moving (1.4× walk speed).
  - `Z` (jump) while `X` held = higher jump (initial vy × 1.15).
  - Phase 1 retro debug path unchanged (no sprint).

### Engine additions / changes

- **Modified**: `src/core/{StateManager, InputHandler}.js` (lives / `loseLife()` / `RESPAWNING` state / `sprintHeld` getter), `src/levels/{StageManager, LevelManager}.js` (continuous-stage load + checkpoint respawn + overlay timer), `src/levels/area1/index.js` (concatenation), `src/mechanics/{HeroController, CombatSystem, HatchetSystem, TriggerSystem}.js` (sprint + respawn flow + lives routing + overlay fire), `src/physics/CollisionSystem.js` (smoothed slope), `src/graphics/Renderer.js` (animFps overrides + lives HUD + mile-marker overlay), `src/config/PhaseTwoTunables.js` (sprint multipliers), `assets/sprites/{hero-reed, enemy-hummerwing}.js` (animFps map / META.fps tweak), `game.js` (wire the new flow).

### Files touched

- 15 files; +574 / -222 lines (PR #19).

### What did NOT change

- Cast identity (Reed Bramblestep, Mossplodder, Hummerwing, dawn-husk, stone hatchet, mile-markers, boundary cairn, "The Mossline Path"). Sprite modules and tile module unchanged in shape; only `META.animFps` / `META.fps` tweaks.
- Round data layouts — slope/enemy/decoration positions identical to v0.50.
- `docs/briefs/phase2-areas.md` and `phase2-cast-revision.md` body — only Changelog sections appended.
- CI workflow + bilingual policy.

### Known limitations carried to v0.75

- No round-card animation polish beyond the 90-frame overlay (dim strip + bilingual text fade).
- Equipment-carries-to-Stage-2 is structural-only (no Stage 2 yet); the carryover bit lives in StageManager but is unexercised.
- `PhysicsEngine.update` still runs every tick in Phase 2 mode but no-ops on every entity type. Negligible CPU.
- No in-browser smoke ran during v0.50.1 dev (workstation lacked Node / `npx serve`); CI's `node --check` covers parse, live URL is the first real run.

### PRs in this patch

- #19 `dev(v0.50.1): anim fps + smooth slope + continuous map + 3-lives + X-modifier`
- next: `chore(release): v0.50.1 release notes` (this PR family — also bumps README controls, appends phase2 brief Changelog)
- next: `release(v0.50.1): patch quartile merge` (the develop→main merge)

### Tribute posture

All v0.50.1 changes apply to original characters introduced in v0.50 (Reed Bramblestep, Mossplodder, Hummerwing). The added mechanics — multi-screen stage with internal landmarks, lives + checkpoints, sprint/jump-modifier, animation fps tuning — are universal platformer conventions executed with original art and original code. No reproduction of copyrighted material.

---

## v0.50 — Phase 2: Area 1 with 4 rounds, slopes, egg→hatchet pickup, Mossplodder + Hummerwing, forest parallax

**Released:** 2026-05-09 (planned)
**Tag:** `v0.50` on `main`
**Pages:** https://genishs.github.io/wonderboy/

The second quartile pivots from a single test stage to a real Area→Round structure with classic platformer pacing. The cast is rebuilt: Phase 1's Crawlspine / Glassmoth / Bristlecone Sapling step aside (sprite modules retained as reserve) and Area 1 introduces **Mossplodder** (slow forward-only ground crawler) and **Hummerwing** (forward-only low-altitude flier). Reed now starts each round unarmed and acquires a **stone hatchet** by running into a **dawn-husk** egg.

### What's playable

- **Area 1 — "The Mossline Path"** with four multi-screen scrolling rounds (1-1 ≈ 3 screens · 1-2 ≈ 4 screens · 1-3 ≈ 3 screens · 1-4 ≈ 4 screens). Mile-marker tile at the end of rounds 1-3; boundary cairn at the end of round 4 fires a "Stage Cleared" overlay reading `The path continues — soon.` / `길은 이어진다 — 곧.`
- **Slope-based terrain** — gentle (22°-feel) and steep (45°) ramps replace stacked platforms. Reed's feet pin to the slope profile; rocks block horizontally; jump gaps are jumpable.
- **Egg → hatchet pickup** — Reed spawns unarmed each round. About one screen in, a `dawn-husk` egg sits on the ground; running into it cracks it (3-frame break) and spawns a hatchet pickup. Walking over the pickup arms Reed (X now throws). Hatchet trajectory: parabolic, **no bounce**, 2-on-screen cap, despawn on first solid contact.
- **Animated tile rendering** — `fire_low` is the project's first animated tile, flicker at ~8 fps via the new `TileCache` infrastructure. Contract extension shipped in design PR #15 supports any future animated tile via the same `{frames, fps}` shape.
- **3-layer SVG parallax forest** — sky (factor 0), distant ridge (0.3), near foliage (0.7). Drawn beneath tiles, scrolls with camera.
- **Vitality + 1-hit-kill from v0.25.2 unchanged.** Z = jump (+ Space), X = attack. Mile-marker contact triggers fade-out / fade-in round transition (60-frame total). Mossplodder + fire = Mossplodder dies. Mossplodder + Reed = Reed dies. Hummerwing + Reed = Reed dies.

### Engine additions / changes

- **New modules**: `src/config/PhaseTwoTunables.js`, `src/graphics/TileCache.js`, `src/levels/StageManager.js`, `src/levels/area1/{round-1-1,round-1-2,round-1-3,round-1-4,index}.js`, `src/mechanics/{HatchetSystem,HuskSystem,Phase2EnemyAI,TriggerSystem}.js`.
- **Modified**: `game.js` (Phase 2 wiring), `src/levels/LevelManager.js` (new `loadAreaRound` path delegating to StageManager), `src/levels/TileMap.js` (slope/decoration/animated/trigger types + `slopeProfile` per-cell), `src/physics/CollisionSystem.js` (slope-aware floor pinning + decoration AABB), `src/graphics/Renderer.js` (TileCache draw, decoration overlay, transition fade, stage-clear overlay, armed-state anim picker), `src/graphics/ParallaxBackground.js` (3-SVG forest), `src/mechanics/{HeroController,CombatSystem}.js` (armed/unarmed state, fire-tile damage, Mossplodder + fire interaction).
- **Phase 1 retired-but-reserved**: `assets/sprites/{enemy-crawlspine,enemy-glassmoth,enemy-bristlecone-sapling,projectile-stoneflake}.js` retained on disk; not loaded by `game.js`'s active Phase 2 path. `src/mechanics/{StoneflakeSystem,SeeddartSystem}.js` retained for the Phase 1 retro debug loader.
- **CI required-files list** extended in `.github/workflows/pr-feature-to-develop.yml` to lock the new Phase 2 source files.

### Known limitations / minor issues (carry to v0.75 backlog)

- `slope_up_22` traversal is a **stepped** climb (12 px stair every 12 px of horizontal travel) — readable but not silky-smooth. Documented as intentional v0.50 trade-off in `src/physics/CollisionSystem.js`; revisit for true 22° (per-pixel ramp) in v0.75.
- Round 1-3's 3-tile gap (cols 6-8) sits at the edge of Reed's max jump distance; tunable `HERO.jumpVy0` is the knob if playtest reports it feels punishing.
- Round transition shows fade only — no "Round 1-2" text card. Intentional for v0.50 minimum-viable; UI polish in v0.75.
- Hummerwing dead body falls to the level-row boundary, not the actual ground tile under it (cosmetic — most visible only when a Hummerwing dies over a gap).
- `PhysicsEngine.update` runs every tick in Phase 2 mode but no-ops on every entity type (Phase 1 hero, axe projectile, patrol enemy). Negligible CPU; safe to leave.
- Stage Clear is terminal — refresh to retry. Continue/restart deferred to v0.75 mechanics work.
- **No in-browser smoke ran during dev**: workstation lacked Node / `npx serve`. Static checks (paren/brace balance, import resolution, matrix-dimension validation) all green; CI's `node --check` covers parse errors. Live URL post-deploy is the first real run.

### PRs in this quartile

- #14 `story(phase2): Area 1 + cast revision — 4 rounds, snail+bee, egg+axe, forest+rock+fire (EN+KO)`
- #15 `design(phase2): assets — Reed armed + 2 enemies + egg + hatchet + Area 1 tiles + parallax`
- #16 `dev(phase2): Area 1 — 4 rounds, slopes, egg/axe pickup, Mossplodder + Hummerwing, parallax forest`
- next: `chore(release): v0.50 release notes` (this PR family)
- next: `release(v0.50): Phase 2 quartile merge` (the develop→main merge)

### Tribute posture

All v0.50 art, audio, names, world fiction, and code are original to this project. The Mossplodder, Hummerwing, dawn-husk, stone hatchet, mile-marker, boundary cairn, and "The Mossline Path" are coined for this work. Generic platformer mechanics (4-round stages, slope terrain, item pickup, throwable axe, snail-archetype + bee-archetype enemies, forest theme + rock/fire obstacles) are universal — original execution preserves the tribute posture.

---

## v0.25.2 — Phase 1 patch: HP removal + Z/X key bindings

**Released:** 2026-05-09 (planned)
**Tag:** `v0.25.2` on `main`
**Pages:** https://genishs.github.io/wonderboy/

User feedback after v0.25.1's browser smoke pointed at a structural overlap (HP
hearts + Vitality bar both tracking life) and an awkward jump-key choice. v0.25.2
collapses Phase 1 to a single life-line and switches to Z/X for jump/attack.

### Fixes

- **HP system removed.** No more hp/iframes/hurt-lock/knockback. Any contact
  with a damaging enemy state, any enemy projectile hit, or vitality reaching
  zero triggers an immediate game over. Vitality is the single life-line.
- **HP heart HUD removed**; only the Vitality bar remains.
- **Jump moved to Z key** (Space kept as accessibility alternate). `↑` and `W`
  no longer jump — they were colliding with players' D-pad expectations.
- **Attack tightened to X only** (Ctrl dropped — was colliding with browser
  shortcuts on some setups).
- **Double-init bug fixed (root cause for "stuck camera" + "ghost player at spawn").**
  `game.js` registered `init` on click, keydown, and touchstart with
  `{once: true}`. Each listener removed only itself after firing, so the user
  clicked to start (firing init), then pressed an arrow key (firing init
  AGAIN). The second init re-ran `loadPhase1Test()` and spawned a second
  player entity at the spawn position, overwriting `levelManager.playerEntity`
  to point at the stationary one — which stalled camera follow (issue 3) and
  left a visible ghost at the spawn (issue 4). Added a function-level
  `_initFired` guard plus explicit `removeEventListener` calls for the sibling
  listeners. Single source of init.
- **Sapling closed-state still 0 damage** — design intent preserved even with
  1-hit-kill.
- `docs/briefs/phase1-cast.md` gets a **Changelog section** documenting the
  hp/iframes pivot and key-binding change.

### Files touched

- `src/core/InputHandler.js`, `src/core/StateManager.js`,
  `src/mechanics/HeroController.js`, `src/mechanics/CombatSystem.js`,
  `src/graphics/Renderer.js`, `src/levels/LevelManager.js`,
  `src/config/PhaseOneTunables.js`
- `game.js` (init guard for double-init bug)
- `README.md`, `README.ko.md` (key tables)
- `docs/briefs/phase1-cast.md` (Changelog section)
- `docs/release-notes.md`, `docs/release-notes.ko.md` (this entry)

### What did NOT change

- Cast identity (Reed Bramblestep + Crawlspine + Glassmoth + Bristlecone
  Sapling), sprite modules, palette, FSM topology.
- Camera scroll, animation timing, enemy feel tunings (all from v0.25.1 stay).
- CI workflow, deploy pipeline, branch strategy.

### PRs in this patch

- #11 `docs(release): bilingual docs (PR 1) — release-master 영역` (already merged before this patch)
- next: `release(v0.25.2): HP removal + Z/X keys` (this PR family)

### Tribute posture

All changes apply to original characters and original code authored for this
project. No reference to or reproduction of copyrighted material.

---

## v0.25.1 — Phase 1 patch: input edge fix + animation timing + scrollable stage + enemy feel

**Released:** 2026-05-09 (planned)
**Tag:** `v0.25.1` on `main`
**Pages:** https://genishs.github.io/wonderboy/

Browser smoke after v0.25 surfaced four issues. v0.25.1 addresses all four in a single dev-lead patch (PR #8) plus a small release-notes update (this PR).

### Fixes

- **Input edge detection unblocked.** `GameLoop._update` was calling `input.update()` before any system read input, so `_prev` always equalled `_keys` and `isPressed`/`isReleased` permanently returned false. Effect: stoneflake throws (`X`), buffered jump trigger, and pause toggle all silently no-op'd. Reordered so input snapshots happen at the END of the frame; mechanics also runs while paused (so unpause can fire), then physics/level/audio gate on `state.gameState !== 'PAUSED'`.
- **Animation timing locked to simulation rate, with state-aware reset.** Renderer's animation index used a render-rate frame counter, so high-Hz monitors played sprites 2.4–4× too fast and idle↔walk↔jump transitions popped into mid-cycle frames. New `Renderer.tick()` (driven by `GameLoop._update`) advances a `_simFrame` counter at the fixed 60 Hz step. Per-sprite `_animStartFrame` resets when the resolved animation key changes; same pattern for the attack overlay so a fresh throw starts at frame 0.
- **Test stage now scrolls.** TestStage extended from 16×12 to **32×12 tiles** with six platforms (three high, three low) and six enemies spread across the stage. Phase-1 mode in `LevelManager.update` now runs the same camera lerp the legacy path uses (player ~1/3 from the left, clamped to stage edges), while still skipping the legacy `_check{Items,Enemies,Hazards,Goal}` paths since CombatSystem owns those.
- **Enemy feel retuned for classic-platformer rhythm.** Tunables-only changes; no design or sprite changes:
  - **Crawlspine** — `walkSpeed 1.0 → 0.8`, `turnFrames 6 → 12` (visible turn beat).
  - **Glassmoth** — gentler bob (`driftAmplitude 16 → 24`, `driftFrequency 0.06 → 0.04`), slower swoop with longer commit and recover (`swoopVy 4.0 → 3.2`, `swoopFrames 24 → 30`, `recoverFrames 30 → 50`), hero must be closer (`sightRangeX 240 → 200`).
  - **Bristlecone Sapling** — clearer telegraph (`closedFrames 120 → 150`, `windupFrames 12 → 24`, `firingFrames 4 → 6`, `cooldownFrames 90 → 120`).
  - **Seeddart** — `speed 4.0 → 3.4` (more dodgeable).
- **Pause/unpause fix bundled in.** Latent `_update` early-return on PAUSED meant the pause input could never fire to unpause. Now pause-toggle survives both edges.

### What did NOT change

- No new ECS components or fields.
- No sprite, palette, or asset edits.
- No story, design, or world-fiction edits.
- HERO and STONEFLAKE tunable blocks unchanged from v0.25.
- CI workflow unchanged (already fixed in #7).
- Legacy Area-1 path unchanged.

### Files touched

- `src/core/GameLoop.js`, `src/graphics/Renderer.js`, `src/levels/TestStage.js`, `src/levels/LevelManager.js`, `src/config/PhaseOneTunables.js`, `game.js`

### PRs in this patch

- #8 `dev(phase1-patch): input edge fix + anim timing + 32-col scroll + enemy feel`
- #9 `chore(release): v0.25.1 release notes` (this PR)
- #10 `release(v0.25.1): patch quartile merge` (the develop→main merge)

### Tribute posture

All retunes apply to original characters introduced in v0.25 (Reed Bramblestep, Crawlspine, Glassmoth, Bristlecone Sapling). No reference to or reproduction of copyrighted Wonder Boy series art, audio, or design.

---

## v0.25 — Phase 1: cast and combat skeleton

**Released:** 2026-05-09 (planned)
**Tag:** `v0.25` on `main`
**Pages:** https://genishs.github.io/wonderboy/

### What's playable
- Original hero **Reed Bramblestep** spawns on a single hand-coded test stage and responds to keyboard input.
- Walk with momentum, variable-height jump (hold-to-go-higher, release-to-cut), coyote frames + buffered jump.
- Throwable original weapon **stoneflake** — skipping-stone arc, single bounce, ≤2 on-screen, walk-throw and jump-throw both work.
- Three mechanically distinct original enemies on the test stage:
  - **Crawlspine** — ground crawler that walks-and-turns at edges and walls (contact damage).
  - **Glassmoth** — airborne sine-drifter that swoops when the hero comes within ~5 tiles below, then recovers (damage on swoop only).
  - **Bristlecone Sapling** — stationary timed hazard cycling closed → windup → firing → cooldown; emits a 3-dart fan at firing; closed silhouette is harmless.
- Hero hurt FSM with iframes, knockback, blink-on-hit; HP bar HUD; terminal Game Over at HP 0.
- All sprites rendered from original Design pixel modules via the Phase 1 SpriteCache (no PNG assets, no scraped art).

### Engine additions
- New modules under `src/`: `config/PhaseOneTunables.js`, `graphics/SpriteCache.js`, `levels/TestStage.js`, `mechanics/{HeroController,EnemyAI,StoneflakeSystem,SeeddartSystem,CombatSystem}.js`.
- ECS field additions (no new components): see PR #4 body for the exact list.
- Single-source-of-truth tunables file lets one-knob playtest tuning happen in one place.

### Known limitations (carried into v0.50 backlog)
- Game Over is terminal — no in-game restart; refresh the page to retry.
- The legacy `Vitality` bar still renders at the top-center of the HUD; Phase 1 entities don't consume hunger so the bar drains harmlessly. To be removed or repurposed when Phase 3 mechanics ship.
- The legacy Area-1 `loadLevel(1, …)` path is unreachable from `game.js` but still builds; bee/cobra/frog enemies will need an AI gate revisit when Phase 2 reactivates the legacy path.
- No camera scroll, no parallax, no audio integration in this quartile (deferred to v0.50 / v0.75).
- `node` was unavailable on the authoring workstation; CI (GitHub Actions) covers `node --check` on every PR.

### PRs in this quartile
- #1 `chore(harness): 7-agent harness + tribute framing + v0.25 quartile flow`
- #2 `story(phase1): cast — hero + enemy archetypes`
- #3 `design(phase1): original sprites for hero, projectile, and 3 enemies`
- #4 `dev(phase1): hero + 3 enemies + stoneflake on test stage`
- #5 `chore(release): v0.25 release notes` (this PR)
- #6 `release(v0.25): develop → main` (the quartile merge)

### Tribute posture
All character names, sprites, lore, and audio in this quartile are original to this project. No portion of the original Wonder Boy series art, audio, or proprietary lore was copied, traced, recolored, or sampled. Reference materials, when consulted, were used only for general genre/mechanic concepts and are summarized in `docs/story/research-notes.md` (none in this quartile).

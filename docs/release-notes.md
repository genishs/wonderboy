# Release notes

> **한국어 버전:** [release-notes.ko.md](./release-notes.ko.md)

Owned by `release-master`. One section per quartile tag, newest on top.

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

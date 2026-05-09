# Release notes

Owned by `release-master`. One section per quartile tag, newest on top.

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

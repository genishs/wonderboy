# Release notes

Owned by `release-master`. One section per quartile tag, newest on top.

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

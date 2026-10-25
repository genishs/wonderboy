# Wonder Boy Tribute — Agent Harness

> **한국어 버전:** [CLAUDE.ko.md](./CLAUDE.ko.md)

A fan-made, **original** action-platformer in the spirit of Sega's 1986/87 Wonder Boy series.
Implemented in **Vanilla JavaScript + HTML5 Canvas** (no runtime dependencies, no build tooling).
Deployed to **GitHub Pages** at https://genishs.github.io/wonderboy/.

> **Tribute, not a port.** All character names, sprites, audio, and lore in this repo are original work created for this project. We study the original as players study a teacher: we learn the *shape* of platforming and let our hands draw something new.

---

## Tech baseline

- Vanilla ES Modules + HTML5 Canvas 2D + Web Audio API
- Logical resolution: 768 × 576 (4:3, 48 px tile, 16 × 12 tile viewport)
- Fixed-timestep 60 fps loop (`src/core/GameLoop.js`)
- ECS skeleton in `src/core/ECS.js`

---

## Branch strategy

```
release/gitpages  ← GitHub Pages source. Fast-forwarded from main on each quartile release.
       ▲
       │ (release-master, on quartile tags only)
       │
      main          ← Quartile-tagged releases only. v0.25 / v0.50 / v0.75 / v1.0.
       ▲
       │ (release-master, when develop hits the next quartile)
       │
   develop          ← Integration. All feature/* PRs target this.
       ▲
       │ (story/design/dev leads, via PR)
       │
   feature/<team>-<topic>
```

### Branch prefixes

| Prefix              | Owner                 |
|---------------------|-----------------------|
| `feature/story-*`   | story-lead / story-assist  |
| `feature/design-*`  | design-lead / design-assist |
| `feature/dev-*`     | dev-lead / dev-assist       |
| `feature/release-*` | release-master (CI/release tooling, branch hygiene) |

### Quartile release flow

1. Phase work merges into `develop` via feature PRs.
2. When a quartile is met, `release-master` opens `develop → main` PR using `release_pr.md`.
3. After merge, tag `main` with `v0.25` / `v0.50` / `v0.75` / `v1.0` (annotated).
4. `git checkout release/gitpages && git merge --ff-only main && git push` — Pages workflow auto-deploys.
5. Append a section to `docs/release-notes.md`.

| Tag   | Progress | Done when                                                                          |
|-------|----------|------------------------------------------------------------------------------------|
| v0.25 | 25 %     | Phase 1: player + ≥3 enemies move/attack on a single test stage; no console errors |
| v0.50 | 50 %     | Phase 2: Area→Round table, stage transitions; Area 1 fully playable                |
| v0.75 | 75 %     | Multi-area + hunger/weapon mechanics + parallax + audio integration                |
| v1.0  | 100 %    | Full content + game-over/continue + polish + verified mobile controls              |

---

## Seven-agent harness

Each functional area is a **lead (Opus, 20-yr persona) + assist (Sonnet)** pair, plus a single **release-master**.

| # | Role           | Model  | Branch prefix     | Owns                                                     |
|---|----------------|--------|-------------------|----------------------------------------------------------|
| 1 | story-lead     | opus   | `feature/story-*`   | `docs/story/`, `docs/maps/`, `docs/briefs/`           |
| 2 | story-assist   | sonnet | (under lead's PR) | drafts under `_drafts/`                                  |
| 3 | design-lead    | opus   | `feature/design-*`  | `assets/sprites/`, `assets/tiles/`, `assets/bg/`, `docs/design/` |
| 4 | design-assist  | sonnet | (under lead's PR) | drafts under `_drafts/`                                  |
| 5 | dev-lead       | opus   | `feature/dev-*`     | `src/*`, `game.js`, `index.html`                       |
| 6 | dev-assist     | sonnet | (under lead's PR) | scoped subsystems handed back to lead                    |
| 7 | release-master | opus   | merges only       | `.github/workflows/`, `.github/PULL_REQUEST_TEMPLATE/`, `docs/release-notes.md` |

Definitions live in `.claude/agents/`. Each lead delegates focused sub-tasks to its assist via the `Agent` tool (sub-agent `Task` style invocation). Assists never push or open PRs themselves.

### Hand-off chain

```
story-lead   →  docs/briefs/phase*.md
                    │
                    ▼
design-lead  →  assets/sprites|tiles|bg/   (data-only, no PNGs from this repo)
                    │
                    ▼
dev-lead     →  src/*  (consumes briefs + asset data, ships playable feature)
                    │
                    ▼
release-master  →  reviews & merges PR to develop
```

---

## Asset format (Design ↔ Dev contract)

We do **not** ship binary PNGs authored by agents. Sprites and tiles are JS modules of palette indices; backdrops are SVGs. Authoritative spec in [`docs/design/contracts.md`](docs/design/contracts.md).

```js
// assets/sprites/<name>.js
export const PALETTE = ['#00000000', /* … hex with optional alpha … */];
export const FRAMES  = { idle: [/* h × w of indices */], walk: [...], ... };
export const META    = { w, h, anchor: { x, y }, fps };
```

`src/graphics/SpriteCache.js` (dev-lead's responsibility) builds an `OffscreenCanvas` per frame on load.

---

## ECS component contract (changes require PR-body note)

```js
transform  : { x, y, w, h }
velocity   : { vx, vy }
physics    : { onGround, onIce, jumpHoldLeft }
player     : { facingRight, isJumping }
enemy      : { type, dir, ai, hp }
item       : { type, collected }
projectile : { type, lifetime }
sprite     : { sheet, frame }
boss       : { area, ai, hp, maxHp, timer }
```

---

## Local development

ES Modules can't load from `file://`. Use a local server:

```bash
npx serve . --listen 8080      # or: python -m http.server 8080
```

Open http://localhost:8080.

---

## Coding rules

- Vanilla JS only. No external runtime libraries. No CDN imports in committed code.
- ES6+ modules / `class` / `const` / arrow functions.
- File header comment: owning agent + a one-line TODO summary.
- `TILE = 48` is fixed across the codebase — do not change without an architecture-level PR.
- Canvas coordinates: top-left origin, x→right, y→down.

---

## Documentation policy (bilingual)

User-facing docs ship in two languages: an English `name.md` (authoritative) and a Korean `name.ko.md` alongside it. The Korean version exists for fast reading by the project owner; the English version remains canonical for tooling, agents, and CI checks.

- Translate prose only. Code blocks, file paths, identifiers, tunable numbers, and tables of fixed values stay verbatim.
- Preserve original names (Reed Bramblestep, Crawlspine, Glassmoth, Bristlecone Sapling, stoneflake, seeddart) and tag names (v0.25, v0.25.1, …) in both versions.
- Code comments, source file headers, and `assets/sprites/*.js` data files stay English-only.
- `.claude/agents/*.md` files keep their English body authoritative (it is a system prompt). Add a top-level `## 한국어 요약` section so a human reader can grasp the role at a glance; the agent reads the whole file but the English instructions remain primary.
- New docs in either language MUST be paired before the PR merges. release-master enforces this in review.

Files explicitly NOT translated:
- `assets/sprites/*.js`, `src/**/*.js`, workflow YAML, `package.json`, `index.html`, `.gitignore`, etc.

---

## Copyright posture (read this)

This is a fan tribute. **Do not** copy original sprites, tracing, recolors of reference images, original BGM samples, or original character names. Use original silhouettes, palettes, names, and audio. When in doubt, ask `release-master` *before* committing — assets that smell of direct copying will block a release.

If you reference public material for inspiration, log it in `docs/story/research-notes.md` with the URL and what you took from it (almost always: a *concept*, never pixels).

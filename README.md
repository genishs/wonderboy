# Wonder Boy Tribute

> **한국어 버전:** [README.ko.md](./README.ko.md)

> An original, fan-made action-platformer in the spirit of Sega's 1986/87 Wonder Boy series.
> Built in Vanilla JavaScript + HTML5 Canvas, deployed to GitHub Pages.

🎮 **Play it: https://genishs.github.io/wonderboy/**

> This is a tribute project. All character names, sprites, audio, and lore in this repo are original work. We study the original as players, but ship our own art.

---

## Highlights

- 8/16-bit-style side-scrolling platformer with original cast
- Variable-height jump, momentum-based movement, throwable weapon
- Hunger / vitality timer that pressures the player to keep moving and gathering food
- 7-area progression with original tile sets and parallax backdrops
- 60 fps fixed-timestep, no runtime dependencies, no build step

---

## Controls

| Key             | Action                                        |
|-----------------|-----------------------------------------------|
| ← → / A D       | Move                                          |
| Z / Space       | Jump (hold longer = higher)                   |
| X               | Throw weapon                                  |
| P / Esc         | Pause                                         |

**Mobile** (touch): left third → move left; bottom-right third → jump; top-right third → attack.

---

## Run locally

ES Modules don't load from `file://`. Use any static server:

```bash
npx serve . --listen 8080      # Node
python -m http.server 8080     # Python
```

Open http://localhost:8080.

---

## Project structure

```
wonderboy/
├── index.html              # Entry point
├── game.js                 # System bootstrap
├── src/
│   ├── core/               # Loop, ECS, state, input
│   ├── physics/            # Movement + collision
│   ├── graphics/           # Renderer, sprite cache, parallax
│   ├── levels/             # Tile maps + level manager
│   ├── mechanics/          # Hunger, weapon, enemy AI, bosses
│   └── audio/              # Web Audio wrapper
├── assets/
│   ├── sprites/            # Sprite modules (palette + frames as JS data)
│   ├── tiles/              # Tile modules per area
│   └── bg/                 # SVG backdrops for parallax
├── docs/
│   ├── story/              # World, characters, research notes
│   ├── maps/               # Area / round structure
│   ├── briefs/             # Phase hand-off briefs (story → design/dev)
│   ├── design/             # Palettes, animation tables, design↔dev contract
│   └── release-notes.md
└── .github/workflows/      # CI + Pages deployment
```

---

## Branch strategy

```
release/gitpages  ← GitHub Pages source. Synced from main on each quartile.
      │
     main          ← Quartile-tagged releases only (v0.25 / v0.50 / v0.75 / v1.0).
      │
   develop        ← Integration. All feature/* PRs target this.
      │
   feature/<team>-<topic>
```

| Prefix              | Owner                                     |
|---------------------|-------------------------------------------|
| `feature/story-*`   | story-lead / story-assist                 |
| `feature/design-*`  | design-lead / design-assist               |
| `feature/dev-*`     | dev-lead / dev-assist                     |
| `feature/release-*` | release-master (CI / release tooling)     |

### Quartile milestones

| Tag   | Progress | Required state                                                                          |
|-------|----------|-----------------------------------------------------------------------------------------|
| v0.25 | 25 %     | Phase 1 — player + ≥3 enemies move/attack on a single test stage                        |
| v0.50 | 50 %     | Phase 2 — Area→Round table, stage transitions, Area 1 fully playable                    |
| v0.75 | 75 %     | Multi-area + hunger/weapon + parallax + audio                                           |
| v1.0  | 100 %    | Full content + game-over/continue + polish + verified mobile controls                   |

---

## Seven-agent harness

| # | Role           | Model  | Owns                                                        |
|---|----------------|--------|-------------------------------------------------------------|
| 1 | story-lead     | opus   | `docs/story/`, `docs/maps/`, `docs/briefs/`                |
| 2 | story-assist   | sonnet | drafts (delegated by lead)                                  |
| 3 | design-lead    | opus   | `assets/sprites/`, `assets/tiles/`, `assets/bg/`, `docs/design/` |
| 4 | design-assist  | sonnet | drafts (delegated by lead)                                  |
| 5 | dev-lead       | opus   | `src/*`, `game.js`, `index.html`                            |
| 6 | dev-assist     | sonnet | scoped subsystems (delegated by lead)                       |
| 7 | release-master | opus   | PR review/merge, tagging, Pages sync, workflows             |

Full definitions in [`.claude/agents/`](.claude/agents/). Operating rules in [`CLAUDE.md`](CLAUDE.md).

---

## License

MIT for original code. Original art and audio are © project authors. The Wonder Boy series is © Sega / LAT (formerly Westone) — this project is an independent fan tribute and is not affiliated with or endorsed by either company.

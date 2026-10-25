# Documentation index

This tree holds the human-readable artifacts the agent teams hand off to each other. Code lives in `src/`; assets live in `assets/`; everything else that's words goes here.

## Layout

- `story/` — world fiction, character/enemy bestiary, research notes (owned by `story-lead` / `story-assist`)
- `maps/` — area/round structure, encounter tables (owned by `story-lead` / `story-assist`)
- `briefs/` — phase hand-off briefs that Design and Dev consume (`phase1-cast.md`, `phase2-areas.md`, …)
- `design/` — palette docs, animation timing, the Design↔Dev data contract (owned by `design-lead` / `design-assist`)
- `release-notes.md` — owned by `release-master`, one section per quartile tag

## Hand-off chain

```
story-lead  →  docs/briefs/phase*.md  →  design-lead  →  assets/sprites|tiles|bg/  →  dev-lead  →  src/*
                                                                                          │
                                              release-master  ←  PR to develop  ←────────┘
```

## Drafting

Drafts go under `_drafts/` subfolders. Anything outside `_drafts/` is considered published and is editorial-quality.

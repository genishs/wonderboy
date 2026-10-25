## 🚀 Quartile release: develop → main

**Quartile:** `vX.YY`  (one of `v0.25` / `v0.50` / `v0.75` / `v1.0`)

## What's in this quartile
<!-- bullet list of merged PR titles and brief one-line summary each -->
-
-
-

## Quartile gate

| Tag   | Done when                                                                             |
|-------|---------------------------------------------------------------------------------------|
| v0.25 | Phase 1 — player + ≥3 enemies move/attack on a single test stage; no console errors  |
| v0.50 | Phase 2 — Area→Round, stage transitions, Area 1 fully playable                        |
| v0.75 | Multi-area + hunger/weapon + parallax + audio                                         |
| v1.0  | Full content + game-over/continue + polish + mobile controls                          |

- [ ] All bullet points for this tag are met
- [ ] `npx serve .` smoke run on the merge preview is clean
- [ ] No scraped art or copyrighted audio anywhere in the diff
- [ ] `docs/release-notes.md` updated with a section for this tag

## Post-merge checklist (release-master)
- [ ] Squash-merge prohibited — preserve history with a merge commit
- [ ] `git tag -a vX.YY -m "<phase summary>"` on `main`
- [ ] `git push origin vX.YY`
- [ ] `git checkout release/gitpages && git merge --ff-only main && git push`
- [ ] Watched `Deploy to GitHub Pages (release/gitpages)` workflow to green
- [ ] Verified live URL: https://genishs.github.io/wonderboy/

## Known issues (carry-over to next quartile)
<!-- anything intentionally deferred -->

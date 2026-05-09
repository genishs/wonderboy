# Phase briefs

Each phase produces one canonical brief here that downstream teams consume.

| Phase | File                  | Owner       | Consumers          |
|-------|-----------------------|-------------|--------------------|
| 1     | `phase1-cast.md`      | story-lead  | design, dev        |
| 2     | `phase2-areas.md`     | story-lead  | design, dev        |
| 3     | `phase3-mechanics.md` | story-lead  | design, dev        |
| 4     | `phase4-content.md`   | story-lead  | design, dev        |

A brief is "published" once it's merged into `develop`. Edits after publication require a follow-up PR with a `## Changelog` section appended.

Each brief MUST end with explicit sections:

```markdown
## For Design
- (concrete asset list with names, sizes, animation states)

## For Dev
- (concrete entity/component list, behavior FSMs, tunable parameters)

## Open questions
- (anything you want release-master to flag)
```

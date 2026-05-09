## Summary
<!-- 1–3 lines: what this PR delivers and which brief it implements -->

## Authoring agent (one)
- [ ] story-lead   (`feature/story-*`)
- [ ] design-lead  (`feature/design-*`)
- [ ] dev-lead     (`feature/dev-*`)
- [ ] release-master (`feature/release-*`)

## Phase / brief
<!-- e.g. "Phase 1, docs/briefs/phase1-cast.md" or "n/a — release tooling" -->

## Hand-off / consumers
<!-- For story PRs: list which Design/Dev decisions this brief unblocks.
     For design PRs: list which sprite/tile modules + META blocks were added.
     For dev PRs: list ECS components added/changed and which assets are wired. -->

## Smoke check (dev PRs)
- [ ] `node --check` passes on every changed `.js`
- [ ] No `debugger` statements
- [ ] Loaded the page via `npx serve .` and clicked through the changed feature
- [ ] No new console errors

## Copyright check
- [ ] No scraped or traced art / audio
- [ ] No original-game character names introduced
- [ ] Reference materials (if any) logged in `docs/story/research-notes.md`

## Open questions for release-master
<!-- anything you want flagged before merge -->

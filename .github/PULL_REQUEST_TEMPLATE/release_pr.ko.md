## 🚀 Quartile 릴리즈: develop → main

**Quartile:** `vX.YY`  (`v0.25` / `v0.50` / `v0.75` / `v1.0` 중 하나)

## 이 quartile 에 포함된 것
<!-- 머지된 PR 제목 + 한 줄 요약을 불릿으로 -->
-
-
-

## Quartile 게이트

| 태그  | 충족 조건                                                                              |
|-------|----------------------------------------------------------------------------------------|
| v0.25 | Phase 1 — 주인공 + 적 ≥3종이 단일 테스트 스테이지에서 이동/공격, 콘솔 에러 0          |
| v0.50 | Phase 2 — Area→Round, 스테이지 전환, Area 1 완성도 있게 플레이 가능                    |
| v0.75 | 멀티 에리어 + 허기/무기 + 패럴랙스 + 오디오                                            |
| v1.0  | 전체 콘텐츠 + 게임오버/컨티뉴 + 폴리시 + 모바일 컨트롤                                 |

- [ ] 이 태그의 모든 항목 충족
- [ ] 머지 프리뷰에 대해 `npx serve .` 스모크 통과
- [ ] diff 어디에도 스크랩 아트나 저작권 오디오 없음
- [ ] `docs/release-notes.md` (영문) + `docs/release-notes.ko.md` (한글) 두 버전에 이 태그 섹션 추가됨

## 머지 후 체크리스트 (release-master)
- [ ] Squash-merge 금지 — 머지 커밋으로 히스토리 보존
- [ ] `main` 에 `git tag -a vX.YY -m "<페이즈 요약>"`
- [ ] `git push origin vX.YY`
- [ ] `git checkout release/gitpages && git merge --ff-only main && git push`
- [ ] `Deploy to GitHub Pages (release/gitpages)` 워크플로우 그린 확인
- [ ] 라이브 URL 검증: https://genishs.github.io/wonderboy/

## 알려진 이슈 (다음 quartile 로 이월)
<!-- 의도적으로 미룬 것 -->

---

> 이 템플릿의 영문 정본은 [release_pr.md](./release_pr.md).

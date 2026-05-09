# 문서 인덱스

> **English version:** [README.md](./README.md)

이 트리는 에이전트 팀 사이의 핸드오프 산출물을 보관합니다. 코드는 `src/`, 자산은 `assets/`, 그 외 단어로 된 모든 것은 여기.

## 레이아웃

- `story/` — 세계 픽션, 캐릭터/적 도감, 리서치 노트 (`story-lead` / `story-assist` 소유)
- `maps/` — 에리어/라운드 구조, 인카운터 표 (`story-lead` / `story-assist` 소유)
- `briefs/` — Design 과 Dev 가 소비하는 페이즈 핸드오프 브리프 (`phase1-cast.md`, `phase2-areas.md`, …)
- `design/` — 팔레트 문서, 애니메이션 타이밍, Design↔Dev 데이터 계약 (`design-lead` / `design-assist` 소유)
- `release-notes.md` — `release-master` 소유, quartile 태그마다 한 섹션

## 핸드오프 체인

```
story-lead  →  docs/briefs/phase*.md  →  design-lead  →  assets/sprites|tiles|bg/  →  dev-lead  →  src/*
                                                                                         │
                                              release-master  ←  develop으로의 PR  ←────┘
```

## 초안 작성

초안은 `_drafts/` 하위 폴더에. `_drafts/` 밖의 모든 것은 published 로 간주되어 편집 품질을 갖춰야 합니다.

## 다중언어

사용자 노출 문서는 영문 `name.md` (정본) + 한글 `name.ko.md` 두 버전을 함께 머지. 자세한 룰은 [`CLAUDE.ko.md`](../CLAUDE.ko.md) 의 "문서 다중언어 정책" 참조.

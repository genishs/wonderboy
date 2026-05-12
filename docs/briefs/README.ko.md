# 페이즈 브리프

> **English version:** [README.md](./README.md)

각 페이즈는 다운스트림 팀이 소비할 정식 브리프 하나를 여기에 발행합니다.

| 페이즈 | 파일                                                                              | 소유자       | 소비자             |
|--------|-----------------------------------------------------------------------------------|--------------|--------------------|
| 1      | `phase1-cast.md` (영문) / `phase1-cast.ko.md` (한글)                              | story-lead   | design, dev        |
| 2      | `phase2-areas.md` + `phase2-cast-revision.md` (페어된 `.ko.md` 포함)              | story-lead   | design, dev        |
| 3      | `phase3-area1-expansion.md` + `phase3-boss-cast.md` (페어된 `.ko.md` 포함)        | story-lead   | design, dev        |
| 4      | `phase4-content.md` / `phase4-content.ko.md`                                      | story-lead   | design, dev        |

브리프는 `develop` 에 머지되는 시점에 "published" 로 간주됩니다. 발행 후 편집은 후속 PR 에 `## Changelog` 섹션 추가가 필수.

각 브리프는 다음 섹션을 명시적으로 끝에 둬야 합니다:

```markdown
## For Design
- (자산 목록을 이름·크기·애니메이션 상태와 함께 구체적으로)

## For Dev
- (엔티티/컴포넌트 목록, 행동 FSM, 튜너블 파라미터)

## Open questions
- (release-master 가 검토할 미해결 질문)
```

## 다중언어

영문 브리프와 한글 브리프 모두 동일 PR 에 짝을 이루어 머지. 영문이 정본; 한글은 빠른 가독성용. 자세한 룰은 [`CLAUDE.ko.md`](../../CLAUDE.ko.md) 의 "문서 다중언어 정책" 참조.

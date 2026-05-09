## 요약 / Summary
<!-- 이 PR이 무엇을 ship 하고 어떤 브리프를 구현하는지 1–3줄 -->

## 작성 에이전트 (하나)
- [ ] story-lead   (`feature/story-*`)
- [ ] design-lead  (`feature/design-*`)
- [ ] dev-lead     (`feature/dev-*`)
- [ ] release-master (`feature/release-*`)

## 페이즈 / 브리프
<!-- 예: "Phase 1, docs/briefs/phase1-cast.md" 또는 "n/a — 릴리즈 도구" -->

## 핸드오프 / 소비자
<!-- story PR: 이 브리프가 어떤 Design/Dev 결정을 잠금 해제하는지.
     design PR: 어떤 sprite/tile 모듈 + META 블록이 추가됐는지.
     dev PR: 추가/변경된 ECS 컴포넌트 필드와 어떤 자산이 와이어됐는지. -->

## 스모크 체크 (dev PR)
- [ ] 변경된 모든 `.js` 에서 `node --check` 통과
- [ ] `debugger` 구문 없음
- [ ] `npx serve .` 로 페이지 로드 후 변경한 기능 클릭하며 확인
- [ ] 새로운 콘솔 에러 없음

## 저작권 체크
- [ ] 스크랩 또는 트레이싱한 아트/오디오 없음
- [ ] 원작 캐릭터 이름 도입 없음
- [ ] 참고 자료 (있다면) 는 `docs/story/research-notes.md` 에 기록

## 다중언어 체크
- [ ] 새/변경된 사용자 노출 문서는 영문 `name.md` + 한글 `name.ko.md` 두 버전이 짝을 이뤄 PR 에 포함
- [ ] 코드 주석·식별자·튜너블 수치는 영문 그대로
- [ ] 오리지널 이름 (Reed Bramblestep, Crawlspine 등) 은 한글본에서도 원문 유지

## release-master 가 검토할 열린 질문
<!-- 머지 전에 짚어주길 원하는 것 -->

---

> 이 템플릿의 영문 정본은 [feature_pr.md](./feature_pr.md). 작성 에이전트는 자기 작업 언어로 자유롭게 본문을 채우면 됩니다.

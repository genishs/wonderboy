# 릴리즈 노트

> **English version:** [release-notes.md](./release-notes.md)

`release-master` 소유. quartile 태그마다 한 섹션, 최신이 위쪽.

---

## v0.25.2 — Phase 1 패치: HP 제거 + Z/X 키 매핑

**릴리즈:** 2026-05-09 (예정)
**태그:** `main` 의 `v0.25.2`
**Pages:** https://genishs.github.io/wonderboy/

v0.25.1 브라우저 스모크 후 사용자 피드백에서 HP 하트 + Vitality 바가 생명을 이중으로 트래킹하는 구조 중복과 점프 키 위치의 어색함이 지적됐습니다. v0.25.2 는 Phase 1 을 단일 생명선으로 단순화하고 점프/공격을 Z/X 로 옮깁니다.

### 수정 내역

- **HP 시스템 제거.** hp/iframe/hurt-lock/knockback 모두 삭제. 데미지 상태의 적과 접촉, 적 원거리 무기 피격, Vitality 가 0 에 도달하면 즉시 게임오버. Vitality 가 단일 생명선.
- **HP 하트 HUD 제거.** Vitality 바만 남음.
- **점프 키 = Z** (Space 는 접근성 대체로 유지). `↑` 와 `W` 는 더 이상 점프 아님 — 플레이어가 기대하는 D-pad 와 충돌.
- **공격 키 = X 단독** (Ctrl 제거 — 일부 환경에서 브라우저 단축키와 충돌).
- **이중-init 버그 수정 (스크롤·잔상 두 이슈의 동일 근본 원인).**
  `game.js` 가 click·keydown·touchstart 세 이벤트에 `{once: true}` 로 `init` 을 등록했는데, 이 옵션은 **각 리스너만** 한 번 발화 후 제거합니다. 그래서 사용자가 캔버스 클릭(→init 1차)→화살표 키 입력(→keydown 리스너 살아있어서 init 2차)이 발생, 두 번째 init 가 `loadPhase1Test()` 를 재실행해 **두 번째 플레이어 엔티티를 스폰 위치에 만들고** `levelManager.playerEntity` 를 그 멈춰있는 엔티티로 덮어씌웠습니다. 결과: 카메라가 멈춘 엔티티를 추적해 스크롤 안 됨(이슈 3), 스폰 자리에 박제된 플레이어 잔상(이슈 4). 함수 레벨 `_initFired` 가드 + 형제 리스너 명시적 `removeEventListener` 추가. 단일 init 원천 확보.
- **Sapling closed 상태 = 0 데미지 유지** — 1-hit-kill 환경에서도 디자인 의도 보존.
- `docs/briefs/phase1-cast.md` 에 **Changelog 섹션** 추가하여 hp/iframe 피벗과 키 바인딩 변경을 문서화.

### 영향받은 파일

- `src/core/InputHandler.js`, `src/core/StateManager.js`,
  `src/mechanics/HeroController.js`, `src/mechanics/CombatSystem.js`,
  `src/graphics/Renderer.js`, `src/levels/LevelManager.js`,
  `src/config/PhaseOneTunables.js`
- `game.js` (이중-init 가드)
- `README.md`, `README.ko.md` (키 테이블)
- `docs/briefs/phase1-cast.md` (Changelog 섹션)
- `docs/release-notes.md`, `docs/release-notes.ko.md` (이 항목)

### 변경되지 않은 것

- 캐스트 정체성 (Reed Bramblestep + Crawlspine + Glassmoth + Bristlecone Sapling), 스프라이트 모듈, 팔레트, FSM 토폴로지.
- 카메라 스크롤, 애니메이션 타이밍, 적 감각 튜닝 (v0.25.1 의 모든 사항 그대로).
- CI 워크플로우, 배포 파이프라인, 브랜치 전략.

### 이 패치의 PR

- #11 `docs(release): bilingual docs (PR 1) — release-master 영역` (이 패치 전에 이미 머지됨)
- next: `release(v0.25.2): HP removal + Z/X keys` (이 PR 패밀리)

### 트리뷰트 자세

모든 변경은 본 프로젝트 자체 제작 오리지널 캐릭터와 코드에 적용됨. 저작권 보호 자료의 참조 또는 재현 없음.

---

## v0.25.1 — Phase 1 패치: 입력 엣지 + 애니메이션 타이밍 + 스크롤 + 적 감각

**릴리즈:** 2026-05-09 (예정)
**태그:** `main` 의 `v0.25.1`
**Pages:** https://genishs.github.io/wonderboy/

v0.25 이후 브라우저 스모크에서 4가지 이슈가 발견됐습니다. v0.25.1은 이 4가지를 단일 dev-lead 패치 (PR #8) + 작은 릴리즈 노트 갱신 (이 PR) 로 처리합니다.

### 수정 내역

- **입력 엣지 검출 잠금 해제.** `GameLoop._update` 가 어떤 시스템도 입력을 읽기 전에 `input.update()` 를 호출해서 `_prev` 가 항상 `_keys` 와 같아졌고, `isPressed` / `isReleased` 가 영구적으로 false 를 반환했습니다. 결과: stoneflake 던지기 (`X`), 버퍼 점프 트리거, 일시정지 토글이 무음 no-op. 입력 스냅샷을 프레임 끝으로 재정렬했고, 일시정지 중에도 mechanics 는 실행되도록 (해제 입력이 발화 가능해야 함) 한 다음 physics/level/audio 는 `state.gameState !== 'PAUSED'` 일 때만 도는 형태로 배열했습니다.
- **애니메이션 타이밍을 시뮬레이션 레이트에 고정 + 상태 인지 리셋.** Renderer 의 애니메이션 인덱스가 렌더-레이트 프레임 카운터를 썼기 때문에, 고주사율 모니터에서는 스프라이트가 2.4–4× 빨리 재생되고 idle↔walk↔jump 전환이 사이클 중간 프레임으로 튀어 들어갔습니다. 새로 도입한 `Renderer.tick()` (`GameLoop._update` 가 구동) 이 `_simFrame` 카운터를 고정 60Hz 스텝으로 증가시킵니다. 스프라이트별 `_animStartFrame` 은 해소된 애니메이션 키가 바뀔 때 리셋; 공격 오버레이도 동일 패턴으로 새 던지기가 0번 프레임부터 시작.
- **테스트 스테이지가 이제 스크롤됨.** TestStage 가 16×12 → **32×12 타일** 로 확장. 6개 플랫폼 (낮 3 + 높 3) 에 6마리 적이 분포. `LevelManager.update` 의 Phase 1 모드가 레거시 경로와 동일한 카메라 lerp (주인공이 좌측 ~1/3 지점, 스테이지 가장자리에서 클램프) 를 돌리되, 레거시 `_check{Items,Enemies,Hazards,Goal}` 는 여전히 스킵 — 그건 CombatSystem 이 소유.
- **클래식 플랫포머 리듬으로 적 튜닝.** 튜너블만 변경, 디자인/스프라이트 변경 없음:
  - **Crawlspine** — `walkSpeed 1.0 → 0.8`, `turnFrames 6 → 12` (회전 비트 가시화).
  - **Glassmoth** — 부드러운 보브 (`driftAmplitude 16 → 24`, `driftFrequency 0.06 → 0.04`), 느린 swoop + 긴 commit/recover (`swoopVy 4.0 → 3.2`, `swoopFrames 24 → 30`, `recoverFrames 30 → 50`), 더 가까이 와야 swoop (`sightRangeX 240 → 200`).
  - **Bristlecone Sapling** — 명확한 telegraph (`closedFrames 120 → 150`, `windupFrames 12 → 24`, `firingFrames 4 → 6`, `cooldownFrames 90 → 120`).
  - **Seeddart** — `speed 4.0 → 3.4` (회피 가능성 증가).
- **Pause/Unpause 잠금 해제 동봉.** PAUSED 시 `_update` 의 잠재적 early-return 때문에 일시정지 입력이 발화 자체가 안 돼서 해제 불가능했습니다. 이제 양방향 모두 동작.

### 변경되지 않은 것

- 새 ECS 컴포넌트 또는 필드 없음.
- 스프라이트, 팔레트, 자산 편집 없음.
- 스토리, 디자인, 세계관 편집 없음.
- HERO 와 STONEFLAKE 튜너블 블록은 v0.25 와 동일.
- CI 워크플로우 변경 없음 (#7 에서 이미 수정됨).
- 레거시 Area-1 경로 변경 없음.

### 영향받은 파일

- `src/core/GameLoop.js`, `src/graphics/Renderer.js`, `src/levels/TestStage.js`, `src/levels/LevelManager.js`, `src/config/PhaseOneTunables.js`, `game.js`

### 이 패치에 포함된 PR

- #8 `dev(phase1-patch): input edge fix + anim timing + 32-col scroll + enemy feel`
- #9 `chore(release): v0.25.1 release notes` (이 PR)
- #10 `release(v0.25.1): patch quartile merge` (develop→main 머지)

### 트리뷰트 자세

모든 재튜닝은 v0.25에서 도입된 오리지널 캐릭터 (Reed Bramblestep, Crawlspine, Glassmoth, Bristlecone Sapling) 에 적용됨. 저작권 보호되는 Wonder Boy 시리즈 아트·오디오·디자인의 참조 또는 재현 없음.

---

## v0.25 — Phase 1: 캐스트와 전투 골격

**릴리즈:** 2026-05-09 (예정)
**태그:** `main` 의 `v0.25`
**Pages:** https://genishs.github.io/wonderboy/

### 플레이 가능한 것

- 오리지널 주인공 **Reed Bramblestep** 이 단일 hand-coded 테스트 스테이지에 스폰되어 키보드 입력에 반응.
- 관성 이동, 가변 점프 (길게 누르면 더 높게, 떼면 컷), coyote 프레임 + 버퍼 점프.
- 던지는 오리지널 무기 **stoneflake** — 물수제비 궤적, 1회 바운스, 화면 ≤2개, 걷기 던지기와 점프 던지기 모두 동작.
- 메커니즘적으로 구분되는 오리지널 적 3종을 테스트 스테이지에:
  - **Crawlspine** — 가장자리/벽에서 회전하는 지면 크롤러 (접촉 데미지).
  - **Glassmoth** — 사인 드리프트 공중 적, 주인공이 ~5타일 내 아래 들어오면 swoop 후 회복 (swoop 시에만 데미지).
  - **Bristlecone Sapling** — closed → windup → firing → cooldown 사이클의 정적 타이밍 위협; firing 에 3-다트 fan 발사; closed 실루엣은 무해.
- 주인공 hurt FSM (iframe, 넉백, 피격 시 깜빡임); HP 바 HUD; HP 0 에서 종착 게임오버.
- 모든 스프라이트는 Phase 1 SpriteCache 를 통해 오리지널 Design 픽셀 모듈에서 렌더 (PNG 자산 없음, 스크랩한 아트 없음).

### 엔진 추가

- `src/` 하위 신규 모듈: `config/PhaseOneTunables.js`, `graphics/SpriteCache.js`, `levels/TestStage.js`, `mechanics/{HeroController,EnemyAI,StoneflakeSystem,SeeddartSystem,CombatSystem}.js`.
- ECS 필드 추가 (새 컴포넌트 없음): 정확한 목록은 PR #4 본문 참조.
- 단일 진실의 원천 튜너블 파일이 한 곳에서 원-노브 플레이테스트 튜닝을 가능케 함.

### 알려진 제약 (v0.50 백로그로 이월)

- 게임오버는 종착 — 인-게임 재시작 없음; 새로고침으로 재시도.
- 레거시 `Vitality` 바가 HUD 상단 중앙에 여전히 렌더; Phase 1 엔티티는 허기를 소비하지 않으므로 무해하게 감소. Phase 3 메카닉이 ship 될 때 제거 또는 재용도.
- 레거시 Area-1 `loadLevel(1, …)` 경로는 `game.js` 에서 도달 불가지만 빌드는 됨; bee/cobra/frog 적은 Phase 2 가 레거시 경로를 재활성화하면 AI 게이트 재방문 필요.
- 카메라 스크롤, 패럴랙스, 오디오 통합 이번 quartile 에는 없음 (v0.50 / v0.75 로 연기).
- `node` 가 작성용 워크스테이션에 없었음; CI (GitHub Actions) 가 모든 PR 에서 `node --check` 를 커버.

### 이 quartile 의 PR

- #1 `chore(harness): 7-agent harness + tribute framing + v0.25 quartile flow`
- #2 `story(phase1): cast — hero + enemy archetypes`
- #3 `design(phase1): original sprites for hero, projectile, and 3 enemies`
- #4 `dev(phase1): hero + 3 enemies + stoneflake on test stage`
- #5 `chore(release): v0.25 release notes`
- #6 `release(v0.25): develop → main` (quartile 머지)

### 트리뷰트 자세

이 quartile 의 모든 캐릭터 이름·스프라이트·세계관·오디오는 본 프로젝트 자체 제작 오리지널. 영감 시리즈의 어떤 아트·오디오·고유 세계관도 복제·트레이싱·재색·샘플링되지 않음. 참고 자료는 (사용 시) 일반적 장르/메카닉 컨셉만 참조했고 `docs/story/research-notes.md` 에 요약 (이 quartile 에는 사용 사례 없음).

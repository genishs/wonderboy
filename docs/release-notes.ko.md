# 릴리즈 노트

> **English version:** [release-notes.md](./release-notes.md)

`release-master` 소유. quartile 태그마다 한 섹션, 최신이 위쪽.

---

## v0.75 — Phase 3: Area 1 = 4 스테이지 + Bracken Warden 보스 + 히어로 애니 리빌드

**릴리즈:** 2026-05-13 (예정)
**태그:** `main` 의 `v0.75`
**Pages:** https://genishs.github.io/wonderboy/

세 번째 quartile 마일스톤. Area 1 이 단일 224-칼럼 연속 스테이지에서 **4-스테이지 Area**(숲 → 해변 → 동굴 → 어두운 숲)로 확장. 각 스테이지는 4 라운드 + mile-marker 오버레이 + `stage_exit` 전환 타일로 연결. Stage 4 끝에 카메라-락 보스 아레나에서 **Bracken Warden** 보스 파이트. Reed 스프라이트는 v0.50.2 의 "춤추는 것 같다" 피드백에 응답해 더 큰 해상도(24×36) + 더 느린 그라운디드 케이던스로 리빌드.

### 플레이 가능한 것

- **Area 1 — "The Mossline Path"**, 4 스테이지로 확장:
  - **Stage 1**(숲, 변경 없음) — v0.50.x 의 기존 Mossline Path 콘텐츠. 4 라운드(1-1~1-4), 끝에 cairn 대신 `stage_exit`.
  - **Stage 2**(해변) — 4 라운드(2-1~2-4). 햇볕에 데워진 모래 표면 + 바다거품 조류 라인 + 갭의 `water_gap` 1-hit-kill 바닷물.
  - **Stage 3**(동굴) — 4 라운드(3-1~3-4). 미네랄로 식힌 깊은 녹색 팔레트. `crystal_vein` 1-hit-kill 애니메이션 해저드(Stage 1 의 fire 재용도). 3-1 의 천장 낮은 크롤 구간이 시그니처 비트.
  - **Stage 4**(어두운 숲) — 4 라운드(4-1~4-4) + 보스 아레나. 깊은 청록 캐노피 + 보라 색조 + 4-4 의 `moonlight_streak` 데코레이션 타일이 보스로 시선 유도.
- **스테이지 전환** — `stage_exit` 타일 통과 시 195 프레임 의식(입력 락 30 / 페이드 아웃 45 / 홀드 + 이중언어 오버레이 "Stage N / 스테이지 N" 75 / 페이드 인 45) 후 다음 스테이지 로드. Vitality 리필. 목숨 + 점수 + `pl.armed` 모두 carry.
- **Bracken Warden 보스 파이트** — 12×11 어두운 숲 빈터 안쪽에 무릎 꿇은 이끼 덮인 돌-고사리 가디언. FSM: idle → windup(45 프레임 텔레그래프; 가슴 sigil 발광) → attack(슬램, 서브프레임 12 에서 moss-pulse 발사체 스폰) → recover(90 프레임). HP 6(hatchet 적중). hatchet ↔ moss-pulse 접촉 시 mutual despawn.
- **moss-pulse 발사체** — 보스 스폰 쇼크웨이브. 왼쪽으로 walk speed(3.5 px/frame)로 이동. 대시는 추월 가능; hatchet 으로 despawn. 히어로 접촉 시 1-hit-kill.
- **보스 아레나 카메라 락** — Reed 가 Round 4-4 의 boss-trigger 칼럼을 넘으면 카메라 아레나 입구에 락 + 보스 스폰. Reed 왼쪽 락 너머로 후퇴 불가. 오른쪽 벽 솔리드.
- **보스 파이트 HP 바 HUD** — vitality 바 아래 상단 중앙에 6-pip 바, 위에 "BRACKEN WARDEN" 타이틀. sigil-amber 채움 / velvet-shadow 빈 칸.
- **Area 클리어 오버레이** — 보스 사망(60 프레임 죽음 애니 + 60 프레임 축하 비트) 후 이중언어 "Area 1 cleared — the path continues. / Area 1 클리어 — 길은 이어진다." 표시. 아무 입력으로 타이틀로 해제. 종착(Area 2 미구현; 차기 quartile 로 연기).
- **히어로 스프라이트 리빌드** — 24×36 아트픽셀(이전 16×24), 앵커 (12, 35). META.animFps 전반 느려짐(idle 3 fps, walk 5 fps, sprint 8 fps 등) — 실루엣이 빠른 사이클이 아닌 그라운디드 모션으로 읽힘. walk = ~1.25 스트라이드/초, sprint = 2 스트라이드/초.
- **목숨 시스템 + v0.50.2 의 모든 의미론** 유지(vitality = 1 목숨, Area 당 3 목숨; mile-marker 체크포인트; 넉백 dying FSM; GAME OVER 무제한 continue → Area 1 Stage 1 시작으로 목숨 리필 복귀; X 홀드 sprint; rock stumble; 슬로프 step-up).

### 엔진 추가/변경

- **신규 모듈**: `src/levels/AreaManager.js`, `src/levels/area1/stage{2,3,4}/index.js` + `round-{N}-{1..4}.js`(12 신규 라운드 모듈), `src/mechanics/BossSystem.js`, `src/mechanics/StageTransitionSystem.js`, `src/config/PhaseThreeTunables.js`.
- **메이저 재작성**: `src/levels/StageManager.js`(이제 한 스테이지 라이프사이클만; 멀티 스테이지 흐름은 AreaManager 로), `src/levels/area1/index.js`(스테이지별 빌더로 위임), `src/graphics/TileCache.js`(init 에 4 타일셋 모두 로드; 활성 팔레트는 스테이지 전환 시 스왑), `src/mechanics/{TriggerSystem, CombatSystem, HeroController}.js`, `src/graphics/Renderer.js`(보스 HP 바, 스테이지 전환 오버레이, area-cleared 오버레이).
- **TileMap 신규 타입**: `WATER_GAP`(Stage 2 해저드), `CRYSTAL_VEIN`(Stage 3 해저드 애니), `MOONLIGHT_STREAK`(Stage 4 데코 애니), `STAGE_EXIT`(중간 스테이지 전환 트리거), `BOSS_TRIGGER`(보스 아레나 입구 트리거). `tile.isFatal` 플래그가 모든 해저드 타일에 걸쳐 `tile.isFire` 를 일반화.
- **GAME_STATES** 추가: `STAGE_TRANSITION`, `BOSS_FIGHT`, `AREA_CLEARED`.
- **ECS**: v0.75 에서 player 필드 신규 없음(v0.50.2 의 `dyingFrames`, `stumbleFrames` 등 그대로). Bracken Warden 엔티티의 신규 `boss` 컴포넌트(state, hp, maxHp, stateTimer, facingRight).
- **CI 필수 파일 리스트** `.github/workflows/pr-feature-to-develop.yml` 에 신규 src 파일들 잠금.

### 알려진 제약 (v1.0 백로그)

- Stage 4 의 보스 아레나 오른쪽 벽 칼럼이 아트 타일 대신 렌더러의 `TILE_COLORS[6]` 갈색 폴백으로 그려짐; 시각적으로는 조용하나 Design 이 후속 패치에 dark-forest 벽 타일을 ship 할 수 있음.
- Stages 2/3/4 안에서 mile-marker 오버레이가 여전히 "Round 1/2/3/4"로 표시(plan 이 보존한 v0.50.2 컨벤션 일치); 폴리시 패치에서 "Round 2-3" 등으로 재테마 가능.
- **dev 중 in-browser smoke 미실행** — 워크스테이션에 Node 부재. 정적 분석(괄호/임포트) 변경된 모든 49 JS 파일 PASS; 라운드/스테이지 빌더 시뮬레이션 4 스테이지 PASS. **라이브 URL 이 첫 진짜 실행.**
- Area 2 미구축. area-cleared 오버레이는 의도된 종착.
- 오디오 통합 v1.0 으로 연기(여전히 BGM/SFX 없음).
- 패럴랙스: 모든 스테이지에 기존 숲 3-레이어 패럴랙스 사용(스테이지별 패럴랙스 변주 아직 없음; design 이 후속 패치에서 스테이지별 bg 모듈 ship 가능).

### 이 quartile 의 PR

- #26 `story(phase3): Area 1 expansion — 4 stages (forest/cave/water/ruin) + boss (EN+KO)`(테마는 #28 에서 정정)
- #27 `design(phase3): shore + cave + dark-forest tilesets + Bracken Warden boss + moss-pulse (+ hero rebuild + theme remap absorbed)`
- #28 `story(phase3-correction): theme remap — Stage 2 beach / Stage 3 cave / Stage 4 dark forest (EN+KO)`
- #29 `dev(v0.75): Phase 3 — multi-stage Area 1 + Bracken Warden boss + hero anim wire`
- next: `chore(release): v0.75 release notes`(이 PR 패밀리)
- next: `release(v0.75): Phase 3 quartile merge`(develop→main 머지)

### 트리뷰트 자세

v0.75 의 모든 캐릭터·스프라이트·세계관·레벨 레이아웃·보스 디자인은 본 프로젝트 자체 제작 오리지널. Bracken Warden, moss-pulse, Stage 2/3/4 테마(자체 팔레트/실루엣 결정으로 실행), 어두운 숲 아레나 구성 모두 본 작업을 위해 창안. 일반적인 액션 플랫포머 컨벤션(멀티 스테이지 area, area 끝 보스 파이트, 카메라 락 아레나)은 보편적. 저작권 보호 자료의 재현 없음.

---

## v0.50.2 — Phase 2 패치: jitter 픽스 + 슬로프 step-up + 새 애니 + 마일마커 시프트 + 죽음 FSM + 돌 stumble

**릴리즈:** 2026-05-10 (예정)
**태그:** `main` 의 `v0.50.2`
**Pages:** https://genishs.github.io/wonderboy/

v0.50.1 브라우저 테스트 후 사용자 피드백 6 건 — design + dev 페어로 모두 처리.

### 수정 내역

- **정지 시 떨림 제거.** 근본 원인: `CollisionSystem` 평면 바닥 스윕이 `footY > tileTop` 엄격 비교를 써서 같음 케이스를 놓침. 매 프레임 `ph.onGround` 가 false 로 리셋 → 중력으로 0.55 px 떨어짐 → 스냅이 다시 끌어올림 → 1-px 진동. 수정: `>=` 로 변경. 1 글자 delta.
- **새 hero 애니메이션.** `sprint`(4 프레임 @ 12 fps), `sprint_armed`(4 프레임 @ 12 fps), `stumble`(3 프레임 @ 8 fps, armed/unarmed 공유), 리파인된 `death`(4 프레임 @ 8 fps — knockback 솟구침 → 공중 기울기 → 지면 충돌 → 안착). legacy `dead` 는 마지막 death 프레임으로 alias. idle 은 그대로 4 fps 3 프레임 호흡(jitter 가 사라졌으니 정적일 필요 없음).
- **슬로프 step-up.** `CollisionSystem.resolveTiles` 가 ≤18 px 까지의 평면-타일 차단을 자동으로 한 단계 올림(슬로프→평면 솔기 픽셀 라운딩 처리). 히어로 전용(`isHero` 인자); Mossplodder 는 여전히 벽에 깔끔하게 부딪힘. 화살표만으로 슬로프 등반 가능.
- **마일마커 시프트(라운드 시작 위치)** (사용자 "팻말은 라운드 시작에" 요청):
  - 라운드 1-1 → `mile_1` col 3 (스폰 직후) — 오버레이 "Round 1 / 라운드 1"
  - 라운드 1-2 → `mile_2` col 50 (라운드 상대 col 2 + offset 48)
  - 라운드 1-3 → `mile_3` col 114
  - 라운드 1-4 → `mile_4` col 162 (design PR #22 의 신규 타일)
  - 스테이지 끝 cairn 변경 없음(여전히 Stage Cleared 트리거)
  - StageManager 오버레이 매핑 갱신: `mile_N` → "Round N" 오버레이; `lastCheckpointCol = mile_N.col + 1` 로 respawn 은 마커 직후(해당 라운드 진입 위치)
- **죽음 = 넉백 + 애니메이션 + 지연 respawn.** Phase 2 의 `state.killHero(player)` 가 바로 lives 감소 대신 새 `state.beginDying(player)` 로 라우팅. 넉백 속도 vx ±5, vy −6 적용; `pl.dyingFrames = 45` 타이머; HeroController 가 timer decrement 동안 새 `death` 애니 재생. 1→0 엣지에서 `state.loseLife()` 호출 → 가장 최근 통과 마일마커에서 respawn(`pl.armed` 보존).
- **GAME OVER + 무제한 continue** (사용자 요청). lives 0 → 자동 재시작 대신 `GAME_OVER` 상태 전환. Renderer 가 중앙에 빨간 48 px `GAME OVER` + `Press any key to continue / 아무 키나 눌러 계속` 표시. jump(Z/Space) / attack(X) / sprint(X) / 이동(←/→ / A/D) 입력 → `state.continueRun()` lives 리필 + `_stageRestartPending` + RESPAWNING. StageManager 가 스테이지 재구축. 무한 재도전.
- **돌 = stumble + 소량 vitality drain + 통과** (사용자 요청). 돌이 더 이상 hero 움직임 차단 X. `CollisionSystem` 이 `level._heroRockContacts` 에 overlap 기록; HeroController 가 contacts 를 소비해 stumble FSM 작동:
  - `pl.stumbleFrames = 30`, vitality −10, `pl.aiState = 'stumble'`, `v.vx *= 0.3`(관성 손실)
  - stumble 중: 입력 무시, 중력 정상
  - 30 프레임 cooldown + 돌 별 token(`pl._lastRockTripKey = "col,row"`) 으로 같은 돌에서 reed 가 완전히 벗어나기 전까지 재트립 방지
- **`pl.dyingFrames` 와 `pl.stumbleFrames`** 가 player ECS 컴포넌트에 추가됨(additive — PR body 참조).

### 영향받은 파일

- 16 파일; +457 / −53 줄 (PR #23) + 8 파일; +1060 / −21 (design PR #22)
- 간략히: `src/physics/CollisionSystem.js`, `src/mechanics/{HeroController, CombatSystem, TriggerSystem}.js`, `src/levels/{StageManager, LevelManager, TileMap, area1/index.js, area1/round-1-{1..4}.js}.js`, `src/core/StateManager.js`, `src/graphics/Renderer.js`, `src/config/PhaseTwoTunables.js`, `game.js`, `assets/sprites/hero-reed.js` (신규 키), `assets/tiles/area1.js` (mile_4)

### 변경되지 않은 것

- 캐스트 정체성(Reed Bramblestep, Mossplodder, Hummerwing, dawn-husk, stone hatchet, mile-markers, boundary cairn, "The Mossline Path"). v0.50.1 의 lives 시스템 그대로.
- 라운드 지형/스폰 데이터(마일마커 col 위치만 시프트; 나머지 동일).
- CI 워크플로우 + 이중언어 정책.
- README 컨트롤 테이블(Z=점프 / X=탭-던지기, X-홀드-대시 / Z+X-고점프 불변).

### 알려진 제약 (v0.75 백로그)

- Area 간 스테이지 전환(Area 2) 미구현; 다음 Area 로의 장비 carryover 는 구조 준비만.
- `PhysicsEngine.update` 가 Phase 2 모드에서 no-op (CPU 비용 무시).
- v0.50.2 dev 중 in-browser smoke 미실행(워크스테이션에 Node/`npx serve` 없음); CI 의 `node --check` 가 파싱 커버, 라이브 URL 이 첫 진짜 실행.
- step-up clearance 검사는 차단 칼럼만 검증; 1 타일 폭 이상 엔티티는 미검사 칼럼의 벽을 놓칠 수 있음. Reed 는 1 타일 — 현재 무관, 향후 엔티티 크기 변경 시 재검증 필요.

### 이 패치의 PR

- #22 `design(v0.50.2): hero sprint + stumble + refined death + mile_4 tile (EN+KO)`
- #23 `dev(v0.50.2): jitter fix + slope step-up + new anims + mile-marker shift + death FSM + rock stumble`
- next: `chore(release): v0.50.2 release docs` (이 PR 패밀리 — brief Changelog + release-notes)
- next: `release(v0.50.2): patch quartile merge` (develop→main 머지)

### 트리뷰트 자세

모든 v0.50.2 변경은 v0.50 에서 도입된 오리지널 캐릭터(Reed Bramblestep, Mossplodder, Hummerwing) 에 적용. 추가된 동작 — 죽음-넉백 애니메이션, 라운드 시작 사인, GAME OVER + continue, stumble 장애물, 슬로프 step-up — 은 보편적인 플랫포머 컨벤션이며 오리지널 아트와 오리지널 코드로 실행. 저작권 보호 자료의 재현 없음.

---

## v0.50.1 — Phase 2 패치: 연속 Area 1 + 3 목숨 + 부드러운 슬로프 + X 모디파이어 + 애니 튜닝

**릴리즈:** 2026-05-10 (예정)
**태그:** `main` 의 `v0.50.1`
**Pages:** https://genishs.github.io/wonderboy/

v0.50 브라우저 테스트 후 사용자 피드백 4건 — 모두 v0.50.1 단일 dev PR 에 fold-in.

### 수정 내역

- **캐릭터 진동/"흔들림" 제거.** 두 가지 원인 동시 처리:
  - 스프라이트 META 에 키별 fps 오버라이드 추가. `hero-reed.js` 는 `idle`/`idle_armed`/`dead` 4 fps(고요한 호흡), `walk`/`attack` 8 fps(긴장감) 유지. `enemy-hummerwing.js` 는 12→9 fps(날개 스트로보 완화).
  - `slope_up_22` 가 매끄러운 1-px 선형 램프(slope_up_45 와 동형, 부드러움은 타일 아트로만 표현)로 통일. 기존 4-스텝 12 px 계단이 "진동" 감각의 원인.
- **Area 1 이 이제 ONE 224-칼럼 연속 스테이지.** 4 라운드는 여전히 분리 저작(`src/levels/area1/round-1-{1..4}.js`)되되 `buildArea1Stage()` 가 `src/levels/area1/index.js` 에서 concat. Mile-marker 타일은 세계 안 그대로 남되 더 이상 fade 트리거 아님 — 90-프레임 이중언어 `Round 1-2` / `라운드 1-2`(및 1-3, 1-4) 오버레이 발화 + 체크포인트 앵커 역할만. 끝의 boundary cairn 은 기존 `Stage Cleared` 오버레이 그대로 발화.
- **도끼 픽업이 스테이지 내내 지속**(Q6 뒤집힘). Area 1 은 라운드 1 의 dawn-husk 만 남고 2-4 의 husk 들은 concat 단계에서 제거. Reed 가 한 번 도끼를 획득하면 스테이지 내내 + mid-stage respawn 사이에서도 무장 유지. 다음 Area 로의 carryover 도 구조적으로 준비됨.
- **목숨 시스템(3 lives) 가 단일 라이프 라인을 대체.** Vitality 는 1 목숨으로 취급. 사망(vitality 0, 적 접촉, 불, 다트)은 `state.loseLife()` 호출 → vitality 리필, lives 감소, Reed 가 최신 mile-marker(또는 도달 전이면 스테이지 시작)에서 `pl.armed` 보존하며 respawn. Zero lives → lives 3 리필, 스테이지 처음부터 재구축(엔티티 재스폰, 히어로 비무장 시작). 무한 재도전; Phase 2 에서 `GAME_OVER` 도달 불가.
- **하트 HUD 우측 상단** 에 `state.lives`/`state.maxLives` 표시. Vitality 바는 상단 중앙(라이프 내부 시간 압박 시계).
- **Mile-marker = 체크포인트**(mid-stage respawn 앵커). 마커 통과 시 vitality 도 만량으로 리필 — fade 없이 작은 보상 비트.
- **X 가 듀얼 모드**(`PhaseTwoTunables.HERO_P2.sprintMultiplier = 1.4`, `sprintJumpMultiplier = 1.15`):
  - `X` 탭 = 도끼 던지기(기존).
  - `X` 홀드 = 수평 이동 시 대시(1.4× walk speed).
  - `Z`(점프) + `X` 홀드 = 더 높은 점프(초기 vy × 1.15).
  - Phase 1 retro debug 경로 변경 없음(대시 없음).

### 엔진 추가/변경

- **수정**: `src/core/{StateManager, InputHandler}.js`(목숨 / `loseLife()` / `RESPAWNING` 상태 / `sprintHeld` getter), `src/levels/{StageManager, LevelManager}.js`(연속 스테이지 로드 + 체크포인트 respawn + 오버레이 타이머), `src/levels/area1/index.js`(concatenation), `src/mechanics/{HeroController, CombatSystem, HatchetSystem, TriggerSystem}.js`(sprint + respawn 흐름 + 목숨 라우팅 + 오버레이 발화), `src/physics/CollisionSystem.js`(매끄러운 슬로프), `src/graphics/Renderer.js`(animFps 오버라이드 + 목숨 HUD + mile-marker 오버레이), `src/config/PhaseTwoTunables.js`(sprint 배수), `assets/sprites/{hero-reed, enemy-hummerwing}.js`(animFps 맵 / META.fps 조정), `game.js`(새 흐름 와이어).

### 영향받은 파일

- 15 개 파일; +574 / -222 줄(PR #19).

### 변경되지 않은 것

- 캐스트 정체성(Reed Bramblestep, Mossplodder, Hummerwing, dawn-husk, stone hatchet, mile-marker, boundary cairn, "The Mossline Path"). 스프라이트 모듈과 타일 모듈 형태 그대로; META.animFps / META.fps 만 미세 조정.
- 라운드 데이터 레이아웃 — 슬로프/적/장식 위치가 v0.50 과 동일.
- `docs/briefs/phase2-areas.md` 와 `phase2-cast-revision.md` 본문 — Changelog 섹션만 추가.
- CI 워크플로우 + 이중언어 정책.

### 알려진 제약(v0.75 백로그)

- 90-프레임 오버레이(어두워진 스트립 + 이중언어 텍스트 페이드) 외에 라운드 카드 폴리시 없음.
- 다음 Area 로의 장비 carryover 는 구조 준비만(아직 Stage 2 없음); StageManager 에 carry 비트 존재하나 미실행.
- `PhysicsEngine.update` 가 Phase 2 모드에서도 매 틱 실행되지만 모든 엔티티 타입에서 no-op. CPU 비용 무시 가능.
- v0.50.1 dev 중 in-browser smoke 미실행(워크스테이션에 Node/`npx serve` 없음); CI 의 `node --check` 가 파싱 커버, 라이브 URL 이 첫 진짜 실행.

### 이 패치의 PR

- #19 `dev(v0.50.1): anim fps + smooth slope + continuous map + 3-lives + X-modifier`
- next: `chore(release): v0.50.1 release notes`(이 PR 패밀리 — README 컨트롤 + phase2 brief Changelog 함께 갱신)
- next: `release(v0.50.1): patch quartile merge`(develop→main 머지)

### 트리뷰트 자세

모든 v0.50.1 변경은 v0.50 에서 도입된 오리지널 캐릭터(Reed Bramblestep, Mossplodder, Hummerwing) 에 적용. 추가된 메카닉 — 내부 랜드마크 멀티 스크린 스테이지, 목숨 + 체크포인트, 대시/점프 모디파이어, 애니메이션 fps 튜닝 — 은 보편적인 플랫포머 컨벤션이며 오리지널 아트와 오리지널 코드로 실행. 저작권 보호 자료의 재현 없음.

---

## v0.50 — Phase 2: Area 1 (4 라운드 + 슬로프 + 알→도끼 픽업 + Mossplodder/Hummerwing + 숲 패럴랙스)

**릴리즈:** 2026-05-09 (예정)
**태그:** `main` 의 `v0.50`
**Pages:** https://genishs.github.io/wonderboy/

두 번째 quartile 은 단일 테스트 스테이지에서 실제 Area→Round 구조와 클래식 플랫포머 페이싱으로 전환합니다. 캐스트가 재구성됨: Phase 1 의 Crawlspine / Glassmoth / Bristlecone Sapling 은 한걸음 물러나고 (스프라이트 모듈은 보존), Area 1 은 **Mossplodder**(느린 전진형 지면 크롤러) 와 **Hummerwing**(전진형 저고도 비행체) 을 도입합니다. Reed 는 이제 매 라운드 비무장으로 시작해 **dawn-husk** 알에 부딪쳐 **stone hatchet** 을 획득합니다.

### 플레이 가능한 것

- **Area 1 — "The Mossline Path"** — 멀티 스크린 스크롤 4 라운드 (1-1 ≈ 3 스크린 · 1-2 ≈ 4 · 1-3 ≈ 3 · 1-4 ≈ 4). 라운드 1-3 끝에 mile-marker, 1-4 끝에 boundary cairn 이 "Stage Cleared" 오버레이를 발화 (`The path continues — soon.` / `길은 이어진다 — 곧.`).
- **슬로프 기반 지형** — 부드러운 (22° 느낌) 과 가파른 (45°) 램프가 적층 플랫폼을 대체. Reed 의 발은 슬로프 프로필에 핀, 바위는 수평 차단, 점프 갭은 점프 가능.
- **알 → 도끼 픽업** — Reed 는 매 라운드 비무장 스폰. 한 스크린쯤 들어가면 `dawn-husk` 알이 지면에 있음, 부딪치면 깨지고 (3 프레임) hatchet 픽업이 스폰. 픽업 위를 지나면 무장 상태 (X 가 던지기). hatchet 궤적: 포물선, **튕김 없음**, 화면 ≤2 개, 첫 솔리드 접촉 시 despawn.
- **애니메이션 타일 렌더링** — `fire_low` 가 본 프로젝트의 첫 애니메이션 타일, 신규 `TileCache` 인프라 위에서 ~8 fps 로 깜빡임. design PR #15 의 contract 확장이 향후 애니메이션 타일을 동일한 `{frames, fps}` 형태로 지원.
- **3 레이어 SVG 패럴랙스 숲** — 하늘 (factor 0), 원경 능선 (0.3), 근경 잎 (0.7). 타일 아래 그려지며 카메라와 함께 스크롤.
- **Vitality + 1-hit-kill (v0.25.2 그대로)**. Z = 점프 (+ Space), X = 공격. mile-marker 접촉 시 fade-out / fade-in 라운드 전환 (총 60 프레임). Mossplodder + 불 = Mossplodder 사망. Mossplodder + Reed = Reed 사망. Hummerwing + Reed = Reed 사망.

### 엔진 추가/변경

- **신규 모듈**: `src/config/PhaseTwoTunables.js`, `src/graphics/TileCache.js`, `src/levels/StageManager.js`, `src/levels/area1/{round-1-1,round-1-2,round-1-3,round-1-4,index}.js`, `src/mechanics/{HatchetSystem,HuskSystem,Phase2EnemyAI,TriggerSystem}.js`.
- **수정**: `game.js` (Phase 2 와이어링), `src/levels/LevelManager.js` (StageManager 에 위임하는 신규 `loadAreaRound` 경로), `src/levels/TileMap.js` (slope/decoration/animated/trigger 타입 + 셀별 `slopeProfile`), `src/physics/CollisionSystem.js` (슬로프-인지 floor 핀 + decoration AABB), `src/graphics/Renderer.js` (TileCache 그리기, decoration 오버레이, 전환 페이드, stage-clear 오버레이, armed 상태 anim 선택), `src/graphics/ParallaxBackground.js` (3-SVG 숲), `src/mechanics/{HeroController,CombatSystem}.js` (armed/unarmed 상태, fire-tile 데미지, Mossplodder + fire 상호작용).
- **Phase 1 은퇴-보존**: `assets/sprites/{enemy-crawlspine,enemy-glassmoth,enemy-bristlecone-sapling,projectile-stoneflake}.js` 디스크 보존, `game.js` 액티브 Phase 2 경로에서는 로드되지 않음. `src/mechanics/{StoneflakeSystem,SeeddartSystem}.js` Phase 1 retro debug 로더용 보존.
- **CI 필수 파일 리스트** `.github/workflows/pr-feature-to-develop.yml` 에 신규 Phase 2 소스 파일 잠금.

### 알려진 제약/소소한 이슈 (v0.75 백로그)

- `slope_up_22` 횡단은 **계단형** 등반 (12 px 수평 이동마다 12 px 계단 단차) — 가독성은 OK 이나 실크처럼 부드럽지는 않음. `src/physics/CollisionSystem.js` 에 v0.50 의도된 트레이드오프로 문서화; 진짜 22° (픽셀당 램프) 는 v0.75 에서 재방문.
- Round 1-3 의 3 타일 갭 (col 6-8) 이 Reed 의 최대 점프 거리 한계에 위치; 플레이테스트가 빡빡하다고 보고하면 `HERO.jumpVy0` 튜너블이 노브.
- 라운드 전환은 페이드만 — "Round 1-2" 텍스트 카드 없음. v0.50 최소 동작에 의도. UI 폴리시는 v0.75.
- Hummerwing 사체가 실제 그 위치 바로 아래의 지면 타일이 아닌 레벨-행 경계까지 떨어짐 (cosmetic — 갭 위에서 죽었을 때만 가장 보임).
- `PhysicsEngine.update` 가 Phase 2 모드에서도 매 틱 실행되지만 모든 엔티티 타입에서 no-op (Phase 1 hero, axe projectile, patrol enemy). CPU 비용 무시 가능; 두는 게 안전.
- Stage Clear 는 종착 — 새로고침 재시도. continue/restart 는 v0.75 메카닉 작업으로 연기.
- **개발 중 in-browser smoke 미실행**: 워크스테이션에 Node / `npx serve` 부재. 정적 검사 (paren/brace 균형, import 해소, 매트릭스 차원 검증) 모두 그린; CI 의 `node --check` 가 파싱 에러 커버. 라이브 URL 이 첫 진짜 실행.

### 이 quartile 의 PR

- #14 `story(phase2): Area 1 + cast revision — 4 rounds, snail+bee, egg+axe, forest+rock+fire (EN+KO)`
- #15 `design(phase2): assets — Reed armed + 2 enemies + egg + hatchet + Area 1 tiles + parallax`
- #16 `dev(phase2): Area 1 — 4 rounds, slopes, egg/axe pickup, Mossplodder + Hummerwing, parallax forest`
- next: `chore(release): v0.50 release notes` (이 PR 패밀리)
- next: `release(v0.50): Phase 2 quartile merge` (develop→main 머지)

### 트리뷰트 자세

v0.50 의 모든 아트·오디오·이름·세계관·코드는 본 프로젝트 자체 제작 오리지널. Mossplodder, Hummerwing, dawn-husk, stone hatchet, mile-marker, boundary cairn, "The Mossline Path" 모두 본 작업을 위해 창안. 일반적인 플랫포머 메카닉 (4-라운드 스테이지, 슬로프 지형, 아이템 픽업, 던지는 도끼, 달팽이형 + 벌형 적, 숲 테마 + 바위/불 장애물) 은 보편적이며, 오리지널 실행이 트리뷰트 자세를 보존.

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

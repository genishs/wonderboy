# Phase 2 — 캐스트 개정 (v0.50)

> **저자 에이전트:** story-lead
> **소비자:** design-lead, dev-lead
> **리뷰어:** release-master
> **연관 문서:** `docs/briefs/phase2-areas.md`, `docs/briefs/phase1-cast.md` (마감), `docs/story/world.md`
> **English version:** [phase2-cast-revision.md](./phase2-cast-revision.md)

본 브리프는 v0.50 작업을 위해 Phase 1 의 전투 캐스트를 대체한다. Reed Bramblestep 의
정체성과 실루엣은 변하지 않지만, **매 라운드 어떻게 무장하는지**와 **그가 가로지르는
세계에 누가 걸어 다니는지**가 달라진다. Phase 1 의 정지형/공중형 아키타입은 액티브
게임플레이에서 은퇴하며(§10), v0.50 은 **전진 전용 두 가지 단순 적**과 환경 오브젝트
(달걀, 도끼, 바위, 불, mile-marker, cairn) 로 구성된다.

> **트리뷰트이지 포팅이 아니다.** 본 브리프의 모든 이름과 실루엣은 오리지널이다.
> 두 신규 적은 보편적인 "지상 기는 적"과 "낮게 나는 적"의 읽힘을 환기하지만,
> 이름·팔레트·애니메이션 단서는 모두 본 프로젝트를 위해 새로 창안되었다.

---

## 1. Phase 1 이후 변경된 부분

| 항목                  | Phase 1 (v0.25.x)                              | Phase 2 (v0.50)                                          |
|-----------------------|------------------------------------------------|----------------------------------------------------------|
| 스폰 시 무기          | 항상 무장 (stoneflake)                         | **비무장.** 라운드 중간에 깨지는 **dawn-husk**(달걀)에서 **stone hatchet** 획득 |
| 영웅 발사체           | Stoneflake — 물수제비 호, 한 번 튕김, 화면당 2개 한도 | **Stone hatchet** — 오버핸드 포물선, 튕김 없음, 화면당 2개 한도 |
| 액티브 적             | Crawlspine, Glassmoth, Bristlecone Sapling     | **Mossplodder**(크롤러), **Hummerwing**(플라이어). Phase 1 3 종 은퇴하되 보존(§10) |
| 적 AI                 | 가장자리 회전, 사인 드리프트+스웁, 타이머 발사 | **전진 전용.** 회전·스웁·발사체 없음                     |
| 정적 장애물           | 없음                                            | **바위**(차단, 데미지 없음), **불**(1-hit-kill)         |
| 스테이지 흐름         | 단일 32×12 평지 테스트 스테이지                | 멀티 스크린 스크롤 라운드 (`phase2-areas.md`)            |
| 라운드 종료           | n/a                                            | **Mile-marker**(라운드 1–3), **boundary cairn**(라운드 4) |
| 영웅 라이프라인       | Vitality, 1-hit-kill, iframes 없음             | **변경 없음.**                                            |
| 컨트롤                | Z = 점프, X = 공격 (Space 대체)                | **변경 없음.**                                            |

**두 가지 디자인 의도가 본 개정을 이끈다:** (1) 스테이지는 아레나가 아닌 여정처럼
느껴져야 한다 — 전진 전용 적 + 슬로프 지형이 합쳐지면 플레이어는 땅을 *건너가는
무엇*으로 읽는다; (2) 무기 획득은 라운드 안의 작은 보상처럼 느껴져야 한다 —
비무장으로 스폰한 뒤 한 화면쯤 들어가서 달걀을 깨도록 하면 첫 화면은 신중한-걷기,
이후는 액션이 된다.

---

## 2. 영웅 — Reed Bramblestep (개정)

정체성, 실루엣, 컬러-무드, walk/jump/idle/dead 애니메이션, 이동 FSM 은 **Phase 1 §2
와 동일**. 본 절은 신규 **무장/비무장** 상태와 개정된 던지기 자세만 다룬다.

### 2.1 무장/비무장 상태

- **비무장 Reed** — 양손 자유. 매 라운드 시작 스폰 자세. 실루엣은 분명히 *맨손*으로
  읽힌다. 취약하지만 무력하지는 않다 — 점프·회피 가능, 단지 죽일 수 없을 뿐이다.
- **무장 Reed** — 던지는 손에 stone hatchet 을 낮게 약간 뒤로 잡는다. `idle` 에서
  허리 옆에, `walk` 에서 후행 다리와 반대 위상으로 흔들리며, `jump_rising`/
  `jump_falling` 에서 몸통에 단단히 고정. 읽힘: *한 손에 무게가 있는 모습*.

무장 상태는 라운드당 정확히 한 번, Reed 가 달걀에 접촉할 때 획득된다(§5). 중간
"줍는" 자세는 없다 — 달걀이 빠르게 부서지면서 Reed 가 이미 무장한 채로 걸어 나온다.

### 2.2 던지기 자세 — 오버핸드 도끼질

Phase 1 의 `attack` 은 옆-팔 자갈 플릭이었다. Phase 2 의 도끼 던지기는 더 결정적인
**오버핸드 도끼질**. 3 오버레이 프레임:

1. **윈드업** — 도끼를 어깨 위로, 무게 뒤로, 머리는 앞으로 약간 기울임.
2. **릴리즈** — 팔이 머리 높이에서 앞으로 완전히 뻗어지고, 도끼가 막 손을 떠남.
3. **회복** — 팔이 몸을 따라 다시 풀림.

던지기는 여전히 이동을 잠그지 **않는다**. Walk-throw, jump-throw 둘 다 작동.

### 2.3 애니메이션 단서 — 추가분만

| 상태           | 프레임 | 비무장 대비 변화                                                            |
|----------------|-------:|-----------------------------------------------------------------------------|
| `idle_armed`   |      3 | 동일 호흡 사이클; 3 프레임 모두 도끼를 허리에 잡음.                         |
| `walk_armed`   |      4 | 동일 보행 사이클; 도끼는 후행 다리와 반대 위상으로 흔들림.                  |
| `jump_armed`   |      2 | `jump_rising/falling` 동일; 도끼는 몸통에 단단히 고정.                     |
| `attack`       |      3 | Phase 1 옆-팔 대체. §2.2 참조.                                              |

Design 은 비무장/무장 사이에 본체 프레임을 공유하고 들고 있는 도구 레이어만 교체할
수 있다.

### 2.4 피격 반응 — 변경 없음

v0.25.2 의 1-hit-kill 그대로. Iframes 없음, 넉백 없음, hurt 오버레이 없음. Death
FSM 변경 없음.

### 2.5 무장 상태로 사망

Reed 가 무장 상태로 사망하면 도끼는 리스폰으로 **이어지지 않는다** — v0.50 게임
오버는 종료성. (continue/restart 가 후속에 들어오면: 라운드 시작에서 비무장
리스폰.) §11 Q3 에서 플래그.

---

## 3. 크롤러형 적 — **Mossplodder**

자라난 껍데기 한 덩어리, 허리 높이, 땅에 낮게 깔린 채 끊임없이 앞으로 굴러간다.
원래는 다리가 있던 무엇이지만, 이제 대부분 *이끼*다. **위협 격자의 바닥**:
회전·점프 불가, 절벽 너머로 그대로 걸어 떨어진다.

### 3.1 실루엣 의도

대략 한 타일 폭, 4 분의 3 타일 높이 — Phase 1 Crawlspine 보다 의도적으로 약간 크다.
이유는 Mossplodder 가 시야의 *지형 읽기 앵커*이기 때문. 멀리서: 부드러운 마운드가
천천히 물결침. 가까이에서: 얇은 능선 껍데기, 선두 가장자리에서 뒤로 흐르는 이끼
가닥, 지면 가까이의 창백한 배 솔기. **눈 없음.** 위협 읽힘은 전진 운동에서만 —
절대 "지켜본다"가 아니다. 비대칭 껍데기(선두 쪽 더 높은 돔, 후행 쪽 긴 슬로프)로
idle 프레임에서도 "운동 중"으로 읽힌다.

### 3.2 이동 FSM

상태: `walk`, `dead`. **`turn` 없음. `hurt` 없음.**

- **가장자리 감지 없음.** 절벽에서 떨어짐; 카메라 바닥에서 ~2 타일 아래 despawn.
- **벽-회전 없음.** 바위/솔리드 타일에 닿으면 vx 0, plodding-in-place 애니메이션
  계속. (기능: 바위가 Mossplodder 트랩이 되어 레벨 안무에 활용.)
- **페이싱 플립 없음.** 평생 스폰 방향으로 이동. `phase2-areas.md` 의 기본은
  **좌향**(Reed 를 향함).

### 3.3 공격 패턴 — 접촉만

순수 접촉 데미지. `walk` 상태의 Mossplodder 에 닿으면 런 종료. `dead` 의 시체는
무해하며 ~30 프레임 안에 페이드.

### 3.4 피격 반응 — 즉시

- 도끼 한 번에 사망. 도끼 접촉 프레임이 곧 사망 프레임 — flash-then-die 없음.
  사망 시: 껍데기가 균형을 잃고 앞으로 기울고, 이끼 가닥이 흩날리고, ~30 프레임
  동안 페이드. 접촉 지점의 작은 **먼지 퍼프 VFX** 만이 유일한 강조.
- 사운드 무드: 부드러운 *툭-그리고-바스락* — 잎사귀 아래 젖은 나무.

### 3.5 컬러-무드 키워드

`shell-loam` · `moss-green` · `wet-bark-brown` · `cuff-cream` (배 솔기 하이라이트)

### 3.6 애니메이션 단서

| 상태   | 프레임 | 프레임 간 변화                                                              |
|--------|-------:|-----------------------------------------------------------------------------|
| `walk` |      4 | 껍데기 물결: 전면-상승 / 통과 / 후면-상승 / 정착. 이끼 가닥은 본체 사이클보다 한 프레임 뒤. |
| `dead` |      3 | (1) 앞으로 기울며 균형 상실, (2) 껍데기 평평 / 이끼 펼쳐짐, (3) 페이드 아웃 |

(`turn`, `hurt`, `idle` 없음. `walk` 는 `vx != 0` 동안 연속; 벽 접촉 시 1 번 프레임
유지.)

### 3.7 추천 튜너블

| 파라미터                | 시작 추천값 | 단위     | 노트                                  |
|-------------------------|------------:|----------|----------------------------------------|
| `mossplodder.walkSpeed` |         0.7 | px/frame | Phase 1 Crawlspine 보다 느림.          |
| `mossplodder.contactDmg`|        kill | n/a      | 접촉 시 1-hit-kill.                    |
| `mossplodder.deathFrames`|         30 | frames   |                                        |
| `mossplodder.gravity`   |        0.55 | px/frame²| 영웅과 동일 — 절벽에서 정상적으로 떨어짐.|

---

## 4. 플라이어형 적 — **Hummerwing**

햇볕에 데워진 비행체, 주먹 크기, 고정 고도에서 앞으로 드리프트한다. Phase 1
Glassmoth 가 스웁을 가르쳤다면, Hummerwing 은 **고도-읽고-숙이기**를 가르친다:
비행 경로에서 절대 벗어나지 않지만, 정확히 잘못된 높이 — 달리는 소년의 가슴
높이 — 로 순항한다.

### 4.1 실루엣 의도

둥근 흉부와 짧고 빠르게 떨리는 두 날개, 부드러운 호박색 언더글로우. 4 분의 3 타일
폭, 절반 타일 높이. 날개는 반투명 타원으로 흐려진다(밝은 하늘에서도 가독되도록 안쪽
하이라이트 1 픽셀). 멀리서: *모자챙 높이로 앞으로 드리프트하는 작고 따뜻한 점*.
**목적성 있음, 포식적이지 않음** — 사냥하지 않고 출퇴근. 위협은 그가 차선을 가로
지를 때 플레이어가 선택하는 처리에 있다.

### 4.2 이동 FSM

상태: `drift`, `dead`. **`swoop` 없음. `hurt` 없음. 고도 변경 없음.**

- 스폰 방향으로 **vx 일정**; 페이싱 플립 없음.
- **스웁 없음.** 수직 위치는 `driftAltitude` 주변의 작은 사인 보브. 장식적 — 히트
  박스 하단이 서 있는 Reed 의 가슴 높이(바닥에서 ~1 타일 위)에 머무르도록 클램프.
- **플레이어 감지 없음.** Reed 위치와 무관하게 동일 드리프트.
- **공중 벽 충돌 없음.** 바위는 지면, 플라이어 경로는 그 위.

### 4.3 공격 패턴 — 접촉만

순수 접촉 데미지. 발사체 없음, 다이브 없음. Hummerwing 에 닿으면 런 종료.

### 4.4 피격 반응 — 즉시

- 도끼 한 번에 사망. 사망 시: 날개 멈춤, 본체가 영웅-중력으로 지면까지 **떨어지고**,
  충돌 시 페이드. ~30 프레임. 플레이어가 "내가 떨어뜨렸다"를 느껴야 한다.
- 사운드 무드: 적중 시 작은 *딱*, 그리고 지면 충돌 시 *플프*.

### 4.5 컬러-무드 키워드

`sunwarm-amber` · `wing-haze` · `velvet-shadow` · `dust-pink` (하이라이트)

Hummerwing 은 차가운 숲 패럴랙스에 살짝 따뜻하게 튀어야 한다 — 깔끔한 한 발에 대한
보상은 *따뜻한 불꽃이 차갑게 떨어지는* 대조 프레임.

### 4.6 애니메이션 단서

| 상태    | 프레임 | 프레임 간 변화                                                              |
|---------|-------:|-----------------------------------------------------------------------------|
| `drift` |      2 | 날개 블러 사이클(1 위로-블러, 2 아래로-블러). 본체는 애니메이션이 아닌 Dev 코드의 사인 보브로 이동. |
| `dead`  |      3 | (1) 날개 멈춤 / 본체 기울어짐; (2) 낙하 중, 본체 직립; (3) 지면 충돌, 페이드. |

### 4.7 추천 튜너블

| 파라미터                    | 시작 추천값 | 단위     | 노트                                          |
|-----------------------------|------------:|----------|-----------------------------------------------|
| `hummerwing.driftVx`        |         1.4 | px/frame | 스폰 방향으로 일정.                           |
| `hummerwing.driftAltitude`  |          96 | px       | 로컬 바닥 위 ~2 타일 — 가슴 높이.             |
| `hummerwing.bobAmplitude`   |          10 | px       |                                               |
| `hummerwing.bobFrequency`   |        0.05 | rad/frm  |                                               |
| `hummerwing.contactDmg`     |        kill | n/a      |                                               |
| `hummerwing.deathFrames`    |          30 | frames   |                                               |
| `hummerwing.gravity`        |        0.55 | px/frame²| 사망 후에만 사용 (본체 낙하).                 |

---

## 5. 달걀 픽업 — **dawn-husk**

Reed 의 머리 크기쯤 되는 작은 타원형, 매 라운드 약 한 화면쯤 들어간 지점에 지면에
놓여 있다(배치는 `phase2-areas.md`). 강가 자갈처럼 점박이, 동쪽 면에 희미한 발광.
Reed 가 부딪히면 깨지고 같은 프레임에 도끼가 그의 손에 등장.

> 기능적으로: **첫 접촉에서 무기가 되는 컨테이너 아이템.**

### 5.1 시각적 의도

살짝 더 무거운 베이스의 타원 — *지면에 놓여 있고*, 떠 있지 않다. 두 톤 점박이
(`shell-loam`/`dawn-amber` 베이스 + 드문 더 어두운 점). 동쪽 호의 희미한 dawn-rim
이 낮은 대비에서도 실루엣을 분명히 한다. 정지 상태는 한 프레임이면 충분.

### 5.2 깨짐 애니메이션 — 3 프레임, ~12 프레임 길이

| 프레임 | 무엇이 일어나는가                                                              |
|------:|--------------------------------------------------------------------------------|
|     1 | 균열 — husk 를 가로질러 대각선 균열이 열림. 본체는 아직 온전.                  |
|     2 | 반쪽이 살짝 분리; 사이로 `dawn-amber` 섬광.                                    |
|     3 | 반쪽이 무너지고 페이드; **stone hatchet** 이 이제 Reed 의 손에. Husk 반쪽은 지속되지 않음. |

도끼는 프레임 2 와 3 사이에 자유 픽업 아이템으로 **존재하지 않는다**. 접촉 = 무장.
흐름이 깔끔(지면에 놓인 도끼 엔티티 없음).

### 5.3 애니메이션 단서

| 상태    | 프레임 | 변화                                                                           |
|---------|-------:|--------------------------------------------------------------------------------|
| `rest`  |      1 | 정적 (Design 이 여유가 있다면 2 프레임 느린 반짝임 추가 가능)                 |
| `break` |      3 | §5.2 참조                                                                       |

### 5.4 거동 요약

- 공격 불가; 도끼는 아직 존재하지 않음. 무해.
- Reed 접촉만 깨짐 트리거 — Mossplodder 는 통과. (작성 규칙: 플레이어가 도달하기
  전에 달걀을 가로지르는 경로에 적을 스폰하지 말라. `phase2-areas.md` 참조.)
- 한 번 깨지면 그 라운드에서 사라짐. 재시작 시 리스폰은 오픈(§11 Q2).

### 5.5 추천 튜너블

| 파라미터              | 시작 추천값 | 단위     | 노트                                |
|-----------------------|------------:|----------|--------------------------------------|
| `egg.breakFrames`     |          12 | frames   | 깨짐과 무장 합산 길이.               |
| `egg.shimmerFps`      |           2 | fps      | Design 이 2 프레임 반짝임을 구현한다면. |

---

## 6. 영웅 발사체 — **stone hatchet**

자루가 짧고 모서리가 떨어진 돌도끼, 폭은 절반 타일쯤. Stoneflake 가 *물수제비
자갈*이었다면, 도끼는 **결정적인 오버핸드 던지기** — 더 무거운 호, 튕김 없음, 한 번
떨어지면 끝.

### 6.1 실루엣 의도

쐐기 머리에 천을 감은 손잡이. 이 크기에서: 그저 *회전하는 도끼 형태*. Stoneflake
실루엣보다 분명히 크고 위협적이지만 화면을 어지럽히지 않는다.

### 6.2 궤적 — 오버핸드 포물선

- 초기 속도: 전방(영웅 페이싱) + 약간 위 — Stoneflake 보다 낮은 각도이지만 **더 높은
  중력**으로 깔끔하게 떨어짐.
- **튕김 없음.** 첫 지면/벽 접촉 = despawn (퍼프). 첫 적 접촉 = 적 사망, 도끼
  despawn.
- 사거리: 스폰 라인 아래로 떨어지기 전 ~6-7 타일. Stoneflake 는 튕겼고, 도끼는
  **commit**. 비행 중 회전: 빠른 fps(~16) 로 2 프레임.

의도적으로 stoneflake 보다 덜 관용적. Phase 1 은 Crawlspine 너머로 자갈 스킵 스팸을
허용; Phase 2 는 전진하는 Mossplodder 에 던지기를 commit, 빗나가고, 비용을 느끼기를
원한다.

### 6.3 애니메이션 단서

| 상태     | 프레임 | 프레임 간 변화                                                          |
|----------|-------:|-------------------------------------------------------------------------|
| `fly`    |      2 | 회전: 머리-위 / 머리-아래. 블러 읽힘을 위해 빠른 fps 로 재생.          |
| `splash` |      2 | (1) 접촉 지점 임팩트 퍼프, (2) 퍼프 소멸. 모든 despawn 시 재생.        |

### 6.4 쿨다운과 한도

**최대 도끼 2 개**(Phase 1 과 동일 한도). `attackCooldown` ~12 프레임(Phase 1 의
10 보다 약간 느려 더 무거운 느낌과 일치). 쿨다운은 이동을 잠그지 **않는다**.

### 6.5 데미지

Mossplodder 와 Hummerwing 에 1-hit-kill.

### 6.6 추천 튜너블

| 파라미터                   | 시작 추천값 | 단위       | 노트                                   |
|----------------------------|------------:|------------|----------------------------------------|
| `hatchet.vx0`              |         6.5 | px/frame   | 방향 = 영웅 페이싱.                    |
| `hatchet.vy0`              |        -3.5 | px/frame   | Stoneflake 보다 큰 초기 상승.          |
| `hatchet.gravity`          |        0.55 | px/frame²  | 영웅과 동일 — 깔끔한 포물선.           |
| `hatchet.maxOnScreen`      |           2 | count      |                                        |
| `hatchet.lifetimeMax`      |         100 | frames     | 하드 캡 (~1.7 s).                      |
| `hatchet.attackCooldown`   |          12 | frames     |                                        |
| `hatchet.spinFps`          |          16 | fps        |                                        |

> **dev-lead 참고:** Phase 1 `stoneflake` 데이터 경로를 substrate 로 재사용 가능;
> 튕김 로직과 튜너블만 다르다. `projectile.type === 'hatchet'` 을 `'stoneflake'`
> 와 구분 유지하길 권장 — 후속 Area 가 충돌 없이 무기 픽업을 섞을 수 있도록.

---

## 7. 바위 장애물

Reed 길에 놓인 허리 높이 돌덩어리. **수평 이동 차단; 데미지 없음.** Reed 는 멈추거나
뛰어넘거나, 부딪힌 Mossplodder 를 가두는 데 사용 가능.

- **시각:** 날씨로 둥글려진 바위, 베이스가 윗부분보다 넓고, 그늘진 면에 작은 이끼
  자국. 절반 타일에서 한 타일 높이. *지형의 일부*처럼 읽힘 — 배치된 장애물이 아닌.
- **거동:** Reed 와 Mossplodder 모두에게 솔리드. Hummerwing 은 위로 드리프트
  (바위는 짧고, 플라이어 고도는 그 위). 도끼는 부딪혀 despawn(벽 접촉으로 카운트).
  데미지 없음.
- **타일 vs. 엔티티:** **타일.** Area 1 타일셋에 구현. 타일 이름 추천: `rock_small`,
  `rock_large`. 정적; 애니메이션 없음. 튜너블 없음.

---

## 8. 불 장애물

지면 위 낮은 불꽃 패치. **접촉 시 1-hit-kill.** 위치 고정; 가시적으로 **애니메이션**
되어 플레이어가 "*지금* 위험하다, 장식이 아니다"를 읽게 한다.

- **시각:** 낮게 춤추는 불꽃, 세 개나 네 개의 불꽃 혀, 베이스 `dawn-amber`, 끝
  `pale-gold`, 연기 컬 `velvet-shadow`. 절반 타일 높이, 한 타일 폭 풋프린트.
  `docs/story/world.md` 에 따라 **순수 검정 금지** — 불꽃의 그림자조차 보라색이다.
  월드 픽션은 "유적지가 반쯤 졸면서 자기들이 보관하던 곳에서 불을 흘린다"를 허용 —
  Design 이 각 불꽃 패치 아래에 희미한 시질-글로우를 추가할 수 있음(옵션).
- **거동:** Reed 접촉 시 상태 무관 1-hit-kill. Mossplodder 가 불 안으로 걸어 들어
  가면 **즉시 사망**(Mossplodder `dead` 재사용). 유용한 전술 도구. Hummerwing 은
  불 위로 드리프트 — 영향 없음(고도가 불꽃 끝보다 위). 도끼는 무해하게 통과.
- **타일 vs. 엔티티:** **애니메이션 타일**(선호), 엔티티(폴백). 가장 깔끔한 데이터
  홈은 "애니메이션 타일"이지만, 이는 `docs/design/contracts.md` 가 타일이 애니메이션
  트랙을 선언하도록 허용해야 한다. 결정은 §11 Q1 에서 플래그. 타일 이름 추천:
  `fire_low`.

### 8.1 애니메이션 단서

| 상태     | 프레임 | 프레임 간 변화                                                       |
|----------|-------:|----------------------------------------------------------------------|
| `flicker`|      4 | 불꽃 혀 사이클: 낮음 / 좌향-기울임 / 높음 / 우향-기울임. ~6 fps. 루프; 절대 꺼지거나 점등되지 않음. |

### 8.2 추천 튜너블

| 파라미터              | 시작 추천값 | 단위     | 노트                                |
|-----------------------|------------:|----------|--------------------------------------|
| `fire.flickerFps`     |           6 | fps      |                                      |
| `fire.contactDmg`     |        kill | n/a      | 모든 상태에서 1-hit-kill.           |

---

## 9. Mile-marker (라운드 전환) 와 boundary cairn (스테이지 클리어)

구조적으로 유사한 두 트리거 오브젝트: 라운드 1, 2, 3 끝의 **수직 표주**, 라운드 4
끝의 **돌탑**. Reed 가 히트박스에 들어서면 시스템이 전환 발화. 전투 상호작용 없음;
데미지 없음.

### 9.1 Mile-marker

Reed 가슴 높이의 풍화된 나무 표주, 위쪽 가로목에 양식화된 노치 새김으로 라운드
번호 표시(숫자 또는 노치 — §11 Q4 에서 플래그). 라운드의 가장 오른쪽 타일 열,
바닥 위에 선다.

- 약 한 타일 높이. 베이스 더 넓음. `wet-bark-brown` 표주, `cuff-cream` 가로목,
  `dawn-amber` 숫자 노치. *여행자가 만질 만한 것*으로 읽힘 — 위협이 아닌.
- Reed 접촉 시 페이드-투-블랙 + 라운드 번호 오버레이 + 다음 라운드 로드 트리거
  (`phase2-areas.md` §3.1). 일회용.
- **엔티티로 구현**(라운드당 하나), 작은 트리거 히트박스.

| 상태    | 프레임 | 변화                                                                        |
|---------|-------:|-----------------------------------------------------------------------------|
| `idle`  |      2 | 부드러운 2 프레임 산들바람: 가로목이 ±1 px 기울어짐. 느림(~2 fps).         |
| `pulse` |      3 | (1) 표준, (2) 따뜻한 글로우, (3) 표준. Reed 의 접근(히트박스 ~2 타일 전)에 재생. 옵션 플로리시. |

### 9.2 Boundary cairn

허리 높이의 강가 돌 세 개를 쌓은 것, 맨 위 돌에 작은 새김 시질. 라운드 4 끝에서만
mile-marker 를 대체.

- 약 한 타일 높이, 한 타일 폭 풋프린트. `river-stone-grey` 베이스 돌(돌마다 약간씩
  다른 톤), `dawn-amber` 시질 돌, `velvet-shadow` 라인. mile-marker 보다 *더
  영구적*으로 읽힘 — 운반된 것이 아닌 만들어진 것.
- Reed 접촉 시 스테이지 클리어 의식 발화(`phase2-areas.md` §3.2). 일회용.
- **엔티티로 구현**(Area 당 하나).

| 상태    | 프레임 | 변화                                                                        |
|---------|-------:|-----------------------------------------------------------------------------|
| `idle`  |      2 | 시질 돌이 부드럽게 맥동. ~1 fps.                                            |
| `clear` |      4 | (1) 표준, (2) 시질 플레어, (3) 풀-글로우, (4) 정착. 접촉 시 오버레이 전 재생. |

---

## 10. 캐스트 은퇴 노트 (Phase 1 3 종)

Crawlspine, Glassmoth, Bristlecone Sapling 은 **v0.50 액티브 게임플레이에서 은퇴**.
스프라이트 모듈(`assets/sprites/enemy-crawlspine.js`, `enemy-glassmoth.js`,
`enemy-sapling.js`, `proj-seeddart.js`)은 후속 Area 의 보존 재료로 **저장소에 남는다**
— 기계적으로 너무 흥미로워서 버릴 수 없다. Stoneflake 발사체(`proj-stoneflake.js`)도
액티브 게임플레이에서 은퇴; 스프라이트 유지.

v0.50 에 한해서:

- Phase 1 3 종은 Area 1 의 어떤 라운드에도 스폰되지 **않는다**.
- `LevelManager` 는 Area 1 라운드 데이터에서 Phase 1 적 타입을 참조하지 않아야 한다.
- `PhaseOneTunables.js` 의 Crawlspine/Glassmoth/Sapling/Seeddart 블록은 저장소에
  유지(정리가 필요하다면 손볼 수 있음); v0.50 시스템은 그것들을 읽지 않는다.
- Phase 1 스프라이트 모듈은 후속 Area 가 임포트 경로를 다시 배선하지 않도록
  `SpriteCache` 에 와이어된 채 유지하는 것이 SHOULD. (지연 로딩 여부는 Dev 결정.)

후속 Area 가 3 종(또는 stoneflake) 중 하나를 부활시키고자 한다면, 자체 Phase 3+
브리프를 열어라.

---

## 11. For Design

v0.50 의 구체적 자산 목록. 크기는 *캔버스 내 목표 치수*; 캔버스 논리 해상도는
`TILE = 48` 의 768 × 576. 모든 스프라이트 모듈은 `docs/design/contracts.md` 를 따른다.

| 자산                                | 경로                                  | 프레임 크기 (w × h) | 앵커 (px, top-left)   | 애니메이션                                                    |
|-------------------------------------|---------------------------------------|---------------------|-----------------------|---------------------------------------------------------------|
| Hero — Reed armed overlay           | `assets/sprites/hero-reed.js` (확장) | 36 × 48             | (18, 47) — 발 중앙   | `idle_armed:3, walk_armed:4, jump_armed:2, attack:3` (기존 `attack` 대체) |
| Stone hatchet                       | `assets/sprites/proj-hatchet.js`      | 16 × 16             | (8, 8) — 중앙        | `fly:2, splash:2`                                             |
| Enemy — Mossplodder                 | `assets/sprites/enemy-mossplodder.js` | 48 × 36             | (24, 35) — 발 중앙   | `walk:4, dead:3`                                              |
| Enemy — Hummerwing                  | `assets/sprites/enemy-hummerwing.js`  | 36 × 24             | (18, 12) — 본체 중앙 | `drift:2, dead:3`                                             |
| Pickup — dawn-husk                  | `assets/sprites/item-dawnhusk.js`     | 24 × 24             | (12, 23) — 베이스 중앙| `rest:1, break:3`                                             |
| Trigger — mile-marker               | `assets/sprites/marker-mile.js`       | 36 × 48             | (18, 47) — 베이스 중앙| `idle:2, pulse:3`                                             |
| Trigger — boundary cairn            | `assets/sprites/marker-cairn.js`      | 48 × 48             | (24, 47) — 베이스 중앙| `idle:2, clear:4`                                             |
| Tile — Area 1 ground / slopes       | `assets/tiles/area1.js`               | 타일당 48 × 48      | n/a                   | 정적; 슬로프 변형 — `phase2-areas.md` §2.1 참조               |
| Tile — rock obstacle                | (`area1.js` 내 `rock_small`/`rock_large`) | 48 × 48 / 48 × 96 | n/a                   | 정적                                                           |
| Tile — fire obstacle                | (`area1.js` 내 `fire_low`)            | 48 × 48             | n/a                   | `flicker:4` — 애니메이션 타일 (§8 폴백)                       |
| Background — Area 1 sky             | `assets/bg/area1-sky.svg`             | full-canvas SVG     | n/a                   | 정적 패럴랙스 레이어 0 (가장 느림)                             |
| Background — Area 1 trees           | `assets/bg/area1-trees.svg`           | 타일러블 SVG        | n/a                   | 패럴랙스 레이어 1                                              |
| Background — Area 1 fore-foliage    | `assets/bg/area1-fore.svg`            | 타일러블 SVG        | n/a                   | 패럴랙스 레이어 2 (가장 빠름)                                  |

**엔티티별 팔레트 가이드**(Design 이 hex 결정):

- **Reed armed:** 도끼 머리/그립용 `chip-stone-grey` 와 `cloth-wrap-tan` 추가; Phase 1 팔레트는 그 외 변경 없음.
- **Mossplodder:** `shell-loam`, `moss-green`, `wet-bark-brown`, `cuff-cream`(배 솔기), `velvet-shadow`.
- **Hummerwing:** `sunwarm-amber`(본체), `wing-haze`(반투명 — 계약상 8 자리 알파 hex), `dust-pink`(하이라이트), `velvet-shadow`(1px 외곽선).
- **Dawn-husk:** `shell-loam`(베이스), `dawn-amber`(rim 글로우), `cuff-cream`(점박이 하이라이트), `wet-bark-brown`(그림자).
- **Stone hatchet:** `chip-stone-grey`(머리), `cloth-wrap-tan`(그립), `velvet-shadow`(라인).
- **Mile-marker:** `wet-bark-brown`(표주), `cuff-cream`(가로목), `dawn-amber`(숫자 노치).
- **Boundary cairn:** `river-stone-grey`(세 가지 톤 변주), `dawn-amber`(시질 돌), `velvet-shadow`.
- **Fire:** `dawn-amber`(베이스), `pale-gold`(혀 끝), `velvet-shadow`(연기 컬). **순수 검정 금지.**
- **Area 1 tileset:** `loam-soil`, `moss-green`, `wet-bark-brown`, `dawn-amber`(뿌리 하이라이트), `velvet-shadow`.
- **Background:** 패럴랙스에서 차가운 녹이 지배; `morning-haze` 와 `dawn-amber` 가 하늘을 따뜻하게; 전경 포일리지 레이어는 약간 보라색.

**노트:** Phase 1 의 앵커 컨벤션 변경 없음(지면 엔티티와 트리거는 발-중앙; 공중과
발사체는 본체-중앙). 순수 검정 잉크 금지. Hummerwing 날개는 부분-알파 팔레트
인덱스로부터 이득. Phase 2 적 `hurt` 프레임 불필요(1-hit-kill, 플래시 없음).

---

## 12. For Dev

### 12.1 ECS 컴포넌트 — Phase 2 추가분

```js
// 기존 'player' — armed 플래그 추가:
player: {
  facingRight, isJumping,
  attackCooldown, coyoteTimer, jumpBuffer,   // Phase 1 필드 (post-v0.25.2 cleanup)
  armed,           // Phase 2: 라운드 시작 시 false, 달걀 픽업 후 true
}

// 기존 'enemy' — 재사용; type 필드는 새 값을 받음:
enemy: {
  type,        // 'mossplodder' | 'hummerwing'  (Phase 1 타입은 보존 스프라이트용으로 유효)
  dir,         // -1 | 1; 스폰에서 잠금; v0.50 에서 플립 없음
  ai,          // 'walk' | 'drift' | 'dead'
  hp, hpMax,   // Phase 2 에서 사용 안 함 — 하위호환을 위해 존재
  stateTimer,  // 'dead' 상태에서 despawn 까지 남은 프레임
  cooldown,    // 사용 안 함
}

// 기존 'projectile' — 재사용; 새 타입:
projectile: {
  type,        // 'hatchet'  (Phase 1 타입은 보존용으로 유효)
  lifetime,
  bouncesLeft, // hatchet 은 0
  ownerKind,   // 'hero'
  damage,      // 'kill'
}

// 새 'pickup' (Phase 2):
pickup: { type, state, stateTimer }   // type: 'dawn-husk'; state: 'rest' | 'break'

// 새 'trigger' (Phase 2):
trigger: { kind, roundIndex, consumed }
// kind: 'mile-marker' | 'boundary-cairn'; roundIndex: marker 는 1|2|3, cairn 은 n/a

// 새 'obstacle' (불이 엔티티로 출시되는 경우만 — §8 참조):
obstacle: { kind, contactDmg }   // kind: 'fire'; contactDmg: 'kill'
```

### 12.2 구현할 FSM

- **Hero:** Phase 1 FSM 변경 없음. `player.armed` boolean 추가. Renderer 가 armed
  플래그에 따라 `idle` 대 `idle_armed`(등) 선택. 공격 쿨다운 / 발사체 스폰은
  `armed` 에 게이트. `armed === false` 이고 X 누름 → **던지기 완전 억제**(애니
  메이션·사운드 없음). 무기 없이 공격 누르기는 놓친 비트가 아닌 no-op.
- **Mossplodder:** 단순 — 일정 속도 `walk` 단일 상태, 도끼나 불 접촉 시 `dead`.
- **Hummerwing:** 단순 — 사인 보브가 있는 일정 속도 `drift` 단일 상태, 도끼 접촉 시
  `dead`. `dead` 후 본체는 중력으로 낙하.
- **Egg / dawn-husk:** `rest` → (Reed 접촉) → `break` → (`breakFrames` 후) →
  despawn + `player.armed = true` 플립.
- **Mile-marker / boundary cairn:** Reed 가 트리거 히트박스에 들어설 때까지 정적
  `idle` → `consumed = true` → `LevelManager` 로 전환 이벤트 발화.

### 12.3 권장 신규 시스템

- **`StageManager`**(또는 `LevelManager` 확장): 4 라운드 Area 1 진행 소유. 라운드
  데이터 로드, mile-marker 트리거 시 페이드-투-블랙, `currentRound` 전진, 다음
  라운드 로드. 라운드 4 cairn 트리거 후 "Stage Cleared" 오버레이
  (`phase2-areas.md` §3.2) 표시, 입력 또는 새로고침까지 idle.
- **`SlopeCollision`**(physics 확장): 슬로프 지면 타일 지원. 추천 스킴: 각 지면
  타일이 `slope` 필드(`flat | up45 | down45 | up22 | down22`); resolver 가 타일 내
  player X 에 따라 floor Y 보간. 최종 인코딩은 dev-lead 결정.
- **`PickupSystem`**: 달걀 깨짐과 `player.armed` 플립 처리.
- **`TriggerSystem`**: mile-marker / cairn 감지 처리, 전환 이벤트 발화.

### 12.4 튜너블 파라미터 블록

`src/config/PhaseOneTunables.js` 확장(또는 `PhaseTwoTunables.js` 로 분리) 권장:

```
HERO_PHASE2  = { (기존 HERO 변경 없음, 추가:) armedStartOfRound: false }
HATCHET      = { vx0, vy0, gravity, maxOnScreen, lifetimeMax,
                 attackCooldown, spinFps }
MOSSPLODDER  = { walkSpeed, deathFrames, gravity }
HUMMERWING   = { driftVx, driftAltitude, bobAmplitude, bobFrequency,
                 deathFrames, gravity }
EGG          = { breakFrames, shimmerFps }
FIRE         = { flickerFps }
TRIGGERS     = { milePulseRange, cairnIdleFps }
```

### 12.5 데미지 해결 규칙

- 모든 Phase 2 적은 첫 도끼 접촉에 사망. hp 카운터 없음, 플래시 없음, friendly-
  fire 없음.
- 도끼는 첫 솔리드 접촉(적/벽/지면/바위) 또는 `lifetimeMax` 에 despawn. **튕김
  없음.**
- 영웅이 Mossplodder(`walk`), Hummerwing(`drift`), 또는 불 타일과 접촉 → 즉시
  게임오버. (v0.25.2 에 따라.)
- Mossplodder + 불 = Mossplodder 사망. Hummerwing + 불 = 고도 디자인상 불가능.

### 12.6 스테이지 스모크 체크 (v0.50 분기 게이트)

1. 라운드 1-1 로드. Reed 비무장; X 누름 → 던지기 안 됨.
2. dawn-husk 접촉 → 3 프레임 깨짐, `player.armed = true`. X 누름 → 도끼가 포물선
   호로 날아가 한 번 떨어지고 퍼프와 함께 despawn.
3. 도끼가 Mossplodder 를 1 hit 으로 처치. 비무장으로 Mossplodder 와 접촉 = 즉시
   게임오버.
4. Hummerwing 에 점프-던지기; 사망 후 떨어짐.
5. 바위가 길 차단; 뛰어넘음. 다른 바위에 가둬진 Mossplodder 가 `walk` 1 번 프레임
   유지. 도끼가 처치.
6. 불 타일 = Reed 접촉 시 게임오버. Mossplodder + 불 = Mossplodder 사망.
7. 라운드 1-1 끝 mile-marker → 페이드 + 라운드-1-2 로드. 1-3 까지 반복.
8. 라운드 1-4 끝 boundary cairn → 페이드 + "Stage Cleared" 오버레이.

---

## 13. release-master 를 위한 오픈 질문

1. **불-애니메이션 타일 vs. 엔티티 (§8).** 가장 깔끔한 것은 "애니메이션 타일"이지만
   `docs/design/contracts.md` 확장이 필요. 두 경로: (a) 본 PR 패밀리에서 계약 확장
   — 장기적으로 가장 깔끔; design-lead 와 dev-lead 가 동의해야 한다. (b) v0.50
   에서 불을 엔티티로 출시 — 더 빠르지만 "사실은 그저 타일인" 엔티티 타입이 추가됨.
   (a) 권장; release-master 의 결정에 따름.
2. **사망 시 달걀 리스폰.** v0.25 는 게임오버를 종료성으로 만들었다. v0.50 에
   continue/restart 가 들어오면, 달걀은 라운드 시작 시 리스폰. Continue 가 v0.75 로
   미뤄지면 변경 불필요.
3. **무장 상태 사망 의미론.** §2.5 는 도끼가 리스폰으로 이어지지 않는다고 한다.
   Continue 가 들어오고 비무장 리스폰이 가혹하게 느껴지면, "마지막 mile-marker
   에서 리스폰, 죽었을 때 무장 상태였다면 무장." v0.75 메카닉 결정. v0.50 에
   가장 깔끔한 규칙은 "라운드 1-N 시작에서 비무장 리스폰."
4. **Mile-marker 라운드 숫자.** 실제 숫자("1", "2", "3") 또는 노치 마크(노치 한 개,
   두 개, 세 개)? 숫자는 글로벌 청중에게 빠르게 읽히지만 덜 "월드 안"적; 노치 마크
   는 시대 정합적이지만 장식 흠집으로 읽힐 수 있다. 자산 재작업 방지를 위해 지금
   플래그.
5. **Cairn 오버레이 카피.** "Stage Cleared" + "Area 2 ahead in v0.75." 는 릴리즈-
   정직하지만 너무 메타일 수 있음. 대안: "The next boundary waits." / "The path
   continues — soon." 어느 쪽이든 한국어 병행 작성 필요.
6. **라운드 전환에서 도끼 픽업 지속.** 매 라운드 시작에서 비무장으로 리셋(권장;
   `armedStartOfRound: false` 와 일치) — 모든 라운드에 달걀 깨기 비트 보존, Design
   에게 네 번의 픽업 모먼트 제공. 또는 라운드 간 지속 — 더 풍부한 진보처럼 느껴
   지지만 네 개의 달걀 모먼트 중 세 개 소실. 리셋 권장.

---

## 캐스트 은퇴 노트

(§10 참조. Phase 1 3 종 + Phase 1 stoneflake 발사체는 v0.50 액티브 게임플레이에서
은퇴; 스프라이트 모듈은 보존으로 `assets/sprites/` 에 남는다.)

---

## Changelog

브리프 최초 발행 후 편집 (`docs/briefs/README.md` 정책).

### 2026-05-10 — v0.50.2 (두 번째 브라우저 스모크 후 피벗)

v0.50.1 브라우저 테스트 후 사용자 피드백 6 건 반영:

- **정지 시 떨림** 의 근본 원인이 `CollisionSystem` 1 글자 버그(`>` → `>=` 평면 스냅 같음 케이스). Reed 가 idle 상태에서 더 이상 1-px 진동 없음.
- **새 hero 애니메이션**(`sprint`, `sprint_armed`, `stumble`, 리파인된 `death`) FSM 상태에 와이어. `idle` 은 4 fps 3 프레임 호흡 그대로; jitter 사라지니 자연스럽게 읽힘.
- **슬로프 step-up** 으로 Reed 가 화살표만으로 `slope_up_22`/`_45` 등반 가능(점프 불필요). 임계값 18 px; 히어로 전용.
- **마일마커 위치 라운드 시작으로 시프트.** 이전엔 markers 가 이전 라운드 끝에 위치. 이제: `mile_1` 스테이지 시작(col 3), `mile_2` 라운드 1-2 초입(col 50), `mile_3` 라운드 1-3 초입(col 114), `mile_4` 라운드 1-4 초입(col 162, design PR #22 의 신규 타일). cairn 은 스테이지 끝 그대로.
- **죽음 = 넉백 + 4 프레임 `death` 애니 + 45 프레임 dying 타이머 + 가장 최근 통과 마일마커에서 지연 respawn.** Reed 가 더 이상 즉시 respawn 안 함. `pl.dyingFrames` 가 타이머 구동 신규 ECS 필드.
- **0 lives → GAME OVER + 무제한 continue.** 이동/점프/공격 키 입력으로 continue → 스테이지 재구축, lives 리필. 이전 v0.50.1 은 0-lives 시 조용히 재시작; v0.50.2 는 명시적 플레이어 입력 비트로.
- **돌이 더 이상 차단 X** — 접촉 시 stumble FSM 발동(30 프레임 애니, vitality −10, 관성 손실); Reed 가 통과. 돌 별 token + 30 프레임 cooldown 으로 재트립 방지.

캐스트 정체성 변경 없음. ECS 필드 추가: `pl.dyingFrames`, `pl.stumbleFrames`, `pl.stumbleCooldown`, `pl._lastRockTripKey`.

### 2026-05-10 — v0.50.1 (브라우저 스모크 후 피벗)

v0.50 브라우저 테스트 후 사용자 피드백으로 인해 Open Questions 및 in-spec 기본값
일부가 최초 발행과 다르게 결정됨:

- **Q6 도끼 픽업 지속성 — 뒤집힘.** 더 이상 라운드 경계마다 무장 리셋 안 함. Reed 는
  스테이지당 정확히 한 번(라운드 1-1) 도끼를 획득하고 스테이지 내내 + mid-stage
  respawn 사이에서도 무장 유지. Area 1 의 dawn-husk 4 개 중 3 개는 concat 단계에서
  제거되어 라운드 1 의 husk 만 남는다. 다음 스테이지로의 장비 carryover — Stage 2
  가 나오면 stage clear 시점의 `pl.armed` 를 이어받음.
- **스테이지 아키텍처 — 재구조.** 원래 spec 은 4 개의 스크롤 라운드 + 페이드 전환.
  v0.50.1 은 Area 1 을 ONE 224-칼럼 연속 스크롤 스테이지로 통합. Mile-marker 는
  세계 안 타일로 남되 더 이상 페이드/재로드 트리거 아님 — 90-프레임 이중언어
  오버레이(`Round 1-2` / `라운드 1-2` 등) 발화 + 체크포인트 앵커 역할만.
- **목숨 시스템 — 도입.** Vitality 가 1 목숨으로, 스테이지당 3 목숨. 사망(vitality 0,
  적 접촉, 불, 다트) 은 `state.loseLife()` 라우팅 — lives 감소, vitality 리필,
  최신 mile-marker(또는 마커 통과 전이면 스테이지 시작) 에서 `pl.armed` 보존하며
  respawn. 0 lives → lives 3 리필, 스테이지 처음부터 재구축 (엔티티 재스폰, 히어로
  비무장 시작, vitality 만량). 무한 재도전; Phase 2 에서 GAME_OVER 도달 불가.
- **애니메이션 타이밍 — 튜닝.** Sprite META 가 선택적 `animFps: { idle: 4, walk: 8,
  ... }` 키별 오버라이드 지원 (이 dev PR 과 함께 `docs/design/contracts.md` 확장).
  `hero-reed.js` 는 `idle`/`idle_armed`/`dead` 4 fps, 다른 키 8 fps. `enemy-
  hummerwing.js` META.fps 12→9 (스트로보 완화).
- **Slope_up_22 — 매끄럽게.** v0.50 의 4-스텝 12 px 계단 등반이 진동처럼 보였다.
  slope_up_45 와 동일한 1-px 선형 램프로 통일; "부드러움 vs 가파름" 의 구분은
  이제 타일 아트로만 표현. 라운드 데이터는 변경 없음 (슬로프는 같은 칼럼에 배치).
- **X 가 듀얼 모드.** `X` 탭 = 도끼 던지기 (기존). `X` 홀드 = 이동 시 대시 (1.4×
  walk speed). `Z` + `X` 홀드 = 더 높은 점프 (1.15× 초기 vy). 튜너블은
  `PhaseTwoTunables.HERO_P2`. Phase 1 retro debug 경로는 변경 없음 (대시 없음).
- **Vitality 리필 — 추가.** 매 mile-marker 통과 시 vitality 가 만량으로 리필 — 페이드
  강제 없이 작은 보상 비트.
- **캐스트 정체성 변경 없음.** Reed Bramblestep, Mossplodder, Hummerwing, dawn-husk,
  stone hatchet, Mossline Path — 모두 그대로. 타이밍/아키텍처/컨트롤 매핑만 변경.

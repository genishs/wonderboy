# 미리보기 — `assets/tiles/area1-stage2-shore.js`

> **영문 원본:** [`preview-tile-stage2-shore.md`](./preview-tile-stage2-shore.md)

| 항목          | 값                                          |
|---------------|---------------------------------------------|
| 경로          | `assets/tiles/area1-stage2-shore.js`        |
| 스테이지      | Stage 2 — 해변 / shore                      |
| 타일 매트릭스 | 타일당 16 × 16 아트-픽셀                    |
| 화면 크기     | 캔버스 48 × 48 px (3× 스케일; `TILE = 48`) |
| 팔레트        | 18 항목                                     |
| 타일 키       | 12 키 (정적 10 + 애니메이션 1 + stage_exit) |

v0.75 테마 리맵에 따라, 해변은 이제 forest → shore → cave → dark forest
시퀀스의 Stage 2이다 (이전 빌드에서는 강가). 모듈 이름 변경은 `git mv
area1-stage3-water.js area1-stage2-shore.js`. 팔레트 hex 값, 매트릭스
데이터, 타일 키는 그대로 유지되었다 — 동일한 wet-stone + 바닷물 + dawn-
amber 반사 문법이 강가에서와 같이 햇볕 따뜻한 해변에서도 잘 읽힌다. 헤더
라벨과 타일-키 서술만 변경되었고; 실제 픽셀은 변하지 않았다.

해변 타일셋은 `assets/tiles/area1.js` 및 `area1-stage3-cave.js`와 구조적
으로 같다 (동일 locomotion 형태, 동일 mile-marker 체인, 동일 META).
Stage 2의 시그니처는 **물=위험**: `water_gap` 타일은 플레이 가능한 바닥
아래에 보이는 바닷물을 그리고 (빈 하늘이 아니라), 거기 빠지면 1격사다
(일반 gap와 동일한 죽음 규칙 — Reed가 플레이 행 아래로 떨어지면 기존
v0.50.2 dying FSM이 발동).

## 타일 키

### 정적 타일

- **`flat`** — 햇볕 따뜻한 해안 선반 바닥. 위 2행은 shore-moss 띠 — 새벽
  햇빛이 닿는 선반 윗면에 자란 염분 내성 조간대 이끼 (바다 색조 녹색, 숲의
  이끼보다 살짝 차갑다). 다음 4행은 wet-shelf-stone 본체. 그 아래로 더 깊
  은 그림자에 ripple-pale이나 cave-stone catchlight 점이 가끔 들어간다
  (조류 때문에 선반이 젖어 있어 임의의 점에서 빛을 잡는다). 맨 아래 3행은
  선반 그림자 띠.
- **`slope_up_22`** — 완만한 22° 오르막, wet-shelf-stone 팔레트.
- **`slope_up_45`** — 가파른 45° 오르막. 상단 우측 crest의 dawn-amber
  catch는 "아래 바닷물이 새벽 해를 잡아 그 반사가 슬로프 crest에 떨어진다"
  로 읽힌다 — 해변의 시각적 터치스톤 (위에서 따뜻 + 아래에서 차가움).
- **`slope_dn_22`** — 완만한 내리막.
- **`slope_dn_45`** — 가파른 내리막. 상단 좌측 crest에 catchlight.
- **`rock_small`** — 조간대 바위. 동일 authoring 규칙. Stage 1 / Stage 3의
  river-stone 팔레트를 그대로 쓰면서 그늘진 쪽에는 단일 **shore-moss** 패치
  (바다 색조 녹색, Stage 1 숲 이끼 패치보다 살짝 차갑다).
- **`mile_1`-`mile_4`** — 라운드 표지판, 공유 사슬. Stage 1, 3, 4와 동일한
  기둥 + 판 + 숫자 모양.
- **`stage_exit`** — Area 내 전환 게이트, 해변 변형. `area1-stage3-cave.js`
  의 `stage_exit`과 동일한 아치 실루엣, 색조 재조정: 지지 기둥은 wet-
  shelf-stone (동굴-돌보다 옅음), 크로스빔은 동일 dawn-amber + pale-gold
  + moss-dark sigil 셀. "다음 길로의 출입구"로 읽힌다.

### 애니메이션 타일

- **`water_gap`** — **애니메이션**, `{ frames: [3 matrices], fps: 3 }`.
  Stage 2의 시그니처 위험. 시각적으로 바닷물 (빈 하늘이 아님), Reed가
  빠지면 죽인다 (v0.50.2 dying FSM과 동일).

  시각 레이아웃:
  - **맨 위 행:** dawn-amber + pale-gold 반사 띠 (새벽 해가 열린 수면을
    잡음).
  - **표면대 (rows 2-7):** sea-deep 본체에 ripple-pale 하이라이트가
    수면에 흩뿌려짐 (아침 빛을 잡는 sea-foam). 몇 개의 sea-deep-dark
    셀이 표면-본체 전환부에 위치.
  - **본체 (rows 8-15):** sea-deep-dark — 물은 "들어가지 마라"로 읽힐
    만큼 깊다.

  결정 기록:
  - **`water_gap`은 애니메이션** (3 프레임 @ 3 fps). Stage 1과 3의 fire
    / crystal-vein 위험과 동일한 시각적 활기를 주기 위해 3 프레임을
    보낸다. 3 fps는 `crystal_vein`의 6 fps보다 느리고 `fire_low`의 8 fps
    보다 훨씬 느리다 — 해변의 물은 fire의 빠른 떨림이 아니라 조류 리듬으
    로 움직인다.
  - **`water_gap`은 Stage 2의 유일한 위험 타일.** Stage 2의 시그니처
    비트는 조류-물 리듬 — 내륙 위험을 추가하면 그 읽기를 흐트러뜨린다.

  프레임 사이클:
  - **frame 0** — 중립 수면.
  - **frame 1** — 리플 좌측 이동.
  - **frame 2** — 리플 우측 이동. F0→F1→F2→F0 루프가 느린 조류 움직임으
    로 읽힌다.

## 결정 기록 — 팔레트 그대로 유지

이전 PR의 강가 팔레트는 이미 새벽 빛 아래 열린 물로 읽혔다. 이름 변경 전
후로 18개 hex 값을 모두 바이트-단위 동일하게 유지했다 — `#3a586a` (이
헤더에서 "river-deep"에서 "sea-deep"으로 라벨만 변경), `#6a8a4a` ("bank-
moss" → "shore-moss / sea-tinged"), `#6a90a8` ("ripple-pale" / "sea-foam")
등. 이는 테마 리맵에 걸쳐 누적 프로젝트 팔레트를 안정적으로 유지한다
(Stage 2 측에서 Phase 3 hex 추가/제거 없음). 서술 라벨은 이동했고; 실제
픽셀은 이동하지 않았다.

## 이전 페이즈와의 팔레트 겹침

18개 중 11개 hex는 Phase 1 / 2 / Phase 3 동굴 타일셋에서 그대로 재사용
된다. 새 6개는 해변의 시그니처: wet-shelf-stone 가족, shore-moss, sea-
deep 가족, ripple-pale.

## 스테이지간 일관성 메모

- locomotion + 표지판 형태는 Stage 1에서 그대로 이어진다.
- `rock_small`은 composite-on-flat — 동일 authoring 규칙.
- `water_gap`은 Stage 1의 `fire_low` 그리고 Stage 3의 `crystal_vein`과
  *동일 역할*을 한다 (레벨 데이터 배치에서): dev-lead가 플레이 가능한
  바닥을 끊는 열에 엔티티를 두면, Reed가 빠지면 죽는다.

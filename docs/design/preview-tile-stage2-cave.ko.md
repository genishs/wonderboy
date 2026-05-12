# 미리보기 — `assets/tiles/area1-stage2-cave.js`

> **영문 원본:** [`preview-tile-stage2-cave.md`](./preview-tile-stage2-cave.md)

| 항목          | 값                                          |
|---------------|---------------------------------------------|
| 경로          | `assets/tiles/area1-stage2-cave.js`         |
| 스테이지      | Stage 2 — Sumphollow (동굴)                 |
| 타일 매트릭스 | 타일당 16 × 16 아트-픽셀                    |
| 화면 크기     | 캔버스 48 × 48 px (3× 스케일; `TILE = 48`) |
| 팔레트        | 18 항목                                     |
| 타일 키       | 13 키 (정적 11 + 애니메이션 1 + cairn 예약 1) |

동굴 타일셋은 `assets/tiles/area1.js`와 구조적으로 같다 (같은 locomotion
형태, 마일-마커 체인, 같은 `META = { tile: 16, scale: 3, displayPx: 48 }`)
그리고 스테이지 특유의 두 키를 추가한다: `crystal_vein` (애니메이션 위험)
과 `stage_exit` (Area 내 전환 게이트). `cairn`은 스키마 대칭을 위해 정의되
었지만 Stage 2 레벨 데이터는 그것을 emit하지 않는다.

## 타일 키

### 정적 타일

- **`flat`** — 표준 동굴 바닥. 위 2행은 cave-moss-blue-green 띠 (동굴
  시그니처: 햇빛이 덜 닿아 푸르스름해진 이끼). 다음 4행은 wet-cave-stone
  본체. 그 아래로 더 깊은 돌 그림자에 가끔 cave-stone catchlight 점이
  들어간다 (동굴은 습해서 광물 입자가 적은 빛도 잡는다). 맨 아래 두 행은
  cave under-base — 깊은 청회색이지만 `docs/story/world.md`에 따라 **결코
  검은색이 아니다**.
- **`slope_up_22`** — 완만한 22° 오르막. Stage 1의 slope_up_22와 동일한
  계단형 상승, 동굴 색조: 상승 가장자리에 cave-moss 띠, 본체는 wet-cave-
  stone, 발치는 cave under-base.
- **`slope_up_45`** — 가파른 45° 오르막. 상단 우측 crest의 단일 dawn-amber
  catch-light는 "vein-glow가 상승 가장자리를 찾은 것"으로 읽힌다. Stage 1
  의 dawn-amber root-knot을 살짝 더 따뜻한 동굴 등가물로 대체한다.
- **`slope_dn_22`** — 완만한 내리막, `slope_up_22`의 거울상.
- **`slope_dn_45`** — 가파른 내리막, `slope_up_45`의 거울상. 상단 좌측
  crest에 catchlight.
- **`rock_small`** — 단독 동굴-바위. Stage 1과 동일한 authoring 규칙: row
  12 아래는 투명이라 `flat` 타일 위에 합성된다. river-stone 팔레트는 그대로
  사용하지만 그늘진 쪽의 이끼 패치는 **cave-moss-blue-green dark**, 숲 이끼
  가 아니다. "동일 바위 기하학, 동굴 색조 환경"으로 읽힌다.
- **`mile_1`, `mile_2`, `mile_3`, `mile_4`** — 라운드 표지판. 기둥 (wet-
  bark + cuff-cream plank + violet 잉크 숫자)은 Stage 1 마일-마커와
  **그대로 공유**된다; 숫자 값만 다르다. 설계 근거: 마일-마커는 Area 1의
  네 스테이지를 가로지르는 길의 사슬 — 플레이어는 "같은 길, 내 카운트가
  계속된다"로 읽는다. 스테이지별 기둥 색조 변경은 그 읽기를 깬다. 숫자
  1-4는 Stage 1과 동일한 baked-pixel 숫자 모양 (`preview-tile-area1.md`
  의 숫자 모양 설명 참조).
- **`stage_exit`** — **NEW Phase 3 타일 키.** Area 내 스테이지간 전환 게
  이트. 시각: 두 river-stone-grey 기둥 위에 dawn-amber + pale-gold 빛
  나는 크로스빔이 걸린 짧은 동굴-돌 아치. 크로스빔 안의 moss-green-dark
  sigil 셀 하나가 스테이지 자체 팔레트를 반향한다 — 플레이어는 "동굴의
  나가는 문"으로 읽는다. mile-marker (기둥 + 판 + 숫자) 그리고 cairn
  (돌 더미)과 다른 "걸어 들어가는 출입구"로 읽힌다.

  **결정 기록.** 브리프는 (a) `cairn` 키 재사용 + Stage 2 팔레트 재색
  또는 (b) 새 `stage_exit` 키 도입 둘 다 허용했다. 의미 명확화를 위해
  (b)를 선택: 레벨 데이터에서 `cairn`은 항상 *Area-Cleared 트리거*,
  `stage_exit`은 항상 *Area 내 다음 스테이지로의 사슬*. Stage 3 강가
  타일셋도 같은 `stage_exit` 키 + 시각 (wet-shelf-stone으로 재색)을
  사용한다.

- **`cairn`** — Area 종료 (Stage 4 종료)용 예약. 이 모듈에서는 `assets/
  tiles/area1.js`와의 스키마 패리티를 위해 정의되어 있어 렌더러 + dev
  코드가 타일셋 전체에 걸쳐 통일된 키 집합을 스캔할 수 있다. **실제로
  Stage 2 레벨 데이터는 이 키를 emit하지 않는다.** Round 2-4의 끝은
  `stage_exit`을 emit한다.

### 애니메이션 타일

- **`crystal_vein`** — **애니메이션**, `{ frames: [3 matrices], fps: 6 }`.
  동굴의 fire 대체 위험: 동굴 바닥의 가는 빛나는 균열로 **Reed 접촉 시
  1격사** (Stage 1 `fire_low`와 동일 규칙). 시각적으로 fire와 다르다:
  **flame tongue 없음, 위로 솟구치지 않음.** 돌 표면의 정적인 빛 —
  dawn-amber 본대와 pale-gold 반짝임 클러스터, 맨 아래 행에 velvet
  under-flame wash (순흑 없음). 동굴 버전은 **fire보다 느리다** (fire의
  8 fps 대비 6 fps) — 동굴은 숲보다 천천히 숨쉰다.

  **타일 키는 `crystal_vein`으로 선택** (release-master는 `crystal_vein`
  과 `amber_vein` 둘 다 추천). 결정 근거: `crystal_vein`은 결정성 /
  광물성으로 읽혀 동굴의 "바위로 새어나오는 amber" 픽션과 맞고,
  `amber_vein`은 생물학적 함의가 있다. 결정성 읽기는 16-셀 해상도에서
  더 명료하기도 하다 — 반짝임 클러스터가 광물 면처럼 보이지 flame처럼
  보이지 않는다.

  - **frame 0** — 중립 펄스. 바닥을 대각선으로 가로지르는 가는 균열;
    본대는 dawn-amber, 두 pale-gold 클러스터 포인트 (좌 col 6 부근, 우
    col 13 부근).
  - **frame 1** — 더 밝은 펄스: 두 클러스터에 더 많은 pale-gold 반짝임이
    표면화 (vein이 "들이쉰다"). 균열 윤곽은 같고; 반짝임 분포가 회전·증가.
  - **frame 2** — 어두운 펄스 (vein이 "내쉰다"): 중심 클러스터 + 베이스
    wash만 보이고; 외곽 반짝임 사라짐. F0→F1→F2→F0 루프가 느린 호흡
    같은 빛으로 읽힌다.

## 이전 페이즈와의 팔레트 겹침

18개 hex 중 11개는 Phase 1 / 2 / 그리고 다른 Phase 3 타일에서 **그대로 재
사용**된다 (`palette-phase3.md` 참조). 새 6개는 동굴의 시그니처 팔레트를
형성한다.

## 스테이지간 일관성 메모

- locomotion 형태 (`flat`, `slope_*`)는 Stage 1과 시각적으로 구분되지만
  **게임플레이는 동일**: 동일 타일 치수, 동일 슬로프 각도, 동일 authoring
  규칙.
- `rock_small`은 Stage 1의 실루엣과 composite-onto-flat authoring 규칙을
  공유 — Reed의 충돌 동작은 변함 없음.
- `crystal_vein`은 Stage 1의 `fire_low` *상호작용 계약*을 공유: Reed 접촉
  1격사, Mossplodder 들어가면 죽음, Hummerwing 무영향. 렌더러는 둘을 같
  게 다루고; 시각만 다르다.
- 마일-마커 기둥은 네 스테이지에 걸쳐 동일 (위 참조).

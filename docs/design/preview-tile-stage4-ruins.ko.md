# 미리보기 — `assets/tiles/area1-stage4-ruins.js`

> **영문 원본:** [`preview-tile-stage4-ruins.md`](./preview-tile-stage4-ruins.md)

| 항목          | 값                                          |
|---------------|---------------------------------------------|
| 경로          | `assets/tiles/area1-stage4-ruins.js`        |
| 스테이지      | Stage 4 — The Old Threshold (고대 유적)     |
| 타일 매트릭스 | 타일당 16 × 16 아트-픽셀                    |
| 화면 크기     | 캔버스 48 × 48 px (3× 스케일; `TILE = 48`) |
| 팔레트        | 17 항목                                     |
| 타일 키       | 12 키 (정적 10 + 애니메이션 장식 1 + cairn) |

유적 타일셋은 Phase 3에서 **가장 건조한** 팔레트 — 모자이크 바닥은 채도가
낮은 돌, 기둥도 돌, 부서진 조각도 돌. Dawn-amber는 오로지 carved channels
(`dawn_channel`)에만 나타난다 — 유적의 저장된 열이 바닥을 통해 새어 나오는
곳. Stage 4는 **fire 등가물 / amber-vein / 물 위험 타일이 없다**; 이 스테이
지의 위협은 Mossplodder + Round 4-4 col 32의 보스 아레나 비트에 전적으로
의존한다.

## 타일 키

### 정적 타일

- **`flat`** — 모자이크-바닥 타일. 위 2행: 모자이크-쿨 이끼 오버레이 띠가
  있는 carved-stone-pale (세기 동안 방해받지 않은 바닥에 슬금슬금 자란
  이끼). Rows 2-5: carved-stone-pale 본체에 grout-line 악센트 (몇몇 열
  경계의 carved-stone shadow 셀 — "모자이크 타일 패턴"으로 읽힘). Rows
  6-13: 가끔의 작은 이끼 패치가 있는 계속되는 모자이크 (방은 인내심이
  있다, 이끼도 인내심이 있다). 맨 아래: pillar-shadow-violet 띠 — Stage
  1/2/3의 바닥 그림자보다 더 깊은 보랏빛, "바닥에는 긴 기억이 있다"로
  읽힌다.
- **`slope_up_22`** — 완만한 오르막, 유적 색조.
- **`slope_up_45`** — 가파른 오르막. 상단 우측 crest의 dawn-amber catch
  는 "유적의 저장된 열이 상승 가장자리를 따라 표면화한다"로 읽힌다 —
  Stage 2 crystal-vein 그리고 carved channel과 동일한 따뜻함 motif.
- **`slope_dn_22`** — 완만한 내리막.
- **`slope_dn_45`** — 가파른 내리막.
- **`rock_small`** — 기둥-조각 (부서진 기둥 그루터기). 동일 authoring
  규칙. 실루엣은 Stage 1-3의 `rock_small`과 다르다: 평탄한 윗면의 기둥
  세그먼트로 명확한 기둥-cap (carved-stone highlight + river-stone-
  highlight crown) 과 베이스의 명확한 pillar-shadow-violet undercut이
  있다. "한때 더 높았던 무언가의 일부였다"로 읽힌다. **게임플레이 역할은
  변함 없음** — 숲의 바위와 동일한 stumble + vitality-drain 동작.

  **결정 기록.** 타일 KEY는 `rock_small`을 유지했다 (스토리 브리프가 임시
  로 부른 `pillar_fragment` 대신) — dev-lead의 레벨 데이터 코드가 네 스테
  이지에 걸쳐 같은 키를 쓸 수 있도록. 브리프의 의도 ("부서진 기둥 세그
  먼트") 는 시각적으로 존중되었고; 코드 내 키만 통일.

- **`mile_1`-`mile_4`** — 라운드 표지판, 공유 사슬. `mile_4`는 Area 1의
  마지막 라운드 — 보스의 앞방을 가리키는 마커.
- **`cairn`** — **Area 종료 경계 cairn.** dawn-amber로 색조된 sigil-
  stone이 맨 위에 있는 carved-stone 돌 세 개의 쌓음. carved-channel
  motif가 여기에서 모인다: sigil-stone은 "유적의 저장된 열이 Area-
  Cleared 축복으로 한 돌에 표면화한다"로 읽힌다. `stage_exit` (Stages
  2-3에서 사용 — 수평 크로스빔이 있는 동굴/물 아치)과 시각적으로 구분
  되어 플레이어는 "이것은 길의 끝이지, 다른 문이 아니다"로 읽는다.

  Stage 4 `cairn`은 Area 1 종료 마커 — dev-lead의 레벨 데이터가 Bracken
  Warden 격파 후에만 발동시킨다.

### 애니메이션 장식 (위험 아님)

- **`dawn_channel`** — **애니메이션**, `{ frames: [2 matrices], fps: 2 }`.
  모자이크 바닥에 새겨진 amber-glow 채널. **장식 전용** — Reed가 결과
  없이 걸어 지난다. Round 4-2, 4-3 (장식 런) 그리고 특히 Round 4-4
  (col 32의 보스 아레나 입구로 다가가는 긴 수렴 stripe)에서 사용.

  시각 레이아웃:
  - **상단 영역 (rows 0-7):** 채널 자체 — 바닥 표면에서 velvet ink로
    둘러싸인 1-타일-폭의 새김 스트립. 채널 내부는 dawn-amber + pale-gold
    반짝임 클러스터; 채널 바깥 셀은 투명이라 주변 `flat` 타일이 보인다.
  - **중하단 (rows 8-15):** 모자이크 바닥 본체 — `flat`의 아래 부분과
    동일 내용, 그래서 `dawn_channel` 타일이 `flat` 타일 행에 시각적 솔기
    없이 끼워진다. 채널은 "바닥에 새겨져 있다"로 읽힌다.

  결정 기록:
  - **2 프레임 @ 2 fps** 브리프 §11.4 ("2-frame slow pulse ~2 fps") 그대로.
    Phase 3에서 가장 느린 애니메이션 (fire 8 fps, vein 6 fps, water 3 fps,
    channel 2 fps) — "유적의 저장된 열은 고대적이고 인내심 있다"에 적합.
    두 프레임은 반짝임 밀도만 다르다: frame 0 = 드문 반짝임, frame 1 = 더
    조밀한 반짝임 분포. F0↔F1 루프가 매우 느린 호흡 같은 빛으로 읽힌다.

  - **위험 아님.** 스토리 브리프 §11.4: 유적의 저장된 열은 장식이며 Reed
    를 해치지 않는다. 이것은 **Stage 4에서 보스 아레나 바깥에 dawn-amber
    가 나타나는 유일한 장소**, 의도적인 전조 — 플레이어가 Round 4-2, 4-3
    에서 carved channel을 지나며 "여기 따뜻한 무언가가 묻혀 있다"로 읽
    고, Round 4-4 보스 아레나에서 Bracken Warden의 chest sigil이 같은
    amber 가족 안에서 떠오른다.

## 결정 기록 — 위험 타일 없음

스토리 브리프 §7 + §11에 따라: **The Old Threshold는 위험 타일이 없다.**
`fire_low`, `crystal_vein`, `amber_vein`, `water_gap` 없음. Stage 4의 Reed
사망 경로는 오로지: Mossplodder 본체 접촉, 보스 본체 접촉, moss-pulse 충격
파 접촉, gap-fall (Stage 4의 비-물 gap 몇 개).

## 결정 기록 — 보스-아레나-바닥 변형 없음

스토리 브리프 §11.5는 "12-tile-wide 아레나용 보스-아레나-바닥 변형"을 열어
두었다. **보내지 않음.** 사유: 보스 아레나는 동일한 `flat` 모자이크 바닥
(Round 4-4 cols 32-43)을 사용. 아레나의 위 행은 `flat` 타일이 이미 위쪽이
시각적으로 조용하기 때문에 (2행 이끼 오버레이 띠 + 모자이크-쿨만) 조용한
상태를 유지; HUD strip은 화면 상단에 ~76 px 여유 공간이 필요하고, 기존
`flat`이 Warden의 실루엣 아래에서 올바르게 읽힌다.

## 이전 페이즈와의 팔레트 겹침

17개 중 11개 hex는 Phase 1 / 2 / Phase 3 동굴 / 강가 타일셋에서 그대로 재
사용된다. 새 5개는 carved-stone-pale 가족 (base / highlight / shadow),
pillar-shadow-violet, mosaic-cool.

## 스테이지간 일관성 메모

- 마일-마커 기둥은 네 스테이지에 걸쳐 동일.
- `cairn`은 Area 종료 전용 예약. v0.75에서 Stage 4만이 레벨 데이터에서
  `cairn` 배치를 emit하고; Stages 1, 2, 3은 끝에 `stage_exit`을 emit.
- pillar-shadow-violet hex (`#684e6e`)는 **NEW Phase 3** 이며 프로젝트
  전체에서 유일한 추가 보랏빛이다. Bracken Warden 보스 스프라이트의
  under-stone-joinery shadow에서 공유되어 플레이어는 "Warden은 이 바닥과
  같은 재질로 만들어져 있다"로 읽는다.

# 미리보기 — `assets/tiles/area1-stage3-water.js`

> **영문 원본:** [`preview-tile-stage3-water.md`](./preview-tile-stage3-water.md)

| 항목          | 값                                          |
|---------------|---------------------------------------------|
| 경로          | `assets/tiles/area1-stage3-water.js`        |
| 스테이지      | Stage 3 — Brinklane (강가)                  |
| 타일 매트릭스 | 타일당 16 × 16 아트-픽셀                    |
| 화면 크기     | 캔버스 48 × 48 px (3× 스케일; `TILE = 48`) |
| 팔레트        | 18 항목                                     |
| 타일 키       | 12 키 (정적 10 + 애니메이션 1 + stage_exit) |

강가 타일셋은 `area1.js` / `area1-stage2-cave.js`와 구조적으로 같다 (동일
locomotion 형태, 동일 mile-marker 체인, 동일 META). Stage 3의 시그니처는
**물=위험**: 새 `water_gap` 타일은 플레이 가능한 바닥 아래에 보이는 강물을
그리고 (빈 하늘이 아니라), 거기 빠지면 1격사다 (일반 gap와 동일한 죽음 규칙
— Reed가 플레이 행 아래로 떨어지면 기존 v0.50.2 dying FSM이 발동).

## 타일 키

### 정적 타일

- **`flat`** — 돌-선반 바닥. 위 2행은 bank-moss 띠 — 천장 균열 사이로 들어
  오는 햇빛을 받는 선반 윗면에 자란 이끼 (Stage 2 동굴 이끼보다 푸르다).
  다음 4행은 wet-shelf-stone 본체. 그 아래로 더 깊은 그림자에 ripple-pale
  이나 cave-stone catchlight 점이 가끔 들어간다. 맨 아래 3행은 선반 그림자
  띠.
- **`slope_up_22`** — 완만한 22° 오르막, wet-shelf-stone 팔레트.
- **`slope_up_45`** — 가파른 45° 오르막. 상단 우측 crest의 dawn-amber
  catch는 "아래 강물이 위의 sky-strip을 잡아 그 반사가 슬로프 crest에
  떨어진다"로 읽힌다 — Brinklane의 시각적 터치스톤 (위에서 따뜻 + 아래
  에서 차가움).
- **`slope_dn_22`** — 완만한 내리막.
- **`slope_dn_45`** — 가파른 내리막. 상단 좌측 crest에 catchlight.
- **`rock_small`** — 강가-가장자리 바위. 동일 authoring 규칙. Stage 1/2의
  river-stone 팔레트를 그대로 쓰면서 그늘진 쪽에는 단일 **bank-moss**
  패치 (Stage 2 동굴 바위 이끼보다 푸르다, sky-strip의 햇빛을 받기 때문).
- **`mile_1`-`mile_4`** — 라운드 표지판, 공유 사슬.
- **`stage_exit`** — Area 내 전환 게이트, 강가 변형. `area1-stage2-cave.js`
  의 `stage_exit`과 동일한 아치 실루엣, 색조 재조정: 지지 기둥은 wet-
  shelf-stone (동굴-돌보다 옅음), 크로스빔은 동일 dawn-amber + pale-gold
  + bank-moss-dark sigil 셀.

### 애니메이션 타일

- **`water_gap`** — **애니메이션**, `{ frames: [3 matrices], fps: 3 }`.
  Brinklane의 시그니처 위험. 시각적으로 물 (빈 하늘이 아님), Reed가 빠
  지면 죽인다.

  시각 레이아웃:
  - **맨 위 행:** dawn-amber + pale-gold 반사 띠 (위에서 내려오는 sky-
    strip이 수면을 잡음).
  - **표면대 (rows 2-7):** river-deep 본체에 ripple-pale 하이라이트가
    수면에 흩뿌려짐. 몇 개의 river-deep-dark 셀이 표면-본체 전환부에
    위치.
  - **본체 (rows 8-15):** river-deep-dark — 강은 "들어가지 마라"로 읽힐
    만큼 깊다.

  결정 기록:
  - **`water_gap`은 애니메이션** (3 프레임 @ 3 fps). 브리프는 정적 또는
    저 fps의 2-3 프레임을 허용했다; Stage 1과 2의 fire / crystal-vein
    위험과 동일한 시각적 활기를 주기 위해 3 프레임을 보낸다.
  - **`water_gap`은 Stage 3의 유일한 위험 타일.** fire 등가물 없음,
    crystal-vein 등가물 없음. 스토리 브리프 §6의 위험 표는 Stage 3에
    `water_gap`만 명시한다.

  프레임 사이클:
  - **frame 0** — 중립 수면.
  - **frame 1** — 리플 좌측 이동.
  - **frame 2** — 리플 우측 이동. F0→F1→F2→F0 루프가 느린 물 움직임으로
    읽힌다.

## 결정 기록 — 선택적 `bank_reed` 유예

브리프는 Stage 3 장식으로 `bank_reed` (강가 가장자리의 키 큰 갈대)를 선택
사항으로 언급한다. **이 PR에서 보내지 않음.** Stage 3 레벨 데이터가 구체
적인 배치 요구를 확인할 때까지 design-lead는 미래 패치로 유예한다.

## 이전 페이즈와의 팔레트 겹침

18개 중 11개 hex는 Phase 1 / 2 / Phase 3 동굴 타일셋에서 그대로 재사용
된다. 새 6개는 강가의 시그니처: wet-shelf-stone 가족, bank-moss, river-
deep 가족, ripple-pale.

## 스테이지간 일관성 메모

- locomotion + 표지판 형태는 Stage 1/2에서 그대로 이어진다.
- `rock_small`은 composite-on-flat — 동일 authoring 규칙.
- `water_gap`은 Stage 1의 `fire_low` 그리고 Stage 2의 `crystal_vein`과
  *동일 역할*을 한다 (레벨 데이터 배치에서): dev-lead가 플레이 가능한
  바닥을 끊는 열에 엔티티를 두면, Reed가 빠지면 죽는다.

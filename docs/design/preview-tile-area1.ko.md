# 미리보기 — `assets/tiles/area1.js`

> **English:** [`preview-tile-area1.md`](./preview-tile-area1.md) (canonical)

| 필드          | 값                                  |
|---------------|-------------------------------------|
| 경로          | `assets/tiles/area1.js`             |
| 타일 매트릭스 | 타일당 16 × 16 아트-픽셀            |
| 표시 크기     | 48 × 48 캔버스 px (3× 스케일; src 의 `TILE = 48` 과 일치) |
| 팔레트        | 16 개 항목                          |
| 타일 키       | 11 키 (정적 10 + 애니메이션 1)      |

> 크기 / 스케일 노트: 이 PR 패밀리에서 출고된 contracts.md 확장에 따라 타일 모듈은 이제 `META = { tile, scale, displayPx }` 를 선언한다. Area 1 모듈은 `tile: 16, scale: 3, displayPx: 48` 을 사용 — 매트릭스는 16 × 16 픽셀로 저작되고 48 × 48 캔버스 픽셀로 렌더된다. displayPx 가 src/ 의 `TILE = 48` 과 정확히 일치한다.

## 타일 키

### 정적 타일

- **`flat`** — 표준 평지 지면 타일. 상단 2 행은 모스-그린 (새벽-warm "Mossline" 표면). 다음 4 행은 로움-소일 베이스에 결을 위해 흩어진 더 어두운 그림자 셀들. 그 아래는 wet-bark 측면 채움이 흙 column 의 옆을 바닥까지 운반; 따뜻함을 위해 두 개의 새벽-호박 뿌리 하이라이트가 bark 에 떠오르고, 몇 개의 로움-그림자 셀이 바닥 행을 지면 라인으로 앵커한다. 모든 라운드의 대부분에 깔린다.
- **`slope_up_22`** — 부드러운 22° 오르막 (수평 3 당 수직 1 상승). 상단 가장자리가 타일을 가로질러 좌→우로 ~5-6 px 상승; 상승 가장자리 위 셀들은 투명이라 sky / parallax 가 비친다. 실루엣이 우상단 코너에서 시작해서 좌측 중간으로 계단식으로 내려가고; under-loam 이 그 아래 body 를 채운다. 시각적으로 "부드러운 오르막" 으로 읽힌다.
- **`slope_up_45`** — 가파른 45° 오르막 (1:1). 상단 가장자리가 타일 전체를 대각으로 상승, 상단의 우측 중간에서 바닥의 좌측 하단까지. 우상단 정점에 더 무거운 root-knot — 단일 새벽-호박 하이라이트 셀 — 이 가파른 비트를 알린다.
- **`slope_dn_22`** — 부드러운 내리막, `slope_up_22` 의 Y 축 미러. 상단 가장자리가 타일을 가로질러 좌→우로 떨어진다.
- **`slope_dn_45`** — 가파른 내리막, `slope_up_45` 의 미러. 좌상단 정점에 더 무거운 root-knot.
- **`rock_small`** — 한-타일 키의 단독 바위. 베이스가 더 넓다; 우상단에서 새벽 빛을 받는 river-stone 하이라이트가 있는 둥근 상단, 그늘진 우측에 모스 패치. 그 아래 평지 지면 타일 위에 composite 되도록 설계됨: 행 12 미만은 투명이라 아래 바닥이 비친다. (level-data 저작 규칙: `flat` 지면 타일과 같은 column 에 `rock_small` 을 배치.)
- **`mile_1`**, **`mile_2`**, **`mile_3`** — release-master 결정 Q4 에 따라 라운드-숫자는 **숫자** 로 (notch mark 가 아님) 베이크된다. 각 타일은 풍화된 나무 기둥 (wet-bark-brown 축 + cuff-cream 판자 가로대) 을 보여준다. 판자 면이 보랏 외곽선에 숫자를 담는다:
  - **`mile_1`**: 행 4-7 column 5-8 에 작은 serif 가 있는 단일 수직 막대. "1" 로 읽힌다.
  - **`mile_2`**: 상단 수평 + 우상단 수직 + 중간 수평 + 좌하단 수직 + 하단 수평. "2" 로 읽힌다.
  - **`mile_3`**: 상단 수평 + 우측 수직 + 중간 수평 + 우측 수직 + 하단 수평. "3" 으로 읽힌다.

  판자 면은 cuff-cream (`#e8d4a0`) 을 사용해서 숫자가 dark-on-light 로 읽히게 한다; post-shaft 머리 위 새벽-호박 notch 가 아침 햇볕을 받는다 (cast brief §9.1 에 따라). mile-marker 들은 level-data 의 엔티티이고; 여기 타일 키들은 엔티티가 렌더하는 시각 컴포넌트.

- **`cairn`** — 경계 cairn. 세 개의 강돌 더미, 가장 위에 sigil-stone. mile-marker 보다 큰 실루엣 — cairn 이 타일에서 더 넓은 청크를 차지 (행 1-15, column 1-15). stack 가독성을 위해 세 개의 river-stone 톤으로 렌더: 베이스 돌은 river-stone-grey (`#7a8088`) 와 하이라이트 (`#a8b0b8`), 그림자 (`#4a5058`); 가장 위 돌은 새겨진 sigil 을 위해 cuff-cream (`#e8d4a0`) 을 사용 — mile-marker 판자 면을 시각적으로 echo 하도록 골랐기에 플레이어가 "이건 같은 종류의 길-표지인데, 더 크고 더 영구적이다" 로 읽는다.

### 애니메이션 타일

- **`fire_low`** — **애니메이션**, `{ frames: [3 매트릭스], fps: 8 }`. 세 개의 flame-tongue 가 있는 깜빡이는 낮은 불 패치. 연기 레이어 없음 (cast §8 가 "smoke-curl velvet-shadow" 를 옵션으로 허용; 시각적 깔끔함을 위해 생략 — 바닥 행의 보랏 언더-flame 워시가 같은 무드를 운반). 순수 검정 없음 — 가장 낮은 셀은 `velvet under-flame` (`#5a4a6e`), `world.md` 에 따라.
  - **frame 0** — 중립: 가운데 tongue 가장 길고, 측면 tongue 더 짧음. 세 개의 분명한 tongue 가 "낮은 패치 불" 로 읽힘.
  - **frame 1** — 좌-경: tongue 들이 모두 약간 좌측으로 기움; 우측 tongue 가 이 프레임에서 가장 짧음. 가운데 tongue 의 끝이 한 셀 좌측으로 이동.
  - **frame 2** — 우-경: frame 1 의 미러; 가운데 끝이 우측으로 이동, 좌측 tongue 가장 짧음.

  F0→F1→F2→F0 를 8 fps 로 루프하면 깜빡임으로 읽힌다. cast §8.1 brief 는 4 프레임을 허용; 우리는 모듈 크기 + 가독성을 위해 3 프레임 출고 — 사이클 루프가 3 프레임에서도 충분히 살아있게 느껴지고 캐시 비용이 더 싸다.

## 애니메이션-타일 계약 변경

이 PR 은 `docs/design/contracts.md` 를 확장해서 `TILES[key]` 가 다음 둘 중 하나일 수 있게 한다:

```js
TILES[key] = matrix                            // static (existing)
TILES[key] = { frames: [matrix, ...], fps }    // animated (new)
```

`fire_low` 가 v0.50 의 유일한 애니메이션 타일. 매트릭스 모양은 변경 없음 (매트릭스당 16 × 16 아트-픽셀). 기존 정적 타일은 그대로 유효; 렌더러는 `Array.isArray(value) === false && value.frames` 로 애니메이션 항목을 감지.

## Phase 1 과의 팔레트 중첩

9 개 hex 값이 Phase 1 모듈과 그대로 재사용된다 ([`palette-phase2.md`](./palette-phase2.md) 에 따라): `#3a2e4a` (보랏 외곽선), `#4a7c3a` (모스-그린 베이스), `#2e5028` (모스-그린 다크), `#e8d4a0` (cuff-cream), `#e8a040` (새벽-호박), `#f8d878` (팔레-골드), `#5a3a22` (bark base), `#4a3422` (wet-bark — Mossplodder 와 공유), 그리고 보편적인 `#00000000` 투명 인덱스. 이 타일 모듈의 나머지 7 개 hex 는 Phase 2 에 새로운 것 (loam 톤, 불 따뜻함, river-stone 패밀리).

# 프리뷰 — 스테이지별 패럴랙스 배경 (v0.75.1)

> 소유자: design-lead. 스펙: v0.75.1 패치가 요구하는 결과물 — 스테이지 2
> (해변), 3 (동굴), 4 (어두운 숲)에 대한 3-레이어 패럴랙스. 스테이지 1은
> Phase 2의 기존 `area1-{sky,mountains,trees}.svg` 레이어를 유지한다.
> **English version:** [`preview-bg-stages.md`](./preview-bg-stages.md)

이 패치는 **9개의 신규 SVG 패럴랙스 레이어**를 스테이지당 3 레이어 × 3
스테이지로 출시한다. 모든 SVG는 프로젝트의 논리 해상도와 일치하는 768 × 576;
수평으로 타일링 가능; 파일당 총 무게 ~3 KB 미만. 스크롤 팩터는
`src/graphics/ParallaxBackground.js`에서 적용 — 레이어별 권장 팩터는 아래.

## 레이어 명명 및 스크롤-팩터 컨벤션

| 레이어 접미사 | 권장 스크롤 팩터 | 역할                                  |
|---------------|-----------------:|---------------------------------------|
| `-sky`        | **0.0**          | 정적 배경; 전체 캔버스를 채움.        |
| `-mid`        | **0.3**          | 느린 패럴랙스; 지평선 레벨 디테일.    |
| `-fg`         | **0.7**          | 빠른 패럴랙스; 가까운-전경 밴드.      |

이 팩터는 기존 스테이지 1 / Phase 2 컨벤션과 일치한다 (sky 0.0, mountains
0.3, trees 0.6–0.7, 기존 `area1-trees.svg` 헤더 노트에 따라). 개발자는
`ParallaxBackground.js`에서 파일별로 튜닝할 수 있다; 위 값은 각 SVG가 작성된
기준이다.

## 스테이지 2 — 해변 (열린 바다 위의 햇볕-따스한 새벽)

파일:
- `assets/bg/area1-stage2-shore-sky.svg` (팩터 0.0)
- `assets/bg/area1-stage2-shore-mid.svg` (팩터 0.3)
- `assets/bg/area1-stage2-shore-fg.svg`  (팩터 0.7)

### `-sky` (팩터 0.0)

수직 새벽 그라데이션: 맨 위에 pale gold-amber (`#f8d878`), 따뜻한 amber
(`#e8a040`)를 거쳐 mauve 헤이즈 (`#c89a98`)로 깊어졌다가, sea-mist 블루
(`#8a9aa8`)와 바닥의 sea-deep ripple-pale (`#6a90a8`)로 식어든다. 위쪽과
중간의 부드러운 cream-white 구름 밴드 세 개가 그라데이션을 분리한다; 가장
자리가 0 불투명도로 페이드되어 레이어가 수평으로 타일링된다. row 386의
얇은 sun-amber 캐치가 하늘과 바다가 만나는 곳에 위치한다 — 이것이 지평선이다.
지평선 아래, 희미한 반사 밴드가 따스함을 위쪽 바다로 2 픽셀 더 이어간다.
작은 **등대 실루엣**이 (548, 360)에 위치 — 베이스 + 타워 + 랜턴을 위한 3개의
쌓인 사각형, 모두 바이올렛 잉크 (`#3a2e4a`), 작은 amber 랜턴 캐치와 랜턴
레벨의 두 부드러운 amber 글로우 패치. 이것이 스토리 브리프에 따른 스테이지 2
시그너처 비트.

### `-mid` (팩터 0.3)

먼 바다: 평평한 sea-deep 밴드 (`#3a586a`)가 캔버스 중앙을 채우고, 그 아래
sea-deep dark (`#2a4258`)로 깊어진다. 얇은 dawn-amber 반사 스킴 (`#e8a040`,
다음 `#f8d878`)이 지평선 바로 아래의 파도 꼭대기에서 반짝인다. 13개의 작은
ripple-pale 슬래시 (`#6a90a8`)가 바다 표면 전체에 분포하며 파도 꼭대기를
암시한다. 5개의 amber-tipped 파도 피크가 지평선 근처에 있어 새벽 반사 큐를
제공한다. 두 개의 희미한 wet-shelf-stone 육지 덩어리가 좌하/우하 모서리의
sea-mist로 후퇴한다 — 안개로 후퇴하는 먼 헤드랜드, 가까운 가장자리를 따라
얇은 shore-moss (`#6a8a4a`) 액센트.

### `-fg` (팩터 0.7)

가까운 해안: row 525의 얇은 damp-sand 밴드 (`#e8d4a0`), 그 아래 약간 더
시원한 wet-shelf-stone 스트립 (`#8a9a96`). 20개의 긴 dune-grass 블레이드
스트로크 (`#6a8a4a` shore-moss)가 바닥 가장자리에서 솟아오르며, 각각 ~25
픽셀 길이로 바람에 휘청이는 듯 굽는다. 20개 블레이드 중 10개는 아침 빛을
위한 dawn-amber 팁 캐치 (`#e8a040`)를 가진다. 4개의 dune-curve 바이올렛
그림자 (`#3a586a` sea-deep, 낮은 불투명도)가 맨 아래에 있어 실루엣을 부드럽게
하고 전경을 시원하게 끌어내 영웅의 따스함이 두드러지도록 한다.

## 스테이지 3 — 동굴 (먼 amber-vein 글로우가 있는 폐쇄된 지하)

파일:
- `assets/bg/area1-stage3-cave-sky.svg` (팩터 0.0)
- `assets/bg/area1-stage3-cave-mid.svg` (팩터 0.3)
- `assets/bg/area1-stage3-cave-fg.svg`  (팩터 0.7)

### `-sky` (팩터 0.0)

동굴 천장. 맨 위의 cave-moss-blue-green dark (`#284844`)에서 cave
under-base (`#3a4248`)를 거쳐 cave-moss-blue-green base (`#3a5e58`)로,
바닥의 wet-cave-stone shadow (`#4a5860`)에 정착하는 수직 그라데이션. 중간
지평선에 중심을 둔 부드러운 amber 워시 (`#e8a040`, 낮은 불투명도)가 바위
뒤 어딘가의 먼 amber-vein 글로우로 읽힌다 — 플레이어에게 "여기 아래에
따스함이 존재하지만, 가까이는 아니다"를 말한다. 다양한 깊이의 10개 바이올렛-
잉크 종유석이 위쪽 가장자리에서 매달려 있다 — 동굴의 시그너처 천장 텍스처.
7개의 더 부드러운 cave-stone-shadow 종유석이 깊이를 위해 뒤에 있다. 5개의
작은 석순이 아래 지평선에서 솟아오르며, 플레이어가 통과할 수 있는 전경이
아니라 멀리 있는 바닥 형성으로 읽힐 만큼 충분히 멀리 있다.

### `-mid` (팩터 0.3)

깊은 동굴 벽. wet-cave-stone shadow (`#4a5860`) 밴드가 중간-하단 수직 범위를
채우고, 약간 더 따뜻한 wet-cave-stone (`#6a7878`) 오버레이가 앞에 있다.
6개의 부드러운 수직 mineral-deposit 스트라이프 (`#c8d4c8` cave-stone
catchlight, 낮은 불투명도)가 벽 전체에 ~110 픽셀 간격으로 분포하며 깊이로
후퇴하는 결정 기둥으로 읽힌다. 4개의 amber-vein 줄무늬 (`#e8a040`, 낮은
불투명도)가 벽을 수직으로 통과한다; 각각 중간 지점에 더 밝은 peak-amber
핀포인트 (`#f8d878`) 하나를 가지며, 동굴 타일셋의 `crystal_vein` 해저드를
반영한다. 5개의 먼 cave-stone 노두 (`#7a8088` river-stone-grey, 낮은
불투명도)가 베이스에 있고, 3개는 상단에 드문 cave-moss-blue-green
(`#3a5e58`) 액센트를 가진다.

### `-fg` (팩터 0.7)

가까운 동굴 벽. 6개의 hanging cave-moss 가닥 (`#3a5e58`)이 이 레이어의 위쪽
가장자리에서 늘어져 있으며, 각각 약 110 픽셀 높이의 눈물방울-곡선 — 동굴
내부에서 본 무성한 동굴-입구 잎으로 읽힌다. 6개의 더 어두운
cave-moss-blue-green under-strands (`#284844`)가 깊이를 위해 뒤에 있다.
맨 베이스를 따라 4개의 부서진 cave-stone 파편 — wet-cave-stone에 cave-
stone-catchlight 위쪽 면을 가진 두꺼운 웨지 실루엣. 4개의 amber-vein
핀포인트 (`#e8a040`)가 각 돌의 베이스에서 반짝이며, 동굴의 시그너처 따스함
슬롯을 가까운-전경 깊이에서 다시 진술한다.

## 스테이지 4 — 어두운 숲 (반딧불이 있는 달빛 캐노피)

파일:
- `assets/bg/area1-stage4-darkforest-sky.svg` (팩터 0.0)
- `assets/bg/area1-stage4-darkforest-mid.svg` (팩터 0.3)
- `assets/bg/area1-stage4-darkforest-fg.svg`  (팩터 0.7)

### `-sky` (팩터 0.0)

캐노피 위의 깊은 밤하늘. 맨 위의 dark-forest under-base (`#1e2032`)에서
dark-canopy blue-green dark (`#2a3a3a`)과 mid (`#3e5a52`)를 거쳐, 바닥의
canopy-shadow-violet (`#684e6e`)으로 정착하는 수직 그라데이션. **달 글로우**
래디얼 그라데이션이 위에 레이어되어 있으며, 캔버스의 (50%, 18%)에 중심을
두고 있다 — 부드러운 moonlight-silver-cream (`#cfd8dc`) 래디얼 페이드. 달
자체는 (384, 100)에 작은 pale 디스크로 위치하며, 왼쪽 위에 더 밝은 흰색
캐치 (`#fff4e8`). 희미한 수직 달빛 컬럼이 달에서 아래쪽 캔버스를 통해 아래로
확장되어, 보스 아레나로 내려오는 달빛 컬럼을 암시한다. **6개의 반딧불 포인트**
(`#e8a040`)가 위쪽 중간 캔버스에 흩어진다; 3개는 더 가까운 반딧불을 위해 더
밝은 peak-amber 캐치 (`#f8d878`)를 가진다. 바닥의 희미한 캐노피 밴드
(`#1e2032`, 낮은 불투명도)가 다음 패럴랙스 레이어를 암시한다.

### `-mid` (팩터 0.3)

중간-거리 숲. dark-canopy blue-green dark (`#2a3a3a`) 먼 캐노피 능선이
위쪽-1/3을 가로지르며, 약간 더 가벼운 dark-canopy mid (`#3e5a52`)가 그 아래
바닥의 60%를 채운다. **7개의 비뚤어진-줄기 실루엣**이 canopy-shadow-violet
(`#684e6e`)으로 캐노피를 통해 수직으로 솟아오른다; 그들의 불규칙한 구불구불한
모양은 오래된 나무를 암시한다. 5개는 달-방향 면을 따라 moonlight-silver 림
스트로크 (`#cfd8dc`, 낮은 불투명도)를 가진다. 5개의 드문 pale-moss 하이라이트
클러스터 (`#5a8a4a`, 낮은 불투명도)가 줄기에 있어, 보스가 공유하는
cairn-mantle moss 패밀리를 다시 진술한다.

### `-fg` (팩터 0.7)

가까운 잎. 7개의 늘어진 canopy-shadow-violet (`#684e6e`) 잎 클러스터가 이
레이어의 위쪽 가장자리에 늘어져 있다. 6개의 velvet under-flame violet
(`#5a4a6e`) under-잎 스트라이프가 뒤에 있어 실루엣을 깊게 한다. 10개의 어두운
이끼 더미 스트로크 (`#3e5a52`)가 맨 베이스에서 솟아오른다. 더미 중 7개는 팁에
moonlight-silver-cream 캐치 (`#cfd8dc`)를 가진다 — 이것이 어두운 숲의 시그너처
따스함 슬롯이며, **달빛 silver**이지 dawn-amber가 아니다 (palette-phase3.md
크로스-스프라이트 일관성 규칙에 따라: 어두운 숲은 silver-cream으로 식어가며
amber는 최종 cairn sigil-fleck을 위해 예약).

## 리뷰어를 위한 읽기 노트

- 각 스테이지의 세 레이어는 멀리서 **하나의 무드**로 읽혀야 한다. 한 레이어가
  단독으로 동반자에 비해 너무 시원하거나 너무 따뜻해 보인다면, 레이어-간
  상호작용은 ParallaxBackground.js opacity 오버라이드를 통해 조정할 수 있다.
- 어두운 숲은 amber 대신 moonlight-silver를 시그너처 따스함으로 사용하는
  유일한 스테이지 4 레이어 세트다. Phase 3 팔레트 규칙에 따라 — 플레이어는
  스테이지 전체를 silver만 보며 걸어가다, 스테이지 끝의 cairn에서 amber를
  만나고 그 직후 Bracken Warden의 가슴 시질에서 만난다. 스테이지 4에서 amber를
  거부하는 것은 의도적인 전조 선택이다.
- 스테이지 2 sky의 등대 실루엣은 v0.75.1 패럴랙스 세트의 **유일한 내러티브
  실루엣**이다 — 스테이지 2에 대한 스토리 브리프 시그너처 비트에 따라. 동굴
  (스테이지 3)에는 동등한 시그너처 실루엣이 없다; 그 무드는 멀리 있는
  amber-vein 글로우에서 온다. 어두운 숲 (스테이지 4)에는 달이 시그너처
  실루엣으로 있다.

## v0.75.1 이후 누적 패럴랙스 SVG 인벤토리

| 스테이지 | Sky                                                | Mid                                                  | Fg                                                  |
|----------|----------------------------------------------------|------------------------------------------------------|-----------------------------------------------------|
| 1        | `area1-sky.svg` (Phase 2)                          | `area1-mountains.svg` (Phase 2)                      | `area1-trees.svg` (Phase 2)                         |
| 2        | `area1-stage2-shore-sky.svg` (v0.75.1)             | `area1-stage2-shore-mid.svg` (v0.75.1)               | `area1-stage2-shore-fg.svg` (v0.75.1)               |
| 3        | `area1-stage3-cave-sky.svg` (v0.75.1)              | `area1-stage3-cave-mid.svg` (v0.75.1)                | `area1-stage3-cave-fg.svg` (v0.75.1)                |
| 4        | `area1-stage4-darkforest-sky.svg` (v0.75.1)        | `area1-stage4-darkforest-mid.svg` (v0.75.1)          | `area1-stage4-darkforest-fg.svg` (v0.75.1)          |

**프로젝트의 총 패럴랙스 SVG: 12** (스테이지 1의 3개 + v0.75.1의 9개 신규).

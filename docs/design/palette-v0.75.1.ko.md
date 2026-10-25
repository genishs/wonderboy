# 팔레트 부록 — v0.75.1

> 소유자: design-lead. [`palette-phase3.md`](./palette-phase3.md)에 대한 패치
> 부록. 컴패니언 브리프: `docs/briefs/phase3-area1-expansion.md` §15 (과일
> 픽업) 및 §16 (Threadshade), `docs/briefs/phase3-boss-cast.md` (dawn-husk
> burst).
>
> **English version:** [`palette-v0.75.1.md`](./palette-v0.75.1.md)

이 문서는 v0.75.1 패치가 도입한 팔레트 변경 사항을 기록한다. v0.75.1은 두 개의
과일 픽업(`dewplum`, `amberfig`), 수직 전용 적(`Threadshade`), dawn-husk 폭발용
껍질 파편(`husk-shell`), 9개의 패럴랙스 SVG(스테이지 2–4 각각 3개)를 추가하는
소규모 자산 패치다. 기존 dawn-husk 스프라이트도 `burst` 애니메이션 키로 확장되며
(확장에는 신규 hex가 사용되지 않음 — 기존 팔레트 재사용).

누적 팔레트 예산은 여전히 여유가 있다: v0.75.1은 **4개의 신규 hex 값**을 추가하여
프로젝트 누적 총계가 92에서 **96**으로 늘어났으며, 120색 상한선까지 **24색의
여유**가 남아 있다.

## v0.75.1 모듈 목록

| 모듈                                                 | 종류   | 모듈별 팔레트 길이 | 신규 hex |
|------------------------------------------------------|--------|-------------------:|---------:|
| `assets/sprites/item-dewplum.js`                     | sprite | 8                  | 1        |
| `assets/sprites/item-amberfig.js`                    | sprite | 10                 | 1        |
| `assets/sprites/enemy-threadshade.js`                | sprite | 9                  | 2        |
| `assets/sprites/item-husk-shell.js`                  | sprite | 6                  | 0        |
| `assets/sprites/item-dawn-husk.js` (확장)             | sprite | 8 (변경 없음)      | 0        |
| `assets/bg/area1-stage2-shore-*.svg` (3 레이어)       | bg     | n/a                | 0        |
| `assets/bg/area1-stage3-cave-*.svg` (3 레이어)        | bg     | n/a                | 0        |
| `assets/bg/area1-stage4-darkforest-*.svg` (3 레이어)  | bg     | n/a                | 0        |

> **정정 노트:** 위 표의 스프라이트별 신규 hex 합계는 4이며 (요약 문장의 3이
> 아님). 4개의 신규 hex는 `#a8c8d8`, `#a85820`, `#7a5a48`, `#fff8e8` 이다.
> 모두 v0.75.1에서 처음 등장하므로 이 패치는 누적 총계에 **4**를 더한다.

**정정된 누적:** Phase 1 (34) + Phase 2 (31) + Phase 3 (27) + v0.75.1 **(4)** =
**96개의 distinct hex** 프로젝트 합계. 120색 예산 대비 **24색의 여유**.

## v0.75.1에서 신규 도입된 hex

| Hex       | 역할                                                                     | 최초 사용 모듈                  |
|-----------|--------------------------------------------------------------------------|---------------------------------|
| `#a8c8d8` | dew-cool-cyan 하이라이트 — dewplum 왼쪽-위 곡선의 이슬-방울            | `item-dewplum.js`               |
| `#a85820` | amber-deep / 무화과-과육 그림자 — amberfig 본체 아래쪽 곡선 그림자       | `item-amberfig.js`              |
| `#7a5a48` | chitin-warm — Threadshade 위의 유일한 따뜻한 본체 색 (비-바이올렛/비-이끼) | `enemy-threadshade.js`          |
| `#fff8e8` | thread-shimmer-pale — Threadshade drift 프레임의 실 펄스 하이라이트       | `enemy-threadshade.js`          |

## v0.75.1 모듈이 그대로 재사용하는 hex

과일 픽업, Threadshade 본체, husk-shell 파편, 그리고 9개의 패럴랙스 SVG는
모두 가능한 한 Phase 1 / Phase 2 / Phase 3의 hex를 그대로 재사용하여 패치
팔레트를 얇게 유지하고 프로젝트의 시각적 코드를 통일한다.

### 과일 픽업 재사용

| Hex       | 이전 역할                                            | v0.75.1 재사용                                                |
|-----------|------------------------------------------------------|---------------------------------------------------------------|
| `#3a2e4a` | 보편 바이올렛 잉크 (P1+P2+P3)                        | dewplum + amberfig 실루엣 윤곽선                              |
| `#3a586a` | sea-deep base (P3 해변 타일셋)                       | dewplum 본체 메인 면                                          |
| `#2a4258` | sea-deep dark (P3 해변 타일셋)                       | dewplum 하단 곡선 그림자                                      |
| `#e8a040` | dawn-amber 림 (P1+P2)                                | dewplum 익은 림 + amberfig 본체 미드 + amberfig 잎-펄스       |
| `#4a7c3a` | moss-green base (P1+P2)                              | dewplum 작은 줄기 잎-컬 + amberfig 잎-팁 미드                 |
| `#e8d4a0` | cuff-cream (P1+P2)                                   | dewplum frame-1 시머 이슬 + amberfig pale-cream 하이라이트    |
| `#f8d878` | amber-bright / sapling 플레어 (P1+P2)                | amberfig 본체 밝은 캐치                                       |
| `#4a3422` | wet-bark-brown (P1+P2)                               | amberfig 줄기-옹이                                            |
| `#2e5028` | moss-green dark (P1+P2)                              | amberfig 잎 아래-그림자                                       |
| `#fff2c0` | sigil core-bright (P3 — 이전에는 보스 전용)           | amberfig 피크 펄스 광채 (밝은-시질 패밀리를 과일 픽업으로 확장)|

### Threadshade 재사용

| Hex       | 이전 역할                                  | v0.75.1 재사용                              |
|-----------|--------------------------------------------|---------------------------------------------|
| `#3a2e4a` | 보편 바이올렛 잉크                          | Threadshade 실루엣 윤곽선                   |
| `#5a4a6e` | velvet under-flame 본체 딥 (P2 fire_low)    | Threadshade 본체 딥-셰이드                  |
| `#684e6e` | canopy-shadow-violet (P3 어두운 숲)         | Threadshade 배-아래 바이올렛                |
| `#3e6a3a` | bracken-frond deep (P3 보스)                | Threadshade 등-점박이 이끼                  |
| `#e8a040` | dawn-amber (P1+P2)                          | Threadshade 눈-광채                         |
| `#cfd8dc` | moonlight-silver-cream (P3 어두운 숲)       | Threadshade 실                              |

### husk-shell 재사용

| Hex       | 이전 역할                                  | v0.75.1 재사용                              |
|-----------|--------------------------------------------|---------------------------------------------|
| `#3a2e4a` | 보편 바이올렛 잉크                          | husk-shell 파편 윤곽선                      |
| `#a8794a` | shell-loam base (P2 dawn-husk)              | husk-shell 파편 메인 면                     |
| `#7a5238` | shell-loam shadow (P2 Mossplodder + husk)   | husk-shell 파편 어두운 면                   |
| `#e8d4a0` | cuff-cream (P1+P2)                          | husk-shell 파편 새벽-측 점박이              |
| `#e8a040` | dawn-amber 림 (P1+P2)                       | husk-shell 파편 잔광 림                     |

### 패럴랙스 SVG 재사용

9개의 SVG 모두 기존 Phase 3 스테이지 타일 팔레트에서만 색을 가져온다.
어떤 배경 레이어에도 신규 hex가 도입되지 않는다.

| 스테이지 | 레이어 | 주요 사용 hex                                                                |
|----------|--------|------------------------------------------------------------------------------|
| 2        | sky    | `#f8d878`, `#e8a040`, `#c89a98`, `#6a90a8` (해변 타일 컬러 + 지평선 패밀리)  |
| 2        | mid    | `#3a586a`, `#2a4258`, `#6a90a8`, `#8a9a96`, `#e8a040`, `#6a8a4a`             |
| 2        | fg     | `#e8d4a0`, `#8a9a96`, `#6a8a4a`, `#e8a040`, `#3a586a`                        |
| 3        | sky    | `#284844`, `#3a4248`, `#3a5e58`, `#4a5860`, `#e8a040`, `#3a2e4a`             |
| 3        | mid    | `#4a5860`, `#6a7878`, `#c8d4c8`, `#e8a040`, `#f8d878`, `#7a8088`, `#3a5e58`  |
| 3        | fg     | `#3a5e58`, `#284844`, `#6a7878`, `#c8d4c8`, `#e8a040`                        |
| 4        | sky    | `#1e2032`, `#2a3a3a`, `#3e5a52`, `#684e6e`, `#cfd8dc`, `#fff4e8`, `#e8a040`, `#f8d878` |
| 4        | mid    | `#2a3a3a`, `#3e5a52`, `#684e6e`, `#cfd8dc`, `#5a8a4a`                        |
| 4        | fg     | `#684e6e`, `#5a4a6e`, `#3e5a52`, `#cfd8dc`                                  |

## 모듈별 팔레트 표

### `assets/sprites/item-dewplum.js` — 8개 항목

| Idx | Hex          | 역할                                          | 출처                    |
|----:|--------------|-----------------------------------------------|-------------------------|
|   0 | `#00000000`  | 투명                                          | 보편                    |
|   1 | `#3a2e4a`    | 바이올렛 잉크                                 | shared P1+P2+P3         |
|   2 | `#3a586a`    | 강-블루 본체 (sea-deep 패밀리)                | shore 타일셋과 공유     |
|   3 | `#2a4258`    | 강-블루 딥 (sea-deep dark 패밀리)             | shore 타일셋과 공유     |
|   4 | `#a8c8d8`    | dew-cool-cyan 하이라이트                      | **NEW v0.75.1**         |
|   5 | `#e8a040`    | dawn-amber 익은 림                            | shared P1+P2            |
|   6 | `#4a7c3a`    | leaf-curl moss-green 줄기                     | shared P1+P2            |
|   7 | `#e8d4a0`    | cuff-cream frame-1 시머                       | shared P1+P2            |

### `assets/sprites/item-amberfig.js` — 10개 항목

| Idx | Hex          | 역할                                          | 출처                    |
|----:|--------------|-----------------------------------------------|-------------------------|
|   0 | `#00000000`  | 투명                                          | 보편                    |
|   1 | `#3a2e4a`    | 바이올렛 잉크                                 | shared P1+P2+P3         |
|   2 | `#e8a040`    | dawn-amber 본체 미드                          | shared P1+P2            |
|   3 | `#f8d878`    | amber-bright 캐치                             | shared P1+P2            |
|   4 | `#a85820`    | amber-deep / 무화과-과육 그림자               | **NEW v0.75.1**         |
|   5 | `#e8d4a0`    | pale-cream 하이라이트 펄스                    | shared P1+P2            |
|   6 | `#4a3422`    | wet-bark-brown 줄기-옹이                      | shared P1+P2            |
|   7 | `#4a7c3a`    | leaf-curl moss-green 베이스                   | shared P1+P2            |
|   8 | `#2e5028`    | leaf-curl moss-green 다크                     | shared P1+P2            |
|   9 | `#fff2c0`    | fig-cream-bright 펄스 피크                    | P3 보스 시질 재사용     |

### `assets/sprites/enemy-threadshade.js` — 9개 항목

| Idx | Hex          | 역할                                          | 출처                    |
|----:|--------------|-----------------------------------------------|-------------------------|
|   0 | `#00000000`  | 투명                                          | 보편                    |
|   1 | `#3a2e4a`    | 바이올렛 잉크                                 | shared P1+P2+P3         |
|   2 | `#5a4a6e`    | velvet under-flame 본체 딥                    | shared P2               |
|   3 | `#684e6e`    | canopy-shadow-violet 배-아래                  | shared P3 어두운 숲     |
|   4 | `#7a5a48`    | chitin-warm 본체 큐                           | **NEW v0.75.1**         |
|   5 | `#3e6a3a`    | bracken-frond deep / moss-mottle              | shared P3               |
|   6 | `#e8a040`    | amber-pinprick 눈-광채                        | shared P1+P2            |
|   7 | `#cfd8dc`    | moonlight-silver-cream 실                     | shared P3 어두운 숲     |
|   8 | `#fff8e8`    | thread-shimmer-pale                           | **NEW v0.75.1**         |

### `assets/sprites/item-husk-shell.js` — 6개 항목

| Idx | Hex          | 역할                                          | 출처                    |
|----:|--------------|-----------------------------------------------|-------------------------|
|   0 | `#00000000`  | 투명                                          | 보편                    |
|   1 | `#3a2e4a`    | 바이올렛 잉크                                 | shared P1+P2+P3         |
|   2 | `#a8794a`    | shell-loam base (dawn-husk와 매칭)            | dawn-husk와 공유        |
|   3 | `#7a5238`    | shell-loam shadow                             | shared P2               |
|   4 | `#e8d4a0`    | cuff-cream 하이라이트                         | shared P1+P2            |
|   5 | `#e8a040`    | dawn-amber 잔광 림                            | shared P1+P2            |

### `assets/sprites/item-dawn-husk.js` (v0.75.1 확장) — 8개 항목 (변경 없음)

dawn-husk 모듈의 PALETTE 배열은 변경되지 않았다. 신규 `burst` 애니메이션 키
(3 프레임, 프리뷰 문서 참조)는 기존 PALETTE의 인덱스 1, 3, 4, 5, 6을
재사용한다. 추가된 hex는 없다.

## 크로스-스프라이트 일관성 규칙 — v0.75.1 패치 추가

- **모든 곳에 바이올렛 잉크.** 모든 신규 스프라이트와 SVG 실루엣은 `#3a2e4a`를
  사용한다. 프로젝트 보편 규칙. 과일 픽업, Threadshade, husk-shell 파편 모두
  예외 없음.
- **Dawn amber는 따뜻함 전용.** dewplum의 익은 림, amberfig 본체 전체,
  Threadshade의 눈-광채, husk-shell의 잔광 림 — v0.75.1의 네 가지 따뜻함 슬롯
  모두 `dawn-amber` 패밀리를 공유한다. amberfig의 최고-밝기 펄스(`#fff2c0`)는
  보스의 시질 코어-브라이트를 재사용하며, "최고-밝기 amber = 살아있고 특별함"
  읽기를 희귀 과일 픽업으로 의도적으로 확장한다 (플레이어는 amberfig를
  "dewplum보다 따뜻하고 워든의 따뜻함 패밀리 안에 있음"으로 읽는다).
- **순수 검정 없음.** Threadshade의 가장 깊은 본체 셀은 `#5a4a6e`
  (velvet under-flame); husk-shell의 그림자는 `#7a5238` (shell-loam shadow).
  모두 바이올렛-회색 또는 따뜻한-갈색, 결코 검정이 아님.
- **스테이지 패럴랙스 SVG는 자신의 스테이지 타일셋 팔레트에서만 가져온다.**
  9개의 SVG 레이어 각각은 자신의 스테이지 타일 모듈 팔레트에서만 hex를
  선택한다 — 그래서 패럴랙스는 항상 그 스테이지의 일부처럼 느껴지고 이질적이지
  않다. 어떤 배경 레이어도 신규 hex를 도입하지 않았다.
- **단일 신규 잉크-패밀리 확장.** Threadshade는 `#7a5a48` — chitin-warm —
  을 도입한다. 이는 `#a8744a` (보스 stone-joinery warm)와 `#7a5238`
  (shell-loam shadow) 사이에 위치한다. Threadshade 위에서 유일하게 따뜻한
  본체 색이며 patient 무드를 전달한다: 그 생물은 살아있지만 "나머지 세계와
  같은 나무와 껍질로 이루어진" 것으로 읽힌다.

## 예산

- 상한 (프로젝트): ≤ 120개의 distinct color 총계.
- Phase 1: 34개의 distinct hex.
- Phase 2: 31개의 distinct hex (30 v0.50 + 1 v0.50.2 스프린트 트레일).
- Phase 3: 27개의 distinct hex (테마 리맵 + 히어로 재구축).
- v0.75.1: **4개의 신규 distinct hex**.
- 누적: **96개의 distinct hex.** v1.0 폴리시까지 **24색의 여유**.

v0.75.1 델타는 프로젝트가 지금까지 출시한 단일-패치 팔레트 델타 중 가장 작으며,
이는 "소규모 추가 콘텐츠 패치" 범위와 일치한다.

## 미결 질문

발행 시점에 없음. v0.75.1 hex `#fff8e8` (thread-shimmer-pale)는 시각적으로
`#cfd8dc` (moonlight-silver-cream)와 매우 가깝다; 향후 재방문 시 프로젝트
예산이 빠듯해지면 두 색을 합칠 수 있다. 지금은 약간 더 밝은 시머가
Threadshade 실의 patient-breath 읽기에 도움이 된다.

# Phase 2 마스터 팔레트

> 소유: design-lead. `docs/briefs/phase2-cast-revision.md` 와
> `docs/briefs/phase2-areas.md` 의 동반 문서. 무드 앵커:
> `docs/story/world.md` ("주전자처럼 따뜻한 아침, 금속이 아닌 나무빛, 잔혹하지
> 않은 부드러움. 강물 청록으로 식힌 층층의 녹색 위에 새벽 호박빛을 얹어 데움.
> 그림자는 보랏-회색이지, 결코 검정은 아니다").
>
> **Phase 1 문서:** [`palette.md`](./palette.md) — 종결 (수정 금지).
> **English:** [`palette-phase2.md`](./palette-phase2.md) (canonical)

이 파일은 v0.50 에서 추가된 **Phase 2** 스프라이트, 타일, SVG 모듈이 사용하는 모든 별개의 hex 값을 인벤토리하고, Phase 1 에서 그대로 재사용된 hex 들을 명시한다 (시각적으로 갈라지지 않도록). 각 모듈별 팔레트는 바이트 비용을 위해 개별적으로 튜닝되며, 이 문서는 그것을 종합한다.

## Phase 2 모듈 목록

| 모듈                                          | 종류   | 모듈별 팔레트 길이        |
|-----------------------------------------------|--------|--------------------------:|
| `assets/sprites/hero-reed.js` (확장)           | sprite | 16 (이전 13; 해치트용 +3) |
| `assets/sprites/projectile-stone-hatchet.js`  | sprite | 10                        |
| `assets/sprites/enemy-mossplodder.js`         | sprite | 9                         |
| `assets/sprites/enemy-hummerwing.js`          | sprite | 9 (알파 항목 3 개 포함)   |
| `assets/sprites/item-dawn-husk.js`            | sprite | 8                         |
| `assets/tiles/area1.js`                       | tile   | 16                        |
| `assets/bg/area1-sky.svg`                     | svg    | 6 개의 별개 fill          |
| `assets/bg/area1-mountains.svg`               | svg    | 7 개의 별개 fill          |
| `assets/bg/area1-trees.svg`                   | svg    | 4 개의 별개 fill          |

## 합계

| 지표                                                 | 개수  |
|------------------------------------------------------|------:|
| Phase 2 에서 도입된 새로운 별개 hex 값               | **30**|
| Phase 1 에서 그대로 재사용된 별개 hex 값             | **9** |
| Phase 2 모듈이 건드리는 총 별개 hex                  | 39    |
| 모듈별 항목 합 (스프라이트 + 타일)                   | 68    |

누적 프로젝트 팔레트 (Phase 1 + Phase 2 별개) 는 **64** 개 hex 값이다 (Phase 1 의 34 + Phase 2 의 새로운 30). `palette.md` 에 명시된 120-색 프로젝트 예산 대비 충분한 여유가 있다.

## Phase 1 과 그대로 공유하는 hex

이 9 개 hex 값은 Phase 1 과 Phase 2 모듈 양쪽에 등장한다 — 의도적인 재사용으로, 시각적 정체성이 통합된 채로 유지된다. 이들은 프로젝트가 모든 장면에서 연주하는 화음이다.

| Hex          | Phase 1 역할                                  | Phase 2 재사용 위치                                     |
|--------------|----------------------------------------------|---------------------------------------------------------|
| `#00000000`  | 투명 (모든 모듈)                              | 모든 Phase 2 모듈이 인덱스 0 에 예약                    |
| `#3a2e4a`    | Reed/Crawlspine/Glassmoth/Sapling 통합 보랏 그림자 | 해치트 외곽선, Mossplodder 외곽선, Hummerwing 외곽선, husk 외곽선, 타일 외곽선, mountains.svg 의 ruin-stone 스트로크 |
| `#4a7c3a`    | Reed 튜닉 모스-그린 베이스                    | Mossplodder 상단 모스 패치, Area 1 타일 모스-탑, mountains 캐노피, trees 레이어 베이스 |
| `#2e5028`    | Reed 튜닉 그림자 / Sapling 침엽 베이스         | Mossplodder 모스 그림자, Area 1 타일 모스-다크, mountains 캐노피 언더-섀도 |
| `#e8d4a0`    | Reed 커프-크림 하이라이트                      | Mossplodder 배 솔기, dawn-husk 점박이, mile-marker 판자 면, cairn 시길-스톤 |
| `#e8a040`    | Sapling 새벽-호박 코어 (플레어)               | 해치트 splash 스파크, Hummerwing 흉부 베이스, dawn-husk 새벽-림, area1 뿌리 하이라이트, trees-레이어 이슬 끝 |
| `#f8d878`    | Sapling 호박-밝음 (플레어 피크)                | 해치트 splash 팁, dawn-husk 깨짐 플래시, 불꽃 혀 끝     |
| `#5a3a22`    | Crawlspine/Sapling 나무껍질 베이스             | dawn-husk 어두운 점, area1 로움-소일 그림자             |
| `#f4e8f0a0`  | Glassmoth 진주-유리 반투명 fill (~63% α)       | Hummerwing 날개-haze 안쪽 반투명 — 동일 반투명 정책      |
| `#e0c8d870`  | Glassmoth 진주-유리 깊은 (~44% α)              | Hummerwing 날개-haze 깊은 반투명                        |
| `#fff4f0c0`  | Glassmoth 날개 먼지 트레일 (~75% α)            | Hummerwing 날개-haze 가장자리                           |

(전체 11 개 항목 — `#00000000` + 10 개의 색조 값. 위 합계 행에서는 Phase 1 문서의 회계 방식과 맞추기 위해 "공유 9 개" 로 집계했다 — Phase 1 문서에서도 투명 인덱스와 알파 형제는 별개-색 예산에서 제외했었다.)

## 색상 그룹 (mood → role → hex) — Phase 2 만

### 숲 녹색 — "moss-green"

Phase 2 는 새로운 순녹색 hex 를 도입하지 않는다. Mossplodder 의 상단 모스, area1 타일 모스 스트립, parallax 캐노피 모두 Phase 1 의 `#4a7c3a` (튜닉 베이스) 와 `#2e5028` (튜닉 그림자) 를 재사용한다. 새로운 옅은 모스-가닥 색 하나가 추가된다:

| Hex       | 역할                                | 사용처                       |
|-----------|--------------------------------------|------------------------------|
| `#a0b878` | 모스-가닥 옅음 (Mossplodder 트레일링 가닥) | enemy-mossplodder            |
| `#3e6a3a` | 근접 캐노피 잎 (parallax)            | bg/area1-trees               |
| `#6e8868` | 원거리 능선 시원한 녹색              | bg/area1-mountains           |
| `#5a7858` | 중간 능선 시원한 녹색                | bg/area1-mountains           |

### 로움 / 나무껍질 / 흙 — "loam-warm"

area1 지면 타일 팔레트의 앵커.

| Hex       | 역할                                          | 사용처                       |
|-----------|-----------------------------------------------|------------------------------|
| `#8a6038` | 로움-소일 베이스                              | tiles/area1 (flat, slopes)   |
| `#4a3422` | 젖은-나무껍질-갈색 (Mossplodder 껍질-로움 그림자와도 공유) | enemy-mossplodder, tiles/area1 |
| `#7a5238` | 껍질-로움 베이스 / dawn-husk 하부-베이스      | enemy-mossplodder, item-dawn-husk |
| `#a8794a` | 껍질-로움 중간 (dawn-husk 점박이 면)           | item-dawn-husk               |

### 돌 — "river-stone-grey / chip-stone-grey"

| Hex       | 역할                                  | 사용처                                        |
|-----------|---------------------------------------|-----------------------------------------------|
| `#7e858e` | chip-stone-grey 베이스 (해치트 머리)   | hero-reed (확장), projectile-stone-hatchet    |
| `#5a6068` | chip-stone-grey 그림자                 | hero-reed (확장), projectile-stone-hatchet    |
| `#b8c0c8` | chip-stone-grey 하이라이트             | projectile-stone-hatchet                      |
| `#7a8088` | river-stone-grey 베이스                | tiles/area1 (rock_small, cairn), bg/area1-mountains |
| `#a8b0b8` | river-stone 하이라이트                 | tiles/area1, bg/area1-mountains               |
| `#4a5058` | river-stone 그림자                     | tiles/area1                                   |

### 천 — "cloth-wrap-tan"

| Hex       | 역할                                       | 사용처                                       |
|-----------|--------------------------------------------|----------------------------------------------|
| `#c89a68` | cloth-wrap-tan (해치트 손잡이 감음)        | hero-reed (확장), projectile-stone-hatchet  |
| `#7a5a3a` | cloth-wrap 그림자                          | projectile-stone-hatchet                     |

### 불 — "fire-warmth"

cast brief §8 + world.md 에 따라: 순수 검정 절대 금지; 불 그림자조차 보랏빛이다.

| Hex       | 역할                                            | 사용처                |
|-----------|-------------------------------------------------|-----------------------|
| `#e85020` | 불 베이스 오렌지 (가장 뜨거운 코어)             | tiles/area1 (fire_low) |
| `#f8a040` | 불 중간 (새벽-호박과 가까운 사촌, 조금 더 붉음) | tiles/area1 (fire_low) |
| `#5a4a6e` | 보랏 언더-flame 워시 (검정 언더-flame 라인 대체) | tiles/area1 (fire_low), Mossplodder 지면 그림자 |

### Hummerwing — "sunwarm-amber"

| Hex       | 역할                            | 사용처              |
|-----------|---------------------------------|---------------------|
| `#a86018` | sunwarm-amber 그림자             | enemy-hummerwing    |
| `#f8d4c8` | dust-pink 등 광택 (Phase 1 `#d89aa8` 의 밝은 형제) | enemy-hummerwing    |
| `#f8b860` | amber-underglow                 | enemy-hummerwing    |

### 새벽 (하늘 / 대기)

| Hex       | 역할                              | 사용처          |
|-----------|-----------------------------------|-----------------|
| `#f8d068` | 하늘 새벽-warm 정점               | bg/area1-sky    |
| `#f8b878` | 하늘 새벽-호박 띠                 | bg/area1-sky    |
| `#e8a888` | 하늘 dust-rose 중간 띠            | bg/area1-sky    |
| `#c89a98` | 하늘 하부 haze (dust-rose 어두움) | bg/area1-sky    |
| `#8a8aa8` | 하늘 가장 낮은 violet-haze        | bg/area1-sky    |
| `#9aa0b8` | 하늘 시원한-wash 띠               | bg/area1-sky    |
| `#fff4e8` | 구름-띠 warm-cream                | bg/area1-sky    |
| `#f8e4d0` | 구름-띠 복숭아                    | bg/area1-sky    |
| `#f0d4c0` | 구름-띠 rose-어두움               | bg/area1-sky    |
| `#e8c4b8` | 구름-띠 가장 낮은                 | bg/area1-sky    |

(하늘 레이어는 그라디언트 stop + ellipse fill 을 쓴다 — 스프라이트 모듈보다 풍부한 서브-팔레트지만, 단일 레이어에 한정된다.)

## 외곽선 & 그림자 (Phase 2 — Phase 1 에서 재사용)

Phase 2 는 새로운 외곽선 색을 도입하지 않는다. v0.50 의 모든 실루엣은 Phase 1 의 통합 보랏 `#3a2e4a` 를 외곽선으로 사용한다. 의도적이다: Mossline Path 는 Reed (Phase 1 에서 이미 정립) 가 가져오는 모든 것과 하나의 연속된 시각적 화음으로 읽혀야 한다.

Phase 1 외곽선 방언 (Reed/Sapling 침엽 `#1a2618` / `#1a2418`, Crawlspine 깊은-나무껍질 `#1a1410`) 은 Phase 2 활성 게임플레이에서 재사용되지 않는다. Phase 1 적은 은퇴했기 때문이다 (cast §10). 통합 보랏 외곽선이 v0.50 의 규칙이다.

## 반투명 정책

Hummerwing 은 Glassmoth 알파 정책을 그대로 재사용한다 — 동일한 세 개의 알파 hex 값 (`#f4e8f0a0`, `#e0c8d870`, `#fff4f0c0`) 을 날개-haze 레이어에 그대로 사용한다. Phase 1 계약에 따라: 인덱스 0 은 완전 투명용 예약을 유지하고, 부분-알파 인덱스는 그 예약 대상이 아니다. 후일 어느 Area 에서 Glassmoth 가 돌아온다면 Hummerwing 날개와 시각적으로 운율을 맞춰야 한다 — 그들은 사촌처럼 보여야 한다.

## 스프라이트 간 일관성 규칙 — Phase 2

- **모든 곳에 보랏 외곽선.** 모든 Phase 2 실루엣 외곽선은 `#3a2e4a` 를 사용한다.
- **새벽 호박은 따뜻함을 위해 예약된다.** Reed 의 피부 (Phase 1), Hummerwing 흉부, dawn-husk 동쪽 림, 불 혀, sapling-flare 메아리 (`#e8a040`) 모두 같은 family 를 공유한다 — 플레이어가 Area 1 에서 따뜻함을 찾을 때마다 호박을 만난다.
- **순수 검정 금지, 불 아래에서도.** 불의 가장 낮은 셀은 `#5a4a6e` (보랏 언더-flame 워시) 를 쓴다 — world.md 의 규칙은 v0.50 에서 가장 "검정을 얻을 만한" 스프라이트에서도 강제된다.
- **시원한-녹색 parallax + 따뜻한-호박 Hummerwing = "따뜻한 스파크가 시원하게 떨어진다"** 킬 프레임. cast brief §4.5 가 이 대비 프레임을 명시적으로 호명한다; 팔레트는 그 순간이 작동하도록 튜닝되었다.

## 예산

- 캡 (프로젝트): ≤ 120 개 별개 색.
- Phase 1: 34 개 별개 hex.
- Phase 2: 30 개 새로운 별개 hex (39 개 건드림, 9 개 공유).
- 누적: 64 개 별개 hex. **Phase 3-4 를 위한 56 색의 여유**.

# Phase 3 마스터 팔레트

> 소유: design-lead. 동반 문서: `docs/briefs/phase3-area1-expansion.md` 및
> `docs/briefs/phase3-boss-cast.md`. 무드 기준: `docs/story/world.md` ("주전자처럼
> 따뜻한 아침, 금속이 아니라 나무 같은, 험상궂지 않고 부드러운. 그림자는 절대
> 검은색이 아니라 보랏빛 회색"). Phase 3는 Area 1을 숲의 가장자리(Stage 1)에서
> 동굴(Stage 2), 강가(Stage 3), 고대 유적(Stage 4)으로 확장하고, Area 1의 보스
> 인 Bracken Warden 그리고 moss-pulse 충격파 발사체를 추가한다.
>
> **Phase 1 문서:** [`palette.md`](./palette.md) — 종결됨; 수정 금지.
> **Phase 2 문서:** [`palette-phase2.md`](./palette-phase2.md) — 종결됨; 수정 금지.
> **영문 원본:** [`palette-phase3.md`](./palette-phase3.md)

이 문서는 v0.75에서 추가된 **Phase 3** 스프라이트 및 타일 모듈이 사용하는
모든 고유 hex 값을 목록화하고, Phase 1 / Phase 2에서 그대로 재사용된 hex을
표시한다 (프로젝트의 시각적 화음이 흐트러지지 않도록). 모듈별 팔레트는 각
`.js` 파일 내부에 들어 있고 바이트 비용에 맞춰 별도로 조정된다; 이 문서는
그것들을 한곳에 모은 것이다.

## Phase 3 모듈 목록

| 모듈                                                | 종류    | 모듈별 팔레트 길이 |
|-----------------------------------------------------|---------|-------------------:|
| `assets/tiles/area1-stage2-cave.js`                 | 타일    | 18                 |
| `assets/tiles/area1-stage3-water.js`                | 타일    | 18                 |
| `assets/tiles/area1-stage4-ruins.js`                | 타일    | 17                 |
| `assets/sprites/boss-bracken-warden.js`             | 스프라이트 | 18              |
| `assets/sprites/projectile-moss-pulse.js`           | 스프라이트 | 9               |

## 합계

| 지표                                                  |    수치 |
|------------------------------------------------------|-------:|
| Phase 3에서 처음 도입된 고유 hex 값 (신규)            | **22** |
| Phase 1 또는 2에서 그대로 재사용된 고유 hex 값         | **11** |
| Phase 3 모듈이 사용하는 고유 hex 값 총합              | 33     |
| 모듈별 항목 수 총합 (스프라이트 + 타일)               | 80     |

누적 프로젝트 팔레트 (Phase 1 + 2 + 3 고유 hex)는 **87**개이다 (Phase 1의
34 + Phase 2의 31 + Phase 3의 22). 120색 프로젝트 예산 대비 **여유 33색**.

## Phase 1 또는 2와 그대로 공유되는 hex

이 11개의 hex 값은 Phase 3 모듈과 그 이전 Phase 모듈 양쪽에 모두 나타난다.
공유는 의도적이다 — 시각적 정체성을 통일하기 위함. 자세한 매핑은 영문 원본
표를 참조.

## Phase 3에서 새로 도입된 hex

22개의 새 hex은 동굴 (cave-moss-blue-green / wet-cave-stone 계열), 강가
(river-deep / reflection-amber 계열), 유적 (carved-stone-pale / dawn-
channel-amber 계열), 보스 (bracken / stone-joinery / sigil core-bright)에
나뉘어 분배된다. 모든 신규 hex의 mood 역할 + 원천 모듈은 영문 원본의 표
참조.

특히 주목할 단일 hex:
- `#fff2c0` — sigil core-bright. **프로젝트 전체에서 가장 밝은 amber.**
  오로지 Bracken Warden의 chest sigil이 `windup` 정점 / `attack` 시작
  / `hurt` 플래시 / `dead` 파열 프레임에서만 사용된다. 플레이어가
  가장 밝은 amber를 볼 때, 그것은 Warden의 살아있는 핵심을 보는 것이다.

## 색군 (mood → 역할 → hex) — Phase 3 한정

### 동굴 — `cave-moss-blue-green` + `wet-cave-stone`

동굴 팔레트는 숲보다 **더 차가운 쪽**에 anchor된다. 햇빛이 덜 닿아서 이끼는
청록색으로 변했고, 돌은 Stage 1의 흙-따뜻 토양 대신 푸른빛이 도는 회색이다.
`crystal_vein` (동굴의 fire 대체 위험) 의 amber-vein 하이라이트는 dawn-
amber + pale-gold를 그대로 재사용한다 — 플레이어가 동굴에서 따뜻함을 찾으면
숲에서 찾던 같은 색군을 만난다, 단지 더 드물게.

### 강가 — `river-deep` + `reflection-amber`

Brinklane 팔레트는 Phase 3에서 Reed가 다시 하늘을 볼 수 있는 유일한 팔레트
(천장의 갈라진 틈을 통해). 시그니처 대비: 위에서 내려오는 dawn-amber ↘
물 표면의 amber-pale 반사 ↘ 청회색 river-deep ↘ 발 아래 wet-shelf-stone.
`water_gap`은 river-deep과 ripple-pale을 섞어 단순 빈 공간이 아닌 치명적인
물로 명확히 읽히게 한다.

### 유적 — `carved-stone-pale` + `dawn-channel-amber`

The Old Threshold 팔레트는 Phase 3 중 **가장 건조한** 팔레트. 모자이크 바닥
은 채도가 낮은 돌, 기둥도 돌, 부서진 조각도 돌. Dawn-amber는 오로지 carved
channels (`dawn_channel`) 에만 나타난다 — 유적의 저장된 열이 바닥을 통해
스며나오는 곳. Warden의 sigil core (`#fff2c0`)는 Phase 3에서 단일로 가장
밝은 hex로 의도된 것이다: 그것은 Area 1의 시각적 느낌표.

### 보스 — 돌-접합부 위에 겹친 bracken

Bracken Warden의 팔레트는 차가운 이끼 + bracken 녹색을 따뜻한 돌-접합부 +
뜨거운 amber sigil 위에 겹친다. 브리프는 "보스는 바닥과 기둥과 같은 재질로
보이되 단지 움직이는 것" 을 요구한다 — 따라서 Warden의 돌-접합부는 유적의
`carved-stone` 색군을 재사용하고, 이끼/bracken은 Stage 1 숲 이끼보다 더
따뜻하고 더 깊은 세 가지 새 녹색을 도입한다.

## 잉크 & 그림자 (Phase 3 — Phase 1 + 2에서 그대로 재사용)

Phase 3는 **새로운 잉크 색을 도입하지 않는다**. v0.75의 모든 실루엣 —
보스, 발사체, 세 타일셋 모두 — 가 통일 보랏빛 `#3a2e4a`을 잉크로 사용한다.
Phase 1과 2에 적용된 동일한 규칙이며 의도적이다: Area 1의 네 스테이지가
하나의 연속된 화음으로 읽혀야 한다.

유적은 기둥 그림자용으로 `#684e6e`를 도입한다 — 이것은 잉크가 아니라 (실루
엣을 윤곽선으로 그리지 않는다) 그림자 색으로, `velvet-shadow`와 기둥의
돌 면 사이에 위치한다. 프로젝트 전체에서 유일한 "추가 보랏빛."

## 투명도 정책

Phase 3는 새 alpha-blended hex를 도입하지 않는다. 보스 + moss-pulse는 완전
불투명 팔레트를 사용하고, cave / waterside / ruin 타일셋도 완전 불투명
팔레트를 사용한다. Phase 1의 Glassmoth alpha 정책이 Phase 2의 Hummerwing
까지 이어졌고 Phase 3에서 추가 변동은 없다.

## 교차 스프라이트 일관성 규칙 — Phase 3

- **모든 곳에 보라색 잉크.** 모든 Phase 3 실루엣 윤곽선은 `#3a2e4a`. Phase
  1 + 2에서 그대로 이어진 프로젝트 보편 규칙.
- **Dawn amber는 따뜻함 전용.** Crystal-vein (동굴), dawn-channel (유적),
  보스 chest sigil, moss-pulse 내부 글로우 — Phase 3의 네 따뜻함 슬롯이
  모두 `dawn-amber` / `sigil-peak` 가족 (`#e8a040` / `#f8d878`)을 공유한다.
  새 hex `#fff2c0`는 **보스 전용**의 가장 밝은 친척으로, 오직 `attack` 중
  sigil-core에만 쓰인다.
- **어디에도 순흑 없음.** 가장 깊은 동굴 채움 (`#3a4248`)조차 차가운 돌-
  회색이지 검은색이 아니다. Warden의 under-bracken 그림자는 Phase 2의 fire-
  shadow에서 의도적인 일관성으로 가져온 `velvet under-flame` (`#5a4a6e`)을
  사용한다.
- **스테이지 팔레트는 운율은 같지만 흐려지지 않는다.** 각 스테이지는 시그
  니처 따뜻함 슬롯 하나 (cave: crystal-vein; water: reflection-amber band;
  ruin: dawn-channel)와 시그니처 차가움 슬롯 하나 (cave: blue-green moss;
  water: river-deep; ruin: pillar-shadow-violet)를 갖는다.
- **보스 팔레트는 유적 + 따뜻함을 잇는다.** Warden의 돌-접합부 (`#a8744a`)
  는 따뜻한 — 유적의 carved-stone 보다 살짝 들어올린 사촌. Bracken 녹색
  (`#3e6a3a`, `#5a8a4a`)은 유적의 이끼 오버레이보다 깊고 차갑다. Sigil
  amber는 프로젝트에서 가장 밝다. 합쳐서 Warden은 "유적 바닥이 일어선
  조각"으로 읽힌다.

## 예산

- 한도 (프로젝트): 총 ≤ 120 고유 색.
- Phase 1: 34 고유 hex.
- Phase 2: 30 신규 hex (v0.50) + 1 신규 hex (v0.50.2, 스프린트 트레일) = 31.
- Phase 3: **22 신규 고유 hex** (v0.75).
- 누적: **고유 hex 87개.** Phase 4를 위한 **33색 여유**.

Phase 3 추가량은 지금까지 프로젝트의 단일-페이즈 최대 델타이다 (Phase 2의
31 / Phase 1의 34 대비) — Phase 3가 세 새 타일셋 + 보스 + 발사체를 한꺼번에
실어 보내기 때문. 여유는 v1.0 Phase 4 작업 (멀티-area + 오디오 통합 + 마감)
에 충분히 편안하다.

---

## 모듈별 팔레트 표

영문 원본의 [`palette-phase3.md`](./palette-phase3.md) "Per-module palette
tables" 섹션 참조 — 표 내용 (hex / 역할 / 출처)은 영문 원본이 단일 진실
원천. KO 번역본은 산문만 번역한다 (CLAUDE.md 양국어 정책 참조 — 코드 블록,
파일 경로, 식별자, 고정값 표는 그대로 유지).

## 열린 질문

발행 시점에는 없음. 모든 Phase 3 hex는 그것을 사용하는 자산과 같은 PR에서
커밋된다 — 미래 자산을 기다리는 orphan 색은 없다. 미래에 Hummerwing 동굴 /
유적 reskin이 추가되면, 그 PR에서 이 팔레트 문서를 갱신해야 한다.

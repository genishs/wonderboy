# Phase 3 마스터 팔레트

> 소유: design-lead. 동반 문서: `docs/briefs/phase3-area1-expansion.md` 및
> `docs/briefs/phase3-boss-cast.md`. 무드 기준: `docs/story/world.md` ("주전자처럼
> 따뜻한 아침, 금속이 아니라 나무 같은, 험상궂지 않고 부드러운. 그림자는 절대
> 검은색이 아니라 보랏빛 회색"). Phase 3는 Area 1을 숲의 가장자리(Stage 1)에서
> 햇볕 따뜻한 해변(Stage 2), 동굴(Stage 3), 달빛 어두운 숲(Stage 4)으로 확장
> 하고, Area 1의 보스인 Bracken Warden 그리고 moss-pulse 충격파 발사체를
> 추가한다.
>
> **Phase 1 문서:** [`palette.md`](./palette.md) — 종결됨; 수정 금지.
> **Phase 2 문서:** [`palette-phase2.md`](./palette-phase2.md) — 종결됨; 수정 금지.
> **영문 원본:** [`palette-phase3.md`](./palette-phase3.md)

이 문서는 v0.75에서 추가된 **Phase 3** 스프라이트 및 타일 모듈이 사용하는
모든 고유 hex 값을 목록화하고, Phase 1 / Phase 2에서 그대로 재사용된 hex을
표시한다 (프로젝트의 시각적 화음이 흐트러지지 않도록). 모듈별 팔레트는 각
`.js` 파일 내부에 들어 있고 바이트 비용에 맞춰 별도로 조정된다; 이 문서는
그것들을 한곳에 모은 것이다.

## v0.75 hero 재구축 보정 (24×36 해상도)

PR #27의 두 번째 보정에서 hero 스프라이트 (`assets/sprites/hero-reed.js`)를
16 × 24 아트픽셀에서 24 × 36 아트픽셀로 재구축하고, 애니메이션별 fps를
더 차분하게 조정했다. 팔레트 관련 변경사항 두 가지:

- **새로운 hex 1개**가 고해상도 피부 셰이딩을 위해 도입됨: `#f4c898`
  (피부 하이라이트 — 이마 / 광대 / 너클의 빛 받는 점, 기존 dawn-amber
  피부 `#e8a878`보다 한 단계 밝다). dawn-amber 가족 안에 머무르므로
  따뜻한 화음은 보존된다.
- **기존 Phase 3 hex 1개**가 튜닉 어깨 catchlight로 재사용됨: `#5a8a4a`
  (cairn-mantle moss / pale moss highlight — `boss-bracken-warden.js`와
  dark-forest 타일셋에서 처음 도입). 신규 hex 아님; 재사용으로 "튜닉은
  이끼 옷감"이라는 읽기를 강화한다.

두 팔레트 추가 모두 `hero-reed.js` 내부에만 있고, 이번 보정으로 다른
Phase 3 모듈에는 항목이 추가되지 않는다.

hero 모듈의 파일별 PALETTE 항목 수는 18 (v0.50.2) → 20 (v0.75)으로 증가:
신규 hex `#f4c898` 1개 + Phase 3에서 재사용된 hex `#5a8a4a` 1개. 누적
프로젝트 총합에는 전자만 카운트된다.

## v0.75 테마 리맵 공지

Stage 2 / Stage 3 / Stage 4 테마가 PR 중간에 시퀀스 **forest → shore → cave
→ dark forest**로 재매핑되었다 (Stage 1 변경 없음). 누적 프로젝트 팔레트를
안정적으로 유지하기 위해 hex 값 자체는 리맵 전후로 그대로 유지했고, 서술
라벨과 스테이지 슬롯 결합만 변경되었다. 구체적으로:
- 동굴 타일셋 (`area1-stage3-cave.js`)은 이전에 `area1-stage2-cave.js`로
  출고된 것과 동일한 내용 — 팔레트 변경 없음, 파일 이름만 변경.
- 해변 타일셋 (`area1-stage2-shore.js`)은 이전에 `area1-stage3-water.js`
  로 출고된 것과 동일한 내용 — 팔레트 변경 없음, 소스 코멘트에서 hex 라벨만
  재조정 (예: "river-deep" → "sea-deep", "bank-moss" → "shore-moss / sea-
  tinged"). water-as-hazard 역할과 매트릭스 데이터는 바이트-단위 동일하다.
- 이전 유적 타일셋 (`area1-stage4-ruins.js`)은 삭제되고 어두운-숲 타일셋
  (`area1-stage4-darkforest.js`)으로 교체. 유적 타일셋이 도입한 5개 hex 중
  4개는 여전히 보스에 사용 (`#684e6e`, `#8a8478`, `#a89c80`, `#5a5448`)
  되며 어두운-숲 타일셋에서 재역할 부여 (pillar-shadow-violet → canopy-
  shadow-violet, carved-stone 가족 → bark 가족). 5번째 (`#7a7080`,
  mosaic-cool)도 어두운-숲 타일셋에서 "moonlit-lichen overlay"로 재역할.
  5개 hex 값 모두 테마 리맵 전후로 변경 없음.
- 어두운-숲 타일셋이 **진정으로 새로운 hex 값 4개**를 도입: `#1e2032`
  (dark-forest under-base), `#2a3a3a` (dark-canopy blue-green dark),
  `#3e5a52` (dark-canopy blue-green mid), `#cfd8dc` (moonlight-silver-cream).

## Phase 3 모듈 목록

| 모듈                                                | 종류    | 모듈별 팔레트 길이 |
|-----------------------------------------------------|---------|-------------------:|
| `assets/tiles/area1-stage2-shore.js`                | 타일    | 18                 |
| `assets/tiles/area1-stage3-cave.js`                 | 타일    | 18                 |
| `assets/tiles/area1-stage4-darkforest.js`           | 타일    | 21                 |
| `assets/sprites/boss-bracken-warden.js`             | 스프라이트 | 18              |
| `assets/sprites/projectile-moss-pulse.js`           | 스프라이트 | 9               |
| `assets/sprites/hero-reed.js` (v0.75 재구축)        | 스프라이트 | 20              |

## 합계

| 지표                                                  |    수치 |
|------------------------------------------------------|-------:|
| Phase 3에서 처음 도입된 고유 hex 값 (신규)            | **27** |
| Phase 1 또는 2에서 그대로 재사용된 고유 hex 값         | **11** |
| Phase 3 모듈이 사용하는 고유 hex 값 총합              | 38     |
| 모듈별 항목 수 총합 (스프라이트 + 타일)               | 104    |

누적 프로젝트 팔레트 (Phase 1 + 2 + 3 고유 hex)는 **92**개이다 (Phase 1의
34 + Phase 2의 31 + Phase 3의 27). 120색 프로젝트 예산 대비 **여유 28색**.

Phase 3 27개 = 테마 리맵 26개 (Stage 2 shore / Stage 3 cave / Stage 4
dark forest + 보스 + moss-pulse) + v0.75 hero 재구축 1개 (`#f4c898`
피부 하이라이트).

## Phase 1 또는 2와 그대로 공유되는 hex

이 11개의 hex 값은 Phase 3 모듈과 그 이전 Phase 모듈 양쪽에 모두 나타난다.
공유는 의도적이다 — 시각적 정체성을 통일하기 위함. 자세한 매핑은 영문 원본
표를 참조.

## Phase 3에서 새로 도입된 hex

26개의 새 hex은 동굴 (cave-moss-blue-green / wet-cave-stone 계열), 해변
(sea-deep / reflection-amber 계열), 어두운 숲 (dark-canopy / moonlight 계열
+ 유적 빌드에서 재역할 부여된 5개), 보스 (bracken / stone-joinery / sigil
core-bright)에 나뉘어 분배된다. 모든 신규 hex의 mood 역할 + 원천 모듈은
영문 원본의 표 참조.

특히 주목할 단일 hex:
- `#fff2c0` — sigil core-bright. **프로젝트 전체에서 가장 밝은 amber.**
  오로지 Bracken Warden의 chest sigil이 `windup` 정점 / `attack` 시작
  / `hurt` 플래시 / `dead` 파열 프레임에서만 사용된다. 플레이어가
  가장 밝은 amber를 볼 때, 그것은 Warden의 살아있는 핵심을 보는 것이다.
- `#cfd8dc` — moonlight-silver-cream. **Stage 4 어두운 숲에서 가장 밝은
  단일 hex.** 슬로프 crest의 달빛 catch와 `moonlight_streak` 반짝임에
  사용. 보스의 sigil core-bright보다 차가운 톤 — 어두운 숲 무드에 맞춤.

## 색군 (mood → 역할 → hex) — Phase 3 한정

### 동굴 — `cave-moss-blue-green` + `wet-cave-stone`

동굴 팔레트는 숲보다 **더 차가운 쪽**에 anchor된다. 햇빛이 덜 닿아서 이끼는
청록색으로 변했고, 돌은 Stage 1의 흙-따뜻 토양 대신 푸른빛이 도는 회색이다.
`crystal_vein` (동굴의 fire 대체 위험) 의 amber-vein 하이라이트는 dawn-
amber + pale-gold를 그대로 재사용한다 — 플레이어가 동굴에서 따뜻함을 찾으면
숲에서 찾던 같은 색군을 만난다, 단지 더 드물게.

### 해변 — `sea-deep` + `reflection-amber`

Stage 2 해변 팔레트는 Reed가 새벽에 열린 하늘과 열린 물을 만나는 곳이다.
시그니처 대비: 위에서 내려오는 dawn-amber ↘ 물 표면의 amber-pale 반사 ↘
청회색 sea-deep ↘ 발 아래 wet-shelf-stone. `water_gap`은 sea-deep과
ripple-pale을 섞어 단순 빈 공간이 아닌 치명적인 물로 명확히 읽히게 한다.

### 어두운 숲 — 재역할 부여된 stone 가족 + 새 캐노피 색조

Stage 4 어두운-숲 팔레트는 Phase 3에서 **가장 차가운** 팔레트 — 깊은 청록
캐노피 그림자, 보랏빛 흑색 언더톤, 은빛 달빛, 보라색 undercut을 가진 비틀린
바위. Dawn-amber는 오로지 Area 종료 cairn의 sigil-fleck에만 나타난다 —
의도적인 전조 — 플레이어는 전 스테이지에서 silver-cream 달빛만 보다가, cairn
에서 amber를 만나고 그 직후 Bracken Warden의 chest sigil에서 다시 만난다.
dry-bark 가족 (`#8a8478` / `#a89c80` / `#5a5448`)은 보스의 stone joinery와
공유되어 플레이어는 "Warden은 이 숲과 같은 재질로 만들어져 있다"로 읽는다.

### 보스 — 돌-접합부 위에 겹친 bracken

Bracken Warden의 팔레트는 차가운 이끼 + bracken 녹색을 따뜻한 돌-접합부 +
뜨거운 amber sigil 위에 겹친다. 보스는 어두운-숲의 stone-family hex와
canopy-shadow-violet을 재사용하여 주변 바닥과 같은 재질로 만들어진 것처럼
보인다. Bracken 녹색은 Stage 1 숲 이끼보다 더 따뜻하고 더 깊은 세 가지 새
녹색을 도입하고, sigil core-bright (`#fff2c0`)는 Phase 3에서 단일로 가장
밝은 hex로 의도된 것이다.

## 잉크 & 그림자 (Phase 3 — Phase 1 + 2에서 그대로 재사용)

Phase 3는 **새로운 잉크 색을 도입하지 않는다**. v0.75의 모든 실루엣 —
보스, 발사체, 세 새 타일셋 모두 — 가 통일 보랏빛 `#3a2e4a`을 잉크로 사용
한다. Phase 1과 2에 적용된 동일한 규칙이며 의도적이다: Area 1의 네 스테
이지가 하나의 연속된 화음으로 읽혀야 한다.

어두운-숲 타일셋과 보스 둘 다 `#684e6e`를 캐노피-아래 / bracken-아래
그림자용 **더 깊은 보랏빛**으로 사용한다. 이것은 잉크가 아니라 (실루엣을
윤곽선으로 그리지 않는다) 그림자 색으로, `velvet-shadow`와 bark / joinery
면 사이에 위치한다. 프로젝트 전체에서 유일한 "추가 보랏빛."

## 투명도 정책

Phase 3는 새 alpha-blended hex를 도입하지 않는다. 보스 + moss-pulse는 완전
불투명 팔레트를 사용하고, cave / shore / dark-forest 타일셋도 완전 불투명
팔레트를 사용한다. Phase 1의 Glassmoth alpha 정책이 Phase 2의 Hummerwing
까지 이어졌고 Phase 3에서 추가 변동은 없다.

## 교차 스프라이트 일관성 규칙 — Phase 3

- **모든 곳에 보라색 잉크.** 모든 Phase 3 실루엣 윤곽선은 `#3a2e4a`. Phase
  1 + 2에서 그대로 이어진 프로젝트 보편 규칙.
- **Dawn amber는 따뜻함 전용.** Crystal-vein (동굴), 해변 물 반사,
  어두운-숲 cairn sigil-fleck, 보스 chest sigil, moss-pulse 내부 글로우
  — Phase 3의 다섯 따뜻함 슬롯이 모두 `dawn-amber` / `sigil-peak` 가족
  (`#e8a040` / `#f8d878`)을 공유한다. 새 hex `#fff2c0`는 **보스 전용**의
  가장 밝은 친척으로, 오직 `attack` 중 sigil-core에만 쓰인다.
- **어디에도 순흑 없음.** 가장 깊은 어두운-숲 채움 (`#1e2032`)과 가장 깊은
  동굴 채움 (`#3a4248`) 모두 보랏빛-회색이지 검은색이 아니다. Warden의
  under-bracken 그림자는 Phase 2의 fire-shadow에서 의도적인 일관성으로
  가져온 `velvet under-flame` (`#5a4a6e`)을 사용한다.
- **스테이지 팔레트는 운율은 같지만 흐려지지 않는다.** 각 스테이지는 시그
  니처 따뜻함 슬롯 하나 (shore: reflection-amber band; cave: crystal-vein;
  dark forest: cairn sigil-fleck only)와 시그니처 차가움 슬롯 하나 (shore:
  sea-deep; cave: blue-green moss; dark forest: dark-canopy blue-green)를
  갖는다.
- **보스 팔레트는 어두운-숲 + 따뜻함을 잇는다.** Warden의 돌-접합부
  (`#a8744a`)는 따뜻한 — 어두운-숲의 dry-bark-pale보다 살짝 들어올린 사촌.
  Bracken 녹색 (`#3e6a3a`, `#5a8a4a`)은 숲 이끼보다 깊다. Sigil amber는
  프로젝트에서 가장 밝다. 합쳐서 Warden은 "어두운-숲 빈터의 조각이 일어선
  것"으로 읽힌다.

## 예산

- 한도 (프로젝트): 총 ≤ 120 고유 색.
- Phase 1: 34 고유 hex.
- Phase 2: 30 신규 hex (v0.50) + 1 신규 hex (v0.50.2, 스프린트 트레일) = 31.
- Phase 3: **26 신규 고유 hex** (테마 리맵 후 v0.75).
- 누적: **고유 hex 91개.** Phase 4를 위한 **29색 여유**.

Phase 3 추가량은 지금까지 프로젝트의 단일-페이즈 최대 델타이다 — Phase 3가
세 새 타일셋 + 보스 + 발사체를 한꺼번에 실어 보내기 때문. 여유는 v1.0
Phase 4 작업 (멀티-area + 오디오 통합 + 마감)에 충분히 편안하다.

---

## 모듈별 팔레트 표

영문 원본의 [`palette-phase3.md`](./palette-phase3.md) "Per-module palette
tables" 섹션 참조 — 표 내용 (hex / 역할 / 출처)은 영문 원본이 단일 진실
원천. KO 번역본은 산문만 번역한다 (CLAUDE.md 양국어 정책 참조 — 코드 블록,
파일 경로, 식별자, 고정값 표는 그대로 유지).

## 열린 질문

발행 시점에는 없음. 모든 Phase 3 hex는 그것을 사용하는 자산과 같은 PR에서
커밋된다 — 미래 자산을 기다리는 orphan 색은 없다. 미래에 Hummerwing 동굴 /
어두운-숲 reskin이 추가되면, 그 PR에서 이 팔레트 문서를 갱신해야 한다.

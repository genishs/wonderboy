# 미리보기 — `assets/tiles/area1-stage4-darkforest.js`

> **영문 원본:** [`preview-tile-stage4-darkforest.md`](./preview-tile-stage4-darkforest.md)

| 항목          | 값                                          |
|---------------|---------------------------------------------|
| 경로          | `assets/tiles/area1-stage4-darkforest.js`   |
| 스테이지      | Stage 4 — The Old Threshold (어두운 숲)     |
| 타일 매트릭스 | 타일당 16 × 16 아트-픽셀                    |
| 화면 크기     | 캔버스 48 × 48 px (3× 스케일; `TILE = 48`) |
| 팔레트        | 21 항목                                     |
| 타일 키       | 12 키 (정적 10 + 애니메이션 장식 1 + cairn) |

v0.75 테마 리맵에 따라, Stage 4의 테마는 이전에 고려된 고대 유적이 아니라
달빛 어두운 숲이다. 무드 키워드: 깊은 청록 캐노피 그림자, 보랏빛 흑색
언더톤, 은빛 달빛, 비틀린 뿌리 시스템. 팔레트는 Stage 1의 "주전자처럼
따뜻한 숲의 아침"의 **반대 색조 모서리** — 같은 숲 문법 (이끼 위 + 흙 본체
+ 껍질 + 가끔의 하이라이트), 정반대의 색조 무드. 시퀀스 forest → shore →
cave → dark forest는 보편적인 액션-플랫포머 카덴스다; 모든 타일 디자인은
이 프로젝트를 위해 새로 작성되었다 — 추적 없음, 어떤 참조 이미지의 색조
변경 없음, 원작 게임 시각 모티프 재사용 없음.

## 타일 키

### 정적 타일

- **`flat`** — 어두운-숲 바닥. 위 2행: 어두운-캐노피 청록 이끼 띠 (Stage 1
  의 주전자-따뜻한 이끼의 달빛 사촌 — 같은 역할, 차가운 색조). Rows 2-5:
  dry-bark-pale 본체 — 풍화된 줄기-색조 바닥 표면, "길에 쓰러진 오래된
  나무의 껍질"로 읽히는 따뜻한-차가운 회색. Rows 6-13: 껍질-그림자 본체에
  가끔의 달빛-이끼 오버레이 점들과 이슬이 평평한 표면을 찾는 드문 달빛
  catch 하이라이트. 맨 아래 2행: 어두운-숲 under-base — 의도적으로 **순흑
  이 아닌** 보랏빛-흑색 언더톤 (`#1e2032`), `docs/story/world.md` 원칙에
  따른다. 네 스테이지의 `flat` 타일 중 가장 어둡지만, 여전히 보랏빛 편향이
  있어 공허로 읽히지 않는다.
- **`slope_up_22`** — 완만한 오르막, 어두운-숲 색조. Stage 1과 동일한 계단
  형 상승.
- **`slope_up_45`** — 가파른 오르막. 상단 우측 crest의 단일 moonlight-
  silver-cream catch는 "달빛이 상승 가장자리를 찾는다"로 읽힌다 — Stage 1
  의 dawn-amber root catchlight와 Stage 3의 amber vein-glow crest의 어두운
  숲 등가물. 무드 등가물은 따뜻함 대신 차가움.
- **`slope_dn_22`** — 완만한 내리막.
- **`slope_dn_45`** — 가파른 내리막. 상단 좌측 crest에 달빛 catchlight.
- **`rock_small`** — 비틀린 어두운-숲 바위. Stages 1-3과 동일한 authoring
  규칙 (row 12 아래 투명 → flat 타일 위 합성). 실루엣은 Stage 1의 따뜻한-
  갈색 바위와 시각적으로 다르다: 더 차가운 river-stone-grey 본체에 우측
  에는 명확한 **canopy-shadow-violet undercut** (이 숲의 모든 물체 아래에
  사는 캐노피 아래 보라색 그림자), 달빛-비추는 좌상에는 sparse **pale-
  moss 하이라이트** (바위의 유일한 녹색 — Stage 1의 햇빛-자란 이끼가 아닌
  달빛-이끼). "동일한 바위 기하학, 깊은-밤 색조 모서리"로 읽힌다. **게임
  플레이 역할 변함 없음** — Stage 1의 바위와 동일한 stumble 동작.
- **`mile_1`-`mile_4`** — 라운드 표지판, 공유 사슬. Stage 1, 2, 3과 동일한
  기둥 + 판 + 숫자 모양. 판 표면은 같은 cuff-cream이고 숫자는 같은
  violet-ink 모양 — 캐노피 아래에서 기둥 자체는 어두운-숲 색조에 사라져도
  cream은 명료히 읽힌다. `mile_4`는 Area 1의 마지막 라운드 — 보스의 전실
  로 향하는 마커.
- **`cairn`** — **Area 종료 경계 cairn.** 세 개의 이끼-얼룩 돌의 스택,
  맨 위 돌에 단일 dawn-amber sigil-fleck (Stage 4 타일셋에서 보스 아레나
  바깥에 amber가 나타나는 유일한 곳, 의도적인 전조 — 플레이어가 전 스테
  이지 동안 moonlight_streak 장식을 지나며 "여기는 따뜻한 것이 없다"로 읽
  고, 그 후 이 cairn이 맨 위에 한 잿불을 드러내고, 직후 Bracken Warden의
  chest sigil이 같은 amber 가족 안에서 떠오른다). cairn 본체는 river-
  stone-grey에 tree-bark-shadow undercut과 달빛-비추는 윗면의 pale-moss
  악센트; 맨 위 돌은 cuff-cream 림에 dawn-amber sigil-fleck이 nested.

  `stage_exit` (Stages 2-3에서 사용 — 수평 크로스빔이 있는 cave/shore
  아치)과 시각적으로 구분 — 플레이어는 "길의 끝이지, 다른 문이 아니다"로
  읽는다. Stage 1의 cairn (Stage 1: 순수 cream sigil; Stage 4: amber-
  fleck sigil)과도 시각적으로 구분 — "여정이 누적되었다; 마커가 한 잿불만
  큼 따뜻해졌다"로 읽힌다. Stage 4 cairn은 Area 1 종료 마커 — Bracken
  Warden 격파 후에만 dev-lead의 레벨 데이터가 발동.

### 애니메이션 장식 (위험 아님)

- **`moonlight_streak`** — **애니메이션**, `{ frames: [3 matrices], fps: 3 }`.
  타일 상단을 가로지르는 미묘한 수평 streak, 숲 바닥 길을 따라 이슬이나
  발광-이끼를 잡는 달빛을 보여준다. **장식 전용** — Reed가 결과 없이 걸어
  지난다. Round 4-2, 4-3 (장식 런) 그리고 특히 Round 4-4 (보스 아레나
  입구로 다가가는 긴 수렴 stripe)에서 사용.

  시각 레이아웃:
  - **상단 영역 (rows 1-6):** streak 자체 — 어두운-캐노피 청록의 14-셀-폭
    띠에 흩뿌려진 moonlight-silver-cream과 어두운-캐노피-중간 점들. streak
    바깥 셀 (rows 0과 측면)은 투명이라 주변 `flat` 타일이 보인다.
  - **중하단 (rows 7-15):** 어두운-숲 바닥 본체 — `flat`의 아래 부분과
    동일 내용, 그래서 `moonlight_streak` 타일이 `flat` 타일 행에 시각적
    솔기 없이 끼워진다. streak은 "뿌리 사이의 평평한 숲 바닥 한 부분을
    찾는 달빛"으로 읽힌다.

  결정 기록:
  - **3 프레임 @ 3 fps** — 동굴 `crystal_vein`과 동일한 리듬 슬롯 (이전
    빌드의 유적 `dawn_channel`이 2 fps였던 것을 대체). 3 프레임은 "이슬
    반짝임 이동" 리듬을 2 프레임보다 명확하게 주고; 3 fps는 어두운-숲
    분위기에 충분히 부드럽다 (2 fps보다 빠르면 느린 캐노피 무드 대비
    "쉭쉭"거리는 느낌이 든다).
  - **위험 아님.** 장식 전용. Reed가 그 위를 걸어 지난다. Stage 4에서
    보스 아레나 바깥에 dawn-amber가 나타나는 유일한 장소는 cairn sigil-
    fleck (위 참조) — moonlight_streak는 의도적으로 amber 대신 silver-
    cream을 사용하여 그 전조 읽기를 강화한다.

  프레임 사이클:
  - **frame 0** — 중립 펄스. streak에 어두운-캐노피 중간과 silver-cream
    점들이 띠 전체에 골고루 흩뿌려짐.
  - **frame 1** — 더 조밀한 반짝임. silver-cream 점이 더 표면화 (이슬이
    더 많은 면을 잡도록 이동). 같은 streak 실루엣, 반짝임 분포 조밀해짐.
  - **frame 2** — 드문 반짝임. 반짝임이 작은 중앙 클러스터로 집중; 외곽
    셀은 어두운-캐노피로 돌아간다. F0→F1→F2→F0 루프가 "달빛이 이슬을 잡고,
    이슬이 이동하고, 다시 잡는다"로 읽힌다.

## 결정 기록 — 위험 타일 없음

**Stage 4는 위험 타일이 없다.** `fire_low`, `crystal_vein`, `amber_vein`,
`water_gap` 없음. Stage 4의 Reed 사망 경로는 오로지:
- Mossplodder 본체 접촉 (기존 v0.50 규칙)
- 보스 본체 접촉 (`phase3-boss-cast.md`)
- moss-pulse 충격파 접촉 (`phase3-boss-cast.md`)
- gap-fall (기존 v0.50.2 규칙)

## 결정 기록 — 보스-아레나-바닥 변형 없음

스토리 브리프는 "12-tile-wide 아레나용 보스-아레나-바닥 변형"을 열어 두었
다. **보내지 않음.** 보스 아레나는 동일한 `flat` 어두운-숲 바닥 (Round
4-4 cols 32-43)을 사용한다. `flat` 타일이 이미 위쪽이 시각적으로 조용
하기 때문에 (2행 어두운-캐노피 띠만), 화면 상단의 HUD strip은 ~76 px의
여유 공간이 필요한 곳에서 올바르게 읽힌다. 고유한 "보스-아레나 바닥"
타일 추가는 시각적 이익 없는 데이터 추가일 뿐이다.

## 팔레트 겹침과 신규 hex — Phase 3 어두운-숲

총 21개 팔레트 항목. 그 중:

- **Phase 1 + 2에서 그대로 재사용 8개** (보편): violet ink (`#3a2e4a`),
  moss-green base (`#4a7c3a`), moss-green dark (`#2e5028`), cuff-cream
  (`#e8d4a0`), wet-bark-brown (`#4a3422`), loam-soil shadow (`#5a3a22`),
  dawn-amber (`#e8a040`), transparent.
- **Phase 2 `area1.js`에서 재사용 3개**: river-stone-grey (`#7a8088`),
  river-stone shadow (`#4a5058`), river-stone highlight (`#a8b0b8`).
- **이전 PR의 유적 / 보스 팔레트에서 재역할 부여 5개 hex** (hex 값은
  동일하게 유지하여 누적 프로젝트 팔레트 안정): `#684e6e` ("pillar-
  shadow-violet" → "canopy-shadow-violet"), `#8a8478` ("carved-stone-
  pale" → "dry-bark-pale"), `#a89c80` ("carved-stone highlight" →
  "moonlit bark crest"), `#5a5448` ("carved-stone shadow" → "tree-bark-
  shadow"), `#7a7080` ("mosaic-cool" → "moonlit-lichen overlay").
- **보스 스프라이트에서 재사용 1개**: `#5a8a4a` (pale-moss 하이라이트,
  보스의 "cairn-mantle moss"와 동일 값 — 어두운-숲 바위에 sparse).
- **Phase 3에 새로 추가 4개 hex** (이 어두운-숲 모듈이 도입):
  - `#1e2032` — 어두운-숲 under-base (가장 깊은 채움; 검정이 아님)
  - `#2a3a3a` — 어두운-캐노피 청록 dark
  - `#3e5a52` — 어두운-캐노피 청록 mid
  - `#cfd8dc` — moonlight-silver-cream (이 타일셋에서 가장 밝은 단일 hex)

총 14개 타일 매트릭스 (정적 10 + `moonlight_streak`의 3 프레임 + cairn 1).
프로젝트 누적 팔레트 인벤토리는 `palette-phase3.md` 참조.

## 스테이지간 일관성 메모

- 마일-마커 기둥은 네 스테이지에 걸쳐 동일.
- `cairn`은 Area 종료 전용 예약. v0.75에서 Stage 4만이 레벨 데이터에서
  `cairn` 배치를 emit하고; Stages 1, 2, 3은 끝에 `stage_exit`을 emit.
- canopy-shadow-violet hex (`#684e6e`)는 Bracken Warden 보스 스프라이트
  의 under-bracken / under-stone shadow에서 공유 — 플레이어는 "Warden은
  이 숲과 같은 재질로 만들어져 있다"로 읽는다. 이전 PR의 pillar-shadow-
  violet을 canopy-shadow-violet으로 재역할 부여한 것은 테마 리맵에 걸쳐
  그 주제적 연속성을 유지한다.
- `dry-bark-pale` 가족 (`#8a8478` / `#a89c80` / `#5a5448`)은 보스의
  stone joinery와 공유 — 보스 스프라이트는 의도적으로 어두운-숲 바닥의
  재질 어휘로 구성된다.

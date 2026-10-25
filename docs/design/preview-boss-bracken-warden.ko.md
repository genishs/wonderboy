# 미리보기 — `assets/sprites/boss-bracken-warden.js`

> **영문 원본:** [`preview-boss-bracken-warden.md`](./preview-boss-bracken-warden.md)

| 항목         | 값                                                    |
|--------------|------------------------------------------------------|
| 경로         | `assets/sprites/boss-bracken-warden.js`              |
| 크기         | 40 × 48 아트-픽셀                                    |
| Anchor       | `{ x: 20, y: 47 }` (하단 중앙, 바닥 라인)            |
| 기본 FPS     | 6 (`META.animFps`로 애니메이션별 재정의)             |
| 팔레트       | 18 항목                                              |
| 총 프레임    | 6 애니메이션에 걸쳐 17 프레임                        |

Bracken Warden은 Area 1 보스 — Stage 4 끝의 **달빛 어두운 숲 빈터** (Round
4-4 cols 41-42) 뒷벽의 무릎 꿇은 이끼-돌 거인. 사양 출처:
`docs/briefs/phase3-boss-cast.md`. 스프라이트는 보스 브리프 §3의 FSM 6개
상태를 모두 보낸다: `idle`, `windup`, `attack`, `recover`, `hurt`, `dead`.

v0.75 테마 리맵에 따라, 보스 아레나는 이전 PR이 가정한 유적 챔버가 아니라
이제 캐노피 아래의 어두운-숲 빈터다. **스프라이트 자체는 변경되지 않았다**
— 이끼-덮인 돌-과-bracken 가디언은 어두운 숲에서도 유적 아레나에서만큼이나
잘 읽힌다 (이끼 + bracken + 어두운 따뜻한-돌 joinery는 이제 "숲이 되찾은
오래된 돌 신단"으로 읽히고 "유적 바닥의 한 조각이 일어선 것"으로는 읽히지
않는다). 미리보기 문서의 주변 아레나 컨텍스트만 변경되었고; 실루엣, 애니메
이션, 팔레트는 이전 PR과 바이트-단위 동일하다.

## 최종 치수 (결정 기록)

보스 브리프 §10은 144 × 192 아트-픽셀 (3 타일 × 4 타일 기립 시)을 제안.
유저 프롬프트는 design-lead 선택으로 "32 × 40 px 또는 40 × 48 px"을 명시적
으로 제안. 브리프 §10 frame-size 메모도 design-lead가 "Warden을 다중-파트
스프라이트로 보내 프레임당 데이터를 줄이는 것 — 구현 세부사항, story-lead
의 호출이 아님"을 허용.

**40 × 48 아트-픽셀로 출고.** 근거:
- 144 × 192는 프레임당 약 27,648 셀 × 17 프레임 ≈ 470K 셀의 손-authored
  팔레트 인덱스. 실현 가능하지만 유지보수 매우 비싸다.
- 40 × 48은 프레임당 약 1,920 셀 × 17 = ~32K 셀 — 큰 Phase 2 스프라이트
  (Hero Reed armed 18 × 24 × ~30 frames ≈ 13K)와 견줄만하다.
- dev-lead의 `SpriteCache`는 이미 Reed-the-sprite를 비-1:1 스케일로 렌더링
  (Reed는 16 × 24 아트 → 약 36 × 48 캔버스 ≈ 2.25× 스케일). Warden은 약
  3× 스케일에서 렌더링 → 120 × 144 캔버스 px ≈ 2.5 × 3 타일, 브리프의
  "기립 시 3 타일 × 4 타일" 의도에 충분히 가까워 빈터는 올바르게 읽힌다.
- 브리프의 실루엣 의도 ("무릎 꿇은 거인" / "고개 숙인" / "이끼 덮인 cairn
  모양") 는 40 × 48에서 깔끔하게 읽힌다. 어두운-숲 빈터에서 — 달빛 어린
  캐노피 바닥을 배경으로 — 이끼-과-돌 실루엣은 대비로 두드러진다 (따뜻한-
  회색 joinery + 따뜻한 sigil 호박색이 차가운 캐노피 중간톤에 대비된다).

## Anchor

`{ x: 20, y: 47 }` — 하단 중앙, 바닥 라인. Warden의 발은 항상 자세에 상관
없이 바닥 행에 있다 (휴식 시 무릎 꿇음, windup에서 일어남, dead에서 쓰러
짐). 모든 자세 변형은 anchor 위에서 실루엣을 구성한다. dev-lead는 빈터의
바닥 행 (Round 4-4 col 41-42, floor row 10)에 스프라이트를 배치한다.

## Sigil 플레어 시각 접근 (결정 기록)

Chest sigil은 Warden 몸통 중앙의 수직 1-셀-폭 × 4-셀-높이 슬릿, cuff-cream
림 셀로 둘러싸여 있다. Sigil의 **색 인덱스가 상태별로 이동**하여 실루엣을
바꾸지 않고 플레어를 렌더링한다 (영문 원본의 상태 표 참조).

Peak/core 레벨에서는 슬릿 림 외측에 dawn-amber 외곽 헤일로가 형성된다.
이는 플레이어에게 "Warden이 windup 중"이라는 두 가지 명확한 시각 단서를
제공한다: sigil 내부가 밝아짐 + 헤일로가 나타남.

## 애니메이션

### `idle` — 3 프레임, 3 fps (느린 호흡)

무릎 꿇은 자세: 머리를 앞으로 숙임, 두 팔뚝이 굽힌 앞다리 무릎에 얹힘,
몸통이 굽음. Warden은 자고 있다.

- **`idle0`** — 중립. 머리 완전히 숙임, eye-slit 어두움, sigil 어두움.
  outer-moss 컬이 숙인 머리 정수리와 어깨 cap에 드리워짐. 어깨에 carved-
  stone-pale 직사각형, 앞다리 무릎 정수리, 접힌 뒤다리 무릎에 돌-접합부
  보임. 다리 사이로 bracken hip-frond.
- **`idle1`** — 호흡 상승. 머리가 한 셀 위로 (미묘하지만, idle의 유일한
  Warden 움직임); sigil이 한 단계 따뜻해짐 (pillar-violet 대신 stone-
  joinery warm) 후 다시 가라앉음. "이끼 아래 느린 호흡"으로 읽힌다.
- **`idle2`** — 중립 복귀. `idle0`과 동일. 사이클 루프.

### `windup` — 4 프레임, 12 fps (~45-프레임 텔레그래프)

Warden은 머리를 들고, 가슴을 열고, 한 팔을 머리 위로 올린다. Chest sigil
은 네 프레임에 걸쳐 어두움에서 peak-bright로 플레어.

- **`windup0`** — 머리 들림; eye-slit이 dawn-amber mid로 점화. Sigil이
  한 단계 따뜻해짐 (stone-joinery warm). 팔은 여전히 무릎에 휴식.
- **`windup1`** — 가슴 열림. Sigil이 dawn-amber mid로 플레어; 외곽 헤일
  로가 형성 시작. 팔은 여전히 휴식; 머리 완전히 위.
- **`windup2`** — 오른팔 상승 시작 (무릎에서 벗어나, 오른쪽 어깨에서
  위로 각도). Sigil이 pale-gold peak로; eye-slit이 pale-gold로. 머리는
  최대 상승.
- **`windup3`** — 팔이 정점 (오른쪽 어깨 위 수직 컬럼). Sigil이 **core-
  bright** (`#fff2c0`, 프로젝트 전체에서 가장 밝은 amber). Eye-slit
  pale-gold. 외곽 헤일로가 sigil을 완전히 둘러쌈. 이 프레임은 플레이어
  의 "지금 도끼를 던지거나 점프하라" 신호. 들린 팔의 손목에서 bracken
  술이 둥글게 말림.

### `attack` — 3 프레임, 16 fps (~12-프레임 휘두름, 임팩트는 프레임 1)

내려치기. 들린 팔이 바닥으로 거세게 내려옴; 임팩트 프레임에서 Warden의
발 옆에 moss-pulse 충격파 엔티티가 스폰된다.

- **`attack0`** — 팔 휘두름 중간. Sigil 여전히 core-bright; 몸 비틀어
  앞으로; 머리 최대 상승.
- **`attack1`** — **팔 착지 (임팩트 프레임).** 들렸던 팔이 내려와 Warden
  앞 바닥에 뻗어 누움 (rows 33-38, cols 0-14). 이끼 입자 폭발 (bracken-
  frond deep과 cairn-mantle moss 점)이 cols 0-5의 임팩트 지점에서 분출.
  Sigil이 한 단계 어두워짐 (core-bright 대신 pale-gold peak). 충격파
  엔티티가 이 프레임에서 Warden의 발 옆에 스폰 (보스 브리프 §4).
- **`attack2`** — 팔이 바닥에 평평; 충격파가 분리되어 별개 엔티티.
  Sigil amber-mid. Eye-slit amber-mid. 몸 재정착하면서 머리가 한 셀 내려옴.

### `recover` — 4 프레임, 3 fps (~90-프레임 취약 창)

팔은 여전히 바닥에 늘어져 있고; sigil은 `recover` 창 전체에 걸쳐 mid-
bright에서 dim으로 페이드. **Warden은 `recover` 동안 가장 취약** — chest
sigil이 도끼 hitbox이고, 플레이어가 읽고 조준할 수 있도록 가시적으로
노출된 상태로 머무른다.

- **`recover0`** — 팔이 바닥에 늘어짐. Sigil amber-mid.
- **`recover1`** — 몸통이 무릎 자세로 천천히 돌아옴. Sigil 여전히 amber-
  mid (플레이어의 주요 도끼 창).
- **`recover2`** — 팔이 바닥에서 들림. Sigil이 stone-joinery warm로
  어두워짐 (여전히 가시적).
- **`recover3`** — Warden이 무릎 자세로 정착. Sigil 최소 밝기. 머리
  거의 완전히 숙임. 다음 상태: `idle` 재진입.

### `hurt` — 2 프레임, 16 fps (~10-프레임 stagger)

도끼가 chest sigil을 맞췄을 때 짧은 stagger. Warden의 HP가 1 감소하고;
현재 상태 타이머가 `hurtFrames` 동안 일시정지.

- **`hurt0`** — **모든 곳 더 밝은 팔레트 플래시.** Warden 실루엣의 모든
  어두운 색이 한 단계 위로 올라감. v0.50 Mossplodder hit-flash 효과를
  생산 — "윽"으로 읽히는 단일 밝은 프레임. Sigil core-bright.
- **`hurt1`** — 이전 상태의 마지막 프레임 유지; sigil이 stone-joinery
  warm로 페이드. Eye-slit 어두움. 10-프레임 hurt 창의 9 hold-프레임 모두
  이 단일 매트릭스를 렌더링.

### `dead` — 5 프레임, 5 fps (~60-프레임 붕괴)

Warden의 마지막 비트. 6번째 도끼 명중이 들어간 후 재생; 60-프레임 축하
일시정지 + 페이드-투-블랙 + Area Cleared 오버레이 시퀀스가 뒤따른다.

- **`dead0`** — **sigil 파열.** Warden은 여전히 직립; sigil이 core-bright
  로 가슴 주변에서 스파크가 분출 (rows 16-18, cols 16-23, dawn-amber와
  pale-gold). Eye-slit peak. 플레이어의 "해냈다" 프레임.
- **`dead1`** — 몸이 뒤로 기울임.
- **`dead2`** — 붕괴 시작. 몸통이 뒤로 떨어짐 — 압축된 수평 몸체.
  머리가 위쪽으로 돌아감.
- **`dead3`** — Warden이 뒷벽에 평평. 몸은 긴 낮은 블록. Bracken fronds
  바깥쪽으로 펼쳐짐. Sigil이 어두운 pillar-shadow-violet으로 줄어듦.
- **`dead4`** — **정착.** 이끼 층이 실루엣 위로 눈에 띄게 두꺼워짐. Sigil
  어두움 (pillar-shadow-violet — 자고 있다, 빛나지 않는다). 머리 안 보임;
  이끼가 덮었다. 이것은 전투 후 실루엣 — 페이드-투-블랙까지 몸이 가시적
  으로 남는다.

## 이전 페이즈와의 팔레트 겹침

18개 hex 중 11개는 Phase 1 / 2 / Phase 3 스테이지 타일셋에서 그대로 재사용
된다. 새 4개는 보스 + Phase 3 전용: stone-joinery warm, bracken-frond
deep, cairn-mantle moss, sigil core-bright.

v0.75 테마 리맵 메모: 4개의 이전 "carved-stone" 가족 hex (`#684e6e`,
`#8a8478`, `#5a5448`, `#a89c80`) 는 hex 값을 유지하며 어두운-숲 타일셋과
공유되도록 역할이 재지정되었다 — 유적 모자이크 바닥 대신 풍화된 줄기/캐노
피 그림자/달빛-껍질 highlight를 의미한다. Warden은 여전히 "바닥과 같은
재질로 만들어진" 것으로 읽힌다 — 단지 그 바닥이 다른 어조의 같은 세계.

## Forward-only — 여기 없는 것

보스 브리프 §3에 따라 Warden은 `walk`, `turn`, `idle_armed` 등가물이 없다.
Warden은 고정 위치; Reed를 쫓지 않는다. 여기 출고된 6 애니메이션 + 17 프레
임은 FSM의 모든 상태를 다룬다.

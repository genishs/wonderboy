# Preview — Reed v0.75 재구축 (`hero-reed.js`, 24 × 36)

> 리뷰어 노트: hero 스프라이트의 **전체 재구축**으로, 16 × 24 아트의
> [`preview-hero-reed.md`](./preview-hero-reed.md) /
> [`preview-hero-reed-armed.md`](./preview-hero-reed-armed.md) /
> [`preview-hero-reed-v0502.md`](./preview-hero-reed-v0502.md)를 대체한다.
> 이전 문서들은 역사적 기록으로 보존하되, v0.75부터 출고되는 실제 스프라이트는
> 이 문서에 기술된다.
>
> **영문 원본:** [`preview-hero-reed-v075.md`](./preview-hero-reed-v075.md)

## 핵심 변화

| 항목                            | v0.50.2 (이전)        | v0.75 (이번 재구축)              |
|---------------------------------|-----------------------|----------------------------------|
| 아트픽셀 격자                   | **16 × 24**           | **24 × 36**                      |
| 로지컬 렌더 크기 (`sprite.scale = 3`) | 48 × 72 px      | **72 × 108 px**                  |
| Anchor                          | `{ x: 8, y: 23 }`     | `{ x: 12, y: 35 }` (발 가운데)   |
| 기본 fps                        | 8                     | 6                                |
| 히트박스 (dev 소유)             | 30 × 66               | 30 × 66 (변경 없음)              |
| 팔레트 항목                     | 18                    | 20 (신규 `#f4c898` 1개, 재사용 `#5a8a4a` 1개) |
| 프레임 수                       | 31                    | 38                               |

## 재구축의 이유

v0.50.2 플레이테스트 후 프로젝트 소유자 피드백:

> "그리고 이번 버전에서 플레이어 애니메이션도 바꾸면 좋겠어. 그래픽이
> 뭉개져서 프레임도 너무 빨라서 미친듯이 춤추는 모습으로만 나와."

두 가지 근원:

1. **"뭉개져서":** 16 × 24 아트픽셀 격자는 12개 애니메이션 키 (idle /
   idle_armed / walk / walk_armed / jump / jump_armed / sprint /
   sprint_armed / attack / hurt / stumble / death)를 표현하기에 해상도가
   부족했다. 프레임 간 신체 차이가 일반화된 덩어리 실루엣으로 뭉개졌다.
2. **"프레임이 너무 빠르다":** v0.50.2에서 추가된 애니메이션별 fps는 작은
   격자에 맞춰 튜닝되어 있었다. Reed의 실제 sprint 속도(3.5 × 1.4 = 4.9
   px/frame 물리 → 294 px/sec)에서 12 fps × 4프레임 sprint 사이클은
   초당 ~3 보를 돌렸다. 그 지면 속도의 진짜 달리기는 초당 ~2보; 과속
   cadence가 "춤추는" 모습으로 읽혔다.

이번 재구축은 **셀을** 24 × 36으로 키우고 **애니메이션별 fps를** 늦춰서
각 사이클이 실제 cadence에 맞도록 양쪽 모두를 해결한다.

## 애니메이션 cadence — v0.75 vs v0.50.2

| 키             | 프레임 | v0.50.2 fps | v0.75 fps | v0.75 사이클 | v0.75 초당 stride |
|----------------|------:|------------:|----------:|-------------:|------------------:|
| `idle`         | 3 (이전 2) | 4         | **3**     | 1.00 s       | n/a (호흡)        |
| `idle_armed`   | 3        | 4           | **3**     | 1.00 s       | n/a (호흡)        |
| `walk`         | 4 (이전 3)| 8           | **5**     | 0.80 s       | **~1.25** (차분한 걷기) |
| `walk_armed`   | 4        | 8           | **5**     | 0.80 s       | **~1.25**         |
| `sprint`       | 4        | 12          | **8**     | 0.50 s       | **2.00** (실제 달리기) |
| `sprint_armed` | 4        | 12          | **8**     | 0.50 s       | **2.00**          |
| `jump`         | 2 (이전 1)| 8           | **6**     | 0.33 s       | n/a (one-shot)    |
| `jump_armed`   | 2        | 8           | **6**     | 0.33 s       | n/a               |
| `attack`       | 3        | 8           | **6**     | 0.50 s       | n/a (날카로운 베기) |
| `hurt`         | 2 (이전 1)| 8           | **6**     | 0.33 s       | n/a               |
| `stumble`      | 3        | 8           | **6**     | 0.50 s       | n/a (one-shot)    |
| `death`        | 4        | 8           | **4**     | 1.00 s       | n/a (one-shot)    |

sprint cadence가 핵심: **8 fps × 4 프레임 = 사이클 0.5 s = 초당 2보**,
이는 물리 속도(4.9 px/frame × 60 fps = 294 px/sec ≈ 작은 달리는 소년의
초당 2보)와 일치한다. "미친듯이 춤추는" 불만은 사라져야 한다.

walk cadence(5 fps × 4 프레임 = 사이클 0.8 s ≈ 초당 1.25보)는 v0.50.2보다
**의도적으로 더 느리게** 잡았다 — Reed의 walk 속도(변경 없이 ~3.5 px/frame
물리)는 활발하지만 달리기 직전의 빠른 걷기에 가깝기 때문이다.

## 프레임 일관성 (실루엣 쪽의 "춤추는" 수정)

v0.50.2 walk 사이클은 매 프레임마다 머리와 몸통을 다시 그렸다 — 16 × 24
크기에서의 작은 서브픽셀 이동이 깜빡이는 몸통으로 읽혔다. 이번 재구축은
**0–22 행(머리 + 몸통)이 4개 walk 프레임 전체에서 바이트 동일**하게
만들어 그것을 고친다. 23–35 행 (다리 + 발), 그리고 몸통 옆구리의
자유-팔 cuff 셀만 프레임마다 변한다.

- `walk0` — 오른다리 리드 (heel-strike forward, 접지 자세). 자유 팔은
  자연스러운 counter-swing을 위해 LEFT 쪽으로 앞으로 흔든다.
- `walk1` — passing 자세: 양발 엉덩이 아래, 양팔 낮음.
- `walk2` — 왼다리 리드 (mirror 접지). 자유 팔은 RIGHT 쪽으로 앞으로
  흔든다.
- `walk3` — passing 자세 (walk1의 mirror); 머리 + 몸통은 동일.

sprint(더 넓은 stride + 앞으로 기운 상체)와 jump(jump0에서 무릎 모으고,
jump1에서 벌림)에도 같은 원리.

## 실루엣 의도 — 24 × 36에서

Reed는 작고 탄력 있고 앞으로 기운 소년으로 읽힌다:

- **머리카락 부분** (2–5행)이 머리 중앙보다 앞에 있고 — 너비 6셀,
  16 × 24에서 불가능했던 hair-shadow `#7a2e18` 띠를 위한 공간 확보.
- **얼굴** (5–9행)에 광대뼈, 눈 띠 (10·15열 skin-shadow), 턱, 그리고
  이마 모서리의 새 skin-highlight catchlight(`#f4c898`)를 위한 전용 셀.
- **튜닉 어깨** (12–14행)에 inner-shoulder 모서리에 moss-mid highlight
  `#5a8a4a` — 보스 + dark-forest와 같은 hex를 공유하므로, Reed의 튜닉이
  그가 걷는 세계와 같은 옷감 가족에 속한다는 게 시각적으로 보인다.
- **cuff-cream 가슴 패널** (11–14행)이 3셀이 아닌 4셀 너비로 — 빛-띠
  단서가 눈에 명확.
- **벨트** (20행)는 `#d8c8a8`의 7-pebble 행; 단순한 버클 하이라이트가
  아니라 끈에 꿰어진 강돌들로 읽힌다.
- **주머니**가 오른쪽 엉덩이(16–19행)에 — v0.50.2와 같은 구성이지만
  깊이를 위해 어두운 주머니 셀 `#3e4850` 1개 추가.
- **다리** (23–32행)는 엉덩이에서 2셀 떨어져 있고, 합쳐진 한 덩어리가
  아닌 명확한 쌍으로 읽힌다.
- **발** (33–35행)이 1행이 아닌 3행을 가지며; 35행의 toe 그림자 띠가
  지면 접촉선.

## 프레임 — `idle` / `idle_armed` (3 프레임 @ 3 fps)

`idle0` 중립 → `idle1` 호흡 들이쉼 (가슴 catchlight가 1셀 위로, cuff
하이라이트가 12–13행에 표시) → `idle2` 호흡 내쉼 (중간으로 되돌아옴).
3프레임 `in / hold / out`이 차분한 1초 호흡으로 읽힌다. `idle_armed`는
오른쪽 엉덩이에 벨트에서 늘어진 stone hatchet 추가 — `#c89a68`
cloth-wrap의 손잡이가 주머니 옆에 보임.

## 프레임 — `walk` / `walk_armed` (4 프레임 @ 5 fps)

위에서 설명. armed 버전은 trailing 다리와 counter-phase로 hatchet를 든다:

- `walkArmed0` (오른다리 리드): hatchet **앞으로 흔듦** (머리가 몸통
  오른쪽 가장자리에서 2셀 더 보임).
- `walkArmed1` (passing): hatchet 엉덩이에.
- `walkArmed2` (왼다리 리드): hatchet **뒤로 흔듦** trailing 쪽에서
  (머리가 16–17행, 3–5열에 보임).
- `walkArmed3` (passing): hatchet 엉덩이에; 다음 루프의 앞 스윙 준비.

## 프레임 — `sprint` / `sprint_armed` (4 프레임 @ 8 fps)

walk와 5가지 차이:

1. **더 넓은 stride.** 리드 발이 4–5열 더 멀리 닿고; trailing 발은 3열
   더 뒤로.
2. **무릎 들림.** sprint 접지 프레임은 무릎이 28행이 아닌 26행에 있고,
   허벅지-정강이 각도가 보인다.
3. **앞으로 기움.** sprint 프레임에서 머리 + 몸통이 한 열 오른쪽으로
   이동 — 자세가 "지면을 덮는다"로 읽힌다.
4. **Trail wisps.** trailing 발 뒤, 몸통 뒤쪽:
   - 접지 프레임 (sprint0, sprint2): 4셀 trail — amber 내부 `#f8b860`
     + pale-violet 외부 `#a888b0`.
   - passing 프레임 (sprint1, sprint3): 2셀 trail — 단일 amber +
     단일 violet.
5. **머리카락 바람에 휘날림.** 앞으로 기운 이동에서 상속된 효과; 앞머리
   forelock이 얼굴보다 앞서 보임.

armed sprint도 같은 body 사이클; hatchet은 armed walk와 같은 리듬으로
흔들리지만 wide arc로 흔들지는 않는다(머리가 trailing 팔에 부딪힘) —
stride와 함께 앞-중립-뒤-중립 회전.

## 프레임 — `jump` / `jump_armed` (2 프레임 @ 6 fps)

- `jump0` (상승): 무릎 모아 당김, 팔을 넓게 펼침. 이륙의 순간.
- `jump1` (하강): 다리가 착지를 위해 앞뒤로 벌어짐, 팔이 옆으로 내려옴.
  "내려오는 중"으로 읽힘.

armed: 양 프레임에서 hatchet이 몸통 왼쪽에 단단히 고정 (앞으로 기운 팔과
충돌하지 않게). 렌더러의 기존 jump-state 디스패처는 공중 단계 전체에
어느 한 프레임을 재생하거나, dev-team이 원하면 `vy < 0`에 `jump0`을,
`vy > 0`에 `jump1`을 골라 다른 낙하 자세를 줄 수 있다.

## 프레임 — `attack` (3 프레임 @ 6 fps)

v0.50.2와 같은 overhand cleave를, 더 깨끗한 read를 위해 24 × 36에서
다시 그림:

- `attack0` (windup): hatchet이 머리 위 오른쪽으로 올라감, 몸통이 받침
  자세 (오른발 앞에 단단히, 왼발 뒤로). 머리가 앞으로 기움.
- `attack1` (release): 팔과 hatchet이 머리 높이로 앞으로 휘둘러짐.
  hatchet 머리가 7–9행, 20–22열에 — 명확히 몸통 실루엣 밖.
- `attack2` (recover): hatchet이 엉덩이로 풀어짐; 자세가 idle로 복귀.

참고: 발사된 hatchet은 발사체 엔티티가 됨(dev-team 소유); `attack1`의
시각적 hatchet은 **스윙 호**이지 발사체가 아님.

## 프레임 — `hurt` (2 프레임 @ 6 fps)

`hurt0` recoil → `hurt1` recover. v0.50.2는 단일 프레임이었음; 재구축은
hit이 1-tick 깜빡임 이상으로 읽히게 두 프레임을 줌:

- `hurt0`: 팔을 양옆으로 넓게 던짐, 눈을 찡그림 (눈썹 라인 10–11열과
  14–15열에 skin-shadow), 다리를 균형을 위해 벌림.
- `hurt1`: 팔이 약간 내려옴, 다리가 idle 자세로 돌아옴. 단호한 컷 없이
  idle로 다시 브릿지.

## 프레임 — `stumble` (3 프레임 @ 6 fps)

unarmed와 armed 간에 공유 (v0.50.2와 동일).

- `stumble0` (앞으로 기움): 머리 내려감, 자유 팔이 앞으로 휘청, 리드 발
  공중에서, trailing 발 스키딩.
- `stumble1` (완전히 넘어짐): 몸통이 가운데-프레임(14–22행)에 수평으로
  눕고, 손바닥이 앞에서 받아냄, 머리가 오른쪽 가리킴, 엉덩이가 왼쪽에.
- `stumble2` (밀어 올림): 몸통이 다시 부분적으로 수직, 한 무릎이 아래로
  굽힘, 팔이 무게를 받음. walk로 다시 브릿지.

## 프레임 — `death` (4 프레임 @ 4 fps)

v0.50.2(8 fps였음)보다 더 느림 — 죽음의 순간이 빠른 쓰러짐이 아닌 실제
박자로 읽히도록.

- `death0` (knockback 상승): 팔이 머리 위로 던져짐 (헤어라인 위쪽 0–3행에
  보임), 발이 지면을 떠남. 강타당한 순간.
- `death1` (공중 기울임): 몸통이 수평으로 눕고, 머리가 LEFT를 가리킴
  (14–17행, 2–10열), 발이 RIGHT를 가리킴. 눈을 감음.
- `death2` (지면 충격): 몸통이 프레임 하단 행(28–35)에 추락. 머리카락이
  왼쪽으로 흩어지고, 발이 오른쪽으로 끌림.
- `death3` (정착): death2와 같은 구성, 실루엣이 양쪽 1셀씩 압축. **페이드
  친화적**: 무게중심이 death2와 동일하므로 alpha cross-fade가 위치
  팝이 아닌 정지로 읽힘.

`dead` 키 (Phase 1 별칭)는 `[death3]`로 해석됨 — 렌더러의 옛 폴백
체인이 `dead`를 요청하는 모든 소비자에게 여전히 작동.

## dev-lead용 렌더러 노트

v0.50.2의 `pickAnim(state)` 규칙이 변경 없이 그대로 적용:

```
unarmed + ground + vx≠0, X held → 'sprint'
unarmed + ground + vx≠0          → 'walk'
unarmed + ground + vx=0          → 'idle'
unarmed + airborne               → 'jump'  (상승은 jump0, 하강은 jump1)
armed + ground + vx≠0, X held    → 'sprint_armed'
armed + ground + vx≠0            → 'walk_armed'
armed + ground + vx=0            → 'idle_armed'
armed + airborne                 → 'jump_armed'
attacking (any state, X tap)     → 'attack' (overlay; 3-frame; 이동 잠금 없음)
stumble (rock-trip / respawn)    → 'stumble' (one-shot; 3-frame)
dying (lives system, on death)   → 'death'   (one-shot; 4-frame)
hurt                             → 'hurt'    (2-frame, 6 fps에서 재생)
```

**히트박스는 변경 없음.** 렌더러는 `tf.x + tf.w/2 - meta.anchor.x * scale`로
스프라이트를 정렬한다. `anchor.x = 12`, `tf.w = 30` logical px에서
스프라이트 중앙 열은 이전과 같은 logical x에 떨어진다; 추가된 너비
(24 - 16 = 8 art-px → scale 3에서 24 logical-px)는 각 쪽으로 12
logical-px씩 흘러나간다. 그것은 머리카락 들림, 팔 스윙, 죽음 상승을
위한 의도된 헤드룸이고 — 충돌 변경 필요 없음.

## 모듈 크기 영향

| 파일              | v0.50.2 | v0.75 재구축 |
|-------------------|--------:|------------:|
| 프레임 수         | 31      | 38          |
| 프레임당 행 수    | 24      | 36          |
| 프레임당 열 수    | 16      | 24          |
| 프레임당 셀 수    | 384     | 864         |
| 총 셀 정수        | 11,904  | 32,832      |
| `hero-reed.js` 라인 | ~525   | ~1,725      |
| 비압축 JS         | ~25 KB  | ~75 KB      |

파일은 ~3배 커지지만 여전히 빌드 단계 없이 단일 ES 모듈로 배송된다.
gzip은 높은 run-length 정수 배열을 적극적으로 압축한다.

## 이번 재구축의 팔레트 추가

| 인덱스 | Hex       | 역할                                      | 상태                                |
|------:|-----------|-------------------------------------------|-------------------------------------|
| 18    | `#f4c898` | 피부 하이라이트 (이마/광대 catchlight)     | **신규** — 누적 프로젝트 팔레트에 추가됨 |
| 19    | `#5a8a4a` | 이끼-중간 하이라이트 (튜닉 어깨)           | 재사용 — Phase 3 cairn-mantle moss (보스 + dark-forest) |

누적 프로젝트 팔레트: 91 → **92** 고유 hex. 120색 예산 대비 여유:
29 → **28**. 전체 목록은 [`palette-phase3.md`](./palette-phase3.md) 참조.

## 의도적으로 변경하지 않은 것

- Reed의 실루엣 정체성 (작고 앞으로 기운 소년, 머리카락-앞-tuft,
  cream cuff가 있는 이끼 튜닉, 강돌 벨트, 오른쪽 엉덩이의 sling 주머니,
  무장시 stone hatchet).
- Reed의 이름 (Bramblestep), 나이감, color-mood 키워드.
- 히트박스 (30 × 66 logical px) — dev-team이 소유; 재구축은 이를 동일하게
  유지하여 jump/walk/collision 튜닝이 이월된다.
- 이 PR의 다른 어떤 sprite, tile, boss, projectile 모듈.
- `dead` Phase 1 키 (`[death3]` 별칭으로 유지).

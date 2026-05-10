# 미리보기 — Reed 무장 상태 + overhand cleave (`hero-reed.js` 확장)

> 리뷰어 노트: 이 파일은 Phase 2 (v0.50) 에서 추가된 새 프레임 + 교체된 `attack`
> overhand cleave 를 설명한다. Phase 1 프레임 (`idle`, `walk`, `jump`, `hurt`,
> `dead`) 은 변경되지 않았으며 [`preview-hero-reed.md`](./preview-hero-reed.md)
> 에 설명되어 있다. ASCII 실루엣은 `.js` 파일 내부 주석으로 들어 있다.
>
> **English:** [`preview-hero-reed-armed.md`](./preview-hero-reed-armed.md) (canonical)

| 필드          | 값                                  |
|---------------|-------------------------------------|
| 경로          | `assets/sprites/hero-reed.js`       |
| 크기          | 16 × 24 px (변경 없음)               |
| 앵커          | `{ x: 8, y: 23 }` (발 중앙)          |
| FPS           | 8                                   |
| 팔레트        | 16 개 항목 (Phase 1 에서 13 → 해치트 머리/그립/그립-그림자 +3) |
| 접근법        | 프레임당 완전한 새 매트릭스 (composite 아님). 가능한 곳에서는 Phase 1 실루엣과 같은 body 셀을 공유하지만, 해치트는 각 새 프레임에 직접 그려져 있어 렌더러가 overlay 레이어 없이 단일 키로 플래시할 수 있다. |

## 저작 접근법

cast brief (§2.3) 는 Design 이 unarmed 와 armed 사이의 body 프레임을 공유하고 들고 있는 도구 레이어만 교체하는 것을 허용했다. 우리는 **armed 프레임당 완전한 새 매트릭스** (총 12 개 새 프레임) 를 선택했다. 이유:

1. 렌더러의 pickAnim 헬퍼는 이미 armed 플래그로 anim 을 교체한다 — composite 레이어가 필요 없으니 그것을 추가하면 캐시만 복잡해진다.
2. 완전 매트릭스로 해치트 위치를 프레임별로 미세 조정할 수 있다 (예: `walk_armed[0]` 에서 해치트가 한 셀 앞으로 흔들리고 `walk_armed[2]` 에서 뒤로 흔들림). 순수 overlay 로는 어차피 overlay 세트를 따로 만들지 않는 한 불가능하다.
3. 모듈 크기 영향은 작다: 새로운 24-행 프레임 12 개 = 288 개의 배열 리터럴, hero 스프라이트로서 합리적인 파일 크기에 충분히 들어간다.

## 프레임 — 교체된 `attack` (overhand cleave, 3 프레임)

Phase 1 의 단일 사이드-암 플릭을 교체한다. cast brief §2.2 에 따라:

- **`attack0`** — **windup**. 해치트가 머리 위 뒤쪽에 들려 있다: 머리/손잡이 스택이 행 0 (`13 14 14 13` — 머리 쐐기) 에서부터 우측 column 12-15 를 거쳐 `15 1` (cloth-wrap 이 외곽선으로) 으로 내려간다. body 가 살짝 뒤로 이동; trailing-foot 발뒤꿈치가 ~1 셀 뒤로. Reed 의 머리가 앞으로 기울어 (헤어라인이 1 셀 떨어짐) "어깨 너머로 무게 실은" 모습으로 읽힌다.
- **`attack1`** — **release**. 팔이 머리 높이까지 완전히 펴진다. 해치트는 공중에 — 행 9 의 column 12-15 에 희미한 손잡이 셀 (`13 13 14 15`) 만 모션 라인으로 남는다. body 가 앞으로 열리고; 리드 풋이 ~1 셀 앞으로. 자세가 "던지는 무게 commit" 으로 등록된다.
- **`attack2`** — **recover**. 팔이 몸 옆으로 이완된다. 해치트는 사라진다 (이제 발사체 엔티티). 자세가 idle 로 복귀 — 발 단단히 디딤, 튜닉 곧음. 이 프레임은 던진 후 `idle_armed` / `walk_armed` 로 돌아가는 다리 역할이다. 던지기는 여전히 이동을 잠그지 않는다 (cast §2.2); Dev 는 이 3-프레임 시퀀스를 body 가 현재 하고 있는 것 위에 overlay 로 재생한다.

## 프레임 — `idle_armed` (3 프레임)

body 는 Phase 1 의 `idle` 과 동일하지만 해치트가 던지는 손에서 허리께에 놓여 있다. 해치트 column 은 행 14 (머리) + 행 15 (머리 더) + 행 16 (손잡이가 외곽선으로) 의 column 11-14 에 나타난다.

- **`idleArmed0`** — 중립 자세 + 해치트 허리에. body 는 Phase 1 `idle0` 과 동일. 해치트 머리가 허리 가방 옆에 두 개의 stone 셀로; cloth-wrap 이 (암시된, 프레임 밖의) 손에 묶고 있다.
- **`idleArmed1`** — 호흡 상승 + 해치트 허리에 휴식. body 는 Phase 1 `idle1` 과 동일 (머리/헤어라인이 1 셀 위로). 해치트 위치는 변하지 않는다 (손에서 늘어진 것이지 호흡하는 것이 아니다) — 시각적으로 몸통이 까딱이는 동안 허리에 고정된 채로 머문다.
- **`idleArmed2`** — 날숨 + 해치트가 앞으로 까딱. body 는 `idleArmed0` 과 같지만 해치트가 한 셀 앞으로 이동했다 (휴대-손이 날숨에 무한히 작게 흔들렸다). 8 fps 로 재생하면 세 프레임이 날숨 / 들숨 / 날숨으로 순환하며 해치트가 사이클당 한 번 까딱인다.

## 프레임 — `walk_armed` (4 프레임)

다리는 Phase 1 의 `walk0/1/2` 와 동일, 그리고 카운터-페이즈 해치트 스윙이 사이클당 4 개의 별개 위치를 갖도록 4번째 passing-pose 미러 프레임을 추가했다.

- **`walkArmed0`** — **contact 자세**, trailing leg 뒤로. 해치트가 허리를 지나 **앞으로** 흔들린다 (trailing leg 와 카운터-페이즈). 해치트 머리가 body 의 우측 2 셀 앞에 보임, 행 12-14 의 column 12-14. "왼손에 무게, 오른쪽으로 흔들림" 으로 읽힌다 (좌향 이동은 렌더러가 미러).
- **`walkArmed1`** — **passing 자세**, 양 발이 엉덩이 아래. 해치트는 중립 허리 — 카운터-페이즈 사이클의 중간점. 해치트 머리는 `idleArmed0` 처럼 측면에 평평히 앉는다.
- **`walkArmed2`** — **반대 contact**, lead leg 앞으로. 해치트가 허리 뒤로 **뒤쪽** 으로 흔들린다 (이제 body 뒤로 처짐). 두 개의 해치트 머리 셀이 행 13-15 의 column 1-3 에 Reed 뒤에 나타남 — walk0 와 명확한 실루엣 반전.
- **`walkArmed3`** — **복귀 passing**, 다음 반-사이클의 시작. body 는 walkArmed1 과 동일하지만 해치트가 중립보다 한 셀 앞에 — 다음 앞쪽 스윙을 준비. 8 fps 로 0→1→2→3→0 재생하면 4 박자의 carry-walk 로 읽힌다.

## 프레임 — `jump_armed` (2 프레임)

body 는 Phase 1 의 `jump0` 과 동일 (단일 결합 rise/fall 프레임). 두 개의 해치트 위치로 Dev 가 rising 에 [0,1] 을, falling 에 [1,0] 을 플래시할 수 있다.

- **`jumpArmed0`** — **상승**. body 는 Phase 1 `jump0` 과 동일. 해치트가 우측 옆구리를 따라 몸통에 단단히 고정 — 머리 셀이 행 12 column 12, 손잡이가 행 13-16 으로 내려감. 시각적으로 컴팩트: 공중 Reed 가 무게를 든 닫힌 실루엣으로 읽힌다.
- **`jumpArmed1`** — **하강**. body 동일. 해치트 위치가 약간 이동: 머리가 이제 행 13 으로 내려가고 손잡이가 행 14-17 로 — 들고 있는 무게가 falling-arc 자세에서 더 낮게 자리잡았다. 미묘하지만 별개의 body 프레임 두 개 없이도 렌더러가 교대할 수 있게 한다.

## dev-lead 를 위한 렌더러 노트

렌더러의 `pickAnim(state)` 헬퍼는 다음과 같이 매핑되어야 한다:

```
unarmed + ground + vx≠0 → 'walk'
unarmed + ground + vx=0 → 'idle'
unarmed + airborne      → 'jump'
armed + ground + vx≠0   → 'walk_armed'
armed + ground + vx=0   → 'idle_armed'
armed + airborne        → 'jump_armed'
attacking (any state)   → 'attack' (overlay; 3-frame sequence; does NOT lock movement)
hurt                    → 'hurt'  (Phase 1 — unchanged; 1-hit-kill so brief flash)
dead                    → 'dead'  (Phase 1 — unchanged)
```

`hurt` / `dead` 프레임은 의도적으로 armed 변형을 갖지 않는다 — 죽음은 해치트를 제거하고 (cast §2.5), `hurt` 는 v0.50 에서 armed overlay 를 요구하기에 너무 짧다.

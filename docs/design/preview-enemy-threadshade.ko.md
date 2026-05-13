# 프리뷰 — `enemy-threadshade.js` (v0.75.1)

> 소유자: design-lead. 스펙: `docs/briefs/phase3-area1-expansion.md` §16.
> **English version:** [`preview-enemy-threadshade.md`](./preview-enemy-threadshade.md)

스프라이트 모듈: `assets/sprites/enemy-threadshade.js`. 치수: **18 × 24
art-pixel** (수평으로 뻗은 다리 + 수직 본체 + 위쪽 실). 앵커:
`{ x: 9, y: 23 }` (베이스-센터 그리기 기준; 개발자의 AI가 사인-파 오실레이터에
따라 `y`를 계산). FPS: **6** (story-lead §16.5에 따른 patient 페이싱과 맞도록
Hummerwing의 8 fps보다 느림). 애니메이션 키: `drift` (2 프레임), `dead`
(2 프레임).

## 프레임별 설명

### `drift` 프레임 0 — `hang_a`

pale moonlight-silver-cream 실(`#cfd8dc`)이 스프라이트 맨 위에서 수직으로
내려온다 (rows 1–8). 그 아래, 스프라이트의 낮은 곳에 매달린 컴팩트한 둥근
본체 (rows 9–17): canopy-shadow-violet(`#684e6e`) 배-아래, velvet under-flame
(`#5a4a6e`) 외부 본체, 중앙 컬럼을 따라 작은 chitin-warm(`#7a5a48`) 본체 큐,
등을 따라 단일 moss-mottle(`#3e6a3a`) 셀. 본체의 하반부에서 6개의 짧은
다리-손가락이 바깥쪽으로 뻗어 있다 (rows 17–22), 바이올렛 언더-셰이드와 잉크로.
두 개의 핀프릭 amber 눈-광채(`#e8a040`)가 본체의 낮은 곳에 위치하고
(rows 14–15), chitin-warm 컬럼 중앙에 배치 — 생물 위의 유일한 따뜻한 노트.
눈은 핀프릭이며, **방향성이 없다** — 플레이어를 보지 않는다 (Mossplodder의
"no aim" 컨벤션과 일치).

### `drift` 프레임 1 — `hang_b`

거의 감지할 수 없는 변화. 실은 row 4에서 단일 펄스 세그먼트
(thread-shimmer-pale `#fff8e8`)를 보여준다 — 실 길이의 ~1/3 아래로 이동하는
더 밝은 셀로, 실이 펄스할 만큼 살아있음을 암시한다. 6개의 다리-손가락 중
2개가 ~1픽셀 바깥쪽으로 뻗는다 (가장 바깥쪽 왼쪽과 가장 바깥쪽 오른쪽 다리가
row-20 대신 row-21로 전환), 거의 보이지 않는 "다리-시머"를 만든다. 본체 자체는
눈에 띄게 이동하지 않는다. 무드는 **공격이 아니라 호흡** — Threadshade는
patient하며, 포식자가 아니다.

### `dead` 프레임 0 — thread-snap-mid

실이 스프라이트 맨 위에서 절단되었다 (rows 1–4에 실 셀 없음). 남은 실은
rows 5–7에 보인다. 본체가 슬럼프했다: chitin-warm 본체 큐가 사라졌다
(canopy-shadow-violet `#684e6e`로 대체), 다리가 안쪽으로 말렸다 (더 이상
바깥쪽으로 뻗지 않고 본체의 중앙 컬럼에 가깝게 당겨짐), 그리고 눈-광채는
어두워졌지만 앞면에 여전히 보인다 (row 14, 중앙). 이 프레임에서 Threadshade는
"방금 맞아서 떨어지려는" 모습으로 읽힌다. 개발자는 §16.3에 따라 이 시점에서
엔티티에 중력을 적용하여 다음 ~10 프레임 동안 스프라이트가 바닥 행으로
떨어지도록 한다.

### `dead` 프레임 1 — collapsed

Threadshade가 이제 바닥 행에 평평하게 누워 있다. 본체가 스프라이트 하단을
가로질러 수평으로 누워 있고 (rows 16–22), 다리가 양쪽으로 펼쳐져 있으며,
눈-광채는 사라졌다. 실은 보이지 않는다. 이 프레임은 개발자가 표준
Mossplodder 스타일의 히트-스파크 디졸브를 트리거하기 전에 ~10 프레임 동안
유지된다 (§16.3에 따라 — "frame 16–20 dissolves into the same hit-spark
sparkles as Mossplodder kills"). 만약 Threadshade가 바닥 라인 아래에서
죽임을 당한다면 (예: 갭 위로 스윙), 개발자는 이 프레임을 건너뛰고 화면 밖으로
엔티티를 despawn할 수 있다.

## 리뷰어를 위한 읽기 노트

- Threadshade는 **patient하며, 포식자가 아니다**. 나란히 렌더링하여
  "공포 요소"로 읽힌다면, chitin-warm 본체 큐가 살짝 더 시원해져야 하거나,
  등의 moss-mottle이 더 확장되어야 할 수도 있다.
- 눈-광채는 의도적으로 작다 (단일 핀프릭)이며 플레이어를 추적하지 않는다.
  본체 위의 유일한 따뜻한 노트이며, 실루엣 전에 *간신히* 플레이어의 주의를
  끌어야 한다 (story 브리프 §16.1에 따라).
- 실은 **시각 전용** — 개발자 스펙(§16.8)에 따르면 충돌은 본체 히트박스만
  (~32 × 32 px, 본체가 위치한 48 × 48 스프라이트 타일에서 약간 안쪽으로).
  실은 플레이어에게 데미지를 주지 않는다.
- 실은 실제 배치에서 스프라이트 상단에서 위로 계속 이어진다 — 개발자의
  렌더러가 실 셀을 가시 뷰포트로 클립할 수 있다. 스프라이트의 24 픽셀 높이는
  *본체 영역*이며 다리를 포함한다; 실은 그 24 픽셀의 상부이다.

## 개발 측 처리 (참고)

`enemy` 컴포넌트: `{ type: 'threadshade', dir: 0, ai: 'threadshade', hp: 1 }`.
AI 스텝 (story-lead §16.8에 따라): `phase += 0.04; y = baseY + Math.sin(phase)
* (3 * TILE / 2);` 여기서 `baseY`는 Threadshade가 스윙하는 3-타일 수직 범위의
중점이다. 같은 스테이지의 여러 Threadshade가 모두 같이 흔들리지 않도록 초기
`phase`는 스폰별로 랜덤화될 수 있다. 도끼 적중 시 → `enemy.hp -= 1` → 0 →
`dead` 프레임 + 히트-스파크 디졸브 재생 → despawn.

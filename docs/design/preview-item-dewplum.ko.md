# 프리뷰 — `item-dewplum.js` (v0.75.1)

> 소유자: design-lead. 스펙: `docs/briefs/phase3-area1-expansion.md` §15.
> **English version:** [`preview-item-dewplum.md`](./preview-item-dewplum.md)

스프라이트 모듈: `assets/sprites/item-dewplum.js`. 치수: **14 × 14
art-pixel**. 앵커: `{ x: 7, y: 13 }` (베이스-센터). FPS: **4** (story-lead
§15.3에 따른 미묘한 시머). 애니메이션 키: `idle` (2 프레임).

## 프레임별 설명

### `idle` 프레임 0 — 기본 읽기

작은 둥근 자두 형태, 깊은 강-블루 본체 (`#3a586a`). 작은 moss-green 잎-컬
(`#4a7c3a`)이 맨 위에 있고, 한 셀 너비로 줄기를 암시한다. 왼쪽-위 곡선에는
단일 pale-cyan 이슬-방울 픽셀(`#a8c8d8`)이 가상의 아침 빛을 잡고 있다 —
실루엣 위의 유일한 시원한 하이라이트. 아래 곡선을 따라 얇은 따뜻한 dawn-amber
림(`#e8a040`)이 익은 상태를 나타낸다 — 자두는 따기 직전이다. 보편 바이올렛
잉크(`#3a2e4a`)가 전체 실루엣을 둘러싼다. 베이스-센터 앵커로 땅에 밀착해
앉아 있다.

### `idle` 프레임 1 — 이슬 시머 펄스

프레임 0과 동일한 실루엣이지만, 이슬-방울 하이라이트가 row 4에서 row 3으로
한 픽셀 이동했고 더 밝은 cuff-cream (`#e8d4a0`)으로 바뀌었다 — 아침이 1도
회전함에 따라 이슬-방울이 더 밝은 광채를 잡는 것으로 읽힌다. 아래쪽의 amber
익은 림은 변하지 않았다. 자두는 그 외에는 움직이지 않는다. 4 fps에서 두 프레임
사이클은 반짝임이 아니라 호흡으로 읽힌다.

## 리뷰어를 위한 읽기 노트

- dewplum은 멀리서 **차분하고 평범하게** 읽혀야 한다 — 일반 픽업이지 특별한
  상품이 아님.
- 단일 이슬-방울 하이라이트가 플레이어에게 "신선하고 먹을 수 있음"을 알린다.
  캔버스의 기본 렌더 스케일에서 보여야 한다; 보이지 않으면 이슬-방울 픽셀이
  더 중앙 행으로 옮겨가야 할 수도 있다.
- 아래쪽의 amber 림은 **의도적으로 얇다** — 수평 호로 5픽셀. 시원한 강-블루
  본체와 경쟁하지 않으면서 따뜻함-측 큐가 된다.
- 눈은 없다; dewplum은 생물이 아니다.

## 개발 측 처리 (참고)

`item` 컴포넌트: `{ type: 'fruit_dewplum', collected: false }`. 히어로 접촉 시,
`state.vitality = Math.min(state.vitalityMax, state.vitality + 20)`; `collected
= true`로 전환; 수집 애니메이션 재생 (story-lead §15.3 — 12 fps에서 3-프레임
수집, 히트-스파크 반짝임 재사용); 애니메이션 종료 시 despawn. 미드-스테이지
respawn에서도 유지 (story-lead 스펙에 따라).

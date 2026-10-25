# 프리뷰 — `item-amberfig.js` (v0.75.1)

> 소유자: design-lead. 스펙: `docs/briefs/phase3-area1-expansion.md` §15.
> **English version:** [`preview-item-amberfig.md`](./preview-item-amberfig.md)

스프라이트 모듈: `assets/sprites/item-amberfig.js`. 치수: **18 × 18
art-pixel** (dewplum보다 눈에 띄게 큼). 앵커: `{ x: 9, y: 17 }` (베이스-센터).
FPS: **4** (story-lead §15.3에 따른 펄스 글로우 사이클). 애니메이션 키: `idle`
(3 프레임).

## 프레임별 설명

### `idle` 프레임 0 — 기본 읽기

dewplum보다 더 풍성한 눈물방울 무화과 형태. 따뜻한 dawn-amber 본체
(`#e8a040`)에 실루엣의 위쪽 둥근 부분에 더 밝은 amber 캐치(`#f8d878`)가 있다.
맨 위에 wet-bark-brown 줄기-옹이(`#4a3422`)가 있고, 작은 컬-된 moss-green 잎
(`#4a7c3a` 미드, `#2e5028` 그림자)이 좌-상향으로 뻗어 접혀 있다. 본체의
아래 절반에는 amber-deep(`#a85820`) 그림자 포켓이 흩어져 있어 피부 아래의
무화과 과육-그림자처럼 읽힌다 — 림보다 깊어서 본체에 무게를 준다.
바이올렛 잉크(`#3a2e4a`)가 실루엣을 둘러싼다.

### `idle` 프레임 1 — 펄스 상승

본체 형태는 변하지 않는다. 본체의 우-상 사분면에서 amber-bright 캐치가
pale-cream (`#e8d4a0`) 하이라이트 클러스터로 피어나며 약 5셀 너비로 확장된다.
이 프레임을 보는 플레이어는 "이 과일은 dewplum보다 더 밝다 — 특별한 것일
수도 있다"를 알아채야 한다. 아래쪽의 amber-deep 그림자는 변하지 않고, 따뜻함이
오른쪽 위에 집중된다.

### `idle` 프레임 2 — 펄스 피크

프레임 1의 pale-cream 하이라이트는 유지되며, 오른쪽 위 곡선 중앙에
fig-cream-bright (`#fff2c0`) 광채가 추가된다 — 작은 클러스터 안에 3 픽셀.
이는 amberfig 위의 가장 밝은 단일 픽셀 클러스터이며 v0.75.1 패치에서 가장
밝은 단일 hex이다 (보스의 sigil core-bright에서 재사용). 플레이어는 이
펄스로 **화면 건너편에서도** amberfig를 알아볼 수 있어야 한다 — 그것이 디자인
의도다: 희귀 과일은 멀리서 자신을 광고한다. 프레임 2에서 애니메이션은 4 fps로
프레임 0으로 순환하여 0.75초의 느린 펄스를 만든다.

## 리뷰어를 위한 읽기 노트

- amberfig는 dewplum보다 **눈에 띄게 더 밝고 따뜻하게** 읽혀야 한다. 나란히
  렌더링하여 비슷한 톤으로 보인다면, amberfig의 amber-deep 그림자가 더 깊어
  져야 할 수 있다 (`#a85820` → 좀 더 채도).
- amberfig의 잎-팁은 비대칭이다 (줄기-옹이에서 좌-상향으로 뻗음). 의도적이다 —
  눈은 "자연스럽다, 찍힌 것이 아니다"로 읽는다.
- 프레임 2의 가장 밝은 펄스 픽셀 클러스터는 보스-시질 패밀리 hex(`#fff2c0`)를
  재사용하여 "가장 밝은 amber = 살아있고 특별함" 읽기를 희귀 과일로 확장한다.
  의도적인 크로스-스프라이트 일관성 (palette-v0.75.1 §"크로스-스프라이트 일관성
  규칙" 참조).

## 개발 측 처리 (참고)

`item` 컴포넌트: `{ type: 'fruit_amberfig', collected: false }`. 히어로 접촉
시, `state.vitality = Math.min(state.vitalityMax, state.vitality + 50)`;
`collected = true`로 전환; 수집 애니메이션 재생 (12 fps에서 3 프레임, 더 큰
보상과 맞도록 dewplum보다 더 밝은 블룸); 애니메이션 종료 시 despawn. 미드-스
테이지 respawn에서도 유지.

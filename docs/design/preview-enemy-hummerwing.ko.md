# 미리보기 — `assets/sprites/enemy-hummerwing.js`

> **English:** [`preview-enemy-hummerwing.md`](./preview-enemy-hummerwing.md) (canonical)

| 필드   | 값                                  |
|--------|-------------------------------------|
| 경로   | `assets/sprites/enemy-hummerwing.js` |
| 크기   | 18 × 12 px                          |
| 앵커   | `{ x: 8, y: 6 }` (몸 중심 — Hummerwing 은 공중이라 흉부에 앵커) |
| FPS    | 12 (빠른 날개-블러 사이클)          |
| 팔레트 | 9 개 항목 (반투명 알파 3 개 포함 — Glassmoth 알파 정책 동일) |

> 크기 노트: cast brief §11 은 36 × 24 를 제안; user-instructions 는 "18 × 12 또는 비슷한 것" 을 허용했고 우리는 18 × 12 로 출고. TILE = 48 에서 Hummerwing 은 달리는 소년의 가슴 높이를 표류하는 작은 주먹만 한 비행체로 렌더된다 — 정확히 brief 의 "둥근 흉부와 두 짧은, 빠르게 진동하는 날개" 가독성. 기본 방향: LEFT (Reed 쪽).

## 실루엣 의도

위아래로 펼쳐진 빠르게-블러된 두 쌍의 날개가 있는 둥근 따뜻한 흉부. dust-pink 등 광택 + 새벽-호박 underglow 는 의도적이다: 플레이어가 시원한 숲 parallax 대비 "따뜻한 스파크" 를 느껴야 한다 (cast brief §4.1, §4.5). 반투명 날개는 **Glassmoth 알파-팔레트 정책** 을 그대로 재사용 — 동일한 세 알파 hex 값 (`#f4e8f0a0`, `#e0c8d870`, `#fff4f0c0`) 을 verbatim 사용해서 후일 어느 Area 에서 Glassmoth 가 돌아오면 두 비행체가 시각적으로 운율을 맞춘다.

이 스케일에서 착륙 다리는 보이지 않는다; 그저 buzz-blur, body, underglow 만.

## 프레임

### `drift` (3 프레임, buzz 를 위해 12 fps)

- **`drift0`** — **날개 위-블러**. 위쪽 날개 쌍이 body 위로 높이 펼쳐진다 (행 0-3), 날개 끝에는 옅은 haze 색을, body 근처에는 깊은 haze 를 사용. 아래쪽 날개 쌍은 body 에 바짝 접혀 있다 (행 9). body 수평 중심 행 5-7. "날개가 막 위로 밀렸다" 로 읽힌다.
- **`drift1`** — **날개 아래-블러**. 반대: 위쪽 날개 쌍이 가까이 접혀 (행 3), 아래쪽 날개 쌍이 body 아래로 펼쳐진다 (행 8-10). 12 fps 에서 교대가 빠른 날개 buzz, 벌새나 큰 날아다니는 딱정벌레 처럼 읽힌다.
- **`drift2`** — **passing-블러**. 날개 대칭 (각 측면 한 셀), body 이동 0. 이 프레임은 완벽한 2-프레임 루프를 깨뜨리고 buzz 에 미묘한 유기적 break 를 주어, sine-bob 수직 운동 (Dev 코드, cast §4.2) 이 날개 사이클과 시각적으로 운율을 맞추지 못하게 한다. 이 프레임이 없으면 body 의 bob 이 날개와 alias 되어 strobe 를 만들 것이다 — 세 번째 프레임이 둘을 desync 한다.

body 의 수직 sine-bob 은 Dev 가 계산해서 (cast §4.7 tunable) 화면-공간 y 오프셋으로 적용; 애니메이션 프레임으로는 적용하지 않는다. 스프라이트 자체는 12×18 셀 안에 중앙 정렬돼 있다.

### `dead` (3 프레임, ~30 프레임에 걸쳐 페이드; 사망 후 body 가 중력으로 떨어짐)

cast §4.4 에 따라: "플레이어가 '내가 떨어뜨렸다' 고 느껴야 한다."

- **`dead0`** — **날개 멈춤 / body 기움**. 양 날개 쌍이 body 에 짧은 stub 로 collapse; 흉부가 ~15° 앞으로 기움 (등 광택이 중심에서 한 셀 앞으로 이동). 호박 underglow 가 사라짐 — 따뜻함의 첫 부재.
- **`dead1`** — **중간-낙하, body 곧음**. 흉부가 한 논리 행 떨어졌고 이제 곧음 (스폰 column 에 중앙); 날개 stub 들이 body 가 떨어지면서 위로 끌린다. 단일 호박-underglow 셀이 바닥에서 잠시 돌아옴 — 따뜻함이 지면 충돌 직전에 한 번 더 잡힘. (이것이 brief 가 부르는 시각적 "warm spark falls cool" 비트.)
- **`dead2`** — **지면 충돌, 페이드**. body 가 지면에 평평해짐 (마지막 행); 충격 지점에서 dust-puff 셀들이 바깥으로 방사. 흉부가 호박을 잃음 (이제 대부분 그림자 + 외곽선). Dev 의 30-프레임 페이드가 전체 프레임의 알파를 0 으로 램핑.

## Forward-only — 여기 없는 것

cast brief §4.2 에 따라 Hummerwing 은 `swoop`, `hurt`, 고도-변경 애니메이션이 없다. 스프라이트는 정확히 두 개의 상태 머신을 출고: `drift` (살아있는 동안 연속) + `dead` (3-프레임 collapse + 지면-충돌 페이드). 비행체는 결코 플레이어를 사냥하지 않는다 — 그저 통근할 뿐이다.

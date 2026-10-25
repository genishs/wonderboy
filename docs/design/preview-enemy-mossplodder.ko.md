# 미리보기 — `assets/sprites/enemy-mossplodder.js`

> **English:** [`preview-enemy-mossplodder.md`](./preview-enemy-mossplodder.md) (canonical)

| 필드   | 값                                    |
|--------|---------------------------------------|
| 경로   | `assets/sprites/enemy-mossplodder.js` |
| 크기   | 24 × 16 px                            |
| 앵커   | `{ x: 12, y: 14 }` (발 중앙; 배 솔기 바닥 ≈ 행 14) |
| FPS    | 6 (느린-plod 박자, cast §3 에 따라)   |
| 팔레트 | 9 개 항목                             |

> 크기 노트: cast brief §11 은 48 × 36 을 제안했고; user-instructions 는 "24 × 16 또는 28 × 18" 을 허용했으며 우리는 24 × 16 으로 출고한다. TILE = 48 에서 Mossplodder 는 1/2 타일 높이, 풀-타일 너비 빵덩이로 렌더된다 — 정확히 brief 가 부르는 실루엣 ("지면에 낮은, 무릎 높이의 자란 껍질 덩어리"). 기본 방향: LEFT (Reed 쪽). 라운드 1-4 에서의 드문 우향 스폰은 렌더러가 미러.

## 실루엣 의도

대략 한 타일 너비의 자란 껍질 빵덩이. 비대칭: 선두 (좌측) 끝에 둥근 높은 돔이, 뒤로 길게 이어지는 비탈에 모스가 덮여 있다. **눈 없음** (cast brief §3.1). 위협 가독성은 전적으로 전진 운동 + 바닥 행을 따라 흐르는 밝은 cuff-cream 배 솔기에서 온다. 모스 가닥들이 trailing edge 에서 뒤쪽으로 끌리며, body undulation 사이클보다 한 프레임 lag 되어 idle 프레임에서도 "움직이는 중" 으로 읽힌다.

## 프레임

### `walk` (4 프레임, 6 fps 로 루프)

껍질 undulation 은 4 단계 사이클이다: front-rise → passing → back-rise → settle. 모스 가닥은 항상 body 보다 한 프레임 lag.

- **`walk0`** — **front-rise**. 선두-끝 돔이 passing 보다 ~1 셀 더 높이 들린다. 파동이 앞에서 시작. 모스 가닥들이 trailing 비탈의 행 4-6 을 따라 뒤로 끌린다. "body 의 앞쪽이 막 위로 밀렸다" 로 읽힌다.
- **`walk1`** — **passing**. 돔과 trailing 비탈 모두 중립 높이; 상단의 모스 패치가 재분배 (한 모스-그림자 셀이 뒤로 이동). 가닥 중립 길이. 이것이 사이의 프레임.
- **`walk2`** — **back-rise**. trailing 비탈이 passing 보다 ~1 셀 더 높이 들리고; 돔은 중립. 파동이 뒤로 굴러왔다. 모스 가닥이 가시적으로 끌림 (프레임-lagged, walk0 보다 김). "body 의 뒤쪽이 따라잡아 올라왔다" 로 읽힌다.
- **`walk3`** — **settle**. body 가 중립으로 복귀, front-rise 로 사이클을 돌아갈 준비. walk1 과 시각적으로 거의 동일하지만 가닥은 중립-trailing, 모스 패치의 그림자 셀들이 사이클 연속성을 위해 다른 위치에 있어서 (루프 경계에서 가시적인 "stutter" 프레임이 생기지 않음).

Mossplodder 가 벽에 부딪히면 (cast §3.2), Dev 는 `walk0` 을 holding 해야 한다 — front-rise 프레임이 "장애물에 plodding-in-place" 로 읽힌다.

### `dead` (3 프레임, cast §3.7 에 따라 ~30 프레임에 걸쳐 페이드)

해치트 contact 프레임이 곧 죽음 프레임이다; flash-then-die 없음. 접촉시:

- **`dead0`** — **앞쪽으로 기울어 균형 잃음**. 돔이 가라앉고, trailing 비탈이 올라가서 body 가 앞으로 피칭하는 듯. 모스 가닥이 우측 끝에서 늘어진다. 굴릴 눈이 없으므로 위협-가독성이 그저 멈춘다. 실루엣이 walk 자세보다 ~3 셀 앞으로 이동했다.
- **`dead1`** — **껍질 평평 / 모스 펼침**. body 가 지면에 평평히 정착; 모스 가닥이 trailing edge 에서 좌우로 1-셀 옅은-녹색 띠로 펼쳐진다. 돔은 더 이상 돔으로 읽히지 않는다 — 실루엣이 이제 낮은 빵덩이, 로움에 완전히 가라앉음. 두 개의 보랏 언더-그림자 셀 (Phase 1 hex 공유) 이 끝 가장자리에 under-shell 지면 그림자로 나타난다.
- **`dead2`** — **페이드-아웃**. 실루엣이 압축됐다; 가장 아래의 배 솔기 + 지면 그림자만 보임. 모스가 로움 색으로 평평해졌다 (모스-그린 셀들이 모두 shell-loam 그림자로 교체됨). Dev 의 30-프레임 페이드가 이 단일 프레임의 알파를 0 으로 램핑.

작은 **먼지 puff VFX** 가 접촉점에 유일한 강조다 (cast §3.4) — 스프라이트 프레임이 아닌 Dev 책임.

## Forward-only — 여기 없는 것

cast brief §3.2 에 따라 Mossplodder 는 `turn`, `hurt`, `idle` 애니메이션이 없다. 이 스프라이트는 cast brief 가 부르는 정확히 두 개의 상태 머신을 출고한다: `walk` (살아있는 동안 연속) + `dead` (3-프레임 collapse + fade). 만약 후일 어느 Area 가 "Mossplodder turns" 또는 "Mossplodder yelps when shoved" 비트를 부활시키고 싶다면, 그것은 별도의 Phase 3+ ask 다.

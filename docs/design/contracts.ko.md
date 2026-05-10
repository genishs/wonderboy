# Design ↔ Dev 데이터 계약

스프라이트/타일/배경 모듈에 대한 권위 있는 데이터 형식. **design-lead** 가 이 파일을 소유하며 **dev-lead** 가 소비한다. 양측 모두 PR 을 통해 변경을 제안할 수 있고, 양측의 승인이 필요하다.

> **English:** [`contracts.md`](./contracts.md) (canonical)

## 스프라이트 모듈

```js
// assets/sprites/<name>.js
// PALETTE 의 인덱스 0 은 투명용으로 예약 (`'#00000000'` 또는 알파 00 인 임의 값).

export const PALETTE = ['#00000000', '#1a1a2e', '#e94560', '#f5f5f5', /* … */];
// PALETTE 항목은 부분 알파를 위해 8 자리 hex `#rrggbbaa` 도 사용 가능; 인덱스 0 은 완전 투명용으로 예약된 채로 유지.

export const FRAMES = {
  idle:   [/* frame */ [/* row */ [0, 0, 1, 1, ...], /* row */ [...], ...], /* frame */ [...] ],
  walk:   [...],
  jump:   [...],
  attack: [...],
  hurt:   [...],
};

export const META = {
  w: 16,            // frame width in pixels
  h: 24,            // frame height in pixels
  anchor: { x: 8, y: 23 }, // logical entity origin within the frame (feet for hero/enemies)
  fps: 8,           // animation playback rate
};
```

제약:
- 모든 애니메이션의 모든 프레임은 반드시 `META.h` 행 × `META.w` 열의 팔레트 인덱스(정수)여야 한다.
- 애니메이션 키는 임의의 문자열이지만, Dev 는 최소한 `idle` 이 존재한다고 가정한다.
- 앵커는 프레임 내 픽셀 좌표(좌상단 원점) 기준이다.

## 타일 모듈

```js
// assets/tiles/area<N>.js
export const PALETTE = [...];
export const TILES = {
  ground:    [/* h × w of indices */],          // static (existing form)
  platform:  [...],
  spike:     [...],
  // …
};
export const META = {
  tile: 16,        // matrix side length in art-pixels (square)
  scale: 3,        // matrix art-pixel → canvas-pixel scale (so 16 × 3 = 48 = src TILE)
  displayPx: 48,   // resulting on-canvas tile size; should match `TILE` in src/
};
```

`tile` 은 셀 매트릭스의 한 변 길이를 아트 픽셀 단위로 표현한 값이다. `displayPx` 는 스케일링 후 캔버스에 그려지는 타일의 크기로, 소스 파일들의 `TILE` 과 일치해야 한다 (v0.25 부터 `TILE = 48` 로 고정). 렌더러는 OffscreenCanvas 를 채울 때 각 아트 픽셀에 `scale` 을 곱한다. `scale` / `displayPx` 가 빠진 구형 타일 모듈은 `scale = 1, displayPx = META.tile` 로 기본 동작한다.

### 애니메이션 타일 (v0.50+)

`TILES[key]` 항목은 다음 두 형태 중 하나일 수 있다:

```js
TILES[key] = matrix                            // static (existing form)
TILES[key] = { frames: [matrix, ...], fps }    // animated (new — v0.50)
```

`matrix` 는 정적 형태와 동일하다: 팔레트 인덱스의 2D 배열 (`META.tile` 행 × `META.tile` 열). 애니메이션 형태는 그러한 매트릭스 리스트를 타일별 `fps` 와 함께 감싼다. 렌더러는 타일별 fps 로 `frames` 를 진행시켜야 하며, dev-lead 의 타일 캐시는 `SpriteCache` 로직을 그대로 따른다 (프레임당 OffscreenCanvas 를 하나씩 할당, 그릴 때 교체).

기존 정적-매트릭스 타일 모듈은 그대로 유효하다. 렌더러는 `Array.isArray(TILES[key]) === false && TILES[key].frames` 로 애니메이션 항목을 감지한다.

## 배경(parallax) 모듈

배경 레이어로는 SVG(텍스트)를 선호한다. `assets/bg/` 아래에 `.svg` 파일로 커밋한다. 렌더러는 `Image()` + `drawImage` 로 로드한다.

```
assets/bg/area1-sky.svg
assets/bg/area1-mountains.svg
assets/bg/area1-trees.svg
```

Parallax 스크롤 계수는 자산이 아닌 코드 측 (`src/graphics/ParallaxBackground.js`) 에 둔다.

## 렌더러 책임

Dev 의 `src/graphics/SpriteCache.js`:
1. 스프라이트/타일 모듈을 임포트한다.
2. 프레임당 `OffscreenCanvas` 를 할당하고, `(PALETTE, frameMatrix)` 로 `ImageData` 를 채운다.
3. 빠른 `drawImage` 를 위해 캔버스 (또는 `ImageBitmap`) 배열을 반환한다.

Design 팀은 캐시를 만지지 않는다 — 데이터 파일만 다룬다.

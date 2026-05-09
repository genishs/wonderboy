# Design ↔ Dev data contract

Authoritative data shape for sprite/tile/bg modules. **design-lead** owns this file; **dev-lead** consumes it. Either can propose a change via PR; both must approve.

## Sprite module

```js
// assets/sprites/<name>.js
// Index 0 in PALETTE is reserved for transparent (use '#00000000' or any value with alpha 00).

export const PALETTE = ['#00000000', '#1a1a2e', '#e94560', '#f5f5f5', /* … */];
// Palette entries may use 8-digit hex `#rrggbbaa` for partial alpha; index 0 remains reserved for fully transparent.

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

Constraints:
- Every frame in every animation MUST be `META.h` rows × `META.w` columns of palette indices (integers).
- Animation keys are arbitrary strings, but Dev assumes at least `idle` exists.
- Anchor is in pixel coordinates within the frame, top-left origin.

## Tile module

```js
// assets/tiles/area<N>.js
export const PALETTE = [...];
export const TILES = {
  ground:    [/* h × w of indices */],
  platform:  [...],
  spike:     [...],
  // …
};
export const META = { tile: 16 };  // square tiles only
```

## Background (parallax) module

SVG (text) preferred for backdrop layers; commit as a `.svg` file under `assets/bg/`. Renderer loads via `Image()` + `drawImage`.

```
assets/bg/area1-sky.svg
assets/bg/area1-mountains.svg
assets/bg/area1-trees.svg
```

Parallax scroll factors live in code (`src/graphics/ParallaxBackground.js`), not in the asset.

## Renderer responsibility

Dev's `src/graphics/SpriteCache.js`:
1. Imports the sprite/tile module.
2. Allocates an `OffscreenCanvas` per frame, fills `ImageData` from `(PALETTE, frameMatrix)`.
3. Returns an array of canvases (or `ImageBitmap`) for fast `drawImage`.

The Design team never touches the cache — only the data file.

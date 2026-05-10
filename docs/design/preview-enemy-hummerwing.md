# Preview — `assets/sprites/enemy-hummerwing.js`

> **한국어 버전:** [`preview-enemy-hummerwing.ko.md`](./preview-enemy-hummerwing.ko.md)

| Field   | Value                              |
|---------|------------------------------------|
| Path    | `assets/sprites/enemy-hummerwing.js` |
| Size    | 18 × 12 px                         |
| Anchor  | `{ x: 8, y: 6 }` (body center — Hummerwing is airborne, anchor on thorax) |
| FPS     | 12 (fast wing-blur cycle)          |
| Palette | 9 entries (incl. 3 alpha-translucent — same Glassmoth alpha policy) |

> Size note: cast brief §11 suggested 36 × 24; user-instructions allowed
> "18 × 12 or similar" and we ship at 18 × 12. At TILE = 48 the Hummerwing
> renders as a small fist-sized flier drifting at chest-high to a running boy
> — exactly the brief's "round thorax with two short, fast-vibrating wings"
> read. Default facing: LEFT (toward Reed).

## Silhouette intent

A round warm thorax with two pairs of fast-blurred wings fanning above and
below. The dust-pink dorsal sheen + dawn-amber underglow are deliberate: the
player should feel "warm spark" against the cool forest parallax (cast brief
§4.1, §4.5). Translucent wings re-use the **Glassmoth alpha-palette policy** —
same three alpha hex values verbatim (`#f4e8f0a0`, `#e0c8d870`, `#fff4f0c0`)
so the two fliers visually rhyme should Glassmoth ever return in a later Area.

NO landing legs visible at this scale; just the buzz-blur, the body, and the
underglow.

## Frames

### `drift` (3 frames, played at 12 fps for buzz)

- **`drift0`** — **wings up-blur**. The upper wing pair is extended high above
  the body (rows 0-3) using the lighter haze colors at the wing tips and the
  deeper haze near the body. The lower wing pair is tucked close to the body
  (row 9). Body horizontal centre row 5-7. Reads: "wings just pushed up."
- **`drift1`** — **wings down-blur**. The inverse: upper wing pair tucked
  close (row 3), lower wing pair extended below the body (rows 8-10). Played
  at 12 fps the alternation reads as fast wing buzz, like a hummingbird or a
  large flying beetle.
- **`drift2`** — **passing-blur**. Wings symmetric (one cell each side), body
  translates 0. This frame breaks the perfect 2-frame loop and gives the buzz
  a subtle organic break so the sine-bob vertical motion (in Dev code, cast
  §4.2) doesn't visually rhyme with the wing cycle. Without this frame the
  body's bob would alias with the wings and produce a strobe — the third frame
  desyncs the two.

The body's vertical sine-bob is computed by Dev (cast §4.7 tunables) and
applied as a screen-space y offset, not as an animation frame. The sprite
itself sits centered in its 12×18 cell.

### `dead` (3 frames, fades over ~30 frames; body falls under gravity post-strike)

Per cast §4.4: "Player should feel 'I made it drop.'"

- **`dead0`** — **wings cease / body tilts**. Both wing pairs collapse to short
  stubs against the body; thorax tilts ~15° forward (the dorsal sheen migrates
  one cell ahead of centre). The amber underglow has gone — first absence of
  warmth.
- **`dead1`** — **mid-fall, body upright**. The thorax has fallen one logical
  row and is now upright (centred on the spawn column); wing stubs trail above
  as the body drops. A single amber-underglow cell briefly returns at the
  bottom — the warmth catching one last time before the ground hit. (This is
  the visual "warm spark falls cool" beat the brief calls for.)
- **`dead2`** — **ground hit, fade**. The body has flattened against the
  ground (last row); dust-puff cells radiate outward from the impact point.
  The thorax has lost its amber (now mostly shadow + ink). Dev's 30-frame
  fade ramps the whole frame's alpha to zero.

## Forward-only — what's NOT here

Per cast brief §4.2 the Hummerwing has NO `swoop`, `hurt`, or altitude-change
animation. The sprite ships exactly the two state machines: `drift` (continuous
while alive) + `dead` (3-frame collapse + ground-hit fade). The flier never
hunts the player — it just commutes through.

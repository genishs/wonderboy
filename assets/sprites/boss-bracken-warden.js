// owning agent: design-lead
// TODO: original 40x48 sprite for the Bracken Warden — Phase 3 (v0.75) Area 1 boss.
//       Multi-state FSM: idle (3), windup (4), attack (3), recover (4), hurt (2), dead (5).
//       Boss brief: docs/briefs/phase3-boss-cast.md.
//
// Final dimensions: 40 × 48 art-pixels (per brief §10 alternative: brief suggests
// 144 × 192 but explicitly permits design-lead to choose a smaller authoring size
// — quote: "Design-lead may choose to ship the Warden as a multi-part sprite ...
// to reduce per-frame data — implementation detail, not story-lead's call."
// User prompt also explicitly offered 32 × 40 or 40 × 48 px; we ship 40 × 48 to
// keep the moss/bracken trim's vertical breathing room without quadrupling data
// over 32 × 40. Dev-lead's SpriteCache draws at whatever canvas scale is needed
// to match the brief's "3 tiles wide × 4 tiles tall when risen" silhouette
// intent (~3× → 120 × 144 canvas px ≈ 2.5 × 3 tiles, close enough to the brief
// spatial intent that the arena reads correctly — boss occupies roughly the
// right wall col 9 to col 11 area).
//
// Anchor: (20, 47) — feet center, bottom-of-frame. The Warden's feet are
// always on the floor line; pose differences (kneeling vs. risen) compose
// the silhouette ABOVE the anchor.
//
// Silhouette intent (per boss brief §2):
//   - At rest (`idle`): kneeling colossus, hunched forward, one knee down,
//     forearms on the bent knee, head bowed. Reads as a moss-covered cairn
//     until it moves. Occupies roughly rows 16-47 of the frame (kneeling
//     height ≈ 32 art-px ≈ 3 tiles at TILE=48).
//   - Risen (any state past idle): head lifts, chest opens, arms unfold.
//     Chest reveals a vertical-slit dawn-amber sigil. Eye-slit kindles
//     dawn-amber in windup/attack only. Risen height occupies roughly rows
//     2-47 (about 4 tiles at TILE=48).
//
// FPS overrides per brief §10 (animFps pattern):
//   idle:    3   — slow breath, asleep
//   windup:  12  — snappy rise; player must read the telegraph
//   attack:  16  — high fps on the slam contact frame
//   recover: 3   — slow settle; emphasize the vulnerable cool-down
//   hurt:    16  — single flash frame, high fps
//   dead:    5   — mid-tempo collapse
//
// Sigil flare visual approach (recorded decision): the chest sigil is a
// vertical 1×4-cell slit in the Warden's torso center. Its color INDEX
// shifts across states to render the flare:
//   idle:    sigil dimmed → uses pillar-shadow-violet (#684e6e) or
//            stone-joinery warm (#a8744a) — barely visible "sleeping core"
//   windup:  flares from dim → mid → peak across 4 frames; sigil cells
//            shift from pillar-shadow-violet → dawn-amber → pale-gold →
//            sigil-core-bright (the new #fff2c0)
//   attack:  sigil at PEAK on frame 0 (sigil-core-bright); on contact
//            frame the sigil dims one notch as the wave separates
//   recover: sigil fades from mid → dim over 4 frames; this is also when
//            the player should aim hatchets, so the sigil stays visibly
//            present (dawn-amber mid) even at its dimmest
//   hurt:    sigil flickers brief faint — uses dawn-amber mid for 1 frame
//   dead:    sigil ruptures on frame 0 (peak), then collapses to dark
//            (pillar-shadow-violet on the final settled frame)
//
// Bracken silhouette: bracken fronds (broad fan-leaf curls) at the hips,
// between fingers, along the spine. Three layered greens: cairn-mantle
// moss (#5a8a4a) for the outer silhouette, moss-green base (#4a7c3a) for
// mid-body bracken, bracken-frond deep (#3e6a3a) for spine + hip fronds.
// Stone joinery shows through at shoulders, elbows, knees: stone-joinery
// warm (#a8744a) + carved-stone-pale (#8a8478) + carved-stone shadow.
//
// Per cross-palette consistency rules (palette-phase3.md): silhouette ink
// is universal violet #3a2e4a; under-bracken shadow is velvet under-flame
// #5a4a6e (carried over from Phase 2 fire-shadow); pillar-undercut uses
// pillar-shadow-violet #684e6e (shared with stage4-ruins).
//
// Frame ASCII legend (per palette index):
//   .  = 0   transparent
//   o  = 1   velvet ink #3a2e4a              — silhouette outline
//   v  = 2   under-bracken violet shadow #5a4a6e — under-bracken / deep folds
//   V  = 3   pillar-shadow-violet #684e6e   — under stone joinery
//   s  = 4   carved-stone-pale #8a8478      — stone joinery main face
//   S  = 5   carved-stone shadow #5a5448    — joinery deep
//   w  = 6   stone-joinery warm #a8744a     — carved warm-grey
//   H  = 7   carved-stone highlight #a89c80 — joinery sun-touched
//   M  = 8   moss-green dark #2e5028        — outer moss / bracken shadow
//   m  = 9   moss-green base #4a7c3a        — bracken mid
//   b  = a   bracken-frond deep #3e6a3a     — spine / hip fronds
//   B  = b   cairn-mantle moss #5a8a4a      — outer moss silhouette
//   a  = c   sigil-amber mid #e8a040        — sigil mid-glow, eye-slit kindled
//   g  = d   sigil-amber peak #f8d878       — sigil peak inner
//   X  = e   sigil core-bright #fff2c0     — sigil core flare (only at peak)
//   c  = f   cuff-cream #e8d4a0             — sigil rim highlight
//   r  = 10  river-stone-grey #7a8088       — deepest joinery rim
//   R  = 11  river-stone highlight #a8b0b8  — rare shoulder-stone catch

export const PALETTE = [
  '#00000000', //  0 transparent
  '#3a2e4a',   //  1 velvet ink
  '#5a4a6e',   //  2 under-bracken violet shadow (shared w/ P2 fire_low)
  '#684e6e',   //  3 pillar-shadow-violet (shared w/ stage4-ruins)
  '#8a8478',   //  4 carved-stone-pale (shared w/ stage4-ruins)
  '#5a5448',   //  5 carved-stone shadow (shared)
  '#a8744a',   //  6 stone-joinery warm (NEW P3)
  '#a89c80',   //  7 carved-stone highlight (shared)
  '#2e5028',   //  8 moss-green dark (shared P1+P2)
  '#4a7c3a',   //  9 moss-green base (shared)
  '#3e6a3a',   // 10 bracken-frond deep (NEW P3)
  '#5a8a4a',   // 11 cairn-mantle moss (NEW P3)
  '#e8a040',   // 12 sigil-amber mid (shared)
  '#f8d878',   // 13 sigil-amber peak (shared)
  '#fff2c0',   // 14 sigil core-bright (NEW P3 — brightest amber in project)
  '#e8d4a0',   // 15 cuff-cream (shared)
  '#7a8088',   // 16 river-stone-grey (shared P2)
  '#a8b0b8',   // 17 river-stone highlight (shared P2)
];

export const META = {
  w: 40,
  h: 48,
  anchor: { x: 20, y: 47 },
  fps: 6,                     // default; per-anim overrides below
  animFps: {
    idle: 3,
    windup: 12,
    attack: 16,
    recover: 3,
    hurt: 16,
    dead: 5,
  },
};

// Frame body matrices are defined in chunks below for readability.
// All 17 frames are 48 rows × 40 columns of palette indices.
// Frames are constructed via helper builders to keep this file scannable;
// each builder writes a 48×40 matrix from scratch and returns it.

// --- HELPERS ----------------------------------------------------------------

// Make a fresh blank 48-row × 40-col matrix filled with 0 (transparent).
function blank() {
  const rows = [];
  for (let y = 0; y < 48; y++) {
    const row = new Array(40).fill(0);
    rows.push(row);
  }
  return rows;
}

// Paint a horizontally-symmetric solid block from (y0..y1, x0..x1) with `v`.
// Inclusive on both edges.
function fill(m, y0, y1, x0, x1, v) {
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      m[y][x] = v;
    }
  }
}

// Set a single cell.
function set(m, y, x, v) { m[y][x] = v; }

// Outline a rectangle (filled with `inside`, edged with `ink`).
function outlinedRect(m, y0, y1, x0, x1, ink, inside) {
  fill(m, y0, y1, x0, x1, inside);
  for (let x = x0; x <= x1; x++) { m[y0][x] = ink; m[y1][x] = ink; }
  for (let y = y0; y <= y1; y++) { m[y][x0] = ink; m[y][x1] = ink; }
}

// Paint the shared kneeling base of the Warden into m. This covers everything
// from the kneeling waistline down (rows 28-47) — these rows are identical
// across idle/windup/attack/recover/hurt and only change in `dead`.
// The base includes: one knee planted forward (left side of frame from
// viewer-pov; the Warden faces LEFT toward Reed so its right knee leads),
// the bent rear leg foot folded under, hip-fronds of bracken, and the
// under-bracken violet wash on the ground line.
function paintKneelingBase(m) {
  // Under-bracken ground shadow band (rows 46-47) — violet wash, never black.
  fill(m, 46, 47, 4, 35, 2);
  // Knee + lower-leg silhouette: leading knee (front-leg) at cols 8-18,
  // folded rear leg at cols 22-32. Ink outline + stone-joinery fill.
  // Leading knee block.
  outlinedRect(m, 36, 45, 8, 19, 1, 4);
  // Stone-joinery shadow on the underside of the knee.
  fill(m, 42, 45, 9, 18, 5);
  // Warm joinery highlight on the knee crown.
  fill(m, 36, 38, 10, 17, 6);
  // Folded rear-leg block (compact, tucked).
  outlinedRect(m, 38, 45, 22, 33, 1, 4);
  fill(m, 42, 45, 23, 32, 5);
  // Hip-frond bracken hanging between the legs (rows 38-44, cols 19-22).
  fill(m, 38, 44, 19, 22, 11);
  set(m, 38, 19, 1); set(m, 38, 22, 1);
  // A scatter of bracken-frond deep on the front of the leading knee.
  set(m, 39, 11, 10); set(m, 40, 12, 10);
  set(m, 41, 14, 10); set(m, 39, 16, 10);
  set(m, 40, 17, 10);
  // Outer-moss curls on the knee crown (the moss has draped over time).
  set(m, 35, 10, 11); set(m, 35, 13, 11);
  set(m, 35, 16, 11); set(m, 35, 17, 11);
  // River-stone-grey rim at the very base of the knee where stone shows.
  set(m, 44, 9, 16); set(m, 44, 18, 16);
  set(m, 44, 23, 16); set(m, 44, 32, 16);
  // Hip-waistline (rows 28-32): the broad belt of moss + bracken that joins
  // the kneeling base to the torso above. Two bands of green over a thin
  // ink rim.
  for (let x = 6; x <= 33; x++) { m[28][x] = 1; }
  fill(m, 29, 30, 7, 32, 11);
  fill(m, 31, 32, 7, 32, 9);
  // Bracken-frond accents along the waistline.
  set(m, 29, 9, 10); set(m, 29, 14, 10);
  set(m, 29, 20, 10); set(m, 29, 26, 10);
  set(m, 29, 31, 10);
  set(m, 32, 11, 10); set(m, 32, 18, 10);
  set(m, 32, 24, 10); set(m, 32, 30, 10);
  // Side ink rims at the waist.
  for (let y = 29; y <= 32; y++) { m[y][6] = 1; m[y][33] = 1; }
}

// Paint the shared resting torso (kneeling, head bowed, forearms on knee).
// Covers rows 14-27 with a forward-hunched torso silhouette.
// Used by idle frames and the first windup frame (windup0 starts here and
// the head lifts during windup1..3).
function paintRestingTorso(m, sigilFn) {
  // Torso block — narrower at the shoulders, wider at the waist. The Warden
  // is hunched forward so the silhouette tapers BACKWARD (toward the right
  // side of the frame, since Warden faces left). We draw a near-symmetric
  // block and let the bowed head + draped moss do the "forward lean."
  // Outer ink outline.
  for (let x = 10; x <= 29; x++) { m[14][x] = 1; }
  for (let x = 8; x <= 31; x++) { m[15][x] = 1; }
  for (let y = 16; y <= 27; y++) { m[y][7] = 1; m[y][32] = 1; }
  // Torso fill: outer moss layer (cairn-mantle moss).
  fill(m, 15, 27, 8, 31, 11);
  // Stone-joinery showing through at the shoulders.
  fill(m, 16, 18, 9, 12, 4);  // left shoulder stone
  fill(m, 16, 18, 27, 30, 4); // right shoulder stone
  fill(m, 17, 18, 10, 11, 5);
  fill(m, 17, 18, 28, 29, 5);
  // Stone-joinery warm at the shoulder caps.
  set(m, 16, 11, 6); set(m, 16, 28, 6);
  // Bracken-frond deep mid-spine markings.
  set(m, 20, 19, 10); set(m, 21, 20, 10);
  set(m, 22, 19, 10); set(m, 23, 20, 10);
  // Moss-base mid-torso patches.
  fill(m, 19, 21, 14, 18, 9);
  fill(m, 19, 21, 22, 26, 9);
  // Moss shadow undercut.
  fill(m, 24, 26, 9, 31, 8);
  // Under-bracken violet between torso and waist.
  for (let x = 9; x <= 30; x++) { m[27][x] = 2; }
  // Chest sigil — a vertical 1-cell-wide slit, 4 cells tall, centered.
  // Color from sigilFn(level) per-frame; level 0..4.
  // We pre-draw the sigil rim (cuff-cream) at the slit edges; the slit
  // interior is filled by the caller through sigilFn.
  for (let y = 19; y <= 24; y++) {
    set(m, y, 18, 15); // left rim
    set(m, y, 21, 15); // right rim
  }
  // Sigil rim top + bottom.
  set(m, 18, 19, 15); set(m, 18, 20, 15);
  set(m, 25, 19, 15); set(m, 25, 20, 15);
  // Interior slit cells (2 cols × 6 rows) — these are what changes per frame.
  sigilFn(m);
  // Bowed head (idle pose) — small, rounded, drooped low so chin tucks
  // against the chest. Head occupies rows 7-15, cols 14-25 approximately.
  // The head is FAR FORWARD of the torso (the Warden hunches over its knee).
  outlinedRect(m, 7, 14, 14, 25, 1, 4);
  // Head deeper-shade undercut.
  fill(m, 11, 13, 15, 24, 5);
  // Faint pillar-shadow under the chin.
  for (let x = 15; x <= 24; x++) { m[14][x] = 3; }
  // Eye-slit (darkened in idle — no kindle).
  for (let x = 17; x <= 22; x++) { m[10][x] = 1; }
  // Outer-moss curls draped over the bowed crown.
  set(m, 7, 16, 11); set(m, 7, 19, 11);
  set(m, 7, 22, 11); set(m, 7, 24, 11);
  set(m, 8, 14, 11); set(m, 8, 25, 11);
  // Forearms resting on the kneeling knee — two long horizontal stripes
  // from the torso to the leading knee crown.
  // Left forearm (from viewer pov — actually the Warden's right arm,
  // crossed forward over its bent right knee).
  outlinedRect(m, 22, 27, 4, 10, 1, 4);
  fill(m, 25, 27, 5, 9, 5);
  // Bracken trailing from the forearm.
  set(m, 22, 5, 11); set(m, 22, 8, 11);
  // Right forearm (folded into the lap, less visible).
  outlinedRect(m, 24, 27, 29, 35, 1, 4);
  fill(m, 26, 27, 30, 34, 5);
  set(m, 24, 32, 11);
}

// Sigil painter — fills the interior of the chest slit with a color level.
// level: 0=dim (pillar-violet), 1=warm (stone-joinery warm), 2=mid (amber),
//        3=peak (pale-gold), 4=core (sigil-core-bright #fff2c0).
function paintSigil(level) {
  const colorMap = { 0: 3, 1: 6, 2: 12, 3: 13, 4: 14 };
  const fillColor = colorMap[level];
  return (m) => {
    for (let y = 19; y <= 24; y++) {
      for (let x = 19; x <= 20; x++) {
        m[y][x] = fillColor;
      }
    }
    // At peak/core levels, add an outer halo of dawn-amber around the slit.
    if (level >= 3) {
      for (let y = 19; y <= 24; y++) {
        // halo on inner side of rim cells already painted; we wrap with
        // amber-mid (12) outside the rim.
        if (m[y][17] !== 1) m[y][17] = 12;
        if (m[y][22] !== 1) m[y][22] = 12;
      }
    }
  };
}

// Eye-slit painter — sets the head's eye-slit cells to a color.
// level: 0=dark (ink), 1=mid (amber), 2=peak (pale-gold), 3=core-bright.
function paintEyeSlit(level) {
  const colorMap = { 0: 1, 1: 12, 2: 13, 3: 14 };
  const fillColor = colorMap[level];
  return (m) => {
    for (let x = 17; x <= 22; x++) {
      m[10][x] = fillColor;
    }
  };
}

// Paint the risen torso (head lifted, chest open). Used by windup1..3,
// attack, recover, and hurt frames. The head rises from the bowed
// position by `headRise` pixels (0 = idle pose; 6 = fully raised).
// `armState`: 0=arms-resting-on-knee, 1=one-arm-rising, 2=arm-overhead,
//             3=arm-mid-swing-down, 4=arm-landed-on-ground, 5=arm-slumped.
function paintRisenTorso(m, sigilFn, eyeFn, headRise, armState) {
  // The risen torso is taller (Warden has straightened from kneel-hunch).
  // Torso block: rows (16 - headRise) to 27, cols 7-32 outer; 8-31 fill.
  const torsoTop = 16 - Math.min(headRise, 4);
  for (let x = 8; x <= 31; x++) { m[torsoTop][x] = 1; }
  for (let y = torsoTop + 1; y <= 27; y++) { m[y][7] = 1; m[y][32] = 1; }
  fill(m, torsoTop + 1, 27, 8, 31, 11);
  // Stone-joinery at shoulders (slightly wider when risen).
  fill(m, torsoTop + 1, torsoTop + 4, 9, 13, 4);
  fill(m, torsoTop + 1, torsoTop + 4, 26, 30, 4);
  fill(m, torsoTop + 3, torsoTop + 4, 10, 12, 5);
  fill(m, torsoTop + 3, torsoTop + 4, 27, 29, 5);
  set(m, torsoTop + 2, 12, 6); set(m, torsoTop + 2, 27, 6);
  // Bracken spine and shoulder fronds.
  set(m, 19, 19, 10); set(m, 20, 20, 10);
  set(m, 21, 19, 10); set(m, 22, 20, 10);
  set(m, 23, 19, 10);
  // Moss-base mid-torso patches (chest sides around the sigil).
  fill(m, 18, 21, 13, 17, 9);
  fill(m, 18, 21, 22, 26, 9);
  // Moss shadow undercut.
  fill(m, 24, 26, 9, 31, 8);
  // Under-bracken violet between torso and waist.
  for (let x = 9; x <= 30; x++) { m[27][x] = 2; }
  // Chest sigil (same slot as idle).
  for (let y = 19; y <= 24; y++) {
    set(m, y, 18, 15);
    set(m, y, 21, 15);
  }
  set(m, 18, 19, 15); set(m, 18, 20, 15);
  set(m, 25, 19, 15); set(m, 25, 20, 15);
  sigilFn(m);
  // RISEN HEAD — pulled UP relative to idle. Head occupies rows
  // (3-headRise) to (11-headRise) approximately. We also keep the head
  // slightly forward of the torso (cols 14-25).
  const headTop = 7 - headRise;
  outlinedRect(m, headTop, headTop + 7, 14, 25, 1, 4);
  fill(m, headTop + 4, headTop + 6, 15, 24, 5);
  // Faint pillar-shadow under the chin.
  for (let x = 15; x <= 24; x++) { m[headTop + 7][x] = 3; }
  // Eye-slit (kindle level per frame).
  for (let x = 17; x <= 22; x++) { m[headTop + 3][x] = 1; }
  eyeFn(m);
  // Outer-moss curls draped over the crown.
  set(m, headTop, 16, 11); set(m, headTop, 19, 11);
  set(m, headTop, 22, 11); set(m, headTop, 24, 11);
  set(m, headTop + 1, 14, 11); set(m, headTop + 1, 25, 11);

  // Arm placement per armState.
  // armState 0: both arms resting on knee (same as idle).
  // armState 1: right arm rising — angled upward from shoulder.
  // armState 2: right arm overhead — vertical column above shoulder.
  // armState 3: right arm mid-swing-down — angled down forward.
  // armState 4: right arm landed on ground (at floor level, extended).
  // armState 5: right arm slumped (lying flat on ground).
  if (armState === 0) {
    outlinedRect(m, 22, 27, 4, 10, 1, 4);
    fill(m, 25, 27, 5, 9, 5);
    outlinedRect(m, 24, 27, 29, 35, 1, 4);
    fill(m, 26, 27, 30, 34, 5);
  } else if (armState === 1) {
    // Right arm angled upward, leaving lap.
    outlinedRect(m, 14, 22, 27, 33, 1, 4);
    fill(m, 17, 21, 28, 32, 5);
    // Left arm still resting.
    outlinedRect(m, 22, 27, 4, 10, 1, 4);
    fill(m, 25, 27, 5, 9, 5);
  } else if (armState === 2) {
    // Right arm overhead — vertical column above the right shoulder.
    outlinedRect(m, 2, 16, 27, 33, 1, 4);
    fill(m, 4, 14, 28, 32, 5);
    fill(m, 4, 6, 29, 31, 6);
    // Bracken tuft at the wrist (top of arm).
    set(m, 2, 28, 11); set(m, 2, 31, 11);
    set(m, 3, 27, 11); set(m, 3, 33, 11);
    // Left arm still resting on knee.
    outlinedRect(m, 22, 27, 4, 10, 1, 4);
    fill(m, 25, 27, 5, 9, 5);
  } else if (armState === 3) {
    // Mid-swing-down — diagonal from shoulder to floor toward leading side.
    // Draw a diagonal band of joinery cells from (rows 18, cols 27-33) down
    // to (rows 36, cols 10-16).
    for (let i = 0; i <= 18; i++) {
      const y = 18 + i;
      const xCenter = 30 - i;
      if (xCenter >= 4 && xCenter <= 35) {
        if (xCenter - 2 >= 0) set(m, y, xCenter - 2, 1);
        if (xCenter - 1 >= 0) set(m, y, xCenter - 1, 4);
        set(m, y, xCenter, 4);
        if (xCenter + 1 <= 39) set(m, y, xCenter + 1, 5);
        if (xCenter + 2 <= 39) set(m, y, xCenter + 2, 1);
      }
    }
    // Left arm still resting.
    outlinedRect(m, 22, 27, 4, 10, 1, 4);
    fill(m, 25, 27, 5, 9, 5);
  } else if (armState === 4) {
    // Arm landed on ground — extended forward at floor level. Knuckles down.
    outlinedRect(m, 33, 38, 0, 14, 1, 4);
    fill(m, 35, 37, 1, 13, 5);
    fill(m, 33, 34, 2, 12, 6);
    // Impact moss-splash particles (small bracken-deep specks).
    set(m, 36, 0, 10); set(m, 38, 1, 10);
    set(m, 33, 14, 10);
    // Left arm still on knee.
    outlinedRect(m, 22, 27, 4, 10, 1, 4);
    fill(m, 25, 27, 5, 9, 5);
  } else if (armState === 5) {
    // Arm slumped on ground (recover).
    outlinedRect(m, 35, 39, 2, 16, 1, 4);
    fill(m, 37, 38, 3, 15, 5);
    // Left arm slack on knee.
    outlinedRect(m, 23, 27, 4, 10, 1, 4);
    fill(m, 25, 27, 5, 9, 5);
  }
}

// Build each named frame and store it. We construct frames here at module
// load (one-time JS pass; the data is then re-used through the cache).
// All builders return a 48 × 40 matrix.

function buildIdle(breath) {
  // breath: 0 = neutral, 1 = breath-up (head 1 row higher, sigil flicker).
  const m = blank();
  paintKneelingBase(m);
  paintRestingTorso(m, paintSigil(breath === 1 ? 1 : 0));
  if (breath === 1) {
    // Subtle breath rise: shift the head up by 1 row.
    // We patch the head rows by re-drawing the top edge slightly raised.
    // (Idle is slow at 3 fps; the subtlety is fine.)
    for (let x = 14; x <= 25; x++) { m[6][x] = 1; }
    for (let x = 15; x <= 24; x++) { m[7][x] = 4; }
  }
  return m;
}

function buildWindup(stage) {
  // stage: 0 = head lifts (eye kindles); 1 = chest opens (sigil mid);
  //        2 = arm rises; 3 = arm at apex (sigil peak).
  const m = blank();
  paintKneelingBase(m);
  const sigilLevel = stage === 0 ? 1 : stage === 1 ? 2 : stage === 2 ? 3 : 4;
  const eyeLevel = stage === 0 ? 1 : stage === 1 ? 1 : stage >= 2 ? 2 : 0;
  const armState = stage === 0 ? 0 : stage === 1 ? 0 : stage === 2 ? 1 : 2;
  const headRise = stage === 0 ? 3 : stage === 1 ? 5 : 6;
  paintRisenTorso(m, paintSigil(sigilLevel), paintEyeSlit(eyeLevel), headRise, armState);
  return m;
}

function buildAttack(stage) {
  // stage: 0 = arm mid-swing (sigil peak still); 1 = arm landing (impact frame —
  //        moss particles bursting + sigil dims one notch to peak-3);
  //        2 = arm flat on ground (shockwave separated; sigil at mid).
  const m = blank();
  paintKneelingBase(m);
  const sigilLevel = stage === 0 ? 4 : stage === 1 ? 3 : 2;
  const eyeLevel = stage === 0 ? 3 : stage === 1 ? 2 : 1;
  const armState = stage === 0 ? 3 : stage === 1 ? 4 : 4;
  const headRise = stage === 0 ? 6 : stage === 1 ? 5 : 4;
  paintRisenTorso(m, paintSigil(sigilLevel), paintEyeSlit(eyeLevel), headRise, armState);
  // Stage 1 (impact): add moss-particle burst near the ground impact point.
  if (stage === 1) {
    set(m, 38, 0, 10); set(m, 39, 1, 10);
    set(m, 40, 0, 11); set(m, 41, 2, 11);
    set(m, 38, 3, 13); set(m, 40, 4, 13);
    set(m, 41, 5, 11);
  }
  return m;
}

function buildRecover(stage) {
  // stage: 0 = arm slumped on ground (sigil mid-bright); 1 = torso eases back
  //        (sigil dimming); 2 = arm lifts off ground (sigil dim); 3 = settled
  //        kneel (sigil minimum bright — almost idle).
  const m = blank();
  paintKneelingBase(m);
  const sigilLevel = stage === 0 ? 2 : stage === 1 ? 2 : stage === 2 ? 1 : 1;
  const eyeLevel = stage === 0 ? 1 : stage === 1 ? 1 : stage === 2 ? 0 : 0;
  const armState = stage === 0 ? 5 : stage === 1 ? 5 : stage === 2 ? 0 : 0;
  const headRise = stage === 0 ? 4 : stage === 1 ? 3 : stage === 2 ? 2 : 1;
  paintRisenTorso(m, paintSigil(sigilLevel), paintEyeSlit(eyeLevel), headRise, armState);
  return m;
}

function buildHurt(stage) {
  // stage: 0 = all-lighter palette flash; 1 = hold prior frame, sigil faded.
  const m = blank();
  paintKneelingBase(m);
  // We use windup3-equivalent pose for the hurt freeze (assumes hurt occurs
  // most often during recover or windup; rendering the silhouette is what
  // matters for the flash — the actual paused frame stays the same).
  const sigilLevel = stage === 0 ? 4 : 1;
  const eyeLevel = stage === 0 ? 3 : 0;
  paintRisenTorso(m, paintSigil(sigilLevel), paintEyeSlit(eyeLevel), 4, 2);
  if (stage === 0) {
    // All-lighter palette flash: walk through every non-transparent cell and
    // bump common colors up one "brightness" tier. We do this by replacing
    // specific dark-tier indices with their lighter siblings.
    // 1 (ink) -> 3 (pillar-violet); 2 (under-bracken) -> 3; 5 (joinery
    // shadow) -> 4 (joinery base); 8 (moss-dark) -> 9 (moss-base); 10
    // (bracken-deep) -> 11 (cairn-mantle); 16 (river-stone-grey) -> 17.
    const lift = { 1: 3, 2: 3, 5: 4, 8: 9, 10: 11, 16: 17 };
    for (let y = 0; y < 48; y++) {
      for (let x = 0; x < 40; x++) {
        const v = m[y][x];
        if (lift[v] !== undefined) m[y][x] = lift[v];
      }
    }
  }
  return m;
}

function buildDead(stage) {
  // stage 0: sigil ruptures (peak flare); body still upright.
  // stage 1: body tilts backward; head turning up.
  // stage 2: collapse begins — torso falls back.
  // stage 3: Warden flat against rear; bracken splayed outward.
  // stage 4: settled — moss layer thickens; the room is reclaiming it.
  const m = blank();
  if (stage === 0) {
    // Rupture: upright pose, sigil at peak + halo, eye-slit at peak.
    paintKneelingBase(m);
    paintRisenTorso(m, paintSigil(4), paintEyeSlit(3), 6, 2);
    // Sigil rupture sparks around the chest.
    set(m, 18, 16, 14); set(m, 18, 23, 14);
    set(m, 17, 17, 13); set(m, 17, 22, 13);
    set(m, 16, 18, 12); set(m, 16, 21, 12);
    return m;
  }
  if (stage === 1) {
    // Tilting backward — head rotates UP, arm starts to fall. We tilt the
    // torso by re-drawing it slightly tilted (offset top by 2 cols right).
    paintKneelingBase(m);
    paintRisenTorso(m, paintSigil(3), paintEyeSlit(2), 6, 2);
    // Tilt: add violet shadow along the bottom-left side as the body shifts.
    for (let y = 18; y <= 27; y++) { set(m, y, 5, 2); }
    return m;
  }
  if (stage === 2) {
    // Collapse begins. Torso falls back — we draw a compressed body that
    // occupies less vertical space and more horizontal space.
    paintKneelingBase(m);
    // Compressed torso (lying back).
    outlinedRect(m, 22, 30, 6, 33, 1, 11);
    fill(m, 25, 28, 8, 31, 9);
    // Sigil dim — at mid amber.
    for (let y = 24; y <= 26; y++) { set(m, y, 19, 12); set(m, y, 20, 12); }
    set(m, 23, 19, 15); set(m, 23, 20, 15);
    set(m, 27, 19, 15); set(m, 27, 20, 15);
    // Head turned upward — small block at the right side of the torso
    // (where the head landed as the body fell back).
    outlinedRect(m, 18, 22, 26, 32, 1, 4);
    fill(m, 20, 21, 27, 31, 5);
    // Eye-slit faint.
    set(m, 20, 28, 12); set(m, 20, 29, 12); set(m, 20, 30, 12);
    return m;
  }
  if (stage === 3) {
    // Flat against the rear wall — bracken splayed outward.
    paintKneelingBase(m);
    // Body is now a low long block.
    outlinedRect(m, 26, 34, 4, 35, 1, 11);
    fill(m, 28, 32, 5, 34, 9);
    // Bracken splayed.
    set(m, 26, 6, 10); set(m, 26, 12, 10);
    set(m, 26, 19, 10); set(m, 26, 25, 10);
    set(m, 26, 32, 10);
    // Sigil reduced to dim core.
    set(m, 30, 19, 3); set(m, 30, 20, 3);
    set(m, 31, 19, 3); set(m, 31, 20, 3);
    // Head off to the side.
    outlinedRect(m, 20, 25, 26, 33, 1, 4);
    fill(m, 22, 24, 27, 32, 5);
    return m;
  }
  // stage 4: settled. Moss has thickened over the silhouette.
  paintKneelingBase(m);
  // Long low body, mostly outer-moss (cairn-mantle).
  outlinedRect(m, 28, 35, 4, 35, 1, 11);
  fill(m, 30, 34, 5, 34, 11);
  // Heavy moss-dark patches.
  fill(m, 31, 33, 7, 14, 8);
  fill(m, 31, 33, 17, 25, 8);
  fill(m, 31, 33, 28, 32, 8);
  // Bracken fronds going dormant.
  set(m, 28, 6, 10); set(m, 28, 14, 10);
  set(m, 28, 21, 10); set(m, 28, 30, 10);
  // Sigil dark — pillar-shadow-violet (sleeping, not glowing).
  set(m, 32, 19, 3); set(m, 32, 20, 3);
  set(m, 33, 19, 3); set(m, 33, 20, 3);
  // No head visible — moss has covered it.
  return m;
}

// Build all FRAMES at module load.
const idle0 = buildIdle(0);
const idle1 = buildIdle(1);
const idle2 = buildIdle(0);
const windup0 = buildWindup(0);
const windup1 = buildWindup(1);
const windup2 = buildWindup(2);
const windup3 = buildWindup(3);
const attack0 = buildAttack(0);
const attack1 = buildAttack(1);
const attack2 = buildAttack(2);
const recover0 = buildRecover(0);
const recover1 = buildRecover(1);
const recover2 = buildRecover(2);
const recover3 = buildRecover(3);
const hurt0 = buildHurt(0);
const hurt1 = buildHurt(1);
const dead0 = buildDead(0);
const dead1 = buildDead(1);
const dead2 = buildDead(2);
const dead3 = buildDead(3);
const dead4 = buildDead(4);

export const FRAMES = {
  idle:    [idle0, idle1, idle2],
  windup:  [windup0, windup1, windup2, windup3],
  attack:  [attack0, attack1, attack2],
  recover: [recover0, recover1, recover2, recover3],
  hurt:    [hurt0, hurt1],
  dead:    [dead0, dead1, dead2, dead3, dead4],
};


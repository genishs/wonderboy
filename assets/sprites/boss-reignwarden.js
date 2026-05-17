// owning agent: design-lead
// TODO: original sprite for the Reignwarden — Phase 4, v1.0 Area 2 boss.
//       Standing humanoid colossus on a 2-tile-tall stone pedestal. Cinder-volley
//       attack pattern. HP 9. Story-lead spec: `phase4-area2-cast.md` §3 (Reignwarden).
//
// Frame design choice — to match the brief's "3 tiles wide × 5 tiles tall
// including pedestal" intent (144×240 canvas) WHILE keeping per-frame matrix
// data manageable, we author at 48×80 art-pixels and rely on dev-lead's
// SpriteCache 3× scale to reach 144×240 canvas px. This is the same compaction
// strategy the Bracken Warden uses (40×48 authored → 120×144 canvas; documented
// in `boss-bracken-warden.js` header). The proportions match the brief: ~3
// tiles wide × 5 tiles tall on the canvas.
//
// Anchor: (24, 79) — base-center, bottom-of-frame; the pedestal's bottom row
// sits flush on the arena floor row.
//
// Silhouette intent (per boss brief §3.2):
//   - Pedestal (rows ~60-79): 2-tile-tall stone base, carved blocks, matches
//     the Stage 2-4 floor tile palette (stone-bone with warm dawn-amber edge).
//   - Warden body (rows ~10-60): standing colossus, 3 tiles wide × 4 tiles tall
//     above the pedestal. Arms folded in idle; arms unfold/rise during windup;
//     arms sweep forward during attack; arms drop during recover.
//   - Chest sigil: a vertical 2×6-cell slit at the torso center. Dim in idle,
//     flares in windup, peaks in attack, fades during recover.
//   - Helm/face: dark slits where eyes/face would be. The Reignwarden has no
//     face — it is a sentinel statue brought to life.
//
// FPS overrides (per brief §6 sprite table):
//   idle:    2   — slow breath/sentinel sway
//   windup:  8   — arms rise + sigil flare
//   attack:  10  — sweep + cinder volley spawn
//   recover: 5   — arms drop; sigil exposed (the vulnerable window)
//   hurt:    -   — 1-frame overlay, displayed via dev-lead's hurt-flash logic
//   dead:    4   — sigil pulse + body kneel-down (60 frames)
//
// Palette: stone-bone family (NEW v1.0) + dawn-amber sigil family (shared
// with Bracken Warden) + ember-rose accent at joint cracks (NEW v1.0). 12
// colors total — at the upper bound per brief §6.

export const PALETTE = [
  '#00000000', //  0 transparent
  '#3a2e4a',   //  1 velvet ink (universal silhouette)
  '#6a6457',   //  2 stone-bone deep (NEW v1.0 — Area 2)
  '#8e8878',   //  3 stone-bone shadow (NEW v1.0)
  '#bdb7a7',   //  4 stone-bone mid (NEW v1.0)
  '#e6e1d8',   //  5 stone-bone highlight (NEW v1.0)
  '#a87838',   //  6 amber-deep / sigil dim (shared with Area 1 boss)
  '#e4b25c',   //  7 dawn-amber mid (sigil mid-glow, shared)
  '#f8d878',   //  8 dawn-amber highlight (sigil peak, shared)
  '#fff2c0',   //  9 sigil core-bright (peak flare, shared)
  '#882c2c',   // 10 ember-rose deep (joint crack shadow, NEW v1.0)
  '#cc6464',   // 11 ember-rose mid (joint crack glow, NEW v1.0)
];

// Helper to make blank 48x80 frames — defined inline so the data file remains
// fully static (no module-level mutation; dev-lead's loader sees only literal
// arrays after evaluation).
function blank() {
  const m = [];
  for (let y = 0; y < 80; y++) {
    m.push(new Array(48).fill(0));
  }
  return m;
}

// Pedestal helper — fills rows 60-79 with the 2-tile-tall stone pedestal
// silhouette (matches the Stage 2-4 floor tile palette). Width ~36 px centered
// in the 48-wide frame (cols 6-41).
function drawPedestal(m) {
  // Top edge — slightly proud, with stone-bone-highlight catch
  for (let x = 6; x <= 41; x++) m[60][x] = 1;
  for (let x = 7; x <= 40; x++) m[61][x] = 5;
  for (let x = 7; x <= 40; x++) m[62][x] = 4;
  // Upper block face — stone-bone-mid with shadow under-folds
  for (let y = 63; y <= 67; y++) {
    m[y][6] = 1; m[y][41] = 1;
    for (let x = 7; x <= 40; x++) m[y][x] = 4;
  }
  // Decorative joint line — single carved seam at row 67
  for (let x = 8; x <= 39; x++) m[67][x] = 3;
  // Lower block face
  for (let y = 68; y <= 75; y++) {
    m[y][5] = 1; m[y][42] = 1;
    for (let x = 6; x <= 41; x++) m[y][x] = 4;
  }
  // A few warm-amber sigil flecks at the upper pedestal corners (foreshadows
  // the Warden's chest sigil)
  m[64][8] = 6; m[64][39] = 6;
  m[65][8] = 6; m[65][39] = 6;
  // Bottom edge — flares slightly wider, with shadow under
  for (let x = 5; x <= 42; x++) m[76][x] = 3;
  for (let x = 5; x <= 42; x++) m[77][x] = 2;
  m[76][4] = 1; m[76][43] = 1;
  m[77][4] = 1; m[77][43] = 1;
  for (let x = 4; x <= 43; x++) m[78][x] = 2;
  for (let x = 4; x <= 43; x++) m[79][x] = 1;
  return m;
}

// Body helper — fills rows 0-59 with the Warden's standing colossus. Body is
// authored col 14-33 (20 cols wide), centered. The pose argument selects
// arm-position variants.
//
// poses:
//   'idle'    — arms folded across chest, head level, sigil dim
//   'windup'  — arms unfold, lift outward; sigil mid
//   'attack'  — arms together overhead, sweep forward; sigil peak
//   'recover' — arms dropped to sides (not folded); sigil mid→dim
//   'hurt'    — same body posture as idle, all-lighter palette swap
//   'dead'    — head bowed forward, arms dropped, body half-collapsed
//
// sigilIdx — palette index for the chest sigil cells (sigil is a 2-wide × 6-tall
// vertical slit centered at col 23-24, rows 28-33).
function drawBody(m, pose, sigilIdx) {
  // ───── HEAD (rows 6-15) ─────
  // Helmet silhouette: rounded top, slits dark, no visible face.
  for (let x = 18; x <= 29; x++) m[6][x] = 1;
  for (let x = 17; x <= 30; x++) m[7][x] = 1;
  for (let x = 16; x <= 31; x++) m[8][x] = 1;
  for (let y = 9; y <= 14; y++) {
    m[y][15] = 1; m[y][32] = 1;
    for (let x = 16; x <= 31; x++) m[y][x] = (y % 2 === 0) ? 4 : 3;
  }
  // Highlight catch on upper-left
  m[8][17] = 5; m[8][18] = 5;
  m[9][16] = 5; m[9][17] = 4;
  m[10][16] = 5;
  // Dark helm slits (the "face")
  m[11][20] = 1; m[11][21] = 1; m[11][26] = 1; m[11][27] = 1;
  m[12][20] = 2; m[12][21] = 2; m[12][26] = 2; m[12][27] = 2;
  // Helm bottom — chinguard
  for (let x = 16; x <= 31; x++) m[15][x] = 1;
  for (let x = 17; x <= 30; x++) m[16][x] = 3;
  // Light up the helm slits in windup/attack — they glow dawn-amber
  if (pose === 'windup' || pose === 'attack') {
    m[11][20] = sigilIdx; m[11][21] = sigilIdx;
    m[11][26] = sigilIdx; m[11][27] = sigilIdx;
    m[12][20] = sigilIdx; m[12][21] = sigilIdx;
    m[12][26] = sigilIdx; m[12][27] = sigilIdx;
  }
  // ───── NECK + SHOULDERS (rows 17-22) ─────
  for (let x = 19; x <= 28; x++) m[17][x] = 1;
  for (let x = 20; x <= 27; x++) m[18][x] = 4;
  for (let x = 19; x <= 28; x++) m[19][x] = 4;
  // Shoulder pads — broad and high
  for (let x = 13; x <= 34; x++) m[20][x] = 1;
  for (let y = 21; y <= 23; y++) {
    m[y][12] = 1; m[y][35] = 1;
    for (let x = 13; x <= 34; x++) m[y][x] = (x < 17 || x > 30) ? 3 : 4;
  }
  // Shoulder highlight catch
  m[21][14] = 5; m[21][15] = 5;
  m[22][13] = 5; m[22][14] = 4;
  // Ember-rose joint cracks at shoulder edges
  m[22][12] = 10; m[22][35] = 10;
  m[23][13] = 11; m[23][34] = 11;
  // ───── TORSO (rows 24-44) ─────
  // Torso outline
  for (let y = 24; y <= 43; y++) {
    m[y][14] = 1; m[y][33] = 1;
  }
  for (let x = 14; x <= 33; x++) m[24][x] = 1;
  // Torso fill
  for (let y = 25; y <= 43; y++) {
    for (let x = 15; x <= 32; x++) {
      // Outer rim shadow
      if (x === 15 || x === 32) m[y][x] = 3;
      // Inner highlight band
      else if (x === 16) m[y][x] = 4;
      else if (x === 17) m[y][x] = 5;
      else if (x === 31) m[y][x] = 3;
      else if (x === 30) m[y][x] = 4;
      // Inner main face
      else m[y][x] = 4;
    }
  }
  // Brighter highlight catch on the upper-left torso
  for (let y = 25; y <= 30; y++) {
    m[y][18] = 5;
  }
  // Chest sigil — vertical 2x6 slit at center, rows 28-33, cols 23-24
  for (let y = 28; y <= 33; y++) {
    m[y][23] = sigilIdx; m[y][24] = sigilIdx;
  }
  // Sigil rim — slight inner glow if sigil is bright
  if (sigilIdx >= 7) {
    m[27][23] = 7; m[27][24] = 7;
    m[34][23] = 7; m[34][24] = 7;
    m[28][22] = 7; m[28][25] = 7;
    m[33][22] = 7; m[33][25] = 7;
  }
  // Belt/abdomen joint at row 41-42
  for (let x = 15; x <= 32; x++) m[41][x] = 2;
  for (let x = 15; x <= 32; x++) m[42][x] = 3;
  // Ember-rose joint crack down the chest center, faint
  m[35][23] = 10; m[35][24] = 10;
  // ───── ARMS (rows 22-50) — pose-dependent ─────
  if (pose === 'idle' || pose === 'recover' || pose === 'hurt' || pose === 'dead') {
    // Arms folded across chest (idle) OR dropped to sides (recover/hurt/dead).
    // Idle: forearms cross the chest, hands meet at the sigil. Recover: arms
    // hang loose at the sides.
    if (pose === 'idle' || pose === 'hurt' || pose === 'dead') {
      // Forearms crossing the chest — diagonal slabs from outer-shoulder to
      // inner-sigil. Left forearm (from 12→23) rows 24-32; right forearm
      // (35→24) rows 24-32.
      for (let i = 0; i < 8; i++) {
        const y = 25 + i;
        const xL = 13 + i;  // left arm: cols 13→20
        const xR = 34 - i;  // right arm: cols 34→27
        m[y][xL] = 1; m[y][xL + 1] = 4; m[y][xL + 2] = 4;
        m[y][xR] = 1; m[y][xR - 1] = 4; m[y][xR - 2] = 4;
      }
      // Hands at center, just above sigil
      m[33][20] = 1; m[33][21] = 4; m[33][22] = 4;
      m[33][25] = 4; m[33][26] = 4; m[33][27] = 1;
      // dead pose — head bows: shift the head silhouette down by adding pixels
      // to rows 16-17 to suggest a slumped neck (gently)
      if (pose === 'dead') {
        for (let x = 17; x <= 30; x++) m[16][x] = 1;
        for (let x = 18; x <= 29; x++) m[17][x] = 3;
      }
    } else {
      // recover — arms hang vertically at the sides, cols 11-13 (left) and
      // 34-36 (right), from rows 24 down to row 50.
      for (let y = 24; y <= 50; y++) {
        m[y][10] = 1; m[y][37] = 1;
        m[y][11] = (y % 2 === 0) ? 4 : 3;
        m[y][12] = 4;
        m[y][13] = 4;
        m[y][34] = 4;
        m[y][35] = 4;
        m[y][36] = (y % 2 === 0) ? 4 : 3;
      }
      // Highlight catch on left bicep
      for (let y = 25; y <= 28; y++) m[y][11] = 5;
      // Hands at rows 49-50, fingers spread slightly
      for (let x = 9; x <= 14; x++) m[50][x] = 1;
      for (let x = 33; x <= 38; x++) m[50][x] = 1;
      m[51] && (m[51][10] = 4, m[51][12] = 4);
      // Ember-rose crack at elbow joint (row 36)
      m[36][11] = 11; m[36][36] = 11;
    }
  } else if (pose === 'windup') {
    // Arms unfold and rise overhead. The forearms go up-and-outward; the
    // hands meet above the helm at rows 0-5, cols 22-25, with a halo of
    // dawn-amber particles around the palms.
    // Left arm (shoulder 13 → elbow 9,17 → wrist 19,2 → palm 22,1)
    // Right arm mirror.
    // Authoring choice: trace the forearm as a 3-px-thick diagonal.
    const lineL = [
      [22, 1], [22, 2], [21, 3], [20, 4], [19, 5], [18, 6], [17, 7], [16, 8],
      [15, 9], [14, 11], [13, 13], [13, 15], [13, 17], [13, 19], [13, 21],
    ];
    const lineR = lineL.map(([x, y]) => [47 - x, y]);
    for (const [x, y] of lineL) {
      m[y][x - 1] = 1; m[y][x] = 4; m[y][x + 1] = 4;
    }
    for (const [x, y] of lineR) {
      m[y][x - 1] = 4; m[y][x] = 4; m[y][x + 1] = 1;
    }
    // Palms above helm
    for (let x = 21; x <= 26; x++) m[0][x] = 1;
    for (let x = 20; x <= 27; x++) m[1][x] = 1;
    for (let y = 2; y <= 4; y++) {
      m[y][20] = 1; m[y][27] = 1;
      for (let x = 21; x <= 26; x++) m[y][x] = 5;
    }
    for (let x = 20; x <= 27; x++) m[5][x] = 1;
    // Dawn-amber halo between the palms
    m[1][23] = sigilIdx; m[1][24] = sigilIdx;
    m[2][22] = sigilIdx; m[2][23] = 9; m[2][24] = 9; m[2][25] = sigilIdx;
    m[3][22] = 9; m[3][23] = 9; m[3][24] = 9; m[3][25] = 9;
    m[4][23] = sigilIdx; m[4][24] = sigilIdx;
  } else if (pose === 'attack') {
    // Arms sweep forward and out — the volley is spawning. The hands are at
    // roughly head-level (rows 8-15), extended outward at cols 5-7 (left) and
    // 40-42 (right). A burst of dawn-amber particles between the hands.
    // Diagonal forearms from shoulder to forward-extended hand.
    const lineL = [
      [13, 22], [12, 20], [11, 18], [10, 16], [9, 14], [8, 12], [7, 11], [6, 10], [5, 10], [4, 11], [4, 12], [4, 13],
    ];
    const lineR = lineL.map(([x, y]) => [47 - x, y]);
    for (const [x, y] of lineL) {
      m[y][x] = 4;
      if (m[y][x - 1] === 0) m[y][x - 1] = 1;
      if (m[y][x + 1] === 0) m[y][x + 1] = 4;
    }
    for (const [x, y] of lineR) {
      m[y][x] = 4;
      if (m[y][x - 1] === 0) m[y][x - 1] = 4;
      if (m[y][x + 1] === 0) m[y][x + 1] = 1;
    }
    // Hands forward — cinder volley spawning
    for (let y = 10; y <= 14; y++) {
      m[y][4] = 1; m[y][5] = 5; m[y][6] = 5;
      m[y][41] = 5; m[y][42] = 5; m[y][43] = 1;
    }
    // Spawning cinder cluster between hands
    for (let y = 11; y <= 14; y++) {
      for (let x = 22; x <= 25; x++) m[y][x] = sigilIdx;
    }
    m[12][21] = sigilIdx; m[12][26] = sigilIdx;
    m[13][21] = 9; m[13][26] = 9;
    m[10][23] = sigilIdx; m[10][24] = sigilIdx;
    m[15][23] = sigilIdx; m[15][24] = sigilIdx;
  }
  // ───── LEGS (rows 44-59) ─────
  // Two thick stone columns from waist to top of pedestal, with a small
  // central gap at the inseam (col 23-24).
  for (let y = 44; y <= 59; y++) {
    m[y][15] = 1; m[y][32] = 1;
    for (let x = 16; x <= 22; x++) m[y][x] = (x === 16 || x === 22) ? 3 : 4;
    for (let x = 25; x <= 31; x++) m[y][x] = (x === 25 || x === 31) ? 3 : 4;
  }
  // Inseam shadow
  for (let y = 44; y <= 59; y++) m[y][23] = 2;
  for (let y = 44; y <= 59; y++) m[y][24] = 2;
  // Knee highlights
  m[48][17] = 5; m[48][18] = 5; m[48][29] = 5; m[48][30] = 5;
  // Ember-rose knee crack
  m[50][16] = 10; m[50][31] = 10;
  m[51][16] = 11; m[51][31] = 11;
  // Feet base — flat, sitting on the pedestal top
  for (let x = 15; x <= 22; x++) m[58][x] = 3;
  for (let x = 25; x <= 32; x++) m[58][x] = 3;
  return m;
}

// idle frame 0 — sentinel, arms folded, sigil dim (amber-deep #a87838 = idx 6).
const idle0 = drawPedestal(drawBody(blank(), 'idle', 6));

// idle frame 1 — minute breath: same body, sigil pulses to mid (idx 7).
const idle1 = drawPedestal(drawBody(blank(), 'idle', 7));

// windup frame 0 — arms begin to unfold; sigil flares dawn-amber-mid.
const windup0 = drawPedestal(drawBody(blank(), 'windup', 7));

// windup frame 1 — arms fully up; sigil at dawn-amber highlight.
const windup1 = drawPedestal(drawBody(blank(), 'windup', 8));

// windup frame 2 — palms together overhead; sigil at peak.
const windup2 = drawPedestal(drawBody(blank(), 'windup', 9));

// windup frame 3 — held at peak; sigil core-bright.
const windup3 = drawPedestal(drawBody(blank(), 'windup', 9));

// attack frame 0 — sweep starts; sigil at peak.
const attack0 = drawPedestal(drawBody(blank(), 'attack', 9));

// attack frame 1 — sweep contact-frame, volley spawning.
const attack1 = drawPedestal(drawBody(blank(), 'attack', 9));

// attack frame 2 — sweep follow-through; sigil dims one notch.
const attack2 = drawPedestal(drawBody(blank(), 'attack', 8));

// recover frame 0 — arms drop; sigil at dawn-amber mid (vulnerable).
const recover0 = drawPedestal(drawBody(blank(), 'recover', 7));

// recover frame 1 — arms hang loose; sigil at amber-deep.
const recover1 = drawPedestal(drawBody(blank(), 'recover', 6));

// recover frame 2 — arms steady; sigil dim.
const recover2 = drawPedestal(drawBody(blank(), 'recover', 6));

// hurt frame 0 — single-frame flash overlay. Same body as idle but the stone-
// bone palette is brighter (drawn explicitly via the swap rules below).
function drawHurtBody(m, sigilIdx) {
  drawBody(m, 'hurt', sigilIdx);
  // Swap stone-bone mid (4) → highlight (5), shadow (3) → mid (4) for the
  // flash. Iterate the body region rows 0-59 cols 4-43.
  for (let y = 0; y <= 59; y++) {
    for (let x = 4; x <= 43; x++) {
      const v = m[y][x];
      if (v === 4) m[y][x] = 5;
      else if (v === 3) m[y][x] = 4;
      else if (v === 2) m[y][x] = 3;
    }
  }
  return m;
}
const hurt0 = drawPedestal(drawHurtBody(blank(), 7));

// dead frame 0 — head bows, sigil at peak (last pulse).
const dead0 = drawPedestal(drawBody(blank(), 'dead', 9));

// dead frame 1 — head bowed, sigil dims to mid.
const dead1 = drawPedestal(drawBody(blank(), 'dead', 7));

// dead frame 2 — sigil at amber-deep.
const dead2 = drawPedestal(drawBody(blank(), 'dead', 6));

// dead frame 3 — final pose: body kneeling on pedestal (we approximate this
// by shifting the head/shoulders down by 4 rows and adjusting the legs to a
// kneeling pose). Sigil dark (palette 2).
function drawKneelBody(m) {
  // Reuse the 'dead' body, then overdraw the head/shoulders 4 rows lower and
  // collapse the legs.
  drawBody(m, 'dead', 2);
  // Hide upper-body original rows 6-22
  for (let y = 6; y <= 22; y++) {
    for (let x = 0; x <= 47; x++) m[y][x] = 0;
  }
  // Lower the head into rows 18-27
  for (let x = 18; x <= 29; x++) m[18][x] = 1;
  for (let x = 17; x <= 30; x++) m[19][x] = 1;
  for (let x = 16; x <= 31; x++) m[20][x] = 1;
  for (let y = 21; y <= 25; y++) {
    m[y][15] = 1; m[y][32] = 1;
    for (let x = 16; x <= 31; x++) m[y][x] = (y % 2 === 0) ? 3 : 2;
  }
  // Shoulders at rows 26-29, slumped
  for (let x = 13; x <= 34; x++) m[26][x] = 1;
  for (let y = 27; y <= 29; y++) {
    m[y][12] = 1; m[y][35] = 1;
    for (let x = 13; x <= 34; x++) m[y][x] = 3;
  }
  // Collapse legs into a kneel — shorten the leg columns to rows 44-58, but
  // overlay a curled silhouette in rows 30-44.
  for (let y = 30; y <= 44; y++) {
    for (let x = 0; x <= 47; x++) m[y][x] = 0;
  }
  // Torso at kneel, narrow
  for (let y = 30; y <= 43; y++) {
    m[y][16] = 1; m[y][31] = 1;
    for (let x = 17; x <= 30; x++) m[y][x] = 3;
  }
  // Dark dim sigil at chest center
  m[35][23] = 2; m[35][24] = 2;
  m[36][23] = 2; m[36][24] = 2;
  return m;
}
const dead3 = drawPedestal(drawKneelBody(blank()));

export const FRAMES = {
  idle:    [idle0, idle1],
  windup:  [windup0, windup1, windup2, windup3],
  attack:  [attack0, attack1, attack2],
  recover: [recover0, recover1, recover2],
  hurt:    [hurt0],
  dead:    [dead0, dead1, dead2, dead3],
};

export const META = {
  w: 48,
  h: 80,
  anchor: { x: 24, y: 79 }, // base-center, bottom-of-frame; pedestal bottom row
                            //  sits flush on the arena floor row.
  fps: 2,                   // default playback (idle); dev-lead applies per-state
                            //  fps overrides per the brief §6 sprite-table spec
                            //  (windup 8, attack 10, recover 5, dead 4).
};

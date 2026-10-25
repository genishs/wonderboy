// owning agent: dev-lead
// TODO: Phase 3 (v0.75) tunables — every multi-stage + boss-fight number pinned here.
//
// All velocities in px/frame, gravities in px/frame^2, timers in frames.
// Game loop runs a fixed 60 fps timestep, so 1 frame = ~16.67 ms.
// Source of pinned values: docs/_drafts/phase3-dev-plan.md §5 (release-master locked).

export const BRACKEN_WARDEN = Object.freeze({
    // HP
    hpMax:              6,
    // FSM timers (frames)
    idleFrames:         60,    // post-recover idle hold before next windup
    windupFrames:       45,    // ~0.75 s telegraph
    attackFrames:       18,    // total attack state
    attackSpawnFrame:   12,    // moss-pulse spawns on this frame within attack
    recoverFrames:      90,    // ~1.5 s vulnerable window
    hurtFrames:         10,    // hit-flash hold; pauses other timers
    deathFrames:        60,    // death animation
    celebrationFrames:  60,    // post-death pause before fade-to-black
    // Spatial (display px — sprite is 40×48 art × scale 3 = 120×144 display)
    bodyWidthPx:       120,
    bodyHeightPx:      144,
    // Hitbox (chest sigil) — display px relative to sprite top-left
    hitboxOffsetX:      40,    // ~1 tile in
    hitboxOffsetY:      54,    // ~1.1 tiles down (center of vertical sigil slit)
    hitboxWidth:        40,
    hitboxHeight:       40,
});

export const MOSS_PULSE = Object.freeze({
    vx:               -3.5,    // travels LEFT (toward Reed); same speed as Reed's walk
    lifetimeFrames:    240,    // ~4 s hard cap
    widthPx:            48,    // 1 tile wide (sprite is 24×16 art × scale 2 = 48×32 display)
    heightPx:           32,    // half-tile tall — Reed jumps over it
    spawnOffsetX:        4,    // spawn just inside Warden's feet (left side)
    spawnOffsetY:      -32,    // floor anchor minus pulse height (sit ON floor)
});

export const BOSS_ARENA = Object.freeze({
    widthTiles:         12,
    heightTiles:        11,
    // All cols are in stage-4 GLOBAL columns (after concat). round-4-4 is the last
    // round; its first column is `stage4Builder.roundBoundaries[3]`. The boss
    // trigger lives at round-4-4 col 32 (relative); cameraLockCol is the same col.
    // Arena interior cols = trigger col .. trigger col + 11. Right wall is solid
    // at trigger col + 11. Boss spawns at trigger col + 9, row 7. Hero spawns at
    // (re-entry after death) at mile-marker col `mile_16` per area brief §7.4.
    triggerRelCol:      32,    // col within round-4-4 where camera locks + boss wakes
    rightWallRelCol:    43,    // arena's right wall col (= triggerRelCol + 11)
    bossSpawnRelCol:    41,    // arena col 9 = trigger + 9 = 41
    bossSpawnRow:        7,    // kneeling base at row 10 (boss is 4 tiles tall risen)
    heroSpawnRelCol:    33,    // arena col 1 = trigger + 1 (initial entry only;
                               // not used for respawn — respawn goes back to mile_16)
});

export const STAGE_TRANSITION = Object.freeze({
    inputSuspendLead:   30,    // input frozen for this many frames BEFORE fadeOut starts
    fadeOutFrames:      45,    // alpha 0→1
    holdFrames:         75,    // bilingual stage-name overlay hold
    fadeInFrames:       45,    // alpha 1→0
    // Total active overlay = 30 (input suspend) + 45 + 75 + 45 = 195 frames
    // Per area brief §3: ~210 frames total; the brief includes a swap frame
    // (handled implicitly at the start of `hold`).
});

export const AREA_CLEARED = Object.freeze({
    fadeOutFrames:      60,
    holdFrames:        300,    // ~5 s overlay hold; any input dismisses to TITLE
    // Text (bilingual). Stays verbatim per CLAUDE.md.
    textEn:          'Area 1 cleared — the path continues.',
    textKo:          'Area 1 클리어 — 길은 이어진다.',
});

// v0.75.1 — Threadshade (vertical-only spider). Per story brief §16:
// fixed x-column; sine vertical motion; 1-hit-kill on hero contact AND on
// hatchet contact; ~3-tile vertical amplitude.
export const THREADSHADE = Object.freeze({
    amplitude:   1.5,          // tiles (peak above/below baseY → 3-tile total span)
    frequency:   0.04,         // rad/frame (slower than Hummerwing's 0.06 — patient breath)
    hitboxW:     22,           // narrower than sprite (18*2 = 36 display); fair hits
    hitboxH:     28,
    deathFrames: 36,           // total death anim beat before despawn
    fps:          6,           // matches sprite META.fps
});

// v0.75.1 — dawn-husk burst phase + shell-fragment particles. Per story brief
// §15 / item Changelog: extend the existing rest → break flow with a `burst`
// state that plays the new 3-frame burst animation and spawns 2-4 shell
// fragments before the hatchet pickup drops.
export const EGG_BURST = Object.freeze({
    burstFrames:    18,        // total bursting state hold (3 frames @ 8 fps = 22.5; we hold 18 for snap)
    shellCount:      3,        // 2-4 acceptable; 3 reads as a "burst" without crowding
    shellLifetime:  90,        // off-screen / gravity-fall cap
    shellGravity:    0.45,
    vxRangeAbs:      4.0,      // ±4 px/frame horizontal kick
    vyMin:          -5,
    vyMax:          -3,
});

export const AREA1_STAGES = Object.freeze({
    count: 4,
    stageNames: Object.freeze({
        1: Object.freeze({ en: 'Stage 1 — Mossline Path',     ko: '스테이지 1 — Mossline Path' }),
        2: Object.freeze({ en: 'Stage 2 — Sumphollow',        ko: '스테이지 2 — Sumphollow' }),
        3: Object.freeze({ en: 'Stage 3 — Brinklane',         ko: '스테이지 3 — Brinklane' }),
        4: Object.freeze({ en: 'Stage 4 — The Old Threshold', ko: '스테이지 4 — The Old Threshold' }),
    }),
});

// v1.0 — Area 2 stage names (bilingual). Used by Renderer for the inter-stage
// overlay during Area 2 transitions.
export const AREA2_STAGES = Object.freeze({
    count: 4,
    stageNames: Object.freeze({
        1: Object.freeze({ en: 'Stage 2-1 — The Switchback',  ko: '스테이지 2-1 — 산허리길' }),
        2: Object.freeze({ en: 'Stage 2-2 — The Beacon Walk', ko: '스테이지 2-2 — 봉수대 옛길' }),
        3: Object.freeze({ en: 'Stage 2-3 — The Knifing',     ko: '스테이지 2-3 — 협곡' }),
        4: Object.freeze({ en: 'Stage 2-4 — The Reignward',   ko: '스테이지 2-4 — 봉수대 마루' }),
    }),
});

// v1.0 — Cinderwisp tunables. Per docs/briefs/phase4-area2-cast.md §2.1 / §9.
export const CINDERWISP = Object.freeze({
    driftXPerFrame:    1.4,
    driftXKnifing:     1.75,
    bobAmpPx:          8,
    bobAmpKnifing:    10,
    bobPeriodFrames:  60,
    hitboxW:          18,
    hitboxH:          16,
    deathFrames:      18,
});

// v1.0 — Quarrywight tunables. Per cast brief §2.2 / §9.
export const QUARRYWIGHT = Object.freeze({
    walkXPerFrame:     1.2,
    armorHits:         1,    // first hatchet hit strips armor
    totalHp:           2,    // 2 hatchet hits to kill
    hitboxW:          28,
    hitboxH:          44,
    hurtFrames:        8,
    deathFrames:      30,
});

// v1.0 — Skyhook tunables. Per cast brief §2.3 / §9.
export const SKYHOOK = Object.freeze({
    triggerDistanceTiles:  6,
    windupFrames:         20,
    fallYPerFrame:         4,
    landedFrames:         15,
    walkXPerFrame:         1.6,
    hitboxW:              24,
    hitboxH:              28,
    deathFrames:          24,
});

// v1.0 — Reignwarden (Area 2 boss). Per cast brief §3 / §9. Mirrors the
// Bracken Warden shape so BossSystem can dispatch on `boss.area`.
export const REIGNWARDEN = Object.freeze({
    hpMax:              9,
    idleFrames:        60,
    windupFrames:      45,
    attackFrames:      18,
    attackSpawnFrame:  12,
    recoverFrames:     90,
    hurtFrames:        10,
    deathFrames:       60,
    celebrationFrames: 60,
    bodyWidthPx:      144,    // 3 tiles wide × 48 (display tile size)
    bodyHeightPx:     240,    // 5 tiles tall (incl. 2-tile pedestal)
    hitboxOffsetX:     40,
    hitboxOffsetY:     90,
    hitboxWidth:       64,
    hitboxHeight:      60,
});

// v1.0 — Cinder volley projectile (Reignwarden attack). 3 cinders fan out at
// distinct angles + speeds; on floor-contact, spawn an ember-pit hazard tile.
export const CINDER_VOLLEY = Object.freeze({
    // [vx, vy] for each of the 3 cinders. Cinder 1 leftward-down, Cinder 2
    // straight-down, Cinder 3 leftward-flatter. Speeds + angles per brief §3.4.
    cinder1Vx:         -4.0,   // ~205° angle, |v|=4.5 (cos*4.5 ≈ -4.08)
    cinder1Vy:         -1.9,   // upward initial kick (gravity will arc it down)
    cinder2Vx:         -0.5,   // straight-down at ~270°, |v|=4.0
    cinder2Vy:         -3.0,
    cinder3Vx:         -4.6,   // ~190°, |v|=5.0 (mostly horizontal-left)
    cinder3Vy:         -1.0,
    gravity:            0.18,
    widthPx:           20,
    heightPx:          20,
    spawnOffsetX:     -10,     // palm position relative to boss tf
    spawnOffsetY:      40,
    lifetimeFrames:   180,
});

// v1.0 — Ember-pit hazard tile (transient). Per cast brief §3.4.
export const EMBER_PIT = Object.freeze({
    ttlFrames:        120,    // ~2 sec @ 60 fps
});

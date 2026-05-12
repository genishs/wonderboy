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

export const AREA1_STAGES = Object.freeze({
    count: 4,
    stageNames: Object.freeze({
        1: Object.freeze({ en: 'Stage 1 — Mossline Path',     ko: '스테이지 1 — Mossline Path' }),
        2: Object.freeze({ en: 'Stage 2 — Sumphollow',        ko: '스테이지 2 — Sumphollow' }),
        3: Object.freeze({ en: 'Stage 3 — Brinklane',         ko: '스테이지 3 — Brinklane' }),
        4: Object.freeze({ en: 'Stage 4 — The Old Threshold', ko: '스테이지 4 — The Old Threshold' }),
    }),
});

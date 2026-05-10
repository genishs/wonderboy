// owning agent: dev-lead
// TODO: Phase 2 (v0.50) tunables — every Area-1 number lives here for one-knob playtest tuning.
//
// All velocities in px/frame, gravities in px/frame^2, timers in frames.
// Game loop runs a fixed 60 fps timestep, so 1 frame = ~16.67 ms.
// Source of pinned values: docs/_drafts/phase2-dev-plan.md §5 (release-master locked).

export const HERO_P2 = Object.freeze({
    walkSpeed:         3.5,    // matches Phase 1 HERO.walkSpeed
    jumpVy0:          -11.0,
    gravity:            0.55,
    jumpCutFactor:      0.45,
    coyoteFrames:       6,
    bufferFrames:       6,
    attackCooldown:    12,     // overrides Phase 1 HERO.attackCooldown
    attackOverlay:      8,
    armedAtRoundStart: false,  // hard-locked per release-master Q6 (now stage-start per v0.50.1)
    // v0.50.1 — X-modifier sprint
    sprintMultiplier:     1.4, // X-held walk speed multiplier (Phase 2 only)
    sprintJumpMultiplier: 1.15,// jumpVy0 multiplier when X is held at the moment of jump
});

export const HATCHET = Object.freeze({
    vx0:             6.0,
    vy0:            -3.5,
    gravity:         0.40,     // lighter than hero — clean parabolic arc
    maxOnScreen:     2,
    lifetimeMax:    100,       // ~1.7s at 60fps
    attackCooldown: 12,
    spinFps:        16,        // matches sprite META.fps
});

export const MOSSPLODDER = Object.freeze({
    walkSpeed:    0.7,
    gravity:      0.55,
    deathFrames: 30,
    fps:          6,
    hitboxW:     40,           // sprite is 24x16 art → 72 display, clamped for fair hits
    hitboxH:     32,
});

export const HUMMERWING = Object.freeze({
    driftVx:               1.4,
    driftAltitudeOffset: -96,  // 2 tiles ABOVE the local floorY at spawn col
    bobAmplitude:          8,
    bobFrequency:          0.05,
    gravity:               0.55, // applied only after death
    deathFrames:          30,
    fps:                  12,
    hitboxW:              42,
    hitboxH:              28,
});

export const EGG = Object.freeze({
    breakFrames: 12,
    shimmerFps:   2,
    hitboxW:     30,
    hitboxH:     30,
});

export const FIRE = Object.freeze({
    flickerFps: 8,             // matches tile module fps
    hitboxW:   40,             // narrower than 48 tile so jumping AT a fire tile is survivable
    hitboxH:   28,             // hitbox occupies bottom of tile
});

export const ROUND_TRANSITION = Object.freeze({
    totalFrames:    60,
    fadeOutFrames:  20,
    holdFrames:     20,
    fadeInFrames:   20,
    vitalityRefill: 20,        // restored on mile-marker hit
    swapAtFrame:    20,        // (totalFrames - fadeInFrames) — swap entities here
});

export const CAIRN_OVERLAY = Object.freeze({
    holdSeconds: 5,            // visual hold only — overlay holds indefinitely in v0.50
});

export const AREA1 = Object.freeze({
    parallaxFactors: Object.freeze({ sky: 0.0, mountains: 0.3, trees: 0.7 }),
    bgSky:       'assets/bg/area1-sky.svg',
    bgMountains: 'assets/bg/area1-mountains.svg',
    bgTrees:     'assets/bg/area1-trees.svg',
    tileModulePath: './assets/tiles/area1.js',
});

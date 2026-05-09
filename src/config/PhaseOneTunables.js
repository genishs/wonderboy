// owning agent: dev-lead
// TODO: Phase 1 tunables — every number lives here for one-knob playtest tuning.
//
// All velocities in px/frame, all gravities in px/frame^2, all timers in frames.
// The game loop runs a fixed 60 fps timestep, so 1 frame = ~16.67 ms.
// Source of suggested values: docs/briefs/phase1-cast.md §4.

export const HERO = Object.freeze({
    maxHp:           3,
    walkSpeed:       3.5,
    jumpVy0:        -11.0,
    gravity:         0.55,
    jumpCutFactor:   0.45,
    coyoteFrames:    6,
    bufferFrames:    6,
    attackCooldown:  10,
    attackOverlay:   8,
    maxProjectiles:  2,
    iframesHurt:     36,
    hurtLockFrames:  12,
    knockbackVx:     3.0,
    knockbackVy:    -2.0,
    blinkFrames:     4,
});

export const STONEFLAKE = Object.freeze({
    vx0:          6.0,
    vy0:         -2.5,
    gravity:      0.40,
    bounceFactor: 0.60,
    maxBounces:   1,
    lifetimeMax:  120,
    damage:       1,
    fps:          12,
});

export const CRAWLSPINE = Object.freeze({
    hp:          1,
    contactDmg:  1,
    walkSpeed:   1.0,
    turnFrames:  6,
    hurtFrames:  6,
    deathFrames: 30,
    fps:         6,
});

export const GLASSMOTH = Object.freeze({
    hp:              1,
    contactDmg:      1,
    driftVx:         1.5,
    driftAmplitude:  16,
    driftFrequency:  0.06,
    swoopVy:         4.0,
    swoopFrames:     24,
    recoverFrames:   30,
    sightRangeX:     240,
    driftAltitude:   144,
    hurtFrames:      4,
    deathFrames:     45,
    fps:             6,
});

export const SAPLING = Object.freeze({
    hp:             2,
    contactDmg:     1,
    closedFrames:   120,
    windupFrames:   12,
    firingFrames:   4,
    cooldownFrames: 90,
    hurtFrames:     6,
    deathFrames:    45,
    fps:            6,
});

export const SEEDDART = Object.freeze({
    speed:       4.0,
    gravity:     0.27,
    lifetimePx:  288,
    damage:      1,
    fanAngles:   [-15, 0, 15],
});

// owning agent: dev-lead
// TODO: Phase 1 tunables — every number lives here for one-knob playtest tuning.
//
// All velocities in px/frame, all gravities in px/frame^2, all timers in frames.
// The game loop runs a fixed 60 fps timestep, so 1 frame = ~16.67 ms.
// Source of suggested values: docs/briefs/phase1-cast.md §4 (with v0.25.x overrides).
//
// v0.25.2: HP / iframes / hurt-lock / knockback removed. Vitality is the single
// life-line; any enemy contact or enemy projectile hit = immediate game over.

export const HERO = Object.freeze({
    walkSpeed:       3.5,
    jumpVy0:        -11.0,
    gravity:         0.55,
    jumpCutFactor:   0.45,
    coyoteFrames:    6,
    bufferFrames:    6,
    attackCooldown:  10,
    attackOverlay:   8,
    maxProjectiles:  2,
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
    walkSpeed:   0.8,    // v0.25.1 patch: was 1.0 — slower so the player has reaction window
    turnFrames:  12,     // v0.25.1 patch: was 6  — visible turn beat
    hurtFrames:  6,
    deathFrames: 30,
    fps:         6,
});

export const GLASSMOTH = Object.freeze({
    hp:              1,
    contactDmg:      1,
    driftVx:         1.0,    // v0.25.1 patch: was 1.5
    driftAmplitude:  24,     // v0.25.1 patch: was 16
    driftFrequency:  0.04,   // v0.25.1 patch: was 0.06 — gentler bob
    swoopVy:         3.2,    // v0.25.1 patch: was 4.0
    swoopFrames:     30,     // v0.25.1 patch: was 24 — longer commit
    recoverFrames:   50,     // v0.25.1 patch: was 30
    sightRangeX:     200,    // v0.25.1 patch: was 240 — must be closer to swoop
    driftAltitude:   144,
    hurtFrames:      4,
    deathFrames:     45,
    fps:             6,
});

export const SAPLING = Object.freeze({
    hp:             2,
    contactDmg:     1,
    closedFrames:   150,    // v0.25.1 patch: was 120 — more breathing window
    windupFrames:   24,     // v0.25.1 patch: was 12 — clearer telegraph
    firingFrames:   6,      // v0.25.1 patch: was 4
    cooldownFrames: 120,    // v0.25.1 patch: was 90
    hurtFrames:     6,
    deathFrames:    45,
    fps:            6,
});

export const SEEDDART = Object.freeze({
    speed:       3.4,    // v0.25.1 patch: was 4.0
    gravity:     0.27,
    lifetimePx:  288,
    damage:      1,
    fanAngles:   [-15, 0, 15],
});

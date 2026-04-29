/**
 * Physics constants shared across PhysicsEngine and CollisionSystem.
 * Agent 2 (Physics Engineer): tune these values to match original Wonder Boy feel.
 *
 * Reference playthrough analysis (60fps):
 *  - Player reaches max speed in ~7 frames
 *  - Full stop from max speed in ~5 frames (ground friction)
 *  - Jump arc peak reached in ~14 frames at min hold
 *  - Jump arc peak reached in ~20 frames at max hold
 */
export const C = Object.freeze({
    GRAVITY:          0.40,   // px / frame²
    MAX_FALL_SPEED:   10.0,
    WALK_ACCEL:        0.50,
    MAX_WALK_SPEED:    3.50,
    FRICTION_GROUND:   0.80,
    FRICTION_AIR:      0.95,
    FRICTION_ICE:      0.97,  // Area 4 ice stages — very slippery
    JUMP_VELOCITY:    -8.50,
    JUMP_HOLD_BOOST:  -0.15,  // extra upward impulse per held frame
    JUMP_HOLD_FRAMES:  12,
    BOARD_SPEED_MULT:  1.60,
    BOARD_FRICTION:    0.90,
    TILE:              48,    // display pixels per tile — DO NOT CHANGE
});

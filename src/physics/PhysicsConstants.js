/**
 * PhysicsConstants.js
 * All numeric tuning values for the Wonder Boy physics simulation.
 * Agent 2 (Physics & Controller Engineer) owns this file.
 *
 * Values are frozen so nothing can accidentally mutate them at runtime.
 */
export const C = Object.freeze({
    // ── Gravity & Falling ────────────────────────────────────────────────
    // Original WB had a noticeably heavy gravity — the player drops quickly
    // after the apex of a jump, giving a satisfying arc.
    GRAVITY:           0.40,   // px / frame²  — downward acceleration per frame

    // Terminal velocity matches the original; prevents tunnelling through
    // thin platforms at high speed.
    MAX_FALL_SPEED:    10.0,   // px / frame   — cap on downward vy

    // ── Horizontal Movement ──────────────────────────────────────────────
    // WB had a distinctive "slippery" feel: the player accelerates/decelerates
    // over several frames rather than stopping instantly.
    WALK_ACCEL:        0.50,   // px / frame²  — speed added each held-direction frame
    MAX_WALK_SPEED:    3.50,   // px / frame   — absolute horizontal speed cap

    // Friction multipliers applied to vx when no direction is held.
    // Lower = more slippery. Ground friction replicates the "skid to a halt"
    // feel of the original; air friction is subtler.
    FRICTION_GROUND:   0.80,   // multiplier/frame on ground (no input)
    FRICTION_AIR:      0.95,   // multiplier/frame in air    (no input)
    FRICTION_ICE:      0.97,   // multiplier/frame on ice tiles (Area 4 stages)

    // ── Jumping ──────────────────────────────────────────────────────────
    // The original used a two-phase jump: an instant impulse on press followed
    // by a small held boost, allowing short hops and full arcs.
    JUMP_VELOCITY:    -8.50,   // px / frame   — instant upward impulse on jump press
    JUMP_HOLD_BOOST:  -0.15,   // px / frame²  — extra upward boost each held frame
    JUMP_HOLD_FRAMES:  12,     // frames       — max duration of the hold-boost phase

    // ── Coyote Time ──────────────────────────────────────────────────────
    // In the original game the player could jump a handful of frames after
    // walking off a ledge, making narrow platforms feel forgiving.
    // 6 frames at 60 fps ≈ 100 ms — matches the classic "feel" threshold.
    COYOTE_FRAMES:     6,      // frames — jump still triggers N frames after leaving ground

    // ── Jump Buffering ───────────────────────────────────────────────────
    // If the player presses jump just before landing, the input is remembered
    // and executed the moment the player touches down — prevents missed jumps.
    // 8 frames ≈ 133 ms, long enough to feel responsive without being exploitable.
    JUMP_BUFFER_FRAMES: 8,     // frames — queued jump is valid for N frames before landing

    // ── Skateboard ───────────────────────────────────────────────────────
    // The skateboard is a power-up that increases speed and changes friction.
    BOARD_SPEED_MULT:  1.60,   // multiplier on MAX_WALK_SPEED while boarding
    BOARD_FRICTION:    0.90,   // replaces ground friction while boarding (more slippery)

    // ── Tile Size ────────────────────────────────────────────────────────
    // All positional math is in pixels; this converts tile coords to pixels.
    TILE:              48,     // display px per tile
});

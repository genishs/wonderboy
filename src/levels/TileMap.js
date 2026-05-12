// owning agent: dev-lead
// TODO: TileMap — Phase 1 grid + Phase 2 (v0.50) extension + Phase 3 (v0.75)
//   multi-stage hazards & triggers. New v0.75 types: STAGE_EXIT (mid-area
//   transition trigger), WATER_GAP (Stage 2 fatal water), CRYSTAL_VEIN
//   (Stage 3 fatal vein), MOONLIGHT_STREAK (Stage 4 decoration, non-fatal),
//   BOSS_TRIGGER (Stage 4 invisible camera-lock + boss spawn trigger).
//
// Plus a new `isFatal` per-tile flag that generalizes Phase 2's `isFire`
// (still kept for back-compat with anything that reads it). CombatSystem
// switches to `isFatal` for the hero-kill check.

export const TILE_TYPES = Object.freeze({
    EMPTY:        0,
    GROUND:       1,
    PLATFORM:     2,  // one-way: solid from above only
    SPIKE:        3,
    WATER:        4,
    BUSH:         5,  // decorative, no collision
    WALL:         6,
    ICE:          7,
    GOAL:         8,
    // ── Phase 2 (v0.50) ──────────────────────────────────────────────────
    FLAT:         100,
    SLOPE_UP_22:  101,
    SLOPE_UP_45:  102,
    SLOPE_DN_22:  103,
    SLOPE_DN_45:  104,
    MILE_1:       105,
    MILE_2:       106,
    MILE_3:       107,
    CAIRN:        108,
    FIRE_LOW:     109,
    ROCK_SMALL:   110,
    // v0.50.2 — Round 4 sign at the start of round-1-4. Round 1 uses MILE_1 at
    // the stage start, MILE_2 at round-1-2, MILE_3 at round-1-3, MILE_4 at
    // round-1-4. The cairn (boundary) stays at the very end as the Stage Cleared
    // trigger.
    MILE_4:       111,
    // ── Phase 3 (v0.75) ──────────────────────────────────────────────────
    // STAGE_EXIT — mid-Area stage-transition trigger (Stages 1→2, 2→3, 3→4).
    //   Carries optional tile.nextStage (1..4) consumed by TriggerSystem.
    STAGE_EXIT:        112,
    // WATER_GAP — Stage 2 hazard: visible animated sea-water; isFatal.
    WATER_GAP:         113,
    // CRYSTAL_VEIN — Stage 3 hazard: animated 3-frame amber vein; isFatal.
    CRYSTAL_VEIN:      114,
    // MOONLIGHT_STREAK — Stage 4 decoration; non-solid, non-fatal, animated.
    MOONLIGHT_STREAK:  115,
    // BOSS_TRIGGER — Stage 4 invisible camera-lock + boss spawn trigger.
    BOSS_TRIGGER:      116,
});

const SOLID_TYPES = new Set([
    TILE_TYPES.GROUND, TILE_TYPES.WALL, TILE_TYPES.ICE, TILE_TYPES.PLATFORM,
    TILE_TYPES.FLAT,
    TILE_TYPES.SLOPE_UP_22, TILE_TYPES.SLOPE_UP_45,
    TILE_TYPES.SLOPE_DN_22, TILE_TYPES.SLOPE_DN_45,
]);

const SLOPE_PROFILE_OF = {
    [TILE_TYPES.SLOPE_UP_22]: 'up22',
    [TILE_TYPES.SLOPE_UP_45]: 'up45',
    [TILE_TYPES.SLOPE_DN_22]: 'dn22',
    [TILE_TYPES.SLOPE_DN_45]: 'dn45',
};

const TILE_KEY_OF = {
    [TILE_TYPES.FLAT]:             'flat',
    [TILE_TYPES.SLOPE_UP_22]:      'slope_up_22',
    [TILE_TYPES.SLOPE_UP_45]:      'slope_up_45',
    [TILE_TYPES.SLOPE_DN_22]:      'slope_dn_22',
    [TILE_TYPES.SLOPE_DN_45]:      'slope_dn_45',
    [TILE_TYPES.MILE_1]:           'mile_1',
    [TILE_TYPES.MILE_2]:           'mile_2',
    [TILE_TYPES.MILE_3]:           'mile_3',
    [TILE_TYPES.MILE_4]:           'mile_4',   // v0.50.2
    [TILE_TYPES.CAIRN]:            'cairn',
    [TILE_TYPES.FIRE_LOW]:         'fire_low',
    [TILE_TYPES.ROCK_SMALL]:       'rock_small',
    // v0.75
    [TILE_TYPES.STAGE_EXIT]:       'stage_exit',
    [TILE_TYPES.WATER_GAP]:        'water_gap',
    [TILE_TYPES.CRYSTAL_VEIN]:     'crystal_vein',
    [TILE_TYPES.MOONLIGHT_STREAK]: 'moonlight_streak',
    [TILE_TYPES.BOSS_TRIGGER]:     null,        // invisible — no tile art
};

const TRIGGER_KIND_OF = {
    [TILE_TYPES.MILE_1]:       'mile_1',
    [TILE_TYPES.MILE_2]:       'mile_2',
    [TILE_TYPES.MILE_3]:       'mile_3',
    [TILE_TYPES.MILE_4]:       'mile_4',   // v0.50.2
    [TILE_TYPES.CAIRN]:        'cairn',
    // v0.75
    [TILE_TYPES.STAGE_EXIT]:   'stage_exit',
    [TILE_TYPES.BOSS_TRIGGER]: 'boss_trigger',
};

export class TileMap {
    constructor(stageData) {
        this.cols   = stageData.cols;
        this.rows   = stageData.rows;
        this.width  = stageData.cols;   // legacy field — physics uses cols*TILE for px width
        this.height = stageData.rows;
        this.name   = stageData.id ?? 'unknown';

        // Build sparse grid: this.grid[row][col] = tile object | null
        // tileData entries are `[col, row, type]` or `[col, row, type, extra]`
        // where `extra` is an optional object with per-tile mutable fields
        // (e.g. `{ nextStage: 2 }` for STAGE_EXIT tiles, consumed by TriggerSystem).
        this.grid = Array.from({ length: this.rows }, () => new Array(this.cols).fill(null));
        for (const tup of stageData.tileData ?? []) {
            const col = tup[0], row = tup[1], type = tup[2], extra = tup[3];
            if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
                this.grid[row][col] = this._makeTile(type, extra);
            }
        }

        // Phase 1 fields preserved
        this.items       = stageData.items   ?? [];
        this.enemies     = stageData.enemies ?? [];
        this.playerStart = stageData.playerStart ?? { col: 1, row: this.rows - 2 };
        this.goalX       = (stageData.goalX ?? this.cols - 1) * 48;

        // Phase 2 fields (defaults safe for Phase 1 levels)
        this.decorations = stageData.decorations ?? [];   // [{col,row,kind}]
        this.spawn       = stageData.spawn ?? this.playerStart;
        this.entities    = stageData.entities ?? [];      // Phase 2 entity list
        this.theme       = stageData.theme ?? null;

        // Decoration lookup acceleration
        this._decoIndex = new Map();
        for (const d of this.decorations) {
            this._decoIndex.set(`${d.col},${d.row}`, d);
        }
    }

    getTile(col, row) {
        if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return null;
        return this.grid[row][col];
    }

    setTile(col, row, type, extra) {
        if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return;
        this.grid[row][col] = (type === TILE_TYPES.EMPTY) ? null : this._makeTile(type, extra);
    }

    /** Returns a decoration record at (col,row) or null. */
    getDecoration(col, row) {
        return this._decoIndex.get(`${col},${row}`) ?? null;
    }

    /**
     * Phase 2 — solid decoration AABB at the world-space (x, y), if any.
     * Helper for one-off probes (e.g. projectile despawn). The main collision
     * sweep iterates `this.decorations` directly. Returns {x,y,w,h} or null.
     */
    solidDecorationBoxAt(x, y) {
        const TS = 48;
        for (const d of this.decorations) {
            if (d.kind !== 'rock_small') continue;
            const w = 32, h = 32;
            const bx = d.col * TS + (TS - w) / 2;
            const by = d.row * TS - h;
            if (x >= bx && x < bx + w && y >= by && y < by + h) {
                return { x: bx, y: by, w, h };
            }
        }
        return null;
    }

    _makeTile(type, extra = null) {
        const slopeProfile = SLOPE_PROFILE_OF[type] ?? null;
        const tileKey      = TILE_KEY_OF[type] ?? null;
        const isAnimated   = (type === TILE_TYPES.FIRE_LOW)
                          || (type === TILE_TYPES.WATER_GAP)
                          || (type === TILE_TYPES.CRYSTAL_VEIN)
                          || (type === TILE_TYPES.MOONLIGHT_STREAK);
        const triggerKind  = TRIGGER_KIND_OF[type] ?? null;
        const isTrigger    = triggerKind !== null;
        const isFire       = (type === TILE_TYPES.FIRE_LOW);
        // v0.75 — generalized fatal-tile flag. CombatSystem._heroVsFatalTile
        // tests this in place of `isFire`. fire_low remains fatal; new hazards
        // (water_gap, crystal_vein) join. Stage 4's moonlight_streak is decoration only.
        const isFatal      = (type === TILE_TYPES.FIRE_LOW)
                          || (type === TILE_TYPES.WATER_GAP)
                          || (type === TILE_TYPES.CRYSTAL_VEIN);

        const tile = {
            type,
            tileKey,
            // Solidity:
            //   - Phase 1 GROUND/WALL/ICE/PLATFORM
            //   - Phase 2 FLAT and all slopes
            // Triggers (mile-markers, cairn, stage_exit, boss_trigger), fire, and
            // v0.75 hazards/decorations are NOT solid (Reed walks through).
            solid:    SOLID_TYPES.has(type),
            platform: type === TILE_TYPES.PLATFORM,
            hazard:   type === TILE_TYPES.SPIKE || type === TILE_TYPES.WATER,
            ice:      type === TILE_TYPES.ICE,
            // Phase 2:
            slopeProfile,
            isAnimated,
            isTrigger,
            triggerKind,
            isFire,
            // v0.75 — generalized fatal-tile flag (replaces hard-coded isFire path).
            isFatal,
            // Per-tile mutable trigger flag (StageManager resets on round load).
            _consumed: false,
        };
        // v0.75 — STAGE_EXIT carries an optional `nextStage` field surfaced from
        // the source tile-data tuple's 4th element (see constructor).
        if (extra && typeof extra === 'object') {
            if (typeof extra.nextStage === 'number') tile.nextStage = extra.nextStage;
        }
        return tile;
    }
}

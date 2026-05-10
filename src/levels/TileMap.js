// owning agent: dev-lead
// TODO: TileMap — Phase 1 grid + Phase 2 (v0.50) extension. New tile types:
//   slopes, fire (animated), mile-markers, cairn, rock_small. Plus a sparse
//   `decorations` overlay (rocks render+collide on top of ground). Phase 1
//   constructor signature kept intact for back-compat.

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
    [TILE_TYPES.FLAT]:        'flat',
    [TILE_TYPES.SLOPE_UP_22]: 'slope_up_22',
    [TILE_TYPES.SLOPE_UP_45]: 'slope_up_45',
    [TILE_TYPES.SLOPE_DN_22]: 'slope_dn_22',
    [TILE_TYPES.SLOPE_DN_45]: 'slope_dn_45',
    [TILE_TYPES.MILE_1]:      'mile_1',
    [TILE_TYPES.MILE_2]:      'mile_2',
    [TILE_TYPES.MILE_3]:      'mile_3',
    [TILE_TYPES.CAIRN]:       'cairn',
    [TILE_TYPES.FIRE_LOW]:    'fire_low',
    [TILE_TYPES.ROCK_SMALL]:  'rock_small',
};

const TRIGGER_KIND_OF = {
    [TILE_TYPES.MILE_1]: 'mile_1',
    [TILE_TYPES.MILE_2]: 'mile_2',
    [TILE_TYPES.MILE_3]: 'mile_3',
    [TILE_TYPES.CAIRN]:  'cairn',
};

export class TileMap {
    constructor(stageData) {
        this.cols   = stageData.cols;
        this.rows   = stageData.rows;
        this.width  = stageData.cols;   // legacy field — physics uses cols*TILE for px width
        this.height = stageData.rows;
        this.name   = stageData.id ?? 'unknown';

        // Build sparse grid: this.grid[row][col] = tile object | null
        this.grid = Array.from({ length: this.rows }, () => new Array(this.cols).fill(null));
        for (const [col, row, type] of stageData.tileData ?? []) {
            if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
                this.grid[row][col] = this._makeTile(type);
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

    setTile(col, row, type) {
        if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return;
        this.grid[row][col] = (type === TILE_TYPES.EMPTY) ? null : this._makeTile(type);
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

    _makeTile(type) {
        const slopeProfile = SLOPE_PROFILE_OF[type] ?? null;
        const tileKey      = TILE_KEY_OF[type] ?? null;
        const isAnimated   = (type === TILE_TYPES.FIRE_LOW);
        const triggerKind  = TRIGGER_KIND_OF[type] ?? null;
        const isTrigger    = triggerKind !== null;
        const isFire       = (type === TILE_TYPES.FIRE_LOW);

        return {
            type,
            tileKey,
            // Solidity:
            //   - Phase 1 GROUND/WALL/ICE/PLATFORM
            //   - Phase 2 FLAT and all slopes
            // Triggers (mile-markers, cairn) and fire are NOT solid (Reed walks through).
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
            // Per-tile mutable trigger flag (StageManager resets on round load).
            _consumed: false,
        };
    }
}

export const TILE_TYPES = Object.freeze({
    EMPTY:    0,
    GROUND:   1,
    PLATFORM: 2,  // one-way: solid from above only
    SPIKE:    3,
    WATER:    4,
    BUSH:     5,  // decorative, no collision
    WALL:     6,
    ICE:      7,
    GOAL:     8,
});

const SOLID_TYPES = new Set([TILE_TYPES.GROUND, TILE_TYPES.WALL, TILE_TYPES.ICE, TILE_TYPES.PLATFORM]);

export class TileMap {
    constructor(stageData) {
        this.cols   = stageData.cols;
        this.rows   = stageData.rows;
        this.width  = stageData.cols;   // in tiles (physics engine uses cols*TILE for pixel width)
        this.height = stageData.rows;
        this.name   = stageData.id ?? 'unknown';

        // Build sparse grid: this.grid[row][col] = tile object | null
        this.grid = Array.from({ length: this.rows }, () => new Array(this.cols).fill(null));
        for (const [col, row, type] of stageData.tileData ?? []) {
            if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
                this.grid[row][col] = this._makeTile(type);
            }
        }

        this.items       = stageData.items   ?? [];
        this.enemies     = stageData.enemies ?? [];
        this.playerStart = stageData.playerStart ?? { col: 1, row: this.rows - 2 };
        this.goalX       = (stageData.goalX ?? this.cols - 1) * 48;
    }

    getTile(col, row) {
        if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return null;
        return this.grid[row][col];
    }

    setTile(col, row, type) {
        if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return;
        this.grid[row][col] = type === TILE_TYPES.EMPTY ? null : this._makeTile(type);
    }

    _makeTile(type) {
        return {
            type,
            solid:    SOLID_TYPES.has(type),
            platform: type === TILE_TYPES.PLATFORM,
            hazard:   type === TILE_TYPES.SPIKE || type === TILE_TYPES.WATER,
            ice:      type === TILE_TYPES.ICE,
        };
    }
}

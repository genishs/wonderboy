/**
 * Agent 3 (Graphics & Animation Director) owns this file.
 *
 * Sprite sheet layout convention (all sheets use 16×16 base tiles, displayed at 3×):
 *
 *  player.png   row 0: walk (4 frames)  row 1: jump  row 2: board (2f)  row 3: attack  row 4: hurt
 *  enemies.png  row 0: snail (2f)  row 1: bee (2f)  row 2: cobra (2f)  row 3: frog (2f)
 *  items.png    row 0: apple  melon  cherry  axe  skateboard  angel_egg  devil_egg
 *  tiles.png    row 0: ground  platform  spike  water  bush  wall  ice  goal
 *  bosses.png   one row per area (4 frames each)
 *
 * TODO (Agent 3):
 *  1. Create sprite sheet PNGs in assets/sprites/
 *  2. Update Renderer._drawEntity() to call SpriteSheet.draw() instead of fillRect
 */

export class SpriteSheet {
    /**
     * @param {HTMLImageElement} image
     * @param {number} frameW  width of one frame in source image (px)
     * @param {number} frameH  height of one frame in source image (px)
     */
    constructor(image, frameW = 16, frameH = 16) {
        this.image  = image;
        this.frameW = frameW;
        this.frameH = frameH;
        this.cols   = Math.floor(image.width / frameW);
    }

    /**
     * Draw a specific frame to the canvas.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} frameIndex  0-based index across the entire sheet (left→right, top→bottom)
     * @param {number} dx          destination x (screen px)
     * @param {number} dy          destination y (screen px)
     * @param {number} dw          destination width  (defaults to frameW)
     * @param {number} dh          destination height (defaults to frameH)
     * @param {boolean} flipH      mirror horizontally (for left-facing sprites)
     */
    draw(ctx, frameIndex, dx, dy, dw = this.frameW, dh = this.frameH, flipH = false) {
        const sx = (frameIndex % this.cols) * this.frameW;
        const sy = Math.floor(frameIndex / this.cols) * this.frameH;

        if (flipH) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(this.image, sx, sy, this.frameW, this.frameH, -(dx + dw), dy, dw, dh);
            ctx.restore();
        } else {
            ctx.drawImage(this.image, sx, sy, this.frameW, this.frameH, dx, dy, dw, dh);
        }
    }

    /**
     * Draw a frame from a named row in the sheet.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} row    row index (0-based)
     * @param {number} col    column index within the row (0-based)
     */
    drawCell(ctx, row, col, dx, dy, dw = this.frameW, dh = this.frameH, flipH = false) {
        this.draw(ctx, row * this.cols + col, dx, dy, dw, dh, flipH);
    }

    static async load(src, frameW = 16, frameH = 16) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload  = () => resolve(new SpriteSheet(img, frameW, frameH));
            img.onerror = () => reject(new Error(`Failed to load sprite: ${src}`));
            img.src = src;
        });
    }
}

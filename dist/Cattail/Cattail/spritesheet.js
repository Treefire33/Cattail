import { Vector2, DrawList, Drawable } from "./graphics";
export class Spritesheet extends Drawable {
    image;
    imageDimensions;
    cellDimensions;
    cellPadding;
    sprites;
    constructor(srcImage, cellDimensions, cellPadding) {
        super();
        this.image = srcImage;
        this.imageDimensions = srcImage.size;
        this.cellDimensions = cellDimensions;
        this.cellPadding = cellPadding;
        this.initSprites();
    }
    initSprites() {
        let xBound = (this.imageDimensions.x / (this.cellDimensions.x + this.cellPadding));
        let yBound = (this.imageDimensions.y / (this.cellDimensions.y + this.cellPadding));
        for (let i = 0; i < xBound; i++) {
            for (let j = 0; j < yBound; j++) {
                console.log(`Cell ${i}, ${j}: ${this.getFrameFromRowCol(i, j).x}, ${this.getFrameFromRowCol(i, j).y}`);
            }
        }
    }
    draw(row, col) {
        DrawList.drawList.push(this);
    }
    getFrameFromRowCol(row, col) {
        return new Vector2(col * (this.cellPadding + this.cellDimensions.x), row * (this.cellPadding + this.cellDimensions.y));
    }
}

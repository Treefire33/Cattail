export class Vector2 {
    x;
    y;
    static zero = new Vector2(0, 0);
    static up = new Vector2(0, 1);
    static down = new Vector2(0, -1);
    static left = new Vector2(-1, 0);
    static right = new Vector2(1, 0);
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
export class Vector3 {
    x;
    y;
    z;
    static zero = new Vector3(0, 0, 0);
    static up = new Vector3(0, 1, 0);
    static down = new Vector3(0, -1, 0);
    static left = new Vector3(-1, 0, 0);
    static right = new Vector3(1, 0, 0);
    static forward = new Vector3(0, 0, 1);
    static back = new Vector3(0, 0, -1);
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
export class Colour {
    colour;
    alpha;
    static red = new Colour(255, 0, 0);
    static green = new Colour(0, 255, 0);
    static blue = new Colour(0, 0, 255);
    static black = new Colour(0, 0, 0);
    static white = new Colour(255, 255, 255);
    constructor(r, g, b, a = 1) {
        this.colour = new Vector3(r, g, b);
        this.alpha = a;
    }
    asCSSColour() {
        return `rgba(${this.colour.x},${this.colour.y},${this.colour.z},${this.alpha})`;
    }
}
export class DrawList {
    static drawList = [];
}
export class Drawable {
    //everything is a drawable, but must implment everything separately.
    position = new Vector2(0, 0);
    addToDrawList() {
        DrawList.drawList.push(this);
    }
}
export class Sprite extends Drawable {
    size;
    image;
    //constructor(pos: Vector2, size: Vector2);
    constructor(pos, size, image) {
        super();
        this.position = pos;
        this.size = size;
        if (image) {
            this.image = new CattailImage(this.position, this.size, Colour.white, image);
        }
    }
    move() {
        if (this.image) {
            this.image.position = this.position;
        }
    }
}
export class Shape extends Drawable {
    points;
    colour;
    fill = false;
    constructor(colour = Colour.red, ...points) {
        super();
        this.points = points;
        this.colour = colour;
    }
}
export class Rectangle extends Shape {
    constructor(pos, size, colour = Colour.red) {
        let p1 = pos;
        let p2 = new Vector2(pos.x + size.x, pos.y);
        let p3 = new Vector2(pos.x + size.x, pos.y + size.y);
        let p4 = new Vector2(pos.x, pos.y + size.y);
        super(colour, p1, p2, p3, p4);
    }
}
export class CattailImage {
    position;
    size;
    image;
    colour;
    constructor(pos, size, colour = Colour.white, srcimg) {
        this.position = pos;
        this.size = size;
        this.colour = colour;
        let temp = new Image(size.x, size.y);
        temp.src = srcimg;
        this.image = temp;
    }
}
export class Text extends Drawable {
    maxWidth;
    font;
    text;
    fontSize;
    colour;
    constructor(pos, text, fontSize, font = "sans-serif", colour = Colour.black, maxWidth = 10000) {
        super();
        this.position = pos;
        this.position.y = pos.y + (fontSize / 2);
        this.text = text;
        this.fontSize = fontSize;
        this.font = font;
        this.colour = colour;
        if (maxWidth)
            this.maxWidth = maxWidth;
    }
}
export class SpritesheetDrawable extends Drawable {
    image;
    cellSize;
    cellPosition;
    spriteSize;
    constructor(cellPosition, cellSize, image, imageDimensions) {
        super();
        this.cellSize = cellSize;
        this.image = image.image;
        this.cellPosition = cellPosition;
        if (imageDimensions) {
            this.spriteSize = new Vector2(imageDimensions.x / cellSize.x, imageDimensions.y / cellSize.y);
        }
        else {
            this.spriteSize = new Vector2(cellSize.x, cellSize.y);
        }
    }
}
export class Spritesheet extends Drawable {
    image;
    imageDimensions;
    cellDimensions;
    cellPadding;
    spriteGroups;
    constructor(srcImage, size, cellDimensions, cellPadding) {
        super();
        this.image = new CattailImage(new Vector2(0, 0), size, Colour.white, srcImage);
        this.imageDimensions = size;
        this.cellDimensions = cellDimensions;
        this.cellPadding = cellPadding;
        this.spriteGroups = {};
    }
    createSpriteGroup(groupName, topLeftMostSprite) {
        this.spriteGroups[groupName] = topLeftMostSprite;
    }
    getSprite(row, col) {
        return new SpritesheetDrawable(this.getFrameFromRowCol(row, col), this.cellDimensions, this.image);
    }
    getSpriteFromGroup(groupName, row, col) {
        if (!this.spriteGroups[groupName]) {
            console.error(`No group of name ${groupName}.`);
        }
        return new SpritesheetDrawable(this.getFrameFromRowCol(row + this.spriteGroups[groupName].x, col + this.spriteGroups[groupName].y), this.cellDimensions, this.image);
    }
    getFrameFromRowCol(row, col) {
        return new Vector2(col * (this.cellPadding + this.cellDimensions.x), row * (this.cellPadding + this.cellDimensions.y));
    }
}
export class Graphics {
    context;
    constructor(context) {
        this.context = context;
    }
    draw(draw) {
        let currentContext = this.context;
        if (draw instanceof Shape) {
            let drawable = draw;
            currentContext.beginPath();
            drawable.points.forEach((point) => {
                currentContext.lineTo(point.x, point.y);
            });
            currentContext.stroke();
            if (drawable.fill) {
                currentContext.fillStyle = drawable.colour.asCSSColour();
                currentContext.fill();
            }
            else {
                currentContext.closePath();
            }
        }
        if (draw instanceof Sprite) {
            let image = draw.image;
            currentContext.drawImage(image.image, image.position.x, image.position.y, image.size.x, image.size.y);
        }
        if (draw instanceof Text) {
            let textObj = draw;
            let text = textObj.text;
            let font = textObj.fontSize.toString() + "px " + textObj.font;
            currentContext.font = font;
            currentContext.fillStyle = textObj.colour.asCSSColour();
            if (text.split('\n').length > 1) {
                let curYPos = textObj.position.y;
                for (let i = 0; i < text.split('\n').length; i++) {
                    if (textObj.maxWidth)
                        currentContext.fillText(text.split('\n')[i], textObj.position.x, curYPos, textObj.maxWidth);
                    else
                        currentContext.fillText(text.split('\n')[i], textObj.position.x, curYPos);
                    curYPos += textObj.fontSize;
                }
            }
            else {
                if (textObj.maxWidth)
                    currentContext.fillText(text, textObj.position.x, textObj.position.y, textObj.maxWidth);
                else
                    currentContext.fillText(text, textObj.position.x, textObj.position.y);
            }
        }
    }
    drawFromList() {
        DrawList.drawList.forEach((draw) => {
            let currentContext = this.context;
            if (draw instanceof Shape) {
                let drawable = draw;
                currentContext.beginPath();
                drawable.points.forEach((point) => {
                    currentContext.lineTo(point.x, point.y);
                });
                currentContext.stroke();
                if (drawable.fill) {
                    currentContext.fillStyle = drawable.colour.asCSSColour();
                    currentContext.fill();
                }
                else {
                    currentContext.closePath();
                }
            }
            if (draw instanceof Sprite) {
                let image = draw.image;
                currentContext.drawImage(image.image, image.position.x, image.position.y, image.size.x, image.size.y);
            }
            if (draw instanceof SpritesheetDrawable) {
                currentContext.drawImage(draw.image, //image
                draw.cellPosition.x, draw.cellPosition.y, //source position
                draw.cellSize.x, draw.cellSize.y, //source size
                draw.position.x, draw.position.y, //dest canvas position
                draw.spriteSize.x, draw.spriteSize.y //dest canvas size
                );
            }
            if (draw instanceof Text) {
                let textObj = draw;
                let text = textObj.text;
                let font = textObj.fontSize.toString() + "px " + textObj.font;
                currentContext.font = font;
                currentContext.fillStyle = textObj.colour.asCSSColour();
                if (text.split('\n').length > 1) {
                    let curYPos = textObj.position.y;
                    for (let i = 0; i < text.split('\n').length; i++) {
                        if (textObj.maxWidth)
                            currentContext.fillText(text.split('\n')[i], textObj.position.x, curYPos, textObj.maxWidth);
                        else
                            currentContext.fillText(text.split('\n')[i], textObj.position.x, curYPos);
                        curYPos += textObj.fontSize;
                    }
                }
                else {
                    if (textObj.maxWidth)
                        currentContext.fillText(text, textObj.position.x, textObj.position.y, textObj.maxWidth);
                    else
                        currentContext.fillText(text, textObj.position.x, textObj.position.y);
                }
            }
            removeItem(DrawList.drawList, draw);
        });
    }
}
function removeItem(arr, value) {
    const index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

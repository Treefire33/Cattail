export class Vector2 {
    public x: number;
    public y: number;
    public static zero: Vector2 = new Vector2(0, 0);
    public static up: Vector2 = new Vector2(0, 1);
    public static down: Vector2 = new Vector2(0, -1);
    public static left: Vector2 = new Vector2(-1, 0);
    public static right: Vector2 = new Vector2(1, 0);
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
export class Vector3 {
    public x: number;
    public y: number;
    public z: number;
    public static zero: Vector3 = new Vector3(0, 0, 0);
    public static up: Vector3 = new Vector3(0, 1, 0);
    public static down: Vector3 = new Vector3(0, -1, 0);
    public static left: Vector3 = new Vector3(-1, 0, 0);
    public static right: Vector3 = new Vector3(1, 0, 0);
    public static forward: Vector3 = new Vector3(0, 0, 1);
    public static back: Vector3 = new Vector3(0, 0, -1);
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
export class Colour {
    public colour: Vector3;
    public alpha: number;
    public static red: Colour = new Colour(255, 0, 0);
    public static green: Colour = new Colour(0, 255, 0);
    public static blue: Colour = new Colour(0, 0, 255);
    public static black: Colour = new Colour(0, 0, 0);
    public static white: Colour = new Colour(255, 255, 255);
    constructor(r: number, g: number, b: number, a: number = 1)
    {
        this.colour = new Vector3(r, g, b);
        this.alpha = a;
    }
    public asCSSColour() : string
    {
        return `rgba(${this.colour.x},${this.colour.y},${this.colour.z},${this.alpha})`;
    }
}
export class DrawList {
    public static drawList: Drawable[] = [];
}
export class Drawable {
    //everything is a drawable, but must implment everything separately.
    public position: Vector2 = new Vector2(0,0);
    public addToDrawList()
    {
        DrawList.drawList.push(this);
    }
}
export class Sprite extends Drawable {
    public size: Vector2;
    public image: CattailImage;
    //constructor(pos: Vector2, size: Vector2);
    constructor(pos: Vector2, size: Vector2, image?: string)
    {
        super();
        this.position = pos;
        this.size = size;
        if(image)
        {
            this.image = new CattailImage(this.position, this.size, Colour.white, image);
        }
    }
    public move()
    {
        if(this.image)
        {
            this.image.position = this.position;
        }
    }
}
export class Shape extends Drawable {
    public points: Array<Vector2>;
    public colour: Colour;
    public fill: boolean = false;
    constructor(colour: Colour = Colour.red, ...points: Vector2[]) {
        super();
        this.points = points;
        this.colour = colour;
    }
}
export class Rectangle extends Shape {
    constructor(pos: Vector2, size: Vector2, colour: Colour = Colour.red) {
        let p1 = pos;
        let p2 = new Vector2(pos.x + size.x, pos.y);
        let p3 = new Vector2(pos.x + size.x, pos.y + size.y);
        let p4 = new Vector2(pos.x, pos.y + size.y);
        super(colour, p1, p2, p3, p4);
    }
}
export class CattailImage {
    public position: Vector2;
    public size: Vector2;
    public image: HTMLImageElement;
    public colour: Colour;
    constructor(pos: Vector2, size: Vector2, colour: Colour = Colour.white, srcimg: string) {
        this.position = pos;
        this.size = size;
        this.colour = colour;
        let temp = new Image(size.x, size.y);
        temp.src = srcimg;
        this.image = temp;
    }
}
export class Text extends Drawable {
    public maxWidth: number;
    public font: string;
    public text: string;
    public fontSize: number;
    public colour: Colour;
    constructor(pos: Vector2, text: string, fontSize: number, font: string = "sans-serif", colour: Colour = Colour.black, maxWidth : number = 10000)
    {
        super();
        this.position = pos;
        this.position.y = pos.y + (fontSize/2);
        this.text = text;
        this.fontSize = fontSize;
        this.font = font;
        this.colour = colour;
        if(maxWidth)
            this.maxWidth = maxWidth;
    }
}
export class SpritesheetDrawable extends Drawable
{
    public image: HTMLImageElement;
    public cellSize: Vector2;
    public cellPosition: Vector2;
    public spriteSize: Vector2;
    constructor(cellPosition: Vector2, cellSize: Vector2, image: CattailImage, imageDimensions?: Vector2)
    {
        super();
        this.cellSize = cellSize;
        this.image = image.image;
        this.cellPosition = cellPosition;
        if(imageDimensions)
        {
            this.spriteSize = new Vector2(imageDimensions.x/cellSize.x, imageDimensions.y/cellSize.y);
        }
        else
        {
            this.spriteSize = new Vector2(cellSize.x, cellSize.y);
        }
    }
}
export class Spritesheet extends Drawable
{
    public image: CattailImage;
    public imageDimensions: Vector2;
    public cellDimensions: Vector2;
    public cellPadding: number;
    public spriteGroups: { [id: string|number]: Vector2 };

    constructor(srcImage: string, size: Vector2, cellDimensions: Vector2, cellPadding: number)
    {
        super();
        this.image = new CattailImage(new Vector2(0, 0), size, Colour.white, srcImage);
        this.imageDimensions = size;
        this.cellDimensions = cellDimensions;
        this.cellPadding = cellPadding;
        this.spriteGroups = {};
    }

    public createSpriteGroup(groupName: string|number, topLeftMostSprite: Vector2)
    {
        this.spriteGroups[groupName] = topLeftMostSprite;
    }

    public getSprite(row: number, col: number): SpritesheetDrawable
    {
        return new SpritesheetDrawable(this.getFrameFromRowCol(row, col), this.cellDimensions, this.image);
    } 
    
    public getSpriteFromGroup(groupName: string|number, row: number, col: number): SpritesheetDrawable
    {
        if(!this.spriteGroups[groupName]) { console.error(`No group of name ${groupName}.`); }
        return new SpritesheetDrawable(this.getFrameFromRowCol(row + this.spriteGroups[groupName].x, col + this.spriteGroups[groupName].y), this.cellDimensions, this.image);
    } 

    public getFrameFromRowCol(row: number, col: number): Vector2
    {
        return new Vector2(
            col * (this.cellPadding + this.cellDimensions.x),
            row * (this.cellPadding + this.cellDimensions.y),
        );
    }
}
export class Graphics {
    public context: CanvasRenderingContext2D;
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }
    public draw(draw: Drawable): void 
    { 
        let currentContext = this.context;
        if(draw instanceof Shape)
        {
            let drawable = draw;
            currentContext.beginPath();
            drawable.points.forEach((point) => {
                currentContext.lineTo(point.x, point.y);
            });
            currentContext.stroke();
            if (drawable.fill) { currentContext.fillStyle = drawable.colour.asCSSColour(); currentContext.fill(); }
            else { currentContext.closePath(); }
        }
        if(draw instanceof Sprite)
        {
            let image = draw.image;
            currentContext.drawImage(image.image, image.position.x, image.position.y, image.size.x, image.size.y);
        }
        if(draw instanceof Text)
        {
            let textObj = draw;
            let text = textObj.text;
            let font = textObj.fontSize.toString() + "px " + textObj.font;
            currentContext.font = font;
            currentContext.fillStyle = textObj.colour.asCSSColour();
            if(text.split('\n').length > 1)
            {
                let curYPos = textObj.position.y;
                for(let i = 0; i < text.split('\n').length; i++)
                {
                    if(textObj.maxWidth)
                        currentContext.fillText(text.split('\n')[i], textObj.position.x, curYPos, textObj.maxWidth);
                    else
                        currentContext.fillText(text.split('\n')[i], textObj.position.x, curYPos);
                    curYPos += textObj.fontSize;
                }
            }
            else
            {
                if(textObj.maxWidth)
                    currentContext.fillText(text, textObj.position.x, textObj.position.y, textObj.maxWidth);
                else
                    currentContext.fillText(text, textObj.position.x, textObj.position.y);
            }
        }
    }
    public drawFromList(): void {
        DrawList.drawList.forEach((draw) => {
            let currentContext = this.context;
            if(draw instanceof Shape)
            {
                let drawable = draw;
                currentContext.beginPath();
                drawable.points.forEach((point) => {
                    currentContext.lineTo(point.x, point.y);
                });
                currentContext.stroke();
                if (drawable.fill) { currentContext.fillStyle = drawable.colour.asCSSColour(); currentContext.fill(); }
                else { currentContext.closePath(); }
            }
            if(draw instanceof Sprite)
            {
                let image = draw.image;
                currentContext.drawImage(image.image, image.position.x, image.position.y, image.size.x, image.size.y);
            }
            if(draw instanceof SpritesheetDrawable)
            {
                currentContext.drawImage(
                    draw.image, //image
                    draw.cellPosition.x, draw.cellPosition.y, //source position
                    draw.cellSize.x, draw.cellSize.y, //source size
                    draw.position.x, draw.position.y, //dest canvas position
                    draw.spriteSize.x, draw.spriteSize.y //dest canvas size
                );
            }
            if(draw instanceof Text)
            {
                let textObj = draw;
                let text = textObj.text;
                let font = textObj.fontSize.toString() + "px " + textObj.font;
                currentContext.font = font;
                currentContext.fillStyle = textObj.colour.asCSSColour();
                if(text.split('\n').length > 1)
                {
                    let curYPos = textObj.position.y;
                    for(let i = 0; i < text.split('\n').length; i++)
                    {
                        if(textObj.maxWidth)
                            currentContext.fillText(text.split('\n')[i], textObj.position.x, curYPos, textObj.maxWidth);
                        else
                            currentContext.fillText(text.split('\n')[i], textObj.position.x, curYPos);
                        curYPos += textObj.fontSize;
                    }
                }
                else
                {
                    if(textObj.maxWidth)
                        currentContext.fillText(text, textObj.position.x, textObj.position.y, textObj.maxWidth);
                    else
                        currentContext.fillText(text, textObj.position.x, textObj.position.y);
                }
            }
            removeItem<Drawable>(DrawList.drawList, draw);
        });
    }
}
function removeItem<T>(arr: Array<T>, value: T): Array<T> { 
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
}
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
    public static drawList: Sprite[] = [];
}
export class Sprite {
    public position: Vector2;
    public size: Vector2;
    public drawable: Drawable;
    public image: CattailImage;
    constructor(pos: Vector2, size: Vector2);
    constructor(pos: Vector2, size: Vector2, drawable?: Drawable);
    constructor(pos: Vector2, size: Vector2, drawable: Drawable, image?: string);
    constructor(pos: Vector2, size: Vector2, drawable?: Drawable, image?: string)
    {
        this.position = pos;
        this.size = size;
        if(drawable)
        {
            this.drawable = drawable;
        }
        if(image)
        {
            this.image = new CattailImage(this.position, this.size, Colour.white, image);
        }
    }
    public move(pos: Vector2)
    {
        if(this.drawable)
        {
            this.drawable.points.forEach((points) => {
                points.x += pos.x;
                points.y += pos.y;
            });
        }
        if(this.image)
        {
            this.image.position = this.position;
        }
    }
    public addToDrawList()
    {
        DrawList.drawList.push(this);
    }
}
export class Drawable {
    public points: Array<Vector2>;
    public colour: Colour;
    public fill: boolean = false;
    constructor(colour: Colour = Colour.red, ...points: Vector2[]) {
        this.points = points;
        this.colour = colour;
    }
}
export class Rectangle extends Drawable{
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
export class Graphics {
    public context: CanvasRenderingContext2D;
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }
    public draw(): void { }
    public drawFromList(): void {
        this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);
        DrawList.drawList.forEach((spr) => {
            let currentContext = this.context;
            if(spr.drawable)
            {
                let drawable = spr.drawable;
                currentContext.beginPath();
                drawable.points.forEach((point) => {
                    currentContext.lineTo(point.x, point.y);
                });
                currentContext.stroke();
                if (drawable.fill) { currentContext.fillStyle = drawable.colour.asCSSColour(); currentContext.fill(); }
                else { currentContext.closePath(); }
            }
            if(spr.image)
            {
                let image = spr.image;
                currentContext.drawImage(image.image, image.position.x, image.position.y, image.size.x, image.size.y);
            }
            removeItem<Sprite>(DrawList.drawList, spr);
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
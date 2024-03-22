export class Vector2 {
    public x: number;
    public y: number;
    public static zero: Vector2 = new Vector2(0, 0);
    public static up: Vector2 = new Vector2(0, 1);
    public static down: Vector2 = new Vector2(0, 1);
    public static left: Vector2 = new Vector2(-1, 0);
    public static right: Vector2 = new Vector2(1, 0);
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
export class Colour {
    public colour: string;
    public static red: Colour = new Colour("red");
    public static blue: Colour = new Colour("blue");
    public static green: Colour = new Colour("green");
    public static white: Colour = new Colour("white");
    public static black: Colour = new Colour("black");
    constructor(colour: string = "red") {
        this.colour = colour;
    }
}
export class DrawList {
    public static drawList: Drawable[] = [];
}
export class Drawable {
    public points: Array<Vector2>;
    public colour: Colour;
    constructor(colour: Colour = Colour.red, ...points: Vector2[]) {
        this.points = points;
        this.colour = colour;
    }
    public addToDrawList(): void {
        DrawList.drawList.push(this);
    }
}
export class Polygon extends Drawable {
    public addToDrawList(): void {
        super.addToDrawList();
    }
}
export class Rectangle extends Polygon {
    constructor(pos: Vector2, size: Vector2) {
        let p1 = pos;
        let p2 = new Vector2(pos.x + size.x, pos.y);
        let p3 = new Vector2(pos.x + size.x, pos.y + size.y);
        let p4 = new Vector2(pos.x, pos.y + size.y);
        super(Colour.red, p1, p2, p3, p4);
    }
    public addToDrawList(): void {
        super.addToDrawList();
    }
}
export class Graphics {
    public context: CanvasRenderingContext2D;
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }
    public draw(): void { }
    public drawFromList(fill: boolean): void {
        DrawList.drawList.forEach((drawable) => {
            let currentContext = this.context;
            currentContext.beginPath();
            drawable.points.forEach((point) => {
                currentContext.lineTo(point.x, point.y);
                currentContext.stroke();
            });
            if (fill) { currentContext.fillStyle = drawable.colour.colour; currentContext.fill(); }
            else { currentContext.closePath(); }
        });
    }
}
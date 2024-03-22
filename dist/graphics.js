export class Vector2 {
    x;
    y;
    static zero = new Vector2(0, 0);
    static up = new Vector2(0, 1);
    static down = new Vector2(0, 1);
    static left = new Vector2(-1, 0);
    static right = new Vector2(1, 0);
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
export class Colour {
    colour;
    static red = new Colour("red");
    static blue = new Colour("blue");
    static green = new Colour("green");
    static white = new Colour("white");
    static black = new Colour("black");
    constructor(colour = "red") {
        this.colour = colour;
    }
}
export class DrawList {
    static drawList = [];
}
export class Drawable {
    points;
    colour;
    constructor(colour = Colour.red, ...points) {
        this.points = points;
        this.colour = colour;
    }
    addToDrawList() {
        DrawList.drawList.push(this);
    }
}
export class Polygon extends Drawable {
    addToDrawList() {
        super.addToDrawList();
    }
}
export class Rectangle extends Polygon {
    constructor(pos, size) {
        let p1 = pos;
        let p2 = new Vector2(pos.x + size.x, pos.y);
        let p3 = new Vector2(pos.x + size.x, pos.y + size.y);
        let p4 = new Vector2(pos.x, pos.y + size.y);
        super(Colour.red, p1, p2, p3, p4);
    }
    addToDrawList() {
        super.addToDrawList();
    }
}
export class Graphics {
    context;
    constructor(context) {
        this.context = context;
    }
    draw() { }
    drawFromList(fill) {
        DrawList.drawList.forEach((drawable) => {
            let currentContext = this.context;
            currentContext.beginPath();
            drawable.points.forEach((point) => {
                currentContext.lineTo(point.x, point.y);
                currentContext.stroke();
            });
            if (fill) {
                currentContext.fillStyle = drawable.colour.colour;
                currentContext.fill();
            }
            else {
                currentContext.closePath();
            }
        });
    }
}

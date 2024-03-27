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
export class Sprite {
    position;
    size;
    drawable;
    image;
    constructor(pos, size, drawable, image) {
        this.position = pos;
        this.size = size;
        if (drawable) {
            this.drawable = drawable;
        }
        if (image) {
            this.image = new CattailImage(this.position, this.size, Colour.white, image);
        }
    }
    move(pos) {
        if (this.drawable) {
            this.drawable.points.forEach((points) => {
                points.x += pos.x;
                points.y += pos.y;
            });
        }
        if (this.image) {
            this.image.position = this.position;
        }
    }
    addToDrawList() {
        DrawList.drawList.push(this);
    }
}
export class Drawable {
    points;
    colour;
    fill = false;
    constructor(colour = Colour.red, ...points) {
        this.points = points;
        this.colour = colour;
    }
}
export class Rectangle extends Drawable {
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
export class Graphics {
    context;
    constructor(context) {
        this.context = context;
    }
    draw() { }
    drawFromList() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        DrawList.drawList.forEach((spr) => {
            let currentContext = this.context;
            if (spr.drawable) {
                let drawable = spr.drawable;
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
            if (spr.image) {
                let image = spr.image;
                currentContext.drawImage(image.image, image.position.x, image.position.y, image.size.x, image.size.y);
            }
            removeItem(DrawList.drawList, spr);
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

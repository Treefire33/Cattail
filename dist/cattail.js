import * as Graphics from "./graphics.js";
export class Game {
    canvas;
    context;
    graphicsContext;
    entites;
    fps = 60;
    currentLoop;
    constructor(size, backgroundColour) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = size.x;
        this.canvas.height = size.y;
        this.canvas.style.backgroundColor = backgroundColour.colour;
        this.context = this.canvas.getContext("2d");
        document.body.append(this.canvas);
        this.graphicsContext = new Graphics.Graphics(this.context);
        this.entites = [];
    }
    addEntity(entity) {
        this.entites.push(entity);
    }
    run() {
        let runFunc = () => {
            this.entites.forEach((entity) => { entity.update(); });
            this.graphicsContext.drawFromList();
        };
        this.currentLoop = setInterval(runFunc, this.fps / 1000);
    }
}
export class SpriteData {
    drawable;
    moveDrawable(pos) {
        this.drawable.points.forEach((point) => {
            if (pos) {
                point.x += pos.x;
                point.y += pos.y;
            }
        });
    }
}
export class GameObject {
    sprite;
    constructor(drawable) {
        this.sprite = new SpriteData();
        this.sprite.drawable = drawable;
    }
    prepareDraw() {
        this.sprite.drawable.addToDrawList();
    }
    update(...args) {
        //console.log("prepare");
        this.prepareDraw();
    }
}

import * as Graphics from "./graphics.js";
export class Game {
    canvas;
    context;
    graphicsContext;
    entites;
    fps = 1000 / 60;
    currentLoop;
    static deltaTime = 0;
    constructor(size, backgroundColour) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = size.x;
        this.canvas.height = size.y;
        this.canvas.style.backgroundColor = backgroundColour.asCSSColour();
        this.context = this.canvas.getContext("2d");
        document.body.append(this.canvas);
        this.graphicsContext = new Graphics.Graphics(this.context);
        this.entites = [];
    }
    addEntity(entity) {
        this.entites.push(entity);
        if (entity.active) {
            entity.load();
        }
    }
    run() {
        this.entites.forEach((entity) => {
            if (entity.active) {
                entity.load();
            }
        });
        let lastTime = 0;
        let runFunc = (timestamp) => {
            Game.deltaTime = (timestamp - lastTime) / this.fps;
            lastTime = timestamp;
            this.entites.forEach((entity) => { entity.update(); });
            this.graphicsContext.drawFromList();
            window.requestAnimationFrame(runFunc);
        };
        //this.currentLoop = setInterval(runFunc, this.fps/1000);
        window.requestAnimationFrame(runFunc);
    }
}
export class Component {
    gameObject;
    load(...args) {
    }
    update(...args) {
    }
}
export class SpriteData {
    spr;
    move(pos) {
        this.spr.position.x += pos.x;
        this.spr.position.y += pos.y;
        this.spr.move(pos);
    }
}
export class GameObject {
    sprite;
    components = [];
    active = true;
    scale = new Graphics.Vector2(1, 1);
    // constructor();
    // constructor(spr: Graphics.Sprite);
    // constructor(spr: Graphics.Sprite, scale?: Graphics.Vector2);
    constructor(spr, scale) {
        this.sprite = new SpriteData();
        console.log(this.sprite);
        if (scale) {
            this.scale = scale;
        }
        if (spr) {
            this.sprite.spr = spr;
            if (scale && this.sprite.spr.drawable) {
                this.sprite.spr.drawable.points.forEach((points) => {
                    points.x *= this.scale.x;
                    points.y *= this.scale.y;
                });
            }
        }
    }
    // public set scale(v : Graphics.Vector2) 
    // {
    //     this.scale = v;
    //     this.sprite.drawable.points.forEach((points) => 
    //     {
    //         points.x *= this.scale.x;
    //         points.y *= this.scale.y;
    //     });
    // }
    prepareDraw() {
        this.sprite.spr.addToDrawList();
    }
    addComponent(component) {
        this.components.push(component);
    }
    // public getComponent<T>() : Component
    // {
    //     return this.components.find();
    // }
    load() {
        this.components.forEach((component) => {
            component.gameObject = this;
        });
        this.components.forEach((component) => {
            component.load();
        });
    }
    update(...args) {
        //console.log("prepare");
        this.prepareDraw();
        this.components.forEach((component) => {
            component.update();
        });
    }
}

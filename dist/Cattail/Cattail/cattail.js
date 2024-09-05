import { Graphics, Vector2, Drawable, Sprite, Shape } from "./graphics";
import { CattailAudio } from "./audio";
export class Game {
    canvas;
    audioElement;
    context;
    graphicsContext;
    audio;
    entites;
    fps = 1000 / 60;
    currentLoop;
    backgroundImage;
    static deltaTime = 0;
    static NullDrawable = new Drawable();
    constructor(size, backgroundColour) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = size.x;
        this.canvas.height = size.y;
        this.canvas.style.display = "block";
        this.canvas.style.backgroundColor = backgroundColour.asCSSColour();
        this.audioElement = document.createElement("audio");
        this.audioElement.autoplay = true;
        this.audioElement.innerText = "Unable to start audio until webpage is clicked or interacted with.";
        this.context = this.canvas.getContext("2d");
        document.body.append(this.canvas);
        document.body.append(this.audioElement);
        this.graphicsContext = new Graphics(this.context);
        this.audio = new CattailAudio(this.audioElement);
        this.entites = [];
        window.addEventListener("resize", () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            if (this.backgroundImage != null || this.backgroundImage != undefined) {
                this.backgroundImage.image.size = new Vector2(this.canvas.width, this.canvas.height);
            }
        });
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    setBackgroundImage(imageUrl) {
        this.backgroundImage = new Sprite(new Vector2(0, 0), new Vector2(this.canvas.width, this.canvas.height), imageUrl);
    }
    addEntity(entity) {
        this.entites.push(entity);
        if (entity.active) {
            entity.load();
        }
    }
    run() {
        this.getUserGesture();
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
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.graphicsContext.draw(this.backgroundImage);
            this.graphicsContext.drawFromList();
            window.requestAnimationFrame(runFunc);
        };
        //this.currentLoop = setInterval(runFunc, this.fps/1000);
        window.requestAnimationFrame(runFunc);
    }
    async getUserGesture() {
        try {
            // Wait for the user gesture
            const clickEvent = await waitForUserGesture();
            // User has clicked, do something with the event
            console.log('User clicked:', clickEvent);
            this.audio.resumeAllSound();
        }
        catch (error) {
            console.error('Error while waiting for user gesture:', error);
        }
    }
}
export class Scene {
    entities;
}
export class Component {
    gameObject;
    load(...args) {
    }
    update(...args) {
    }
}
export class DrawData {
    draw;
    move(pos) {
        this.draw.position.x += pos.x;
        this.draw.position.y += pos.y;
        if (this.draw instanceof Sprite) {
            this.draw.move();
        }
        if (this.draw instanceof Shape) {
            this.draw.points.forEach((points) => {
                points.x += pos.x;
                points.y += pos.y;
            });
        }
    }
}
export class GameObject {
    sprite; //this is confusing, do I change it? Not right now.
    components = [];
    active = true;
    scale = new Vector2(1, 1);
    // constructor();
    // constructor(spr: Graphics.Sprite);
    // constructor(spr: Graphics.Sprite, scale?: Graphics.Vector2);
    constructor(spr, scale) {
        this.sprite = new DrawData();
        if (scale) {
            this.scale = scale;
        }
        if (spr) {
            this.sprite.draw = spr;
            if (scale && this.sprite.draw instanceof Shape) {
                this.sprite.draw.points.forEach((points) => {
                    points.x *= this.scale.x;
                    points.y *= this.scale.y;
                });
            }
        }
        else {
            this.sprite = null;
        }
    }
    setSprite(spr, scale) {
        this.sprite = new DrawData();
        if (scale) {
            this.scale = scale;
        }
        if (spr) {
            this.sprite.draw = spr;
            if (scale && this.sprite.draw instanceof Shape) {
                this.sprite.draw.points.forEach((points) => {
                    points.x *= this.scale.x;
                    points.y *= this.scale.y;
                });
            }
        }
        else {
            this.sprite = null;
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
        if (this.sprite != null && this.active) {
            this.sprite.draw.addToDrawList();
        }
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
    // public getComponent<Component>(): Component | undefined
    // {
    //     this.components.forEach((component) => 
    //     {
    //         if(component instanceof Component)
    //         {
    //             return component;
    //         }
    //     });
    //     return undefined;
    // }
    getComponent(componentClass) {
        let foundComponent = undefined;
        this.components.forEach((component) => {
            console.log(component);
            console.log(component instanceof componentClass);
            if (component instanceof componentClass) {
                foundComponent = component;
            }
        });
        return foundComponent;
    }
}
function waitForUserGesture() {
    return new Promise(resolve => {
        // Define a function to handle the click event
        function handleClick(event) {
            // Remove the event listener to prevent multiple resolves
            document.removeEventListener('change', handleClick);
            document.removeEventListener('click', handleClick);
            document.removeEventListener('contextmenu', handleClick);
            document.removeEventListener('dblclick', handleClick);
            document.removeEventListener('mouseup', handleClick);
            document.removeEventListener('pointerup', handleClick);
            document.removeEventListener('reset', handleClick);
            document.removeEventListener('submit', handleClick);
            document.removeEventListener('touchend', handleClick);
            // Resolve the promise with the event object
            resolve(event);
        }
        // Add a click event listener
        document.addEventListener('change', handleClick);
        document.addEventListener('click', handleClick);
        document.addEventListener('contextmenu', handleClick);
        document.addEventListener('dblclick', handleClick);
        document.addEventListener('mouseup', handleClick);
        document.addEventListener('pointerup', handleClick);
        document.addEventListener('reset', handleClick);
        document.addEventListener('submit', handleClick);
        document.addEventListener('touchend', handleClick);
    });
}

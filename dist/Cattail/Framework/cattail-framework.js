export class CattailAudio {
    audioElement;
    audioContext = new AudioContext();
    player;
    clips = new Array();
    constructor(element) {
        this.audioElement = element;
        this.player = this.audioContext.createMediaElementSource(this.audioElement);
        this.player.connect(this.audioContext.destination);
    }
    loadSound(url, looped) {
        let nClip = new AudioClip(url, looped, this);
        this.clips.push(nClip);
        return nClip;
    }
    async resumeAllSound() {
        this.clips.forEach((clip) => {
            clip.resume();
        });
    }
}
class AudioClip {
    clipUrl;
    element;
    context;
    loadSuspension = false;
    constructor(url, looped, context) {
        this.clipUrl = url;
        this.element = document.createElement("audio");
        this.element.src = this.clipUrl;
        this.element.autoplay = false;
        this.element.loop = looped;
        document.body.append(this.element);
        this.context = context;
    }
    play() {
        if (this.context.audioContext.state == "suspended") {
            this.loadSuspension = true;
            return;
        }
        this.element.play();
    }
    pause() {
        this.element.pause();
    }
    async resume() {
        await this.context.audioContext.resume();
        if (this.loadSuspension) {
            this.element.play();
            this.loadSuspension = false;
        }
    }
}
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
export class TextComponent extends Component {
    textObj = null;
    text;
    size;
    font = "sans-serif";
    constructor(text, size, font) {
        super();
        this.text = text;
        this.size = size;
        this.font = font;
    }
    load(...args) {
        this.textObj = new Text(this.gameObject.sprite.draw.position, this.text, this.size, this.font);
    }
    setFont(font) {
        this.textObj.font = font;
    }
    setSize(size) {
        this.textObj.fontSize = size;
    }
    setColour(colour) {
        this.textObj.colour = colour;
    }
    setText(text) {
        this.textObj.text = text;
    }
    anchor() {
        //this just sets it to itself.
        let positionAtAnchor = new Vector2(this.textObj.position.x, this.textObj.position.y);
        this.textObj.position = positionAtAnchor;
    }
    anchorTo(pos) {
        this.textObj.position = pos;
    }
    update(...args) {
        this.textObj.addToDrawList();
    }
}

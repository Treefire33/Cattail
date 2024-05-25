export class CattailAudio
{
    private audioElement: HTMLAudioElement;
    public audioContext: AudioContext = new AudioContext();
    public player : MediaElementAudioSourceNode;
    private clips : Array<AudioClip> = new Array<AudioClip>();
    constructor(element: HTMLAudioElement)
    {  
        this.audioElement = element;
        this.player = this.audioContext.createMediaElementSource(this.audioElement);
        this.player.connect(this.audioContext.destination);
    }
    public loadSound(url: string, looped: boolean)
    {
        let nClip = new AudioClip(url, looped, this);
        this.clips.push(nClip);
        return nClip;
    }
    public async resumeAllSound()
    {
        this.clips.forEach((clip) => {
            clip.resume();
        });
    }
}
class AudioClip
{
    public clipUrl : string;
    public element : HTMLAudioElement;
    private context : CattailAudio;
    private loadSuspension : boolean = false;
    constructor(url: string, looped: boolean, context: any)
    {
        this.clipUrl = url;
        this.element = document.createElement("audio");
        this.element.src = this.clipUrl;
        this.element.autoplay = false;
        this.element.loop = looped;
        document.body.append(this.element);
        this.context = context;
    }
    public play()
    {
        if(this.context.audioContext.state == "suspended")
        {
            this.loadSuspension = true;
            return;
        }
        this.element.play();
    }
    public pause()
    {
        this.element.pause();
    }
    public async resume()
    {
        await this.context.audioContext.resume();
        if(this.loadSuspension)
        {
            this.element.play();
            this.loadSuspension = false;
        }
    }
}export class Vector2 {
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
    public position: Vector2;
    public addToDrawList()
    {
        DrawList.drawList.push(this);
    }
}
export class Sprite extends Drawable {
    public size: Vector2;
    public image: CattailImage;
    constructor(pos: Vector2, size: Vector2);
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
    constructor(pos: Vector2, text: string, fontSize: number, font: string = "sans-serif", colour: Colour = Colour.black, maxWidth? : number)
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
export class Graphics {
    public context: CanvasRenderingContext2D;
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }
    public draw(): void { }
    public drawFromList(): void {
        this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);
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
}export class Game
{
    public canvas : HTMLCanvasElement;
    public audioElement: HTMLAudioElement;
    private context : CanvasRenderingContext2D;
    public graphicsContext : Graphics;
    public audio : CattailAudio;
    public entites : Array<GameObject>;
    public fps : number = 1000/60;
    public currentLoop : number;
    public static deltaTime : number = 0;
    constructor(size?:Vector2, backgroundColour?:Colour)
    {
        this.canvas = <HTMLCanvasElement>document.createElement("canvas");
        this.canvas.width = size.x;
        this.canvas.height = size.y;
        this.canvas.style.backgroundColor = backgroundColour.asCSSColour();
        this.audioElement = <HTMLAudioElement>document.createElement("audio");
        this.audioElement.autoplay = true;
        this.audioElement.innerText = "Unable to start audio until webpage is clicked or interacted with.";
        this.context = this.canvas.getContext("2d")!;
        document.body.append(this.canvas);
        document.body.append(this.audioElement);
        this.graphicsContext = new Graphics(this.context);
        this.audio =  new CattailAudio(this.audioElement);
        this.entites = [];
    }
    public addEntity(entity: GameObject)
    {
        this.entites.push(entity);
        if(entity.active)
        {
            entity.load();
        }
    }
    public run()
    {
        this.getUserGesture();
        this.entites.forEach((entity) => {
            if(entity.active)
            {
                entity.load();
            }
        });
        let lastTime = 0;
        let runFunc = (timestamp) => 
        {
            Game.deltaTime = (timestamp - lastTime) / this.fps;
            lastTime = timestamp;
            this.entites.forEach((entity) => {entity.update();})
            this.graphicsContext.drawFromList();
            window.requestAnimationFrame(runFunc);
        }
        //this.currentLoop = setInterval(runFunc, this.fps/1000);
        window.requestAnimationFrame(runFunc);
    }
    public async getUserGesture() {
        try {
          // Wait for the user gesture
          const clickEvent = await waitForUserGesture();
          // User has clicked, do something with the event
          console.log('User clicked:', clickEvent);
          this.audio.resumeAllSound();
        } catch (error) {
          console.error('Error while waiting for user gesture:', error);
        }
    }
}
export class Component
{
    public gameObject : GameObject;
    public load(...args : any[]) : void
    {

    }
    public update(...args : any[]) : void
    {
        
    }
}

export class DrawData
{
    public draw: Drawable;
    public move(pos:Vector2)
    {
        this.draw.position.x += pos.x;
        this.draw.position.y += pos.y;
        if(this.draw instanceof Sprite)
        {
            this.draw.move();
        }
        if(this.draw instanceof Shape)
        {
            this.draw.points.forEach((points) => {
                points.x += pos.x;
                points.y += pos.y;
            });
        }
    }
}
export class Collider extends Component {
    public static allColliders: Array<Collider> = [];
    public position: Vector2;
    public size: Vector2;
    public collided: boolean;
    constructor(pos: Vector2, size: Vector2)
    {
        super();
        this.position = pos;
        this.size = size;
        Collider.allColliders.push(this);
    }
    public collide(): boolean
    {
        let hit = false;
        Collider.allColliders.forEach((coll) => {
            if(coll == this) {return;} 
            if(getDistance(coll.position.x, coll.position.y, this.position.x, this.position.y) < coll.size.x)
            {
                hit = true;
            }
        });
        this.collided = hit;
        return hit;
    }
}
function getDistance(x1,y1,x2,y2): number { 
    const xDist = x2 - x1;
    const yDist = y2 - y1;
    return Math.hypot(xDist, yDist);
}
export class GameObject
{
    public sprite: DrawData; //this is confusing, do I change it? Not right now.
    public components: Array<Component> = [];
    public collider: Collider;
    public active: boolean = true;
    public scale: Vector2 = new Vector2(1,1);
    // constructor();
    // constructor(spr: Graphics.Sprite);
    // constructor(spr: Graphics.Sprite, scale?: Graphics.Vector2);
    constructor(spr?: Drawable, scale?: Vector2)
    {
        this.sprite = new DrawData();
        console.log(this.sprite);
        if(scale)
        {
            this.scale = scale;
        }
        if(spr)
        {
            this.sprite.draw = spr;
            if(scale && this.sprite.draw instanceof Shape)
            {
                this.sprite.draw.points.forEach((points) => 
                {
                    points.x *= this.scale.x;
                    points.y *= this.scale.y;
                });
                this.collider = new Collider(this.sprite.draw.position, new Vector2(this.sprite.draw.points[0].x+5, this.sprite.draw.points[this.sprite.draw.points.length-1].y+5));
                return;
            }
            if(this.sprite.draw instanceof Sprite)
                this.collider = new Collider(this.sprite.draw.position, new Vector2(this.sprite.draw.size.x+5, this.sprite.draw.size.y+5));
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
    
    public prepareDraw()
    {
        let colliderVisual: Drawable;
        if(this.collider)
        {
            colliderVisual = new Rectangle(this.collider.position, this.collider.size, Colour.green);
            colliderVisual.addToDrawList();
        }
        this.sprite.draw.addToDrawList();
    }
    public addComponent(component: Component)
    {
        this.components.push(component);
    }
    // public getComponent<T>() : Component
    // {
    //     return this.components.find();
    // }
    public load()
    {
        this.components.forEach((component) => 
        {
            component.gameObject = this;
        });
        this.components.forEach((component) => 
        {
            component.load();
        });
    }
    public update(...args:any)
    {
        //console.log("prepare");
        this.prepareDraw();
        if(this.collider != null)
        {
            this.collider.collide();
        }
        this.components.forEach((component) => 
        {
            component.update();
        });
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

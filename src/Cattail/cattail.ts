import {Graphics, Vector2, Colour, Drawable, Sprite, Text, Shape, Rectangle} from "./graphics.js";
import {CattailAudio} from "./audio.js";
export class Game
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
                this.collider = new Collider(this.sprite.draw.position, new Vector2(this.sprite.draw.points[0].x, this.sprite.draw.points[this.sprite.draw.points.length-1].y));
                return;
            }
            if(this.sprite.draw instanceof Sprite)
                this.collider = new Collider(this.sprite.draw.position, new Vector2(this.sprite.draw.size.x, this.sprite.draw.size.y));
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
import {Graphics, Vector2, Colour, Drawable, Sprite, Text, Shape, CattailImage} from "./graphics";
import {CattailAudio} from "./audio";
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
    public backgroundImage: Sprite;

    public static deltaTime : number = 0;
    public static NullDrawable : Drawable = new Drawable();
    
    constructor(size?:Vector2, backgroundColour?:Colour)
    {
        this.canvas = <HTMLCanvasElement>document.createElement("canvas");
        this.canvas.width = size.x;
        this.canvas.height = size.y;
        this.canvas.style.display = "block";
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
    public setBackgroundImage(imageUrl: string)
    {
        this.backgroundImage = new Sprite(new Vector2(0,0), new Vector2(this.canvas.width, this.canvas.height), imageUrl);
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
            this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
            this.graphicsContext.draw(this.backgroundImage);
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
    private resizeCanvas() 
    {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    public enableResize()
    {
        window.addEventListener("resize", this.resizeCanvas);
        this.resizeCanvas();
    }
}
export class Scene
{
    public entities : Array<GameObject>;
    //this is just so I know it exists.
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
export class GameObject
{
    public sprite: DrawData; //this is confusing, do I change it? Not right now.
    public components: Array<Component> = [];
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
            }
        }
        else
        {
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
    
    public prepareDraw()
    {
        if(this.sprite != null && this.active)
        {
            this.sprite.draw.addToDrawList();
        }
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
        this.components.forEach((component) => 
        {
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
    public getComponent(componentClass: any): any
    {
        let foundComponent = undefined;
        this.components.forEach((component) => 
        {
            console.log(component);
            console.log(component instanceof componentClass);
            if(component instanceof componentClass)
            {
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
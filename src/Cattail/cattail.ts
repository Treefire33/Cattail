import * as Graphics from "./graphics.js";
export class Game
{
    public canvas : HTMLCanvasElement;
    private context : CanvasRenderingContext2D;
    public graphicsContext : Graphics.Graphics;
    public entites : Array<GameObject>;
    public fps : number = 1000/60;
    public currentLoop : number;
    public static deltaTime : number = 0;
    constructor(size:Graphics.Vector2, backgroundColour:Graphics.Colour)
    {
        this.canvas = <HTMLCanvasElement>document.createElement("canvas");
        this.canvas.width = size.x;
        this.canvas.height = size.y;
        this.canvas.style.backgroundColor = backgroundColour.asCSSColour();
        this.context = this.canvas.getContext("2d")!;
        document.body.append(this.canvas);
        this.graphicsContext = new Graphics.Graphics(this.context);
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

export class SpriteData
{
    public spr: Graphics.Sprite;
    public move(pos:Graphics.Vector2)
    {
        this.spr.position.x += pos.x;
        this.spr.position.y += pos.y;
        this.spr.move(pos);
    }
}
export class GameObject
{
    public sprite: SpriteData;
    public components: Array<Component> = [];
    public active: boolean = true;
    public scale: Graphics.Vector2 = new Graphics.Vector2(1,1);
    // constructor();
    // constructor(spr: Graphics.Sprite);
    // constructor(spr: Graphics.Sprite, scale?: Graphics.Vector2);
    constructor(spr?: Graphics.Sprite, scale?: Graphics.Vector2)
    {
        this.sprite = new SpriteData();
        console.log(this.sprite);
        if(scale)
        {
            this.scale = scale;
        }
        if(spr)
        {
            this.sprite.spr = spr;
            if(scale && this.sprite.spr.drawable)
            {
                this.sprite.spr.drawable.points.forEach((points) => 
                {
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
    
    public prepareDraw()
    {
        this.sprite.spr.addToDrawList();
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
}
import * as Graphics from "./graphics.js";
export class Game
{
    public canvas : HTMLCanvasElement
    private context : CanvasRenderingContext2D
    public graphicsContext : Graphics.Graphics
    public entites : Array<GameObject>
    public fps : number = 60
    public currentLoop : number;
    constructor(size:Graphics.Vector2, backgroundColour:Graphics.Colour)
    {
        this.canvas = <HTMLCanvasElement>document.createElement("canvas");
        this.canvas.width = size.x;
        this.canvas.height = size.y;
        this.canvas.style.backgroundColor = backgroundColour.colour;
        this.context = this.canvas.getContext("2d")!;
        document.body.append(this.canvas);
        this.graphicsContext = new Graphics.Graphics(this.context);
        this.entites = [];
    }
    public addEntity(entity: GameObject)
    {
        this.entites.push(entity);
    }
    public run()
    {
        let runFunc = () => 
        {
            this.entites.forEach((entity) => {entity.update();})
            this.graphicsContext.drawFromList();
        }
        this.currentLoop = setInterval(runFunc, this.fps/1000);
    }
}
export class SpriteData
{
    public drawable: Graphics.Drawable;
    public moveDrawable(pos:Graphics.Vector2)
    {
        this.drawable.points.forEach((point) => {
            if(pos)
            {
                point.x += pos.x;
                point.y += pos.y;
            }
        });
    }
}
export class GameObject
{
    public sprite: SpriteData;
    constructor(drawable: Graphics.Drawable)
    {
        this.sprite = new SpriteData();
        this.sprite.drawable = drawable;
    }
    public prepareDraw()
    {
        this.sprite.drawable.addToDrawList();
    }
    public update(...args:any)
    {
        //console.log("prepare");
        this.prepareDraw();
    }
}
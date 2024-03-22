import * as Graphics from "./graphics";
export class Game
{
    public canvas : HTMLCanvasElement
    private context : CanvasRenderingContext2D
    constructor(size:Graphics.Vector2, backgroundColour:Graphics.Colour)
    {
        this.canvas = <HTMLCanvasElement>document.createElement("canvas");
        this.canvas.width = size.x;
        this.canvas.height = size.y;
        this.canvas.style.backgroundColor = backgroundColour.colour;
        this.context = this.canvas.getContext("2d")!;
        document.append(this.canvas);
        this.context.rect(0,0,50,50);
        this.context.fill();
    }
}
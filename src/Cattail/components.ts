import { Colour, Text, Vector2 } from "./graphics";
import { Component } from "./cattail";

export class TextComponent extends Component
{
    private textObj : Text = null;

    private text : string;
    private size : number;
    private font : string = "sans-serif";

    constructor(text: string, size: number, font?: string)
    {
        super();
        this.text = text;
        this.size = size;
        this.font = font;
    }

    public load(...args: any[])
    {
        this.textObj = new Text(this.gameObject.sprite.draw.position, this.text, this.size, this.font);
    }

    public setFont(font: string): void
    {
        this.textObj.font = font;
    }

    public setSize(size: number): void
    {
        this.textObj.fontSize = size;
    }

    public setColour(colour: Colour): void
    {
        this.textObj.colour = colour;
    }

    public setText(text: string): void
    {
        this.textObj.text = text;
    }

    public anchor(): void
    {
        //this just sets it to itself.
        let positionAtAnchor: Vector2 = new Vector2(this.textObj.position.x, this.textObj.position.y);
        this.textObj.position = positionAtAnchor;
    }

    public anchorTo(pos: Vector2): void
    {
        this.textObj.position = pos;
    }

    public update(...args: any[])
    {
        this.textObj.addToDrawList();
    }
}
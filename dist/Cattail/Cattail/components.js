import { Text, Vector2 } from "./graphics";
import { Component } from "./cattail";
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

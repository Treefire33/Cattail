export class Game {
    canvas;
    context;
    constructor(size, backgroundColour) {
        this.canvas = document.createElement("canvas");
        this.canvas.width = size.x;
        this.canvas.height = size.y;
        this.canvas.style.backgroundColor = backgroundColour.colour;
        this.context = this.canvas.getContext("2d");
        document.append(this.canvas);
    }
}

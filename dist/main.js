import { Game, GameObject } from "./cattail.js";
import { Colour, Rectangle, Vector2 } from "./graphics.js";
const controller = {
    38: { pressed: false }, //up
    40: { pressed: false }, //down
    37: { pressed: false }, //left
    39: { pressed: false }, //right
};
class Player extends GameObject {
    speed = 2;
    speedX = 0;
    speedY = 0;
    move() {
        if (controller[38].pressed) {
            this.speedY = -1;
        }
        else if (controller[40].pressed) {
            this.speedY = 1;
        }
        else {
            this.speedY = 0;
        }
        if (controller[37].pressed) {
            this.speedX = -1;
        }
        else if (controller[39].pressed) {
            this.speedX = 1;
        }
        else {
            this.speedX = 0;
        }
        this.sprite.moveDrawable(new Vector2(this.speed * this.speedX, this.speed * this.speedY));
    }
    update(...args) {
        this.move();
        super.update(args);
    }
}
class BouncingSquare extends GameObject {
    speedX = 1;
    speedY = 1;
    screenEdge;
    bounce() {
        this.sprite.drawable.points.forEach((point) => {
            this.speedX = point.x >= this.screenEdge.x ? -1 : 1;
            this.speedY = point.y >= this.screenEdge.y ? -1 : 1;
        });
        this.sprite.moveDrawable(new Vector2(this.speedX, this.speedY));
    }
    update(...args) {
        this.bounce();
        super.update(args);
    }
}
let game = new Game(new Vector2(800, 450), Colour.white);
let rect = new Rectangle(new Vector2(0, 0), new Vector2(50, 50));
rect.fill = true;
// let newObj : Player = new Player(rect);
// document.addEventListener("keydown", function(event) 
// {
//     if(controller[event.keyCode]) { controller[event.keyCode].pressed = true; }
// }, false);
// document.addEventListener("keyup", function(event) 
// {
//     if(controller[event.keyCode]) { controller[event.keyCode].pressed = false; }
// }, false);
// game.addEntity(newObj);
let bouncer = new BouncingSquare(rect);
bouncer.screenEdge = new Vector2(game.canvas.width, game.canvas.height);
game.addEntity(bouncer);
game.run();

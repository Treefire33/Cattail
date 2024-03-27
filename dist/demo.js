import { Component, Game, GameObject } from "./Cattail/cattail.js";
import { Colour, Vector2, Sprite } from "./Cattail/graphics.js";
const controller = {
    38: { pressed: false }, //up
    40: { pressed: false }, //down
    37: { pressed: false }, //left
    39: { pressed: false }, //right
};
class Player extends Component {
    speed = 10;
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
        this.gameObject.sprite.move(new Vector2(this.speed * this.speedX * Game.deltaTime, this.speed * this.speedY * Game.deltaTime));
    }
    load(...args) {
        document.addEventListener("keydown", function (event) {
            if (controller[event.keyCode]) {
                controller[event.keyCode].pressed = true;
            }
        }, false);
        document.addEventListener("keyup", function (event) {
            if (controller[event.keyCode]) {
                controller[event.keyCode].pressed = false;
            }
        }, false);
    }
    update(...args) {
        this.move();
        super.update(args);
    }
}
const game = new Game(new Vector2(800, 450), Colour.white);
function AddPlayer() {
    var sprite = new Sprite(new Vector2(0, 0), new Vector2(100, 100), null, "FireTreeIcon.png");
    //sprite.image = new CattailImage(new Vector2(0,0), new Vector2(100, 100), Colour.white, "FireTreeIcon.png");
    var plr = new GameObject(sprite, new Vector2(1, 1));
    plr.components.push(new Player());
    game.addEntity(plr);
}
document.getElementById("add").onclick = function () {
    AddPlayer();
};
var sprite = new Sprite(new Vector2(0, 0), new Vector2(100, 100), null, "FireTreeIcon.png");
//sprite.image = new CattailImage(new Vector2(0,0), new Vector2(100, 100), Colour.white, "FireTreeIcon.png");
var plr = new GameObject(sprite, new Vector2(1, 1));
plr.components.push(new Player());
game.addEntity(plr);
game.run();

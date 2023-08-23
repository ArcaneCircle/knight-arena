import { CircleObject } from "../collision-objects/circle-object";
import { EnemyType } from "../enums/enemy-type";
import { WeaponType } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { deadAnim } from "../utilities/animation-utilities";
import { genSmallBox } from "../utilities/box-generator";
import { rectCircleCollision, checkForCollisions } from "../utilities/collision-utilities";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { createId, randomNumb, randomNumbOnRange } from "../utilities/general-utilities";
import { LifeBar } from "./life-bar";
import { enemyChainMailColors, knight } from "./sprites";
import { Weapon } from "./weapon";

export class Enemy {
    constructor(roomX, roomY, x, y, enemyType, roomDiv) {
        this.isAlive = true;
        this.id = createId();
        this.roomX = roomX;
        this.roomY = roomY;
        this.x = x;
        this.y = y;
        this.enemyType = enemyType;
        this.enemySize = enemyType === EnemyType.BASIC ? 2 : 4;
        this.roomCanv = roomDiv;

        this.enemyChainColor = enemyChainMailColors[randomNumb(enemyChainMailColors.length)];

        this.collisionObj = new CircleObject(x, y, toPixelSize(enemyType === EnemyType.BASIC ? 4 : 8));
        this.fakeMovCircle = new CircleObject(this.collisionObj.x, this.collisionObj.y, this.collisionObj.r);

        this.div = createElem(roomDiv, "div", null, ["enemy"]);

        this.shadowCanv = createElem(this.div, "canvas", null, null, toPixelSize(this.enemySize) * 7, toPixelSize(this.enemySize) * 6);
        this.shadowCanv.style.transform = 'translate(' + -toPixelSize(this.enemySize * 2) + 'px, ' + toPixelSize(this.enemySize * 4) + 'px)';

        this.enemyCanv = createElem(this.div, "canvas", null, null,
            knight[0].length * toPixelSize(this.enemySize),
            knight.length * toPixelSize(this.enemySize));

        this.enemyRightWeapon = new Weapon(0, 0, WeaponType.SWORD, -1, this, "#686b7a", this.enemySize);
        this.enemyLeftWeapon = new Weapon(0, 0, WeaponType.FIST, 1, this, "#686b7a", this.enemySize);

        this.lifeBar = new LifeBar((enemyType === EnemyType.BASIC ? randomNumbOnRange(1, 2) : randomNumbOnRange(6, 8)) * GameVars.heartLifeVal, false, this.div);

        this.draw();

        let rect = this.enemyCanv.getBoundingClientRect();
        this.div.style.width = rect.width + "px";
        this.div.style.height = rect.height + "px";
        this.div.style.transformOrigin = "70% 95%";
    }

    update() {
        if (this.lifeBar.life > 0) {
            this.handleInput();
            this.atk();
            this.lifeBar.update();
        } else {
            if (this.isAlive) {
                this.lifeBar.update();
                this.isAlive = false;
                this.div.animate(deadAnim(this.div.style.transform), { duration: 500, fill: "forwards" }).finished.then(() => {
                    this.destroy();
                });
            }
        }
    }

    handleInput() {
        let newRectX = this.collisionObj.x;
        let newRectY = this.collisionObj.y;

        // const movKeys = Object.keys(GameVars.keys).filter((key) => (
        //     key === 'w' || key === 's' || key === 'a' || key === 'd' ||
        //     key === 'W' || key === 'S' || key === 'A' || key === 'D' ||
        //     key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight'
        // ) && GameVars.keys[key]);

        // if (movKeys.length > 0) {
        //     this.enemyCanv.style.animation = "walk 0.16s infinite ease-in-out";
        //     this.enemyLeftWeapon.weaponCanv.style.animation = this.enemyLeftWeapon.isPerformingAction ? "" : "weaponWalkLeft 0.16s infinite ease-in-out";
        //     this.enemyRightWeapon.weaponCanv.style.animation = this.enemyRightWeapon.isPerformingAction ? "" : "weaponWalkRight 0.16s infinite ease-in-out";
        // } else {
        //     this.enemyCanv.style.animation = "";
        //     this.enemyLeftWeapon.weaponCanv.style.animation = "";
        //     this.enemyRightWeapon.weaponCanv.style.animation = "";
        // }

        // //todo momentarily solution
        // const playerSpeed = toPixelSize(2);
        // const distance = movKeys.length > 1 ? playerSpeed / 1.4142 : playerSpeed;

        // if (GameVars.keys['d'] || GameVars.keys['D'] || GameVars.keys['ArrowRight']) { newRectX += distance; }
        // if (GameVars.keys['a'] || GameVars.keys['A'] || GameVars.keys['ArrowLeft']) { newRectX -= distance; }
        // if (GameVars.keys['w'] || GameVars.keys['W'] || GameVars.keys['ArrowUp']) { newRectY -= distance; }
        // if (GameVars.keys['s'] || GameVars.keys['S'] || GameVars.keys['ArrowDown']) { newRectY += distance; }

        this.validateMovement(this.collisionObj.x, newRectY);
        this.validateMovement(newRectX, this.collisionObj.y);
    }

    validateMovement(x, y, ignoreCollisions) {
        this.fakeMovCircle.x = x;
        this.fakeMovCircle.y = y;
        ignoreCollisions ? this.move(this.fakeMovCircle) : checkForCollisions(this.fakeMovCircle, this.roomX, this.roomY, false, (circle) => this.move(circle));
    }

    move(circle) {
        this.collisionObj.x = circle.x;
        this.collisionObj.y = circle.y;
        this.div.style.transform = 'translate(' +
            (this.collisionObj.x - (knight[0].length * toPixelSize(this.enemySize)) / 2) + 'px, ' +
            (this.collisionObj.y - (knight.length * toPixelSize(this.enemySize)) / 4 * 3) + 'px)';
    }

    atk() {
        // if (GameVars.keys['v'] || GameVars.keys['V']) {
        // }
        // if (GameVars.keys['b'] || GameVars.keys['B']) {
        // this.enemyLeftWeapon.action();
        // }

        this.enemyRightWeapon.action();
        this.enemyRightWeapon.update();
        this.enemyLeftWeapon.update();
    }

    draw() {
        genSmallBox(this.shadowCanv, 0, 0, 6, 5, toPixelSize(this.enemySize), "#00000033", "#00000033");
        drawSprite(this.enemyCanv, knight, toPixelSize(this.enemySize), 0, 0, { "hd": "#999a9e", "hl": "#686b7a", "cm": this.enemyChainColor });
    }

    destroy() {
        this.div.parentNode.removeChild(this.div);
        GameVars.gameBoard.board[this.roomY][this.roomX].enemies.splice(
            GameVars.gameBoard.board[this.roomY][this.roomX].enemies.indexOf(this), 1);
    }
}
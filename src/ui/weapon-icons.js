import { WeaponType } from "../enums/weapon-type";
import { GameVars, toPixelSize } from "../game-variables";
import { genSmallBox } from "../utilities/box-generator";
import { createElem, drawSprite } from "../utilities/draw-utilities";
import { convertTextToPixelArt, drawPixelTextInCanvas } from "../utilities/text";
import { getWeaponSprite, playerColors } from "../entities/sprites";

export class WeaponIcons {
    constructor() {
        this.leftCanv = createElem(GameVars.gameDiv, "canvas", null, null, toPixelSize(30), toPixelSize(30), null,
            (e) => GameVars.keys['b'] = true,
            (e) => GameVars.keys['b'] = false);
        this.rightCanv = createElem(GameVars.gameDiv, "canvas", null, null, toPixelSize(30), toPixelSize(30), null,
            (e) => GameVars.keys['v'] = true,
            (e) => GameVars.keys['v'] = false);

        this.leftCanv.style.transform = 'translate(' + (GameVars.gameW - this.leftCanv.width - toPixelSize(12)) + 'px, ' + (GameVars.gameH - this.leftCanv.height - toPixelSize(12)) + 'px)';
        this.rightCanv.style.transform = 'translate(' + (GameVars.gameW - this.leftCanv.width - toPixelSize(30 + 24)) + 'px, ' + (GameVars.gameH - this.leftCanv.height - toPixelSize(12)) + 'px)';

        this.update();
    }

    update() {
        this.drawIcon(this.leftCanv, "B", GameVars.player.playerLeftWeapon.weaponType, GameVars.keys['b'] || GameVars.keys['B']);
        this.drawIcon(this.rightCanv, GameVars.isMobile ? "A" : "V", GameVars.player.playerRightWeapon.weaponType, GameVars.keys['v'] || GameVars.keys['V']);
    }

    drawIcon(canvas, letter, weaponType, isTouch) {
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        genSmallBox(canvas, 0, 0, 14, 14, toPixelSize(2), isTouch ? "#ffffffaa" : "#00000066", isTouch ? "#ffffff66" : "#100f0f66");
        this.drawWeapon(canvas, weaponType);
        genSmallBox(canvas, 9, 9, 5, 5, toPixelSize(2), "#ffff57", "#100f0f66");
        drawPixelTextInCanvas(convertTextToPixelArt(letter), canvas, toPixelSize(1), 24, 24, "#edeef7", 1);
    }

    drawWeapon(canvas, weaponType) {
        let pixelSize, x, y;
        switch (weaponType) {
            case WeaponType.FIST:
                pixelSize = 6; x = 1; y = 1;
                break;
            case WeaponType.SHIELD:
                pixelSize = 5; x = 1; y = 1;
                break;
            case WeaponType.SWORD:
                pixelSize = 5; x = 1; y = 0;
                break;
            case WeaponType.GREATSWORD:
                pixelSize = 4; x = 0; y = -2;
                break;
        }
        drawSprite(canvas, getWeaponSprite(weaponType), toPixelSize(pixelSize), x, y, { "wc": playerColors.hd });
    }
}
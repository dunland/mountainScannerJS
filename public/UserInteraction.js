import { clearCanvas, drawValueLine, showData, toggleShowData } from "./canvas.js";
import { getNextImage } from "./data.js";
import { changeMoveSpeed, moveSpeed } from "./scanner.js";

export function onKeyDown(keyEvent) {
    console.log(keyEvent.key);
    switch (keyEvent.key) {
        case '+':
            changeMoveSpeed(moveSpeed + 1);
            break;
        case '-':
            changeMoveSpeed(moveSpeed - 1);
            break;

        case 'v':
            toggleShowData();
            if (showData) drawValueLine();
            else clearCanvas();
            break;

        case 'Enter':
            getNextImage();
            break;

        default:
            break;
    }
}
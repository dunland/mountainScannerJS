import { scanner, data, canvas } from "./fsm.js";

export function onKeyDown(keyEvent) {
    console.log(keyEvent.key);
    switch (keyEvent.key) {
        case '+':
            scanner.moveSpeed = scanner.moveSpeed + 1;
            break;
        case '-':
            scanner.moveSpeed = scanner.moveSpeed - 1;
            break;

        case 'v':
            canvas.showData = !canvas.showData;
            if (canvas.showData) canvas.drawValueLine(data.values);
            else canvas.clearCanvas();
            break;

        case 'Enter':
            data.getNextImage();
            canvas.clearCanvas();
            if (canvas.showData) canvas.drawValueLine(data.values);
            break;

        default:
            break;
    }
}
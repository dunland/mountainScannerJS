import { changeMoveSpeed, moveSpeed } from "./scanner.js";

export function onKeyDown(keyEvent){
    console.log(keyEvent.key);
    switch (keyEvent.key) {
        case '+':
            changeMoveSpeed(moveSpeed + 1);
            break;
        case '-':
            changeMoveSpeed(moveSpeed - 1);
            break;
        
        default:
            break;
    }
}
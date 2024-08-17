import { scanner, data, canvas, fsm } from "./fsm.js";
import { Midi } from "./webMidi.js";

export function onKeyDown(keyEvent) {
    switch (keyEvent.key) {
        case '+':
            scanner.moveSpeed = scanner.moveSpeed + 1;
            break;
        case '-':
            scanner.moveSpeed = scanner.moveSpeed - 1;
            break;

        case 'v':
            canvas.showData = !canvas.showData;
            break;

        case 'Enter':
            fsm.state.actuate();
            fsm.next();
            break;

        case 'Backspace':
            fsm.previous();
            break;

        case 'Tab':
            fsm.next();
            break;

        case 'ArrowUp':
            if (fsm.state.up)
                fsm.state.up();
            break;

        case 'ArrowDown':
            if (fsm.state.down)
                fsm.state.down();
            break;
        case 'ArrowLeft':
            if (fsm.state.left)
                fsm.state.left();
            break;
        case 'ArrowRight':
            if (fsm.state.right)
                fsm.state.right();
            break;

        case ' ':
            if (fsm.state.space)
                fsm.state.space();
            break;

        default:
            console.log(keyEvent.key);
            break;
    }
    fsm.updateInfo();
}

document.addEventListener('DOMContentLoaded', () => {

    // create navigation elements:
    fsm.states.forEach(state => {

        let newDiv = document.createElement('div');
        newDiv.className = 'navigationIcon';
        newDiv.id = `navigation_${state.name}`;
        newDiv.textContent = state.name;
        document.querySelector("#navigation").appendChild(newDiv);
    });

    let newDiv = document.createElement('div');
    newDiv.className = 'info';
    newDiv.id = 'info';
    newDiv.textContent = 'info';
    document.querySelector("#navigation").appendChild(newDiv);

    document.getElementById(`navigation_${fsm.state.name}`).classList.add('active');

});
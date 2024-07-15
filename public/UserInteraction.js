import { scanner, data, canvas, fsm } from "./fsm.js";

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
            fsm.next();
            break;

        case 'Backspace':
            fsm.previous();
            break;

        case 'Tab':
            fsm.skip();
            break;

        case 'ArrowUp':
            if (fsm.state.up)
                document.querySelector('#info').textContent = fsm.state.up();
            break;

        case 'ArrowDown':
            if (fsm.state.down)
                document.querySelector('#info').textContent = fsm.state.down();
            break;

        default:
            console.log(keyEvent.key);
            break;
    }
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

    document.getElementById(`navigation_${fsm.state.name}`).style.borderWidth = "3px";

});

function updateInfo(variable){
    console.log(window['Midi.cc']);
    document.querySelector('#info').textContent = window['Midi.cc'];
}
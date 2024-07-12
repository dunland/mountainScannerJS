import { scanner, data, canvas, fsm } from "./fsm.js";

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
            fsm.next();
            // fsm.dispatch('leave');
            break;

        case 'Backspace':
            fsm.previous();
            break;

        case 'Tab':
            console.log("to do: leave state without saving");
        default:
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

    document.getElementById(`navigation_${fsm.state.name}`).style.borderWidth = "3px";

});
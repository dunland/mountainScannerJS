import { data, canvas, fsm } from "./fsm.js";
import { Midi } from "./webMidi.js";

export function onKeyDown(keyEvent) {
    switch (keyEvent.key) {
        case '+':
            fsm.currentScanner.moveSpeed = fsm.currentScanner.moveSpeed + 0.1;
            break;
        case '-':
            fsm.currentScanner.moveSpeed = fsm.currentScanner.moveSpeed - 0.1;
            break;

        case 'v':
            canvas.showData = !canvas.showData;
            break;

        case 'Enter':
            fsm.state.enter();
            fsm.next();
            break;

        case 'Backspace':
            fsm.previous();
            break;

        case 'Tab':
            let idx = data.activeScanners.indexOf(fsm.currentScanner); // last active scanner
            if (idx < 0) break;

            idx = (idx + 1) % data.activeScanners.length;
            
            fsm.currentScanner = data.activeScanners[idx];

            // read image from html elements:
            data.rawImg = cv.imread(fsm.currentScanner.imgElement);
            const dSize = new cv.Size(window.innerWidth, window.innerHeight);
            data.img = new cv.Mat();
            cv.resize(data.rawImg, data.img, dSize, cv.INTER_LINEAR);
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
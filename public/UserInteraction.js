import { data, canvas, fsm } from "./fsm.js";
import { Midi } from "./webMidi.js";

export function onKeyDown(keyEvent) {
    switch (keyEvent.key) {
        case '+':
            fsm.currentScanner.moveSpeed = fsm.currentScanner.moveSpeed + 0.1;
            console.log(`moveSpeed: ${fsm.currentScanner.moveSpeed}`);
            break;
        case '-':
            fsm.currentScanner.moveSpeed = fsm.currentScanner.moveSpeed - 0.1;
            console.log(`moveSpeed: ${fsm.currentScanner.moveSpeed}`);
            break;

        case 'v':
            canvas.showData = !canvas.showData;
            break;

        case 'Enter':
            if (fsm.state.enter)
                fsm.state.enter();
            fsm.state.init();
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

        case 'i':
            if (fsm.state.i)
                fsm.state.i();
            break;

        case 'o':
            if (fsm.state.o)
                fsm.state.o();
            break;

        case 'k':
            if (fsm.state.k)
                fsm.state.k();
            break;

        case 'l':
            if (fsm.state.l)
                fsm.state.l();
            break;

        case 'ArrowLeft':
            if (!fsm.processingModeOn)
                fsm.previous();
            break;

        case 'ArrowRight':
            if (!fsm.processingModeOn)
                fsm.next();
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

    // TODO: fsm functions as dict
    // fsm.state[keyEvent.key]();
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
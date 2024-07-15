import { data } from "./fsm.js";
import { Midi } from "./webMidi.js";

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

export class Scanner {

    constructor() {

        this.centerX = 0; // center of movingRegion
        this.moveSpeed = 2;
        this.position = 0;
        this.regionWidth = 20;

        this.fullscreenImage = document.getElementById("FullscreenImage");
        this.displacement = this.fullscreenImage.width - innerWidth;

        this.upperLine = Math.floor(window.innerHeight / 3);
        this.lowerLine = Math.floor(window.innerHeight * 2 / 3);
    }

    // ------------------- functions: --------------------
    moveRegion() {

        // console.log(`displacement: ${this.displacement}`);
        // console.log(`innerWidth: ${innerWidth}, screenWidth: ${screenWidth}`);

        // console.log(this.centerX);

        this.position += this.moveSpeed;
        this.centerX = this.position + this.regionWidth / 2;
        if (this.position > screenWidth) {
            this.position = 0; // Reset the position when the region moves out of the screen
        } else if (this.position < 0 && this.moveSpeed < 0) {
            this.position = screenWidth;
        }

        const index = Math.floor((this.centerX / this.fullscreenImage.width) * data.values.length);
        // console.log(index);
        var value = data.values[index];
        const valueAsMidi = Math.max(Math.floor(127 - (value / screenHeight * 127)), 0);
        this.displayValue(this.centerX, value, index);

        // console.log(`value ${value} as midi: ${ 127 - (value/screenHeight * 127)}`);
        if (Midi.synth) {
            // console.log("broadcasting", valueAsMidi, value, position);
            Midi.synth.sendControlChange(Midi.cc, valueAsMidi);
        }
        // WebMidi.outputs[1].sendNoteOn(127 - (value/screenHeight * 127));

        const movingRegion = document.querySelector('#movingRegion');
        movingRegion.style.left = this.position + 'px';
        let xpos = screenWidth - this.position;
        movingRegion.style.backgroundPosition = `${xpos + this.displacement}px 0px`;
    }

    displayValue(x, y, index) {

        const valueElement = document.querySelector('.value-display');

        // Update the position and content of the value display
        valueElement.style.left = x + 15 + 'px';
        valueElement.style.top = y - 15 + 'px';
        valueElement.textContent = '___' + y + "\n" + index;
    }
}
import { data } from "./fsm.js";
import { Midi } from "./webMidi.js";

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

export class Scanner {

    constructor() {

        this.active = false;
        this.values = [];
        this.currentIndex = 0;

        this.centerX = 0; // center of movingRegion
        this.moveSpeed = 1;
        this.position = 0;
        this.regionWidth = 20;

        this.cc = 44; // Midi Control Channel

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

        this.currentIndex = Math.floor((this.centerX / data.fullScreenImage.width) * this.values.length);
        const value = this.values[this.currentIndex];
        // console.log(index);

        // console.log(`value ${value} as midi: ${ 127 - (value/screenHeight * 127)}`);
        if (Midi.synth) {
            // console.log("broadcasting", asMidi(value), value, position);
            if (this.cc >= 0)
                Midi.synth.sendControlChange(this.cc, asMidi(value));
            else {
                if (asMidi(value) != Midi.tempNote){
                    Midi.synth.sendNoteOn(asMidi(value));
                    Midi.tempNote = asMidi(value);
                }
            }
        }
        // WebMidi.outputs[1].sendNoteOn(127 - (value/screenHeight * 127));

        // move inverted image:
        if (false) {
            const movingRegion = document.querySelector('#movingRegion');
            movingRegion.style.left = this.position + 'px';
            let xpos = screenWidth - this.position;
            movingRegion.style.backgroundPosition = `${xpos + this.displacement}px 0px`;
        }
    }

    displayValue() {

        const valueElement = document.querySelector('.value-display');
        const value = this.values[this.currentIndex];

        // Update the position and content of the value display
        valueElement.style.left = this.position + 15 + 'px';
        valueElement.style.top = value - 15 + 'px';
        valueElement.textContent = '___' + value + "\n" + asMidi(value);
    }
}

function asMidi(value){
    return Math.max(Math.floor(127 - (value / screenHeight * 127)), 0);
}
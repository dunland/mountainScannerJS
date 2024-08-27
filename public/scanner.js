import { data } from "./fsm.js";
import { Midi } from "./webMidi.js";
import { colorFrom7bitValue, getRandomColor } from "./utils.js"

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

export class Scanner {

    constructor(imgElement) {

        this.active = false;
        this.values = [];
        this.currentIndex = 0;

        this.imgElement = imgElement;

        this.centerX = 0; // center of movingRegion
        this.moveSpeed = 0.4;
        this.position = 0;
        this.regionWidth = 20;

        this.cc = 44; // Midi Control Channel

        this.upperLine = Math.floor(window.innerHeight / 3);
        this.lowerLine = Math.floor(window.innerHeight * 2 / 3);

        // this.color = colorFrom7bitValue(this.cc);
        this.color = getRandomColor();
    }

    // ------------------- functions: --------------------
    moveRegion() {

        // console.log(`displacement: ${this.displacement}`);
        // console.log(`innerWidth: ${innerWidth}, screenWidth: ${screenWidth}`);

        this.position += this.moveSpeed;
        // this.centerX = Math.floor(this.position + this.regionWidth / 2); // TODO: use this when implementing inverted image
        if (this.position >= screenWidth) {
            this.position = 0; // Reset the position when the region moves out of the screen
        } else if (this.position < 0 && this.moveSpeed < 0) {
            this.position = screenWidth -1;
        }

        this.centerX = this.position;

        this.currentIndex = Math.floor((this.centerX / (innerWidth)) * this.values.length);
        const value = this.values[this.currentIndex];
        // console.log(index);

        // console.log(`value ${value} as midi: ${ 127 - (value/screenHeight * 127)}`);
        if (Midi.synth) {
            // console.log(`${this.position}, ${this.centerX}, ${this.currentIndex}/${this.values.length}/${innerWidth}, ${value}->${asMidi(value)} @ ${this.cc}`);
            if (this.cc && this.cc >= 0){
                Midi.synth.sendControlChange(this.cc, asMidi(value));
            }
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
        valueElement.style.color = this.color;
        const value = this.values[this.currentIndex];

        // Update the position and content of the value display
        valueElement.style.left = this.position + 'px';
        valueElement.style.top = value - 15 + 'px';
        valueElement.textContent = '___' + value + "\n" + asMidi(value);
    }

    /**
     * add or remove this scanner to the list of active scanners
     * @param {*} state 
     */
    setActive(state){
        this.active = state;

        if (this.active) {
          data.activeScanners.push(this);
        }
        else {
          data.activeScanners.splice(data.activeScanners.indexOf(this), 1);
        }
    }
}

function asMidi(value){
    return Math.max(Math.floor(127 - (value / screenHeight * 127)), 0);
}
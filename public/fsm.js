import { Canvas } from "./canvas.js";
import { Data } from "./data.js";
import { Midi } from "./webMidi.js";
import { Scanner } from "./scanner.js";
import { onKeyDown } from "./UserInteraction.js"

export const data = new Data();
export const canvas = new Canvas();

// ---------------- Script wrapper: ------------------
document.addEventListener("DOMContentLoaded", async () => {

  Midi.loadWebMidi();
  await data.fetchSilhouettes();

  console.log("FullscreenImage.width", document.getElementById('FullscreenImage').width);

})

addEventListener("keydown", onKeyDown);

window.addEventListener('load', () => { // run when all code is fully loaded

  console.log("openCV loaded!");
  data.fullScreenImage = document.querySelector("#FullscreenImage");
  data.gray = new cv.Mat();
  data.binary = new cv.Mat();

  data.getNextImage();

  fsm.state.init();

  canvas.animate();
});

class FSM {

  stateIdx = 0;
  currentScanner;
  processingModeOn = false;

  states = [
    {
      name: "processImage",
      init: () => {
        document.querySelector('#info').textContent = `${data.upperThresh} | ${data.lowerThresh}`;
        // data.updateImageThreshold();
        this.processingModeOn = false;
      },
      space: () => {
        this.processingModeOn = !this.processingModeOn;
        if (this.processingModeOn) data.updateImageThreshold();
      },
      enter: () => {
        if (this.processingModeOn) {
          data.processImage();
          this.currentScanner.values = data.tempValues;
        }
      },
      up: () => {
        if (this.processingModeOn) {
          data.upperThresh = (data.upperThresh + 1) % 255;
          data.updateImageThreshold();
        }
      },
      down: () => {
        if (this.processingModeOn) {
          data.upperThresh -= 1;
          if (data.upperThresh < 0) data.upperThresh = 255;
          data.updateImageThreshold();
        }
      },
      right: () => {
        if (this.processingModeOn) {
          data.lowerThresh = (data.lowerThresh + 1) % 255;
          data.updateImageThreshold();
        }
      },
      left: () => {
        if (this.processingModeOn) {
          data.lowerThresh -= 1;
          if (data.lowerThresh < 0) data.lowerThresh = 255;
          data.updateImageThreshold();
        }
      },
    },
    {
      name: 'scan',
      init: () => {
        document.querySelector('#info').textContent = `[SPACE] ${this.currentScanner.active}`;
        console.log(this.currentScanner);
      },
      enter: () => { },
      space: () => {
        this.currentScanner.active = !this.currentScanner.active
        document.querySelector('#info').textContent = this.currentScanner.active;

        if (this.currentScanner.active) {
          data.activeScanners.push(this.currentScanner);
        }
        else {
          data.activeScanners.splice(data.activeScanners.indexOf(this.currentScanner), 1);
        }
      }
    },
    {
      name: 'midiCC',
      init: () => { },
      enter: () => { },
      up: () => {
        this.currentScanner.cc += 1;
        if (this.currentScanner.cc > 127) {
          this.currentScanner.cc = -1;
        }
      },
      down: () => {
        this.currentScanner.cc -= 1;
        if (this.currentScanner.cc < -1) {
          this.currentScanner.cc = 127;
        }
      },
      space: () => {
        if (this.currentScanner.cc > -1) {
          this.tempMidi = this.currentScanner.cc;
          this.currentScanner.cc = -1;
        }
        else {
          this.currentScanner.cc = this.tempMidi;
        }
      }
    },
    {
      name: 'lines',
      init: () => {
        document.querySelector('#info').textContent = this.currentScanner.upperLine;
      },
      enter: () => { },
      up: () => {
        this.currentScanner.upperLine -= 1;
        canvas.drawHorizontalLine(this.currentScanner.upperLine)
      },
      down: () => {
        this.currentScanner.upperLine += 1;
        canvas.drawHorizontalLine(this.currentScanner.upperLine)
      },
      left: () => {
        this.currentScanner.lowerLine -= 1;
        canvas.drawHorizontalLine(this.currentScanner.lowerLine);
      },
      right: () => {
        this.currentScanner.lowerLine += 1;
        canvas.drawHorizontalLine(this.currentScanner.lowerLine);
      }
    }, {

      name: 'export',
      init: () => {
        document.querySelector('#info').textContent = `[SPACE] >> ${data.imagePath}`;
      },
      enter: () => { },
      space: () => {
        data.postJsonData(data.composeJson());
      }
    },
    {
      name: 'nextImage',
      init: () => {
      },
      enter: () => {
        data.getNextImage();
        canvas.clearCanvas();
        if (canvas.showData) canvas.drawValueLine(this.currentScanner.values);
      }
    }

  ]

  state = this.states[this.stateIdx];

  constructor() {
    // console.log(`state=${this.state.name}, stateIdx=${this.stateIdx}, states=${this.states}`);
  }

  /**
   * go to next state and run init function
   */
  next() {
    this.stateIdx = (this.stateIdx + 1) % this.states.length;
    this.setState(this.states[this.stateIdx]);
    this.state.init();
  }

  /**
   * go to previous state and run init function
   */
  previous() {
    this.stateIdx -= 1;
    if (this.stateIdx < 0)
      this.stateIdx = this.states.length - 1;
    this.setState(this.states[this.stateIdx]);
    this.state.init();
  }

  setState(newState) {
    console.log(newState.name);

    // deactivate current state / set border thickness of lastState:
    document.getElementById(`navigation_${this.state.name}`).classList.remove('active');

    // set state
    this.state = newState;

    // set border thickness of current:
    document.getElementById(`navigation_${newState.name}`).classList.add('active');
  }


  /**
   * update the content of the info box. this is called upon every key stroke. 
   */
  updateInfo() {

    let value = '';

    switch (this.state.name) {
      case "processImage":
        value = `${data.upperThresh} | ${data.lowerThresh}`
        break;

      case "scan":
        value = `[SPACE] ${this.currentScanner.active}`;
        break;

      case "midiCC":
        value = (this.currentScanner.cc < 0) ? 'sendNote' : this.currentScanner.cc;
        break;

      case "lines":
        value = `${this.currentScanner.upperLine} | ${this.currentScanner.lowerLine}`
        break;

      case "export":
        value = `[SPACE] >> ${data.imagePath.split(".")[0]}.json`;
        break;

      case "nextImage":
        value = document.querySelector('#info').textContent = `>>> ${data.silhouettes[(data.currentImageIndex + 1) % data.silhouettes.length]}`;
        ;
        break;

      default:
        break;
    }

    document.querySelector('#info').textContent = value;
  }
}

export const fsm = new FSM();
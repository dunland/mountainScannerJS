import { Canvas } from "./canvas.js";
import { Data } from "./data.js";
import { Midi } from "./webMidi.js";
import { onKeyDown } from "./UserInteraction.js"
import { colorFrom7bitValue } from "./utils.js";
import { Scanner } from "./scanner.js";

export const data = new Data();
export const canvas = new Canvas();

// ---------------- Script wrapper: ------------------
document.addEventListener("DOMContentLoaded", async () => {

  Midi.loadWebMidi();
  await data.fetchSilhouettes();
})

addEventListener("keydown", onKeyDown);

window.addEventListener('load', async () => { // run when all code is fully loaded

  await Midi.fetchSynthConfig();

  console.log("openCV loaded!");
  data.gray = new cv.Mat();
  data.binary = new cv.Mat();

  data.getNextImage();

  fsm.state.init();

  canvas.animate();
});

class FSM {

  stateIdx = 0;
  currentScanner = new Scanner();
  processingModeOn = false;
  tempCC = 44;
  tempCCidx = 0;

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
          this.processingModeOn = false;
          this.currentScanner.setActive(true);
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
        this.currentScanner.setActive(!this.currentScanner.active);
      }
    },
    {
      name: 'midiCC',
      init: () => {
        document.querySelector('#info').textContent = (this.currentScanner.cc >= 0) ? `${this.currentScanner.cc} ${Midi.synthConfig[this.currentScanner.cc]}` : 'sendNote';
      },
      enter: () => { },
      up: () => {
        this.tempCCidx = (this.tempCCidx + 1) % (Object.keys(Midi.synthConfig).length + 1);
        this.tempCC = parseInt(Object.keys(Midi.synthConfig)[this.tempCCidx]) || -1;
        console.log(this.tempCCidx, this.tempCC, Midi.synthConfig[this.tempCC]);
      },
      down: () => {
        this.tempCCidx -= 1;
        if (this.tempCCidx < 0) {
          this.tempCCidx = Object.keys(Midi.synthConfig).length;
        }
        this.tempCC = parseInt(Object.keys(Midi.synthConfig)[this.tempCCidx]) || -1;
        console.log(this.tempCCidx, this.tempCC, Midi.synthConfig[this.tempCC]);
      },
      space: () => {
        this.currentScanner.cc = this.tempCC;
        // this.currentScanner.color = colorFrom7bitValue(this.currentScanner.cc);

        // if (this.currentScanner.cc > -1) {
        //   this.tempMidi = this.currentScanner.cc;
        //   this.currentScanner.cc = -1;
        // }
        // else {
        //   this.currentScanner.cc = this.tempMidi;
        // }
      }
    },
    {
      name: 'lines',
      init: () => {
        document.querySelector('#info').textContent = this.currentScanner.upperLine;
      },
      enter: () => { },
      up: () => {
        if (this.currentScanner.upperLine > 0)
          this.currentScanner.upperLine -= 1;
      },
      down: () => {
        if (this.currentScanner.upperLine < this.currentScanner.lowerLine - 1)
          this.currentScanner.upperLine += 1;
      },
      left: () => {
        if (this.currentScanner.lowerLine > this.currentScanner.upperLine + 1)
          this.currentScanner.lowerLine -= 1;
      },
      right: () => {
        if (this.currentScanner.lowerLine < window.innerHeight)
          this.currentScanner.lowerLine += 1;
      }
    },
    {

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
        value = `[SPACE] ${(this.currentScanner.active) ? 'on' : 'off'}`;
        break;

      case "midiCC":
        value = (this.tempCC >= 0) ? `${this.tempCC} ${Midi.synthConfig[this.tempCC]}` : 'sendNote';
        document.getElementById('info').style.fontWeight = (this.tempCC == this.currentScanner.cc) ? 'bold' : 'normal';
        break;

      case "lines":
        value = `${this.currentScanner.upperLine} | ${this.currentScanner.lowerLine}`
        break;

      case "export":
        value = `[SPACE] >> ${data.imagePath.split(".")[0]}.json`;
        break;

      case "nextImage":
        value = `>>> ${data.allSilhouettes[(data.scanners.indexOf(this.currentScanner) + 1) % data.allSilhouettes.length]}`;
        ;
        break;

      default:
        break;
    }

    document.querySelector('#info').textContent = value;
  }
}

export const fsm = new FSM();
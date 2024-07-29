import { Canvas } from "./canvas.js";
import { Data } from "./data.js";
import { Midi } from "./webMidi.js";
import { Scanner } from "./scanner.js";
import { onKeyDown } from "./UserInteraction.js"

export const data = new Data();
export const scanner = new Scanner();
export const canvas = new Canvas();

// ---------------- Script wrapper: ------------------
document.addEventListener("DOMContentLoaded", async () => {

  Midi.loadWebMidi();
  await data.fetchSilhouettes();
  console.log(data.values);

  console.log(`dataHandler.values.length: ${data.values.length}`);
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

  states = [
    {
      name: "processImage",
      init: () => {
        document.querySelector('#info').textContent = `${data.upperThresh} | ${data.lowerThresh}`;
        data.updateImageThreshold();
      },
      actuate: () => {
        data.processImage();
        data.values = data.tempValues;
      },
      up: () => {
        data.upperThresh = (data.upperThresh + 1) % 255;
        data.updateImageThreshold();
      },
      down: () => {
        data.upperThresh -= 1;
        if (data.upperThresh < 0) data.upperThresh = 255;
        data.updateImageThreshold();
      },
      right: () => {
        data.lowerThresh = (data.lowerThresh + 1) % 255;
        data.updateImageThreshold();
      },
      left: () => {
        data.lowerThresh -= 1;
        if (data.lowerThresh < 0) data.lowerThresh = 255;
        data.updateImageThreshold();
      },
    },
    {
      name: 'midiCC',
      init: () => {
        document.querySelector('#info').textContent = Midi.cc;
      },
      actuate: () => { },
      up: () => {
        Midi.cc = (Midi.cc + 1) % 128;
        document.querySelector('#info').textContent = Midi.cc;
      },
      down: () => {
        Midi.cc -= 1;
        if (Midi.cc < 0)
          Midi.cc = 127;
        document.querySelector('#info').textContent = Midi.cc;
      },
    }, {

      name: 'lines',
      init: () => {
        document.querySelector('#info').textContent = scanner.upperLine;
      },
      actuate: () => { },
      up: () => {
        scanner.upperLine -= 1;
        canvas.drawHorizontalLine(scanner.upperLine)
      },
      down: () => {
        scanner.upperLine += 1;
        canvas.drawHorizontalLine(scanner.upperLine)
      },
      left: () => {
        scanner.lowerLine -= 1;
        canvas.drawHorizontalLine(scanner.lowerLine);
      },
      right: () => {
        scanner.lowerLine += 1;
        canvas.drawHorizontalLine(scanner.lowerLine);
      }
    }, {

      name: 'export',
      init: () => {
        document.querySelector('#info').textContent = data.imagePath;
      },
      actuate: () => {
        data.postJsonData(data.composeJson());
      }
    },
    {
      name: 'nextImage',
      init: () => {
      },
      actuate: () => {
        data.getNextImage();
        canvas.clearCanvas();
        if (canvas.showData) canvas.drawValueLine(data.values);
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
    // set border thickness of all to 1
    for (let icon of document.getElementsByClassName('navigationIcon')) {
      icon.style.borderWidth = "1px";
    }

    // set state
    this.state = newState;

    // set border thickness of current:
    document.getElementById(`navigation_${newState.name}`).style.borderWidth = "3px";
  }


updateInfo() {

  let value = '';

  switch (this.state.name) {
      case "processImage":
          value = `${data.upperThresh} | ${data.lowerThresh}`
          break;

      case "midiCC":
          value = Midi.cc;
          break;

      case "lines":
          value = `${scanner.upperLine} | ${scanner.lowerLine}`
          break;

      case "export":
          value = `${data.imagePath.split(".")[0]}.json`;
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
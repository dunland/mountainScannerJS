import { Canvas } from "./canvas.js";
import { Data } from "./data.js";
import { Midi } from "./webMidi.js";
import { Scanner } from "./scanner.js";
import { onKeyDown } from "./UserInteraction.js"

export const data = new Data();
export const scanner = new Scanner();
export const canvas = new Canvas();

class FSM {

  stateIdx = 0;

  states = [
    {
      name: "imgThreshold",
      init: () => {
      },
      leave: () => { }
    },
    {
      name: 'midiCC',
      init: () => {
      },
      leave: () => { }
    }, {

      name: 'upperLine',
      init: () => {
      },
      leave: () => { }
    }, {

      name: 'lowerLine',
      init: () => {
      },
      leave: () => { }

    }, {

      name: 'export',
      init: () => {
      },
      leave: () => { }
    },
    {
      name: 'nextImage',
      init: () => {
        data.getNextImage();
        canvas.clearCanvas();
        if (canvas.showData) canvas.drawValueLine(data.values);
      },
      leave: () => { }

    }

  ]

  state = this.states[this.stateIdx];

  constructor() {
    console.log(`state=${this.state.name}, stateIdx=${this.stateIdx}, states=${this.states}`);
  }

  next() {
    this.state.leave();
    this.stateIdx = (this.stateIdx + 1) % this.states.length;
    this.setState(this.states[this.stateIdx]);
    this.state.init();
  }

  previous() {
    this.state.leave();
    this.stateIdx -= 1;
    if (this.stateIdx < 0)
      this.stateIdx = this.states.length - 1;
    this.setState(this.states[this.stateIdx]);
    this.state.init();
  }

  setState(newState) {
    // set border thickness of all to 1
    for (let icon of document.getElementsByClassName('navigationIcon')) {
      icon.style.borderWidth = "1px";
    }

    // set state
    this.state = newState;

    // set border thickness of current:
    document.getElementById(`navigation_${newState.name}`).style.borderWidth = "3px";
  }
}

export const fsm = new FSM();

// ---------------- Script wrapper: ------------------
document.addEventListener("DOMContentLoaded", async () => {

  // Midi.loadWebMidi();
  // data.getNextImage();
  console.log(data.values);

  console.log(`dataHandler.values.length: ${data.values.length}`);
  console.log("FullscreenImage.width", document.getElementById('FullscreenImage').width);

  await canvas.drawValueLine(data.values);
  // scanner.moveRegion();

})

addEventListener("keydown", onKeyDown);

window.addEventListener('load', loadOpenCv); // run when all code is fully loaded

function loadOpenCv() {

  console.log("openCV loaded!");

  console.assert(cv, "cv is", cv);

  let canvasElement = document.getElementById("canvas");
  let imgElement = document.querySelector("#FullscreenImage");
  let ctx = canvasElement.getContext('2d');
  ctx.drawImage(imgElement, 0, 0);
  console.assert(ctx, "ctx is", ctx);

  // read from canvas:
  let imgData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
  console.assert(imgData, "no imgData", imgData);
  let src = cv.matFromImageData(imgData);
  let dst = new cv.Mat();
  // scale and shift are used to map the data to [0, 255].
  src.convertTo(dst, cv.CV_8U);
  // *** is GRAY, RGB, or RGBA, according to src.channels() is 1, 3 or 4.
  cv.cvtColor(dst, dst, cv.COLOR_RGB2RGBA);
  imgData = new ImageData(new Uint8ClampedArray(dst.data), dst.cols, dst.rows);

  ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasElement.width = imgData.width;
  canvasElement.height = imgData.height;
  console.log(imgData.width, imgData.height, canvasElement.width, canvasElement.height, imgData);
  ctx.putImageData(imgData, 0, 0);

}
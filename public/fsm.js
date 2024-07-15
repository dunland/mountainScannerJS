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
  // data.getNextImage();
  console.log(data.values);

  console.log(`dataHandler.values.length: ${data.values.length}`);
  console.log("FullscreenImage.width", document.getElementById('FullscreenImage').width);

  canvas.drawHorizontalLine(scanner.upperLine);
  canvas.drawHorizontalLine(scanner.lowerLine);

  // await canvas.drawValueLine(data.values);
  // scanner.moveRegion();
  // canvas.animate();

})

addEventListener("keydown", onKeyDown);

window.addEventListener('load', () => { // run when all code is fully loaded
  console.log("openCV loaded!");
  canvas.animate();
});

class FSM {

  stateIdx = 0;

  states = [
    {
      name: "imgThreshold",
      init: () => {
        document.querySelector('#info').textContent = "";
      },
      leave: () => { }
    },
    {
      name: 'midiCC',
      init: () => {
        document.querySelector('#info').textContent = Midi.cc;
            },
      leave: () => { },
      up: () => {
        Midi.cc = (Midi.cc + 1) % 128;
        document.querySelector('#info').textContent = Midi.cc;
        return Midi.cc;
      },
      down: () => {
        Midi.cc -= 1;
        if (Midi.cc < 0)
          Midi.cc = 127;
        document.querySelector('#info').textContent = Midi.cc;
        return Midi.cc;
      },
    }, {

      name: 'upperLine',
      init: () => {
        document.querySelector('#info').textContent = scanner.upperLine;
      },
      leave: () => { },
      up: () => {
        scanner.upperLine -= 1;
        canvas.drawHorizontalLine(scanner.upperLine)
        return scanner.upperLine;
      },
      down: () => {
        scanner.upperLine += 1;
        canvas.drawHorizontalLine(scanner.upperLine)
        return scanner.upperLine;
      }

    }, {

      name: 'lowerLine',
      init: () => {
        document.querySelector('#info').textContent = scanner.lowerLine;
      },
      leave: () => { },
      up: () => {
        scanner.lowerLine -= 1;
        canvas.drawHorizontalLine(scanner.lowerLine);
        return scanner.lowerLine;

      },
      down: () => {
        scanner.lowerLine += 1;
        canvas.drawHorizontalLine(scanner.lowerLine);
        return scanner.lowerLine;

      }
    }, {

      name: 'export',
      init: () => {
        document.querySelector('#info').textContent = '';
      },
      leave: () => { }
    },
    {
      name: 'nextImage',
      init: () => {
        document.querySelector('#info').textContent = data.imagePath;
      },
      leave: () => {
        data.getNextImage();
        canvas.clearCanvas();
        if (canvas.showData) canvas.drawValueLine(data.values);
      }
    }

  ]

  state = this.states[this.stateIdx];

  constructor() {
    console.log(`state=${this.state.name}, stateIdx=${this.stateIdx}, states=${this.states}`);
  }

  /**
   * go to next state and run init function
   */
  next() {
    this.state.leave();
    this.stateIdx = (this.stateIdx + 1) % this.states.length;
    this.setState(this.states[this.stateIdx]);
    this.state.init();
  }

  /**
   * go to previous state and run init function
   */
  previous() {
    this.state.leave();
    this.stateIdx -= 1;
    if (this.stateIdx < 0)
      this.stateIdx = this.states.length - 1;
    this.setState(this.states[this.stateIdx]);
    this.state.init();
  }

  /**
   * go to next state without calling leave()
   */
  skip() {
    this.stateIdx = (this.stateIdx + 1) % this.states.length;
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
}

export const fsm = new FSM();

function loadOpenCv() {

  console.log("openCV loaded!");

  console.assert(cv, "cv is", cv);

  let htmlCanvas = document.getElementById("canvas");
  let imgElement = document.querySelector("#FullscreenImage");
  let ctx = htmlCanvas.getContext('2d');
  ctx.drawImage(imgElement, 0, 0);
  console.assert(ctx, "ctx is", ctx);

  // read from canvas:
  let imgData = ctx.getImageData(0, 0, htmlCanvas.width, htmlCanvas.height);
  console.assert(imgData, "no imgData", imgData);
  let src = cv.matFromImageData(imgData);
  let dst = new cv.Mat();
  // scale and shift are used to map the data to [0, 255].
  src.convertTo(dst, cv.CV_8U);
  // *** is GRAY, RGB, or RGBA, according to src.channels() is 1, 3 or 4.
  cv.cvtColor(dst, dst, cv.COLOR_RGB2RGBA);
  imgData = new ImageData(new Uint8ClampedArray(dst.data), dst.cols, dst.rows);

  ctx.clearRect(0, 0, htmlCanvas.width, htmlCanvas.height);
  htmlCanvas.width = imgData.width;
  htmlCanvas.height = imgData.height;
  console.log(imgData.width, imgData.height, htmlCanvas.width, htmlCanvas.height, imgData);
  ctx.putImageData(imgData, 0, 0);

}
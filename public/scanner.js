import { onKeyDown } from "./UserInteraction.js";
import { WebMidi } from "./webmidi/dist/esm/webmidi.esm.js";

var values = [];
var centerX = 0;
// import { WebMidi } from "./webmidi/dist/iife/webmidi.iife";
var mySynth;
export var moveSpeed = 10;
export function changeMoveSpeed(newSpeed){ 
  moveSpeed = newSpeed
  console.log("moveSpeed = ", moveSpeed);
};
// ---------------- Script wrapper: ------------------
document.addEventListener("DOMContentLoaded", () => {

  loadJSON("./data.json");

  console.log(values);

  // moveRegion(values);

})

addEventListener("keydown", onKeyDown);

// ------------------- functions: --------------------
function moveRegion(values) {

  let position = 0, regionWidth = 20;
  const screenWidth = window.innerWidth;
  console.log(innerWidth, screenWidth);

  function animate() {
    position += moveSpeed;
    centerX = position + regionWidth / 2;
    if (position > screenWidth) {
      position = -regionWidth; // Reset the position when the region moves out of the screen
    } else if (position < 0){
      position = screenWidth;
    }

    const index = Math.floor((centerX / screenWidth) * values.length);
    const value = values[index % values.length];
    const valueAsMidi = 127 - (value / 1080 * 127);
    displayValue(centerX, value);

    // console.log(`value ${value} as midi: ${ 127 - (value/1080 * 127)}`);
    if (mySynth)
      mySynth.sendControlChange(44, valueAsMidi);
    // WebMidi.outputs[1].sendNoteOn(127 - (value/1080 * 127));

    const movingRegion = document.querySelector('.moving-region');
    movingRegion.style.left = position + 'px';
    let xpos = screenWidth - position;
    movingRegion.style.backgroundPosition = `${xpos}px 0px`;
    requestAnimationFrame(animate);
  }

  animate();
}

// TODO: Function to invert the pixels of the underlying image
function invertImage() {
  const fullscreenImage = document.querySelector('.fullscreen-image');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = fullscreenImage.width;
  canvas.height = fullscreenImage.height;

  ctx.drawImage(fullscreenImage, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i]; // Invert the red channel
    data[i + 1] = 255 - data[i + 1]; // Invert the green channel
    data[i + 2] = 255 - data[i + 2]; // Invert the blue channel
    // Alpha channel (data[i + 3]) is unchanged
  }

  ctx.putImageData(imageData, 0, 0);
  // fullscreenImage.src = canvas.toDataURL(); // Update the image with inverted pixels
  // TODO:
  // movingRegion.style.backgroundImage = imageData;
}

function displayValue(x, y) {

  const valueElement = document.querySelector('.value-display');

  // Update the position and content of the value display
  valueElement.style.left = x + 15 + 'px';
  valueElement.style.top = y - 15 + 'px';
  valueElement.textContent = '___' + y;
}


async function loadJSON(dataFile) {

  const response = await fetch(dataFile)
    .then((res) => res.json())
    .then((data) => {
      values = data.values;
      console.log(values);

      try {

        // Enable WEBMIDI.js and trigger the onEnabled() function when ready
        WebMidi
          .enable()
          .then(() => {
            // Display available MIDI input devices
            if (WebMidi.inputs.length < 1) {
              document.body.innerHTML += "No device detected.";
            } else {
              WebMidi.inputs.forEach((device, index) => {
                console.log("Midi Inputs:" + `${index}: ${device.name}`);
              });

              // mySynth = WebMidi.inputs[0];
              // const mySynth = WebMidi.getInputByName("TYPE NAME HERE!")
            }

            if (WebMidi.outputs.length < 1) {
              console.log("no output devices detected.");
            }
            else {
              console.log("Midi Outputs:");
              WebMidi.outputs.forEach((device, index) => {
                console.log(`${index}: ${device.name}`);
              });

              // mySynth = WebMidi.outputs[1];
              mySynth = WebMidi.getOutputByName("USB MIDI Interface MIDI 1");
            }

          }) // init output synth
          .then(() => {
            console.log(values);
            moveRegion(values);
          })
          .catch(err => alert(err));

        console.log(WebMidi.inputs);
      } catch (error) {
        console.error("could not initialize MIDI.", error);
      }

    })
    .catch(error => {
      console.error("Error loading ./data.json! (Maybe try a different browser)", error);
    })


  moveRegion(values);

}
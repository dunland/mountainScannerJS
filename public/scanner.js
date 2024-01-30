var values, centerX;
// import { WebMidi } from "./webmidi/dist/iife/webmidi.iife";
import { WebMidi } from "./webmidi/dist/esm/webmidi.esm.js";
var mySynth;
// ---------------- Script wrapper: ------------------
document.addEventListener("DOMContentLoaded", () => {

  fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
      values = data.values;

      // Enable WEBMIDI.js and trigger the onEnabled() function when ready
      WebMidi
        .enable()
        .then(onEnabled)
        // .catch(err => alert(err));
        .then(() => {
          moveRegion();
        })


      // Function triggered when WEBMIDI.js is ready
      function onEnabled() {

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
      }

      console.log(WebMidi.inputs);

    })

  // ------------------- functions: --------------------
  function moveRegion() {

    let position = 0, regionWidth = 20;
    const screenWidth = window.innerWidth;
    console.log(innerWidth, screenWidth);
    const moveSpeed = 50; // Adjust the speed of the moving region

    function animate() {
      position += moveSpeed;
      centerX = position + regionWidth / 2;
      if (position > screenWidth) {
        position = -regionWidth; // Reset the position when the region moves out of the screen
      }

      const index = Math.floor((centerX / screenWidth) * values.length);
      const value = values[index % values.length];
      const valueAsMidi = 127 - (value/1080 * 127);
      displayValue(centerX, value);

      // console.log(`value ${value} as midi: ${ 127 - (value/1080 * 127)}`);
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
})
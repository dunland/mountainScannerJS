import { onKeyDown } from "./UserInteraction.js";
import { drawValueLine } from "./canvas.js";
import { getNextImage, values } from "./data.js";
import { loadWebMidi } from "./webMidi.js";

var centerX = 0; // center of movingRegion
var mySynth;
export var moveSpeed = 2;
export function changeMoveSpeed(newSpeed) {
  moveSpeed = newSpeed
  console.log("moveSpeed = ", moveSpeed);
};
// ---------------- Script wrapper: ------------------
document.addEventListener("DOMContentLoaded", async () => {

  loadWebMidi()
  getNextImage();
  console.log(values);

  console.log(`values.length: ${values.length}`);
  console.log("FullscreenImage.width", document.getElementById('FullscreenImage').width);

  await drawValueLine();
  moveRegion();

})

addEventListener("keydown", onKeyDown);

// ------------------- functions: --------------------
function moveRegion() {

  const fullscreenImage = document.getElementById("FullscreenImage");
  let position = 0, regionWidth = 20, displacement = fullscreenImage.width - innerWidth;
  console.log(`displacement: ${displacement}`);
  const screenWidth = window.innerWidth;
  console.log(`innerWidth: ${innerWidth}, screenWidth: ${screenWidth}`);

  function animate() {
    position += moveSpeed;
    centerX = position + regionWidth / 2;
    if (position > screenWidth) {
      position = -regionWidth; // Reset the position when the region moves out of the screen
    } else if (position < 0 && moveSpeed < 0) {
      position = screenWidth;
    }

    const index = Math.floor((centerX / fullscreenImage.width) * values.length);
    // console.log(index);
    var value = values[index];
    const valueAsMidi = 127 - (value / 1080 * 127);
    displayValue(centerX, value, index);

    // console.log(`value ${value} as midi: ${ 127 - (value/1080 * 127)}`);
    if (mySynth)
      mySynth.sendControlChange(44, valueAsMidi);
    // WebMidi.outputs[1].sendNoteOn(127 - (value/1080 * 127));

    const movingRegion = document.querySelector('#movingRegion');
    movingRegion.style.left = position + 'px';
    let xpos = screenWidth - position;
    movingRegion.style.backgroundPosition = `${xpos + displacement}px 0px`;
    requestAnimationFrame(animate);
  }

  animate();
}

function displayValue(x, y, index) {

  const valueElement = document.querySelector('.value-display');

  // Update the position and content of the value display
  valueElement.style.left = x + 15 + 'px';
  valueElement.style.top = y - 15 + 'px';
  valueElement.textContent = '___' + y + "\n" + index;
}
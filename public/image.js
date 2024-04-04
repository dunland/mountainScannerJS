import { clearCanvas, drawValueLine } from "./canvas.js";
import { remapInputValues, rawValues, values } from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
    // Initial setup
    resizeFullscreenImage();

    // Listen for window resize events
    window.addEventListener("resize", resizeFullscreenImage);
});

function resizeFullscreenImage() {

    // remap data:
    clearCanvas();
    remapInputValues(rawValues);
    drawValueLine();

    // resize bg:
    const fullscreenImage = document.querySelector('#FullscreenImage');
    const newWidth = fullscreenImage.innerWidth;
    movingRegion.style.backgroundSize = `${newWidth}px 20px`
}
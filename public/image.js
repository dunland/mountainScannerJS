import { data, canvas } from "./fsm.js";

document.addEventListener("DOMContentLoaded", () => {
    // Initial setup
    resizeFullscreenImage();

    // Listen for window resize events
    window.addEventListener("resize", resizeFullscreenImage);
});

function resizeFullscreenImage() {

    // remap data:
    canvas.clearCanvas();
    data.remapInputValues(data.rawValues);
    canvas.drawValueLine(data.values);

    // resize bg:
    const fullscreenImage = document.querySelector('#FullscreenImage');
    const newWidth = fullscreenImage.innerWidth;
    movingRegion.style.backgroundSize = `${newWidth}px 20px`
}
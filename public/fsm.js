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

  Midi.loadWebMidi()
  data.getNextImage();
  console.log(data.values);

  console.log(`dataHandler.values.length: ${data.values.length}`);
  console.log("FullscreenImage.width", document.getElementById('FullscreenImage').width);

  await canvas.drawValueLine(data.values);
  scanner.moveRegion();

})

addEventListener("keydown", onKeyDown);

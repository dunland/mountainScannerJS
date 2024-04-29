// import { values, rawValues } from "./scanner.js";
var currentImageIndex = -1;
export var values = [], rawValues = [];
var imagePath;
export async function loadJSON(dataFile) {

  const response = await fetch(dataFile)
    .then((res) => res.json())
    .then((data) => {
      imagePath = `silhouettes/${data.imagePath}`;
      console.log("get image", imagePath);
      rawValues = data.values;
      console.log("rawValues:", rawValues);
      remapInputValues(rawValues);
      console.log('remapped:', values);
    })
    .catch(error => {
      console.error("Error loading ./data.json! (Maybe try a different browser)", error);
    })
}

export function remapInputValues() {
  for (let index = 0; index < rawValues.length; index++) {
    values[index] = Math.round(rawValues[index] / 1080 * innerHeight);
  }
}

export async function getNextImage() {
  fetch('/silhouettes')
    .then(response => response.json())
    .then(async (silhouettes) => {
      // Use the list of valid file paths here
      currentImageIndex = (currentImageIndex + 1) % silhouettes.length;
      console.log(silhouettes);
      let currentImageData = silhouettes[currentImageIndex];
      console.log(
        `currentImageIndex:${currentImageIndex}, silhouettes: ${silhouettes}, currentImageData: ${currentImageData}`
      );

      await loadJSON(`silhouettes/${currentImageData}`);

      // movingRegion.style.backgroundImage = currentImageData;
      document.getElementById('FullscreenImage').src = imagePath;
    })
    .catch(error => {
      console.error('Error fetching valid files:', error);
    });
}
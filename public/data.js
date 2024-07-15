import { canvas } from "./fsm.js";
export class Data {

  currentImageIndex = -1;
  values = [];
  rawValues = [];
  imagePath;

  constructor() {
    // this.cv = window.cv;
    // console.log(cv);
    this.imgElement = document.querySelector("#FullscreenImage");
    this.mat;
    this.gray;
    this.binary;
    this.lowerThresh = 0, this.upperThresh = 255;
    this.inputFolder = 'public';
    this.outputFolder = 'public';
  }

  /**
   * 
   * @param {string} dataFile url to json file 
   */
  async loadJSON(dataFile) {

    const response = await fetch(dataFile)
      .then((res) => res.json())
      .then((jsonData) => {
        console.log(jsonData);
        this.imagePath = `silhouettes/${jsonData.imagePath}`;
        console.log("get image", this.imagePath);
        if (jsonData.values.length > 0) {
          this.rawValues = jsonData.values;
          console.log("rawValues:", this.rawValues);
          this.remapInputValues();
        }
        else {
          this.createEmptyValues();
          jsonData.values = this.values;
          this.updateJsonData(jsonData);
        }
      })
      .catch(error => {
        console.error("Error loading ./data.json! (Maybe try a different browser)", error);
      })
  }

  remapInputValues() {
    for (let index = 0; index < this.rawValues.length; index++) {
      this.values[index] = Math.round(this.rawValues[index] / 1080 * innerHeight);
    }
    console.log('remapped:', this.values);
  }

  createEmptyValues() {
    for (let index = 0; index < canvas.htmlCanvas.width; index++) {
      this.values[index] = canvas.htmlCanvas.height / 2;
    }
  }

  updateJsonData(jsonData) {
    console.log(jsonData);
    // Send JSON string to the server
    fetch('upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  async getNextImage() {
    fetch('/silhouettes')
      .then(response => response.json())
      .then(async (silhouettes) => {
        // Use the list of valid file paths here
        this.currentImageIndex = (this.currentImageIndex + 1) % silhouettes.length;
        console.log(silhouettes);
        let currentImageFile = silhouettes[this.currentImageIndex];
        let currentImageJson = `${currentImageFile.split(".")[0]}.json`
        console.log(
          `this.currentImageIndex:${this.currentImageIndex},
           silhouettes: ${silhouettes},
           currentImageFile: ${currentImageFile},
           currentImageJson: ${currentImageJson}`
        );

        await this.loadJSON(`silhouettes/${currentImageJson}`);

        /*
        // movingRegion.style.backgroundImage = currentImageData;
        this.imgElement = document.getElementById('FullscreenImage');
        this.imgElement.src = this.imagePath;

        // read from canvas:
        let imgData = ctx.getImageData(0, 0, htmlCanvas.width, htmlCanvas.height);
        console.assert(imgData, "no imgData", imgData);
        let src = cv.matFromImageData(imgData);
        let dst = new cv.Mat();
        */

      })
      .catch(error => {
        console.error('Error fetching valid files:', error);
      });
  }
}
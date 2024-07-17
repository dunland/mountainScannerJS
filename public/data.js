import { canvas } from "./fsm.js";
export class Data {

  currentImageIndex = -1;
  values = [];
  rawValues = [];
  imagePath;

  constructor() {
    this.imgElement = document.querySelector("#FullscreenImage");

    this.img;
    this.gray
    this.binary;
    this.tempValues = []; // temporary array for black pixels for image processing -> will be written to values when leaving state "export"
    this.lowerThresh = 255;
    this.upperThresh = 66;
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

  /**
   * remap values from 1080 px height to innerHeight
   */
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

  /**
   * update json data of image and post to server
   * @param {*} jsonData JSON object
   */
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
      })
      .catch(error => {
        console.error('Error fetching valid files:', error);
      });
  }

  updateImageThreshold() {

    cv.cvtColor(this.img, this.gray, cv.COLOR_RGBA2GRAY);
    cv.threshold(this.gray, this.binary, this.upperThresh, this.lowerThresh, cv.THRESH_BINARY);
    this.imgData = this.binary;
  }

  // Function to process the image and export the JSON file
  processImage() {

    console.log("process");
    if (!this.binary) return;
    // Process the binary image and store the results in an array
    this.tempValues = [];
    for (let col = 0; col < this.binary.cols; col++) {
      let foundBlack = false;
      for (let row = 0; row < this.binary.rows; row++) {
        if (this.binary.ucharPtr(row, col)[0] === 0) {
          this.tempValues.push(row);
          foundBlack = true;
          break;
        }
      }
      if (!foundBlack) {
        this.tempValues.push(0);
      }
    }
  }
}

import { canvas, fsm } from "./fsm.js";
import { Scanner } from "./scanner.js";
export class Data {

  constructor() {
    this.fullScreenImage;

    this.img;
    this.gray
    this.binary;

    this.silhouettes = []; // list of images on server. will be retrieved upon getNextImage()
    this.silhouettesElements = []; // list of DOM silhouette image elements
    this.scanners = {}; // list of scanners - one scanner for each image.
    this.activeScanners = []; // lists only active scanners
    this.values = [];
    this.currentImageIndex = -1;
    this.rawValues = [];
    this.imagePath;

    this.tempValues = []; // temporary array for black pixels for image processing -> will be written to values when leaving state "export"
    this.lowerThresh = 255;
    this.upperThresh = 66;
    this.inputFolder = 'public';
    this.outputFolder = 'public';
  }

  /**
   * read the data from image json
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
          this.values = jsonData.values;
          // console.log("rawValues:", this.rawValues);
          // this.values = this.remapInputValues(jsonData.values, 1080);
        }
        else {
          this.createEmptyValues();
          jsonData.values = this.values;
          console.log(jsonData);
          this.postJsonData(jsonData);
        }
      })
      .catch(error => {
        console.error("Error loading .json! (Maybe try a different browser)", error);
      })
  }

  /**
   * remap values from 1080 px height to innerHeight
   */
  remapInputValues(rawValues, height) {
    const mappedValues = [];
    for (let index = 0; index < rawValues.length; index++) {
      mappedValues[index] = Math.round(rawValues[index] / height * innerHeight);
    }

    return mappedValues;
    // console.log('remapped:', this.values);
  }

  createEmptyValues() {
    for (let index = 0; index < canvas.htmlCanvas.width; index++) {
      this.values[index] = canvas.htmlCanvas.height / 2;
    }
  }

  /**
   * returns a json object with imagePath and values as required for silhouettes
   */
  composeJson() {
    console.log(this.imagePath);
    const jsonData = {
      "imagePath": this.imagePath.split("/")[1], // get rid of 'silhouettes/'
      "values": this.values
      // TODO upperLine, lowerLine
    }
    return jsonData;
  }

  /**
   * update json data of image and post to server
   * @param {*} jsonData JSON object
   */
  postJsonData(jsonData) {
    // console.log(jsonData);
    // console.log(JSON.stringify(jsonData));
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

  /**
   * get list of files stored in public/silhouettes and store it in silhouettesElements
   */
  async fetchSilhouettes() {
    try {
      const response = await fetch('/silhouettes');
      const silhouettes = await response.json();
      this.silhouettes = silhouettes;
      // console.log('this.silhouettes:', this.silhouettes);
      for (let index = 0; index < this.silhouettes.length; index++) {
          const img = document.createElement("img");
          img.src = `silhouettes/${this.silhouettes[index]}`;
          document.body.append(img);
          this.silhouettesElements.push(img);
          this.scanners[this.silhouettes[index]] = new Scanner();
          this.silhouettesElements[this.silhouettesElements.length - 1].style.display = 'None';
      }
  } catch (error) {
      console.error('Error fetching valid files:', error);
  }
  console.log('silhouettesElements:', this.silhouettesElements);
  }

  async getNextImage() {
    // Use the list of valid file paths here
    // increment image list index
    this.currentImageIndex = (this.currentImageIndex + 1) % this.silhouettes.length;
    let currentImageFile = this.silhouettes[this.currentImageIndex];

    console.log(this.currentImageIndex, currentImageFile, this.silhouettes);
    
    // get json
    let currentImageJsonFile = `${currentImageFile.split(".")[0]}.json`
    console.log(
      `this.currentImageIndex:${this.currentImageIndex},
           currentImageFile: ${currentImageFile},
           currentImageJson: ${currentImageJsonFile}`
    );

    // read image from html elements:
    this.img = cv.imread(this.silhouettesElements[this.currentImageIndex]);
    this.fullScreenImage = this.silhouettesElements[this.currentImageIndex];

    fsm.currentScanner = this.scanners[this.silhouettes[this.currentImageIndex]];

    await this.loadJSON(`silhouettes/${currentImageJsonFile}`);
  }

  updateImageThreshold() {

    cv.cvtColor(this.img, this.gray, cv.COLOR_RGBA2GRAY);
    cv.threshold(this.gray, this.binary, this.upperThresh, this.lowerThresh, cv.THRESH_BINARY);
  }

  /**
   * Function to process the image and export the JSON file
   */
  processImage() {

    console.log("process");
    console.assert(this.binary, "this.binary", this.binary);
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
    this.values = this.tempValues;
  }
}

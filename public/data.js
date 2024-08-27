import { canvas, fsm } from "./fsm.js";
import { Scanner } from "./scanner.js";
export class Data {

  constructor() {
    this.img;
    this.gray
    this.binary;

    this.allSilhouettes = []; // list of images on server. will be retrieved upon getNextImage()
    this.silhouettesElements = []; // list of DOM silhouette image elements
    this.scanners = []; // list containing all scanner objects
    this.activeScanners = []; // lists only active scanners
    this.currentScannerIndex = -1;
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
  async fetchJSON(dataFile) {

    const response = await fetch(dataFile)
      .then((res) => res.json())
      .then((jsonData) => {
        console.log(jsonData);
        this.imagePath = `silhouettes/${jsonData.imagePath}`;
        console.log("get image", this.imagePath);
        if (jsonData.values.length > 0) {
          fsm.currentScanner.values = jsonData.values;
          // console.log("rawValues:", this.rawValues);
          // fsm.currentScanner.values = this.remapInputValues(jsonData.values, 1080);
        }
        else {
          this.createEmptyValues();
          jsonData.values = fsm.currentScanner.values;
          console.log(jsonData);
          this.postJsonData(jsonData);
        }
      })
      .catch(error => {
        console.error("Error loading .json! (Maybe try a different browser)", error);
      })

    console.log(fsm.currentScanner.values);
    console.log(`fsm.currentScanner.values.length: ${fsm.currentScanner.values.length}`);
  }

  /**
   * remap values from 1080 px height to innerHeight
   */
  remapInputValues(rawValues, height) {
    const mappedValues = [];
    for (let index = 0; index < rawValues.length; index++) {
      mappedValues[index] = Math.round(rawValues[index] / height * window.innerHeight);
    }

    return mappedValues;
    // console.log('remapped:', fsm.currentScanner.values);
  }

  createEmptyValues() {
    for (let index = 0; index < canvas.htmlCanvas.width; index++) {
      fsm.currentScanner.values[index] = canvas.htmlCanvas.height / 2;
    }
  }

  /**
   * returns a json object with imagePath and values as required for silhouettes
   */
  composeJson() {
    console.log(this.imagePath);
    const jsonData = {
      "imagePath": this.imagePath.split("/")[1], // get rid of 'silhouettes/'
      "values": fsm.currentScanner.values
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
      .then(response => response.text())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  /**
   * get list of files stored in public/silhouettes and store the images as html elemtns (silhouettesElements)
   */
  async fetchSilhouettes() {
    try {
      const response = await fetch('/silhouettes');
      const silhouettes = await response.json();
      this.allSilhouettes = silhouettes;
      // console.log('this.silhouettes:', this.silhouettes);
      for (let index = 0; index < this.allSilhouettes.length; index++) {
        const img = document.createElement("img");
        img.src = `silhouettes/${this.allSilhouettes[index]}`;
        img.style.display = 'None';
        document.body.append(img);
        // img.width = window.innerWidth;
        // img.height = window.innerHeight;
        this.silhouettesElements.push(img);
        this.scanners[index] = new Scanner(img);
      }
    } catch (error) {
      console.error('Error fetching valid files:', error);
    }
    console.log('silhouettesElements:', this.silhouettesElements);
  }

  /**
   * get next image from silhouettesElements list and update fsm.currentScanner
   * @param {bool} fetchJSON if true, JSON file is retrieved from server.
   */
  async getNextImage(fetchJSON = true) {
    console.log('retrieving next image..');
    // Use the list of valid file paths here
    // increment image list index
    let idx = (this.scanners.indexOf(fsm.currentScanner) + 1) % this.scanners.length;
    fsm.currentScanner = this.scanners[idx];

    // get json
    let currentImageJsonFile = `${fsm.currentScanner.imgElement.src.split(".")[0]}.json`
    console.log(
      `idx:${idx},
           fsm.currentScanner.imgElement.src: ${fsm.currentScanner.imgElement.src},
           currentImageJsonFile: ${currentImageJsonFile}`
    );

    // read image from html elements:
    this.rawImg = cv.imread(fsm.currentScanner.imgElement);
    const dSize = new cv.Size(window.innerWidth, window.innerHeight);
    this.img = new cv.Mat();
    cv.resize(this.rawImg, this.img, dSize, cv.INTER_LINEAR);

    if (fetchJSON)
      await this.fetchJSON(currentImageJsonFile);
  }

  /**
   * create gray and binary image with current setting
   */
  updateImageThreshold() {
    cv.cvtColor(this.img, this.gray, cv.COLOR_RGBA2GRAY);
    cv.threshold(this.gray, this.binary, this.upperThresh, this.lowerThresh, cv.THRESH_BINARY);
  }

  /**
   * find black pixels and create data array
   */
  findBlackPixels() {

    console.log("process");
    console.assert(this.binary, "this.binary", this.binary);
    if (!this.binary) return;
    // Process the binary image and store the results in an array
    this.tempValues = [];
    for (let col = 0; col < this.binary.cols; col++) {
      let foundBlack = false;
      for (let row = fsm.currentScanner.upperLine; row < fsm.currentScanner.lowerLine; row++) {
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
    fsm.currentScanner.values = this.tempValues;
  }
}

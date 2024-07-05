export class Data {

  currentImageIndex = -1;
  values = [];
  rawValues = [];
  imagePath;

  async loadJSON(dataFile) {

    const response = await fetch(dataFile)
      .then((res) => res.json())
      .then((jsonData) => {
        this.imagePath = `silhouettes/${jsonData.imagePath}`;
        console.log("get image", this.imagePath);
        this.rawValues = jsonData.values;
        console.log("rawValues:", this.rawValues);
        this.remapInputValues(this.rawValues);
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

  async getNextImage() {
    fetch('/silhouettes')
      .then(response => response.json())
      .then(async (silhouettes) => {
        // Use the list of valid file paths here
        this.currentImageIndex = (this.currentImageIndex + 1) % silhouettes.length;
        console.log(silhouettes);
        let currentImageData = silhouettes[this.currentImageIndex];
        console.log(
          `this.currentImageIndex:${this.currentImageIndex}, silhouettes: ${silhouettes}, currentImageData: ${currentImageData}`
        );

        await this.loadJSON(`silhouettes/${currentImageData}`);

        // movingRegion.style.backgroundImage = currentImageData;
        document.getElementById('FullscreenImage').src = this.imagePath;
      })
      .catch(error => {
        console.error('Error fetching valid files:', error);
      });
  }
}
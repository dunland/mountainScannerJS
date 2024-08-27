# mountainScannerJS

- nodeJS needed for the `requestAnimationFrame` function
- [midijs library](https://webmidijs.org/docs/) works on Google Chrome only!

## run

- `npm start` to just start
- `npm run server` to start & keep track of code changes (dev mode)

## To Do

- **functions**:
- [ ] scanners have different colors - active scanner with inverted image?
- [ ] speichere imageProcessing-Voreinstellungen für Bilder
- [ ] nanoKontrol
- [ ] change data x when resizing image
- [ ] hide mouse when fullscreen application
- **refactoring**:
- [ ]`fsm functions as dict`:
     `fsm.state[keyEvent.key]();`
- **Zukunftsmusik**
- [ ] `npm run random` to shuffle images
- [ ] multiple lines per image for different thresholds
- [ ] navigation using arrow keys and sub-menus
- [ ] parallel displays
- [ ] weitere cv-Verarbeitungsmöglichkeiten: calman filter, ...

## Usage

- Alle Bilddateien jpeg/jpg/png im Ordner ./silhouettes/ werden gesichtet. Falls nicht vorhanden, wird für jedes Bild eine zugehörige .json-Datei mit einem leeren Array für `values` erzeugt.
- Beim erstmaligen Laden dieses Arrays werden alle Werte auf `canvas.height / 2` gesetzt

## Log
27.08.2024
- [x] **bug**: scan on/off malt linie doppelt, nach imageProcessing!
- [x] globale upper+lower thresholds
22.08.2024
- [x] switch (active) scanners using TAB
19.08.2024
- [x] only enter "processImage" upon space bar

30.07.2024
fsm: opencvloaded:
1. await data.fetchSilhouettes
  1. `document.body.append(img)` ✓
  2. `this.silhouettesElements.push(img)`
2. await data.getNextImage

28.07.2024
- **Problem: `cv.imread` funktioniert nur mit Bild aus DOM -> Alternative Bild aus ctx laden!**

27.07.2024
- [ ] getNextImage lädt Bild nicht ? 
- [ ] Resize image: `cv.resize`

**image loading**:
1. getNextImage (fetch silhouettes)
  1. data.currentImageIndex++
  2. update data.imgElement.src
  3. 

18.07.2024
- [x] leave state "export" -> create jsonObject and POST to server
17.07.2024
- [x] `updateImageThreshold`: create json-data-array of first black pixel:

``` javascript
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
```

15.07.2024
  - [x] animation loop for entire canvas in one function

XX.XX.XXXX
- [x] change states consecutively using ENTER
- [x] adjustable speed
  - [x] +/-
- [x] load more images

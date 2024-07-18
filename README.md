# mountainScannerJS

- nodeJS needed for the `requestAnimationFrame` function
- [midijs library](https://webmidijs.org/docs/) works on Google Chrome only!

## run

- `npm start` to just start
- `npm run server` to start & keep track of code changes (dev mode)

## To Do

- **data preprocessing:**
- [ ] invert image
- **functions**:
- [ ] multiple lines per image for different thresholds
- **usability**:
- [ ] only enter "processImage" upon special key
- [ ] nanoKontrol
- [ ] change data x when resizing image
- [ ] hide mouse when fullscreen application
- [ ] Enter: state actuation; Tab: skip to next state
- **Zukunftsmusik**
- [ ] parallel displays
- [ ] weitere cv-Verarbeitungsmöglichkeiten: calman filter, ...

## Usage

- Alle Bilddateien jpeg/jpg/png im Ordner ./silhouettes/ werden gesichtet. Falls nicht vorhanden, wird für jedes Bild eine zugehörige .json-Datei mit einem leeren Array für `values` erzeugt.
- Beim erstmaligen Laden dieses Arrays werden alle Werte auf `canvas.height / 2` gesetzt

## Log
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

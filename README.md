# mountainScannerJS

- nodeJS needed for the `requestAnimationFrame` function
- [midijs library](https://webmidijs.org/docs/) works on Google Chrome only!

## run

- `npm start` to just start
- `yarn server` to start & keep track of code changes (dev mode)

## To Do

- [ ] animation loop for entire canvas in one function
- [ ] verbose display box
- [x] adjustable speed
  - [x] +/-
  - [ ] nanoKontrol
- **data preprocessing:**
  - [ ] invert image
  - [ ] json creation
- **functions**:
  - [ ] multiple lines per image for different thresholds
- [ ] load more images
  - [x] consecutively using ENTER
  - [ ] parallel displays
- **usability**:
  - [ ] change data x when resizing image
  - [ ] hide mouse when fullscreen application

  ## Usage

  - Alle Bilddateien jpeg/jpg/png im Ordner ./silhouettes/ werden gesichtet. Falls nicht vorhanden, wird für jedes Bild eine zugehörige .json-Datei mit einem leeren Array für `values` erzeugt.
  - Beim erstmaligen Laden dieses Arrays werden alle Werte auf `canvas.height / 2` gesetzt
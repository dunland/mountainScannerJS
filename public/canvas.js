import { scanner, data } from "./fsm.js";

export class Canvas {

    showData = true;
    constructor() {

        this.htmlCanvas = document.getElementById("canvas");
        this.fullscreenImage = document.getElementById("FullscreenImage");
        this.ctx = this.htmlCanvas.getContext("2d");

        this.htmlCanvas.width = this.fullscreenImage.width;
        this.htmlCanvas.height = innerHeight;

        this.animate = this.animate.bind(this); // when a function is called as a callback (such as in requestAnimationFrame), the context (this) is lost unless explicitly bound.

    }

    async drawValueLine(values) {
        // console.log("Drawing red data line to canvas.height:", this.htmlCanvas.height, "canvas.width:", this.htmlCanvas.width);
        this.ctx.strokeStyle = "red";
        this.ctx.beginPath();
        this.ctx.moveTo(0, values[0]);

        for (let index = 0; index < values.length; index++) {
            const value = values[index];
            this.ctx.lineTo(Math.floor(index / values.length * this.fullscreenImage.width), value, 1, 1);
        }
        this.ctx.stroke();
    }

    clearCanvas() {
        this.htmlCanvas.getContext("2d").clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
    }

    drawHorizontalLine(yPos) {
        this.ctx.strokeStyle = "red";
        this.ctx.beginPath();
        this.ctx.moveTo(0, yPos);
        this.ctx.lineTo(this.fullscreenImage.width, yPos);
        this.ctx.stroke();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);

        // read from canvas:
        // let imgData = this.ctx.getImageData(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
        // console.assert(imgData, "no imgData", imgData);
        // let src = cv.matFromImageData(imgData);
        // let dst = new cv.Mat();
        // // scale and shift are used to map the data to [0, 255].
        // src.convertTo(dst, cv.CV_8U);
        // // *** is GRAY, RGB, or RGBA, according to src.channels() is 1, 3 or 4.
        // cv.cvtColor(dst, dst, cv.COLOR_RGB2RGBA);
        // imgData = new ImageData(new Uint8ClampedArray(dst.data), dst.cols, dst.rows);

        // this.ctx.clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
        // this.htmlCanvas.width = imgData.width;
        // this.htmlCanvas.height = imgData.height;
        // console.log(imgData.width, imgData.height, this.htmlCanvas.width, this.htmlCanvas.height, imgData);
        // this.ctx.putImageData(imgData, 0, 0);

        this.drawHorizontalLine(scanner.upperLine);
        this.drawHorizontalLine(scanner.lowerLine);
        this.drawValueLine(data.values)
        scanner.moveRegion()
        requestAnimationFrame(this.animate);

    }
}
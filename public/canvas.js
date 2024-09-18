import { data, fsm } from "./fsm.js";

export class Canvas {

    showData = true; // toggle using 'v'
    constructor() {

        this.htmlCanvas = document.getElementById("canvas");
        this.ctx = this.htmlCanvas.getContext("2d");

        this.htmlCanvas.width = window.innerWidth;
        this.htmlCanvas.height = window.innerHeight;

        console.log(`htmlCanvas: ${this.htmlCanvas.width} x ${this.htmlCanvas.height} px`);

        this.animate = this.animate.bind(this); // when a function is called as a callback (such as in requestAnimationFrame), the context (this) is lost unless explicitly bound.

    }

    drawValueLine(scanner) {

        // console.log("Drawing red data line to canvas.height:", this.htmlCanvas.height, "canvas.width:", this.htmlCanvas.width);
        this.ctx.strokeStyle = scanner.color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, scanner.values[0]);

        for (let index = 0; index < scanner.values.length; index++) {
            const value = scanner.values[index];
            this.ctx.lineTo(Math.floor(index / scanner.values.length * window.innerWidth), value, 1, 1);
        }
        this.ctx.stroke();
    }

    /**
     * simple function to just clear the canvas by drawing a white rectangle
     */
    clearCanvas() {
        this.htmlCanvas.getContext("2d").clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
    }

    drawHorizontalLine(yPos) {
        this.ctx.strokeStyle = "red";
        this.ctx.beginPath();
        this.ctx.moveTo(0, yPos);
        this.ctx.lineTo(innerWidth, yPos);
        this.ctx.stroke();
    }

    drawVerticalLine(scanner) {
        this.ctx.strokeStyle = scanner.color;
        this.ctx.beginPath();
        this.ctx.moveTo(scanner.centerX, 0);
        this.ctx.lineTo(scanner.centerX, window.innerHeight);
        this.ctx.stroke();
    }

    animate() {
        // this.ctx.clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
        if (fsm.processingModeOn) {
            cv.imshow('canvas', data.binary);
            this.drawHorizontalLine(fsm.currentScanner.upperLine);
            this.drawHorizontalLine(fsm.currentScanner.lowerLine);
        }
        else {
            // cv.imshow('canvas', data.img);
            let rowLimit = window.innerHeight - fsm.currentScanner.currentValue || 0;
            let y = fsm.currentScanner.currentValue || 0;
            let rect = new cv.Rect(fsm.currentScanner.centerX, y, 1, rowLimit);
            let columnROI = data.img.roi(rect);

            // Create an empty output matrix to hold the current column
            if (!data.compositeImage)
                data.compositeImage = new cv.Mat.zeros(data.img.rows, data.img.cols, data.img.type());

            // Copy the ROI (column) to the output at the correct location
            columnROI.copyTo(data.compositeImage.roi(rect));

            // Draw the current output on the canvas
            cv.imshow('canvas', data.compositeImage);

            columnROI.delete();
        }

        for (let index = 0; index < data.activeScanners.length; index++) {
            const scanner = data.activeScanners[index];
            if (!(scanner == fsm.currentScanner && fsm.processingModeOn)) {
                scanner.moveRegion();
                this.drawVerticalLine(scanner);
                if (this.showData) this.drawValueLine(scanner);
            }
        }
        fsm.currentScanner.displayValue();
        requestAnimationFrame(this.animate);
    }
}
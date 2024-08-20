import { data, fsm } from "./fsm.js";

export class Canvas {

    showData = true; // toggle using 'v'
    constructor() {

        this.htmlCanvas = document.getElementById("canvas");
        this.ctx = this.htmlCanvas.getContext("2d");

        this.htmlCanvas.width = innerWidth;
        this.htmlCanvas.height = innerHeight;

        this.animate = this.animate.bind(this); // when a function is called as a callback (such as in requestAnimationFrame), the context (this) is lost unless explicitly bound.

    }

    drawValueLine(scanner) {

        // console.log("Drawing red data line to canvas.height:", this.htmlCanvas.height, "canvas.width:", this.htmlCanvas.width);
        this.ctx.strokeStyle = scanner.color;
        this.ctx.beginPath();
        this.ctx.moveTo(0, scanner.values[0]);

        for (let index = 0; index < scanner.values.length; index++) {
            const value = scanner.values[index];
            this.ctx.lineTo(Math.floor(index / scanner.values.length * data.fullScreenImage.width), value, 1, 1);
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
        this.ctx.lineTo(data.fullScreenImage.width, yPos);
        this.ctx.stroke();
    }

    drawVerticalLine(scanner) {
        this.ctx.strokeStyle = scanner.color;
        this.ctx.beginPath();
        this.ctx.moveTo(scanner.centerX, 0);
        this.ctx.lineTo(scanner.centerX, data.fullScreenImage.height);
        this.ctx.stroke();
    }

    animate() {
        if (fsm.processingModeOn) {
            if (!data.binary) {
                console.assert(data.binary, "data.binary", data.binary);
                return
            }
            this.ctx.clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
            cv.imshow('canvas', data.binary);
            this.drawValueLine(fsm.currentScanner.values);
            // this.drawHorizontalLine(scanner.upperLine);
            // this.drawHorizontalLine(scanner.lowerLine);    
            requestAnimationFrame(this.animate);
            return
        }

        this.ctx.clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
        this.ctx.drawImage(data.fullScreenImage, 0, 0);
        // cv.imshow('canvas', data.img)

        // this.drawHorizontalLine(scanner.upperLine);
        // this.drawHorizontalLine(scanner.lowerLine);
        for (let index = 0; index < data.activeScanners.length; index++) {
            const scanner = data.activeScanners[index];
            scanner.moveRegion();
            this.drawVerticalLine(scanner);
            if (this.showData) this.drawValueLine(scanner);
        }
        fsm.currentScanner.displayValue();
        requestAnimationFrame(this.animate);
    }
}
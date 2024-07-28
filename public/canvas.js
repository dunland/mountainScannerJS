import { scanner, data, fsm } from "./fsm.js";

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

    drawVerticalLine(xPos){
        this.ctx.strokeStyle = "red";
        this.ctx.beginPath();
        this.ctx.moveTo(xPos, 0);
        this.ctx.lineTo(xPos, this.fullscreenImage.height);
        this.ctx.stroke();
    }

    animate() {
        if (data.imgData && fsm.state.name == 'processImage') {
            cv.imshow('canvas', data.imgData);
            this.drawValueLine(data.tempValues);
            this.drawHorizontalLine(scanner.upperLine);
            this.drawHorizontalLine(scanner.lowerLine);    
            requestAnimationFrame(this.animate);
            return
        }

        this.ctx.clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
        this.ctx.drawImage(data.imgElement, 0, 0);

        this.drawHorizontalLine(scanner.upperLine);
        this.drawHorizontalLine(scanner.lowerLine);
        this.drawVerticalLine(scanner.position);
        if (this.showData) this.drawValueLine(data.values);
        scanner.moveRegion()
        requestAnimationFrame(this.animate);

    }
}
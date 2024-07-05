export class Canvas {
    
    showData = true;
    constructor(){

        this.htmlCanvas = document.getElementById("canvas");
        this.fullscreenImage = document.getElementById("FullscreenImage");
        
        this.htmlCanvas.width = this.fullscreenImage.width;
        this.htmlCanvas.height = innerHeight;
    }

    async drawValueLine(values) {
        console.log("Drawing red data line to canvas.height:", this.htmlCanvas.height, "canvas.width:", this.htmlCanvas.width);
        var ctx = this.htmlCanvas.getContext("2d");
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(0, values[0]);

        for (let index = 0; index < values.length; index++) {
            const value = values[index];
            ctx.lineTo(Math.floor(index / values.length * this.fullscreenImage.width), value, 1, 1);
        }
        ctx.stroke();
    }

    clearCanvas() {
        this.htmlCanvas.getContext("2d").clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
    }
}
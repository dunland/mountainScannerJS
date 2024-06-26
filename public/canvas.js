import { values } from "./data.js";
export var showData = true;
export function toggleShowData() { showData = !showData };

var canvas = document.getElementById("canvas");
const fullscreenImage = document.getElementById("FullscreenImage");

//Then you can draw a point at (10,10) like this:
var ctx = canvas.getContext("2d");
canvas.width = fullscreenImage.width;
canvas.height = innerHeight;

export async function drawValueLine() {
    var canvas = document.getElementById("canvas");
    console.log("canvas.height:", canvas.height, "canvas.width:", canvas.width);
    var ctx = canvas.getContext("2d");
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(0, values[0]);
    
    
    for (let index = 0; index < values.length; index++) {
        const value = values[index];
        ctx.lineTo(Math.floor(index / values.length * fullscreenImage.width), value, 1, 1);
    }
    ctx.stroke();
}

export function clearCanvas(){
    canvas.getContext("2d").clearRect(0,0,canvas.width, canvas.height);
}
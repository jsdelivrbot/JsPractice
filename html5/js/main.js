/**
 * main.js
 *
 * Created by xiepan on 16/8/29 15:45.
 */

// rect
var canvas = document.getElementById("canvas-rect");
var context = canvas.getContext("2d");
context.fillStyle = "#ff0000";
context.fillRect(0, 0, 150, 75);

// coordinates
function getCoordinates(e) {
    x = e.clientX;
    y = e.clientY;
    document.getElementById("xy-coordinates").innerHTML = "x:" + x + " y:" + y;
}

function clearCoordinates() {
    document.getElementById("xy-coordinates").innerHTML = "x: y:";
}

// line
var canvas = document.getElementById("canvas-line");
var context = canvas.getContext("2d");
context.moveTo(10, 10);
context.lineTo(150, 50);
context.lineTo(10, 50);
context.stroke();

// circle
var canvas = document.getElementById("canvas-circle");
var context = canvas.getContext("2d");
context.fillStyle = "#ff0000";
context.beginPath();
context.arc(70, 18, 15, 0, Math.PI * 2, true);
context.closePath();
context.fill();

// gradient
var canvas = document.getElementById("canvas-gradient");
var context = canvas.getContext("2d");
var gradient = context.createLinearGradient(0, 0, 175, 50);
gradient.addColorStop(0, "#ff0000");
gradient.addColorStop(1, "#00ff00");
context.fillStyle = gradient;
context.fillRect(0, 0, 175, 50);

// image
var canvas = document.getElementById("canvas-image");
var context = canvas.getContext("2d");
var image = new Image();
image.src = "http://www.w3school.com.cn/i/eg_flower.png";
context.drawImage(image, 0, 0);
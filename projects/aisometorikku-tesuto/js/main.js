var screenWidth;
var screenHeight;
var ctx;

function initialize(width, height) {
  screenWidth = width;
  screenHeight = height;
  ctx = document.getElementById('kambasu').getContext('2d');
  draw();
}

function draw() {
  ctx.clearRect (0 , 0 , screenWidth , screenHeight);
  var startTime = new Date().getTime();
  for(var i = 10; i >= 0; i--) {
    for(var j = 10; j >= 0; j--) {
      fillBox(i * 40, 0, j * 40, 40, Math.floor(Math.random() * 15 + 5)*8, 40, "#999999", generateRandomColor());
    }
  }
  var totalTime = new Date().getTime() - startTime;
  document.getElementById("time").innerHTML = "generated in " + totalTime + "ms";
}

function generateRandomColor() {
  return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
}

function drawBox(x, y, z, width, height, depth, color) {
  setLineStyle(1, color, 1);
  ctx.beginPath();
  
  isoMoveTo(x, y, z);
  isoLineTo(x + width, y, z);
  isoLineTo(x + width, y + height, z);
  isoLineTo(x, y + height, z);
  isoLineTo(x, y, z);
  
  isoMoveTo(x, y + height, z);
  isoLineTo(x + width, y + height, z);
  isoLineTo(x + width, y + height, z + depth);
  isoLineTo(x, y + height, z + depth);
  isoLineTo(x, y + height, z);
  
  isoMoveTo(x, y, z);
  isoLineTo(x, y + height, z);
  isoLineTo(x, y + height, z + depth);
  isoLineTo(x, y, z + depth);
  isoLineTo(x, y, z);
  
  ctx.stroke();
}

function fillBox(x, y, z, width, height, depth, color, fillColor) {
  ctx.fillStyle = fillColor;
  
  ctx.beginPath();
  
  isoMoveTo(x, y, z);
  isoLineTo(x + width, y, z);
  isoLineTo(x + width, y + height, z);
  isoLineTo(x, y + height, z);
  isoLineTo(x, y, z);
  
  isoMoveTo(x, y + height, z);
  isoLineTo(x + width, y + height, z);
  isoLineTo(x + width, y + height, z + depth);
  isoLineTo(x, y + height, z + depth);
  isoLineTo(x, y + height, z);
  
  isoMoveTo(x, y, z);
  isoLineTo(x, y + height, z);
  isoLineTo(x, y + height, z + depth);
  isoLineTo(x, y, z + depth);
  isoLineTo(x, y, z);
  
  ctx.fill();
  
  // draw outline
  drawBox(x, y, z, width, height, depth, color);
}

function transformXCoordinates(x, y, z) {
  var x = (x - z) * Math.cos(0.46365);
  return x + screenWidth / 2;
}

function transformYCoordinates(x, y, z) {
  var y = y + (x + z) * Math.sin(0.46365);
  return -y + screenHeight;
}

function isoMoveTo(x, y, z) {
  ctx.moveTo(transformXCoordinates(x, y, z), transformYCoordinates(x, y, z));
}

function isoLineTo(x, y, z) {
  ctx.lineTo(transformXCoordinates(x, y, z), transformYCoordinates(x, y, z));
}

function setLineStyle(width, color, alpha) {
  ctx.strokeStyle = "" + hexToRGBA(color, alpha);
  ctx.lineWidth = width;
}

function hexToRGBA(h, a) {
  h = cutHex(h);
  return "rgba(" + hexToR(h) + "," + hexToG(h) + "," + hexToB(h) + "," + a + ")";
}

function hexToR(h) {
  return parseInt(h.substring(0,2),16);
}

function hexToG(h) {
  return parseInt(h.substring(2,4),16);
}

function hexToB(h) {
  return parseInt(h.substring(4,6),16);
}

function cutHex(h) {
  return (h.charAt(0)=="#") ? h.substring(1,7):h;
}
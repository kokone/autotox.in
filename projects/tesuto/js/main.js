var grid;
var canvas;
var ctx;
var cellWidth, cellHeight;
var horizontal, vertical;
var gridOffsetX, gridOffsetY;

function initialize(width, height) {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawNumbers();
}

function drawGrid() {
  
}

function drawCell(x, y, color) {
  
}

function fillCell(x, y, color, stroke) {
  
}
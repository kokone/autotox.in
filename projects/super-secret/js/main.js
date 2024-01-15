var canvas;
var ctx;
var tileSize = 32;
var map;
var player;
var desiredFPS = 50;
var gameLoop;

function initialize() {
	canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');
  map = new Map(map1);
  player = new Player({x: 1, y: 10}, dittoSprites, 5);
  gameLoop = setInterval(gameLoop, 1000 / desiredFPS);
}

function gameLoop() {
  updateKeys();
  player.update();
  draw();
}
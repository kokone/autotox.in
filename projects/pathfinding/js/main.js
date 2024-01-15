var screenWidth;
var screenHeight;
var ctx;
var collisionMap = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 1, 1, 1],
  [1, 0, 1, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1]
];
var player = {
  position: {
    x: 2,
    y: 3
  }
}
var target = {
  position: {
    x: 6,
    y: 3
  }  
}

function initialize(width, height) {
  screenWidth = width;
  screenHeight = height;
  ctx = document.getElementById('canvas').getContext('2d');
  draw();
  var startTime = new Date().getTime();
  var finder = new astar(chebyshev);
  var grid = new Grid(collisionMap);
  var path = finder.findPath(player, target, grid);
  var totalTime = new Date().getTime() - startTime;
  document.getElementById("time").innerHTML = "generated in " + totalTime + "ms";
  console.log("duration: " + totalTime + "ms");
  for(var i = 0; i < path.length; i++) {
    highlightArea(path[i].position.x*30, path[i].position.y*30, 30, 30, "rgba(0,255,0,.3)");
  }
}

function draw() {
  ctx.clearRect (0 , 0 , screenWidth , screenHeight);
  ctx.strokeStyle = "#AAAAAA";
  ctx.fillStyle = "#AAAAAA";
  drawMap();
  drawPlayer(player.position.x * 30, player.position.y * 30, 30, 30);
  drawTarget(target.position.x * 30, target.position.y * 30, 30, 30);
}

function drawMap() {
  for(var height = 0; height < collisionMap.length; height++) {
    for(var width = 0; width < collisionMap[height].length; width++) {
      if(collisionMap[height][width] === 0)
        drawFloor(width*30, height*30, 30, 30);
      else if(collisionMap[height][width] === 1)
        drawWall(width*30, height*30, 30, 30);
    }
  }
}

function drawFloor(x, y, width, height) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x+width, y);
  ctx.lineTo(x+width, y+height);
  ctx.lineTo(x, y+height);
  ctx.lineTo(x, y);
  ctx.stroke();
}

function drawWall(x, y, width, height) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x+width, y);
  ctx.lineTo(x+width, y+height);
  ctx.lineTo(x, y+height);
  ctx.lineTo(x, y);
  ctx.fill();
}

function drawPlayer(x, y, width, height) {
  ctx.fillStyle = "#111111";
  ctx.fillRect(x, y, width, height);
}

function drawTarget(x, y, width, height) {
  ctx.fillStyle = "#800000";
  ctx.fillRect(x, y, width, height);
}

function highlightArea(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function setLineStyle(width, color, alpha) {
  ctx.strokeStyle = "" + hexToRGBA(color, alpha);
  ctx.lineWidth = width;
}
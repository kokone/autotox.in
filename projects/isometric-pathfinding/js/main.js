var screenWidth;
var screenHeight;
var ctx;
var collisionMap = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 1],
  [1, 0, 0, 0, 1, 1, 1, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 1, 1, 1],
  [1, 0, 0, 1, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 1, 1, 0, 1, 1],
  [1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
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
  var startTime = new Date().getTime();
  screenWidth = width;
  screenHeight = height;
  ctx = document.getElementById('canvas').getContext('2d');
  var finder = new astar(chebyshev);
  var grid = new Grid(collisionMap);
  var pathStartTime = new Date().getTime();
  var path = finder.findPath(player, target, grid);
  var pathTotalTime = new Date().getTime() - pathStartTime;
  drawMap(path, player, target);
  var totalTime = new Date().getTime() - startTime;
  var results = "path found in " + pathTotalTime + "ms<br>" + "page generated in " + totalTime + "ms";
  document.getElementById("time").innerHTML = results;
}

function draw() {
  ctx.clearRect (0 , 0 , screenWidth , screenHeight);
  ctx.strokeStyle = "#AAAAAA";
  ctx.fillStyle = "#AAAAAA";
  drawMap(new Array(), player, target);
}

function drawMap(path, player, target) {
  for(var height = collisionMap.length - 1; height >= 0 ; height--) {
    for(var width = collisionMap[height].length - 1; width >= 0 ; width--) {
      if(collisionMap[height][width] === 0) {
        drawBox(width*30, 0, height*30, 30, 0, 30, "#AAAAAA");
      } else if(collisionMap[height][width] === 1) {
        fillBox(width*30, 0, height*30, 30, 15, 30, "#AAAAAA");
        drawBox(width*30, 0, height*30, 30, 15, 30, "#444444");
      }
      for(var i = 0; i < path.length; i++) {
        if(path[i].position.x == width && path[i].position.y == height) highlightArea(path[i].position.x, path[i].position.y, 30, 30, "rgba(0,255,0,.3)");
      }
      if(player.position.x == width && player.position.y == height) drawPlayer(player.position.x, player.position.y, 30, 30);
      if(target.position.x == width && target.position.y == height) drawTarget(target.position.x, target.position.y, 30, 30);
    }
  }
}

function drawBox(x, y, z, width, height, depth, strokeColor) {
  ctx.strokeStyle = strokeColor;
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

function fillBox(x, y, z, width, height, depth, fillColor) {
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
}

function drawPlayer(x, y, width, height) {
  fillBox(x*width, 0, y*height, width, 30, height, "rgba(153,0,153,.8)");
  drawBox(x*width, 0, y*height, width, 30, height, "rgba(77,0,77,.8)");
}

function drawTarget(x, y, width, height) {
  fillBox(x*width, 0, y*height, width, 30, height, "rgba(128,0,0,.8)");
  drawBox(x*width, 0, y*height, width, 30, height, "rgba(52,0,0,.8)");
}

function highlightArea(x, y, width, height, color) {
  fillBox(width*x, 0, height*y, width, 0, height, color);
}

function transformXCoordinates(x, y, z) {
  var x = (x - z) * Math.cos(0.46365);
  return x + screenWidth / 2 + 100;
}

function transformYCoordinates(x, y, z) {
  var y = y + (x + z) * Math.sin(0.46365);
  return (-y + screenHeight);
}

function isoMoveTo(x, y, z) {
  ctx.moveTo(transformXCoordinates(x, y, z), transformYCoordinates(x, y, z));
}

function isoLineTo(x, y, z) {
  ctx.lineTo(transformXCoordinates(x, y, z), transformYCoordinates(x, y, z));
}

function setLineStyle(width, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
}
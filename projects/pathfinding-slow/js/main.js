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

Array.prototype.unique = function() {
  var a = this.concat();
  for(var i=0; i<a.length; ++i) {
    for(var j=i+1; j<a.length; ++j) {
      if(a[i] === a[j]) a.splice(j, 1);
    }
  }
  return a;
};

function initialize(width, height) {
  screenWidth = width;
  screenHeight = height;
  ctx = document.getElementById('canvas').getContext('2d');
  draw();
  var startTime = new Date().getTime();
  var path = findPath(player.position, target.position);
  var totalTime = new Date().getTime() - startTime;
  document.getElementById("time").innerHTML = "generated in " + totalTime + "ms";
  console.log("duration: " + totalTime + "ms");
  for(var i = 0; i < path.length; i++) {
    highlightArea(path[i].x*30, path[i].y*30, 30, 30, "rgba(0,255,0,.3)");
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

function findPath(start, target) {
  var closed = new Array();
  var open = [{
    position: start,
    g: 0,
    h: calculateEstimatedMovementCost(start, target)
  }];
  var currentIdx = 0;
  var current = open[currentIdx];
  current.parent = -1; // no parent
  while (!(current.position.x == target.x && current.position.y == target.y) && open.length > 0) {
    highlightArea(current.position.x*30, current.position.y*30, 30, 30, "rgba(0,0,88,.3)");
    closed.push(open[currentIdx]);
    open.splice(currentIdx, 1);
    var surroundingTiles = getLegalAdjacentCells(current.position, target);
    for(var i = 0; i < surroundingTiles.length; i++) {
      surroundingTiles[i].parent = current;
      var inClosed = false;
      for(var j = 0; j < closed.length; j++) {
        if(surroundingTiles[i].position.x == closed[j].position.x && surroundingTiles[i].position.y == closed[j].position.y) {
          inClosed = true;
          break;
        }
      }
      if(!inClosed) {
        var inOpen = false;
        for(var j = 0; j < open.length; j++) {
          if(surroundingTiles[i].position == open[j].position) {
            inOpen = true;
            if(current.g + open[j].g > surroundingTiles[i].g) {
              open[j].parent = current;
              open[j].g = surroundingTiles[i].g;
              open[j].h = surroundingTiles[i].h;
            }
          }
        }
        if (!inOpen) {
          open.push(surroundingTiles[i]);
        }
      }
    }
    
    var lowest = 0;
    for(var i = 0; i < open.length; i++) {
      if (open[lowest].g + open[lowest].h > open[i].g + open[i].h) {
        lowest = i;
      }
    }
    var parent = current;
    currentIdx = lowest;
    current = open[currentIdx];
  }
  
  if(current.position.x == target.x && current.position.y == target.y) {
    var parent = current.parent;
    var path = [current.position];
    while(parent != -1) {
      path.push(parent.position);
      parent = parent.parent;
    }
    return path.reverse();
  } else {
    console.log("no path found");
    return -1;
  }
}

function getLegalAdjacentCells(position, target) {
  var cells = new Array();
  for(var posy = -1; posy < 2; posy++) {
    for(var posx = -1; posx < 2; posx++) {
      if(!(posx == 0 && posy == 0) && cellIsPassable(position.x + posx, position.y + posy)) {
        var currpos = {
          x: position.x + posx,
          y: position.y + posy
        }
        var cell = {
          position: currpos,
          g: (posx == 0 || posy == 0) ? 10 : 14,
          h: calculateEstimatedMovementCost(currpos, target)
        }
        cells.push(cell);
      }
    }
  }
  return cells;
}

function cellIsPassable(position) {
  return cellIsPassable(position.x, position.y);
}

function cellIsPassable(x, y) {
  if (!((y >= 0 && y < collisionMap.length) 
    && (x >= 0 && x < collisionMap[y].length)
    && collisionMap[y][x] === 0))
      highlightArea(x*30, y*30, 30, 30, "rgba(88,0,0,.3)");
  return (y >= 0 && y < collisionMap.length) 
    && (x >= 0 && x < collisionMap[y].length)
    && collisionMap[y][x] === 0;
}

function calculateEstimatedMovementCost(start, target) {
  // doctor manhattan method
  return 10 * (Math.abs(start.x - target.x) + Math.abs(start.y - target.y));
}
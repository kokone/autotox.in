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
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
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
  console.log("duration: " + totalTime + "ms");
  for(var i = 0; i < path.length; i++) {
    highlightArea(path[i].x*30, path[i].y*30, 30, 30, "rgba(255,0,0,.3)");
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
  var open = new BinaryHeap(function(x){return x.g + x.h;});
  var closed = new Array();
  open.push({
    position: start,
    g: 0,
    h: 0,
    parent: -1
  });
  while(open.size() > 0) {
    var current = open.pop();
    highlightArea(current.position.x*30, current.position.y*30, 30, 30, "rgba(0,0,255, 0.1)");
    if(current.position.x == target.x && current.position.y == target.y) {
      var path = new Array();
      while(current.parent != -1) {
        path.push(current.position);
        current = current.parent;
      }
      return path.reverse();
    }
    closed.push(current.position);
    
    var surroundingTiles = getLegalAdjacentCells(start, current.position, target);
    for(var i = 0; i < surroundingTiles.length; i++) {
      /*var inClosed = false;
      for(var j = 0; j < closed.length; j++) {
        if(surroundingTiles[i].position.x == closed[j].x && surroundingTiles[i].position.y == closed[j].y) {
          inClosed = true;
          break;
        }
      }
      if(inClosed) {
        continue;
      }
      var cell = open.findExact(surroundingTiles[i]);
      if(cell == -1) {
        surroundingTiles[i].parent = current;
        open.push(surroundingTiles[i]);
      } else if(current.g + cell.g > surroundingTiles[i].g) {
        open.editElement(cell, surroundingTiles[i].g, surroundingTiles[i].h, current);
      }*/
      var neighbour = surroundingTiles[i];
      var cost = current.g + getMovementCost(current.position, neighbour.position);
      var inOpen = open.exists(neighbour);
      if(inOpen && cost < neighbour.g) {
        open.remove(neighbour);
      }
      var inClosed = false;
      for(var j = 0; j < closed.length; j++) {
        if(surroundingTiles[i].position.x == closed[j].x && surroundingTiles[i].position.y == closed[j].y) {
          inClosed = true;
          if(cost < neighbour.g) {
            closed.splice(j,1);
          }
          break;
        }
      }
      if(!inOpen && !inClosed) {
        neighbour.g = cost;
        neighbour.parent = current;
        open.push(neighbour);
      }
    }
  }
  return new Array();
}

function getMovementCost(pos1, pos2) {
  return (pos1.x == pos2.x || pos1.y == pos2.y) ? 10 : 14;
}

function getLegalAdjacentCells(start, position, target) {
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
          h: calculateEstimatedMovementCost(start, currpos, target)
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
  return (y >= 0 && y < collisionMap.length) 
    && (x >= 0 && x < collisionMap[y].length)
    && collisionMap[y][x] === 0;
}

function calculateEstimatedMovementCost(start, current, target) {
  // Chebyshev distance
  var diagonal = Math.min(Math.abs(current.x - target.x), Math.abs(current.y - target.y));
  var straight = (Math.abs(current.x - target.x) + Math.abs(current.y - target.y));
  var heuristic = 14 * diagonal + 10 * (straight - 2 * diagonal);
  // break ties
  var dx1 = start.x - target.x;
  var dy1 = start.y - target.y;
  var dx2 = current.x - target.x;
  var dy2 = current.y - target.y;
  return heuristic + Math.abs(dx1 * dy2 - dx2 * dy1) * 0.001;
}

function BinaryHeap(scoreFunction){
  this.content = [];
  this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
  push: function(element) {
    // Add the new element to the end of the array.
    this.content.push(element);
    // Allow it to bubble up.
    this.bubbleUp(this.content.length - 1);
  },

  pop: function() {
    // Store the first element so we can return it later.
    var result = this.content[0];
    // Get the element at the end of the array.
    var end = this.content.pop();
    // If there are any elements left, put the end element at the
    // start, and let it sink down.
    if (this.content.length > 0) {
      this.content[0] = end;
      this.sinkDown(0);
    }
    return result;
  },

  remove: function(node) {
    var len = this.content.length;
    // To remove a value, we must search through the array to find
    // it.
    for (var i = 0; i < len; i++) {
      if (this.content[i] == node) {
        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        var end = this.content.pop();
        if (i != len - 1) {
          this.content[i] = end;
          if (this.scoreFunction(end) < this.scoreFunction(node))
            this.bubbleUp(i);
          else
            this.sinkDown(i);
        }
        return;
      }
    }
    throw new Error("Node not found.");
  },
  
  findExact: function(node) {
    var len = this.content.length;
    // To remove a value, we must search through the array to find
    // it.
    for (var i = 0; i < len; i++) {
      if (this.content[i].position.x == node.position.x && this.content[i].position.y == node.position.y) {
        return this.content[i];
      }
    }
    // nothing found
    return -1;
  },
  
  exists: function(node) {
    var len = this.content.length;
    // To remove a value, we must search through the array to find
    // it.
    for (var i = 0; i < len; i++) {
      if (this.content[i].position.x == node.position.x && this.content[i].position.y == node.position.y) {
        return true;
      }
    }
    // nothing found
    return false;
  },
  
  editElement: function(node, g, h, parent) {
    var len = this.content.length;
    for (var i = 0; i < len; i++) {
      if (this.content[i].position.x == node.position.x && this.content[i].position.y == node.position.y) {
        this.content[i].g = g;
        this.content[i].h = h;
        this.content[i].parent = parent;
        this.sinkDown(this.content.indexOf(this.content[i]));
        return;
      }
    }
  },

  size: function() {
    return this.content.length;
  },

  bubbleUp: function(n) {
    // Fetch the element that has to be moved.
    var element = this.content[n];
    // When at 0, an element can not go up any further.
    while (n > 0) {
      // Compute the parent element's index, and fetch it.
      var parentN = Math.floor((n + 1) / 2) - 1,
          parent = this.content[parentN];
      // Swap the elements if the parent is greater.
      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;
        // Update 'n' to continue at the new position.
        n = parentN;
      }
      // Found a parent that is less, no need to move it further.
      else {
        break;
      }
    }
  },

  sinkDown: function(n) {
    // Look up the target element and its score.
    var length = this.content.length,
        element = this.content[n],
        elemScore = this.scoreFunction(element);

    while(true) {
      // Compute the indices of the child elements.
      var child2N = (n + 1) * 2, child1N = child2N - 1;
      // This is used to store the new position of the element,
      // if any.
      var swap = null;
      // If the first child exists (is inside the array)...
      if (child1N < length) {
        // Look it up and compute its score.
        var child1 = this.content[child1N],
            child1Score = this.scoreFunction(child1);
        // If the score is less than our element's, we need to swap.
        if (child1Score < elemScore)
          swap = child1N;
      }
      // Do the same checks for the other child.
      if (child2N < length) {
        var child2 = this.content[child2N],
            child2Score = this.scoreFunction(child2);
        if (child2Score < (swap == null ? elemScore : child1Score))
          swap = child2N;
      }

      // If the element needs to be moved, swap it, and continue.
      if (swap != null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      }
      // Otherwise, we are done.
      else {
        break;
      }
    }
  }
};
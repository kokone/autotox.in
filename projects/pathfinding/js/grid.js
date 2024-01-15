var NodeTypes = {
  FLOOR: {
    id: 0,
    passable: true
  },
  WALL: {
    id: 1,
    passable: false
  },
};

function Node(x, y, type) {
  this.position = {
    x: x,
    y: y
  }
  this.type = type;
}

Node.prototype.isPassable = function() {
  if(!this.type.passable) {
    highlightArea(this.position.x*30, this.position.y*30, 30, 30, "rgba(88,0,0,.3)");
  }
  return this.type.passable;
};

Node.prototype.equals = function(node) {
  return this.position.x == node.position.x
    && this.position.y == node.position.y;
};

function Grid(map) {
  var nodes = new Array();
  for(var i = 0; i < map.length; i++) {
    nodes[i] = new Array(map[i].length);
    var nodeType = NodeTypes.FLOOR;
    for(var j = 0; j < map[i].length; j++) {
      for(var type in NodeTypes) {
        if(NodeTypes[type].id == map[i][j]) {
          nodeType = NodeTypes[type];
        }
      }
      nodes[i][j] = new Node(j, i, nodeType);
    }
  }
  this.nodes = nodes;
  this.height = map.length;
  this.width = map[0].length;
}

Grid.prototype.getNode = function(x, y) {
  if(this.nodes[y] && this.nodes[y][x]) {
    return this.nodes[y][x];
  }
  return false;
};

Grid.prototype.replaceNode = function(node) {
  if(this.nodes[node.position.y][node.position.x]) {
    this.nodes[node.position.y][node.position.x] = node;
  }
  return false;
};
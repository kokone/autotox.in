function astar(heuristic) {
  this.heuristic = heuristic;
}

astar.prototype.findPath = function(start, target, grid) {
  for(var i = 0; i < grid.nodes.length; i++) {
    for(var j = 0; j < grid.nodes[i].length; j++) {
      var node = new Node(grid.nodes[i][j].position.x, grid.nodes[i][j].position.y, grid.nodes[i][j].type);
      node.g = 0;
      node.h = 0;
      node.f = 0;
      node.closed = false;
      node.open = false;
      node.parent = false;
      grid.replaceNode(node);
    }
  }
  var open = new BinaryHeap(function(n) {
    return n.f;
  });
  open.push(grid.getNode(start.position.x, start.position.y));
  var current = grid.getNode(start.position.x, start.position.y);
  while(!current.equals(target)) {
    highlightArea(current.position.x*30, current.position.y*30, 30, 30, "rgba(0,0,88,.3)");
    if(open.size() == 0) {
      console.log("no path found");
      return new Array();
    }
    current = open.pop();
    current.closed = true;
    current.open = false;
    var neighbours =  this.getNeighbours(grid, current);
    for(var i = 0; i < neighbours.length; i++) {
      var neighbour = neighbours[i];
      if(!neighbour.isPassable()) {
        continue;
      }
      var cost = current.g + this.movementCost(current, neighbours[i]);
      if(neighbour.open && cost < neighbour.g) {
        open.remove(neighbour);
        neighbour.open = false;
      }
      if(neighbour.closed && cost < neighbour.g) {
        // should never happen with admissible heuristics
        neighbour.closed = false;
      }
      if(!neighbour.open && !neighbour.closed) {
        neighbour.g = cost;
        neighbour.h = Math.round(this.heuristic(start.position, neighbour.position, target.position));
        neighbour.f = neighbour.g + neighbour.h;
        neighbour.parent = current;
        neighbour.open = true;
        open.push(neighbour);
      }
    }
  }
  var path = new Array();
  while(current.parent) {
    path.push(current);
    current = current.parent;
  }
  return path.reverse();
};

astar.prototype.getNeighbours = function(grid, node) {
  var neighbours = new Array();
  for(var posy = -1; posy < 2; posy++) {
    for(var posx = -1; posx < 2; posx++) {
      if(!(posy == 0 && posx == 0) && grid.getNode(node.position.x + posx, node.position.y + posy)) {
        neighbours.push(grid.getNode(node.position.x + posx, node.position.y + posy));
      }
    }
  }
  return neighbours;
};

astar.prototype.movementCost = function(node1, node2) {
  return (node1.position.x == node2.position.x || node1.position.y == node2.position.y) ? 10 : 14;
};
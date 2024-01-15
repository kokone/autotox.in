function Cell(x, y, filled) {
  this.position = {
    x: x,
    y: y
  }
  this.filled = filled,
  this.selected = false,
  this.enabled = true
}

Cell.prototype.equals = function(cell) {
  return this.position.x == cell.position.x
    && this.position.y  == cell.position.y;
}

function Grid(collisionMap) {
  this.height = collisionMap.length;
  this.width = collisionMap[0].width;
  for(var height = 0; height < collisionMap.length; height++) {
    for(var width = 0; width < collisionMap[height].length; width++) {
      
    }
  }
}
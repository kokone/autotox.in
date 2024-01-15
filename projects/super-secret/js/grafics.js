function draw() {
  ctx.clearRect(0, 0, map.width * tileSize, map.height * tileSize);
  map.draw();
  player.draw();
}

Map.prototype.draw = function() {
  for(var y = 0; y < this.height; y++) {
    for(var x = 0; x < this.width; x++) {
      this.getTile(x, y).draw();
    }
  }
}

Tile.prototype.draw = function() {
  ctx.drawImage(this.image, tileSize * this.position.x, tileSize * this.position.y);
}

Player.prototype.draw = function() {
  ctx.drawImage(this.curSprite, this.position.x - (this.width / 2), this.position.y - (this.height / 2));
}
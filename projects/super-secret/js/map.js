var TileTypes = {
	AIR: {
		id: 0,
		passable: true,
    sprite: new Sprite(graphicsLocation + 'tiles/air.png'),
	},
	DIRT: {
		id: 1,
		passable: false,
    sprite: new Sprite(graphicsLocation + 'tiles/dirt.png'),
	},
  GRASS: {
		id: 2,
		passable: false,
    sprite: new Sprite(graphicsLocation + 'tiles/grass.png'),
	},
}

function Tile(x, y, type) {
	this.position = {
		x: x,
		y: y
	}
	this.type = type;
  this.image = type.sprite;
}

Tile.prototype.isPassable = function() {
	return this.type.passable;
}

Tile.prototype.equals = function(tile) {
	return this.position.x == tile.position.x
		&& this.position.y == tile.position.y;
}

function Map(mapArray) {
  var tiles = new Array();
  for(var i = 0; i < mapArray.length; i++) {
    tiles[i] = new Array(mapArray[i].length);
    var tileType = TileTypes.AIR;
    for(var j = 0; j < mapArray[i].length; j++) {
      for(var type in TileTypes) {
        if(TileTypes[type].id == mapArray[i][j]) {
          tileType = TileTypes[type];
        }
      }
      tiles[i][j] = new Tile(j, i, tileType);
    }
  }
  this.tiles = tiles;
  this.height = mapArray.length;
  this.width = mapArray[0].length;
}

Map.prototype.getTile = function(x, y) {
  if(this.tiles[y] && this.tiles[y][x]) {
    return this.tiles[y][x];
  } else return false;
}

Map.prototype.getTileAtLocation = function(x, y) {
  return this.getTile(Math.floor(x / tileSize), Math.floor(y / tileSize));
}

Map.prototype.replaceTile = function(tile) {
  if(this.tiles[tile.position.y][tile.position.x]) {
    this.tiles[tile.position.y][tile.position.x] = tile;
  } else return false;
}
function Player(position, sprites, speed) {
  this.baseSpeed = speed;
  this.curSpeed = speed;
  this.spritesStandRight = [sprites[0]];
  this.spritesWalkRight = [sprites[0], sprites[1]];
  this.spritesJumpRight = [sprites[2]];
  this.spritesStandLeft = [sprites[3]];
  this.spritesWalkLeft = [sprites[3], sprites[4]];
  this.spritesJumpLeft = [sprites[5]];
  this.curSprite = this.spritesStandRight[0];
  this.spriteIdx = 0;
  this.delay = Date.now();
  this.direction = DIRECTION_RIGHT;
  this.height = this.curSprite.height;
  this.width = this.curSprite.width;
  this.position = position;
  this.moving = false;
  this.jumping = false;

  this.placeOnTile = function(x, y) {
    this.position.x = x * tileSize + tileSize / 2;
    this.position.y = y * tileSize + tileSize - this.height / 2;
  }
  
  this.getPlayerPositionOnTile = function() {
    return {
      x: Math.floor(this.position.x / tileSize),
      y: Math.floor(this.position.y / tileSize)
    }
  }
  
  this.placeOnTile(this.position.x, this.position.y);
  
  this.checkCollision = function(x, y) {
    return !map.getTileAtLocation(x - this.width / 2, y - this.height / 2 - 1).isPassable()
    || !map.getTileAtLocation(x - this.width / 2, y + this.height / 2 - 1).isPassable()
    || !map.getTileAtLocation(x + this.width / 2, y - this.height / 2 - 1).isPassable()
    || !map.getTileAtLocation(x + this.width / 2, y + this.height / 2 - 1).isPassable();
  }
  
  this.move = function(direction) {
    this.moving = true;
    this.direction = direction;
    if(direction == DIRECTION_LEFT) {
      if(!this.checkCollision(this.position.x - speed, this.position.y)) {
        this.position.x -= speed;
      }
    }
    else if(direction == DIRECTION_RIGHT) {
      if(!this.checkCollision(this.position.x + speed, this.position.y)) {
        this.position.x += speed;
      }
    }
  }
  
  this.stopMoving = function() {
    this.moving = false;
  }
  
  this.getSprite = function() {
    var sprites;
    if (this.direction == DIRECTION_LEFT) { // left
      if (this.jumping) {
        sprites = this.spritesJumpLeft;
      } else if (this.moving) {
        sprites = this.spritesWalkLeft;
      } else {
        sprites = this.spritesStandLeft;
      }
    } else { // right
      if (this.jumping) {
        sprites = this.spritesJumpRight;
      } else if (this.moving) {
        sprites = this.spritesWalkRight;
      } else {
        sprites = this.spritesStandRight;
      }
    }
    if(sprites.length == 1) {
      return sprites[0];
    } else if(sprites.length > 1) {
      if (Date.now() - this.delay >= 100) {
        this.delay = Date.now();
        if(this.spriteIdx >= sprites.length) 
          return sprites[this.spriteIdx = 0];
        else
          return sprites[this.spriteIdx++];
      }
    }
    return this.curSprite;
  }
  
  this.update = function() {
    this.curSprite = this.getSprite();
  }
}
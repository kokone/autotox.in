function Sprite(src) {
  if(isNull(src)) return null;
  var sprite = new Image();
  sprite.src = src;
  return sprite;
}

var dittoSprites = [
  new Sprite(graphicsLocation + 'characters/ditto/ditto0r.png'),
  new Sprite(graphicsLocation + 'characters/ditto/ditto1r.png'),
  new Sprite(graphicsLocation + 'characters/ditto/ditto2r.png'),
  new Sprite(graphicsLocation + 'characters/ditto/ditto0l.png'),
  new Sprite(graphicsLocation + 'characters/ditto/ditto1l.png'),
  new Sprite(graphicsLocation + 'characters/ditto/ditto2l.png'),
];
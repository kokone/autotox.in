var curKeyState = [];
var preKeyState = [];

document.addEventListener("keydown", function(evt) {
  curKeyState[evt.which] = true;
}, false);
document.addEventListener("keyup", function(evt) {
  curKeyState[evt.which] = false;
}, false);

curKeyState[KEY_UP]      = false; // up
curKeyState[KEY_DOWN]    = false; // down
curKeyState[KEY_LEFT]    = false; // left
curKeyState[KEY_RIGHT]   = false; // right

preKeyState = curKeyState.slice(0);

function keyDown(key) {
  return curKeyState[key];
}
function keyUp(key) {
  return !curKeyState[key];
}
function keyPress(key) {
  return curKeyState[key] && !preKeyState[key];
}
function keyRelease(key) {
  return !curKeyState[key] && preKeyState[key];
}

function updateKeys() {
  if (keyDown(KEY_UP)) {
  
  }
  if (keyDown(KEY_DOWN)) {
  
  } 
  if (keyDown(KEY_LEFT)) {
    player.move(DIRECTION_LEFT);
  }
  if (keyDown(KEY_RIGHT)) {
    player.move(DIRECTION_RIGHT);
  }
  if(keyRelease(KEY_RIGHT) || keyRelease(KEY_LEFT)) {
    player.stopMoving();
  }
  preKeyState = curKeyState.slice(0);
}
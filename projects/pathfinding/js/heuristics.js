var chebyshev = function calculateEstimatedMovementCost(start, current, target) {
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
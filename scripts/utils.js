const OPOSITE_DIRECTIONS = {
  right: 'left',
  left: 'right',
  up: 'down',
  down: 'up',
}

const DIRECTION_TO_DEGREE = {
  right: 0,
  down: 90,
  left: 180,
  up: 270,
};

const MULTIPLE_DIRECTIONS_TO_DEGREE = {
  right: {
    up: 0,
    down: 270,
  },
  down: {
    left: 0,
    right: 90,
  },
  left: {
    up: 90,
    down: 180,
  },
  up: {
    left: 270,
    right: 180,
  },
};

// Returns the direction that the part of the snake should be pointed to
function getImgDirection(current, next) {
  if (current.x > next.x) {
    if (next.x === 0 && current.x !== multiplier) return 'right';
    return 'left';
  }
  if (current.x < next.x) {
    if (current.x === 0 && next.x !== multiplier) return 'left';
    return 'right';
  }
  if (current.y < next.y) {
    if (current.y === 0 && next.y === (100 - multiplier)) return 'up';
    return 'down';
  }
  if (current.y > next.y) {
    if (next.y === 0 && current.y === (100 - multiplier)) return 'down';
    return 'up';
  }
  return 'right';
}

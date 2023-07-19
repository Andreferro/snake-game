var startMenu = document.getElementById('start-menu');
var continueOption = document.getElementById('continue');
var gridElement = document.getElementById('grid');
var gameElement = document.getElementById('game');
var scoreElement = document.getElementById('score');
var timeElement = document.getElementById('time');

var player = null;
var food = null;
var score = 0;
var time = 0;

var lastKeyPressed = null;
var grid = [];

var interval = null;
var intervalClock = 100;
var multiplier = 5;
var multiplierRemainder = 100 % multiplier;
var gameOver = false;
var isPlaying = false;

function getDirection(current, next) {
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

class Item {
  type = '';
  coords = { x: 0, y: 0 };

  constructor(t) {
    this.type = t;
    this.coords = {
      x: Math.floor(Math.random() * 100 / multiplier) * multiplier,
      y: Math.floor(Math.random() * 100 / multiplier) * multiplier,
    };
  }
}

class Snake {
  head = { x: multiplier, y: 0, direction: 'right' };
  tail = [{ x: 0, y: 0, next: { x: multiplier, y: 0 }, direction: 'right' }];

  move(dir) {
    if (dir === 'left' && this.head.direction !== 'right') this.head.direction = dir;
    else if (dir === 'right' && this.head.direction !== 'left') this.head.direction = dir;
    else if (dir === 'up' && this.head.direction !== 'down') this.head.direction = dir;
    else if (dir === 'down' && this.head.direction !== 'up') this.head.direction = dir;

    if (this.head.direction === 'up') {
      this.head.y = this.head.y === 0 ? (100 - (multiplierRemainder + multiplier)) : this.head.y - multiplier;
    } else if (this.head.direction === 'down') {
      this.head.y = this.head.y === (100 - (multiplierRemainder + multiplier)) ? 0 : this.head.y + multiplier;
    } else if (this.head.direction === 'left') {
      this.head.x = this.head.x === 0 ? (100 - (multiplierRemainder + multiplier)) : this.head.x - multiplier;
    } else {
      this.head.x = this.head.x === (100 - (multiplierRemainder + multiplier)) ? 0 : this.head.x + multiplier;
    }

    for (let i = 0; i < this.tail.length; i++) {
      this.tail[i].y = this.tail[i].next.y;
      this.tail[i].x = this.tail[i].next.x;
      if (i === 0) this.tail[i].next = { x: this.head.x, y: this.head.y };
      else this.tail[i].next = { x: this.tail[i - 1].x, y: this.tail[i - 1].y };

      this.tail[i].direction = getDirection(this.tail[i], this.tail[i].next);
    }
  }

  grow() {
    if (this.tail.length > 0) {
      const newTailPart = {
        x: this.tail[this.tail.length - 1].x + (this.head.direction === 'up' ? 1 : -1),
        y: this.tail[this.tail.length - 1].y + (this.head.direction === 'left' ? 1 : -1),
        next: {
          x: this.tail[this.tail.length - 1].x,
          y: this.tail[this.tail.length - 1].y,
        },
      };
      this.tail.push({
        ...newTailPart,
        direction: getDirection(newTailPart, newTailPart.next),
      });
    } else {
      this.tail.push({
        x: this.head.x + (this.head.direction === 'up' ? 1 : -1),
        y: this.head.y + (this.head.direction === 'left' ? 1 : -1),
        next: {
          x: this.head.x,
          y: this.head.y,
        },
        direction: this.head.direction,
      });
    }
  }
}

function moveSnake() {
  player.move(lastKeyPressed);
  const headGrid = 'x' + player.head.x + 'y' + player.head.y;

  grid[headGrid].dataset.type = 'head';
  if (player.head.direction === 'right') grid[headGrid].dataset.rotate = "0";
  else if (player.head.direction === 'left') grid[headGrid].dataset.rotate = "180";
  else if (player.head.direction === 'up') grid[headGrid].dataset.rotate = "270";
  else if (player.head.direction === 'down') grid[headGrid].dataset.rotate = "90";

  for (let i = 0; i < player.tail.length; i++) {
    const tailGrid = 'x' + player.tail[i].x + 'y' + player.tail[i].y;
    if (i === player.tail.length - 1) grid[tailGrid].dataset.type = 'tail';
    else {
      grid[tailGrid].dataset.type = 'body';
      if (player.tail[i].direction !== player.tail[i + 1].direction) {
        grid[tailGrid].dataset.type = 'curve';
      }
    }

    if (grid[tailGrid].dataset.type === 'body' || grid[tailGrid].dataset.type === 'tail') {
      if (player.tail[i].direction === 'right') grid[tailGrid].dataset.rotate = "0";
      else if (player.tail[i].direction === 'left') grid[tailGrid].dataset.rotate = "180";
      else if (player.tail[i].direction === 'up') grid[tailGrid].dataset.rotate = "270";
      else if (player.tail[i].direction === 'down') grid[tailGrid].dataset.rotate = "90";
    } else if (grid[tailGrid].dataset.type === 'curve') {
      if (player.tail[i].direction === 'right' && player.tail[i + 1].direction === 'down') {
        grid[tailGrid].dataset.rotate = "270";
      }
      else if (player.tail[i].direction === 'right' && player.tail[i + 1].direction === 'up') {
        grid[tailGrid].dataset.rotate = "0";
      }
      else if (player.tail[i].direction === 'left' && player.tail[i + 1].direction === 'up') {
        grid[tailGrid].dataset.rotate = "90";
      }
      else if (player.tail[i].direction === 'left' && player.tail[i + 1].direction === 'down') {
        grid[tailGrid].dataset.rotate = "180";
      }
      else if (player.tail[i].direction === 'up' && player.tail[i + 1].direction === 'left') {
        grid[tailGrid].dataset.rotate = "270";
      }
      else if (player.tail[i].direction === 'up' && player.tail[i + 1].direction === 'right') {
        grid[tailGrid].dataset.rotate = "180";
      }
      else if (player.tail[i].direction === 'down' && player.tail[i + 1].direction === 'left') {
        grid[tailGrid].dataset.rotate = "0";
      }
      else if (player.tail[i].direction === 'down' && player.tail[i + 1].direction === 'right') {
        grid[tailGrid].dataset.rotate = "90";
      }
    }
  }
}

function clear() {
  for (let x = 0; x < 100; x += multiplier) {
    for (let y = 0; y < 100; y += multiplier) {
      if (grid['x' + x + 'y' + y].dataset.type) {
        delete grid['x' + x + 'y' + y].dataset.type;
        delete grid['x' + x + 'y' + y].dataset.rotate;
      }
    }
  }
}

function updateElement(type) {
  var el = document.getElementById(type);
  switch (type) {
    case 'time':
      const seconds = String(parseInt(time / 1000)).padStart(2, '0');
      const minutes = String(parseInt(time / 60000)).padStart(2, '0');
      el.innerText = minutes + ":" + seconds;
      break;
    case 'score':
      el.innerText = String(score).padStart(3, '0');
      break;

    default:
      break;
  }
}

function renderItem(item) {
  const newElement = document.createElement('div');
  newElement.style.left = item.coords.x;
  newElement.style.top = item.coords.y;
  const gridCoords = 'x' + item.coords.x + 'y' + item.coords.y;
  grid[gridCoords].dataset.type = 'food';
}

function checkColision() {
  for (let i = 0; i < player.tail.length; i++) {
    if (player.head.x === player.tail[i].x && player.head.y === player.tail[i].y) {
      gameOver = true;
    }
  }
}

function render() {
  isPlaying = true;
  time += intervalClock;
  updateElement('time');
  clear();
  moveSnake();
  checkColision();

  if (gameOver) {
    clearInterval(interval);
    toggleMenu();
    gameOver = false;
    isPlaying = false;
    return;
  }

  if (food) {
    if (player.head.x === food.coords.x && player.head.y === food.coords.y) {
      player.grow();
      score += 5;
      food = null;
      updateElement('score');
    }
  }

  if (!food) {
    food = new Item('food');
  }

  renderItem(food);

  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 's') {
      lastKeyPressed = 'down';
    } else if (e.key === 'ArrowUp' || e.key === 'w') {
      lastKeyPressed = 'up';
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
      lastKeyPressed = 'left';
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
      lastKeyPressed = 'right';
    }

    if (e.key === 'Escape') {
      clearInterval(interval);
      isPlaying = false;
      toggleMenu();
    }
  });
}

function start() {
  clear();
  player = new Snake();
  food = new Item('food');
  score = 0;
  time = 0;

  interval = setInterval(render, intervalClock);
  toggleMenu(true);
}

function continueGame() {
  interval = setInterval(render, intervalClock);
  toggleMenu(true);
}

function toggleMenu(showMenu) {
  if (showMenu) {
    gameElement.style.display = "flex";
    startMenu.style.display = "none";
    continueOption.style.display = "none";
  } else if (gameOver) {
    gameElement.style.display = "none";
    startMenu.style.display = "flex";
    continueOption.style.display = "none";
  } else {
    gameElement.style.display = "none";
    startMenu.style.display = "flex";
    continueOption.style.display = "block";
  }
}

(function () {
  for (let x = 0; x < 100; x += multiplier) {
    for (let y = 0; y < 100; y += multiplier) {
      const gridItem = document.createElement('div');
      gridItem.setAttribute('class', 'grid-item');
      gridItem.style.height = multiplier + '%';
      gridItem.style.width = multiplier + '%';
      gridItem.style.top = y + '%';
      gridItem.style.left = x + '%';
      grid['x' + x + 'y' + y] = gridItem;
      gridElement.appendChild(gridItem);
    }
  }
})()

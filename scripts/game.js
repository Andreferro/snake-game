var startMenu = document.getElementById('start-menu');
var continueOption = document.getElementById('continue');
var gridElement = document.getElementById('grid');
var gameElement = document.getElementById('game');

var gridWidth = 100;
var gridHeight = 75;

var player = null;
var food = null;
var treasure = null;
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

function moveSnake() {
  player.move(lastKeyPressed);
  const headGrid = 'x' + player.head.x + 'y' + player.head.y;

  grid[headGrid].dataset.type = 'head';
  grid[headGrid].dataset.rotate = DIRECTION_TO_DEGREE[player.head.direction];

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
      grid[tailGrid].dataset.rotate = DIRECTION_TO_DEGREE[player.tail[i].direction];
    } else if (grid[tailGrid].dataset.type === 'curve') {
      grid[tailGrid].dataset.rotate = MULTIPLE_DIRECTIONS_TO_DEGREE[player.tail[i].direction][player.tail[i + 1].direction];
    }
  }
}

function clear() {
  for (let x = 0; x < gridWidth; x += multiplier) {
    for (let y = 0; y < gridHeight; y += multiplier) {
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
      el.innerText = minutes + ':' + seconds;
      break;
    case 'score':
      el.innerText = String(score).padStart(3, '0');
      break;

    default:
      break;
  }
}

function renderItem(item) {
  const gridCoords = 'x' + item.coords.x + 'y' + item.coords.y;
  if (grid[gridCoords].dataset.type) {
    if (item.type === 'food') {
      food = null;
    } else if (item.type === 'treasure') {
      treasure = null;
    }
    return;
  }
  const newElement = document.createElement('div');
  newElement.style.left = item.coords.x;
  newElement.style.top = item.coords.y;
  grid[gridCoords].dataset.type = item.type;
}

function checkColision() {
  const hasColision = player.tail.find((t) => t.x === player.head.x && t.y === player.head.y);
  gameOver = !!hasColision;
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

  if (treasure) {
    if (player.head.x === treasure.coords.x && player.head.y === treasure.coords.y) {
      score += 10;
      treasure = null;
      updateElement('score');
    } else if (treasure.timer !== 0) {
      treasure.timer -= intervalClock;
    } else {
      treasure = null;
    }
  }

  if (!food) {
    food = new Food();
  }

  if (!treasure && time > 1000 && (parseInt(time / 1000) % 10) === 0) {
    treasure = new Treasure();
  }

  renderItem(food);
  if (treasure) renderItem(treasure);

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
  food = new Food();
  score = 0;
  time = 0;
  updateElement('time');
  updateElement('score');

  interval = setInterval(render, intervalClock);
  toggleMenu(true);
}

function continueGame() {
  interval = setInterval(render, intervalClock);
  toggleMenu(true);
}

function toggleMenu(showMenu) {
  if (showMenu) {
    gameElement.style.display = 'grid';
    startMenu.style.display = 'none';
    continueOption.style.display = 'none';
  } else if (gameOver) {
    gameElement.style.display = 'none';
    startMenu.style.display = 'flex';
    continueOption.style.display = 'none';
  } else {
    gameElement.style.display = 'none';
    startMenu.style.display = 'flex';
    continueOption.style.display = 'block';
  }
}

(function () {
  for (let y = 0; y < gridHeight; y += multiplier) {
    for (let x = 0; x < gridWidth; x += multiplier) {
      const gridItem = document.createElement('div');
      gridItem.setAttribute('class', 'grid-item');
      grid['x' + x + 'y' + y] = gridItem;
      gridElement.appendChild(gridItem);
    }
  }
})()

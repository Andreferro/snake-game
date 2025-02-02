class Item {
  coords = { x: 0, y: 0 };

  constructor() {
    this.coords = {
      x: Math.floor(Math.random() * gridWidth / multiplier) * multiplier,
      y: Math.floor(Math.random() * gridHeight / multiplier) * multiplier,
    };
  }
}

class Food extends Item {
  type = 'food';
  points = 5;
}

class Treasure extends Item {
  type = 'treasure';
  points = 10;
  timer = 5000;
}

class Snake {
  head = { x: multiplier, y: 0, direction: 'right' };
  tail = [{ x: 0, y: 0, next: { x: multiplier, y: 0 }, direction: 'right' }];

  move(dir) {
    // Avoid things like suddenly turn left when going right
    if (dir !== OPOSITE_DIRECTIONS[this.head.direction]) this.head.direction = dir;

    const aux = multiplierRemainder + multiplier;

    if (this.head.direction === 'up') {
      this.head.y = this.head.y === 0 ? (gridHeight - aux) : this.head.y - multiplier;
    } else if (this.head.direction === 'down') {
      this.head.y = this.head.y === (gridHeight - aux) ? 0 : this.head.y + multiplier;
    } else if (this.head.direction === 'left') {
      this.head.x = this.head.x === 0 ? (gridWidth - aux) : this.head.x - multiplier;
    } else {
      this.head.x = this.head.x === (gridWidth - aux) ? 0 : this.head.x + multiplier;
    }

    for (let i = 0; i < this.tail.length; i++) {
      this.tail[i].y = this.tail[i].next.y;
      this.tail[i].x = this.tail[i].next.x;
      if (i === 0) this.tail[i].next = { x: this.head.x, y: this.head.y };
      else this.tail[i].next = { x: this.tail[i - 1].x, y: this.tail[i - 1].y };

      this.tail[i].direction = getImgDirection(this.tail[i], this.tail[i].next);
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
        direction: getImgDirection(newTailPart, newTailPart.next),
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

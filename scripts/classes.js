class Item {
  type = ''; // Food or treasure
  points = 0;
  coords = { x: 0, y: 0 };
  timer = null; // Treasures only appear for a certain time

  constructor(t) {
    this.type = t;
    switch (t) {
      case 'food':
        this.points = 5;
        break;
      case 'treasure':
        this.points = 10;
        this.timer = 5000;
        break;
    
      default:
        this.points = 5;
        break;
    }
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
    // Avoid things like suddenly turn left when going right
    if (dir !== OPOSITE_DIRECTIONS[this.head.direction]) this.head.direction = dir;

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

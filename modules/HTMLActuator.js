class HTMLActuator {
  constructor() {
    this.tileContainer = document.querySelector('.tile-container');
    this.scoreContainer = document.querySelector('.score-container');
    this.messageContainer = document.querySelector('.game-message');

    this.score = 0;
  }

  actuate(grid, data) {
    window.requestAnimationFrame(() => {
      this.clearContainer(this.tileContainer);//очищаем html grid

      //перерисовываем 
      grid.cells.forEach(row => {
        row.forEach(cell => {
          if (cell) {
            this.addTile(cell)
          }
        })
      })

      this.updateScore(data.score);

      if (data.over) this.message(false)//выйгрыш
      if (data.won) this.message(true)//пройгрыш
    })
  }


  clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }
  }

  addTile(tile) {
    let element = document.createElement('div');
    let position = tile.previousPosition || { x: tile.x, y: tile.y };
    let positionClass = this.positionClass(position);
    let classes = ['tile', positionClass, `t${tile.value}`];
    this.applyClasses(element, classes);
    if (tile.previousPosition) {
      window.requestAnimationFrame(() => {
        classes[1] = this.positionClass({ x: tile.x, y: tile.y });
        this.applyClasses(element, classes);
      })
    } else if (tile.mergedFrom) {
      classes.push('tile-merged');
      this.applyClasses(element, classes);

      tile.mergedFrom.forEach((merged) => {
        this.addTile(merged)
      });
    } else {
      classes.push('tile-new');
      this.applyClasses(element, classes);
    }
    this.tileContainer.appendChild(element)

  }

  applyClasses(element, classes) {
    element.className = classes.join(' ');
  }

  normalizePosition(position) {
    return { x: position.x + 1, y: position.y + 1 }
  }

  positionClass(position) {
    let cssPosition = this.normalizePosition(position);
    return `tile-position-${cssPosition.y}-${cssPosition.x}`
  }

  restart() {
    this.clearMessage();
  }

  updateScore(score) {
    this.clearContainer(this.scoreContainer);

    let difference = score - this.score;
    this.score = score;

    this.scoreContainer.textContent = this.score;

    if (difference > 0) {
      let addition = document.createElement('div');
      addition.classList.add('score-addition');
      addition.innerHTML = `+${difference}`;
      this.scoreContainer.appendChild(addition);
    }
  }

  message(won) {
    let type = won ? 'game-won' : 'game-over';
    let message = won ? 'You win!' : 'Game over!';
    this.messageContainer.classList.add(type);
    this.messageContainer.querySelector('p').innerHTML = message;
  }

  clearMessage() {
    this.messageContainer.classList.remove('game-over', 'game-won')
  }
}

class HTMLActuator {
  constructor() {
    this.tileContainer = document.querySelector('.tile-container');
  }

  actuate(grid) {
    window.requestAnimationFrame(() => {
      this.clearTileContainer();//очищаем html grid

      //перерисовываем 
      grid.cells.forEach(row => {
        row.forEach(cell => {
          if (cell) {
            this.addTile(cell)
          }
        })
      })
    })
  }


  clearTileContainer() {
    while (this.tileContainer.firstChild) {
      this.tileContainer.removeChild(this.tileContainer.firstChild)
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
}

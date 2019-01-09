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
    let position = { x: tile.x, y: tile.y };
    let positionClass = this.positionClass(position);
    // let classes = ['tile', positionClass, `t${tile.value}`];
    element.className = `tile ${positionClass} t${tile.value}`
    this.tileContainer.appendChild(element)

  }



  normalizePosition(position) {
    return { x: position.x + 1, y: position.y + 1 }
  }

  positionClass(position) {
    let cssPosition = this.normalizePosition(position);
    return `tile-position-${cssPosition.y}-${cssPosition.x}`
  }
}

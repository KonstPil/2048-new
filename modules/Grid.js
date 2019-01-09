class Grid {
  constructor(size) {
    this.size = size;
    this.cells = [];
    this.build();
  }

  build() {
    for (let y = 0; y < this.size; y++) {
      let row = this.cells[y] = [];
      for (let x = 0; x < this.size; x++) {
        row.push(null)
      }
    }
  }

  randomAvailiableCell() {
    let cells = this.availiableCells();
    if (cells.length) {
      return cells[Math.floor(Math.random() * cells.length)]
    }
  }

  availiableCells() {
    let cells = [];
    this.forEachCell((x, y, tail) => {
      if (!tail) {
        cells.push({ x: x, y: y })
      }
    })
    return cells;
  }

  isCellsAvailiable() {
    return !!this.availiableCells();
  }

  forEachCell(callback) {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        callback(x, y, this.cells[x][y])
      }
    }
  }

  insertTile(tile) {
    this.cells[tile.y][tile.x] = tile;
  }

  deleteTile(tile) {
    this.cells[tile.y][tile.x] = null;
  }

  isWithinBoundary(position) {
    return position.x >= 0 && position.x < this.size && position.y >= 0 && position.y < this.size;
  }


  whatIsCellContent(cell) {
    if (isWithinBoundary(cell)) {
      return this.cells[cell.y][cell.x]
    } else {
      return null
    }
  }

  isCellOccupied(cell) {
    return !!whatIsCellContent(cell)
  }

  isCellAvailable(cell) {
    return !isCellOccupied(cell)
  }
}
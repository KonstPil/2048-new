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

  randomAvailableCell() {
    let cells = this.availableCells();
    if (cells.length) {
      return cells[Math.floor(Math.random() * cells.length)];

    }
  }

  availableCells() {
    let cells = [];
    this.forEachCell((x, y, tile) => {
      if (!tile) {
        cells.push({ x: x, y: y })
      }
    })
    return cells;
  }

  isCellsAvailable() {
    return !!this.availableCells().length;
  }

  forEachCell(callback) {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        callback(x, y, this.cells[y][x])
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


  whatIsCellContent(position) {
    if (this.isWithinBoundary(position)) {
      return this.cells[position.y][position.x]
    } else {
      return null
    }
  }

  isCellOccupied(cell) {
    return !!this.whatIsCellContent(cell)
  }

  isCellAvailable(cell) {
    return !this.isCellOccupied(cell)
  }
}

export default Grid;
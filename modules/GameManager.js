class GameManager {
  constructor(Input, Actuator) {
    this.inputManager = new Input;
    this.actuator = new Actuator;
    this.startTiles = 1;
    this.size = 4;
    this.setup();
    this.inputManager.on('move', this.move.bind(this))
  }

  setup() {
    this.grid = new Grid(this.size)


    this.addStartTiles();
    this.actuate();

  }

  addStartTiles() {
    for (let i = 0; i < this.startTiles; i++) {
      this.addRandomTile();
    }
  }

  //стираем информацию mergedFrom и сохраняем текущие координаты
  prepareTiles() {
    this.grid.forEachCell((x, y, tile) => {
      if (tile) {
        tile.mergedFrom = null;
        tile.savePosition();
      }
    })
  }

  addRandomTile() {
    if (this.grid.isCellsAvailiable()) {
      let value = Math.random() > 0.9 ? 4 : 2;
      let tile = new Tile(this.grid.randomAvailiableCell(), value);
      this.grid.insertTile(tile);
      console.log(tile.x, tile.y, tile.value);

    }
  }

  actuate() {
    this.actuator.actuate(this.grid)
  }

  moveTile(tile, cell) {
    this.grid.cells[tile.y][tile.x] = null;
    this.grid.cells[cell.y][cell.x] = tile;
    tile.updatePosition(cell)
  }

  move(direction) {
    let vector = this.getVector(direction);
    let traversals = this.buildTraversals(vector)
    let moved = false;


    this.prepareTiles();
    let cell, tile;
    traversals.y.forEach(y => {
      traversals.x.forEach(x => {
        cell = { x: x, y: y };
        tile = this.grid.whatIsCellContent(cell);
        if (tile) {
          let positions = this.findFarthestPosition(cell, vector);
          let next = this.grid.whatIsCellContent(positions.next)

          if (next && next.value === tile.value && !next.mergedFrom) {
            let merged = new Tile(positions.next, tile.value * 2);
            merged.mergedFrom = [tile, next]
            console.log(merged);
            this.grid.insertTile(merged);
            this.grid.deleteTile(tile);
            tile.updatePosition(positions.next);
          } else {
            this.moveTile(tile, positions.farthest);
          }
          if (!this.positionsEqual(cell, tile)) {
            moved = true;
          }
        }
      })
    })
    if (moved) {
      this.addRandomTile();
    }
    console.log(this.grid.cells);

    this.actuate()
  }

  getVector(direction) {
    let map = {
      0: { x: 0, y: -1 },//up
      1: { x: 1, y: 0 },//right
      2: { x: 0, y: 1 },//down
      3: { x: -1, y: 0 }//left
    }
    return map[direction]
  }

  //в каком порядке перебираем клетки
  buildTraversals(vector) {
    let traversals = { x: [], y: [] };

    for (let pos = 0; pos < this.size; pos++) {
      traversals.x.push(pos);
      traversals.y.push(pos)
    }

    //нужно чтобы перебор всегда шёл с самой дальней точки
    if (vector.x === 1) traversals.x = traversals.x.reverse();
    if (vector.y === 1) traversals.y = traversals.y.reverse();
    return traversals;
  }


  findFarthestPosition(cell, vector) {
    let previous;
    //пока не нашли препятствие, передвигаемся
    do {
      previous = cell;
      cell = {
        x: previous.x + vector.x,
        y: previous.y + vector.y
      }
    } while (this.grid.isWithinBoundary(cell) && this.grid.isCellAvailable(cell))
    return {
      farthest: previous,
      next: cell
    }
  }

  positionsEqual(first, second) {
    return first.x === second.x && first.y === second.y
  }

}
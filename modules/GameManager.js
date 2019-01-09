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

  addRandomTile() {
    if (this.grid.availiableCells) {
      let value = Math.random() > 0.9 ? 4 : 2;
      let tile = new Tile(this.grid.randomAvailiableCell(), value);
      this.grid.insertTile(tile);
    }
  }

  actuate() {
    this.actuator.actuate(this.grid)
  }

  move(direction) {
    console.log(direction);

    let vector = this.getVector(direction);
    let traversals = this.buildTraversals(vector)
    console.log(traversals);

  }

  getVector(direction) {
    let map = {
      0: { x: 0, y: -1 },//up
      1: { x: 1, y: 0 },//right
      2: { x: 0, y: 1 },//down
      3: { x: -1, y: 1 }//left
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

}
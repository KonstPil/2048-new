class GameManager {
  constructor(Input, Actuator) {
    this.inputManager = new Input;
    this.actuator = new Actuator;
    this.startTiles = 1;
    this.size = 4;
    this.setup();
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

}
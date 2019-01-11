import Tile from './Tile.js';
import Grid from './Grid.js';

/**
 * описывает действия на игровом поле
 * @module GameManager
 *
 */

class GameManager {
  /**
   * действия на игровом оле
   * @param {Object} inputManager  вводимые данные- события мыши и т.д(для управления)
   * @param {Object} actuator  отрисовка html
   * @param {Number} startTiles  кол-во начальных клеток
   * @param {Number} size  размер квадрата представляющий игровое поле
   * @param {Function} setup  начальные действия для старта игры
   */
  constructor(Input, Actuator) {
    this.inputManager = new Input;
    this.actuator = new Actuator;
    this.startTiles = 1;
    this.size = 4;
    this.inputManager.on('move', this.move.bind(this));//устанавливаем callback для  inputManager, на действие 'move'
    this.inputManager.on('restart', this.restart.bind(this));//устанавливаем callback для  inputManager, на действие 'restart'
    this.setup();
  }

  /**
* делает рестарт игры после пройгрыша или выгрыша
*/
  restart() {
    this.actuator.restart();
    this.setup();
  }


  /**
 * подготовка перед началом игры
*/
  setup() {
    this.grid = new Grid(this.size)

    this.score = 0;
    this.over = false;
    this.won = false;

    this.addStartTiles();
    this.actuate();

  }

  /**
* добавляет стартовые tile в зависимости от их количества (this.startTiles)
*/
  addStartTiles() {
    for (let i = 0; i < this.startTiles; i++) {
      this.addRandomTile();
    }
  }


  /**
* подготавливает ячейку к следующему ходу
*/
  prepareTiles() {
    this.grid.forEachCell((x, y, tile) => {
      if (tile) {
        tile.mergedFrom = null;
        tile.savePosition();
      }
    })
  }


  /**
* добавляем tile в свободное место
*/
  addRandomTile() {
    if (this.grid.isCellsAvailable()) {
      let value = Math.random() > 0.9 ? 4 : 2;
      let tile = new Tile(this.grid.randomAvailableCell(), value);
      this.grid.insertTile(tile);
    }
  }

  /**
* передаем информацию о состоянии игры в this.actuator
*/
  actuate() {
    this.actuator.actuate(this.grid, { score: this.score, over: this.over, won: this.won })
  }

  /**
* переставляем tile в необходимую ячейку в массиве который представляет игровое поле
*/
  moveTile(tile, cell) {
    this.grid.cells[tile.y][tile.x] = null;
    this.grid.cells[cell.y][cell.x] = tile;
    tile.updatePosition(cell)
  }

  /**
* отвечает за передвижение внутри массива представляющего игровое поле а  так же слияние и состояние выгрыша и пройгрыша
* @param {Number} direction число которое представлет направление движения см.Input.js
*/
  move(direction) {
    if (this.over || this.won) return
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
            this.grid.insertTile(merged);
            this.grid.deleteTile(tile);
            tile.updatePosition(positions.next);

            this.score += merged.value;

            if (merged.value === 2048) this.won = true;
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
    if (!this.movesAvailable()) {
      this.over = true;
    }

    this.actuate()
  }

  /**
* получаем вектор движения
* @param {Number} direction число которое представлет направление движения см.Input.js
* @return {Object} какие кординаты будут меняться при соответствующих направления движения
*/
  getVector(direction) {
    let map = {
      0: { x: 0, y: -1 },//up
      1: { x: 1, y: 0 },//right
      2: { x: 0, y: 1 },//down
      3: { x: -1, y: 0 }//left
    }
    return map[direction]
  }

  /**
* в каком порядке перебираем клетки
* @param {Object} vector какие кординаты будут меняться при соответствующих направления движения
* @return {Object} в каком порядке делать перебор
*/
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


  /**
* находим самую дальнюю доступную для передвижения точку
* @param {Object} cell текущие координаты клетки 
* @param {Object} vector какие кординаты будут меняться при соответствующих направления движения
* @return {Object} самое дальнне положение без препятствий и следующее за ним
*/
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

  /**
* проверяем равны ли два позиции 
*/
  positionsEqual(first, second) {
    return first.x === second.x && first.y === second.y
  }

  /**
* остались ещё ходы или нет, т.е когда есть свободные клетки или можно выполнить слияние
* @return {Boolean} 
*/
  movesAvailable() {
    return this.grid.isCellsAvailable() || this.tileMatchesAvailable();
  }

  /**
* можно выполнить слияние?
* @return {Boolean} 
*/
  tileMatchesAvailable() {
    let tile;
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        tile = this.grid.whatIsCellContent({ x: x, y: y });
        if (tile) {
          for (let direction = 0; direction < 4; direction++) {
            let vector = this.getVector(direction);
            let cell = { x: x + vector.x, y: y + vector.y };

            let other = this.grid.whatIsCellContent(cell);
            if (other && other.value === tile.value) {
              return true;
            }
          }
        }
      }
    }
    return false
  }
}

export default GameManager;
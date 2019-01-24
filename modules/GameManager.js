import Tile from './Tile.js';
import Grid from './Grid.js';
import Position from './Position.js';

/**
 * описывает действия на игровом поле
 * @module GameManager
 *
 */
const maxValueInTheGame = 2048;
const minValueInTheGame = 2;
const ratioForMergingValues = 2;
const oddsForAppearanceTileWithMinValue = 0.9;
const startScore = 0;
const startTilesOnTheField = 1;
const sizeColAndRowInGameGrid = 4;


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
    this.startTiles = startTilesOnTheField;
    this.size = sizeColAndRowInGameGrid;
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

    this.score = startScore;
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
      let value = Math.random() > oddsForAppearanceTileWithMinValue ? minValueInTheGame * ratioForMergingValues : minValueInTheGame;
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
  move(vector) {
    if (this.over || this.won) return
    let traversals = this.buildTraversals(vector)
    let moved = false;

    console.log(123);

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
            let merged = new Tile(positions.next, tile.value * ratioForMergingValues);
            merged.mergedFrom = [tile, next]
            this.grid.insertTile(merged);
            this.grid.deleteTile(tile);
            tile.updatePosition(positions.next);

            this.score += merged.value;

            if (merged.value === maxValueInTheGame) this.won = true;
          } else {
            this.moveTile(tile, positions.farthest);
          }

          let cellPosition = new Position(cell);
          if (!cellPosition.isEqualTo(tile)) {
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

    //нужно чтобы перебор всегда шёл с самой дальней точки, поэтому мы для направлений с положительным направлением переворачиваем массив перербора 
    if (vector.hasPositiveCoord) {
      traversals.x = traversals.x.reverse();
      traversals.y = traversals.y.reverse();
    }
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
      let cellPosition = new Position(cell);
      cell = cellPosition.addCoord(vector);

    } while (this.grid.isWithinBoundary(cell) && this.grid.isCellAvailable(cell))

    return {
      farthest: previous,
      next: cell
    }
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
        cellPosition = new Position({ x: x, y: y });
        tile = this.grid.whatIsCellContent(cellPosition);
        if (tile) {
          let directions = this.inputManager.directionVectors;
          for (let i = 0; i < directions.length; i++) {
            let vector = directions[i];
            let cellPositionsForCheck = cellPosition.addCoord(vector)
            let other = this.grid.whatIsCellContent(cellPositionsForCheck);
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
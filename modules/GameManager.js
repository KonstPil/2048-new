import Tile from './Tile.js';
import Grid from './Grid.js';
import Position from './Position.js';

/**
 * описывает действия на игровом поле
 * @module GameManager
 *
 */


/** @const {Number} maxValueInTheGame максимальное значение для tile.value в игре */
const maxValueInTheGame = 2048;

/** @const {Number} minValueInTheGame минимальное значение для tile.value в игре */
const minValueInTheGame = 2;

/** @const {Number} ratioForMergingValues коэффициент увеличения tile.value при слияния двух одинаковых tile  */
const ratioForMergingValues = 2;

/** @const {Number} oddsForAppearanceTileWithMinValue вероятность появления tile со значением minValueInTheGame  */
const oddsForAppearanceTileWithMinValue = 0.9;

/** @const {Number} startScore начальное значение для score  */
const startScore = 0;

/** @const {Number} startTilesOnTheField кол-во не пустых ячеек, на начало игры  */
const startTilesOnTheField = 1;

/** @const {Number} sizeColAndRowInGameGrid кол-во колонок и столбцов на поле(размер двумерного массива, который представляет поле)  */
const sizeColAndRowInGameGrid = 4;


class GameManager {
  /**
   * действия на игровом оле
   * @param {Object} inputManager  ввод и прослушивание событий
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
    this.inputManager.on('gameLogic', this.gameLogic.bind(this));//устанавливаем callback для  inputManager, на действие 'gameLogic'
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
 * создаёт new Grid, задаёт стартовые парметры, добавляет стартовые клетки и всё это прорисовывает на поле 
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
* сохраняем текущую позицию, обнуляем данные о слиянии для всех клеток
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
* находим свободное место и добавляем туда клетку со значением зависящем от веростности oddsForAppearanceTileWithMinValue
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
* переставляем tile (и обновляем её положение) в необходимую ячейку в массиве, который представляет игровое поле, и удаляем с прошлой позиции 
* @param {Object} tile ячейка которую необходимо переставить,
* @param {Object} cell координаты на поле куда её необходимо переставить 
*/
  moveTile(tile, cell) {
    this.grid.cells[tile.y][tile.x] = null;
    this.grid.cells[cell.y][cell.x] = tile;
    tile.updatePosition(cell)
  }

  /**
* отвечает за всю игровую логику(запуск передвижений, состояние выйгрыша пройгрыша, отрисовка, добавление новой клетки)
* @param {Object} vector отражает вектор направления с данными полученных из inputManager 
*/
  gameLogic(vector) {
    if (this.over || this.won) return
    this.move(vector);

    if (this.wasMoved) {
      this.addRandomTile();
    }

    if (!this.movesAvailable()) {
      this.over = true;
    }

    this.actuate()
  }


  /**
* отвечает за передвижение клетки в двумерном массиве и слияние клеток с равнми значениями
* @param {Object} vector отражает вектор направления с данными 
*/
  move(vector) {
    let traversals = this.buildTraversals(vector)
    this.wasMoved = false;
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
            this.wasMoved = true;
          }
        }
      })
    })
  }



  /**
* находим массив отражающий порядок перебора клеток в двумерном массиве
* @param {Object} vector  отражает вектор направления с данными(какие координаты будут меняться при том или ином направлении, а так же отражает наличие положительных значений, т.е движется ли вектор вниз или вправо)
* @return {Object} отражает порядок перебора клеток в двумерном массиве
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
* находим самую дальнюю доступную для передвижения точку, а так же следующую за ней, пока не встретим препятствие или пока не выыйдем за границы поля
* @param {Object} cell текущие координаты клетки которую проверям 
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
* проверят наличие доступных ходов(остались свободные клетки или на поле есть две рядом стоящие клетки с одинаковым значением)
* @return {Boolean} true- отражает наличие хода,  false - доступных ходов нет 
*/
  movesAvailable() {
    return this.grid.isCellsAvailable() || this.tileMatchesAvailable();
  }

  /**
* есть ли места на игрвом поле где рядом находятся две одинакове по значению клетки 
* @return {Boolean} true- такие места есть ,  false - таких мест нет 
*/
  tileMatchesAvailable() {
    let tile;
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        let cellPosition = new Position({ x: x, y: y });
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
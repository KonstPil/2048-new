/**
 * описывает игрове поле
 * @module Grid
 *
 */

class Grid {
  /**
   * создать игровое поле
   * @param {Number} size  размер игровово поля соответствует и длине и ширине
   * @param {Array} cells  информация о расположении ячеек, представлена в виде двойного массива
   * @param {Function} build после создания поля сразу формирует cells
   */
  constructor(size) {
    this.size = size;
    this.cells = [];
    this.build();
  }

  /**
   * формируем массив this.cells все значения на данном этапе null
  */
  build() {
    for (let y = 0; y < this.size; y++) {
      let row = this.cells[y] = [];
      for (let x = 0; x < this.size; x++) {
        row.push(null)
      }
    }
  }


  /**
   *из свободных клеток находит случайную
   * @return {Object}  координаты x,y случайной ячейки
  */
  randomAvailableCell() {
    let cells = this.availableCells();
    if (cells.length) {
      return cells[Math.floor(Math.random() * cells.length)];

    }
  }


  /**
  *находит все пустые клетки и их координаты
  * @return {Array} массив из объектов, которые представляют координаты x,y свободных ячееек
 */
  availableCells() {
    let cells = [];
    this.forEachCell((x, y, tile) => {
      if (!tile) {
        cells.push({ x: x, y: y })
      }
    })
    return cells;
  }


  /**
  * @return {Boolean} остались свободные клетки или нет
 */
  isCellsAvailable() {
    return !!this.availableCells().length;
  }


  /**
  * хэлпер - выполняет callback для каждого элемента массива this.cells
  * @param {Function} callback  функция которая применяется к каждому элементу
 */
  forEachCell(callback) {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        callback(x, y, this.cells[y][x])
      }
    }
  }


  /**
 * вставляем переданную клетку в игровую сетку
 * @param {Object} tile представляет клетку со всеми координатами
*/
  insertTile(tile) {
    this.cells[tile.y][tile.x] = tile;
  }


  /**
* удаляет клетку из игровой сетки
* @param {Object} tile представляет клетку со всеми координатами
*/
  deleteTile(tile) {
    this.cells[tile.y][tile.x] = null;
  }


  /**
* проверяет находится ли данная позиция в пределах игрового поля
* @param {Object} position представляет координаты x,y
* @return {Boolean} в пределах или нет
*/
  isWithinBoundary(position) {
    return position.x >= 0 && position.x < this.size && position.y >= 0 && position.y < this.size;
  }

  /**
  * проверям что внутри клетки с заданными координатами
  * @param {Object} position представляет координаты x,y
  * @return {Object} Tile если клетка не пустая или null если пустая
  */
  whatIsCellContent(position) {
    if (this.isWithinBoundary(position)) {
      return this.cells[position.y][position.x]
    } else {
      return null
    }
  }

  /**
* проверяет занята данная клетка или нет
* @param {Object} position координаты клетки которую проверяем 
* @return {Boolean} занята клетка или нет
*/
  isCellOccupied(position) {
    return !!this.whatIsCellContent(position)
  }


  /**
  * свободна клетка или нет 
  * @param {Object} position координаты клетки которую проверяем 
  * @return {Boolean} свободна клетка или нет
  */
  isCellAvailable(position) {
    return !this.isCellOccupied(position)
  }
}

export default Grid;
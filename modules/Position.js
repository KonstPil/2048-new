/**
 * описывает действия с координатами 
 * @module Position
 *
 */


class Position {
  /**
  * координаты 
  * @param {Number} x  значение координаты х
  * @param {Number} y  значение координаты y
  */
  constructor(cellCoord) {
    this.x = cellCoord.x;
    this.y = cellCoord.y;
  }


  /**
* добавляем координаты coordForAdd к текущим
* @param {Object} coordForAdd координаты которые необходимо добавить 
* @return {Object} новые координаты 
*/
  addCoord(coordForAdd) {
    let newCoord = {
      x: this.x + coordForAdd.x,
      y: this.y + coordForAdd.y,
    }
    return newCoord;
  }

  /**
* проверяем равны ли две позиции(текущие и coordForCheck)
* @param {Object} coordForCheck координаты которые необходимо добавить 
* @return {Boolean} true-координаты равны, false -координаты не равны
*/

  isEqualTo(coordForCheck) {
    return this.x === coordForCheck.x && this.y === coordForCheck.y
  }
}

export default Position;
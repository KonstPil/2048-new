/**
 * данные по каждой ячейки
 * @module Tile
 *
 */

class Tile {
  /**
   * создание ячейки
   * @param {Number} x  координата x ячейки(расположение по горизонтали)
   * @param {Number} y  координата y ячейки(расположение по вертикали)
   * @param {Number} value  значение ячейки
   * @param {Object} previousPosition  объект с предыддущими координатами расположения ячейки если такие есть
   * @param {Array} mergedFrom  массив с данными о 2 ячейках, которые слились, если такое слияние было
   */
  constructor(position, value) {
    this.x = position.x;
    this.y = position.y;
    this.value = value;
    this.previousPosition = null;
    this.mergedFrom = null;
  }

  /**
   * сохраняет текущее значение положения в previousPosition, перед сменой позиции
  */
  savePosition() {
    this.previousPosition = { x: this.x, y: this.y }
  }

  /**
   * обновляет x и y при смене на указанное место(position)
   * @param {Object} position  объект с координатами
  */
  updatePosition(position) {
    this.x = position.x;
    this.y = position.y;
  }
}

export default Tile;
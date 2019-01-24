class Position {
  constructor(cellCoord) {
    this.x = cellCoord.x;
    this.y = cellCoord.y;
  }


  addCoord(coordForAdd) {
    let newCoord = {
      x: this.x + coordForAdd.x,
      y: this.y + coordForAdd.y,
    }
    return newCoord;
  }
  /**
* проверяем равны ли два позиции 
*/
  isEqualTo(coordForCheck) {
    return this.x === coordForCheck.x && this.y === coordForCheck.y
  }
}

export default Position;
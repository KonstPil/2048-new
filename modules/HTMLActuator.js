/**
 * отвечает за взаимодействие с HTML(отрисовку)
 * @module HTMLActuator
 *
 */

class HTMLActuator {
  /**
   * актуализация html 
   * @param {HTMLElement} tileContainer  содержит все tile игрового поля 
   * @param {HTMLElement} scoreContainer  содержит score
   * @param {HTMLElement} messageContainer  содержит сообщение после выйгрыша или пройгрыша
   * @param {Number} score  текущий score
   */
  constructor() {
    this.tileContainer = document.querySelector('.tile-container');
    this.scoreContainer = document.querySelector('.score-container');
    this.messageContainer = document.querySelector('.game-message');

    this.score = 0;
  }


  /**
 * перерисовка html
 * @param {Object} grid представлет игровое поле  
 * @param {Object} data данные о счёте и выйгрыше пройгрыше 
*/
  actuate(grid, data) {
    //дожидаемся обновления окна 
    window.requestAnimationFrame(() => {
      this.clearContainer(this.tileContainer);//очищаем html grid

      //перерисовываем каждую ячейку
      grid.cells.forEach(row => {
        row.forEach(cell => {
          if (cell) {
            this.addTile(cell)
          }
        })
      })

      this.updateScore(data.score);

      if (data.over) this.message(false)//выйгрыш
      if (data.won) this.message(true)//пройгрыш
    })
  }

  /**
  * удаляем все данные из container
  * @param {HTMLElement} container HTML элемент у которого необходимо удалить всех child
 */
  clearContainer(container) {
    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }
  }


  /**
  * перерисовываем ячейку с добавлением анимаций передвижения, появления, слияния
  * @param {Object} tile не пустая ячейка которую необходимо перерисовать
 */
  addTile(tile) {
    let element = document.createElement('div');
    let position = tile.previousPosition || { x: tile.x, y: tile.y };
    let positionClass = this.positionClass(position);
    let classes = ['tile', positionClass, `t${tile.value}`];
    this.applyClasses(element, classes);
    if (tile.previousPosition) {//необходимо для создания анимации перемещения т.е нам нужно сначала отрисовать прошлое положение
      window.requestAnimationFrame(() => {
        classes[1] = this.positionClass({ x: tile.x, y: tile.y });
        this.applyClasses(element, classes);
      })
    } else if (tile.mergedFrom) {
      classes.push('tile-merged');
      this.applyClasses(element, classes);

      tile.mergedFrom.forEach((merged) => {
        this.addTile(merged)
      });
    } else {
      classes.push('tile-new');
      this.applyClasses(element, classes);
    }
    this.tileContainer.appendChild(element)

  }

  /**
  * добавлеям классы к element
  * @param {HTMLElement} element элемент к которому нужно применить классы
  * @param {Array} classes массив классов которые нужно применить
 */
  applyClasses(element, classes) {
    element.className = classes.join(' ');
  }

  /**
 * добавляет 1 к x and y чтобы совпало с css классами т.к у нас положения начинаются с 0
 * @param {Object} position координаты 
*/
  normalizePosition(position) {
    return { x: position.x + 1, y: position.y + 1 }
  }

  /**
* находим css классы с положением 
* @param {Object} position координаты 
* @return css классы
*/
  positionClass(position) {
    let cssPosition = this.normalizePosition(position);
    return `tile-position-${cssPosition.y}-${cssPosition.x}`
  }

  /**
* при рестарте удаляет сообщени о пройгрыше и выйгрыше
*/
  restart() {
    this.clearMessage();
  }

  /**
 * обновляет счёт 
 * @param {Number} score текущий счёт
*/
  updateScore(score) {
    this.clearContainer(this.scoreContainer);

    let difference = score - this.score;
    this.score = score;

    this.scoreContainer.textContent = this.score;

    if (difference > 0) {
      let addition = document.createElement('div');
      addition.classList.add('score-addition');
      addition.innerHTML = `+${difference}`;
      this.scoreContainer.appendChild(addition);
    }
  }

  /**
* в зависимости от пройгрыша или выйгрыша передает соответствующее сообщение 
* @param {Boolean} won выйграли или нет
*/
  message(won) {
    let type = won ? 'game-won' : 'game-over';
    let message = won ? 'You win!' : 'Game over!';
    this.messageContainer.classList.add(type);
    this.messageContainer.querySelector('p').innerHTML = message;
  }

  /**
* удаляет сообщение при выйгрыше или пройгрыше
*/
  clearMessage() {
    this.messageContainer.classList.remove('game-over', 'game-won')
  }
}

export default HTMLActuator;
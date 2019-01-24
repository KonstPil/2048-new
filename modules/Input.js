/**
 * отвечает за ввод и прослушивание событий
 * @module InputManager
 *
 */

/** @const {Object} directionVector отражает векторы направления с данными(какие координаты будут меняться при том или ином направлении, а так же отражает наличие положительных значений, т.е движется ли вектор вниз или вправо)*/

const directionVector = {
  right: { x: 1, y: 0, hasPositiveCoord: true },
  left: { x: -1, y: 0, hasPositiveCoord: false },
  up: { x: 0, y: -1, hasPositiveCoord: false },
  down: { x: 0, y: 1, hasPositiveCoord: true }
}



class InputManager {
  /**
   * отвечает за управление
   * @param {Object} events  содержит события и callback для них
   * @param {Function} init после создания поля сразу устанавливает события которые мы прослушиваем
   */
  constructor() {
    this.events = {};
    this.directionVectors = [];
    this.init();
  }


  /**
  * устанавливаем события и для каждого соответствующий callback
  * @param {String} event название события 
  * @param {Function} callback соответствующий событию callback
 */
  on(event, callback) {
    this.events[event] = callback;
  }

  /**
  * устанавливаем прослушивание основных событий и запуск соответствующие функций при их, а так же создание массива со всеми направленияеми
 */
  init() {
    this.createArrayForDirections()
    //анимация в процессе или нет, transition не проверяем т.к он проходит быстрее чем анимация
    let animationEnd = true;
    document.addEventListener('animationstart', function () {
      animationEnd = false;
    })
    document.addEventListener('animationend', function () {
      animationEnd = true;
    })

    let mouseCoord = {};
    //находим координаты при нажатии
    document.addEventListener('mousedown', (e) => {
      e.preventDefault();
      if (e.which === 1) {
        mouseCoord.xDown = e.clientX;
        mouseCoord.yDown = e.clientY;
      }
    });

    //находим координаты при отпускани кнопки
    document.addEventListener('mouseup', (e) => {
      e.preventDefault();
      if (e.which === 1) {
        mouseCoord.xUp = e.clientX;
        mouseCoord.yUp = e.clientY;
      }
      let whichDirection = this.findDirectionVector(mouseCoord);
      if (whichDirection !== undefined && animationEnd) {
        this.start('gameLogic', whichDirection);
      }
      mouseCoord = {};
    });


    //нажитие на кнопку 'переиграть'
    let retry = document.querySelector('.retry-button');
    retry.addEventListener('click', this.restart.bind(this))
  }




  /**
    * находим вектор направления движения 
    * @param {Object} coordDownAndUp содержит координаты нажатия и отпускания мыши 
    * @return {Object} отражает какие координаты будут меняться при том или ином направлении, а так же отражает наличие положительных значений, т.е движется ли вектор вниз или вправо
  */
  findDirectionVector(coordDownAndUp) {
    let xVector = coordDownAndUp.xDown > coordDownAndUp.xUp;
    let yVector = coordDownAndUp.yDown > coordDownAndUp.yUp;
    let xDiff = Math.abs(coordDownAndUp.xDown - coordDownAndUp.xUp);
    let yDiff = Math.abs(coordDownAndUp.yDown - coordDownAndUp.yUp);
    if (!xVector && xDiff > yDiff) {
      return directionVector.right
    } else if (xVector && xDiff > yDiff) {
      return directionVector.left
    } else if (!yVector && yDiff > xDiff) {
      return directionVector.down
    } else if (yVector && yDiff > xDiff) {
      return directionVector.up
    }
  }


  /**
    * создаём массив из существующих векторов движения
  */
  createArrayForDirections() {
    for (let i in directionVector) {
      this.directionVectors.push(directionVector[i])
    }
  }

  /**
    *запускаем callback  - 'gameLogic', которую задаем в gameManager
    * @param {String} event название события 
    * @param {Object} data аргумент для cb
  */
  start(event, data) {
    let callback = this.events[event];
    callback(data);
  }

  /**
    *запускаем callback - функцию restart, которую задаем в gameManager
    * @param {Object} event событие
  */
  restart(event) {
    event.preventDefault();
    let callback = this.events['restart'];
    callback();
  }
}

export default InputManager;
class InputManager {
  constructor() {
    this.events = {};
    this.listen();
  }

  //устанавливаем callback и ждём нажатия кнопки чтобы запустить
  on(event, callback) {
    this.events[event] = callback;
  }

  //какая кнопка нажата
  listen() {
    let mouseCoord = {};



    //анимация в процессе или нет, transition не проверяем т.к он проходит быстрее чем анимация
    let animationEnd = true;
    document.addEventListener('animationstart', function () {
      animationEnd = false;
    })
    document.addEventListener('animationend', function () {
      animationEnd = true;
    })





    //находим координаты 
    document.addEventListener('mousedown', (e) => {
      e.preventDefault();
      if (e.which === 1) {
        mouseCoord.xDown = e.clientX;
        mouseCoord.yDown = e.clientY;
      }
    });


    document.addEventListener('mouseup', (e) => {
      e.preventDefault();
      if (e.which === 1) {
        mouseCoord.xUp = e.clientX;
        mouseCoord.yUp = e.clientY;
      }

      let whichDirection = this.findDirection(mouseCoord);
      if (whichDirection !== undefined && animationEnd) {
        this.start('move', whichDirection);
      }
    });




    let retry = document.querySelector('.retry-button');
    retry.addEventListener('click', this.restart.bind(this))
  }




  /**
    *обрабатываем полученный координаты нажатий мыши, и передаём нужный массив в метод действия 
  */
  findDirection(coordDownAndUp) {
    let xVector = coordDownAndUp.xDown > coordDownAndUp.xUp;
    let yVector = coordDownAndUp.yDown > coordDownAndUp.yUp;
    let xDiff = Math.abs(coordDownAndUp.xDown - coordDownAndUp.xUp);
    let yDiff = Math.abs(coordDownAndUp.yDown - coordDownAndUp.yUp);
    if (!xVector && xDiff >= yDiff) {
      return 1//right
    } else if (xVector && xDiff > yDiff) {
      return 3//left
    } else if (!yVector && yDiff >= xDiff) {
      return 2//down
    } else if (yVector && yDiff > xDiff) {
      return 0//up
    }
  }




  //запускаем callback - функцию move, которую задаем в gameManager и передаем значение нажатой клавиши
  start(event, data) {
    let callback = this.events[event];
    callback(data);
  }

  restart(event) {
    event.preventDefault();
    let callback = this.events['restart'];
    callback();
  }
}
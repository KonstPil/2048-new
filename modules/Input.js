class InputManager {
  constructor() {
    this.events = {};
    this.listen()
  }

  //устанавливаем callback и ждём нажатия кнопки чтобы запустить
  on(event, callback) {
    this.events[event] = callback;
  }

  //какая кнопка нажата
  listen() {
    let map = {
      38: 0,
      39: 1,
      40: 2,
      37: 3
    }
    document.addEventListener('keydown', (e) => {
      e.preventDefault();
      let whickKey = map[e.which]
      if (whickKey !== undefined) {
        this.start('move', whickKey);
      }
    })
  }

  //запускаем callback - функцию move, которую задаем в gameManager и передаем значение нажатой клавиши
  start(event, data) {
    let callback = this.events[event];
    callback(data);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  window.requestAnimationFrame(function () {
    new GameManager(InputManager, HTMLActuator)
  })
})
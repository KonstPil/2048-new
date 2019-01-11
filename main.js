import GameManager from './modules/GameManager.js';
import HTMLActuator from './modules/HTMLActuator.js';
import InputManager from './modules/Input.js';

/** 
 *  @file игра 2048
 *
 */

document.addEventListener("DOMContentLoaded", function () {
  window.requestAnimationFrame(function () {
    new GameManager(InputManager, HTMLActuator)
  })
})
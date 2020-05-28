import KEYS from './keys.js';
import Keyboard from './keyboard.js';

window.onload = () => {
  const pageContainer = document.createElement('div');
  pageContainer.classList.add('page-container');
  document.body.append(pageContainer);

  const info = document.createElement('p');
  info.innerHTML = 'In order to change language press: <strong>left Ctrl + left Shift</strong>.<br> Virtual keyboard is made for Mac OS, and the placement of keys can differ on Windows.';
  info.classList.add('information');
  pageContainer.append(info);

  const textarea = document.createElement('textarea');
  textarea.classList.add('text');
  pageContainer.append(textarea);

  const keyboardWrapper = document.createElement('div');
  keyboardWrapper.classList.add('keyboard');
  pageContainer.append(keyboardWrapper);

  const keyboard = new Keyboard(KEYS, keyboardWrapper);

  const pressMouseBtn = (event) => {
    if (event.target.tagName === 'BUTTON') {
      keyboard.changeState(event.target.dataset.keyCode, event.type);
      textarea.value = keyboard.type(event.target, textarea.value);
    }
  };

  const releaseMouseBtn = (event) => {
    const code = (event.target.dataset.keyCode) ? event.target.dataset.keyCode : '';
    keyboard.changeState(code, event.type);
  };

  const pressKey = (event) => {
    event.preventDefault();
    const key = keyboard.view.querySelector(`[data-key-code="${event.code}"]`);

    if (key) {
      keyboard.changeState(event.code, event.type);
      if (event.type === 'keydown') {
        textarea.value = keyboard.type(key, textarea.value);
      }
    }
  };

  keyboardWrapper.addEventListener('mousedown', pressMouseBtn);
  textarea.focus();
  textarea.addEventListener('blur', () => textarea.focus());
  document.addEventListener('click', releaseMouseBtn);
  document.addEventListener('keydown', pressKey);
  document.addEventListener('keyup', pressKey);

  window.addEventListener('blur', () => {
    if (keyboard.pressed.includes('CapsLock')) {
      keyboard.pressed = ['CapsLock'];
    } else {
      keyboard.pressed = [];
      keyboard.toggleActiveKeys();
    }
  });
};

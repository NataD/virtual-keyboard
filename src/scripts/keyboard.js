export default class {
  constructor(keys, view) {
    this.keys = keys;
    this.view = view;
    this.isCapslockPressed = false;
    this.pressed = [];
    this.language = this.getLanguage();
    this.createKeyboard();
  }

  createKeyboard() {
    let currentRow;
    this.keys.forEach((key) => {
      if (currentRow !== key.row) {
        const row = document.createElement('div');
        row.classList.add('keyboard-row');
        this.view.append(row);
        currentRow = key.row;
      }

      const button = document.createElement('button');
      button.dataset.keyCode = key.code;

      if (key.classes) {
        button.classList = key.classes;
      }

      button.innerHTML = key.isSpecial ? key.name : key[this.language];
      this.view.querySelectorAll('.keyboard-row')[currentRow].append(button);
    });
  }

  changeState(code, type) {
    this.press(code, type);
    this.updateKeys();
    this.toggleActiveKeys();
    this.switchLanguage();
  }

  updateKeys() {
    this.view.querySelectorAll('button')
      .forEach((button) => {
        const keyData = this.getButtonInfo(button);
        if (!keyData.isSpecial) {
          let updated = keyData[this.language];

          if (this.isPressed('Shift')
          || (this.isPressed('Shift') && this.isPressed('CapsLock'))) {
            updated = keyData[`${this.language}Shift`];
          } else if (this.isPressed('CapsLock')) {
            updated = keyData[this.language].toUpperCase();
          }

          document.querySelector(`[data-key-code="${keyData.code}"]`).innerHTML = updated;
        }
      });
  }

  getLanguage() {
    let currentLanguage = 'en';
    if (!localStorage.getItem('language')) {
      this.setLanguage(currentLanguage);
    } else {
      currentLanguage = localStorage.getItem('language');
    }
    return currentLanguage;
  }

  setLanguage(language = this.language) {
    localStorage.setItem('language', language);
    return this;
  }

  switchLanguage() {
    if (this.isPressed('ShiftLeft') && this.isPressed('ControlLeft')) {
      this.language = (this.language === 'en') ? 'ua' : 'en';
      this.setLanguage(this.language);
    }
  }

  getButtonInfo(button) {
    return this.keys.filter((key) => key.code === button.dataset.keyCode)[0];
  }

  press(code, event) {
    if (code === 'CapsLock') {
      switch (event) {
        case 'mousedown':
        case 'keydown':
        case 'keyup':
          this.isCapslockPressed = !this.isCapslockPressed;
          break;
        default:
      }
    } else if (code !== 'CapsLock') {
      switch (event) {
        case 'keydown':
        case 'mousedown':
          if (!this.isPressed(code)) {
            this.pressed.push(code);
          }
          break;
        case 'keyup':
        case 'click':
          if (this.isPressed(code)) {
            this.pressed.splice(this.pressed.indexOf(code), 1);
          }
          break;
        default:
      }
    }
  }

  type(button, text) {
    const data = this.getButtonInfo(button);
    let updated = text;
    if (data.isSpecial) {
      switch (data.code) {
        case 'Backspace':
          updated = updated.slice(0, -1); break;
        case 'Tab':
          updated = `${updated}\t`; break;
        case 'Enter':
          updated = `${updated}\n`; break;
        case 'Space':
          updated = `${updated} `; break;
        default:
          updated = text;
      }
    } else if (this.isPressed('Shift')) {
      updated += data[`${this.language}Shift`];
    } else if (this.isPressed('CapsLock')) {
      updated += data[this.language].toUpperCase();
    } else {
      updated += data[this.language];
    }
    return updated;
  }

  toggleActiveKeys() {
    this.view.querySelectorAll('button').forEach((button) => {
      if (!this.isPressed(button.dataset.keyCode)) button.classList.remove('active');
    });
    this.pressed.forEach((key) => this.view.querySelector(`[data-key-code="${key}"]`).classList.add('active'));
    if (this.isCapslockPressed) {
      this.view.querySelector('[data-key-code="CapsLock"]').classList.add('active');
    }
  }

  isPressed(keyName) {
    return (keyName === 'CapsLock') ? this.isCapslockPressed : this.pressed.some((key) => key.includes(keyName));
  }
}


function fixColor(color) {
  if (color === 'green') color = [50, 160, 50];
  if (color === 'red') color = [130, 40, 40];
  return color;
}

export class Notification {
  constructor(text = 'No text input!', color = [130, 40, 40]) {
    this.color = fixColor(color);
    this.element = document.createElement('div');
    this.element.className = 'notification';
    this.element.style.backgroundColor = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, 0.95)`
    this.editText(text);
    this.ondestroy = () => {};
  }

  smoothDestroy() {
    this.element.classList.add('fade');
    this.element.classList.add('hidden');
    setTimeout(() => {
      this.ondestroy();
    }, 300);
  }

  editText(text) {
    this.element.innerHTML = `<div class="notificationText">${text}</div>`;
  }

  editColor(color) {
    this.color = fixColor(color);
    this.element.style.backgroundColor = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, 0.95)`;
  }

  destroyIn(time) {
    setTimeout(() => {
      this.smoothDestroy();
    }, time * 1000);
  }
}

export class NotificationTimed extends Notification {
  constructor(text, time = 2, color) {
    super(text, color);
    setTimeout(() => {
      this.smoothDestroy();
    }, time * 1000);
  }
}

export class NotificationManual extends Notification {
  constructor(text, color) {
    super(text, color);
    this.button = document.createElement('button');
    this.button.innerText = 'X';
    this.button.className = 'notificationButton';
    this.button.style.backgroundColor = `rgb(${this.color[0] - 20}, ${this.color[1] - 20}, ${this.color[2] - 20})`;
    this.button.onclick = () => {
      this.ondestroy();
    }
    this.element.appendChild(this.button);
  }
}

export class NotificationBar {
  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'notificationBar';
  }

  notify(notification) {
    this.element.appendChild(notification.element);
    notification.ondestroy = () => {
      this.element.removeChild(notification.element);
    };
  }
}
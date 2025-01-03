export class Page {
  constructor() {
    this.name = 'unnamed';
    this.element = document.createElement('div');
    this.initialized = false;
    this.initializing = false;
  }

  async Initialize() {}

  async initializeHTML(src) {
    if (this.initializing) {
      return new Promise((resolve, _reject) => {
        setInterval(() => {
          if (this.initialized) {
            resolve(true);
            clearInterval();
          }
        }, 10);
      });
    }
    this.initializing = true;
    const data = await fetch('/src/pages/' + src);
    if (data.ok) this.element.innerHTML = await data.text();
    this.initialized = true;
  }
}
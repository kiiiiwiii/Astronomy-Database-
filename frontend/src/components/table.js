export class Table {
  constructor(data) {
    this.isTable = true;
    this.element = document.createElement('table');
    this.data = data;
    this.initializing = false;
    this.initialized = false;
    this.Initialize();
  }

  async Initialize() {
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
    for (const row of this.data) {
      const tr = document.createElement('tr');
      for (const value of row) {
        const td = document.createElement('td');
        if (value instanceof Table) {
          td.innerHTML = 'retrieving...';
          (async() => { 
            td.innerHTML = '';
            await value.appendToParent(td); 
          })();
        } else if (value instanceof Promise) {
          td.innerHTML = 'retrieving...';
          (async() => { td.innerHTML = await value; })();
        } else if (typeof value === 'number') {
          td.innerHTML = Math.floor(value * 1000000000) / 1000000000;
        } else {
          td.innerHTML = value;
        }
        tr.appendChild(td);
      }
      this.element.appendChild(tr);
    }
    this.initialized = true;
  }

  async appendToParent(parent) {
    await this.Initialize();
    parent.appendChild(this.element);
  }
}
import { Network } from '../utils/network.js';
import { NotificationManual, NotificationTimed } from './notification.js';
import { Table } from './table.js';

class QueryComponentSet {
  constructor(parameters, options = {}) {
    const div = this.element = options?.element ?? document.createElement('div');
    this.components = new Map();
    for (let paramName in parameters) {
      const component = new QueryComponent(parameters[paramName]);
      div.appendChild(component.element);
      this.components.set(paramName, component);
    }
  }

  getValue() {
    const params = {};
    for (const [name, component] of this.components) {
      params[name] = component.getValue();
    }
    return params;
  }
}

class QueryComponent {
  constructor(parameter) {
    this.type = parameter.type;
    if (parameter.type === "number" || parameter.type === "string") {
      let input;
      if (parameter.values) {
        input = document.createElement('select');
        for (let value of parameter.values) {
          const option = document.createElement('option');
          option.innerText = value;
          option.value = value;
          input.appendChild(option)
        }
      } else {
        input = document.createElement('input');
        input.placeholder = parameter.display;
        input.type = parameter.type;
      }
      this.element = input;
    } else if (parameter.type === "set") {
      const div = document.createElement('div');
      div.className = 'querySet';
      div.innerHTML = `${parameter.display}<br>`;
      const addButton = document.createElement('button');
      const resetButton = document.createElement('button');
      addButton.innerHTML = `Add ${parameter.componentName}`;
      resetButton.innerHTML = `Reset ${parameter.componentName}s`;
      div.appendChild(addButton);
      div.appendChild(resetButton);
      resetButton.style.marginTop = '5px';
      this.sets = [];
      addButton.onclick = () => {
        const inner = document.createElement('div');
        inner.className = 'querySetComponent';
        inner.innerHTML = `${parameter.componentName} ${this.sets.length + 1}`;
        this.sets.push(new QueryComponentSet(parameter.componentParameters, { element: inner }));
        div.appendChild(inner);
      };
      resetButton.onclick = () => {
        for (let set of this.sets) {
          div.removeChild(set.element);
        }
        this.sets = [];
      }
      this.element = div;
    } else {
      const div = document.createElement('div');
      div.innerText = `Invalid Input Type "${parameter.type}"`;
      this.element = div;
    }
  }

  getValue() {
    if (this.type === 'number' || this.type === 'string') {
      return this.element.value;
    } else if (this.type === 'set') {
      return this.sets.map(cset => cset.getValue());
    }
    return undefined;
  }
}

export class QueryInput {
  constructor(data) {
    const div = this.element = document.createElement('div');
    div.className = 'queryInput';
    div.innerHTML = `
      <strong style="font-size:20px">${data.name}</strong>
      <p>${data.description}</p>
    `;

    const queryComponents = new QueryComponentSet(data.parameters, { element: div });

    let table = null;
    const submitBtn = document.createElement('button');
    div.appendChild(submitBtn);
    submitBtn.innerText = 'Submit';
    submitBtn.onclick = async () => {
      const params = queryComponents.getValue();
      console.log(params);
      const response = await Network.fetch(`/query/${data.id}/${JSON.stringify(params)}`);
      if (!response || response.error) {
        console.error('Error response:', response);
        window.notificationBar.notify(new NotificationManual(response?.error || 'Unknown error', 'red'));
        return;
      }
      if (data.updateTable) {
        if (typeof data.updateTable === 'string') {
          window.pageManager.pages.get(data.updateTable).Initialize();
        } else {
          for (let table of data.updateTable) {
            window.pageManager.pages.get(table).Initialize();
          }
        }
      }
      if (typeof response.result === 'string') {
        return window.notificationBar.notify(new NotificationTimed(response.result, 2, 'green'));
      }
      if (table) {
        div.removeChild(table.element);
      }
      table = new Table(response.result);
      div.appendChild(table.element);
    };
  }
}

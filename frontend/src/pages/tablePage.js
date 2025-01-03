import { Network } from '../utils/network.js';
import { Page } from './page.js';
import { Table } from '../components/table.js';
import { NotificationManual } from '../components/notification.js';

export class TablePage extends Page {
  constructor() {
    super();
    this.name = 'Table';
    this.tableName = 'Table';
  }

  async Initialize() {
    // await super.initializeHTML(`${this.name.toLowerCase()}.html`);
    const info = await Network.fetch('./table-info/' + this.tableName);
    const data = await Network.fetch('./table/' + this.tableName);
    if (data.result && info.result) {
      const tableData = [info.result.map(x => x[0]), ...data.result];
      const table = new Table(tableData);
      if (this.tableElement) {
        this.element.replaceChild(table.element, this.tableElement);
      } else {
        this.element.appendChild(table.element);
      }
      this.tableElement = table.element;
    } else {
      window.notificationBar.notify(new NotificationManual(data.error ?? info.error, 'red'));
    }
  }
}
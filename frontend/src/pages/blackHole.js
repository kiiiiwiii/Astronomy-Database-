import { TablePage } from './tablePage.js';
import { Network } from '../utils/network.js';
import { Table } from '../components/table.js';
import { NotificationManual } from '../components/notification.js';

export class BlackHole extends TablePage {
  constructor() {
    super();
    this.name = 'Black Hole';
    this.tableName = 'Black_Hole';
  }
}
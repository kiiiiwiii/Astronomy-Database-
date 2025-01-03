import { Notification, NotificationManual, NotificationTimed } from '../components/notification.js';
import { Network } from '../utils/network.js';
import { Page } from './page.js';

export class Home extends Page {
  constructor() {
    super();
    this.name = 'Home';
  }

  async Initialize() {
    await super.initializeHTML('home.html');
    const resetButton = document.getElementById('reset');
    resetButton.onclick = async () => {
      const notif = new Notification('Initializating...', 'green');
      window.notificationBar.notify(notif);
      const response = await Network.fetch('/initialize', {
        method: 'POST'
      });
      if (response.result) {
        notif.editText('Initialization success!');
        notif.destroyIn(2);
      } else {
        notif.ondestroy();
        window.notificationBar.notify(new NotificationManual(response.error, 'red'));
      }
      for (let [ _pageName, pageObject ] of window.pageManager.pages) {
        pageObject.Initialize();
      }
    };
  }
}
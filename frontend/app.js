import { TabBar } from './src/components/tab.js';
import { PageManager } from './src/components/pageManager.js';
import { Home } from './src/pages/home.js';
import { Galaxy } from './src/pages/galaxy.js';
import { NotificationBar, Notification, NotificationManual, NotificationTimed } from './src/components/notification.js';
import { Network } from './src/utils/network.js';
import { Halo } from './src/pages/halo.js';
import { BlackHole } from './src/pages/blackHole.js';
import { Star } from './src/pages/star.js';
import { StarCluster } from './src/pages/starCluster.js';
import { Nebula } from './src/pages/nebula.js';
import { PlanetaryBody } from './src/pages/planetaryBody.js';
import { Moon } from './src/pages/moon.js';
import { QueryInput } from './src/components/queryInput.js';


// tabs & pages
const pageManager = window.pageManager = new PageManager([
  new Home(),
  new Galaxy(),
  new Halo(),
  new BlackHole(),
  new Star(),
  new StarCluster(),
  new Nebula(),
  new PlanetaryBody(),
  new Moon()
]);
const pageContainer = document.getElementById('page-container');
pageContainer.appendChild(pageManager.element);

const tabBar = new TabBar([ 'Home', 'Galaxy', 'Halo', 'Black Hole', 'Star', 'Star Cluster', 'Nebula', 'Planetary Body', 'Moon' ]);
tabBar.onchange = (tabName) => {
  pageManager.setPage(tabName);
};
const tabContainer = document.getElementById('tab-container');
tabContainer.appendChild(tabBar.element);

// notifications
const notificationBar = new NotificationBar();
window.notificationBar = notificationBar; // global
document.body.appendChild(notificationBar.element);

// network notif
(async () => {
  const notif = new Notification('Connection to database...', 'green');
  notificationBar.notify(notif);
  const connected = await Network.fetch('/check-db-connection');
  if (connected.result) {
    notif.editText('Connected to database!');
    notif.destroyIn(1.5);
  }
})();

// initialize sql queries
async function initQuery(name) {
  const queryData = await Network.fetch('/default/' + name + '.json');
  const ui = new QueryInput(queryData);
  const page = pageManager.pages.get(queryData.tab);
  if (!page) {
    notificationBar.notify(new NotificationManual('Invalid tab in ' + name + '.json ' + ' ' + queryData.tab, 'red'));
    return;
  }
  page.element.appendChild(document.createElement('br'));
  page.element.appendChild(ui.element);
}

pageManager.onInit = async () => {
  const list = await Network.fetch('/list.json');
  for (let name of list) {
    initQuery(name);
  }
};
export class TabBar {
  constructor(tabNames) {
    this.element = document.createElement('div');
    this.element.className = 'tabBar';
    this.tabs = [];
    this.onchange = function(_newTabName) {};
    for (const tabName of tabNames) {
      const tabButton = new TabButton(tabName, (tabBtn) => {
        this.currentTab?.element.classList.remove('tabButtonSelected');
        tabBtn.element.classList.add('tabButtonSelected');
        this.currentTab = tabBtn;
        this.onchange(tabBtn.name);
      });
      this.element.appendChild(tabButton.element);
      this.tabs.push(tabButton);
    }
    this.currentTab = this.tabs[0];
    this.currentTab.element.click();
  }
}

export class TabButton {
  constructor(tabName, onclick) {
    this.name = tabName;
    this.element = document.createElement('button');
    this.element.className = 'tabButton';
    this.element.textContent = tabName;
    this.element.addEventListener('click', () => {
      onclick(this);
    });
  }
}
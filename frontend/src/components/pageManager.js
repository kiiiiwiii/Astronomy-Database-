export class PageManager {
  constructor(pages = []) {
    this.element = document.createElement('div');
    this.pages = new Map(pages.map(page => [ page.name, page ]));
    this.inited = 0;
    this.onInit = () => {};
    for (const page of pages) {
      page.element.style.display = 'none';
      this.element.appendChild(page.element);
      page.Initialize().then(() => {
        this.inited++;
        if (this.inited === pages.length) {
          this.onInit();
        }
      });
    }
    this.setPage(pages[0].name);
  }

  setPage(pageName) {
    for (const [_name, page] of this.pages) {
      page.element.style.display = 'none';
    }
    const page = this.pages.get(pageName);
    if (!page) return console.warn('Unknown page ' + pageName);
    // if (!page.initialized) page.Initialize?.();
    page.element.style.display = 'block';
    this.on = page;
  }
}
/** Navegación base: Playwright aplica esperas automáticas en acciones posteriores. */
export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto(url) {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }
}

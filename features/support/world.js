import { setWorldConstructor, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium } from "@playwright/test";

class CustomWorld {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.pages = {};
  }

  async start() {
    const headed = process.env.HEADED === "true";
    this.browser = await chromium.launch({ headless: !headed });
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();
  }

  async stop() {
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}

setWorldConstructor(CustomWorld);
setDefaultTimeout(30000);

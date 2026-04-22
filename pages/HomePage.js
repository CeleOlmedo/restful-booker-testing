import { BasePage } from "./BasePage.js";
import { URLS } from "../constants/urls.js";

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.locators = {
      homeContainer: "body",
      contactSection: "#contact"
    };
  }

  async open() {
    await this.goto(URLS.home);
  }

  async isLoaded() {
    return this.isVisible(this.locators.homeContainer);
  }

  async goToContactSection() {
    await this.page.locator(this.locators.contactSection).scrollIntoViewIfNeeded();
  }
}

export { HomePage };

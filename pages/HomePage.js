import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";
import { URLS } from "../constants/urls.js";

export class HomePage extends BasePage {
  headingWelcome = () =>
    this.page.getByRole("heading", { name: /Welcome to Shady Meadows/i });

  async open() {
    await this.goto(URLS.home);
  }

  async assertLoaded() {
    await expect(this.headingWelcome()).toBeVisible();
  }
}

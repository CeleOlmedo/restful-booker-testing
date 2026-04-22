import fs from "node:fs";
import path from "node:path";
import { Before, After } from "@cucumber/cucumber";
import { HomePage } from "../../pages/HomePage.js";
import { ContactPage } from "../../pages/ContactPage.js";
import { BookingPage } from "../../pages/BookingPage.js";
import { AdminPage } from "../../pages/AdminPage.js";
import { RoomsAdminPage } from "../../pages/RoomsAdminPage.js";

Before(async function () {
  await this.start();
  this.pages.homePage = new HomePage(this.page);
  this.pages.contactPage = new ContactPage(this.page);
  this.pages.bookingPage = new BookingPage(this.page);
  this.pages.adminPage = new AdminPage(this.page);
  this.pages.roomsPage = new RoomsAdminPage(this.page);
});

After(async function (scenario) {
  const shouldCaptureOnFail = process.env.SCREENSHOT_ON_FAIL === "true";

  if (shouldCaptureOnFail && scenario.result?.status === "FAILED") {
    const safeName = scenario.pickle.name.replace(/[^a-zA-Z0-9-_]/g, "_");
    const screenshotsDir = path.resolve("reports/screenshots");
    fs.mkdirSync(screenshotsDir, { recursive: true });
    await this.page.screenshot({
      path: path.join(screenshotsDir, `${Date.now()}-${safeName}.png`),
      fullPage: true
    });
  }

  await this.stop();
});

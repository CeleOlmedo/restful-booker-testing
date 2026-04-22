import {
  BeforeAll,
  AfterAll,
  Before,
  After,
  Status,
} from "@cucumber/cucumber";
import { chromium } from "playwright";
import { HomePage } from "../../pages/HomePage.js";
import { ContactPage } from "../../pages/ContactPage.js";
import { BookingPage } from "../../pages/BookingPage.js";
import { AdminPage } from "../../pages/AdminPage.js";
import { RoomsAdminPage } from "../../pages/RoomsAdminPage.js";

let globalBrowser;

BeforeAll(async function () {
  const slowMo = Number(process.env.SLOWMO ?? 0);
  globalBrowser = await chromium.launch({
    headless: process.env.HEADED !== "true",
    slowMo: Number.isFinite(slowMo) ? slowMo : 0,
  });
});

Before(async function () {
  this.browser = globalBrowser;
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();

  this.pages.homePage = new HomePage(this.page);
  this.pages.contactPage = new ContactPage(this.page);
  this.pages.bookingPage = new BookingPage(this.page);
  this.pages.adminPage = new AdminPage(this.page);
  this.pages.roomsPage = new RoomsAdminPage(this.page);
});

After(async function (scenario) {
  try {
    if (scenario.result?.status === Status.FAILED && this.page) {
      const png = await this.page.screenshot({ fullPage: true });
      if (typeof this.attach === "function") {
        await this.attach(png, "image/png");
      }
    }
  } finally {
    if (this.page) await this.page.close().catch(() => {});
    if (this.context) await this.context.close().catch(() => {});
  }
});

AfterAll(async function () {
  if (globalBrowser) await globalBrowser.close();
});

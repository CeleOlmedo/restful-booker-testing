import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";
import { URLS } from "../constants/urls.js";
import { MESSAGES } from "../constants/messages.js";

export class ContactPage extends BasePage {
  section = () => this.page.locator("#contact");
  heading = () => this.page.getByRole("heading", { name: /Send Us a Message/i });
  nameInput = () => this.page.locator("#name");
  emailInput = () => this.page.locator("#email");
  phoneInput = () => this.page.locator("#phone");
  subjectInput = () => this.page.locator("#subject");
  messageInput = () => this.page.locator("#description");
  submitButton = () => this.page.getByRole("button", { name: "Submit" });

  async open() {
    await this.goto(URLS.contact);
    await expect(this.heading()).toBeVisible();
  }

  async assertFormVisible() {
    await expect(this.section()).toBeVisible();
    await expect(this.submitButton()).toBeVisible();
  }

  async assertContactFormVisible() {
    const { expect } = await import("@playwright/test");
    await expect(this.page.locator(this.locators.section)).toBeVisible();
  }

  async completeContactForm(data) {
    await this.nameInput().fill(data.Nombre ?? "");
    await this.emailInput().fill(data.Email ?? "");
    await this.phoneInput().fill(data.Telefono ?? "");
    await this.subjectInput().fill(data.Asunto ?? "");
    await this.messageInput().fill(data.Mensaje ?? "");
  }

  async submit() {
    await this.submitButton().click();
  }

  async assertSubmissionSuccess() {
    const pattern = MESSAGES.contactSuccess;
    const successLine = this.section().getByText(pattern).first();
    if ((await successLine.count()) > 0) {
      await expect(successLine).toBeVisible();
      return;
    }
    await expect(this.nameInput()).toHaveValue("");
    await expect(this.emailInput()).toHaveValue("");
  }

  async assertSubmissionBlocked() {
    await expect(
      this.section().getByText(/must be|may not be blank|between|required|valid|well-formed/i).first()
    ).toBeVisible();
  }

  async assertErrorByKey(messageKey) {
    const pattern = MESSAGES[messageKey];
    expect(pattern, `Sin mensaje para clave: ${messageKey}`).toBeTruthy();
    await expect(this.section().getByText(pattern).first()).toBeVisible();
  }

  async assertInvalidFieldsVisible() {
    await expect(this.section().locator(".is-invalid").first()).toBeVisible();
  }
}

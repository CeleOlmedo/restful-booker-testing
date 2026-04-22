import { BasePage } from "./BasePage.js";

class ContactPage extends BasePage {
  constructor(page) {
    super(page);
    this.locators = {
      section: "#contact",
      form: "#contact form",
      name: "#name",
      email: "#email",
      phone: "#phone",
      subject: "#subject",
      message: "#description",
      submitButton: "#submitContact",
      successAlert: ".alert.alert-success",
      errorPanel: ".alert.alert-danger",
      firstInvalidField: ":invalid"
    };
  }

  async isContactFormVisible() {
    return this.isVisible(this.locators.section);
  }

  async assertContactFormVisible() {
    const { expect } = await import("@playwright/test");
    await expect(this.page.locator(this.locators.section)).toBeVisible();
  }

  async completeContactForm(data) {
    await this.fill(this.locators.name, data.Nombre || "");
    await this.fill(this.locators.email, data.Email || "");
    await this.fill(this.locators.phone, data.Telefono || "");
    await this.fill(this.locators.subject, data.Asunto || "");
    await this.fill(this.locators.message, data.Mensaje || "");
  }

  async submit() {
    await this.page.locator(this.locators.form).evaluate((form) => form.requestSubmit());
  }

  async getSuccessMessage() {
    return this.page.locator(this.locators.successAlert).innerText();
  }

  async waitForSuccessfulSubmit() {
    const { expect } = await import("@playwright/test");
    await expect(this.page.locator(this.locators.successAlert)).toBeVisible();
  }

  async getValidationMessageFor(locator) {
    return this.page.locator(locator).evaluate((el) => el.validationMessage);
  }

  async getEmailValidationMessage() {
    return this.getValidationMessageFor(this.locators.email);
  }

  async getValidationMessageByFieldName(fieldName) {
    const fieldMapping = {
      Nombre: this.locators.name,
      Email: this.locators.email,
      Telefono: this.locators.phone,
      Asunto: this.locators.subject,
      Mensaje: this.locators.message
    };
    const locator = fieldMapping[fieldName];

    if (!locator) {
      throw new Error(`Campo no soportado para validación: ${fieldName}`);
    }

    return this.getValidationMessageFor(locator);
  }

  async assertValidationErrorPanelVisible() {
    const { expect } = await import("@playwright/test");
    const panel = this.page.locator(this.locators.errorPanel);
    await expect(panel).toBeVisible();
    await expect(panel.locator("p").first()).toBeVisible();
  }

  async getFieldValue(locator) {
    return this.page.locator(locator).inputValue();
  }

  async getInvalidFieldsCount() {
    return this.page.locator(this.locators.firstInvalidField).count();
  }
}

export { ContactPage };

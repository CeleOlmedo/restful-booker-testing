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
      firstInvalidField: ":invalid"
    };
  }

  async isContactFormVisible() {
    return this.isVisible(this.locators.section);
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

  async getValidationMessageFor(locator) {
    return this.page.locator(locator).evaluate((el) => el.validationMessage);
  }

  async getFieldValue(locator) {
    return this.page.locator(locator).inputValue();
  }

  async getInvalidFieldsCount() {
    return this.page.locator(this.locators.firstInvalidField).count();
  }
}

export { ContactPage };

import assert from "node:assert/strict";
import { Given, When, Then } from "@cucumber/cucumber";
import { MESSAGES } from "../../constants/messages.js";

Given("el usuario navega a la página de contacto", async function () {
  await this.pages.homePage.open();
  await this.pages.homePage.goToContactSection();
  this.currentFormTarget = "contact";
});

Given("el formulario de contacto está visible", async function () {
  const visible = await this.pages.contactPage.isContactFormVisible();
  assert.equal(visible, true, "El formulario de contacto no está visible.");
});

When("envia el formulario de contacto", async function () {
  await this.pages.contactPage.submit();
});

Then("el sistema muestra confirmación observable de envío exitoso", async function () {
  await this.page.waitForTimeout(500);
  const currentName = await this.pages.contactPage.getFieldValue("#name");
  assert.equal(currentName, "", "No se evidenció envío exitoso del formulario.");
});

Then("el sistema impide el envío", async function () {
  const validationMessage = await this.pages.contactPage.getValidationMessageFor("#email");
  const hasNativeValidation = validationMessage.length > 0;
  assert.equal(hasNativeValidation, true, "No se detectó validación de bloqueo.");
});

Then("muestra el error con clave {string} en el campo {string}", async function (messageKey, field) {
  const mapping = { Email: "#email" };
  const selector = mapping[field] || "#email";
  const validationMessage = await this.pages.contactPage.getValidationMessageFor(selector);
  assert.equal(validationMessage.length > 0, true, "No se encontró error en el campo esperado.");
  const expectedPattern = MESSAGES[messageKey];
  assert.ok(expectedPattern, `No existe el mensaje con clave: ${messageKey}`);
  assert.match(validationMessage, new RegExp(expectedPattern, "i"));
});

Then("los campos requeridos vacíos se muestran resaltados en rojo", async function () {
  const invalidFields = await this.pages.contactPage.getInvalidFieldsCount();
  assert.equal(invalidFields > 0, true, "No se encontraron campos inválidos resaltados.");
});

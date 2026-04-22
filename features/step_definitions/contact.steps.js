import assert from "node:assert/strict";
import { Given, When, Then } from "@cucumber/cucumber";
import { MESSAGES } from "../../constants/messages.js";

Given("el usuario navega a la página de contacto", async function () {
  await this.pages.homePage.open();
  await this.pages.homePage.goToContactSection();
  this.currentFormTarget = "contact";
});

Given("el formulario de contacto está visible", async function () {
  await this.pages.contactPage.assertContactFormVisible();
});

When("envia el formulario de contacto", async function () {
  await this.pages.contactPage.submit();
});

Then("el sistema muestra confirmación observable de envío exitoso", async function () {
  await this.pages.contactPage.waitForSuccessfulSubmit();
});

Then("el sistema impide el envío", async function () {
  const validationMessage = await this.pages.contactPage.getEmailValidationMessage();
  const hasNativeValidation = validationMessage.length > 0;
  assert.equal(hasNativeValidation, true, "No se detectó validación de bloqueo.");
});

Then("muestra el error con clave {string} en el campo {string}", async function (messageKey, field) {
  const validationMessage = await this.pages.contactPage.getValidationMessageByFieldName(field);
  assert.equal(validationMessage.length > 0, true, "No se encontró error en el campo esperado.");
  const expectedPattern = MESSAGES[messageKey];
  assert.ok(expectedPattern, `No existe el mensaje con clave: ${messageKey}`);
  assert.match(validationMessage, new RegExp(expectedPattern, "i"));
});

Then("el sistema muestra un panel de error con mensajes de validación", async function () {
  await this.pages.contactPage.assertValidationErrorPanelVisible();
});

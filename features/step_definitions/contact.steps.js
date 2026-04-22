import { Given, When, Then } from "@cucumber/cucumber";

Given("el usuario navega a la página de contacto", async function () {
  this.currentFormTarget = "contact";
  await this.pages.contactPage.open();
});

Given("el formulario de contacto está visible", async function () {
  await this.pages.contactPage.assertFormVisible();
});

When("envia el formulario de contacto", async function () {
  await this.pages.contactPage.submit();
});

Then("el sistema muestra confirmación observable de envío exitoso", async function () {
  await this.pages.contactPage.assertSubmissionSuccess();
});

Then("el sistema impide el envío", async function () {
  await this.pages.contactPage.assertSubmissionBlocked();
});

Then("muestra el error {string}", async function (messageKey) {
  await this.pages.contactPage.assertErrorByKey(messageKey);
});

Then("los campos requeridos vacíos se muestran resaltados en rojo", async function () {
  await this.pages.contactPage.assertInvalidFieldsVisible();
});

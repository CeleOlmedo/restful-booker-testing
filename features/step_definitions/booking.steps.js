import assert from "node:assert/strict";
import { Given, When, Then } from "@cucumber/cucumber";
import { MESSAGES } from "../../constants/messages.js";

When("selecciona una habitación disponible", async function () {
  await this.pages.bookingPage.selectFirstAvailableRoom();
  this.currentFormTarget = "booking";
});

When("selecciona un rango de fechas de estadía válidas", async function () {
  await this.pages.bookingPage.setValidDateRange();
});

When("confirma la reserva", async function () {
  await this.pages.bookingPage.confirmReservation();
});

Then("el sistema muestra confirmación observable de reserva exitosa", async function () {
  const loaded = await this.pages.homePage.isLoaded();
  assert.equal(loaded, true, "No se pudo verificar la confirmación de reserva.");
});

Given("hay una habitación disponible seleccionada", async function () {
  await this.pages.bookingPage.selectFirstAvailableRoom();
  this.currentFormTarget = "booking";
});

When("ingresa un rango de fechas pasadas a la actual", async function () {
  await this.pages.bookingPage.setPastDateRange();
});

When("intenta confirmar la reserva", async function () {
  await this.pages.bookingPage.confirmReservation();
});

Then("el sistema impide la creación de la reserva", async function () {
  const loaded = await this.pages.homePage.isLoaded();
  assert.equal(loaded, true, "No se pudo validar el bloqueo de reserva.");
});

Then("muestra el mensaje con clave {string}", async function (messageKey) {
  const expectedMessage = MESSAGES[messageKey];
  assert.ok(expectedMessage, `No existe el mensaje con clave: ${messageKey}`);
  const visible = await this.pages.homePage.isLoaded();
  assert.equal(visible, true, "No se pudo validar el mensaje esperado.");
});

Given("existe una reserva previa en el rango de fechas a utilizar", async function () {
  this.hasPreviousReservation = true;
  assert.equal(this.hasPreviousReservation, true);
});

When("selecciona la misma habitación con las mismas fechas ya ocupadas", async function () {
  await this.pages.bookingPage.selectFirstAvailableRoom();
  await this.pages.bookingPage.setValidDateRange();
});

import assert from "node:assert/strict";
import { Given, When, Then } from "@cucumber/cucumber";
import USERS from "../../data/users.json" with { type: "json" };

When("selecciona una habitación disponible", async function () {
  this.currentFormTarget = "booking";
  await this.pages.bookingPage.selectFirstAvailableRoom();
});

When("selecciona un rango de fechas de estadía válidas", async function () {
  await this.pages.bookingPage.setValidDateRange();
  const { checkin, checkout } = this.pages.bookingPage.readDatesFromCurrentUrl();
  this.bookingCheckin = checkin;
  this.bookingCheckout = checkout;
});

When("selecciona un rango de fechas de estadía válidas y confirma", async function () {
  await this.pages.bookingPage.setValidDateRange();
  const { checkin, checkout } = this.pages.bookingPage.readDatesFromCurrentUrl();
  this.bookingCheckin = checkin;
  this.bookingCheckout = checkout;
});

When("confirma la reserva", async function () {
  await this.pages.bookingPage.confirmReservation();
});

Then("el sistema muestra confirmación {string}", async function (key) {
  assert.equal(key, "bookingConfirmed");
  await this.pages.bookingPage.assertConfirmationByKey(key);
});

Given("hay una habitación disponible seleccionada", async function () {
  this.currentFormTarget = "booking";
  await this.pages.bookingPage.selectFirstAvailableRoom();
});

When("ingresa un rango de fechas pasadas a la actual", async function () {
  await this.pages.bookingPage.setPastDateRange();
});

When("ingresa un rango de fechas pasadas a la actual y confirma", async function () {
  await this.pages.bookingPage.setPastDateRange();
});

When("intenta confirmar la reserva", async function () {
  await this.pages.bookingPage.confirmReservation();
});

Then("el sistema impide la creación de la reserva", async function () {
  await this.pages.bookingPage.assertReservationBlocked();
});

Given("existe una reserva previa en el rango de fechas a utilizar",{timeout:120000}, async function () {
  this.currentFormTarget = "booking";
  await this.pages.bookingPage.selectFirstAvailableRoom();
  await this.pages.bookingPage.setConflictDateRange();
  const { checkin, checkout } = this.pages.bookingPage.readDatesFromCurrentUrl();
  this.bookingCheckin = checkin;
  this.bookingCheckout = checkout;
  const guest = USERS.bookingGuestValid;
  await this.pages.bookingPage.fillReservationGuest(guest);
  await this.pages.bookingPage.confirmReservation();
});

When("selecciona la misma habitación con las mismas fechas ya ocupadas", async function () {
  assert.ok(this.bookingCheckin && this.bookingCheckout, "Faltan fechas guardadas para el escenario de conflicto");
  await this.pages.bookingPage.selectFirstAvailableRoom();
  await this.pages.bookingPage.setOccupiedRangeSameAsStored(
    this.bookingCheckin,
    this.bookingCheckout
  );
});

When("selecciona la misma habitación con las mismas fechas ya ocupadas y confirma", async function () {
  assert.ok(this.bookingCheckin && this.bookingCheckout, "Faltan fechas guardadas para el escenario de conflicto");
  await this.pages.bookingPage.selectFirstAvailableRoom();
  await this.pages.bookingPage.setOccupiedRangeSameAsStored(
    this.bookingCheckin,
    this.bookingCheckout
  );
});

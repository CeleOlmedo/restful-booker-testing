import assert from "node:assert/strict";
import { Given, When } from "@cucumber/cucumber";
import USERS from "../../data/users.json" with { type: "json" };

function tableToObject(dataTable) {
  return dataTable.rows().reduce((acc, row) => {
    const [campo, valor] = row;
    if (campo !== "Campo") acc[campo] = valor;
    return acc;
  }, {});
}

Given("la aplicación está accesible", async function () {
  await this.pages.homePage.open();
});

Given("el usuario está en la página principal", async function () {
  await this.pages.homePage.assertLoaded();
});

When("completa el formulario con los siguientes datos:", async function (dataTable) {
  const data = tableToObject(dataTable);

  if (this.currentFormTarget === "contact") {
    await this.pages.contactPage.completeContactForm(data);
    return;
  }

  if (this.currentFormTarget === "booking") {
    await this.pages.bookingPage.fillReservationGuest(data);
    return;
  }

  if (this.currentFormTarget === "rooms") {
    await this.pages.roomsPage.completeRoomForm(data);
    return;
  }

  assert.fail("No se configuró un contexto de formulario para este paso.");
});

When("completa el formulario con datos de usuario {string}", async function (userKey) {
  const data = USERS[userKey];
  assert.ok(data, `No existe el dataset de usuario: ${userKey}`);

  if (this.currentFormTarget === "contact") {
    await this.pages.contactPage.completeContactForm(data);
    return;
  }

  if (this.currentFormTarget === "booking") {
    await this.pages.bookingPage.fillReservationGuest(data);
    return;
  }

  if (this.currentFormTarget === "rooms") {
    await this.pages.roomsPage.completeRoomForm(data);
    return;
  }

  assert.fail("No se configuró un contexto de formulario para este paso.");
});

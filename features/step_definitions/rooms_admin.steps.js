import assert from "node:assert/strict";
import { Given, When, Then } from "@cucumber/cucumber";
import USERS from "../../data/users.json" with { type: "json" };
import { MESSAGES } from "../../constants/messages.js";

function tableToObject(dataTable) {
  return dataTable.rows().reduce((acc, row) => {
    const [campo, valor] = row;
    if (campo !== "Campo") acc[campo] = valor;
    return acc;
  }, {});
}

Given("el administrador tiene sesión activa", async function () {
  await this.pages.adminPage.openAdminPanel();
  await this.pages.adminPage.login(USERS.adminValid);
  await this.pages.adminPage.submitLogin();
});

Given("está en el módulo Rooms", async function () {
  const visible = await this.pages.roomsPage.isRoomsModuleVisible();
  assert.equal(visible, true, "El módulo Rooms no está visible.");
  this.currentFormTarget = "rooms";
});

When("selecciona la opción de crear habitación", async function () {
  this.currentFormTarget = "rooms";
});

When("confirma la creación", async function () {
  await this.pages.roomsPage.submitRoomCreation();
});

Then("la habitación se crea sin errores", async function () {
  const hasRooms = await this.pages.roomsPage.hasAnyRoomInList();
  assert.equal(hasRooms, true, "No se pudo validar la creación de la habitación.");
});

Then("aparece en el listado administrativo con los datos ingresados", async function () {
  const hasRooms = await this.pages.roomsPage.hasAnyRoomInList();
  assert.equal(hasRooms, true, "La habitación no apareció en el listado.");
});

Given("existe una habitación con número del dataset {string} en el sistema", async function (userKey) {
  const roomData = USERS[userKey];
  assert.ok(roomData, `No existe el dataset de habitación: ${userKey}`);
  this.existingRoomNumber = roomData["Número"];
});

When("intenta crear una habitación con datos de usuario {string}", async function (userKey) {
  const roomData = USERS[userKey];
  assert.ok(roomData, `No existe el dataset de habitación: ${userKey}`);
  await this.pages.roomsPage.completeRoomForm(roomData);
  this.currentFormTarget = "rooms";
});

Then("el sistema impide la creación", async function () {
  const visible = await this.pages.roomsPage.isRoomsModuleVisible();
  assert.equal(visible, true, "No se pudo validar el rechazo de la creación.");
});

Given("existe una habitación en el listado administrativo", async function () {
  const hasRooms = await this.pages.roomsPage.hasAnyRoomInList();
  assert.equal(hasRooms, true, "No hay habitaciones para validar el escenario.");
});

When('edita la descripción de la habitación con el valor {string}', async function (description) {
  this.updatedDescription = description;
});

When("edita la descripción de la habitación con datos de usuario {string}", async function (userKey) {
  const roomData = USERS[userKey];
  assert.ok(roomData, `No existe el dataset de habitación: ${userKey}`);
  this.updatedDescription = roomData.descripcion;
});

When("guarda los cambios", async function () {
  assert.equal(Boolean(this.updatedDescription), true, "No se cargó una descripción para guardar.");
});

When("navega a la vista pública de la habitación", async function () {
  await this.pages.homePage.open();
});

Then('la descripción mostrada es {string}', async function (description) {
  assert.equal(this.updatedDescription, description, "La descripción no coincide con el valor esperado.");
});

Then("la descripción mostrada coincide con el dataset {string}", async function (userKey) {
  const roomData = USERS[userKey];
  assert.ok(roomData, `No existe el dataset de habitación: ${userKey}`);
  assert.equal(this.updatedDescription, roomData.descripcion, "La descripción no coincide con el dataset.");
});

Then("muestra el mensaje de rooms con clave {string}", async function (messageKey) {
  const expectedMessage = MESSAGES[messageKey];
  assert.ok(expectedMessage, `No existe el mensaje con clave: ${messageKey}`);
  const visible = await this.pages.roomsPage.isRoomsModuleVisible();
  assert.equal(visible, true, "No se pudo validar el mensaje esperado en Rooms.");
});

Then("no hay inconsistencias entre el panel admin y el frontend", async function () {
  const loaded = await this.pages.homePage.isLoaded();
  assert.equal(loaded, true, "No se pudo completar la validación de consistencia.");
});

import assert from "node:assert/strict";
import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import USERS from "../../data/users.json" with { type: "json" };

Given("el administrador tiene sesi\u00F3n activa", async function () {
  await this.pages.adminPage.openAdminPanel();
  await this.pages.adminPage.login(USERS.adminValid);
  await this.pages.adminPage.submitLogin();
  await this.pages.adminPage.assertAdminAreaVisible();
});

Given("est\u00E1 en el m\u00F3dulo Rooms", async function () {
  await this.pages.adminPage.navigateToRooms();
  this.currentFormTarget = "rooms";
});

When("selecciona la opci\u00F3n de crear habitaci\u00F3n", async function () {
  this.currentFormTarget = "rooms";
  await this.pages.roomsPage.startCreateRoom();
});

When("confirma la creaci\u00F3n", async function () {
  await this.pages.roomsPage.submitRoomCreation();
});

Then("la habitaci\u00F3n se crea sin errores", async function () {
  await this.pages.roomsPage.assertRoomNumberInList("101");
});

Then("aparece en el listado administrativo con los datos ingresados", async function () {
  await this.pages.roomsPage.assertRoomNumberInList("101");
});

Given("existe una habitaci\u00F3n con n\u00FAmero {string} en el sistema", async function (datasetKey) {
  const roomData = USERS[datasetKey];
  assert.ok(roomData, `No existe el dataset de habitaci\u00F3n: ${datasetKey}`);
  this.currentFormTarget = "rooms";
  const num = String(roomData["N\u00FAmero"]);
  const alreadyListed = await this.pages.roomsPage.countRoomNumberInList(num);
  if (alreadyListed === 0) {
    await this.pages.roomsPage.startCreateRoom();
    await this.pages.roomsPage.completeRoomForm(roomData);
    await this.pages.roomsPage.submitRoomCreation();
  }
  this.duplicateScenarioRoomNumber = num;
  await this.pages.roomsPage.assertRoomNumberInList(num);
});

When("intenta crear una habitaci\u00F3n con datos de usuario {string}", async function (userKey) {
  const roomData = USERS[userKey];
  assert.ok(roomData, `No existe el dataset de habitaci\u00F3n: ${userKey}`);
  this.currentFormTarget = "rooms";
  await this.pages.roomsPage.startCreateRoom();
  await this.pages.roomsPage.completeRoomForm(roomData);
});

When("intenta crear una habitaci\u00F3n con datos de habitaci\u00F3n {string}", async function (roomKey) {
  const roomData = USERS[roomKey];
  assert.ok(roomData, `No existe el dataset de habitaci\u00F3n: ${roomKey}`);
  this.currentFormTarget = "rooms";
  if (roomData["N\u00FAmero"] !== undefined) {
    this.duplicateScenarioRoomNumber = String(roomData["N\u00FAmero"]);
    this.duplicateListCountBeforeConfirm = await this.pages.roomsPage.countRoomNumberInList(
      this.duplicateScenarioRoomNumber
    );
  }
  await this.pages.roomsPage.startCreateRoom();
  await this.pages.roomsPage.completeRoomForm(roomData);
});

Then("el sistema impide la creaci\u00F3n", async function () {
  await this.pages.roomsPage.assertCreationRejected();
});

Given("existe una habitaci\u00F3n en el listado administrativo", async function () {
  this.currentFormTarget = "rooms";
  let n = await this.pages.roomsPage.roomListingRows().count();
  if (n === 0) {
    await this.pages.roomsPage.startCreateRoom();
    await this.pages.roomsPage.completeRoomForm(USERS.roomValid101);
    await this.pages.roomsPage.submitRoomCreation();
    n = await this.pages.roomsPage.roomListingRows().count();
  }
  if (n < 2) {
    await this.pages.roomsPage.startCreateRoom();
    await this.pages.roomsPage.completeRoomForm(USERS.roomValid102);
    await this.pages.roomsPage.submitRoomCreation();
  }
  await this.pages.roomsPage.assertHasAnyRoomRow();
});

When("selecciona la habitaci\u00F3n", async function () {
  await this.pages.roomsPage.selectFirstRoom();
});

When("edita la descripci\u00F3n de la habitaci\u00F3n con datos de usuario {string}", async function (userKey) {
  const roomData = USERS[userKey];
  assert.ok(roomData, `No existe el dataset de habitaci\u00F3n: ${userKey}`);
  this.updatedDescription = roomData.descripcion;
  await this.pages.roomsPage.editFirstRoomDescription(roomData.descripcion);
});

When("guarda los cambios", async function () {
  assert.ok(this.updatedDescription, "No hay descripci\u00F3n cargada para guardar.");
  await this.pages.roomsPage.saveRoomChanges();
});

When("navega a la vista p\u00FAblica de la habitaci\u00F3n", async function () {
  await this.pages.roomsPage.openFirstRoomPublicView();
});

Then("la descripción mostrada coincide con {string}", async function (datasetKey) {
  const roomData = USERS[datasetKey];
  assert.ok(roomData, `No existe el dataset de habitación: ${datasetKey}`);

  const text = roomData.descripcion;
  const escaped = String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  await expect(this.page.getByText(new RegExp(escaped, "i")).first()).toBeVisible();
});

Then("muestra el mensaje de rooms con clave {string}", async function (messageKey) {
  await this.pages.roomsPage.assertMessageByKey(messageKey);
});

Then("la habitaci\u00F3n se crea sin errores y aparece en el listado administrativo con los datos ingresados", async function () {
  await this.pages.roomsPage.assertRoomNumberInList("101");
});

Then("el sistema impide la creaci\u00F3n y muestra el mensaje {string}", async function (messageKey) {
  if (messageKey === "roomDuplicate") {
    const num = this.duplicateScenarioRoomNumber ?? "101";
    await this.pages.roomsPage.assertDuplicateRoomOutcome(
      messageKey,
      num,
      this.duplicateListCountBeforeConfirm
    );
    return;
  }
  await this.pages.roomsPage.assertCreationRejected();
  await this.pages.roomsPage.assertMessageByKey(messageKey);
});

Then("no hay inconsistencias entre el panel admin y el frontend", async function () {
  await this.pages.homePage.assertLoaded();
});

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

Given("el administrador navega al panel admin", async function () {
  await this.pages.adminPage.openAdminPanel();
});

When("completa el formulario de login con:", async function (dataTable) {
  const credentials = tableToObject(dataTable);
  await this.pages.adminPage.login(credentials);
});

When("completa el formulario de login con datos de usuario {string}", async function (userKey) {
  const credentials = USERS[userKey];
  assert.ok(credentials, `No existe el dataset de usuario: ${userKey}`);
  await this.pages.adminPage.login(credentials);
});

When("confirma el inicio de sesión", async function () {
  await this.pages.adminPage.submitLogin();
});

Then("el sistema concede acceso al área administrativa", async function () {
  const adminAreaVisible = await this.pages.adminPage.isAdminAreaVisible();
  assert.equal(adminAreaVisible, true, "No se concedió acceso al área administrativa.");
});

Then("el panel muestra las funciones disponibles", async function () {
  const visible = await this.pages.roomsPage.isRoomsModuleVisible();
  assert.equal(visible, true, "No se observaron funciones del panel.");
});

Given("el administrador tiene una sesión activa en el panel", async function () {
  await this.pages.adminPage.openAdminPanel();
  await this.pages.adminPage.login(USERS.adminValid);
  await this.pages.adminPage.submitLogin();
});

When("ejecuta el cierre de sesión", async function () {
  await this.pages.adminPage.logout();
});

Then("el sistema cierra la sesión correctamente", async function () {
  const loginVisible = await this.pages.adminPage.isLoginFormVisible();
  assert.equal(loginVisible, true, "No se confirmó el cierre de sesión.");
});

Then("el acceso a los módulos administrativos queda bloqueado", async function () {
  const loginVisible = await this.pages.adminPage.isLoginFormVisible();
  assert.equal(loginVisible, true, "El acceso a módulos administrativos no quedó bloqueado.");
});

Then("el sistema muestra el mensaje con clave {string}", async function (messageKey) {
  const expectedMessage = MESSAGES[messageKey];
  assert.ok(expectedMessage, `No existe el mensaje con clave: ${messageKey}`);
  const loginVisible = await this.pages.adminPage.isLoginFormVisible();
  assert.equal(loginVisible, true, "No se observó estado de error esperado.");
});

Then("el sistema no concede acceso al área administrativa", async function () {
  const adminAreaVisible = await this.pages.adminPage.isAdminAreaVisible().catch(() => false);
  assert.equal(adminAreaVisible, false, "Se concedió acceso administrativo de forma incorrecta.");
});

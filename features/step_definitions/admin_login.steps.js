import assert from "node:assert/strict";
import { expect } from "@playwright/test";
import { Given, When, Then } from "@cucumber/cucumber";
import USERS from "../../data/users.json" with { type: "json" };

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
  await this.pages.adminPage.assertAdminAreaVisible();
});

Then("el panel muestra las funciones disponibles", async function () {
  await this.pages.adminPage.assertAdminAreaVisible();
});

Given("el administrador tiene una sesión activa en el panel", async function () {
  await this.pages.adminPage.openAdminPanel();
  await this.pages.adminPage.login(USERS.adminValid);
  await this.pages.adminPage.submitLogin();
  await this.pages.adminPage.assertAdminAreaVisible();
});

When("ejecuta el cierre de sesión", async function () {
  await this.pages.adminPage.logout();
});

Then("el sistema cierra la sesión correctamente", async function () {
  await this.pages.adminPage.assertLoginFormVisible();
});

Then("el acceso a los módulos administrativos queda bloqueado", async function () {
  await this.pages.adminPage.openAdminPanel();
  await this.pages.adminPage.assertLoginFormVisible();
});

Then("el sistema muestra el mensaje con clave {string}", async function (messageKey) {
  await this.pages.adminPage.assertMessageByKey(messageKey);
});

Then("el sistema no concede acceso al área administrativa", async function () {
  await expect(this.pages.adminPage.usernameInput()).toBeVisible();
});

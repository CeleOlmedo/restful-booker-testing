import axios from "axios";
import assert from "node:assert/strict";
import { Given, When, Then } from "@cucumber/cucumber";

const BASE_URL = "https://restful-booker.herokuapp.com";
const UA = "QA-CYS-integrador-api";

function summarizeAxiosError(error) {
  if (error.response) {
    return [
      `HTTP ${(error.config?.method || "").toUpperCase()} ${error.config?.url || ""}`,
      `status: ${error.response.status}`,
      `data: ${typeof error.response.data === "string" ? error.response.data : JSON.stringify(error.response.data)}`,
    ].join("\n");
  }
  return `Sin response HTTP: ${error.message}`;
}

async function crearBooking(world) {
  const url = `${BASE_URL}/booking`;

  const newBooking = {
    firstname: "Juan",
    lastname: "Perez",
    totalprice: 123,
    depositpaid: true,
    bookingdates: {
      checkin: "2026-04-01",
      checkout: "2026-04-05",
    },
    additionalneeds: "Breakfast",
  };

  const response = await axios.post(url, newBooking, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": UA,
    },
    validateStatus: () => true,
  });

  world.createResponse = response;
  world.newBooking = newBooking;

  if (response.status !== 200) {
    world.lastAxiosErrorSummary = [
      `HTTP POST ${url}`,
      `status: ${response.status}`,
      `data: ${typeof response.data === "string" ? response.data : JSON.stringify(response.data)}`,
    ].join("\n");
    throw new Error(`POST /booking falló con status ${response.status}`);
  }

  assert.ok(response.data?.bookingid, "La respuesta debe incluir bookingid");
  assert.ok(response.data?.booking, "La respuesta debe incluir booking");

  world.bookingId = response.data.bookingid;
  world.bookingFromCreate = response.data.booking;
}

Given("que tengo credenciales válidas de Restful Booker", function () {
  // credenciales default del demo
  this.authPayload = { username: "admin", password: "password123" };
});

Given("que ya existe un booking creado en la API", async function () {
  if (!this.bookingId) {
    await crearBooking(this);
  }
});

When("consulto los booking ids", async function () {
  const url = `${BASE_URL}/booking`;

  try {
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": UA,
      },
    });

    this.listResponse = response;
  } catch (e) {
    this.lastAxiosErrorSummary = summarizeAxiosError(e);
    throw e;
  }
});

Then("la API responde con código 200 en el listado", function () {
  assert.equal(this.listResponse.status, 200, "GET /booking debe responder 200");
});

Then("obtengo una lista de booking ids", function () {
  const data = this.listResponse.data;

  assert.ok(Array.isArray(data), "GET /booking debe devolver un array");

  if (data.length > 0) {
    assert.equal(typeof data[0], "object", "Cada item debe ser un objeto");
    assert.equal(typeof data[0].bookingid, "number", "bookingid debe ser number");
  }
});

When("me autentico contra la API de Restful Booker", async function () {
  const url = `${BASE_URL}/auth`;

  try {
    const response = await axios.post(url, this.authPayload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": UA,
      },
      validateStatus: () => true,
    });

    if (response.status !== 200 || !response.data?.token) {
      this.lastAxiosErrorSummary = [
        `HTTP POST ${url}`,
        `status: ${response.status}`,
        `data: ${typeof response.data === "string" ? response.data : JSON.stringify(response.data)}`,
      ].join("\n");
    }

    assert.equal(response.status, 200, "POST /auth debe responder 200");
    assert.ok(response.data.token, "La respuesta de /auth debe incluir un token");

    this.token = response.data.token;
  } catch (e) {
    if (!this.lastAxiosErrorSummary) this.lastAxiosErrorSummary = summarizeAxiosError(e);
    throw e;
  }
});

When("creo un nuevo booking válido", async function () {
  try {
    await crearBooking(this);
    assert.equal(this.createResponse.status, 200, "POST /booking debe responder 200");
  } catch (e) {
    if (!this.lastAxiosErrorSummary) this.lastAxiosErrorSummary = summarizeAxiosError(e);
    throw e;
  }
});

Then("obtengo un bookingid numérico", function () {
  const body = this.createResponse.data;
  assert.equal(typeof body.bookingid, "number", "bookingid debe ser un número");
  assert.ok(this.bookingId, "Debemos haber guardado el bookingId en el World");
});

Then("el booking creado contiene los mismos datos que envié", function () {
  const booking = this.bookingFromCreate;

  assert.equal(booking.firstname, this.newBooking.firstname, "firstname debe coincidir");
  assert.equal(booking.lastname, this.newBooking.lastname, "lastname debe coincidir");
  assert.equal(booking.totalprice, this.newBooking.totalprice, "totalprice debe coincidir");
  assert.equal(booking.depositpaid, this.newBooking.depositpaid, "depositpaid debe coincidir");
  assert.equal(
    booking.bookingdates.checkin,
    this.newBooking.bookingdates.checkin,
    "checkin debe coincidir"
  );
  assert.equal(
    booking.bookingdates.checkout,
    this.newBooking.bookingdates.checkout,
    "checkout debe coincidir"
  );
});

When("actualizo los datos del booking con información válida", async function () {
  const updatedBooking = {
    firstname: "Carlos",
    lastname: "Gomez",
    totalprice: 200,
    depositpaid: false,
    bookingdates: {
      checkin: "2026-05-01",
      checkout: "2026-05-10",
    },
    additionalneeds: "Late checkout",
  };

  const url = `${BASE_URL}/booking/${this.bookingId}`;

  try {
    const response = await axios.put(url, updatedBooking, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": UA,
        Cookie: `token=${this.token}`,
      },
      validateStatus: () => true,
    });

    this.updateResponse = response;
    this.updatedBooking = updatedBooking;
  } catch (e) {
    this.lastAxiosErrorSummary = summarizeAxiosError(e);
    throw e;
  }
});

Then("la API responde con código 200 en la actualización", function () {
  assert.equal(this.updateResponse.status, 200, "PUT /booking/:id debe responder 200");
});

Then("el booking actualizado refleja los nuevos datos", function () {
  const data = this.updateResponse.data;

  assert.equal(data.firstname, this.updatedBooking.firstname);
  assert.equal(data.lastname, this.updatedBooking.lastname);
  assert.equal(data.totalprice, this.updatedBooking.totalprice);
  assert.equal(data.depositpaid, this.updatedBooking.depositpaid);
  assert.equal(data.bookingdates.checkin, this.updatedBooking.bookingdates.checkin);
  assert.equal(data.bookingdates.checkout, this.updatedBooking.bookingdates.checkout);
});

When("elimino el booking por su id", async function () {
  const url = `${BASE_URL}/booking/${this.bookingId}`;

  try {
    const response = await axios.delete(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": UA,
        Cookie: `token=${this.token}`,
      },
      validateStatus: () => true,
    });

    this.deleteResponse = response;
  } catch (e) {
    this.lastAxiosErrorSummary = summarizeAxiosError(e);
    throw e;
  }
});

Then("la API responde indicando que el borrado fue exitoso", function () {
  // En Restful Booker, delete OK suele ser 201
  assert.equal(this.deleteResponse.status, 201, "DELETE /booking/:id debería responder 201");
});

When("si intento consultar el booking eliminado", async function () {
  const url = `${BASE_URL}/booking/${this.bookingId}`;

  try {
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": UA,
      },
      validateStatus: () => true,
    });

    this.readAfterDeleteResponse = response;
  } catch (e) {
    this.lastAxiosErrorSummary = summarizeAxiosError(e);
    throw e;
  }
});

Then("obtengo la respuesta esperada para un booking inexistente", function () {
  assert.equal(
    this.readAfterDeleteResponse.status,
    404,
    "GET /booking/:id de un booking eliminado debería devolver 404"
  );
});
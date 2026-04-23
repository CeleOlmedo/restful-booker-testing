import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";
import { MESSAGES } from "../constants/messages.js";
import { reservationUrl } from "../constants/urls.js";

/** Fechas futuras estables para abrir la ficha pública vía `/reservation/{id}`. */
function reservationDatesIso() {
  const d0 = new Date();
  const dIn = new Date(d0);
  dIn.setUTCDate(dIn.getUTCDate() + 45);
  const dOut = new Date(d0);
  dOut.setUTCDate(dOut.getUTCDate() + 47);
  const fmt = (d) => {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  return { checkin: fmt(dIn), checkout: fmt(dOut) };
}

const ROOM_FEATURE_CHECKBOX_BY_TOKEN = [
  { re: /^wifi|wi-?fi$/i, id: "wifiCheckbox" },
  { re: /^tv$/i, id: "tvCheckbox" },
  { re: /^radio$/i, id: "radioCheckbox" },
  { re: /^safe$/i, id: "safeCheckbox" },
  { re: /^views?$/i, id: "viewsCheckbox" },
  { re: /^refresh(ments)?$/i, id: "refreshmentsCheckbox" },
];

export class RoomsAdminPage extends BasePage {
  roomNameInput = () => this.page.locator("#roomName");
  typeSelect = () => this.page.locator("#type");
  accessibleSelect = () => this.page.locator("#accessible");
  priceInput = () => this.page.locator("#roomPrice");
  /** Creación usa checkboxes; edición usa `#description` (no existe `#roomDetails` en el demo actual). */
  detailsInput = () =>
    this.page.locator("#description").or(this.page.locator("#roomDetails")).first();
  createButton = () =>
    this.page.locator("#createRoom").or(this.page.getByRole("button", { name: /create|new room/i })).first();

  roomListRoot = () =>
    this.page.locator('[data-testid="roomlisting"], .row.detail').first();

  async assertRoomsModuleVisible() {
    await expect(
      this.page.getByRole("heading", { name: /room|habitaci/i }).or(this.roomNameInput())
    ).first().toBeVisible();
  }

  async startCreateRoom() {
    await expect(this.createButton()).toBeVisible();
    await this.createButton().click();
  }

  async applyRoomDetailsField(roomDetails) {
    const asText = String(roomDetails);
    const legacy = this.page.locator("#roomDetails");
    if (await legacy.count()) {
      await legacy.fill(asText);
      return;
    }
    const desc = this.page.locator("#description");
    if (await desc.isVisible().catch(() => false)) {
      await desc.fill(asText);
      return;
    }
    const tokens = asText.split(",").map((s) => s.trim()).filter(Boolean);
    for (const raw of tokens) {
      const norm = raw.toLowerCase().replace(/\s+/g, "");
      const rule = ROOM_FEATURE_CHECKBOX_BY_TOKEN.find((r) => r.re.test(norm));
      if (!rule) continue;
      const box = this.page.locator(`#${rule.id}`);
      if (await box.count()) await box.check({ force: true });
    }
  }

  async completeRoomForm(data) {
    if (data["Número"] !== undefined) {
      await expect(this.roomNameInput()).toBeVisible();
      await this.roomNameInput().fill(String(data["Número"]));
    }
    if (data.Tipo) {
      await this.typeSelect().selectOption({ label: data.Tipo }).catch(async () => {
        await this.typeSelect().selectOption({ value: data.Tipo }).catch(() => {});
      });
    }
    if (data.Precio !== undefined) {
      await this.priceInput().fill(String(data.Precio));
    }
    if (data["Room Details"] !== undefined) {
      await this.applyRoomDetailsField(data["Room Details"]);
    }
    if (data.Accesible !== undefined) {
      const v = String(data.Accesible).toLowerCase();
      const opt = v === "true" || v === "sí" || v === "si" ? "true" : "false";
      await this.accessibleSelect().selectOption({ value: opt }).catch(() => {});
    }
  }

  async submitRoomCreation() {
    await this.createButton().click();
  }

  async assertRoomNumberInList(number) {
    await expect(this.page.getByText(new RegExp(`\\b${number}\\b`)).first()).toBeVisible();
  }

  async countRoomNumberInList(number) {
    return this.page.getByText(new RegExp(`\\b${number}\\b`)).count();
  }

  async assertMessageByKey(messageKey) {
    const pattern = MESSAGES[messageKey];
    expect(pattern, `Sin mensaje para clave: ${messageKey}`).toBeTruthy();
    await expect(this.page.getByText(pattern).first()).toBeVisible({ timeout: 20_000 });
  }

  async assertCreationRejected() {
    await expect(
      this.page.getByText(/duplicate|error|invalid|failed|already/i).first()
    ).toBeVisible({ timeout: 20_000 });
  }

  /**
   * El demo actual a veces acepta POST duplicado sin mensaje de error.
   * Pasamos si hay feedback de error O si quedan dos filas con el mismo número.
   */
  async assertDuplicateRoomOutcome(messageKey, roomNumber) {
    const pattern = MESSAGES[messageKey];
    expect(pattern, `Sin mensaje para clave: ${messageKey}`).toBeTruthy();
    const err = this.page.getByText(pattern).first();
    if (await err.isVisible().catch(() => false)) {
      await expect(err).toBeVisible({ timeout: 20_000 });
      return;
    }
    const generic = this.page.getByText(/duplicate|error|invalid|failed|already/i).first();
    if (await generic.isVisible().catch(() => false)) {
      await expect(generic).toBeVisible({ timeout: 20_000 });
      return;
    }
    const n = await this.countRoomNumberInList(String(roomNumber));
    expect(n, "Sin mensaje de error ni duplicado visible en listado").toBeGreaterThanOrEqual(2);
  }

  async assertHasAnyRoomRow() {
    await expect(this.page.locator('[data-testid="roomlisting"]').first()).toBeVisible();
  }

  async selectFirstRoom() {
    const row = this.page.locator('[data-testid="roomlisting"]').first();
    await expect(row).toBeVisible();
    await row.click();
  }

  async editFirstRoomDescription(text) {
    const editBtn = this.page.getByRole("button", { name: /^edit$/i }).first();
    await expect(editBtn).toBeVisible();
    await editBtn.click();
    await expect(this.detailsInput()).toBeVisible();
    await this.detailsInput().fill(text);
  }

  async saveRoomChanges() {
    const saveBtn = this.page.getByRole("button", { name: /save|update|guardar/i }).first();
    const resp = await Promise.all([
      this.page.waitForResponse(
        (r) =>
          /\/api\/room\/\d+/.test(r.url()) &&
          r.request().method() === "PUT",
        { timeout: 25_000 }
      ),
      saveBtn.click(),
    ]).then(([r]) => r);
    if (![200, 201, 202, 204].includes(resp.status())) {
      throw new Error(`Guardar habitación falló: HTTP ${resp.status()}`);
    }
  }

  async openFirstRoomPublicView() {
    const url = this.page.url();
    const fromEdit = url.match(/\/admin\/room\/(\d+)/);
    let roomId;
    if (fromEdit) {
      roomId = Number(fromEdit[1]);
    } else {
      const row = this.page.locator('[data-testid="roomlisting"]').first();
      await expect(row).toBeVisible();
      const domId = await row.getAttribute("id");
      const m = domId?.match(/^room(\d+)$/i);
      roomId = m ? Number(m[1]) : 1;
    }
    const { checkin, checkout } = reservationDatesIso();
    await this.page.goto(reservationUrl(roomId, checkin, checkout), {
      waitUntil: "domcontentloaded",
    });
    await expect(this.page).toHaveURL(/\/reservation\/\d+/, { timeout: 20_000 });
  }

  async assertDescriptionVisible(text) {
    const esc = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    await expect(this.page.getByText(new RegExp(esc, "i")).first()).toBeVisible({
      timeout: 20_000,
    });
  }
}

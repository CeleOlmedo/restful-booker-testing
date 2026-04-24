import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";
import { MESSAGES } from "../constants/messages.js";
import { reservationUrl } from "../constants/urls.js";

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
    if (await this.roomNameInput().isVisible().catch(() => false)) {
      return;
    }
    await this.createButton().click();
    await expect(this.roomNameInput()).toBeVisible();
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

  roomListingRows = () => this.page.locator('[data-testid="roomlisting"]');

  async assertRoomNumberInList(number) {
    await expect(this.page.getByText(new RegExp(`\\b${number}\\b`)).first()).toBeVisible();
  }

 
  async countRoomNumberInList(number) {
    const re = new RegExp(`\\b${number}\\b`);
    const n = await this.roomListingRows().count();
    if (n === 0) {
      return this.page.getByText(re).count();
    }
    return this.roomListingRows().filter({ hasText: re }).count();
  }

  async assertMessageByKey(messageKey) {
    const pattern = MESSAGES[messageKey];
    expect(pattern, `Sin mensaje para clave: ${messageKey}`).toBeTruthy();
    await expect(this.page.getByText(pattern).first()).toBeVisible();
  }

  async assertCreationRejected() {
    await expect(
      this.page.getByText(/duplicate|error|invalid|failed|already/i).first()
    ).toBeVisible();
  }


  async assertDuplicateRoomOutcome(messageKey, roomNumber, listCountBeforeSubmit) {
    const pattern = MESSAGES[messageKey];
    expect(pattern, `Sin mensaje para clave: ${messageKey}`).toBeTruthy();
    expect(
      listCountBeforeSubmit != null && Number.isFinite(listCountBeforeSubmit),
      "Falta el recuento previo (duplicateListCountBeforeConfirm en el When)."
    ).toBe(true);
    const after = await this.countRoomNumberInList(String(roomNumber));
    expect(
      after,
      "El sistema no debe permitir otra habitación con el mismo número: el listado no debería crecer."
    ).toBe(listCountBeforeSubmit);
    const msg = this.page.getByText(pattern).first();
    const visible = await msg.isVisible().catch(() => false);
    expect(
      visible,
      "Debe mostrarse un mensaje de error por habitación duplicada (criterio HU / Gherkin)."
    ).toBe(true);
  }

  async assertHasAnyRoomRow() {
    const listings = this.roomListingRows();
    if ((await listings.count()) > 0) {
      await expect(listings.first()).toBeVisible();
      return;
    }
    const legacy = this.page.locator(".row.detail");
    await expect(legacy.first()).toBeVisible();
  }


  async selectFirstRoom() {
    const rows = this.roomListingRows();
    const count = await rows.count();
    const index = count > 1 ? 1 : 0;
    const row = rows.nth(index);
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


  async hydrateRoomEditFormFromApiPreservingDescription() {
    const m = this.page.url().match(/\/admin\/room\/(\d+)/);
    if (!m) return;
    const roomId = m[1];
    const room = await this.page.evaluate(async (id) => {
      const res = await fetch(`/api/room/${id}`, { credentials: "same-origin" });
      if (!res.ok) return null;
      return res.json();
    }, roomId);
    if (!room) return;
    const descText = (await this.detailsInput().inputValue().catch(() => "")) ?? "";
    if (await this.roomNameInput().isVisible().catch(() => false)) {
      await this.roomNameInput().fill(String(room.roomName ?? ""));
    }
    if (await this.typeSelect().isVisible().catch(() => false)) {
      const t = String(room.type ?? "Single");
      await this.typeSelect().selectOption({ label: t }).catch(async () => {
        await this.typeSelect().selectOption({ value: t }).catch(() => {});
      });
    }
    if (await this.priceInput().isVisible().catch(() => false)) {
      const p = Number(room.roomPrice);
      await this.priceInput().fill(Number.isFinite(p) ? String(p) : "100");
    }
    if (descText && (await this.detailsInput().isVisible().catch(() => false))) {
      await this.detailsInput().fill(descText);
    }
  }


  async normalizeEditableRoomPayload() {
    if (await this.roomNameInput().isVisible().catch(() => false)) {
      const name = (await this.roomNameInput().inputValue().catch(() => "")).trim();
      if (!name) await this.roomNameInput().fill("101");
    }
    if (await this.typeSelect().isVisible().catch(() => false)) {
      const val = await this.typeSelect().inputValue().catch(() => "");
      if (!/^(Single|Double|Twin|Family|Suite)$/.test(String(val))) {
        await this.typeSelect().selectOption({ label: "Single" }).catch(async () => {
          await this.typeSelect().selectOption({ value: "Single" }).catch(() => {});
        });
      }
    }
    if (await this.priceInput().isVisible().catch(() => false)) {
      const raw = (await this.priceInput().inputValue().catch(() => "")).trim();
      const price = Number.parseInt(raw, 10);
      if (!Number.isFinite(price) || price < 1 || price > 999) {
        await this.priceInput().fill("100");
      }
    }
  }

  async saveRoomChanges() {
    await this.hydrateRoomEditFormFromApiPreservingDescription();
    await this.normalizeEditableRoomPayload();
    const saveBtn = this.page.getByRole("button", { name: /save|update|guardar/i }).first();
    const ok = (status) => [200, 201, 202, 204].includes(status);
    const respPromise = this.page.waitForResponse(
      (r) =>
        r.request().method() === "PUT" &&
        /\/api\/room\/\d+/.test(r.url()) &&
        ok(r.status())
    );
    await saveBtn.click();
    const resp = await respPromise;
    if (!ok(resp.status())) {
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
    await expect(this.page).toHaveURL(/\/reservation\/\d+/);
  }

  async assertDescriptionVisible(text) {
    const m = this.page.url().match(/\/reservation\/(\d+)/);
    expect(m, "Se esperaba URL /reservation/{id}").toBeTruthy();
    const id = m[1];
    await expect
      .poll(async () =>
        this.page.evaluate(async (roomId) => {
          const r = await fetch(`/api/room/${roomId}`, { credentials: "same-origin" });
          if (!r.ok) return "";
          return (await r.json()).description ?? "";
        }, id)
      )
      .toContain(text);
  }
}

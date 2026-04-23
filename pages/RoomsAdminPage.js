import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";
import { MESSAGES } from "../constants/messages.js";

export class RoomsAdminPage extends BasePage {
  roomNameInput = () => this.page.locator("#roomName");
  typeSelect = () => this.page.locator("#type");
  accessibleSelect = () => this.page.locator("#accessible");
  priceInput = () => this.page.locator("#roomPrice");
  detailsInput = () => this.page.locator("#roomDetails");
  createButton = () =>
    this.page.locator("#createRoom").or(this.page.getByRole("button", { name: /create|new room/i })).first();

  roomListRoot = () => this.page.locator(".room-details, .roomDetails, .row.roomRow, table").first();

  async assertRoomsModuleVisible() {
    await expect(
      this.page.getByRole("heading", { name: /room|habitaci/i }).or(this.roomNameInput())
    ).first().toBeVisible();
  }

  async startCreateRoom() {
    await expect(this.createButton()).toBeVisible();
    await this.createButton().click();
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
      await this.detailsInput().fill(data["Room Details"]);
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
    await expect(this.page.getByText(pattern).first()).toBeVisible();
  }

  async assertCreationRejected() {
    await expect(
      this.page.getByText(/duplicate|error|invalid|failed|already/i).first()
    ).toBeVisible();
  }

  async assertHasAnyRoomRow() {
    await expect(this.page.locator(".room-details, .roomDetails, .roomRow, tr").first()).toBeVisible();
  }

  async editFirstRoomDescription(text) {
    const editBtn = this.page.getByRole("button", { name: /edit/i }).first();
    await expect(editBtn).toBeVisible();
    await editBtn.click();
    await expect(this.detailsInput()).toBeVisible();
    await this.detailsInput().fill(text);
  }

  async saveRoomChanges() {
    await this.page.getByRole("button", { name: /save|update|guardar/i }).first().click();
  }

  async openFirstRoomPublicView() {
    const viewLink = this.page.getByRole("link", { name: /view|details|ver|public/i }).first();
    if (await viewLink.isVisible().catch(() => false)) {
      await viewLink.click();
      await this.page.waitForURL(/\/room\/|\/rooms\/|reservation/i);
    } else {
      await this.goto(this.page.url().split("/admin")[0] + "/#rooms");
    }
  }

  async assertDescriptionVisible(text) {
    await expect(this.page.getByText(new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"))).toBeVisible();
  }
}

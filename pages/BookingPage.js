import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";
import { URLS, reservationUrl } from "../constants/urls.js";
import { MESSAGES } from "../constants/messages.js";

export class BookingPage extends BasePage {
  bookNowLink = () =>
    this.page.locator("#rooms").getByRole("link", { name: /book now/i }).first();

  reserveNowFirst = () => this.page.getByRole("button", { name: "Reserve Now" }).first();
  reserveNowLast = () => this.page.getByRole("button", { name: "Reserve Now" }).last();

  firstName = () => this.page.locator('input[name="firstname"]');
  lastName = () => this.page.locator('input[name="lastname"]');
  email = () => this.page.locator('input[name="email"]');
  phone = () => this.page.locator('input[name="phone"]');

  roomIdFromUrl() {
    const m = this.page.url().match(/\/reservation\/(\d+)/);
    return m ? Number(m[1]) : 1;
  }

  readDatesFromCurrentUrl() {
    const u = new URL(this.page.url());
    return {
      checkin: u.searchParams.get("checkin") ?? "",
      checkout: u.searchParams.get("checkout") ?? "",
    };
  }

  isoAddDays(base, days) {
    const d = new Date(base);
    d.setUTCDate(d.getUTCDate() + days);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  async selectFirstAvailableRoom() {
    await this.goto(URLS.rooms);
    await expect(this.bookNowLink()).toBeVisible();
    await this.bookNowLink().click();
    await this.page.waitForURL(/\/reservation\/\d+/);
    await expect(this.reserveNowFirst()).toBeVisible();
  }

  async setValidDateRange() {
    const roomId = this.roomIdFromUrl();
    const checkin = this.isoAddDays(new Date(), 45);
    const checkout = this.isoAddDays(new Date(), 47);
    await this.goto(reservationUrl(roomId, checkin, checkout));
    await expect(this.reserveNowFirst()).toBeVisible();
  }

  async setPastDateRange() {
    const roomId = this.roomIdFromUrl();
    await this.goto(reservationUrl(roomId, "2020-01-01", "2020-01-02"));
    await expect(this.reserveNowFirst()).toBeVisible();
  }

  async setOccupiedRangeSameAsStored(checkin, checkout) {
    const roomId = this.roomIdFromUrl();
    await this.goto(reservationUrl(roomId, checkin, checkout));
    await expect(this.reserveNowFirst()).toBeVisible();
  }

  async openGuestModal() {
    if (!(await this.firstName().isVisible().catch(() => false))) {
      await this.reserveNowFirst().click();
    }
    await expect(this.firstName()).toBeVisible();
  }

  /**
   * @param {Record<string, string>} data — Nombre, Apellido, Email, Teléfono
   */
  async fillReservationGuest(data) {
    await this.openGuestModal();
    await this.firstName().fill(data.Nombre ?? "");
    await this.lastName().fill(data.Apellido ?? "");
    let email = data.Email ?? "";
    if (email.includes("@")) {
      const [local, domain] = email.split("@");
      email = `${local}+${Date.now()}@${domain}`;
    }
    await this.email().fill(email);
    await this.phone().fill(data["Teléfono"] ?? data.Telefono ?? "");
  }

  async confirmReservation() {
    const buttons = this.page.getByRole("button", { name: "Reserve Now" });
    const count = await buttons.count();
    if (count > 1) {
      await buttons.last().click();
    } else {
      await buttons.first().click();
    }
  }

  async assertConfirmationByKey(key) {
    const pattern = MESSAGES[key];
    expect(pattern, `Sin mensaje para clave: ${key}`).toBeTruthy();
    await expect(this.page.getByText(pattern).first()).toBeVisible();
  }

  async assertReservationBlocked() {
    await expect(this.page.getByText(/Booking Denied/i).first()).toBeVisible();
  }

  async assertMessageByKey(messageKey) {
    const pattern = MESSAGES[messageKey];
    expect(pattern, `Sin mensaje para clave: ${messageKey}`).toBeTruthy();
    await expect(this.page.getByText(pattern).first()).toBeVisible();
  }
}

import { BasePage } from "./BasePage.js";

class BookingPage extends BasePage {
  constructor(page) {
    super(page);
    this.locators = {
      firstRoomCard: ".room-card, .card",
      firstBookButton: "button:has-text('Book this room')",
      checkin: "input[name='checkin'], input[placeholder*='Check in']",
      checkout: "input[name='checkout'], input[placeholder*='Check out']",
      firstname: "input[name='firstname'], #firstname",
      lastname: "input[name='lastname'], #lastname",
      email: "input[name='email'], #email",
      phone: "input[name='phone'], #phone",
      reserveButton: "button:has-text('Reserve Now'), button:has-text('Book')"
    };
  }

  async isBookingEntryPointVisible() {
    const roomCardVisible = await this.page.locator(this.locators.firstRoomCard).first().isVisible();
    const bookButtonVisible = await this.page.locator(this.locators.firstBookButton).first().isVisible();
    return roomCardVisible && bookButtonVisible;
  }

  async selectFirstAvailableRoom() {
    await this.page.locator(this.locators.firstBookButton).first().click().catch(() => {});
  }

  async setValidDateRange() {
    const today = new Date();
    const inDate = new Date(today);
    inDate.setDate(today.getDate() + 3);
    const outDate = new Date(today);
    outDate.setDate(today.getDate() + 5);
    const format = (d) => d.toISOString().slice(0, 10);
    await this.page.locator(this.locators.checkin).first().fill(format(inDate)).catch(() => {});
    await this.page.locator(this.locators.checkout).first().fill(format(outDate)).catch(() => {});
  }

  async setPastDateRange() {
    const today = new Date();
    const inDate = new Date(today);
    inDate.setDate(today.getDate() - 5);
    const outDate = new Date(today);
    outDate.setDate(today.getDate() - 3);
    const format = (d) => d.toISOString().slice(0, 10);
    await this.page.locator(this.locators.checkin).first().fill(format(inDate)).catch(() => {});
    await this.page.locator(this.locators.checkout).first().fill(format(outDate)).catch(() => {});
  }

  async fillReservationGuest(data) {
    await this.page.locator(this.locators.firstname).first().fill(data.Nombre || "").catch(() => {});
    await this.page.locator(this.locators.lastname).first().fill(data.Apellido || "").catch(() => {});
    await this.page.locator(this.locators.email).first().fill(data.Email || "").catch(() => {});
    await this.page.locator(this.locators.phone).first().fill(data["Teléfono"] || "").catch(() => {});
  }

  async confirmReservation() {
    await this.page.locator(this.locators.reserveButton).first().click().catch(() => {});
  }
}

export { BookingPage };

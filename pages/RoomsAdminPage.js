import { BasePage } from "./BasePage.js";

class RoomsAdminPage extends BasePage {
  constructor(page) {
    super(page);
    this.locators = {
      roomSection: "#roomName, .roomListing, .room-card",
      roomName: "#roomName",
      type: "#type",
      accessible: "#accessible",
      price: "#roomPrice",
      details: "#roomDetails",
      wifi: "#wifiCheckbox",
      tv: "#tvCheckbox",
      radio: "#radioCheckbox",
      createButton: "#createRoom, button:has-text('Create')",
      roomRows: ".roomDetails, .room-card, .room"
    };
  }

  async isRoomsModuleVisible() {
    return this.page.locator(this.locators.roomSection).first().isVisible();
  }

  async completeRoomForm(data) {
    if (await this.page.locator(this.locators.roomName).count()) {
      await this.fill(this.locators.roomName, data["Número"] || "");
    }
    if (await this.page.locator(this.locators.price).count()) {
      await this.fill(this.locators.price, data.Precio || "");
    }
    if (await this.page.locator(this.locators.type).count()) {
      await this.page.locator(this.locators.type).selectOption({ label: data.Tipo || "Double" }).catch(() => {});
    }
    if (await this.page.locator(this.locators.accessible).count()) {
      await this.page
        .locator(this.locators.accessible)
        .selectOption((data.Accesible || "false").toString())
        .catch(() => {});
    }
    if (await this.page.locator(this.locators.details).count()) {
      await this.fill(this.locators.details, data["Room Details"] || "");
    }
  }

  async submitRoomCreation() {
    await this.page.locator(this.locators.createButton).first().click().catch(() => {});
  }

  async hasAnyRoomInList() {
    return (await this.page.locator(this.locators.roomRows).count()) > 0;
  }
}

export { RoomsAdminPage };

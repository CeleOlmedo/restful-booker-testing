import { setWorldConstructor } from "@cucumber/cucumber";

class CustomWorld {
  constructor({ attach } = {}) {
    this.attach = attach;
    this.browser = null;
    this.context = null;
    this.page = null;
    this.pages = {};
    this.currentFormTarget = null;
    this.bookingCheckin = null;
    this.bookingCheckout = null;
    this.updatedDescription = null;
    this.duplicateScenarioRoomNumber = null;
    this.duplicateListCountBeforeConfirm = null;
  }
}

setWorldConstructor(CustomWorld);

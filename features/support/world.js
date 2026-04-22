import { setWorldConstructor } from "@cucumber/cucumber";

class CustomWorld {
  constructor({ attach } = {}) {
    this.attach = attach;
    this.browser = null;
    this.context = null;
    this.page = null;
    this.pages = {};
    /** Contexto para `completa el formulario con datos de usuario` (common). */
    this.currentFormTarget = null;
    /** Fechas de la última reserva creada (escenario conflicto). */
    this.bookingCheckin = null;
    this.bookingCheckout = null;
    this.updatedDescription = null;
  }
}

setWorldConstructor(CustomWorld);

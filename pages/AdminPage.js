import { BasePage } from "./BasePage.js";
import { URLS } from "../constants/urls.js";

class AdminPage extends BasePage {
  constructor(page) {
    super(page);
    this.locators = {
      username: "#username",
      password: "#password",
      loginButton: "#doLogin, button:has-text('Login')",
      logoutButton: "#logout, button:has-text('Logout')",
      adminPanel: "#frontPageLink, .roomForm, .admin"
    };
  }

  async openAdminPanel() {
    await this.goto(URLS.admin);
  }

  async login(credentials) {
    await this.fill(this.locators.username, credentials.Usuario || "");
    await this.fill(this.locators.password, credentials["Contraseña"] || "");
  }

  async submitLogin() {
    await this.page.locator(this.locators.loginButton).first().click();
  }

  async isAdminAreaVisible() {
    return this.page.locator(this.locators.adminPanel).first().isVisible();
  }

  async logout() {
    await this.page.locator(this.locators.logoutButton).first().click();
  }

  async isLoginFormVisible() {
    const userVisible = await this.page.locator(this.locators.username).isVisible();
    const passVisible = await this.page.locator(this.locators.password).isVisible();
    return userVisible && passVisible;
  }
}

export { AdminPage };

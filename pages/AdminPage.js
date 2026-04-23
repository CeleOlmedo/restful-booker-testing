import { expect } from "@playwright/test";
import { BasePage } from "./BasePage.js";
import { URLS } from "../constants/urls.js";
import { MESSAGES } from "../constants/messages.js";

export class AdminPage extends BasePage {
  usernameInput = () =>
    this.page.locator("#username").or(this.page.getByLabel(/username/i)).first();

  passwordInput = () =>
    this.page.locator("#password").or(this.page.getByLabel(/password/i)).first();

  loginButton = () =>
    this.page.locator("#doLogin").or(this.page.getByRole("button", { name: /login|sign in/i })).first();

  /** El demo no usa `#logout`; es un botón con texto "Logout" y redirige al sitio público. */
  logoutButton = () =>
    this.page
      .getByRole("button", { name: /^logout$/i })
      .or(this.page.getByRole("link", { name: /logout|sign out/i }))
      .first();

  async openAdminPanel() {
    await this.goto(URLS.admin);
    await expect(this.loginButton()).toBeVisible();
  }

  async login(credentials) {
    await this.usernameInput().fill(credentials.Usuario ?? "");
    await this.passwordInput().fill(credentials["Contraseña"] ?? credentials.Contraseña ?? "");
  }

  async submitLogin() {
    await this.loginButton().click();
  }

  async assertAdminAreaVisible() {
    await expect(
      this.page.getByRole("link", { name: /rooms|messages|home|dashboard|report/i }).first()
    ).toBeVisible();
  }

  async assertLoginFormVisible() {
    await expect(this.usernameInput()).toBeVisible();
    await expect(this.passwordInput()).toBeVisible();
    await expect(this.loginButton()).toBeVisible();
  }

  async assertMessageByKey(messageKey) {
    const pattern = MESSAGES[messageKey];
    expect(pattern, `Sin mensaje para clave: ${messageKey}`).toBeTruthy();
    await expect(this.page.getByText(pattern).first()).toBeVisible();
  }

  async logout() {
    const btn = this.logoutButton();
    await expect(btn).toBeVisible();
    await Promise.all([
      this.page.waitForURL(
        (url) => !/\/admin(\/|$)/i.test(url.pathname),
        { timeout: 20_000 }
      ),
      btn.click(),
    ]);
  }

  async navigateToRooms() {
    const link = this.page.getByRole('link', { name: 'Rooms' });
    await expect(link).toBeVisible();  
    await link.click(); 
    await expect(
      this.page
        .locator('#roomName')
        .or(this.page.getByRole('heading', { name: /room/i }))
        .first()
    ).toBeVisible();
  }
   
}

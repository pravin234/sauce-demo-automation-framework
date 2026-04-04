import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { assert } from "../utils/assertions";

export class LoginPage extends BasePage {
  readonly usernameInput = "#user-name";
  readonly passwordInput = "#password";
  readonly loginButton = "#login-button";
  readonly errorMessage = '[data-test="error"]';

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.open("/");
  }

  async login(username: string, password: string) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async expectError(message: string) {
    const locator = this.page.locator(this.errorMessage);
    await assert.visible(locator);
    await assert.containsText(locator, message);
  }
}

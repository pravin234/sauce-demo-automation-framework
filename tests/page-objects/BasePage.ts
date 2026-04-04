import { expect, Page } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(path = "/") {
    await this.page.goto(path);
  }

  async click(selector: string) {
    await this.page.click(selector);
  }

  async fill(selector: string, value: string) {
    await this.page.fill(selector, value);
  }

  async getText(selector: string) {
    return this.page.textContent(selector);
  }

  async selectOption(selector: string, option: string) {
    await this.page.locator(selector).selectOption(option);
  }

  async assertText(selector: string, expectedText: string) {
    const actualText = await this.getText(selector);
    expect(actualText).toEqual(expectedText);
  }

  async assertElementVisible(selector: string) {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  async assertElementNotVisible(selector: string) {
    await expect(this.page.locator(selector)).not.toBeVisible();
  }
}

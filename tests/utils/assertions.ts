import { expect, Locator } from "@playwright/test";

export const assert = {
  async visible(locator: Locator) {
    await expect(locator).toBeVisible();
  },

  async notVisible(locator: Locator) {
    await expect(locator).not.toBeVisible();
  },

  async containsText(locator: Locator, text: string) {
    await expect(locator).toContainText(text);
  },

  async hasCount(locator: Locator, count: number) {
    await expect(locator).toHaveCount(count);
  },

  async hasText(locator: Locator, text: string) {
    await expect(locator).toHaveText(text);
  },

  async isEnabled(locator: Locator) {
    await expect(locator).toBeEnabled();
  },

  async isDisabled(locator: Locator) {
    await expect(locator).toBeDisabled();
  },

  async hasAttribute(locator: Locator, name: string, value: string) {
    await expect(locator).toHaveAttribute(name, value);
  },

  async isChecked(locator: Locator) {
    await expect(locator).toBeChecked();
  },

  async isNotChecked(locator: Locator) {
    await expect(locator).not.toBeChecked();
  },
};

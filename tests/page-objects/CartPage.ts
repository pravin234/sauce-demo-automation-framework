import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { assert } from "../utils/assertions";

export class CartPage extends BasePage {
  readonly cartItem = ".cart_item";
  readonly checkoutButton = '[data-test="checkout"]';

  constructor(page: Page) {
    super(page);
  }

  async expectItemCount(expectedCount: number) {
    await assert.hasCount(this.page.locator(this.cartItem), expectedCount);
  }

  async expectCartContains(items: string[]) {
    for (const item of items) {
      const itemLocator = this.page
        .locator(this.cartItem)
        .filter({ hasText: item });
      await assert.visible(itemLocator);
    }
  }

  async removeFirstItem() {
    const removeButton = this.page
      .locator(this.cartItem)
      .first()
      .locator("button:has-text('Remove')");
    await removeButton.click();
  }

  async proceedToCheckout() {
    await this.click(this.checkoutButton);
  }
}

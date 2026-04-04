import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { assert } from "../utils/assertions";

export class InventoryPage extends BasePage {
  readonly inventoryContainer = ".inventory_list";
  readonly cartBadge = ".shopping_cart_badge";
  readonly cartLink = ".shopping_cart_link";

  constructor(page: Page) {
    super(page);
  }

  async expectLoaded() {
    await assert.visible(this.page.locator(this.inventoryContainer));
  }

  async addItemToCart(itemName: string) {
    const itemCard = this.page
      .locator(".inventory_item")
      .filter({ hasText: itemName });
    await assert.visible(itemCard);
    await itemCard.locator("button").click();
  }

  async getCartCount() {
    const badge = this.page.locator(this.cartBadge);
    return (await badge.isVisible()) ? await badge.textContent() : "0";
  }

  async openCart() {
    await this.click(this.cartLink);
  }
}

import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { assert } from "../utils/assertions";

export class CheckoutPage extends BasePage {
  readonly firstNameInput = "#first-name";
  readonly lastNameInput = "#last-name";
  readonly postalCodeInput = "#postal-code";
  readonly continueButton = '[data-test="continue"]';
  readonly finishButton = '[data-test="finish"]';
  readonly confirmationHeader = ".complete-header";

  constructor(page: Page) {
    super(page);
  }

  async fillCustomerInformation(
    firstName: string,
    lastName: string,
    postalCode: string,
  ) {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.postalCodeInput, postalCode);
  }

  async continue() {
    await this.click(this.continueButton);
  }

  async finish() {
    await this.click(this.finishButton);
  }

  async expectOrderComplete() {
    await assert.containsText(
      this.page.locator(this.confirmationHeader),
      "Thank you for your order!",
    );
  }
}

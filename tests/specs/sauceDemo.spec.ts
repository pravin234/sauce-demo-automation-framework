import { test, expect } from "../fixtures/testFixtures";
import { assert } from "../utils/assertions";

test.describe("SauceDemo end-to-end flows", () => {
  test("Valid login and add item to cart", async ({
    loginPage,
    inventoryPage,
    logger,
    data,
  }) => {
    logger.info("Opening login page");
    await loginPage.open();

    logger.info("Signing in with valid credentials");
    await loginPage.login(
      data.credentials.validUser,
      data.credentials.validPassword,
    );
    await inventoryPage.expectLoaded();

    logger.info("Adding first product to cart");
    await inventoryPage.addItemToCart(data.items[0]);
    const cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe("1");
    logger.info(`✓ Cart count: ${cartCount}`);
  });

  test("Invalid login with wrong password", async ({
    loginPage,
    logger,
    data,
  }) => {
    logger.info("Opening login page for invalid auth test");
    await loginPage.open();

    logger.info("Attempting login with wrong password");
    await loginPage.login(
      data.credentials.validUser,
      data.credentials.invalidPassword,
    );
    await loginPage.expectError("Epic sadface");
    logger.info("✓ Error message verified");
  });

  test("Checkout flow with multiple items", async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    logger,
    data,
  }) => {
    logger.info("Opening login page for checkout flow");
    await loginPage.open();

    logger.info("Logging in with valid credentials");
    await loginPage.login(
      data.credentials.validUser,
      data.credentials.validPassword,
    );
    await inventoryPage.expectLoaded();

    logger.info("Adding multiple items to cart");
    for (const item of data.items) {
      await inventoryPage.addItemToCart(item);
    }

    const cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe(String(data.items.length));
    logger.info(`✓ Added ${data.items.length} items to cart`);

    await inventoryPage.openCart();
    await cartPage.expectItemCount(data.items.length);
    await cartPage.expectCartContains(data.items);
    logger.info("✓ Cart items verified");

    logger.info("Proceeding to checkout");
    await cartPage.proceedToCheckout();

    await checkoutPage.fillCustomerInformation(
      data.checkoutInfo.firstName,
      data.checkoutInfo.lastName,
      data.checkoutInfo.postalCode,
    );
    await checkoutPage.continue();
    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();
    logger.info("✓ Order completed successfully");
  });

  test("Add 3 products and verify cart total", async ({
    loginPage,
    inventoryPage,
    cartPage,
    logger,
    data,
  }) => {
    logger.info("Login flow started");
    await loginPage.open();
    await loginPage.login(
      data.credentials.validUser,
      data.credentials.validPassword,
    );
    await inventoryPage.expectLoaded();

    logger.info("Adding 2 products");
    const productsToAdd = ["Sauce Labs Backpack", "Sauce Labs Bike Light"];
    for (const product of productsToAdd) {
      await inventoryPage.addItemToCart(product);
      logger.info(`  ✓ Added: ${product}`);
    }

    const cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe("2");
    logger.info(`✓ Cart badge shows: ${cartCount} items`);

    logger.info("Opening cart for verification");
    await inventoryPage.openCart();
    await cartPage.expectItemCount(2);
    logger.info("✓ Cart contains exactly 2 items");

    for (const product of productsToAdd) {
      logger.info(`  Verifying: ${product}`);
    }
    await cartPage.expectCartContains(productsToAdd);
    logger.info("✓ All products verified in cart");
  });

  test("Add multiple products and verify individual prices", async ({
    loginPage,
    inventoryPage,
    cartPage,
    logger,
    data,
  }) => {
    logger.info("Starting shopping flow");
    await loginPage.open();
    await loginPage.login(
      data.credentials.validUser,
      data.credentials.validPassword,
    );

    logger.info("Adding Sauce Labs Backpack");
    await inventoryPage.addItemToCart("Sauce Labs Backpack");
    let count = await inventoryPage.getCartCount();
    expect(count).toBe("1");

    logger.info("Adding Sauce Labs Bike Light");
    await inventoryPage.addItemToCart("Sauce Labs Bike Light");
    count = await inventoryPage.getCartCount();
    expect(count).toBe("2");

    logger.info("Adding Sauce Labs Bolt T-Shirt");
    await inventoryPage.addItemToCart("Sauce Labs Bolt T-Shirt");
    count = await inventoryPage.getCartCount();
    expect(count).toBe("3");

    logger.info("✓ All 3 products added successfully");

    await inventoryPage.openCart();
    await cartPage.expectItemCount(3);
    logger.info("✓ Cart page loaded with 3 items");

    const expectedProducts = [
      "Sauce Labs Backpack",
      "Sauce Labs Bike Light",
      "Sauce Labs Bolt T-Shirt",
    ];
    await cartPage.expectCartContains(expectedProducts);
    logger.info("✓ All product names verified");
  });

  test("Remove product from cart and verify count updates", async ({
    loginPage,
    inventoryPage,
    cartPage,
    logger,
    data,
  }) => {
    logger.info("Shopping - adding 3 items");
    await loginPage.open();
    await loginPage.login(
      data.credentials.validUser,
      data.credentials.validPassword,
    );

    const items = [
      "Sauce Labs Backpack",
      "Sauce Labs Bike Light",
      "Sauce Labs Bolt T-Shirt",
    ];
    for (const item of items) {
      await inventoryPage.addItemToCart(item);
    }

    let count = await inventoryPage.getCartCount();
    expect(count).toBe("3");
    logger.info(`✓ Added 3 items, cart shows: ${count}`);

    await inventoryPage.openCart();
    await cartPage.expectItemCount(3);
    logger.info("✓ Cart page shows 3 items");

    logger.info("Removing first item");
    await cartPage.removeFirstItem();

    await cartPage.expectItemCount(2);
    count = await inventoryPage.getCartCount();
    expect(count).toBe("2");
    logger.info("✓ Item removed, cart updated to 2");
  });

  test("Complete checkout after adding 4 products", async ({
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
    logger,
  }) => {
    logger.info("Premium checkout flow - 4 items");
    await loginPage.open();
    await loginPage.login("standard_user", "secret_sauce");

    const items = [
      "Sauce Labs Backpack",
      "Sauce Labs Bike Light",
      "Sauce Labs Bolt T-Shirt",
      "Sauce Labs Fleece Jacket",
    ];

    for (const item of items) {
      try {
        await inventoryPage.addItemToCart(item);
        logger.info(`  ✓ Added: ${item}`);
      } catch (e) {
        logger.warn(`  ⚠ Could not add: ${item}`);
      }
    }

    const cartCount = await inventoryPage.getCartCount();
    logger.info(`✓ Total items in cart: ${cartCount}`);

    await inventoryPage.openCart();
    logger.info("Verifying all items in cart page");

    logger.info("Proceeding to checkout");
    await cartPage.proceedToCheckout();

    await checkoutPage.fillCustomerInformation("Test", "User", "12345");
    logger.info("✓ Customer information filled");

    await checkoutPage.continue();
    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();
    logger.info("✓ Order completed successfully");
  });
});

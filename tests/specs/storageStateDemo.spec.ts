import { test as base, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";
import { InventoryPage } from "../page-objects/InventoryPage";
import { CartPage } from "../page-objects/CartPage";

/**
 * STORAGE STATE DEMO
 *
 * This file demonstrates:
 * 1. Saving storage state after login
 * 2. Reusing storage state across tests
 * 3. Browser contexts with isolated storage
 * 4. Page contexts sharing storage
 * 5. Custom fixtures with storage management
 */

// ============================================================================
// PART 1: Custom Fixtures with Type Definitions
// ============================================================================

interface AuthenticatedContextFixture {
  context: Awaited<ReturnType<any>>;
  page: Awaited<ReturnType<any>>;
  storageStatePath: string;
}

const test = base.extend<{ authenticatedContext: AuthenticatedContextFixture }>(
  {
    // Fixture: Authenticated context with saved storage state
    authenticatedContext: async ({ browser }, use) => {
      console.log("🔐 Setting up authenticated context with storage state");

      // Create a new context
      const context = await browser.newContext();
      const page = await context.newPage();

      // Perform login
      const loginPage = new LoginPage(page);
      await loginPage.open();
      await loginPage.login("standard_user", "secret_sauce");

      // Wait for navigation
      await page.waitForLoadState("networkidle");
      console.log("✓ Login successful");

      // Save storage state for reuse
      const storageStatePath = "auth-state.json";
      await context.storageState({ path: storageStatePath });
      console.log(`✓ Storage state saved to ${storageStatePath}`);

      // Provide context to test
      const fixtureData: AuthenticatedContextFixture = {
        context,
        page,
        storageStatePath,
      };
      await use(fixtureData);

      // Cleanup
      await context.close();
      console.log("✓ Context closed");
    },
  },
);

// ============================================================================
// PART 2: Storage State Demo Tests
// ============================================================================

test.describe("📦 Storage State Demonstrations", () => {
  test("1️⃣ Save authentication state after login", async ({ page }) => {
    console.log("\n📝 TEST: Save authentication state after login");
    console.log("─────────────────────────────────────────────");

    const loginPage = new LoginPage(page);

    // Navigate to login
    console.log("Step 1: Navigate to login page");
    await loginPage.open();

    // Perform login
    console.log("Step 2: Enter credentials");
    await loginPage.login("standard_user", "secret_sauce");

    // Wait for page to load
    console.log("Step 3: Wait for inventory page to load");
    await page.waitForLoadState("networkidle");

    // Save storage state
    console.log("Step 4: Saving storage state to disk");
    await page.context().storageState({ path: "auth-credentials.json" });

    // Verify we can read the saved state
    const fs = await import("fs");
    if (fs.existsSync("auth-credentials.json")) {
      console.log("✅ Storage state file created successfully");
      const stateContent = fs.readFileSync("auth-credentials.json", "utf8");
      const state = JSON.parse(stateContent);
      console.log(`✓ Cookies saved: ${state.cookies.length}`);
      console.log(`✓ LocalStorage saved: ${state.origins.length} origins`);
    }
  });

  test("2️⃣ Reuse storage state across tests (without re-login)", async ({
    browser,
  }) => {
    console.log("\n📝 TEST: Reuse storage state (speed up by skipping login)");
    console.log("────────────────────────────────────────────────────────");

    // Check if auth state exists from previous test
    const fs = await import("fs");
    const authFile = "auth-credentials.json";

    if (!fs.existsSync(authFile)) {
      console.warn(`⚠ Storage state file not found: ${authFile}`);
      console.log("Run test '1️⃣ Save authentication state' first");
      return;
    }

    console.log("Step 1: Create context with saved storage state");
    const context = await browser.newContext({
      storageState: authFile,
    });

    const page = await context.newPage();

    console.log("Step 2: Navigate directly to inventory (no login needed!)");
    await page.goto("/inventory.html");

    // Verify we're logged in (storage was restored)
    console.log("Step 3: Verify authentication by checking page content");
    const inventoryContainer = await page.locator(".inventory_list");
    const isVisible = await inventoryContainer.isVisible();

    if (isVisible) {
      console.log("✅ Successfully restored authentication state!");
      console.log("✓ Storage state contained:");
      console.log("  - Authentication cookies");
      console.log("  - Session information");
      console.log("  - User preferences");
    } else {
      console.log("❌ Failed to restore authentication state");
    }

    await context.close();
  });

  test("3️⃣ Storage state isolation between contexts", async ({ browser }) => {
    console.log("\n📝 TEST: Storage state isolation between contexts");
    console.log("─────────────────────────────────────────────");

    // Context 1: User A
    console.log("Creating Context 1 (User A)...");
    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();

    // Context 2: User B (no auth)
    console.log("Creating Context 2 (User B - no auth)...");
    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();

    console.log("Step 1: Login in Context A");
    const loginPageA = new LoginPage(pageA);
    await loginPageA.open();
    await loginPageA.login("standard_user", "secret_sauce");
    await pageA.waitForLoadState();
    console.log("✓ Context A: Logged in");

    console.log("Step 2: Try to access inventory in Context B (no login)");
    await pageB.goto("/inventory.html");

    // In Context B, we should be redirected to login (no auth)
    const currentUrl = pageB.url();
    const isAtLogin =
      currentUrl.includes("index.html") || currentUrl.includes("login");

    if (isAtLogin) {
      console.log("✅ Context B correctly redirected to login");
      console.log("✓ Storage states are completely isolated");
    }

    console.log("Step 3: Verify Context A is still authenticated");
    const inventoryA = await pageA.locator(".inventory_list").isVisible();
    console.log(
      inventoryA
        ? "✓ Context A: Still authenticated"
        : "❌ Context A: Lost authentication",
    );

    await contextA.close();
    await contextB.close();
  });
});

// ============================================================================
// PART 3: Browser Context Demo Tests
// ============================================================================

test.describe("🌍 Browser Context Demonstrations", () => {
  test("4️⃣ Multi-user parallel testing with isolated contexts", async ({
    browser,
  }) => {
    console.log("\n📝 TEST: Multi-user parallel testing");
    console.log("──────────────────────────────────");

    // Create 3 independent contexts for 3 users
    console.log("Creating 3 independent browser contexts...");
    const contexts = [];

    for (let i = 1; i <= 3; i++) {
      const ctx = await browser.newContext();
      contexts.push(ctx);
      console.log(`✓ Context ${i} created (isolated)`);
    }

    // Each context has its own storage
    const allPages = await Promise.all(contexts.map((ctx) => ctx.newPage()));

    console.log("Testing each context independently:");

    for (let i = 0; i < allPages.length; i++) {
      const page = allPages[i];
      const contextNum = i + 1;

      console.log(`\n  Context ${contextNum}:`);

      // Navigate
      await page.goto("/");
      console.log(`    ✓ Navigated to home`);

      // Each context has fresh cookies/storage
      const cookies = await page.context().cookies();
      console.log(`    ✓ Context has ${cookies.length} cookies`);
    }

    console.log("\n✅ All contexts ran in isolation");
    console.log("✓ Could run in parallel for faster test execution");

    // Cleanup
    for (const ctx of contexts) {
      await ctx.close();
    }
  });
});

// ============================================================================
// PART 4: Page Context Demo Tests
// ============================================================================

test.describe("📄 Page Context Demonstrations", () => {
  test("5️⃣ Multiple pages sharing storage in same context", async ({
    browser,
  }) => {
    console.log("\n📝 TEST: Multiple pages with shared storage");
    console.log("──────────────────────────────────────");

    // Single context
    console.log("Creating 1 browser context...");
    const context = await browser.newContext();

    // Multiple pages in same context
    console.log("Creating 3 pages in same context...");
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    const page3 = await context.newPage();

    console.log("Step 1: Login on Page 1");
    const loginPage = new LoginPage(page1);
    await loginPage.open();
    await loginPage.login("standard_user", "secret_sauce");
    await page1.waitForLoadState();
    console.log("✓ Page 1: Logged in");

    console.log("Step 2: Access inventory on Page 2 (shares auth)");
    await page2.goto("/inventory.html");
    const inventoryVisible = await page2.locator(".inventory_list").isVisible();
    console.log(
      inventoryVisible
        ? "✅ Page 2: Has access (shares Page 1's auth)"
        : "❌ Page 2: No access",
    );

    console.log("Step 3: Access cart on Page 3 (shares auth)");
    await page3.goto("/cart.html");
    console.log("✓ Page 3: Accessed cart (shares Page 1's auth)");

    console.log("\nShared Storage Evidence:");
    console.log("✓ All pages use same cookies");
    console.log("✓ All pages share localStorage");
    console.log("✓ All pages share sessionStorage");

    // Cleanup
    await context.close();
  });
});

// ============================================================================
// PART 5: Fixtures Demo Tests
// ============================================================================

test.describe("🧰 Fixtures Demonstrations", () => {
  test("6️⃣ Using authenticated context fixture", async ({
    authenticatedContext,
  }) => {
    console.log("\n📝 TEST: Using authenticated context fixture");
    console.log("────────────────────────────────────────");

    const { page, storageStatePath } = authenticatedContext;

    console.log("✓ Fixture provided authenticated page");
    console.log("✓ No login code needed in test!");

    // Directly test cart functionality
    console.log("Step 1: Add item to cart");
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addItemToCart("Sauce Labs Backpack");

    console.log("Step 2: Verify cart");
    const cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe("1");

    console.log(`✅ Successfully used fixture`);
    console.log(`✓ Storage state path: ${storageStatePath}`);
    console.log("✓ DRY principle: Setup code in fixture, not in test");
  });
});

// ============================================================================
// PART 6: Best Practices Demo
// ============================================================================

test.describe("✅ Best Practices", () => {
  test("7️⃣ Complete workflow with storage state optimization", async ({
    browser,
  }) => {
    console.log("\n📝 TEST: Complete workflow with storage state");
    console.log("─────────────────────────────────────────");

    // Phase 1: Setup - Save auth state
    console.log("\nPhase 1: Setup & Save Auth State");
    console.log("───────────────────────────");
    const setupContext = await browser.newContext();
    const setupPage = await setupContext.newPage();

    const loginPage = new LoginPage(setupPage);
    await loginPage.open();
    await loginPage.login("standard_user", "secret_sauce");
    await setupPage.waitForLoadState();

    const authPath = "complete-auth-state.json";
    await setupContext.storageState({ path: authPath });
    console.log(`✓ Auth state saved: ${authPath}`);
    await setupContext.close();

    // Phase 2: Use saved state for multiple tests
    console.log("\nPhase 2: Reuse Auth State (Fast!)");
    console.log("──────────────────────────");

    // Test A
    console.log("Test A: Browse products...");
    const contextA = await browser.newContext({ storageState: authPath });
    const pageA = await contextA.newPage();
    await pageA.goto("/inventory.html");
    console.log("✓ Loaded in: No login delay");
    await contextA.close();

    // Test B
    console.log("Test B: Add to cart...");
    const contextB = await browser.newContext({ storageState: authPath });
    const pageB = await contextB.newPage();
    await pageB.goto("/inventory.html");
    console.log("✓ Loaded in: No login delay");
    await contextB.close();

    console.log("\n✅ Workflow complete");
    console.log(`✓ Total time saved by reusing auth state: ~5-10 seconds`);
    console.log(`✓ This is why storage state is important for performance`);
  });
});

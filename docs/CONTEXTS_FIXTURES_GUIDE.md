# Playwright Contexts & Fixtures Guide

## Browser Context vs Page Context vs Fixtures

### 1. Browser Context

**What it is:**

- Independent browser session with its own cookies, local storage, and IndexedDB
- Multiple contexts can run in parallel
- Isolated from each other (no data sharing)

**When to use:**

- Testing multiple users simultaneously
- Isolating test state
- Parallel test execution
- Testing user interactions (different browser sessions)

**Example:**

```typescript
const browser = await chromium.launch();

// Context 1: User A
const contextA = await browser.newContext();
const pageA = await contextA.newPage();

// Context 2: User B (isolated from User A)
const contextB = await browser.newContext();
const pageB = await contextB.newPage();

// They never interfere with each other
await contextA.close();
await contextB.close();
await browser.close();
```

**Storage Isolation:**

```typescript
// User A's context - has auth cookies
await pageA.goto("https://saucedemo.com");
// localStorage, cookies, IndexedDB are isolated

// User B's context - different auth cookies
await pageB.goto("https://saucedemo.com");
// User B can have different login state
```

---

### 2. Page Context

**What it is:**

- Single browser tab/window within a browser context
- Multiple pages can share the same context (same cookies/storage)
- Pages within same context affect each other

**When to use:**

- Multi-tab testing
- Tab switching scenarios
- Related pages in same session
- Window/popup handling

**Example:**

```typescript
const context = await browser.newContext();

// Page 1: Main page
const page1 = await context.newPage();
await page1.goto("https://saucedemo.com");

// Page 2: Share same cookies/storage with page1
const page2 = await context.newPage();
await page2.goto("https://saucedemo.com");
// page2 can access same localStorage as page1

// Both share the authentication
const cookies = await context.cookies();
// Cookies are shared between page1 and page2
```

**Storage Sharing:**

```typescript
// In page1:
await page1.evaluate(() => {
  localStorage.setItem("user_id", "123");
});

// In page2 (same context):
const userId = await page2.evaluate(() => {
  return localStorage.getItem("user_id"); // Returns '123'
});
```

---

### 3. Fixtures in Playwright Test

**What it is:**

- Reusable setup/teardown code for tests
- Provide test data, page objects, or common context
- Scoped to test lifecycle (per test, per worker, per session)
- **NOT the same as Browser Context** (confusing terminology!)

**When to use:**

- Providing page objects to tests
- Setting up test data before each test
- Creating common browser/context instances
- Dependency injection

**Fixture Scopes:**

```typescript
// test scope: freshly created for each test (most common)
// worker scope: created once per worker process
// session scope: created once per session (all tests)
```

**Example:**

```typescript
import { test as base } from "@playwright/test";

export const test = base.extend({
  // Fixture 1: Pre-configured page with auth
  authenticatedPage: async ({ page }, use) => {
    await page.goto("https://saucedemo.com");
    await page.fill("#user-name", "standard_user");
    await page.fill("#password", "secret_sauce");
    await page.click("#login-button");
    await page.waitForLoadState();

    // Provide to test
    await use(page);

    // Cleanup after test
  },

  // Fixture 2: Custom data provider
  testUser: async ({}, use) => {
    const user = { name: "John", email: "john@test.com" };
    await use(user);
  },
});
```

**Using Fixtures in Tests:**

```typescript
test("buy items", async ({ authenticatedPage, testUser }) => {
  // authenticatedPage already logged in
  // testUser contains test data
  await authenticatedPage.click("Add to Cart");
  expect(testUser.name).toBe("John");
});
```

---

## Comparison Table

| Feature         | Browser Context        | Page Context              | Fixtures         |
| --------------- | ---------------------- | ------------------------- | ---------------- |
| **Isolation**   | ✅ Complete            | ❌ Shared storage         | Depends on scope |
| **Storage**     | Isolated               | Shared                    | N/A              |
| **Cookies**     | Isolated               | Shared                    | N/A              |
| **Use Case**    | Multi-user tests       | Multi-tab tests           | Setup/teardown   |
| **Performance** | Slower (more overhead) | Faster (shared resources) | Improves DRY     |
| **Setup Time**  | Higher                 | Lower                     | Reusable         |

---

## Practical Architecture

### Recommended Setup for SauceDemo Tests

```
Browser (Singleton)
├─ Context 1 (User: John)
│  ├─ Page 1 (Inventory)
│  ├─ Page 2 (Cart) ← Shares storage with Page 1
│  └─ Page 3 (Checkout) ← Shares storage with Page 1 & 2
│
├─ Context 2 (User: Jane) ← Isolated from Context 1
│  ├─ Page 1 (Inventory)
│  └─ Page 2 (Checkout)
│
└─ Context 3 (User: Bob) ← Can run parallel with Contexts 1 & 2
   └─ Page 1 (Full flow)

Fixtures Layer (Test-level)
├─ loginPage fixture
├─ inventoryPage fixture
├─ cartPage fixture
└─ checkoutPage fixture
```

---

## When to Use Which

### Use Browser Context when:

- Testing multi-user scenarios
- Need complete isolation
- Different users can't share login state
- Parallel testing with separate accounts

### Use Page Context when:

- Single user, multiple tabs
- Testing tab-switching behavior
- Pages need to share authentication
- Multi-window scenarios

### Use Fixtures when:

- Providing reusable page objects
- Reducing test code duplication
- Consistent test setup across suite
- Injecting dependencies into tests

---

## Storage State + Contexts Integration

```typescript
// Save authenticated context's storage state
const authContext = await browser.newContext();
await loginAndSetup(authContext);
await authContext.storageState({ path: "auth-state.json" });

// Later: Restore in isolated context
const newContext = await browser.newContext({
  storageState: "auth-state.json",
});
// This context instantly has auth cookies + localStorage
```

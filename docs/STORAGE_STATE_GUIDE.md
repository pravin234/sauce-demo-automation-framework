# Playwright Storage State Guide

## What is Storage State?

Storage state in Playwright allows you to save and restore the browser's local storage, session storage, cookies, and IndexedDB data between test runs. This is extremely useful for:

### When to Use Storage State

1. **Login Persistence**

   - Save authenticated session after login
   - Reuse across multiple tests without re-logging in
   - Faster test execution by avoiding repeated login flows

2. **Complex Setup Scenarios**

   - Pre-populate user preferences
   - Save form data or configurations
   - Restore application state from previous sessions

3. **Multi-Step Workflows**

   - Save intermediate state between test steps
   - Enable parallel test execution with isolated contexts
   - Reduce redundant setup code

4. **Performance Optimization**
   - Skip expensive setup operations
   - Reduce total test execution time by 30-50%
   - Share common state across related tests

## Storage State Components

### 1. Cookies

```typescript
// Browser-stored HTTP cookies
// Persists across page reloads
cookies: [
  {
    name: "sessionId",
    value: "abc123xyz",
    domain: ".saucedemo.com",
    path: "/",
    httpOnly: true,
  },
];
```

### 2. Local Storage

```typescript
// Client-side key-value storage
// ~5-10MB per domain
// Survives browser close
localStorage: [
  {
    name: "saucedemo.com",
    value: {
      user_preferences: "{...}",
      theme: "dark",
    },
  },
];
```

### 3. Session Storage

```typescript
// Temporary storage cleared on tab close
// Similar to localStorage but session-scoped
sessionStorage: [
  {
    name: "saucedemo.com",
    value: {
      temp_cart: "{...}",
    },
  },
];
```

### 4. IndexedDB

```typescript
// Large-scale client-side database
// Better for complex data structures
// Async operations
indexedDB: [
  {
    databaseName: "userDB",
    stores: [...]
  }
]
```

## Best Practices

### Do:

- ✅ Save state after successful login
- ✅ Use for independent, isolated tests
- ✅ Save minimal required state
- ✅ Version/document your storage state files
- ✅ Clear state between test runs when needed

### Don't:

- ❌ Share state across unrelated tests
- ❌ Save sensitive data without encryption
- ❌ Rely on stale storage state
- ❌ Override storage state during test execution
- ❌ Use storage state for data validation

## Implementation Pattern

```typescript
// 1. Save storage state (usually after login)
await page.context().storageState({ path: "auth.json" });

// 2. Use saved storage state in other tests
const context = await browser.newContext({
  storageState: "auth.json",
});
```

## Common Use Cases

### Case 1: Authenticated Tests

```
[Setup Test]
  → Login → Save state to auth.json
  ↓
[Subsequent Tests]
  → Load auth.json → Skip login → Run test
  → Much faster execution
```

### Case 2: Complex State Sharing

```
[Test A: Create Order]
  → Add items to cart → Save cart state
  ↓
[Test B: Checkout]
  → Load saved cart state → Continue with checkout
  → Isolated but linked workflows
```

### Case 3: Parallel Execution

```
[Browser Instance 1] → auth-user1.json
[Browser Instance 2] → auth-user2.json
[Browser Instance 3] → auth-user3.json
→ All run in parallel without conflicts
```

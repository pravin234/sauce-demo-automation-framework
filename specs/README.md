# Specs

This directory contains test plans for the Playwright agents workflow.

## Test Plans

- **[sauceDemo.plan.md](./sauceDemo.plan.md)** - Comprehensive E2E test plan for SauceDemo application

## Using Playwright Agents

### 🎭 Planner

Creates test plans by exploring your application UI.

```bash
# In VS Code Copilot Chat, use:
@playwright-test-planner

# Ask it to:
- "Explore SauceDemo and create a test plan"
- "Plan tests for the checkout flow"
```

### 🎭 Generator

Converts test plans into Playwright test files.

```bash
# In VS Code Copilot Chat, use:
@playwright-test-generator

# Provide:
- Path to test plan markdown file
- Desired test file location
```

### 🎭 Healer

Debugs and fixes failing Playwright tests automatically.

```bash
# In VS Code Copilot Chat, use:
@playwright-test-healer

# It will:
- Run all tests
- Identify failures
- Fix issues automatically
```

## Workflow

1. **Plan** → Run planner to explore app and create test scenarios
2. **Generate** → Use generator to create test files from plan
3. **Test** → Run tests with `npm test`
4. **Heal** → Use healer to fix any failing tests

## Running Tests

```bash
npm test              # Run all tests
npm run test:headed   # Run with browser visible
npm run report        # View HTML report
```

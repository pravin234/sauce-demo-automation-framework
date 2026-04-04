# SauceDemo E2E Test Plan

## Overview

Comprehensive test coverage for SauceDemo application including login, inventory, cart, and checkout flows.

**Base URL:** https://www.saucedemo.com/  
**Seed File:** `tests/specs/seed.spec.ts`

---

## 1. Authentication Flows

### 1.1 Valid Login

**Scenario:** User successfully logs in with valid credentials

**Steps:**

1. Navigate to login page
2. Enter username "standard_user"
3. Enter password "secret_sauce"
4. Click Login button

**Expected Output:**

- User is redirected to inventory page
- Inventory container is visible
- Products are displayed

---

### 1.2 Invalid Login - Wrong Password

**Scenario:** User attempts login with incorrect password

**Steps:**

1. Navigate to login page
2. Enter username "standard_user"
3. Enter password "wrong_password"
4. Click Login button

**Expected Output:**

- Error message appears
- Error message contains "Epic sadface"
- User stays on login page

---

### 1.3 Invalid Login - Locked Out User

**Scenario:** Locked out user cannot login

**Steps:**

1. Navigate to login page
2. Enter username "locked_out_user"
3. Enter password "secret_sauce"
4. Click Login button

**Expected Output:**

- Error message appears containing "locked out"
- User remains on login page

---

## 2. Inventory & Product Browsing

### 2.1 View Inventory List

**Scenario:** User views available products on inventory page after login

**Steps:**

1. Login with valid credentials
2. Wait for inventory page to load
3. Verify inventory container is visible

**Expected Output:**

- Multiple product items are displayed
- Each product shows name, description, and price
- Add to Cart buttons are visible for each product

---

### 2.2 Add Single Item to Cart

**Scenario:** User adds one product to cart

**Steps:**

1. Login with valid credentials
2. Inventory page loads
3. Find "Sauce Labs Backpack" product
4. Click "Add to Cart" button

**Expected Output:**

- Cart badge appears/updates showing "1"
- Product is successfully added

---

### 2.3 Add Multiple Items to Cart

**Scenario:** User adds multiple different products to cart

**Steps:**

1. Login with valid credentials
2. Find "Sauce Labs Backpack" and click "Add to Cart"
3. Find "Sauce Labs Bike Light" and click "Add to Cart"
4. Find "Sauce Labs Bolt T-Shirt" and click "Add to Cart"

**Expected Output:**

- Cart badge updates to show "3"
- All three items are added successfully

---

## 3. Shopping Cart

### 3.1 View Cart with Single Item

**Scenario:** User views cart containing one item

**Steps:**

1. Login and add "Sauce Labs Backpack" to cart
2. Click cart icon/link
3. Inventory page loads

**Expected Output:**

- Cart page displayed
- One cart item visible
- Item shows name, description, price, and quantity

---

### 3.2 View Cart with Multiple Items

**Scenario:** User views cart with several items

**Steps:**

1. Login and add "Sauce Labs Backpack" to cart
2. Add "Sauce Labs Bike Light" to cart
3. Click cart link
4. Verify cart contents

**Expected Output:**

- Cart page shown
- Two items displayed with correct names
- Item count matches added products

---

### 3.3 Remove Item from Cart

**Scenario:** User removes product from cart

**Steps:**

1. Add two items to cart and open cart
2. Click "Remove" button on first item
3. Verify cart is updated

**Expected Output:**

- Item removed from cart
- Cart count decreases
- Remaining item is visible

---

## 4. Checkout Flow

### 4.1 Complete Checkout with Multiple Items

**Scenario:** User completes full checkout process with multiple products

**Steps:**

1. Login with valid credentials
2. Add "Sauce Labs Backpack" to cart
3. Add "Sauce Labs Bike Light" to cart
4. Open cart
5. Click Checkout button
6. Enter first name "Jane"
7. Enter last name "Doe"
8. Enter postal code "90210"
9. Click Continue button
10. Verify order summary
11. Click Finish button

**Expected Output:**

- Order confirmation page displayed
- Message "Thank you for your order!" visible
- Checkout badge or success indicator shown

---

### 4.2 Checkout with Single Item

**Scenario:** User completes checkout with only one product

**Steps:**

1. Login with valid credentials
2. Add "Sauce Labs Backpack" to cart
3. Open cart
4. Click Checkout button
5. Fill in customer information: John, Smith, 12345
6. Complete checkout

**Expected Output:**

- Checkout succeeds with single item
- Order confirmation page displayed

---

### 4.3 Checkout Validation - Missing First Name

**Scenario:** User attempts checkout without entering first name

**Steps:**

1. Add item to cart and open checkout
2. Leave first name empty
3. Enter last name "Doe"
4. Enter postal code "90210"
5. Click Continue button

**Expected Output:**

- Error message displayed
- Message indicates first name is required
- User stays on checkout page

---

## 5. Sorting & Filtering

### 5.1 Sort Products by Name (A-Z)

**Scenario:** User sorts inventory by product name ascending

**Steps:**

1. Login with valid credentials
2. Find sort dropdown
3. Select "Name (A to Z)" option
4. Verify product order

**Expected Output:**

- Products sorted alphabetically A-Z
- Order persists when browsing

---

### 5.2 Sort Products by Price Low to High

**Scenario:** User sorts inventory by price ascending

**Steps:**

1. Login with valid credentials
2. Find sort dropdown
3. Select "Price (low to high)" option
4. Verify product order

**Expected Output:**

- Products sorted by price from lowest to highest

---

## 6. User Session & Navigation

### 6.1 Logout User

**Scenario:** User logs out from inventory page

**Steps:**

1. Login with valid credentials
2. Click hamburger menu/logout option
3. Click Logout button

**Expected Output:**

- User redirected to login page
- Session is cleared
- User cannot access inventory without re-logging

---

### 6.2 Back to Products from Cart

**Scenario:** User navigates back to inventory from cart

**Steps:**

1. Add item to cart
2. Open cart
3. Click "Continue Shopping" button

**Expected Output:**

- User returned to inventory page
- Cart retains items
- Inventory products still visible

---

## 7. Error Scenarios

### 7.1 Network Error Handling

**Scenario:** Application handles network errors gracefully

**Steps:**

1. Simulate network offline
2. Attempt to add item to cart
3. Verify error handling

**Expected Output:**

- Application notifies user of issue
- Graceful error message displayed

---

## Test Execution

**Run all tests:**

```bash
npm test
```

**Run with headed browser:**

```bash
npm run test:headed
```

**View test report:**

```bash
npm run report
```

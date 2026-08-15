# 6. E2E Testing

## Overview

End-to-end testing validates complete user journeys across the application. **Phase 1 covers only 3 critical flows** — deferred broader coverage to Phase 2+.

---

## 6.1 Critical User Flows (Phase 1 — Only These)

| # | Flow | Description |
|---|------|-------------|
| 1 | **Registration → Login → View Accounts** | New user signs up, logs in, sees account dashboard |
| 2 | **View Accounts → Open Account → View Balance** | Existing user opens new PAY/SAVINGS account, verifies balance |
| 3 | **Cash In** | User deposits coins via Cash In form, sees updated balance |

**Deferred to Phase 2+:**
- Transfer Coins, Pay Bills, Buy Load (similar patterns to Cash In)
- Error scenario flows (network failure, invalid input, timeouts)
- Responsive testing (mobile/tablet/desktop layouts)

---

## 6.2 Tool

| Tool | Decision |
|------|----------|
| **Playwright** | ✅ Selected — faster, cross-browser, modern API |

---

## 6.3 Implementation Considerations

- Use MSW to intercept API calls in E2E tests (`src/test/mocks/handlers.ts`)
- Run Playwright in headless mode for CI
- Use `data-testid` attributes for stable selectors
- Test on Chromium only in Phase 1 (add Firefox/WebKit in Phase 2)

---

## 6.4 Example E2E Test Structure

```javascript
// src/__tests__/e2e/flows/registration-login-flow.test.js
import { test, expect } from '@playwright/test';

test.describe('Registration → Login → View Accounts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  test('complete registration and login flow', async ({ page }) => {
    // 1. Register
    await page.fill('[data-testid="name"]', 'Test User');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'Test123!');
    await page.click('button[type="submit"]');

    // 2. Confirm registration modal
    await expect(page.locator('[data-testid="modal"]')).toBeVisible();
    await page.click('[data-testid="confirm-btn"]');

    // 3. Redirected to login
    await expect(page).toHaveURL('/login');

    // 4. Login
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'Test123!');
    await page.click('button[type="submit"]');

    // 5. View accounts page
    await expect(page).toHaveURL('/accounts');
    await expect(page.locator('[data-testid="account-list"]')).toBeVisible();
  });
});

// src/__tests__/e2e/flows/account-view-flow.test.js
import { test, expect } from '@playwright/test';

test.describe('View Accounts → Open Account', () => {
  test.beforeEach(async ({ page }) => {
    // Login first (use storage state or API call)
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'existing@example.com');
    await page.fill('[data-testid="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/accounts');
  });

  test('open new SAVINGS account', async ({ page }) => {
    await page.click('[data-testid="open-account-btn"]');
    await expect(page.locator('[data-testid="modal"]')).toBeVisible();
    await page.click('[data-testid="account-type-savings"]');
    await page.click('[data-testid="confirm-btn"]');
    await expect(page.locator('[data-testid="account-SAVINGS"]')).toBeVisible();
    await expect(page.locator('[data-testid="balance-SAVINGS"]')).toContainText('0');
  });
});

// src/__tests__/e2e/flows/cash-in-flow.test.js
import { test, expect } from '@playwright/test';

test.describe('Cash In', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[data-testid="email"]', 'test@example.com');
    await page.fill('[data-testid="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/accounts');
    await page.click('[data-testid="service-cash-in"]');
    await expect(page).toHaveURL('/services/cash-in');
  });

  test('successful cash in updates balance', async ({ page }) => {
    await page.fill('[data-testid="amount"]', '500');
    await page.click('button[type="submit"]');
    await expect(page.locator('[data-testid="modal"]')).toBeVisible();
    await page.click('[data-testid="confirm-btn"]');
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
    // Verify balance updated (navigate back to accounts)
    await page.goto('/accounts');
    await expect(page.locator('[data-testid="balance-PAY"]')).toContainText('500');
  });
});
```

---

## 6.5 Playwright Config

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

---

## 6.6 npm Scripts

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed"
  }
}
```

---

## 6.7 Key Points

- **3 flows only in Phase 1** — representative coverage, achievable in 1 week
- **MSW for API mocking** — same handlers as integration tests
- **data-testid on all interactive elements** — add during component development
- **Headless Chromium** — sufficient for CI; cross-browser later
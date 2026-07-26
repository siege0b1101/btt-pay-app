# 6. E2E Testing

## Overview

End-to-end testing validates complete user journeys across the application. This phase is optional and should be prioritized after critical unit/integration tests are stable.

---

## 6.1 Critical User Flows

These flows represent the most important user journeys and should be tested first:

1. **User Registration → Login → View Accounts**
2. **Open Account → View Balance → Perform Transaction**
3. **Pay Bills / Transfer Coins / Cash In**

---

## 6.2 Tool Options

| Tool | Pros | Cons |
|------|------|------|
| **Cypress** | Good for debugging, interactive, easy to learn | Single browser, slower execution |
| **Playwright** | Faster, better cross-browser support, modern API | Slightly steeper learning curve |

**Recommendation:** Start with Playwright for better cross-browser coverage and performance.

---

## 6.3 Implementation Considerations

- Use MSW to intercept API calls in E2E tests
- Mock external dependencies (e.g., payment gateways)
- Handle async state properly (loading, error, success)
- Test on real browser with real DOM interactions

---

## 6.4 Example E2E Test Structure

```javascript
// e2e/specs/registration-login.spec.js
import { test, expect } from '@playwright/test';

test('complete registration and login flow', async ({ page }) => {
  // 1. Navigate to registration page
  await page.goto('/register');

  // 2. Fill registration form
  await page.fill('[data-testid="name"]', 'Test User');
  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.fill('[data-testid="password"]', 'Test123!');

  // 3. Submit registration
  await page.click('button[type="submit"]');

  // 4. Verify modal appears
  await expect(page.locator('.modal')).toBeVisible();

  // 5. Confirm registration
  await page.click('button[data-testid="confirm"]');

  // 6. Verify redirect to login
  await expect(page).toHaveURL('/login');
});
```

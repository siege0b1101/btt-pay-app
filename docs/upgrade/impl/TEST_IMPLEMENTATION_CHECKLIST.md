# Test Implementation Checklist

This checklist provides a clear, actionable list of test files to implement during the testing infrastructure setup and migration phases. **Updated for Vitest, lowered Phase 1 targets, and consolidated scope.**

---

## Phase 1: Testing Infrastructure Setup (Week 1)

**Priority:** HIGH  
**Estimated Effort:** 4-6 hours

- [ ] Install dependencies:
  ```bash
  npm install --save-dev vitest @vitejs/plugin-react @vitest/coverage-v8 \
    @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom msw
  npm install --save-dev @playwright/test
  npx playwright install --with-deps chromium
  ```
- [ ] Create `vitest.config.ts` at project root
- [ ] Create `src/test/setup.ts` (mock axios, react-router-dom)
- [ ] Create `src/test/utils.tsx` (`renderWithStore`, `mockUser`, `mockAccount`)
- [ ] Create `src/test/mocks/handlers.ts` (MSW handlers for integration/E2E)
- [ ] Add npm scripts:
  - `npm test` → `vitest`
  - `npm run test:watch` → `vitest --watch`
  - `npm run test:coverage` → `vitest run --coverage`
  - `npm run test:ui` → `vitest --ui`
  - `npm run test:e2e` → `playwright test`
- [ ] Verify: `npm test` passes (0 tests, 0 failures)

---

## Phase 2: Unit Tests - Core Logic (Priority 1 — Highest ROI)

**Phase 1 Coverage Target:** 50-60%  
**Estimated Effort:** 8-12 hours

### Store Thunks (Pure logic, no UI)
- [ ] `src/util/store.test.js` - Auth thunks
  - [ ] `login` thunk (success)
  - [ ] `login` thunk (error)
  - [ ] `logout` thunk
  - [ ] `register` thunk (success)
  - [ ] `register` thunk (error)
- [ ] `src/util/store.test.js` - Account thunks
  - [ ] `createAccount` thunk
  - [ ] `getAccounts` thunk
  - [ ] `checkAccountExists` thunk
- [ ] `src/util/store.test.js` - Transaction thunks
  - [ ] `cashIn` thunk
  - [ ] `transferCoins` thunk
  - [ ] `payBills` thunk
  - [ ] `buyLoad` thunk

### Validation Utils & Regex (Pure functions, 100% target)
- [ ] `src/util/validations.test.js`
  - [ ] `validateEmail`
  - [ ] `validatePassword`
  - [ ] `validateName`
  - [ ] `validatePhone`
  - [ ] `validateAmount`
  - [ ] `validateAccountType`
- [ ] `src/util/regexPatterns.test.js`
  - [ ] `REGEX_EMAIL`
  - [ ] `REGEX_PHONE`
  - [ ] `REGEX_REFERENCE`
  - [ ] `REGEX_BILL_NUMBER`

### Custom Hooks
- [ ] `src/util/hooks/useAuth.test.jsx`
  - [ ] Initial state
  - [ ] Token decode from localStorage
  - [ ] Login sets user/token
  - [ ] Logout clears state
- [ ] `src/util/hooks/useWindowSize.test.jsx`
  - [ ] Initial state (undefined)
  - [ ] Updates on resize
  - [ ] Cleanup on unmount

### API Adapter
- [ ] `src/adapters/api.test.js`
  - [ ] Base URL configuration
  - [ ] Request interceptor (JWT attach)
  - [ ] Response interceptor (401 handling)
  - [ ] Error handling

---

## Phase 3: Unit Tests - Forms & Pages (Priority 2)

**Phase 1 Coverage Target:** 50-60%  
**Estimated Effort:** 8-10 hours

### Transaction Forms (Business critical)
- [ ] `src/components/services/CashInForm.test.jsx`
  - [ ] Form rendering
  - [ ] Amount validation (required, positive, max)
  - [ ] Reference number display
  - [ ] Successful submission → confirmation modal
  - [ ] API error handling
- [ ] `src/components/services/TransferCoinsForm.test.jsx`
  - [ ] Form rendering
  - [ ] Recipient validation
  - [ ] Amount validation
  - [ ] Successful submission → confirmation modal
  - [ ] API error handling (insufficient balance)
- [ ] `src/components/services/PayBillsForm.test.jsx`
  - [ ] Form rendering
  - [ ] Biller selection
  - [ ] Account number validation
  - [ ] Amount validation
  - [ ] Successful submission → confirmation modal
  - [ ] API error handling
- [ ] `src/components/services/BuyLoadForm.test.jsx`
  - [ ] Form rendering
  - [ ] Provider selection
  - [ ] Amount selection
  - [ ] Successful submission → confirmation modal
  - [ ] API error handling

### Pages
- [ ] `src/pages/Login.test.jsx`
  - [ ] Form rendering
  - [ ] Invalid credentials error
  - [ ] Successful login → redirect/modal
- [ ] `src/pages/Register.test.jsx`
  - [ ] Form rendering
  - [ ] Validation errors (name, email, password)
  - [ ] Successful registration → modal → redirect
- [ ] `src/pages/Accounts.test.jsx`
  - [ ] Account listing display
  - [ ] Balance display
  - [ ] Account switching (PAY/SAVINGS)
  - [ ] Open Account button → modal
- [ ] `src/pages/Transactions.test.jsx`
  - [ ] Transaction list display
  - [ ] Transaction details (date, type, amount)
  - [ ] Empty state
- [ ] `src/pages/ServiceMenu.test.jsx`
  - [ ] Service menu rendering
  - [ ] Navigation to each service form

### Layout Components
- [ ] `src/components/layout/Modal.test.jsx`
  - [ ] Open/close visibility
  - [ ] Confirm callback
  - [ ] Cancel callback
  - [ ] Cleanup
- [ ] `src/components/layout/Header.test.jsx`
  - [ ] User info display
  - [ ] Logout button
  - [ ] Mobile menu toggle
- [ ] `src/components/layout/Sidebar.test.jsx`
  - [ ] Navigation links
  - [ ] Active route highlighting
  - [ ] Collapse/expand
- [ ] `src/components/layout/MobileMenu.test.jsx`
  - [ ] Navigation links
  - [ ] Close button

---

## Phase 4: Integration Tests (Priority 3)

**Phase 1 Coverage Target:** 30-40%  
**Estimated Effort:** 4-6 hours

- [ ] `src/__tests__/integration/transactions.integration.test.jsx`
  - [ ] CashInForm submission with MSW
  - [ ] TransferCoinsForm submission with MSW
  - [ ] PayBillsForm submission with MSW
  - [ ] BuyLoadForm submission with MSW
  - [ ] Error handling (400, 500, network failure)
  - [ ] Loading state during submission
  - [ ] Confirmation modal callbacks

---

## Phase 5: E2E Tests (Priority 4)

**Phase 1 Coverage Target:** 10-15% (3 flows at 100%)  
**Estimated Effort:** 6-8 hours

### Critical User Flows (only these in Phase 1)
- [ ] `src/__tests__/e2e/flows/registration-login-flow.test.js`
  - [ ] Registration → modal confirm → redirect to login
  - [ ] Login → redirect to accounts
  - [ ] View account list
- [ ] `src/__tests__/e2e/flows/account-view-flow.test.js`
  - [ ] View accounts (PAY/SAVINGS)
  - [ ] Open Account → modal → select type → confirm
  - [ ] Verify new account appears with 0 balance
- [ ] `src/__tests__/e2e/flows/cash-in-flow.test.js`
  - [ ] Navigate to Cash In
  - [ ] Enter amount → submit → confirm
  - [ ] Verify success message
  - [ ] Verify balance updated on accounts page

### Playwright Setup
- [ ] `playwright.config.ts` (Chromium, headless, webServer)
- [ ] Add `data-testid` attributes to components as needed

---

## Phase 6: Review & Refine (Priority 5)

**Estimated Effort:** 2-3 hours

- [ ] Run `npm run test:coverage` — verify Phase 1 targets met:
  - Unit: ≥50%
  - Integration: ≥30%
  - E2E: 3 flows passing
  - Global: ≥50%
- [ ] Review test quality (no flaky tests, clear assertions)
- [ ] Document any gaps for Phase 2
- [ ] Update checklist as needed

---

## Phase 7: CI/CD Integration (Priority 6 — Optional for Solo Dev)

**Estimated Effort:** 2-3 hours

- [ ] Create `.github/workflows/test.yml`
  - Run `npm run test:coverage` on PR/push
  - Run `npm run test:e2e` on PR/push
  - Upload coverage artifacts
  - Fail if coverage < Phase 1 thresholds
- [ ] Configure GitHub Pages for coverage report (optional)
- [ ] Configure Playwright HTML report upload (optional)

---

## Phase 8: Documentation (Priority 7 — Optional for Solo Dev)

**Estimated Effort:** 1-2 hours

- [ ] Document test setup in `CONTRIBUTING.md` or `TESTING.md`
- [ ] Document "How to add a test" pattern
- [ ] Document mock data factories
- [ ] Document coverage targets (Phase 1 vs Phase 2+)

---

## Summary

| Phase | Description | Priority | Estimated Effort | Phase 1 Target |
|-------|-------------|----------|------------------|----------------|
| 1 | Testing Infrastructure Setup | HIGH | 4-6 hrs | Working runner |
| 2 | Unit Tests - Core Logic | HIGH | 8-12 hrs | 50-60% |
| 3 | Unit Tests - Forms & Pages | HIGH | 8-10 hrs | 50-60% |
| 4 | Integration Tests | HIGH | 4-6 hrs | 30-40% |
| 5 | E2E Tests (3 flows) | HIGH | 6-8 hrs | 3 flows @ 100% |
| 6 | Review & Refine | MEDIUM | 2-3 hrs | Targets met |
| 7 | CI/CD Integration | LOW* | 2-3 hrs | Optional |
| 8 | Documentation | LOW* | 1-2 hrs | Optional |

**Total Estimated Effort (Phases 1-6):** 32-45 hours  
*Phases 7-8 marked LOW for solo developer — do when valuable

---

## Coverage Targets Summary

| Phase | Unit | Integration | E2E | Global Minimum |
|-------|------|-------------|-----|----------------|
| **Phase 1** | **50-60%** | **30-40%** | **3 flows** | **50%** |
| Phase 2+ | 80-90% | 60-70% | 40-50% | 60% |

---

## Notes

1. **Unit tests** target 50-60% in Phase 1 — focus on high-ROI areas first (store, validations, hooks, forms)
2. **Integration tests** consolidated into 1 file for all transaction forms
3. **E2E tests** only 3 critical flows in Phase 1 — representative coverage
4. **Vitest + Playwright** — no Jest, no Cypress, aligned with Vite migration
5. **Mock strategy:** `vi.mock('axios')` + `vi.mock('react-router-dom')` in `setup.ts` for unit; MSW only for integration/E2E
6. **Test utilities:** `src/test/utils.tsx` provides `renderWithStore`, factories, re-exports — import everywhere
7. Adjust priorities/estimates based on actual progress
8. Update this checklist as you implement tests
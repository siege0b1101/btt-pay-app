# Test Implementation Checklist

Details live in [TESTING_PLAN.md](../TESTING_PLAN.md) — this file is tracking only.

## Step 1: Infrastructure (4–6 hrs)

- [ ] Install dependencies ([§1](../TESTING_PLAN.md#1-tools--setup))
- [ ] Create `vitest.config.ts`
- [ ] Create `src/test/setup.ts`, `src/test/utils.tsx`, `src/test/mocks/handlers.ts`
- [ ] Add npm scripts: `test`, `test:coverage`, `test:e2e`
- [ ] Verify: `npm test` passes (0 tests, 0 failures)

## Step 2: Unit Tests — Core Logic (8–12 hrs)

- [ ] `src/util/store.test.js` — auth, account, transaction thunks
- [ ] `src/util/validations.test.js` — all validators incl. edge cases
- [ ] `src/util/hooks/useAuth.test.jsx` + `useWindowSize.test.jsx`
- [ ] `src/adapters/api.test.js`

## Step 3: Unit Tests — Forms & Pages (8–10 hrs)

- [ ] 4 transaction forms (`CashInForm`, `TransferCoinsForm`, `PayBillsForm`, `BuyLoadForm`)
- [ ] Pages: Login, Register, Accounts, Transactions, ServiceMenu
- [ ] Layout: Modal, Header, Sidebar, MobileMenu

## Step 4: Integration Tests (4–6 hrs)

- [ ] `src/__tests__/integration/transactions.integration.test.jsx` — all 4 forms: success, error, loading

## Step 5: E2E Tests (6–8 hrs)

- [ ] `playwright.config.ts` (Chromium, headless, webServer)
- [ ] Add `data-testid` attributes as needed
- [ ] 3 flows: registration-login, open-account, cash-in

## Step 6: Review & Refine (2–3 hrs)

- [ ] `npm run test:coverage` — global ≥50%, no flaky tests
- [ ] Note gaps for Phase 2+

CI/CD and testing docs: deferred until valuable.

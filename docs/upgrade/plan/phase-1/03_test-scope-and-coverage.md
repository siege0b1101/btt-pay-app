# 3. Test Scope and Coverage

## Overview

This document defines the scope and coverage targets for each type of testing. **Phase 1 targets are lowered** to be achievable from a 0% baseline; Phase 2+ targets raise the bar.

---
## 3.1 Coverage Strategy

**Coverage targets are defined per test type and phase:**

### Phase 1 (Initial Implementation)

| Test Type | Coverage Target | Applies To |
|-----------|-----------------|------------|
| Unit | **50-60%** | Store thunks, validations, hooks, API adapter, forms, pages |
| Integration | **30-40%** | Transaction flows (single consolidated file) |
| E2E | **10-15%** | 3 critical flows only |

**Global Threshold (Phase 1):** Minimum **50%** overall (branches, functions, lines, statements).

### Phase 2+ (Maturity Targets)

| Test Type | Coverage Target | Applies To |
|-----------|-----------------|------------|
| Unit | 80-90% | All components, utilities, hooks |
| Integration | 60-70% | Component interactions, API calls |
| E2E | 40-50% | Critical user flows |

**Global Threshold (Phase 2+):** Minimum **60%** overall code coverage.

**Note:** "Coverage targets met" in Success Criteria means meeting the **Phase 2+ targets** before migration. Phase 1 is about establishing infrastructure and critical-path coverage.

---
## 3.2 Unit Tests

**Phase 1 Coverage Target:** 50-60%

**Priority Order (high ROI first):**
1. **Store thunks** (`login`, `register`, `logout`, `createAccount`, `getAccounts`, transaction thunks)
2. **Validation utils** (`validations.js`, `regexPatterns.js`) — pure functions, easy wins
3. **Custom hooks** (`useAuth`, `useWindowSize`)
4. **API adapter** (`api.js`)
5. **Transaction forms** (`CashInForm`, `TransferCoinsForm`, `PayBillsForm`, `BuyLoadForm`)
6. **Pages** (`Login`, `Register`, `Accounts`, `Transactions`, `ServiceMenu`)
7. **Layout components** (`Modal`, `Header`, `Sidebar`, `MobileMenu`)

**Focus**
- Component rendering
- State management
- Form validation
- Utility functions
- Reducer/thunk logic

---
## 3.3 Integration Tests

**Phase 1 Coverage Target:** 30-40%

**Scope:** Single consolidated test file covering all 4 transaction forms via shared patterns.

**Focus**
- Component interactions with real API calls (MSW)
- State transitions (loading → success/error)
- Modal confirm/cancel callbacks

---
## 3.4 E2E Tests

**Phase 1 Coverage Target:** 10-15% (3 critical flows at 100% each)

**Critical Flows (only these in Phase 1):**
1. **Registration → Login → View Accounts**
2. **View Accounts → Open Account → View Balance**
3. **Cash In** (representative transaction flow)

**Deferred to Phase 2+:**
- Transfer Coins, Pay Bills, Buy Load (similar patterns to Cash In)
- Error scenario flows
- Responsive testing

**Focus**
- Critical user journeys
- Real browser interactions

---
## 3.5 Global Threshold

**Phase 1 Minimum Acceptable Coverage:** 50% (branches, functions, lines, statements)

**Phase 2+ Minimum Acceptable Coverage:** 60% (branches, functions, lines, statements)

**Note:** This threshold applies to the entire codebase.

---
## 3.6 Coverage Exclusions

The following files are excluded from coverage calculations:

- `src/index.js` - Entry point
- `src/test/**` - Test infrastructure (setup, utils, mocks)
- `src/__mocks__/**` - Legacy mock files (remove after migration)
- `src/**/*.test.{js,jsx,ts,tsx}` - Test files themselves
- Third-party libraries (axios, react-router-dom, easy-peasy, etc.)
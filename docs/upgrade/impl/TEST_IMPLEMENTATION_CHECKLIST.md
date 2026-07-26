# Test Implementation Checklist

This checklist provides a clear, actionable list of test files to implement during the testing infrastructure setup and migration phases.

---

## Phase 1: Testing Infrastructure Setup

**Priority:** HIGH  
**Estimated Effort:** 4-6 hours

- [ ] Create `src/__tests__/` directory structure
- [ ] Configure Jest in `package.json`
- [ ] Create `src/setupTests.js`
- [ ] Create `src/__mocks__/api.js` (MSW server setup)
- [ ] Create `src/__mocks__/@react-router-dom.js` (React Router mocks)
- [ ] Create `src/__tests__/__mocks__/mockComponents.js` (mock components for isolation)
- [ ] Create `src/__tests__/__mocks__/user.js` (test data)
- [ ] Configure coverage thresholds in Jest config
- [ ] Add npm scripts for tests:
  - `npm test` - Run tests
  - `npm run test:watch` - Run tests in watch mode
  - `npm run test:coverage` - Run tests with coverage report

---

## Phase 2: Unit Tests - Critical Components (Priority: HIGH)

**Coverage Target:** 80-90%
**Estimated Effort:** 8-12 hours

### Authentication
- [ ] `src/pages/Login.test.js`
  - Test successful login with valid credentials
  - Test failed login with invalid credentials
  - Test login error handling
  - Test modal appearance and callback

- [ ] `src/pages/Register.test.js`
  - Test successful registration
  - Test registration with invalid data
  - Test username validation
  - Test email validation
  - Test password validation
  - Test modal appearance and callback

- [ ] `src/util/hooks/useAuth.test.js`
  - Test initial state
  - Test login functionality
  - Test logout functionality
  - Test token decoding
  - Test localStorage persistence

- [ ] `src/util/store.js` - Auth Thunks
  - Test `login` thunk (success path)
  - Test `login` thunk (error path)
  - Test `logout` thunk
  - Test `register` thunk (success path)
  - Test `register` thunk (error path)

### Account Management
- [ ] `src/pages/Accounts.test.js`
  - Test account listing display
  - Test balance display
  - Test account switching (PAY/SAVINGS)
  - Test "Open Account" button click
  - Test error states

- [ ] `src/pages/OpenAccount.test.js` (if exists)
  - Test account creation form
  - Test account type selection
  - Test validation
  - Test successful account creation
  - Test error handling

- [ ] `src/util/store.js` - Account Thunks
  - Test `createAccount` thunk
  - Test `getAccounts` thunk
  - Test `checkAccountExists` thunk

### Transaction Forms
- [ ] `src/components/services/CashInForm.test.js`
  - Test form rendering
  - Test amount input validation
  - Test reference number generation
  - Test successful cash-in submission
  - Test error handling (insufficient balance, invalid amount)

- [ ] `src/components/services/TransferCoinsForm.test.js`
  - Test form rendering
  - Test recipient selection
  - Test amount input validation
  - Test successful transfer submission
  - Test error handling (insufficient balance, invalid recipient)

- [ ] `src/components/services/PayBillsForm.test.js`
  - Test form rendering
  - Test bill type selection
  - Test bill number input validation
  - Test successful bill payment submission
  - Test error handling (invalid bill number, insufficient balance)

- [ ] `src/components/services/BuyLoadForm.test.js`
  - Test form rendering
  - Test provider selection
  - Test load amount selection
  - Test successful load purchase submission
  - Test error handling (insufficient balance, invalid provider)

### Layout Components (85-90% coverage target)
- [ ] `src/components/layout/Modal.test.js`
  - Test modal opening/closing
  - Test confirm/cancel buttons
  - Test modal callback execution
  - Test modal cleanup

- [ ] `src/components/layout/Header.test.js`
  - Test header rendering
  - Test user info display
  - Test logout button click
  - Test mobile menu toggle

- [ ] `src/components/layout/Sidebar.test.js`
  - Test sidebar rendering
  - Test navigation links
  - Test navigation callback
  - Test collapse/expand

- [ ] `src/components/layout/MobileMenu.test.js`
  - Test mobile menu rendering
  - Test navigation links
  - Test close button
  - Test responsive behavior

### Utility Functions (70-80% coverage target)
- [ ] `src/util/validations.test.js`
  - Test email validation
  - Test password validation
  - Test name validation
  - Test phone validation
  - Test account type validation
  - Test amount validation

### Custom Hooks (80-90% coverage target)
- [ ] `src/util/hooks/useWindowSize.test.js`
  - Test initial state (undefined width/height)
  - Test updates on window resize
  - Test responsive breakpoints
  - Test cleanup on unmount

### Regex Pattern Tests
- [ ] `src/util/regexPatterns.test.js`
  - Test email regex pattern
  - Test phone regex pattern
  - Test reference number regex pattern
  - Test bill number regex pattern

- [ ] `src/util/api.test.js`
  - Test API base URL configuration
  - Test request interceptor
  - Test response interceptor
  - Test error handling
  - Test JWT token handling

---

## Phase 3: Unit Tests - Important Components (Priority: MEDIUM)

**Coverage Target:** 80-90%  
**Estimated Effort:** 4-6 hours

### Transaction History
- [ ] `src/pages/Transactions.test.js`
  - Test transaction list display
  - Test transaction details (date, type, amount)
  - Test filter functionality
  - Test pagination (if implemented)
  - Test empty state

### Service Menu
- [ ] `src/pages/ServiceMenu.test.js`
  - Test service menu rendering
  - Test service item display
  - Test navigation to service forms
  - Test error states

- [ ] `src/components/services/ServiceMenuItem.test.js`
  - Test menu item rendering
  - Test icon display
  - Test click callback

### General Components
- [ ] `src/components/general/TextField.test.js`
  - Test input rendering
  - Test label display
  - Test error message display
  - Test validation state

- [ ] `src/components/general/Button.test.js`
  - Test button rendering
  - Test click callback
  - Test disabled state
  - Test loading state

- [ ] `src/components/general/ValidatedTextField.test.js`
  - Test input rendering
  - Test validation state
  - Test error message display
  - Test clear functionality

---

## Phase 4: Integration Tests (Priority: HIGH)

**Coverage Target:** 60-70%  
**Estimated Effort:** 6-8 hours

### Critical Flows
- [ ] `src/__tests__/integration/pages/Accounts.integration.test.js`
  - Test account listing with API
  - Test account creation flow
  - Test balance viewing
  - Test account switching

- [ ] `src/__tests__/integration/pages/Login.integration.test.js`
  - Test login flow with API
  - Test error handling
  - Test redirect after login

- [ ] `src/__tests__/integration/pages/Register.integration.test.js`
  - Test registration flow with API
  - Test validation
  - Test redirect after registration

### Transaction Flows
- [ ] `src/__tests__/integration/services/CashInForm.integration.test.js`
  - Test cash-in submission with API
  - Test successful cash-in flow
  - Test error handling (network failure, insufficient balance)

- [ ] `src/__tests__/integration/services/TransferCoinsForm.integration.test.js`
  - Test transfer submission with API
  - Test successful transfer flow
  - Test error handling (network failure, insufficient balance)

- [ ] `src/__tests__/integration/services/PayBillsForm.integration.test.js`
  - Test bill payment submission with API
  - Test successful payment flow
  - Test error handling (invalid bill number, network failure)

- [ ] `src/__tests__/integration/services/BuyLoadForm.integration.test.js`
  - Test load purchase submission with API
  - Test successful purchase flow
  - Test error handling (invalid provider, network failure)

---

## Phase 5: E2E Tests (Priority: HIGH)

**Coverage Target:** 40-50% (critical flows 100%)  
**Estimated Effort:** 8-12 hours

### Critical User Flows
- [ ] `src/__tests__/e2e/flows/registration-login-flow.test.js`
  - Test registration → login → view accounts
  - Test error scenarios
  - Test responsive behavior

- [ ] `src/__tests__/e2e/flows/account-view-flow.test.js`
  - Test account listing
  - Test balance viewing
  - Test account switching
  - Test "Open Account" flow

- [ ] `src/__tests__/e2e/flows/cash-in-flow.test.js`
  - Test cash-in submission
  - Test successful cash-in
  - Test error scenarios

- [ ] `src/__tests__/e2e/flows/transfer-flow.test.js`
  - Test transfer submission
  - Test successful transfer
  - Test error scenarios

- [ ] `src/__tests__/e2e/flows/pay-bills-flow.test.js`
  - Test bill payment submission
  - Test successful payment
  - Test error scenarios

- [ ] `src/__tests__/e2e/flows/buy-load-flow.test.js`
  - Test load purchase submission
  - Test successful purchase
  - Test error scenarios

### Error Scenarios
- [ ] `src/__tests__/e2e/flows/error-handling.test.js`
  - Test network error handling
  - Test invalid credentials
  - Test invalid input handling
  - Test timeout scenarios

### Responsive Testing
- [ ] `src/__tests__/e2e/flows/responsive.test.js`
  - Test mobile layout
  - Test tablet layout
  - Test desktop layout
  - Test mobile menu functionality

---

## Phase 6: Utility Tests (Priority: MEDIUM)

**Coverage Target:** 80-90%  
**Estimated Effort:** 2-3 hours

### Validation Functions
- [ ] `src/util/validations.test.js`
  - Test email validation with edge cases
  - Test password validation with edge cases
  - Test name validation with edge cases
  - Test phone validation with edge cases
  - Test account type validation
  - Test amount validation with edge cases

### Store Tests
- [ ] `src/util/store.test.js`
  - Test store initialization
  - Test state persistence
  - Test thunk actions
  - Test error handling

### API Adapter
- [ ] `src/adapters/api.test.js`
  - Test API base URL
  - Test request/response interceptors
  - Test error handling
  - Test JWT token handling

---

## Phase 7: Review and Refine (Priority: MEDIUM)

**Estimated Effort:** 2-3 hours

- [ ] Review all tests for quality and maintainability
- [ ] Check coverage reports against targets
- [ ] Refine tests based on findings
- [ ] Document any gaps or missing test cases
- [ ] Update checklist as needed

---

## Phase 8: CI/CD Integration (Priority: HIGH)

**Estimated Effort:** 2-3 hours

- [ ] Configure GitHub Actions workflow for tests
- [ ] Set up coverage reporting
- [ ] Configure test runners for CI
- [ ] Set up test artifacts (coverage reports, test results)
- [ ] Configure notifications for test failures

### 2.3 Test File Naming Conventions
- [ ] Add to checklist: Test files follow naming patterns
  - Unit: `ComponentName.test.js`
  - Integration: `ComponentName.integration.test.js`
  - E2E: `feature-flow.test.js`

### 2.4 Test Structure Organization
- [ ] Add to checklist: Create `src/__tests__/` directory structure
  - `src/__tests__/unit/` - Unit tests (isolated, fast)
  - `src/__tests__/integration/` - Integration tests (multiple components/API)
  - `src/__tests__/e2e/` - E2E tests (full user flows)

### 3.6 Coverage Exclusions
- [ ] Add to checklist: Exclude files from coverage calculations
  - `src/index.js` - Entry point
  - `src/setupTests.js` - Test setup
  - `src/__mocks__/**` - Mock files
  - `src/**/*.test.js` - Test files themselves
  - Third-party libraries (axios, react-router-dom, etc.)

---

## Phase 9: Documentation (Priority: MEDIUM)

**Estimated Effort:** 1-2 hours

- [ ] Document test setup process
- [ ] Document test writing guidelines
- [ ] Document mock data structure
- [ ] Document coverage targets
- [ ] Create test onboarding guide

---

## Summary

| Phase | Description | Priority | Estimated Effort |
|-------|-------------|----------|------------------|
| 1 | Testing Infrastructure Setup | HIGH | 4-6 hours |
| 2 | Unit Tests - Critical Components | HIGH | 8-12 hours |
| 3 | Unit Tests - Important Components | MEDIUM | 4-6 hours |
| 4 | Integration Tests | HIGH | 6-8 hours |
| 5 | E2E Tests | HIGH | 8-12 hours |
| 6 | Utility Tests | MEDIUM | 2-3 hours |
| 7 | Review and Refine | MEDIUM | 2-3 hours |
| 8 | CI/CD Integration | HIGH | 2-3 hours |
| 9 | Documentation | MEDIUM | 1-2 hours |

**Total Estimated Effort:** 40-52 hours

---

## Coverage Targets Summary

| Test Type | Coverage Target | Applies To |
|-----------|-----------------|------------|
| Unit | 80-90% | All components, utilities, hooks |
| Integration | 60-70% | Component interactions, API calls |
| E2E | 40-50% (critical flows 100%) | Critical user flows |
| Global Minimum | 60% | Entire codebase |

---

## Notes

1. **Unit tests** target 80-90% coverage for all components, utilities, and hooks
2. **Important components** (Layout, Forms) should aim for the higher end of 80-90%
3. **Standard components** (Utilities, Helpers) can target the lower end of 80-90%
4. **Utility tests** are merged into Phase 2 (Unit Tests) with HIGH priority since they contain core validation logic
5. Adjust priorities and estimates based on actual project needs
6. **Critical user flows** in E2E tests should have 100% coverage within the 40-50% E2E target
7. Update this checklist as you implement tests
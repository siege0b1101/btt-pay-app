# Phase 3: Test Priority & Coverage Targets

## Coverage Targets

| Priority | Coverage Goal | Description |
|----------|---------------|-------------|
| **Critical** | 100% | Must test - core user flows |
| **Important** | 80% | Should test - important features |
| **Nice to Have** | 20% | Nice to have - non-critical features |

**Overall Target:** 60% minimum coverage across all components

**Breakdown:**
- Critical Path: 60% (Login, Register, Modal, Accounts, Transactions, API Adapter)
- Important: 30% (Forms, Service Components, Layout, Store)
- Nice to Have: 10% (Helper Components, Info Pages)

---

## Critical Path (Must Test)

| Component | Test Focus |
|-----------|------------|
| **Login** | Form validation, auth flow, error handling |
| **Register** | Form validation, registration flow, duplicate check |
| **Modal** | Confirm/Cancel flows, callback execution |
| **Accounts** | Account creation, account switching |
| **Transaction Forms** | CashInForm, TransferCoinsForm, PayBillsForm, BuyLoadForm |
| **Transaction History** | Transactions page, display, filtering |
| **API Adapter** | Request/response structure, error handling |

## Important (Should Test)

| Component | Test Focus |
|-----------|------------|
| **Forms** | Validation, form submission |
| **Service Components** | Form handling, service interactions |
| **Layout Components** | Header, Footer, MobileMenu |
| **Store** | State actions, thunk actions |
| **Hooks** | Custom React hooks (useAuth, etc.) |
| **Adapters** | API adapter (axios wrapper) |

## Nice to Have

| Component | Test Focus |
|-----------|------------|
| **Helper Components** | Button, TextField, Card components |
| **Pages** | About, Contact, Help, Home |
| **Utils** | Validation utilities, regex patterns |
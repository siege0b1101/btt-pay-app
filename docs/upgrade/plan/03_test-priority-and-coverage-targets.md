# Phase 3: Test Priority & Coverage Targets

## Critical Path (Must Test - 60% coverage)

| Component | Test Focus | Priority |
|-----------|------------|----------|
| **Login** | Form validation, auth flow, error handling | 🔴 Critical |
| **Register** | Form validation, registration flow, duplicate check | 🔴 Critical |
| **Modal** | Confirm/Cancel flows, callback execution | 🔴 Critical |
| **Accounts** | Account creation, account switching | 🔴 Critical |
| **Transactions** | Cash-in, transfer, pay bills, buy load | 🔴 Critical |
| **API Adapter** | Request/response structure, error handling | 🔴 Critical |

## Important (Should Test - 30% coverage)

| Component | Test Focus | Priority |
|-----------|------------|----------|
| **Forms** | Validation, form submission | 🟡 High |
| **Service Components** | Form handling, service interactions | 🟡 High |
| **Layout Components** | Header, Footer, MobileMenu | 🟡 Medium |
| **Store** | State actions, thunk actions | 🟡 Medium |

## Nice to Have (10% coverage)

| Component | Test Focus | Priority |
|-----------|------------|----------|
| **Helper Components** | Button, TextField, Card components | 🟢 Low |
| **Pages** | About, Contact, Help, Home | 🟢 Low |
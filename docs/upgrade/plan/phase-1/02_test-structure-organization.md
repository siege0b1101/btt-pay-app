# 2. Test Structure Organization

## Overview

This document outlines the test directory structure for organizing tests by type (unit, integration, E2E) and feature location, mirroring the `src/` structure for easy navigation.

---
## 2.1 Target Directory Structure

```
src/
├── __tests__/
│   ├── unit/                    # Unit tests (isolated, fast)
│   │   ├── components/
│   │   │   ├── general/
│   │   │   │   ├── TextField.test.jsx
│   │   │   │   ├── Button.test.jsx
│   │   │   │   └── ValidatedTextField.test.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Modal.test.jsx
│   │   │   │   ├── Header.test.jsx
│   │   │   │   └── Sidebar.test.jsx
│   │   │   └── services/
│   │   │       ├── CashInForm.test.jsx
│   │   │       ├── TransferCoinsForm.test.jsx
│   │   │       ├── PayBillsForm.test.jsx
│   │   │       └── BuyLoadForm.test.jsx
│   │   ├── pages/
│   │   │   ├── Login.test.jsx
│   │   │   ├── Register.test.jsx
│   │   │   ├── Accounts.test.jsx
│   │   │   ├── Transactions.test.jsx
│   │   │   └── ServiceMenu.test.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.test.jsx
│   │   │   └── useWindowSize.test.jsx
│   │   ├── adapters/
│   │   │   └── api.test.js
│   │   ├── store/
│   │   │   └── store.test.js
│   │   └── util/
│   │       ├── validations.test.js
│   │       └── regexPatterns.test.js
│   ├── integration/             # Integration tests (multiple components/API)
│   │   └── transactions.integration.test.jsx
│   └── e2e/                     # E2E tests (full user flows)
│       └── flows/
│           ├── registration-login-flow.test.js
│           ├── account-view-flow.test.js
│           └── cash-in-flow.test.js
├── test/
│   ├── setup.ts                 # Global Vitest setup (mocks axios, router)
│   ├── utils.tsx                # renderWithStore, test data factories
│   └── mocks/
│       ├── axios.ts             # Axios mock factory (if needed separately)
│       ├── router.ts            # React Router mock
│       └── handlers.ts          # MSW handlers for integration/E2E
├── setupTests.js               # Legacy CRA Jest setup (remove after migration)
└── __mocks__/                  # Legacy mocks (remove after migration)
```

## 2.2 File Naming Conventions

| Test Type | File Extension | Naming Pattern |
|-----------|----------------|----------------|
| Unit | `.test.jsx` / `.test.js` | `ComponentName.test.jsx` |
| Integration | `.integration.test.jsx` | `feature.integration.test.jsx` |
| E2E | `.test.js` | `feature-flow.test.js` |

**Notes:**
- Use `.test.jsx` for files testing React components (JSX)
- Use `.test.js` for pure logic/utils (no JSX)
- Co-locate test files with source in `__tests__/unit/` mirroring `src/`
# 2. Test Structure Organization

## Overview

This document outlines the test directory structure for organizing tests by type (unit, integration, E2E) and feature location. It covers the recommended directory layout, file naming conventions to maintain a clean, maintainable testing infrastructure.

---
## 2.1 Target Directory Structure

```
src/
├── __tests__/
│   ├── unit/                    # Unit tests (isolated, fast)
│   │   ├── components/
│   │   │   ├── general/
│   │   │   │   ├── TextField.test.js
│   │   │   │   ├── Button.test.js
│   │   │   │   └── ValidatedTextField.test.js
│   │   │   ├── layout/
│   │   │   │   ├── Modal.test.js
│   │   │   │   ├── Header.test.js
│   │   │   │   └── Sidebar.test.js
│   │   │   └── services/
│   │   │       ├── PayBillsForm.test.js
│   │   │       ├── TransferCoinsForm.test.js
│   │   │       └── CashInForm.test.js
│   │   ├── pages/
│   │   │   ├── Login.test.js
│   │   │   ├── Register.test.js
│   │   │   ├── Accounts.test.js
│   │   │   └── Transactions.test.js
│   │   ├── hooks/
│   │   │   └── useAuth.test.js
│   │   ├── adapters/
│   │   │   └── api.test.js
│   │   ├── store/
│   │   │   └── store.test.js
│   │   └── utils/
│   │       ├── validations.test.js
│   │       └── regexPatterns.test.js
│   ├── integration/             # Integration tests (multiple components/API)
│   │   ├── components/
│   │   └── pages/
│   │       └── Accounts.integration.test.js
│   └── e2e/                     # E2E tests (full user flows)
│       └── flows/
│           ├── login-flow.test.js
│           ├── registration-flow.test.js
│           └── transaction-flow.test.js
├── setupTests.js               # Global test setup (CRA convention)
└── __mocks__/
    ├── api.js                  # Mock API responses for MSW
    ├── @react-router-dom.js     # Mock React Router hooks
	├── mockComponents.js   # Mock components for isolation testing only
	└── user.js            # Test data (realistic production data)
```

## 2.2 File Naming Conventions

| Test Type | File Extension | Naming Pattern |
|-----------|----------------|----------------|
| Unit | `.test.js` | `ComponentName.test.js` |
| Integration | `.integration.test.js` | `ComponentName.integration.test.js` |
| E2E | `.test.js` | `feature-flow.test.js` |

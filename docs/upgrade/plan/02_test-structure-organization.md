# Phase 2: Test Structure Organization

## Target Directory Structure

```
src/
├── __tests__/
│   ├── components/
│   │   ├── general/
│   │   │   ├── TextField.test.js
│   │   │   ├── Button.test.js
│   │   │   └── ValidatedTextField.test.js
│   │   ├── layout/
│   │   │   ├── Modal.test.js
│   │   │   ├── Header.test.js
│   │   │   └── Sidebar.test.js
│   │   └── services/
│   │       ├── PayBillsForm.test.js
│   │       ├── TransferCoinsForm.test.js
│   │       └── CashInForm.test.js
│   ├── pages/
│   │   ├── Login.test.js
│   │   ├── Register.test.js
│   │   ├── Accounts.test.js
│   │   └── Transactions.test.js
│   ├── hooks/
│   │   └── useAuth.test.js
│   ├── adapters/
│   │   └── api.test.js
│   ├── store/
│   │   └── store.test.js
│   └── utils/
│       ├── validations.test.js
│       └── regexPatterns.test.js
├── setupTests.js           # Global test setup (CRA convention)
└── __mocks__/
    └── api.js              # Mock API responses
```
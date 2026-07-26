# 1. Tools & Setup

## Overview

This document outlines the setup process for implementing a testing infrastructure. It covers selecting testing tools, installing dependencies, configuring the test environment, and verifying the setup to establish a solid testing foundation for the upcoming React and Create React App migration.

## 1.1 Dependencies
| Tool | Purpose | Recommendation |
|------|---------|---------------|
| **Jest** | Unit/Integration testing | Add |
| **React Testing Library** | React component testing | Add |
| **MSW (Mock Service Worker)** | API mocking | Add (mock backend APIs) |
| **Cypress/Playwright** | E2E testing | Optional (for critical user flows) |

## 1.2 Installation

```bash
npm install --save-dev jest react-testing-library @testing-library/jest-dom msw
```

**Optional E2E Tools** (install if needed for end-to-end testing):

```bash
# Playwright (recommended for E2E)
npm install --save-dev @playwright/test

# OR Cypress (alternative E2E tool)
npm install --save-dev cypress
```

## 1.3 Configuration

### Jest Setup
- CRA auto-configures Jest via `react-scripts` (no manual config needed)
- Create `src/setupTests.js` for global test setup

```javascript
// src/setupTests.js
import '@testing-library/jest-dom';
import { server } from '../__mocks__/api';

// Reset mocks before each test
beforeEach(() => {
  server.resetHandlers();
});

// Close server after each test
afterEach(() => {
  server.close();
});

// ... and so on
```

- Update `package.json` to include coverage threshold

```json
// package.json
{
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx}",
      "!src/index.js",
      "!src/setupTests.js",
      "!src/__mocks__/**"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 60,
        "functions": 60,
        "lines": 60,
        "statements": 60
      }
    },
    "coverageReporters": ["text", "lcov", "html"],
    "testMatch": [
      "**/__tests__/**/*.test.js",
      "**/__tests__/**/*.test.jsx"
    ]
  }
}
```
### npm Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "test": "react-scripts test",
    "test:watch": "react-scripts test --watch",
    "test:coverage": "react-scripts test --coverage"
  }
}
```

### MSW

**`src/__mocks__/api.js`**:
```javascript
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

export const server = setupServer(
  http.get('/api/accounts', () => HttpResponse.json({ accounts: [] })),
  // ... more mocks
)
```
---

## 1.4 Post-Setup Verification

Run these commands to verify setup:

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests (if configured)
npm run test:e2e
```

**Expected output**:
- Tests should pass (0 failures)
- Coverage report should show ~0% (no tests yet, but infrastructure is ready)
- No errors in console during test runs
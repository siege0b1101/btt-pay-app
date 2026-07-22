# Phase 5: Test Configuration

## 5.1 Jest Configuration (`package.json`)

```json
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

## 5.2 Test Setup File

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
```
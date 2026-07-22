# Phase 1: Test Strategy & Tooling Setup

## 1.1 Choose Testing Tools

| Tool | Purpose | Recommendation |
|------|---------|---------------|
| **Jest** | Unit/Integration testing | ✅ Add |
| **React Testing Library** | React component testing | ✅ Add |
| **MSW (Mock Service Worker)** | API mocking | ✅ Add (mock backend APIs) |
| **Cypress/Playwright** | E2E testing | ⚠️ Optional (for critical user flows) |

## 1.2 Install Testing Dependencies

```bash
npm install --save-dev jest react-testing-library @testing-library/jest-dom
npm install --save-dev msw
```

## 1.3 Configure Test Environment
- ✅ Create `src/setupTests.js` for global test setup (CRA auto-loads)
- ✅ Configure Jest in `package.json`
- ✅ Set up test coverage reporting

**Findings:**
- Create React App has limited Jest configuration support
- Unsupported options removed: `moduleFileExtensions`, `testEnvironment`, `testURL`
- CRA will use its defaults for these options
- Test file pattern: `**/__tests__/**/*.test.{js,jsx}`
- Coverage threshold: **60%** for branches, functions, lines, statements
- Coverage reporters: text, lcov, html
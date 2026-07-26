# 3. Test Scope and Coverage

## Overview

This document defines the scope and coverage targets for each types of testing. Refer to each separate plan document for further details.

---
## 3.1 Coverage Strategy

**Coverage targets are defined per test type:**

| Test Type | Coverage Target | Applies To |
|-----------|-----------------|------------|
| Unit | 80-90% | All components, utilities, hooks |
| Integration | 60-70% | Component interactions, API calls |
| E2E | 40-50% | Critical user flows |

**Global Threshold:** Minimum 60% overall code coverage (branches, functions, lines, statements).

**Note:** "Coverage targets met" in Success Criteria means meeting the targets above for each test type.

---
## 3.2 Unit Tests

**Coverage Target:** 80-90%

**Focus**
- Component rendering
- State management
- Form validation
- Utility functions
- Reducer functions

---
## 3.3 Integration Tests

**Coverage Target:** 60-70%

**Focus**
- Component interactions
- API integration

---
## 3.4 E2E Tests

**Coverage Target:** 40-50%

**Focus**
- Critical user flows
- Error scenarios
- Responsive testing
- Accessibility

---
## 3.5 Global Threshold

**Minimum Acceptable Coverage:** 60% (branches, functions, lines, statements)

**Note:** This threshold applies to the entire codebase.

---
## 3.6 Coverage Exclusions

The following files are excluded from coverage calculations:

- `src/index.js` - Entry point
- `src/setupTests.js` - Test setup
- `src/__mocks__/**` - Mock files
- `src/**/*.test.js` - Test files themselves
- Third-party libraries (axios, react-router-dom, etc.)

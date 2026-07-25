# BTT Pay App Upgrade Plan

## Executive Summary

This document outlines the upgrade plan for the BTT-Pay frontend application, focusing on:
1. **React 18 → React 19** upgrade
2. **Create React App → Vite** migration
3. **Testing infrastructure** implementation

---

## Current State

| Package | Version | Status |
|---------|---------|--------|
| React | 18.2.0 | ⚠️ EOL approaching (Dec 2026) |
| React DOM | 18.2.0 | ⚠️ EOL approaching |
| React Router DOM | 6.4.5 | ✅ Current |
| React Hook Form | 7.40.0 | ✅ Current |
| Axios | 1.2.1 | ✅ Current |
| Tailwind CSS | 3.2.4 | ✅ Current |
| Easy Peasy | 5.2.0 | ✅ Current |
| Create React App | 5.0.1 | ❌ Deprecated |

**Issues Identified:**
- React 18 support ends December 2026 (3 months from now)
- Create React App is deprecated (migrate to Vite)
- No existing test coverage

---

## Phases

| # | Phase | File |
|---|-------|------|
| 1 | Test Strategy & Tooling Setup | [01_test-strategy-and-tooling-setup.md](plan/01_test-strategy-and-tooling-setup.md) |
| 2 | Test Structure Organization | [02_test-structure-organization.md](plan/02_test-structure-organization.md) |
| 3 | Test Priority & Coverage Targets | [03_test-priority-and-coverage-targets.md](plan/03_test-priority-and-coverage-targets.md) |
| 4 | Test Implementation Strategy | [04_test-implementation-strategy.md](plan/04_test-implementation-strategy.md) |
| 5 | Test Configuration | [05_test-configuration.md](plan/05_test-configuration.md) |
| 6 | E2E Testing | [06_e2e-testing.md](plan/06_e2e-testing.md) |
| 7 | CI/CD Integration | [07_ci-cd-integration.md](plan/07_ci-cd-integration.md) |
| 8 | Migration Considerations | [08_migration-considerations.md](plan/08_migration-considerations.md) |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking changes in React 19 | Medium | High | Test thoroughly, upgrade incrementally |
| CRA → Vite migration issues | Medium | Medium | Start with tests, validate before migration |
| Test coverage gaps | High | Low | Focus on critical paths first |

---

## Success Criteria

- ✅ All critical user flows tested (100% coverage)
- ✅ Test suite runs in CI/CD (100% pass rate)
- ✅ React 19 upgrade complete without regressions
- ✅ Vite migration complete with improved build times
- ✅ Minimum 60% code coverage maintained

---

## Changes History

| Version | Date Modified | Modified By | Contents |
| ------- | ------------- | ----------- | -------- |
| 1 | 2026/07/22 | Osaurus + Qwen Code | Initial draft |
| 2 | 2026/07/22 | Pi + Me | Added more details for each Phases |
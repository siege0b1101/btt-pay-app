# BTT Pay App Upgrade Plan

## Executive Summary

This document outlines the upgrade plan for the BTT-Pay frontend application, focusing on:
1. **Testing** - Implement comprehensive testing infrastructure
2. **Migration** - React 18 → 19 and CRA → Vite migration

---
## Phases

### Phase 1: Testing

| #   | Item                            | Reference                                                              |
| --- | ------------------------------- | ---------------------------------------------------------------------- |
| 1   | **Tools & Setup**               | [01_testing-tools-and-setup.md](01_testing-tools-and-setup.md)         |
| 2   | **Test Structure Organization** | [02_test-structure-organization.md](02_test-structure-organization.md) |
| 3   | **Test Scope & Coverage**       | [03_test-scope-and-coverage.md](03_test-scope-and-coverage.md)         |
| 4   | **Unit Testing**                | [04_unit-testing.md](04_unit-testing.md)                               |
| 5   | **Integration Testing**         | [05_integration-testing.md](05_integration-testing.md)                 |
| 6   | **E2E Testing**                 | [06_e2e-testing.md](06_e2e-testing.md)                                 |

---
### Phase 2: Migration

| #   | Item | Reference |
| --- | ---- | --------- |
| 1   | TBA  | TBA       |

---
## Risk Assessment

| Risk                         | Likelihood | Impact | Mitigation                                  |
| ---------------------------- | ---------- | ------ | ------------------------------------------- |
| Breaking changes in React 19 | Medium     | High   | Test thoroughly, upgrade incrementally      |
| CRA → Vite migration issues  | Medium     | Medium | Start with tests, validate before migration |
| Test coverage gaps           | High       | Low    | Focus on critical paths first               |

---
## Success Criteria

- ✅ Initial testing infrastructure established
- ✅ Coverage targets met (per type of testing)
- ✅ React 19 upgrade complete without regressions
- ✅ Vite migration completed
- ✅ Minimum 60% code coverage maintained

---
## Changes History

| Version | Date Modified | Modified By         | Contents                             |
| ------- | ------------- | ------------------- | ------------------------------------ |
| 1       | 2026/07/22    | Osaurus + Qwen Code | Initial draft                        |
| 2       | 2026/07/25    | Pi + Me             | Added more details per plan document |
| 3       | 2026/07/26    | Pi + Me             | Reorganize plan structure            |
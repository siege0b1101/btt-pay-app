# BTT Pay App Upgrade Plan

## Executive Summary

This document outlines the upgrade plan for the BTT-Pay frontend application, focusing on:
1. **Testing** - Implement comprehensive testing infrastructure (Vitest + Playwright)
2. **Migration** - React 18 → 19 and CRA → Vite migration

---
## Phases

### Phase 1: Testing (Revised)

**Plan:** [TESTING_PLAN.md](TESTING_PLAN.md)

**Implementation Checklist:** [TEST_IMPLEMENTATION_CHECKLIST.md](impl/TEST_IMPLEMENTATION_CHECKLIST.md)

---
### Phase 2: Migration

Migration considerations are covered in [TESTING_PLAN.md §6](TESTING_PLAN.md#6-migration-considerations-cra--vite-react-18--19).

---
## Key Decisions (Phase 1)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Test Runner | **Vitest** (not Jest) | Native Vite support; zero migration later |
| Phase 1 Coverage | Unit 50-60%, Int 30-40%, E2E 3 flows | Achievable from 0% baseline; builds momentum |
| Mock Strategy | `vi.mock()` for unit; MSW only for integration/E2E | Less overhead, faster unit tests |
| Test Structure | Mirror `src/` under `src/__tests__/unit/` | Scales better, easier navigation |
| Test Utilities | `src/test/utils.tsx` (renderWithStore, factories) | DRY, consistent setup |
| Unit Test Priority | Store → Validations → Hooks → API → Forms → Pages → Layout | High-ROI logic first |
| Integration Tests | 1 consolidated file (all transaction forms) | Shared patterns, less duplication |
| E2E Scope | 3 critical flows only | Doable in 1 week; representative coverage |
| CI/CD | Deferred (solo dev) | Add when valuable |
| Documentation | Deferred (solo dev) | Add when valuable |

---
## Risk Assessment

| Risk                         | Likelihood | Impact | Mitigation                                  |
| ---------------------------- | ---------- | ------ | ------------------------------------------- |
| Breaking changes in React 19 | Medium     | High   | Test thoroughly, upgrade incrementally      |
| CRA → Vite migration issues  | Medium     | Medium | **Tests first** (Vitest config stays valid) |
| Test coverage gaps           | High       | Low    | Focus on critical paths first (store, forms) |
| Vitest config complexity     | Low        | Low    | 15 min setup; matches Vite config           |

---
## Success Criteria

- [ ] Vitest + Playwright infrastructure running (`npm test`, `npm run test:e2e`)
- [ ] Phase 1 coverage targets met: Unit ≥50%, Integration ≥30%, 3 E2E flows passing, Global ≥50%
- [ ] Critical paths tested: Auth, Account management, All 4 transaction forms
- [ ] React 19 upgrade complete without regressions (Phase 2)
- [ ] Vite migration completed (Phase 2)
- [ ] Phase 2+ coverage targets met: Unit 80-90%, Integration 60-70%, E2E 40-50%, Global 60%

---
## Changes History

| Version | Date Modified | Modified By         | Contents                             |
| ------- | ------------- | ------------------- | ------------------------------------ |
| 1       | 2026/07/22    | Osaurus + Qwen Code | Initial draft                        |
| 2       | 2026/07/25    | Pi + Me             | Added more details per plan document |
| 3       | 2026/07/26    | Pi + Me             | Reorganize plan structure            |
| 4       | 2026/08/15    | Pi + Me             | Switch to Vitest, lower Phase 1 targets, consolidate scope |
| 5       | 2026/08/24    | Pi + Me             | Ponytail review: consolidate 6 plan docs into TESTING_PLAN.md, trim checklist to tracking-only (1,542 → 302 lines) |
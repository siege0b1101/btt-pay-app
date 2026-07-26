# Migration Considerations (CRA → Vite)

## Overview

This phase covers the migration from Create React App (CRA) to Vite, including React 19 upgrade considerations.

---

### Before Migration

- ✅ Ensure all tests pass with current setup
- ✅ Document any CRA-specific test configurations

### After Migration

- ✅ Update Jest configuration for Vite
- ✅ Test all existing tests with new setup
- ✅ Add Vite-specific optimizations if needed

---

## React 19 Migration Notes

### Breaking Changes to Watch For

1. **useLayoutEffect Behavior**
   - React 19 changes how `useLayoutEffect` works
   - May affect components with DOM measurements

2. **New Hooks**
   - `useOptimistic` - Optimistic UI updates
   - Enhanced `useTransition` for concurrent features

3. **Strict Mode Warnings**
   - React 19's strict mode will reveal more bugs
   - Use these warnings to fix issues proactively

4. **React Server Components**
   - New feature in React 19
   - Consider if your app needs this (probably not for BTT-Pay)
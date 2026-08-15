# 1. Tools & Setup

## Overview

This document outlines the setup process for implementing a testing infrastructure using **Vitest** (not Jest) to align with the future Vite migration. It covers selecting testing tools, installing dependencies, configuring the test environment, and verifying the setup.

## 1.1 Dependencies
| Tool | Purpose | Recommendation |
|------|---------|---------------|
| **Vitest** | Unit/Integration testing (Vite-native) | Add |
| **@vitejs/plugin-react** | React/JSX transform for Vitest | Add |
| **@vitest/coverage-v8** | Code coverage (V8 provider) | Add |
| **@testing-library/react** | React component testing | Add |
| **@testing-library/jest-dom** | Custom Jest/Vitest matchers | Add |
| **@testing-library/user-event** | User interaction simulation | Add |
| **jsdom** | DOM environment for tests | Add |
| **MSW (Mock Service Worker)** | API mocking (integration/E2E only) | Add |
| **Playwright** | E2E testing (critical flows only) | Add |

## 1.2 Installation

```bash
# Core testing stack
npm install --save-dev vitest @vitejs/plugin-react @vitest/coverage-v8 \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom msw

# E2E testing
npm install --save-dev @playwright/test
npx playwright install --with-deps chromium
```

## 1.3 Configuration

### Vitest Setup
- Create `vitest.config.ts` at project root (not auto-configured by CRA)
- Create `src/test/setup.ts` for global test setup
- Create `src/test/utils.tsx` for shared test utilities
- Create `src/test/mocks/axios.ts` and `src/test/mocks/router.ts` for unit test mocks

**`vitest.config.ts`**:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        lines: 50,
        functions: 50,
        branches: 50,
        statements: 50
      },
      exclude: [
        'src/index.js',
        'src/test/**',
        'src/__mocks__/**',
        'src/**/*.test.{js,jsx,ts,tsx}'
      ]
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    }
  }
});
```

**`src/test/setup.ts`**:
```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock axios for unit tests (no MSW overhead)
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
    })),
  },
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
    useParams: () => ({}),
  };
});
```

**`src/test/utils.tsx`** (create before writing tests):
```tsx
import { render, RenderOptions } from '@testing-library/react';
import { StoreProvider } from 'easy-peasy';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../util/store';

interface WrapperProps { children: React.ReactNode; }
export const TestWrapper = ({ children }: WrapperProps) => (
  <StoreProvider store={store}>
    <BrowserRouter>{children}</BrowserRouter>
  </StoreProvider>
);

export const renderWithStore = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: TestWrapper, ...options });

// Test data factories
export const mockUser = () => ({
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  phone: '+639123456789',
  address: 'Manila, Philippines',
});

export const mockAccount = (overrides = {}) => ({
  id: 1,
  type: 'PAY',
  balance: 0,
  ...overrides,
});

// Re-export RTL utilities
export * from '@testing-library/react';
export { expect, vi, describe, it, test, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
```

### npm Scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

### MSW (Integration/E2E Only)

**`src/test/mocks/handlers.ts`** (for integration/E2E tests):
```typescript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
  http.post('/api/auth/login', () => HttpResponse.json({
    token: 'mock-jwt-token',
    user: { id: 1, name: 'Test User', email: 'test@example.com' }
  })),
  http.post('/api/auth/register', () => HttpResponse.json({ message: 'Registration successful' })),
  http.post('/api/accounts', () => HttpResponse.json({ success: true, account: { id: 1, type: 'PAY', balance: 0 } })),
  http.post('/api/accounts/user', () => HttpResponse.json({ accounts: [] })),
  http.post('/api/transactions', () => HttpResponse.json({ success: true })),
  http.post('/api/transactions/account', () => HttpResponse.json({ transactions: [] })),
];

export const server = setupServer(...handlers);
```

---

## 1.4 Post-Setup Verification

Run these commands to verify setup:

```bash
# Run tests (watch mode)
npm test

# Run tests with coverage
npm run test:coverage

# Run Vitest UI
npm run test:ui

# Run E2E tests
npm run test:e2e
```

**Expected output**:
- Tests should pass (0 failures)
- Coverage report should show ~0% (no tests yet, but infrastructure is ready)
- No errors in console during test runs
- Vitest UI opens at http://localhost:51204/__vitest__/
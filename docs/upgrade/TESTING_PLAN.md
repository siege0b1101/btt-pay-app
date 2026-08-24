# Testing Plan (Phase 1)

Vitest + React Testing Library for unit/integration, Playwright for E2E. Aligned with the future Vite migration (no Jest).

## 1. Tools & Setup

### Dependencies

```bash
npm install --save-dev vitest @vitejs/plugin-react @vitest/coverage-v8 \
  @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom msw
npm install --save-dev @playwright/test
npx playwright install --with-deps chromium
```

### `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{js,jsx,ts,tsx}'],
    // ponytail: thresholds off until tests exist (~50% by end of Phase 1), else every run fails
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['src/index.js', 'src/test/**', 'src/**/*.test.{js,jsx,ts,tsx}'],
    },
  },
});
```

### `src/test/setup.ts` — global unit-test mocks

```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('axios', () => ({
  default: {
    get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
    create: vi.fn(() => ({ get: vi.fn(), post: vi.fn() })),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => vi.fn(), useLocation: () => ({ pathname: '/' }), useParams: () => ({}) };
});
```

If a test needs a custom axios/router mock later, add a factory in `src/test/mocks/` then — not before.

### `src/test/utils.tsx`

```tsx
import { render } from '@testing-library/react';
import { StoreProvider } from 'easy-peasy';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../util/store';

export const renderWithStore = (ui) =>
  render(ui, {
    wrapper: ({ children }) => (
      <StoreProvider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </StoreProvider>
    ),
  });

export const mockAccount = (overrides = {}) => ({ id: 1, type: 'PAY', balance: 0, ...overrides });
```

Import Vitest APIs (`expect`, `vi`, `describe`, `it`) from `'vitest'` directly and RTL utilities (`screen`, `fireEvent`, `waitFor`) from `'@testing-library/react'`. One import source each.

### npm scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test"
  }
}
```

### MSW handlers — `src/test/mocks/handlers.ts` (integration/E2E only)

```typescript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
  http.post('/api/auth/login', () => HttpResponse.json({ token: 'mock-jwt-token', user: { id: 1, name: 'Test User', email: 'test@example.com' } })),
  http.post('/api/auth/register', () => HttpResponse.json({ message: 'Registration successful' })),
  http.post('/api/accounts', () => HttpResponse.json({ success: true, account: { id: 1, type: 'PAY', balance: 0 } })),
  http.post('/api/accounts/user', () => HttpResponse.json({ accounts: [
    { id: 1, type: 'PAY', balance: 1000 },
    { id: 2, type: 'SAVINGS', balance: 5000 },
  ]})),
  http.post('/api/transactions', () => HttpResponse.json({ success: true })),
  http.post('/api/transactions/account', () => HttpResponse.json({ transactions: [] })),
];

export const server = setupServer(...handlers);
```

Verify: `npm test` passes with 0 tests.

## 2. Test Structure

```
src/__tests__/
├── unit/          # mirror src/: components/, pages/, hooks/, adapters/, util/
├── integration/   # transactions.integration.test.jsx
└── e2e/flows/     # Playwright flows
src/test/          # setup.ts, utils.tsx, mocks/handlers.ts
```

Naming: `ComponentName.test.jsx` for components, `.test.js` for pure logic.

Legacy CRA `setupTests.js` / `__mocks__/`: remove after migration.

## 3. Unit Tests (Priority Order)

Mock strategy: `vi.mock('axios')` + `vi.mock('react-router-dom')` globally in `setup.ts`; real Easy Peasy store everywhere. Do NOT create legacy `src/__mocks__/` factories or mock components — test the real ones.

1. **Store thunks** (highest ROI). Use `store.getState()` / `store.getActions()`; `vi.spyOn(api, 'post')`; test success + error paths; reset state in `beforeEach`.

   ```javascript
   it('handles login thunk (error)', async () => {
     vi.spyOn(api, 'post').mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } });
     await store.getActions().login({ email: 'x@example.com', password: 'wrong' });
     expect(store.getState().errorMsg).toBe('Invalid credentials');
   });
   ```

2. **Validation utils** (`validations.test.js`, target ~100%): test the exported functions incl. empty strings, boundary lengths, special chars. Regex constants are internals of these functions — tested through them, not separately.
3. **Hooks**: `renderHook` + `act()` from `@testing-library/react`.
4. **API adapter**: base URL, JWT attach interceptor, 401 response path.
5. **Transaction forms** (business critical): the canonical pattern —

   ```javascript
   it('shows validation error for empty amount', async () => {
     renderWithStore(<CashInForm />);
     fireEvent.click(screen.getByRole('button', { name: /cash in/i }));
     await waitFor(() => expect(screen.getByText(/amount is required/i)).toBeInTheDocument());
   });
   ```

   Per form: rendering, validation rules, submit → confirmation modal, API error handling.
6. **Pages**: Login/Register/Accounts/Transactions/ServiceMenu — render, key interactions, error states.
7. **Layout**: Modal (visible/hidden, confirm/cancel callbacks), Header (logout, mobile menu), Sidebar, MobileMenu.

## 4. Integration Tests

One file: `src/__tests__/integration/transactions.integration.test.jsx`, covering all 4 transaction forms via a loop over `{ component, fillForm, submitText }`.

```javascript
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers()); // restores default handlers — just pass overrides:

server.use(http.post('/api/transactions', () => HttpResponse.json({ message: 'Insufficient balance' }, { status: 400 })));
```

Per form: success → modal, API failure error text, loading state during submission.

Coverage targets are **global only** (`coverage.thresholds` in vitest config) — Vitest can't enforce separate per-type numbers, so Phase 1 goal is simply global ≥50%.

## 5. E2E Tests (3 flows only)

| Flow | Path |
|------|------|
| Registration → Login → View Accounts | `/register` → `/login` → `/accounts` |
| Open Account → Verify Balance | login → open SAVINGS → balance 0 |
| Cash In | login → cash-in 500 → balance updated |

- **Network mocking**: Playwright's native `page.route()` (MSW stays out of the browser — its worker needs extra service-worker wiring). Same response shapes as the MSW handlers above.
- **Login reuse**: authenticate once via API request in `playwright.config.ts` setup project, share session with `storageState` instead of repeating login in every flow.
- Selectors: `data-testid`. Chromium headless only in Phase 1.
- Config: `testDir: './src/__tests__/e2e'`, `webServer: { command: 'npm start', url: 'http://localhost:3000' }`.

## 6. Migration Considerations (CRA → Vite, React 18 → 19)

- Before migrating: all tests green on Vitest — the config carries over to Vite unchanged.
- After: rerun full suite; add Vite-specific optimizations if needed.
- React 19 watch list: `useLayoutEffect` behavior, Strict Mode surfacing more bugs, new hooks (`useOptimistic`). Server Components: not needed for this app.

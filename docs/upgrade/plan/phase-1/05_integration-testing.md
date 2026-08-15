# 5. Integration Testing

## Overview

This phase covers integration tests using **MSW (Mock Service Worker)** to test component interactions with real API calls. **Consolidated into a single test file** covering all transaction forms via shared patterns.

---

## 5.1 Integration Tests

**Focus:** Test component interactions, real API calls (via MSW), and state transitions.

**Scope:** One file covering all 4 transaction types (Cash In, Transfer, Pay Bills, Buy Load) using a shared test template.

```javascript
// src/__tests__/integration/transactions.integration.test.jsx
import { expect, vi, describe, it, beforeEach, beforeAll, afterAll, afterEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { CashInForm } from '../../components/services/CashInForm';
import { TransferCoinsForm } from '../../components/services/TransferCoinsForm';
import { PayBillsForm } from '../../components/services/PayBillsForm';
import { BuyLoadForm } from '../../components/services/BuyLoadForm';
import { renderWithStore } from '../../test/utils';
import { server, handlers } from '../../test/mocks/handlers';

// Start MSW server
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

const transactionForms = [
  { name: 'CashInForm', component: CashInForm, fillForm: fillCashIn, submitText: /cash in/i },
  { name: 'TransferCoinsForm', component: TransferCoinsForm, fillForm: fillTransfer, submitText: /transfer/i },
  { name: 'PayBillsForm', component: PayBillsForm, fillForm: fillPayBills, submitText: /pay/i },
  { name: 'BuyLoadForm', component: BuyLoadForm, fillForm: fillBuyLoad, submitText: /buy load/i },
];

describe('Transaction Forms Integration', () => {
  transactionForms.forEach(({ name, component: Component, fillForm, submitText }) => {
    describe(name, () => {
      it('submits successfully and shows confirmation', async () => {
        renderWithStore(<Component />);
        fillForm();
        fireEvent.click(screen.getByRole('button', { name: submitText }));
        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument(); // Confirmation modal
        });
      });

      it('shows error on API failure', async () => {
        // Override handler for this test
        server.use(
          ...handlers,
          http.post('/api/transactions', () => HttpResponse.json({ message: 'Insufficient balance' }, { status: 400 }))
        );

        renderWithStore(<Component />);
        fillForm();
        fireEvent.click(screen.getByRole('button', { name: submitText }));
        await waitFor(() => {
          expect(screen.getByText(/insufficient balance/i)).toBeInTheDocument();
        });
      });

      it('shows loading state during submission', async () => {
        let resolveRequest;
        server.use(
          ...handlers,
          http.post('/api/transactions', () => new Promise(r => { resolveRequest = r; }))
        );

        renderWithStore(<Component />);
        fillForm();
        fireEvent.click(screen.getByRole('button', { name: submitText }));

        expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
        resolveRequest(HttpResponse.json({ success: true }));
        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
      });
    });
  });
});

// Form-specific fill helpers
function fillCashIn() {
  fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '500' } });
}

function fillTransfer() {
  fireEvent.change(screen.getByLabelText(/recipient/i), { target: { value: 'user@example.com' } });
  fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '100' } });
}

function fillPayBills() {
  fireEvent.change(screen.getByLabelText(/biller/i), { target: { value: 'Meralco' } });
  fireEvent.change(screen.getByLabelText(/account number/i), { target: { value: '123456789' } });
  fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '200' } });
}

function fillBuyLoad() {
  fireEvent.change(screen.getByLabelText(/provider/i), { target: { value: 'Globe' } });
  fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '50' } });
}
```

---

## 5.2 MSW Setup (Integration/E2E Only)

**Location:** `src/test/mocks/handlers.ts`

```typescript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
  // Auth
  http.post('/api/auth/login', () => HttpResponse.json({
    token: 'mock-jwt-token',
    user: { id: 1, name: 'Test User', email: 'test@example.com' }
  })),
  http.post('/api/auth/register', () => HttpResponse.json({ message: 'Registration successful' })),

  // Accounts
  http.post('/api/accounts', () => HttpResponse.json({ success: true, account: { id: 1, type: 'PAY', balance: 0 } })),
  http.post('/api/accounts/user', () => HttpResponse.json({ accounts: [
    { id: 1, type: 'PAY', balance: 1000 },
    { id: 2, type: 'SAVINGS', balance: 5000 }
  ]})),

  // Transactions
  http.post('/api/transactions', () => HttpResponse.json({ success: true })),
  http.post('/api/transactions/account', () => HttpResponse.json({ transactions: [
    { id: 1, type: 'CASH_IN', amount: 500, date: '2024-01-15T10:00:00+08:00' },
    { id: 2, type: 'TRANSFER', amount: -100, date: '2024-01-16T14:30:00+08:00' },
  ]})),
];

export const server = setupServer(...handlers);
```

**Usage in tests:**
```typescript
import { server, handlers } from '../../test/mocks/handlers';
import { http, HttpResponse } from 'msw';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

// Override for specific test
server.use(
  ...handlers,
  http.post('/api/transactions', () => HttpResponse.json({ message: 'Error' }, { status: 400 }))
);
```

---

## 5.3 Key Points

- **MSW only for integration/E2E** — unit tests use `vi.mock('axios')` in `setup.ts`
- **Single test file** for all transaction forms — shared patterns reduce duplication
- **Test both success and error paths** for each form
- **Verify loading states** during async submission
- **Test modal confirm/cancel callbacks** execute correctly
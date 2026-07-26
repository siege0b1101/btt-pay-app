# 5. Integration Testing
## Overview

This phase covers the implementation of integration tests and API mocking using MSW (Mock Service Worker) to test component interactions, API calls, and state transitions.

---

## 5.1 Integration Tests

**Focus:** Test component interactions, API calls, and state transitions.

### Example: Registration flow

```javascript
test('completes registration and redirects', async () => {
  // Mock API to succeed
  apiMock.api.post.mockResolvedValue({ data: { message: 'Registration successful' } });
  
  // Fill form and submit
  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
  fireEvent.click(screen.getByText(/Register/i));
  
  // Verify modal appears
  expect(screen.getByText(/Registration successful/i)).toBeInTheDocument();
  
  // Verify redirect
  expect(navigate).toHaveBeenCalledWith('/');
});
```

**Key points:**
- Test complete user flows (registration, login, transactions)
- Mock all API calls to avoid hitting real backend
- Verify state transitions (loading → success/error)
- Test modals and callbacks

---

## 5.2 Mocks and Test Data

**Focus:** Use MSW to intercept and mock all API requests without hitting the real backend.

### 5.2.1 Mocking API

```javascript
// src/__mocks__/api.js
import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const server = setupServer(
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(ctx.json({ token: 'mock-jwt-token', user: { id: 1, name: 'Test User' } }));
  }),
  rest.post('/api/auth/register', (req, res, ctx) => {
    return res(ctx.json({ message: 'Registration successful' }));
  }),
  rest.post('/api/accounts', (req, res, ctx) => {
    return res(ctx.json({ success: true, account: { id: 1, type: 'PAY', balance: 0 } }));
  })
);
```

**Key points:**
- Use `rest` handlers for all API endpoints
- Setup server in test environment
- Reset handlers before each test
- Close server after each test

---

### 5.2.2 Mocking Router

**Focus:** Mock React Router hooks to avoid actual routing during tests.

#### Setup

```javascript
// src/__mocks__/@react-router-dom.js
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
  useRoutes: () => null
}));
```

**Key points:**
- Mock `useNavigate` to return a jest function
- Mock `useLocation` to return a static location
- Mock `useRoutes` to return null (or your actual routes)

---

### 5.2.3 Mocking Components (for isolation testing)

```javascript
// src/__tests__/__mocks__/mockComponents.js
import React from 'react';

export const MockTextField = ({ label, ...props }) => (
  <div data-testid="text-field">
    <label>{label}</label>
    <input {...props} data-testid="input" />
  </div>
);

export const MockButton = ({ children, ...props }) => (
  <button {...props} data-testid="button">
    {children}
  </button>
);

export const MockModal = ({ title, children, onConfirm, onCancel }) => (
  <div data-testid="modal-overlay">
    <div data-testid="modal-content">
      <h2 data-testid="modal-title">{title}</h2>
      <p data-testid="modal-body">{children}</p>
      <div data-testid="modal-actions">
        <button data-testid="cancel-btn" onClick={onCancel}>Cancel</button>
        <button data-testid="confirm-btn" onClick={onConfirm}>Confirm</button>
      </div>
    </div>
  </div>
);
```

**Key points:**
- Create mock components for isolation testing
- Use `data-testid` attributes for testing
- **DO NOT** mock real components (Modal, Header, Sidebar, etc.)

**Note:** Only create mock components when you need to test a component in complete isolation. For most tests, mock dependencies (API, hooks) instead.

---

### 5.2.4 Test Data

#### Example: User data

```javascript
// src/__tests__/__mocks__/user.js
export const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  phone: '+639123456789',
  address: 'Manila, Philippines'
};

export const mockAdminUser = {
  id: 2,
  name: 'Admin User',
  email: 'admin@example.com',
  phone: '+639987654321',
  address: 'Quezon City, Philippines',
  role: 'admin'
};
```

**Key points:**
- Keep test data in `__mocks__` folder (same as MSW mocks)
- Use realistic data that mirrors production

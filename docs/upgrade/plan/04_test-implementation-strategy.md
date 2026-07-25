# Phase 4: Test Implementation Strategy

## Overview

This phase covers the implementation of unit tests, integration tests, and API mocking using Jest, React Testing Library, and MSW.

---

## 4.1 Unit Tests (Jest + React Testing Library)

### 4.1.1 Components

**Focus:** Test individual components in isolation using mocks for dependencies.

```javascript
test('shows error for invalid credentials', async () => {
  // Mock API to reject
  apiMock.api.post.mockRejectedValue({ response: { data: { message: 'Invalid credentials' } } });
  
  // Fill form and submit
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
  fireEvent.click(screen.getByText(/Sign In/i));
  
  // Expect error message
  expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
});
```

**Key points:**
- Use `render()` from RTL to mount components
- Use `fireEvent` to simulate user interactions
- Mock API calls with `apiMock` module
- Test both success and error paths

---

### 4.1.2 Store

**Focus:** Test Easy Peasy store actions and state management.

```javascript
test('initializes with empty state', () => {
  const store = useStore();
  expect(store.userSession).toBeNull();
  expect(store.errorMsg).toBeNull();
  expect(store.isLoading).toBe(false);
});

test('handles login thunk', async () => {
  const store = useStore();
  
  // Mock API call
  jest.spyOn(api, 'post').mockResolvedValue({
    data: { token: 'mock-jwt-token', user: { id: 1, name: 'Test User' } }
  });
  
  // Dispatch login thunk
  await store.actions.login({ email: 'test@example.com', password: 'password' });
  
  // Verify userSession is set
  expect(store.userSession).toEqual({
    token: 'mock-jwt-token',
    username: 'test@example.com',
    userId: 1
  });
  
  // Verify error is cleared
  expect(store.errorMsg).toBeNull();
  expect(store.isLoading).toBe(false);
});
```

#### Error Handling

```javascript
test('handles login error', async () => {
  const store = useStore();
  
  // Mock API error
  jest.spyOn(api, 'post').mockRejectedValue({
    response: { data: { message: 'Invalid credentials' } }
  });
  
  // Dispatch login thunk
  await store.actions.login({ email: 'wrong@example.com', password: 'wrong' });
  
  // Verify error is set
  expect(store.errorMsg).toBe('Invalid credentials');
  expect(store.userSession).toBeNull();
});
```

**Key points:**
- Use `useStore()` to access store in tests
- Mock API calls with `jest.spyOn()`
- Dispatch actions and verify state changes
- Test both success and error paths

---

### 4.1.3 Utilities

**Focus:** Test validation functions and utility helpers.

#### Example: Validation Functions

```javascript
test('validates valid email', () => {
  expect(validateEmail('test@example.com')).toBe(true);
  expect(validateEmail('user.name+tag@example.com')).toBe(true);
});

test('rejects invalid email', () => {
  expect(validateEmail('invalid')).toBe(false);
  expect(validateEmail('@example.com')).toBe(false);
  expect(validateEmail('test@.com')).toBe(false);
});

test('validates strong password', () => {
  expect(validatePassword('ValidPass123!')).toBe(true);
  expect(validatePassword('SecurePass@2024')).toBe(true);
});

test('rejects weak password', () => {
  expect(validatePassword('weak')).toBe(false);
  expect(validatePassword('123456')).toBe(false);
  expect(validatePassword('password')).toBe(false);
});

test('validates valid name', () => {
  expect(validateName('John Doe')).toBe(true);
  expect(validateName('Mary Jane Watson')).toBe(true);
});

test('rejects invalid name', () => {
  expect(validateName('')).toBe(false);
  expect(validateName('   ')).toBe(false);
  expect(validateName('a')).toBe(false);
});
```

#### Regex Pattern Testing

```javascript
test('matches valid emails', () => {
  expect('test@example.com'.match(REGEX_EMAIL)).toBeTruthy();
  expect('user.name+tag@example.com'.match(REGEX_EMAIL)).toBeTruthy();
});

test('rejects invalid emails', () => {
  expect('invalid'.match(REGEX_EMAIL)).toBeNull();
  expect('@example.com'.match(REGEX_EMAIL)).toBeNull();
});
```

**Key points:**
- Test validation functions with edge cases
- Test both success and failure paths
- Include boundary conditions (empty strings, minimum length)
- Test special characters and invalid formats

**Note:** Keep validation and regex tests together for related utilities.

---

### 4.1.4 Hooks

**Focus:** Test custom hooks with `renderHook` from RTL.

#### Pattern: useWindowSize Hook

```javascript
test('returns initial state', () => {
  const { result } = renderHook(() => useWindowSize());
  expect(result.current).toEqual({ width: undefined, height: undefined });
});

test('updates on window resize', async () => {
  const { result } = renderHook(() => useWindowSize());
  
  // Wait for initial effect
  await waitFor(() => expect(result.current.width).toBeDefined());
  
  // Simulate resize
  act(() => {
    Object.defineProperty(window, 'innerWidth', { value: 800 });
    Object.defineProperty(window, 'innerHeight', { value: 600 });
  });
  
  // Verify update
  await waitFor(() => {
    expect(result.current).toEqual({ width: 800, height: 600 });
  });
});
```

**Key points:**
- Use `renderHook` to mount hooks
- Use `waitFor` for async operations
- Use `act` for React state updates
- Mock window properties when needed

---

## 4.2 Integration Tests

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

## 4.3 Mocks and Test Data

**Focus:** Use MSW to intercept and mock all API requests without hitting the real backend.

### 4.3.1 Mocking API

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

### 4.3.2 Mocking Router

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

### 4.3.3 Mocking Components (for isolation testing)

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

### 4.3.4 Test Data

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

---

## Implementation Notes

- **Unit Tests:** Focus on individual components in isolation using mocks for dependencies
- **Integration Tests:** Test component interactions, API calls, and state transitions
- **API Mocking:** Use MSW to intercept and mock API responses without hitting the real backend
- **Test Data:** Use realistic test data that mirrors production data structures
- **Async Handling:** Properly handle async operations with `async/await` and `fireEvent`
- **Cleanup:** Reset mocks and cleanup state between tests using `beforeEach`/`afterEach`
# Phase 4: Test Implementation Strategy

## Overview

This phase covers the implementation of unit tests, integration tests, and API mocking using Jest, React Testing Library, and MSW.

---

## 4.1 Unit Tests (Jest + React Testing Library)

### Example: Login Component

```javascript
// src/__tests__/pages/Login.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../../pages/Login';
import * as apiMock from '../../__mocks__/api';

describe('Login', () => {
  beforeEach(() => {
    // Mock API
    apiMock.api.post.mockResolvedValue({ data: { token: 'mock-token' } });
  });

  test('renders login form', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('shows error for invalid credentials', async () => {
    apiMock.api.post.mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } }
    });

    const { container } = render(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByText(/Sign In/i));

    expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
  });

  test('redirects to home on successful login', async () => {
    const navigate = jest.fn();
    apiMock.api.post.mockResolvedValue({ data: { token: 'mock-token' } });

    render(<Login />, { wrapper: <NavigateMock navigate={navigate} /> });

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'correct' } });
    fireEvent.click(screen.getByText(/Sign In/i));

    expect(navigate).toHaveBeenCalledWith('/');
  });
});
```

---

## 4.2 Integration Tests

### Example: Registration Flow

```javascript
// Test complete registration flow including API call and modal
describe('Registration Flow', () => {
  test('completes registration and redirects', async () => {
    // Mock API
    apiMock.api.post.mockResolvedValue({
      data: { message: 'Registration successful' }
    });

    // Render and fill form
    // Submit form
    // Verify modal appears
    // Verify callback is called
    // Verify redirect occurs
  });
});
```

---

## 4.3 API Mocking with MSW

```javascript
// src/__mocks__/api.js
import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const api = {
  post: (url, data, options = {}) => {
    // Return Promise that resolves with mock response
  }
};

export const server = setupServer(
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(ctx.json({
      token: 'mock-jwt-token',
      user: { id: 1, name: 'Test User' }
    }));
  }),
  rest.post('/api/auth/register', (req, res, ctx) => {
    return res(ctx.json({ message: 'Registration successful' }));
  }),
  // ... more mocks
);
```

---

## Implementation Notes

- **Unit Tests:** Focus on individual components in isolation using mocks for dependencies
- **Integration Tests:** Test component interactions, API calls, and state transitions
- **API Mocking:** Use MSW to intercept and mock API responses without hitting the real backend
- **Test Data:** Use realistic test data that mirrors production data structures
- **Async Handling:** Properly handle async operations with `async/await` and `fireEvent`
- **Cleanup:** Reset mocks and cleanup state between tests using `beforeEach`/`afterEach`
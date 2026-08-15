# 4. Unit Testing

## Overview

This phase covers the implementation of unit tests using **Vitest** and React Testing Library, focusing on testing individual components, store actions, utilities, and hooks in isolation. **Priority order is optimized for ROI** — test high-value logic first.

**Key changes from Jest:**
- `jest.fn()` → `vi.fn()`
- `jest.spyOn()` → `vi.spyOn()`
- `jest.mock()` → `vi.mock()`
- Import test APIs from `vitest` (or use `src/test/utils.tsx` re-exports)

---

## 4.1 Unit Tests (Vitest + React Testing Library)

### 4.1.1 Store Thunks (Priority 1 — Highest ROI)

**Focus:** Test Easy Peasy store actions and state management. Pure logic, no UI, catches regression early.

```javascript
// src/util/store.test.js
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { store } from './store';
import * as api from '../adapters/api';

describe('Auth thunks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    store.getState().userSession = null;
    store.getState().errorMsg = null;
  });

  it('initializes with empty state', () => {
    const state = store.getState();
    expect(state.userSession).toBeNull();
    expect(state.errorMsg).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('handles login thunk (success)', async () => {
    vi.spyOn(api, 'post').mockResolvedValue({
      data: { token: 'mock-jwt-token', user: { id: 1, name: 'Test User', email: 'test@example.com' } }
    });

    await store.getActions().login({ email: 'test@example.com', password: 'password' });

    const state = store.getState();
    expect(state.userSession).toEqual({
      token: 'mock-jwt-token',
      username: 'test@example.com',
      userId: 1
    });
    expect(state.errorMsg).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('handles login thunk (error)', async () => {
    vi.spyOn(api, 'post').mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } }
    });

    await store.getActions().login({ email: 'wrong@example.com', password: 'wrong' });

    const state = store.getState();
    expect(state.errorMsg).toBe('Invalid credentials');
    expect(state.userSession).toBeNull();
  });
});
```

**Key points:**
- Use `store.getState()` and `store.getActions()` for direct access
- Mock API with `vi.spyOn(api, 'method')`
- Test both success and error paths
- Clear mocks and reset state in `beforeEach`

---

### 4.1.2 Validation Utils & Regex (Priority 2 — Easy Wins)

**Focus:** Test validation functions and regex patterns. Pure functions, 100% coverage achievable.

```javascript
// src/util/validations.test.js
import { expect, vi, describe, it } from 'vitest';
import { validateEmail, validatePassword, validateName, validatePhone, validateAmount } from './validations';
import { REGEX_EMAIL, REGEX_PHONE, REGEX_REFERENCE, REGEX_BILL_NUMBER } from './regexPatterns';

describe('validateEmail', () => {
  it('validates valid emails', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name+tag@example.com')).toBe(true);
    expect(validateEmail('user@sub.domain.com')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('test@.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('validates strong passwords', () => {
    expect(validatePassword('ValidPass123!')).toBe(true);
    expect(validatePassword('SecurePass@2024')).toBe(true);
  });

  it('rejects weak passwords', () => {
    expect(validatePassword('weak')).toBe(false);
    expect(validatePassword('123456')).toBe(false);
    expect(validatePassword('password')).toBe(false);
    expect(validatePassword('')).toBe(false);
  });
});

// Regex pattern tests
describe('REGEX_EMAIL', () => {
  it('matches valid emails', () => {
    expect('test@example.com'.match(REGEX_EMAIL)).toBeTruthy();
    expect('user.name+tag@example.com'.match(REGEX_EMAIL)).toBeTruthy();
  });

  it('rejects invalid emails', () => {
    expect('invalid'.match(REGEX_EMAIL)).toBeNull();
    expect('@example.com'.match(REGEX_EMAIL)).toBeNull();
  });
});
```

**Key points:**
- Test edge cases: empty strings, boundary lengths, special chars
- Keep validation and regex tests together per utility
- Aim for 100% on pure functions

---

### 4.1.3 Custom Hooks (Priority 3)

**Focus:** Test custom hooks with `renderHook` from RTL.

```javascript
// src/util/hooks/useAuth.test.jsx
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';
import * as api from '../../adapters/api';

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('decodes token from localStorage on init', () => {
    localStorage.setItem('token', 'mock-jwt-token');
    // jwt-decode mock would be needed here
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeDefined();
  });

  it('login sets user and token', async () => {
    vi.spyOn(api, 'post').mockResolvedValue({
      data: { token: 'new-token', user: { id: 1, name: 'Test' } }
    });

    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('token')).toBe('new-token');
  });
});
```

**Key points:**
- Use `renderHook` from `@testing-library/react`
- Wrap state updates in `act()`
- Mock localStorage if needed

---

### 4.1.4 API Adapter (Priority 4)

```javascript
// src/adapters/api.test.js
import { expect, vi, describe, it, beforeEach } from 'vitest';
import api from './api';

describe('api adapter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets base URL', () => {
    expect(api.defaults.baseURL).toBe('http://localhost:8080');
  });

  it('attaches JWT token from localStorage', () => {
    localStorage.setItem('token', 'test-token');
    const config = { headers: {} };
    const interceptor = api.interceptors.request.handlers[0].fulfilled;
    const result = interceptor(config);
    expect(result.headers.Authorization).toBe('Bearer test-token');
  });

  it('handles 401 response', async () => {
    const error = { response: { status: 401 } };
    const interceptor = api.interceptors.response.handlers[0].rejected;
    await expect(interceptor(error)).rejects.toEqual(error);
  });
});
```

---

### 4.1.5 Transaction Forms (Priority 5 — Business Critical)

**Focus:** Test form rendering, validation, submission. Use `renderWithStore` from `src/test/utils.tsx`.

```javascript
// src/components/services/CashInForm.test.jsx
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { CashInForm } from './CashInForm';
import { renderWithStore } from '../../../test/utils';
import * as api from '../../../adapters/api';

describe('CashInForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(api, 'post').mockResolvedValue({ data: { success: true } });
  });

  it('renders form with amount input and submit button', () => {
    renderWithStore(<CashInForm />);
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cash in/i })).toBeInTheDocument();
  });

  it('shows validation error for empty amount', async () => {
    renderWithStore(<CashInForm />);
    fireEvent.click(screen.getByRole('button', { name: /cash in/i }));
    await waitFor(() => {
      expect(screen.getByText(/amount is required/i)).toBeInTheDocument();
    });
  });

  it('shows validation error for negative amount', async () => {
    renderWithStore(<CashInForm />);
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '-100' } });
    fireEvent.click(screen.getByRole('button', { name: /cash in/i }));
    await waitFor(() => {
      expect(screen.getByText(/amount must be positive/i)).toBeInTheDocument();
    });
  });

  it('submits successfully and shows confirmation modal', async () => {
    renderWithStore(<CashInForm />);
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '500' } });
    fireEvent.click(screen.getByRole('button', { name: /cash in/i }));
    await waitFor(() => {
      expect(screen.getByText(/confirm cash in/i)).toBeInTheDocument();
    });
  });
});
```

**Key points:**
- Use `fireEvent` or `userEvent` for interactions
- Test validation rules thoroughly
- Mock API at the adapter level (`vi.spyOn(api, 'post')`)
- Test modal confirmation flow

---

### 4.1.6 Pages (Priority 6)

**Focus:** Test page-level rendering, navigation, store integration.

```javascript
// src/pages/Login.test.jsx
import { expect, vi, describe, it, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from './Login';
import { renderWithStore } from '../../test/utils';
import * as api from '../../adapters/api';

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form', () => {
    renderWithStore(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows error for invalid credentials', async () => {
    vi.spyOn(api, 'post').mockRejectedValue({
      response: { data: { message: 'Invalid credentials' } }
    });

    renderWithStore(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('redirects on successful login', async () => {
    vi.spyOn(api, 'post').mockResolvedValue({
      data: { token: 'mock-jwt', user: { id: 1, name: 'Test', email: 'test@example.com' } }
    });

    renderWithStore(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/welcome/i)).toBeInTheDocument(); // Modal or redirect indicator
    });
  });
});
```

---

### 4.1.7 Layout Components (Priority 7)

**Focus:** UI behavior — open/close, callbacks, responsive.

```javascript
// src/components/layout/Modal.test.jsx
import { expect, vi, describe, it } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';
import { renderWithStore } from '../../test/utils';

describe('Modal', () => {
  it('renders when visible', () => {
    renderWithStore(<Modal header="Title" body="Content" visible={true} />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('does not render when not visible', () => {
    renderWithStore(<Modal header="Title" body="Content" visible={false} />);
    expect(screen.queryByText('Title')).not.toBeInTheDocument();
  });

  it('calls onConfirm when confirm clicked', () => {
    const onConfirm = vi.fn();
    renderWithStore(<Modal header="Title" body="Content" visible={true} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it('calls onCancel when cancel clicked', () => {
    const onCancel = vi.fn();
    renderWithStore(<Modal header="Title" body="Content" visible={true} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });
});
```

---

## 4.2 Mock Strategy Summary

| Layer | Mock Approach |
|-------|---------------|
| **API (axios)** | `vi.mock('axios')` in `src/test/setup.ts` — global, no MSW overhead |
| **React Router** | `vi.mock('react-router-dom')` in `src/test/setup.ts` |
| **Store** | Use real `store` via `renderWithStore` (Easy Peasy is synchronous) |
| **MSW** | **Only for integration/E2E tests** — not unit tests |

**Do NOT create:**
- `src/__mocks__/api.js` (legacy)
- `src/__mocks__/@react-router-dom.js` (legacy)
- `src/__tests__/__mocks__/mockComponents.js` (unnecessary — test real components)

---

## 4.3 Test Utilities Import Pattern

```javascript
// Every test file starts with:
import { expect, vi, describe, it, beforeEach, afterEach } from 'vitest';
import { renderWithStore, screen, fireEvent, waitFor, mockUser, mockAccount } from '../../test/utils';
//                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                                  Single import for all RTL + Vitest + factories
```

This ensures consistent setup and easy maintenance.
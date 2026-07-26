# 4. Unit Testing

## Overview

This phase covers the implementation of unit tests using Jest and React Testing Library, focusing on testing individual components, store actions, utilities, and hooks in isolation.

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

#### Example: Regex Pattern Testing

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

#### Example: useWindowSize Hook

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
// src/setupTests.js
// Global test setup for React Testing Library and MSW

import '@testing-library/jest-dom';
import { server } from '../__mocks__/api';

// Reset mocks before each test
beforeEach(() => {
  server.resetHandlers();
});

// Close server after each test
afterEach(() => {
  server.close();
});
// src/__mocks__/api.js
// Mock API responses for testing

import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Define mock API handlers
export const apiHandlers = [
  // Login endpoint
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email, password } = req.body;
    
    // Mock successful login for test@example.com
    if (email === 'test@example.com' && password === 'password123') {
      return res(ctx.json({
        token: 'mock-jwt-token-12345',
        user: {
          id: 1,
          name: 'Test User',
          email: email,
          accounts: []
        }
      }));
    }
    
    // Mock failed login
    return res(ctx.status(401), ctx.json({
      message: 'Invalid credentials'
    }));
  }),

  // Register endpoint
  rest.post('/api/auth/register', (req, res, ctx) => {
    const { email, password, fullName, phone, idNumber } = req.body;
    
    // Check for duplicate email
    if (email === 'duplicate@example.com') {
      return res(ctx.status(400), ctx.json({
        message: 'Email already registered'
      }));
    }
    
    // Mock successful registration
    return res(ctx.json({
      message: 'Registration successful',
      user: {
        id: 2,
        name: fullName,
        email: email,
        phone: phone,
        idNumber: idNumber,
        accounts: []
      }
    }));
  }),

  // Get user accounts
  rest.get('/api/auth/accounts', (req, res, ctx) => {
    return res(ctx.json({
      accounts: [
        {
          id: 1,
          accountNumber: '1234567890',
          balance: 100000,
          status: 'active',
          type: 'savings',
          name: 'Savings Account'
        },
        {
          id: 2,
          accountNumber: '0987654321',
          balance: 50000,
          status: 'active',
          type: 'checking',
          name: 'Checking Account'
        }
      ]
    }));
  }),

  // Create new account
  rest.post('/api/auth/accounts', (req, res, ctx) => {
    const { accountType, accountName } = req.body;
    
    return res(ctx.json({
      message: 'Account created successfully',
      account: {
        id: 3,
        accountNumber: '1122334455',
        balance: 0,
        status: 'active',
        type: accountType,
        name: accountName || 'New Account'
      }
    }));
  }),

  // Get transactions
  rest.get('/api/transactions', (req, res, ctx) => {
    return res(ctx.json({
      transactions: [
        {
          id: 1,
          type: 'credit',
          amount: 10000,
          description: 'Cash In',
          date: '2024-01-15',
          status: 'completed'
        },
        {
          id: 2,
          type: 'debit',
          amount: 5000,
          description: 'Transfer to John',
          date: '2024-01-14',
          status: 'completed'
        }
      ]
    }));
  }),

  // Cash In
  rest.post('/api/transactions/cash-in', (req, res, ctx) => {
    const { amount, paymentMethod } = req.body;
    
    return res(ctx.json({
      message: 'Cash in successful',
      transaction: {
        id: 3,
        type: 'credit',
        amount: amount,
        description: `Cash In via ${paymentMethod}`,
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      }
    }));
  }),

  // Transfer coins
  rest.post('/api/transactions/transfer', (req, res, ctx) => {
    const { recipientAccount, amount } = req.body;
    
    return res(ctx.json({
      message: 'Transfer successful',
      transaction: {
        id: 4,
        type: 'debit',
        amount: amount,
        description: `Transfer to ${recipientAccount}`,
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      }
    }));
  }),

  // Pay bills
  rest.post('/api/transactions/pay-bills', (req, res, ctx) => {
    const { billProvider, billNumber, amount } = req.body;
    
    return res(ctx.json({
      message: 'Bill payment successful',
      transaction: {
        id: 5,
        type: 'debit',
        amount: amount,
        description: `Bill payment: ${billProvider}`,
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      }
    }));
  }),

  // Buy load
  rest.post('/api/transactions/buy-load', (req, res, ctx) => {
    const { provider, loadType, amount } = req.body;
    
    return res(ctx.json({
      message: 'Load purchase successful',
      transaction: {
        id: 6,
        type: 'debit',
        amount: amount,
        description: `Load purchase: ${provider} ${loadType}`,
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      }
    }));
  }),

  // Logout
  rest.post('/api/auth/logout', (req, res, ctx) => {
    return res(ctx.json({
      message: 'Logged out successfully'
    }));
  })
];

// Create and configure the server
export const server = setupServer(...apiHandlers);

// Start the server
server.listen({
  onUnhandledRequest: 'error', // Throw error for unhandled requests in tests
  quiet: true
});

// Clean up on process exit
process.on('unhandledRejection', (err) => {
  if (err && err.message.includes('no handlers defined')) {
    console.warn('WARNING: Missing MSW handler - is the server running?');
  }
  throw err;
});
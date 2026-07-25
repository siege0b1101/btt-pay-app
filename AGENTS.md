# BTT Pay Frontend Application

## Project Overview

**BTT Pay** is an e-wallet web application for Big Trading Traders (BTT), a financial and trading services company based in Manila, Philippines. The app allows users to manage BTT Coins (the native currency) through a React-based frontend with a modern, responsive design.

### Core Features

- **User Authentication**: Login, registration, password recovery
- **Account Management**: Open PAY and SAVINGS accounts, view balances
- **Transaction Processing**:
  - Cash In (deposit coins)
  - Transfer Coins (P2P transfers)
  - Pay Bills (utility payments)
  - Buy Load (mobile load)
- **Transaction History**: View all account transactions
- **Information Pages**: About, Contact, Help

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React 18.2.0 (upgrading to 19) |
| **Router** | React Router DOM 6.4.5 |
| **State Management** | Easy Peasy 5.2.0 (Redux-like) |
| **Forms** | React Hook Form 7.40.0 |
| **HTTP Client** | Axios 1.2.1 |
| **Styling** | Tailwind CSS 3.2.4 + Custom CSS |
| **Build Tool** | Create React App 5.0.1 (deprecated → migrating to Vite) |
| **Date Handling** | date-fns-tz 1.3.7 |
| **Auth** | JWT (jwt-decode 3.1.2) |
| **Validation** | Custom validation rules |
| **Testing** | Jest + React Testing Library (planned) |
| **API Mocking** | MSW (Mock Service Worker) (planned) |

### Architecture

```
src/
├── adapters/          # API adapter (axios wrapper)
├── assets/           # Static assets (images, etc.)
├── components/       # Reusable components
│   ├── accounts/     # Account-related components
│   ├── general/      # Generic UI components (Button, TextField, etc.)
│   ├── layout/       # Layout components (Header, Footer, Sidebar, Modal)
│   ├── services/     # Service transaction components (CashInForm, etc.)
│   └── transactions/ # Transaction display components
├── hooks/            # Custom React hooks
├── pages/            # Page components (Login, Register, Accounts, etc.)
├── styles/           # CSS files
└── util/             # Utilities (store, validations, error messages)
```

### Build Commands

```bash
npm start    # Development server (port 3000)
npm run build # Production build
npm test     # Run tests (Jest)
```

## Development Conventions

### Code Style

- **JSX**: Functional components with hooks (no class components)
- **Imports**: Import at top of file, grouped logically
- **Naming**:
  - Components: PascalCase (`Button`, `Login`)
  - Functions/variables: camelCase (`handleLogin`, `userSession`)
  - Constants: UPPER_SNAKE_CASE (error messages, regex patterns)
- **Props**: Passed explicitly, destructured where appropriate
- **Components**:
  - Single responsibility (small, focused components)
  - Default export
  - Export component name (not "default")

### State Management

- **Easy Peasy** for global state
- Thunks for async operations
- Local state via `useState` for component-specific data
- State structure:
  ```javascript
  {
    userSession: { token, username, userId } | null,
    accounts: Array<Account>,
    showModal: { header, body, visible, type, callback, cleanUp },
    errorMsg: string | null,
    isLoading: boolean
  }
  ```

### API Integration

- **Axios wrapper** in `src/adapters/api.js`
- **Base URL**: `http://localhost:8080` (development)
- **Auth**: JWT in Authorization header (`Bearer {token}`)
- **Thunks** in store for async API calls

### Styling

- **Tailwind CSS** for utility classes
- **Custom CSS** in `src/styles/css/index.css`:
  - Scrollbar styling
  - Custom animations (`slide-out`, `show-menu`, `fade-in`)
  - Font: Poppins
- **Color scheme**: Amber/Coral theme with Stone grays
- **Responsive**: Mobile-first, breakpoints at sm (640px), md (768px), lg (1024px), xl (1280px)

### Testing Strategy (Planned)

- **Unit tests**: Jest + React Testing Library
- **API mocking**: MSW (Mock Service Worker)
- **Coverage target**: 60% (branches, functions, lines, statements)
- **Critical paths**:
  - Login/Registration flow
  - Account creation
  - Transaction forms (CashIn, Transfer, Pay Bills, Buy Load)
- **Test structure**:
  ```
  src/
  └── __tests__/
      ├── components/
      │   ├── general/
      │   ├── layout/
      │   └── services/
      └── pages/
  ```

### Error Handling

- **Error messages**: Centralized in `src/util/errorMessages.js`
- **Validation errors**: Displayed inline (red text)
- **API errors**: Shown in modal or inline
- **Console logging**: Used for debugging (not production)

## Key Files

| File | Purpose |
|------|---------|
| `src/util/store.js` | Easy Peasy store with all state and thunks |
| `src/adapters/api.js` | Axios HTTP client wrapper |
| `src/pages/Login.jsx` | Login page with form validation |
| `src/pages/Register.jsx` | Registration with React Hook Form |
| `src/pages/Accounts.jsx` | Account listing and balance viewing |
| `src/pages/Transactions.jsx` | Transaction history for account |
| `src/pages/ServiceMenu.jsx` | Menu of available services |
| `src/pages/About.jsx` | About page with company info |
| `src/components/layout/Modal.jsx` | Reusable modal dialog |
| `src/components/services/CashInForm.jsx` | Cash-in transaction form |
| `src/components/services/TransferCoinsForm.jsx` | Transfer coins form |
| `src/components/services/PayBillsForm.jsx` | Pay bills form |
| `src/components/services/BuyLoadForm.jsx` | Buy mobile load form |

## API Endpoints (Backend)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |
| `/api/auth/register/validate-username` | POST | Check username availability |
| `/api/auth/register/validate-email` | POST | Check email availability |
| `/api/auth/logout` | POST | User logout |
| `/api/accounts` | POST | Create new account |
| `/api/accounts/user` | POST | Get user's accounts |
| `/api/accounts/exists` | POST | Check if account exists |
| `/api/transactions` | POST | Create transaction (cash-in, transfer, pay bills, buy load) |
| `/api/transactions/account` | POST | Get account transactions |

## Upgrade Status

**Current**: React 18.2.0, Create React App 5.0.1

**Planned Upgrade** (see `docs/upgrade/`):
- React 18 → React 19
- Create React App → Vite
- Testing infrastructure (Jest, RTL, MSW)

**Documentation**: `docs/upgrade/plan/` contains 8-phase upgrade plan:
1. Test Strategy & Tooling Setup
2. Test Structure Organization
3. Test Priority & Coverage Targets
4. Test Implementation Strategy
5. Test Configuration
6. E2E Testing
7. CI/CD Integration
8. Migration Considerations

## Notes for New Contributors

1. **Authentication**: User session stored in localStorage; JWT decoded for user info
2. **Mobile menu**: Toggles via `isMobileMenuClicked` state; hamburger icon on mobile
3. **Modals**: Central modal component with confirm/cancel patterns; callbacks execute actions
4. **Forms**: React Hook Form for controlled forms; custom TextField for simple inputs
5. **Account switching**: Click balance to toggle between PAY/SAVINGS for same user
6. **Transactions**: All transactions require user to be logged in; use JWT in headers
7. **Date formatting**: All dates formatted to Asia/Manila timezone (UTC+8)
8. **Responsive design**: Mobile-first; sidebar hidden on mobile (replaced by mobile menu)
9. **Images**: BTT logo, BTT Coin logo, BTT Pay logo, landing background image in `src/assets/img/`

## Common Tasks

### Adding a new page

1. Create page component in `src/pages/`
2. Add route in `src/App.js`
3. Add link in Header/Sidebar/MobileMenu
4. Add entry in `src/util/store.js` if state management needed

### Adding a new service

1. Create form component in `src/components/services/`
2. Add thunk action in `src/util/store.js`
3. Add menu item in `src/components/services/ServiceMenuItem.jsx`
4. Add route in `src/pages/ServiceMenu.jsx`

### Adding a new state action

1. Add thunk to `src/util/store.js`
2. Handle API call with proper error handling
3. Update UI state (showModal, errorMsg, etc.)
4. Call cleanup actions if needed

## Backend Integration

- Backend API runs on `http://localhost:8080`
- Authentication via JWT tokens
- All transactions go through `/api/transactions`
- Account operations require valid JWT in Authorization header

## Testing Notes

- **No tests currently exist** for the application
- Test infrastructure planned but not yet implemented
- Focus on critical user flows first
- Mock API responses with MSW before backend integration

## Known Issues

- CRA deprecated (migrate to Vite)
- React 18 EOL approaching (Dec 2026)
- No test coverage
- Console.log statements in production code (should be removed or moved to dev-only)

## Dependencies

**Production**:
- react, react-dom
- react-router-dom
- easy-peasy
- axios
- jwt-decode
- react-hook-form
- react-icons
- date-fns-tz

**Dev**:
- react-scripts
- tailwindcss
- autoprefixer
- postcss

## Project Location

- **Repository**: `/Users/cjreblora/Projects/btt-pay/btt-pay-app`
- **Parent**: `/Users/cjreblora/Projects/btt-pay/`
# FunnelLiner Client Dashboard – Developer Onboarding Guide

Welcome to the FunnelLiner client dashboard project. This guide is designed to help you understand the codebase quickly and start contributing effectively.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Getting Started](#2-getting-started)
3. [Tech Stack](#3-tech-stack)
4. [Project Architecture](#4-project-architecture)
5. [Project Structure Deep Dive](#5-project-structure-deep-dive)
6. [Key Concepts & Design Patterns](#6-key-concepts--design-patterns)
7. [Adding a New Feature – Step-by-Step](#7-adding-a-new-feature--step-by-step)
8. [API Integration Guide](#8-api-integration-guide)
9. [UI & Styling Guide](#9-ui--styling-guide)
10. [Authentication Flow](#10-authentication-flow)
11. [Common Workflows](#11-common-workflows)
12. [Troubleshooting](#12-troubleshooting)
13. [Useful Resources](#13-useful-resources)

---

## 1. Project Overview

**FunnelLiner** is the first automated e-commerce sales funnel platform in Bangladesh. This repository is the **client dashboard** – the web application that merchants use to manage:

- **Orders** – Create, edit, track, and manage orders
- **Products** – Product catalog, categories, variants, inventory
- **Website** – Multi-page and landing page themes, sections, domain settings
- **Accounting** – Cash in/out, ledgers, payors, payment methods
- **Marketing** – Ad campaigns, bulk SMS, banners
- **Billing** – Subscriptions, transactions
- **Support** – Support tickets, notifications
- **Courier** – Courier providers and tracking
- **Settings** – Business info, website settings, plugins, etc.

The dashboard communicates with a Laravel-based backend API.

---

## 2. Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: use LTS)
- **npm** (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd FunnelLiner-client-dashboard

# Install dependencies
npm install

# Create environment file
cp .env.example .env   # If .env.example exists
# Or create .env with required variables (see Environment Variables below)
```

### Environment Variables

Create a `.env` file in the project root with at least:

```env
NEXT_PUBLIC_API_URL=https://web.funnelliner.com/api/v1
NEXT_PUBLIC_LEAD_API_URL=<lead-api-url>
NEXT_BKASH_URL=<bkash-url>
```

Optional (for real-time features):

```env
NEXT_PUBLIC_PUSHER_APP_BROADCAST_DRIVER=pusher
NEXT_PUBLIC_PUSHER_APP_KEY=<key>
NEXT_PUBLIC_PUSHER_HOST=<host>
NEXT_PUBLIC_PUSHER_APP_PORT=443
```

### Running the Application

```bash
# Development (with Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

The app runs at **http://localhost:3000** by default.

### First-time Setup

1. Run `npm run dev`.
2. Open `http://localhost:3000`.
3. You will be redirected to `/login` if not authenticated.
4. Login credentials are provided by your team or you need access to the backend/staging environment.

---

## 3. Tech Stack

| Category        | Technology |
|----------------|------------|
| **Framework**  | Next.js 15 (Pages Router) |
| **React**      | React 19 |
| **State**      | Redux Toolkit (RTK Query) |
| **UI Library**| Material UI (MUI) v5, Radix UI |
| **Icons**      | MUI Icons, Lucide React, React Icons |
| **Forms**      | react-hook-form, Formik, Yup |
| **Data Fetching** | Axios, RTK Query, SWR |
| **Styling**    | CSS, CSS Modules, Emotion, styled-components |
| **Charts**     | Recharts, Chart.js |
| **Dates**      | date-fns, dayjs, moment |
| **Auth**       | Cookies (js-cookie) |
| **Deployment** | Vercel |

---

## 4. Project Architecture

### High-Level Flow

```
User → Next.js Pages → withAuth (if protected) → Layout → Page Component
                              ↓
                    API calls (Axios / RTK Query / SWR)
                              ↓
                    Backend API (Laravel)
```

### Layout Architecture

- **`_app.js`**: Wraps the app with Redux Provider, date picker provider, toasters. Manages global state (`busInfo`, `myAddonsList`) and fetches business info on load.
- **Layout**: Menubar (top nav) + main content + Footer. Some pages (login, invoice, forget-password, password-setup) render without layout.
- **Menubar**: Navigation, user menu, addons, notifications. Uses `busInfo` and `myAddonsList` for conditional rendering.

### State Management

- **Redux**: Global store with `apiSlice` (RTK Query) and `dropdownSlice` (active tab state).
- **Local state**: Most page-specific state is in React `useState` / `useReducer`.
- **Context**: Not used; props are passed from `_app.js` → Layout → Pages (e.g. `busInfo`, `handelFetchBusInfo`).

---

## 5. Project Structure Deep Dive

```
FunnelLiner-client-dashboard/
│
├── pages/                          # Next.js Pages Router
│   ├── _app.js                      # App shell, providers, layout logic
│   ├── api/                         # API helpers and auth headers (not Next.js API routes)
│   │   └── index.js
│   ├── index.js                     # Home/dashboard
│   ├── login/
│   ├── order/                       # Orders list (large file)
│   ├── order-details/
│   ├── product/, add-product/
│   ├── category-list/, add-category/, sub-category-list/
│   ├── website-setting/, web-pages/
│   ├── multi-page/, landing-page/, myMultiWebsite/, myLandingPage/
│   ├── billing/, subscription1/
│   ├── accounting-modules/, account-dashboard/, account-report/
│   ├── support-ticket/
│   ├── bulk-sms/, marketing-tools/, ad-campaign/
│   ├── courier/, courier-details/
│   ├── dashboard-setting/, dashboard/classic/
│   ├── invoice-one/[...oderId]/     # Invoice (catch-all route)
│   ├── profit/[page]/               # Profit with pagination
│   ├── forget-password/, password-setup/
│   └── 404.js
│
├── Components/
│   ├── Common/                      # Layout & shared layout components
│   │   ├── layout.js
│   │   ├── Menubar/
│   │   ├── Sidebar.js
│   │   ├── Footer.js
│   │   ├── Maintenance.js
│   │   └── Subscribe.js
│   ├── commonSection/               # Reusable UI: Table, Modal, Tab, DataTable, Spinner, etc.
│   ├── UI/                          # CopyIcon, CustomPagination
│   ├── DashboardV2/                 # New dashboard + ui primitives
│   ├── HomePage/                    # FirstSetup, dashboard
│   ├── OrderPage/, OrderDetails/
│   ├── Products/, ProductPage/, AddProduct/
│   ├── Category/, SubCategoryPage/
│   ├── WebsiteSettingPage/          # Domain, Pixel, GTM, BusinessInfo components
│   └── ... (feature-specific folders)
│
├── redux/
│   ├── app/store.js
│   └── features/
│       ├── api/apiSlice.js          # Base RTK Query API
│       ├── product/productApi.js
│       ├── category/categoryApi.js
│       ├── order/orderApi.js
│       └── dropDownSlice/dropdownSlice.js
│
├── config/
│   └── ApiEndpoints.js              # Central API path constants
│
├── constant/
│   ├── constant.js                  # Domain regex, theme URLs, etc.
│   ├── order.js                     # Order status options, formatters
│   ├── Product.js
│   ├── dashbord.js                  # Date formatters
│   └── bulksms.js
│
├── hook/
│   ├── PrivateRoute.js              # withAuth HOC
│   ├── useOrderLiveData.jsx         # Real-time orders (commented out)
│   ├── useToast.js
│   └── Axios.js                     # Axios instance
│
├── service/
│   └── index.jsx                    # ToastNotificationContainer, showToastNotification
│
├── utlit/                           # Note: folder is "utlit" (typo)
│   ├── orders.js
│   ├── product.js
│   ├── bulkSms.js
│   └── createNewOrder.js
│
├── styles/
│   ├── globals.css                  # CSS variables, base styles
│   ├── admin_dashboard.css
│   ├── admin_dashboard_media.css
│   ├── common.css
│   ├── style.css
│   └── Register.css
│
├── public/
│   ├── images/
│   └── fonts2/
│
├── next.config.js
├── vercel.json
└── package.json
```

---

## 6. Key Concepts & Design Patterns

### 1. Authentication (withAuth HOC)

Protected pages wrap the component with `withAuth`:

```javascript
import withAuth from '../../hook/PrivateRoute';

const MyPage = (props) => { /* ... */ };

export default withAuth(MyPage, {
  isProtectedRoute: true,   // Requires login
  show: false,              // Redirect to /billing if subscription expired
});
```

`withAuth` checks `token` and `user` cookies and redirects accordingly.

### 2. API Calls – Three Approaches

**A. RTK Query** (preferred for CRUD on products, categories, orders):

```javascript
import { useGetProductQuery } from '../../redux/features/product/productApi';

const { data, isLoading, error } = useGetProductQuery();
```

**B. Axios** (most common for ad-hoc calls):

```javascript
import axios from 'axios';
import { headers } from '../api';
import { API_ENDPOINTS } from '../../config/ApiEndpoints';

const res = await axios.get(
  `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PRODUCTS.GET_PRODUCTS}`,
  { headers }
);
```

**C. SWR** (used in newer features):

```javascript
import useSWR from 'swr';

const { data, mutate } = useSWR(key, fetcher);
```

### 3. Global Props from _app.js

Pages receive these via `pageProps` when using the main layout:

- `busInfo` – Business info (domain, merchant, settings)
- `myAddonsList` – Addons (plugins) the shop has
- `handelFetchBusInfo` – Refetch business info
- `setFetch` – Trigger addons refetch
- `isApiResponse` – Whether addons have been loaded

### 4. Layout Exceptions

Paths that render **without** Menubar/Footer: `/login`, `/forget-password`, `/password-setup`, `/invoice-one/*`.

---

## 7. Adding a New Feature – Step-by-Step

### Example: Adding a "Reports" page

**Step 1:** Create the page

```javascript
// pages/reports/index.js
import withAuth from '../../hook/PrivateRoute';

const ReportsPage = ({ busInfo }) => {
  return (
    <Container>
      <h2>Reports</h2>
      {/* Your content */}
    </Container>
  );
};

export default withAuth(ReportsPage, { isProtectedRoute: true });
```

**Step 2:** Add API endpoints (if needed)

```javascript
// config/ApiEndpoints.js – add under existing keys
REPORTS: {
  GET_REPORTS: `/client/reports`,
},
```

**Step 3:** Add menu link (optional)

- Edit `Components/Common/Menubar/Menubar.js` to add a link to `/reports`.

**Step 4:** Use shared components

- Use `Components/commonSection/` for tables, modals, etc.
- Use MUI components for buttons, inputs, cards.

---

## 8. API Integration Guide

### Auth Headers

All authenticated requests need:

```javascript
{
  Authorization: `Bearer ${token}`,
  'shop-id': shopId,
  'id': userId,
  'Content-Type': 'application/json',  // or multipart for file uploads
}
```

These are exported from `pages/api/index.js` as `headers`. User data comes from the `user` cookie.

### Using ApiEndpoints

```javascript
import { API_ENDPOINTS } from '../config/ApiEndpoints';
import { headers } from '../pages/api';

const url = `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PRODUCTS.GET_PRODUCTS}`;
const { data } = await axios.get(url, { headers });
```

### Adding RTK Query Endpoints

1. Create or extend a slice in `redux/features/`:

```javascript
// redux/features/reports/reportsApi.js
import { apiSlice } from '../api/apiSlice';

export const reportsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query({
      query: (params) => ({ url: '/reports', params }),
    }),
  }),
});

export const { useGetReportsQuery } = reportsApi;
```

2. Use in components: `const { data } = useGetReportsQuery();`

---

## 9. UI & Styling Guide

### CSS Variables (Theme)

Use these in custom CSS:

```css
var(--main-color)        /* #894bca – primary purple */
var(--main-hover-color)  /* #7b43b5 */
var(--header-color)      /* #101840 */
var(--text-color)       /* #74788d */
var(--border-color)     /* #ece9f1 */
var(--red-color)        /* #f44336 */
```

### Component Libraries

- **MUI**: Primary UI library. Use `@mui/material` components.
- **Radix UI**: For dropdowns, selects.
- **Lucide React / React Icons**: Icons.

### Styling Approaches

- Global: `styles/globals.css`, `admin_dashboard.css`
- Component-level: `.module.css` next to components (e.g. `style.module.css`)

---

## 10. Authentication Flow

1. User visits protected page → `withAuth` checks `token` cookie.
2. No token → redirect to `/login`.
3. Token present → check `user` cookie for `payment_status`, `next_due_date`.
4. If expired/unpaid and `show: false` → redirect to `/billing`.
5. If past due (+7 days) → redirect to `/billing`.
6. Otherwise → render the page.

---

## 11. Common Workflows

### Running locally

```bash
npm run dev
```

### Building for production

```bash
npm run build
npm start
```

### Adding a dependency

```bash
npm install <package-name>
```

### Deployment (Vercel)

- Connected via `vercel.json`; `installCommand: "npm install --force"`.
- Set environment variables in Vercel project settings.

---

## 12. Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check token cookie; ensure backend is running and credentials are valid. |
| CORS errors | Backend must allow origins; check API URL in `.env`. |
| Blank page on protected route | Ensure `withAuth` is applied and cookies are set after login. |
| API base URL wrong | Set `NEXT_PUBLIC_API_URL` in `.env`. Note: apiSlice has hardcoded URL – consider aligning. |
| Layout not showing | Check path – `/login`, `/forget-password`, `/password-setup`, `/invoice-one/*` have no layout. |
| Styles not loading | Ensure `globals.css` and other styles are imported in `_app.js`. |
| Utility import fails | Remember folder name is `utlit` (typo), not `util`. |

---

## 13. Useful Resources

- **Next.js 15 Docs**: https://nextjs.org/docs
- **Redux Toolkit**: https://redux-toolkit.js.org/
- **MUI**: https://mui.com/material-ui/
- **react-hook-form**: https://react-hook-form.com/

---

## Quick Checklist for New Features

- [ ] Page created in `pages/[feature]/index.js`
- [ ] Page wrapped with `withAuth` if protected
- [ ] API endpoints added to `config/ApiEndpoints.js`
- [ ] API calls use `headers` from `pages/api` or RTK Query
- [ ] Components placed in `Components/commonSection/` or feature folder
- [ ] Menu link added in Menubar (if needed)
- [ ] Environment variables documented (if new)

---

*Last updated: February 2025*

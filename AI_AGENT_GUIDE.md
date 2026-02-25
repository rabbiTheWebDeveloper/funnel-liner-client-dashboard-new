# FunnelLiner Client Dashboard – AI Agent Guide

> This document is optimized for AI coding assistants (Claude, Copilot, etc.) to understand and work effectively within the FunnelLiner client dashboard codebase.

---

## 1. Project Overview

**Purpose**: Client-facing dashboard for the FunnelLiner automated e-commerce sales funnel platform (Bangladesh market).

**Stack**: Next.js 15 (Pages Router), React 19, Redux Toolkit (RTK Query), MUI, Axios, SWR.

**Key domain areas**: Orders, Products, Categories, Website/Theme editing, Billing, Accounting, Marketing, Courier, Support tickets, Bulk SMS.

---

## 2. Project Structure (Critical Paths)

```
FunnelLiner-client-dashboard/
├── pages/                    # Next.js Pages Router (file-based routing)
│   ├── _app.js               # App shell: providers, layout switching, global state (busInfo, myAddonsList)
│   ├── api/index.js          # Auth headers, shared API helpers, cookie-derived user/shopId
│   └── [feature]/index.js    # Feature pages; most use withAuth HOC
├── Components/
│   ├── Common/               # Layout: layout.js, Menubar, Sidebar, Footer, Maintenance, Subscribe
│   ├── commonSection/        # Shared: Table, Modal, Tab, Dropdown, DataTable, Spinner, Skeleton
│   ├── UI/                   # CopyIcon, CustomPagination
│   ├── DashboardV2/          # New dashboard + ui primitives (Button, Card, Badge, Input, etc.)
│   └── [FeatureName]Page/    # Feature-specific components
├── redux/
│   ├── app/store.js          # Single store: apiSlice + dropdownSlice
│   └── features/
│       ├── api/apiSlice.js   # RTK Query base (createApi); inject productApi, categoryApi, orderApi
│       ├── product/productApi.js
│       ├── category/categoryApi.js
│       ├── order/orderApi.js
│       └── dropDownSlice/dropdownSlice.js
├── config/ApiEndpoints.js    # Central API path constants (use with BASE_URL)
├── constant/                 # domain constants, order/product enums, formatters
├── hook/                     # PrivateRoute (withAuth), useOrderLiveData, useToast, Axios
├── service/                  # Toast notifications (ToastNotificationContainer, showToastNotification)
├── utlit/                    # Note: typo "utlit" - utility helpers (orders, product, bulkSms, createNewOrder)
├── styles/                   # globals.css (CSS vars, base styles), admin_dashboard.css, etc.
└── public/                   # Static assets
```

---

## 3. Routing and Layout Rules

### Layout Switching (in `_app.js`)

| Path pattern               | Layout                                      |
|----------------------------|---------------------------------------------|
| `/login`                   | No layout (login page only)                  |
| `/forget-password`         | No layout                                   |
| `/password-setup`         | No layout                                   |
| `/invoice-one/*`           | No layout (invoice view)                     |
| All other authenticated    | Layout with Menubar + main + Footer         |

### File-based routes

- `pages/index.js` → `/`
- `pages/order/index.js` → `/order`
- `pages/order-details/index.js` → `/order-details`
- Dynamic: `pages/multi-page/[themeid]/edit.js`, `pages/support-ticket/[ticket_id].js`, `pages/profit/[page].js`
- Catch-all: `pages/invoice-one/[...oderId]/index.js` (note typo: oderId)

---

## 4. Authentication and Protected Routes

- **HOC**: `withAuth(Component, options)` from `hook/PrivateRoute.js`
- **Usage**: `export default withAuth(MyPage, { isProtectedRoute: true, show: false });`
- **Options**:
  - `isProtectedRoute: true` → redirect to login if no token
  - `redirectIfNotAuthenticated` (default `/login`)
  - `redirectIfAuthenticated` (default `/`)
  - `show: false` + expired/unpaid → redirect to `/billing`
  - `show: false` + past due date (+7 day extension) → redirect to `/billing`
- **Auth data**: Cookies via `js-cookie` – `token`, `user` (JSON: id, shop_id, domain, payment_status, next_due_date).

---

## 5. State and Data Fetching

### Redux (RTK)

- **Store**: `redux/app/store.js` – apiSlice + dropdownSlice.
- **apiSlice**: Base RTK Query API; endpoints injected by productApi, categoryApi, orderApi.
- **Auth headers** (cookies): `Authorization`, `shop-id`, `id` – set in apiSlice `prepareHeaders` and in `pages/api` headers.
- **dropdownSlice**: `{ activeTab: '1' }`; action `setActiveTab`.

### RTK Query usage

- Import from feature slices: `useGetProductQuery`, `useAddCategoryMutation`, etc.
- Base URL in apiSlice: `https://web.funnelliner.com/api/v1/client` (hardcoded; prefer `NEXT_PUBLIC_API_URL` for new code).
- Tag invalidation: e.g. `invalidatesTags: ["order"]` for mutations.

### Other data fetching

- **Axios**: Primary for ad-hoc calls. Use `headers` from `pages/api`.
- **SWR**: Used in newer features (DashboardV2, payment-gateway, BulkSms).
- **API config**: `config/ApiEndpoints.js` – use `API_ENDPOINTS.BASE_URL` + endpoint paths.

---

## 6. Forms and Validation

- **react-hook-form** + **@hookform/resolvers/yup** – main pattern.
- **Formik** – used in product forms, order modals, ad campaign.
- Validation: `yup` schemas via resolvers.

---

## 7. Styling Conventions

### CSS variables (globals.css)

```css
--header-color: #101840;
--text-color: #74788d;
--border-color: #ece9f1;
--main-color: #894bca;
--main-hover-color: #7b43b5;
--main-bg-color: #ecdeff;
--red-color: #f44336;
```

### Approach

- **Global**: `styles/globals.css`, `admin_dashboard.css`, `common.css`, `style.css`, `Register.css`.
- **Components**: MUI components; CSS modules (`.module.css`) next to components.
- **UI libraries**: MUI (primary), Radix UI (dropdowns, selects), Lucide React, React Icons.

---

## 8. Adding New Features – Checklist

1. **Page**:
   - Create `pages/[feature]/index.js`.
   - Wrap with `withAuth(PageComponent, { isProtectedRoute: true })`.
   - Receive `busInfo`, `myAddonsList`, `handelFetchBusInfo`, `setFetch`, `isApiResponse` from Layout/pageProps.

2. **API**:
   - Add paths to `config/ApiEndpoints.js`.
   - Prefer RTK Query for CRUD: create `redux/features/[domain]/[domain]Api.js` and inject into apiSlice.
   - For ad-hoc calls: use `axios` with `headers` from `pages/api`.

3. **Components**:
   - Shared UI → `Components/commonSection/` or `Components/UI/` or `Components/DashboardV2/components/ui/`.
   - Feature-specific → `Components/[FeatureName]Page/`.

4. **Constants**:
   - Add to `constant/constant.js`, `constant/order.js`, etc., as needed.

5. **Styling**:
   - Use existing CSS vars and MUI where possible; add module CSS if needed.

---

## 9. Conventions and Patterns to Follow

- **Naming**: PascalCase for components; camelCase for hooks/utils.
- **File extensions**: `.js` / `.jsx` (no TypeScript).
- **Imports**: Prefer `@/` or relative imports consistently.
- **API**: Use `API_ENDPOINTS` + `headers` from `pages/api` for axios.
- **Toast**: `react-hot-toast` (primary), `react-toastify` (ToastNotificationContainer).
- **Dates**: `date-fns`, `dayjs` (MUI date pickers), `moment` (PrivateRoute, etc.).

---

## 10. Pitfalls to Avoid

- **Cookie timing**: `pages/api/index.js` and `apiSlice.js` read cookies at module load; for client-side refresh, ensure headers are re-read after login.
- **Hardcoded URLs**: apiSlice uses `https://web.funnelliner.com/api/v1/client`; use env vars for flexibility.
- **Typo**: Utility folder is `utlit/` (not `util/`).
- **Invoice route**: Path uses `oderId` (typo).
- **Real-time**: `useOrderLiveData` is commented out; Laravel Echo + Pusher present but inactive.
- **Testing**: No test framework configured.

---

## 11. Environment Variables (Reference)

| Variable                         | Purpose                        |
|----------------------------------|--------------------------------|
| `NEXT_PUBLIC_API_URL`            | Main API base URL              |
| `NEXT_PUBLIC_LEAD_API_URL`       | Lead API                       |
| `NEXT_BKASH_URL`                 | Bkash integration              |
| `NEXT_PUBLIC_PUSHER_APP_*`       | Pusher/WebSocket (dev)         |

---

## 12. Quick Reference – Where to Look

| Task                    | Location                                             |
|-------------------------|------------------------------------------------------|
| Add a page              | `pages/[feature]/index.js`                           |
| Add API endpoint        | `config/ApiEndpoints.js` + RTK slice or axios        |
| Shared UI component    | `Components/commonSection/` or `Components/UI/`      |
| Auth/logic for route    | `hook/PrivateRoute.js`                               |
| Global layout           | `Components/Common/layout.js`, `_app.js`             |
| API headers/auth        | `pages/api/index.js`                                 |
| Theme/colors            | `styles/globals.css` (CSS vars)                      |
| Order/product constants | `constant/order.js`, `constant/Product.js`           |

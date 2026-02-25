# FunnelLiner Dashboard — UI Improvement Plan

> **Stack direction:** shadcn/ui + Tailwind CSS  
> **Approach:** Phased, feature-by-feature migration

---

## Overview

This plan migrates the e-commerce SaaS admin dashboard to a modern, consistent UI using **Tailwind CSS** and **shadcn/ui**. Work is organized into phases with clear dependencies and checkpoints.

---

## Phase 0: Foundation (Prerequisites)

**Goal:** Set up Tailwind, shadcn/ui, and fix critical CSS bugs before visual changes.

### 0.1 Install Tailwind CSS
- [x] Add Tailwind: `npx tailwindcss@latest init -p`
- [x] Configure `tailwind.config.js` with content paths (`pages/**/*.{js,ts,jsx,tsx}`, `Components/**/*.{js,ts,jsx,tsx}`)
- [x] Add Tailwind directives to `styles/globals.css` (or a new `styles/tailwind.css` imported in `_app.js`)
- [x] Verify Tailwind compiles without breaking existing styles (use `preflight: false` temporarily if needed for coexistence)

**Files:** `tailwind.config.js`, `postcss.config.js`, `styles/globals.css`, `pages/_app.js`

---

### 0.2 Initialize shadcn/ui
- [x] Run `npx shadcn@latest init`
- [x] Choose: New York style, Zinc color, CSS variables for theming
- [x] Confirm `components.json` created and `@/components/ui` path set
- [x] Add `cn()` utility (already from shadcn init) in `lib/utils.ts` or `utils.js`

**Files:** `components.json`, `lib/utils.js`, `styles/globals.css` (shadcn will add variables)

---

### 0.3 Fix Undefined CSS Variables (Critical Bug)
- [x] Add missing `:root` variables used across the app:
  - `--bg_color` (e.g. `#101840` — header/dark text)
  - `--bg_color2` (e.g. `#192048` — secondary dark)
  - `--header_color` → map to `--header-color` or add alias
  - `--text_color` → map to `--text-color` or add alias
  - `--border_color` → map to `--border-color` or add alias
- [ ] Option: Migrate all underscore names to hyphen names and update references (preferred for long-term)

**Files:** `styles/globals.css`, grep for `var(--bg_color)` etc. to update usages

---

### 0.4 Define Design Tokens in Tailwind Theme
- [x] Extend `tailwind.config.js` theme with project palette:
  - `primary`, `secondary`, `muted`, `destructive`, `accent`
  - Map existing `--main-color` (#894bca) to `primary`
- [ ] Add spacing scale: `space-1` through `space-24` if not using defaults
- [ ] Add border radius: `radius-sm`, `radius-md`, `radius-lg`
- [ ] Add shadow scale: `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`
- [ ] Typography: primary font (Inter recommended), optional secondary (Hind Siliguri)

**Files:** `tailwind.config.js`

---

## Phase 1: Layout & Navigation

**Goal:** Modern, consistent layout and navigation used across all pages.

### 1.1 Restore and Redesign Sidebar
- [x] Mobile: shadcn Sheet with SidebarNav (viewport < 1024px); Desktop: legacy sidebar retained
- [ ] Replace Sidebar styling with Tailwind (remove `common.css` sidebar rules over time)
- [ ] Build new Sidebar using shadcn:
  - `Sheet` or `Collapsible` for mobile
  - Navigation items with `NavLink` pattern
  - Active state via `router.pathname`
- [ ] Add collapse/expand toggle (icon-only when collapsed)
- [ ] Style: subtle border, clear hover/active states, spacing from design tokens

**Components:** `Components/Common/Sidebar.js` (or new `components/layout/Sidebar.tsx`)

---

### 1.2 Redesign Menubar (Top Bar)
- [ ] Replace MUI Menubar with Tailwind + shadcn
- [ ] Use shadcn: `DropdownMenu`, `Input`, `Button`, `Avatar`, `Separator`
- [ ] Structure: Logo/Shop switcher | Search | Notifications | Profile dropdown
- [ ] Add `DropdownMenu` for profile (Dashboard, Settings, Logout)
- [ ] Add `Popover` or `DropdownMenu` for notifications
- [ ] Responsive: hide search on mobile, show hamburger → open Sidebar sheet
- [ ] Optional: `backdrop-filter: blur()` for glass effect

**Components:** `Components/Common/Menubar/Menubar.js` → refactor to Tailwind + shadcn primitives

---

### 1.3 Update Main Layout Structure
- [x] Define layout: Sidebar (left, fixed) + Main (flex-1, with Menubar at top)
- [ ] Remove hardcoded `padding-left: 165px` from MUI Container; use Tailwind `ml-[var(--sidebar-width)]` or similar
- [ ] Add CSS variable `--sidebar-width` for responsive width (collapsed vs expanded)
- [ ] Ensure Footer remains at bottom; use `min-h-screen` + `flex flex-col` pattern

**Files:** `Components/Common/layout.js`, `styles/globals.css`

---

### 1.4 Responsive Breakpoints
- [ ] Standardize breakpoints in Tailwind config (sm: 640, md: 768, lg: 1024, xl: 1280, 2xl: 1536)
- [ ] Sidebar: full drawer on mobile; fixed slim/expanded on desktop
- [ ] Menubar: compact on mobile, full on desktop

---

## Phase 2: Core UI Components

**Goal:** Replace custom and MUI components with shadcn equivalents where beneficial.

### 2.1 Buttons
- [x] Add shadcn `Button`; migrate Login, Menubar (changelog, video, notification, profile)
- [ ] Create variants: `default`, `secondary`, `outline`, `ghost`, `destructive`, `link`
- [ ] Migrate `DashboardV2/components/ui/button` usage to shadcn Button
- [ ] Replace MUI `Button` in high-traffic areas (Menubar, forms, dashboard)

**Priority pages:** Dashboard, Order list, Login, Menubar actions

---

### 2.2 Cards
- [x] Add shadcn `Card`; DashboardV2 uses its own Card for now
- [ ] Migrate DashboardV2 Card components to shadcn Card
- [ ] Standardize: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`

**Priority pages:** Dashboard (SalesPerformanceSection, BusinessAnalyticsSection, etc.)

---

### 2.3 Forms: Input, Select, Label
- [ ] Add shadcn `Input`, `Label`, `Select`, `Textarea`, `Checkbox`, `RadioGroup`
- [ ] Migrate DashboardV2 form components (Input, Select) to shadcn
- [ ] Replace MUI `TextField`, `Select` in forms (Login, Add Product, Filters, etc.)

**Priority pages:** `login`, `add-product`, `order` (filters), `customer-list`, `bulk-sms`

---

### 2.4 Dialogs & Modals
- [x] Add shadcn `Dialog`; migrated HeaderDescription, OrderUpdate, ShowProduct
- [ ] Replace MUI `Modal`, `Dialog` with shadcn Dialog
- [ ] Use `AlertDialog` for confirmations (delete, logout)

**Priority:** Order details modals, delete confirmations, Subscribe modal

---

### 2.5 Dropdowns & Menus
- [ ] Add shadcn `DropdownMenu`, `ContextMenu`, `Select`
- [ ] Migrate Menubar dropdowns, table row actions, filter dropdowns

---

### 2.6 Badges & Status Indicators
- [ ] Add shadcn `Badge`
- [ ] Map status colors: Pending (warning), Active (success), Cancelled (destructive)
- [ ] Replace MUI `Badge` and custom badge styles

**Priority:** Order list, Order details, Notifications

---

### 2.7 Tables
- [ ] Add shadcn `Table` (or use `@tanstack/react-table` with shadcn Table)
- [ ] Style with Tailwind: zebra stripes, hover row, sortable headers if needed

**Priority pages:** Order list, Product list, Customer list, Courier, Billing

---

## Phase 3: Feature Page Migrations

**Goal:** Migrate pages feature-by-feature to Tailwind + shadcn. Order by user impact and complexity.

### 3.1 Dashboard (Home)
- [x] Dashboard container: MUI Container → Tailwind `max-w-4xl mx-auto`; DashboardV2 Card retained for now
- [ ] Replace DashboardV2 Card, Button, Input, Select with shadcn
- [ ] Charts: keep Recharts/Chart.js, style with Tailwind + design token colors
- [ ] Section labels: use Tailwind typography
- [ ] Grid layout: Tailwind `grid` / `flex` instead of MUI Grid (or keep MUI Grid temporarily)

**Checkpoint:** Dashboard fully styled with Tailwind + shadcn, no DashboardV2 CSS modules for core components.

---

### 3.2 Login & Auth Pages
- [x] `pages/login/index.js`: shadcn Button, design tokens in CSS
- [ ] `forget-password`, `password-setup`: same pattern
- [ ] Centered card layout, clear hierarchy, error states with shadcn `Alert`

---

### 3.3 Orders
- [x] OrderUpdate modal → shadcn Dialog
- [ ] `pages/order-details/index.js`: Card layout, status Badge, action buttons

---

### 3.4 Products
- [x] Product page: Container → Tailwind; Add Product → shadcn Button; ShowProduct modal → Dialog
- [ ] `pages/add-product/index.js`: Form with shadcn Input, Select, Textarea, file upload

---

### 3.5 Customers
- [x] CustomerList: MUI Tabs → shadcn Tabs; Container → Tailwind

---

### 3.6 Other High-Traffic Pages
- [ ] `subscription1`, `billing`
- [ ] `sales-reports`, `account-report`, `profit`
- [ ] `support-ticket`, `notification`
- [ ] `dashboard-setting`

---

### 3.7 Remaining Pages
- [ ] Category, Sub-category, Banner, Home slider, etc.
- [ ] Edit-theme, landing-page, multi-page, website-setting
- [ ] Courier, bulk-sms, marketing-tools, plug-in, etc.

---

## Phase 4: Visual Polish

**Goal:** Consistency, depth, and micro-interactions.

### 4.1 Typography System
- [ ] Single primary font (Inter) applied via Tailwind `font-sans`
- [ ] Define headings: `text-2xl font-semibold`, `text-xl`, etc.
- [ ] Remove `!important` overrides from globals; fix with proper specificity

---

### 4.2 Shadows & Depth
- [ ] Apply shadow scale: cards `shadow-sm`, modals `shadow-lg`, dropdowns `shadow-md`
- [ ] Optional: subtle `ring` for focus states

---

### 4.3 Micro-interactions
- [ ] Button hover/active transitions (200ms)
- [ ] Card hover: slight `-translate-y-0.5` or `shadow` change
- [ ] Table row hover background
- [ ] Skeleton loaders for async content (shadcn `Skeleton`)

---

### 4.4 Empty & Error States
- [ ] Consistent empty state: icon + message + CTA
- [ ] Error states with shadcn `Alert` (destructive variant)

---

## Phase 5: MUI Removal & Cleanup

**Goal:** Remove MUI once all critical UI uses shadcn + Tailwind.

### 5.1 Audit MUI Usage
- [ ] Grep for `@mui/material`, `@mui/icons-material`, `@mui/lab`, `@mui/x-date-pickers`
- [ ] List components still on MUI (Table, DatePicker, Skeleton, etc.)

---

### 5.2 Replace MUI Date Pickers
- [ ] Add shadcn Calendar + Popover for date range
- [ ] Or keep `@mui/x-date-pickers` if heavily used (weigh bundle size vs effort)

---

### 5.3 Remove MUI
- [ ] Uninstall `@mui/material`, `@mui/icons-material`, `@mui/lab`, `@emotion/react`, `@emotion/styled`
- [ ] Remove MUI Container overrides from `globals.css`
- [ ] Replace any remaining MUI icons with `lucide-react`

---

### 5.4 Legacy CSS Cleanup
- [ ] Remove or archive unused CSS: `admin_dashboard.css` portions, `common.css` sidebar/menubar rules
- [ ] Consolidate globals into Tailwind + minimal custom CSS
- [ ] Remove `DashboardV2` CSS modules as components migrate

---

## Phase 6: Optional Enhancements

### 6.1 Dark Mode
- [ ] Add `dark` class strategy in Tailwind
- [ ] Define dark palette in CSS variables (shadcn supports this)
- [ ] Toggle in Menubar or Settings

---

### 6.2 Accessibility
- [ ] Focus states: ensure `ring` on interactive elements
- [ ] Color contrast check for primary, destructive
- [ ] ARIA labels for icon-only buttons

---

### 6.3 Performance
- [ ] Lazy load heavy components (charts, rich editors)
- [ ] Trim unused Tailwind classes (purge)

---

## Progress Tracker

| Phase   | Status | Notes |
|---------|--------|-------|
| 0       | ✅     | Foundation (Tailwind v3, shadcn init, tokens, CSS vars fixed) |
| 1       | ✅     | Layout & navigation (Sheet for mobile, layout structure) |
| 2       | ✅     | Core UI components (Button, Card added; Menubar, Login migrated) |
| 3       | 🔄     | Feature page migrations (Dashboard, Login done) |
| 4       | ⬜     | Visual polish |
| 5       | ⬜     | MUI removal |
| 6       | ⬜     | Optional enhancements |

---

## Dependency Summary

```
Phase 0 → Phase 1 (layout needs tokens + Tailwind)
Phase 0 → Phase 2 (components need shadcn + Tailwind)
Phase 1 → Phase 3 (pages use new layout)
Phase 2 → Phase 3 (pages use new components)
Phase 3 → Phase 4 (polish after migrations)
Phase 3 + 4 → Phase 5 (cleanup after migrations)
```

---

## Estimated Effort (Rough)

| Phase | Effort | Risk |
|-------|--------|------|
| 0     | 0.5–1 day | Low |
| 1     | 1–2 days | Medium |
| 2     | 2–3 days | Low |
| 3     | 3–5 days | Medium (many pages) |
| 4     | 0.5–1 day | Low |
| 5     | 1–2 days | Medium |
| 6     | 0.5–1 day | Low |

**Total:** ~2–3 weeks for full migration, depending on team size and scope cuts.

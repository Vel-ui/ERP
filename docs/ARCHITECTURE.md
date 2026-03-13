# Maximor ERP — System Architecture

> **Version 1.0** | Mar 2026

---

## Overview

Maximor ERP is an enterprise accounting platform built as a single-page application using Next.js 14 with the App Router. The current implementation is a fully functional frontend prototype with mock data; the backend API and database layers are planned for future phases.

---

## Frontend Architecture

### Framework

- **Next.js 14** with App Router (file-system routing under `src/app/`)
- **React 18** with functional components and hooks
- **TypeScript** for type safety across all modules

### Styling

- **Tailwind CSS** for layout utilities (flex, grid, gap, padding, margin)
- **Maximor Design System** (`mx-styles.css`) for branded component styles
- All branded components use the `mx-` CSS class prefix
- Color tokens defined in both Tailwind config and CSS custom properties

### Key Libraries

| Library | Purpose |
|---------|---------|
| `lucide-react` | Icon system (replaces emoji icons) |
| `recharts` | Charts and data visualization |
| `@tanstack/react-table` | Headless data table with sort, filter, pagination |
| `@tanstack/react-query` | Server state management and data fetching |
| `react-hook-form` | Form state and validation |
| `zod` | Schema validation (integrated via `@hookform/resolvers`) |

---

## Module Structure

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
├─────────────────────────────────────────────────────────────┤
│                     Next.js App Router                       │
├──────┬──────┬──────┬──────┬──────┬──────┬──────┬───────────┤
│      │      │      │      │      │      │      │           │
│ Rev  │ Cash │ Sub- │Period│Report│ CDH  │Work- │ Settings  │
│ enue │      │ledgrs│Close │ ing  │      │flows │           │
│      │      │      │      │      │      │      │           │
├──────┴──────┴──────┴──────┴──────┴──────┴──────┴───────────┤
│                   Shared UI Components (21)                  │
├─────────────────────────────────────────────────────────────┤
│              Maximor Design System (mx-styles.css)           │
├─────────────────────────────────────────────────────────────┤
│                  Tailwind CSS + TypeScript                    │
└─────────────────────────────────────────────────────────────┘
```

### Module Routing

| Module | Base Route | Sub-routes |
|--------|-----------|------------|
| Launchpad | `/` | — |
| Revenue | `/revenue` | `/customers`, `/products`, `/contracts`, `/invoices`, `/credit-memos`, `/recognition`, `/policies` |
| Cash | `/cash` | `/reconciliation`, `/reporting`, `/policies` |
| Subledgers: AP | `/subledgers/ap` | `/vendors`, `/bills`, `/charges`, `/accruals`, `/reimbursements` |
| Subledgers: Fixed Assets | `/subledgers/fixed-assets` | — |
| Subledgers: Prepaids | `/subledgers/prepaids` | — |
| Period Close | `/period-close` | `/checklist`, `/journal-entries`, `/flux-analysis`, `/reconciliations`, `/monitoring`, `/intercompany` |
| Reporting | `/reporting` | `/income-statement`, `/balance-sheet`, `/cash-flow`, `/executive-pl`, `/saas-pl`, `/ar-aging`, `/ap-aging`, `/budget-vs-actuals`, `/mrr-arr`, `/arr-waterfall`, `/data-lab`, `/close-reports/*` |
| Central Data Hub | `/central-data-hub` | `/unified-ledger`, `/data-catalog`, `/mapping`, `/integrations` |
| Workflows | `/workflows` | — |
| Settings | `/settings` | `/banks`, `/chart-of-accounts`, `/fields`, `/members`, `/invoices`, `/accounting`, `/report-settings`, `/onboarding`, `/subsidiaries`, `/integrations/*` |
| Aura AI | `/ai` | — |

---

## Component Hierarchy

```
AppShell (layout.tsx)
├── Sidebar
│   ├── Logo
│   ├── Navigation Links (module icons + labels)
│   ├── Collapse Toggle
│   └── Settings / User Menu
├── Topbar
│   ├── Breadcrumbs
│   ├── Search (Cmd+K)
│   ├── Notifications
│   └── User Avatar
└── Main Content Area
    └── [Page Component]
        ├── TopSection (title + actions)
        ├── Toolbar (search, filters, buttons)
        ├── Content (tables, forms, dashboards)
        └── Modals / Drawers (detail views, forms)
```

### Shared UI Components (21)

| Category | Components |
|----------|-----------|
| **Input** | Button, Input, InputNumber, Select, Checkbox, Textarea |
| **Display** | Card, Tag, Badge, Avatar, Alert, Progress |
| **Navigation** | Tabs, SegmentedTabs, Breadcrumb, Pagination |
| **Overlay** | Modal, Drawer, Dropdown |
| **Layout** | Toolbar, RadioGroup |

---

## Data Flow

### Current State (Prototype)

```
Mock Data (src/lib/mock-data.ts)
    │
    ▼
React Component State (useState / useReducer)
    │
    ▼
UI Components (render)
```

All data is currently defined as TypeScript constants and interfaces in `src/lib/mock-data.ts`. Components consume this data directly via imports or local state.

### Planned Architecture

```
PostgreSQL Database
    │
    ▼
Next.js API Routes (src/app/api/)
    │
    ▼
React Query (cache, refetch, mutations)
    │
    ▼
React Components (render)
    │
    ▼
React Hook Form + Zod (form input → validated data → API mutation)
```

#### Data Fetching Pattern

```typescript
// Query: Fetch data
const { data, isLoading } = useQuery({
  queryKey: ['customers'],
  queryFn: () => fetch('/api/customers').then(r => r.json()),
});

// Mutation: Create/Update
const mutation = useMutation({
  mutationFn: (data) => fetch('/api/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  onSuccess: () => queryClient.invalidateQueries(['customers']),
});
```

---

## Planned Backend

### API Layer

- **Next.js API Routes** (`src/app/api/`) for REST endpoints
- Route structure mirrors the frontend module structure
- Middleware for authentication, validation, and error handling

### Database

- **PostgreSQL** as the primary database
- Schema designed around core accounting entities (see `docs/DATA-MODEL.md`)
- Migrations managed via Prisma or Drizzle ORM

### API Route Structure (Planned)

```
src/app/api/
├── auth/           # Authentication endpoints
├── customers/      # CRUD for customers
├── products/       # CRUD for products
├── contracts/      # CRUD + workflow actions
├── invoices/       # CRUD + status transitions
├── vendors/        # CRUD for vendors
├── bills/          # CRUD + payment tracking
├── journal-entries/# CRUD + approval workflow
├── accounts/       # Chart of Accounts
├── reconciliation/ # Matching operations
├── reports/        # Report generation
└── integrations/   # Webhook handlers
```

---

## Integration Architecture

### Planned Integrations

```
┌──────────────────────────────────────────────────────────┐
│                      Maximor ERP                          │
├───────────┬───────────┬───────────┬───────────┬──────────┤
│  Banking  │  Expense  │  Payroll  │    CRM    │   Tax    │
├───────────┼───────────┼───────────┼───────────┼──────────┤
│ Plaid     │ Brex      │ Rippling  │ HubSpot   │ Avalara  │
│           │ Ramp      │ Gusto     │ Salesforce│ Anrok    │
│           │ Expensify │           │           │          │
│           │ Float     │           │           │          │
├───────────┴───────────┴───────────┴───────────┴──────────┤
│ Stripe (Payments: Customers, Subscriptions, Invoices)     │
└──────────────────────────────────────────────────────────┘
```

### Integration Pattern

1. **OAuth / API Key** — User connects via Settings > Integrations
2. **Webhook / Polling** — Data syncs on schedule (real-time or hourly)
3. **Mapping** — User maps external fields to Maximor GL accounts
4. **Sync** — Transactions flow into Maximor as charges, bills, or JEs
5. **Reconciliation** — Bank feed matches against Maximor transactions

---

## Authentication Plan

### Technology: NextAuth.js or Auth0

| Feature | Implementation |
|---------|---------------|
| **Sign-in** | Email/password + SSO (Microsoft, Google) |
| **Roles** | Admin, Accountant (stored in database) |
| **Sessions** | JWT with HTTP-only cookies |
| **Authorization** | Middleware checks role per route |
| **Multi-tenant** | Organization ID scoped to all queries |

### Route Protection (Planned)

```
middleware.ts
├── /api/*        → Require valid session
├── /settings/*   → Require Admin role
├── /ai           → Require any authenticated role
└── /*            → Require any authenticated role
```

---

## Deployment Architecture (Planned)

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Vercel     │────▶│  Next.js     │────▶│  PostgreSQL   │
│   (CDN)      │     │  (Server)    │     │  (Supabase/   │
│              │     │              │     │   Neon/RDS)    │
└─────────────┘     └──────────────┘     └──────────────┘
                           │
                    ┌──────┴──────┐
                    │ External    │
                    │ APIs        │
                    │ (Plaid,     │
                    │  Stripe,    │
                    │  etc.)      │
                    └─────────────┘
```

---

## Security Considerations

| Area | Approach |
|------|----------|
| **Authentication** | NextAuth.js / Auth0 with JWT sessions |
| **Authorization** | Role-based access control (RBAC) at API level |
| **Data isolation** | Organization-scoped queries (multi-tenant) |
| **Secrets** | Environment variables, never committed to repo |
| **API security** | Rate limiting, CORS, input validation (Zod) |
| **Audit trail** | All entity changes logged with user, timestamp, action |

---

*Architecture document version: 1.0 | Mar 2026*

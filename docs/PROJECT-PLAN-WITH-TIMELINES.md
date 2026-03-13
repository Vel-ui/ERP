# Maximor ERP — Project Plan with Timelines

> **Version 3.0** | Updated Mar 2026

---

## Executive Summary

| Item | Value |
|------|-------|
| **Project** | Maximor ERP (Enterprise accounting platform) |
| **Total Screens** | ~87 |
| **Tech Stack** | Next.js 14, TypeScript, Tailwind CSS, Maximor Design System (mx-), lucide-react, recharts, @tanstack/react-query, @tanstack/react-table, React Hook Form, Zod |
| **Design System** | Maximor Design System — light theme, green primary (#154738), 21 reusable UI components |
| **Backend (planned)** | Next.js API Routes → PostgreSQL |
| **Auth (planned)** | NextAuth.js / Auth0 |

---

## Phase Overview

| Phase | Focus | Screens | Status | Milestone |
|-------|-------|---------|--------|-----------|
| **0** | Foundation | 6 | ✅ Complete | App runs, Launchpad visible, Design System applied |
| **1** | Org Settings | 10 | ✅ Complete | Settings fully navigable, Onboarding wizard |
| **2** | Revenue (AR) | 10 | ✅ Complete | Contract-to-cash flow, Revenue Recognition |
| **3** | Cash Management | 4 | ✅ Complete | Matching, Quick Entry, Cash Reporting |
| **4** | Subledgers | 9 | ✅ Complete | AP, Accruals, Fixed Assets, Prepaids, Reimbursements |
| **5** | Period Close + GL | 8 | ✅ Complete | Checklist, JEs, Flux Analysis, Reconciliations |
| **6** | Reporting | 16 | ✅ Complete | Core reports + Budget vs Actuals |
| **6a** | Central Data Hub | 5 | ✅ Complete | Unified Ledger, Data Catalog, Mapping |
| **6b** | Workflows | 1 | ✅ Complete | Approval chains, automation |
| **7** | Multi-Entity + FX | 4 | Planned | Subsidiaries, Intercompany, FX |
| **8** | Integrations | 13 | ✅ Complete | 13 integration setup pages |
| **9** | Aura AI | 1 | ✅ Complete | Natural-language queries |

---

## Detailed Phase Plan

### Phase 0: Foundation ✅ Complete

| Deliverables |
|--------------|
| Project scaffolding (Next.js 14, Tailwind, TypeScript) |
| Maximor Design System (mx-styles.css, color tokens, 21 components) |
| App shell with dark green sidebar, Topbar with breadcrumbs |
| Launchpad with Metrics, Workflow Snapshot, Period Close Insights |
| lucide-react icons throughout |

---

### Phase 1: Organization Settings ✅ Complete

| Deliverables |
|--------------|
| Settings layout with sidebar navigation |
| Banks, Chart of Accounts, Fields, Members & Roles |
| Invoices > Communications, Accounting, Report Settings |
| Onboarding & Go-Live wizard |
| Subsidiaries management |
| 13 integration setup pages (Plaid, Stripe, Brex, Expensify, Float, Gusto, Anrok, Avalara, Salesforce, HubSpot, Ramp, Rippling) |

---

### Phase 2: Revenue (AR) ✅ Complete

| Deliverables |
|--------------|
| Customers list with Add/Edit/Merge/Export |
| Products list with Revenue/Non-Revenue, Fixed/Usage |
| Contracts with multi-step wizard (General → Products → Invoicing → Revenue → Summary) |
| Invoices with split layout, status flows |
| Credit Memos with Apply/Refund |
| Revenue Recognition (ASC 606) |
| Revenue Policies configuration |

---

### Phase 3: Cash Management ✅ Complete

| Deliverables |
|--------------|
| Cash overview dashboard |
| Reconciliation workbench (Bank | Maximor panes) |
| Cash Reporting (flow trends, balances) |
| Bank account policies |

---

### Phase 4: Subledgers ✅ Complete

| Deliverables |
|--------------|
| AP Overview dashboard |
| Vendors list with full schema |
| Bills with line items, service periods |
| Charges from integrations |
| Accruals management with schedules and reversals |
| Reimbursements tracking |
| Fixed Assets register with depreciation and disposal |
| Prepaids & Amortization schedules |

---

### Phase 5: Period Close + GL ✅ Complete

| Deliverables |
|--------------|
| Period Close overview dashboard |
| Close Checklist (tasks, owners, due dates, attachments) |
| Journal Entries (create, upload CSV, reversal, approval) |
| Flux Analysis with variance tracking and explanations |
| Account Reconciliations |
| Close Monitoring dashboard |
| Intercompany entries |

---

### Phase 6: Reporting ✅ Complete

| Deliverables |
|--------------|
| Income Statement, Balance Sheet, Cash Flow |
| Executive P&L, SaaS P&L |
| AR Aging, AP Aging |
| Budget vs Actuals with CSV upload |
| MRR/ARR, ARR Waterfall |
| Data Lab (transaction explorer) |
| Close Reports: 1099, Sales Tax, VAT, Prepaid Schedule |
| Favorites and Pinning (max 5) |

---

### Phase 6a: Central Data Hub ✅ Complete

| Deliverables |
|--------------|
| Unified Ledger (consolidated GL view) |
| Data Catalog (metadata registry) |
| Data Mapping (field mapping and transformations) |
| Integration Hub (sync status and management) |

---

### Phase 6b: Workflows ✅ Complete

| Deliverables |
|--------------|
| Approval chain configuration |
| Rule-based automation |
| Notification management |

---

### Phase 7: Multi-Entity & FX (Planned)

| Deliverables |
|--------------|
| Subsidiaries list and entity details |
| Intercompany entries and management fees |
| FX setup (multi-currency, revaluation accounts) |
| Bills/Invoices in FX; Multi Currency Match |

---

### Phase 8: Integrations ✅ Complete

| Deliverables |
|--------------|
| Integrations list by category (Banks, AP, Payroll, CRM, Tax) |
| Individual setup pages for 13 integrations |
| Plaid, Stripe, Brex, Expensify, Float, Gusto, Anrok, Avalara, Salesforce, HubSpot, Ramp, Rippling |

---

### Phase 9: Aura AI ✅ Complete

| Deliverables |
|--------------|
| AI Assistant panel with suggested queries |
| Natural language input with contextual results |

---

## What's Next

| Priority | Item | Description |
|----------|------|-------------|
| **High** | Backend API | Next.js API routes + PostgreSQL database |
| **High** | Authentication | NextAuth.js with role-based access (Admin, Accountant) |
| **High** | Multi-Entity & FX | Phase 7 implementation |
| **Medium** | Live Integrations | Connect Plaid, Stripe, and CRM APIs |
| **Medium** | Testing | Unit, integration, and E2E test suites |
| **Low** | Performance | Code splitting, lazy loading, caching strategies |

---

## Prerequisites

1. **Node.js** (v18+) installed
2. **Git** for version control
3. **PostgreSQL** (when backend phase begins)

---

*Project Plan version: 3.0 | Updated Mar 2026*

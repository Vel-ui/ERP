# Maximor ERP — Project Plan with Timelines

> **Ready to execute.** Reply "yes" or "proceed" to start building immediately.

---

## Executive Summary

| Item | Value |
|------|-------|
| **Project** | Maximor ERP (Rillet-style accounting platform) |
| **Total Duration** | ~33 weeks |
| **Total Screens** | ~64 |
| **Tech Stack** | React, TypeScript, Tailwind, TanStack Query/Table, React Hook Form, Zod, Next.js API, PostgreSQL |
| **Can Start** | Yes, immediately upon approval |

---

## Phase Overview

| Phase | Focus | Screens | Duration | Milestone |
|-------|-------|---------|----------|-----------|
| **0** | Foundation | 6 | 3 weeks | App runs, Launchpad visible |
| **1** | Org Settings | 8 | 2 weeks | Settings fully navigable |
| **2** | Accounts Receivable | 12 | 6 weeks | Contract-to-cash flow works |
| **3** | Cash Reconciliation | 5 | 2 weeks | Matching & Quick Entry work |
| **4** | Accounts Payable | 6 | 4 weeks | Bills, Vendors, Charges |
| **5** | Close + GL | 6 | 4 weeks | Checklist, JEs, Fixed Assets |
| **6** | Reporting | 16 | 4 weeks | Core reports + Budget vs Actuals |
| **7** | Multi-Entity + FX | 7 | 3 weeks | Subsidiaries, Intercompany, FX |
| **8** | Integrations | 6 | 3 weeks | Stripe, Ramp, CRM connectors |
| **9** | Aura AI (optional) | 2 | 2 weeks | Natural-language queries |

---

## Detailed Phase Plan

### Phase 0: Foundation (Weeks 1–3)

| Week | Deliverables |
|------|--------------|
| **1** | Project scaffolding (Vite/Next.js, Tailwind, TS, folders); Design tokens (colors, spacing); App shell (sidebar, header, routing); Base components (Button, Input, Select, Table, Modal) |
| **2** | Sidebar navigation; Organization selector; Launchpad layout; Workflow Snapshot (placeholders); Tech Stack Monitoring (placeholder) |
| **3** | + Add Metric (6 max); Reports section; User Preferences (name, date format, light/dark); Component polish |

**Exit criteria:** App loads, sidebar navigates, Launchpad shows layout. No backend yet; mock data.

---

### Phase 1: Organization Settings (Weeks 4–5)

| Week | Deliverables |
|------|--------------|
| **4** | Settings layout; Banks list (mock); Chart of Accounts list + Add Account form; Fields list + Add Field form |
| **5** | Members & Roles; Invoices > Communications; Accounting; Report Settings; All settings screens navigable |

**Exit criteria:** All 8 settings screens render with forms. Data can be mock or localStorage.

---

### Phase 2: Accounts Receivable (Weeks 6–11)

| Week | Deliverables |
|------|--------------|
| **6** | Customers list; Add/Edit Customer; Products list; Add/Edit Product |
| **7** | Contracts list; Contract stepper (General, Products, Invoicing, Revenue, Summary) |
| **8** | Invoices list; Create/Edit Invoice (split layout); Credit Memos list + Create |
| **9** | Upload Usage modal; GL Impact; Contract actions (Edit, Amend, End, Delete) |
| **10** | Invoice actions (Send, Mark sent, Receive payment); Status flows |
| **11** | AR polish; Export; links from Launchpad |

**Exit criteria:** Full contract → invoice → credit memo flow. Backend or mock.

---

### Phase 3: Cash Reconciliation (Weeks 12–13)

| Week | Deliverables |
|------|--------------|
| **12** | Reconciliation layout (Bank | Rillet panes); Bank Transactions list; Rillet Transactions list; Match button (one-to-one) |
| **13** | One-to-many match; Match & Adjust; Quick Entry modal; Transfer; Unmatch |

**Exit criteria:** Matching and Quick Entry work. Bank data mock or Plaid stub.

---

### Phase 4: Accounts Payable (Weeks 14–17)

| Week | Deliverables |
|------|--------------|
| **14** | Vendors list; Add/Edit Vendor |
| **15** | Bills list; Create/Edit Bill; Line items; Service period |
| **16** | Bill Credit modal; Pay Expense modal; Charges list; Prepaid Schedule |
| **17** | AP polish; FX currency selector on Bill |

**Exit criteria:** Bills, Vendors, Bill Credit, Pay Expense. Prepaid schedule view.

---

### Phase 5: Close Management & GL (Weeks 18–21)

| Week | Deliverables |
|------|--------------|
| **18** | Close Checklist; Add task, owner, due date, attach; Mark complete; Copy & Create New Month |
| **19** | Account Register; Create/Edit JE; Upload JE (CSV); Reversal date |
| **20** | General Ledger report; Pending Approval filter; Approve JE |
| **21** | Fixed Assets list; Dispose modal; Close Books |

**Exit criteria:** Checklist, JEs, GL report, Fixed Assets.

---

### Phase 6: Reporting (Weeks 22–25)

| Week | Deliverables |
|------|--------------|
| **22** | Income Statement; Balance Sheet; Cash Flow; Customize (Columns, Breakdown) |
| **23** | Executive P&L; SaaS P&L; AR Aging; AP Aging |
| **24** | Budget vs Actuals; Upload budget CSV; MRR/ARR; ARR Waterfall; Data Lab |
| **25** | 1099; Sales Tax; VAT; Prepaid Schedule; Favorites; Pinning (max 5) |

**Exit criteria:** All reports render with mock/real data. Budget upload works.

---

### Phase 7: Multi-Entity & FX (Weeks 26–28)

| Week | Deliverables |
|------|--------------|
| **26** | Subsidiaries list; Subsidiary Entity Details (Profile, Accounting, Invoicing) |
| **27** | Intercompany Entry; Intercompany Management Fee; FX Setup in Accounting |
| **28** | Bills/Invoices in FX; Multi Currency Match; Pay Expense for FX |

**Exit criteria:** Subsidiaries, Intercompany, FX on bills/invoices.

---

### Phase 8: Integrations (Weeks 29–31)

| Week | Deliverables |
|------|--------------|
| **29** | Integrations list by category; Stripe setup UI; Ramp/Brex setup UI |
| **30** | HubSpot/Salesforce setup; Rippling/Gusto setup |
| **31** | Avalara/Anrok setup; Integration status tiles; Tech Stack Monitoring live |

**Exit criteria:** Integration setup screens. OAuth/API stubs where needed.

---

### Phase 9: Aura AI (Optional, Weeks 32–33)

| Week | Deliverables |
|------|--------------|
| **32** | AI Assistant panel; Suggested queries; Natural language input |
| **33** | Table/list results; Prompt examples |

**Exit criteria:** AI panel with basic query handling.

---

## MVP Option (Faster Time to Value)

If you want something usable sooner:

| Scope | Phases | Duration | Outcome |
|-------|--------|----------|---------|
| **MVP** | 0 + 1 + 2 | 11 weeks | Launchpad, Settings, AR (Customers → Contracts → Invoices) |
| **Extended MVP** | 0–3 | 13 weeks | + Cash Reconciliation |
| **Full** | 0–9 | 33 weeks | Complete ERP |

---

## What I Build Per Session

Each session I can:

- Add new screens, components, or routes
- Implement forms with validation (Zod)
- Wire up API routes and data
- Fix bugs and polish UX

You review incrementally. We can pause after any phase for testing or scope changes.

---

## Prerequisites (Your Side)

1. **Node.js** (v18+) installed
2. **Git** (if using version control)
3. **Database** (PostgreSQL or SQLite for MVP) — can add later

---

## Ready to Start?

Reply **"yes"** or **"proceed"** and I will:

1. Initialize the React + TypeScript project
2. Set up Tailwind and design tokens
3. Build the app shell and sidebar
4. Add the Launchpad layout

I can start immediately.

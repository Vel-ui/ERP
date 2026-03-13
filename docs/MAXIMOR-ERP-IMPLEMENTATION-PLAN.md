# Maximor ERP Implementation Plan
## Enterprise Accounting Platform with Maximor Design System

> **Product scope defined from:** Briq-Rillet Product Documentation (3 docs) · [Rillet Docs](https://docs.rillet.com/EjmEP4KZ9BVp9j2ho4Mh) · User reference screenshots · Maximor Design System

**Version:** 3.0 | **Last updated:** Mar 2026

---

## 1. Product Scope Definition (Full)

### 1.1 Module Map

| Module | Priority | Description |
|--------|----------|-------------|
| **Launchpad** | P0 | Key metrics (6 max), workflow snapshot, reports list, tech stack monitoring |
| **Revenue** | P0 | Customers, Products, Contracts, Invoices, Credit Memos, usage-based billing |
| **Revenue Recognition** | P0 | ASC 606 compliance, performance obligations, recognition schedules |
| **Cash Management** | P0 | Bank feeds (Plaid), transaction matching, Quick Entry, Transfer, Cash Reporting |
| **Subledgers: AP & Accruals** | P0 | Vendors, Bills, Charges, Reimbursements, Accrual schedules and reversals |
| **Subledgers: Fixed Assets** | P0 | Asset register, depreciation schedules, disposal |
| **Subledgers: Prepaids** | P0 | Prepaid entries, amortization schedules, adjustments |
| **Period Close** | P0 | Checklist (tasks, owners, due dates, attachments), Journal Entries, Reconciliations, Monitoring |
| **Flux Analysis** | P0 | Variance tracking, thresholds, explanations, period-over-period comparison |
| **General Accounting** | P0 | Chart of Accounts, Journal Entries, VAT, closing the books |
| **Reporting** | P0 | Income Statement, Balance Sheet, Cash Flow, SaaS P&L, AR Aging, AP Aging, and 10+ reports |
| **Central Data Hub** | P0 | Unified Ledger, Data Catalog, Data Mapping, Integration Hub |
| **Workflows** | P0 | Approval chains, rule-based automation, notifications, escalations |
| **Organization Settings** | P0 | Banks, Chart of Accounts, Fields, Members & Roles, Invoices, Accounting, Onboarding |
| **Multi-Entity** | P1 | Subsidiaries, consolidation, intercompany |
| **Foreign Currency** | P1 | FX revaluation, translation, bills/invoices in FX |
| **Integrations** | P1 | Banks (Plaid), Brex, Ramp, Expensify, Float, Stripe, Rippling, Gusto, HubSpot, Salesforce, Avalara, Anrok, FP&A via Snowflake |
| **Aura AI** | P2 | Natural-language queries, flux analysis, accruals, revenue insights |

---

## 2. Business Rules & Workflows (from Documentation)

### 2.1 Getting Started & Organization Settings

| Feature | Business Rules |
|---------|----------------|
| **Bank Connections** | Plaid; 2FA may require periodic re-auth; access via Launchpad Tech Stack or Org Settings > Banks |
| **Custom Fields** | Values + Rules; Mandatory toggle; Display: Standalone (text) or Free tagging (multi-select); Used fields cannot be deleted |
| **User Preferences** | Edit username (not email); Date format (MM/DD/YYYY or DD/MM/YYYY); Light/Dark mode; Microsoft SSO (Connect with Microsoft in prefs, then Sign in with Microsoft) |
| **Chart of Accounts** | Add account: Number, Name, Type, Subtype, Parent Grouping, optional Prepaid link, optional Bank link; Types: Asset, Equity, Expense, Liability, Income |
| **Member Roles** | Admin, Accountant; Edit via three-dot menu; Archive = remove access, permanent |
| **SaaS P&L Structure** | COA by type (Salaries, Software, etc.) + Department field; Map departments in SaaS P&L Settings; Income Statement by Department |
| **Transaction Automation** | Org Settings > Accounting > Quick Entries for Expenses: auto-create reconciliation quick entries for existing vendors |
| **Onboarding & Go-Live** | Multi-step wizard: Organization setup → Data import → Integration connections → Go-live checklist |

### 2.2 Revenue (Accounts Receivable)

| Entity | Business Rules & Workflows |
|--------|---------------------------|
| **Customers** | Add: Company name, invoicing name, address, shipping address, emails (Main/CC), notes, automatic reminders, online payments (Stripe), payment terms, tax rate, Department, Customer Segment; Merge: max 2 at a time; Export XLSX |
| **Products** | Revenue vs Non-Revenue; Revenue Type: Fixed or Usage; Revenue Account, optional Discount Account; Revenue Pattern: Even Period Prorated First & Last or Daily; Count to MRR/ARR toggle; Pricing: Recurring or One-time; Usage: Standard, Graduated, or Volume tiered |
| **Contracts** | Multi-step: General Details → Products → Invoicing → Revenue → Summary; Types: New Sales, Existing, Expansion, Reactivation, Contraction; Duration: 6mo, 1yr, 2yr, 3yr, Open-ended, Custom; Actions: Edit, Delete, Amend (reason required), End (for open-ended), GL Impact (export XLSX); Auto-renew: fixed recurring only |
| **Revenue Recognition** | ASC 606 five-step model; Performance obligations; Transaction price allocation; Recognition schedules; Waterfall view |
| **Invoices** | Create: Customer, date, due, terms, PO, memo, products; Status flow: Unbilled → Unpaid → Paid; Actions: Send, Mark as sent, Receive payment, Download PDF; Billing period editable on contract for contract invoices |
| **Credit Memos** | Standalone or linked to invoice; Status: Unpaid, Applied, Refunded; Apply to invoice (credit < invoice total); Refund flow: CM → match payment in cash recon |

### 2.3 Subledgers: AP & Accruals

| Entity | Business Rules & Workflows |
|--------|---------------------------|
| **Vendors** | Name, point person, email, address, country/city/state/zip, tax ID, 1099-eligible; Payment method (Bank, Credit, Debit); Payment terms; Default Account, Department, Customer Segment |
| **Bills** | Create with vendor, date, terms; Line items: GL account, amount; Service period for prepaids; Fixed asset: Useful life, In Service Date, Asset ID |
| **Accruals** | Create accrual entries with reversal dates; Monthly/quarterly schedules; Auto-reversal on period close; Review and approval workflow |
| **Reimbursements** | Employee expense claims; Receipt attachment; Approval workflow; Payment tracking |
| **Charges** | From integrations (Ramp, Brex, Expensify); Match to bank feed |

### 2.4 Subledgers: Prepaids

| Feature | Business Rules |
|---------|----------------|
| **Prepaids** | Auto-include if service period > 1 day; Amortization: Daily or Even Period (first/last prorated); Prepaid Schedule in Reporting > Close Reports; Link Expense GL → Prepaid Account in COA |
| **Prepaid Adjustments** | Edit schedule per line; Delete line items; Closed periods grayed out |
| **Amortization** | Automated monthly amortization; Manual adjustment support; Period-end close integration |

### 2.5 Cash Management

| Feature | Business Rules |
|---------|----------------|
| **Reconciliation** | One-to-one: select bank tx → select Maximor tx → Match; One-to-many: match multiple Maximor txs to one bank tx; Match & Adjust for fees/differences |
| **Quick Entry** | Create JE from unmatched bank tx; Payer type, Vendor, Account; Create and Match |
| **Transfer** | Bank-to-bank; select both sides, Create Transfer and Match |
| **Cash Reporting** | Cash position summary, cash flow trends, bank balance tracking |
| **Policies** | Bank account policies, reconciliation rules, matching thresholds |

### 2.6 Period Close

| Feature | Business Rules |
|---------|----------------|
| **Checklist** | Add task (name); Assign owner; Set due date; Attach files (paper clip); Mark complete; Copy & Create New Month: due dates +1 month, tasks reset, attachments not carried |
| **Journal Entries** | Header + lines; Reversal date; Attach files; Upload JE; Pending Approval filter; Approve JE |
| **Flux Analysis** | Period-over-period variance; Threshold-based flagging; Explanation workflow; Approval process |
| **Reconciliations** | Account reconciliation workbench; Balance verification; Discrepancy resolution |
| **Monitoring** | Period close progress dashboard; Task completion tracking; Bottleneck identification |
| **Fixed Assets** | List under Period Close; Dispose: Sale date, Sale value, Tax |
| **Closing the Books** | Close Books locks period; Reopen (Admin only) |

### 2.7 Central Data Hub

| Feature | Business Rules |
|---------|----------------|
| **Unified Ledger** | Consolidated view of all GL transactions across modules; Real-time aggregation; Drill-down capability |
| **Data Catalog** | Metadata registry for all entities; Field definitions and lineage; Data quality scores |
| **Data Mapping** | Source-to-target field mapping; Transformation rules; Validation logic |
| **Integration Hub** | Centralized view of all connected integrations; Sync status monitoring; Error resolution |

### 2.8 Workflows

| Feature | Business Rules |
|---------|----------------|
| **Approval Chains** | Multi-level approval; Role-based routing; Delegation support |
| **Rules Engine** | Condition-based triggers; Threshold actions; Automated notifications |
| **Notifications** | In-app alerts; Email notifications; Escalation timers |

### 2.9 General Accounting

| Feature | Business Rules |
|---------|----------------|
| **Journal Entry** | Name, Date, optional Reversal date, optional Attachment URL, optional Customer/Vendor; Lines: Account, Debit, Credit, Description, Department |
| **Upload JE** | CSV template: Date, JE Name, Debit, Credit, Currency, Account #/Name, Description, Vendor/Customer, Reversal Date, Field {field_name} |
| **VAT** | Exclusive (net + VAT) or Inclusive (total includes VAT); On invoices, contracts, quick entries, JEs |
| **COA** | Deactivate (not delete) for audit trail; Parent groupings in Balance Sheet |

### 2.10 Onboarding

| Feature | Business Rules |
|---------|----------------|
| **Opening Balance Adjustments** | P&L Impact (DR Revenue CR Deferred Rev) or Direct Retained Earnings |
| **System Implementation Reversals** | Auto-reverse JEs before go-live date; migration reversal entries |
| **Go-Live Wizard** | Step-by-step onboarding: Organization → Chart of Accounts → Integrations → Data Import → Go-Live |

### 2.11 Multi-Entity

| Feature | Business Rules |
|---------|----------------|
| **Subsidiary** | Profile: Logo, Legal Entity Name, Trade Name, Address, Tax ID, Timezone, Currency; Accounting: Due From/To; Invoicing: Bank, terms |
| **Consolidation** | Real-time; Default = consolidated in org currency |
| **FX Translation** | IS = Monthly Average; BS = EOM; Equity = Historical; CTA in Equity |
| **Intercompany** | Name, Date, Currency; From/To lines: Subsidiary, Amount, Account; Preview Entry |

### 2.12 Foreign Currency

| Feature | Business Rules |
|---------|----------------|
| **FX Setup** | Multi-currency toggle; Revaluation start dates; Realized/Unrealized accounts |
| **Bills/Invoices in FX** | Currency selector; Edit Rate override; Unrealized/Realized display |
| **Multi Currency Match** | FX one-to-one match in Cash Reconciliation |

### 2.13 Reporting (Metrics, Budget, Close Reports)

| Feature | Business Rules |
|---------|----------------|
| **Favorites & Pinning** | Star to favorite; Pin to Launchpad (max 5 reports) |
| **Budget vs Actuals** | Group by Account/Vendor/Department/Field; Upload CSV |
| **ARR/MRR** | Classifications: New Sales, Churn, Expansion, Contraction, Reactivation, Usage Impact, FX Impact |
| **Close Reports** | 1099, Sales Tax, VAT, Prepaid Schedule |

### 2.14 Integrations (Detailed)

| Integration | Access | Key Notes |
|-------------|--------|-----------|
| **Plaid** | Org Settings > Banks | Bank transactions; 2FA re-auth |
| **Brex** | Integrations > Brex | Charges, vendors; Category → GL mapping |
| **Ramp** | Integrations > Ramp | Charges, bills, reimbursements; hourly sync |
| **Expensify** | Integrations > Expensify | Charges, reimbursements; hourly sync |
| **Float** | Integrations > Float | Cash forecasting |
| **Stripe** | Integrations > Stripe | Customers, Subscriptions, Invoices, Bank Feed |
| **Rippling** | Rippling App Shop | Payroll JEs when finalized |
| **Gusto** | Integrations > Gusto | Same as Rippling |
| **HubSpot** | Integrations > HubSpot | Deals (Closed Won) every 30 min |
| **Salesforce** | Integrations > Salesforce | Opps (Closed Won) every 30 min; bi-directional sync |
| **Anrok** | Integrations > Anrok | Tax on invoices |
| **Avalara** | Integrations > Avalara | Tax calculation; Document recording |

---

## 3. Prioritized Screen List (Expanded)

### Phase 0: Foundation ✅ Complete

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 0.1 | App shell | Global | Sidebar (collapse), Topbar with breadcrumbs, routing |
| 0.2 | Organization selector | — | Company logo click → switch entity |
| 0.3 | Launchpad | `/` | Metrics, Workflow snapshot, Reports, Period Close Insights |
| 0.4 | User Preferences | Via org icon | Edit name; Appearance: date format, light/dark |
| 0.5 | Design tokens | `src/styles/mx-styles.css` | Maximor Design System (light theme, green primary) |
| 0.6 | Base components | `src/components/ui/` | 21 components: Button, Input, Select, Table, Tabs, Modal, Card, Tag, Badge, Alert, Drawer, etc. |

### Phase 1: Organization Settings ✅ Complete

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 1.1 | Org Settings home | `/settings` | Sidebar: Banks, Chart of Accounts, Fields, Members & Roles, Invoices, Accounting, Integrations |
| 1.2 | Banks | `/settings/banks` | List connected; + Add Institution Connection |
| 1.3 | Chart of Accounts | `/settings/chart-of-accounts` | List; + Add Account |
| 1.4 | Fields | `/settings/fields` | + Add Field; Values, Rules |
| 1.5 | Members & Roles | `/settings/members` | List; Edit role; Archive |
| 1.6 | Invoices > Communications | `/settings/invoices` | Payment timing; Custom email |
| 1.7 | Accounting | `/settings/accounting` | Prepaid amortization; Multi-currency; SaaS P&L mapping |
| 1.8 | Report Settings | `/settings/report-settings` | Recurring Revenue, CAC, Budget Upload |
| 1.9 | Onboarding & Go-Live | `/settings/onboarding` | Multi-step wizard |
| 1.10 | Subsidiaries | `/settings/subsidiaries` | Entity management |

### Phase 2: Revenue (AR) ✅ Complete

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 2.1 | Customers list | `/revenue/customers` | Sortable; + Add Customer; Merge; Export |
| 2.2 | Products list | `/revenue/products` | + Add Product; Edit, Delete |
| 2.3 | Contracts list | `/revenue/contracts` | Active / Pending Review tabs; + Add Contract |
| 2.4 | Create/Edit Contract | `/revenue/contracts/create` | Stepper: General → Products → Invoicing → Revenue → Summary |
| 2.5 | Invoices list | `/revenue/invoices` | Status filters; + Add Invoice |
| 2.6 | Create/Edit Invoice | `/revenue/invoices/create` | Split layout |
| 2.7 | Credit Memos list | `/revenue/credit-memos` | + Add Credit Memo |
| 2.8 | Create Credit Memo | `/revenue/credit-memos/create` | Customer, optional Invoice |
| 2.9 | Revenue Recognition | `/revenue/recognition` | ASC 606 schedules and waterfall |
| 2.10 | Revenue Policies | `/revenue/policies` | Recognition rules configuration |

### Phase 3: Cash Management ✅ Complete

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 3.1 | Cash Overview | `/cash` | Cash position dashboard |
| 3.2 | Reconciliation | `/cash/reconciliation` | Bank | Maximor panes, matching |
| 3.3 | Cash Reporting | `/cash/reporting` | Cash flow trends, bank balances |
| 3.4 | Policies | `/cash/policies` | Bank account policies |

### Phase 4: Subledgers ✅ Complete

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 4.1 | AP Overview | `/subledgers/ap` | AP dashboard |
| 4.2 | Vendors list | `/subledgers/ap/vendors` | + Add Vendor |
| 4.3 | Bills list | `/subledgers/ap/bills` | + Add Bill; Bill Credit |
| 4.4 | Create/Edit Bill | `/subledgers/ap/bills/create` | Line items; Service period |
| 4.5 | Charges list | `/subledgers/ap/charges` | From integrations |
| 4.6 | Accruals | `/subledgers/ap/accruals` | Accrual entries and schedules |
| 4.7 | Reimbursements | `/subledgers/ap/reimbursements` | Employee expense claims |
| 4.8 | Fixed Assets | `/subledgers/fixed-assets` | Asset register, depreciation |
| 4.9 | Prepaids | `/subledgers/prepaids` | Prepaid entries, amortization |

### Phase 5: Period Close ✅ Complete

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 5.1 | Period Close Overview | `/period-close` | Close progress dashboard |
| 5.2 | Close Checklist | `/period-close/checklist` | Tasks, owners, due dates |
| 5.3 | Journal Entries list | `/period-close/journal-entries` | JE list; + Add JE |
| 5.4 | Create/Edit JE | `/period-close/journal-entries/create` | Header + lines; Reversal date |
| 5.5 | Flux Analysis | `/period-close/flux-analysis` | Variance tracking and explanations |
| 5.6 | Reconciliations | `/period-close/reconciliations` | Account reconciliation |
| 5.7 | Monitoring | `/period-close/monitoring` | Close progress tracking |
| 5.8 | Intercompany | `/period-close/intercompany` | Intercompany entries |

### Phase 6: Reporting ✅ Complete

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 6.1 | Reports hub | `/reporting` | Favorites, Pinning |
| 6.2 | Income Statement | `/reporting/income-statement` | Customize: Columns, Variance Analysis |
| 6.3 | Balance Sheet | `/reporting/balance-sheet` | Parent groupings; Expand/collapse |
| 6.4 | Cash Flow | `/reporting/cash-flow` | Statement of Cash Flows |
| 6.5 | Executive P&L | `/reporting/executive-pl` | Operating Expenses breakdown |
| 6.6 | SaaS P&L | `/reporting/saas-pl` | By Department |
| 6.7 | AR Aging | `/reporting/ar-aging` | Aging buckets |
| 6.8 | AP Aging | `/reporting/ap-aging` | Aging buckets |
| 6.9 | Budget vs Actuals | `/reporting/budget-vs-actuals` | Variance, Upload CSV |
| 6.10 | MRR/ARR | `/reporting/mrr-arr` | By Contract Type |
| 6.11 | ARR Waterfall | `/reporting/arr-waterfall` | Rollforward view |
| 6.12 | Data Lab | `/reporting/data-lab` | Transaction explorer |
| 6.13 | 1099 Report | `/reporting/close-reports/1099` | Cash vs Accrual |
| 6.14 | Sales Tax | `/reporting/close-reports/sales-tax` | By State |
| 6.15 | VAT Report | `/reporting/close-reports/vat` | Revenue and Expense |
| 6.16 | Prepaid Schedule | `/reporting/close-reports/prepaid` | By period |

### Phase 6a: Central Data Hub ✅ Complete

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 6a.1 | Central Data Hub | `/central-data-hub` | Hub overview |
| 6a.2 | Unified Ledger | `/central-data-hub/unified-ledger` | Consolidated GL view |
| 6a.3 | Data Catalog | `/central-data-hub/data-catalog` | Metadata registry |
| 6a.4 | Data Mapping | `/central-data-hub/mapping` | Field mapping and transformations |
| 6a.5 | Integration Hub | `/central-data-hub/integrations` | Integration status and management |

### Phase 6b: Workflows ✅ Complete

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 6b.1 | Workflows | `/workflows` | Approval chains, rules, automation |

### Phase 7: Multi-Entity & FX (Planned)

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 7.1 | Subsidiaries list | `/settings/subsidiaries` | Select entity → Entity details |
| 7.2 | Subsidiary Details | `/settings/subsidiaries/:id` | Profile, Accounting, Invoicing |
| 7.3 | Intercompany | `/period-close/intercompany` | From/To lines, Account, Amount |
| 7.4 | FX Setup | `/settings/accounting` | Multi-currency; Revaluation accounts |

### Phase 8: Integrations ✅ Complete

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 8.1 | Integrations list | `/settings/integrations` | By category |
| 8.2 | Stripe | `/settings/integrations/stripe` | GL mappings; Subscriptions |
| 8.3 | Brex | `/settings/integrations/brex` | Category/Dept mapping |
| 8.4 | Expensify | `/settings/integrations/expensify` | Charges, reimbursements |
| 8.5 | Float | `/settings/integrations/float` | Cash forecasting |
| 8.6 | Gusto | `/settings/integrations/gusto` | Payroll JEs |
| 8.7 | Anrok | `/settings/integrations/anrok` | Tax on invoices |
| 8.8 | Salesforce | `/settings/integrations/salesforce` | CRM sync |
| 8.9 | Plaid | `/settings/integrations/plaid` | Bank connections |
| 8.10 | Ramp | `/settings/integrations/ramp` | Expense management |
| 8.11 | HubSpot | `/settings/integrations/hubspot` | CRM sync |
| 8.12 | Rippling | `/settings/integrations/rippling` | Payroll |
| 8.13 | Avalara | `/settings/integrations/avalara` | Tax calculation |

### Phase 9: Aura AI ✅ Complete

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 9.1 | AI Assistant | `/ai` | Natural language queries; Suggested prompts |

---

## 4. Information Architecture (Full)

```
Maximor ERP
├── Launchpad (/)
├── Revenue (/revenue)
│   ├── Customers
│   ├── Products
│   ├── Contracts
│   ├── Invoices
│   ├── Credit Memos
│   ├── Recognition (ASC 606)
│   └── Policies
├── Cash (/cash)
│   ├── Overview
│   ├── Reconciliation
│   ├── Reporting
│   └── Policies
├── Subledgers (/subledgers)
│   ├── AP & Accruals (/subledgers/ap)
│   │   ├── Vendors
│   │   ├── Bills
│   │   ├── Charges
│   │   ├── Accruals
│   │   └── Reimbursements
│   ├── Fixed Assets (/subledgers/fixed-assets)
│   └── Prepaids (/subledgers/prepaids)
├── Period Close (/period-close)
│   ├── Checklist
│   ├── Journal Entries
│   ├── Flux Analysis
│   ├── Reconciliations
│   ├── Monitoring
│   └── Intercompany
├── Reporting (/reporting)
│   ├── Income Statement
│   ├── Balance Sheet
│   ├── Cash Flow
│   ├── Executive P&L
│   ├── SaaS P&L
│   ├── AR Aging
│   ├── AP Aging
│   ├── Budget vs Actuals
│   ├── MRR/ARR
│   ├── ARR Waterfall
│   ├── Data Lab
│   └── Close Reports (1099, Sales Tax, VAT, Prepaid Schedule)
├── Central Data Hub (/central-data-hub)
│   ├── Unified Ledger
│   ├── Data Catalog
│   ├── Mapping
│   └── Integrations
├── Workflows (/workflows)
├── Aura AI (/ai)
└── Settings (/settings)
    ├── Banks
    ├── Chart of Accounts
    ├── Fields
    ├── Members & Roles
    ├── Subsidiaries
    ├── Invoices (Communications)
    ├── Accounting
    ├── Report Settings
    ├── Onboarding & Go-Live
    └── Integrations (13 connectors)
```

---

## 5. Implementation Order Summary (Revised)

| Phase | Focus | Screens | Status |
|-------|-------|---------|--------|
| **0** | Foundation | 6 | ✅ Complete |
| **1** | Org Settings | 10 | ✅ Complete |
| **2** | Revenue (AR) | 10 | ✅ Complete |
| **3** | Cash Management | 4 | ✅ Complete |
| **4** | Subledgers (AP, Fixed Assets, Prepaids) | 9 | ✅ Complete |
| **5** | Period Close + GL | 8 | ✅ Complete |
| **6** | Reporting | 16 | ✅ Complete |
| **6a** | Central Data Hub | 5 | ✅ Complete |
| **6b** | Workflows | 1 | ✅ Complete |
| **7** | Multi-Entity + FX | 4 | Planned |
| **8** | Integrations | 13 | ✅ Complete |
| **9** | Aura AI | 1 | ✅ Complete |
| **Total** | | **~87 screens** | |

---

## 6. Technical Approach

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Maximor Design System (mx- CSS classes)
- **Icons**: lucide-react
- **Charts**: recharts
- **Tables**: @tanstack/react-table
- **Data Fetching**: @tanstack/react-query
- **Forms**: React Hook Form + Zod
- **Backend** (planned): Next.js API Routes → PostgreSQL
- **Auth** (planned): NextAuth.js or Auth0
- **Integrations**: Plaid, Stripe, etc. per vendor SDKs

---

## 7. Next Actions

1. **Backend API layer** — Add Next.js API routes and PostgreSQL database.
2. **Authentication** — Implement NextAuth.js with role-based access control.
3. **Multi-Entity & FX** — Build Phase 7 (subsidiaries, intercompany, FX).
4. **Live integrations** — Connect Plaid, Stripe, and CRM APIs.
5. **Testing** — Add unit tests, integration tests, and E2E tests.

---

## Appendix A: Key Data Structures (from Docs)

### Journal Entry Upload Template (CSV)
| Column | Required | Level | Description |
|--------|----------|-------|-------------|
| Date | Yes | Header | YYYY-MM-DD, MM/DD/YYYY, or DD/MM/YYYY |
| JE Name | Yes | Header | Description |
| Debit Amount | Yes | Line | |
| Credit Amount | Yes | Line | |
| Currency | Yes | Header | |
| Account Number or Name | Yes | Line | |
| Description | No | Line | |
| Vendor Name | No | Header | Cannot use with Customer |
| Customer Name | No | Header | Cannot use with Vendor |
| Reversal Date | No | Header | |
| Field {field_name} | No | Line | e.g. Field Department |

### Chart of Accounts Types & Subtypes
| Type | Subtypes |
|------|----------|
| Asset | Accumulated Depreciation, Allowance for Doubtful Accounts, Bank, Deferred Commissions, Fixed Assets, Other Assets, Prepaid Expense |
| Liability | Accrued Expense, Credit Card, Customer Deposits, Debt, Lease Liability, Other Current Liability |
| Equity | Accumulated OCI, Additional Paid In Capital, Equity, Compensation |
| Income | Revenue |
| Expense | COGS, Non Operating Income/Expense, Operating Expense (Personnel, Office, Sales & Marketing) |

### Launchpad Metrics (max 6)
ARR, Outstanding AR, Outstanding AP, Overdue AR, Gross Burn, Cash Balance, Runway, Net Burn, Net Revenue Retention

---

*Plan version: 3.0 | Based on Briq-Rillet Product Documentation + Maximor Design System | Updated Mar 2026*

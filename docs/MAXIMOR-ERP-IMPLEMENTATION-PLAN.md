# Maximor ERP Implementation Plan
## Rillet-Style Accounting Platform with Maximor Design Principles

> **Product scope defined from:** Briq-Rillet Product Documentation (3 docs) · [Rillet Docs](https://docs.rillet.com/EjmEP4KZ9BVp9j2ho4Mh) · User reference screenshots

**Version:** 2.2 | **Last updated:** Mar 2025

---

## 1. Product Scope Definition (Full)

### 1.1 Module Map

| Module | Priority | Description |
|--------|----------|-------------|
| **Launchpad** | P0 | Key metrics (6 max), workflow snapshot, reports list, tech stack monitoring |
| **Cash Reconciliation** | P0 | Bank feeds (Plaid), transaction matching, Quick Entry, Transfer |
| **Accounts Receivable** | P0 | Customers, Products, Contracts, Invoices, Credit Memos, usage-based billing |
| **Accounts Payable** | P0 | Vendors, Bills, Charges, Reimbursements, Prepaid schedules |
| **Close Management** | P0 | Checklist (tasks, owners, due dates, attachments), Account Register, Fixed Assets |
| **General Accounting** | P0 | Chart of Accounts, Journal Entries, VAT, closing the books |
| **Reporting** | P0 | Income Statement, Balance Sheet, Cash Flow, SaaS P&L, AR Aging, AP Aging |
| **Organization Settings** | P0 | Banks, Chart of Accounts, Fields, Members & Roles, Invoices, Accounting |
| **Multi-Entity** | P1 | Subsidiaries, consolidation, intercompany |
| **Foreign Currency** | P1 | FX revaluation, translation, bills/invoices in FX |
| **Integrations** | P1 | Banks (Plaid), Brex, Ramp, Expensify, Float, Stripe, Rippling, Gusto, HubSpot, Salesforce, Avalara, Anrok, FP&A via Snowflake (Abacum, Aleph, Covariance, Drivetrain, Runway) |
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

### 2.2 Accounts Receivable

| Entity | Business Rules & Workflows |
|--------|---------------------------|
| **Customers** | Add: Company name, invoicing name, address, shipping address, emails (Main/CC), notes, automatic reminders, online payments (Stripe), payment terms, tax rate, Department, Customer Segment; Merge: max 2 at a time; Export XLSX |
| **Products** | Revenue vs Non-Revenue; Revenue Type: Fixed or Usage; Revenue Account, optional Discount Account; Revenue Pattern: Even Period Prorated First & Last or Daily; Count to MRR/ARR toggle; Pricing: Recurring or One-time; Usage: Standard, Graduated, or Volume tiered |
| **Contracts** | Multi-step: General Details → Products → Invoicing → Revenue → Summary; Types: New Sales, Existing, Expansion, Reactivation, Contraction; Duration: 6mo, 1yr, 2yr, 3yr, Open-ended, Custom; Actions: Edit, Delete, Amend (reason required), End (for open-ended), GL Impact (export XLSX); Auto-renew: fixed recurring only |
| **Usage Contracts** | Usage cycle: Monthly or Contract; Min commitment; Upload usage via CSV; Override or add to existing usage |
| **Invoices** | Create: Customer, date, due, terms, PO, memo, products; Status flow: Unbilled → Unpaid → Paid; Actions: Send, Mark as sent, Receive payment, Download PDF; Billing period editable on contract for contract invoices |
| **Credit Memos** | Standalone or linked to invoice; Status: Unpaid, Applied, Refunded; Apply to invoice (credit < invoice total); Refund flow: CM → match payment in cash recon |
| **Auto-Pay** | Timing: Sent date, Invoice date, or Due date; Per-customer toggle; 3 retry attempts (0h, +1h, +24h) before disabling |
| **Overpayment** | Customer Overpayment liability account + Overpayment product; Match & Adjust in cash recon |
| **Bad Debt** | Create Non-Revenue "Bad Debt" product; Create credit memo from invoice, change product to Bad Debt |

### 2.3 Accounts Payable

| Entity | Business Rules & Workflows |
|--------|---------------------------|
| **Vendors** | Name, point person, email, address, country/city/state/zip, tax ID, 1099-eligible; Payment method (Bank, Credit, Debit); Payment terms; Default Account, Department, Customer Segment |
| **Bills** | Create with vendor, date, terms; Line items: GL account, amount; Service period for prepaids; Fixed asset: Useful life, In Service Date, Asset ID |
| **Prepaids** | Auto-include if service period > 1 day; Amortization: Daily or Even Period (first/last prorated); Prepaid Schedule in Reporting > Close Reports; Link Expense GL → Prepaid Account in COA |
| **Prepaid Adjustments** | Edit schedule per line; Delete line items; Closed periods grayed out |
| **Charges** | From integrations (Ramp, Brex, Expensify); Match to bank feed |
| **Bill Credit** | Reduce asset value; Auto-adjust depreciation |

### 2.4 Cash Reconciliation

| Feature | Business Rules |
|---------|----------------|
| **Matching** | One-to-one: select bank tx → select Rillet tx → Match; One-to-many: match multiple Rillet txs to one bank tx; Match & Adjust for fees/differences |
| **Multi Currency Match** | For FX bills: direct one-to-one match in Cash Recon using Multi Currency Match button |
| **Quick Entry** | Create JE from unmatched bank tx; Payer type, Vendor, Account; Create and Match |
| **Transfer** | Bank-to-bank; select both sides, Create Transfer and Match |
| **Unmatch** | Undo match or delete Quick Entry |

### 2.5 Close Management

| Feature | Business Rules |
|---------|----------------|
| **Checklist** | Add task (name); Assign owner; Set due date; Attach files (paper clip); Mark complete; Copy & Create New Month: due dates +1 month, tasks reset, attachments not carried |
| **Account Register** | Journal entries list; Cmd/Ctrl+K for New JE |
| **Fixed Assets** | List under Close Management; Dispose: Sale date, Sale value, Tax |
| **Closing the Books** | Close Books locks period; Reopen (Admin only) |

### 2.6 General Accounting

| Feature | Business Rules |
|---------|----------------|
| **Journal Entry** | Name, Date, optional Reversal date, optional Attachment URL, optional Customer/Vendor; Lines: Account, Debit, Credit, Description, Department |
| **Upload JE** | CSV template: Date, JE Name, Debit, Credit, Currency, Account #/Name, Description, Vendor/Customer, Reversal Date, Field {field_name} |
| **Reversing JE** | Set Reversal Date; auto-creates opposite entry next period; Edit original updates reversal |
| **JE Approvals** | Filter Pending Approval in General Ledger report; Approve or Delete; Creator cannot approve |
| **VAT** | Exclusive (net + VAT) or Inclusive (total includes VAT); On invoices, contracts, quick entries, JEs |
| **COA** | Deactivate (not delete) for audit trail; Parent groupings in Balance Sheet |

### 2.7 Onboarding

| Feature | Business Rules |
|---------|----------------|
| **Opening Balance Adjustments** | P&L Impact (DR Revenue CR Deferred Rev) or Direct Retained Earnings; Causes: rev rec change, prepaid change, stale AR credits |
| **System Implementation Reversals** | Auto-reverse JEs before go-live date; migration reversal entries; grouped by vendor/customer; net-neutral |
| **Prepaids with Ramp** | Prepaid Clearing (GL Other Current Asset) or Direct Expense; add service period in Rillet |
| **Match multiple invoices to one bank tx** | If totals match → multi-match; else Receive Payment on each first, then match |

### 2.8 Multi-Entity

| Feature | Business Rules |
|---------|----------------|
| **Subsidiary** | New subsidiary creation may require support (Rillet: contact support); Profile: Logo (1MB, 128×128, png/jpg), Legal Entity Name, Trade Name, Address, Country, City, State, Zip, Tax ID, Timezone, Local Currency; Accounting: Due From (Receivable), Due To (Payable); Invoicing: Bank Name, Account #, Routing, Swift, Payment terms, Show bank on invoices |
| **Consolidation** | Real-time (no "run"); Default = consolidated in org currency; Transaction detail: Subsidiary, Debit/Credit Local, Debit/Credit Reporting |
| **FX Translation** | IS = Monthly Average; BS = EOM; Equity = Historical; Intercompany = Historical; Retained Earnings: NI per month = Monthly Avg, manual adj = Historical; CTA in Equity |
| **Report by Subsidiary** | Customize > Columns > Breakdown > Subsidiaries; Single entity: Customize > Select subsidiary |
| **Intercompany Account** | Toggle in Add Account form; Icon on COA |
| **Intercompany Entry** | Close Management > Intercompany; Name, Date, Currency; From/To lines: Subsidiary, Amount, Account; Preview Entry before Create |
| **Intercompany Mgmt Fee** | Same as IC Entry; From = fee revenue, To = fee expense + Due From/To |

### 2.9 Foreign Currency

| Feature | Business Rules |
|---------|----------------|
| **FX Setup** | Org Settings > Accounting > Multi-currency; Enable toggle; AP/AR Revaluation Start Date (optional); Realized FX G/L; Unrealized FX G/L; AR Revaluation (BS); AP Revaluation (BS); Create Default FX Accounts; Create Default CTA |
| **FX Rates** | Open Exchange Rates (openexchangerates.org) for daily rates |
| **Bills in FX** | Currency selector on Create Bill; Edit Rate to override; JEs in base currency |
| **Bill Credits in FX** | Same currency as original bill; Credit amount ≤ Amount Due |
| **Bill Payments in FX** | **Simple**: One-to-one in Cash Recon → Multi Currency Match; **Complex**: Pay Expense on bill first (amount, date, account) → then Match in Cash Recon; Payment posts unrealized → realized |
| **Unrealized/Realized on Bill** | Visible bottom-right of bill; GL Impact shows JEs; Preconditions: multi-currency on, accounts set, bill date ≥ Revaluation Start Date, bill in foreign currency |

### 2.10 Reporting (Metrics, Budget, Close Reports)

| Feature | Business Rules |
|---------|----------------|
| **Favorites & Pinning** | Star to favorite; Pin to Launchpad (max 5 reports) |
| **Report Settings** | Org Settings > Reporting: Recurring Revenue (MRR/ARR default, ignore $0); Categories; CAC (By Account or By Field); SaaS P&L field; Operating Expenses (S&M, R&D, G&A); Cost of Revenue; Aging start dates |
| **Budget vs Actuals** | Group by Account/Vendor/Department/Field; Budgeted vs Other Vendors; Upload CSV (Account, Vendor, Department, Monthly amounts, custom fields); Replace on matching keys |
| **ARR/MRR** | Count to MRR/ARR; MRR = Value/Months, ARR = MRR×12; Classifications: New Sales, Churn, Expansion, Contraction, Reactivation, Usage Impact, FX Impact |
| **ARR Overrides** | Contract override (Amount, dates) or Standalone; Rollforward view; Manual Overrides section; Delete standalone override |
| **CAC** | By Field (e.g. Dept) or By Account (OE–S&M subtype) |
| **Gross Burn** | JE: Credit Bank/Credit Card, Debit ≠ AR, Other Current Asset, Revenue, Equity, etc. |
| **Cash Revenues** | Debit Bank; Credit AR, Revenue, Customer Deposits, etc.; Match & Adjust and FX rules apply |
| **Net Burn** | Gross Burn − Cash Revenues |
| **NRR** | Retained ARR / Opening ARR; Interval (Month/T12M); Filter by Field |
| **Cash Runway** | Cash Balance / Avg Net Burn (90 days); actual bank balance |
| **1099** | Vendor 1099-Eligible + Tax ID; Cash or Accrual; excludes credit card |
| **Sales Tax** | Country, State, Transaction #, Date, Pre-Tax, Tax, Total; incomplete address highlighted |
| **VAT** | Revenue (invoices, CMs) and Expense transactions grouped |

### 2.11 Integrations (Detailed)

| Integration | Access | Sync | Key Mappings / Notes |
|-------------|--------|------|----------------------|
| **Plaid** | Org Settings > Banks | Bank transactions | 2FA may require re-auth |
| **Brex** | Integrations > Brex > Connect | Charges, vendors | 4 steps: (1) Sync from + Credit card account, (2) Category → GL, (3) Department, (4) Location; Connect Brex as bank separately |
| **Ramp** | Integrations > Ramp | Charges, bills, reimbursements, card payments; hourly | Sync from, Ramp entity (multi), Reimbursement vendor (vendor vs employee), Credit card account, Reimbursement account, Mileage vendor/account; Ramp must be disconnected from prior accounting system; Syncs GL, Fields, Vendors back to Ramp |
| **Expensify** | Integrations > Expensify | Charges, reimbursements when Approved/Reimbursed; hourly | User ID + secret; Charges Liability, Reimbursement Liability; Categories → GL; Fields must be Type=Dropdown (text/date not synced); Per-policy Field sets; Auto-creates vendors |
| **Float** | Integrations > Float | — | Sync from; Choose existing or Create new Float account |
| **Stripe** | Integrations > Stripe | Customers, Subscriptions (<1 min), Invoices (seconds); Stripe Bank Feed | Accounts: Balance, Payment, Fees (Expense/Revenue), Application Fees; CRM collaboration: Import Contracts/Products/Customers; Subscriptions: Sync on, Prevent zero invoices, Sync from, Update customer profile; Sync invoice when paid (optional); Autopay: Billing Portal (Customer Info, Payment Methods on; Cancellation, Subscriptions off); 3 retry (0h, +1h, +24h) |
| **Rippling** | Rippling App Shop > Rillet | Payroll JEs when finalized | SSO login; Sync from, Payroll liability; Dept mapping (all required); Pay type: Liability Default, Expense Default, Dept overrides; Employee allocation optional; Match payroll payments via Quick Entry |
| **Gusto** | Integrations > Gusto | Same as Rippling | Same mapping structure; Admin for connect, any Admin for mapping |
| **HubSpot** | Integrations > HubSpot | Deals (Closed Won) every 30 min | Sync from, Revenue account, Default product, Deal start/end field names; Companies=Customers, Products=Products, Deals=Contracts, Line items=Contract line items; Pending Approval; Confirm contract to impact financials |
| **Salesforce** | Integrations > Salesforce | Opps (Closed Won) every 30 min | Same as HubSpot; Pending Review (Salesforce); Bi-dir: Rillet Invoice, Rillet Contract, Rillet Customer → SF custom objects; Managed package install; Account layout related lists |
| **Anrok** | Integrations > Anrok | Tax on invoices (after sync date) | API key, Sync from; Product ID mapping (match Rillet products to Anrok IDs); Tax code for min commitments |
| **Avalara** | Integrations > Avalara | Tax calculation | Env, Account #, License key; Sync from; Document Recording/Committing; Commit Invoices to AvaTax (date, batch commit); Uncommitted vs Committed; Committed = no edit |
| **FP&A (Snowflake)** | Snowflake Private Listing | GL + CoA tables; hourly | Abacum, Aleph, Covariance, Drivetrain, Runway; Accept listing in Snowflake Data Products; Optional: FX rates, Trial Balance (CTA); Same-region ~1–2h, cross-region ~2–3h lag |

---

## 3. Prioritized Screen List (Expanded)

### Phase 0: Foundation (Weeks 1–3)

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 0.1 | App shell | Global | Sidebar (collapse), header, company logo bottom-left, routing |
| 0.2 | Organization selector | — | Company logo click → switch entity |
| 0.3 | Launchpad | `/` | + Add Metric (6 max, drag to reorder): ARR, Outstanding AR, Outstanding AP, Overdue AR, Gross Burn, Cash Balance, Runway, Net Burn, NRR; Workflow snapshot (links); Reports (+ Add); Tech Stack Monitoring |
| 0.4 | User Preferences | Via org icon | Edit name; Appearance: date format, light/dark |
| 0.5 | Design tokens | `src/design-system/` | Dark theme, accent purple |
| 0.6 | Base components | `src/components/` | Button, Input, Select, Table, Tabs, StatusDot, Modal, Stepper |

### Phase 1: Organization Settings (Weeks 4–5)

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 1.1 | Org Settings home | `/settings` | Sidebar: Banks, Chart of Accounts, Fields, Members & Roles, Invoices, Accounting, Integrations |
| 1.2 | Banks | `/settings/banks` | List connected; + Add Institution Connection; Plaid flow (phone, bank search, login) |
| 1.3 | Chart of Accounts | `/settings/chart-of-accounts` | List; + Add Account (Number, Name, Type, Subtype, Parent, Prepaid link, Bank link); Deactivate; Manage groupings |
| 1.4 | Fields | `/settings/fields` | + Add Field; Values, Rules (Mandatory), Show as (Standalone/Free tagging) |
| 1.5 | Members & Roles | `/settings/members` | List; Edit role (Admin/Accountant); Archive |
| 1.6 | Invoices > Communications | `/settings/invoices` | Payment timing; Custom email; Reminders default |
| 1.7 | Accounting | `/settings/accounting` | Prepaid amortization (Daily/Even Period); Usage min commitment; Fixed asset defaults; Multi-currency; SaaS P&L mapping; Transaction Automation (Quick Entries) |
| 1.8 | Report Settings | `/settings/reporting` | Recurring Revenue, CAC, SaaS P&L, Operating Expenses, Cost of Revenue, Budget Upload |

### Phase 2: Accounts Receivable (Weeks 6–11)

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 2.1 | Customers list | `/ar/customers` | Sortable; + Add Customer; Merge (2 max); Export |
| 2.2 | Add/Edit Customer | `/ar/customers/create`, `/ar/customers/:id` | Full form per docs |
| 2.3 | Products list | `/ar/products` | + Add Product; Edit, Delete, Deactivate |
| 2.4 | Add/Edit Product | `/ar/products/create`, `/ar/products/:id` | Fixed/Usage; Revenue/Non-Revenue; Pricing step |
| 2.5 | Contracts list | `/ar/contracts` | Active / Pending Review tabs; + Add Contract; Actions: Edit, Delete, Amend, End, GL Impact, Upload Usage |
| 2.6 | Create/Edit Contract | `/ar/contracts/create`, `/ar/contracts/:id` | Stepper: General → Products → Invoicing → Revenue → Summary |
| 2.7 | Invoices list | `/ar/invoices` | Status filters; + Add Invoice; Commit to AvaTax (batch by date); Send, Mark sent, Receive payment, Download |
| 2.8 | Create/Edit Invoice | `/ar/invoices/create`, `/ar/invoices/:id` | Split: preview left, form right; Products |
| 2.9 | Credit Memos list | `/ar/credit-memos` | + Add Credit Memo; Apply to invoice |
| 2.10 | Create Credit Memo | `/ar/credit-memos/create` | Customer, optional Invoice, date, products |
| 2.11 | Upload Usage | Modal | CSV template download, Import via CSV |
| 2.12 | GL Impact | Modal/Report | Export XLSX |

### Phase 3: Cash Reconciliation (Weeks 12–13)

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 3.1 | Reconciliation | `/cash/reconciliation` | Account selector; Reconciliation date; Unmatched / Matched tabs |
| 3.2 | Bank Transactions pane | — | List with Sort, Filter; Upload Transactions |
| 3.3 | Rillet Transactions pane | — | Empty state: "Select a transaction"; Quick Entry, Transfer |
| 3.4 | Match UI | Inline | One-to-one, one-to-many; Match & Adjust; Multi Currency Match (for FX) |
| 3.5 | Quick Entry modal | — | Payer, Vendor, Account; Create and Match |

### Phase 4: Accounts Payable (Weeks 14–17)

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 4.1 | Vendors list | `/ap/vendors` | + Add Vendor |
| 4.2 | Add/Edit Vendor | `/ap/vendors/create`, `/ap/vendors/:id` | Full schema |
| 4.3 | Bills list | `/ap/bills` | + Add Bill; Bill Credit, Pay Expense (for FX complex match), Adjust Prepaid Schedule, GL Impact |
| 4.4 | Create/Edit Bill | `/ap/bills/create`, `/ap/bills/:id` | Line items; Service period; Fixed asset fields; Currency selector; Edit Rate (FX) |
| 4.4a | Pay Expense modal | — | Amount, date, account; for FX complex match before cash recon |
| 4.4b | Bill Credit modal | — | Vendor, Bill #, date, account, amount (≤ due); same currency as original |
| 4.5 | Charges list | `/ap/charges` | From integrations |
| 4.6 | Prepaid Schedule | `/reporting/close-reports/prepaid` | By period; Prepaid balance as of |

### Phase 5: Close Management & General Accounting (Weeks 18–21)

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 5.1 | Close Checklist | `/close/checklist` | Add task; Edit (owner, due date); Attach files; Mark complete; Copy & Create New Month; Close Books |
| 5.2 | Account Register | `/close/account-register` | JE list; + Add JE; Cmd/Ctrl+K |
| 5.3 | Create/Edit Journal Entry | `/close/journal-entries/create` | Header + lines; Reversal date; Attach files; Upload JE |
| 5.4 | General Ledger report | `/reporting/close-reports/gl` | Filter Pending Approval; Approve JE |
| 5.5 | Fixed Assets list | `/close/fixed-assets` | Dispose |
| 5.6 | Fixed Asset Disposal | Modal | Sale date, value, tax |

### Phase 6: Reporting (Weeks 22–24)

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 6.1 | Reports hub | `/reporting` | Favorites (star), Pinning (max 5); Income Statement, Balance Sheet, Cash Flow, SaaS P&L, AR Aging, AP Aging, Revenue by Customer, Budget vs Actuals, Data Lab, MRR/ARR, ARR Waterfall |
| 6.2 | Income Statement | `/reporting/income-statement` | Customize: Columns (Monthly, Quarterly, Total, Subsidiaries, Fields); Variance Analysis; Formatting; Grouping |
| 6.3 | Balance Sheet | `/reporting/balance-sheet` | Parent groupings; Expand/collapse |
| 6.4 | Cash Flow | `/reporting/cash-flow` | |
| 6.5 | Executive P&L | `/reporting/executive-pl` | Field selection; Operating Expenses (S&M, R&D, G&A); Cost of Revenue |
| 6.6 | SaaS P&L | `/reporting/saas-pl` | By Department |
| 6.7 | AR Aging | `/reporting/ar-aging` | |
| 6.8 | AP Aging | `/reporting/ap-aging` | |
| 6.9 | Budget vs Actuals | `/reporting/budget-vs-actuals` | Group by Account/Vendor/Department/Field; Actual, Budget, Variance, %; Upload budget CSV |
| 6.10 | MRR/ARR by Contract Type | `/reporting/mrr-arr` | Filters: stages, departments |
| 6.11 | ARR/CARR Waterfall | `/reporting/arr-waterfall` | Rollforward view; ARR Overrides (contract or standalone); Manual Overrides section |
| 6.12 | Data Lab | `/reporting/data-lab` | Transaction Type; Filters; Data Grouping |
| 6.13 | 1099 Report | `/reporting/close-reports/1099` | Cash vs Accrual; excludes credit card |
| 6.14 | Sales Tax Report | `/reporting/close-reports/sales-tax` | Country, State, Transaction #, Date, Pre-Tax, Tax, Total; Export |
| 6.15 | VAT Report | `/reporting/close-reports/vat` | Revenue and Expense transactions |
| 6.16 | Prepaid Schedule | `/reporting/close-reports/prepaid` | Selected period, Balance as of |

### Phase 7: Multi-Entity & FX (Weeks 25–27)

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 7.1 | Subsidiaries list | `/settings/subsidiaries` | Select entity → Entity details |
| 7.2 | Subsidiary Entity Details | `/settings/subsidiaries/:id` | Profile (logo, name, address, tax ID, timezone, currency); Accounting (Due From/To); Invoicing (bank, terms) |
| 7.3 | Intercompany | `/close/intercompany` | + Add Intercompany Entry; From/To lines, Account, Amount; Preview Entry |
| 7.4 | FX Setup | `/settings/accounting` | Multi-currency; Revaluation start dates; Realized/Unrealized/AR/AP Revaluation/CTA accounts; Create Default FX |
| 7.5 | Bills/Invoices in FX | — | Currency selector; Edit Rate override; Unrealized/Realized display (bottom-right, GL Impact) |
| 7.6 | Multi Currency Match | Cash Recon | Button for FX one-to-one match |
| 7.7 | Pay Expense (FX) | Bill detail | Amount, date, account for complex FX match |

### Phase 8: Integrations (Weeks 28–30)

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 8.1 | Integrations list | `/settings/integrations` | By category: Banks, AP, Payroll, CRM, Tax |
| 8.2 | Stripe setup | — | GL mappings; Subscriptions; Sync from |
| 8.3 | Ramp / Brex | — | Sync from, Liability accounts, Category/Dept mapping |
| 8.4 | HubSpot / Salesforce | — | Sync from, Default product, Start/End date fields |
| 8.5 | Rippling / Gusto | — | Dept mapping, Pay type allocations |
| 8.6 | Avalara / Anrok | — | Credentials; Product IDs |

### Phase 9: Aura AI (P2, Weeks 31–32)

| # | Screen | Route | Notes |
|---|--------|-------|-------|
| 9.1 | AI Assistant panel | Sidebar icon | Suggested queries; Natural language input; Table/list results |
| 9.2 | Prompt examples | — | Documentation / help |

---

## 4. Information Architecture (Full)

```
Maximor ERP
├── Launchpad
├── Cash Reconciliation
│   └── Reconciliation workbench (Bank | Rillet panes)
├── Accounts Receivable
│   ├── Customers
│   ├── Products
│   ├── Contracts
│   ├── Invoices
│   └── Credit Memos
├── Accounts Payable
│   ├── Vendors
│   ├── Bills
│   └── Charges
├── Close Management
│   ├── Checklist
│   ├── Account Register (Journal Entries)
│   ├── Fixed Assets
│   └── Intercompany
├── Reporting
│   ├── Income Statement
│   ├── Balance Sheet
│   ├── Cash Flow
│   ├── SaaS P&L
│   ├── AR Aging
│   ├── AP Aging
│   └── Close Reports (GL, Prepaid Schedule)
└── Organization Settings (via company icon)
    ├── Banks
    ├── Chart of Accounts
    ├── Fields
    ├── Members & Roles
    ├── Subsidiaries
    ├── Invoices (Communications)
    ├── Accounting
    └── Integrations
```

---

## 5. Implementation Order Summary (Revised)

| Phase | Focus | Screens | Est. Weeks |
|-------|-------|---------|------------|
| **0** | Foundation | 6 | 3 |
| **1** | Org Settings | 8 | 2 |
| **2** | AR | 12 | 6 |
| **3** | Cash | 5 | 2 |
| **4** | AP | 6 | 4 |
| **5** | Close + GL | 6 | 4 |
| **6** | Reporting | 16 | 4 |
| **7** | Multi-Entity + FX | 4 | 3 |
| **8** | Integrations | 6 | 3 |
| **9** | Aura AI (P2) | 2 | 2 |
| **Total** | | **~64 screens** | **~33 weeks** |

---

## 6. Technical Approach (Unchanged)

- **Stack**: React + TypeScript, Tailwind, TanStack Table/Query, React Hook Form + Zod
- **Backend**: Node/Next.js API, PostgreSQL
- **Auth**: SSO-ready (Clerk/Auth0/Supabase)
- **Integrations**: Plaid, Stripe, etc. per vendor SDKs

---

## 7. Next Actions

1. **Confirm MVP scope** — Reduce phases 7–9 for initial release if needed.
2. **Prioritize integrations** — Start with Plaid + Stripe; defer Ramp/Brex/CRM.
3. **Set up project** — Initialize repo, design tokens, shell, Launchpad.
4. **Build AR** — Customers → Products → Contracts → Invoices (core contract-to-cash).

---

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

### Workflow Snapshot Links
Cash Transactions to be reconciled | Journal entries pending approval | Invoices to be sent | Bills to be paid | Contracts to be reviewed | Last closed month

---

## Appendix B: Foreign Currency & Multi-Entity Details

### FX Translation Rules (Consolidation)
| Account Type | Rate Used |
|--------------|-----------|
| Income Statement | Monthly Average |
| Balance Sheet | End of Month |
| Equity | Historical |
| Intercompany | Historical |
| Retained Earnings (NI) | Monthly Average per month |
| Retained Earnings (manual adj) | Historical |
| **Result** | CTA in Equity |

### Subsidiary Profile Fields
Logo (1MB, 128×128, png/jpg) | Legal Entity Name | Trade Name | Address Line 1–2 | Country | City | State | Zip | Tax ID | Timezone | Local Currency

### Subsidiary Accounting
Due From (Receivable, asset) | Due To (Payable, liability)

### Subsidiary Invoicing
Bank Name, Account Number, Routing Number, Bank Address | Swift Code (intl) | Default Payment Terms | Payment Instructions | Show Bank Details on Invoices | Enable online payments (Stripe)

### Unrealized FX Troubleshooting Checklist
- Multi-currency enabled
- Unrealized G/L, Realized G/L, Revaluation accounts selected
- Bill/Invoice date ≥ Revaluation Start Date
- Original transaction in foreign currency

### Salesforce Bi-Directional Sync Objects (Rillet → SF)
| Object | Key Fields |
|--------|------------|
| **Rillet Invoice** | Salesforce_Account__c, Invoice_Number__c, Invoice_Date__c, Invoice_Due_Date__c, Status__c, Total_Amount__c, Amount_Due__c, Rillet_Customer__c, Rillet_Contract__c, Rillet_Invoice_URL__c |
| **Rillet Contract** | Salesforce_Opportunity__c, Salesforce_Account__c, Start_Date__c, End_Date__c, Rillet_Customer__c, Rillet_Contract_URL__c, Committed__ARR__c, Committed_MRR__c |
| **Rillet Customer** | Salesforce Account Lookup, Rillet URL, Rillet ID, Current ARR, Current MRR, Current Committed ARR/MRR |

### FP&A Snowflake Share (GL + CoA)

**GL table:** ID, JOURNAL_ENTRY_ID, DATE, DESCRIPTION, CUSTOMER_ID, CUSTOMER_NAME, VENDOR_ID, VENDOR_NAME, DEBIT_AMOUNT, CREDIT_AMOUNT, CURRENCY, ACCOUNT_ID, ACCOUNT_CODE, ACCOUNT_NAME, ORGANIZATION_NAME, SUBSIDIARY_ID, SUBSIDIARY_NAME, custom fields  
**CoA table:** ID, ORGANIZATION_NAME, CODE, NAME, CATEGORY, SUBTYPE  
**Optional:** FX rates, Trial Balance (CTA)

---

*Plan version: 2.2 | Based on Briq-Rillet Product Documentation (multiple docs) + FP&A, Reporting, Onboarding supplement*

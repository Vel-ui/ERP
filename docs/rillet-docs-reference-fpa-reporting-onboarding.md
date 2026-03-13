# Rillet Product Documentation — Reference (Supplement)
## FP&A Integrations, Settings, Reporting, Metrics, Onboarding

> Raw reference from additional Briq-Rillet Product Documentation. Use for implementation reference.  
> See also: `rillet-docs-reference-fc-multientity-integrations.md` · `MAXIMOR-ERP-IMPLEMENTATION-PLAN.md`

---

## 1. FP&A Integrations via Snowflake

**Supported platforms:** Abacum, Aleph, Covariance, Drivetrain, Runway

### Overview
- Rillet shares data via Snowflake Private Listing
- Same-region or cross-region; Snowflake manages replication
- Accept listing: Snowflake → Data Products → Private Sharing → Accept listing

### GL Table Schema
| Field | Type |
|-------|------|
| ID | Varchar |
| JOURNAL_ENTRY_ID | Varchar |
| DATE | Date |
| DESCRIPTION | Varchar |
| CUSTOMER_ID, CUSTOMER_NAME | Varchar |
| VENDOR_ID, VENDOR_NAME | Varchar |
| DEBIT_AMOUNT, CREDIT_AMOUNT | Number |
| CURRENCY | Varchar |
| ACCOUNT_ID, ACCOUNT_CODE, ACCOUNT_NAME | Varchar |
| ORGANIZATION_NAME | Varchar |
| SUBSIDIARY_ID, SUBSIDIARY_NAME | Varchar |
| Custom fields | As additional columns |

### Chart of Accounts Table
| Field | Type |
|-------|------|
| ID, ORGANIZATION_NAME, CODE, NAME | Varchar |
| CATEGORY, SUBTYPE | Varchar |

**Optional on request:** FX rates, Trial Balance (including CTA)

### Sync
- Hourly refresh by Rillet
- Same-region: ~1–2 hours; Cross-region: ~2–3 hours
- No manual refresh; shared view always latest

### Authentication
- Connect to org’s Snowflake or FP&A platform’s Snowflake
- Tell Rillet team preferred destination and account identifiers

---

## 2. Settings & Config

### Microsoft SSO
1. Log in (Email, Rippling, Google, OTP)
2. User Preferences → Connect with Microsoft
3. Logout → Sign in with Microsoft

### Custom Fields
- **Use cases:** Departments, Customer Segments, Project/Event tracking
- **Values + Rules:** Mandatory toggle; Display: Standalone or Free tagging
- **Reporting:** Income Statement, MRR/ARR, ARR/CARR Waterfall, Data Lab

**Viewing in Income Statement:** Customize → Columns → Breakdown (Monthly, Quarterly, Department, etc.)

**Viewing in MRR/ARR by Contract Type:** Filters → stages, departments

**Viewing in Data Lab:** Transaction Type dropdown; Filters; Data Grouping (Field > Stage, Department, Location)

**Viewing in ARR/CARR Waterfall:** Filters → stages, departments

### User Roles
- **Members:** Anyone with access
- **Roles:** Admin (full); Accountant (no delete, no org settings edit)
- Add Member: + Add Member → Name, Email, Role
- Edit role: three-dot menu

### Transaction Automation
- Org Settings > Accounting > Automation
- **Quick Entries for Expenses:** Auto-create reconciliation quick entries for existing vendors

---

## 3. Reporting Overview

### Favorites
- Star icon next to report name
- Message: “Report has been added to favorites section”

### Pinning
- Pin icon; max 5 reports on Launchpad
- Message: “Report pinned to the Launchpad. You have X reports left to pin.”

### Report Settings (Org Settings > Reporting)
| Section | Settings |
|---------|----------|
| **Recurring Revenue** | Default View (MRR/ARR); Ignore $0 invoices |
| **Categories** | Enable custom category; Category Name |
| **CAC Calculation** | Method: By Account (OE–S&M subtype) or By Field (e.g. Department) |
| **SaaS P&L** | Field selection (enables Operating Expenses, Cost of Revenue) |
| **Operating Expenses** | Sales & Marketing, R&D, G&A; + Add Category |
| **Cost of Revenue** | Product, Consumption Revenue, Consumption Commitment |
| **Aging Reports** | AP/AR Reconciliation Start Date |

---

## 4. Budget vs Actuals

- Compare planned vs actual; variance, %
- **Group by:** Account, Vendor, Department, Custom Field

### Vendor Grouping
- **Budgeted Vendors:** In budget file → individual rows
- **Other Vendors:** Not in budget → grouped
- **Miscellaneous Vendors:** Real vendors not in budget
- **No Vendor:** Vendor field blank
- **No Department:** Department field blank

**Tip:** Include vendor in budget with $0 to avoid “Other Vendors”

### Upload
- Org Settings > Reporting > Budget Upload
- **Template:** Account, Vendor, Field Department, Monthly Amounts (Jan–Dec), Field {field_name}
- Custom fields from Settings > Custom Fields appear in template
- Upload CSV (Drag & Drop or Select file)
- **Replace logic:** Key fields (Vendor, Account, Department, custom fields) must match for update; otherwise treated as new row

### Fix Errors
- Error summary card → Click for full report (line #, field, explanation)
- Export invalid rows
- Fix file, re-upload

---

## 5. Metrics (Detailed)

### ARR/MRR Calculation
- **Inputs:** Contracts, Invoices, Credit Memos, Overrides
- **Product:** Count to MRR/ARR = true; Product Dates; Product Amount
- **Formulas:** MRR = Line Item Value / # Months; ARR = MRR × 12

### ARR Classifications
| Type | Conditions |
|------|------------|
| New Sales | Prior RR = $0, Current > $0 |
| Churn | Prior > $0, Current = $0 |
| Expansion | Prior > $0, Current > Prior |
| Contraction | Prior > $0, Current > 0, Current < Prior |
| Reactivation | Prior = $0, Current > $0 (existing customer) |
| Usage Impact | Usage overage change month-over-month |
| FX Impact | Separate category for FX rate changes |

### ARR Overrides
- **Use:** Delay churn (renewal talks), mark churned before end date
- **Methods:** Contract override (edit Amount, Close/Start/End dates) or Standalone Override
- **Where:** ARR/CARR Waterfall → Rollforward view
- **Visibility:** Blue dot on overridden amounts; Manual Overrides section
- **Delete standalone:** Rollforward → Manual Overrides → Delete icon

### CAC
- Marketing + Sales + tools + overhead
- **By Field:** e.g. Sales, Marketing, SDR departments
- **By Account:** GL Subtype = Operating Expense – Sales & Marketing

### Gross Burn
- JEs where: Credit = Bank or Credit Card; Debit ≠ AR, Other Current Asset, Other Assets, Revenue, Non Operating Income, Customer Deposits, Equity, Bank, Credit Card

### Cash Revenues
- Debit = Bank or Credit Card; Credit = AR, Other Current Asset, Other Assets, Revenue, Non Operating Income, Customer Deposits
- **Rules:** If Bank < Revenue → Cash Revenue = Bank amount; If Revenue ≤ Bank → Cash Revenue = Revenue
- Excludes: transfers, equity financing

### Net Burn
- Net Burn = Gross Burn − Cash Revenues

### NRR
- NRR = Retained ARR / Opening ARR
- **Config:** MRR/ARR toggle; Interval (Month or T12M); Filter by Field value

### Cash Runway
- Cash Runway = Cash Balance / Avg Net Burn (last 90 days)
- Cash Balance = actual bank balance (may differ from GL due to reconciling adjustments)
- Funding inflows to equity excluded from Net Burn; impacts Cash Balance only

---

## 6. Close Reports

### 1099 Report
- Tag vendors: Vendor profile → 1099-Eligible, Tax ID
- **Methods:** Cash (cash payments) or Accrual (Bills, Charges, Quick Entries)
- **Excludes:** Credit card transactions (reported by card company)

### Sales Tax Report
- Country, State, Transaction #, Date, Pre-Tax, Tax, Total
- Period: YTD, LYTD, Last Quarter
- Export; incomplete address highlighted

### VAT Report
- Revenue: Invoices, Credit Memos (Net, VAT rate, VAT amount, Total)
- Expense: Grouped by category, same breakdown

---

## 7. Financial Statements Customization

### Income Statement
- **Columns:** Breakdown (Monthly, Quarterly, Total, Subsidiaries, Custom Fields)
- **Variance Analysis:** If Total selected → Previous Year or Preceding Period; % and/or $
- **Formatting:** Account Numbers, Subgroup Totals, Exclude Zero Balance, Show Total Column
- **Number Format:** Drop Decimals, Show in Thousands, Currency Symbol
- **Negative Numbers:** Display options
- **Grouping:** Create groups; Enter Group Name
- **Save:** Save Report As, Save Changes, Exit Edit Mode

### Executive P&L
- Field selection enables Operating Expenses, Cost of Revenue
- **Operating Expenses:** S&M, R&D, G&A; + Add Category
- **Cost of Revenue:** Product, Consumption Revenue, Consumption Commitment

---

## 8. Onboarding

### Salesforce API
- Setup > Profiles > Edit > System Permissions > API Enabled

### Customer System Change Template
- Subject: Important Update: Billing System Change
- Include: Date, new billing email, no action needed, contact

### Opening Balance Adjustments
- **Causes:** Rev rec methodology change, prepaid methodology, stale AR credits, prior rev rec errors
- **Methods:** P&L Impact (DR Revenue CR Deferred Rev) or Direct Retained Earnings (DR Retained Earnings CR Deferred Rev)
- **Examples:** Rev rec methodology change; removing stale credit from AR

### System Implementation Reversals
- Contract creation → auto JEs; system reverses JEs before go-live date
- **Purpose:** Accuracy; entries prior to go-live reversed
- **Process:** Automated background; migration reversal entries; grouped by vendor/customer
- Net-neutral on financials

### FAQs
- **Prepaids with Ramp:** (1) Prepaid Clearing: GL Subtype = Other Current Asset; classify in Ramp; add service period in Rillet; (2) Direct Expense: classify to expense; add service period in Rillet
- **Mark customer churned:** ARR Overrides; churn when Prior > $0, Current = $0
- **Match multiple invoices to one bank tx:** If totals match → multi-match; if not → Receive Payment on each invoice first, then match in Cash Recon

---

*Source: Briq-Rillet Product Documentation (supplement) | Saved for Maximor implementation reference*

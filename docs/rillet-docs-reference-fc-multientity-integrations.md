# Rillet Product Documentation — Reference
## Foreign Currency, Multi-Entity, Integrations, Cash Reconciliation

> Raw reference from Briq-Rillet Product Documentation (docs 2 & 3). Use for implementation reference.  
> Implementation plan: see `MAXIMOR-ERP-IMPLEMENTATION-PLAN.md`

---

## 1. Foreign Currency

### 1.1 Journal Entries in FX — Unrealized Gains/Losses Troubleshooting

**Where to see gains/losses**
- On the Bill or invoice: Unrealized and Realized Gain/Loss impact in the bottom right corner
- GL Impact: 3-dot menu → GL Impact to view journal entries

**Troubleshooting checklist**
- Multi-currency is enabled in the Advanced Settings
- Unrealized G/L, realized G/L, and Revaluation account selected in Accounting Settings
- Bill or Invoice Date is on or after the Revaluation Start Date (Accounting Settings)
- The original bill or invoice is in a foreign currency

---

### 1.2 Create a Bill with FX

1. Go to Accounts Payable > Bills
2. Select + Add Bill
3. Select the relevant currency when entering bill data
4. Click Edit Rate to override FX rate
5. Click Save — bill displays in transaction currency; JEs recorded in org base currency

---

### 1.3 Create Bill Credits with FX

1. Go to AP > Bills, locate bill, click to open
2. Three dots (…) → Bill Credit
3. Bill Credit Form: Vendor (default), Bill # (default), Date, Account (default), Amount (same currency as original; ≤ Amount Due)
4. Click Save

---

### 1.4 Bill Payments with FX

**Simple Matches** (one-to-one)
1. Cash Reconciliation → Select Bank Account
2. Bank Transactions: identify transaction (e.g. -€1,000.00)
3. Rillet Transactions: find matching invoice
4. Click **Multi Currency Match**

**Complex Matches** (partial or multiple)
1. AP > Bills → locate bill → three dots → Pay Expense
2. Pay Expense: Amount, Date, Account (e.g. Euro Bank) → Confirm
3. Go to Cash Reconciliation → Reconciliation Date
4. Bank Transactions: identify bank tx
5. Rillet Transactions: find payment tx
6. Click Match — posts unrealized → realized

---

### 1.5 Set Up FX Accounts (Org Settings > Accounting > Multi-currency)

**Fields**
- AP & AR Revaluation Start Date (optional; not required unless implemented prior to Jan 01 2024)
- Realized FX Gain/Loss
- Unrealized FX Gain/Loss
- Accounts Receivable Revaluation (BS, separate from AR)
- Accounts Payable Revaluation (BS, separate from AP)
- Cumulative Translation Adjustment (CTA)
- Create Default FX Accounts (optional)
- Create Default CTA Account (optional)

**FX rates:** Rillet uses Open Exchange Rates (openexchangerates.org) for daily rates.

---

## 2. Multi-Entity

### 2.1 Subsidiaries

**Create new subsidiary:** Contact Rillet team or support@rillet.com

**Set up subsidiary (Org Settings > Subsidiaries > Entity details)**

**Subsidiary Profile**
- Logo: max 1 MB, min 128×128 px, .png or .jpg
- Legal Entity Name, Trade Name
- Address Line 1–2, Country, City, State, Zip
- Tax ID, Timezone, Local Currency

**Accounting**
- Due From (Receivable) — asset
- Due To (Payable) — liability

**Invoicing**
- Bank Name, Account Number, Routing Number, Bank Address, Swift Code
- Default Payment Terms, Payment Instructions
- Show Bank Details on Invoices
- Enable online payments for new customers (Stripe)
- Hide tax details if total tax = $0

---

### 2.2 Consolidation

- Real-time; no "run" at month-end
- Default: consolidated in org currency
- Transaction detail: Subsidiary, Debit/Credit Local, Debit/Credit Reporting

**FX Translation**
- Income Statement: Monthly Average
- Balance Sheet: End of Month
- Equity: Historical
- Intercompany: Historical
- Retained Earnings: NI = Monthly Avg; manual adj = Historical
- CTA in Equity

**Breakdown by subsidiary:** Reporting → Financial Statement → Customize → Columns > Breakdown > Subsidiaries

**Single entity:** Customize → Select subsidiary

---

### 2.3 Intercompany

**Create Intercompany Account**
- Org Settings > Chart of Accounts > + Add Account
- Complete: Number, Name, Type, Subtype, Parent Grouping
- Toggle **Intercompany**
- Icon on COA

**Create Intercompany Entry**
- Close Management > Intercompany > + Add Intercompany Entry
- Name, Date, Currency, optional Customer/Vendor, Attachment URL, Attach Files
- Entry lines: From/To (entity), Amount, Account, Description
- + Add Lines for more
- Create Entry

**Intercompany Management Fee**
- Same as IC entry; From = fee revenue, To = fee expense + Due From/To
- Example: Monsters Europe charges US $20K, UK $15K; From: Management Fee Revenue, To: Management Fee

---

## 3. Integrations

### 3.1 Access
- Company icon lower-left → Organization Settings → Integrations
- Or Launchpad → Browse Integration
- Connected integrations in Tech Stack Monitoring

### 3.2 Brex
- Connect → 4 steps: (1) Sync from + Credit card account, (2) Category → GL, (3) Department, (4) Location
- Connect Brex as bank (Banks tab)
- Vendors and charges sync automatically

### 3.3 Expensify
- **Fields:** Type = Dropdown only (text/date not synced); create after disconnecting from previous ERP
- Connect: User ID + secret, start date
- Mapping: General (Charges Liability, Reimbursement Liability), Dept (optional), Category, Additional Fields
- Per-policy Field sets
- Sync: Approved or Reimbursed reports; hourly; auto-creates vendors

### 3.4 Float
- Sync Data from; Choose existing account or Create new Float account
- Save changes

### 3.5 Ramp
- **Prerequisite:** Ramp disconnected from prior accounting system
- Setup: Sync from, Ramp entity (multi), Reimbursement vendor (vendor vs employee), Credit card account, Reimbursement account, Mileage vendor/account
- Syncs back to Ramp: GL, Custom Fields, Vendors
- Sync: hourly; Charges (Ready to Sync), Bills (Approved for Payment), Reimbursements, Card payments
- Ramp FAQs: one-time sync; Ramp changes reflected on next sync; receipts/memos attached; auto-creates vendors

### 3.6 Cash Reconciliation — Matching
- One-to-one: Select bank tx → select Rillet tx → Match
- Quick Entry: No existing tx → Payer type, Vendor, Account → Create and Match
- One-to-many: Match multiple Rillet txs to one bank tx
- Match & Adjust: For fees/differences
- Unmatch: Undo or delete Quick Entry

### 3.7 Rippling
- Connect via Rippling App Shop
- SSO login
- Mapping: Sync from, Payroll liability; Dept (all required); Pay type allocations (Liability Default, Expense Default, Dept overrides); Employee allocation (optional)
- JEs on finalized payroll
- Match payroll payments: Quick Entry to Payroll Liability
- Reauth: Uninstall → reinstall in Rippling

### 3.8 Gusto
- Same structure as Rippling; Admin for connect, any Admin for mapping

### 3.9 Stripe
**Accounts:** Balance, Payment, Fees (Expense/Revenue), Application Fees
**CRM Collaboration:** Import Contracts/Products/Customers; Connect to Salesforce metadata
**Subscriptions:** Sync on, Prevent zero invoices, Sync from, Update customer profile
**Sync invoice when paid:** Optional; threshold; applies to future only
**Autopay:** Billing Portal (Customer Info, Payment Methods on; Cancellation, Subscriptions off)
**3 retry:** 0h, +1h, +24h
**Stripe Bank Feed:** Invoice payments + fees reconciled per tx
**Credit notes:** Applied → CM Applied; Refund → Unpaid → match in Bank Feed; Customer balance → Unpaid
**Voided invoices:** Full CM, VOID + invoice number
**Rev rec:** Billing period from Stripe; product determines pattern/GL

### 3.10 Anrok
- API key, Sync from
- Product ID mapping; tax code for min commitments

### 3.11 Avalara
- Env, Account #, License key; Test Connect; Select company
- Sync from; Document Recording/Committing; Logging
- **Commit Invoices:** AR > Invoices → Commit to AvaTax → date → Commit; Uncommitted → Committed; Committed = no edit

### 3.12 HubSpot
- Sync from, Revenue account, Default product, Deal start/end field names
- Companies=Customers, Products=Products, Deals=Contracts, Line Items=Contract line items
- Closed Won; 30 min; Pending Approval; Confirm contract to impact financials

### 3.13 Salesforce
- Same as HubSpot; Pending Review (Salesforce)
- Bi-dir: Rillet Invoice, Rillet Contract, Rillet Customer → SF custom objects
- Managed package: Dev/Sandbox and Prod install URLs
- Account layout: Related lists; Multi-currency in SF for Contract/Invoice currencies
- Optional: Rillet Contract lookup to Order

---

## 4. Salesforce Bi-Directional Sync Objects

**Rillet Invoice:** Salesforce_Account__c, Invoice_Number__c, Invoice_Date__c, Invoice_Due_Date__c, Status__c, Total_Amount__c, Amount_Due__c, Rillet_Customer__c, Rillet_Contract__c, Rillet_Invoice_URL__c, Rillet_Invoice_ID__c

**Rillet Contract:** Salesforce_Opportunity__c, Salesforce_Account__c, Start_Date__c, End_Date__c, Rillet_Customer__c, Rillet_Contract_URL__c, Rillet_Contract_ID__c, Committed__ARR__c, Committed_MRR__c

**Rillet Customer:** Salesforce Account Lookup, Rillet URL, Rillet ID, Current ARR, Current MRR, Current Committed ARR, Current Committed MRR

---

*Source: Briq-Rillet Product Documentation | Saved for Maximor implementation reference*

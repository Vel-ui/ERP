# Maximor ERP — Data Model

> **Version 1.0** | Mar 2026

---

## Overview

This document describes the data model for Maximor ERP. The current prototype uses TypeScript interfaces and mock data defined in `src/lib/mock-data.ts`. The planned production system will use PostgreSQL with an ORM (Prisma or Drizzle).

---

## Current TypeScript Interfaces

### ARCustomer

```typescript
interface ARCustomer {
  id: string;
  companyName: string;
  invoicingName: string;
  email: string;
  ccEmail: string;
  address: string;
  shippingAddress: string;
  paymentTerms: string;         // "Due on Receipt" | "Net 15" | "Net 30" | "Net 45" | "Net 60"
  balance: number;
  status: "Active" | "Inactive";
  notes: string;
  autoReminders: boolean;
  onlinePayments: boolean;
  taxRate: number;
  department: string;
  customerSegment: string;
}
```

### ARProduct

```typescript
interface ARProduct {
  id: string;
  name: string;
  type: "Revenue" | "Non-Revenue";
  revenueType: "Fixed" | "Usage";
  pricing: "Recurring" | "One-time";
  countToMrrArr: boolean;
  status: "Active" | "Inactive";
  revenueAccount: string;
  discountAccount: string;
  revenuePattern: string;       // "Even Period Prorated First & Last" | "Daily"
  usageTierType?: "Standard" | "Graduated" | "Volume";
}
```

### ARContract

```typescript
interface ARContractProduct {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

interface ARContract {
  id: string;
  contractNumber: string;
  customerId: string;
  customerName: string;
  type: "New Sales" | "Existing" | "Expansion" | "Reactivation" | "Contraction";
  startDate: string;            // ISO date
  endDate: string;              // ISO date
  duration: string;
  arr: number;
  status: "Active" | "Pending Review" | "Expired" | "Cancelled";
  autoRenew: boolean;
  products: ARContractProduct[];
  billingFrequency: string;     // "Monthly" | "Quarterly" | "Semi-Annually" | "Annually"
  paymentTerms: string;
  poNumber: string;
}
```

### ARInvoice

```typescript
interface ARInvoiceLineItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface ARInvoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  date: string;                 // ISO date
  dueDate: string;              // ISO date
  amount: number;
  status: "Unbilled" | "Unpaid" | "Paid" | "Overdue";
  lineItems: ARInvoiceLineItem[];
  paymentTerms: string;
  poNumber: string;
  memo: string;
}
```

### ARCreditMemo

```typescript
interface ARCreditMemo {
  id: string;
  cmNumber: string;
  customerId: string;
  customerName: string;
  invoiceId: string | null;
  invoiceNumber: string | null;
  date: string;                 // ISO date
  amount: number;
  status: "Unpaid" | "Applied" | "Refunded";
  lineItems: { productName: string; description: string; amount: number }[];
}
```

### Supporting Types

```typescript
// Chart of Accounts
interface Account {
  id: string;
  number: string;
  name: string;
  type: "Asset" | "Liability" | "Equity" | "Income" | "Expense";
  subtype: string;
  active: boolean;
}

// Custom Fields
interface Field {
  id: string;
  name: string;
  type: "Dropdown" | "Text";
  mandatory: boolean;
  displayAs: "Standalone" | "Free tagging";
  values: string[];
}

// Members
interface Member {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Accountant";
}
```

---

## Entity Relationships

```
Organization (1)
├── Users / Members (many)
├── Chart of Accounts (many)
│   └── Account Subtypes
├── Custom Fields (many)
├── Customers (many)
│   ├── Contracts (many)
│   │   └── Contract Products (many)
│   ├── Invoices (many)
│   │   └── Invoice Line Items (many)
│   └── Credit Memos (many)
├── Vendors (many)
│   ├── Bills (many)
│   │   └── Bill Line Items (many)
│   ├── Charges (many)
│   └── Reimbursements (many)
├── Journal Entries (many)
│   └── JE Lines (many)
├── Assets (many)
│   └── Depreciation Schedules (many)
├── Prepaid Entries (many)
│   └── Amortization Schedules (many)
├── Accrual Entries (many)
├── Bank Accounts (many)
│   └── Bank Transactions (many)
├── Periods (many)
│   ├── Close Checklists (many)
│   └── Reconciliations (many)
├── Workflows (many)
│   └── Approval Steps (many)
├── Integrations (many)
│   └── Sync Logs (many)
└── Subsidiaries (many, for multi-entity)
```

---

## Planned Database Schema (PostgreSQL)

### Core Tables

#### organizations
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Organization name |
| legal_name | VARCHAR(255) | Legal entity name |
| address | JSONB | Structured address |
| timezone | VARCHAR(50) | |
| base_currency | VARCHAR(3) | ISO currency code |
| fiscal_year_start | INTEGER | Month (1-12) |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

#### users
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| organization_id | UUID | FK → organizations |
| email | VARCHAR(255) | Unique per org |
| name | VARCHAR(255) | |
| role | ENUM | 'admin', 'accountant' |
| date_format | VARCHAR(20) | 'MM/DD/YYYY' or 'DD/MM/YYYY' |
| is_active | BOOLEAN | |
| created_at | TIMESTAMP | |

#### accounts (Chart of Accounts)
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| organization_id | UUID | FK → organizations |
| number | VARCHAR(20) | Account number |
| name | VARCHAR(255) | |
| type | ENUM | 'asset', 'liability', 'equity', 'income', 'expense' |
| subtype | VARCHAR(100) | |
| parent_id | UUID | FK → accounts (self-referencing) |
| is_active | BOOLEAN | Deactivate, never delete |
| prepaid_account_id | UUID | FK → accounts (for prepaid link) |
| bank_account_id | UUID | FK → bank_accounts |
| is_intercompany | BOOLEAN | |
| created_at | TIMESTAMP | |

#### customers
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| organization_id | UUID | FK → organizations |
| company_name | VARCHAR(255) | |
| invoicing_name | VARCHAR(255) | |
| email | VARCHAR(255) | |
| cc_email | VARCHAR(255) | |
| address | JSONB | |
| shipping_address | JSONB | |
| payment_terms | VARCHAR(50) | |
| tax_rate | DECIMAL(5,2) | |
| auto_reminders | BOOLEAN | |
| online_payments | BOOLEAN | |
| status | ENUM | 'active', 'inactive' |
| department | VARCHAR(100) | |
| customer_segment | VARCHAR(100) | |
| notes | TEXT | |
| created_at | TIMESTAMP | |

#### vendors
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| organization_id | UUID | FK → organizations |
| name | VARCHAR(255) | |
| point_person | VARCHAR(255) | |
| email | VARCHAR(255) | |
| address | JSONB | |
| tax_id | VARCHAR(50) | |
| is_1099_eligible | BOOLEAN | |
| payment_method | ENUM | 'bank', 'credit', 'debit' |
| payment_terms | VARCHAR(50) | |
| default_account_id | UUID | FK → accounts |
| department | VARCHAR(100) | |
| status | ENUM | 'active', 'inactive' |
| created_at | TIMESTAMP | |

### Revenue Tables

#### products
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| organization_id | UUID | FK → organizations |
| name | VARCHAR(255) | |
| type | ENUM | 'revenue', 'non_revenue' |
| revenue_type | ENUM | 'fixed', 'usage' |
| pricing | ENUM | 'recurring', 'one_time' |
| count_to_mrr_arr | BOOLEAN | |
| revenue_account_id | UUID | FK → accounts |
| discount_account_id | UUID | FK → accounts |
| revenue_pattern | VARCHAR(100) | |
| usage_tier_type | ENUM | 'standard', 'graduated', 'volume' (nullable) |
| status | ENUM | 'active', 'inactive' |
| created_at | TIMESTAMP | |

#### contracts
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| organization_id | UUID | FK → organizations |
| contract_number | VARCHAR(50) | Unique per org |
| customer_id | UUID | FK → customers |
| type | ENUM | 'new_sales', 'existing', 'expansion', 'reactivation', 'contraction' |
| start_date | DATE | |
| end_date | DATE | |
| duration | VARCHAR(50) | |
| arr | DECIMAL(15,2) | |
| status | ENUM | 'active', 'pending_review', 'expired', 'cancelled' |
| auto_renew | BOOLEAN | |
| billing_frequency | ENUM | 'monthly', 'quarterly', 'semi_annually', 'annually' |
| payment_terms | VARCHAR(50) | |
| po_number | VARCHAR(100) | |
| created_at | TIMESTAMP | |

#### contract_products
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| contract_id | UUID | FK → contracts |
| product_id | UUID | FK → products |
| quantity | INTEGER | |
| unit_price | DECIMAL(15,2) | |
| discount | DECIMAL(5,2) | Percentage |
| total | DECIMAL(15,2) | |

#### invoices
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| organization_id | UUID | FK → organizations |
| invoice_number | VARCHAR(50) | Unique per org |
| customer_id | UUID | FK → customers |
| contract_id | UUID | FK → contracts (nullable) |
| date | DATE | |
| due_date | DATE | |
| amount | DECIMAL(15,2) | |
| status | ENUM | 'unbilled', 'unpaid', 'paid', 'overdue' |
| payment_terms | VARCHAR(50) | |
| po_number | VARCHAR(100) | |
| memo | TEXT | |
| currency | VARCHAR(3) | ISO currency code |
| created_at | TIMESTAMP | |

#### invoice_line_items
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| invoice_id | UUID | FK → invoices |
| product_id | UUID | FK → products |
| description | TEXT | |
| quantity | DECIMAL(10,2) | |
| unit_price | DECIMAL(15,2) | |
| amount | DECIMAL(15,2) | |

#### credit_memos
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| organization_id | UUID | FK → organizations |
| cm_number | VARCHAR(50) | |
| customer_id | UUID | FK → customers |
| invoice_id | UUID | FK → invoices (nullable) |
| date | DATE | |
| amount | DECIMAL(15,2) | |
| status | ENUM | 'unpaid', 'applied', 'refunded' |
| created_at | TIMESTAMP | |

### AP & Subledger Tables

#### bills
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| organization_id | UUID | FK → organizations |
| vendor_id | UUID | FK → vendors |
| bill_number | VARCHAR(50) | |
| date | DATE | |
| due_date | DATE | |
| amount | DECIMAL(15,2) | |
| status | ENUM | 'draft', 'pending', 'paid', 'overdue' |
| payment_terms | VARCHAR(50) | |
| currency | VARCHAR(3) | |
| created_at | TIMESTAMP | |

#### assets
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| organization_id | UUID | FK → organizations |
| asset_id_number | VARCHAR(50) | User-assigned ID |
| name | VARCHAR(255) | |
| category | VARCHAR(100) | |
| cost | DECIMAL(15,2) | |
| accumulated_depreciation | DECIMAL(15,2) | |
| useful_life_months | INTEGER | |
| in_service_date | DATE | |
| disposal_date | DATE | Nullable |
| disposal_value | DECIMAL(15,2) | Nullable |
| status | ENUM | 'active', 'disposed' |
| account_id | UUID | FK → accounts |
| created_at | TIMESTAMP | |

#### journal_entries
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| organization_id | UUID | FK → organizations |
| name | VARCHAR(255) | |
| date | DATE | |
| reversal_date | DATE | Nullable |
| status | ENUM | 'draft', 'pending_approval', 'approved', 'posted' |
| created_by | UUID | FK → users |
| approved_by | UUID | FK → users (nullable) |
| attachment_url | TEXT | |
| customer_id | UUID | FK → customers (nullable) |
| vendor_id | UUID | FK → vendors (nullable) |
| currency | VARCHAR(3) | |
| created_at | TIMESTAMP | |

#### journal_entry_lines
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| journal_entry_id | UUID | FK → journal_entries |
| account_id | UUID | FK → accounts |
| debit | DECIMAL(15,2) | |
| credit | DECIMAL(15,2) | |
| description | TEXT | |
| department | VARCHAR(100) | |

### Period Close Tables

#### periods
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| organization_id | UUID | FK → organizations |
| year | INTEGER | |
| month | INTEGER | 1-12 |
| status | ENUM | 'open', 'closing', 'closed' |
| closed_at | TIMESTAMP | Nullable |
| closed_by | UUID | FK → users (nullable) |

#### close_checklist_items
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| period_id | UUID | FK → periods |
| name | VARCHAR(255) | |
| owner_id | UUID | FK → users |
| due_date | DATE | |
| is_complete | BOOLEAN | |
| completed_at | TIMESTAMP | Nullable |
| attachment_urls | JSONB | Array of URLs |

### Integration Tables

#### integrations
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| organization_id | UUID | FK → organizations |
| provider | VARCHAR(50) | 'plaid', 'stripe', 'brex', etc. |
| status | ENUM | 'connected', 'disconnected', 'error' |
| config | JSONB | Provider-specific configuration |
| last_sync_at | TIMESTAMP | |
| created_at | TIMESTAMP | |

#### bank_accounts
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| organization_id | UUID | FK → organizations |
| integration_id | UUID | FK → integrations |
| name | VARCHAR(255) | |
| institution | VARCHAR(255) | |
| account_number_last4 | VARCHAR(4) | |
| balance | DECIMAL(15,2) | |
| currency | VARCHAR(3) | |

#### bank_transactions
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| bank_account_id | UUID | FK → bank_accounts |
| date | DATE | |
| description | TEXT | |
| amount | DECIMAL(15,2) | |
| is_matched | BOOLEAN | |
| matched_to_type | VARCHAR(50) | 'invoice', 'bill', 'journal_entry', etc. |
| matched_to_id | UUID | Polymorphic FK |

---

## Key Entities Summary

| Entity | Current State | Records in Mock | Key Relationships |
|--------|--------------|-----------------|-------------------|
| Customer | TypeScript interface | 5 | → Contracts, Invoices, Credit Memos |
| Product | TypeScript interface | 4 | → Contract Products, Invoice Lines |
| Contract | TypeScript interface | 4 | → Customer, Contract Products |
| Invoice | TypeScript interface | 5 | → Customer, Invoice Lines, Contract |
| Credit Memo | TypeScript interface | 3 | → Customer, Invoice |
| Account | Simple object | 5 | → Many entities (GL links) |
| Field | Simple object | 3 | → Attached to transactions |
| Member | Simple object | 3 | → Organization |

---

## Migration Strategy

When implementing the database:

1. **Define Prisma/Drizzle schema** based on the tables above
2. **Generate migrations** for PostgreSQL
3. **Seed with mock data** from `src/lib/mock-data.ts`
4. **Create API routes** that read/write to the database
5. **Replace mock imports** with React Query hooks calling API routes
6. **Add audit columns** (`created_at`, `updated_at`, `created_by`) to all tables

---

*Data model version: 1.0 | Mar 2026*

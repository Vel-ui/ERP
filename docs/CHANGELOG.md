# Changelog

All notable changes to the Maximor ERP project are documented in this file.

---

## [0.3.0] - 2026-03-13

### Added
- Maximor Design System (light theme, green primary #154738, mx- CSS classes)
- 21 reusable UI components (Button, Input, InputNumber, Select, Checkbox, Textarea, Modal, Drawer, Card, Tag, Badge, Alert, Avatar, Breadcrumb, Tabs, SegmentedTabs, Dropdown, Pagination, Progress, RadioGroup, Toolbar)
- Revenue Recognition page (ASC 606 compliance)
- Revenue Policies configuration
- Accruals management module with schedules and reversals
- Prepaids & Amortization module
- Flux Analysis with variance tracking and explanation workflow
- Reimbursements management
- Central Data Hub (Unified Ledger, Data Catalog, Data Mapping, Integration Hub)
- Workflows module with approval chains, rules engine, and notifications
- 13 integration setup pages (Plaid, Stripe, Brex, Expensify, Float, Gusto, Anrok, Avalara, Salesforce, HubSpot, Ramp, Rippling)
- Onboarding & Go-Live wizard
- Topbar with breadcrumbs, search, and notifications
- Period Close overview with Insights dashboard
- Period Close Monitoring dashboard
- Period Close Reconciliations workbench
- Cash overview dashboard and Cash Reporting
- Cash Policies configuration

### Changed
- Restructured navigation: `/ar` → `/revenue`, `/ap` → `/subledgers/ap`, `/close` → `/period-close`
- Replaced dark/purple theme with Maximor Design System (light theme)
- All emoji icons replaced with lucide-react icon set
- Sidebar redesigned with dark green theme (#154738) and collapsible navigation
- Settings sidebar updated with new sections (Onboarding, Subsidiaries)
- Reporting hub reorganized with new report types

### Technical
- Added dependencies: lucide-react, recharts, @tanstack/react-query, @tanstack/react-table, react-hook-form, zod, @hookform/resolvers
- Created `src/styles/mx-styles.css` (Maximor Design System CSS with mx- class prefix)
- Updated Tailwind config with Maximor color tokens
- Added 21 reusable components in `src/components/ui/`
- Preserved original design on `baseline-v1-dark-theme` git branch

---

## [0.2.0] - 2026-03-13

### Added
- Full Accounts Receivable: Customers, Products, Contracts (multi-step wizard), Invoices, Credit Memos
- Full Accounts Payable: Vendors, Bills, Charges
- Cash Reconciliation workbench with matching UI
- Close Management: Checklist, Account Register, Journal Entries, Fixed Assets
- 16 report pages (Income Statement, Balance Sheet, Cash Flow, SaaS P&L, AR/AP Aging, Budget vs Actuals, MRR/ARR, ARR Waterfall, Data Lab, 1099, Sales Tax, VAT, Prepaid Schedule)
- Organization Settings: Banks, Chart of Accounts, Fields, Members & Roles, Invoices, Accounting, Report Settings
- Aura AI chat interface with suggested queries
- Mock data layer (`src/lib/mock-data.ts`) with TypeScript interfaces

### Changed
- Expanded sidebar navigation to include all modules
- Launchpad enriched with workflow snapshot links

---

## [0.1.0] - 2026-03-13

### Added
- Initial project setup with Next.js 14, TypeScript, Tailwind CSS
- Dark theme with purple accents (Rillet-inspired)
- App shell with collapsible sidebar
- Launchpad with key metrics and workflow snapshot
- Placeholder pages for all main sections
- Design tokens (dark theme, purple accent colors)
- Base components: Button, Input, Select, Table, Modal
- Connected to GitHub repository (Vel-ui/ERP)

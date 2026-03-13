# Maximor ERP

Rillet-style accounting platform built with Next.js, TypeScript, and Tailwind.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── page.tsx      # Launchpad
│   ├── cash/         # Cash Reconciliation
│   ├── ar/           # Accounts Receivable
│   ├── ap/           # Accounts Payable
│   ├── close/        # Close Management
│   ├── reporting/    # Reports
│   └── settings/     # Organization Settings
└── components/
    └── layout/
        └── AppShell.tsx   # Sidebar + main layout
```

## Phase 0 Complete ✅

- Next.js 14 + TypeScript + Tailwind
- Design tokens (dark theme, purple accent)
- App shell with collapsible sidebar
- Launchpad with Metrics, Workflow Snapshot, Tech Stack Monitoring
- Placeholder pages for all main sections

## Next: Phase 1

Organization Settings (Banks, Chart of Accounts, Fields, Members & Roles, etc.)

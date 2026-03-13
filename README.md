# Maximor ERP

Enterprise accounting platform built with Next.js, TypeScript, Tailwind, and the Maximor Design System.

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

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Maximor Design System (mx- CSS classes)
- **Icons**: lucide-react
- **Charts**: recharts
- **Forms**: React Hook Form + Zod
- **Tables**: @tanstack/react-table
- **Data Fetching**: @tanstack/react-query

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Launchpad
│   ├── revenue/            # Revenue (AR, Contracts, Invoices, Recognition)
│   ├── cash/               # Cash (Overview, Reconciliation, Reporting)
│   ├── subledgers/         # Subledgers
│   │   ├── ap/             # AP & Accruals, Bills, Vendors, Reimbursements
│   │   ├── fixed-assets/   # Fixed Assets
│   │   └── prepaids/       # Prepaids & Amortization
│   ├── period-close/       # Period Close (Checklist, JEs, Flux Analysis)
│   ├── reporting/          # Reports (IS, BS, CF, SaaS, Aging, etc.)
│   ├── central-data-hub/   # Central Data Hub (Ledger, Catalog, Mapping)
│   ├── workflows/          # Workflow automation
│   ├── settings/           # Organization Settings & Integrations
│   └── ai/                 # Aura AI Assistant
├── components/
│   ├── layout/             # AppShell, Topbar, SettingsSidebar
│   └── ui/                 # 21 reusable UI components
├── lib/                    # Mock data and utilities
└── styles/                 # Maximor Design System CSS (mx-styles.css)
```

## Design System

The app uses the Maximor Design System:
- **Primary**: Deep green (#154738)
- **Theme**: Light with dark green sidebar
- **Components**: 21 reusable UI components with `mx-` CSS class prefix
- **Icons**: lucide-react icon set
- See `docs/DESIGN-SYSTEM.md` for details.

## Modules

| Module | Route | Status |
|--------|-------|--------|
| Launchpad | `/` | Built |
| Revenue | `/revenue/*` | Built |
| Cash | `/cash/*` | Built |
| Subledgers (AP, Fixed Assets, Prepaids) | `/subledgers/*` | Built |
| Period Close | `/period-close/*` | Built |
| Reporting | `/reporting/*` | Built |
| Central Data Hub | `/central-data-hub/*` | Built |
| Workflows | `/workflows` | Built |
| Settings & Integrations | `/settings/*` | Built |
| Aura AI | `/ai` | Built |

## Documentation

| Document | Description |
|----------|-------------|
| [SETUP.md](SETUP.md) | Setup and installation guide |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture |
| [docs/DATA-MODEL.md](docs/DATA-MODEL.md) | Data model and schema |
| [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) | Maximor Design System reference |
| [docs/CHANGELOG.md](docs/CHANGELOG.md) | Version history |
| [docs/MAXIMOR-ERP-IMPLEMENTATION-PLAN.md](docs/MAXIMOR-ERP-IMPLEMENTATION-PLAN.md) | Full implementation plan |
| [docs/PROJECT-PLAN-WITH-TIMELINES.md](docs/PROJECT-PLAN-WITH-TIMELINES.md) | Phase timelines |

## Reverting to Previous Design

The original dark/purple theme is preserved on the `baseline-v1-dark-theme` branch:
```bash
git checkout baseline-v1-dark-theme
```

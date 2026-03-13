# Maximor ERP — Setup & Run

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| **Node.js** | v18+ |
| **npm** | v9+ (included with Node.js) |
| **Git** | Latest (for version control) |

---

## Dependencies

The project uses the following key packages:

| Package | Purpose |
|---------|---------|
| `next` | React framework (App Router) |
| `react` / `react-dom` | UI library |
| `typescript` | Type safety |
| `tailwindcss` | Utility-first CSS |
| `lucide-react` | Icon library |
| `recharts` | Charts and data visualization |
| `react-hook-form` | Form state management |
| `zod` | Schema validation |
| `@hookform/resolvers` | Zod integration for React Hook Form |
| `@tanstack/react-table` | Headless table library |
| `@tanstack/react-query` | Server state / data fetching |

All dependencies are listed in `package.json` and installed automatically with `npm install`.

---

## Alternative: Batch File

**Double-click `install-and-run.bat`** in the project root.
It will install dependencies and start the dev server, then open http://localhost:3000.

---

## Project Structure

```
src/
├── app/          # Next.js App Router pages and routes
├── components/   # Layout and UI components
├── lib/          # Mock data and utilities
└── styles/       # Maximor Design System CSS (mx-styles.css)
```

See [README.md](README.md) for the full structure breakdown.

---

## Environment Variables

No environment variables are required for the current prototype. All data is mocked in `src/lib/mock-data.ts`.

Future integrations will require:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Auth session encryption |
| `PLAID_CLIENT_ID` / `PLAID_SECRET` | Bank connections |
| `STRIPE_SECRET_KEY` | Payment processing |

---

## Troubleshooting

### Port 3000 already in use

```bash
npx kill-port 3000
npm run dev
```

### Node version too old

```bash
node -v
```

If below v18, update Node.js from [nodejs.org](https://nodejs.org/).

### Tailwind styles not loading

Ensure `src/styles/mx-styles.css` is imported in `src/app/globals.css` or `src/app/layout.tsx`.

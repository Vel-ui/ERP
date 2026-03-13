"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button, Input, Select } from "@/components/ui";
import { Search, Download, Filter } from "lucide-react";

interface LedgerEntry {
  id: string;
  date: string;
  account: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  source: string;
  entity: string;
}

const MOCK_LEDGER: LedgerEntry[] = [
  { id: "GL-001", date: "03-01-2026", account: "1000 - Cash", description: "Stripe deposit — March batch", debit: 24500, credit: 0, balance: 124500, source: "Stripe", entity: "Maximor US" },
  { id: "GL-002", date: "03-01-2026", account: "4000 - Revenue", description: "SaaS revenue recognition — March", debit: 0, credit: 24500, balance: 0, source: "Revenue Engine", entity: "Maximor US" },
  { id: "GL-003", date: "03-02-2026", account: "6100 - Cloud Hosting", description: "AWS invoice — March", debit: 3200, credit: 0, balance: 3200, source: "Ramp", entity: "Maximor US" },
  { id: "GL-004", date: "03-03-2026", account: "6200 - Salaries", description: "Payroll run — biweekly", debit: 38750, credit: 0, balance: 77500, source: "Gusto", entity: "Maximor US" },
  { id: "GL-005", date: "03-03-2026", account: "6210 - Payroll Tax", description: "Payroll taxes — biweekly", debit: 10000, credit: 0, balance: 20000, source: "Gusto", entity: "Maximor US" },
  { id: "GL-006", date: "03-05-2026", account: "1200 - Accounts Receivable", description: "Invoice INV-2026-041 — Acme Corp", debit: 15000, credit: 0, balance: 45000, source: "AR Module", entity: "Maximor US" },
  { id: "GL-007", date: "03-06-2026", account: "1000 - Cash", description: "Wire transfer to Mercury", debit: 0, credit: 10000, balance: 114500, source: "Chase", entity: "Maximor US" },
  { id: "GL-008", date: "03-07-2026", account: "6300 - Software", description: "Google Workspace — monthly", debit: 432, credit: 0, balance: 1296, source: "Brex", entity: "Maximor US" },
  { id: "GL-009", date: "03-08-2026", account: "2100 - Accrued Liabilities", description: "Legal fees accrual — Q1", debit: 0, credit: 12500, balance: 37500, source: "Manual JE", entity: "Maximor US" },
  { id: "GL-010", date: "03-10-2026", account: "1500 - Prepaid Expenses", description: "Insurance prepaid — annual policy", debit: 18000, credit: 0, balance: 36000, source: "AP Module", entity: "Maximor US" },
  { id: "GL-011", date: "03-10-2026", account: "4100 - Subscription Revenue", description: "Enterprise plan — Beta Inc", debit: 0, credit: 8750, balance: 0, source: "Stripe", entity: "Maximor UK" },
  { id: "GL-012", date: "03-11-2026", account: "6400 - Office Supplies", description: "Staples order — Q1 supplies", debit: 289.50, credit: 0, balance: 578.50, source: "Ramp", entity: "Maximor US" },
  { id: "GL-013", date: "03-12-2026", account: "3000 - Retained Earnings", description: "Intercompany transfer — UK to US", debit: 25000, credit: 0, balance: 150000, source: "IC Module", entity: "Maximor UK" },
  { id: "GL-014", date: "03-12-2026", account: "1000 - Cash", description: "Client payment — Gamma LLC", debit: 7200, credit: 0, balance: 121700, source: "Plaid", entity: "Maximor US" },
  { id: "GL-015", date: "03-13-2026", account: "6500 - Depreciation", description: "Monthly depreciation — fixed assets", debit: 4167, credit: 0, balance: 12501, source: "FA Module", entity: "Maximor US" },
];

const PERIODS = [
  { value: "2026-03", label: "March 2026" },
  { value: "2026-02", label: "February 2026" },
  { value: "2026-01", label: "January 2026" },
  { value: "2025-12", label: "December 2025" },
];

const ENTITIES = [
  { value: "all", label: "All Entities" },
  { value: "Maximor US", label: "Maximor US" },
  { value: "Maximor UK", label: "Maximor UK" },
  { value: "Maximor Europe", label: "Maximor Europe" },
];

const SOURCES = [
  { value: "all", label: "All Sources" },
  { value: "Stripe", label: "Stripe" },
  { value: "Gusto", label: "Gusto" },
  { value: "Ramp", label: "Ramp" },
  { value: "Brex", label: "Brex" },
  { value: "Chase", label: "Chase" },
  { value: "Plaid", label: "Plaid" },
  { value: "Manual JE", label: "Manual JE" },
];

function fmt(n: number) {
  if (n === 0) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default function UnifiedLedgerPage() {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("2026-03");
  const [entity, setEntity] = useState("all");
  const [source, setSource] = useState("all");
  const [sortField, setSortField] = useState<"date" | "debit" | "credit">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    let rows = MOCK_LEDGER;
    if (entity !== "all") rows = rows.filter((r) => r.entity === entity);
    if (source !== "all") rows = rows.filter((r) => r.source === source);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.description.toLowerCase().includes(q) ||
          r.account.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
      );
    }
    rows = [...rows].sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortField === "date") return mul * a.date.localeCompare(b.date);
      return mul * ((a[sortField] || 0) - (b[sortField] || 0));
    });
    return rows;
  }, [search, entity, source, sortField, sortDir]);

  function toggleSort(field: "date" | "debit" | "credit") {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  }

  const sortIndicator = (field: string) =>
    sortField === field ? (sortDir === "asc" ? " ↑" : " ↓") : "";

  return (
    <div className="p-8 space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <Link href="/central-data-hub" className="hover:text-foreground">Central Data Hub</Link>
          <span>/</span>
          <span className="text-foreground">Unified Ledger</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mx-h1">Unified Ledger</h1>
            <p className="mx-text-secondary mt-1">Consolidated general ledger across all entities and sources</p>
          </div>
          <Button variant="default" size="sm">
            <Download size={14} className="mr-1.5 inline" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="w-64">
          <Input placeholder="Search entries…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="w-44">
          <Select label="Period" options={PERIODS} value={period} onChange={(e) => setPeriod(e.target.value)} />
        </div>
        <div className="w-44">
          <Select label="Entity" options={ENTITIES} value={entity} onChange={(e) => setEntity(e.target.value)} />
        </div>
        <div className="w-44">
          <Select label="Source" options={SOURCES} value={source} onChange={(e) => setSource(e.target.value)} />
        </div>
      </div>

      <div className="mx-table-container rounded-lg border border-border overflow-hidden">
        <table className="mx-table w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-sidebar">
              <th className="px-4 py-3 text-left font-medium text-muted cursor-pointer" onClick={() => toggleSort("date")}>
                Date{sortIndicator("date")}
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted">Account</th>
              <th className="px-4 py-3 text-left font-medium text-muted">Description</th>
              <th className="px-4 py-3 text-right font-medium text-muted cursor-pointer" onClick={() => toggleSort("debit")}>
                Debit{sortIndicator("debit")}
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted cursor-pointer" onClick={() => toggleSort("credit")}>
                Credit{sortIndicator("credit")}
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted">Balance</th>
              <th className="px-4 py-3 text-left font-medium text-muted">Source</th>
              <th className="px-4 py-3 text-left font-medium text-muted">Entity</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-sidebar-hover transition-colors">
                <td className="px-4 py-3 text-muted whitespace-nowrap">{row.date}</td>
                <td className="px-4 py-3 text-foreground font-medium whitespace-nowrap">{row.account}</td>
                <td className="px-4 py-3 text-foreground">{row.description}</td>
                <td className="px-4 py-3 text-right font-mono text-foreground">{fmt(row.debit)}</td>
                <td className="px-4 py-3 text-right font-mono text-foreground">{fmt(row.credit)}</td>
                <td className="px-4 py-3 text-right font-mono text-foreground">{fmt(row.balance)}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-sidebar px-2 py-0.5 text-xs font-medium text-muted">
                    {row.source}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted text-xs">{row.entity}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-muted">No entries match your filters</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-xs text-muted">
        <span>Showing {filtered.length} of {MOCK_LEDGER.length} entries</span>
        <span>Period: {PERIODS.find((p) => p.value === period)?.label}</span>
      </div>
    </div>
  );
}

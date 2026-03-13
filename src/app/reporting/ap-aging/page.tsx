"use client";

import { useState, useMemo } from "react";
import { Button, Input } from "@/components/ui";
import Link from "next/link";

interface APRow {
  id: string;
  vendor: string;
  current: number;
  days1to30: number;
  days31to60: number;
  days61to90: number;
  days90plus: number;
}

const MOCK_DATA: APRow[] = [
  { id: "1", vendor: "AWS Cloud Services", current: 38200, days1to30: 18500, days31to60: 5200, days61to90: 0, days90plus: 0 },
  { id: "2", vendor: "Salesforce Inc.", current: 24800, days1to30: 12400, days31to60: 8200, days61to90: 3100, days90plus: 0 },
  { id: "3", vendor: "WeWork Office Space", current: 12000, days1to30: 12000, days31to60: 0, days61to90: 0, days90plus: 0 },
  { id: "4", vendor: "Datadog Monitoring", current: 8500, days1to30: 4200, days31to60: 2100, days61to90: 1050, days90plus: 525 },
  { id: "5", vendor: "HubSpot Marketing", current: 15600, days1to30: 7800, days31to60: 0, days61to90: 0, days90plus: 0 },
  { id: "6", vendor: "Gusto Payroll", current: 42500, days1to30: 21250, days31to60: 10625, days61to90: 0, days90plus: 0 },
  { id: "7", vendor: "Stripe Processing", current: 6800, days1to30: 3400, days31to60: 1700, days61to90: 850, days90plus: 425 },
  { id: "8", vendor: "Google Workspace", current: 4200, days1to30: 2100, days31to60: 0, days61to90: 0, days90plus: 0 },
  { id: "9", vendor: "Zoom Communications", current: 3600, days1to30: 1800, days31to60: 900, days61to90: 450, days90plus: 0 },
  { id: "10", vendor: "JetBrains Licenses", current: 5400, days1to30: 2700, days31to60: 0, days61to90: 0, days90plus: 0 },
];

function getTotal(row: APRow) {
  return row.current + row.days1to30 + row.days31to60 + row.days61to90 + row.days90plus;
}

function BackArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function fmt(val: number) {
  return val === 0 ? "—" : `$${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

type SortKey = "vendor" | "current" | "days1to30" | "days31to60" | "days61to90" | "days90plus" | "total";

function SortIcon({ active, dir }: { active: boolean; dir: "asc" | "desc" }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      className="inline ml-1"
      style={{ color: active ? 'var(--mx-primary)' : 'var(--mx-text-tertiary)' }}
    >
      {dir === "asc" ? <polyline points="18 15 12 9 6 15" /> : <polyline points="6 9 12 15 18 9" />}
    </svg>
  );
}

export default function APAgingPage() {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("total");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const filtered = useMemo(() => {
    let rows = MOCK_DATA;
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => r.vendor.toLowerCase().includes(q));
    }
    return [...rows].sort((a, b) => {
      let va: number | string, vb: number | string;
      if (sortKey === "vendor") { va = a.vendor; vb = b.vendor; }
      else if (sortKey === "total") { va = getTotal(a); vb = getTotal(b); }
      else { va = a[sortKey]; vb = b[sortKey]; }
      if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
      return sortDir === "asc" ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });
  }, [search, sortKey, sortDir]);

  const totals = useMemo(() => ({
    current: filtered.reduce((s, r) => s + r.current, 0),
    days1to30: filtered.reduce((s, r) => s + r.days1to30, 0),
    days31to60: filtered.reduce((s, r) => s + r.days31to60, 0),
    days61to90: filtered.reduce((s, r) => s + r.days61to90, 0),
    days90plus: filtered.reduce((s, r) => s + r.days90plus, 0),
    total: filtered.reduce((s, r) => s + getTotal(r), 0),
  }), [filtered]);

  const overdue = totals.days31to60 + totals.days61to90 + totals.days90plus;
  const overduePercent = totals.total > 0 ? ((overdue / totals.total) * 100).toFixed(1) : "0.0";

  const columns: { key: SortKey; label: string; color?: string }[] = [
    { key: "vendor", label: "Vendor" },
    { key: "current", label: "Current" },
    { key: "days1to30", label: "1–30 Days" },
    { key: "days31to60", label: "31–60 Days", color: "text-amber-400" },
    { key: "days61to90", label: "61–90 Days", color: "text-orange-400" },
    { key: "days90plus", label: "90+ Days", color: "text-red-400" },
    { key: "total", label: "Total" },
  ];

  return (
    <div className="min-h-screen">
      <div className="border-b border-border px-8 py-4" style={{ background: 'var(--mx-bg-card)' }}>
        <div className="flex items-center gap-3 mb-3">
          <Link href="/reporting" className="mx-text-secondary transition-colors">
            <BackArrow />
          </Link>
          <h1 className="mx-h2">AP Aging</h1>
          <span className="rounded-full bg-orange-500/15 px-2.5 py-0.5 text-xs font-medium text-orange-400">As of Dec 31, 2025</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-64">
            <Input placeholder="Search vendors..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="default" size="sm">Export</Button>
          </div>
        </div>
      </div>

      <div className="px-8 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="mx-card mx-card-white">
            <p className="text-xs mx-text-secondary">Total Payables</p>
            <p className="mt-1 text-xl font-bold">{fmt(totals.total)}</p>
          </div>
          <div className="mx-card mx-card-white">
            <p className="text-xs mx-text-secondary">Current</p>
            <p className="mt-1 text-xl font-bold text-emerald-400">{fmt(totals.current)}</p>
          </div>
          <div className="mx-card mx-card-white">
            <p className="text-xs mx-text-secondary">Overdue (31+ Days)</p>
            <p className="mt-1 text-xl font-bold text-red-400">{fmt(overdue)}</p>
          </div>
          <div className="mx-card mx-card-white">
            <p className="text-xs mx-text-secondary">Overdue %</p>
            <p className="mt-1 text-xl font-bold text-amber-400">{overduePercent}%</p>
          </div>
        </div>
      </div>

      <div className="px-8">
        <div className="mx-table-container">
          <table className="mx-table min-w-[800px]">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={`cursor-pointer transition-colors ${col.key === "vendor" ? "text-left" : "text-right"} ${col.color || ""}`}
                  >
                    {col.label}
                    <SortIcon active={sortKey === col.key} dir={sortKey === col.key ? sortDir : "desc"} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => {
                const total = getTotal(row);
                return (
                  <tr key={row.id}>
                    <td className="font-medium">{row.vendor}</td>
                    <td className="text-right tabular-nums mx-text-secondary">{fmt(row.current)}</td>
                    <td className="text-right tabular-nums mx-text-secondary">{fmt(row.days1to30)}</td>
                    <td className={`text-right tabular-nums ${row.days31to60 > 0 ? "text-amber-400" : "mx-text-secondary"}`}>{fmt(row.days31to60)}</td>
                    <td className={`text-right tabular-nums ${row.days61to90 > 0 ? "text-orange-400" : "mx-text-secondary"}`}>{fmt(row.days61to90)}</td>
                    <td className={`text-right tabular-nums ${row.days90plus > 0 ? "text-red-400" : "mx-text-secondary"}`}>{fmt(row.days90plus)}</td>
                    <td className="text-right tabular-nums font-semibold">{fmt(total)}</td>
                  </tr>
                );
              })}

              <tr className="border-t-2 border-border font-bold" style={{ background: 'var(--mx-bg-card)' }}>
                <td>Total</td>
                <td className="text-right tabular-nums">{fmt(totals.current)}</td>
                <td className="text-right tabular-nums">{fmt(totals.days1to30)}</td>
                <td className="text-right tabular-nums text-amber-400">{fmt(totals.days31to60)}</td>
                <td className="text-right tabular-nums text-orange-400">{fmt(totals.days61to90)}</td>
                <td className="text-right tabular-nums text-red-400">{fmt(totals.days90plus)}</td>
                <td className="text-right tabular-nums" style={{ color: 'var(--mx-primary)' }}>{fmt(totals.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

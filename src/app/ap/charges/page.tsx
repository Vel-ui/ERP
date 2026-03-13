"use client";

import { useState } from "react";
import { Input, Select } from "@/components/ui";

/* ───────────────── Types ───────────────── */

interface Charge {
  id: string;
  date: string;
  description: string;
  vendor: string;
  amount: number;
  source: "Ramp" | "Brex" | "Expensify";
  status: "pending" | "matched";
}

/* ───────────────── Mock Data ───────────────── */

const initialCharges: Charge[] = [
  { id: "CHG-001", date: "2026-03-10", description: "Figma Team Plan - Monthly", vendor: "Figma Inc.", amount: 75.0, source: "Ramp", status: "matched" },
  { id: "CHG-002", date: "2026-03-09", description: "Slack Business+ Subscription", vendor: "Slack Technologies", amount: 252.0, source: "Ramp", status: "pending" },
  { id: "CHG-003", date: "2026-03-08", description: "Uber Business - Team Rides", vendor: "Uber Technologies", amount: 347.82, source: "Brex", status: "pending" },
  { id: "CHG-004", date: "2026-03-07", description: "Client Dinner - Q1 Review", vendor: "The Capital Grille", amount: 486.50, source: "Expensify", status: "pending" },
  { id: "CHG-005", date: "2026-03-06", description: "Notion Team Workspace", vendor: "Notion Labs", amount: 120.0, source: "Ramp", status: "matched" },
  { id: "CHG-006", date: "2026-03-05", description: "DoorDash - Team Lunch", vendor: "DoorDash Inc.", amount: 189.25, source: "Brex", status: "pending" },
  { id: "CHG-007", date: "2026-03-04", description: "GitHub Enterprise", vendor: "GitHub Inc.", amount: 441.0, source: "Ramp", status: "matched" },
];

/* ───────────────── Helpers ───────────────── */

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-500/15 text-yellow-400",
    matched: "bg-green-500/15 text-green-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? "bg-sidebar text-muted"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function SourceBadge({ source }: { source: string }) {
  const colors: Record<string, string> = {
    Ramp: "bg-emerald-500/15 text-emerald-400",
    Brex: "bg-orange-500/15 text-orange-400",
    Expensify: "bg-blue-500/15 text-blue-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[source] ?? "bg-sidebar text-muted"}`}>
      {source}
    </span>
  );
}

/* ───────────────── Component ───────────────── */

export default function ChargesPage() {
  const [charges] = useState<Charge[]>(initialCharges);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const filtered = charges.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (sourceFilter !== "all" && c.source !== sourceFilter) return false;
    if (!searchText) return true;
    const q = searchText.toLowerCase();
    return c.description.toLowerCase().includes(q) || c.vendor.toLowerCase().includes(q);
  });

  const pendingCount = charges.filter((c) => c.status === "pending").length;
  const pendingTotal = charges.filter((c) => c.status === "pending").reduce((s, c) => s + c.amount, 0);
  const matchedCount = charges.filter((c) => c.status === "matched").length;

  return (
    <div className="p-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Charges</h1>
        <p className="mt-1 text-sm text-muted">Charges synced from corporate card and expense integrations</p>
      </div>

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-sidebar p-4">
          <p className="text-sm text-muted">Total Charges</p>
          <p className="mt-1 text-xl font-semibold text-foreground">{charges.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-sidebar p-4">
          <p className="text-sm text-muted">Pending Review</p>
          <p className="mt-1 text-xl font-semibold text-yellow-400">{pendingCount}</p>
          <p className="text-xs text-muted">{formatCurrency(pendingTotal)}</p>
        </div>
        <div className="rounded-lg border border-border bg-sidebar p-4">
          <p className="text-sm text-muted">Matched</p>
          <p className="mt-1 text-xl font-semibold text-green-400">{matchedCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-end gap-4">
        <div className="w-72">
          <Input placeholder="Search charges…" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        </div>
        <div className="w-40">
          <Select
            options={[
              { value: "all", label: "All Statuses" },
              { value: "pending", label: "Pending" },
              { value: "matched", label: "Matched" },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
        <div className="w-40">
          <Select
            options={[
              { value: "all", label: "All Sources" },
              { value: "Ramp", label: "Ramp" },
              { value: "Brex", label: "Brex" },
              { value: "Expensify", label: "Expensify" },
            ]}
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-sidebar text-left text-xs text-muted">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-center">Source</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((charge) => (
              <tr key={charge.id} className="border-b border-border transition-colors hover:bg-sidebar-hover">
                <td className="px-4 py-3 text-muted">{charge.date}</td>
                <td className="px-4 py-3 text-foreground">{charge.description}</td>
                <td className="px-4 py-3 text-muted">{charge.vendor}</td>
                <td className="px-4 py-3 text-right font-mono text-foreground">{formatCurrency(charge.amount)}</td>
                <td className="px-4 py-3 text-center">
                  <SourceBadge source={charge.source} />
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={charge.status} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">No charges found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Integration info */}
      <div className="mt-4 flex items-center gap-2 rounded-md border border-border bg-sidebar px-4 py-3">
        <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-muted">
          Charges are automatically synced from connected integrations. Manage connections in{" "}
          <a href="/settings/integrations" className="text-accent hover:text-accent-hover underline">Settings &rarr; Integrations</a>.
        </p>
      </div>
    </div>
  );
}

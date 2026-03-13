"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Input, Select } from "@/components/ui";

type JEStatus = "Draft" | "Pending Approval" | "Approved";

interface JournalEntry {
  id: string;
  jeNumber: string;
  name: string;
  date: string;
  debitTotal: number;
  creditTotal: number;
  status: JEStatus;
  reversalDate: string | null;
  createdBy: string;
}

const statusColors: Record<JEStatus, string> = {
  Draft: "bg-zinc-500/15 text-zinc-400 border-zinc-500/25",
  "Pending Approval": "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  Approved: "bg-green-500/15 text-green-400 border-green-500/25",
};

const mockEntries: JournalEntry[] = [
  { id: "1", jeNumber: "JE-001", name: "March depreciation", date: "2026-03-31", debitTotal: 12500.0, creditTotal: 12500.0, status: "Approved", reversalDate: null, createdBy: "Sarah Chen" },
  { id: "2", jeNumber: "JE-002", name: "Prepaid insurance amortization", date: "2026-03-31", debitTotal: 3200.0, creditTotal: 3200.0, status: "Approved", reversalDate: null, createdBy: "Emily Rodriguez" },
  { id: "3", jeNumber: "JE-003", name: "Bonus accrual", date: "2026-03-31", debitTotal: 45000.0, creditTotal: 45000.0, status: "Pending Approval", reversalDate: "2026-04-01", createdBy: "Mike Johnson" },
  { id: "4", jeNumber: "JE-004", name: "Rent accrual", date: "2026-03-31", debitTotal: 8500.0, creditTotal: 8500.0, status: "Pending Approval", reversalDate: "2026-04-01", createdBy: "Lisa Wang" },
  { id: "5", jeNumber: "JE-005", name: "Intercompany allocation", date: "2026-03-28", debitTotal: 22000.0, creditTotal: 22000.0, status: "Draft", reversalDate: null, createdBy: "James Park" },
  { id: "6", jeNumber: "JE-006", name: "Revenue reclassification", date: "2026-03-25", debitTotal: 15750.0, creditTotal: 15750.0, status: "Draft", reversalDate: null, createdBy: "Sarah Chen" },
];

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "Draft", label: "Draft" },
  { value: "Pending Approval", label: "Pending Approval" },
  { value: "Approved", label: "Approved" },
];

const accountOptions = [
  { value: "all", label: "All Accounts" },
  { value: "6000", label: "6000 - Depreciation" },
  { value: "1300", label: "1300 - Prepaid Expenses" },
  { value: "5100", label: "5100 - Salaries & Wages" },
  { value: "6200", label: "6200 - Rent Expense" },
];

const currentUser = "Sarah Chen";

export default function AccountRegisterPage() {
  const [entries, setEntries] = useState<JournalEntry[]>(mockEntries);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [accountFilter, setAccountFilter] = useState("all");

  const filtered = entries.filter((e) => {
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    if (dateFrom && e.date < dateFrom) return false;
    if (dateTo && e.date > dateTo) return false;
    return true;
  });

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleApprove = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "Approved" as JEStatus } : e))
    );
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        window.location.href = "/close/journal-entries/create";
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Account Register</h1>
          <p className="mt-1 text-muted">
            Journal entries &middot; {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/close/journal-entries/create">
            <Button size="sm">+ Add Journal Entry</Button>
          </Link>
          <span className="hidden sm:inline text-xs text-muted border border-border rounded px-2 py-1">
            Ctrl+K for New JE
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="w-44">
          <Select
            label="Status"
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
        <div className="w-40">
          <Input
            label="From"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div className="w-40">
          <Input
            label="To"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <div className="w-52">
          <Select
            label="Account"
            options={accountOptions}
            value={accountFilter}
            onChange={(e) => setAccountFilter(e.target.value)}
          />
        </div>
        {(statusFilter !== "all" || dateFrom || dateTo || accountFilter !== "all") && (
          <Button
            variant="text"
            size="sm"
            onClick={() => {
              setStatusFilter("all");
              setDateFrom("");
              setDateTo("");
              setAccountFilter("all");
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-sidebar">
                <th className="px-4 py-3 text-left font-medium text-muted">JE #</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Date</th>
                <th className="px-4 py-3 text-right font-medium text-muted">Debit</th>
                <th className="px-4 py-3 text-right font-medium text-muted">Credit</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Reversal</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Created By</th>
                <th className="px-4 py-3 text-right font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-border last:border-0 hover:bg-sidebar-hover transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-foreground">{entry.jeNumber}</td>
                  <td className="px-4 py-3 text-foreground font-medium">{entry.name}</td>
                  <td className="px-4 py-3 text-muted">{entry.date}</td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">{fmt(entry.debitTotal)}</td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">{fmt(entry.creditTotal)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[entry.status]}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{entry.reversalDate ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{entry.createdBy}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href="/close/journal-entries/create">
                        <button
                          className="rounded p-1 text-muted hover:bg-sidebar-hover hover:text-foreground transition-colors"
                          title="Edit"
                        >
                          ✏️
                        </button>
                      </Link>
                      {entry.status !== "Approved" && entry.createdBy !== currentUser && (
                        <button
                          onClick={() => handleApprove(entry.id)}
                          className="rounded p-1 text-muted hover:bg-green-500/10 hover:text-green-400 transition-colors"
                          title="Approve"
                        >
                          ✅
                        </button>
                      )}
                      {entry.status === "Draft" && (
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="rounded p-1 text-muted hover:bg-red-500/10 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-muted">
                    No journal entries match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

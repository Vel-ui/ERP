"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, CheckCircle, Trash2 } from "lucide-react";
import { Button, Input, Select, Tag } from "@/components/ui";

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

const statusVariant: Record<JEStatus, "default" | "warning" | "success"> = {
  Draft: "default",
  "Pending Approval": "warning",
  Approved: "success",
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

export default function JournalEntriesPage() {
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

  const handleDelete = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));
  const handleApprove = (id: string) => setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: "Approved" as JEStatus } : e)));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        window.location.href = "/period-close/journal-entries/create";
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <div style={{ padding: 24, background: '#f9f9f9' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="mx-h1">Journal Entries</h1>
            <p className="mx-text-secondary mt-1">{filtered.length} {filtered.length === 1 ? "entry" : "entries"}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/period-close/journal-entries/create">
              <Button size="sm"><Plus size={14} className="mr-1" /> Add Journal Entry</Button>
            </Link>
            <span className="mx-text-secondary" style={{ fontSize: 11, border: '1px solid #E9E9E9', borderRadius: 4, padding: '4px 8px' }}>Ctrl+K for New JE</span>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3 mb-4">
          <div style={{ width: 176 }}><Select label="Status" options={statusOptions} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} /></div>
          <div style={{ width: 160 }}><Input label="From" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} /></div>
          <div style={{ width: 160 }}><Input label="To" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} /></div>
          <div style={{ width: 208 }}><Select label="Account" options={accountOptions} value={accountFilter} onChange={(e) => setAccountFilter(e.target.value)} /></div>
          {(statusFilter !== "all" || dateFrom || dateTo || accountFilter !== "all") && (
            <Button variant="text" size="sm" onClick={() => { setStatusFilter("all"); setDateFrom(""); setDateTo(""); setAccountFilter("all"); }}>Clear Filters</Button>
          )}
        </div>

        <div className="mx-table-container">
          <table className="mx-table">
            <thead>
              <tr>
                <th>JE #</th>
                <th>Name</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Debit</th>
                <th style={{ textAlign: 'right' }}>Credit</th>
                <th>Status</th>
                <th>Reversal</th>
                <th>Created By</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id}>
                  <td style={{ fontFamily: 'monospace', color: '#2D2926' }}>{entry.jeNumber}</td>
                  <td style={{ fontWeight: 500, color: '#2D2926' }}>{entry.name}</td>
                  <td>{entry.date}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#2D2926' }}>{fmt(entry.debitTotal)}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#2D2926' }}>{fmt(entry.creditTotal)}</td>
                  <td><Tag variant={statusVariant[entry.status]}>{entry.status}</Tag></td>
                  <td>{entry.reversalDate ?? "—"}</td>
                  <td>{entry.createdBy}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-1">
                      <Link href="/period-close/journal-entries/create">
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4, color: '#a0a2aa' }}>
                          <Edit size={16} />
                        </button>
                      </Link>
                      {entry.status !== "Approved" && entry.createdBy !== currentUser && (
                        <button onClick={() => handleApprove(entry.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4, color: '#a0a2aa' }}>
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {entry.status === "Draft" && (
                        <button onClick={() => handleDelete(entry.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4, color: '#a0a2aa' }}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 32 }} className="mx-text-secondary">No journal entries match the current filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

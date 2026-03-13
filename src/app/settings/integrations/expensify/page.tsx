"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Select } from "@/components/ui";
import { Receipt } from "lucide-react";

const GL_ACCOUNTS = [
  { value: "2020", label: "2020 - Reimbursements Payable" },
  { value: "6000", label: "6000 - Office Supplies" },
  { value: "6100", label: "6100 - Software & SaaS" },
  { value: "6200", label: "6200 - Travel & Meals" },
  { value: "6300", label: "6300 - Marketing" },
  { value: "6400", label: "6400 - Professional Services" },
  { value: "7000", label: "7000 - Miscellaneous Expense" },
];

const SYNC_HISTORY = [
  { date: "03-13-2026 08:00 AM", records: 18, status: "Success", duration: "8s" },
  { date: "03-12-2026 08:00 AM", records: 23, status: "Success", duration: "9s" },
  { date: "03-11-2026 08:00 AM", records: 15, status: "Success", duration: "7s" },
  { date: "03-10-2026 08:00 AM", records: 20, status: "Success", duration: "8s" },
  { date: "03-09-2026 08:00 AM", records: 12, status: "Failed", duration: "—" },
];

export default function ExpensifyIntegrationPage() {
  const [connected, setConnected] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reimbursementAccount, setReimbursementAccount] = useState("2020");
  const [defaultCategory, setDefaultCategory] = useState("7000");
  const [autoApprove, setAutoApprove] = useState(false);
  const [receiptRequired, setReceiptRequired] = useState(true);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Link href="/settings/integrations" className="hover:text-foreground">Integrations</Link>
          <span>/</span>
          <span className="text-foreground">Expensify</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <Receipt size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Expensify</h1>
              <p className="mt-0.5 text-sm text-muted">Expense management, receipt scanning, and reimbursement automation</p>
            </div>
          </div>
          <div className="flex gap-2">
            {connected ? (
              <Button variant="default" onClick={() => setConnected(false)}>Disconnect</Button>
            ) : (
              <Button onClick={() => setConnected(true)}>Connect Expensify</Button>
            )}
          </div>
        </div>
        {connected && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Connected — Syncs daily
          </div>
        )}
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="mb-2 text-sm font-medium text-foreground">What This Integration Does</h3>
          <p className="text-xs text-muted">
            Imports expense reports, receipt data, and reimbursement requests from Expensify.
            Approved reports are automatically mapped to expense accounts and posted as journal entries.
            Supports policy enforcement, per diem rules, and multi-currency expenses.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="mb-4 text-sm font-medium text-foreground">Configuration</h3>
          <div className="space-y-4">
            <Select label="Reimbursement Liability Account" options={GL_ACCOUNTS} value={reimbursementAccount} onChange={(e) => setReimbursementAccount(e.target.value)} />
            <Select label="Default Expense Category" options={GL_ACCOUNTS} value={defaultCategory} onChange={(e) => setDefaultCategory(e.target.value)} />
            <label className="flex items-center justify-between rounded-md border border-border px-4 py-3 transition-colors hover:bg-sidebar-hover">
              <div>
                <p className="text-sm font-medium text-foreground">Auto-Approve Under $100</p>
                <p className="text-xs text-muted">Automatically approve expense reports under $100</p>
              </div>
              <button type="button" role="switch" aria-checked={autoApprove} onClick={() => setAutoApprove(!autoApprove)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${autoApprove ? "bg-accent" : "bg-border"}`}>
                <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${autoApprove ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </label>
            <label className="flex items-center justify-between rounded-md border border-border px-4 py-3 transition-colors hover:bg-sidebar-hover">
              <div>
                <p className="text-sm font-medium text-foreground">Require Receipts</p>
                <p className="text-xs text-muted">Block sync for expenses missing receipt images</p>
              </div>
              <button type="button" role="switch" aria-checked={receiptRequired} onClick={() => setReceiptRequired(!receiptRequired)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${receiptRequired ? "bg-accent" : "bg-border"}`}>
                <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${receiptRequired ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="mb-4 text-sm font-medium text-foreground">Sync History</h3>
          <div className="rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Records</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {SYNC_HISTORY.map((sync, i) => (
                  <tr key={i} className="transition-colors hover:bg-sidebar-hover">
                    <td className="px-4 py-3 text-muted">{sync.date}</td>
                    <td className="px-4 py-3 text-foreground">{sync.records}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${sync.status === "Success" ? "bg-green-500/15 text-green-400" : "bg-red-500/15 text-red-400"}`}>
                        {sync.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">{sync.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-2 pb-8">
          <Button variant="default" onClick={() => window.history.back()}>Cancel</Button>
          <Button onClick={handleSave}>{saved ? "Saved!" : "Save Settings"}</Button>
        </div>
      </div>
    </div>
  );
}

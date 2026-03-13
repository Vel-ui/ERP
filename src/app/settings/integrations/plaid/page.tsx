"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Select } from "@/components/ui";
import { Landmark, Plus, Trash2 } from "lucide-react";

interface ConnectedAccount {
  id: string;
  institution: string;
  accountName: string;
  mask: string;
  type: string;
  glAccount: string;
  status: "Active" | "Needs Reauth";
}

const GL_ACCOUNTS = [
  { value: "1000", label: "1000 - Cash & Equivalents" },
  { value: "1010", label: "1010 - Chase Operating" },
  { value: "1020", label: "1020 - Chase Savings" },
  { value: "1030", label: "1030 - Mercury Checking" },
  { value: "1040", label: "1040 - SVB Operating" },
];

const INITIAL_ACCOUNTS: ConnectedAccount[] = [
  { id: "acc-1", institution: "Chase", accountName: "Business Checking", mask: "4521", type: "Checking", glAccount: "1010", status: "Active" },
  { id: "acc-2", institution: "Chase", accountName: "Business Savings", mask: "7890", type: "Savings", glAccount: "1020", status: "Active" },
  { id: "acc-3", institution: "Mercury", accountName: "Operating Account", mask: "3456", type: "Checking", glAccount: "1030", status: "Active" },
  { id: "acc-4", institution: "SVB", accountName: "Business Checking", mask: "9012", type: "Checking", glAccount: "1040", status: "Needs Reauth" },
];

const SYNC_HISTORY = [
  { date: "03-13-2026 09:20 AM", records: 312, status: "Success", duration: "28s" },
  { date: "03-12-2026 09:20 AM", records: 287, status: "Success", duration: "25s" },
  { date: "03-11-2026 09:20 AM", records: 305, status: "Success", duration: "27s" },
  { date: "03-10-2026 09:20 AM", records: 298, status: "Success", duration: "26s" },
  { date: "03-09-2026 09:20 AM", records: 0, status: "Failed", duration: "—" },
];

export default function PlaidIntegrationPage() {
  const [connected, setConnected] = useState(true);
  const [saved, setSaved] = useState(false);
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [syncFrequency, setSyncFrequency] = useState("30min");
  const [autoCateg, setAutoCateg] = useState(true);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const handleGLChange = (id: string, value: string) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, glAccount: value } : a)));
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Link href="/settings/integrations" className="hover:text-foreground">Integrations</Link>
          <span>/</span>
          <span className="text-foreground">Plaid</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-600">
              <Landmark size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Plaid</h1>
              <p className="mt-0.5 text-sm text-muted">Secure banking connections for transaction sync and balance monitoring</p>
            </div>
          </div>
          <Button size="sm">
            <Plus size={14} className="mr-1.5 inline" />
            Add Bank Account
          </Button>
        </div>
        {connected && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Connected — {accounts.length} accounts linked
          </div>
        )}
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="mb-2 text-sm font-medium text-foreground">What This Integration Does</h3>
          <p className="text-xs text-muted">
            Connects bank accounts via Plaid&apos;s secure API to import transactions automatically.
            Supports checking, savings, and credit card accounts across 11,000+ financial institutions.
            Transaction data feeds into cash reconciliation and bank-to-book matching workflows.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="mb-4 text-sm font-medium text-foreground">Connected Accounts</h3>
          <div className="space-y-3">
            {accounts.map((acct) => (
              <div key={acct.id} className="flex items-center justify-between rounded-md border border-border px-4 py-3 transition-colors hover:bg-sidebar-hover">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar text-xs font-semibold text-accent">
                    {acct.institution.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {acct.institution} — {acct.accountName}
                      <span className="ml-1 text-muted">••{acct.mask}</span>
                    </p>
                    <p className="text-xs text-muted">{acct.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {acct.status === "Needs Reauth" && (
                    <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-400">
                      Needs Reauth
                    </span>
                  )}
                  <select
                    value={acct.glAccount}
                    onChange={(e) => handleGLChange(acct.id, e.target.value)}
                    className="rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    {GL_ACCOUNTS.map((a) => (
                      <option key={a.value} value={a.value}>{a.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="mb-4 text-sm font-medium text-foreground">Settings</h3>
          <div className="space-y-4">
            <Select
              label="Sync Frequency"
              options={[
                { value: "15min", label: "Every 15 minutes" },
                { value: "30min", label: "Every 30 minutes" },
                { value: "hourly", label: "Hourly" },
                { value: "daily", label: "Daily" },
              ]}
              value={syncFrequency}
              onChange={(e) => setSyncFrequency(e.target.value)}
            />
            <label className="flex items-center justify-between rounded-md border border-border px-4 py-3 transition-colors hover:bg-sidebar-hover">
              <div>
                <p className="text-sm font-medium text-foreground">Auto-Categorize Transactions</p>
                <p className="text-xs text-muted">Use AI to suggest GL accounts for imported transactions</p>
              </div>
              <button type="button" role="switch" aria-checked={autoCateg} onClick={() => setAutoCateg(!autoCateg)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${autoCateg ? "bg-accent" : "bg-border"}`}>
                <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${autoCateg ? "translate-x-5" : "translate-x-0"}`} />
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

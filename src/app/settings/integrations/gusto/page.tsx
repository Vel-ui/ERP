"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Select } from "@/components/ui";
import { DollarSign } from "lucide-react";

const GL_ACCOUNTS = [
  { value: "6200", label: "6200 - Salaries & Wages" },
  { value: "6210", label: "6210 - Payroll Tax Expense" },
  { value: "6220", label: "6220 - Benefits Expense" },
  { value: "6230", label: "6230 - Workers Comp" },
  { value: "2100", label: "2100 - Payroll Liabilities" },
  { value: "2110", label: "2110 - Federal Tax Payable" },
  { value: "2120", label: "2120 - State Tax Payable" },
  { value: "1000", label: "1000 - Cash" },
];

const DEPARTMENTS = [
  { gusto: "Engineering", maximor: "engineering" },
  { gusto: "Sales", maximor: "sales" },
  { gusto: "Marketing", maximor: "marketing" },
  { gusto: "Finance", maximor: "finance" },
  { gusto: "Operations", maximor: "operations" },
  { gusto: "Human Resources", maximor: "hr" },
];

const MAXIMOR_DEPTS = [
  { value: "engineering", label: "Engineering" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "finance", label: "Finance" },
  { value: "operations", label: "Operations" },
  { value: "hr", label: "Human Resources" },
];

const SYNC_HISTORY = [
  { date: "03-13-2026 07:00 AM", records: 87, status: "Success", duration: "18s" },
  { date: "03-06-2026 07:00 AM", records: 87, status: "Success", duration: "17s" },
  { date: "02-27-2026 07:00 AM", records: 85, status: "Success", duration: "16s" },
  { date: "02-20-2026 07:00 AM", records: 85, status: "Success", duration: "17s" },
  { date: "02-13-2026 07:00 AM", records: 82, status: "Failed", duration: "—" },
];

export default function GustoIntegrationPage() {
  const [connected, setConnected] = useState(false);
  const [saved, setSaved] = useState(false);
  const [salaryAccount, setSalaryAccount] = useState("6200");
  const [taxAccount, setTaxAccount] = useState("6210");
  const [benefitsAccount, setBenefitsAccount] = useState("6220");
  const [liabilityAccount, setLiabilityAccount] = useState("2100");
  const [autoPostPayroll, setAutoPostPayroll] = useState(true);
  const [deptMappings, setDeptMappings] = useState(DEPARTMENTS);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const handleDeptChange = (idx: number, value: string) => {
    setDeptMappings((prev) => prev.map((m, i) => (i === idx ? { ...m, maximor: value } : m)));
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Link href="/settings/integrations" className="hover:text-foreground">Integrations</Link>
          <span>/</span>
          <span className="text-foreground">Gusto</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
              <DollarSign size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Gusto</h1>
              <p className="mt-0.5 text-sm text-muted">Payroll processing, tax filing, and benefits administration</p>
            </div>
          </div>
          <div className="flex gap-2">
            {connected ? (
              <Button variant="default" onClick={() => setConnected(false)}>Disconnect</Button>
            ) : (
              <Button onClick={() => setConnected(true)}>Connect Gusto</Button>
            )}
          </div>
        </div>
        {connected && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Connected — Syncs after each payroll run
          </div>
        )}
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="mb-2 text-sm font-medium text-foreground">What This Integration Does</h3>
          <p className="text-xs text-muted">
            Imports payroll runs, tax withholdings, benefits deductions, and department allocations from Gusto.
            Automatically generates journal entries for each payroll run with line-item breakdowns for salaries,
            taxes, and benefits. Supports multi-state payroll and contractor payments.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="mb-4 text-sm font-medium text-foreground">Account Mapping</h3>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Salary Expense" options={GL_ACCOUNTS} value={salaryAccount} onChange={(e) => setSalaryAccount(e.target.value)} />
            <Select label="Payroll Tax Expense" options={GL_ACCOUNTS} value={taxAccount} onChange={(e) => setTaxAccount(e.target.value)} />
            <Select label="Benefits Expense" options={GL_ACCOUNTS} value={benefitsAccount} onChange={(e) => setBenefitsAccount(e.target.value)} />
            <Select label="Payroll Liabilities" options={GL_ACCOUNTS} value={liabilityAccount} onChange={(e) => setLiabilityAccount(e.target.value)} />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="mb-4 text-sm font-medium text-foreground">Department Mapping</h3>
          <div className="rounded-md border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted">
                  <th className="px-4 py-3">Gusto Department</th>
                  <th className="px-4 py-3">Maximor Department</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {deptMappings.map((mapping, idx) => (
                  <tr key={mapping.gusto} className="transition-colors hover:bg-sidebar-hover">
                    <td className="px-4 py-3 text-sm text-foreground">{mapping.gusto}</td>
                    <td className="px-4 py-3">
                      <select
                        value={mapping.maximor}
                        onChange={(e) => handleDeptChange(idx, e.target.value)}
                        className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                      >
                        {MAXIMOR_DEPTS.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-sidebar p-6">
          <label className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Auto-Post Payroll Journal Entries</p>
              <p className="text-xs text-muted">Automatically post JEs after each payroll run syncs</p>
            </div>
            <button type="button" role="switch" aria-checked={autoPostPayroll} onClick={() => setAutoPostPayroll(!autoPostPayroll)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${autoPostPayroll ? "bg-accent" : "bg-border"}`}>
              <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${autoPostPayroll ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </label>
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

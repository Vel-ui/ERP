"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Select } from "@/components/ui";
import { Calculator } from "lucide-react";

const GL_ACCOUNTS = [
  { value: "2200", label: "2200 - Sales Tax Payable" },
  { value: "2210", label: "2210 - VAT Payable" },
  { value: "6800", label: "6800 - Tax Compliance Fees" },
  { value: "4000", label: "4000 - Revenue" },
  { value: "4100", label: "4100 - Subscription Revenue" },
];

const NEXUS_STATES = [
  { state: "California", status: "Active", threshold: "$500K / 200 txns" },
  { state: "New York", status: "Active", threshold: "$500K / 100 txns" },
  { state: "Texas", status: "Active", threshold: "$500K" },
  { state: "Florida", status: "Monitoring", threshold: "$100K" },
  { state: "Washington", status: "Active", threshold: "$100K" },
];

const SYNC_HISTORY = [
  { date: "03-13-2026 09:30 AM", records: 234, status: "Success", duration: "6s" },
  { date: "03-12-2026 09:30 AM", records: 218, status: "Success", duration: "5s" },
  { date: "03-11-2026 09:30 AM", records: 245, status: "Success", duration: "7s" },
  { date: "03-10-2026 09:30 AM", records: 202, status: "Success", duration: "5s" },
  { date: "03-09-2026 09:30 AM", records: 190, status: "Failed", duration: "—" },
];

export default function AnrokIntegrationPage() {
  const [connected, setConnected] = useState(false);
  const [saved, setSaved] = useState(false);
  const [taxPayableAccount, setTaxPayableAccount] = useState("2200");
  const [taxMode, setTaxMode] = useState("invoice");
  const [autoFile, setAutoFile] = useState(false);
  const [exemptionCerts, setExemptionCerts] = useState(true);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Link href="/settings/integrations" className="hover:text-foreground">Integrations</Link>
          <span>/</span>
          <span className="text-foreground">Anrok</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
              <Calculator size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Anrok</h1>
              <p className="mt-0.5 text-sm text-muted">Automated sales tax calculation and compliance for SaaS</p>
            </div>
          </div>
          <div className="flex gap-2">
            {connected ? (
              <Button variant="default" onClick={() => setConnected(false)}>Disconnect</Button>
            ) : (
              <Button onClick={() => setConnected(true)}>Connect Anrok</Button>
            )}
          </div>
        </div>
        {connected && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Connected — Real-time tax calculation
          </div>
        )}
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="mb-2 text-sm font-medium text-foreground">What This Integration Does</h3>
          <p className="text-xs text-muted">
            Calculates sales tax on invoices in real-time based on product taxability, customer location, and
            exemption certificates. Supports nexus tracking, multi-state compliance, and automated filing.
            Built specifically for SaaS and digital goods taxation.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="mb-4 text-sm font-medium text-foreground">Configuration</h3>
          <div className="space-y-4">
            <Select label="Sales Tax Payable Account" options={GL_ACCOUNTS} value={taxPayableAccount} onChange={(e) => setTaxPayableAccount(e.target.value)} />
            <Select
              label="Tax Calculation Mode"
              options={[
                { value: "invoice", label: "Calculate on invoice creation" },
                { value: "payment", label: "Calculate on payment received" },
                { value: "both", label: "Both (accrual + cash basis)" },
              ]}
              value={taxMode}
              onChange={(e) => setTaxMode(e.target.value)}
            />
            {[
              { label: "Auto-File Returns", desc: "Automatically file sales tax returns in registered states", checked: autoFile, toggle: () => setAutoFile(!autoFile) },
              { label: "Exemption Certificate Management", desc: "Validate and store customer exemption certificates", checked: exemptionCerts, toggle: () => setExemptionCerts(!exemptionCerts) },
            ].map((item) => (
              <label key={item.label} className="flex items-center justify-between rounded-md border border-border px-4 py-3 transition-colors hover:bg-sidebar-hover">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted">{item.desc}</p>
                </div>
                <button type="button" role="switch" aria-checked={item.checked} onClick={item.toggle}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${item.checked ? "bg-accent" : "bg-border"}`}>
                  <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${item.checked ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="mb-4 text-sm font-medium text-foreground">Nexus Tracking</h3>
          <div className="rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted">
                  <th className="px-4 py-3">State</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Threshold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {NEXUS_STATES.map((ns) => (
                  <tr key={ns.state} className="transition-colors hover:bg-sidebar-hover">
                    <td className="px-4 py-3 text-foreground">{ns.state}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ns.status === "Active" ? "bg-green-500/15 text-green-400" : "bg-amber-500/15 text-amber-400"}`}>
                        {ns.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted">{ns.threshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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

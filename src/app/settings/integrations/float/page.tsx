"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Select } from "@/components/ui";
import { TrendingUp } from "lucide-react";

const BANK_ACCOUNTS = [
  { value: "chase-checking", label: "Chase Checking ••4521" },
  { value: "mercury", label: "Mercury ••7890" },
  { value: "svb", label: "SVB Operating ••3456" },
];

const SYNC_HISTORY = [
  { date: "03-13-2026 06:00 AM", records: 156, status: "Success", duration: "22s" },
  { date: "03-12-2026 06:00 AM", records: 148, status: "Success", duration: "20s" },
  { date: "03-11-2026 06:00 AM", records: 162, status: "Success", duration: "24s" },
  { date: "03-10-2026 06:00 AM", records: 0, status: "Failed", duration: "—" },
  { date: "03-09-2026 06:00 AM", records: 140, status: "Success", duration: "19s" },
];

export default function FloatIntegrationPage() {
  const [connected, setConnected] = useState(false);
  const [saved, setSaved] = useState(false);
  const [forecastHorizon, setForecastHorizon] = useState("90");
  const [primaryAccount, setPrimaryAccount] = useState("chase-checking");
  const [includeAR, setIncludeAR] = useState(true);
  const [includeAP, setIncludeAP] = useState(true);
  const [includePayroll, setIncludePayroll] = useState(true);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Link href="/settings/integrations" className="hover:text-foreground">Integrations</Link>
          <span>/</span>
          <span className="text-foreground">Float</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <TrendingUp size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Float</h1>
              <p className="mt-0.5 text-sm text-muted">Cash flow forecasting and scenario planning</p>
            </div>
          </div>
          <div className="flex gap-2">
            {connected ? (
              <Button variant="default" onClick={() => setConnected(false)}>Disconnect</Button>
            ) : (
              <Button onClick={() => setConnected(true)}>Connect Float</Button>
            )}
          </div>
        </div>
        {connected && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Connected — Syncs daily at 6:00 AM
          </div>
        )}
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="mb-2 text-sm font-medium text-foreground">What This Integration Does</h3>
          <p className="text-xs text-muted">
            Syncs bank balances, AR forecasts, AP schedules, and payroll projections into Float for cash flow
            forecasting. Enables scenario modeling with real-time data from your accounting system. Supports
            multi-entity consolidation and currency conversion for international operations.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="mb-4 text-sm font-medium text-foreground">Configuration</h3>
          <div className="space-y-4">
            <Select label="Primary Bank Account" options={BANK_ACCOUNTS} value={primaryAccount} onChange={(e) => setPrimaryAccount(e.target.value)} />
            <Select
              label="Forecast Horizon"
              options={[
                { value: "30", label: "30 days" },
                { value: "60", label: "60 days" },
                { value: "90", label: "90 days" },
                { value: "180", label: "180 days" },
                { value: "365", label: "12 months" },
              ]}
              value={forecastHorizon}
              onChange={(e) => setForecastHorizon(e.target.value)}
            />
            {[
              { label: "Include AR Receivables", desc: "Factor outstanding invoices into cash inflow projections", checked: includeAR, toggle: () => setIncludeAR(!includeAR) },
              { label: "Include AP Payables", desc: "Factor upcoming bills into cash outflow projections", checked: includeAP, toggle: () => setIncludeAP(!includeAP) },
              { label: "Include Payroll", desc: "Include scheduled payroll runs in forecasts", checked: includePayroll, toggle: () => setIncludePayroll(!includePayroll) },
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

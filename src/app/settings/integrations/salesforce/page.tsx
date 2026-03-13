"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Select } from "@/components/ui";
import { Users } from "lucide-react";

const GL_ACCOUNTS = [
  { value: "1200", label: "1200 - Accounts Receivable" },
  { value: "4000", label: "4000 - Revenue" },
  { value: "4100", label: "4100 - Subscription Revenue" },
  { value: "4200", label: "4200 - Services Revenue" },
  { value: "4300", label: "4300 - Deferred Revenue" },
];

const OBJECT_MAPPINGS = [
  { sfObject: "Opportunity (Closed Won)", maximorObject: "AR Invoice", direction: "SF → Maximor" },
  { sfObject: "Account", maximorObject: "Customer", direction: "Bi-directional" },
  { sfObject: "Contact", maximorObject: "Customer Contact", direction: "SF → Maximor" },
  { sfObject: "Product", maximorObject: "Product / Service", direction: "Maximor → SF" },
  { sfObject: "Quote", maximorObject: "Estimate", direction: "Bi-directional" },
];

const SYNC_HISTORY = [
  { date: "03-13-2026 08:30 AM", records: 45, status: "Success", duration: "15s" },
  { date: "03-12-2026 08:30 AM", records: 38, status: "Success", duration: "12s" },
  { date: "03-11-2026 08:30 AM", records: 52, status: "Success", duration: "18s" },
  { date: "03-10-2026 08:30 AM", records: 41, status: "Failed", duration: "—" },
  { date: "03-09-2026 08:30 AM", records: 36, status: "Success", duration: "11s" },
];

export default function SalesforceIntegrationPage() {
  const [connected, setConnected] = useState(false);
  const [saved, setSaved] = useState(false);
  const [revenueAccount, setRevenueAccount] = useState("4100");
  const [deferredAccount, setDeferredAccount] = useState("4300");
  const [syncDirection, setSyncDirection] = useState("bidirectional");
  const [autoCreateInvoice, setAutoCreateInvoice] = useState(true);
  const [syncContacts, setSyncContacts] = useState(true);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Link href="/settings/integrations" className="hover:text-foreground">Integrations</Link>
          <span>/</span>
          <span className="text-foreground">Salesforce</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
              <Users size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Salesforce</h1>
              <p className="mt-0.5 text-sm text-muted">CRM integration with bi-directional sync for deals, accounts, and contacts</p>
            </div>
          </div>
          <div className="flex gap-2">
            {connected ? (
              <Button variant="default" onClick={() => setConnected(false)}>Disconnect</Button>
            ) : (
              <Button onClick={() => setConnected(true)}>Connect Salesforce</Button>
            )}
          </div>
        </div>
        {connected && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            Connected — Syncs every 30 min
          </div>
        )}
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="mb-2 text-sm font-medium text-foreground">What This Integration Does</h3>
          <p className="text-xs text-muted">
            Bi-directional sync between Salesforce CRM and Maximor. Closed Won opportunities automatically
            generate AR invoices. Customer and product data flows both ways, keeping sales and finance aligned.
            Supports custom field mapping, multi-currency deals, and subscription revenue scheduling.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="mb-4 text-sm font-medium text-foreground">Account Mapping</h3>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Revenue Account" options={GL_ACCOUNTS} value={revenueAccount} onChange={(e) => setRevenueAccount(e.target.value)} />
            <Select label="Deferred Revenue Account" options={GL_ACCOUNTS} value={deferredAccount} onChange={(e) => setDeferredAccount(e.target.value)} />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="mb-4 text-sm font-medium text-foreground">Object Mapping</h3>
          <div className="rounded-md border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted">
                  <th className="px-4 py-3">Salesforce Object</th>
                  <th className="px-4 py-3">Maximor Object</th>
                  <th className="px-4 py-3">Direction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {OBJECT_MAPPINGS.map((mapping) => (
                  <tr key={mapping.sfObject} className="transition-colors hover:bg-sidebar-hover">
                    <td className="px-4 py-3 text-foreground">{mapping.sfObject}</td>
                    <td className="px-4 py-3 text-foreground">{mapping.maximorObject}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        mapping.direction.includes("Bi") ? "bg-blue-500/15 text-blue-400" : "bg-gray-500/15 text-gray-400"
                      }`}>
                        {mapping.direction}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="mb-4 text-sm font-medium text-foreground">Sync Settings</h3>
          <div className="space-y-3">
            <Select
              label="Sync Direction"
              options={[
                { value: "bidirectional", label: "Bi-directional" },
                { value: "sf-to-maximor", label: "Salesforce → Maximor only" },
                { value: "maximor-to-sf", label: "Maximor → Salesforce only" },
              ]}
              value={syncDirection}
              onChange={(e) => setSyncDirection(e.target.value)}
            />
            {[
              { label: "Auto-Create Invoice on Closed Won", desc: "Generate AR invoice when opportunity is marked Closed Won", checked: autoCreateInvoice, toggle: () => setAutoCreateInvoice(!autoCreateInvoice) },
              { label: "Sync Contacts", desc: "Keep contact data in sync between Salesforce and Maximor", checked: syncContacts, toggle: () => setSyncContacts(!syncContacts) },
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

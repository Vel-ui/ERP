"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Tag } from "@/components/ui";
import { RefreshCw, Settings, Server, Landmark, DollarSign, Users, Receipt } from "lucide-react";

interface DataSource {
  id: string;
  name: string;
  category: string;
  description: string;
  status: "Connected" | "Disconnected" | "Syncing";
  lastSync: string;
  recordsSynced: string;
  syncFrequency: string;
  icon: React.ElementType;
}

const DATA_SOURCES: DataSource[] = [
  {
    id: "ds-1", name: "NetSuite ERP", category: "ERP", description: "Primary ERP — GL, AP, AR, and fixed assets",
    status: "Connected", lastSync: "03-13-2026 09:15 AM", recordsSynced: "48,320", syncFrequency: "Every 15 min", icon: Server,
  },
  {
    id: "ds-2", name: "Chase Banking", category: "Banking", description: "Operating and savings accounts via Plaid",
    status: "Connected", lastSync: "03-13-2026 09:20 AM", recordsSynced: "12,934", syncFrequency: "Every 30 min", icon: Landmark,
  },
  {
    id: "ds-3", name: "Gusto Payroll", category: "Payroll", description: "Payroll runs, taxes, benefits, and department allocations",
    status: "Syncing", lastSync: "03-13-2026 08:45 AM", recordsSynced: "3,456", syncFrequency: "Daily", icon: DollarSign,
  },
  {
    id: "ds-4", name: "Salesforce CRM", category: "CRM", description: "Closed Won opportunities and customer data",
    status: "Connected", lastSync: "03-12-2026 11:00 PM", recordsSynced: "2,845", syncFrequency: "Every 30 min", icon: Users,
  },
  {
    id: "ds-5", name: "Avalara Tax", category: "Tax", description: "Tax calculations and compliance data",
    status: "Connected", lastSync: "03-12-2026 06:00 PM", recordsSynced: "1,230", syncFrequency: "On-demand", icon: Receipt,
  },
  {
    id: "ds-6", name: "Stripe Payments", category: "Payments", description: "Payment transactions, subscriptions, and billing",
    status: "Connected", lastSync: "03-13-2026 09:10 AM", recordsSynced: "8,456", syncFrequency: "Real-time", icon: DollarSign,
  },
  {
    id: "ds-7", name: "Ramp Expenses", category: "Expenses", description: "Corporate card charges, bills, and reimbursements",
    status: "Disconnected", lastSync: "03-10-2026 04:00 PM", recordsSynced: "2,100", syncFrequency: "Hourly", icon: Receipt,
  },
];

function statusVariant(status: string): "success" | "processing" | "error" {
  if (status === "Connected") return "success";
  if (status === "Syncing") return "processing";
  return "error";
}

export default function CDHIntegrationsPage() {
  const [filter, setFilter] = useState<"all" | "Connected" | "Disconnected" | "Syncing">("all");

  const filtered = filter === "all" ? DATA_SOURCES : DATA_SOURCES.filter((ds) => ds.status === filter);
  const connectedCount = DATA_SOURCES.filter((ds) => ds.status === "Connected").length;
  const syncingCount = DATA_SOURCES.filter((ds) => ds.status === "Syncing").length;

  return (
    <div className="p-8 space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <Link href="/central-data-hub" className="hover:text-foreground">Central Data Hub</Link>
          <span>/</span>
          <span className="text-foreground">Integrations</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mx-h1">Data Source Integrations</h1>
            <p className="mx-text-secondary mt-1">Manage connected data sources and sync health</p>
          </div>
          <Button size="sm">+ Add Source</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-xs text-muted">Connected</p>
          <p className="text-2xl font-semibold text-green-600">{connectedCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-xs text-muted">Syncing</p>
          <p className="text-2xl font-semibold text-blue-500">{syncingCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-xs text-muted">Total Sources</p>
          <p className="text-2xl font-semibold text-foreground">{DATA_SOURCES.length}</p>
        </div>
      </div>

      <div className="flex gap-1">
        {(["all", "Connected", "Syncing", "Disconnected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f ? "bg-accent text-white" : "bg-sidebar text-muted hover:bg-sidebar-hover hover:text-foreground"
            }`}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map((ds) => (
          <div key={ds.id} className="rounded-lg border border-border bg-white p-5 transition-colors hover:border-accent/30">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <ds.icon size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{ds.name}</h3>
                    <Tag variant={statusVariant(ds.status)}>{ds.status}</Tag>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">{ds.description}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
                    <span>Last sync: {ds.lastSync}</span>
                    <span>Records: {ds.recordsSynced}</span>
                    <span>Frequency: {ds.syncFrequency}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="default" size="sm">
                  <RefreshCw size={12} className="mr-1 inline" />
                  Sync Now
                </Button>
                <Button variant="text" size="sm">
                  <Settings size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted text-sm">No sources match the selected filter</div>
      )}
    </div>
  );
}

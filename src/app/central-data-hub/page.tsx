"use client";

import Link from "next/link";
import { Database, BookOpen, GitBranch, Plug, RefreshCw, CheckCircle, Layers, BarChart3 } from "lucide-react";

const stats = [
  { label: "Total Data Sources", value: "12", icon: Database, color: "text-blue-500" },
  { label: "Mapped Accounts", value: "1,247", icon: GitBranch, color: "text-green-500" },
  { label: "Last Sync", value: "5 min ago", icon: RefreshCw, color: "text-amber-500" },
  { label: "Data Quality Score", value: "96.4%", icon: BarChart3, color: "text-purple-500" },
];

const subPages = [
  {
    title: "Unified Ledger",
    description: "Consolidated general ledger across all entities and source systems",
    href: "/central-data-hub/unified-ledger",
    icon: BookOpen,
    stat: "48,320 entries",
  },
  {
    title: "Data Catalog",
    description: "Browse all available data objects, schemas, and record counts",
    href: "/central-data-hub/data-catalog",
    icon: Layers,
    stat: "8 objects",
  },
  {
    title: "Mapping",
    description: "Map source system accounts to the Maximor chart of accounts",
    href: "/central-data-hub/mapping",
    icon: GitBranch,
    stat: "1,247 mapped",
  },
  {
    title: "Integrations",
    description: "Manage connected data sources, sync schedules, and health status",
    href: "/central-data-hub/integrations",
    icon: Plug,
    stat: "5 connected",
  },
];

export default function CentralDataHubPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="mx-h1">Central Data Hub</h1>
        <p className="mx-text-secondary mt-1">
          Unified data platform connecting all financial systems
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="mx-card-white rounded-lg p-5">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar ${s.color}`}>
                <s.icon size={20} />
              </div>
              <div>
                <p className="text-xs text-muted">{s.label}</p>
                <p className="text-xl font-semibold text-foreground">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mx-h3 mb-4">Explore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {subPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="group mx-card-white rounded-lg p-6 transition-colors hover:border-accent/40"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <page.icon size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                      {page.title}
                    </h3>
                    <span className="text-xs text-muted">{page.stat}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted">{page.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-card-white rounded-lg p-6">
        <h2 className="mx-h3 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { action: "Full sync completed", source: "NetSuite ERP", time: "5 min ago", status: "success" },
            { action: "12 new transactions imported", source: "Chase Banking", time: "15 min ago", status: "success" },
            { action: "Account mapping updated", source: "Payroll - Gusto", time: "1 hour ago", status: "success" },
            { action: "Schema change detected", source: "Salesforce CRM", time: "3 hours ago", status: "warning" },
            { action: "Sync failed — retrying", source: "Brex Corporate Card", time: "6 hours ago", status: "error" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-md border border-border px-4 py-3">
              <div className="flex items-center gap-3">
                <CheckCircle
                  size={16}
                  className={
                    item.status === "success"
                      ? "text-green-500"
                      : item.status === "warning"
                      ? "text-amber-500"
                      : "text-red-500"
                  }
                />
                <div>
                  <p className="text-sm text-foreground">{item.action}</p>
                  <p className="text-xs text-muted">{item.source}</p>
                </div>
              </div>
              <span className="text-xs text-muted">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

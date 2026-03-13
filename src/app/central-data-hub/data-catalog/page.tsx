"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui";
import { Database, FileText, Users, Building2, Receipt, ClipboardList, Landmark, ArrowRightLeft, Search } from "lucide-react";

interface CatalogItem {
  name: string;
  description: string;
  recordCount: string;
  lastUpdated: string;
  fields: number;
  icon: React.ElementType;
  category: string;
}

const CATALOG: CatalogItem[] = [
  { name: "GL Transactions", description: "General ledger transaction entries across all entities", recordCount: "48,320", lastUpdated: "03-13-2026 09:15 AM", fields: 14, icon: Database, category: "Core" },
  { name: "Chart of Accounts", description: "Unified chart of accounts with hierarchy and mappings", recordCount: "1,247", lastUpdated: "03-12-2026 02:30 PM", fields: 8, icon: ClipboardList, category: "Core" },
  { name: "Customers", description: "Customer master data synced from CRM and billing", recordCount: "2,845", lastUpdated: "03-13-2026 08:00 AM", fields: 12, icon: Users, category: "Master Data" },
  { name: "Vendors", description: "Vendor master data from AP and procurement systems", recordCount: "1,102", lastUpdated: "03-12-2026 11:45 AM", fields: 11, icon: Building2, category: "Master Data" },
  { name: "Invoices", description: "AR invoices including line items and payment status", recordCount: "8,456", lastUpdated: "03-13-2026 09:00 AM", fields: 18, icon: Receipt, category: "Transactions" },
  { name: "Bills", description: "AP bills and vendor invoices awaiting payment", recordCount: "3,210", lastUpdated: "03-13-2026 07:30 AM", fields: 16, icon: FileText, category: "Transactions" },
  { name: "Journal Entries", description: "Manual and automated journal entries with approval status", recordCount: "5,678", lastUpdated: "03-12-2026 06:00 PM", fields: 10, icon: ArrowRightLeft, category: "Transactions" },
  { name: "Bank Transactions", description: "Imported bank transactions from all connected accounts", recordCount: "12,934", lastUpdated: "03-13-2026 09:20 AM", fields: 9, icon: Landmark, category: "Banking" },
];

export default function DataCatalogPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = ["all", ...Array.from(new Set(CATALOG.map((c) => c.category)))];

  const filtered = CATALOG.filter((item) => {
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <Link href="/central-data-hub" className="hover:text-foreground">Central Data Hub</Link>
          <span>/</span>
          <span className="text-foreground">Data Catalog</span>
        </div>
        <h1 className="mx-h1">Data Catalog</h1>
        <p className="mx-text-secondary mt-1">Browse all available data objects, schemas, and record counts</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="w-64">
          <Input placeholder="Search catalog…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                categoryFilter === cat
                  ? "bg-accent text-white"
                  : "bg-sidebar text-muted hover:bg-sidebar-hover hover:text-foreground"
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div
            key={item.name}
            className="group rounded-lg border border-border bg-white p-5 transition-all hover:border-accent/40 hover:shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <item.icon size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{item.name}</h3>
                <span className="text-[10px] font-medium text-muted uppercase tracking-wider">{item.category}</span>
              </div>
            </div>
            <p className="text-xs text-muted mb-4 line-clamp-2">{item.description}</p>
            <div className="space-y-2 border-t border-border pt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Records</span>
                <span className="font-semibold text-foreground">{item.recordCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Fields</span>
                <span className="font-medium text-foreground">{item.fields}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted">Updated</span>
                <span className="text-muted">{item.lastUpdated}</span>
              </div>
            </div>
            <button className="mt-3 w-full rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-sidebar-hover hover:text-foreground">
              View Schema →
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted">
          <Search size={24} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No data objects match your search</p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { CreditCard, Search, Info } from "lucide-react";
import { Input, Select, Tag } from "@/components/ui";

interface Charge {
  id: string;
  date: string;
  description: string;
  vendor: string;
  amount: number;
  source: "Ramp" | "Brex" | "Expensify";
  status: "pending" | "matched";
}

const initialCharges: Charge[] = [
  { id: "CHG-001", date: "2026-03-10", description: "Figma Team Plan - Monthly", vendor: "Figma Inc.", amount: 75.0, source: "Ramp", status: "matched" },
  { id: "CHG-002", date: "2026-03-09", description: "Slack Business+ Subscription", vendor: "Slack Technologies", amount: 252.0, source: "Ramp", status: "pending" },
  { id: "CHG-003", date: "2026-03-08", description: "Uber Business - Team Rides", vendor: "Uber Technologies", amount: 347.82, source: "Brex", status: "pending" },
  { id: "CHG-004", date: "2026-03-07", description: "Client Dinner - Q1 Review", vendor: "The Capital Grille", amount: 486.50, source: "Expensify", status: "pending" },
  { id: "CHG-005", date: "2026-03-06", description: "Notion Team Workspace", vendor: "Notion Labs", amount: 120.0, source: "Ramp", status: "matched" },
  { id: "CHG-006", date: "2026-03-05", description: "DoorDash - Team Lunch", vendor: "DoorDash Inc.", amount: 189.25, source: "Brex", status: "pending" },
  { id: "CHG-007", date: "2026-03-04", description: "GitHub Enterprise", vendor: "GitHub Inc.", amount: 441.0, source: "Ramp", status: "matched" },
];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

const sourceVariant: Record<string, "success" | "warning" | "processing"> = {
  Ramp: "success",
  Brex: "warning",
  Expensify: "processing",
};

export default function ChargesPage() {
  const [charges] = useState<Charge[]>(initialCharges);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const filtered = charges.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (sourceFilter !== "all" && c.source !== sourceFilter) return false;
    if (!searchText) return true;
    const q = searchText.toLowerCase();
    return c.description.toLowerCase().includes(q) || c.vendor.toLowerCase().includes(q);
  });

  const pendingCount = charges.filter((c) => c.status === "pending").length;
  const pendingTotal = charges.filter((c) => c.status === "pending").reduce((s, c) => s + c.amount, 0);
  const matchedCount = charges.filter((c) => c.status === "matched").length;

  return (
    <div style={{ padding: 24, background: '#f9f9f9' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Charges</h1>
            <p className="mx-text-secondary mt-1">Charges synced from corporate card and expense integrations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          <div className="mx-card" style={{ padding: 16 }}>
            <p className="mx-text-secondary" style={{ fontSize: 13 }}>Total Charges</p>
            <p style={{ fontSize: 20, fontWeight: 600, color: '#2D2926', marginTop: 4 }}>{charges.length}</p>
          </div>
          <div className="mx-card" style={{ padding: 16 }}>
            <p className="mx-text-secondary" style={{ fontSize: 13 }}>Pending Review</p>
            <p style={{ fontSize: 20, fontWeight: 600, color: '#e8bf1b', marginTop: 4 }}>{pendingCount}</p>
            <p className="mx-text-secondary" style={{ fontSize: 12 }}>{formatCurrency(pendingTotal)}</p>
          </div>
          <div className="mx-card" style={{ padding: 16 }}>
            <p className="mx-text-secondary" style={{ fontSize: 13 }}>Matched</p>
            <p style={{ fontSize: 20, fontWeight: 600, color: '#067f54', marginTop: 4 }}>{matchedCount}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-4 mb-4">
          <div style={{ width: 288 }}><Input placeholder="Search charges…" value={searchText} onChange={(e) => setSearchText(e.target.value)} /></div>
          <div style={{ width: 160 }}>
            <Select options={[{ value: "all", label: "All Statuses" }, { value: "pending", label: "Pending" }, { value: "matched", label: "Matched" }]} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
          </div>
          <div style={{ width: 160 }}>
            <Select options={[{ value: "all", label: "All Sources" }, { value: "Ramp", label: "Ramp" }, { value: "Brex", label: "Brex" }, { value: "Expensify", label: "Expensify" }]} value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} />
          </div>
        </div>

        <div className="mx-table-container">
          <table className="mx-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Vendor</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center' }}>Source</th>
                <th style={{ textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((charge) => (
                <tr key={charge.id}>
                  <td>{charge.date}</td>
                  <td style={{ color: '#2D2926' }}>{charge.description}</td>
                  <td>{charge.vendor}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#2D2926' }}>{formatCurrency(charge.amount)}</td>
                  <td style={{ textAlign: 'center' }}><Tag variant={sourceVariant[charge.source]}>{charge.source}</Tag></td>
                  <td style={{ textAlign: 'center' }}>
                    <Tag variant={charge.status === "matched" ? "success" : "warning"}>
                      {charge.status.charAt(0).toUpperCase() + charge.status.slice(1)}
                    </Tag>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32 }} className="mx-text-secondary">No charges found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mx-card flex items-center gap-2 mt-4" style={{ padding: '12px 16px' }}>
          <Info size={16} style={{ color: '#a0a2aa', flexShrink: 0 }} />
          <p className="mx-text-secondary" style={{ fontSize: 12 }}>
            Charges are automatically synced from connected integrations. Manage connections in{" "}
            <a href="/settings/integrations" style={{ color: '#154738', textDecoration: 'underline' }}>Settings &rarr; Integrations</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

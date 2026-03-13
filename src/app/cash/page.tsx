"use client";

import Link from "next/link";
import { Landmark, ArrowRightLeft, BarChart3, Shield, AlertTriangle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { Tag } from "@/components/ui";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const stats = [
  { label: "Total Cash Balance", value: fmt(847250.00), icon: Landmark, color: "#2D2926" },
  { label: "Unmatched Transactions", value: "12", icon: AlertTriangle, color: "#e8bf1b" },
  { label: "Matched This Month", value: "48", icon: CheckCircle, color: "#067f54" },
  { label: "Reconciliation Rate", value: "80%", icon: TrendingUp, color: "#154738" },
];

const quickLinks = [
  { href: "/cash/reconciliation", label: "Reconciliation", icon: ArrowRightLeft, desc: "Match bank and book transactions" },
  { href: "/cash/reporting", label: "Reporting", icon: BarChart3, desc: "Cash flow reports and analytics" },
  { href: "/cash/policies", label: "Policies", icon: Shield, desc: "Manage cash handling rules" },
];

const recentActivity = [
  { id: 1, date: "03-10-2026", description: "Bank reconciliation completed", account: "Chase Checking ••4521", status: "Completed" },
  { id: 2, date: "03-08-2026", description: "12 transactions auto-matched", account: "Chase Checking ••4521", status: "Completed" },
  { id: 3, date: "03-07-2026", description: "Wire transfer received - Acme Corp", account: "Mercury ••7890", status: "Completed" },
  { id: 4, date: "03-06-2026", description: "Intercompany transfer flagged", account: "Chase Checking ••4521", status: "Pending Review" },
  { id: 5, date: "03-05-2026", description: "Monthly reconciliation started", account: "Mercury ••7890", status: "In Progress" },
];

const bankAccounts = [
  { name: "Chase Checking ••4521", balance: fmt(562750.00), unmatched: 8, lastRecon: "03-10-2026" },
  { name: "Mercury ••7890", balance: fmt(284500.00), unmatched: 4, lastRecon: "03-08-2026" },
];

function statusVariant(status: string): "success" | "warning" | "processing" | "default" {
  const map: Record<string, "success" | "warning" | "processing" | "default"> = {
    Completed: "success",
    "Pending Review": "warning",
    "In Progress": "processing",
  };
  return map[status] ?? "default";
}

export default function CashPage() {
  return (
    <div style={{ padding: 24, background: "#f9f9f9" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Cash</h1>
            <p className="mx-text-secondary mt-1">Bank reconciliation, cash management, and reporting</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="mx-card" style={{ padding: 20 }}>
              <div className="flex items-center gap-2 mb-2">
                <s.icon size={16} style={{ color: "var(--mx-primary)" }} />
                <span className="mx-text-secondary" style={{ fontSize: 14 }}>{s.label}</span>
              </div>
              <p style={{ fontSize: 24, fontWeight: 600, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          {quickLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="mx-card mx-card-hoverable"
              style={{ padding: 20, display: "block", textDecoration: "none" }}
            >
              <div className="flex items-center gap-2 mb-1">
                <l.icon size={16} style={{ color: "var(--mx-primary)" }} />
                <span style={{ fontWeight: 500, color: "#2D2926" }}>{l.label}</span>
              </div>
              <p className="mx-text-secondary" style={{ fontSize: 14 }}>{l.desc}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Bank Accounts</h2>
            <div className="space-y-4">
              {bankAccounts.map((acct) => (
                <div key={acct.name} className="mx-card" style={{ padding: 20 }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p style={{ fontWeight: 500 }}>{acct.name}</p>
                      <p style={{ fontSize: 24, fontWeight: 600, marginTop: 4 }}>{acct.balance}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      {acct.unmatched > 0 ? (
                        <Tag variant="warning">{acct.unmatched} unmatched</Tag>
                      ) : (
                        <Tag variant="success">All matched</Tag>
                      )}
                      <p className="mx-text-secondary mt-2" style={{ fontSize: 13 }}>Last recon: {acct.lastRecon}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontSize: 18, fontWeight: 500 }}>Recent Activity</h2>
              <Link href="/cash/reconciliation" style={{ fontSize: 14, color: "var(--mx-primary)", textDecoration: "none" }}>
                View all →
              </Link>
            </div>
            <div className="mx-table-container">
              <table className="mx-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Activity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((a) => (
                    <tr key={a.id}>
                      <td className="mx-text-secondary">{a.date}</td>
                      <td>
                        <p style={{ fontWeight: 500, fontSize: 14 }}>{a.description}</p>
                        <p className="mx-text-secondary" style={{ fontSize: 12 }}>{a.account}</p>
                      </td>
                      <td>
                        <Tag variant={statusVariant(a.status)}>{a.status}</Tag>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

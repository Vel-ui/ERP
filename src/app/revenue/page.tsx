"use client";

import Link from "next/link";
import { DollarSign, Clock, TrendingUp, AlertTriangle, Users, Package, FileText, Receipt, CreditCard } from "lucide-react";
import { Tag } from "@/components/ui";
import {
  MOCK_AR_CUSTOMERS,
  MOCK_AR_PRODUCTS,
  MOCK_AR_CONTRACTS,
  MOCK_AR_INVOICES,
  MOCK_AR_CREDIT_MEMOS,
} from "@/lib/mock-data";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

function statusVariant(status: string): "success" | "warning" | "error" | "default" {
  const map: Record<string, "success" | "warning" | "error" | "default"> = {
    Paid: "success",
    Active: "success",
    Unpaid: "warning",
    "Pending Review": "warning",
    Unbilled: "default",
    Overdue: "error",
    Inactive: "default",
  };
  return map[status] ?? "default";
}

export default function RevenuePage() {
  const totalOutstanding = MOCK_AR_INVOICES.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);
  const overdueAmount = MOCK_AR_INVOICES.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);
  const paidThisMonth = MOCK_AR_INVOICES.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const avgDaysToPay = 34;

  const stats = [
    { label: "Total Outstanding", value: fmt(totalOutstanding), icon: DollarSign, color: "#2D2926" },
    { label: "Overdue", value: fmt(overdueAmount), icon: AlertTriangle, color: "#f03c46" },
    { label: "Collected (Paid)", value: fmt(paidThisMonth), icon: TrendingUp, color: "#067f54" },
    { label: "Avg Days to Pay", value: `${avgDaysToPay} days`, icon: Clock, color: "#2D2926" },
  ];

  const links = [
    { href: "/revenue/customers", label: "Customers", icon: Users, count: MOCK_AR_CUSTOMERS.filter((c) => c.status === "Active").length, desc: "active customers" },
    { href: "/revenue/products", label: "Products", icon: Package, count: MOCK_AR_PRODUCTS.filter((p) => p.status === "Active").length, desc: "active products" },
    { href: "/revenue/contracts", label: "Contracts", icon: FileText, count: MOCK_AR_CONTRACTS.filter((c) => c.status === "Active").length, desc: "active contracts" },
    { href: "/revenue/invoices", label: "Invoices", icon: Receipt, count: MOCK_AR_INVOICES.length, desc: "total invoices" },
    { href: "/revenue/credit-memos", label: "Credit Memos", icon: CreditCard, count: MOCK_AR_CREDIT_MEMOS.length, desc: "total memos" },
  ];

  const recentInvoices = [...MOCK_AR_INVOICES].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div style={{ padding: 24, background: "#f9f9f9" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Revenue</h1>
            <p className="mx-text-secondary mt-1">Manage customers, products, contracts, and billing</p>
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

        <div className="mb-8">
          <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {links.map((l) => (
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
                <p className="mx-text-secondary" style={{ fontSize: 14 }}>
                  {l.count} {l.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontSize: 18, fontWeight: 500 }}>Recent Invoices</h2>
            <Link href="/revenue/invoices" style={{ fontSize: 14, color: "var(--mx-primary)", textDecoration: "none" }}>
              View all →
            </Link>
          </div>
          <div className="mx-table-container">
            <table className="mx-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((inv) => (
                  <tr key={inv.id}>
                    <td style={{ fontWeight: 500 }}>{inv.invoiceNumber}</td>
                    <td>{inv.customerName}</td>
                    <td className="mx-text-secondary">{inv.date}</td>
                    <td>{fmt(inv.amount)}</td>
                    <td>
                      <Tag variant={statusVariant(inv.status)}>{inv.status}</Tag>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>AR Aging Summary</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Current (0-30 days)", amount: 18000, color: "#067f54" },
              { label: "31-60 days", amount: 12500, color: "#e8bf1b" },
              { label: "61-90 days", amount: 0, color: "#f5a623" },
              { label: "90+ days", amount: 60750, color: "#f03c46" },
            ].map((bucket) => (
              <div key={bucket.label} className="mx-card" style={{ padding: 16, borderLeft: `4px solid ${bucket.color}` }}>
                <p className="mx-text-secondary" style={{ fontSize: 14 }}>{bucket.label}</p>
                <p style={{ fontSize: 18, fontWeight: 600, marginTop: 4 }}>{fmt(bucket.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

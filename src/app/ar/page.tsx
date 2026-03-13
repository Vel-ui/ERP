"use client";

import Link from "next/link";
import {
  MOCK_AR_CUSTOMERS,
  MOCK_AR_PRODUCTS,
  MOCK_AR_CONTRACTS,
  MOCK_AR_INVOICES,
  MOCK_AR_CREDIT_MEMOS,
} from "@/lib/mock-data";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

export default function ARPage() {
  const totalOutstanding = MOCK_AR_INVOICES.filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);
  const overdueAmount = MOCK_AR_INVOICES.filter((i) => i.status === "Overdue").reduce((s, i) => s + i.amount, 0);
  const paidThisMonth = MOCK_AR_INVOICES.filter((i) => i.status === "Paid").reduce((s, i) => s + i.amount, 0);
  const avgDaysToPay = 34;

  const stats = [
    { label: "Total Outstanding", value: fmt(totalOutstanding), color: "text-foreground" },
    { label: "Overdue", value: fmt(overdueAmount), color: "text-red-400" },
    { label: "Collected (Paid)", value: fmt(paidThisMonth), color: "text-emerald-400" },
    { label: "Avg Days to Pay", value: `${avgDaysToPay} days`, color: "text-foreground" },
  ];

  const links = [
    { href: "/ar/customers", label: "Customers", count: MOCK_AR_CUSTOMERS.filter((c) => c.status === "Active").length, desc: "active customers" },
    { href: "/ar/products", label: "Products", count: MOCK_AR_PRODUCTS.filter((p) => p.status === "Active").length, desc: "active products" },
    { href: "/ar/contracts", label: "Contracts", count: MOCK_AR_CONTRACTS.filter((c) => c.status === "Active").length, desc: "active contracts" },
    { href: "/ar/invoices", label: "Invoices", count: MOCK_AR_INVOICES.length, desc: "total invoices" },
    { href: "/ar/credit-memos", label: "Credit Memos", count: MOCK_AR_CREDIT_MEMOS.length, desc: "total memos" },
  ];

  const recentInvoices = [...MOCK_AR_INVOICES].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Accounts Receivable</h1>
        <p className="mt-1 text-muted">Manage customers, products, contracts, and billing</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border bg-sidebar p-5">
            <p className="text-sm text-muted">{s.label}</p>
            <p className={`mt-2 text-2xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-medium text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group rounded-lg border border-border bg-sidebar p-5 transition-colors hover:border-accent hover:bg-sidebar-hover"
            >
              <p className="font-medium text-foreground group-hover:text-accent-hover">{l.label}</p>
              <p className="mt-1 text-sm text-muted">
                {l.count} {l.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Recent Invoices</h2>
          <Link href="/ar/invoices" className="text-sm text-accent hover:text-accent-hover">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-sidebar">
                <th className="px-4 py-3 font-medium text-muted">Invoice #</th>
                <th className="px-4 py-3 font-medium text-muted">Customer</th>
                <th className="px-4 py-3 font-medium text-muted">Date</th>
                <th className="px-4 py-3 font-medium text-muted">Amount</th>
                <th className="px-4 py-3 font-medium text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-border transition-colors hover:bg-sidebar-hover">
                  <td className="px-4 py-3 font-medium text-foreground">{inv.invoiceNumber}</td>
                  <td className="px-4 py-3 text-foreground">{inv.customerName}</td>
                  <td className="px-4 py-3 text-muted">{inv.date}</td>
                  <td className="px-4 py-3 text-foreground">{fmt(inv.amount)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={inv.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-medium text-foreground">AR Aging Summary</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Current (0-30 days)", amount: 18000, color: "border-l-emerald-500" },
            { label: "31-60 days", amount: 12500, color: "border-l-yellow-500" },
            { label: "61-90 days", amount: 0, color: "border-l-orange-500" },
            { label: "90+ days", amount: 60750, color: "border-l-red-500" },
          ].map((bucket) => (
            <div key={bucket.label} className={`rounded-lg border border-border border-l-4 ${bucket.color} bg-sidebar p-4`}>
              <p className="text-sm text-muted">{bucket.label}</p>
              <p className="mt-1 text-lg font-semibold text-foreground">{fmt(bucket.amount)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Paid: "bg-emerald-500/10 text-emerald-400",
    Active: "bg-emerald-500/10 text-emerald-400",
    Unpaid: "bg-yellow-500/10 text-yellow-400",
    "Pending Review": "bg-yellow-500/10 text-yellow-400",
    Unbilled: "bg-zinc-500/10 text-zinc-400",
    Overdue: "bg-red-500/10 text-red-400",
    Inactive: "bg-zinc-500/10 text-zinc-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? "bg-zinc-500/10 text-zinc-400"}`}>
      {status}
    </span>
  );
}

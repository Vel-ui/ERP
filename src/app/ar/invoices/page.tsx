"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { MOCK_AR_INVOICES, type ARInvoice } from "@/lib/mock-data";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

type StatusFilter = "All" | "Unbilled" | "Unpaid" | "Paid" | "Overdue";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<ARInvoice[]>(MOCK_AR_INVOICES);
  const [filter, setFilter] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return invoices
      .filter((inv) => filter === "All" || inv.status === filter)
      .filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.customerName.toLowerCase().includes(q)
      );
  }, [invoices, filter, search]);

  const handleSend = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id && inv.status === "Unbilled" ? { ...inv, status: "Unpaid" as const } : inv))
    );
    alert("Invoice sent!");
  };

  const handleMarkSent = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id && inv.status === "Unbilled" ? { ...inv, status: "Unpaid" as const } : inv))
    );
  };

  const handleReceivePayment = (id: string) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "Paid" as const } : inv))
    );
    alert("Payment recorded!");
  };

  const handleDownloadPDF = (inv: ARInvoice) => {
    const content = [
      `INVOICE: ${inv.invoiceNumber}`,
      `Customer: ${inv.customerName}`,
      `Date: ${inv.date}`,
      `Due: ${inv.dueDate}`,
      `Amount: ${fmt(inv.amount)}`,
      `Status: ${inv.status}`,
      "",
      "Line Items:",
      ...inv.lineItems.map((li) => `  ${li.productName} - ${li.description} - Qty: ${li.quantity} - ${fmt(li.amount)}`),
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${inv.invoiceNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filters: StatusFilter[] = ["All", "Unbilled", "Unpaid", "Paid", "Overdue"];

  const statusCounts = {
    All: invoices.length,
    Unbilled: invoices.filter((i) => i.status === "Unbilled").length,
    Unpaid: invoices.filter((i) => i.status === "Unpaid").length,
    Paid: invoices.filter((i) => i.status === "Paid").length,
    Overdue: invoices.filter((i) => i.status === "Overdue").length,
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Invoices</h1>
          <p className="mt-1 text-sm text-muted">{invoices.length} total invoices</p>
        </div>
        <Link href="/ar/invoices/create">
          <Button size="sm">+ Add Invoice</Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex rounded-lg border border-border bg-sidebar p-1">
          {filters.map((f) => (
            <button
              key={f}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                filter === f ? "bg-accent text-white" : "text-muted hover:text-foreground"
              }`}
              onClick={() => setFilter(f)}
            >
              {f}
              <span className="ml-1.5 rounded-full bg-background px-1.5 py-0.5 text-xs">{statusCounts[f]}</span>
            </button>
          ))}
        </div>
        <div className="flex-1">
          <Input placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-sidebar">
              <th className="px-4 py-3 font-medium text-muted">Invoice #</th>
              <th className="px-4 py-3 font-medium text-muted">Customer</th>
              <th className="px-4 py-3 font-medium text-muted">Date</th>
              <th className="px-4 py-3 font-medium text-muted">Due Date</th>
              <th className="px-4 py-3 font-medium text-muted">Amount</th>
              <th className="px-4 py-3 font-medium text-muted">Status</th>
              <th className="px-4 py-3 font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((inv) => (
              <tr key={inv.id} className="border-b border-border transition-colors hover:bg-sidebar-hover">
                <td className="px-4 py-3 font-medium text-foreground">{inv.invoiceNumber}</td>
                <td className="px-4 py-3 text-foreground">{inv.customerName}</td>
                <td className="px-4 py-3 text-muted">{inv.date}</td>
                <td className="px-4 py-3 text-muted">{inv.dueDate}</td>
                <td className="px-4 py-3 font-medium text-foreground">{fmt(inv.amount)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={inv.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {(inv.status === "Unbilled") && (
                      <>
                        <button
                          className="rounded px-2 py-1 text-xs text-accent hover:bg-sidebar-hover hover:text-accent-hover"
                          onClick={() => handleSend(inv.id)}
                        >
                          Send
                        </button>
                        <button
                          className="rounded px-2 py-1 text-xs text-muted hover:bg-sidebar-hover hover:text-foreground"
                          onClick={() => handleMarkSent(inv.id)}
                        >
                          Mark Sent
                        </button>
                      </>
                    )}
                    {(inv.status === "Unpaid" || inv.status === "Overdue") && (
                      <button
                        className="rounded px-2 py-1 text-xs text-emerald-400 hover:bg-sidebar-hover hover:text-emerald-300"
                        onClick={() => handleReceivePayment(inv.id)}
                      >
                        Receive Payment
                      </button>
                    )}
                    <button
                      className="rounded px-2 py-1 text-xs text-muted hover:bg-sidebar-hover hover:text-foreground"
                      onClick={() => handleDownloadPDF(inv)}
                    >
                      Download
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Paid: "bg-emerald-500/10 text-emerald-400",
    Unpaid: "bg-yellow-500/10 text-yellow-400",
    Unbilled: "bg-zinc-500/10 text-zinc-400",
    Overdue: "bg-red-500/10 text-red-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? "bg-zinc-500/10 text-zinc-400"}`}>
      {status}
    </span>
  );
}

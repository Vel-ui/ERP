"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Send, CheckCircle, Download } from "lucide-react";
import { Button, Input, Tag } from "@/components/ui";
import { MOCK_AR_INVOICES, type ARInvoice } from "@/lib/mock-data";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

type StatusFilter = "All" | "Unbilled" | "Unpaid" | "Paid" | "Overdue";

function statusVariant(status: string): "success" | "warning" | "error" | "default" {
  const map: Record<string, "success" | "warning" | "error" | "default"> = {
    Paid: "success",
    Unpaid: "warning",
    Unbilled: "default",
    Overdue: "error",
  };
  return map[status] ?? "default";
}

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
    <div style={{ padding: 24, background: "#f9f9f9" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Invoices</h1>
            <p className="mx-text-secondary mt-1">{invoices.length} total invoices</p>
          </div>
          <Link href="/revenue/invoices/create">
            <Button size="sm">
              <Plus size={14} className="mr-1 inline" />
              Add Invoice
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex rounded-lg p-1" style={{ background: "#fff", border: "1px solid var(--mx-border)" }}>
            {filters.map((f) => (
              <button
                key={f}
                className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
                style={
                  filter === f
                    ? { background: "var(--mx-primary)", color: "#fff" }
                    : { color: "#61636a" }
                }
                onClick={() => setFilter(f)}
              >
                {f}
                <span
                  className="ml-1.5 rounded-full px-1.5 py-0.5 text-xs"
                  style={{ background: filter === f ? "rgba(255,255,255,0.2)" : "var(--mx-primary-bg)" }}
                >
                  {statusCounts[f]}
                </span>
              </button>
            ))}
          </div>
          <div className="flex-1">
            <Input placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="mx-table-container">
          <table className="mx-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 500 }}>{inv.invoiceNumber}</td>
                  <td>{inv.customerName}</td>
                  <td className="mx-text-secondary">{inv.date}</td>
                  <td className="mx-text-secondary">{inv.dueDate}</td>
                  <td style={{ fontWeight: 500 }}>{fmt(inv.amount)}</td>
                  <td>
                    <Tag variant={statusVariant(inv.status)}>{inv.status}</Tag>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      {inv.status === "Unbilled" && (
                        <>
                          <Button variant="link" size="sm" onClick={() => handleSend(inv.id)}>
                            <Send size={14} className="mr-1 inline" /> Send
                          </Button>
                          <Button variant="text" size="sm" onClick={() => handleMarkSent(inv.id)}>
                            Mark Sent
                          </Button>
                        </>
                      )}
                      {(inv.status === "Unpaid" || inv.status === "Overdue") && (
                        <Button variant="link" size="sm" onClick={() => handleReceivePayment(inv.id)}>
                          <CheckCircle size={14} className="mr-1 inline" /> Receive Payment
                        </Button>
                      )}
                      <Button variant="text" size="sm" onClick={() => handleDownloadPDF(inv)}>
                        <Download size={14} className="mr-1 inline" /> Download
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="mx-text-secondary" style={{ textAlign: "center", padding: 32 }}>
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button, Input, Modal, Select } from "@/components/ui";
import {
  MOCK_AR_CREDIT_MEMOS,
  MOCK_AR_CUSTOMERS,
  MOCK_AR_INVOICES,
  type ARCreditMemo,
} from "@/lib/mock-data";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

export default function CreditMemosPage() {
  const [memos, setMemos] = useState<ARCreditMemo[]>(MOCK_AR_CREDIT_MEMOS);
  const [search, setSearch] = useState("");
  const [applyModal, setApplyModal] = useState<string | null>(null);
  const [applyInvoiceId, setApplyInvoiceId] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return memos.filter(
      (m) =>
        m.cmNumber.toLowerCase().includes(q) ||
        m.customerName.toLowerCase().includes(q)
    );
  }, [memos, search]);

  const handleApply = () => {
    if (!applyModal || !applyInvoiceId) return;
    const invoice = MOCK_AR_INVOICES.find((i) => i.id === applyInvoiceId);
    setMemos((prev) =>
      prev.map((m) =>
        m.id === applyModal
          ? {
              ...m,
              status: "Applied" as const,
              invoiceId: applyInvoiceId,
              invoiceNumber: invoice?.invoiceNumber ?? null,
            }
          : m
      )
    );
    setApplyModal(null);
    setApplyInvoiceId("");
    alert("Credit memo applied to invoice.");
  };

  const invoiceOptions = MOCK_AR_INVOICES.filter((i) => i.status !== "Paid").map((i) => ({
    value: i.id,
    label: `${i.invoiceNumber} - ${i.customerName} (${fmt(i.amount)})`,
  }));

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Credit Memos</h1>
          <p className="mt-1 text-sm text-muted">{memos.length} total credit memos</p>
        </div>
        <Link href="/ar/credit-memos/create">
          <Button size="sm">+ Add Credit Memo</Button>
        </Link>
      </div>

      <Input placeholder="Search credit memos..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-sidebar">
              <th className="px-4 py-3 font-medium text-muted">CM #</th>
              <th className="px-4 py-3 font-medium text-muted">Customer</th>
              <th className="px-4 py-3 font-medium text-muted">Invoice</th>
              <th className="px-4 py-3 font-medium text-muted">Date</th>
              <th className="px-4 py-3 font-medium text-muted">Amount</th>
              <th className="px-4 py-3 font-medium text-muted">Status</th>
              <th className="px-4 py-3 font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b border-border transition-colors hover:bg-sidebar-hover">
                <td className="px-4 py-3 font-medium text-foreground">{m.cmNumber}</td>
                <td className="px-4 py-3 text-foreground">{m.customerName}</td>
                <td className="px-4 py-3 text-muted">{m.invoiceNumber ?? "—"}</td>
                <td className="px-4 py-3 text-muted">{m.date}</td>
                <td className="px-4 py-3 font-medium text-foreground">{fmt(m.amount)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={m.status} />
                </td>
                <td className="px-4 py-3">
                  {m.status === "Unpaid" && (
                    <button
                      className="rounded px-2 py-1 text-xs text-accent hover:bg-sidebar-hover hover:text-accent-hover"
                      onClick={() => {
                        setApplyModal(m.id);
                        setApplyInvoiceId("");
                      }}
                    >
                      Apply to Invoice
                    </button>
                  )}
                  {m.status !== "Unpaid" && <span className="text-xs text-muted">—</span>}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted">
                  No credit memos found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!applyModal} onClose={() => setApplyModal(null)} title="Apply Credit Memo" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Select an invoice to apply credit memo{" "}
            <span className="font-medium text-foreground">
              {memos.find((m) => m.id === applyModal)?.cmNumber}
            </span>{" "}
            ({fmt(memos.find((m) => m.id === applyModal)?.amount ?? 0)})
          </p>
          <Select
            label="Invoice"
            options={invoiceOptions}
            value={applyInvoiceId}
            onChange={(e) => setApplyInvoiceId(e.target.value)}
            placeholder="Select an invoice"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="text" onClick={() => setApplyModal(null)}>Cancel</Button>
            <Button onClick={handleApply} disabled={!applyInvoiceId}>Apply</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Unpaid: "bg-yellow-500/10 text-yellow-400",
    Applied: "bg-emerald-500/10 text-emerald-400",
    Refunded: "bg-blue-500/10 text-blue-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? "bg-zinc-500/10 text-zinc-400"}`}>
      {status}
    </span>
  );
}

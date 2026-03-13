"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, ArrowRightCircle } from "lucide-react";
import { Button, Input, Modal, Select, Tag } from "@/components/ui";
import {
  MOCK_AR_CREDIT_MEMOS,
  MOCK_AR_CUSTOMERS,
  MOCK_AR_INVOICES,
  type ARCreditMemo,
} from "@/lib/mock-data";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

function statusVariant(status: string): "success" | "warning" | "error" | "default" | "processing" {
  const map: Record<string, "success" | "warning" | "error" | "default" | "processing"> = {
    Unpaid: "warning",
    Applied: "success",
    Refunded: "processing",
  };
  return map[status] ?? "default";
}

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
    <div style={{ padding: 24, background: "#f9f9f9" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Credit Memos</h1>
            <p className="mx-text-secondary mt-1">{memos.length} total credit memos</p>
          </div>
          <Link href="/revenue/credit-memos/create">
            <Button size="sm">
              <Plus size={14} className="mr-1 inline" />
              Add Credit Memo
            </Button>
          </Link>
        </div>

        <div className="mb-4">
          <Input placeholder="Search credit memos..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="mx-table-container">
          <table className="mx-table">
            <thead>
              <tr>
                <th>CM #</th>
                <th>Customer</th>
                <th>Invoice</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id}>
                  <td style={{ fontWeight: 500 }}>{m.cmNumber}</td>
                  <td>{m.customerName}</td>
                  <td className="mx-text-secondary">{m.invoiceNumber ?? "—"}</td>
                  <td className="mx-text-secondary">{m.date}</td>
                  <td style={{ fontWeight: 500 }}>{fmt(m.amount)}</td>
                  <td>
                    <Tag variant={statusVariant(m.status)}>{m.status}</Tag>
                  </td>
                  <td>
                    {m.status === "Unpaid" ? (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => {
                          setApplyModal(m.id);
                          setApplyInvoiceId("");
                        }}
                      >
                        <ArrowRightCircle size={14} className="mr-1 inline" /> Apply to Invoice
                      </Button>
                    ) : (
                      <span className="mx-text-secondary text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="mx-text-secondary" style={{ textAlign: "center", padding: 32 }}>
                    No credit memos found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal isOpen={!!applyModal} onClose={() => setApplyModal(null)} title="Apply Credit Memo" size="sm">
          <div className="space-y-4">
            <p className="text-sm mx-text-secondary">
              Select an invoice to apply credit memo{" "}
              <span style={{ fontWeight: 500, color: "#2D2926" }}>
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
    </div>
  );
}

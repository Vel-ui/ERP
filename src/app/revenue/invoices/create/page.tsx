"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button, Input, Select } from "@/components/ui";
import { MOCK_AR_CUSTOMERS, MOCK_AR_PRODUCTS, AR_PAYMENT_TERMS } from "@/lib/mock-data";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);

interface LineItem {
  id: string;
  productId: string;
  productName: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function InvoiceCreatePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    customerId: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    paymentTerms: "Net 30",
    poNumber: "",
    memo: "",
  });

  const [lines, setLines] = useState<LineItem[]>([
    { id: `li-${Date.now()}`, productId: "", productName: "", description: "", quantity: 1, unitPrice: 0 },
  ]);

  const selectedCustomer = MOCK_AR_CUSTOMERS.find((c) => c.id === form.customerId);

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      { id: `li-${Date.now()}`, productId: "", productName: "", description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const updateLine = (idx: number, updates: Partial<LineItem>) => {
    setLines((prev) =>
      prev.map((l, i) => {
        if (i !== idx) return l;
        const updated = { ...l, ...updates };
        if (updates.productId) {
          const product = MOCK_AR_PRODUCTS.find((p) => p.id === updates.productId);
          if (product) {
            updated.productName = product.name;
            updated.description = product.name;
          }
        }
        return updated;
      })
    );
  };

  const removeLine = (idx: number) => {
    if (lines.length <= 1) return;
    setLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const lineAmount = (l: LineItem) => l.quantity * l.unitPrice;
  const subtotal = lines.reduce((s, l) => s + lineAmount(l), 0);
  const taxRate = selectedCustomer?.taxRate ?? 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;

  const productOptions = MOCK_AR_PRODUCTS.filter((p) => p.status === "Active").map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const customerOptions = MOCK_AR_CUSTOMERS.filter((c) => c.status === "Active").map((c) => ({
    value: c.id,
    label: c.companyName,
  }));

  const handleSave = () => {
    alert("Invoice saved as draft!");
    router.push("/revenue/invoices");
  };

  const handleSend = () => {
    alert("Invoice created and sent!");
    router.push("/revenue/invoices");
  };

  return (
    <div style={{ padding: 24, background: "#f9f9f9" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.push("/revenue/invoices")} className="mx-text-secondary" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="mx-h1">Create Invoice</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: Preview */}
          <div className="mx-card-white" style={{ padding: 24 }}>
            <div className="flex items-center justify-between pb-4" style={{ borderBottom: "1px solid var(--mx-border)" }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 600 }}>Invoice Preview</h2>
                <p className="mx-text-secondary text-sm">Draft</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p className="mx-text-secondary text-sm">{form.date}</p>
                {form.dueDate && <p className="mx-text-secondary text-sm">Due: {form.dueDate}</p>}
              </div>
            </div>

            <div className="mt-4 space-y-1">
              <p className="mx-text-secondary text-sm font-medium">Bill To</p>
              <p>{selectedCustomer?.companyName || "Select a customer"}</p>
              {selectedCustomer && <p className="mx-text-secondary text-sm">{selectedCustomer.address}</p>}
              {selectedCustomer && <p className="mx-text-secondary text-sm">{selectedCustomer.email}</p>}
            </div>

            {form.poNumber && (
              <div className="mt-4">
                <p className="mx-text-secondary text-sm font-medium">PO Number</p>
                <p>{form.poNumber}</p>
              </div>
            )}

            <div className="mt-4 mx-table-container">
              <table className="mx-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th style={{ textAlign: "right" }}>Price</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l) => (
                    <tr key={l.id}>
                      <td>
                        <p>{l.productName || "—"}</p>
                        {l.description && l.description !== l.productName && (
                          <p className="mx-text-secondary" style={{ fontSize: 12 }}>{l.description}</p>
                        )}
                      </td>
                      <td>{l.quantity}</td>
                      <td style={{ textAlign: "right" }}>{fmt(l.unitPrice)}</td>
                      <td style={{ textAlign: "right", fontWeight: 500 }}>{fmt(lineAmount(l))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-2 pt-4 mt-4" style={{ borderTop: "1px solid var(--mx-border)" }}>
              <div className="flex justify-between text-sm">
                <span className="mx-text-secondary">Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>
              {taxRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="mx-text-secondary">Tax ({taxRate}%)</span>
                  <span>{fmt(taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between" style={{ fontSize: 16, fontWeight: 600 }}>
                <span>Total</span>
                <span style={{ color: "var(--mx-primary)" }}>{fmt(total)}</span>
              </div>
            </div>

            {form.memo && (
              <div className="pt-4 mt-4" style={{ borderTop: "1px solid var(--mx-border)" }}>
                <p className="mx-text-secondary text-sm font-medium">Memo</p>
                <p className="text-sm">{form.memo}</p>
              </div>
            )}
          </div>

          {/* Right: Form */}
          <div className="space-y-6">
            <div className="mx-card" style={{ padding: 24 }}>
              <h3 className="mx-text-secondary" style={{ fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Invoice Details</h3>
              <div className="space-y-4">
                <Select label="Customer" options={customerOptions} value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} placeholder="Select a customer" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Invoice Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  <Input label="Due Date" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select label="Payment Terms" options={AR_PAYMENT_TERMS} value={form.paymentTerms} onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })} />
                  <Input label="PO Number" value={form.poNumber} onChange={(e) => setForm({ ...form, poNumber: e.target.value })} placeholder="Optional" />
                </div>
                <Input label="Memo" value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} placeholder="Internal note or message" />
              </div>
            </div>

            <div className="mx-card" style={{ padding: 24 }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="mx-text-secondary" style={{ fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Line Items</h3>
                <Button variant="text" size="sm" onClick={addLine}>
                  <Plus size={14} className="mr-1 inline" /> Add Line
                </Button>
              </div>

              <div className="space-y-4">
                {lines.map((line, idx) => (
                  <div key={line.id} className="space-y-3 rounded-lg p-4" style={{ border: "1px solid var(--mx-border)", background: "#fff" }}>
                    <div className="flex items-center justify-between">
                      <span className="mx-text-secondary text-sm font-medium">Line {idx + 1}</span>
                      {lines.length > 1 && (
                        <Button variant="danger" size="sm" onClick={() => removeLine(idx)}>
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                    <Select label="Product" options={productOptions} value={line.productId} onChange={(e) => updateLine(idx, { productId: e.target.value })} placeholder="Select product" />
                    <Input label="Description" value={line.description} onChange={(e) => updateLine(idx, { description: e.target.value })} placeholder="Line item description" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Quantity" type="number" min={1} value={String(line.quantity)} onChange={(e) => updateLine(idx, { quantity: parseInt(e.target.value) || 1 })} />
                      <Input label="Unit Price" type="number" min={0} step={0.01} value={String(line.unitPrice)} onChange={(e) => updateLine(idx, { unitPrice: parseFloat(e.target.value) || 0 })} />
                    </div>
                    <div style={{ textAlign: "right", fontSize: 14, fontWeight: 500 }}>
                      Amount: {fmt(lineAmount(line))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 mt-4" style={{ borderTop: "1px solid var(--mx-border)" }}>
                <div className="flex justify-between text-sm">
                  <span className="mx-text-secondary">Subtotal</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                {taxRate > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="mx-text-secondary">Tax ({taxRate}%)</span>
                    <span>{fmt(taxAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between" style={{ fontWeight: 600 }}>
                  <span>Total</span>
                  <span style={{ color: "var(--mx-primary)" }}>{fmt(total)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="text" onClick={() => router.push("/revenue/invoices")}>Cancel</Button>
              <Button variant="default" onClick={handleSave} disabled={!form.customerId}>Save Draft</Button>
              <Button onClick={handleSend} disabled={!form.customerId || lines.every((l) => !l.productId)}>Save & Send</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

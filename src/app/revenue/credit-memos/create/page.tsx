"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button, Input, Select } from "@/components/ui";
import { MOCK_AR_CUSTOMERS, MOCK_AR_PRODUCTS, MOCK_AR_INVOICES } from "@/lib/mock-data";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);

interface CreditLine {
  id: string;
  productName: string;
  description: string;
  amount: number;
}

export default function CreditMemoCreatePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    customerId: "",
    invoiceId: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [lines, setLines] = useState<CreditLine[]>([
    { id: `cl-${Date.now()}`, productName: "", description: "", amount: 0 },
  ]);

  const selectedCustomer = MOCK_AR_CUSTOMERS.find((c) => c.id === form.customerId);

  const customerOptions = MOCK_AR_CUSTOMERS.filter((c) => c.status === "Active").map((c) => ({
    value: c.id,
    label: c.companyName,
  }));

  const customerInvoices = MOCK_AR_INVOICES.filter(
    (i) => i.customerId === form.customerId && i.status !== "Paid"
  ).map((i) => ({
    value: i.id,
    label: `${i.invoiceNumber} — ${fmt(i.amount)}`,
  }));

  const productOptions = [
    { value: "", label: "Custom line item" },
    ...MOCK_AR_PRODUCTS.filter((p) => p.status === "Active").map((p) => ({
      value: p.name,
      label: p.name,
    })),
  ];

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      { id: `cl-${Date.now()}`, productName: "", description: "", amount: 0 },
    ]);
  };

  const updateLine = (idx: number, updates: Partial<CreditLine>) => {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, ...updates } : l)));
  };

  const removeLine = (idx: number) => {
    if (lines.length <= 1) return;
    setLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const total = lines.reduce((s, l) => s + l.amount, 0);

  const handleSave = () => {
    alert("Credit memo created!");
    router.push("/revenue/credit-memos");
  };

  return (
    <div style={{ padding: 24, background: "#f9f9f9" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.push("/revenue/credit-memos")} className="mx-text-secondary" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="mx-h1">Create Credit Memo</h1>
        </div>

        <div style={{ maxWidth: "48rem", margin: "0 auto" }} className="space-y-6">
          <div className="mx-card" style={{ padding: 24 }}>
            <h3 className="mx-text-secondary" style={{ fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Credit Memo Details</h3>

            <div className="space-y-4">
              <Select
                label="Customer"
                options={customerOptions}
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value, invoiceId: "" })}
                placeholder="Select a customer"
              />

              {form.customerId && customerInvoices.length > 0 && (
                <Select
                  label="Linked Invoice (optional)"
                  options={[{ value: "", label: "No linked invoice" }, ...customerInvoices]}
                  value={form.invoiceId}
                  onChange={(e) => setForm({ ...form, invoiceId: e.target.value })}
                />
              )}

              <Input
                label="Date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />

              {selectedCustomer && (
                <div className="rounded-md p-3" style={{ border: "1px solid var(--mx-border)", background: "#fff" }}>
                  <p className="mx-text-secondary text-sm">
                    Customer: <span style={{ color: "#2D2926" }}>{selectedCustomer.companyName}</span>
                  </p>
                  <p className="mx-text-secondary text-sm">
                    Current balance: <span style={{ color: "#2D2926" }}>{fmt(selectedCustomer.balance)}</span>
                  </p>
                </div>
              )}
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
                  <Select label="Product" options={productOptions} value={line.productName} onChange={(e) => updateLine(idx, { productName: e.target.value })} />
                  <Input label="Description" value={line.description} onChange={(e) => updateLine(idx, { description: e.target.value })} placeholder="Reason for credit" />
                  <Input label="Amount" type="number" min={0} step={0.01} value={String(line.amount)} onChange={(e) => updateLine(idx, { amount: parseFloat(e.target.value) || 0 })} />
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4 mt-4" style={{ borderTop: "1px solid var(--mx-border)" }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Total Credit</span>
              <span style={{ fontSize: 18, fontWeight: 600, color: "var(--mx-primary)" }}>{fmt(total)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="text" onClick={() => router.push("/revenue/credit-memos")}>Cancel</Button>
            <Button onClick={handleSave} disabled={!form.customerId || total <= 0}>Create Credit Memo</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

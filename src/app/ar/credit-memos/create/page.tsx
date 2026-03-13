"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    router.push("/ar/credit-memos");
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push("/ar/credit-memos")} className="text-muted hover:text-foreground">
          ← Back
        </button>
        <h1 className="text-2xl font-semibold text-foreground">Create Credit Memo</h1>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-lg border border-border bg-sidebar p-6 space-y-4">
          <h3 className="text-sm font-medium text-muted uppercase tracking-wider">Credit Memo Details</h3>

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
            <div className="rounded-md border border-border bg-background p-3">
              <p className="text-sm text-muted">
                Customer: <span className="text-foreground">{selectedCustomer.companyName}</span>
              </p>
              <p className="text-sm text-muted">
                Current balance: <span className="text-foreground">{fmt(selectedCustomer.balance)}</span>
              </p>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border bg-sidebar p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted uppercase tracking-wider">Line Items</h3>
            <Button variant="text" size="sm" onClick={addLine}>
              + Add Line
            </Button>
          </div>

          {lines.map((line, idx) => (
            <div key={line.id} className="space-y-3 rounded-lg border border-border bg-background p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted">Line {idx + 1}</span>
                {lines.length > 1 && (
                  <button onClick={() => removeLine(idx)} className="text-xs text-red-400 hover:text-red-300">
                    Remove
                  </button>
                )}
              </div>
              <Select
                label="Product"
                options={productOptions}
                value={line.productName}
                onChange={(e) => updateLine(idx, { productName: e.target.value })}
              />
              <Input
                label="Description"
                value={line.description}
                onChange={(e) => updateLine(idx, { description: e.target.value })}
                placeholder="Reason for credit"
              />
              <Input
                label="Amount"
                type="number"
                min={0}
                step={0.01}
                value={String(line.amount)}
                onChange={(e) => updateLine(idx, { amount: parseFloat(e.target.value) || 0 })}
              />
            </div>
          ))}

          <div className="flex justify-between border-t border-border pt-4">
            <span className="text-sm font-medium text-foreground">Total Credit</span>
            <span className="text-lg font-semibold text-accent">{fmt(total)}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="text" onClick={() => router.push("/ar/credit-memos")}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!form.customerId || total <= 0}>
            Create Credit Memo
          </Button>
        </div>
      </div>
    </div>
  );
}

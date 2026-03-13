"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Select } from "@/components/ui";
import {
  MOCK_AR_CUSTOMERS,
  MOCK_AR_PRODUCTS,
  AR_CONTRACT_TYPES,
  AR_DURATIONS,
  AR_BILLING_FREQUENCIES,
  AR_PAYMENT_TERMS,
  type ARContractProduct,
} from "@/lib/mock-data";

const STEPS = ["General Details", "Products", "Invoicing", "Revenue", "Summary"] as const;

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);

interface ContractLine {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export default function ContractCreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const [general, setGeneral] = useState({
    customerId: "",
    contractType: "New Sales",
    duration: "1yr",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    autoRenew: true,
  });

  const [lines, setLines] = useState<ContractLine[]>([]);
  const [addProductId, setAddProductId] = useState("");

  const [invoicing, setInvoicing] = useState({
    billingFrequency: "Monthly",
    paymentTerms: "Net 30",
    poNumber: "",
  });

  const selectedCustomer = MOCK_AR_CUSTOMERS.find((c) => c.id === general.customerId);

  const addProduct = () => {
    const product = MOCK_AR_PRODUCTS.find((p) => p.id === addProductId);
    if (!product || lines.some((l) => l.productId === addProductId)) return;
    setLines((prev) => [
      ...prev,
      { productId: product.id, productName: product.name, quantity: 1, unitPrice: 0, discount: 0 },
    ]);
    setAddProductId("");
  };

  const updateLine = (idx: number, updates: Partial<ContractLine>) => {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, ...updates } : l)));
  };

  const removeLine = (idx: number) => {
    setLines((prev) => prev.filter((_, i) => i !== idx));
  };

  const lineTotal = (l: ContractLine) => l.quantity * l.unitPrice * (1 - l.discount / 100);
  const totalARR = lines.reduce((s, l) => s + lineTotal(l), 0);

  const computeEndDate = () => {
    if (!general.startDate) return "";
    const start = new Date(general.startDate);
    const map: Record<string, number> = { "6mo": 6, "1yr": 12, "2yr": 24, "3yr": 36 };
    const months = map[general.duration];
    if (!months) return general.endDate;
    const end = new Date(start);
    end.setMonth(end.getMonth() + months);
    end.setDate(end.getDate() - 1);
    return end.toISOString().split("T")[0];
  };

  const endDateDisplay = general.duration === "open" ? "Open-ended" : general.duration === "custom" ? general.endDate : computeEndDate();

  const revenueSchedule = lines.map((l) => {
    const months = general.duration === "open" ? 12 : general.duration === "custom" ? 12 : { "6mo": 6, "1yr": 12, "2yr": 24, "3yr": 36 }[general.duration] || 12;
    const total = lineTotal(l);
    const monthlyRev = total / months;
    return { productName: l.productName, total, months, monthlyRev };
  });

  const handleCreate = () => {
    alert("Contract created successfully!");
    router.push("/ar/contracts");
  };

  const canNext = () => {
    if (step === 0) return !!general.customerId;
    if (step === 1) return lines.length > 0;
    return true;
  };

  const productOptions = MOCK_AR_PRODUCTS.filter((p) => p.status === "Active" && !lines.some((l) => l.productId === p.id)).map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const customerOptions = MOCK_AR_CUSTOMERS.filter((c) => c.status === "Active").map((c) => ({
    value: c.id,
    label: c.companyName,
  }));

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.push("/ar/contracts")} className="text-muted hover:text-foreground">
          ← Back
        </button>
        <h1 className="text-2xl font-semibold text-foreground">Create Contract</h1>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <button
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                i === step
                  ? "bg-accent text-white"
                  : i < step
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-sidebar text-muted"
              }`}
              onClick={() => i < step && setStep(i)}
            >
              {i < step ? "✓" : i + 1}
            </button>
            <span className={`ml-2 text-sm ${i === step ? "font-medium text-foreground" : "text-muted"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="mx-4 h-px w-8 bg-border" />}
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-sidebar p-6">
        {/* Step 1: General Details */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-foreground">General Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Customer"
                options={customerOptions}
                value={general.customerId}
                onChange={(e) => setGeneral({ ...general, customerId: e.target.value })}
                placeholder="Select a customer"
              />
              <Select
                label="Contract Type"
                options={AR_CONTRACT_TYPES}
                value={general.contractType}
                onChange={(e) => setGeneral({ ...general, contractType: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Duration"
                options={AR_DURATIONS}
                value={general.duration}
                onChange={(e) => setGeneral({ ...general, duration: e.target.value })}
              />
              <Input
                label="Start Date"
                type="date"
                value={general.startDate}
                onChange={(e) => setGeneral({ ...general, startDate: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(general.duration === "custom") && (
                <Input
                  label="End Date"
                  type="date"
                  value={general.endDate}
                  onChange={(e) => setGeneral({ ...general, endDate: e.target.value })}
                />
              )}
              {general.duration !== "custom" && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">End Date</label>
                  <p className="rounded-md border border-border bg-background px-3 py-2 text-foreground">
                    {endDateDisplay}
                  </p>
                </div>
              )}
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={general.autoRenew}
                    onChange={(e) => setGeneral({ ...general, autoRenew: e.target.checked })}
                    className="rounded border-border"
                  />
                  Auto-renew
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Products */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-foreground">Products</h2>
            <div className="flex gap-2">
              <div className="flex-1">
                <Select
                  options={productOptions}
                  value={addProductId}
                  onChange={(e) => setAddProductId(e.target.value)}
                  placeholder="Select a product to add"
                />
              </div>
              <Button onClick={addProduct} disabled={!addProductId} className="self-end">
                Add
              </Button>
            </div>

            {lines.length > 0 && (
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-background">
                      <th className="px-4 py-3 font-medium text-muted">Product</th>
                      <th className="px-4 py-3 font-medium text-muted">Quantity</th>
                      <th className="px-4 py-3 font-medium text-muted">Unit Price</th>
                      <th className="px-4 py-3 font-medium text-muted">Discount %</th>
                      <th className="px-4 py-3 font-medium text-muted">Total</th>
                      <th className="px-4 py-3 font-medium text-muted" />
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((l, i) => (
                      <tr key={l.productId} className="border-b border-border">
                        <td className="px-4 py-2 font-medium text-foreground">{l.productName}</td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            min={1}
                            value={l.quantity}
                            onChange={(e) => updateLine(i, { quantity: parseInt(e.target.value) || 1 })}
                            className="w-20 rounded border border-border bg-background px-2 py-1 text-foreground"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            value={l.unitPrice}
                            onChange={(e) => updateLine(i, { unitPrice: parseFloat(e.target.value) || 0 })}
                            className="w-28 rounded border border-border bg-background px-2 py-1 text-foreground"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={l.discount}
                            onChange={(e) => updateLine(i, { discount: parseFloat(e.target.value) || 0 })}
                            className="w-20 rounded border border-border bg-background px-2 py-1 text-foreground"
                          />
                        </td>
                        <td className="px-4 py-2 font-medium text-foreground">{fmt(lineTotal(l))}</td>
                        <td className="px-4 py-2">
                          <button onClick={() => removeLine(i)} className="text-red-400 hover:text-red-300">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-background">
                      <td colSpan={4} className="px-4 py-3 text-right font-medium text-foreground">
                        Total ARR
                      </td>
                      <td className="px-4 py-3 font-semibold text-foreground">{fmt(totalARR)}</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {lines.length === 0 && (
              <p className="py-8 text-center text-muted">No products added yet. Select a product above to get started.</p>
            )}
          </div>
        )}

        {/* Step 3: Invoicing */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-foreground">Invoicing</h2>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Billing Frequency"
                options={AR_BILLING_FREQUENCIES}
                value={invoicing.billingFrequency}
                onChange={(e) => setInvoicing({ ...invoicing, billingFrequency: e.target.value })}
              />
              <Select
                label="Payment Terms"
                options={AR_PAYMENT_TERMS}
                value={invoicing.paymentTerms}
                onChange={(e) => setInvoicing({ ...invoicing, paymentTerms: e.target.value })}
              />
            </div>
            <Input
              label="PO Number (optional)"
              value={invoicing.poNumber}
              onChange={(e) => setInvoicing({ ...invoicing, poNumber: e.target.value })}
              placeholder="e.g., PO-2026-001"
            />
          </div>
        )}

        {/* Step 4: Revenue */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-foreground">Revenue Recognition Schedule</h2>
            <p className="text-sm text-muted">Preview of how revenue will be recognized over the contract period.</p>
            {revenueSchedule.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-background">
                      <th className="px-4 py-3 font-medium text-muted">Product</th>
                      <th className="px-4 py-3 font-medium text-muted">Total Value</th>
                      <th className="px-4 py-3 font-medium text-muted">Recognition Period</th>
                      <th className="px-4 py-3 font-medium text-muted">Monthly Rev Rec</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueSchedule.map((r, i) => (
                      <tr key={i} className="border-b border-border">
                        <td className="px-4 py-3 font-medium text-foreground">{r.productName}</td>
                        <td className="px-4 py-3 text-foreground">{fmt(r.total)}</td>
                        <td className="px-4 py-3 text-foreground">{r.months} months</td>
                        <td className="px-4 py-3 text-foreground">{fmt(r.monthlyRev)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-background">
                      <td className="px-4 py-3 font-medium text-foreground">Total</td>
                      <td className="px-4 py-3 font-semibold text-foreground">
                        {fmt(revenueSchedule.reduce((s, r) => s + r.total, 0))}
                      </td>
                      <td />
                      <td className="px-4 py-3 font-semibold text-foreground">
                        {fmt(revenueSchedule.reduce((s, r) => s + r.monthlyRev, 0))}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <p className="py-8 text-center text-muted">No products to show revenue schedule for.</p>
            )}
          </div>
        )}

        {/* Step 5: Summary */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-foreground">Contract Summary</h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted uppercase tracking-wider">General</h3>
                <SummaryRow label="Customer" value={selectedCustomer?.companyName ?? "—"} />
                <SummaryRow label="Type" value={general.contractType} />
                <SummaryRow label="Duration" value={AR_DURATIONS.find((d) => d.value === general.duration)?.label ?? general.duration} />
                <SummaryRow label="Start Date" value={general.startDate} />
                <SummaryRow label="End Date" value={endDateDisplay} />
                <SummaryRow label="Auto-renew" value={general.autoRenew ? "Yes" : "No"} />
              </div>
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted uppercase tracking-wider">Invoicing</h3>
                <SummaryRow label="Billing Frequency" value={invoicing.billingFrequency} />
                <SummaryRow label="Payment Terms" value={invoicing.paymentTerms} />
                <SummaryRow label="PO Number" value={invoicing.poNumber || "—"} />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted uppercase tracking-wider">Products</h3>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border bg-background">
                      <th className="px-4 py-2 font-medium text-muted">Product</th>
                      <th className="px-4 py-2 font-medium text-muted">Qty</th>
                      <th className="px-4 py-2 font-medium text-muted">Price</th>
                      <th className="px-4 py-2 font-medium text-muted">Discount</th>
                      <th className="px-4 py-2 font-medium text-muted">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((l) => (
                      <tr key={l.productId} className="border-b border-border">
                        <td className="px-4 py-2 text-foreground">{l.productName}</td>
                        <td className="px-4 py-2 text-foreground">{l.quantity}</td>
                        <td className="px-4 py-2 text-foreground">{fmt(l.unitPrice)}</td>
                        <td className="px-4 py-2 text-foreground">{l.discount}%</td>
                        <td className="px-4 py-2 font-medium text-foreground">{fmt(lineTotal(l))}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-background">
                      <td colSpan={4} className="px-4 py-2 text-right font-medium text-foreground">Total ARR</td>
                      <td className="px-4 py-2 font-semibold text-accent">{fmt(totalARR)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="text"
          onClick={() => (step === 0 ? router.push("/ar/contracts") : setStep(step - 1))}
        >
          {step === 0 ? "Cancel" : "← Previous"}
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(step + 1)} disabled={!canNext()}>
            Next →
          </Button>
        ) : (
          <Button onClick={handleCreate}>Create Contract</Button>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

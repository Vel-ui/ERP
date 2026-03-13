"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { Button, Input, Select } from "@/components/ui";
import {
  MOCK_AR_CUSTOMERS,
  MOCK_AR_PRODUCTS,
  AR_CONTRACT_TYPES,
  AR_DURATIONS,
  AR_BILLING_FREQUENCIES,
  AR_PAYMENT_TERMS,
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
    router.push("/revenue/contracts");
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
    <div style={{ padding: 24, background: "#f9f9f9" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.push("/revenue/contracts")} className="mx-text-secondary" style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="mx-h1">Create Contract</h1>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors"
                style={
                  i === step
                    ? { background: "var(--mx-primary)", color: "#fff" }
                    : i < step
                    ? { background: "#edfdec", color: "#067f54" }
                    : { background: "#f3f3f4", color: "#a0a2aa" }
                }
                onClick={() => i < step && setStep(i)}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </button>
              <span className={`ml-2 text-sm ${i === step ? "font-medium" : "mx-text-secondary"}`}>{s}</span>
              {i < STEPS.length - 1 && <div className="mx-4 h-px w-8" style={{ background: "var(--mx-border)" }} />}
            </div>
          ))}
        </div>

        <div className="mx-card" style={{ padding: 24 }}>
          {step === 0 && (
            <div className="space-y-4">
              <h2 style={{ fontSize: 18, fontWeight: 500 }}>General Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Customer" options={customerOptions} value={general.customerId} onChange={(e) => setGeneral({ ...general, customerId: e.target.value })} placeholder="Select a customer" />
                <Select label="Contract Type" options={AR_CONTRACT_TYPES} value={general.contractType} onChange={(e) => setGeneral({ ...general, contractType: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Duration" options={AR_DURATIONS} value={general.duration} onChange={(e) => setGeneral({ ...general, duration: e.target.value })} />
                <Input label="Start Date" type="date" value={general.startDate} onChange={(e) => setGeneral({ ...general, startDate: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {general.duration === "custom" ? (
                  <Input label="End Date" type="date" value={general.endDate} onChange={(e) => setGeneral({ ...general, endDate: e.target.value })} />
                ) : (
                  <div>
                    <label className="mb-1 block text-sm font-medium">End Date</label>
                    <p className="mx-input" style={{ background: "#f3f3f4", cursor: "default" }}>{endDateDisplay}</p>
                  </div>
                )}
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={general.autoRenew} onChange={(e) => setGeneral({ ...general, autoRenew: e.target.checked })} className="mx-checkbox" />
                    Auto-renew
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <h2 style={{ fontSize: 18, fontWeight: 500 }}>Products</h2>
              <div className="flex gap-2">
                <div className="flex-1">
                  <Select options={productOptions} value={addProductId} onChange={(e) => setAddProductId(e.target.value)} placeholder="Select a product to add" />
                </div>
                <Button onClick={addProduct} disabled={!addProductId} className="self-end">Add</Button>
              </div>

              {lines.length > 0 && (
                <div className="mx-table-container">
                  <table className="mx-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Discount %</th>
                        <th>Total</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((l, i) => (
                        <tr key={l.productId}>
                          <td style={{ fontWeight: 500 }}>{l.productName}</td>
                          <td>
                            <input type="number" min={1} value={l.quantity} onChange={(e) => updateLine(i, { quantity: parseInt(e.target.value) || 1 })} className="mx-input" style={{ width: 80 }} />
                          </td>
                          <td>
                            <input type="number" min={0} step={0.01} value={l.unitPrice} onChange={(e) => updateLine(i, { unitPrice: parseFloat(e.target.value) || 0 })} className="mx-input" style={{ width: 112 }} />
                          </td>
                          <td>
                            <input type="number" min={0} max={100} value={l.discount} onChange={(e) => updateLine(i, { discount: parseFloat(e.target.value) || 0 })} className="mx-input" style={{ width: 80 }} />
                          </td>
                          <td style={{ fontWeight: 500 }}>{fmt(lineTotal(l))}</td>
                          <td>
                            <Button variant="danger" size="sm" onClick={() => removeLine(i)}>Remove</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={4} style={{ textAlign: "right", fontWeight: 500 }}>Total ARR</td>
                        <td style={{ fontWeight: 600 }}>{fmt(totalARR)}</td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {lines.length === 0 && (
                <p className="mx-text-secondary" style={{ padding: 32, textAlign: "center" }}>No products added yet. Select a product above to get started.</p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 style={{ fontSize: 18, fontWeight: 500 }}>Invoicing</h2>
              <div className="grid grid-cols-2 gap-4">
                <Select label="Billing Frequency" options={AR_BILLING_FREQUENCIES} value={invoicing.billingFrequency} onChange={(e) => setInvoicing({ ...invoicing, billingFrequency: e.target.value })} />
                <Select label="Payment Terms" options={AR_PAYMENT_TERMS} value={invoicing.paymentTerms} onChange={(e) => setInvoicing({ ...invoicing, paymentTerms: e.target.value })} />
              </div>
              <Input label="PO Number (optional)" value={invoicing.poNumber} onChange={(e) => setInvoicing({ ...invoicing, poNumber: e.target.value })} placeholder="e.g., PO-2026-001" />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 style={{ fontSize: 18, fontWeight: 500 }}>Revenue Recognition Schedule</h2>
              <p className="text-sm mx-text-secondary">Preview of how revenue will be recognized over the contract period.</p>
              {revenueSchedule.length > 0 ? (
                <div className="mx-table-container">
                  <table className="mx-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Total Value</th>
                        <th>Recognition Period</th>
                        <th>Monthly Rev Rec</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenueSchedule.map((r, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 500 }}>{r.productName}</td>
                          <td>{fmt(r.total)}</td>
                          <td>{r.months} months</td>
                          <td>{fmt(r.monthlyRev)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td style={{ fontWeight: 500 }}>Total</td>
                        <td style={{ fontWeight: 600 }}>{fmt(revenueSchedule.reduce((s, r) => s + r.total, 0))}</td>
                        <td />
                        <td style={{ fontWeight: 600 }}>{fmt(revenueSchedule.reduce((s, r) => s + r.monthlyRev, 0))}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <p className="mx-text-secondary" style={{ padding: 32, textAlign: "center" }}>No products to show revenue schedule for.</p>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 style={{ fontSize: 18, fontWeight: 500 }}>Contract Summary</h2>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="mx-text-secondary" style={{ fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>General</h3>
                  <SummaryRow label="Customer" value={selectedCustomer?.companyName ?? "—"} />
                  <SummaryRow label="Type" value={general.contractType} />
                  <SummaryRow label="Duration" value={AR_DURATIONS.find((d) => d.value === general.duration)?.label ?? general.duration} />
                  <SummaryRow label="Start Date" value={general.startDate} />
                  <SummaryRow label="End Date" value={endDateDisplay} />
                  <SummaryRow label="Auto-renew" value={general.autoRenew ? "Yes" : "No"} />
                </div>
                <div className="space-y-3">
                  <h3 className="mx-text-secondary" style={{ fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Invoicing</h3>
                  <SummaryRow label="Billing Frequency" value={invoicing.billingFrequency} />
                  <SummaryRow label="Payment Terms" value={invoicing.paymentTerms} />
                  <SummaryRow label="PO Number" value={invoicing.poNumber || "—"} />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="mx-text-secondary" style={{ fontSize: 12, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>Products</h3>
                <div className="mx-table-container">
                  <table className="mx-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Discount</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((l) => (
                        <tr key={l.productId}>
                          <td>{l.productName}</td>
                          <td>{l.quantity}</td>
                          <td>{fmt(l.unitPrice)}</td>
                          <td>{l.discount}%</td>
                          <td style={{ fontWeight: 500 }}>{fmt(lineTotal(l))}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={4} style={{ textAlign: "right", fontWeight: 500 }}>Total ARR</td>
                        <td style={{ fontWeight: 600, color: "var(--mx-primary)" }}>{fmt(totalARR)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button
            variant="text"
            onClick={() => (step === 0 ? router.push("/revenue/contracts") : setStep(step - 1))}
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
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="mx-text-secondary">{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  );
}

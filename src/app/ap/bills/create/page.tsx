"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Select } from "@/components/ui";

/* ───────────────── Types ───────────────── */

interface LineItem {
  id: string;
  glAccount: string;
  description: string;
  amount: string;
  servicePeriodStart: string;
  servicePeriodEnd: string;
  department: string;
  usefulLife: string;
  inServiceDate: string;
  assetId: string;
}

/* ───────────────── Options ───────────────── */

const VENDORS = [
  { value: "aws", label: "Amazon Web Services" },
  { value: "gusto", label: "Gusto Inc." },
  { value: "google", label: "Google Cloud" },
  { value: "wework", label: "WeWork" },
  { value: "johnson", label: "Johnson Legal LLP" },
  { value: "staples", label: "Staples Inc." },
  { value: "saas-tools", label: "SaaS Tools GmbH" },
];

const PAYMENT_TERMS = [
  { value: "due-receipt", label: "Due on Receipt" },
  { value: "net-15", label: "Net 15" },
  { value: "net-30", label: "Net 30" },
  { value: "net-45", label: "Net 45" },
  { value: "net-60", label: "Net 60" },
];

const CURRENCIES = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "GBP", label: "GBP — British Pound" },
  { value: "CAD", label: "CAD — Canadian Dollar" },
  { value: "JPY", label: "JPY — Japanese Yen" },
];

const GL_ACCOUNTS = [
  { value: "1500", label: "1500 - Fixed Assets" },
  { value: "1600", label: "1600 - Prepaid Expenses" },
  { value: "2000", label: "2000 - Accounts Payable" },
  { value: "6100", label: "6100 - Cloud Hosting" },
  { value: "6200", label: "6200 - Salaries" },
  { value: "6300", label: "6300 - Software" },
  { value: "6400", label: "6400 - Office Supplies" },
  { value: "6500", label: "6500 - Rent" },
  { value: "6600", label: "6600 - Legal Fees" },
  { value: "6700", label: "6700 - Marketing" },
];

const DEPARTMENTS = [
  { value: "engineering", label: "Engineering" },
  { value: "hr", label: "Human Resources" },
  { value: "operations", label: "Operations" },
  { value: "legal", label: "Legal" },
  { value: "marketing", label: "Marketing" },
  { value: "finance", label: "Finance" },
];

/* ───────────────── Helpers ───────────────── */

function formatCurrency(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

function emptyLine(index: number): LineItem {
  return {
    id: `line-${index}`,
    glAccount: "",
    description: "",
    amount: "",
    servicePeriodStart: "",
    servicePeriodEnd: "",
    department: "",
    usefulLife: "",
    inServiceDate: "",
    assetId: "",
  };
}

/* ───────────────── Component ───────────────── */

export default function BillCreatePage() {
  const router = useRouter();

  const [vendor, setVendor] = useState("");
  const [billDate, setBillDate] = useState("2026-03-13");
  const [dueDate, setDueDate] = useState("2026-04-12");
  const [paymentTerms, setPaymentTerms] = useState("net-30");
  const [currency, setCurrency] = useState("USD");
  const [fxRate, setFxRate] = useState("1.0000");
  const [showFxEditor, setShowFxEditor] = useState(false);

  const [lines, setLines] = useState<LineItem[]>([emptyLine(0)]);

  const total = lines.reduce((sum, l) => sum + (parseFloat(l.amount) || 0), 0);

  function updateLine(index: number, field: keyof LineItem, value: string) {
    setLines((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    );
  }

  function addLine() {
    setLines((prev) => [...prev, emptyLine(prev.length)]);
  }

  function removeLine(index: number) {
    if (lines.length <= 1) return;
    setLines((prev) => prev.filter((_, i) => i !== index));
  }

  function isFixedAssetLine(line: LineItem) {
    return line.glAccount === "1500";
  }

  function isPrepaidLine(line: LineItem) {
    return line.glAccount === "1600";
  }

  function handleSave() {
    router.push("/ap/bills");
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push("/ap/bills")} className="text-muted hover:text-foreground">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-semibold text-foreground">Create Bill</h1>
          </div>
          <p className="mt-1 ml-7 text-sm text-muted">Enter bill details and line items</p>
        </div>
        <Button onClick={handleSave}>Save Bill</Button>
      </div>

      {/* Bill Header Form */}
      <div className="mb-6 rounded-lg border border-border bg-sidebar p-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-4">
          <Select label="Vendor" options={VENDORS} placeholder="Select vendor…" value={vendor} onChange={(e) => setVendor(e.target.value)} />
          <Input label="Bill Date" type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)} />
          <Input label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <Select label="Payment Terms" options={PAYMENT_TERMS} value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
        </div>

        <div className="mt-4 flex items-end gap-4">
          <div className="w-56">
            <Select label="Currency" options={CURRENCIES} value={currency} onChange={(e) => setCurrency(e.target.value)} />
          </div>
          {currency !== "USD" && (
            <>
              {showFxEditor ? (
                <div className="flex items-end gap-2">
                  <div className="w-32">
                    <Input
                      label="Exchange Rate"
                      value={fxRate}
                      onChange={(e) => setFxRate(e.target.value)}
                    />
                  </div>
                  <Button variant="default" size="sm" onClick={() => setShowFxEditor(false)}>Done</Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted">Rate: 1 {currency} = {fxRate} USD</span>
                  <Button variant="text" size="sm" onClick={() => setShowFxEditor(true)}>Edit Rate</Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Line Items */}
      <div className="rounded-lg border border-border">
        <div className="flex items-center justify-between border-b border-border bg-sidebar px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Line Items</h2>
          <Button variant="text" size="sm" onClick={addLine}>+ Add Line</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted">
                <th className="min-w-[160px] px-3 py-2">GL Account</th>
                <th className="min-w-[200px] px-3 py-2">Description</th>
                <th className="min-w-[120px] px-3 py-2 text-right">Amount</th>
                <th className="min-w-[130px] px-3 py-2">Service Start</th>
                <th className="min-w-[130px] px-3 py-2">Service End</th>
                <th className="min-w-[130px] px-3 py-2">Department</th>
                <th className="w-10 px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {lines.map((line, idx) => (
                <>
                  <tr key={line.id} className="border-b border-border">
                    <td className="px-3 py-2">
                      <select
                        value={line.glAccount}
                        onChange={(e) => updateLine(idx, "glAccount", e.target.value)}
                        className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none"
                      >
                        <option value="">Select…</option>
                        {GL_ACCOUNTS.map((a) => (
                          <option key={a.value} value={a.value}>{a.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        value={line.description}
                        onChange={(e) => updateLine(idx, "description", e.target.value)}
                        placeholder="Description"
                        className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        value={line.amount}
                        onChange={(e) => updateLine(idx, "amount", e.target.value)}
                        placeholder="0.00"
                        className="w-full rounded border border-border bg-background px-2 py-1.5 text-right text-sm font-mono text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="date"
                        value={line.servicePeriodStart}
                        onChange={(e) => updateLine(idx, "servicePeriodStart", e.target.value)}
                        className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="date"
                        value={line.servicePeriodEnd}
                        onChange={(e) => updateLine(idx, "servicePeriodEnd", e.target.value)}
                        className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={line.department}
                        onChange={(e) => updateLine(idx, "department", e.target.value)}
                        className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none"
                      >
                        <option value="">Select…</option>
                        {DEPARTMENTS.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      {lines.length > 1 && (
                        <button
                          onClick={() => removeLine(idx)}
                          className="rounded p-1 text-muted hover:bg-sidebar-hover hover:text-red-400"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Fixed Asset fields */}
                  {isFixedAssetLine(line) && (
                    <tr key={`${line.id}-asset`} className="border-b border-border bg-purple-500/5">
                      <td colSpan={7} className="px-3 py-2">
                        <div className="flex items-center gap-1 mb-2">
                          <span className="inline-flex items-center rounded-full bg-purple-500/15 px-2 py-0.5 text-xs font-medium text-purple-400">
                            Fixed Asset
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="mb-1 block text-xs text-muted">Useful Life (months)</label>
                            <input
                              type="number"
                              value={line.usefulLife}
                              onChange={(e) => updateLine(idx, "usefulLife", e.target.value)}
                              placeholder="e.g. 60"
                              className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs text-muted">In Service Date</label>
                            <input
                              type="date"
                              value={line.inServiceDate}
                              onChange={(e) => updateLine(idx, "inServiceDate", e.target.value)}
                              className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs text-muted">Asset ID</label>
                            <input
                              value={line.assetId}
                              onChange={(e) => updateLine(idx, "assetId", e.target.value)}
                              placeholder="e.g. FA-001"
                              className="w-full rounded border border-border bg-background px-2 py-1.5 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Prepaid indicator */}
                  {isPrepaidLine(line) && (
                    <tr key={`${line.id}-prepaid`} className="border-b border-border bg-blue-500/5">
                      <td colSpan={7} className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-medium text-blue-400">
                            Prepaid Expense
                          </span>
                          <span className="text-xs text-muted">
                            Set service period dates above to define the amortization schedule
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between border-t border-border bg-sidebar px-4 py-3">
          <Button variant="text" size="sm" onClick={addLine}>+ Add Line Item</Button>
          <div className="flex items-center gap-4">
            {currency !== "USD" && (
              <span className="text-sm text-muted">
                USD equivalent: {formatCurrency(total * parseFloat(fxRate || "1"))}
              </span>
            )}
            <div className="text-right">
              <p className="text-xs text-muted">Total</p>
              <p className="text-lg font-semibold text-foreground">{formatCurrency(total, currency)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="default" onClick={() => router.push("/ap/bills")}>Cancel</Button>
        <Button onClick={handleSave}>Save Bill</Button>
      </div>
    </div>
  );
}

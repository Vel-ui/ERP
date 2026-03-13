"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Tag as TagIcon } from "lucide-react";
import { Button, Input, Select, Tag } from "@/components/ui";

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

function formatCurrency(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

function emptyLine(index: number): LineItem {
  return { id: `line-${index}`, glAccount: "", description: "", amount: "", servicePeriodStart: "", servicePeriodEnd: "", department: "", usefulLife: "", inServiceDate: "", assetId: "" };
}

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
    setLines((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  }
  function addLine() { setLines((prev) => [...prev, emptyLine(prev.length)]); }
  function removeLine(index: number) { if (lines.length <= 1) return; setLines((prev) => prev.filter((_, i) => i !== index)); }
  function isFixedAssetLine(line: LineItem) { return line.glAccount === "1500"; }
  function isPrepaidLine(line: LineItem) { return line.glAccount === "1600"; }
  function handleSave() { router.push("/subledgers/ap/bills"); }

  return (
    <div style={{ padding: 24, background: '#f9f9f9' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2">
              <button onClick={() => router.push("/subledgers/ap/bills")} style={{ color: '#61636a', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <ArrowLeft size={20} />
              </button>
              <h1 className="mx-h1">Create Bill</h1>
            </div>
            <p className="mx-text-secondary mt-1" style={{ marginLeft: 28 }}>Enter bill details and line items</p>
          </div>
          <Button onClick={handleSave}>Save Bill</Button>
        </div>

        <div className="mx-card mb-6" style={{ padding: 24 }}>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-4">
            <Select label="Vendor" options={VENDORS} placeholder="Select vendor…" value={vendor} onChange={(e) => setVendor(e.target.value)} />
            <Input label="Bill Date" type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)} />
            <Input label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <Select label="Payment Terms" options={PAYMENT_TERMS} value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
          </div>
          <div className="mt-4 flex items-end gap-4">
            <div style={{ width: 224 }}>
              <Select label="Currency" options={CURRENCIES} value={currency} onChange={(e) => setCurrency(e.target.value)} />
            </div>
            {currency !== "USD" && (
              <>
                {showFxEditor ? (
                  <div className="flex items-end gap-2">
                    <div style={{ width: 128 }}><Input label="Exchange Rate" value={fxRate} onChange={(e) => setFxRate(e.target.value)} /></div>
                    <Button variant="default" size="sm" onClick={() => setShowFxEditor(false)}>Done</Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="mx-text-secondary" style={{ fontSize: 14 }}>Rate: 1 {currency} = {fxRate} USD</span>
                    <Button variant="text" size="sm" onClick={() => setShowFxEditor(true)}>Edit Rate</Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="mx-table-container" style={{ overflow: 'hidden' }}>
          <div className="flex items-center justify-between" style={{ padding: '12px 16px', borderBottom: '1px solid #E9E9E9' }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#2D2926' }}>Line Items</h2>
            <Button variant="text" size="sm" onClick={addLine}><Plus size={14} className="mr-1" /> Add Line</Button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="mx-table">
              <thead>
                <tr>
                  <th style={{ minWidth: 160 }}>GL Account</th>
                  <th style={{ minWidth: 200 }}>Description</th>
                  <th style={{ minWidth: 120, textAlign: 'right' }}>Amount</th>
                  <th style={{ minWidth: 130 }}>Service Start</th>
                  <th style={{ minWidth: 130 }}>Service End</th>
                  <th style={{ minWidth: 130 }}>Department</th>
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line, idx) => (
                  <>
                    <tr key={line.id}>
                      <td>
                        <select value={line.glAccount} onChange={(e) => updateLine(idx, "glAccount", e.target.value)} className="mx-select" style={{ width: '100%' }}>
                          <option value="">Select…</option>
                          {GL_ACCOUNTS.map((a) => (<option key={a.value} value={a.value}>{a.label}</option>))}
                        </select>
                      </td>
                      <td><input value={line.description} onChange={(e) => updateLine(idx, "description", e.target.value)} placeholder="Description" className="mx-input" style={{ width: '100%' }} /></td>
                      <td><input type="number" value={line.amount} onChange={(e) => updateLine(idx, "amount", e.target.value)} placeholder="0.00" className="mx-input" style={{ width: '100%', textAlign: 'right', fontFamily: 'monospace' }} /></td>
                      <td><input type="date" value={line.servicePeriodStart} onChange={(e) => updateLine(idx, "servicePeriodStart", e.target.value)} className="mx-input" style={{ width: '100%' }} /></td>
                      <td><input type="date" value={line.servicePeriodEnd} onChange={(e) => updateLine(idx, "servicePeriodEnd", e.target.value)} className="mx-input" style={{ width: '100%' }} /></td>
                      <td>
                        <select value={line.department} onChange={(e) => updateLine(idx, "department", e.target.value)} className="mx-select" style={{ width: '100%' }}>
                          <option value="">Select…</option>
                          {DEPARTMENTS.map((d) => (<option key={d.value} value={d.value}>{d.label}</option>))}
                        </select>
                      </td>
                      <td>
                        {lines.length > 1 && (
                          <button onClick={() => removeLine(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#a0a2aa', borderRadius: 4 }}>
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                    {isFixedAssetLine(line) && (
                      <tr key={`${line.id}-asset`} style={{ background: '#f3f1fb' }}>
                        <td colSpan={7} style={{ padding: '8px 12px' }}>
                          <div className="mb-2"><Tag variant="ledger">Fixed Asset</Tag></div>
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="mx-label">Useful Life (months)</label>
                              <input type="number" value={line.usefulLife} onChange={(e) => updateLine(idx, "usefulLife", e.target.value)} placeholder="e.g. 60" className="mx-input" style={{ width: '100%' }} />
                            </div>
                            <div>
                              <label className="mx-label">In Service Date</label>
                              <input type="date" value={line.inServiceDate} onChange={(e) => updateLine(idx, "inServiceDate", e.target.value)} className="mx-input" style={{ width: '100%' }} />
                            </div>
                            <div>
                              <label className="mx-label">Asset ID</label>
                              <input value={line.assetId} onChange={(e) => updateLine(idx, "assetId", e.target.value)} placeholder="e.g. FA-001" className="mx-input" style={{ width: '100%' }} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    {isPrepaidLine(line) && (
                      <tr key={`${line.id}-prepaid`} style={{ background: '#f3f1fb' }}>
                        <td colSpan={7} style={{ padding: '8px 12px' }}>
                          <div className="flex items-center gap-2">
                            <Tag variant="processing">Prepaid Expense</Tag>
                            <span className="mx-text-secondary" style={{ fontSize: 12 }}>Set service period dates above to define the amortization schedule</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between" style={{ padding: '12px 16px', borderTop: '1px solid #E9E9E9', background: '#fafafa' }}>
            <Button variant="text" size="sm" onClick={addLine}><Plus size={14} className="mr-1" /> Add Line Item</Button>
            <div className="flex items-center gap-4">
              {currency !== "USD" && (
                <span className="mx-text-secondary" style={{ fontSize: 14 }}>USD equivalent: {formatCurrency(total * parseFloat(fxRate || "1"))}</span>
              )}
              <div style={{ textAlign: 'right' }}>
                <p className="mx-text-secondary" style={{ fontSize: 12 }}>Total</p>
                <p style={{ fontSize: 18, fontWeight: 600, color: '#2D2926' }}>{formatCurrency(total, currency)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="default" onClick={() => router.push("/subledgers/ap/bills")}>Cancel</Button>
          <Button onClick={handleSave}>Save Bill</Button>
        </div>
      </div>
    </div>
  );
}

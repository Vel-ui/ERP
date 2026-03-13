"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, X, Upload, CheckCircle } from "lucide-react";
import { Button, Input, Select } from "@/components/ui";

interface LineItem {
  id: string;
  account: string;
  debit: string;
  credit: string;
  description: string;
  department: string;
}

const accountOptions = [
  { value: "", label: "Select Account" },
  { value: "1000", label: "1000 - Cash" },
  { value: "1100", label: "1100 - Accounts Receivable" },
  { value: "1200", label: "1200 - Inventory" },
  { value: "1300", label: "1300 - Prepaid Expenses" },
  { value: "1500", label: "1500 - Fixed Assets" },
  { value: "1510", label: "1510 - Accumulated Depreciation" },
  { value: "2000", label: "2000 - Accounts Payable" },
  { value: "2100", label: "2100 - Accrued Liabilities" },
  { value: "3000", label: "3000 - Retained Earnings" },
  { value: "4000", label: "4000 - Revenue" },
  { value: "5000", label: "5000 - COGS" },
  { value: "5100", label: "5100 - Salaries & Wages" },
  { value: "6000", label: "6000 - Depreciation Expense" },
  { value: "6100", label: "6100 - Insurance Expense" },
  { value: "6200", label: "6200 - Rent Expense" },
  { value: "6300", label: "6300 - Utilities Expense" },
];

const departmentOptions = [
  { value: "", label: "None" },
  { value: "engineering", label: "Engineering" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "finance", label: "Finance" },
  { value: "operations", label: "Operations" },
  { value: "hr", label: "Human Resources" },
];

const customerVendorOptions = [
  { value: "", label: "None" },
  { value: "customer-acme", label: "Customer: Acme Corp" },
  { value: "customer-globex", label: "Customer: Globex Inc" },
  { value: "vendor-dell", label: "Vendor: Dell Technologies" },
  { value: "vendor-aws", label: "Vendor: AWS" },
  { value: "vendor-office", label: "Vendor: Office Supplies Co" },
];

function emptyLine(): LineItem {
  return { id: Date.now().toString() + Math.random().toString(36).slice(2), account: "", debit: "", credit: "", description: "", department: "" };
}

export default function CreateJournalEntryPage() {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [reversalDate, setReversalDate] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [customerVendor, setCustomerVendor] = useState("");
  const [lines, setLines] = useState<LineItem[]>([emptyLine(), emptyLine()]);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalDebit = lines.reduce((sum, l) => sum + (parseFloat(l.debit) || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (parseFloat(l.credit) || 0), 0);
  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = difference < 0.01 && (totalDebit > 0 || totalCredit > 0);

  const updateLine = useCallback((id: string, field: keyof LineItem, value: string) => {
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }, []);

  const addLine = useCallback(() => { setLines((prev) => [...prev, emptyLine()]); }, []);
  const removeLine = useCallback((id: string) => { setLines((prev) => (prev.length <= 2 ? prev : prev.filter((l) => l.id !== id))); }, []);
  const handleSave = useCallback(() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }, []);
  const handleCSVUpload = useCallback(() => { fileInputRef.current?.click(); }, []);

  const processCSV = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split("\n").slice(1).filter((r) => r.trim());
      if (rows.length === 0) return;
      const parsed: LineItem[] = rows.map((row) => {
        const cols = row.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        return { id: Date.now().toString() + Math.random().toString(36).slice(2), account: cols[5] || "", debit: cols[2] || "", credit: cols[3] || "", description: cols[6] || "", department: "" };
      });
      if (rows[0]) {
        const firstCols = rows[0].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
        if (firstCols[0]) setDate(firstCols[0]);
        if (firstCols[1]) setName(firstCols[1]);
        if (firstCols[9]) setReversalDate(firstCols[9]);
      }
      setLines(parsed.length >= 2 ? parsed : [...parsed, emptyLine()]);
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div style={{ padding: 24, background: '#f9f9f9' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link href="/period-close/journal-entries" className="mx-text-secondary" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', marginBottom: 4 }}>
              <ArrowLeft size={14} /> Journal Entries
            </Link>
            <h1 className="mx-h1">Create Journal Entry</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="default" size="sm" onClick={handleCSVUpload}><Upload size={14} className="mr-1" /> Upload JE (CSV)</Button>
            <input ref={fileInputRef} type="file" accept=".csv" onChange={processCSV} style={{ display: 'none' }} />
          </div>
        </div>

        {saved && (
          <div className="mx-alert-success flex items-center gap-2 mb-4" style={{ padding: '12px 16px' }}>
            <CheckCircle size={16} /> Journal entry saved successfully.
          </div>
        )}

        <div className="mx-card mb-6" style={{ padding: 20 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input label="JE Name" placeholder="e.g. March depreciation" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Input label="Reversal Date (optional)" type="date" value={reversalDate} onChange={(e) => setReversalDate(e.target.value)} />
            <Input label="Attachment URL (optional)" placeholder="https://..." value={attachmentUrl} onChange={(e) => setAttachmentUrl(e.target.value)} />
            <Select label="Customer / Vendor (optional)" options={customerVendorOptions} value={customerVendor} onChange={(e) => setCustomerVendor(e.target.value)} />
          </div>
        </div>

        <details style={{ fontSize: 14, marginBottom: 24 }}>
          <summary className="mx-text-secondary" style={{ cursor: 'pointer' }}>CSV Template Format</summary>
          <div className="mx-card mt-2" style={{ padding: 16, fontFamily: 'monospace', fontSize: 12, overflowX: 'auto' }}>
            Date, JE Name, Debit Amount, Credit Amount, Currency, Account Number or Name, Description, Vendor Name, Customer Name, Reversal Date, Field &#123;field_name&#125;
          </div>
        </details>

        <div className="flex items-center justify-between mb-3">
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#2D2926' }}>Line Items</h2>
          <Button variant="text" size="sm" onClick={addLine}><Plus size={14} className="mr-1" /> Add Line</Button>
        </div>

        <div className="mx-table-container" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="mx-table">
              <thead>
                <tr>
                  <th style={{ width: 192 }}>Account</th>
                  <th style={{ width: 128, textAlign: 'right' }}>Debit</th>
                  <th style={{ width: 128, textAlign: 'right' }}>Credit</th>
                  <th>Description</th>
                  <th style={{ width: 144 }}>Department</th>
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.id}>
                    <td>
                      <select value={line.account} onChange={(e) => updateLine(line.id, "account", e.target.value)} className="mx-select" style={{ width: '100%' }}>
                        {accountOptions.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                      </select>
                    </td>
                    <td>
                      <input type="number" step="0.01" min="0" placeholder="0.00" value={line.debit} onChange={(e) => updateLine(line.id, "debit", e.target.value)} className="mx-input" style={{ width: '100%', textAlign: 'right', fontFamily: 'monospace' }} />
                    </td>
                    <td>
                      <input type="number" step="0.01" min="0" placeholder="0.00" value={line.credit} onChange={(e) => updateLine(line.id, "credit", e.target.value)} className="mx-input" style={{ width: '100%', textAlign: 'right', fontFamily: 'monospace' }} />
                    </td>
                    <td>
                      <input type="text" placeholder="Line description" value={line.description} onChange={(e) => updateLine(line.id, "description", e.target.value)} className="mx-input" style={{ width: '100%' }} />
                    </td>
                    <td>
                      <select value={line.department} onChange={(e) => updateLine(line.id, "department", e.target.value)} className="mx-select" style={{ width: '100%' }}>
                        {departmentOptions.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
                      </select>
                    </td>
                    <td>
                      <button onClick={() => removeLine(line.id)} disabled={lines.length <= 2} style={{ background: 'none', border: 'none', cursor: lines.length <= 2 ? 'not-allowed' : 'pointer', padding: 4, borderRadius: 4, color: '#a0a2aa', opacity: lines.length <= 2 ? 0.3 : 1 }}>
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: '#fafafa', borderTop: '1px solid #E9E9E9' }}>
                  <td style={{ textAlign: 'right', fontWeight: 500, color: '#2D2926' }}>Totals</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 500, color: '#2D2926' }}>{fmt(totalDebit)}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', fontWeight: 500, color: '#2D2926' }}>{fmt(totalCredit)}</td>
                  <td colSpan={2}>
                    {!isBalanced && (totalDebit > 0 || totalCredit > 0) && (
                      <span style={{ fontSize: 14, color: '#f03c46' }}>Out of balance by {fmt(difference)}</span>
                    )}
                    {isBalanced && (
                      <span style={{ fontSize: 14, color: '#067f54', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle size={14} /> Balanced
                      </span>
                    )}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6">
          <Link href="/period-close/journal-entries"><Button variant="text">Cancel</Button></Link>
          <div className="flex items-center gap-3">
            <Button variant="default" onClick={handleSave} disabled={!name.trim()}>Save as Draft</Button>
            <Button onClick={handleSave} disabled={!name.trim() || !isBalanced}>Submit for Approval</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

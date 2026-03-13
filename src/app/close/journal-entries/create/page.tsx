"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
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
  return {
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    account: "",
    debit: "",
    credit: "",
    description: "",
    department: "",
  };
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
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  }, []);

  const addLine = useCallback(() => {
    setLines((prev) => [...prev, emptyLine()]);
  }, []);

  const removeLine = useCallback((id: string) => {
    setLines((prev) => (prev.length <= 2 ? prev : prev.filter((l) => l.id !== id)));
  }, []);

  const handleSave = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, []);

  const handleCSVUpload = useCallback(() => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  }, []);

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
        return {
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          account: cols[5] || "",
          debit: cols[2] || "",
          credit: cols[3] || "",
          description: cols[6] || "",
          department: "",
        };
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

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="p-8 space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/close/account-register" className="text-muted hover:text-foreground transition-colors text-sm">
              ← Account Register
            </Link>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Create Journal Entry</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" onClick={handleCSVUpload}>
            Upload JE (CSV)
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={processCSV}
            className="hidden"
          />
        </div>
      </div>

      {saved && (
        <div className="rounded-lg border border-green-500/25 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          Journal entry saved successfully.
        </div>
      )}

      {/* Header fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 rounded-lg border border-border bg-sidebar p-5">
        <Input
          label="JE Name"
          placeholder="e.g. March depreciation"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <Input
          label="Reversal Date (optional)"
          type="date"
          value={reversalDate}
          onChange={(e) => setReversalDate(e.target.value)}
        />
        <Input
          label="Attachment URL (optional)"
          placeholder="https://..."
          value={attachmentUrl}
          onChange={(e) => setAttachmentUrl(e.target.value)}
        />
        <Select
          label="Customer / Vendor (optional)"
          options={customerVendorOptions}
          value={customerVendor}
          onChange={(e) => setCustomerVendor(e.target.value)}
        />
      </div>

      {/* CSV template hint */}
      <details className="text-sm">
        <summary className="cursor-pointer text-muted hover:text-foreground transition-colors">
          CSV Template Format
        </summary>
        <div className="mt-2 rounded-lg border border-border bg-sidebar p-4 font-mono text-xs text-muted overflow-x-auto">
          Date, JE Name, Debit Amount, Credit Amount, Currency, Account Number or Name, Description, Vendor Name, Customer Name, Reversal Date, Field &#123;field_name&#125;
        </div>
      </details>

      {/* Line items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-medium text-foreground">Line Items</h2>
          <Button variant="text" size="sm" onClick={addLine}>
            + Add Line
          </Button>
        </div>
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-sidebar">
                  <th className="px-3 py-3 text-left font-medium text-muted w-48">Account</th>
                  <th className="px-3 py-3 text-right font-medium text-muted w-32">Debit</th>
                  <th className="px-3 py-3 text-right font-medium text-muted w-32">Credit</th>
                  <th className="px-3 py-3 text-left font-medium text-muted">Description</th>
                  <th className="px-3 py-3 text-left font-medium text-muted w-36">Department</th>
                  <th className="w-10 px-3 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.id} className="border-b border-border last:border-0 hover:bg-sidebar-hover transition-colors">
                    <td className="px-3 py-2">
                      <select
                        value={line.account}
                        onChange={(e) => updateLine(line.id, "account", e.target.value)}
                        className="w-full rounded border border-border bg-sidebar px-2 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none"
                      >
                        {accountOptions.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={line.debit}
                        onChange={(e) => updateLine(line.id, "debit", e.target.value)}
                        className="w-full rounded border border-border bg-sidebar px-2 py-1.5 text-sm text-foreground text-right font-mono focus:border-accent focus:outline-none"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={line.credit}
                        onChange={(e) => updateLine(line.id, "credit", e.target.value)}
                        className="w-full rounded border border-border bg-sidebar px-2 py-1.5 text-sm text-foreground text-right font-mono focus:border-accent focus:outline-none"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        placeholder="Line description"
                        value={line.description}
                        onChange={(e) => updateLine(line.id, "description", e.target.value)}
                        className="w-full rounded border border-border bg-sidebar px-2 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={line.department}
                        onChange={(e) => updateLine(line.id, "department", e.target.value)}
                        className="w-full rounded border border-border bg-sidebar px-2 py-1.5 text-sm text-foreground focus:border-accent focus:outline-none"
                      >
                        {departmentOptions.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => removeLine(line.id)}
                        disabled={lines.length <= 2}
                        className="rounded p-1 text-muted hover:bg-red-500/10 hover:text-red-400 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted"
                        title="Remove line"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-sidebar border-t border-border">
                  <td className="px-3 py-3 text-right font-medium text-foreground">Totals</td>
                  <td className="px-3 py-3 text-right font-mono font-medium text-foreground">
                    {fmt(totalDebit)}
                  </td>
                  <td className="px-3 py-3 text-right font-mono font-medium text-foreground">
                    {fmt(totalCredit)}
                  </td>
                  <td colSpan={2} className="px-3 py-3">
                    {!isBalanced && (totalDebit > 0 || totalCredit > 0) && (
                      <span className="text-sm text-red-400">
                        Out of balance by {fmt(difference)}
                      </span>
                    )}
                    {isBalanced && (
                      <span className="text-sm text-green-400">Balanced ✓</span>
                    )}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <Link href="/close/account-register">
          <Button variant="text">Cancel</Button>
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="default" onClick={handleSave} disabled={!name.trim()}>
            Save as Draft
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || !isBalanced}>
            Submit for Approval
          </Button>
        </div>
      </div>
    </div>
  );
}

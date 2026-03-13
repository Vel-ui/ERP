"use client";

import { useState, useCallback } from "react";
import { Button, Input, Select, Modal } from "@/components/ui";

type ICStatus = "Draft" | "Pending" | "Posted";

interface ICLine {
  id: string;
  fromSubsidiary: string;
  toSubsidiary: string;
  amount: string;
  account: string;
  description: string;
}

interface IntercompanyEntry {
  id: string;
  name: string;
  date: string;
  currency: string;
  fromEntity: string;
  toEntity: string;
  amount: number;
  status: ICStatus;
}

const statusColors: Record<ICStatus, string> = {
  Draft: "bg-zinc-500/15 text-zinc-400 border-zinc-500/25",
  Pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/25",
  Posted: "bg-green-500/15 text-green-400 border-green-500/25",
};

const currencyOptions = [
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "CAD", label: "CAD" },
  { value: "JPY", label: "JPY" },
];

const entityOptions = [
  { value: "", label: "Select Entity" },
  { value: "parent-co", label: "Parent Co." },
  { value: "us-ops", label: "US Operations" },
  { value: "eu-ops", label: "EU Operations" },
  { value: "apac-ops", label: "APAC Operations" },
  { value: "latam-ops", label: "LATAM Operations" },
];

const accountOptions = [
  { value: "", label: "Select Account" },
  { value: "1000", label: "1000 - Cash" },
  { value: "1100", label: "1100 - Accounts Receivable" },
  { value: "2000", label: "2000 - Accounts Payable" },
  { value: "2500", label: "2500 - Intercompany Payable" },
  { value: "1400", label: "1400 - Intercompany Receivable" },
  { value: "4000", label: "4000 - Revenue" },
  { value: "5000", label: "5000 - COGS" },
  { value: "6500", label: "6500 - Management Fees" },
];

const customerVendorOptions = [
  { value: "", label: "None" },
  { value: "customer-acme", label: "Customer: Acme Corp" },
  { value: "customer-globex", label: "Customer: Globex Inc" },
  { value: "vendor-dell", label: "Vendor: Dell Technologies" },
  { value: "vendor-aws", label: "Vendor: AWS" },
];

const mockEntries: IntercompanyEntry[] = [
  { id: "1", name: "Q1 Management Fee Allocation", date: "2026-03-31", currency: "USD", fromEntity: "US Operations", toEntity: "EU Operations", amount: 125000, status: "Posted" },
  { id: "2", name: "APAC Shared Services", date: "2026-03-28", currency: "USD", fromEntity: "Parent Co.", toEntity: "APAC Operations", amount: 48500, status: "Pending" },
  { id: "3", name: "LATAM Revenue Share", date: "2026-03-25", currency: "USD", fromEntity: "LATAM Operations", toEntity: "Parent Co.", amount: 67200, status: "Draft" },
];

function emptyICLine(): ICLine {
  return {
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    fromSubsidiary: "",
    toSubsidiary: "",
    amount: "",
    account: "",
    description: "",
  };
}

export default function IntercompanyPage() {
  const [entries, setEntries] = useState<IntercompanyEntry[]>(mockEntries);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Create form state
  const [formName, setFormName] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formCurrency, setFormCurrency] = useState("USD");
  const [formCustomerVendor, setFormCustomerVendor] = useState("");
  const [formAttachmentUrl, setFormAttachmentUrl] = useState("");
  const [formLines, setFormLines] = useState<ICLine[]>([emptyICLine(), emptyICLine()]);

  const resetForm = useCallback(() => {
    setFormName("");
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormCurrency("USD");
    setFormCustomerVendor("");
    setFormAttachmentUrl("");
    setFormLines([emptyICLine(), emptyICLine()]);
    setShowPreview(false);
  }, []);

  const openCreate = useCallback(() => {
    resetForm();
    setShowCreateModal(true);
  }, [resetForm]);

  const updateLine = useCallback((id: string, field: keyof ICLine, value: string) => {
    setFormLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  }, []);

  const addLine = useCallback(() => {
    setFormLines((prev) => [...prev, emptyICLine()]);
  }, []);

  const removeLine = useCallback((id: string) => {
    setFormLines((prev) => (prev.length <= 1 ? prev : prev.filter((l) => l.id !== id)));
  }, []);

  const totalAmount = formLines.reduce((s, l) => s + (parseFloat(l.amount) || 0), 0);

  const handlePreview = useCallback(() => {
    setShowPreview(true);
  }, []);

  const handleCreate = useCallback(() => {
    const fromEntity = formLines[0]
      ? entityOptions.find((e) => e.value === formLines[0].fromSubsidiary)?.label ?? formLines[0].fromSubsidiary
      : "";
    const toEntity = formLines[0]
      ? entityOptions.find((e) => e.value === formLines[0].toSubsidiary)?.label ?? formLines[0].toSubsidiary
      : "";

    const newEntry: IntercompanyEntry = {
      id: Date.now().toString(),
      name: formName,
      date: formDate,
      currency: formCurrency,
      fromEntity,
      toEntity,
      amount: totalAmount,
      status: "Draft",
    };
    setEntries((prev) => [newEntry, ...prev]);
    setShowCreateModal(false);
    resetForm();
  }, [formName, formDate, formCurrency, formLines, totalAmount, resetForm]);

  const handleDelete = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const getEntityLabel = (val: string) =>
    entityOptions.find((e) => e.value === val)?.label ?? val;

  const getAccountLabel = (val: string) =>
    accountOptions.find((a) => a.value === val)?.label ?? val;

  const canCreate = formName.trim() && formLines.some((l) => parseFloat(l.amount) > 0);

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Intercompany</h1>
          <p className="mt-1 text-muted">
            Intercompany entries &middot; {entries.length} {entries.length === 1 ? "entry" : "entries"}
          </p>
        </div>
        <Button size="sm" onClick={openCreate}>
          + Add Intercompany Entry
        </Button>
      </div>

      {/* Entries table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-sidebar">
                <th className="px-4 py-3 text-left font-medium text-muted">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Currency</th>
                <th className="px-4 py-3 text-left font-medium text-muted">From Entity</th>
                <th className="px-4 py-3 text-left font-medium text-muted">To Entity</th>
                <th className="px-4 py-3 text-right font-medium text-muted">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-border last:border-0 hover:bg-sidebar-hover transition-colors"
                >
                  <td className="px-4 py-3 text-foreground font-medium">{entry.name}</td>
                  <td className="px-4 py-3 text-muted">{entry.date}</td>
                  <td className="px-4 py-3 text-muted">{entry.currency}</td>
                  <td className="px-4 py-3 text-foreground">{entry.fromEntity}</td>
                  <td className="px-4 py-3 text-foreground">{entry.toEntity}</td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">{fmt(entry.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[entry.status]}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {entry.status === "Draft" && (
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="rounded p-1 text-muted hover:bg-red-500/10 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted">
                    No intercompany entries yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Intercompany Entry Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => { setShowCreateModal(false); resetForm(); }}
        title={showPreview ? "Preview Entry" : "New Intercompany Entry"}
        size="lg"
      >
        {!showPreview ? (
          <div className="space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Header fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Entry Name"
                placeholder="e.g. Q1 Management Fee"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
              <Input
                label="Date"
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
              />
              <Select
                label="Currency"
                options={currencyOptions}
                value={formCurrency}
                onChange={(e) => setFormCurrency(e.target.value)}
              />
              <Select
                label="Customer / Vendor (optional)"
                options={customerVendorOptions}
                value={formCustomerVendor}
                onChange={(e) => setFormCustomerVendor(e.target.value)}
              />
              <div className="sm:col-span-2">
                <Input
                  label="Attachment URL (optional)"
                  placeholder="https://..."
                  value={formAttachmentUrl}
                  onChange={(e) => setFormAttachmentUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Line items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-foreground">Entry Lines</h3>
                <Button variant="text" size="sm" onClick={addLine}>
                  + Add Lines
                </Button>
              </div>
              <div className="space-y-3">
                {formLines.map((line, idx) => (
                  <div
                    key={line.id}
                    className="rounded-lg border border-border bg-sidebar p-3 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted">Line {idx + 1}</span>
                      <button
                        onClick={() => removeLine(line.id)}
                        disabled={formLines.length <= 1}
                        className="text-muted hover:text-red-400 transition-colors disabled:opacity-30 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Select
                        label="From Subsidiary"
                        options={entityOptions}
                        value={line.fromSubsidiary}
                        onChange={(e) => updateLine(line.id, "fromSubsidiary", e.target.value)}
                      />
                      <Select
                        label="To Subsidiary"
                        options={entityOptions}
                        value={line.toSubsidiary}
                        onChange={(e) => updateLine(line.id, "toSubsidiary", e.target.value)}
                      />
                      <Input
                        label="Amount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={line.amount}
                        onChange={(e) => updateLine(line.id, "amount", e.target.value)}
                      />
                      <Select
                        label="Account"
                        options={accountOptions}
                        value={line.account}
                        onChange={(e) => updateLine(line.id, "account", e.target.value)}
                      />
                      <div className="sm:col-span-2">
                        <Input
                          label="Description"
                          placeholder="Line description"
                          value={line.description}
                          onChange={(e) => updateLine(line.id, "description", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-3 px-1">
                <span className="text-sm text-muted">Total</span>
                <span className="text-sm font-mono font-medium text-foreground">{fmt(totalAmount)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="text" onClick={() => { setShowCreateModal(false); resetForm(); }}>
                Cancel
              </Button>
              <Button variant="default" onClick={handlePreview} disabled={!canCreate}>
                Preview Entry
              </Button>
            </div>
          </div>
        ) : (
          /* Preview */
          <div className="space-y-5 max-h-[70vh] overflow-y-auto">
            <div className="rounded-lg border border-border bg-sidebar p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Name</span>
                <span className="text-foreground font-medium">{formName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Date</span>
                <span className="text-foreground">{formDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Currency</span>
                <span className="text-foreground">{formCurrency}</span>
              </div>
              {formAttachmentUrl && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Attachment</span>
                  <span className="text-accent truncate max-w-[250px]">{formAttachmentUrl}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">Lines</h3>
              {formLines.map((line, idx) => (
                <div key={line.id} className="rounded-lg border border-border bg-sidebar p-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted">Line {idx + 1}</span>
                    <span className="font-mono text-foreground">{fmt(parseFloat(line.amount) || 0)}</span>
                  </div>
                  <div className="text-muted">
                    {getEntityLabel(line.fromSubsidiary) || "—"} → {getEntityLabel(line.toSubsidiary) || "—"}
                  </div>
                  {line.account && <div className="text-muted">Account: {getAccountLabel(line.account)}</div>}
                  {line.description && <div className="text-muted">{line.description}</div>}
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 px-1 border-t border-border">
                <span className="text-sm font-medium text-foreground">Total</span>
                <span className="text-sm font-mono font-medium text-foreground">{fmt(totalAmount)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="text" onClick={() => setShowPreview(false)}>
                ← Back to Edit
              </Button>
              <Button onClick={handleCreate}>
                Create Entry
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

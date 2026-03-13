"use client";

import { useState, useCallback } from "react";
import { Plus, Trash2, ArrowRight, Eye } from "lucide-react";
import { Button, Input, Select, Modal, Tag } from "@/components/ui";

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

const statusVariant: Record<ICStatus, "default" | "warning" | "success"> = {
  Draft: "default",
  Pending: "warning",
  Posted: "success",
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
  return { id: Date.now().toString() + Math.random().toString(36).slice(2), fromSubsidiary: "", toSubsidiary: "", amount: "", account: "", description: "" };
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default function IntercompanyPage() {
  const [entries, setEntries] = useState<IntercompanyEntry[]>(mockEntries);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formCurrency, setFormCurrency] = useState("USD");
  const [formCustomerVendor, setFormCustomerVendor] = useState("");
  const [formAttachmentUrl, setFormAttachmentUrl] = useState("");
  const [formLines, setFormLines] = useState<ICLine[]>([emptyICLine(), emptyICLine()]);

  const resetForm = useCallback(() => {
    setFormName(""); setFormDate(new Date().toISOString().split("T")[0]); setFormCurrency("USD"); setFormCustomerVendor(""); setFormAttachmentUrl(""); setFormLines([emptyICLine(), emptyICLine()]); setShowPreview(false);
  }, []);

  const openCreate = useCallback(() => { resetForm(); setShowCreateModal(true); }, [resetForm]);

  const updateLine = useCallback((id: string, field: keyof ICLine, value: string) => {
    setFormLines((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }, []);

  const addLine = useCallback(() => { setFormLines((prev) => [...prev, emptyICLine()]); }, []);
  const removeLine = useCallback((id: string) => { setFormLines((prev) => (prev.length <= 1 ? prev : prev.filter((l) => l.id !== id))); }, []);

  const totalAmount = formLines.reduce((s, l) => s + (parseFloat(l.amount) || 0), 0);
  const canCreate = formName.trim() && formLines.some((l) => parseFloat(l.amount) > 0);

  const handleCreate = useCallback(() => {
    const fromEntity = formLines[0] ? entityOptions.find((e) => e.value === formLines[0].fromSubsidiary)?.label ?? formLines[0].fromSubsidiary : "";
    const toEntity = formLines[0] ? entityOptions.find((e) => e.value === formLines[0].toSubsidiary)?.label ?? formLines[0].toSubsidiary : "";
    setEntries((prev) => [{ id: Date.now().toString(), name: formName, date: formDate, currency: formCurrency, fromEntity, toEntity, amount: totalAmount, status: "Draft" }, ...prev]);
    setShowCreateModal(false);
    resetForm();
  }, [formName, formDate, formCurrency, formLines, totalAmount, resetForm]);

  const handleDelete = useCallback((id: string) => { setEntries((prev) => prev.filter((e) => e.id !== id)); }, []);
  const getEntityLabel = (val: string) => entityOptions.find((e) => e.value === val)?.label ?? val;
  const getAccountLabel = (val: string) => accountOptions.find((a) => a.value === val)?.label ?? val;

  return (
    <div style={{ padding: 24, background: '#f9f9f9' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="mx-h1">Intercompany</h1>
            <p className="mx-text-secondary mt-1">Intercompany entries &middot; {entries.length} {entries.length === 1 ? "entry" : "entries"}</p>
          </div>
          <Button size="sm" onClick={openCreate}><Plus size={14} className="mr-1" /> Add Intercompany Entry</Button>
        </div>

        <div className="mx-table-container">
          <table className="mx-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Currency</th>
                <th>From Entity</th>
                <th>To Entity</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td style={{ fontWeight: 500, color: '#2D2926' }}>{entry.name}</td>
                  <td>{entry.date}</td>
                  <td>{entry.currency}</td>
                  <td style={{ color: '#2D2926' }}>{entry.fromEntity}</td>
                  <td style={{ color: '#2D2926' }}>{entry.toEntity}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#2D2926' }}>{formatCurrency(entry.amount)}</td>
                  <td><Tag variant={statusVariant[entry.status]}>{entry.status}</Tag></td>
                  <td style={{ textAlign: 'right' }}>
                    {entry.status === "Draft" && (
                      <button onClick={() => handleDelete(entry.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 4, color: '#a0a2aa' }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32 }} className="mx-text-secondary">No intercompany entries yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); resetForm(); }} title={showPreview ? "Preview Entry" : "New Intercompany Entry"} size="lg">
          {!showPreview ? (
            <div className="space-y-5" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Entry Name" placeholder="e.g. Q1 Management Fee" value={formName} onChange={(e) => setFormName(e.target.value)} />
                <Input label="Date" type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
                <Select label="Currency" options={currencyOptions} value={formCurrency} onChange={(e) => setFormCurrency(e.target.value)} />
                <Select label="Customer / Vendor (optional)" options={customerVendorOptions} value={formCustomerVendor} onChange={(e) => setFormCustomerVendor(e.target.value)} />
                <div className="sm:col-span-2">
                  <Input label="Attachment URL (optional)" placeholder="https://..." value={formAttachmentUrl} onChange={(e) => setFormAttachmentUrl(e.target.value)} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 style={{ fontSize: 14, fontWeight: 500, color: '#2D2926' }}>Entry Lines</h3>
                  <Button variant="text" size="sm" onClick={addLine}><Plus size={14} className="mr-1" /> Add Lines</Button>
                </div>
                <div className="space-y-3">
                  {formLines.map((line, idx) => (
                    <div key={line.id} className="mx-card" style={{ padding: 12 }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="mx-text-secondary" style={{ fontSize: 12, fontWeight: 500 }}>Line {idx + 1}</span>
                        <button onClick={() => removeLine(line.id)} disabled={formLines.length <= 1} style={{ background: 'none', border: 'none', cursor: formLines.length <= 1 ? 'not-allowed' : 'pointer', fontSize: 12, color: '#a0a2aa', opacity: formLines.length <= 1 ? 0.3 : 1 }}>Remove</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Select label="From Subsidiary" options={entityOptions} value={line.fromSubsidiary} onChange={(e) => updateLine(line.id, "fromSubsidiary", e.target.value)} />
                        <Select label="To Subsidiary" options={entityOptions} value={line.toSubsidiary} onChange={(e) => updateLine(line.id, "toSubsidiary", e.target.value)} />
                        <Input label="Amount" type="number" step="0.01" min="0" placeholder="0.00" value={line.amount} onChange={(e) => updateLine(line.id, "amount", e.target.value)} />
                        <Select label="Account" options={accountOptions} value={line.account} onChange={(e) => updateLine(line.id, "account", e.target.value)} />
                        <div className="sm:col-span-2">
                          <Input label="Description" placeholder="Line description" value={line.description} onChange={(e) => updateLine(line.id, "description", e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3 px-1">
                  <span className="mx-text-secondary" style={{ fontSize: 14 }}>Total</span>
                  <span style={{ fontSize: 14, fontFamily: 'monospace', fontWeight: 500, color: '#2D2926' }}>{formatCurrency(totalAmount)}</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2" style={{ borderTop: '1px solid #E9E9E9' }}>
                <Button variant="default" onClick={() => { setShowCreateModal(false); resetForm(); }}>Cancel</Button>
                <Button variant="default" onClick={() => setShowPreview(true)} disabled={!canCreate}><Eye size={14} className="mr-1" /> Preview Entry</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-5" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="mx-card" style={{ padding: 16 }}>
                <div className="flex justify-between" style={{ fontSize: 14, marginBottom: 8 }}><span className="mx-text-secondary">Name</span><span style={{ fontWeight: 500, color: '#2D2926' }}>{formName}</span></div>
                <div className="flex justify-between" style={{ fontSize: 14, marginBottom: 8 }}><span className="mx-text-secondary">Date</span><span style={{ color: '#2D2926' }}>{formDate}</span></div>
                <div className="flex justify-between" style={{ fontSize: 14 }}><span className="mx-text-secondary">Currency</span><span style={{ color: '#2D2926' }}>{formCurrency}</span></div>
                {formAttachmentUrl && (
                  <div className="flex justify-between" style={{ fontSize: 14, marginTop: 8 }}><span className="mx-text-secondary">Attachment</span><span style={{ color: '#154738', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formAttachmentUrl}</span></div>
                )}
              </div>
              <div className="space-y-2">
                <h3 style={{ fontSize: 14, fontWeight: 500, color: '#2D2926' }}>Lines</h3>
                {formLines.map((line, idx) => (
                  <div key={line.id} className="mx-card" style={{ padding: 12, fontSize: 14 }}>
                    <div className="flex justify-between"><span className="mx-text-secondary">Line {idx + 1}</span><span style={{ fontFamily: 'monospace', color: '#2D2926' }}>{formatCurrency(parseFloat(line.amount) || 0)}</span></div>
                    <div className="mx-text-secondary" style={{ marginTop: 4 }}>{getEntityLabel(line.fromSubsidiary) || "—"} <ArrowRight size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> {getEntityLabel(line.toSubsidiary) || "—"}</div>
                    {line.account && <div className="mx-text-secondary" style={{ marginTop: 2 }}>Account: {getAccountLabel(line.account)}</div>}
                    {line.description && <div className="mx-text-secondary" style={{ marginTop: 2 }}>{line.description}</div>}
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 px-1" style={{ borderTop: '1px solid #E9E9E9' }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#2D2926' }}>Total</span>
                  <span style={{ fontSize: 14, fontFamily: 'monospace', fontWeight: 500, color: '#2D2926' }}>{formatCurrency(totalAmount)}</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2" style={{ borderTop: '1px solid #E9E9E9' }}>
                <Button variant="text" onClick={() => setShowPreview(false)}><ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} className="mr-1" /> Back to Edit</Button>
                <Button onClick={handleCreate}>Create Entry</Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

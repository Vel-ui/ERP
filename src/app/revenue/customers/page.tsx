"use client";

import { useState, useMemo } from "react";
import { Plus, Download, GitMerge, Search } from "lucide-react";
import { Button, Input, Select, Modal, Tag } from "@/components/ui";
import { MOCK_AR_CUSTOMERS, AR_PAYMENT_TERMS, type ARCustomer } from "@/lib/mock-data";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

type SortField = keyof Pick<ARCustomer, "companyName" | "invoicingName" | "email" | "paymentTerms" | "balance" | "status">;
type SortDir = "asc" | "desc";

const SEGMENTS = [
  { value: "Enterprise", label: "Enterprise" },
  { value: "Mid-Market", label: "Mid-Market" },
  { value: "Startup", label: "Startup" },
  { value: "SMB", label: "SMB" },
];

const DEPARTMENTS = [
  { value: "Sales", label: "Sales" },
  { value: "Marketing", label: "Marketing" },
  { value: "Engineering", label: "Engineering" },
  { value: "Operations", label: "Operations" },
];

const emptyForm = {
  companyName: "",
  invoicingName: "",
  email: "",
  ccEmail: "",
  address: "",
  shippingAddress: "",
  notes: "",
  autoReminders: true,
  onlinePayments: false,
  paymentTerms: "Net 30",
  taxRate: "0",
  department: "",
  customerSegment: "",
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<ARCustomer[]>(MOCK_AR_CUSTOMERS);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("companyName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = customers.filter(
      (c) =>
        c.companyName.toLowerCase().includes(q) ||
        c.invoicingName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
    );
    list.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const cmp = typeof aVal === "number" ? aVal - (bVal as number) : String(aVal).localeCompare(String(bVal));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [customers, search, sortField, sortDir]);

  const handleAdd = () => {
    const newCust: ARCustomer = {
      id: `cust-${Date.now()}`,
      companyName: form.companyName,
      invoicingName: form.invoicingName || form.companyName,
      email: form.email,
      ccEmail: form.ccEmail,
      address: form.address,
      shippingAddress: form.shippingAddress || form.address,
      paymentTerms: form.paymentTerms,
      balance: 0,
      status: "Active",
      notes: form.notes,
      autoReminders: form.autoReminders,
      onlinePayments: form.onlinePayments,
      taxRate: parseFloat(form.taxRate) || 0,
      department: form.department,
      customerSegment: form.customerSegment,
    };
    setCustomers((prev) => [...prev, newCust]);
    setForm(emptyForm);
    setModalOpen(false);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleMerge = () => {
    if (selected.size !== 2) return;
    const [keepId, removeId] = Array.from(selected);
    setCustomers((prev) => prev.filter((c) => c.id !== removeId));
    setSelected(new Set());
    alert(`Merged customer into ${customers.find((c) => c.id === keepId)?.companyName}`);
  };

  const handleExport = () => {
    const csv = [
      "Company Name,Invoicing Name,Email,Payment Terms,Balance,Status",
      ...filtered.map((c) => `"${c.companyName}","${c.invoicingName}","${c.email}","${c.paymentTerms}",${c.balance},"${c.status}"`),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="ml-1 text-xs">{sortField === field ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>
  );

  return (
    <div style={{ padding: 24, background: "#f9f9f9" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Customers</h1>
            <p className="mx-text-secondary mt-1">{customers.length} total customers</p>
          </div>
          <div className="flex gap-2">
            <Button variant="default" size="sm" onClick={handleExport}>
              <Download size={14} className="mr-1 inline" />
              Export
            </Button>
            {selected.size === 2 && (
              <Button variant="default" size="sm" onClick={handleMerge}>
                <GitMerge size={14} className="mr-1 inline" />
                Merge Selected
              </Button>
            )}
            <Button size="sm" onClick={() => setModalOpen(true)}>
              <Plus size={14} className="mr-1 inline" />
              Add Customer
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="mx-table-container">
          <table className="mx-table">
            <thead>
              <tr>
                <th style={{ width: 40 }} />
                {([
                  ["companyName", "Company Name"],
                  ["invoicingName", "Invoicing Name"],
                  ["email", "Email"],
                  ["paymentTerms", "Payment Terms"],
                  ["balance", "Balance"],
                  ["status", "Status"],
                ] as [SortField, string][]).map(([field, label]) => (
                  <th
                    key={field}
                    className="cursor-pointer select-none"
                    onClick={() => toggleSort(field)}
                  >
                    {label}
                    <SortIcon field={field} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={() => toggleSelect(c.id)}
                      className="mx-checkbox"
                    />
                  </td>
                  <td style={{ fontWeight: 500 }}>{c.companyName}</td>
                  <td>{c.invoicingName}</td>
                  <td className="mx-text-secondary">{c.email}</td>
                  <td>{c.paymentTerms}</td>
                  <td>{fmt(c.balance)}</td>
                  <td>
                    <Tag variant={c.status === "Active" ? "success" : "default"}>{c.status}</Tag>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="mx-text-secondary" style={{ textAlign: "center", padding: 32 }}>
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Customer" size="lg">
          <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Company Name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} required />
              <Input label="Invoicing Name" value={form.invoicingName} onChange={(e) => setForm({ ...form, invoicingName: e.target.value })} placeholder="Same as company if blank" />
            </div>
            <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            <Input label="Shipping Address" value={form.shippingAddress} onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })} placeholder="Same as address if blank" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Main Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <Input label="CC Email" type="email" value={form.ccEmail} onChange={(e) => setForm({ ...form, ccEmail: e.target.value })} />
            </div>
            <Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <div className="grid grid-cols-2 gap-4">
              <Select label="Payment Terms" options={AR_PAYMENT_TERMS} value={form.paymentTerms} onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })} />
              <Input label="Tax Rate (%)" type="number" value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select label="Department" options={DEPARTMENTS} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Select department" />
              <Select label="Customer Segment" options={SEGMENTS} value={form.customerSegment} onChange={(e) => setForm({ ...form, customerSegment: e.target.value })} placeholder="Select segment" />
            </div>
            <div className="flex gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.autoReminders} onChange={(e) => setForm({ ...form, autoReminders: e.target.checked })} className="mx-checkbox" />
                Automatic Reminders
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.onlinePayments} onChange={(e) => setForm({ ...form, onlinePayments: e.target.checked })} className="mx-checkbox" />
                Online Payments (Stripe)
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-4" style={{ borderTop: "1px solid var(--mx-border)" }}>
              <Button variant="text" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={!form.companyName || !form.email}>Create Customer</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

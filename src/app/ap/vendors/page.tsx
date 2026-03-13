"use client";

import { useState } from "react";
import { Button, Input, Select, Modal } from "@/components/ui";

/* ───────────────── Types ───────────────── */

interface Vendor {
  id: string;
  name: string;
  pointPerson: string;
  email: string;
  paymentMethod: string;
  paymentTerms: string;
  is1099: boolean;
  status: "active" | "inactive";
  address: { country: string; city: string; state: string; zip: string };
  taxId: string;
  defaultAccount: string;
  department: string;
  customerSegment: string;
}

/* ───────────────── Mock Data ───────────────── */

const initialVendors: Vendor[] = [
  {
    id: "V-001", name: "Amazon Web Services", pointPerson: "Sarah Chen", email: "billing@aws.amazon.com",
    paymentMethod: "Bank Transfer", paymentTerms: "Net 30", is1099: false, status: "active",
    address: { country: "US", city: "Seattle", state: "WA", zip: "98109" },
    taxId: "91-1234567", defaultAccount: "6100 - Cloud Hosting", department: "Engineering", customerSegment: "Technology",
  },
  {
    id: "V-002", name: "Gusto Inc.", pointPerson: "Mike Rodriguez", email: "ap@gusto.com",
    paymentMethod: "Bank Transfer", paymentTerms: "Net 15", is1099: false, status: "active",
    address: { country: "US", city: "San Francisco", state: "CA", zip: "94105" },
    taxId: "46-5678901", defaultAccount: "6200 - Salaries", department: "Human Resources", customerSegment: "Services",
  },
  {
    id: "V-003", name: "Google Cloud", pointPerson: "Lisa Park", email: "cloud-billing@google.com",
    paymentMethod: "Credit Card", paymentTerms: "Net 30", is1099: false, status: "active",
    address: { country: "US", city: "Mountain View", state: "CA", zip: "94043" },
    taxId: "77-2345678", defaultAccount: "6300 - Software", department: "Engineering", customerSegment: "Technology",
  },
  {
    id: "V-004", name: "WeWork", pointPerson: "James Kim", email: "invoices@wework.com",
    paymentMethod: "Bank Transfer", paymentTerms: "Net 30", is1099: false, status: "active",
    address: { country: "US", city: "New York", state: "NY", zip: "10001" },
    taxId: "20-3456789", defaultAccount: "6500 - Rent", department: "Operations", customerSegment: "Real Estate",
  },
  {
    id: "V-005", name: "Johnson Legal LLP", pointPerson: "Patricia Johnson", email: "billing@johnsonlegal.com",
    paymentMethod: "Bank Transfer", paymentTerms: "Net 45", is1099: true, status: "active",
    address: { country: "US", city: "Chicago", state: "IL", zip: "60601" },
    taxId: "36-4567890", defaultAccount: "6600 - Legal Fees", department: "Legal", customerSegment: "Professional Services",
  },
  {
    id: "V-006", name: "Staples Inc.", pointPerson: "Robert Lee", email: "corporate@staples.com",
    paymentMethod: "Credit Card", paymentTerms: "Due on Receipt", is1099: false, status: "inactive",
    address: { country: "US", city: "Framingham", state: "MA", zip: "01702" },
    taxId: "04-5678901", defaultAccount: "6400 - Office Supplies", department: "Operations", customerSegment: "Retail",
  },
];

const PAYMENT_METHODS = [
  { value: "bank", label: "Bank Transfer" },
  { value: "credit", label: "Credit Card" },
  { value: "debit", label: "Debit Card" },
];

const PAYMENT_TERMS = [
  { value: "due-receipt", label: "Due on Receipt" },
  { value: "net-15", label: "Net 15" },
  { value: "net-30", label: "Net 30" },
  { value: "net-45", label: "Net 45" },
  { value: "net-60", label: "Net 60" },
];

const GL_ACCOUNTS = [
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

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-500/15 text-green-400",
    inactive: "bg-zinc-500/15 text-zinc-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? "bg-sidebar text-muted"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

/* ───────────────── Component ───────────────── */

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  /* Form state */
  const [formName, setFormName] = useState("");
  const [formPerson, setFormPerson] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCountry, setFormCountry] = useState("US");
  const [formCity, setFormCity] = useState("");
  const [formState, setFormState] = useState("");
  const [formZip, setFormZip] = useState("");
  const [formTaxId, setFormTaxId] = useState("");
  const [formIs1099, setFormIs1099] = useState(false);
  const [formPaymentMethod, setFormPaymentMethod] = useState("bank");
  const [formPaymentTerms, setFormPaymentTerms] = useState("net-30");
  const [formDefaultAccount, setFormDefaultAccount] = useState("");
  const [formDepartment, setFormDepartment] = useState("");
  const [formSegment, setFormSegment] = useState("");

  const filteredVendors = vendors.filter((v) => {
    if (!searchText) return true;
    const q = searchText.toLowerCase();
    return v.name.toLowerCase().includes(q) || v.email.toLowerCase().includes(q) || v.pointPerson.toLowerCase().includes(q);
  });

  function resetForm() {
    setFormName(""); setFormPerson(""); setFormEmail("");
    setFormCountry("US"); setFormCity(""); setFormState(""); setFormZip("");
    setFormTaxId(""); setFormIs1099(false); setFormPaymentMethod("bank");
    setFormPaymentTerms("net-30"); setFormDefaultAccount(""); setFormDepartment(""); setFormSegment("");
  }

  function handleAddVendor() {
    if (!formName) return;
    const newVendor: Vendor = {
      id: `V-${String(vendors.length + 1).padStart(3, "0")}`,
      name: formName,
      pointPerson: formPerson,
      email: formEmail,
      paymentMethod: PAYMENT_METHODS.find((p) => p.value === formPaymentMethod)?.label ?? formPaymentMethod,
      paymentTerms: PAYMENT_TERMS.find((p) => p.value === formPaymentTerms)?.label ?? formPaymentTerms,
      is1099: formIs1099,
      status: "active",
      address: { country: formCountry, city: formCity, state: formState, zip: formZip },
      taxId: formTaxId,
      defaultAccount: GL_ACCOUNTS.find((a) => a.value === formDefaultAccount)?.label ?? formDefaultAccount,
      department: DEPARTMENTS.find((d) => d.value === formDepartment)?.label ?? formDepartment,
      customerSegment: formSegment,
    };
    setVendors((prev) => [...prev, newVendor]);
    resetForm();
    setModalOpen(false);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Vendors</h1>
          <p className="mt-1 text-sm text-muted">{vendors.length} vendors total</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>+ Add Vendor</Button>
      </div>

      {/* Search */}
      <div className="mt-6 w-80">
        <Input
          placeholder="Search vendors…"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="mt-4 overflow-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-sidebar text-left text-xs text-muted">
              <th className="px-4 py-3">Vendor Name</th>
              <th className="px-4 py-3">Point Person</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Payment Method</th>
              <th className="px-4 py-3">Payment Terms</th>
              <th className="px-4 py-3 text-center">1099</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map((v) => (
              <tr key={v.id} className="border-b border-border transition-colors hover:bg-sidebar-hover">
                <td className="px-4 py-3 font-medium text-foreground">{v.name}</td>
                <td className="px-4 py-3 text-muted">{v.pointPerson}</td>
                <td className="px-4 py-3 text-muted">{v.email}</td>
                <td className="px-4 py-3 text-muted">{v.paymentMethod}</td>
                <td className="px-4 py-3 text-muted">{v.paymentTerms}</td>
                <td className="px-4 py-3 text-center">
                  {v.is1099 ? (
                    <span className="inline-flex items-center rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-medium text-blue-400">Yes</span>
                  ) : (
                    <span className="text-xs text-muted">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={v.status} />
                </td>
              </tr>
            ))}
            {filteredVendors.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted">
                  No vendors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Vendor Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} title="Add Vendor" size="lg">
        <div className="max-h-[70vh] overflow-y-auto space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Vendor Name" placeholder="e.g. Acme Corp" value={formName} onChange={(e) => setFormName(e.target.value)} />
            <Input label="Point Person" placeholder="e.g. John Smith" value={formPerson} onChange={(e) => setFormPerson(e.target.value)} />
          </div>
          <Input label="Email" type="email" placeholder="billing@example.com" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />

          {/* Address */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Address</p>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Country" value={formCountry} onChange={(e) => setFormCountry(e.target.value)} />
              <Input label="City" value={formCity} onChange={(e) => setFormCity(e.target.value)} />
              <Input label="State" value={formState} onChange={(e) => setFormState(e.target.value)} />
              <Input label="ZIP Code" value={formZip} onChange={(e) => setFormZip(e.target.value)} />
            </div>
          </div>

          {/* Tax & Compliance */}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tax ID" placeholder="XX-XXXXXXX" value={formTaxId} onChange={(e) => setFormTaxId(e.target.value)} />
            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">1099 Eligible</label>
              <button
                type="button"
                onClick={() => setFormIs1099(!formIs1099)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formIs1099 ? "bg-accent" : "bg-sidebar-hover"}`}
              >
                <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${formIs1099 ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>

          {/* Payment */}
          <div className="grid grid-cols-2 gap-4">
            <Select label="Payment Method" options={PAYMENT_METHODS} value={formPaymentMethod} onChange={(e) => setFormPaymentMethod(e.target.value)} />
            <Select label="Payment Terms" options={PAYMENT_TERMS} value={formPaymentTerms} onChange={(e) => setFormPaymentTerms(e.target.value)} />
          </div>

          {/* Accounting */}
          <div className="grid grid-cols-3 gap-4">
            <Select label="Default Account" options={GL_ACCOUNTS} placeholder="Select…" value={formDefaultAccount} onChange={(e) => setFormDefaultAccount(e.target.value)} />
            <Select label="Department" options={DEPARTMENTS} placeholder="Select…" value={formDepartment} onChange={(e) => setFormDepartment(e.target.value)} />
            <Input label="Customer Segment" placeholder="e.g. Technology" value={formSegment} onChange={(e) => setFormSegment(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="default" onClick={() => { setModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleAddVendor}>Add Vendor</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

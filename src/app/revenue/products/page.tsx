"use client";

import { useState, useMemo } from "react";
import { Plus, CheckCircle, XCircle } from "lucide-react";
import { Button, Input, Select, Modal, Tag } from "@/components/ui";
import { MOCK_AR_PRODUCTS, type ARProduct } from "@/lib/mock-data";

type SortField = keyof Pick<ARProduct, "name" | "type" | "revenueType" | "pricing" | "status">;
type SortDir = "asc" | "desc";

const REVENUE_ACCOUNTS = [
  { value: "4000 - Revenue", label: "4000 - Revenue" },
  { value: "4200 - Professional Services", label: "4200 - Professional Services" },
  { value: "4300 - Support Revenue", label: "4300 - Support Revenue" },
];

const DISCOUNT_ACCOUNTS = [
  { value: "", label: "None" },
  { value: "4100 - Discounts", label: "4100 - Discounts" },
];

const REVENUE_PATTERNS = [
  { value: "Even Period Prorated First & Last", label: "Even Period Prorated First & Last" },
  { value: "Daily", label: "Daily" },
];

const TIER_TYPES = [
  { value: "Standard", label: "Standard" },
  { value: "Graduated", label: "Graduated" },
  { value: "Volume", label: "Volume" },
];

const emptyForm = {
  name: "",
  type: "Revenue" as "Revenue" | "Non-Revenue",
  revenueType: "Fixed" as "Fixed" | "Usage",
  pricing: "Recurring" as "Recurring" | "One-time",
  countToMrrArr: true,
  revenueAccount: "4000 - Revenue",
  discountAccount: "",
  revenuePattern: "Even Period Prorated First & Last",
  usageTierType: "Standard" as "Standard" | "Graduated" | "Volume",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<ARProduct[]>(MOCK_AR_PRODUCTS);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = products.filter((p) => p.name.toLowerCase().includes(q));
    list.sort((a, b) => {
      const cmp = String(a[sortField]).localeCompare(String(b[sortField]));
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [products, search, sortField, sortDir]);

  const handleAdd = () => {
    const newProd: ARProduct = {
      id: `prod-${Date.now()}`,
      name: form.name,
      type: form.type,
      revenueType: form.revenueType,
      pricing: form.pricing,
      countToMrrArr: form.countToMrrArr,
      status: "Active",
      revenueAccount: form.revenueAccount,
      discountAccount: form.discountAccount,
      revenuePattern: form.revenuePattern,
      ...(form.revenueType === "Usage" ? { usageTierType: form.usageTierType } : {}),
    };
    setProducts((prev) => [...prev, newProd]);
    setForm(emptyForm);
    setModalOpen(false);
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="ml-1 text-xs">{sortField === field ? (sortDir === "asc" ? "↑" : "↓") : "↕"}</span>
  );

  return (
    <div style={{ padding: 24, background: "#f9f9f9" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Products</h1>
            <p className="mx-text-secondary mt-1">{products.length} total products</p>
          </div>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus size={14} className="mr-1 inline" />
            Add Product
          </Button>
        </div>

        <div className="mb-4">
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="mx-table-container">
          <table className="mx-table">
            <thead>
              <tr>
                {([
                  ["name", "Product Name"],
                  ["type", "Type"],
                  ["revenueType", "Revenue Type"],
                  ["pricing", "Pricing"],
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
                <th>MRR/ARR</th>
                <th
                  className="cursor-pointer select-none"
                  onClick={() => toggleSort("status")}
                >
                  Status
                  <SortIcon field="status" />
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500 }}>{p.name}</td>
                  <td>
                    <Tag variant={p.type === "Revenue" ? "processing" : "default"}>{p.type}</Tag>
                  </td>
                  <td>{p.revenueType}</td>
                  <td>{p.pricing}</td>
                  <td>
                    {p.countToMrrArr ? (
                      <span className="flex items-center gap-1" style={{ color: "#067f54" }}>
                        <CheckCircle size={14} /> Yes
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 mx-text-secondary">
                        <XCircle size={14} /> No
                      </span>
                    )}
                  </td>
                  <td>
                    <Tag variant={p.status === "Active" ? "success" : "default"}>{p.status}</Tag>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="mx-text-secondary" style={{ textAlign: "center", padding: 32 }}>
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Product" size="lg">
          <div className="space-y-4">
            <Input label="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />

            <div className="space-y-2">
              <label className="block text-sm font-medium">Product Type</label>
              <div className="flex gap-4">
                {(["Revenue", "Non-Revenue"] as const).map((t) => (
                  <button
                    key={t}
                    className="rounded-md border px-4 py-2 text-sm font-medium transition-colors"
                    style={
                      form.type === t
                        ? { borderColor: "var(--mx-primary)", background: "var(--mx-primary-bg)", color: "var(--mx-primary)" }
                        : { borderColor: "var(--mx-border)", background: "#fff", color: "#61636a" }
                    }
                    onClick={() => setForm({ ...form, type: t })}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Revenue Type</label>
              <div className="flex gap-4">
                {(["Fixed", "Usage"] as const).map((t) => (
                  <button
                    key={t}
                    className="rounded-md border px-4 py-2 text-sm font-medium transition-colors"
                    style={
                      form.revenueType === t
                        ? { borderColor: "var(--mx-primary)", background: "var(--mx-primary-bg)", color: "var(--mx-primary)" }
                        : { borderColor: "var(--mx-border)", background: "#fff", color: "#61636a" }
                    }
                    onClick={() => setForm({ ...form, revenueType: t })}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {form.revenueType === "Usage" && (
              <Select
                label="Usage Tier Type"
                options={TIER_TYPES}
                value={form.usageTierType}
                onChange={(e) => setForm({ ...form, usageTierType: e.target.value as "Standard" | "Graduated" | "Volume" })}
              />
            )}

            <Select label="Revenue Account" options={REVENUE_ACCOUNTS} value={form.revenueAccount} onChange={(e) => setForm({ ...form, revenueAccount: e.target.value })} />
            <Select label="Discount Account (optional)" options={DISCOUNT_ACCOUNTS} value={form.discountAccount} onChange={(e) => setForm({ ...form, discountAccount: e.target.value })} />
            <Select label="Revenue Pattern" options={REVENUE_PATTERNS} value={form.revenuePattern} onChange={(e) => setForm({ ...form, revenuePattern: e.target.value })} />

            <div className="space-y-2">
              <label className="block text-sm font-medium">Pricing</label>
              <div className="flex gap-4">
                {(["Recurring", "One-time"] as const).map((t) => (
                  <button
                    key={t}
                    className="rounded-md border px-4 py-2 text-sm font-medium transition-colors"
                    style={
                      form.pricing === t
                        ? { borderColor: "var(--mx-primary)", background: "var(--mx-primary-bg)", color: "var(--mx-primary)" }
                        : { borderColor: "var(--mx-border)", background: "#fff", color: "#61636a" }
                    }
                    onClick={() => setForm({ ...form, pricing: t })}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.countToMrrArr}
                onChange={(e) => setForm({ ...form, countToMrrArr: e.target.checked })}
                className="mx-checkbox"
              />
              Count to MRR/ARR
            </label>

            <div className="flex justify-end gap-2 pt-4" style={{ borderTop: "1px solid var(--mx-border)" }}>
              <Button variant="text" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={handleAdd} disabled={!form.name}>Create Product</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

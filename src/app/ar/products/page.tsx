"use client";

import { useState, useMemo } from "react";
import { Button, Input, Select, Modal } from "@/components/ui";
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
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Products</h1>
          <p className="mt-1 text-sm text-muted">{products.length} total products</p>
        </div>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          + Add Product
        </Button>
      </div>

      <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-sidebar">
              {([
                ["name", "Product Name"],
                ["type", "Type"],
                ["revenueType", "Revenue Type"],
                ["pricing", "Pricing"],
              ] as [SortField, string][]).map(([field, label]) => (
                <th
                  key={field}
                  className="cursor-pointer px-4 py-3 font-medium text-muted select-none hover:text-foreground"
                  onClick={() => toggleSort(field)}
                >
                  {label}
                  <SortIcon field={field} />
                </th>
              ))}
              <th className="px-4 py-3 font-medium text-muted">MRR/ARR</th>
              <th
                className="cursor-pointer px-4 py-3 font-medium text-muted select-none hover:text-foreground"
                onClick={() => toggleSort("status")}
              >
                Status
                <SortIcon field="status" />
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border transition-colors hover:bg-sidebar-hover">
                <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${p.type === "Revenue" ? "bg-violet-500/10 text-violet-400" : "bg-zinc-500/10 text-zinc-400"}`}>
                    {p.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-foreground">{p.revenueType}</td>
                <td className="px-4 py-3 text-foreground">{p.pricing}</td>
                <td className="px-4 py-3">
                  {p.countToMrrArr ? (
                    <span className="text-emerald-400">Yes</span>
                  ) : (
                    <span className="text-muted">No</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
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
            <label className="block text-sm font-medium text-foreground">Product Type</label>
            <div className="flex gap-4">
              {(["Revenue", "Non-Revenue"] as const).map((t) => (
                <button
                  key={t}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                    form.type === t
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-sidebar text-muted hover:bg-sidebar-hover"
                  }`}
                  onClick={() => setForm({ ...form, type: t })}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Revenue Type</label>
            <div className="flex gap-4">
              {(["Fixed", "Usage"] as const).map((t) => (
                <button
                  key={t}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                    form.revenueType === t
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-sidebar text-muted hover:bg-sidebar-hover"
                  }`}
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

          <Select
            label="Revenue Account"
            options={REVENUE_ACCOUNTS}
            value={form.revenueAccount}
            onChange={(e) => setForm({ ...form, revenueAccount: e.target.value })}
          />

          <Select
            label="Discount Account (optional)"
            options={DISCOUNT_ACCOUNTS}
            value={form.discountAccount}
            onChange={(e) => setForm({ ...form, discountAccount: e.target.value })}
          />

          <Select
            label="Revenue Pattern"
            options={REVENUE_PATTERNS}
            value={form.revenuePattern}
            onChange={(e) => setForm({ ...form, revenuePattern: e.target.value })}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Pricing</label>
            <div className="flex gap-4">
              {(["Recurring", "One-time"] as const).map((t) => (
                <button
                  key={t}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                    form.pricing === t
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-sidebar text-muted hover:bg-sidebar-hover"
                  }`}
                  onClick={() => setForm({ ...form, pricing: t })}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.countToMrrArr}
              onChange={(e) => setForm({ ...form, countToMrrArr: e.target.checked })}
              className="rounded border-border"
            />
            Count to MRR/ARR
          </label>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.name}>Create Product</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-emerald-500/10 text-emerald-400",
    Inactive: "bg-zinc-500/10 text-zinc-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? "bg-zinc-500/10 text-zinc-400"}`}>
      {status}
    </span>
  );
}

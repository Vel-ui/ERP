"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button, Input, Modal } from "@/components/ui";
import { MOCK_AR_CONTRACTS, type ARContract } from "@/lib/mock-data";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

type Tab = "Active" | "Pending Review";

export default function ContractsPage() {
  const [contracts, setContracts] = useState<ARContract[]>(MOCK_AR_CONTRACTS);
  const [tab, setTab] = useState<Tab>("Active");
  const [search, setSearch] = useState("");
  const [amendModal, setAmendModal] = useState<string | null>(null);
  const [amendReason, setAmendReason] = useState("");
  const [endModal, setEndModal] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return contracts
      .filter((c) => c.status === tab)
      .filter(
        (c) =>
          c.contractNumber.toLowerCase().includes(q) ||
          c.customerName.toLowerCase().includes(q)
      );
  }, [contracts, tab, search]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this contract?")) {
      setContracts((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleAmend = () => {
    if (!amendReason.trim()) return;
    alert(`Contract amended. Reason: ${amendReason}`);
    setAmendModal(null);
    setAmendReason("");
  };

  const handleEnd = (id: string) => {
    setContracts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Expired" as ARContract["status"], endDate: new Date().toISOString().split("T")[0] } : c))
    );
    setEndModal(null);
  };

  const handleExportGL = (contract: ARContract) => {
    const rows = [
      "Product,Quantity,Unit Price,Discount %,Total",
      ...contract.products.map((p) => `"${p.productName}",${p.quantity},${p.unitPrice},${p.discount}%,${p.total}`),
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${contract.contractNumber}-gl-impact.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: Tab[] = ["Active", "Pending Review"];

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Contracts</h1>
          <p className="mt-1 text-sm text-muted">{contracts.length} total contracts</p>
        </div>
        <Link href="/ar/contracts/create">
          <Button size="sm">+ Add Contract</Button>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex rounded-lg border border-border bg-sidebar p-1">
          {tabs.map((t) => (
            <button
              key={t}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === t ? "bg-accent text-white" : "text-muted hover:text-foreground"
              }`}
              onClick={() => setTab(t)}
            >
              {t}
              <span className="ml-2 rounded-full bg-background px-1.5 py-0.5 text-xs">
                {contracts.filter((c) => c.status === t).length}
              </span>
            </button>
          ))}
        </div>
        <div className="flex-1">
          <Input placeholder="Search contracts..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-sidebar">
              <th className="px-4 py-3 font-medium text-muted">Contract #</th>
              <th className="px-4 py-3 font-medium text-muted">Customer</th>
              <th className="px-4 py-3 font-medium text-muted">Type</th>
              <th className="px-4 py-3 font-medium text-muted">Start Date</th>
              <th className="px-4 py-3 font-medium text-muted">End Date</th>
              <th className="px-4 py-3 font-medium text-muted">Duration</th>
              <th className="px-4 py-3 font-medium text-muted">ARR</th>
              <th className="px-4 py-3 font-medium text-muted">Status</th>
              <th className="px-4 py-3 font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-border transition-colors hover:bg-sidebar-hover">
                <td className="px-4 py-3 font-medium text-foreground">{c.contractNumber}</td>
                <td className="px-4 py-3 text-foreground">{c.customerName}</td>
                <td className="px-4 py-3">
                  <TypeBadge type={c.type} />
                </td>
                <td className="px-4 py-3 text-muted">{c.startDate}</td>
                <td className="px-4 py-3 text-muted">{c.endDate || "Open"}</td>
                <td className="px-4 py-3 text-foreground">{c.duration}</td>
                <td className="px-4 py-3 font-medium text-foreground">{fmt(c.arr)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Link href="/ar/contracts/create">
                      <button className="rounded px-2 py-1 text-xs text-muted hover:bg-sidebar-hover hover:text-foreground">
                        Edit
                      </button>
                    </Link>
                    <button
                      className="rounded px-2 py-1 text-xs text-muted hover:bg-sidebar-hover hover:text-foreground"
                      onClick={() => handleDelete(c.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="rounded px-2 py-1 text-xs text-muted hover:bg-sidebar-hover hover:text-foreground"
                      onClick={() => setAmendModal(c.id)}
                    >
                      Amend
                    </button>
                    <button
                      className="rounded px-2 py-1 text-xs text-muted hover:bg-sidebar-hover hover:text-foreground"
                      onClick={() => setEndModal(c.id)}
                    >
                      End
                    </button>
                    <button
                      className="rounded px-2 py-1 text-xs text-accent hover:bg-sidebar-hover hover:text-accent-hover"
                      onClick={() => handleExportGL(c)}
                    >
                      GL Impact
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-muted">
                  No contracts found in &quot;{tab}&quot;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={!!amendModal} onClose={() => { setAmendModal(null); setAmendReason(""); }} title="Amend Contract" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Provide a reason for amending contract{" "}
            <span className="font-medium text-foreground">
              {contracts.find((c) => c.id === amendModal)?.contractNumber}
            </span>
          </p>
          <Input
            label="Amendment Reason"
            value={amendReason}
            onChange={(e) => setAmendReason(e.target.value)}
            placeholder="e.g., Price adjustment per negotiation"
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="text" onClick={() => { setAmendModal(null); setAmendReason(""); }}>Cancel</Button>
            <Button onClick={handleAmend} disabled={!amendReason.trim()}>Submit Amendment</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!endModal} onClose={() => setEndModal(null)} title="End Contract" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-muted">
            Are you sure you want to end contract{" "}
            <span className="font-medium text-foreground">
              {contracts.find((c) => c.id === endModal)?.contractNumber}
            </span>
            ? This will set the end date to today.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="text" onClick={() => setEndModal(null)}>Cancel</Button>
            <Button onClick={() => endModal && handleEnd(endModal)}>End Contract</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-emerald-500/10 text-emerald-400",
    "Pending Review": "bg-yellow-500/10 text-yellow-400",
    Expired: "bg-zinc-500/10 text-zinc-400",
    Cancelled: "bg-red-500/10 text-red-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? "bg-zinc-500/10 text-zinc-400"}`}>
      {status}
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    "New Sales": "bg-blue-500/10 text-blue-400",
    Existing: "bg-zinc-500/10 text-zinc-400",
    Expansion: "bg-emerald-500/10 text-emerald-400",
    Reactivation: "bg-violet-500/10 text-violet-400",
    Contraction: "bg-orange-500/10 text-orange-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[type] ?? "bg-zinc-500/10 text-zinc-400"}`}>
      {type}
    </span>
  );
}

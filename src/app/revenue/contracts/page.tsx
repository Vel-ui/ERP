"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, FileEdit, StopCircle, Download } from "lucide-react";
import { Button, Input, Modal, Tag } from "@/components/ui";
import { MOCK_AR_CONTRACTS, type ARContract } from "@/lib/mock-data";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

type Tab = "Active" | "Pending Review";

function statusVariant(status: string): "success" | "warning" | "error" | "default" | "processing" {
  const map: Record<string, "success" | "warning" | "error" | "default" | "processing"> = {
    Active: "success",
    "Pending Review": "warning",
    Expired: "default",
    Cancelled: "error",
  };
  return map[status] ?? "default";
}

function typeVariant(type: string): "processing" | "default" | "success" | "mint" | "warning" {
  const map: Record<string, "processing" | "default" | "success" | "mint" | "warning"> = {
    "New Sales": "processing",
    Existing: "default",
    Expansion: "success",
    Reactivation: "mint",
    Contraction: "warning",
  };
  return map[type] ?? "default";
}

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
    <div style={{ padding: 24, background: "#f9f9f9" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Contracts</h1>
            <p className="mx-text-secondary mt-1">{contracts.length} total contracts</p>
          </div>
          <Link href="/revenue/contracts/create">
            <Button size="sm">
              <Plus size={14} className="mr-1 inline" />
              Add Contract
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex rounded-lg p-1" style={{ background: "#fff", border: "1px solid var(--mx-border)" }}>
            {tabs.map((t) => (
              <button
                key={t}
                className="rounded-md px-4 py-1.5 text-sm font-medium transition-colors"
                style={
                  tab === t
                    ? { background: "var(--mx-primary)", color: "#fff" }
                    : { color: "#61636a" }
                }
                onClick={() => setTab(t)}
              >
                {t}
                <span
                  className="ml-2 rounded-full px-1.5 py-0.5 text-xs"
                  style={{ background: tab === t ? "rgba(255,255,255,0.2)" : "var(--mx-primary-bg)" }}
                >
                  {contracts.filter((c) => c.status === t).length}
                </span>
              </button>
            ))}
          </div>
          <div className="flex-1">
            <Input placeholder="Search contracts..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="mx-table-container">
          <table className="mx-table">
            <thead>
              <tr>
                <th>Contract #</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Duration</th>
                <th>ARR</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500 }}>{c.contractNumber}</td>
                  <td>{c.customerName}</td>
                  <td>
                    <Tag variant={typeVariant(c.type)}>{c.type}</Tag>
                  </td>
                  <td className="mx-text-secondary">{c.startDate}</td>
                  <td className="mx-text-secondary">{c.endDate || "Open"}</td>
                  <td>{c.duration}</td>
                  <td style={{ fontWeight: 500 }}>{fmt(c.arr)}</td>
                  <td>
                    <Tag variant={statusVariant(c.status)}>{c.status}</Tag>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Link href="/revenue/contracts/create">
                        <Button variant="text" size="sm" className="!px-2 !py-1">
                          <Edit size={14} />
                        </Button>
                      </Link>
                      <Button variant="text" size="sm" className="!px-2 !py-1" onClick={() => handleDelete(c.id)}>
                        <Trash2 size={14} />
                      </Button>
                      <Button variant="text" size="sm" className="!px-2 !py-1" onClick={() => setAmendModal(c.id)}>
                        <FileEdit size={14} />
                      </Button>
                      <Button variant="text" size="sm" className="!px-2 !py-1" onClick={() => setEndModal(c.id)}>
                        <StopCircle size={14} />
                      </Button>
                      <Button variant="link" size="sm" className="!px-2 !py-1" onClick={() => handleExportGL(c)}>
                        <Download size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="mx-text-secondary" style={{ textAlign: "center", padding: 32 }}>
                    No contracts found in &quot;{tab}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal isOpen={!!amendModal} onClose={() => { setAmendModal(null); setAmendReason(""); }} title="Amend Contract" size="sm">
          <div className="space-y-4">
            <p className="text-sm mx-text-secondary">
              Provide a reason for amending contract{" "}
              <span style={{ fontWeight: 500, color: "#2D2926" }}>
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
            <p className="text-sm mx-text-secondary">
              Are you sure you want to end contract{" "}
              <span style={{ fontWeight: 500, color: "#2D2926" }}>
                {contracts.find((c) => c.id === endModal)?.contractNumber}
              </span>
              ? This will set the end date to today.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="text" onClick={() => setEndModal(null)}>Cancel</Button>
              <Button variant="danger" onClick={() => endModal && handleEnd(endModal)}>End Contract</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

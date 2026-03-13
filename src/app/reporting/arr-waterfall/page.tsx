"use client";

import { useState, useMemo } from "react";
import { Button, Select, Input, Modal } from "@/components/ui";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface WaterfallRow {
  id: string;
  label: string;
  type: "opening" | "add" | "subtract" | "closing";
  monthly: number[];
}

const WATERFALL: WaterfallRow[] = [
  { id: "opening", label: "Opening ARR", type: "opening", monthly: [1020000, 1054100, 1087200, 1126800, 1155300, 1192500, 1220400, 1261600, 1293200, 1336400, 1368600, 1405800] },
  { id: "new", label: "New Sales", type: "add", monthly: [22000, 18500, 25000, 15500, 28000, 19000, 24500, 16800, 30000, 21500, 23000, 27500] },
  { id: "expansion", label: "Expansion", type: "add", monthly: [12000, 15200, 14500, 13000, 11800, 16000, 13500, 14800, 15500, 12200, 16500, 14000] },
  { id: "reactivation", label: "Reactivation", type: "add", monthly: [3500, 2800, 5000, 2000, 4500, 3200, 6000, 2500, 4000, 3800, 2200, 5500] },
  { id: "contraction", label: "Contraction", type: "subtract", monthly: [1800, 2200, 3000, 1500, 2800, 4000, 1200, 2500, 3200, 1800, 2000, 3500] },
  { id: "churn", label: "Churn", type: "subtract", monthly: [3200, 1800, 2500, 4000, 2200, 3500, 5000, 1800, 3000, 4200, 2800, 1500] },
  { id: "usage", label: "Usage Impact", type: "add", monthly: [800, -200, 1500, -400, 600, 1200, -100, 900, 300, 1100, -300, 700] },
  { id: "fx", label: "FX Impact", type: "add", monthly: [-1200, 800, -900, 3900, -2400, -4000, 2400, 900, -400, -400, 600, -1200] },
  { id: "closing", label: "Closing ARR", type: "closing", monthly: [1054100, 1087200, 1126800, 1155300, 1192500, 1220400, 1261600, 1293200, 1336400, 1368600, 1405800, 1447300] },
];

interface Override {
  id: string;
  type: "contract" | "standalone";
  description: string;
  amount: number;
  closeDate?: string;
  startDate?: string;
  endDate?: string;
  month: number;
}

const MOCK_OVERRIDES: Override[] = [
  { id: "ov1", type: "contract", description: "Acme Corp — Enterprise Renewal", amount: 48000, closeDate: "2025-03-15", startDate: "2025-04-01", endDate: "2026-03-31", month: 3 },
  { id: "ov2", type: "standalone", description: "GlobalTech — Custom ARR Adjustment", amount: 12000, month: 6 },
  { id: "ov3", type: "contract", description: "Initech — Mid-term Upgrade", amount: 24000, closeDate: "2025-07-01", startDate: "2025-07-15", endDate: "2026-07-14", month: 7 },
];

const STAGE_OPTIONS = [
  { value: "all", label: "All Stages" },
  { value: "closed-won", label: "Closed Won" },
  { value: "committed", label: "Committed" },
  { value: "pipeline", label: "Pipeline" },
];

const DEPT_OPTIONS = [
  { value: "all", label: "All Departments" },
  { value: "sales", label: "Sales" },
  { value: "cs", label: "Customer Success" },
  { value: "partnerships", label: "Partnerships" },
];

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });

export default function ArrWaterfallPage() {
  const [stage, setStage] = useState("all");
  const [dept, setDept] = useState("all");
  const [overrides, setOverrides] = useState<Override[]>(MOCK_OVERRIDES);
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [overrideType, setOverrideType] = useState<"contract" | "standalone">("contract");

  const activeOverriddenMonths = useMemo(() => {
    return new Set(overrides.map((o) => o.month));
  }, [overrides]);

  const handleDeleteOverride = (id: string) => {
    setOverrides((prev) => prev.filter((o) => o.id !== id));
  };

  const rowValueColor = (type: WaterfallRow["type"], val: number) => {
    if (type === "opening" || type === "closing") return "";
    if (type === "subtract") return val > 0 ? "text-red-400" : "text-emerald-400";
    return val >= 0 ? "text-emerald-400" : "text-red-400";
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mx-h1">ARR / CARR Waterfall</h1>
          <p className="mt-1 mx-text-secondary">Rollforward view of annual recurring revenue movements</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="default" onClick={() => setOverrideModalOpen(true)}>
            Add Override
          </Button>
          <Button variant="default">Export</Button>
        </div>
      </div>

      <div className="flex items-end gap-4">
        <div className="w-40">
          <Select label="Stage" options={STAGE_OPTIONS} value={stage} onChange={(e) => setStage(e.target.value)} />
        </div>
        <div className="w-44">
          <Select label="Department" options={DEPT_OPTIONS} value={dept} onChange={(e) => setDept(e.target.value)} />
        </div>
      </div>

      <div className="mx-table-container">
        <table className="mx-table">
          <thead>
            <tr>
              <th className="sticky left-0 text-left" style={{ background: 'var(--mx-bg-card)' }}>Category</th>
              {MONTHS.map((m) => (
                <th key={m} className="text-right">{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WATERFALL.map((row) => (
              <tr
                key={row.id}
                className={row.type === "closing" ? "border-t-2 border-border" : ""}
                style={(row.type === "opening" || row.type === "closing") ? { background: 'var(--mx-bg-card)' } : undefined}
              >
                <td
                  className={`sticky left-0 ${row.type === "opening" || row.type === "closing" ? "font-semibold" : ""}`}
                  style={{ background: (row.type === "opening" || row.type === "closing") ? 'var(--mx-bg-card)' : 'var(--mx-bg-container)' }}
                >
                  <span className="flex items-center gap-1">
                    {row.type === "add" && <span className="text-emerald-400">+</span>}
                    {row.type === "subtract" && <span className="text-red-400">−</span>}
                    {row.label}
                  </span>
                </td>
                {row.monthly.map((val, mi) => (
                  <td key={mi} className={`text-right ${rowValueColor(row.type, val)} ${(row.type === "opening" || row.type === "closing") ? "font-semibold" : ""}`}>
                    <span className="inline-flex items-center gap-1">
                      {activeOverriddenMonths.has(mi) && (row.type === "closing" || row.id === "new") && (
                        <span className="inline-block h-2 w-2 rounded-full bg-blue-500" title="Contains override" />
                      )}
                      {row.type === "subtract" ? `(${fmt(val)})` : fmt(val)}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="mb-3 mx-h3">Manual Overrides</h2>
        {overrides.length === 0 ? (
          <div className="mx-card mx-card-white text-center mx-text-secondary py-8">
            No manual overrides applied
          </div>
        ) : (
          <div className="mx-table-container">
            <table className="mx-table">
              <thead>
                <tr>
                  <th className="text-left">Description</th>
                  <th className="text-left">Type</th>
                  <th className="text-right">Amount</th>
                  <th className="text-left">Close Date</th>
                  <th className="text-left">Start Date</th>
                  <th className="text-left">End Date</th>
                  <th className="text-left">Month</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {overrides.map((ov) => (
                  <tr key={ov.id}>
                    <td className="font-medium">
                      <span className="inline-flex items-center gap-2">
                        <span className="inline-block h-2 w-2 rounded-full bg-blue-500" />
                        {ov.description}
                      </span>
                    </td>
                    <td>
                      <span className={ov.type === "contract" ? "mx-tag mx-tag-success" : "mx-tag mx-tag-warning"}>
                        {ov.type === "contract" ? "Contract" : "Standalone"}
                      </span>
                    </td>
                    <td className="text-right font-medium">{fmt(ov.amount)}</td>
                    <td className="mx-text-secondary">{ov.closeDate || "—"}</td>
                    <td className="mx-text-secondary">{ov.startDate || "—"}</td>
                    <td className="mx-text-secondary">{ov.endDate || "—"}</td>
                    <td className="mx-text-secondary">{MONTHS[ov.month]}</td>
                    <td className="text-center">
                      <button
                        onClick={() => handleDeleteOverride(ov.id)}
                        className="rounded p-1 text-red-400 hover:bg-red-500/10"
                        title="Delete override"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={overrideModalOpen} onClose={() => setOverrideModalOpen(false)} title="Add ARR Override" size="lg">
        <div className="space-y-4">
          <div className="mx-segmented">
            {(["contract", "standalone"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setOverrideType(t)}
                className={`mx-segmented-item ${overrideType === t ? "mx-segmented-item-selected" : ""}`}
              >
                {t === "contract" ? "Contract Override" : "Standalone Override"}
              </button>
            ))}
          </div>
          <Input label="Description" placeholder="e.g., Acme Corp — Enterprise Renewal" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Amount" type="number" placeholder="0" />
            <Select
              label="Month"
              options={MONTHS.map((m, i) => ({ value: String(i), label: m }))}
              placeholder="Select month"
            />
          </div>
          {overrideType === "contract" && (
            <div className="grid grid-cols-3 gap-4">
              <Input label="Close Date" type="date" />
              <Input label="Start Date" type="date" />
              <Input label="End Date" type="date" />
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="default" onClick={() => setOverrideModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setOverrideModalOpen(false)}>Save Override</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

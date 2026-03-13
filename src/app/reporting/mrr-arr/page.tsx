"use client";

import { useState, useMemo } from "react";
import { Button, Select } from "@/components/ui";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type ViewMode = "mrr" | "arr";

interface Classification {
  id: string;
  name: string;
  type: "add" | "subtract";
  monthly: number[];
}

const MRR_DATA: Classification[] = [
  { id: "new", name: "New Sales", type: "add", monthly: [12000, 15000, 8500, 22000, 18000, 14000, 19500, 11000, 16500, 21000, 13500, 25000] },
  { id: "expansion", name: "Expansion", type: "add", monthly: [4500, 3200, 6800, 5100, 7200, 4800, 3900, 6100, 5500, 4200, 7800, 5600] },
  { id: "reactivation", name: "Reactivation", type: "add", monthly: [1200, 800, 2000, 500, 1500, 900, 1800, 600, 1100, 2200, 700, 1400] },
  { id: "contraction", name: "Contraction", type: "subtract", monthly: [2100, 1800, 3200, 1500, 2800, 2000, 1700, 2500, 1900, 3100, 2300, 1600] },
  { id: "churn", name: "Churn", type: "subtract", monthly: [5000, 3500, 4200, 6800, 3000, 4500, 5200, 3800, 4000, 2900, 5500, 3200] },
  { id: "usage", name: "Usage Impact", type: "add", monthly: [800, -200, 1500, -400, 600, 1200, -100, 900, 300, 1100, -300, 700] },
  { id: "fx", name: "FX Impact", type: "add", monthly: [-300, 150, -500, 200, -100, 350, -250, 100, -400, 250, 180, -150] },
];

const STAGE_OPTIONS = [
  { value: "all", label: "All Stages" },
  { value: "active", label: "Active" },
  { value: "trial", label: "Trial" },
  { value: "pending", label: "Pending" },
];

const DEPT_OPTIONS = [
  { value: "all", label: "All Departments" },
  { value: "sales", label: "Sales" },
  { value: "cs", label: "Customer Success" },
  { value: "partnerships", label: "Partnerships" },
];

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });

export default function MrrArrPage() {
  const [view, setView] = useState<ViewMode>("mrr");
  const [stage, setStage] = useState("all");
  const [dept, setDept] = useState("all");
  const [countToProduct, setCountToProduct] = useState(true);

  const multiplier = view === "arr" ? 12 : 1;

  const openingMrr = 85000;

  const monthlyNet = useMemo(() => {
    return MONTHS.map((_, mi) => {
      return MRR_DATA.reduce((sum, c) => {
        const val = c.monthly[mi] * multiplier;
        return c.type === "subtract" ? sum - val : sum + val;
      }, 0);
    });
  }, [multiplier]);

  const cumulativeMrr = useMemo(() => {
    const result: number[] = [];
    let running = openingMrr * multiplier;
    for (const net of monthlyNet) {
      running += net;
      result.push(running);
    }
    return result;
  }, [monthlyNet, multiplier]);

  const totalNet = monthlyNet.reduce((s, n) => s + n, 0);

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mx-h1">
            {view === "mrr" ? "MRR" : "ARR"} Report
          </h1>
          <p className="mt-1 mx-text-secondary">
            Monthly and annual recurring revenue classifications and trends
          </p>
        </div>
        <Button variant="default">Export</Button>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="mx-segmented">
          {(["mrr", "arr"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setView(mode)}
              className={`mx-segmented-item ${view === mode ? "mx-segmented-item-selected" : ""}`}
            >
              {mode.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="w-40">
          <Select label="Stage" options={STAGE_OPTIONS} value={stage} onChange={(e) => setStage(e.target.value)} />
        </div>
        <div className="w-44">
          <Select label="Department" options={DEPT_OPTIONS} value={dept} onChange={(e) => setDept(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={countToProduct}
            onChange={(e) => setCountToProduct(e.target.checked)}
            className="h-4 w-4 rounded border-border"
            style={{ accentColor: 'var(--mx-primary)' }}
          />
          Count to {view.toUpperCase()} Product
        </label>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: `Opening ${view.toUpperCase()}`, value: fmt(openingMrr * multiplier) },
          { label: `Closing ${view.toUpperCase()}`, value: fmt(cumulativeMrr[11]) },
          { label: "Net Change", value: fmt(totalNet), color: totalNet >= 0 ? "text-emerald-400" : "text-red-400" },
          {
            label: "Growth Rate",
            value: `${(((cumulativeMrr[11] - openingMrr * multiplier) / (openingMrr * multiplier)) * 100).toFixed(1)}%`,
            color: cumulativeMrr[11] > openingMrr * multiplier ? "text-emerald-400" : "text-red-400",
          },
        ].map((c) => (
          <div key={c.label} className="mx-card mx-card-white">
            <p className="text-sm mx-text-secondary">{c.label}</p>
            <p className={`mt-1 text-xl font-semibold ${c.color || ""}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 mx-h3">Classifications</h2>
        <div className="mx-table-container">
          <table className="mx-table">
            <thead>
              <tr>
                <th className="sticky left-0 text-left" style={{ background: 'var(--mx-bg-card)' }}>Classification</th>
                <th className="text-left">Type</th>
                <th className="text-right">Annual Total</th>
              </tr>
            </thead>
            <tbody>
              {MRR_DATA.map((c) => {
                const annual = c.monthly.reduce((s, v) => s + v, 0) * multiplier;
                return (
                  <tr key={c.id}>
                    <td className="sticky left-0 font-medium" style={{ background: 'var(--mx-bg-container)' }}>{c.name}</td>
                    <td>
                      <span className={c.type === "add" ? "mx-tag mx-tag-success" : "mx-tag mx-tag-error"}>
                        {c.type === "add" ? "+ Additive" : "− Subtractive"}
                      </span>
                    </td>
                    <td className={`text-right font-medium ${
                      (c.type === "subtract" ? -annual : annual) >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {fmt(Math.abs(annual))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-3 mx-h3">Monthly Trend</h2>
        <div className="mx-table-container">
          <table className="mx-table">
            <thead>
              <tr>
                <th className="sticky left-0 text-left" style={{ background: 'var(--mx-bg-card)' }}>Classification</th>
                {MONTHS.map((m) => (
                  <th key={m} className="text-right">{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MRR_DATA.map((c) => (
                <tr key={c.id}>
                  <td className="sticky left-0 font-medium" style={{ background: 'var(--mx-bg-container)' }}>{c.name}</td>
                  {c.monthly.map((v, i) => {
                    const val = v * multiplier;
                    const display = c.type === "subtract" ? -val : val;
                    return (
                      <td key={i} className={`text-right ${display >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {fmt(Math.abs(val))}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="border-t border-border font-semibold" style={{ background: 'var(--mx-bg-card)' }}>
                <td className="sticky left-0" style={{ background: 'var(--mx-bg-card)' }}>Net Change</td>
                {monthlyNet.map((n, i) => (
                  <td key={i} className={`text-right ${n >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {fmt(n)}
                  </td>
                ))}
              </tr>
              <tr className="border-t-2 border-border font-semibold" style={{ background: 'var(--mx-bg-card)' }}>
                <td className="sticky left-0" style={{ background: 'var(--mx-bg-card)' }}>
                  Closing {view.toUpperCase()}
                </td>
                {cumulativeMrr.map((v, i) => (
                  <td key={i} className="text-right">{fmt(v)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

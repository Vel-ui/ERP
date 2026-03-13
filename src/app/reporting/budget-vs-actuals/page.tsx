"use client";

import { useState, useMemo } from "react";
import { Button, Select, Modal } from "@/components/ui";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const GROUP_OPTIONS = [
  { value: "account", label: "Account" },
  { value: "vendor", label: "Vendor" },
  { value: "department", label: "Department" },
  { value: "custom", label: "Custom Field" },
];

interface BudgetLine {
  id: string;
  name: string;
  group: string;
  vendorCategory?: string;
  monthly: { budgeted: number; actual: number }[];
}

const MOCK_DATA: BudgetLine[] = [
  {
    id: "1", name: "Software Subscriptions", group: "account",
    monthly: [
      { budgeted: 12000, actual: 11500 }, { budgeted: 12000, actual: 12800 },
      { budgeted: 12000, actual: 11900 }, { budgeted: 12500, actual: 13200 },
      { budgeted: 12500, actual: 12400 }, { budgeted: 12500, actual: 12100 },
      { budgeted: 13000, actual: 13500 }, { budgeted: 13000, actual: 12900 },
      { budgeted: 13000, actual: 14200 }, { budgeted: 13500, actual: 13800 },
      { budgeted: 13500, actual: 13200 }, { budgeted: 13500, actual: 14100 },
    ],
  },
  {
    id: "2", name: "AWS (Budgeted Vendor)", group: "vendor", vendorCategory: "budgeted",
    monthly: [
      { budgeted: 8000, actual: 7800 }, { budgeted: 8000, actual: 8200 },
      { budgeted: 8500, actual: 9100 }, { budgeted: 8500, actual: 8400 },
      { budgeted: 9000, actual: 8900 }, { budgeted: 9000, actual: 9500 },
      { budgeted: 9500, actual: 9200 }, { budgeted: 9500, actual: 10100 },
      { budgeted: 10000, actual: 9800 }, { budgeted: 10000, actual: 10500 },
      { budgeted: 10500, actual: 10200 }, { budgeted: 10500, actual: 11000 },
    ],
  },
  {
    id: "3", name: "Stripe (Budgeted Vendor)", group: "vendor", vendorCategory: "budgeted",
    monthly: [
      { budgeted: 3000, actual: 2900 }, { budgeted: 3000, actual: 3100 },
      { budgeted: 3200, actual: 3400 }, { budgeted: 3200, actual: 3000 },
      { budgeted: 3500, actual: 3600 }, { budgeted: 3500, actual: 3300 },
      { budgeted: 3500, actual: 3700 }, { budgeted: 3800, actual: 3900 },
      { budgeted: 3800, actual: 3600 }, { budgeted: 4000, actual: 4200 },
      { budgeted: 4000, actual: 3800 }, { budgeted: 4000, actual: 4300 },
    ],
  },
  {
    id: "4", name: "Other Vendors (Grouped)", group: "vendor", vendorCategory: "other",
    monthly: [
      { budgeted: 5000, actual: 5400 }, { budgeted: 5000, actual: 4800 },
      { budgeted: 5000, actual: 5600 }, { budgeted: 5200, actual: 5100 },
      { budgeted: 5200, actual: 5500 }, { budgeted: 5200, actual: 4900 },
      { budgeted: 5500, actual: 5800 }, { budgeted: 5500, actual: 5200 },
      { budgeted: 5500, actual: 6000 }, { budgeted: 5800, actual: 5600 },
      { budgeted: 5800, actual: 6100 }, { budgeted: 5800, actual: 5500 },
    ],
  },
  {
    id: "5", name: "Miscellaneous", group: "vendor", vendorCategory: "misc",
    monthly: [
      { budgeted: 2000, actual: 2300 }, { budgeted: 2000, actual: 1800 },
      { budgeted: 2000, actual: 2500 }, { budgeted: 2000, actual: 2100 },
      { budgeted: 2000, actual: 1900 }, { budgeted: 2000, actual: 2400 },
      { budgeted: 2000, actual: 2200 }, { budgeted: 2000, actual: 1700 },
      { budgeted: 2000, actual: 2600 }, { budgeted: 2000, actual: 2000 },
      { budgeted: 2000, actual: 1800 }, { budgeted: 2000, actual: 2300 },
    ],
  },
  {
    id: "6", name: "Payroll", group: "department",
    monthly: [
      { budgeted: 45000, actual: 45000 }, { budgeted: 45000, actual: 45000 },
      { budgeted: 45000, actual: 46500 }, { budgeted: 47000, actual: 47000 },
      { budgeted: 47000, actual: 47500 }, { budgeted: 47000, actual: 47000 },
      { budgeted: 48000, actual: 48200 }, { budgeted: 48000, actual: 48000 },
      { budgeted: 48000, actual: 49000 }, { budgeted: 50000, actual: 50000 },
      { budgeted: 50000, actual: 50500 }, { budgeted: 50000, actual: 50000 },
    ],
  },
  {
    id: "7", name: "Marketing Spend", group: "department",
    monthly: [
      { budgeted: 20000, actual: 18500 }, { budgeted: 20000, actual: 22000 },
      { budgeted: 22000, actual: 21000 }, { budgeted: 22000, actual: 24500 },
      { budgeted: 25000, actual: 23000 }, { budgeted: 25000, actual: 26800 },
      { budgeted: 25000, actual: 24500 }, { budgeted: 27000, actual: 28500 },
      { budgeted: 27000, actual: 26000 }, { budgeted: 28000, actual: 29500 },
      { budgeted: 28000, actual: 27500 }, { budgeted: 28000, actual: 30000 },
    ],
  },
  {
    id: "8", name: "No Vendor", group: "vendor", vendorCategory: "none",
    monthly: [
      { budgeted: 1000, actual: 1200 }, { budgeted: 1000, actual: 900 },
      { budgeted: 1000, actual: 1100 }, { budgeted: 1000, actual: 1000 },
      { budgeted: 1000, actual: 800 }, { budgeted: 1000, actual: 1300 },
      { budgeted: 1000, actual: 1100 }, { budgeted: 1000, actual: 950 },
      { budgeted: 1000, actual: 1200 }, { budgeted: 1000, actual: 1050 },
      { budgeted: 1000, actual: 900 }, { budgeted: 1000, actual: 1150 },
    ],
  },
  {
    id: "9", name: "No Department", group: "vendor", vendorCategory: "no-dept",
    monthly: [
      { budgeted: 500, actual: 650 }, { budgeted: 500, actual: 400 },
      { budgeted: 500, actual: 550 }, { budgeted: 500, actual: 500 },
      { budgeted: 500, actual: 450 }, { budgeted: 500, actual: 600 },
      { budgeted: 500, actual: 520 }, { budgeted: 500, actual: 480 },
      { budgeted: 500, actual: 700 }, { budgeted: 500, actual: 530 },
      { budgeted: 500, actual: 460 }, { budgeted: 500, actual: 580 },
    ],
  },
];

interface CsvError {
  row: number;
  field: string;
  message: string;
}

const MOCK_ERRORS: CsvError[] = [
  { row: 3, field: "Amount", message: "Non-numeric value: 'N/A'" },
  { row: 7, field: "Account", message: "Account '9999' not found in Chart of Accounts" },
  { row: 12, field: "Period", message: "Invalid period format: '2025-13'" },
];

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });

const pct = (budget: number, actual: number) => {
  if (budget === 0) return "N/A";
  const v = ((actual - budget) / budget) * 100;
  return `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`;
};

const varianceColor = (budget: number, actual: number) => {
  const diff = actual - budget;
  if (diff > 0) return "text-red-400";
  if (diff < 0) return "text-emerald-400";
  return "";
};

export default function BudgetVsActualsPage() {
  const [groupBy, setGroupBy] = useState("account");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const filteredData = useMemo(() => {
    if (groupBy === "vendor") {
      return MOCK_DATA.filter((d) => d.vendorCategory);
    }
    if (groupBy === "department") {
      return MOCK_DATA.filter((d) => d.group === "department");
    }
    return MOCK_DATA;
  }, [groupBy]);

  const totals = useMemo(() => {
    return MONTHS.map((_, mi) => {
      const budgeted = filteredData.reduce((s, r) => s + r.monthly[mi].budgeted, 0);
      const actual = filteredData.reduce((s, r) => s + r.monthly[mi].actual, 0);
      return { budgeted, actual };
    });
  }, [filteredData]);

  const annualSummary = useMemo(() => {
    return filteredData.map((row) => {
      const budgeted = row.monthly.reduce((s, m) => s + m.budgeted, 0);
      const actual = row.monthly.reduce((s, m) => s + m.actual, 0);
      return { ...row, budgeted, actual, variance: actual - budgeted };
    });
  }, [filteredData]);

  const vendorCategoryLabel = (cat?: string) => {
    switch (cat) {
      case "budgeted": return "Budgeted Vendor";
      case "other": return "Other Vendors";
      case "misc": return "Miscellaneous";
      case "none": return "No Vendor";
      case "no-dept": return "No Department";
      default: return "";
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mx-h1">Budget vs Actuals</h1>
          <p className="mt-1 mx-text-secondary">Compare budgeted amounts against actual spend across periods</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="default" onClick={() => setShowErrors(true)}>
            Error Log ({MOCK_ERRORS.length})
          </Button>
          <Button onClick={() => setUploadOpen(true)}>Upload Budget CSV</Button>
        </div>
      </div>

      <div className="flex items-end gap-4">
        <div className="w-48">
          <Select
            label="Group By"
            options={GROUP_OPTIONS}
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select
            label="Focus Month"
            options={[
              { value: "all", label: "All Months" },
              ...MONTHS.map((m, i) => ({ value: String(i), label: m })),
            ]}
            value={selectedMonth === null ? "all" : String(selectedMonth)}
            onChange={(e) => setSelectedMonth(e.target.value === "all" ? null : Number(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Budgeted", value: fmt(totals.reduce((s, t) => s + t.budgeted, 0)) },
          { label: "Total Actual", value: fmt(totals.reduce((s, t) => s + t.actual, 0)) },
          {
            label: "Total Variance ($)",
            value: fmt(totals.reduce((s, t) => s + (t.actual - t.budgeted), 0)),
            color: totals.reduce((s, t) => s + (t.actual - t.budgeted), 0) > 0 ? "text-red-400" : "text-emerald-400",
          },
          {
            label: "Avg Variance (%)",
            value: (() => {
              const tb = totals.reduce((s, t) => s + t.budgeted, 0);
              const ta = totals.reduce((s, t) => s + t.actual, 0);
              return tb === 0 ? "N/A" : `${(((ta - tb) / tb) * 100).toFixed(1)}%`;
            })(),
          },
        ].map((card) => (
          <div key={card.label} className="mx-card mx-card-white">
            <p className="text-sm mx-text-secondary">{card.label}</p>
            <p className={`mt-1 text-xl font-semibold ${"color" in card && card.color ? card.color : ""}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mx-table-container">
        <table className="mx-table">
          <thead>
            <tr>
              <th className="text-left">Name</th>
              {groupBy === "vendor" && <th className="text-left">Category</th>}
              <th className="text-right">Budgeted</th>
              <th className="text-right">Actual</th>
              <th className="text-right">Variance ($)</th>
              <th className="text-right">Variance (%)</th>
            </tr>
          </thead>
          <tbody>
            {annualSummary.map((row) => (
              <tr key={row.id}>
                <td className="font-medium">{row.name}</td>
                {groupBy === "vendor" && (
                  <td>
                    <span className="mx-tag">
                      {vendorCategoryLabel(row.vendorCategory)}
                    </span>
                  </td>
                )}
                <td className="text-right">{fmt(row.budgeted)}</td>
                <td className="text-right">{fmt(row.actual)}</td>
                <td className={`text-right font-medium ${varianceColor(row.budgeted, row.actual)}`}>
                  {fmt(row.variance)}
                </td>
                <td className={`text-right font-medium ${varianceColor(row.budgeted, row.actual)}`}>
                  {pct(row.budgeted, row.actual)}
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-border font-semibold" style={{ background: 'var(--mx-bg-card)' }}>
              <td>Total</td>
              {groupBy === "vendor" && <td />}
              <td className="text-right">
                {fmt(annualSummary.reduce((s, r) => s + r.budgeted, 0))}
              </td>
              <td className="text-right">
                {fmt(annualSummary.reduce((s, r) => s + r.actual, 0))}
              </td>
              <td className={`text-right ${varianceColor(
                annualSummary.reduce((s, r) => s + r.budgeted, 0),
                annualSummary.reduce((s, r) => s + r.actual, 0)
              )}`}>
                {fmt(annualSummary.reduce((s, r) => s + r.variance, 0))}
              </td>
              <td className={`text-right ${varianceColor(
                annualSummary.reduce((s, r) => s + r.budgeted, 0),
                annualSummary.reduce((s, r) => s + r.actual, 0)
              )}`}>
                {pct(
                  annualSummary.reduce((s, r) => s + r.budgeted, 0),
                  annualSummary.reduce((s, r) => s + r.actual, 0)
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <h2 className="mb-3 mx-h3">Monthly Breakdown</h2>
        <div className="mx-table-container">
          <table className="mx-table">
            <thead>
              <tr>
                <th className="sticky left-0 text-left" style={{ background: 'var(--mx-bg-card)' }}>Name</th>
                {MONTHS.map((m, i) =>
                  selectedMonth === null || selectedMonth === i ? (
                    <th key={m} colSpan={3} className="border-l border-border text-center">
                      {m}
                    </th>
                  ) : null
                )}
              </tr>
              <tr>
                <th className="sticky left-0" style={{ background: 'var(--mx-bg-card)' }} />
                {MONTHS.map((m, i) =>
                  selectedMonth === null || selectedMonth === i ? (
                    <th key={m} className="border-l border-border p-0" colSpan={1}>
                      <div className="flex text-xs">
                        <span className="flex-1 px-2 py-1 text-center mx-text-secondary">Budget</span>
                        <span className="flex-1 px-2 py-1 text-center mx-text-secondary">Actual</span>
                        <span className="flex-1 px-2 py-1 text-center mx-text-secondary">Var%</span>
                      </div>
                    </th>
                  ) : null
                )}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.id}>
                  <td className="sticky left-0 font-medium" style={{ background: 'var(--mx-bg-container)' }}>{row.name}</td>
                  {row.monthly.map((m, i) =>
                    selectedMonth === null || selectedMonth === i ? (
                      <td key={i} className="border-l border-border p-0">
                        <div className="flex text-xs">
                          <span className="flex-1 px-2 py-2 text-center">{fmt(m.budgeted)}</span>
                          <span className="flex-1 px-2 py-2 text-center">{fmt(m.actual)}</span>
                          <span className={`flex-1 px-2 py-2 text-center font-medium ${varianceColor(m.budgeted, m.actual)}`}>
                            {pct(m.budgeted, m.actual)}
                          </span>
                        </div>
                      </td>
                    ) : null
                  )}
                </tr>
              ))}
              <tr className="border-t-2 border-border font-semibold" style={{ background: 'var(--mx-bg-card)' }}>
                <td className="sticky left-0" style={{ background: 'var(--mx-bg-card)' }}>Total</td>
                {totals.map((t, i) =>
                  selectedMonth === null || selectedMonth === i ? (
                    <td key={i} className="border-l border-border p-0">
                      <div className="flex text-xs">
                        <span className="flex-1 px-2 py-2 text-center">{fmt(t.budgeted)}</span>
                        <span className="flex-1 px-2 py-2 text-center">{fmt(t.actual)}</span>
                        <span className={`flex-1 px-2 py-2 text-center font-medium ${varianceColor(t.budgeted, t.actual)}`}>
                          {pct(t.budgeted, t.actual)}
                        </span>
                      </div>
                    </td>
                  ) : null
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Budget CSV" size="lg">
        <div className="space-y-4">
          <div
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
              dragOver ? "" : "border-border"
            }`}
            style={dragOver ? { borderColor: 'var(--mx-primary)', background: 'var(--mx-primary-bg)' } : {}}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
          >
            <svg className="mb-3 h-10 w-10 mx-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-sm">Drag and drop your CSV file here</p>
            <p className="mt-1 text-xs mx-text-secondary">or click to browse</p>
            <Button variant="default" size="sm" className="mt-3">Browse Files</Button>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border p-3" style={{ background: 'var(--mx-bg-card)' }}>
            <div>
              <p className="text-sm font-medium">Need a template?</p>
              <p className="text-xs mx-text-secondary">Download our CSV template with required columns</p>
            </div>
            <Button variant="text" size="sm">Download Template</Button>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="default" onClick={() => setUploadOpen(false)}>Cancel</Button>
            <Button>Upload</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showErrors} onClose={() => setShowErrors(false)} title="Upload Error Summary" size="lg">
        <div className="space-y-4">
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-sm font-medium text-red-400">{MOCK_ERRORS.length} errors found during last upload</p>
            <p className="mt-1 text-xs text-red-400/70">These rows were skipped. Fix the issues and re-upload.</p>
          </div>
          <div className="mx-table-container">
            <table className="mx-table">
              <thead>
                <tr>
                  <th className="text-left">Row</th>
                  <th className="text-left">Field</th>
                  <th className="text-left">Error</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ERRORS.map((err, i) => (
                  <tr key={i}>
                    <td>{err.row}</td>
                    <td>{err.field}</td>
                    <td className="text-red-400">{err.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="default" size="sm">Export Invalid Rows</Button>
            <Button variant="default" onClick={() => setShowErrors(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

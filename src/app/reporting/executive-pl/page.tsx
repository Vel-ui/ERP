"use client";

import { useState, useMemo } from "react";
import { Button, Select } from "@/components/ui";
import Link from "next/link";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface Row {
  id: string;
  label: string;
  values: number[];
  isBold?: boolean;
  isTotal?: boolean;
  indent?: number;
  colorClass?: string;
}

const DATA: Row[] = [
  { id: "revenue", label: "Total Revenue", values: [420000, 435000, 448000, 462000, 475000, 490000, 505000, 518000, 532000, 548000, 565000, 580000], isBold: true },

  { id: "cor-header", label: "Cost of Revenue", values: [126000, 130500, 134400, 138600, 142500, 147000, 151500, 155400, 159600, 164400, 169500, 174000], isBold: true },
  { id: "cor-product", label: "Product", values: [42000, 43500, 44800, 46200, 47500, 49000, 50500, 51800, 53200, 54800, 56500, 58000], indent: 1 },
  { id: "cor-consumption-rev", label: "Consumption Revenue", values: [52000, 54000, 55600, 57400, 59000, 60800, 62600, 64200, 65800, 67800, 69800, 71800], indent: 1 },
  { id: "cor-consumption-commit", label: "Consumption Commitment", values: [32000, 33000, 34000, 35000, 36000, 37200, 38400, 39400, 40600, 41800, 43200, 44200], indent: 1 },

  { id: "gross-profit", label: "Gross Profit", values: [294000, 304500, 313600, 323400, 332500, 343000, 353500, 362600, 372400, 383600, 395500, 406000], isBold: true, isTotal: true },
  { id: "gross-margin", label: "Gross Margin %", values: [70.0, 70.0, 70.0, 70.0, 70.0, 70.0, 70.0, 70.0, 70.0, 70.0, 70.0, 70.0], colorClass: "text-emerald-400" },

  { id: "opex-header", label: "Operating Expenses", values: [235200, 241800, 248400, 255000, 261600, 268200, 274800, 281400, 288000, 294600, 301200, 307800], isBold: true },
  { id: "opex-sm", label: "Sales & Marketing", values: [84000, 87000, 89600, 92400, 95000, 98000, 101000, 103600, 106400, 109600, 113000, 116000], indent: 1 },
  { id: "opex-sm-pct", label: "S&M % of Revenue", values: [20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0, 20.0], indent: 2, colorClass: "text-blue-400" },
  { id: "opex-rd", label: "Research & Development", values: [100800, 102600, 105600, 108600, 111600, 114600, 117600, 120600, 123600, 126600, 129600, 132600], indent: 1 },
  { id: "opex-rd-pct", label: "R&D % of Revenue", values: [24.0, 23.6, 23.6, 23.5, 23.5, 23.4, 23.3, 23.3, 23.2, 23.1, 22.9, 22.9], indent: 2, colorClass: "text-blue-400" },
  { id: "opex-ga", label: "General & Administrative", values: [50400, 52200, 53200, 54000, 55000, 55600, 56200, 57200, 58000, 58400, 58600, 59200], indent: 1 },
  { id: "opex-ga-pct", label: "G&A % of Revenue", values: [12.0, 12.0, 11.9, 11.7, 11.6, 11.3, 11.1, 11.0, 10.9, 10.7, 10.4, 10.2], indent: 2, colorClass: "text-blue-400" },

  { id: "op-income", label: "Operating Income", values: [58800, 62700, 65200, 68400, 70900, 74800, 78700, 81200, 84400, 89000, 94300, 98200], isBold: true, isTotal: true },
  { id: "op-margin", label: "Operating Margin %", values: [14.0, 14.4, 14.6, 14.8, 14.9, 15.3, 15.6, 15.7, 15.9, 16.2, 16.7, 16.9], colorClass: "text-emerald-500" },

  { id: "other-income", label: "Other Income / (Expense)", values: [-2400, -2300, -2200, -2100, -2000, -1900, -1800, -1700, -1600, -1500, -1400, -1300] },
  { id: "net-income", label: "Net Income", values: [56400, 60400, 63000, 66300, 68900, 72900, 76900, 79500, 82800, 87500, 92900, 96900], isBold: true, isTotal: true },
  { id: "net-margin", label: "Net Margin %", values: [13.4, 13.9, 14.1, 14.4, 14.5, 14.9, 15.2, 15.3, 15.6, 16.0, 16.4, 16.7], colorClass: "text-emerald-400" },
];

function BackArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function MetricCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="mx-card mx-card-white p-4">
      <p className="text-xs mx-text-secondary">{label}</p>
      <p className={`mt-1 text-xl font-bold ${color}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs mx-text-secondary">{sub}</p>}
    </div>
  );
}

function fmtVal(val: number, isPercent: boolean) {
  if (isPercent) return `${val.toFixed(1)}%`;
  const neg = val < 0;
  const abs = Math.abs(val);
  const str = abs.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return neg ? `($${str})` : `$${str}`;
}

export default function ExecutivePLPage() {
  const [period, setPeriod] = useState("monthly");
  const [fieldView, setFieldView] = useState("all");

  const columns = useMemo(() => {
    if (period === "quarterly") return ["Q1", "Q2", "Q3", "Q4"];
    if (period === "annual") return ["FY 2025"];
    return MONTHS;
  }, [period]);

  const aggregate = (values: number[], isPercent: boolean): number[] => {
    if (isPercent) {
      if (period === "quarterly") {
        return [
          values.slice(0, 3).reduce((a, b) => a + b, 0) / 3,
          values.slice(3, 6).reduce((a, b) => a + b, 0) / 3,
          values.slice(6, 9).reduce((a, b) => a + b, 0) / 3,
          values.slice(9, 12).reduce((a, b) => a + b, 0) / 3,
        ];
      }
      if (period === "annual") return [values.reduce((a, b) => a + b, 0) / 12];
      return values;
    }
    if (period === "quarterly") {
      return [
        values.slice(0, 3).reduce((a, b) => a + b, 0),
        values.slice(3, 6).reduce((a, b) => a + b, 0),
        values.slice(6, 9).reduce((a, b) => a + b, 0),
        values.slice(9, 12).reduce((a, b) => a + b, 0),
      ];
    }
    if (period === "annual") return [values.reduce((a, b) => a + b, 0)];
    return values;
  };

  const totalRevenue = DATA.find((d) => d.id === "revenue")!.values.reduce((a, b) => a + b, 0);
  const totalNetIncome = DATA.find((d) => d.id === "net-income")!.values.reduce((a, b) => a + b, 0);
  const totalGrossProfit = DATA.find((d) => d.id === "gross-profit")!.values.reduce((a, b) => a + b, 0);
  const totalOpIncome = DATA.find((d) => d.id === "op-income")!.values.reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen">
      <div className="border-b border-border px-8 py-4" style={{ background: "var(--mx-bg-card)" }}>
        <div className="flex items-center gap-3 mb-3">
          <Link href="/reporting" className="mx-text-secondary hover:text-[var(--mx-text)] transition-colors">
            <BackArrow />
          </Link>
          <h1 className="text-xl font-semibold">Executive P&L</h1>
          <span className="rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-medium text-indigo-400">FY 2025</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Select
            options={[
              { value: "monthly", label: "Monthly" },
              { value: "quarterly", label: "Quarterly" },
              { value: "annual", label: "Annual" },
            ]}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="!w-36"
          />
          <Select
            options={[
              { value: "all", label: "All Fields" },
              { value: "revenue-only", label: "Revenue Only" },
              { value: "opex-only", label: "OpEx Only" },
              { value: "margins", label: "Margins Only" },
            ]}
            value={fieldView}
            onChange={(e) => setFieldView(e.target.value)}
            className="!w-40"
          />
          <div className="ml-auto flex items-center gap-2">
            <Button variant="default" size="sm">Export</Button>
            <Button variant="primary" size="sm">Save Report As</Button>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <MetricCard label="Total Revenue" value={`$${(totalRevenue / 1_000_000).toFixed(1)}M`} sub="FY 2025" color="" />
          <MetricCard label="Gross Profit" value={`$${(totalGrossProfit / 1_000_000).toFixed(1)}M`} sub={`${((totalGrossProfit / totalRevenue) * 100).toFixed(1)}% margin`} color="text-emerald-400" />
          <MetricCard label="Operating Income" value={`$${(totalOpIncome / 1_000_000).toFixed(1)}M`} sub={`${((totalOpIncome / totalRevenue) * 100).toFixed(1)}% margin`} color="" />
          <MetricCard label="Net Income" value={`$${(totalNetIncome / 1_000_000).toFixed(1)}M`} sub={`${((totalNetIncome / totalRevenue) * 100).toFixed(1)}% margin`} color="text-blue-400" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 pl-6 pr-4 text-left text-xs font-medium uppercase tracking-wider mx-text-secondary">Line Item</th>
              {columns.map((col) => (
                <th key={col} className="py-3 px-3 text-right text-xs font-medium uppercase tracking-wider mx-text-secondary">{col}</th>
              ))}
              <th className="py-3 px-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: "var(--mx-primary)" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {DATA.map((row) => {
              const isPercent = row.id.endsWith("-pct") || row.id.endsWith("-margin");
              const displayValues = aggregate(row.values, isPercent);
              const total = isPercent ? row.values.reduce((a, b) => a + b, 0) / 12 : row.values.reduce((a, b) => a + b, 0);
              return (
                <tr
                  key={row.id}
                  className={`${row.isTotal ? "border-t border-border" : ""} hover:bg-gray-50 transition-colors`}
                  style={row.isBold && !row.isTotal ? { background: "var(--mx-bg-card)" } : undefined}
                >
                  <td className={`py-2 pr-4 text-sm whitespace-nowrap ${row.isBold ? "font-semibold" : row.colorClass || "mx-text-secondary"} ${row.isTotal ? "font-bold" : ""}`} style={{ paddingLeft: `${(row.indent || 0) * 20 + 24}px` }}>
                    {row.label}
                  </td>
                  {displayValues.map((val, i) => (
                    <td key={i} className={`py-2 px-3 text-right text-sm tabular-nums ${row.isBold || row.isTotal ? "font-semibold" : row.colorClass || "mx-text-secondary"} ${!isPercent && val < 0 ? "text-red-400" : ""}`}>
                      {fmtVal(val, isPercent)}
                    </td>
                  ))}
                  <td className={`py-2 px-3 text-right text-sm tabular-nums font-semibold ${row.colorClass || ""} ${!isPercent && total < 0 ? "text-red-400" : ""}`} style={row.isTotal && !row.colorClass ? { color: "var(--mx-primary)" } : undefined}>
                    {fmtVal(total, isPercent)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

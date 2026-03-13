"use client";

import { useState, useMemo } from "react";
import { Button, Select } from "@/components/ui";
import Link from "next/link";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "Customer Success", "G&A"] as const;

type Dept = (typeof DEPARTMENTS)[number];

interface SaaSRow {
  id: string;
  label: string;
  isBold?: boolean;
  isTotal?: boolean;
  colorClass?: string;
  byDept: Record<Dept, number[]>;
  totalValues: number[];
}

function sumArrays(...arrays: number[][]): number[] {
  return arrays[0].map((_, i) => arrays.reduce((sum, arr) => sum + arr[i], 0));
}

const engRev: number[] = [210000, 217500, 224000, 231000, 237500, 245000, 252500, 259000, 266000, 274000, 282500, 290000];
const salesRev: number[] = [105000, 108750, 112000, 115500, 118750, 122500, 126250, 129500, 133000, 137000, 141250, 145000];
const mktRev: number[] = [42000, 43500, 44800, 46200, 47500, 49000, 50500, 51800, 53200, 54800, 56500, 58000];
const csRev: number[] = [42000, 43500, 44800, 46200, 47500, 49000, 50500, 51800, 53200, 54800, 56500, 58000];
const gaRev: number[] = [21000, 21750, 22400, 23100, 23750, 24500, 25250, 25900, 26600, 27400, 28250, 29000];

const engCogs: number[] = [63000, 65250, 67200, 69300, 71250, 73500, 75750, 77700, 79800, 82200, 84750, 87000];
const salesCogs: number[] = [21000, 21750, 22400, 23100, 23750, 24500, 25250, 25900, 26600, 27400, 28250, 29000];
const mktCogs: number[] = [12600, 13050, 13440, 13860, 14250, 14700, 15150, 15540, 15960, 16440, 16950, 17400];
const csCogs: number[] = [21000, 21750, 22400, 23100, 23750, 24500, 25250, 25900, 26600, 27400, 28250, 29000];
const gaCogs: number[] = [8400, 8700, 8960, 9240, 9500, 9800, 10100, 10360, 10640, 10960, 11300, 11600];

const engOpex: number[] = [100800, 102600, 105600, 108600, 111600, 114600, 117600, 120600, 123600, 126600, 129600, 132600];
const salesOpex: number[] = [52500, 54375, 56000, 57750, 59375, 61250, 63125, 64750, 66500, 68500, 70625, 72500];
const mktOpex: number[] = [31500, 32625, 33600, 34650, 35625, 36750, 37875, 38850, 39900, 41100, 42375, 43500];
const csOpex: number[] = [25200, 26100, 26880, 27720, 28500, 29400, 30300, 31080, 31920, 32880, 33900, 34800];
const gaOpex: number[] = [25200, 26100, 26320, 26280, 26500, 26200, 25900, 26120, 26080, 25520, 24700, 24400];

const DATA: SaaSRow[] = [
  {
    id: "revenue", label: "Revenue", isBold: true,
    byDept: { Engineering: engRev, Sales: salesRev, Marketing: mktRev, "Customer Success": csRev, "G&A": gaRev },
    totalValues: sumArrays(engRev, salesRev, mktRev, csRev, gaRev),
  },
  {
    id: "cogs", label: "Cost of Goods Sold", isBold: true,
    byDept: { Engineering: engCogs, Sales: salesCogs, Marketing: mktCogs, "Customer Success": csCogs, "G&A": gaCogs },
    totalValues: sumArrays(engCogs, salesCogs, mktCogs, csCogs, gaCogs),
  },
  {
    id: "gross-margin", label: "Gross Margin", isBold: true, isTotal: true, colorClass: "text-emerald-400",
    byDept: {
      Engineering: engRev.map((r, i) => r - engCogs[i]),
      Sales: salesRev.map((r, i) => r - salesCogs[i]),
      Marketing: mktRev.map((r, i) => r - mktCogs[i]),
      "Customer Success": csRev.map((r, i) => r - csCogs[i]),
      "G&A": gaRev.map((r, i) => r - gaCogs[i]),
    },
    totalValues: sumArrays(engRev, salesRev, mktRev, csRev, gaRev).map((r, i) => r - sumArrays(engCogs, salesCogs, mktCogs, csCogs, gaCogs)[i]),
  },
  {
    id: "opex", label: "Operating Expenses", isBold: true,
    byDept: { Engineering: engOpex, Sales: salesOpex, Marketing: mktOpex, "Customer Success": csOpex, "G&A": gaOpex },
    totalValues: sumArrays(engOpex, salesOpex, mktOpex, csOpex, gaOpex),
  },
  {
    id: "ebitda", label: "EBITDA", isBold: true, isTotal: true, colorClass: "text-emerald-500",
    byDept: {
      Engineering: engRev.map((r, i) => r - engCogs[i] - engOpex[i]),
      Sales: salesRev.map((r, i) => r - salesCogs[i] - salesOpex[i]),
      Marketing: mktRev.map((r, i) => r - mktCogs[i] - mktOpex[i]),
      "Customer Success": csRev.map((r, i) => r - csCogs[i] - csOpex[i]),
      "G&A": gaRev.map((r, i) => r - gaCogs[i] - gaOpex[i]),
    },
    totalValues: sumArrays(engRev, salesRev, mktRev, csRev, gaRev).map((r, i) =>
      r - sumArrays(engCogs, salesCogs, mktCogs, csCogs, gaCogs)[i] - sumArrays(engOpex, salesOpex, mktOpex, csOpex, gaOpex)[i]
    ),
  },
];

function BackArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function fmt(val: number) {
  const neg = val < 0;
  const abs = Math.abs(val);
  const str = abs.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return neg ? `($${str})` : `$${str}`;
}

export default function SaaSPLPage() {
  const [period, setPeriod] = useState("quarterly");
  const [deptView, setDeptView] = useState<"total" | Dept>("total");

  const columns = useMemo(() => {
    if (period === "quarterly") return ["Q1", "Q2", "Q3", "Q4"];
    if (period === "annual") return ["FY 2025"];
    return MONTHS;
  }, [period]);

  const aggregate = (values: number[]): number[] => {
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

  const getRowValues = (row: SaaSRow): number[] => {
    if (deptView === "total") return row.totalValues;
    return row.byDept[deptView];
  };

  return (
    <div className="min-h-screen">
      <div className="border-b border-border px-8 py-4" style={{ background: "var(--mx-bg-card)" }}>
        <div className="flex items-center gap-3 mb-3">
          <Link href="/reporting" className="mx-text-secondary hover:text-[var(--mx-text)] transition-colors">
            <BackArrow />
          </Link>
          <h1 className="text-xl font-semibold">SaaS P&L</h1>
          <span className="rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-xs font-medium text-cyan-400">By Department</span>
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
              { value: "total", label: "All Departments" },
              ...DEPARTMENTS.map((d) => ({ value: d, label: d })),
            ]}
            value={deptView}
            onChange={(e) => setDeptView(e.target.value as "total" | Dept)}
            className="!w-48"
          />
          <div className="ml-auto flex items-center gap-2">
            <Button variant="default" size="sm">Export</Button>
            <Button variant="primary" size="sm">Save Report As</Button>
          </div>
        </div>
      </div>

      {deptView === "total" && (
        <div className="px-8 py-4">
          <div className="flex gap-2 flex-wrap">
            {DEPARTMENTS.map((dept) => {
              const ebitdaRow = DATA.find((r) => r.id === "ebitda")!;
              const annual = ebitdaRow.byDept[dept].reduce((a, b) => a + b, 0);
              const revRow = DATA.find((r) => r.id === "revenue")!;
              const annualRev = revRow.byDept[dept].reduce((a, b) => a + b, 0);
              const margin = annualRev > 0 ? ((annual / annualRev) * 100).toFixed(1) : "0.0";
              return (
                <button
                  key={dept}
                  onClick={() => setDeptView(dept)}
                  className="mx-card mx-card-hoverable px-4 py-3 text-left"
                >
                  <p className="text-xs mx-text-secondary">{dept}</p>
                  <p className={`text-sm font-bold ${annual >= 0 ? "text-emerald-400" : "text-red-400"}`}>{fmt(annual)}</p>
                  <p className="text-[10px] mx-text-secondary">{margin}% margin</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 pl-6 pr-4 text-left text-xs font-medium uppercase tracking-wider mx-text-secondary">
                {deptView === "total" ? "Line Item" : `${deptView} — Line Item`}
              </th>
              {columns.map((col) => (
                <th key={col} className="py-3 px-3 text-right text-xs font-medium uppercase tracking-wider mx-text-secondary">{col}</th>
              ))}
              <th className="py-3 px-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: "var(--mx-primary)" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {DATA.map((row) => {
              const vals = getRowValues(row);
              const displayValues = aggregate(vals);
              const total = vals.reduce((a, b) => a + b, 0);
              return (
                <tr
                  key={row.id}
                  className={`${row.isTotal ? "border-t border-border" : ""} hover:bg-gray-50 transition-colors`}
                  style={row.isBold && !row.isTotal ? { background: "var(--mx-bg-card)" } : undefined}
                >
                  <td className={`py-2.5 pl-6 pr-4 text-sm whitespace-nowrap ${row.isBold ? "font-semibold" : "mx-text-secondary"} ${row.isTotal ? "font-bold" : ""} ${row.colorClass || ""}`}>
                    {row.label}
                  </td>
                  {displayValues.map((val, i) => (
                    <td key={i} className={`py-2.5 px-3 text-right text-sm tabular-nums ${row.isBold || row.isTotal ? "font-semibold" : ""} ${row.colorClass || (val < 0 ? "text-red-400" : "mx-text-secondary")}`}>
                      {fmt(val)}
                    </td>
                  ))}
                  <td className={`py-2.5 px-3 text-right text-sm tabular-nums font-bold ${row.colorClass || ""} ${total < 0 ? "text-red-400" : ""}`} style={row.isTotal && !row.colorClass ? { color: "var(--mx-primary)" } : undefined}>
                    {fmt(total)}
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

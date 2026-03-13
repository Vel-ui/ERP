"use client";

import { useState, useMemo } from "react";
import { Button, Select } from "@/components/ui";
import Link from "next/link";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface LineItem {
  id: string;
  label: string;
  values: number[];
  isBold?: boolean;
  isTotal?: boolean;
  indent?: number;
}

interface Section {
  id: string;
  title: string;
  items: LineItem[];
  totalLabel: string;
  totalValues: number[];
}

const SECTIONS: Section[] = [
  {
    id: "operating",
    title: "Cash Flows from Operating Activities",
    totalLabel: "Net Cash from Operations",
    totalValues: [82400, 87200, 91000, 95300, 98900, 103800, 108700, 112200, 116400, 121500, 127300, 132600],
    items: [
      { id: "net-income", label: "Net Income", values: [56400, 60400, 63000, 66300, 68900, 72900, 76900, 79500, 82800, 87500, 92900, 96900], isBold: true },
      { id: "dep", label: "Depreciation & Amortization", values: [18000, 18000, 18000, 18000, 18000, 18000, 18000, 18000, 18000, 18000, 18000, 18000], indent: 1 },
      { id: "sbc", label: "Stock-Based Compensation", values: [8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500, 8500], indent: 1 },
      { id: "ar-change", label: "Change in Accounts Receivable", values: [-12000, -8500, -6000, -10200, -7500, -5800, -4200, -3000, -2500, -3800, -2600, -1200], indent: 1 },
      { id: "ap-change", label: "Change in Accounts Payable", values: [5500, 3800, 2500, 6700, 4000, 3200, 2500, 2200, 1600, 3300, 2500, 1400], indent: 1 },
      { id: "deferred-rev", label: "Change in Deferred Revenue", values: [8000, 7000, 7000, 8000, 9000, 9000, 9000, 9000, 10000, 10000, 10000, 11000], indent: 1 },
      { id: "other-op", label: "Other Operating Adjustments", values: [-2000, -2000, -2000, -2000, -2000, -2000, -2000, -2000, -2000, -2000, -2000, -2000], indent: 1 },
    ],
  },
  {
    id: "investing",
    title: "Cash Flows from Investing Activities",
    totalLabel: "Net Cash from Investing",
    totalValues: [-35000, -22000, -18000, -45000, -25000, -15000, -38000, -20000, -12000, -42000, -28000, -10000],
    items: [
      { id: "capex", label: "Capital Expenditures", values: [-25000, -15000, -12000, -35000, -18000, -10000, -28000, -14000, -8000, -32000, -20000, -6000], indent: 1 },
      { id: "acquisitions", label: "Acquisitions, net of cash", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], indent: 1 },
      { id: "invest-purchase", label: "Purchases of Investments", values: [-15000, -12000, -10000, -15000, -12000, -10000, -15000, -12000, -10000, -15000, -12000, -10000], indent: 1 },
      { id: "invest-proceeds", label: "Proceeds from Investments", values: [5000, 5000, 4000, 5000, 5000, 5000, 5000, 6000, 6000, 5000, 4000, 6000], indent: 1 },
    ],
  },
  {
    id: "financing",
    title: "Cash Flows from Financing Activities",
    totalLabel: "Net Cash from Financing",
    totalValues: [-20000, -20000, -20000, -20000, -20000, -20000, -20000, -20000, -20000, -20000, -20000, -20000],
    items: [
      { id: "debt-repay", label: "Repayment of Debt", values: [-12500, -12500, -12500, -12500, -12500, -12500, -12500, -12500, -12500, -12500, -12500, -12500], indent: 1 },
      { id: "dividend", label: "Dividends Paid", values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], indent: 1 },
      { id: "buyback", label: "Stock Repurchases", values: [-7500, -7500, -7500, -7500, -7500, -7500, -7500, -7500, -7500, -7500, -7500, -7500], indent: 1 },
    ],
  },
];

const NET_CHANGE: number[] = SECTIONS[0].totalValues.map((_, i) =>
  SECTIONS.reduce((sum, s) => sum + s.totalValues[i], 0)
);

const BEG_CASH = 2_340_000;

function BackArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function fmt(val: number, inThousands: boolean) {
  const v = inThousands ? val / 1000 : val;
  const neg = v < 0;
  const abs = Math.abs(v);
  const str = abs.toLocaleString("en-US", { maximumFractionDigits: 0 });
  const suffix = inThousands ? "K" : "";
  return neg ? `($${str}${suffix})` : `$${str}${suffix}`;
}

export default function CashFlowPage() {
  const [period, setPeriod] = useState("monthly");
  const [inThousands, setInThousands] = useState(false);

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

  return (
    <div className="min-h-screen">
      <div className="border-b border-border px-8 py-4" style={{ background: "var(--mx-bg-card)" }}>
        <div className="flex items-center gap-3 mb-3">
          <Link href="/reporting" className="mx-text-secondary hover:text-[var(--mx-text)] transition-colors">
            <BackArrow />
          </Link>
          <h1 className="text-xl font-semibold">Cash Flow Statement</h1>
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400">FY 2025</span>
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
          <label className="flex items-center gap-2 text-sm mx-text-secondary cursor-pointer">
            <input type="checkbox" checked={inThousands} onChange={() => setInThousands(!inThousands)} style={{ accentColor: "var(--mx-primary)" }} /> In Thousands
          </label>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="default" size="sm">Export</Button>
            <Button variant="primary" size="sm">Save Report As</Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 pl-4 pr-4 text-left text-xs font-medium uppercase tracking-wider mx-text-secondary">Line Item</th>
              {columns.map((col) => (
                <th key={col} className="py-3 px-3 text-right text-xs font-medium uppercase tracking-wider mx-text-secondary">{col}</th>
              ))}
              <th className="py-3 px-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: "var(--mx-primary)" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {SECTIONS.map((section) => {
              const rows: React.ReactNode[] = [];

              rows.push(
                <tr key={`${section.id}-header`} style={{ background: "var(--mx-bg-card)" }}>
                  <td colSpan={columns.length + 2} className="py-2.5 pl-4 text-sm font-semibold">
                    {section.title}
                  </td>
                </tr>
              );

              for (const item of section.items) {
                const displayValues = aggregate(item.values);
                const total = item.values.reduce((a, b) => a + b, 0);
                rows.push(
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2 pr-4 text-sm mx-text-secondary whitespace-nowrap" style={{ paddingLeft: `${(item.indent || 0) * 20 + 28}px` }}>
                      {item.label}
                    </td>
                    {displayValues.map((val, i) => (
                      <td key={i} className={`py-2 px-3 text-right text-sm tabular-nums ${val < 0 ? "text-red-400" : "mx-text-secondary"}`}>
                        {fmt(val, inThousands)}
                      </td>
                    ))}
                    <td className={`py-2 px-3 text-right text-sm tabular-nums font-medium ${total < 0 ? "text-red-400" : ""}`}>
                      {fmt(total, inThousands)}
                    </td>
                  </tr>
                );
              }

              const sectionTotalDisplay = aggregate(section.totalValues);
              const sectionTotal = section.totalValues.reduce((a, b) => a + b, 0);
              rows.push(
                <tr key={`${section.id}-total`} className="border-t border-border">
                  <td className="py-2.5 pl-4 text-sm font-bold">{section.totalLabel}</td>
                  {sectionTotalDisplay.map((val, i) => (
                    <td key={i} className={`py-2.5 px-3 text-right text-sm tabular-nums font-bold ${val < 0 ? "text-red-400" : ""}`}>
                      {fmt(val, inThousands)}
                    </td>
                  ))}
                  <td className={`py-2.5 px-3 text-right text-sm tabular-nums font-bold`} style={sectionTotal < 0 ? undefined : { color: "var(--mx-primary)" }}>
                    <span className={sectionTotal < 0 ? "text-red-400" : ""}>{fmt(sectionTotal, inThousands)}</span>
                  </td>
                </tr>
              );

              rows.push(
                <tr key={`${section.id}-spacer`}>
                  <td colSpan={columns.length + 2} className="py-1" />
                </tr>
              );

              return rows;
            })}

            <tr className="border-t-2 border-border" style={{ background: "var(--mx-bg-card)" }}>
              <td className="py-3 pl-4 text-sm font-bold">Net Change in Cash</td>
              {aggregate(NET_CHANGE).map((val, i) => (
                <td key={i} className={`py-3 px-3 text-right text-sm tabular-nums font-bold ${val < 0 ? "text-red-400" : "text-emerald-400"}`}>
                  {fmt(val, inThousands)}
                </td>
              ))}
              <td className={`py-3 px-3 text-right text-sm tabular-nums font-bold ${NET_CHANGE.reduce((a, b) => a + b, 0) < 0 ? "text-red-400" : "text-emerald-400"}`}>
                {fmt(NET_CHANGE.reduce((a, b) => a + b, 0), inThousands)}
              </td>
            </tr>

            <tr style={{ background: "var(--mx-bg-card)" }}>
              <td className="py-2 pl-4 text-sm mx-text-secondary">Beginning Cash Balance</td>
              {aggregate(Array(12).fill(0)).map((_, i) => (
                <td key={i} className="py-2 px-3 text-right text-sm tabular-nums mx-text-secondary">
                  {i === 0 ? fmt(BEG_CASH, inThousands) : "—"}
                </td>
              ))}
              <td className="py-2 px-3 text-right text-sm tabular-nums mx-text-secondary">{fmt(BEG_CASH, inThousands)}</td>
            </tr>

            <tr className="border-t border-border" style={{ background: "var(--mx-bg-card)" }}>
              <td className="py-3 pl-4 text-sm font-bold">Ending Cash Balance</td>
              {aggregate(NET_CHANGE).map((_, i) => (
                <td key={i} className="py-3 px-3 text-right text-sm tabular-nums font-bold text-emerald-400">
                  {fmt(BEG_CASH + aggregate(NET_CHANGE).slice(0, i + 1).reduce((a, b) => a + b, 0), inThousands)}
                </td>
              ))}
              <td className="py-3 px-3 text-right text-sm tabular-nums font-bold text-emerald-400">
                {fmt(BEG_CASH + NET_CHANGE.reduce((a, b) => a + b, 0), inThousands)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

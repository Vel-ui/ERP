"use client";

import { useState, useMemo } from "react";
import { Button, Select } from "@/components/ui";
import Link from "next/link";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

interface LineItem {
  id: string;
  label: string;
  accountNo?: string;
  values: number[];
  children?: LineItem[];
  isBold?: boolean;
  isTotal?: boolean;
  indent?: number;
}

const MOCK_DATA: LineItem[] = [
  {
    id: "revenue", label: "Revenue", isBold: true, values: [420000, 435000, 448000, 462000, 475000, 490000, 505000, 518000, 532000, 548000, 565000, 580000],
    children: [
      { id: "rev-sub", label: "Subscription Revenue", accountNo: "4010", values: [340000, 352000, 362000, 374000, 385000, 398000, 410000, 422000, 434000, 448000, 462000, 475000] },
      { id: "rev-pro", label: "Professional Services", accountNo: "4020", values: [55000, 58000, 60000, 62000, 63000, 65000, 67000, 68000, 70000, 72000, 74000, 76000] },
      { id: "rev-other", label: "Other Revenue", accountNo: "4090", values: [25000, 25000, 26000, 26000, 27000, 27000, 28000, 28000, 28000, 28000, 29000, 29000] },
    ],
  },
  {
    id: "cogs", label: "Cost of Goods Sold", isBold: true, values: [126000, 130500, 134400, 138600, 142500, 147000, 151500, 155400, 159600, 164400, 169500, 174000],
    children: [
      { id: "cogs-hosting", label: "Hosting & Infrastructure", accountNo: "5010", values: [42000, 43500, 44800, 46200, 47500, 49000, 50500, 51800, 53200, 54800, 56500, 58000] },
      { id: "cogs-support", label: "Customer Support", accountNo: "5020", values: [52000, 54000, 55600, 57400, 59000, 60800, 62600, 64200, 65800, 67800, 69800, 71800] },
      { id: "cogs-ps", label: "Professional Services Cost", accountNo: "5030", values: [32000, 33000, 34000, 35000, 36000, 37200, 38400, 39400, 40600, 41800, 43200, 44200] },
    ],
  },
  {
    id: "gross-profit", label: "Gross Profit", isBold: true, isTotal: true, values: [294000, 304500, 313600, 323400, 332500, 343000, 353500, 362600, 372400, 383600, 395500, 406000],
  },
  {
    id: "opex", label: "Operating Expenses", isBold: true, values: [235200, 241800, 248400, 255000, 261600, 268200, 274800, 281400, 288000, 294600, 301200, 307800],
    children: [
      {
        id: "opex-sm", label: "Sales & Marketing", accountNo: "6100", values: [84000, 87000, 89600, 92400, 95000, 98000, 101000, 103600, 106400, 109600, 113000, 116000],
        children: [
          { id: "opex-sm-sal", label: "S&M Salaries", accountNo: "6110", values: [60000, 62000, 64000, 66000, 68000, 70000, 72000, 74000, 76000, 78000, 80000, 82000] },
          { id: "opex-sm-ads", label: "Advertising", accountNo: "6120", values: [18000, 19000, 19600, 20400, 21000, 22000, 23000, 23600, 24400, 25600, 27000, 28000] },
          { id: "opex-sm-other", label: "Other S&M", accountNo: "6190", values: [6000, 6000, 6000, 6000, 6000, 6000, 6000, 6000, 6000, 6000, 6000, 6000] },
        ],
      },
      {
        id: "opex-rd", label: "Research & Development", accountNo: "6200", values: [100800, 102600, 105600, 108600, 111600, 114600, 117600, 120600, 123600, 126600, 129600, 132600],
        children: [
          { id: "opex-rd-sal", label: "R&D Salaries", accountNo: "6210", values: [88000, 90000, 92000, 94000, 96000, 98000, 100000, 102000, 104000, 106000, 108000, 110000] },
          { id: "opex-rd-tools", label: "Dev Tools & Licenses", accountNo: "6220", values: [8800, 8600, 9600, 10600, 11600, 12600, 13600, 14600, 15600, 16600, 17600, 18600] },
          { id: "opex-rd-other", label: "Other R&D", accountNo: "6290", values: [4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000, 4000] },
        ],
      },
      {
        id: "opex-ga", label: "General & Administrative", accountNo: "6300", values: [50400, 52200, 53200, 54000, 55000, 55600, 56200, 57200, 58000, 58400, 58600, 59200],
        children: [
          { id: "opex-ga-sal", label: "G&A Salaries", accountNo: "6310", values: [32000, 33000, 34000, 34500, 35000, 35500, 36000, 36500, 37000, 37500, 38000, 38500] },
          { id: "opex-ga-rent", label: "Rent & Facilities", accountNo: "6320", values: [12000, 12000, 12000, 12000, 12000, 12000, 12000, 12000, 12000, 12000, 12000, 12000] },
          { id: "opex-ga-other", label: "Other G&A", accountNo: "6390", values: [6400, 7200, 7200, 7500, 8000, 8100, 8200, 8700, 9000, 8900, 8600, 8700] },
        ],
      },
    ],
  },
  {
    id: "op-income", label: "Operating Income", isBold: true, isTotal: true, values: [58800, 62700, 65200, 68400, 70900, 74800, 78700, 81200, 84400, 89000, 94300, 98200],
  },
  {
    id: "other", label: "Other Income / (Expense)", isBold: true, values: [-2400, -2300, -2200, -2100, -2000, -1900, -1800, -1700, -1600, -1500, -1400, -1300],
    children: [
      { id: "other-interest", label: "Interest Expense", accountNo: "7010", values: [-3200, -3100, -3000, -2900, -2800, -2700, -2600, -2500, -2400, -2300, -2200, -2100] },
      { id: "other-invest", label: "Investment Income", accountNo: "7020", values: [800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800, 800] },
    ],
  },
  {
    id: "net-income", label: "Net Income", isBold: true, isTotal: true, values: [56400, 60400, 63000, 66300, 68900, 72900, 76900, 79500, 82800, 87500, 92900, 96900],
  },
];

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${expanded ? "rotate-90" : ""}`}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function BackArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function formatNumber(val: number, opts: { dropDecimals: boolean; inThousands: boolean; currency: string }) {
  const v = opts.inThousands ? val / 1000 : val;
  const neg = v < 0;
  const abs = Math.abs(v);
  const formatted = opts.dropDecimals
    ? abs.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    : abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const prefix = opts.currency === "$" ? "$" : "";
  const suffix = opts.inThousands ? "K" : "";
  return neg ? `(${prefix}${formatted}${suffix})` : `${prefix}${formatted}${suffix}`;
}

export default function IncomeStatementPage() {
  const [period, setPeriod] = useState("monthly");
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["revenue", "cogs", "opex", "other"]));
  const [showAcctNo, setShowAcctNo] = useState(false);
  const [showSubtotals, setShowSubtotals] = useState(true);
  const [excludeZero, setExcludeZero] = useState(false);
  const [showTotalCol, setShowTotalCol] = useState(true);
  const [dropDecimals, setDropDecimals] = useState(true);
  const [inThousands, setInThousands] = useState(false);
  const [currency, setCurrency] = useState("$");
  const [varianceType, setVarianceType] = useState<"none" | "py" | "pp">("none");
  const [varianceFormat, setVarianceFormat] = useState<"$" | "%" | "both">("$");
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const numFmt = { dropDecimals, inThousands, currency };

  const columns = useMemo(() => {
    if (period === "quarterly") return ["Q1", "Q2", "Q3", "Q4"];
    if (period === "annual") return ["FY 2025"];
    return MONTHS;
  }, [period]);

  const getDisplayValues = (values: number[]): number[] => {
    if (period === "quarterly") {
      return [
        values.slice(0, 3).reduce((a, b) => a + b, 0),
        values.slice(3, 6).reduce((a, b) => a + b, 0),
        values.slice(6, 9).reduce((a, b) => a + b, 0),
        values.slice(9, 12).reduce((a, b) => a + b, 0),
      ];
    }
    if (period === "annual") {
      return [values.reduce((a, b) => a + b, 0)];
    }
    return values;
  };

  const getTotal = (values: number[]): number => values.reduce((a, b) => a + b, 0);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderRow = (item: LineItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expanded.has(item.id);
    const displayValues = getDisplayValues(item.values);
    const total = getTotal(item.values);
    const isZero = total === 0 && displayValues.every((v) => v === 0);
    if (excludeZero && isZero) return null;

    const rows: React.ReactNode[] = [];

    rows.push(
      <tr
        key={item.id}
        className={`${item.isTotal ? "border-t border-border" : ""} hover:bg-gray-50 transition-colors`}
        style={item.isBold && !item.isTotal ? { background: "var(--mx-bg-card)" } : undefined}
      >
        <td className={`sticky left-0 z-10 py-2 pr-4 text-sm whitespace-nowrap ${item.isBold ? "font-semibold" : "mx-text-secondary"} ${item.isTotal ? "font-bold" : ""}`} style={{ paddingLeft: `${depth * 20 + 12}px`, background: "inherit" }}>
          <div className="flex items-center gap-1.5" style={{ background: "var(--mx-bg-container)" }}>
            {hasChildren ? (
              <button onClick={() => toggle(item.id)} className="p-0.5 rounded hover:bg-gray-100 mx-text-secondary">
                <ChevronIcon expanded={isExpanded} />
              </button>
            ) : (
              <span className="w-[18px]" />
            )}
            {showAcctNo && item.accountNo && <span className="mx-text-tertiary text-xs mr-1">{item.accountNo}</span>}
            {item.label}
            {item.isTotal && <span className="ml-1 text-[10px] mx-text-tertiary">=</span>}
          </div>
        </td>
        {displayValues.map((val, i) => (
          <td key={i} className={`py-2 px-3 text-right text-sm tabular-nums ${item.isBold || item.isTotal ? "font-semibold" : "mx-text-secondary"} ${val < 0 ? "text-red-400" : ""}`}>
            {formatNumber(val, numFmt)}
          </td>
        ))}
        {showTotalCol && (
          <td className={`py-2 px-3 text-right text-sm tabular-nums font-semibold ${total < 0 ? "text-red-400" : ""} ${item.isTotal ? "border-t border-border" : ""}`}>
            {formatNumber(total, numFmt)}
          </td>
        )}
      </tr>
    );

    if (hasChildren && isExpanded) {
      for (const child of item.children!) {
        const childRows = renderRow(child, depth + 1);
        if (childRows) rows.push(...(Array.isArray(childRows) ? childRows : [childRows]));
      }
    }

    return rows;
  };

  return (
    <div className="min-h-screen">
      <div className="border-b border-border px-8 py-4" style={{ background: "var(--mx-bg-card)" }}>
        <div className="flex items-center gap-3 mb-3">
          <Link href="/reporting" className="mx-text-secondary hover:text-[var(--mx-text)] transition-colors">
            <BackArrow />
          </Link>
          <h1 className="text-xl font-semibold">Income Statement</h1>
          <span className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: "var(--mx-primary-bg)", color: "var(--mx-primary)" }}>FY 2025</span>
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
          <Button variant="default" size="sm" onClick={() => setCustomizeOpen(!customizeOpen)}>
            Customize
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="default" size="sm">Export</Button>
            <Button variant="primary" size="sm">Save Report As</Button>
          </div>
        </div>

        {customizeOpen && (
          <div className="mt-4 rounded-lg border border-border p-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm" style={{ background: "var(--mx-bg-container)" }}>
            <div>
              <h4 className="font-medium mb-2">Columns</h4>
              <label className="flex items-center gap-2 mx-text-secondary cursor-pointer">
                <input type="radio" name="period" checked={period === "monthly"} onChange={() => setPeriod("monthly")} style={{ accentColor: "var(--mx-primary)" }} /> Monthly
              </label>
              <label className="flex items-center gap-2 mx-text-secondary cursor-pointer mt-1">
                <input type="radio" name="period" checked={period === "quarterly"} onChange={() => setPeriod("quarterly")} style={{ accentColor: "var(--mx-primary)" }} /> Quarterly
              </label>
              <label className="flex items-center gap-2 mx-text-secondary cursor-pointer mt-1">
                <input type="radio" name="period" checked={period === "annual"} onChange={() => setPeriod("annual")} style={{ accentColor: "var(--mx-primary)" }} /> Annual Total
              </label>
            </div>
            <div>
              <h4 className="font-medium mb-2">Variance Analysis</h4>
              <label className="flex items-center gap-2 mx-text-secondary cursor-pointer">
                <input type="radio" name="variance" checked={varianceType === "none"} onChange={() => setVarianceType("none")} style={{ accentColor: "var(--mx-primary)" }} /> None
              </label>
              <label className="flex items-center gap-2 mx-text-secondary cursor-pointer mt-1">
                <input type="radio" name="variance" checked={varianceType === "py"} onChange={() => setVarianceType("py")} style={{ accentColor: "var(--mx-primary)" }} /> vs Previous Year
              </label>
              <label className="flex items-center gap-2 mx-text-secondary cursor-pointer mt-1">
                <input type="radio" name="variance" checked={varianceType === "pp"} onChange={() => setVarianceType("pp")} style={{ accentColor: "var(--mx-primary)" }} /> vs Preceding Period
              </label>
              {varianceType !== "none" && (
                <div className="mt-2 flex gap-2">
                  {(["$", "%", "both"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setVarianceFormat(f)}
                      className={`rounded px-2 py-0.5 text-xs ${varianceFormat === f ? "text-white" : "bg-white mx-text-secondary border border-border"}`}
                      style={varianceFormat === f ? { backgroundColor: "var(--mx-primary)" } : undefined}
                    >
                      {f === "both" ? "$ & %" : f}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium mb-2">Formatting</h4>
              <label className="flex items-center gap-2 mx-text-secondary cursor-pointer">
                <input type="checkbox" checked={showAcctNo} onChange={() => setShowAcctNo(!showAcctNo)} style={{ accentColor: "var(--mx-primary)" }} /> Account Numbers
              </label>
              <label className="flex items-center gap-2 mx-text-secondary cursor-pointer mt-1">
                <input type="checkbox" checked={showSubtotals} onChange={() => setShowSubtotals(!showSubtotals)} style={{ accentColor: "var(--mx-primary)" }} /> Subgroup Totals
              </label>
              <label className="flex items-center gap-2 mx-text-secondary cursor-pointer mt-1">
                <input type="checkbox" checked={excludeZero} onChange={() => setExcludeZero(!excludeZero)} style={{ accentColor: "var(--mx-primary)" }} /> Exclude Zero Balance
              </label>
              <label className="flex items-center gap-2 mx-text-secondary cursor-pointer mt-1">
                <input type="checkbox" checked={showTotalCol} onChange={() => setShowTotalCol(!showTotalCol)} style={{ accentColor: "var(--mx-primary)" }} /> Show Total Column
              </label>
            </div>
            <div>
              <h4 className="font-medium mb-2">Number Format</h4>
              <label className="flex items-center gap-2 mx-text-secondary cursor-pointer">
                <input type="checkbox" checked={dropDecimals} onChange={() => setDropDecimals(!dropDecimals)} style={{ accentColor: "var(--mx-primary)" }} /> Drop Decimals
              </label>
              <label className="flex items-center gap-2 mx-text-secondary cursor-pointer mt-1">
                <input type="checkbox" checked={inThousands} onChange={() => setInThousands(!inThousands)} style={{ accentColor: "var(--mx-primary)" }} /> Show in Thousands
              </label>
              <label className="flex items-center gap-2 mx-text-secondary cursor-pointer mt-1">
                <input type="checkbox" checked={currency === "$"} onChange={() => setCurrency(currency === "$" ? "" : "$")} style={{ accentColor: "var(--mx-primary)" }} /> Currency Symbol ($)
              </label>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 z-10 py-3 pl-3 pr-4 text-left text-xs font-medium uppercase tracking-wider mx-text-secondary" style={{ background: "var(--mx-bg-container)" }}>Account</th>
              {columns.map((col) => (
                <th key={col} className="py-3 px-3 text-right text-xs font-medium uppercase tracking-wider mx-text-secondary">{col}</th>
              ))}
              {showTotalCol && (
                <th className="py-3 px-3 text-right text-xs font-medium uppercase tracking-wider" style={{ color: "var(--mx-primary)" }}>Total</th>
              )}
            </tr>
          </thead>
          <tbody>
            {MOCK_DATA.map((item) => renderRow(item))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

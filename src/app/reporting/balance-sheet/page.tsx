"use client";

import { useState } from "react";
import { Button, Select } from "@/components/ui";
import Link from "next/link";

interface LineItem {
  id: string;
  label: string;
  accountNo?: string;
  balance: number;
  children?: LineItem[];
  isBold?: boolean;
  isTotal?: boolean;
}

const MOCK_DATA: LineItem[] = [
  {
    id: "assets", label: "Assets", isBold: true, balance: 8_745_000,
    children: [
      {
        id: "current-assets", label: "Current Assets", isBold: true, balance: 4_920_000,
        children: [
          { id: "cash", label: "Cash & Cash Equivalents", accountNo: "1010", balance: 2_340_000 },
          { id: "ar", label: "Accounts Receivable", accountNo: "1100", balance: 1_285_000 },
          { id: "prepaid", label: "Prepaid Expenses", accountNo: "1200", balance: 345_000 },
          { id: "inventory", label: "Inventory", accountNo: "1300", balance: 520_000 },
          { id: "other-current", label: "Other Current Assets", accountNo: "1400", balance: 430_000 },
        ],
      },
      {
        id: "non-current-assets", label: "Non-Current Assets", isBold: true, balance: 3_825_000,
        children: [
          { id: "ppe", label: "Property, Plant & Equipment", accountNo: "1500", balance: 1_850_000 },
          { id: "acc-dep", label: "Accumulated Depreciation", accountNo: "1510", balance: -620_000 },
          { id: "intangible", label: "Intangible Assets", accountNo: "1600", balance: 1_480_000 },
          { id: "goodwill", label: "Goodwill", accountNo: "1700", balance: 750_000 },
          { id: "rou", label: "Right-of-Use Assets", accountNo: "1800", balance: 365_000 },
        ],
      },
    ],
  },
  {
    id: "liabilities", label: "Liabilities", isBold: true, balance: 3_962_000,
    children: [
      {
        id: "current-liabilities", label: "Current Liabilities", isBold: true, balance: 2_147_000,
        children: [
          { id: "ap", label: "Accounts Payable", accountNo: "2010", balance: 685_000 },
          { id: "accrued", label: "Accrued Liabilities", accountNo: "2020", balance: 412_000 },
          { id: "deferred-rev", label: "Deferred Revenue", accountNo: "2100", balance: 780_000 },
          { id: "current-debt", label: "Current Portion of Debt", accountNo: "2200", balance: 150_000 },
          { id: "lease-current", label: "Current Lease Liability", accountNo: "2300", balance: 120_000 },
        ],
      },
      {
        id: "non-current-liabilities", label: "Non-Current Liabilities", isBold: true, balance: 1_815_000,
        children: [
          { id: "long-debt", label: "Long-Term Debt", accountNo: "2500", balance: 1_200_000 },
          { id: "lease-lt", label: "Long-Term Lease Liability", accountNo: "2600", balance: 285_000 },
          { id: "deferred-tax", label: "Deferred Tax Liability", accountNo: "2700", balance: 330_000 },
        ],
      },
    ],
  },
  {
    id: "equity", label: "Stockholders' Equity", isBold: true, balance: 4_783_000,
    children: [
      { id: "common", label: "Common Stock", accountNo: "3010", balance: 500_000 },
      { id: "apic", label: "Additional Paid-In Capital", accountNo: "3020", balance: 2_800_000 },
      { id: "retained", label: "Retained Earnings", accountNo: "3030", balance: 1_583_000 },
      { id: "oci", label: "Accumulated Other Comprehensive Loss", accountNo: "3040", balance: -100_000 },
    ],
  },
  {
    id: "total-le", label: "Total Liabilities & Equity", isBold: true, isTotal: true, balance: 8_745_000,
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

function fmt(val: number, opts: { dropDecimals: boolean; inThousands: boolean }) {
  const v = opts.inThousands ? val / 1000 : val;
  const neg = v < 0;
  const abs = Math.abs(v);
  const formatted = opts.dropDecimals
    ? abs.toLocaleString("en-US", { maximumFractionDigits: 0 })
    : abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const suffix = opts.inThousands ? "K" : "";
  return neg ? `($${formatted}${suffix})` : `$${formatted}${suffix}`;
}

export default function BalanceSheetPage() {
  const [asOfDate, setAsOfDate] = useState("2025-12-31");
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["assets", "current-assets", "non-current-assets", "liabilities", "current-liabilities", "non-current-liabilities", "equity"]));
  const [showAcctNo, setShowAcctNo] = useState(false);
  const [dropDecimals, setDropDecimals] = useState(true);
  const [inThousands, setInThousands] = useState(false);
  const [excludeZero, setExcludeZero] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  const numFmt = { dropDecimals, inThousands };

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderRow = (item: LineItem, depth: number = 0): React.ReactNode[] => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expanded.has(item.id);
    if (excludeZero && item.balance === 0) return [];

    const rows: React.ReactNode[] = [];

    rows.push(
      <tr
        key={item.id}
        className={`${item.isTotal ? "border-t-2 border-border" : ""} hover:bg-gray-50 transition-colors`}
        style={item.isBold && !item.isTotal ? { background: "var(--mx-bg-card)" } : undefined}
      >
        <td className={`py-2.5 pr-4 text-sm whitespace-nowrap ${item.isBold ? "font-semibold" : "mx-text-secondary"} ${item.isTotal ? "font-bold" : ""}`} style={{ paddingLeft: `${depth * 24 + 16}px` }}>
          <div className="flex items-center gap-1.5">
            {hasChildren ? (
              <button onClick={() => toggle(item.id)} className="p-0.5 rounded hover:bg-gray-100 mx-text-secondary">
                <ChevronIcon expanded={isExpanded} />
              </button>
            ) : (
              <span className="w-[18px]" />
            )}
            {showAcctNo && item.accountNo && <span className="mx-text-tertiary text-xs mr-1">{item.accountNo}</span>}
            {item.label}
          </div>
        </td>
        <td className={`py-2.5 px-4 text-right text-sm tabular-nums ${item.isBold || item.isTotal ? "font-semibold" : "mx-text-secondary"} ${item.balance < 0 ? "text-red-400" : ""}`}>
          {fmt(item.balance, numFmt)}
        </td>
      </tr>
    );

    if (hasChildren && isExpanded) {
      for (const child of item.children!) {
        rows.push(...renderRow(child, depth + 1));
      }
    }

    return rows;
  };

  const dateOptions = [
    { value: "2025-12-31", label: "Dec 31, 2025" },
    { value: "2025-09-30", label: "Sep 30, 2025" },
    { value: "2025-06-30", label: "Jun 30, 2025" },
    { value: "2025-03-31", label: "Mar 31, 2025" },
    { value: "2024-12-31", label: "Dec 31, 2024" },
  ];

  return (
    <div className="min-h-screen">
      <div className="border-b border-border px-8 py-4" style={{ background: "var(--mx-bg-card)" }}>
        <div className="flex items-center gap-3 mb-3">
          <Link href="/reporting" className="mx-text-secondary hover:text-[var(--mx-text)] transition-colors">
            <BackArrow />
          </Link>
          <h1 className="text-xl font-semibold">Balance Sheet</h1>
          <span className="rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-medium text-blue-400">
            As of {dateOptions.find((d) => d.value === asOfDate)?.label}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Select options={dateOptions} value={asOfDate} onChange={(e) => setAsOfDate(e.target.value)} className="!w-44" />
          <Button variant="default" size="sm" onClick={() => setCustomizeOpen(!customizeOpen)}>
            Customize
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="default" size="sm">Export</Button>
            <Button variant="primary" size="sm">Save Report As</Button>
          </div>
        </div>

        {customizeOpen && (
          <div className="mt-4 rounded-lg border border-border p-4 flex flex-wrap gap-6 text-sm" style={{ background: "var(--mx-bg-container)" }}>
            <div>
              <h4 className="font-medium mb-2">Formatting</h4>
              <label className="flex items-center gap-2 mx-text-secondary cursor-pointer">
                <input type="checkbox" checked={showAcctNo} onChange={() => setShowAcctNo(!showAcctNo)} style={{ accentColor: "var(--mx-primary)" }} /> Account Numbers
              </label>
              <label className="flex items-center gap-2 mx-text-secondary cursor-pointer mt-1">
                <input type="checkbox" checked={excludeZero} onChange={() => setExcludeZero(!excludeZero)} style={{ accentColor: "var(--mx-primary)" }} /> Exclude Zero Balance
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
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto px-8 py-4">
        <table className="w-full max-w-3xl">
          <thead>
            <tr className="border-b border-border">
              <th className="py-3 text-left text-xs font-medium uppercase tracking-wider mx-text-secondary">Account</th>
              <th className="py-3 px-4 text-right text-xs font-medium uppercase tracking-wider mx-text-secondary">Balance</th>
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

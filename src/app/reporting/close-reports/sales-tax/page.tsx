"use client";

import { useState, useMemo } from "react";
import { Button, Select, Input } from "@/components/ui";

type PeriodPreset = "ytd" | "lytd" | "last-quarter" | "custom";

interface SalesTaxRow {
  id: string;
  country: string;
  state: string;
  transactionNumber: string;
  date: string;
  preTax: number;
  tax: number;
  total: number;
  addressIncomplete: boolean;
}

const MOCK_DATA: SalesTaxRow[] = [
  { id: "st1", country: "US", state: "California", transactionNumber: "INV-1041", date: "2025-01-15", preTax: 15000, tax: 1162.50, total: 16162.50, addressIncomplete: false },
  { id: "st2", country: "US", state: "New York", transactionNumber: "INV-1042", date: "2025-02-03", preTax: 28500, tax: 2280.00, total: 30780.00, addressIncomplete: false },
  { id: "st3", country: "US", state: "Texas", transactionNumber: "INV-1043", date: "2025-02-18", preTax: 9200, tax: 759.00, total: 9959.00, addressIncomplete: true },
  { id: "st4", country: "US", state: "Florida", transactionNumber: "INV-1044", date: "2025-03-01", preTax: 42000, tax: 2520.00, total: 44520.00, addressIncomplete: false },
  { id: "st5", country: "US", state: "Washington", transactionNumber: "INV-1045", date: "2025-03-12", preTax: 18700, tax: 1907.40, total: 20607.40, addressIncomplete: false },
  { id: "st6", country: "Canada", state: "Ontario", transactionNumber: "INV-1046", date: "2025-03-20", preTax: 7500, tax: 975.00, total: 8475.00, addressIncomplete: false },
  { id: "st7", country: "US", state: "Illinois", transactionNumber: "INV-1047", date: "2025-04-02", preTax: 33000, tax: 2145.00, total: 35145.00, addressIncomplete: true },
  { id: "st8", country: "US", state: "California", transactionNumber: "INV-1048", date: "2025-04-15", preTax: 12400, tax: 961.00, total: 13361.00, addressIncomplete: false },
  { id: "st9", country: "Canada", state: "British Columbia", transactionNumber: "INV-1049", date: "2025-05-01", preTax: 56000, tax: 6720.00, total: 62720.00, addressIncomplete: false },
  { id: "st10", country: "US", state: "", transactionNumber: "INV-1050", date: "2025-05-10", preTax: 21000, tax: 0, total: 21000, addressIncomplete: true },
];

const PERIOD_OPTIONS = [
  { value: "ytd", label: "Year to Date" },
  { value: "lytd", label: "Last Year to Date" },
  { value: "last-quarter", label: "Last Quarter" },
  { value: "custom", label: "Custom Range" },
];

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

export default function SalesTaxPage() {
  const [period, setPeriod] = useState<PeriodPreset>("ytd");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredData = useMemo(() => {
    if (period === "custom" && dateFrom && dateTo) {
      return MOCK_DATA.filter((r) => r.date >= dateFrom && r.date <= dateTo);
    }
    return MOCK_DATA;
  }, [period, dateFrom, dateTo]);

  const totals = useMemo(() => ({
    preTax: filteredData.reduce((s, r) => s + r.preTax, 0),
    tax: filteredData.reduce((s, r) => s + r.tax, 0),
    total: filteredData.reduce((s, r) => s + r.total, 0),
  }), [filteredData]);

  const incompleteCount = filteredData.filter((r) => r.addressIncomplete).length;

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mx-h1">Sales Tax Report</h1>
          <p className="mt-1 mx-text-secondary">Transaction-level sales tax breakdown by jurisdiction</p>
        </div>
        <Button variant="default">Export</Button>
      </div>

      <div className="flex items-end gap-4">
        <div className="w-48">
          <Select
            label="Period"
            options={PERIOD_OPTIONS}
            value={period}
            onChange={(e) => setPeriod(e.target.value as PeriodPreset)}
          />
        </div>
        {period === "custom" && (
          <>
            <Input label="From" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <Input label="To" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </>
        )}
      </div>

      {incompleteCount > 0 && (
        <div className="mx-alert-warning">
          <div className="mx-alert-icon">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="mx-alert-content">
            <p className="text-sm font-medium">{incompleteCount} transaction(s) with incomplete addresses</p>
            <p className="text-xs mt-0.5" style={{ opacity: 0.7 }}>
              Highlighted rows have missing state/province information. Tax may not be calculated correctly.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Transactions", value: filteredData.length.toString() },
          { label: "Total Pre-Tax", value: fmt(totals.preTax) },
          { label: "Total Tax", value: fmt(totals.tax) },
          { label: "Grand Total", value: fmt(totals.total) },
        ].map((c) => (
          <div key={c.label} className="mx-card mx-card-white">
            <p className="text-sm mx-text-secondary">{c.label}</p>
            <p className="mt-1 text-xl font-semibold">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mx-table-container">
        <table className="mx-table">
          <thead>
            <tr>
              <th className="text-left">Country</th>
              <th className="text-left">State/Province</th>
              <th className="text-left">Transaction #</th>
              <th className="text-left">Date</th>
              <th className="text-right">Pre-Tax</th>
              <th className="text-right">Tax</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr
                key={row.id}
                className={row.addressIncomplete ? "bg-yellow-500/5" : ""}
              >
                <td>{row.country}</td>
                <td>
                  {row.addressIncomplete ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span>{row.state || "—"}</span>
                      <span className="mx-tag mx-tag-warning">
                        INCOMPLETE
                      </span>
                    </span>
                  ) : (
                    <span>{row.state}</span>
                  )}
                </td>
                <td className="font-medium" style={{ color: 'var(--mx-primary)' }}>{row.transactionNumber}</td>
                <td className="mx-text-secondary">{row.date}</td>
                <td className="text-right">{fmt(row.preTax)}</td>
                <td className="text-right">{fmt(row.tax)}</td>
                <td className="text-right font-medium">{fmt(row.total)}</td>
              </tr>
            ))}
            <tr className="border-t-2 border-border font-semibold" style={{ background: 'var(--mx-bg-card)' }}>
              <td colSpan={4}>Total</td>
              <td className="text-right">{fmt(totals.preTax)}</td>
              <td className="text-right">{fmt(totals.tax)}</td>
              <td className="text-right">{fmt(totals.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

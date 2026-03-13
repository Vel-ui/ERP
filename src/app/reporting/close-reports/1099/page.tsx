"use client";

import { useState, useMemo } from "react";
import { Button, Select } from "@/components/ui";

type Method = "cash" | "accrual";

interface Vendor1099 {
  id: string;
  name: string;
  taxId: string;
  totalPaymentsCash: number;
  totalPaymentsAccrual: number;
  eligible: boolean;
  hasCreditCard: boolean;
}

const MOCK_VENDORS: Vendor1099[] = [
  { id: "v1", name: "Johnson Consulting LLC", taxId: "12-3456789", totalPaymentsCash: 85200, totalPaymentsAccrual: 92400, eligible: true, hasCreditCard: false },
  { id: "v2", name: "Martinez Legal Services", taxId: "98-7654321", totalPaymentsCash: 42500, totalPaymentsAccrual: 45000, eligible: true, hasCreditCard: false },
  { id: "v3", name: "Thompson IT Solutions", taxId: "55-1234567", totalPaymentsCash: 128000, totalPaymentsAccrual: 135600, eligible: true, hasCreditCard: false },
  { id: "v4", name: "Davis Marketing Group", taxId: "33-9876543", totalPaymentsCash: 3200, totalPaymentsAccrual: 4800, eligible: false, hasCreditCard: true },
  { id: "v5", name: "Williams Creative Agency", taxId: "77-4561230", totalPaymentsCash: 67800, totalPaymentsAccrual: 72100, eligible: true, hasCreditCard: false },
  { id: "v6", name: "Brown & Associates CPA", taxId: "44-7890123", totalPaymentsCash: 24000, totalPaymentsAccrual: 24000, eligible: true, hasCreditCard: false },
  { id: "v7", name: "Lee Software Development", taxId: "66-3210987", totalPaymentsCash: 156000, totalPaymentsAccrual: 162000, eligible: true, hasCreditCard: false },
  { id: "v8", name: "Garcia Staffing Services", taxId: "22-6543210", totalPaymentsCash: 5600, totalPaymentsAccrual: 7200, eligible: false, hasCreditCard: true },
];

const YEAR_OPTIONS = [
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
];

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });

export default function Report1099Page() {
  const [method, setMethod] = useState<Method>("cash");
  const [year, setYear] = useState("2025");

  const data = useMemo(() => {
    return MOCK_VENDORS.filter((v) => !v.hasCreditCard);
  }, []);

  const totalPayments = data.reduce(
    (s, v) => s + (method === "cash" ? v.totalPaymentsCash : v.totalPaymentsAccrual),
    0
  );
  const eligibleCount = data.filter((v) => v.eligible).length;
  const eligibleTotal = data
    .filter((v) => v.eligible)
    .reduce((s, v) => s + (method === "cash" ? v.totalPaymentsCash : v.totalPaymentsAccrual), 0);

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mx-h1">1099 Report</h1>
          <p className="mt-1 mx-text-secondary">Vendor payment summary for 1099 filing</p>
        </div>
        <Button variant="default">Export</Button>
      </div>

      <div className="flex items-end gap-4">
        <div className="mx-segmented">
          {(["cash", "accrual"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`mx-segmented-item capitalize ${method === m ? "mx-segmented-item-selected" : ""}`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="w-36">
          <Select label="Year" options={YEAR_OPTIONS} value={year} onChange={(e) => setYear(e.target.value)} />
        </div>
      </div>

      <div className="mx-alert-warning">
        <div className="mx-alert-icon">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="mx-alert-content">
          <p className="text-sm font-medium">Credit card transactions excluded</p>
          <p className="text-xs mt-0.5" style={{ opacity: 0.7 }}>
            Payments made via credit card are excluded per IRS regulations — the card issuer reports those.
            {" "}{MOCK_VENDORS.filter((v) => v.hasCreditCard).length} vendor(s) with credit-card-only payments omitted.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Vendors", value: data.length.toString() },
          { label: "1099-Eligible", value: eligibleCount.toString() },
          { label: "Total Payments", value: fmt(totalPayments) },
          { label: "Eligible Total", value: fmt(eligibleTotal) },
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
              <th className="text-left">Vendor Name</th>
              <th className="text-left">Tax ID</th>
              <th className="text-right">
                Total Payments ({method === "cash" ? "Cash" : "Accrual"})
              </th>
              <th className="text-center">1099-Eligible</th>
            </tr>
          </thead>
          <tbody>
            {data.map((v) => (
              <tr key={v.id}>
                <td className="font-medium">{v.name}</td>
                <td className="font-mono mx-text-secondary">{v.taxId}</td>
                <td className="text-right font-medium">
                  {fmt(method === "cash" ? v.totalPaymentsCash : v.totalPaymentsAccrual)}
                </td>
                <td className="text-center">
                  {v.eligible ? (
                    <span className="mx-tag mx-tag-success">Yes</span>
                  ) : (
                    <span className="mx-tag">No</span>
                  )}
                </td>
              </tr>
            ))}
            <tr className="border-t-2 border-border font-semibold" style={{ background: 'var(--mx-bg-card)' }}>
              <td>Total</td>
              <td />
              <td className="text-right">{fmt(totalPayments)}</td>
              <td className="text-center mx-text-secondary">{eligibleCount} of {data.length}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

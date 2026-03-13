"use client";

import { useState, useMemo } from "react";
import { Button, Select, Input } from "@/components/ui";

type AmortMethod = "daily" | "even-period";

interface PrepaidItem {
  id: string;
  vendor: string;
  account: string;
  originalAmount: number;
  periodAmount: number;
  amortizedToDate: number;
  remainingBalance: number;
  startDate: string;
  endDate: string;
  method: AmortMethod;
}

const MOCK_DATA: PrepaidItem[] = [
  {
    id: "pp1", vendor: "Hartford Insurance Co.", account: "1400 - Prepaid Insurance",
    originalAmount: 36000, periodAmount: 3000, amortizedToDate: 9000, remainingBalance: 27000,
    startDate: "2025-01-01", endDate: "2025-12-31", method: "even-period",
  },
  {
    id: "pp2", vendor: "WeWork Spaces", account: "1410 - Prepaid Rent",
    originalAmount: 144000, periodAmount: 12000, amortizedToDate: 36000, remainingBalance: 108000,
    startDate: "2025-01-01", endDate: "2025-12-31", method: "even-period",
  },
  {
    id: "pp3", vendor: "AWS Reserved Instances", account: "1420 - Prepaid Cloud",
    originalAmount: 48000, periodAmount: 4000, amortizedToDate: 12000, remainingBalance: 36000,
    startDate: "2025-01-01", endDate: "2025-12-31", method: "even-period",
  },
  {
    id: "pp4", vendor: "Salesforce Inc.", account: "1430 - Prepaid Software",
    originalAmount: 24000, periodAmount: 2000, amortizedToDate: 6000, remainingBalance: 18000,
    startDate: "2025-01-01", endDate: "2025-12-31", method: "even-period",
  },
  {
    id: "pp5", vendor: "Travelers Insurance", account: "1400 - Prepaid Insurance",
    originalAmount: 18250, periodAmount: 1520.83, amortizedToDate: 4500, remainingBalance: 13750,
    startDate: "2025-01-15", endDate: "2026-01-14", method: "daily",
  },
  {
    id: "pp6", vendor: "Regus Office Space", account: "1410 - Prepaid Rent",
    originalAmount: 60000, periodAmount: 5000, amortizedToDate: 15000, remainingBalance: 45000,
    startDate: "2025-01-01", endDate: "2025-12-31", method: "even-period",
  },
  {
    id: "pp7", vendor: "Cisco Meraki", account: "1440 - Prepaid Hardware",
    originalAmount: 9125, periodAmount: 760.42, amortizedToDate: 2250, remainingBalance: 6875,
    startDate: "2025-01-01", endDate: "2025-12-31", method: "daily",
  },
];

const PERIOD_OPTIONS = [
  { value: "2025-03", label: "March 2025" },
  { value: "2025-02", label: "February 2025" },
  { value: "2025-01", label: "January 2025" },
  { value: "2025-q1", label: "Q1 2025" },
];

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

export default function PrepaidSchedulePage() {
  const [period, setPeriod] = useState("2025-03");
  const [balanceAsOf, setBalanceAsOf] = useState("2025-03-31");

  const totals = useMemo(() => ({
    original: MOCK_DATA.reduce((s, r) => s + r.originalAmount, 0),
    period: MOCK_DATA.reduce((s, r) => s + r.periodAmount, 0),
    amortized: MOCK_DATA.reduce((s, r) => s + r.amortizedToDate, 0),
    remaining: MOCK_DATA.reduce((s, r) => s + r.remainingBalance, 0),
  }), []);

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mx-h1">Prepaid Schedule</h1>
          <p className="mt-1 mx-text-secondary">Amortization schedule for prepaid expenses</p>
        </div>
        <Button variant="default">Export</Button>
      </div>

      <div className="flex items-end gap-4">
        <div className="w-48">
          <Select label="Period" options={PERIOD_OPTIONS} value={period} onChange={(e) => setPeriod(e.target.value)} />
        </div>
        <Input
          label="Balance as of"
          type="date"
          value={balanceAsOf}
          onChange={(e) => setBalanceAsOf(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Original", value: fmt(totals.original) },
          { label: "Current Period", value: fmt(totals.period) },
          { label: "Amortized to Date", value: fmt(totals.amortized) },
          { label: "Remaining Balance", value: fmt(totals.remaining) },
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
              <th className="text-left">Vendor</th>
              <th className="text-left">Account</th>
              <th className="text-right">Original Amount</th>
              <th className="text-right">Period Amount</th>
              <th className="text-right">Amortized to Date</th>
              <th className="text-right">Remaining Balance</th>
              <th className="text-left">Start Date</th>
              <th className="text-left">End Date</th>
              <th className="text-left">Method</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DATA.map((row) => {
              const pctUsed = (row.amortizedToDate / row.originalAmount) * 100;
              return (
                <tr key={row.id}>
                  <td className="font-medium">{row.vendor}</td>
                  <td className="mx-text-secondary">{row.account}</td>
                  <td className="text-right">{fmt(row.originalAmount)}</td>
                  <td className="text-right">{fmt(row.periodAmount)}</td>
                  <td className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span>{fmt(row.amortizedToDate)}</span>
                      <div className="h-1.5 w-16 overflow-hidden rounded-full" style={{ background: 'var(--mx-border)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.min(pctUsed, 100)}%`, background: 'var(--mx-primary)' }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="text-right font-medium">{fmt(row.remainingBalance)}</td>
                  <td className="mx-text-secondary">{row.startDate}</td>
                  <td className="mx-text-secondary">{row.endDate}</td>
                  <td>
                    <span className={row.method === "daily" ? "mx-tag mx-tag-processing" : "mx-tag mx-tag-success"}>
                      {row.method === "daily" ? "Daily" : "Even Period"}
                    </span>
                  </td>
                </tr>
              );
            })}
            <tr className="border-t-2 border-border font-semibold" style={{ background: 'var(--mx-bg-card)' }}>
              <td>Total</td>
              <td />
              <td className="text-right">{fmt(totals.original)}</td>
              <td className="text-right">{fmt(totals.period)}</td>
              <td className="text-right">{fmt(totals.amortized)}</td>
              <td className="text-right">{fmt(totals.remaining)}</td>
              <td colSpan={3} />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

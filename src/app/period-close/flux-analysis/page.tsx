"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, Filter, TrendingUp, TrendingDown } from "lucide-react";
import { Button, Select, Tag } from "@/components/ui";

interface FluxRow {
  id: string;
  account: string;
  accountName: string;
  currentPeriod: number;
  priorPeriod: number;
  dollarVariance: number;
  pctVariance: number;
  threshold: number;
  status: "flagged" | "explained" | "within-threshold";
  explanation?: string;
}

const mockFluxData: FluxRow[] = [
  { id: "1", account: "4000", accountName: "Revenue - Product Sales", currentPeriod: 485000, priorPeriod: 412000, dollarVariance: 73000, pctVariance: 17.72, threshold: 10, status: "explained", explanation: "New enterprise contract signed in March" },
  { id: "2", account: "4100", accountName: "Revenue - Services", currentPeriod: 128000, priorPeriod: 135000, dollarVariance: -7000, pctVariance: -5.19, threshold: 10, status: "within-threshold" },
  { id: "3", account: "5000", accountName: "Cost of Goods Sold", currentPeriod: 218000, priorPeriod: 186000, dollarVariance: 32000, pctVariance: 17.2, threshold: 10, status: "flagged" },
  { id: "4", account: "5100", accountName: "Salaries & Wages", currentPeriod: 312000, priorPeriod: 298000, dollarVariance: 14000, pctVariance: 4.7, threshold: 10, status: "within-threshold" },
  { id: "5", account: "6000", accountName: "Depreciation Expense", currentPeriod: 12500, priorPeriod: 12500, dollarVariance: 0, pctVariance: 0, threshold: 5, status: "within-threshold" },
  { id: "6", account: "6100", accountName: "Insurance Expense", currentPeriod: 8200, priorPeriod: 4100, dollarVariance: 4100, pctVariance: 100, threshold: 15, status: "flagged" },
  { id: "7", account: "6200", accountName: "Rent Expense", currentPeriod: 25000, priorPeriod: 25000, dollarVariance: 0, pctVariance: 0, threshold: 5, status: "within-threshold" },
  { id: "8", account: "6300", accountName: "Utilities Expense", currentPeriod: 3800, priorPeriod: 3200, dollarVariance: 600, pctVariance: 18.75, threshold: 20, status: "within-threshold" },
  { id: "9", account: "6500", accountName: "Marketing Expense", currentPeriod: 45000, priorPeriod: 28000, dollarVariance: 17000, pctVariance: 60.71, threshold: 15, status: "explained", explanation: "Q1 product launch campaign" },
  { id: "10", account: "6600", accountName: "Legal Fees", currentPeriod: 18500, priorPeriod: 7500, dollarVariance: 11000, pctVariance: 146.67, threshold: 25, status: "flagged" },
  { id: "11", account: "6700", accountName: "Consulting Fees", currentPeriod: 22000, priorPeriod: 15000, dollarVariance: 7000, pctVariance: 46.67, threshold: 20, status: "explained", explanation: "ERP implementation consulting" },
  { id: "12", account: "7000", accountName: "Interest Expense", currentPeriod: 4200, priorPeriod: 4200, dollarVariance: 0, pctVariance: 0, threshold: 5, status: "within-threshold" },
];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);
}

const statusVariant: Record<string, "error" | "success" | "default"> = {
  flagged: "error",
  explained: "success",
  "within-threshold": "default",
};

const statusLabel: Record<string, string> = {
  flagged: "Flagged",
  explained: "Explained",
  "within-threshold": "Within Threshold",
};

export default function FluxAnalysisPage() {
  const [filter, setFilter] = useState("all");
  const [periodCurrent] = useState("March 2026");
  const [periodPrior] = useState("February 2026");

  const filtered = mockFluxData.filter((row) => {
    if (filter === "all") return true;
    if (filter === "flagged") return row.status === "flagged";
    if (filter === "unexplained") return row.status === "flagged";
    return true;
  });

  const flaggedCount = mockFluxData.filter((r) => r.status === "flagged").length;
  const explainedCount = mockFluxData.filter((r) => r.status === "explained").length;
  const withinCount = mockFluxData.filter((r) => r.status === "within-threshold").length;

  return (
    <div style={{ padding: 24, background: '#f9f9f9' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Flux Analysis</h1>
            <p className="mx-text-secondary mt-1">{periodCurrent} vs {periodPrior} — Variance review</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          <div className="mx-card" style={{ padding: 16 }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={16} style={{ color: '#f03c46' }} />
              <span className="mx-text-secondary" style={{ fontSize: 13 }}>Flagged</span>
            </div>
            <p style={{ fontSize: 24, fontWeight: 600, color: '#f03c46' }}>{flaggedCount}</p>
          </div>
          <div className="mx-card" style={{ padding: 16 }}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} style={{ color: '#067f54' }} />
              <span className="mx-text-secondary" style={{ fontSize: 13 }}>Explained</span>
            </div>
            <p style={{ fontSize: 24, fontWeight: 600, color: '#067f54' }}>{explainedCount}</p>
          </div>
          <div className="mx-card" style={{ padding: 16 }}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} style={{ color: '#a0a2aa' }} />
              <span className="mx-text-secondary" style={{ fontSize: 13 }}>Within Threshold</span>
            </div>
            <p style={{ fontSize: 24, fontWeight: 600, color: '#2D2926' }}>{withinCount}</p>
          </div>
        </div>

        <div className="flex items-end gap-4 mb-4">
          <div style={{ width: 200 }}>
            <Select
              label="Filter"
              options={[
                { value: "all", label: "All Accounts" },
                { value: "flagged", label: "Flagged Only" },
                { value: "unexplained", label: "Unexplained" },
              ]}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="mx-table-container">
          <table className="mx-table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Account Name</th>
                <th style={{ textAlign: 'right' }}>{periodCurrent}</th>
                <th style={{ textAlign: 'right' }}>{periodPrior}</th>
                <th style={{ textAlign: 'right' }}>$ Variance</th>
                <th style={{ textAlign: 'right' }}>% Variance</th>
                <th style={{ textAlign: 'right' }}>Threshold</th>
                <th style={{ textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontFamily: 'monospace', color: '#2D2926' }}>{row.account}</td>
                  <td style={{ fontWeight: 500, color: '#2D2926' }}>
                    {row.accountName}
                    {row.explanation && (
                      <p className="mx-text-secondary" style={{ fontSize: 11, marginTop: 2 }}>{row.explanation}</p>
                    )}
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#2D2926' }}>{formatCurrency(row.currentPeriod)}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#61636a' }}>{formatCurrency(row.priorPeriod)}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', color: row.dollarVariance < 0 ? '#f03c46' : row.dollarVariance > 0 ? '#2D2926' : '#a0a2aa' }}>
                    <span className="flex items-center justify-end gap-1">
                      {row.dollarVariance !== 0 && (row.dollarVariance > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />)}
                      {formatCurrency(row.dollarVariance)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', color: Math.abs(row.pctVariance) > row.threshold ? '#f03c46' : '#61636a' }}>
                    {row.pctVariance > 0 ? "+" : ""}{row.pctVariance.toFixed(1)}%
                  </td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#a0a2aa' }}>±{row.threshold}%</td>
                  <td style={{ textAlign: 'center' }}>
                    <Tag variant={statusVariant[row.status]}>{statusLabel[row.status]}</Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

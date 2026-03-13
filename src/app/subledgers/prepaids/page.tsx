"use client";

import { useState } from "react";
import { DollarSign, TrendingDown, Calendar } from "lucide-react";
import { Tag } from "@/components/ui";

interface PrepaidSchedule {
  id: string;
  description: string;
  vendor: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  amortized: number;
  remaining: number;
  monthlyAmount: number;
  status: "Active" | "Completed" | "Pending";
}

const mockPrepaids: PrepaidSchedule[] = [
  { id: "PP-001", description: "Annual Cyber Liability Insurance", vendor: "Hartford Insurance", startDate: "2026-01-01", endDate: "2026-12-31", totalAmount: 36000.00, amortized: 9000.00, remaining: 27000.00, monthlyAmount: 3000.00, status: "Active" },
  { id: "PP-002", description: "Office Lease Deposit", vendor: "WeWork", startDate: "2025-06-01", endDate: "2026-05-31", totalAmount: 24000.00, amortized: 20000.00, remaining: 4000.00, monthlyAmount: 2000.00, status: "Active" },
  { id: "PP-003", description: "Salesforce Enterprise License", vendor: "Salesforce Inc.", startDate: "2026-02-01", endDate: "2027-01-31", totalAmount: 48000.00, amortized: 8000.00, remaining: 40000.00, monthlyAmount: 4000.00, status: "Active" },
  { id: "PP-004", description: "Annual Conference Sponsorship", vendor: "SaaStr Events", startDate: "2026-03-01", endDate: "2026-09-30", totalAmount: 15000.00, amortized: 2142.86, remaining: 12857.14, monthlyAmount: 2142.86, status: "Active" },
  { id: "PP-005", description: "D&O Insurance (2025)", vendor: "Chubb Insurance", startDate: "2025-01-01", endDate: "2025-12-31", totalAmount: 42000.00, amortized: 42000.00, remaining: 0, monthlyAmount: 3500.00, status: "Completed" },
];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

const statusVariant: Record<string, "success" | "default" | "warning"> = {
  Active: "success",
  Completed: "default",
  Pending: "warning",
};

export default function PrepaidsPage() {
  const [prepaids] = useState<PrepaidSchedule[]>(mockPrepaids);

  const totalBalance = prepaids.filter((p) => p.status === "Active").reduce((s, p) => s + p.remaining, 0);
  const amortizedThisMonth = prepaids.filter((p) => p.status === "Active").reduce((s, p) => s + p.monthlyAmount, 0);
  const remainingToAmortize = prepaids.filter((p) => p.status !== "Completed").reduce((s, p) => s + p.remaining, 0);

  return (
    <div style={{ padding: 24, background: '#f9f9f9' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Prepaids</h1>
            <p className="mx-text-secondary mt-1">Prepaid expense schedules and amortization tracking</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          <div className="mx-card" style={{ padding: 20 }}>
            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#e8edeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={18} style={{ color: '#154738' }} />
              </div>
              <p className="mx-text-secondary" style={{ fontSize: 13 }}>Total Prepaid Balance</p>
            </div>
            <p style={{ fontSize: 24, fontWeight: 600, color: '#2D2926' }}>{formatCurrency(totalBalance)}</p>
          </div>
          <div className="mx-card" style={{ padding: 20 }}>
            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#edfdec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingDown size={18} style={{ color: '#067f54' }} />
              </div>
              <p className="mx-text-secondary" style={{ fontSize: 13 }}>Amortized This Month</p>
            </div>
            <p style={{ fontSize: 24, fontWeight: 600, color: '#2D2926' }}>{formatCurrency(amortizedThisMonth)}</p>
          </div>
          <div className="mx-card" style={{ padding: 20 }}>
            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fffbe9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={18} style={{ color: '#e8bf1b' }} />
              </div>
              <p className="mx-text-secondary" style={{ fontSize: 13 }}>Remaining to Amortize</p>
            </div>
            <p style={{ fontSize: 24, fontWeight: 600, color: '#2D2926' }}>{formatCurrency(remainingToAmortize)}</p>
          </div>
        </div>

        <div className="mx-table-container">
          <table className="mx-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Vendor</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th style={{ textAlign: 'right' }}>Total Amount</th>
                <th style={{ textAlign: 'right' }}>Amortized</th>
                <th style={{ textAlign: 'right' }}>Remaining</th>
                <th style={{ textAlign: 'right' }}>Monthly</th>
                <th style={{ textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {prepaids.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500, color: '#2D2926' }}>{p.description}</td>
                  <td>{p.vendor}</td>
                  <td>{p.startDate}</td>
                  <td>{p.endDate}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#2D2926' }}>{formatCurrency(p.totalAmount)}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#067f54' }}>{formatCurrency(p.amortized)}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', color: p.remaining === 0 ? '#a0a2aa' : '#2D2926' }}>{formatCurrency(p.remaining)}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>{formatCurrency(p.monthlyAmount)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <Tag variant={statusVariant[p.status]}>{p.status}</Tag>
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

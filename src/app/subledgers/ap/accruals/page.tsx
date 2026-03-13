"use client";

import { useState } from "react";
import { Plus, RotateCcw, DollarSign, Clock, CheckCircle, FileText } from "lucide-react";
import { Button, Tag } from "@/components/ui";

interface Accrual {
  id: string;
  date: string;
  description: string;
  account: string;
  amount: number;
  type: "Auto" | "Manual";
  status: "Active" | "Reversed" | "Pending";
}

const mockAccruals: Accrual[] = [
  { id: "ACC-001", date: "2026-03-31", description: "Q1 Bonus accrual", account: "5100 - Salaries & Wages", amount: 45000.00, type: "Manual", status: "Active" },
  { id: "ACC-002", date: "2026-03-31", description: "March rent accrual", account: "6200 - Rent Expense", amount: 8500.00, type: "Auto", status: "Active" },
  { id: "ACC-003", date: "2026-03-31", description: "Legal fees accrual", account: "6600 - Legal Fees", amount: 12750.00, type: "Manual", status: "Pending" },
  { id: "ACC-004", date: "2026-02-28", description: "February utilities accrual", account: "6300 - Utilities", amount: 3200.00, type: "Auto", status: "Reversed" },
  { id: "ACC-005", date: "2026-03-31", description: "Software license accrual", account: "6300 - Software", amount: 5600.00, type: "Auto", status: "Active" },
  { id: "ACC-006", date: "2026-03-31", description: "Professional services accrual", account: "6700 - Consulting", amount: 18500.00, type: "Manual", status: "Pending" },
  { id: "ACC-007", date: "2026-02-28", description: "February insurance accrual", account: "6100 - Insurance", amount: 4100.00, type: "Auto", status: "Reversed" },
  { id: "ACC-008", date: "2026-03-31", description: "Marketing spend accrual", account: "6700 - Marketing", amount: 9800.00, type: "Manual", status: "Active" },
];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

const statusVariant: Record<string, "success" | "default" | "warning"> = {
  Active: "success",
  Reversed: "default",
  Pending: "warning",
};

export default function AccrualsPage() {
  const [accruals] = useState<Accrual[]>(mockAccruals);

  const totalAccrued = accruals.filter((a) => a.status === "Active").reduce((s, a) => s + a.amount, 0);
  const pendingReversal = accruals.filter((a) => a.status === "Pending").reduce((s, a) => s + a.amount, 0);
  const autoReversedCount = accruals.filter((a) => a.status === "Reversed" && a.type === "Auto").length;
  const manualCount = accruals.filter((a) => a.type === "Manual").length;

  return (
    <div style={{ padding: 24, background: '#f9f9f9' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Accruals</h1>
            <p className="mx-text-secondary mt-1">Manage accrual entries, reversals, and schedules</p>
          </div>
          <Button><Plus size={16} className="mr-1" /> New Accrual</Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="mx-card" style={{ padding: 20 }}>
            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#edfdec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={18} style={{ color: '#067f54' }} />
              </div>
              <p className="mx-text-secondary" style={{ fontSize: 13 }}>Total Accrued</p>
            </div>
            <p style={{ fontSize: 24, fontWeight: 600, color: '#2D2926' }}>{formatCurrency(totalAccrued)}</p>
          </div>
          <div className="mx-card" style={{ padding: 20 }}>
            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fffbe9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} style={{ color: '#e8bf1b' }} />
              </div>
              <p className="mx-text-secondary" style={{ fontSize: 13 }}>Pending Reversal</p>
            </div>
            <p style={{ fontSize: 24, fontWeight: 600, color: '#2D2926' }}>{formatCurrency(pendingReversal)}</p>
          </div>
          <div className="mx-card" style={{ padding: 20 }}>
            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#e8edeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <RotateCcw size={18} style={{ color: '#154738' }} />
              </div>
              <p className="mx-text-secondary" style={{ fontSize: 13 }}>Auto-Reversed This Month</p>
            </div>
            <p style={{ fontSize: 24, fontWeight: 600, color: '#2D2926' }}>{autoReversedCount}</p>
          </div>
          <div className="mx-card" style={{ padding: 20 }}>
            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f3f1fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} style={{ color: '#a3a0af' }} />
              </div>
              <p className="mx-text-secondary" style={{ fontSize: 13 }}>Manual Adjustments</p>
            </div>
            <p style={{ fontSize: 24, fontWeight: 600, color: '#2D2926' }}>{manualCount}</p>
          </div>
        </div>

        <div className="mx-table-container">
          <table className="mx-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Account</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center' }}>Type</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {accruals.map((accrual) => (
                <tr key={accrual.id}>
                  <td>{accrual.date}</td>
                  <td style={{ color: '#2D2926', fontWeight: 500 }}>{accrual.description}</td>
                  <td>{accrual.account}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#2D2926' }}>{formatCurrency(accrual.amount)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <Tag variant={accrual.type === "Auto" ? "processing" : "default"}>{accrual.type}</Tag>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <Tag variant={statusVariant[accrual.status]}>{accrual.status}</Tag>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {accrual.status === "Active" && (
                      <Button variant="text" size="sm">Reverse</Button>
                    )}
                    {accrual.status === "Pending" && (
                      <Button variant="text" size="sm">Review</Button>
                    )}
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

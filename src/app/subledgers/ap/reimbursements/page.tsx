"use client";

import { useState } from "react";
import { DollarSign, CheckCircle, Clock, CreditCard } from "lucide-react";
import { Tag } from "@/components/ui";

interface Reimbursement {
  id: string;
  date: string;
  employee: string;
  category: string;
  amount: number;
  status: "Submitted" | "Approved" | "Paid" | "Rejected";
  description: string;
}

const mockReimbursements: Reimbursement[] = [
  { id: "RMB-001", date: "2026-03-10", employee: "Sarah Chen", category: "Travel", amount: 1245.80, status: "Submitted", description: "Client site visit - airfare and hotel" },
  { id: "RMB-002", date: "2026-03-08", employee: "Mike Johnson", category: "Meals", amount: 187.50, status: "Approved", description: "Team dinner - Q1 celebration" },
  { id: "RMB-003", date: "2026-03-06", employee: "Emily Rodriguez", category: "Software", amount: 49.99, status: "Paid", description: "Notion personal plan upgrade" },
  { id: "RMB-004", date: "2026-03-05", employee: "James Park", category: "Office Supplies", amount: 234.00, status: "Paid", description: "Ergonomic keyboard and mouse" },
  { id: "RMB-005", date: "2026-03-04", employee: "Lisa Wang", category: "Travel", amount: 892.30, status: "Approved", description: "Conference registration and travel" },
  { id: "RMB-006", date: "2026-03-03", employee: "Robert Lee", category: "Meals", amount: 67.40, status: "Rejected", description: "Personal meal - no business purpose" },
  { id: "RMB-007", date: "2026-03-01", employee: "Sarah Chen", category: "Parking", amount: 45.00, status: "Paid", description: "Client meeting parking" },
];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

const statusVariant: Record<string, "warning" | "processing" | "success" | "error"> = {
  Submitted: "warning",
  Approved: "processing",
  Paid: "success",
  Rejected: "error",
};

export default function ReimbursementsPage() {
  const [reimbursements] = useState<Reimbursement[]>(mockReimbursements);

  const pendingAmount = reimbursements.filter((r) => r.status === "Submitted").reduce((s, r) => s + r.amount, 0);
  const approvedCount = reimbursements.filter((r) => r.status === "Approved").length;
  const paidThisMonth = reimbursements.filter((r) => r.status === "Paid").reduce((s, r) => s + r.amount, 0);

  return (
    <div style={{ padding: 24, background: '#f9f9f9' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Reimbursements</h1>
            <p className="mx-text-secondary mt-1">Track and manage employee reimbursement requests</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          <div className="mx-card" style={{ padding: 20 }}>
            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#fffbe9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} style={{ color: '#e8bf1b' }} />
              </div>
              <p className="mx-text-secondary" style={{ fontSize: 13 }}>Pending Amount</p>
            </div>
            <p style={{ fontSize: 24, fontWeight: 600, color: '#2D2926' }}>{formatCurrency(pendingAmount)}</p>
          </div>
          <div className="mx-card" style={{ padding: 20 }}>
            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#e8edeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={18} style={{ color: '#154738' }} />
              </div>
              <p className="mx-text-secondary" style={{ fontSize: 13 }}>Approved</p>
            </div>
            <p style={{ fontSize: 24, fontWeight: 600, color: '#2D2926' }}>{approvedCount}</p>
          </div>
          <div className="mx-card" style={{ padding: 20 }}>
            <div className="flex items-center gap-3 mb-2">
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#edfdec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={18} style={{ color: '#067f54' }} />
              </div>
              <p className="mx-text-secondary" style={{ fontSize: 13 }}>Paid This Month</p>
            </div>
            <p style={{ fontSize: 24, fontWeight: 600, color: '#2D2926' }}>{formatCurrency(paidThisMonth)}</p>
          </div>
        </div>

        <div className="mx-table-container">
          <table className="mx-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Employee</th>
                <th>Description</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {reimbursements.map((r) => (
                <tr key={r.id}>
                  <td>{r.date}</td>
                  <td style={{ color: '#2D2926', fontWeight: 500 }}>{r.employee}</td>
                  <td>{r.description}</td>
                  <td>{r.category}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#2D2926' }}>{formatCurrency(r.amount)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <Tag variant={statusVariant[r.status]}>{r.status}</Tag>
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

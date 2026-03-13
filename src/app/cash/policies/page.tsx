"use client";

import { Shield, Settings, Landmark, ArrowRightLeft, AlertTriangle, Clock } from "lucide-react";
import { Button, Tag } from "@/components/ui";

const policies = [
  {
    id: "CPOL-001",
    name: "Bank Reconciliation Frequency",
    description: "All bank accounts must be reconciled weekly. Accounts with high transaction volume (100+ per week) should be reconciled daily.",
    category: "Reconciliation",
    status: "Active",
    lastUpdated: "01-10-2026",
    approvedBy: "Sarah Chen",
  },
  {
    id: "CPOL-002",
    name: "Cash Variance Threshold",
    description: "Reconciliation variances exceeding $500 must be investigated and documented within 48 hours. Variances over $5,000 require controller review.",
    category: "Controls",
    status: "Active",
    lastUpdated: "01-10-2026",
    approvedBy: "Sarah Chen",
  },
  {
    id: "CPOL-003",
    name: "Intercompany Transfer Approval",
    description: "Intercompany cash transfers above $25,000 require dual approval. All transfers must be documented with supporting business justification.",
    category: "Transfers",
    status: "Active",
    lastUpdated: "02-15-2026",
    approvedBy: "Michael Torres",
  },
  {
    id: "CPOL-004",
    name: "Stale-Dated Check Policy",
    description: "Outstanding checks older than 90 days are flagged for review. Checks older than 180 days are candidates for voiding and re-issuance.",
    category: "Controls",
    status: "Draft",
    lastUpdated: "03-05-2026",
    approvedBy: "—",
  },
  {
    id: "CPOL-005",
    name: "Petty Cash Management",
    description: "Petty cash funds are limited to $500 per location. Replenishment requires receipts for all disbursements and manager approval.",
    category: "Controls",
    status: "Active",
    lastUpdated: "12-01-2025",
    approvedBy: "Michael Torres",
  },
];

const categories = [
  { icon: Landmark, label: "Reconciliation", count: 1 },
  { icon: AlertTriangle, label: "Controls", count: 3 },
  { icon: ArrowRightLeft, label: "Transfers", count: 1 },
];

export default function CashPoliciesPage() {
  return (
    <div style={{ padding: 24, background: "#f9f9f9" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Cash Policies</h1>
            <p className="mx-text-secondary mt-1">Manage cash handling, reconciliation, and transfer policies</p>
          </div>
          <Button size="sm">
            <Settings size={14} className="mr-1 inline" />
            Add Policy
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          {categories.map((cat) => (
            <div key={cat.label} className="mx-card" style={{ padding: 20 }}>
              <div className="flex items-center gap-2 mb-2">
                <cat.icon size={16} style={{ color: "var(--mx-primary)" }} />
                <span className="mx-text-secondary" style={{ fontSize: 14 }}>{cat.label}</span>
              </div>
              <p style={{ fontSize: 24, fontWeight: 600 }}>{cat.count}</p>
              <p className="mx-text-secondary" style={{ fontSize: 13 }}>
                {cat.count === 1 ? "policy" : "policies"}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {policies.map((policy) => (
            <div key={policy.id} className="mx-card" style={{ padding: 20 }}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield size={16} style={{ color: "var(--mx-primary)" }} />
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{policy.name}</span>
                    <Tag variant={policy.status === "Active" ? "success" : "default"}>{policy.status}</Tag>
                  </div>
                  <p className="mx-text-secondary" style={{ fontSize: 14, lineHeight: 1.5 }}>{policy.description}</p>
                  <div className="flex items-center gap-4 mt-3 mx-text-secondary" style={{ fontSize: 13 }}>
                    <span>Category: {policy.category}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> Updated: {policy.lastUpdated}</span>
                    <span>Approved by: {policy.approvedBy}</span>
                  </div>
                </div>
                <Button variant="text" size="sm">Edit</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

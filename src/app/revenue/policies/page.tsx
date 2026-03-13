"use client";

import { Shield, FileText, Clock, AlertTriangle, Settings, BookOpen } from "lucide-react";
import { Button, Tag } from "@/components/ui";

const policies = [
  {
    id: "POL-001",
    name: "Standard Revenue Recognition",
    description: "Default ASC 606 recognition policy for SaaS subscriptions. Revenue recognized ratably over the contract term using straight-line method.",
    category: "Revenue Recognition",
    status: "Active",
    lastUpdated: "01-15-2026",
    approvedBy: "Sarah Chen",
  },
  {
    id: "POL-002",
    name: "Professional Services Recognition",
    description: "Revenue recognized as services are delivered based on percentage of completion or milestone-based delivery.",
    category: "Revenue Recognition",
    status: "Active",
    lastUpdated: "01-15-2026",
    approvedBy: "Sarah Chen",
  },
  {
    id: "POL-003",
    name: "Credit Memo Approval Workflow",
    description: "Credit memos exceeding $5,000 require VP-level approval. All credit memos must include supporting documentation.",
    category: "Billing",
    status: "Active",
    lastUpdated: "02-01-2026",
    approvedBy: "Michael Torres",
  },
  {
    id: "POL-004",
    name: "Invoice Payment Terms",
    description: "Standard payment terms are Net 30. Enterprise contracts may negotiate Net 45 or Net 60 with CFO approval.",
    category: "Billing",
    status: "Active",
    lastUpdated: "12-01-2025",
    approvedBy: "Michael Torres",
  },
  {
    id: "POL-005",
    name: "Bad Debt Write-off Threshold",
    description: "Invoices past due by 180+ days with no payment activity are candidates for write-off. Requires controller approval.",
    category: "Collections",
    status: "Draft",
    lastUpdated: "03-01-2026",
    approvedBy: "—",
  },
];

const categories = [
  { icon: BookOpen, label: "Revenue Recognition", count: 2 },
  { icon: FileText, label: "Billing", count: 2 },
  { icon: Clock, label: "Collections", count: 1 },
];

export default function PoliciesPage() {
  return (
    <div style={{ padding: 24, background: "#f9f9f9" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Revenue Policies</h1>
            <p className="mx-text-secondary mt-1">Manage revenue recognition, billing, and collections policies</p>
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
              <p className="mx-text-secondary" style={{ fontSize: 13 }}>active policies</p>
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
                    <span>Updated: {policy.lastUpdated}</span>
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

"use client";

import { BookOpen, BarChart3, Calendar, FileCheck, AlertTriangle, Clock } from "lucide-react";
import { Button, Tag } from "@/components/ui";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

const recognitionData = [
  { id: "POB-001", contract: "CON-001", customer: "Acme Corp", obligation: "Platform License", total: 36000, recognized: 18000, remaining: 18000, method: "Straight-line", startDate: "01-01-2026", endDate: "12-31-2026", status: "In Progress" },
  { id: "POB-002", contract: "CON-001", customer: "Acme Corp", obligation: "Implementation Services", total: 12000, recognized: 12000, remaining: 0, method: "As Delivered", startDate: "01-01-2026", endDate: "03-31-2026", status: "Complete" },
  { id: "POB-003", contract: "CON-002", customer: "Beta Industries", obligation: "Annual Subscription", total: 24000, recognized: 6000, remaining: 18000, method: "Straight-line", startDate: "01-01-2026", endDate: "12-31-2026", status: "In Progress" },
  { id: "POB-004", contract: "CON-003", customer: "Gamma Solutions", obligation: "Support Package", total: 8400, recognized: 2100, remaining: 6300, method: "Straight-line", startDate: "01-01-2026", endDate: "12-31-2026", status: "In Progress" },
  { id: "POB-005", contract: "CON-004", customer: "Delta Tech", obligation: "Platform License", total: 48000, recognized: 0, remaining: 48000, method: "Straight-line", startDate: "04-01-2026", endDate: "03-31-2027", status: "Not Started" },
];

const stats = [
  { label: "Total Contract Value", value: fmt(128400), icon: BookOpen },
  { label: "Recognized YTD", value: fmt(38100), icon: BarChart3 },
  { label: "Deferred Revenue", value: fmt(90300), icon: Clock },
  { label: "Active Obligations", value: "5", icon: FileCheck },
];

function statusVariant(status: string): "success" | "warning" | "default" | "processing" {
  const map: Record<string, "success" | "warning" | "default" | "processing"> = {
    Complete: "success",
    "In Progress": "processing",
    "Not Started": "default",
  };
  return map[status] ?? "default";
}

export default function RecognitionPage() {
  return (
    <div style={{ padding: 24, background: "#f9f9f9" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Revenue Recognition</h1>
            <p className="mx-text-secondary mt-1">ASC 606 compliant revenue recognition schedules and performance obligations</p>
          </div>
          <Button size="sm">
            <Calendar size={14} className="mr-1 inline" />
            Run Recognition
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="mx-card" style={{ padding: 20 }}>
              <div className="flex items-center gap-2 mb-2">
                <s.icon size={16} style={{ color: "var(--mx-primary)" }} />
                <span className="mx-text-secondary" style={{ fontSize: 14 }}>{s.label}</span>
              </div>
              <p style={{ fontSize: 24, fontWeight: 600 }}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mx-card mb-6" style={{ padding: 20, display: "flex", alignItems: "center", gap: 12, borderLeft: "4px solid #e8bf1b" }}>
          <AlertTriangle size={20} style={{ color: "#e8bf1b", flexShrink: 0 }} />
          <div>
            <p style={{ fontWeight: 500, fontSize: 14 }}>Revenue Recognition Review Required</p>
            <p className="mx-text-secondary" style={{ fontSize: 13 }}>
              3 performance obligations have recognition schedules ending this quarter. Review and confirm recognition entries before period close.
            </p>
          </div>
        </div>

        <div className="mb-4">
          <h2 style={{ fontSize: 18, fontWeight: 500 }}>Performance Obligations</h2>
        </div>

        <div className="mx-table-container">
          <table className="mx-table">
            <thead>
              <tr>
                <th>POB ID</th>
                <th>Contract</th>
                <th>Customer</th>
                <th>Obligation</th>
                <th>Total Value</th>
                <th>Recognized</th>
                <th>Remaining</th>
                <th>Method</th>
                <th>Period</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recognitionData.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 500 }}>{r.id}</td>
                  <td style={{ color: "var(--mx-primary)" }}>{r.contract}</td>
                  <td>{r.customer}</td>
                  <td>{r.obligation}</td>
                  <td>{fmt(r.total)}</td>
                  <td style={{ color: "#067f54" }}>{fmt(r.recognized)}</td>
                  <td>{fmt(r.remaining)}</td>
                  <td className="mx-text-secondary">{r.method}</td>
                  <td className="mx-text-secondary">{r.startDate} — {r.endDate}</td>
                  <td>
                    <Tag variant={statusVariant(r.status)}>{r.status}</Tag>
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

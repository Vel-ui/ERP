"use client";

import { BarChart3, Download, Calendar, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button, Tag } from "@/components/ui";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(n);

const reports = [
  {
    name: "Cash Flow Statement",
    description: "Operating, investing, and financing activities for the period. Tracks sources and uses of cash.",
    lastGenerated: "03-01-2026",
    frequency: "Monthly",
    status: "Available",
  },
  {
    name: "Bank Reconciliation Summary",
    description: "Summary of reconciled vs. unreconciled items by bank account with variance analysis.",
    lastGenerated: "03-10-2026",
    frequency: "Weekly",
    status: "Available",
  },
  {
    name: "Cash Position Report",
    description: "Real-time view of cash balances across all bank accounts with projected inflows and outflows.",
    lastGenerated: "03-13-2026",
    frequency: "Daily",
    status: "Available",
  },
  {
    name: "Aged Cash Receipts",
    description: "Analysis of cash receipts aging by customer and invoice, highlighting collection trends.",
    lastGenerated: "02-28-2026",
    frequency: "Monthly",
    status: "Scheduled",
  },
  {
    name: "Intercompany Cash Transfers",
    description: "Summary of all intercompany transfers and eliminations for the period.",
    lastGenerated: "02-28-2026",
    frequency: "Monthly",
    status: "Available",
  },
];

const cashFlowSummary = [
  { category: "Operating Activities", inflows: 156000, outflows: -98500 },
  { category: "Investing Activities", inflows: 0, outflows: -25000 },
  { category: "Financing Activities", inflows: 50000, outflows: -12000 },
];

export default function CashReportingPage() {
  return (
    <div style={{ padding: 24, background: "#f9f9f9" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Cash Reporting</h1>
            <p className="mx-text-secondary mt-1">Generate and view cash management reports</p>
          </div>
          <Button size="sm">
            <Download size={14} className="mr-1 inline" />
            Export All
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          <div className="mx-card" style={{ padding: 20 }}>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} style={{ color: "var(--mx-primary)" }} />
              <span className="mx-text-secondary" style={{ fontSize: 14 }}>Net Cash Flow (MTD)</span>
            </div>
            <p style={{ fontSize: 24, fontWeight: 600, color: "#067f54" }}>{fmt(70500)}</p>
          </div>
          <div className="mx-card" style={{ padding: 20 }}>
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpRight size={16} style={{ color: "#067f54" }} />
              <span className="mx-text-secondary" style={{ fontSize: 14 }}>Total Inflows (MTD)</span>
            </div>
            <p style={{ fontSize: 24, fontWeight: 600 }}>{fmt(206000)}</p>
          </div>
          <div className="mx-card" style={{ padding: 20 }}>
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownRight size={16} style={{ color: "#f03c46" }} />
              <span className="mx-text-secondary" style={{ fontSize: 14 }}>Total Outflows (MTD)</span>
            </div>
            <p style={{ fontSize: 24, fontWeight: 600 }}>{fmt(135500)}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Cash Flow Summary</h2>
          <div className="mx-table-container">
            <table className="mx-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th style={{ textAlign: "right" }}>Inflows</th>
                  <th style={{ textAlign: "right" }}>Outflows</th>
                  <th style={{ textAlign: "right" }}>Net</th>
                </tr>
              </thead>
              <tbody>
                {cashFlowSummary.map((row) => (
                  <tr key={row.category}>
                    <td style={{ fontWeight: 500 }}>{row.category}</td>
                    <td style={{ textAlign: "right", color: "#067f54" }}>{fmt(row.inflows)}</td>
                    <td style={{ textAlign: "right", color: "#f03c46" }}>{fmt(row.outflows)}</td>
                    <td style={{ textAlign: "right", fontWeight: 600, color: row.inflows + row.outflows >= 0 ? "#067f54" : "#f03c46" }}>
                      {fmt(row.inflows + row.outflows)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td style={{ fontWeight: 600 }}>Total</td>
                  <td style={{ textAlign: "right", fontWeight: 600, color: "#067f54" }}>
                    {fmt(cashFlowSummary.reduce((s, r) => s + r.inflows, 0))}
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 600, color: "#f03c46" }}>
                    {fmt(cashFlowSummary.reduce((s, r) => s + r.outflows, 0))}
                  </td>
                  <td style={{ textAlign: "right", fontWeight: 600, color: "var(--mx-primary)" }}>
                    {fmt(cashFlowSummary.reduce((s, r) => s + r.inflows + r.outflows, 0))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Available Reports</h2>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.name} className="mx-card" style={{ padding: 20 }}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <BarChart3 size={16} style={{ color: "var(--mx-primary)" }} />
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{report.name}</span>
                      <Tag variant={report.status === "Available" ? "success" : "processing"}>{report.status}</Tag>
                    </div>
                    <p className="mx-text-secondary" style={{ fontSize: 14, lineHeight: 1.5 }}>{report.description}</p>
                    <div className="flex items-center gap-4 mt-3 mx-text-secondary" style={{ fontSize: 13 }}>
                      <span className="flex items-center gap-1"><Calendar size={12} /> Last generated: {report.lastGenerated}</span>
                      <span className="flex items-center gap-1"><TrendingUp size={12} /> Frequency: {report.frequency}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm">
                      <Download size={14} className="mr-1 inline" /> Export
                    </Button>
                    <Button variant="text" size="sm">Generate</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

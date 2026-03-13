"use client";

import { useState, useMemo } from "react";
import { Button, Select } from "@/components/ui";

interface VatLine {
  id: string;
  section: "revenue" | "expense";
  subSection?: string;
  category?: string;
  description: string;
  net: number;
  vatRate: number;
  vatAmount: number;
  total: number;
}

const MOCK_DATA: VatLine[] = [
  { id: "r1", section: "revenue", subSection: "Invoices", description: "Enterprise SaaS License — Q1", net: 120000, vatRate: 20, vatAmount: 24000, total: 144000 },
  { id: "r2", section: "revenue", subSection: "Invoices", description: "Professional Services — March", net: 45000, vatRate: 20, vatAmount: 9000, total: 54000 },
  { id: "r3", section: "revenue", subSection: "Invoices", description: "API Usage Fees — March", net: 18500, vatRate: 20, vatAmount: 3700, total: 22200 },
  { id: "r4", section: "revenue", subSection: "Invoices", description: "Training & Onboarding", net: 8200, vatRate: 20, vatAmount: 1640, total: 9840 },
  { id: "r5", section: "revenue", subSection: "Credit Memos", description: "Service Credit — Acme Corp", net: -2500, vatRate: 20, vatAmount: -500, total: -3000 },
  { id: "r6", section: "revenue", subSection: "Credit Memos", description: "Billing Adjustment — GlobalTech", net: -1200, vatRate: 20, vatAmount: -240, total: -1440 },

  { id: "e1", section: "expense", category: "Cloud & Infrastructure", description: "AWS Hosting — March", net: 8200, vatRate: 20, vatAmount: 1640, total: 9840 },
  { id: "e2", section: "expense", category: "Cloud & Infrastructure", description: "Google Cloud Platform", net: 3400, vatRate: 20, vatAmount: 680, total: 4080 },
  { id: "e3", section: "expense", category: "Cloud & Infrastructure", description: "Cloudflare CDN", net: 950, vatRate: 20, vatAmount: 190, total: 1140 },
  { id: "e4", section: "expense", category: "Software & Tools", description: "Figma Design Tools", net: 1200, vatRate: 20, vatAmount: 240, total: 1440 },
  { id: "e5", section: "expense", category: "Software & Tools", description: "Notion Workspace", net: 680, vatRate: 20, vatAmount: 136, total: 816 },
  { id: "e6", section: "expense", category: "Software & Tools", description: "HubSpot CRM", net: 5800, vatRate: 20, vatAmount: 1160, total: 6960 },
  { id: "e7", section: "expense", category: "Professional Services", description: "Legal Advisory — Q1", net: 12000, vatRate: 20, vatAmount: 2400, total: 14400 },
  { id: "e8", section: "expense", category: "Professional Services", description: "External Audit Fees", net: 8500, vatRate: 0, vatAmount: 0, total: 8500 },
  { id: "e9", section: "expense", category: "Office & Facilities", description: "Office Supplies", net: 2200, vatRate: 20, vatAmount: 440, total: 2640 },
  { id: "e10", section: "expense", category: "Office & Facilities", description: "Rent (exempt)", net: 15000, vatRate: 0, vatAmount: 0, total: 15000 },
];

const PERIOD_OPTIONS = [
  { value: "2025-q1", label: "Q1 2025" },
  { value: "2025-q2", label: "Q2 2025" },
  { value: "2025-03", label: "March 2025" },
  { value: "2025-02", label: "February 2025" },
  { value: "2025-01", label: "January 2025" },
];

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

export default function VatReportPage() {
  const [period, setPeriod] = useState("2025-q1");

  const revenue = MOCK_DATA.filter((d) => d.section === "revenue");
  const expenses = MOCK_DATA.filter((d) => d.section === "expense");

  const revenueBySubSection = useMemo(() => {
    const groups: Record<string, VatLine[]> = {};
    for (const r of revenue) {
      const key = r.subSection || "Other";
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    }
    return groups;
  }, []);

  const expenseByCategory = useMemo(() => {
    const groups: Record<string, VatLine[]> = {};
    for (const e of expenses) {
      const key = e.category || "Other";
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    }
    return groups;
  }, []);

  const revTotals = {
    net: revenue.reduce((s, r) => s + r.net, 0),
    vat: revenue.reduce((s, r) => s + r.vatAmount, 0),
    total: revenue.reduce((s, r) => s + r.total, 0),
  };

  const expTotals = {
    net: expenses.reduce((s, r) => s + r.net, 0),
    vat: expenses.reduce((s, r) => s + r.vatAmount, 0),
    total: expenses.reduce((s, r) => s + r.total, 0),
  };

  const netVat = revTotals.vat - expTotals.vat;

  const renderTable = (lines: VatLine[]) => (
    <table className="mx-table">
      <thead>
        <tr>
          <th className="text-left">Description</th>
          <th className="text-right">Net</th>
          <th className="text-right">VAT Rate</th>
          <th className="text-right">VAT Amount</th>
          <th className="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        {lines.map((line) => (
          <tr key={line.id}>
            <td>{line.description}</td>
            <td className={`text-right ${line.net < 0 ? "text-red-400" : ""}`}>
              {fmt(line.net)}
            </td>
            <td className="text-right mx-text-secondary">{line.vatRate}%</td>
            <td className={`text-right ${line.vatAmount < 0 ? "text-red-400" : ""}`}>
              {fmt(line.vatAmount)}
            </td>
            <td className={`text-right font-medium ${line.total < 0 ? "text-red-400" : ""}`}>
              {fmt(line.total)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mx-h1">VAT Report</h1>
          <p className="mt-1 mx-text-secondary">Output VAT on revenue and input VAT on expenses</p>
        </div>
        <Button variant="default">Export</Button>
      </div>

      <div className="flex items-end gap-4">
        <div className="w-48">
          <Select label="Period" options={PERIOD_OPTIONS} value={period} onChange={(e) => setPeriod(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Output VAT (Revenue)", value: fmt(revTotals.vat) },
          { label: "Input VAT (Expenses)", value: fmt(expTotals.vat) },
          { label: "Net VAT Payable", value: fmt(netVat), color: netVat > 0 ? "text-red-400" : "text-emerald-400" },
          { label: "Total Transactions", value: MOCK_DATA.length.toString() },
        ].map((c) => (
          <div key={c.label} className="mx-card mx-card-white">
            <p className="text-sm mx-text-secondary">{c.label}</p>
            <p className={`mt-1 text-xl font-semibold ${c.color || ""}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-3 mx-h3">Revenue</h2>
        {Object.entries(revenueBySubSection).map(([sub, lines]) => (
          <div key={sub} className="mb-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-medium mx-text-secondary">
              {sub}
              <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: 'var(--mx-bg-layout)' }}>{lines.length}</span>
            </h3>
            <div className="mx-table-container">
              {renderTable(lines)}
            </div>
          </div>
        ))}
        <div className="flex justify-end gap-8 rounded-lg border border-border px-4 py-3 text-sm font-semibold" style={{ background: 'var(--mx-bg-card)' }}>
          <span className="mx-text-secondary">Revenue Total:</span>
          <span>Net {fmt(revTotals.net)}</span>
          <span>VAT {fmt(revTotals.vat)}</span>
          <span>Total {fmt(revTotals.total)}</span>
        </div>
      </div>

      <div>
        <h2 className="mb-3 mx-h3">Expenses</h2>
        {Object.entries(expenseByCategory).map(([cat, lines]) => (
          <div key={cat} className="mb-4">
            <h3 className="mb-2 flex items-center gap-2 text-sm font-medium mx-text-secondary">
              {cat}
              <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: 'var(--mx-bg-layout)' }}>{lines.length}</span>
            </h3>
            <div className="mx-table-container">
              {renderTable(lines)}
            </div>
          </div>
        ))}
        <div className="flex justify-end gap-8 rounded-lg border border-border px-4 py-3 text-sm font-semibold" style={{ background: 'var(--mx-bg-card)' }}>
          <span className="mx-text-secondary">Expense Total:</span>
          <span>Net {fmt(expTotals.net)}</span>
          <span>VAT {fmt(expTotals.vat)}</span>
          <span>Total {fmt(expTotals.total)}</span>
        </div>
      </div>
    </div>
  );
}

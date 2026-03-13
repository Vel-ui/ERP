"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button, Input, Select } from "@/components/ui";
import { Tag } from "@/components/ui";
import { Download, GitBranch } from "lucide-react";

interface MappingRow {
  id: string;
  sourceSystem: string;
  sourceAccount: string;
  sourceAccountName: string;
  maximorAccount: string;
  maximorAccountName: string;
  status: "Mapped" | "Unmapped" | "Review";
}

const MOCK_MAPPINGS: MappingRow[] = [
  { id: "MAP-001", sourceSystem: "NetSuite", sourceAccount: "1000", sourceAccountName: "Cash - Operating", maximorAccount: "1000", maximorAccountName: "Cash & Equivalents", status: "Mapped" },
  { id: "MAP-002", sourceSystem: "NetSuite", sourceAccount: "1200", sourceAccountName: "Accounts Receivable", maximorAccount: "1200", maximorAccountName: "Accounts Receivable", status: "Mapped" },
  { id: "MAP-003", sourceSystem: "NetSuite", sourceAccount: "2000", sourceAccountName: "Accounts Payable", maximorAccount: "2000", maximorAccountName: "Accounts Payable", status: "Mapped" },
  { id: "MAP-004", sourceSystem: "Stripe", sourceAccount: "REV-001", sourceAccountName: "Subscription Revenue", maximorAccount: "4100", maximorAccountName: "Subscription Revenue", status: "Mapped" },
  { id: "MAP-005", sourceSystem: "Stripe", sourceAccount: "REV-002", sourceAccountName: "One-Time Revenue", maximorAccount: "4200", maximorAccountName: "Services Revenue", status: "Review" },
  { id: "MAP-006", sourceSystem: "Stripe", sourceAccount: "FEE-001", sourceAccountName: "Processing Fees", maximorAccount: "6100", maximorAccountName: "Payment Processing Fees", status: "Mapped" },
  { id: "MAP-007", sourceSystem: "Gusto", sourceAccount: "PAY-SAL", sourceAccountName: "Salaries & Wages", maximorAccount: "6200", maximorAccountName: "Salaries & Wages", status: "Mapped" },
  { id: "MAP-008", sourceSystem: "Gusto", sourceAccount: "PAY-TAX", sourceAccountName: "Payroll Taxes", maximorAccount: "6210", maximorAccountName: "Payroll Tax Expense", status: "Mapped" },
  { id: "MAP-009", sourceSystem: "Gusto", sourceAccount: "PAY-BEN", sourceAccountName: "Benefits", maximorAccount: "", maximorAccountName: "", status: "Unmapped" },
  { id: "MAP-010", sourceSystem: "Ramp", sourceAccount: "EXP-SWR", sourceAccountName: "Software & SaaS", maximorAccount: "6300", maximorAccountName: "Software Subscriptions", status: "Mapped" },
  { id: "MAP-011", sourceSystem: "Ramp", sourceAccount: "EXP-TRV", sourceAccountName: "Travel", maximorAccount: "6400", maximorAccountName: "Travel & Entertainment", status: "Review" },
  { id: "MAP-012", sourceSystem: "Ramp", sourceAccount: "EXP-MKT", sourceAccountName: "Marketing Spend", maximorAccount: "", maximorAccountName: "", status: "Unmapped" },
  { id: "MAP-013", sourceSystem: "Chase", sourceAccount: "BNK-CHK", sourceAccountName: "Checking ••4521", maximorAccount: "1010", maximorAccountName: "Chase Operating", status: "Mapped" },
  { id: "MAP-014", sourceSystem: "Chase", sourceAccount: "BNK-SAV", sourceAccountName: "Savings ••7890", maximorAccount: "1020", maximorAccountName: "Chase Savings", status: "Mapped" },
  { id: "MAP-015", sourceSystem: "Salesforce", sourceAccount: "CRM-REV", sourceAccountName: "Closed Won Deals", maximorAccount: "", maximorAccountName: "", status: "Unmapped" },
];

const SYSTEMS = [
  { value: "all", label: "All Systems" },
  { value: "NetSuite", label: "NetSuite" },
  { value: "Stripe", label: "Stripe" },
  { value: "Gusto", label: "Gusto" },
  { value: "Ramp", label: "Ramp" },
  { value: "Chase", label: "Chase" },
  { value: "Salesforce", label: "Salesforce" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "Mapped", label: "Mapped" },
  { value: "Unmapped", label: "Unmapped" },
  { value: "Review", label: "Needs Review" },
];

function statusTagVariant(status: string): "success" | "error" | "warning" {
  if (status === "Mapped") return "success";
  if (status === "Unmapped") return "error";
  return "warning";
}

export default function MappingPage() {
  const [search, setSearch] = useState("");
  const [system, setSystem] = useState("all");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    let rows = MOCK_MAPPINGS;
    if (system !== "all") rows = rows.filter((r) => r.sourceSystem === system);
    if (status !== "all") rows = rows.filter((r) => r.status === status);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.sourceAccountName.toLowerCase().includes(q) ||
          r.maximorAccountName.toLowerCase().includes(q) ||
          r.sourceAccount.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [search, system, status]);

  const counts = {
    mapped: MOCK_MAPPINGS.filter((m) => m.status === "Mapped").length,
    unmapped: MOCK_MAPPINGS.filter((m) => m.status === "Unmapped").length,
    review: MOCK_MAPPINGS.filter((m) => m.status === "Review").length,
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <Link href="/central-data-hub" className="hover:text-foreground">Central Data Hub</Link>
          <span>/</span>
          <span className="text-foreground">Mapping</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mx-h1">Account Mapping</h1>
            <p className="mx-text-secondary mt-1">Map source system accounts to the Maximor chart of accounts</p>
          </div>
          <Button variant="default" size="sm">
            <Download size={14} className="mr-1.5 inline" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-xs text-muted">Mapped</p>
          <p className="text-2xl font-semibold text-green-600">{counts.mapped}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-xs text-muted">Unmapped</p>
          <p className="text-2xl font-semibold text-red-500">{counts.unmapped}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <p className="text-xs text-muted">Needs Review</p>
          <p className="text-2xl font-semibold text-amber-500">{counts.review}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="w-64">
          <Input placeholder="Search accounts…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="w-44">
          <Select label="Source System" options={SYSTEMS} value={system} onChange={(e) => setSystem(e.target.value)} />
        </div>
        <div className="w-44">
          <Select label="Status" options={STATUS_OPTIONS} value={status} onChange={(e) => setStatus(e.target.value)} />
        </div>
      </div>

      <div className="mx-table-container rounded-lg border border-border overflow-hidden">
        <table className="mx-table w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-sidebar">
              <th className="px-4 py-3 text-left font-medium text-muted">Source System</th>
              <th className="px-4 py-3 text-left font-medium text-muted">Source Account</th>
              <th className="px-4 py-3 text-center font-medium text-muted">
                <GitBranch size={14} className="inline" />
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted">Maximor Account</th>
              <th className="px-4 py-3 text-center font-medium text-muted">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-0 hover:bg-sidebar-hover transition-colors">
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-full bg-sidebar px-2 py-0.5 text-xs font-medium text-muted">
                    {row.sourceSystem}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-foreground font-medium">{row.sourceAccount}</p>
                  <p className="text-xs text-muted">{row.sourceAccountName}</p>
                </td>
                <td className="px-4 py-3 text-center text-muted">→</td>
                <td className="px-4 py-3">
                  {row.maximorAccount ? (
                    <>
                      <p className="text-foreground font-medium">{row.maximorAccount}</p>
                      <p className="text-xs text-muted">{row.maximorAccountName}</p>
                    </>
                  ) : (
                    <span className="text-xs text-muted italic">Not mapped</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <Tag variant={statusTagVariant(row.status)}>{row.status}</Tag>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted">No mappings match your filters</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-muted">
        Showing {filtered.length} of {MOCK_MAPPINGS.length} mappings
      </div>
    </div>
  );
}

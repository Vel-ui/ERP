"use client";

import { useState, useMemo } from "react";
import { Button, Select, Input } from "@/components/ui";

type TransactionType = "invoices" | "bills" | "journal-entries" | "payments" | "credit-memos";

interface ColumnDef {
  key: string;
  label: string;
  align?: "left" | "right";
}

const COLUMN_MAP: Record<TransactionType, ColumnDef[]> = {
  invoices: [
    { key: "number", label: "Invoice #" },
    { key: "customer", label: "Customer" },
    { key: "date", label: "Date" },
    { key: "dueDate", label: "Due Date" },
    { key: "account", label: "Account" },
    { key: "department", label: "Department" },
    { key: "amount", label: "Amount", align: "right" },
    { key: "status", label: "Status" },
  ],
  bills: [
    { key: "number", label: "Bill #" },
    { key: "vendor", label: "Vendor" },
    { key: "date", label: "Date" },
    { key: "dueDate", label: "Due Date" },
    { key: "account", label: "Account" },
    { key: "department", label: "Department" },
    { key: "amount", label: "Amount", align: "right" },
    { key: "status", label: "Status" },
  ],
  "journal-entries": [
    { key: "number", label: "JE #" },
    { key: "date", label: "Date" },
    { key: "memo", label: "Memo" },
    { key: "account", label: "Account" },
    { key: "debit", label: "Debit", align: "right" },
    { key: "credit", label: "Credit", align: "right" },
    { key: "status", label: "Status" },
  ],
  payments: [
    { key: "number", label: "Payment #" },
    { key: "entity", label: "Customer/Vendor" },
    { key: "date", label: "Date" },
    { key: "method", label: "Method" },
    { key: "account", label: "Account" },
    { key: "amount", label: "Amount", align: "right" },
    { key: "status", label: "Status" },
  ],
  "credit-memos": [
    { key: "number", label: "CM #" },
    { key: "customer", label: "Customer" },
    { key: "date", label: "Date" },
    { key: "reason", label: "Reason" },
    { key: "account", label: "Account" },
    { key: "amount", label: "Amount", align: "right" },
    { key: "status", label: "Status" },
  ],
};

type TxRecord = Record<string, string | number>;

const MOCK_INVOICES: TxRecord[] = [
  { number: "INV-1041", customer: "Acme Corp", date: "2025-03-01", dueDate: "2025-03-31", account: "4000 - Revenue", department: "Sales", amount: 15000, status: "Paid" },
  { number: "INV-1042", customer: "GlobalTech", date: "2025-03-05", dueDate: "2025-04-04", account: "4000 - Revenue", department: "Sales", amount: 28500, status: "Open" },
  { number: "INV-1043", customer: "Initech", date: "2025-03-08", dueDate: "2025-04-07", account: "4100 - Services", department: "CS", amount: 9200, status: "Paid" },
  { number: "INV-1044", customer: "Wayne Enterprises", date: "2025-03-10", dueDate: "2025-04-09", account: "4000 - Revenue", department: "Sales", amount: 42000, status: "Overdue" },
  { number: "INV-1045", customer: "Stark Industries", date: "2025-03-12", dueDate: "2025-04-11", account: "4100 - Services", department: "Partnerships", amount: 18700, status: "Open" },
  { number: "INV-1046", customer: "Umbrella Corp", date: "2025-03-15", dueDate: "2025-04-14", account: "4200 - Licensing", department: "Sales", amount: 7500, status: "Draft" },
  { number: "INV-1047", customer: "Cyberdyne Systems", date: "2025-03-18", dueDate: "2025-04-17", account: "4000 - Revenue", department: "CS", amount: 33000, status: "Paid" },
  { number: "INV-1048", customer: "Aperture Science", date: "2025-03-20", dueDate: "2025-04-19", account: "4100 - Services", department: "Engineering", amount: 12400, status: "Open" },
  { number: "INV-1049", customer: "Oscorp", date: "2025-03-22", dueDate: "2025-04-21", account: "4000 - Revenue", department: "Sales", amount: 56000, status: "Paid" },
  { number: "INV-1050", customer: "Hooli", date: "2025-03-25", dueDate: "2025-04-24", account: "4200 - Licensing", department: "Partnerships", amount: 21000, status: "Open" },
  { number: "INV-1051", customer: "Massive Dynamic", date: "2025-03-28", dueDate: "2025-04-27", account: "4000 - Revenue", department: "Sales", amount: 8900, status: "Void" },
];

const MOCK_BILLS: TxRecord[] = [
  { number: "BILL-401", vendor: "AWS", date: "2025-03-01", dueDate: "2025-03-31", account: "6100 - Cloud", department: "Engineering", amount: 8200, status: "Paid" },
  { number: "BILL-402", vendor: "Stripe", date: "2025-03-03", dueDate: "2025-04-02", account: "6200 - Payment Proc.", department: "Finance", amount: 3400, status: "Open" },
  { number: "BILL-403", vendor: "HubSpot", date: "2025-03-05", dueDate: "2025-04-04", account: "6300 - Marketing SaaS", department: "Marketing", amount: 5800, status: "Paid" },
  { number: "BILL-404", vendor: "WeWork", date: "2025-03-07", dueDate: "2025-04-06", account: "6400 - Rent", department: "Operations", amount: 12000, status: "Open" },
  { number: "BILL-405", vendor: "Gusto", date: "2025-03-10", dueDate: "2025-04-09", account: "6500 - Payroll Svc", department: "HR", amount: 2100, status: "Paid" },
  { number: "BILL-406", vendor: "Figma", date: "2025-03-12", dueDate: "2025-04-11", account: "6100 - Cloud", department: "Design", amount: 1200, status: "Open" },
  { number: "BILL-407", vendor: "Cloudflare", date: "2025-03-15", dueDate: "2025-04-14", account: "6100 - Cloud", department: "Engineering", amount: 950, status: "Paid" },
  { number: "BILL-408", vendor: "Notion", date: "2025-03-18", dueDate: "2025-04-17", account: "6600 - Software", department: "Operations", amount: 680, status: "Draft" },
  { number: "BILL-409", vendor: "Deel", date: "2025-03-20", dueDate: "2025-04-19", account: "6500 - Payroll Svc", department: "HR", amount: 4500, status: "Open" },
  { number: "BILL-410", vendor: "Google Cloud", date: "2025-03-22", dueDate: "2025-04-21", account: "6100 - Cloud", department: "Engineering", amount: 6700, status: "Paid" },
];

const MOCK_JE: TxRecord[] = [
  { number: "JE-201", date: "2025-03-01", memo: "Monthly depreciation", account: "1500 - Accum. Depr.", debit: 0, credit: 4500, status: "Posted" },
  { number: "JE-201", date: "2025-03-01", memo: "Monthly depreciation", account: "6700 - Depreciation", debit: 4500, credit: 0, status: "Posted" },
  { number: "JE-202", date: "2025-03-05", memo: "Prepaid amortization", account: "1400 - Prepaids", debit: 0, credit: 2200, status: "Posted" },
  { number: "JE-202", date: "2025-03-05", memo: "Prepaid amortization", account: "6300 - Insurance", debit: 2200, credit: 0, status: "Posted" },
  { number: "JE-203", date: "2025-03-10", memo: "Accrued salaries", account: "2100 - Accrued Liab.", debit: 0, credit: 35000, status: "Posted" },
  { number: "JE-203", date: "2025-03-10", memo: "Accrued salaries", account: "6800 - Salaries", debit: 35000, credit: 0, status: "Posted" },
  { number: "JE-204", date: "2025-03-15", memo: "Revenue recognition", account: "2200 - Deferred Rev.", debit: 18000, credit: 0, status: "Draft" },
  { number: "JE-204", date: "2025-03-15", memo: "Revenue recognition", account: "4000 - Revenue", debit: 0, credit: 18000, status: "Draft" },
  { number: "JE-205", date: "2025-03-20", memo: "FX revaluation", account: "7000 - FX Gain/Loss", debit: 1200, credit: 0, status: "Posted" },
  { number: "JE-205", date: "2025-03-20", memo: "FX revaluation", account: "1100 - Cash (EUR)", debit: 0, credit: 1200, status: "Posted" },
];

const MOCK_PAYMENTS: TxRecord[] = [
  { number: "PAY-301", entity: "Acme Corp", date: "2025-03-05", method: "ACH", account: "1000 - Cash", amount: 15000, status: "Cleared" },
  { number: "PAY-302", entity: "GlobalTech", date: "2025-03-10", method: "Wire", account: "1000 - Cash", amount: 28500, status: "Pending" },
  { number: "PAY-303", entity: "AWS", date: "2025-03-12", method: "ACH", account: "1000 - Cash", amount: 8200, status: "Cleared" },
  { number: "PAY-304", entity: "Stripe", date: "2025-03-15", method: "Credit Card", account: "1000 - Cash", amount: 3400, status: "Cleared" },
  { number: "PAY-305", entity: "Initech", date: "2025-03-18", method: "Check", account: "1000 - Cash", amount: 9200, status: "Cleared" },
  { number: "PAY-306", entity: "WeWork", date: "2025-03-20", method: "ACH", account: "1000 - Cash", amount: 12000, status: "Pending" },
  { number: "PAY-307", entity: "Cyberdyne Systems", date: "2025-03-22", method: "Wire", account: "1000 - Cash", amount: 33000, status: "Cleared" },
  { number: "PAY-308", entity: "HubSpot", date: "2025-03-25", method: "ACH", account: "1000 - Cash", amount: 5800, status: "Cleared" },
  { number: "PAY-309", entity: "Oscorp", date: "2025-03-28", method: "Wire", account: "1000 - Cash", amount: 56000, status: "Pending" },
  { number: "PAY-310", entity: "Gusto", date: "2025-03-30", method: "ACH", account: "1000 - Cash", amount: 2100, status: "Cleared" },
];

const MOCK_CM: TxRecord[] = [
  { number: "CM-101", customer: "Acme Corp", date: "2025-03-05", reason: "Service credit", account: "4000 - Revenue", amount: 2500, status: "Applied" },
  { number: "CM-102", customer: "GlobalTech", date: "2025-03-12", reason: "Billing error", account: "4000 - Revenue", amount: 1200, status: "Applied" },
  { number: "CM-103", customer: "Hooli", date: "2025-03-18", reason: "Early termination", account: "4100 - Services", amount: 5000, status: "Open" },
  { number: "CM-104", customer: "Wayne Enterprises", date: "2025-03-22", reason: "Volume discount", account: "4000 - Revenue", amount: 3800, status: "Applied" },
  { number: "CM-105", customer: "Initech", date: "2025-03-28", reason: "SLA breach", account: "4100 - Services", amount: 1500, status: "Draft" },
];

const DATA_MAP: Record<TransactionType, TxRecord[]> = {
  invoices: MOCK_INVOICES,
  bills: MOCK_BILLS,
  "journal-entries": MOCK_JE,
  payments: MOCK_PAYMENTS,
  "credit-memos": MOCK_CM,
};

const TYPE_OPTIONS = [
  { value: "invoices", label: "Invoices" },
  { value: "bills", label: "Bills" },
  { value: "journal-entries", label: "Journal Entries" },
  { value: "payments", label: "Payments" },
  { value: "credit-memos", label: "Credit Memos" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "open", label: "Open" },
  { value: "paid", label: "Paid" },
  { value: "posted", label: "Posted" },
  { value: "draft", label: "Draft" },
  { value: "cleared", label: "Cleared" },
  { value: "pending", label: "Pending" },
];

const GROUPING_OPTIONS = [
  { value: "none", label: "No Grouping" },
  { value: "department", label: "Department" },
  { value: "account", label: "Account" },
  { value: "status", label: "Status" },
];

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 });

const statusBadge = (status: string) => {
  const s = String(status).toLowerCase();
  const map: Record<string, string> = {
    paid: "mx-tag mx-tag-success",
    posted: "mx-tag mx-tag-success",
    cleared: "mx-tag mx-tag-success",
    applied: "mx-tag mx-tag-success",
    open: "mx-tag mx-tag-processing",
    pending: "mx-tag mx-tag-warning",
    draft: "mx-tag",
    overdue: "mx-tag mx-tag-error",
    void: "mx-tag mx-tag-error",
  };
  return map[s] || "mx-tag";
};

export default function DataLabPage() {
  const [txType, setTxType] = useState<TransactionType>("invoices");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [grouping, setGrouping] = useState("none");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const columns = COLUMN_MAP[txType];
  const rawData = DATA_MAP[txType];

  const filteredData = useMemo(() => {
    let data = [...rawData];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(q)));
    }
    if (statusFilter !== "all") {
      data = data.filter((r) => String(r.status).toLowerCase() === statusFilter);
    }
    if (dateFrom) {
      data = data.filter((r) => String(r.date) >= dateFrom);
    }
    if (dateTo) {
      data = data.filter((r) => String(r.date) <= dateTo);
    }
    return data;
  }, [rawData, search, statusFilter, dateFrom, dateTo]);

  const groupedData = useMemo(() => {
    if (grouping === "none") return { "": filteredData };
    const groups: Record<string, TxRecord[]> = {};
    for (const row of filteredData) {
      const key = String(row[grouping] || "Unassigned");
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    }
    return groups;
  }, [filteredData, grouping]);

  const totalAmount = filteredData.reduce((s, r) => {
    const amt = typeof r.amount === "number" ? r.amount : (typeof r.debit === "number" ? r.debit : 0);
    return s + amt;
  }, 0);

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mx-h1">Data Lab</h1>
          <p className="mt-1 mx-text-secondary">Explore and filter transaction data across all modules</p>
        </div>
        <Button variant="default">Export</Button>
      </div>

      <div className="mx-card mx-card-white">
        <div className="grid grid-cols-6 gap-4">
          <Select
            label="Transaction Type"
            options={TYPE_OPTIONS}
            value={txType}
            onChange={(e) => setTxType(e.target.value as TransactionType)}
          />
          <Input
            label="Date From"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Input
            label="Date To"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          <Select
            label="Status"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Select
            label="Group By"
            options={GROUPING_OPTIONS}
            value={grouping}
            onChange={(e) => setGrouping(e.target.value)}
          />
          <Input
            label="Search"
            placeholder="Search transactions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="mx-card mx-card-white">
          <p className="text-sm mx-text-secondary">Total Records</p>
          <p className="mt-1 text-xl font-semibold">{filteredData.length}</p>
        </div>
        <div className="mx-card mx-card-white">
          <p className="text-sm mx-text-secondary">Total Amount</p>
          <p className="mt-1 text-xl font-semibold">{fmt(totalAmount)}</p>
        </div>
        <div className="mx-card mx-card-white">
          <p className="text-sm mx-text-secondary">Groups</p>
          <p className="mt-1 text-xl font-semibold">
            {grouping === "none" ? "—" : Object.keys(groupedData).length}
          </p>
        </div>
      </div>

      {Object.entries(groupedData).map(([group, rows]) => (
        <div key={group}>
          {group && grouping !== "none" && (
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-sm font-semibold">{group}</h3>
              <span className="rounded-full px-2 py-0.5 text-xs mx-text-secondary" style={{ background: 'var(--mx-bg-layout)' }}>{rows.length}</span>
            </div>
          )}
          <div className="mx-table-container">
            <table className="mx-table">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={col.align === "right" ? "text-right" : "text-left"}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center mx-text-secondary py-8">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  rows.map((row, ri) => (
                    <tr key={ri}>
                      {columns.map((col) => {
                        const val = row[col.key];
                        if (col.key === "status") {
                          return (
                            <td key={col.key}>
                              <span className={statusBadge(String(val))}>
                                {String(val)}
                              </span>
                            </td>
                          );
                        }
                        if (col.align === "right" && typeof val === "number") {
                          return (
                            <td key={col.key} className="text-right font-medium">
                              {fmt(val)}
                            </td>
                          );
                        }
                        return (
                          <td key={col.key} className={col.key === "number" ? "font-medium" : ""} style={col.key === "number" ? { color: 'var(--mx-primary)' } : undefined}>
                            {String(val ?? "—")}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

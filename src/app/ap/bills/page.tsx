"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button, Input, Select, Modal } from "@/components/ui";

/* ───────────────── Types ───────────────── */

interface Bill {
  id: string;
  billNumber: string;
  vendor: string;
  date: string;
  dueDate: string;
  amount: number;
  amountDue: number;
  status: "draft" | "unpaid" | "paid";
  currency: string;
}

/* ───────────────── Mock Data ───────────────── */

const initialBills: Bill[] = [
  { id: "B-001", billNumber: "INV-2048", vendor: "Amazon Web Services", date: "2026-03-01", dueDate: "2026-03-31", amount: 3200.0, amountDue: 3200.0, status: "unpaid", currency: "USD" },
  { id: "B-002", billNumber: "INV-2047", vendor: "Gusto Inc.", date: "2026-03-01", dueDate: "2026-03-16", amount: 48750.0, amountDue: 0, status: "paid", currency: "USD" },
  { id: "B-003", billNumber: "INV-2046", vendor: "WeWork", date: "2026-02-28", dueDate: "2026-03-30", amount: 12500.0, amountDue: 12500.0, status: "unpaid", currency: "USD" },
  { id: "B-004", billNumber: "INV-2045", vendor: "Google Cloud", date: "2026-02-25", dueDate: "2026-03-27", amount: 890.0, amountDue: 890.0, status: "unpaid", currency: "USD" },
  { id: "B-005", billNumber: "DRAFT-001", vendor: "Johnson Legal LLP", date: "2026-03-10", dueDate: "2026-04-24", amount: 7500.0, amountDue: 7500.0, status: "draft", currency: "USD" },
  { id: "B-006", billNumber: "INV-8821", vendor: "SaaS Tools GmbH", date: "2026-03-05", dueDate: "2026-04-04", amount: 2340.0, amountDue: 2340.0, status: "unpaid", currency: "EUR" },
];

/* ───────────────── Helpers ───────────────── */

function formatCurrency(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: "bg-zinc-500/15 text-zinc-400",
    unpaid: "bg-yellow-500/15 text-yellow-400",
    paid: "bg-green-500/15 text-green-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? "bg-sidebar text-muted"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

/* ───────────────── Actions Menu ───────────────── */

function ActionsMenu({ bill, onBillCredit, onPayExpense }: { bill: Bill; onBillCredit: (b: Bill) => void; onPayExpense: (b: Bill) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="rounded p-1 text-muted hover:bg-sidebar-hover hover:text-foreground"
      >
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <circle cx="10" cy="4" r="1.5" />
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="10" cy="16" r="1.5" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-48 rounded-md border border-border bg-background py-1 shadow-lg">
          <button
            onClick={() => { onBillCredit(bill); setOpen(false); }}
            className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-sidebar-hover"
          >
            Bill Credit
          </button>
          <button
            onClick={() => { onPayExpense(bill); setOpen(false); }}
            className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-sidebar-hover"
          >
            Pay Expense
          </button>
          <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-sidebar-hover">
            Adjust Prepaid Schedule
          </button>
          <button className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-sidebar-hover">
            GL Impact
          </button>
        </div>
      )}
    </div>
  );
}

/* ───────────────── Component ───────────────── */

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  /* Bill Credit Modal */
  const [creditOpen, setCreditOpen] = useState(false);
  const [creditBill, setCreditBill] = useState<Bill | null>(null);
  const [creditDate, setCreditDate] = useState("2026-03-13");
  const [creditAccount, setCreditAccount] = useState("2000");
  const [creditAmount, setCreditAmount] = useState("");

  /* Pay Expense Modal */
  const [payOpen, setPayOpen] = useState(false);
  const [payBill, setPayBill] = useState<Bill | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payDate, setPayDate] = useState("2026-03-13");
  const [payAccount, setPayAccount] = useState("1000");

  const GL_OPTIONS = [
    { value: "1000", label: "1000 - Cash" },
    { value: "1010", label: "1010 - Euro Bank" },
    { value: "2000", label: "2000 - Accounts Payable" },
    { value: "6100", label: "6100 - Cloud Hosting" },
  ];

  const filteredBills = bills.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (!searchText) return true;
    const q = searchText.toLowerCase();
    return b.billNumber.toLowerCase().includes(q) || b.vendor.toLowerCase().includes(q);
  });

  function openBillCredit(bill: Bill) {
    setCreditBill(bill);
    setCreditAmount(String(bill.amountDue));
    setCreditOpen(true);
  }

  function handleBillCredit() {
    if (!creditBill) return;
    const amt = parseFloat(creditAmount);
    if (isNaN(amt) || amt <= 0 || amt > creditBill.amountDue) return;
    setBills((prev) =>
      prev.map((b) => {
        if (b.id !== creditBill.id) return b;
        const newDue = b.amountDue - amt;
        return { ...b, amountDue: newDue, status: newDue <= 0 ? "paid" : b.status };
      })
    );
    setCreditOpen(false);
    setCreditBill(null);
    setCreditAmount("");
  }

  function openPayExpense(bill: Bill) {
    setPayBill(bill);
    setPayAmount(String(bill.amountDue));
    setPayOpen(true);
  }

  function handlePayExpense() {
    if (!payBill) return;
    const amt = parseFloat(payAmount);
    if (isNaN(amt) || amt <= 0) return;
    setBills((prev) =>
      prev.map((b) => {
        if (b.id !== payBill.id) return b;
        const newDue = Math.max(0, b.amountDue - amt);
        return { ...b, amountDue: newDue, status: newDue <= 0 ? "paid" : b.status };
      })
    );
    setPayOpen(false);
    setPayBill(null);
    setPayAmount("");
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Bills</h1>
          <p className="mt-1 text-sm text-muted">{bills.length} bills total</p>
        </div>
        <Link href="/ap/bills/create">
          <Button>+ Add Bill</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="mt-6 flex items-end gap-4">
        <div className="w-72">
          <Input placeholder="Search bills…" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        </div>
        <div className="w-40">
          <Select
            options={[
              { value: "all", label: "All Statuses" },
              { value: "draft", label: "Draft" },
              { value: "unpaid", label: "Unpaid" },
              { value: "paid", label: "Paid" },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-sidebar text-left text-xs text-muted">
              <th className="px-4 py-3">Bill #</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Due Date</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3">Currency</th>
              <th className="w-12 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill) => (
              <tr key={bill.id} className="border-b border-border transition-colors hover:bg-sidebar-hover">
                <td className="px-4 py-3 font-medium text-foreground">{bill.billNumber}</td>
                <td className="px-4 py-3 text-muted">{bill.vendor}</td>
                <td className="px-4 py-3 text-muted">{bill.date}</td>
                <td className="px-4 py-3 text-muted">{bill.dueDate}</td>
                <td className="px-4 py-3 text-right font-mono text-foreground">{formatCurrency(bill.amount, bill.currency)}</td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={bill.status} />
                </td>
                <td className="px-4 py-3 text-muted">{bill.currency}</td>
                <td className="px-4 py-3">
                  <ActionsMenu bill={bill} onBillCredit={openBillCredit} onPayExpense={openPayExpense} />
                </td>
              </tr>
            ))}
            {filteredBills.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted">No bills found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bill Credit Modal */}
      <Modal isOpen={creditOpen} onClose={() => setCreditOpen(false)} title="Bill Credit" size="md">
        <div className="space-y-4">
          <Input label="Vendor" value={creditBill?.vendor ?? ""} disabled />
          <Input label="Bill #" value={creditBill?.billNumber ?? ""} disabled />
          <Input label="Date" type="date" value={creditDate} onChange={(e) => setCreditDate(e.target.value)} />
          <Select label="Account" options={GL_OPTIONS} value={creditAccount} onChange={(e) => setCreditAccount(e.target.value)} />
          <Input
            label={`Amount (≤ ${creditBill ? formatCurrency(creditBill.amountDue, creditBill.currency) : ""})`}
            type="number"
            value={creditAmount}
            onChange={(e) => setCreditAmount(e.target.value)}
          />
          <p className="text-xs text-muted">Currency: {creditBill?.currency ?? "USD"} (must match bill currency)</p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="default" onClick={() => setCreditOpen(false)}>Cancel</Button>
            <Button onClick={handleBillCredit}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Pay Expense Modal */}
      <Modal isOpen={payOpen} onClose={() => setPayOpen(false)} title="Pay Expense" size="md">
        <div className="space-y-4">
          <div className="rounded-md border border-border bg-sidebar p-3">
            <p className="text-sm text-foreground">{payBill?.vendor} — {payBill?.billNumber}</p>
            <p className="text-xs text-muted">Amount due: {payBill ? formatCurrency(payBill.amountDue, payBill.currency) : ""}</p>
          </div>
          <Input label="Amount" type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
          <Input label="Date" type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} />
          <Select label="Account" options={GL_OPTIONS} value={payAccount} onChange={(e) => setPayAccount(e.target.value)} />
          {payBill?.currency !== "USD" && (
            <p className="rounded-md border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-400">
              FX transaction — this payment will create a complex match entry for cash reconciliation
            </p>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="default" onClick={() => setPayOpen(false)}>Cancel</Button>
            <Button onClick={handlePayExpense}>Confirm Payment</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

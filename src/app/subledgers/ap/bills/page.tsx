"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Plus, MoreVertical, Search } from "lucide-react";
import { Button, Input, Select, Modal, Tag } from "@/components/ui";

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

const initialBills: Bill[] = [
  { id: "B-001", billNumber: "INV-2048", vendor: "Amazon Web Services", date: "2026-03-01", dueDate: "2026-03-31", amount: 3200.0, amountDue: 3200.0, status: "unpaid", currency: "USD" },
  { id: "B-002", billNumber: "INV-2047", vendor: "Gusto Inc.", date: "2026-03-01", dueDate: "2026-03-16", amount: 48750.0, amountDue: 0, status: "paid", currency: "USD" },
  { id: "B-003", billNumber: "INV-2046", vendor: "WeWork", date: "2026-02-28", dueDate: "2026-03-30", amount: 12500.0, amountDue: 12500.0, status: "unpaid", currency: "USD" },
  { id: "B-004", billNumber: "INV-2045", vendor: "Google Cloud", date: "2026-02-25", dueDate: "2026-03-27", amount: 890.0, amountDue: 890.0, status: "unpaid", currency: "USD" },
  { id: "B-005", billNumber: "DRAFT-001", vendor: "Johnson Legal LLP", date: "2026-03-10", dueDate: "2026-04-24", amount: 7500.0, amountDue: 7500.0, status: "draft", currency: "USD" },
  { id: "B-006", billNumber: "INV-8821", vendor: "SaaS Tools GmbH", date: "2026-03-05", dueDate: "2026-04-04", amount: 2340.0, amountDue: 2340.0, status: "unpaid", currency: "EUR" },
];

function formatCurrency(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

const statusVariant: Record<string, "default" | "warning" | "success"> = {
  draft: "default",
  unpaid: "warning",
  paid: "success",
};

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
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} className="mx-btn-icon" style={{ padding: 4 }}>
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="mx-dropdown" style={{ position: 'absolute', right: 0, top: '100%', marginTop: 4, width: 192, zIndex: 20 }}>
          <button onClick={() => { onBillCredit(bill); setOpen(false); }} className="mx-dropdown-item">Bill Credit</button>
          <button onClick={() => { onPayExpense(bill); setOpen(false); }} className="mx-dropdown-item">Pay Expense</button>
          <button className="mx-dropdown-item">Adjust Prepaid Schedule</button>
          <button className="mx-dropdown-item">GL Impact</button>
        </div>
      )}
    </div>
  );
}

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [creditOpen, setCreditOpen] = useState(false);
  const [creditBill, setCreditBill] = useState<Bill | null>(null);
  const [creditDate, setCreditDate] = useState("2026-03-13");
  const [creditAccount, setCreditAccount] = useState("2000");
  const [creditAmount, setCreditAmount] = useState("");
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

  function openBillCredit(bill: Bill) { setCreditBill(bill); setCreditAmount(String(bill.amountDue)); setCreditOpen(true); }
  function handleBillCredit() {
    if (!creditBill) return;
    const amt = parseFloat(creditAmount);
    if (isNaN(amt) || amt <= 0 || amt > creditBill.amountDue) return;
    setBills((prev) => prev.map((b) => { if (b.id !== creditBill.id) return b; const newDue = b.amountDue - amt; return { ...b, amountDue: newDue, status: newDue <= 0 ? "paid" : b.status }; }));
    setCreditOpen(false); setCreditBill(null); setCreditAmount("");
  }
  function openPayExpense(bill: Bill) { setPayBill(bill); setPayAmount(String(bill.amountDue)); setPayOpen(true); }
  function handlePayExpense() {
    if (!payBill) return;
    const amt = parseFloat(payAmount);
    if (isNaN(amt) || amt <= 0) return;
    setBills((prev) => prev.map((b) => { if (b.id !== payBill.id) return b; const newDue = Math.max(0, b.amountDue - amt); return { ...b, amountDue: newDue, status: newDue <= 0 ? "paid" : b.status }; }));
    setPayOpen(false); setPayBill(null); setPayAmount("");
  }

  return (
    <div style={{ padding: 24, background: '#f9f9f9' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Bills</h1>
            <p className="mx-text-secondary mt-1">{bills.length} bills total</p>
          </div>
          <Link href="/subledgers/ap/bills/create"><Button><Plus size={16} className="mr-1" /> Add Bill</Button></Link>
        </div>

        <div className="flex items-end gap-4 mb-4">
          <div style={{ width: 288 }}><Input placeholder="Search bills…" value={searchText} onChange={(e) => setSearchText(e.target.value)} /></div>
          <div style={{ width: 160 }}>
            <Select options={[{ value: "all", label: "All Statuses" }, { value: "draft", label: "Draft" }, { value: "unpaid", label: "Unpaid" }, { value: "paid", label: "Paid" }]} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} />
          </div>
        </div>

        <div className="mx-table-container">
          <table className="mx-table">
            <thead>
              <tr>
                <th>Bill #</th>
                <th>Vendor</th>
                <th>Date</th>
                <th>Due Date</th>
                <th style={{ textAlign: 'right' }}>Amount</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th>Currency</th>
                <th style={{ width: 48 }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                <tr key={bill.id}>
                  <td style={{ fontWeight: 500, color: '#2D2926' }}>{bill.billNumber}</td>
                  <td>{bill.vendor}</td>
                  <td>{bill.date}</td>
                  <td>{bill.dueDate}</td>
                  <td style={{ textAlign: 'right', fontFamily: 'monospace', color: '#2D2926' }}>{formatCurrency(bill.amount, bill.currency)}</td>
                  <td style={{ textAlign: 'center' }}>
                    <Tag variant={statusVariant[bill.status] ?? "default"}>{bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}</Tag>
                  </td>
                  <td>{bill.currency}</td>
                  <td><ActionsMenu bill={bill} onBillCredit={openBillCredit} onPayExpense={openPayExpense} /></td>
                </tr>
              ))}
              {filteredBills.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32 }} className="mx-text-secondary">No bills found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal isOpen={creditOpen} onClose={() => setCreditOpen(false)} title="Bill Credit" size="md">
          <div className="space-y-4">
            <Input label="Vendor" value={creditBill?.vendor ?? ""} disabled />
            <Input label="Bill #" value={creditBill?.billNumber ?? ""} disabled />
            <Input label="Date" type="date" value={creditDate} onChange={(e) => setCreditDate(e.target.value)} />
            <Select label="Account" options={GL_OPTIONS} value={creditAccount} onChange={(e) => setCreditAccount(e.target.value)} />
            <Input label={`Amount (≤ ${creditBill ? formatCurrency(creditBill.amountDue, creditBill.currency) : ""})`} type="number" value={creditAmount} onChange={(e) => setCreditAmount(e.target.value)} />
            <p className="mx-text-secondary" style={{ fontSize: 12 }}>Currency: {creditBill?.currency ?? "USD"} (must match bill currency)</p>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="default" onClick={() => setCreditOpen(false)}>Cancel</Button>
              <Button onClick={handleBillCredit}>Save</Button>
            </div>
          </div>
        </Modal>

        <Modal isOpen={payOpen} onClose={() => setPayOpen(false)} title="Pay Expense" size="md">
          <div className="space-y-4">
            <div className="mx-card" style={{ padding: 12 }}>
              <p style={{ fontSize: 14, color: '#2D2926' }}>{payBill?.vendor} — {payBill?.billNumber}</p>
              <p className="mx-text-secondary" style={{ fontSize: 12 }}>Amount due: {payBill ? formatCurrency(payBill.amountDue, payBill.currency) : ""}</p>
            </div>
            <Input label="Amount" type="number" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} />
            <Input label="Date" type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} />
            <Select label="Account" options={GL_OPTIONS} value={payAccount} onChange={(e) => setPayAccount(e.target.value)} />
            {payBill?.currency !== "USD" && (
              <div className="mx-alert-warning" style={{ padding: '8px 12px', fontSize: 12 }}>
                FX transaction — this payment will create a complex match entry for cash reconciliation
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="default" onClick={() => setPayOpen(false)}>Cancel</Button>
              <Button onClick={handlePayExpense}>Confirm Payment</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

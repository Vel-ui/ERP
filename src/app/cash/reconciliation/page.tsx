"use client";

import { useState, useMemo } from "react";
import { ArrowLeftRight, Upload, Zap, ArrowRightLeft, CornerDownRight } from "lucide-react";
import { Button, Input, Select, Modal, Tag } from "@/components/ui";

interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "unmatched" | "matched";
  matchedWith?: string[];
}

interface RilletTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  glAccount: string;
  status: "unmatched" | "matched";
  matchedWith?: string;
}

const BANK_ACCOUNTS = [
  { value: "chase-checking", label: "Chase Checking ••4521" },
  { value: "mercury", label: "Mercury ••7890" },
];

const initialBankTxs: BankTransaction[] = [
  { id: "BK-001", date: "2026-03-01", description: "Stripe Transfer - March", amount: 24500.0, status: "unmatched" },
  { id: "BK-002", date: "2026-03-02", description: "AWS Monthly Invoice", amount: -3200.0, status: "unmatched" },
  { id: "BK-003", date: "2026-03-03", description: "Gusto Payroll Run", amount: -48750.0, status: "unmatched" },
  { id: "BK-004", date: "2026-03-05", description: "Client Payment - Acme Corp", amount: 15000.0, status: "unmatched" },
  { id: "BK-005", date: "2026-03-06", description: "Transfer to Mercury", amount: -10000.0, status: "unmatched" },
  { id: "BK-006", date: "2026-03-07", description: "Google Workspace", amount: -432.0, status: "unmatched" },
  { id: "BK-007", date: "2026-03-08", description: "Client Payment - Beta Inc", amount: 8750.0, status: "unmatched" },
  { id: "BK-008", date: "2026-03-10", description: "Office Supplies - Staples", amount: -289.5, status: "unmatched" },
  { id: "BK-009", date: "2026-03-06", description: "Transfer from Chase", amount: 10000.0, status: "unmatched" },
];

const initialRilletTxs: RilletTransaction[] = [
  { id: "RL-001", date: "2026-03-01", description: "Revenue Recognition - Stripe", amount: 24500.0, glAccount: "4000 - Revenue", status: "unmatched" },
  { id: "RL-002", date: "2026-03-02", description: "AWS Hosting Expense", amount: -3200.0, glAccount: "6100 - Cloud Hosting", status: "unmatched" },
  { id: "RL-003", date: "2026-03-03", description: "Payroll - Salaries", amount: -38750.0, glAccount: "6200 - Salaries", status: "unmatched" },
  { id: "RL-004", date: "2026-03-03", description: "Payroll - Taxes & Benefits", amount: -10000.0, glAccount: "6210 - Payroll Tax", status: "unmatched" },
  { id: "RL-005", date: "2026-03-05", description: "AR Collection - Acme Corp", amount: 15000.0, glAccount: "1200 - Accounts Receivable", status: "unmatched" },
  { id: "RL-006", date: "2026-03-07", description: "SaaS Subscription - Google", amount: -432.0, glAccount: "6300 - Software", status: "unmatched" },
];

const GL_ACCOUNTS = [
  { value: "1000", label: "1000 - Cash" },
  { value: "1200", label: "1200 - Accounts Receivable" },
  { value: "2000", label: "2000 - Accounts Payable" },
  { value: "4000", label: "4000 - Revenue" },
  { value: "6100", label: "6100 - Cloud Hosting" },
  { value: "6200", label: "6200 - Salaries" },
  { value: "6300", label: "6300 - Software" },
  { value: "6400", label: "6400 - Office Supplies" },
];

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default function ReconciliationPage() {
  const [account, setAccount] = useState("chase-checking");
  const [reconDate, setReconDate] = useState("2026-03-10");
  const [activeTab, setActiveTab] = useState<"unmatched" | "matched">("unmatched");

  const [bankTxs, setBankTxs] = useState<BankTransaction[]>(initialBankTxs);
  const [rilletTxs, setRilletTxs] = useState<RilletTransaction[]>(initialRilletTxs);

  const [selectedBankIds, setSelectedBankIds] = useState<Set<string>>(new Set());
  const [selectedRilletIds, setSelectedRilletIds] = useState<Set<string>>(new Set());

  const [sortField, setSortField] = useState<"date" | "amount">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filterText, setFilterText] = useState("");

  const [quickEntryOpen, setQuickEntryOpen] = useState(false);

  const [qePayerType, setQePayerType] = useState("customer");
  const [qePayerName, setQePayerName] = useState("");
  const [qeGlAccount, setQeGlAccount] = useState("");
  const [qeAmount, setQeAmount] = useState("");
  const [qeDescription, setQeDescription] = useState("");

  const filteredBankTxs = useMemo(() => {
    let txs = bankTxs.filter((t) => t.status === activeTab);
    if (filterText) {
      const q = filterText.toLowerCase();
      txs = txs.filter((t) => t.description.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
    }
    txs.sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortField === "date") return mul * a.date.localeCompare(b.date);
      return mul * (a.amount - b.amount);
    });
    return txs;
  }, [bankTxs, activeTab, filterText, sortField, sortDir]);

  const filteredRilletTxs = useMemo(() => {
    return rilletTxs.filter((t) => t.status === activeTab);
  }, [rilletTxs, activeTab]);

  const canMatch = selectedBankIds.size >= 1 && selectedRilletIds.size >= 1 && activeTab === "unmatched";
  const canUnmatch = selectedBankIds.size >= 1 && activeTab === "matched";

  const canTransfer = (() => {
    if (selectedBankIds.size !== 2 || activeTab !== "unmatched") return false;
    const sel = Array.from(selectedBankIds).map((id) => bankTxs.find((t) => t.id === id)!).filter(Boolean);
    return sel.length === 2 && sel.some((t) => t.amount > 0) && sel.some((t) => t.amount < 0);
  })();

  function handleMatch() {
    if (!canMatch) return;
    const bankIds = Array.from(selectedBankIds);
    const rilletIds = Array.from(selectedRilletIds);
    setBankTxs((prev) => prev.map((t) => bankIds.includes(t.id) ? { ...t, status: "matched" as const, matchedWith: rilletIds } : t));
    setRilletTxs((prev) => prev.map((t) => rilletIds.includes(t.id) ? { ...t, status: "matched" as const, matchedWith: bankIds[0] } : t));
    setSelectedBankIds(new Set());
    setSelectedRilletIds(new Set());
  }

  function handleUnmatch() {
    if (!canUnmatch) return;
    const bankIds = Array.from(selectedBankIds);
    const rilletIds = new Set<string>();
    bankIds.forEach((bid) => {
      const tx = bankTxs.find((t) => t.id === bid);
      tx?.matchedWith?.forEach((rid) => rilletIds.add(rid));
    });
    setBankTxs((prev) => prev.map((t) => bankIds.includes(t.id) ? { ...t, status: "unmatched" as const, matchedWith: undefined } : t));
    setRilletTxs((prev) => prev.map((t) => rilletIds.has(t.id) ? { ...t, status: "unmatched" as const, matchedWith: undefined } : t));
    setSelectedBankIds(new Set());
    setSelectedRilletIds(new Set());
  }

  function handleTransfer() {
    if (!canTransfer) return;
    const ids = Array.from(selectedBankIds);
    setBankTxs((prev) => prev.map((t) => ids.includes(t.id) ? { ...t, status: "matched" as const, matchedWith: ids.filter((x) => x !== t.id) } : t));
    setSelectedBankIds(new Set());
  }

  function handleQuickEntry() {
    const amt = parseFloat(qeAmount);
    if (!qeDescription || isNaN(amt)) return;
    const newRillet: RilletTransaction = {
      id: `RL-${String(rilletTxs.length + 1).padStart(3, "0")}`,
      date: reconDate,
      description: qeDescription,
      amount: amt,
      glAccount: GL_ACCOUNTS.find((a) => a.value === qeGlAccount)?.label ?? qeGlAccount,
      status: "unmatched",
    };
    setRilletTxs((prev) => [...prev, newRillet]);
    if (selectedBankIds.size === 1) {
      const bankId = Array.from(selectedBankIds)[0];
      setBankTxs((prev) => prev.map((t) => (t.id === bankId ? { ...t, status: "matched" as const, matchedWith: [newRillet.id] } : t)));
      setRilletTxs((prev) => prev.map((t) => (t.id === newRillet.id ? { ...t, status: "matched" as const, matchedWith: bankId } : t)));
      setSelectedBankIds(new Set());
    }
    setQePayerType("customer"); setQePayerName(""); setQeGlAccount(""); setQeAmount(""); setQeDescription("");
    setQuickEntryOpen(false);
  }

  function toggleBankSelection(id: string) {
    setSelectedBankIds((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }

  function toggleRilletSelection(id: string) {
    setSelectedRilletIds((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }

  function toggleSort(field: "date" | "amount") {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  }

  const SortIcon = ({ field }: { field: "date" | "amount" }) => {
    if (sortField !== field) return <span className="ml-1 mx-text-secondary">↕</span>;
    return <span className="ml-1" style={{ color: "var(--mx-primary)" }}>{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  const matchedGroups = useMemo(() => {
    if (activeTab !== "matched") return [];
    return bankTxs.filter((t) => t.status === "matched").map((bt) => ({
      bank: bt,
      rillet: (bt.matchedWith ?? []).map((rid) => rilletTxs.find((r) => r.id === rid)).filter(Boolean) as RilletTransaction[],
    }));
  }, [activeTab, bankTxs, rilletTxs]);

  return (
    <div className="flex flex-col" style={{ height: "100vh", background: "#f9f9f9" }}>
      {/* Header */}
      <div style={{ padding: "24px 32px", borderBottom: "1px solid var(--mx-border)", background: "#fff" }}>
        <h1 className="mx-h1">Cash Reconciliation</h1>
        <p className="mx-text-secondary mt-1">Match bank transactions with accounting entries</p>

        <div className="mt-4 flex flex-wrap items-end gap-4">
          <div style={{ width: 256 }}>
            <Select label="Bank Account" options={BANK_ACCOUNTS} value={account} onChange={(e) => setAccount(e.target.value)} />
          </div>
          <div style={{ width: 192 }}>
            <Input label="Reconciliation Date" type="date" value={reconDate} onChange={(e) => setReconDate(e.target.value)} />
          </div>
          <Button variant="default" size="sm">
            <Upload size={14} className="mr-1 inline" /> Upload Transactions
          </Button>
        </div>

        <div className="mt-5 flex gap-1">
          {(["unmatched", "matched"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedBankIds(new Set()); setSelectedRilletIds(new Set()); }}
              className="rounded-t-md px-4 py-2 text-sm font-medium transition-colors"
              style={
                activeTab === tab
                  ? { background: "#fff", borderTop: `2px solid var(--mx-primary)`, borderLeft: "1px solid var(--mx-border)", borderRight: "1px solid var(--mx-border)", color: "var(--mx-primary)" }
                  : { color: "#61636a" }
              }
            >
              {tab === "unmatched" ? "Unmatched" : "Matched"}
              <span className="ml-2 rounded-full px-2 py-0.5 text-xs" style={{ background: "var(--mx-primary-bg)" }}>
                {bankTxs.filter((t) => t.status === tab).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Split Pane */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Bank Transactions */}
        <div className="flex w-1/2 flex-col" style={{ borderRight: "1px solid var(--mx-border)" }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid var(--mx-border)", background: "#fff" }}>
            <h2 style={{ fontSize: 14, fontWeight: 600 }}>Bank Transactions</h2>
            <div style={{ width: 208 }}>
              <Input placeholder="Filter transactions..." value={filterText} onChange={(e) => setFilterText(e.target.value)} />
            </div>
          </div>

          <div className="flex-1 overflow-auto" style={{ background: "#fff" }}>
            {activeTab === "unmatched" ? (
              <table className="mx-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ width: 32 }} />
                    <th className="cursor-pointer" onClick={() => toggleSort("date")}>Date <SortIcon field="date" /></th>
                    <th>Description</th>
                    <th className="cursor-pointer" style={{ textAlign: "right" }} onClick={() => toggleSort("amount")}>Amount <SortIcon field="amount" /></th>
                    <th style={{ textAlign: "center" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBankTxs.map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => toggleBankSelection(tx.id)}
                      className="cursor-pointer"
                      style={selectedBankIds.has(tx.id) ? { background: "var(--mx-primary-bg)" } : undefined}
                    >
                      <td>
                        <input type="checkbox" checked={selectedBankIds.has(tx.id)} onChange={() => toggleBankSelection(tx.id)} className="mx-checkbox" />
                      </td>
                      <td className="mx-text-secondary">{tx.date}</td>
                      <td>{tx.description}</td>
                      <td style={{ textAlign: "right", fontFamily: "monospace", color: tx.amount < 0 ? "#f03c46" : "#067f54" }}>
                        {formatCurrency(tx.amount)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <Tag variant={tx.status === "matched" ? "success" : "warning"}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </Tag>
                      </td>
                    </tr>
                  ))}
                  {filteredBankTxs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="mx-text-secondary" style={{ textAlign: "center", padding: 32 }}>
                        No {activeTab} bank transactions
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <div>
                {matchedGroups.map((group) => (
                  <div
                    key={group.bank.id}
                    onClick={() => toggleBankSelection(group.bank.id)}
                    className="cursor-pointer p-4 transition-colors"
                    style={{
                      borderBottom: "1px solid var(--mx-border)",
                      background: selectedBankIds.has(group.bank.id) ? "var(--mx-primary-bg)" : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={selectedBankIds.has(group.bank.id)} onChange={() => toggleBankSelection(group.bank.id)} className="mx-checkbox" />
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 500 }}>{group.bank.description}</p>
                          <p className="mx-text-secondary" style={{ fontSize: 12 }}>{group.bank.date} &middot; {group.bank.id}</p>
                        </div>
                      </div>
                      <span style={{ fontFamily: "monospace", fontSize: 14, color: group.bank.amount < 0 ? "#f03c46" : "#067f54" }}>
                        {formatCurrency(group.bank.amount)}
                      </span>
                    </div>
                    {group.rillet.length > 0 && (
                      <div style={{ marginLeft: 32, marginTop: 8 }} className="space-y-1">
                        {group.rillet.map((r) => (
                          <div key={r.id} className="flex items-center justify-between mx-text-secondary" style={{ fontSize: 12 }}>
                            <span><CornerDownRight size={12} className="inline mr-1" />{r.description} ({r.glAccount})</span>
                            <span style={{ fontFamily: "monospace" }}>{formatCurrency(r.amount)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {matchedGroups.length === 0 && (
                  <div className="mx-text-secondary" style={{ textAlign: "center", padding: 32 }}>No matched transactions yet</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Rillet Transactions */}
        <div className="flex w-1/2 flex-col">
          <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--mx-border)", background: "#fff" }}>
            <h2 style={{ fontSize: 14, fontWeight: 600 }}>Maximor Transactions</h2>
          </div>

          <div className="flex-1 overflow-auto" style={{ background: "#fff" }}>
            {activeTab === "unmatched" && selectedBankIds.size === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div style={{ textAlign: "center" }}>
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "var(--mx-primary-bg)" }}>
                    <ArrowLeftRight size={20} style={{ color: "var(--mx-primary)" }} />
                  </div>
                  <p className="mx-text-secondary text-sm">Select a bank transaction to see matching entries</p>
                </div>
              </div>
            ) : (
              <table className="mx-table" style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ width: 32 }} />
                    <th>Date</th>
                    <th>Description</th>
                    <th>GL Account</th>
                    <th style={{ textAlign: "right" }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRilletTxs.map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => toggleRilletSelection(tx.id)}
                      className="cursor-pointer"
                      style={selectedRilletIds.has(tx.id) ? { background: "var(--mx-primary-bg)" } : undefined}
                    >
                      <td>
                        <input type="checkbox" checked={selectedRilletIds.has(tx.id)} onChange={() => toggleRilletSelection(tx.id)} className="mx-checkbox" />
                      </td>
                      <td className="mx-text-secondary">{tx.date}</td>
                      <td>{tx.description}</td>
                      <td className="mx-text-secondary">{tx.glAccount}</td>
                      <td style={{ textAlign: "right", fontFamily: "monospace", color: tx.amount < 0 ? "#f03c46" : "#067f54" }}>
                        {formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  ))}
                  {filteredRilletTxs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="mx-text-secondary" style={{ textAlign: "center", padding: 32 }}>
                        No matching transactions
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between px-6 py-3" style={{ borderTop: "1px solid var(--mx-border)", background: "#fff" }}>
        <div className="flex items-center gap-2 mx-text-secondary" style={{ fontSize: 12 }}>
          {selectedBankIds.size > 0 && <span>{selectedBankIds.size} bank tx selected</span>}
          {selectedBankIds.size > 0 && selectedRilletIds.size > 0 && <span>&middot;</span>}
          {selectedRilletIds.size > 0 && <span>{selectedRilletIds.size} Maximor tx selected</span>}
        </div>

        <div className="flex gap-2">
          {activeTab === "unmatched" ? (
            <>
              <Button variant="default" size="sm" onClick={() => setQuickEntryOpen(true)}>
                <Zap size={14} className="mr-1 inline" /> Quick Entry
              </Button>
              <Button variant="default" size="sm" disabled={!canTransfer} onClick={handleTransfer}>
                <ArrowRightLeft size={14} className="mr-1 inline" /> Transfer
              </Button>
              <Button size="sm" disabled={!canMatch} onClick={handleMatch}>
                Match
              </Button>
            </>
          ) : (
            <Button variant="default" size="sm" disabled={!canUnmatch} onClick={handleUnmatch}>
              Unmatch
            </Button>
          )}
        </div>
      </div>

      <Modal isOpen={quickEntryOpen} onClose={() => setQuickEntryOpen(false)} title="Quick Entry" size="md">
        <div className="space-y-4">
          <Select label="Payer Type" options={[{ value: "customer", label: "Customer" }, { value: "vendor", label: "Vendor" }, { value: "other", label: "Other" }]} value={qePayerType} onChange={(e) => setQePayerType(e.target.value)} />
          <Input label={qePayerType === "vendor" ? "Vendor Name" : "Customer Name"} placeholder={`Enter ${qePayerType} name...`} value={qePayerName} onChange={(e) => setQePayerName(e.target.value)} />
          <Select label="GL Account" options={GL_ACCOUNTS} placeholder="Select account..." value={qeGlAccount} onChange={(e) => setQeGlAccount(e.target.value)} />
          <Input label="Amount" type="number" placeholder="0.00" value={qeAmount} onChange={(e) => setQeAmount(e.target.value)} />
          <Input label="Description" placeholder="Enter description..." value={qeDescription} onChange={(e) => setQeDescription(e.target.value)} />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="default" onClick={() => setQuickEntryOpen(false)}>Cancel</Button>
            <Button onClick={handleQuickEntry}>Create and Match</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { Button, Input, Select, Modal } from "@/components/ui";

/* ───────────────── Types ───────────────── */

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

/* ───────────────── Mock Data ───────────────── */

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

/* ───────────────── Helpers ───────────────── */

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    unmatched: "bg-yellow-500/15 text-yellow-400",
    matched: "bg-green-500/15 text-green-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? "bg-sidebar text-muted"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

/* ───────────────── Component ───────────────── */

export default function CashPage() {
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
  const [transferMode, setTransferMode] = useState(false);

  /* Quick Entry form state */
  const [qePayerType, setQePayerType] = useState("customer");
  const [qePayerName, setQePayerName] = useState("");
  const [qeGlAccount, setQeGlAccount] = useState("");
  const [qeAmount, setQeAmount] = useState("");
  const [qeDescription, setQeDescription] = useState("");

  /* ── Derived data ── */

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

  const selectedBankTx = useMemo(() => {
    if (selectedBankIds.size !== 1) return null;
    const id = [...selectedBankIds][0];
    return bankTxs.find((t) => t.id === id) ?? null;
  }, [selectedBankIds, bankTxs]);

  const suggestedRillet = useMemo(() => {
    if (!selectedBankTx || activeTab !== "unmatched") return filteredRilletTxs;
    return filteredRilletTxs;
  }, [selectedBankTx, activeTab, filteredRilletTxs]);

  /* ── Can match? ── */
  const canMatch = selectedBankIds.size >= 1 && selectedRilletIds.size >= 1 && activeTab === "unmatched";
  const canUnmatch = selectedBankIds.size >= 1 && activeTab === "matched";

  /* Transfer: exactly 2 bank txs, one debit + one credit */
  const canTransfer = (() => {
    if (selectedBankIds.size !== 2 || activeTab !== "unmatched") return false;
    const sel = [...selectedBankIds].map((id) => bankTxs.find((t) => t.id === id)!).filter(Boolean);
    return sel.length === 2 && sel.some((t) => t.amount > 0) && sel.some((t) => t.amount < 0);
  })();

  /* ── Actions ── */

  function handleMatch() {
    if (!canMatch) return;
    const bankIds = [...selectedBankIds];
    const rilletIds = [...selectedRilletIds];

    setBankTxs((prev) =>
      prev.map((t) =>
        bankIds.includes(t.id) ? { ...t, status: "matched" as const, matchedWith: rilletIds } : t
      )
    );
    setRilletTxs((prev) =>
      prev.map((t) =>
        rilletIds.includes(t.id) ? { ...t, status: "matched" as const, matchedWith: bankIds[0] } : t
      )
    );
    setSelectedBankIds(new Set());
    setSelectedRilletIds(new Set());
  }

  function handleUnmatch() {
    if (!canUnmatch) return;
    const bankIds = [...selectedBankIds];
    const rilletIds = new Set<string>();
    bankIds.forEach((bid) => {
      const tx = bankTxs.find((t) => t.id === bid);
      tx?.matchedWith?.forEach((rid) => rilletIds.add(rid));
    });

    setBankTxs((prev) =>
      prev.map((t) =>
        bankIds.includes(t.id) ? { ...t, status: "unmatched" as const, matchedWith: undefined } : t
      )
    );
    setRilletTxs((prev) =>
      prev.map((t) =>
        rilletIds.has(t.id) ? { ...t, status: "unmatched" as const, matchedWith: undefined } : t
      )
    );
    setSelectedBankIds(new Set());
    setSelectedRilletIds(new Set());
  }

  function handleTransfer() {
    if (!canTransfer) return;
    const ids = [...selectedBankIds];
    setBankTxs((prev) =>
      prev.map((t) =>
        ids.includes(t.id) ? { ...t, status: "matched" as const, matchedWith: ids.filter((x) => x !== t.id) } : t
      )
    );
    setSelectedBankIds(new Set());
    setTransferMode(false);
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
      const bankId = [...selectedBankIds][0];
      setBankTxs((prev) =>
        prev.map((t) => (t.id === bankId ? { ...t, status: "matched" as const, matchedWith: [newRillet.id] } : t))
      );
      setRilletTxs((prev) =>
        prev.map((t) => (t.id === newRillet.id ? { ...t, status: "matched" as const, matchedWith: bankId } : t))
      );
      setSelectedBankIds(new Set());
    }

    setQePayerType("customer");
    setQePayerName("");
    setQeGlAccount("");
    setQeAmount("");
    setQeDescription("");
    setQuickEntryOpen(false);
  }

  function toggleBankSelection(id: string) {
    setSelectedBankIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleRilletSelection(id: string) {
    setSelectedRilletIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSort(field: "date" | "amount") {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  const SortIcon = ({ field }: { field: "date" | "amount" }) => {
    if (sortField !== field) return <span className="ml-1 text-muted/50">↕</span>;
    return <span className="ml-1 text-accent">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  /* ── Matched tab: group by bank tx ── */
  const matchedGroups = useMemo(() => {
    if (activeTab !== "matched") return [];
    return bankTxs
      .filter((t) => t.status === "matched")
      .map((bt) => ({
        bank: bt,
        rillet: (bt.matchedWith ?? []).map((rid) => rilletTxs.find((r) => r.id === rid)).filter(Boolean) as RilletTransaction[],
      }));
  }, [activeTab, bankTxs, rilletTxs]);

  return (
    <div className="flex h-full flex-col">
      {/* ── Header ── */}
      <div className="border-b border-border px-8 py-6">
        <h1 className="text-2xl font-semibold text-foreground">Cash Reconciliation</h1>
        <p className="mt-1 text-sm text-muted">Match bank transactions with accounting entries</p>

        <div className="mt-4 flex flex-wrap items-end gap-4">
          <div className="w-64">
            <Select
              label="Bank Account"
              options={BANK_ACCOUNTS}
              value={account}
              onChange={(e) => setAccount(e.target.value)}
            />
          </div>
          <div className="w-48">
            <Input
              label="Reconciliation Date"
              type="date"
              value={reconDate}
              onChange={(e) => setReconDate(e.target.value)}
            />
          </div>
          <Button variant="secondary" size="sm">
            Upload Transactions
          </Button>
        </div>

        {/* Tabs */}
        <div className="mt-5 flex gap-1">
          {(["unmatched", "matched"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedBankIds(new Set());
                setSelectedRilletIds(new Set());
              }}
              className={`rounded-t-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-sidebar text-foreground border border-border border-b-transparent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {tab === "unmatched" ? "Unmatched" : "Matched"}
              <span className="ml-2 rounded-full bg-sidebar-hover px-2 py-0.5 text-xs">
                {bankTxs.filter((t) => t.status === tab).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Split Pane ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Bank Transactions */}
        <div className="flex w-1/2 flex-col border-r border-border">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">Bank Transactions</h2>
            <div className="w-52">
              <Input
                placeholder="Filter transactions…"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="!py-1.5 text-xs"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {activeTab === "unmatched" ? (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b border-border text-left text-xs text-muted">
                    <th className="w-8 px-4 py-2" />
                    <th className="cursor-pointer px-3 py-2" onClick={() => toggleSort("date")}>
                      Date <SortIcon field="date" />
                    </th>
                    <th className="px-3 py-2">Description</th>
                    <th className="cursor-pointer px-3 py-2 text-right" onClick={() => toggleSort("amount")}>
                      Amount <SortIcon field="amount" />
                    </th>
                    <th className="px-3 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBankTxs.map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => toggleBankSelection(tx.id)}
                      className={`cursor-pointer border-b border-border transition-colors ${
                        selectedBankIds.has(tx.id) ? "bg-accent/10" : "hover:bg-sidebar-hover"
                      }`}
                    >
                      <td className="px-4 py-2.5">
                        <input
                          type="checkbox"
                          checked={selectedBankIds.has(tx.id)}
                          onChange={() => toggleBankSelection(tx.id)}
                          className="h-3.5 w-3.5 rounded border-border accent-accent"
                        />
                      </td>
                      <td className="px-3 py-2.5 text-muted">{tx.date}</td>
                      <td className="px-3 py-2.5 text-foreground">{tx.description}</td>
                      <td className={`px-3 py-2.5 text-right font-mono ${tx.amount < 0 ? "text-red-400" : "text-green-400"}`}>
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <StatusBadge status={tx.status} />
                      </td>
                    </tr>
                  ))}
                  {filteredBankTxs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted">
                        No {activeTab} bank transactions
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              /* Matched tab - grouped view */
              <div className="divide-y divide-border">
                {matchedGroups.map((group) => (
                  <div
                    key={group.bank.id}
                    onClick={() => toggleBankSelection(group.bank.id)}
                    className={`cursor-pointer p-4 transition-colors ${
                      selectedBankIds.has(group.bank.id) ? "bg-accent/10" : "hover:bg-sidebar-hover"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedBankIds.has(group.bank.id)}
                          onChange={() => toggleBankSelection(group.bank.id)}
                          className="h-3.5 w-3.5 rounded border-border accent-accent"
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">{group.bank.description}</p>
                          <p className="text-xs text-muted">{group.bank.date} &middot; {group.bank.id}</p>
                        </div>
                      </div>
                      <span className={`font-mono text-sm ${group.bank.amount < 0 ? "text-red-400" : "text-green-400"}`}>
                        {formatCurrency(group.bank.amount)}
                      </span>
                    </div>
                    {group.rillet.length > 0 && (
                      <div className="ml-8 mt-2 space-y-1">
                        {group.rillet.map((r) => (
                          <div key={r.id} className="flex items-center justify-between text-xs text-muted">
                            <span>↳ {r.description} ({r.glAccount})</span>
                            <span className="font-mono">{formatCurrency(r.amount)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {matchedGroups.length === 0 && (
                  <div className="px-4 py-8 text-center text-muted">No matched transactions yet</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Rillet Transactions */}
        <div className="flex w-1/2 flex-col">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">Rillet Transactions</h2>
          </div>

          <div className="flex-1 overflow-auto">
            {activeTab === "unmatched" && selectedBankIds.size === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sidebar">
                    <svg className="h-6 w-6 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted">Select a bank transaction to see matching entries</p>
                </div>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b border-border text-left text-xs text-muted">
                    <th className="w-8 px-4 py-2" />
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Description</th>
                    <th className="px-3 py-2">GL Account</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {suggestedRillet.map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => toggleRilletSelection(tx.id)}
                      className={`cursor-pointer border-b border-border transition-colors ${
                        selectedRilletIds.has(tx.id) ? "bg-accent/10" : "hover:bg-sidebar-hover"
                      }`}
                    >
                      <td className="px-4 py-2.5">
                        <input
                          type="checkbox"
                          checked={selectedRilletIds.has(tx.id)}
                          onChange={() => toggleRilletSelection(tx.id)}
                          className="h-3.5 w-3.5 rounded border-border accent-accent"
                        />
                      </td>
                      <td className="px-3 py-2.5 text-muted">{tx.date}</td>
                      <td className="px-3 py-2.5 text-foreground">{tx.description}</td>
                      <td className="px-3 py-2.5 text-muted">{tx.glAccount}</td>
                      <td className={`px-3 py-2.5 text-right font-mono ${tx.amount < 0 ? "text-red-400" : "text-green-400"}`}>
                        {formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  ))}
                  {suggestedRillet.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted">
                        No matching Rillet transactions
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ── Action Bar ── */}
      <div className="flex items-center justify-between border-t border-border bg-sidebar px-6 py-3">
        <div className="flex items-center gap-2 text-xs text-muted">
          {selectedBankIds.size > 0 && (
            <span>{selectedBankIds.size} bank tx selected</span>
          )}
          {selectedBankIds.size > 0 && selectedRilletIds.size > 0 && <span>&middot;</span>}
          {selectedRilletIds.size > 0 && (
            <span>{selectedRilletIds.size} Rillet tx selected</span>
          )}
        </div>

        <div className="flex gap-2">
          {activeTab === "unmatched" ? (
            <>
              <Button variant="secondary" size="sm" onClick={() => setQuickEntryOpen(true)}>
                Quick Entry
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={!canTransfer}
                onClick={handleTransfer}
              >
                Transfer
              </Button>
              <Button variant="secondary" size="sm" disabled={!canMatch}>
                Match &amp; Adjust
              </Button>
              <Button size="sm" disabled={!canMatch} onClick={handleMatch}>
                Match
              </Button>
            </>
          ) : (
            <Button variant="secondary" size="sm" disabled={!canUnmatch} onClick={handleUnmatch}>
              Unmatch
            </Button>
          )}
        </div>
      </div>

      {/* ── Quick Entry Modal ── */}
      <Modal isOpen={quickEntryOpen} onClose={() => setQuickEntryOpen(false)} title="Quick Entry" size="md">
        <div className="space-y-4">
          <Select
            label="Payer Type"
            options={[
              { value: "customer", label: "Customer" },
              { value: "vendor", label: "Vendor" },
              { value: "other", label: "Other" },
            ]}
            value={qePayerType}
            onChange={(e) => setQePayerType(e.target.value)}
          />
          <Input
            label={qePayerType === "vendor" ? "Vendor Name" : "Customer Name"}
            placeholder={`Enter ${qePayerType} name…`}
            value={qePayerName}
            onChange={(e) => setQePayerName(e.target.value)}
          />
          <Select
            label="GL Account"
            options={GL_ACCOUNTS}
            placeholder="Select account…"
            value={qeGlAccount}
            onChange={(e) => setQeGlAccount(e.target.value)}
          />
          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            value={qeAmount}
            onChange={(e) => setQeAmount(e.target.value)}
          />
          <Input
            label="Description"
            placeholder="Enter description…"
            value={qeDescription}
            onChange={(e) => setQeDescription(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setQuickEntryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleQuickEntry}>Create and Match</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

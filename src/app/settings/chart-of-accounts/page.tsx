"use client";

import { useState } from "react";
import { Button, Input, Select, Modal } from "@/components/ui";
import { ACCOUNT_TYPES, ACCOUNT_SUBTYPES, MOCK_ACCOUNTS } from "@/lib/mock-data";

export default function ChartOfAccountsPage() {
  const [accounts, setAccounts] = useState(MOCK_ACCOUNTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    number: "",
    name: "",
    type: "",
    subtype: "",
  });

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.number || !form.name || !form.type) return;
    setAccounts((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        number: form.number,
        name: form.name,
        type: form.type,
        subtype: form.subtype || "",
        active: true,
      },
    ]);
    setForm({ number: "", name: "", type: "", subtype: "" });
    setModalOpen(false);
  };

  const subtypes = form.type ? (ACCOUNT_SUBTYPES[form.type] || []) : [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Chart of Accounts</h1>
          <p className="mt-1 text-sm text-muted">
            Add accounts with Number, Name, Type, Subtype, and optional links (Prepaid, Bank)
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>+ Add Account</Button>
      </div>

      <div className="rounded-lg border border-border bg-sidebar">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-left text-sm text-muted">
              <th className="px-4 py-3 font-medium">Number</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Subtype</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acct) => (
              <tr
                key={acct.id}
                className="border-b border-border last:border-0 transition-colors hover:bg-sidebar-hover"
              >
                <td className="px-4 py-3 font-mono text-sm text-foreground">{acct.number}</td>
                <td className="px-4 py-3 font-medium text-foreground">{acct.name}</td>
                <td className="px-4 py-3 text-muted">{acct.type}</td>
                <td className="px-4 py-3 text-muted">{acct.subtype}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      acct.active ? "bg-green-500/20 text-green-400" : "bg-muted/30 text-muted"
                    }`}
                  >
                    {acct.active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Account" size="md">
        <form onSubmit={handleAddAccount} className="space-y-4">
          <Input
            label="Account Number"
            value={form.number}
            onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
            placeholder="e.g. 1000"
            required
          />
          <Input
            label="Account Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Cash"
            required
          />
          <Select
            label="Type"
            options={ACCOUNT_TYPES.map((t) => ({ value: t.value, label: t.label }))}
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value, subtype: "" }))}
            placeholder="Select type"
            required
          />
          {subtypes.length > 0 && (
            <Select
              label="Subtype"
              options={subtypes}
              value={form.subtype}
              onChange={(e) => setForm((f) => ({ ...f, subtype: e.target.value }))}
              placeholder="Optional"
            />
          )}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Account</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

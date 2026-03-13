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
          <h1 className="mx-h1">Chart of Accounts</h1>
          <p className="mt-1 text-sm mx-text-secondary">
            Add accounts with Number, Name, Type, Subtype, and optional links (Prepaid, Bank)
          </p>
        </div>
        <button className="mx-btn-primary" onClick={() => setModalOpen(true)}>+ Add Account</button>
      </div>

      <div className="mx-table-container">
        <table className="mx-table">
          <thead>
            <tr>
              <th>Number</th>
              <th>Name</th>
              <th>Type</th>
              <th>Subtype</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acct) => (
              <tr key={acct.id} className="hover:bg-gray-50">
                <td className="font-mono text-sm">{acct.number}</td>
                <td className="font-medium">{acct.name}</td>
                <td className="mx-text-secondary">{acct.type}</td>
                <td className="mx-text-secondary">{acct.subtype}</td>
                <td>
                  <span className={acct.active ? "mx-tag mx-tag-success" : "mx-tag"}>
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
            <button type="button" className="mx-btn-default" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="mx-btn-primary">Add Account</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

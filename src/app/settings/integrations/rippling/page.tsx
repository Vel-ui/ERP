"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Select } from "@/components/ui";

type Provider = "rippling" | "gusto";

const GL_ACCOUNTS = [
  { value: "2100", label: "2100 - Payroll Liabilities" },
  { value: "2110", label: "2110 - Accrued Wages" },
  { value: "2120", label: "2120 - Payroll Tax Payable" },
  { value: "5100", label: "5100 - Salaries & Wages" },
  { value: "5110", label: "5110 - Payroll Taxes" },
  { value: "5120", label: "5120 - Benefits Expense" },
  { value: "5130", label: "5130 - Bonus Expense" },
  { value: "5140", label: "5140 - Commission Expense" },
  { value: "5150", label: "5150 - PTO Expense" },
  { value: "5160", label: "5160 - Contractor Payments" },
];

const DEPARTMENTS = [
  { value: "engineering", label: "Engineering" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "finance", label: "Finance" },
  { value: "operations", label: "Operations" },
  { value: "hr", label: "Human Resources" },
  { value: "product", label: "Product" },
  { value: "support", label: "Customer Support" },
];

const DEPT_MAPPINGS_INITIAL = [
  { source: "Engineering", mapped: "engineering" },
  { source: "Sales", mapped: "sales" },
  { source: "Marketing", mapped: "marketing" },
  { source: "Finance", mapped: "finance" },
  { source: "Operations", mapped: "operations" },
  { source: "People Ops", mapped: "hr" },
  { source: "Product", mapped: "product" },
  { source: "Support", mapped: "support" },
];

const PAY_TYPES = [
  { type: "Regular Salary", liabilityAccount: "2110", expenseAccount: "5100" },
  { type: "Hourly Wages", liabilityAccount: "2110", expenseAccount: "5100" },
  { type: "Bonus", liabilityAccount: "2110", expenseAccount: "5130" },
  { type: "Commission", liabilityAccount: "2110", expenseAccount: "5140" },
  { type: "PTO Payout", liabilityAccount: "2110", expenseAccount: "5150" },
  { type: "Payroll Taxes", liabilityAccount: "2120", expenseAccount: "5110" },
  { type: "Benefits", liabilityAccount: "2100", expenseAccount: "5120" },
];

export default function RipplingGustoSetupPage() {
  const [provider, setProvider] = useState<Provider>("rippling");
  const [connected, setConnected] = useState(false);
  const [saved, setSaved] = useState(false);

  const [syncFromDate, setSyncFromDate] = useState("2025-01-01");
  const [payrollLiabilityAccount, setPayrollLiabilityAccount] = useState("2100");
  const [deptMappings, setDeptMappings] = useState(DEPT_MAPPINGS_INITIAL);
  const [payTypes, setPayTypes] = useState(PAY_TYPES);
  const [employeeAllocation, setEmployeeAllocation] = useState(false);
  const [jeOnFinalize, setJeOnFinalize] = useState(true);

  const handleDeptChange = (idx: number, value: string) => {
    setDeptMappings((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, mapped: value } : m))
    );
  };

  const handlePayTypeChange = (idx: number, field: "liabilityAccount" | "expenseAccount", value: string) => {
    setPayTypes((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: () => void; label: string; description?: string }) {
    return (
      <label className="flex items-center justify-between rounded-md border border-border px-4 py-3 transition-colors hover:bg-gray-50">
        <div>
          <p className="text-sm font-medium">{label}</p>
          {description && <p className="text-xs mx-text-secondary">{description}</p>}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={onChange}
          className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors"
          style={{ backgroundColor: checked ? 'var(--mx-primary)' : 'var(--mx-border)' }}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
              checked ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </label>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <nav className="mx-breadcrumb">
          <Link href="/settings/integrations" className="mx-breadcrumb-item mx-text-link">
            Integrations
          </Link>
          <span className="mx-breadcrumb-separator">/</span>
          <span className="mx-breadcrumb-item">{provider === "rippling" ? "Rippling" : "Gusto"}</span>
        </nav>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="mx-h1">
              {provider === "rippling" ? "Rippling" : "Gusto"}
            </h1>
            <p className="mt-1 text-sm mx-text-secondary">
              Payroll integration for automated journal entries and department allocation.
            </p>
          </div>
          <div className="flex gap-2">
            {connected ? (
              <Button variant="default" onClick={() => setConnected(false)}>
                Disconnect
              </Button>
            ) : (
              <Button onClick={() => setConnected(true)}>Connect</Button>
            )}
          </div>
        </div>
        {connected && (
          <div className="mt-3 inline-flex">
            <span className="mx-tag mx-tag-success inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: 'var(--mx-success)' }} />
              Connected
            </span>
          </div>
        )}
      </div>

      <div className="mb-6 mx-segmented inline-flex">
        <button
          onClick={() => setProvider("rippling")}
          className={`mx-segmented-item ${provider === "rippling" ? "mx-segmented-item-selected" : ""}`}
        >
          Rippling
        </button>
        <button
          onClick={() => setProvider("gusto")}
          className={`mx-segmented-item ${provider === "gusto" ? "mx-segmented-item-selected" : ""}`}
        >
          Gusto
        </button>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="mx-card mx-card-white p-6">
          <h3 className="mb-4 mx-h4">Sync Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Sync From Date</label>
              <input
                type="date"
                value={syncFromDate}
                onChange={(e) => setSyncFromDate(e.target.value)}
                className="mx-input"
              />
            </div>
            <Select
              label="Payroll Liability Account"
              options={GL_ACCOUNTS}
              value={payrollLiabilityAccount}
              onChange={(e) => setPayrollLiabilityAccount(e.target.value)}
            />
          </div>
        </div>

        <div className="mx-card mx-card-white p-6">
          <h3 className="mb-2 mx-h4">Department Mapping</h3>
          <p className="mb-4 text-xs mx-text-secondary">
            All departments must be mapped for payroll journal entries to post correctly.
          </p>
          <div className="mx-table-container">
            <table className="mx-table w-full">
              <thead>
                <tr>
                  <th className="px-4 py-3">
                    {provider === "rippling" ? "Rippling" : "Gusto"} Department
                  </th>
                  <th className="px-4 py-3">Maximor Department</th>
                  <th className="px-4 py-3 text-center">Required</th>
                </tr>
              </thead>
              <tbody>
                {deptMappings.map((mapping, idx) => (
                  <tr key={mapping.source}>
                    <td className="px-4 py-3 text-sm">{mapping.source}</td>
                    <td className="px-4 py-3">
                      <select
                        value={mapping.mapped}
                        onChange={(e) => handleDeptChange(idx, e.target.value)}
                        className="mx-select w-full"
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full text-xs"
                        style={{ background: 'var(--mx-primary-bg)', color: 'var(--mx-primary)' }}
                      >
                        ✓
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mx-card mx-card-white p-6">
          <h3 className="mb-2 mx-h4">Pay Type Allocations</h3>
          <p className="mb-4 text-xs mx-text-secondary">
            Map each pay type to its default liability and expense accounts. Department overrides apply when set.
          </p>
          <div className="mx-table-container">
            <table className="mx-table w-full">
              <thead>
                <tr>
                  <th className="px-4 py-3">Pay Type</th>
                  <th className="px-4 py-3">Liability Default</th>
                  <th className="px-4 py-3">Expense Default</th>
                </tr>
              </thead>
              <tbody>
                {payTypes.map((pt, idx) => (
                  <tr key={pt.type}>
                    <td className="px-4 py-3 text-sm font-medium">{pt.type}</td>
                    <td className="px-4 py-3">
                      <select
                        value={pt.liabilityAccount}
                        onChange={(e) => handlePayTypeChange(idx, "liabilityAccount", e.target.value)}
                        className="mx-select w-full"
                      >
                        {GL_ACCOUNTS.filter((a) => a.value.startsWith("2")).map((a) => (
                          <option key={a.value} value={a.value}>{a.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={pt.expenseAccount}
                        onChange={(e) => handlePayTypeChange(idx, "expenseAccount", e.target.value)}
                        className="mx-select w-full"
                      >
                        {GL_ACCOUNTS.filter((a) => a.value.startsWith("5")).map((a) => (
                          <option key={a.value} value={a.value}>{a.label}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mx-card mx-card-white p-6">
          <h3 className="mb-4 mx-h4">Automation</h3>
          <div className="space-y-2">
            <Toggle
              checked={employeeAllocation}
              onChange={() => setEmployeeAllocation(!employeeAllocation)}
              label="Employee-Level Allocation"
              description="Allocate payroll expenses per employee instead of department totals"
            />
            <Toggle
              checked={jeOnFinalize}
              onChange={() => setJeOnFinalize(!jeOnFinalize)}
              label="Create JE on Finalized Payroll"
              description="Automatically create a journal entry when payroll is finalized"
            />
          </div>
          {jeOnFinalize && (
            <div className="mt-4 rounded-md border border-border bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
                  style={{ background: 'var(--mx-primary-bg)' }}
                >
                  ⚡
                </div>
                <div>
                  <p className="text-sm font-medium">Quick Entry Matching</p>
                  <p className="text-xs mx-text-secondary">
                    Payroll JEs will match against Quick Entry templates. Ensure your payroll template
                    includes department tags for proper allocation.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pb-8">
          <Button variant="default" onClick={() => window.history.back()}>Cancel</Button>
          <Button onClick={handleSave}>
            {saved ? "Saved!" : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button, Input, Select } from "@/components/ui";

const GL_ACCOUNTS = [
  { value: "1010", label: "1010 - Cash" },
  { value: "1100", label: "1100 - Accounts Receivable" },
  { value: "2000", label: "2000 - Accounts Payable" },
  { value: "2010", label: "2010 - Credit Card Payable" },
  { value: "2020", label: "2020 - Reimbursements Payable" },
  { value: "5000", label: "5000 - Cost of Goods Sold" },
  { value: "6000", label: "6000 - Office Supplies" },
  { value: "6100", label: "6100 - Software & SaaS" },
  { value: "6200", label: "6200 - Travel & Meals" },
  { value: "6300", label: "6300 - Marketing" },
  { value: "6400", label: "6400 - Professional Services" },
  { value: "6500", label: "6500 - Mileage Expense" },
  { value: "6600", label: "6600 - Utilities" },
  { value: "6700", label: "6700 - Insurance" },
  { value: "7000", label: "7000 - Miscellaneous Expense" },
];

const ENTITIES = [
  { value: "sub-1", label: "Maximor US" },
  { value: "sub-2", label: "Maximor UK" },
  { value: "sub-3", label: "Maximor Europe" },
];

const DEPARTMENTS = [
  { value: "engineering", label: "Engineering" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "finance", label: "Finance" },
  { value: "operations", label: "Operations" },
  { value: "hr", label: "Human Resources" },
];

const LOCATIONS = [
  { value: "sf", label: "San Francisco" },
  { value: "nyc", label: "New York" },
  { value: "london", label: "London" },
  { value: "berlin", label: "Berlin" },
];

const CATEGORY_MAPPINGS = [
  { category: "Software & SaaS", glAccount: "6100" },
  { category: "Travel & Meals", glAccount: "6200" },
  { category: "Marketing", glAccount: "6300" },
  { category: "Office Supplies", glAccount: "6000" },
  { category: "Professional Services", glAccount: "6400" },
  { category: "Utilities", glAccount: "6600" },
];

const DEPT_MAPPINGS = [
  { rampDept: "Engineering", maximorDept: "engineering" },
  { rampDept: "Sales", maximorDept: "sales" },
  { rampDept: "Marketing", maximorDept: "marketing" },
  { rampDept: "Finance", maximorDept: "finance" },
  { rampDept: "Operations", maximorDept: "operations" },
];

type Provider = "ramp" | "brex";

function RampBrexContent() {
  const searchParams = useSearchParams();
  const providerParam = searchParams.get("provider");
  const [provider, setProvider] = useState<Provider>(
    providerParam === "brex" ? "brex" : "ramp"
  );
  const [connected, setConnected] = useState(false);
  const [saved, setSaved] = useState(false);

  const [syncFromDate, setSyncFromDate] = useState("2025-01-01");
  const [selectedEntities, setSelectedEntities] = useState<string[]>(["sub-1"]);
  const [reimbursementVendor, setReimbursementVendor] = useState("vendor");
  const [creditCardAccount, setCreditCardAccount] = useState("2010");
  const [reimbursementAccount, setReimbursementAccount] = useState("2020");
  const [mileageVendor, setMileageVendor] = useState("");
  const [mileageAccount, setMileageAccount] = useState("6500");
  const [categoryMappings, setCategoryMappings] = useState(CATEGORY_MAPPINGS);
  const [deptMappings, setDeptMappings] = useState(DEPT_MAPPINGS);

  const [brexStep, setBrexStep] = useState(1);

  const handleEntityToggle = (entityId: string) => {
    setSelectedEntities((prev) =>
      prev.includes(entityId)
        ? prev.filter((e) => e !== entityId)
        : [...prev, entityId]
    );
  };

  const handleCategoryChange = (idx: number, value: string) => {
    setCategoryMappings((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, glAccount: value } : m))
    );
  };

  const handleDeptChange = (idx: number, value: string) => {
    setDeptMappings((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, maximorDept: value } : m))
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <nav className="mx-breadcrumb">
          <Link href="/settings/integrations" className="mx-breadcrumb-item mx-text-link">
            Integrations
          </Link>
          <span className="mx-breadcrumb-separator">/</span>
          <span className="mx-breadcrumb-item">{provider === "ramp" ? "Ramp" : "Brex"}</span>
        </nav>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="mx-h1">
              {provider === "ramp" ? "Ramp" : "Brex"}
            </h1>
            <p className="mt-1 text-sm mx-text-secondary">
              {provider === "ramp"
                ? "Corporate card charges, bills, and reimbursements."
                : "Corporate card charges and vendor management."}
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
              Connected &middot; Syncs hourly
            </span>
          </div>
        )}
      </div>

      <div className="mb-6 mx-segmented inline-flex">
        <button
          onClick={() => setProvider("ramp")}
          className={`mx-segmented-item ${provider === "ramp" ? "mx-segmented-item-selected" : ""}`}
        >
          Ramp
        </button>
        <button
          onClick={() => setProvider("brex")}
          className={`mx-segmented-item ${provider === "brex" ? "mx-segmented-item-selected" : ""}`}
        >
          Brex
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
            <div>
              <label className="mb-2 block text-sm font-medium">Entity Mapping</label>
              <div className="space-y-2">
                {ENTITIES.map((entity) => (
                  <label
                    key={entity.value}
                    className="flex items-center gap-3 rounded-md border border-border px-4 py-2.5 transition-colors hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedEntities.includes(entity.value)}
                      onChange={() => handleEntityToggle(entity.value)}
                      className="h-4 w-4 rounded border-border"
                      style={{ accentColor: 'var(--mx-primary)' }}
                    />
                    <span className="text-sm">{entity.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {provider === "ramp" && (
          <>
            <div className="mx-card mx-card-white p-6">
              <h3 className="mb-4 mx-h4">Ramp Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Reimbursement Vendor Type
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: "vendor", label: "Vendor" },
                      { value: "employee", label: "Employee" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setReimbursementVendor(opt.value)}
                        className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                          reimbursementVendor === opt.value
                            ? "border-[#154738]"
                            : "border-border mx-text-secondary hover:bg-gray-50"
                        }`}
                        style={reimbursementVendor === opt.value ? { background: 'var(--mx-primary-bg)', color: 'var(--mx-primary)' } : undefined}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <Select
                  label="Credit Card Account"
                  options={GL_ACCOUNTS}
                  value={creditCardAccount}
                  onChange={(e) => setCreditCardAccount(e.target.value)}
                />
                <Select
                  label="Reimbursement Account"
                  options={GL_ACCOUNTS}
                  value={reimbursementAccount}
                  onChange={(e) => setReimbursementAccount(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Mileage Vendor"
                    placeholder="e.g. IRS Standard Rate"
                    value={mileageVendor}
                    onChange={(e) => setMileageVendor(e.target.value)}
                  />
                  <Select
                    label="Mileage Account"
                    options={GL_ACCOUNTS}
                    value={mileageAccount}
                    onChange={(e) => setMileageAccount(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mx-card mx-card-white p-6">
              <h3 className="mb-4 mx-h4">Category → GL Account Mapping</h3>
              <div className="mx-table-container">
                <table className="mx-table w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">GL Account</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categoryMappings.map((mapping, idx) => (
                      <tr key={mapping.category}>
                        <td className="px-4 py-3 text-sm">{mapping.category}</td>
                        <td className="px-4 py-3">
                          <select
                            value={mapping.glAccount}
                            onChange={(e) => handleCategoryChange(idx, e.target.value)}
                            className="mx-select w-full"
                          >
                            {GL_ACCOUNTS.map((a) => (
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
              <h3 className="mb-4 mx-h4">Department Mapping</h3>
              <div className="mx-table-container">
                <table className="mx-table w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-3">Ramp Department</th>
                      <th className="px-4 py-3">Maximor Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deptMappings.map((mapping, idx) => (
                      <tr key={mapping.rampDept}>
                        <td className="px-4 py-3 text-sm">{mapping.rampDept}</td>
                        <td className="px-4 py-3">
                          <select
                            value={mapping.maximorDept}
                            onChange={(e) => handleDeptChange(idx, e.target.value)}
                            className="mx-select w-full"
                          >
                            {DEPARTMENTS.map((d) => (
                              <option key={d.value} value={d.value}>{d.label}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {provider === "brex" && (
          <div className="mx-card mx-card-white p-6">
            <h3 className="mb-4 mx-h4">Brex Setup Steps</h3>
            <div className="mb-6 flex gap-1">
              {[1, 2, 3, 4].map((step) => (
                <button
                  key={step}
                  onClick={() => setBrexStep(step)}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    brexStep === step
                      ? "text-white"
                      : brexStep > step
                      ? ""
                      : "bg-gray-100 mx-text-secondary"
                  }`}
                  style={
                    brexStep === step
                      ? { backgroundColor: 'var(--mx-primary)' }
                      : brexStep > step
                      ? { background: 'var(--mx-primary-bg)', color: 'var(--mx-primary)' }
                      : undefined
                  }
                >
                  Step {step}
                </button>
              ))}
            </div>

            {brexStep === 1 && (
              <div className="space-y-4">
                <h4 className="mx-h4">Sync & Account Settings</h4>
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
                  label="Credit Card Account"
                  options={GL_ACCOUNTS}
                  value={creditCardAccount}
                  onChange={(e) => setCreditCardAccount(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button onClick={() => setBrexStep(2)}>Next</Button>
                </div>
              </div>
            )}

            {brexStep === 2 && (
              <div className="space-y-4">
                <h4 className="mx-h4">Category → GL Mapping</h4>
                <div className="mx-table-container">
                  <table className="mx-table w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">GL Account</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryMappings.map((mapping, idx) => (
                        <tr key={mapping.category}>
                          <td className="px-4 py-3 text-sm">{mapping.category}</td>
                          <td className="px-4 py-3">
                            <select
                              value={mapping.glAccount}
                              onChange={(e) => handleCategoryChange(idx, e.target.value)}
                              className="mx-select w-full"
                            >
                              {GL_ACCOUNTS.map((a) => (
                                <option key={a.value} value={a.value}>{a.label}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between">
                  <Button variant="default" onClick={() => setBrexStep(1)}>Back</Button>
                  <Button onClick={() => setBrexStep(3)}>Next</Button>
                </div>
              </div>
            )}

            {brexStep === 3 && (
              <div className="space-y-4">
                <h4 className="mx-h4">Department Mapping</h4>
                <div className="mx-table-container">
                  <table className="mx-table w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-3">Brex Department</th>
                        <th className="px-4 py-3">Maximor Department</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deptMappings.map((mapping, idx) => (
                        <tr key={mapping.rampDept}>
                          <td className="px-4 py-3 text-sm">{mapping.rampDept}</td>
                          <td className="px-4 py-3">
                            <select
                              value={mapping.maximorDept}
                              onChange={(e) => handleDeptChange(idx, e.target.value)}
                              className="mx-select w-full"
                            >
                              {DEPARTMENTS.map((d) => (
                                <option key={d.value} value={d.value}>{d.label}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between">
                  <Button variant="default" onClick={() => setBrexStep(2)}>Back</Button>
                  <Button onClick={() => setBrexStep(4)}>Next</Button>
                </div>
              </div>
            )}

            {brexStep === 4 && (
              <div className="space-y-4">
                <h4 className="mx-h4">Location Mapping</h4>
                <div className="mx-table-container">
                  <table className="mx-table w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-3">Brex Location</th>
                        <th className="px-4 py-3">Maximor Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {LOCATIONS.map((loc) => (
                        <tr key={loc.value}>
                          <td className="px-4 py-3 text-sm">{loc.label}</td>
                          <td className="px-4 py-3">
                            <select
                              defaultValue={loc.value}
                              className="mx-select w-full"
                            >
                              {LOCATIONS.map((l) => (
                                <option key={l.value} value={l.value}>{l.label}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between">
                  <Button variant="default" onClick={() => setBrexStep(3)}>Back</Button>
                  <Button onClick={handleSave}>{saved ? "Saved!" : "Finish Setup"}</Button>
                </div>
              </div>
            )}
          </div>
        )}

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

export default function RampBrexSetupPage() {
  return (
    <Suspense fallback={<div style={{padding:24}}>Loading...</div>}>
      <RampBrexContent />
    </Suspense>
  );
}

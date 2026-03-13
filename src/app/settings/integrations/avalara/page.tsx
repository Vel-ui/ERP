"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input, Select } from "@/components/ui";

type Provider = "avalara" | "anrok";

const ENVIRONMENTS = [
  { value: "sandbox", label: "Sandbox" },
  { value: "production", label: "Production" },
];

const COMPANIES = [
  { value: "comp-1", label: "Maximor Inc. (US)" },
  { value: "comp-2", label: "Maximor Ltd. (UK)" },
  { value: "comp-3", label: "Maximor GmbH (EU)" },
];

const PRODUCT_MAPPINGS_INITIAL = [
  { rilletProduct: "SaaS Platform - Annual", anrokProductId: "saas-annual-001" },
  { rilletProduct: "SaaS Platform - Monthly", anrokProductId: "saas-monthly-001" },
  { rilletProduct: "Professional Services", anrokProductId: "ps-001" },
  { rilletProduct: "Implementation Fee", anrokProductId: "impl-001" },
];

export default function AvalaraAnrokSetupPage() {
  const [provider, setProvider] = useState<Provider>("avalara");
  const [connected, setConnected] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null);

  const [avalaraEnv, setAvalaraEnv] = useState("sandbox");
  const [avalaraAccount, setAvalaraAccount] = useState("2000123456");
  const [avalaraLicense, setAvalaraLicense] = useState("");
  const [avalaraCompany, setAvalaraCompany] = useState("comp-1");
  const [syncFromDate, setSyncFromDate] = useState("2025-01-01");
  const [documentRecording, setDocumentRecording] = useState(true);
  const [documentCommitting, setDocumentCommitting] = useState(false);
  const [loggingEnabled, setLoggingEnabled] = useState(true);

  const [anrokApiKey, setAnrokApiKey] = useState("");
  const [anrokSyncFrom, setAnrokSyncFrom] = useState("2025-01-01");
  const [productMappings, setProductMappings] = useState(PRODUCT_MAPPINGS_INITIAL);
  const [minCommitmentTaxCode, setMinCommitmentTaxCode] = useState("SW054000");

  const handleProductMappingChange = (idx: number, value: string) => {
    setProductMappings((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, anrokProductId: value } : m))
    );
  };

  const handleTestConnect = () => {
    setTestResult(null);
    setTimeout(() => {
      setTestResult(avalaraLicense.length > 0 ? "success" : "error");
    }, 1000);
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
          <span className="mx-breadcrumb-item">{provider === "avalara" ? "Avalara" : "Anrok"}</span>
        </nav>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="mx-h1">
              {provider === "avalara" ? "Avalara" : "Anrok"}
            </h1>
            <p className="mt-1 text-sm mx-text-secondary">
              {provider === "avalara"
                ? "Automated tax calculation and compliance for invoices and transactions."
                : "Tax calculation engine for SaaS invoices and subscriptions."}
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
          onClick={() => setProvider("avalara")}
          className={`mx-segmented-item ${provider === "avalara" ? "mx-segmented-item-selected" : ""}`}
        >
          Avalara
        </button>
        <button
          onClick={() => setProvider("anrok")}
          className={`mx-segmented-item ${provider === "anrok" ? "mx-segmented-item-selected" : ""}`}
        >
          Anrok
        </button>
      </div>

      <div className="max-w-3xl space-y-6">
        {provider === "avalara" && (
          <>
            <div className="mx-card mx-card-white p-6">
              <h3 className="mb-4 mx-h4">Connection Settings</h3>
              <div className="space-y-4">
                <Select
                  label="Environment"
                  options={ENVIRONMENTS}
                  value={avalaraEnv}
                  onChange={(e) => setAvalaraEnv(e.target.value)}
                />
                <Input
                  label="Account Number"
                  value={avalaraAccount}
                  onChange={(e) => setAvalaraAccount(e.target.value)}
                  placeholder="e.g. 2000123456"
                />
                <Input
                  label="License Key"
                  type="password"
                  value={avalaraLicense}
                  onChange={(e) => setAvalaraLicense(e.target.value)}
                  placeholder="Enter your Avalara license key"
                />
                <div className="flex items-center gap-3">
                  <Button variant="default" onClick={handleTestConnect}>
                    Test Connection
                  </Button>
                  {testResult === "success" && (
                    <span className="text-sm" style={{ color: 'var(--mx-success)' }}>Connection successful</span>
                  )}
                  {testResult === "error" && (
                    <span className="text-sm" style={{ color: 'var(--mx-error)' }}>Connection failed — check credentials</span>
                  )}
                </div>
                <Select
                  label="Company"
                  options={COMPANIES}
                  value={avalaraCompany}
                  onChange={(e) => setAvalaraCompany(e.target.value)}
                />
              </div>
            </div>

            <div className="mx-card mx-card-white p-6">
              <h3 className="mb-4 mx-h4">Sync & Recording</h3>
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
                <div className="space-y-2">
                  <Toggle
                    checked={documentRecording}
                    onChange={() => setDocumentRecording(!documentRecording)}
                    label="Document Recording"
                    description="Record tax documents in Avalara for audit trail"
                  />
                  <Toggle
                    checked={documentCommitting}
                    onChange={() => setDocumentCommitting(!documentCommitting)}
                    label="Document Committing"
                    description="Commit tax documents to Avalara for filing"
                  />
                  <Toggle
                    checked={loggingEnabled}
                    onChange={() => setLoggingEnabled(!loggingEnabled)}
                    label="API Logging"
                    description="Log all Avalara API calls for debugging"
                  />
                </div>
              </div>
            </div>

            <div className="mx-card mx-card-white p-6">
              <h3 className="mb-2 mx-h4">Invoice Commit Workflow</h3>
              <p className="mb-4 text-xs mx-text-secondary">
                How invoices are committed to Avalara for tax filing.
              </p>
              <div className="space-y-3">
                {[
                  { step: 1, title: "Invoice Created", desc: "Tax is calculated via Avalara API and recorded on the invoice." },
                  { step: 2, title: "Invoice Approved", desc: "Invoice enters the approval workflow. Tax amounts are locked." },
                  { step: 3, title: "Invoice Sent", desc: "Document is committed to Avalara. Tax becomes reportable." },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="flex items-start gap-4 rounded-md border border-border px-4 py-3"
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium"
                      style={{ background: 'var(--mx-primary-bg)', color: 'var(--mx-primary)' }}
                    >
                      {item.step}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs mx-text-secondary">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {provider === "anrok" && (
          <>
            <div className="mx-card mx-card-white p-6">
              <h3 className="mb-4 mx-h4">API Configuration</h3>
              <div className="space-y-4">
                <Input
                  label="API Key"
                  type="password"
                  value={anrokApiKey}
                  onChange={(e) => setAnrokApiKey(e.target.value)}
                  placeholder="Enter your Anrok API key"
                />
                <div>
                  <label className="mb-1 block text-sm font-medium">Sync From Date</label>
                  <input
                    type="date"
                    value={anrokSyncFrom}
                    onChange={(e) => setAnrokSyncFrom(e.target.value)}
                    className="mx-input"
                  />
                </div>
              </div>
            </div>

            <div className="mx-card mx-card-white p-6">
              <h3 className="mb-2 mx-h4">Product ID Mapping</h3>
              <p className="mb-4 text-xs mx-text-secondary">
                Map Maximor products to Anrok product identifiers for accurate tax categorization.
              </p>
              <div className="mx-table-container">
                <table className="mx-table w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-3">Maximor Product</th>
                      <th className="px-4 py-3">Anrok Product ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productMappings.map((mapping, idx) => (
                      <tr key={mapping.rilletProduct}>
                        <td className="px-4 py-3 text-sm">{mapping.rilletProduct}</td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={mapping.anrokProductId}
                            onChange={(e) => handleProductMappingChange(idx, e.target.value)}
                            className="mx-input w-full font-mono"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mx-card mx-card-white p-6">
              <h3 className="mb-4 mx-h4">Minimum Commitments</h3>
              <Input
                label="Tax Code for Minimum Commitments"
                value={minCommitmentTaxCode}
                onChange={(e) => setMinCommitmentTaxCode(e.target.value)}
                placeholder="e.g. SW054000"
              />
              <p className="mt-2 text-xs mx-text-secondary">
                Applied to minimum commitment line items that don&apos;t have a product-specific tax code.
              </p>
            </div>
          </>
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

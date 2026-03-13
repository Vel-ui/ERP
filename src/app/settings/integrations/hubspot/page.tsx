"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Input, Select } from "@/components/ui";

type Provider = "hubspot" | "salesforce";

const REVENUE_ACCOUNTS = [
  { value: "4000", label: "4000 - Revenue" },
  { value: "4100", label: "4100 - Subscription Revenue" },
  { value: "4200", label: "4200 - Professional Services Revenue" },
  { value: "4300", label: "4300 - License Revenue" },
];

const PRODUCTS = [
  { value: "prod-1", label: "SaaS Platform - Annual" },
  { value: "prod-2", label: "SaaS Platform - Monthly" },
  { value: "prod-3", label: "Professional Services" },
  { value: "prod-4", label: "Implementation Fee" },
];

const OBJECT_MAPPINGS = [
  { source: "Companies", target: "Customers" },
  { source: "Products", target: "Products" },
  { source: "Deals", target: "Contracts" },
  { source: "Line Items", target: "Contract Line Items" },
];

const SF_CUSTOM_OBJECTS = [
  { source: "Rillet Invoice", target: "SF Custom Object: Rillet_Invoice__c" },
  { source: "Rillet Contract", target: "SF Custom Object: Rillet_Contract__c" },
  { source: "Rillet Customer", target: "SF Custom Object: Rillet_Customer__c" },
];

export default function HubSpotSalesforceSetupPage() {
  const [provider, setProvider] = useState<Provider>("hubspot");
  const [connected, setConnected] = useState(false);
  const [saved, setSaved] = useState(false);

  const [syncFromDate, setSyncFromDate] = useState("2025-01-01");
  const [revenueAccount, setRevenueAccount] = useState("4100");
  const [defaultProduct, setDefaultProduct] = useState("prod-1");
  const [dealStartField, setDealStartField] = useState("closedate");
  const [dealEndField, setDealEndField] = useState("contract_end_date");
  const [pendingApproval, setPendingApproval] = useState(true);

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
          <span className="mx-breadcrumb-item">{provider === "hubspot" ? "HubSpot" : "Salesforce"}</span>
        </nav>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="mx-h1">
              {provider === "hubspot" ? "HubSpot" : "Salesforce"}
            </h1>
            <p className="mt-1 text-sm mx-text-secondary">
              {provider === "hubspot"
                ? "Sync deals (Closed Won) every 30 minutes to create contracts."
                : "Sync opportunities (Closed Won) with bidirectional custom objects."}
            </p>
          </div>
          <div className="flex gap-2">
            {connected ? (
              <Button variant="default" onClick={() => setConnected(false)}>
                Disconnect
              </Button>
            ) : (
              <Button onClick={() => setConnected(true)}>
                Connect {provider === "hubspot" ? "HubSpot" : "Salesforce"}
              </Button>
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
          onClick={() => setProvider("hubspot")}
          className={`mx-segmented-item ${provider === "hubspot" ? "mx-segmented-item-selected" : ""}`}
        >
          HubSpot
        </button>
        <button
          onClick={() => setProvider("salesforce")}
          className={`mx-segmented-item ${provider === "salesforce" ? "mx-segmented-item-selected" : ""}`}
        >
          Salesforce
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
              label="Revenue Account"
              options={REVENUE_ACCOUNTS}
              value={revenueAccount}
              onChange={(e) => setRevenueAccount(e.target.value)}
            />
            <Select
              label="Default Product"
              options={PRODUCTS}
              value={defaultProduct}
              onChange={(e) => setDefaultProduct(e.target.value)}
            />
          </div>
        </div>

        <div className="mx-card mx-card-white p-6">
          <h3 className="mb-2 mx-h4">Deal Field Mapping</h3>
          <p className="mb-4 text-xs mx-text-secondary">
            Map {provider === "hubspot" ? "HubSpot" : "Salesforce"} deal fields to contract start and end dates.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Deal Start Date Field"
              value={dealStartField}
              onChange={(e) => setDealStartField(e.target.value)}
              placeholder="e.g. closedate"
            />
            <Input
              label="Deal End Date Field"
              value={dealEndField}
              onChange={(e) => setDealEndField(e.target.value)}
              placeholder="e.g. contract_end_date"
            />
          </div>
        </div>

        <div className="mx-card mx-card-white p-6">
          <h3 className="mb-4 mx-h4">Object Mapping</h3>
          <div className="mx-table-container">
            <table className="mx-table w-full">
              <thead>
                <tr>
                  <th className="px-4 py-3">
                    {provider === "hubspot" ? "HubSpot Object" : "Salesforce Object"}
                  </th>
                  <th className="px-4 py-3 text-center">
                    <span className="mx-text-secondary">→</span>
                  </th>
                  <th className="px-4 py-3">Maximor Object</th>
                </tr>
              </thead>
              <tbody>
                {OBJECT_MAPPINGS.map((mapping) => (
                  <tr key={mapping.source}>
                    <td className="px-4 py-3 text-sm">{mapping.source}</td>
                    <td className="px-4 py-3 text-center mx-text-secondary">→</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--mx-primary)' }}>{mapping.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {provider === "salesforce" && (
          <div className="mx-card mx-card-white p-6">
            <h3 className="mb-2 mx-h4">Bidirectional Sync</h3>
            <p className="mb-4 text-xs mx-text-secondary">
              Maximor creates custom objects in Salesforce for two-way data synchronization.
            </p>
            <div className="mx-table-container">
              <table className="mx-table w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-3">Maximor Object</th>
                    <th className="px-4 py-3 text-center">
                      <span className="mx-text-secondary">↔</span>
                    </th>
                    <th className="px-4 py-3">Salesforce Custom Object</th>
                  </tr>
                </thead>
                <tbody>
                  {SF_CUSTOM_OBJECTS.map((mapping) => (
                    <tr key={mapping.source}>
                      <td className="px-4 py-3 text-sm">{mapping.source}</td>
                      <td className="px-4 py-3 text-center" style={{ color: 'var(--mx-primary)' }}>↔</td>
                      <td className="px-4 py-3 text-sm font-mono text-xs mx-text-secondary">{mapping.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mx-card mx-card-white p-6">
          <h3 className="mb-2 mx-h4">Approval Workflow</h3>
          <p className="mb-4 text-xs mx-text-secondary">
            Require approval before synced deals create contracts in Maximor.
          </p>
          <label className="flex items-center justify-between rounded-md border border-border px-4 py-3 transition-colors hover:bg-gray-50">
            <div>
              <p className="text-sm font-medium">Pending Approval</p>
              <p className="text-xs mx-text-secondary">
                New contracts from {provider === "hubspot" ? "HubSpot" : "Salesforce"} require review before activation
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={pendingApproval}
              onClick={() => setPendingApproval(!pendingApproval)}
              className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors"
              style={{ backgroundColor: pendingApproval ? 'var(--mx-primary)' : 'var(--mx-border)' }}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  pendingApproval ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </label>
          {pendingApproval && (
            <div className="mt-3 rounded-md border border-border bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
                  style={{ background: 'var(--mx-primary-bg)' }}
                >
                  ⏳
                </div>
                <div>
                  <p className="text-sm font-medium">Deals land in Pending Approval</p>
                  <p className="text-xs mx-text-secondary">
                    Navigate to AR → Contracts → Pending to review and approve imported deals.
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

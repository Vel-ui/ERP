"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Select } from "@/components/ui";

const GL_ACCOUNTS = [
  { value: "1010", label: "1010 - Stripe Balance" },
  { value: "1020", label: "1020 - Cash & Equivalents" },
  { value: "1100", label: "1100 - Accounts Receivable" },
  { value: "4000", label: "4000 - Revenue" },
  { value: "4100", label: "4100 - Subscription Revenue" },
  { value: "5000", label: "5000 - Cost of Goods Sold" },
  { value: "6100", label: "6100 - Processing Fees" },
  { value: "6200", label: "6200 - Bank Fees" },
  { value: "7000", label: "7000 - Other Revenue" },
  { value: "7100", label: "7100 - Application Fee Revenue" },
];

export default function StripeSetupPage() {
  const [connected, setConnected] = useState(false);
  const [saved, setSaved] = useState(false);

  const [accounts, setAccounts] = useState({
    balance: "1010",
    payment: "1020",
    fees: "6100",
    applicationFees: "7100",
  });

  const [crm, setCrm] = useState({
    importContracts: true,
    importProducts: true,
    importCustomers: false,
  });

  const [subscriptions, setSubscriptions] = useState({
    syncOn: true,
    preventZeroInvoices: true,
    syncFromDate: "2025-01-01",
    updateCustomerProfile: false,
  });

  const [syncInvoiceWhenPaid, setSyncInvoiceWhenPaid] = useState(true);
  const [paidThreshold, setPaidThreshold] = useState("0.50");

  const [billingPortal, setBillingPortal] = useState({
    customerInfo: true,
    paymentMethods: true,
    cancellation: false,
    subscriptions: false,
  });

  const retries = [
    { attempt: 1, delay: "Immediately (0h)", status: "First attempt" },
    { attempt: 2, delay: "+1 hour", status: "Second attempt" },
    { attempt: 3, delay: "+24 hours", status: "Final attempt" },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleCrm = (key: keyof typeof crm) =>
    setCrm((p) => ({ ...p, [key]: !p[key] }));

  const toggleSub = (key: keyof typeof subscriptions) =>
    setSubscriptions((p) => ({ ...p, [key]: !p[key] as never }));

  const togglePortal = (key: keyof typeof billingPortal) =>
    setBillingPortal((p) => ({ ...p, [key]: !p[key] }));

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
          <span className="mx-breadcrumb-item">Stripe</span>
        </nav>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="mx-h1">Stripe</h1>
            <p className="mt-1 text-sm mx-text-secondary">
              Payment processing, subscriptions, and billing automation.
            </p>
          </div>
          <div className="flex gap-2">
            {connected ? (
              <Button variant="default" onClick={() => setConnected(false)}>
                Disconnect
              </Button>
            ) : (
              <Button onClick={() => setConnected(true)}>Connect Stripe</Button>
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

      <div className="max-w-3xl space-y-6">
        <div className="mx-card mx-card-white p-6">
          <h3 className="mb-4 mx-h4">Account Mapping</h3>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Balance Account"
              options={GL_ACCOUNTS}
              value={accounts.balance}
              onChange={(e) => setAccounts((p) => ({ ...p, balance: e.target.value }))}
            />
            <Select
              label="Payment Account"
              options={GL_ACCOUNTS}
              value={accounts.payment}
              onChange={(e) => setAccounts((p) => ({ ...p, payment: e.target.value }))}
            />
            <Select
              label="Fees (Expense / Revenue)"
              options={GL_ACCOUNTS}
              value={accounts.fees}
              onChange={(e) => setAccounts((p) => ({ ...p, fees: e.target.value }))}
            />
            <Select
              label="Application Fees"
              options={GL_ACCOUNTS}
              value={accounts.applicationFees}
              onChange={(e) => setAccounts((p) => ({ ...p, applicationFees: e.target.value }))}
            />
          </div>
        </div>

        <div className="mx-card mx-card-white p-6">
          <h3 className="mb-2 mx-h4">CRM Collaboration</h3>
          <p className="mb-4 text-xs mx-text-secondary">
            Control which objects are synced from Stripe into your CRM.
          </p>
          <div className="space-y-2">
            <Toggle checked={crm.importContracts} onChange={() => toggleCrm("importContracts")} label="Import Contracts" description="Sync Stripe subscriptions as contracts" />
            <Toggle checked={crm.importProducts} onChange={() => toggleCrm("importProducts")} label="Import Products" description="Sync Stripe products and prices" />
            <Toggle checked={crm.importCustomers} onChange={() => toggleCrm("importCustomers")} label="Import Customers" description="Sync Stripe customer records" />
          </div>
        </div>

        <div className="mx-card mx-card-white p-6">
          <h3 className="mb-2 mx-h4">Subscriptions</h3>
          <p className="mb-4 text-xs mx-text-secondary">Manage how subscription data flows into your accounting.</p>
          <div className="space-y-3">
            <Toggle checked={subscriptions.syncOn} onChange={() => toggleSub("syncOn")} label="Sync Subscriptions" description="Automatically import subscription events" />
            <Toggle checked={subscriptions.preventZeroInvoices} onChange={() => toggleSub("preventZeroInvoices")} label="Prevent Zero-Dollar Invoices" description="Skip invoices with a $0.00 total" />
            <Toggle checked={subscriptions.updateCustomerProfile} onChange={() => toggleSub("updateCustomerProfile")} label="Update Customer Profile on Sync" description="Overwrite customer data with Stripe values" />
            <div className="pt-2">
              <label className="mb-1 block text-sm font-medium">Sync From Date</label>
              <input
                type="date"
                value={subscriptions.syncFromDate}
                onChange={(e) => setSubscriptions((p) => ({ ...p, syncFromDate: e.target.value }))}
                className="mx-input"
              />
            </div>
          </div>
        </div>

        <div className="mx-card mx-card-white p-6">
          <h3 className="mb-4 mx-h4">Invoice Sync</h3>
          <div className="space-y-3">
            <Toggle checked={syncInvoiceWhenPaid} onChange={() => setSyncInvoiceWhenPaid(!syncInvoiceWhenPaid)} label="Sync Invoice When Paid" description="Create journal entry when Stripe payment succeeds" />
            {syncInvoiceWhenPaid && (
              <div className="ml-4 border-l-2 border-border pl-4 pt-2">
                <label className="mb-1 block text-sm font-medium">Payment Threshold</label>
                <div className="flex items-center gap-2">
                  <span className="text-sm mx-text-secondary">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={paidThreshold}
                    onChange={(e) => setPaidThreshold(e.target.value)}
                    className="mx-input w-24"
                  />
                  <span className="text-xs mx-text-secondary">Minimum payment to trigger sync</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mx-card mx-card-white p-6">
          <h3 className="mb-2 mx-h4">Autopay & Billing Portal</h3>
          <p className="mb-4 text-xs mx-text-secondary">
            Configure the customer-facing billing portal experience.
          </p>
          <div className="space-y-2">
            <Toggle checked={billingPortal.customerInfo} onChange={() => togglePortal("customerInfo")} label="Customer Info" description="Allow customers to update their information" />
            <Toggle checked={billingPortal.paymentMethods} onChange={() => togglePortal("paymentMethods")} label="Payment Methods" description="Allow customers to manage payment methods" />
            <Toggle checked={billingPortal.cancellation} onChange={() => togglePortal("cancellation")} label="Cancellation" description="Allow customers to cancel subscriptions" />
            <Toggle checked={billingPortal.subscriptions} onChange={() => togglePortal("subscriptions")} label="Subscriptions" description="Allow customers to view subscription details" />
          </div>
        </div>

        <div className="mx-card mx-card-white p-6">
          <h3 className="mb-4 mx-h4">Payment Retry Schedule</h3>
          <div className="space-y-2">
            {retries.map((r) => (
              <div
                key={r.attempt}
                className="flex items-center gap-4 rounded-md border border-border px-4 py-3"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium"
                  style={{ background: 'var(--mx-primary-bg)', color: 'var(--mx-primary)' }}
                >
                  {r.attempt}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{r.delay}</p>
                  <p className="text-xs mx-text-secondary">{r.status}</p>
                </div>
                {r.attempt < 3 && (
                  <span className="text-xs mx-text-secondary">→</span>
                )}
              </div>
            ))}
          </div>
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

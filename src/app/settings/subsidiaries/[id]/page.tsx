"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button, Input, Select } from "@/components/ui";

type Tab = "profile" | "accounting" | "invoicing";

const MOCK_SUBSIDIARIES: Record<string, {
  name: string;
  legalEntity: string;
  tradeName: string;
  addressLine1: string;
  addressLine2: string;
  country: string;
  city: string;
  state: string;
  zip: string;
  taxId: string;
  timezone: string;
  currency: string;
  logo: string | null;
  dueFrom: string;
  dueTo: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  bankAddress: string;
  swiftCode: string;
  paymentTerms: string;
  paymentInstructions: string;
  showBankDetails: boolean;
  enableStripe: boolean;
  hideTaxIfZero: boolean;
}> = {
  "sub-1": {
    name: "Maximor US",
    legalEntity: "Maximor Inc.",
    tradeName: "Maximor",
    addressLine1: "100 Market Street",
    addressLine2: "Suite 300",
    country: "US",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    taxId: "12-3456789",
    timezone: "America/Los_Angeles",
    currency: "USD",
    logo: null,
    dueFrom: "1200",
    dueTo: "2100",
    bankName: "Silicon Valley Bank",
    accountNumber: "****4521",
    routingNumber: "121140399",
    bankAddress: "3003 Tasman Drive, Santa Clara, CA 95054",
    swiftCode: "SVBKUS6S",
    paymentTerms: "net-30",
    paymentInstructions: "Please include invoice number in memo field.",
    showBankDetails: true,
    enableStripe: true,
    hideTaxIfZero: true,
  },
  "sub-2": {
    name: "Maximor UK",
    legalEntity: "Maximor Ltd.",
    tradeName: "Maximor UK",
    addressLine1: "10 Finsbury Square",
    addressLine2: "",
    country: "GB",
    city: "London",
    state: "",
    zip: "EC2A 1AF",
    taxId: "GB123456789",
    timezone: "Europe/London",
    currency: "GBP",
    logo: null,
    dueFrom: "1201",
    dueTo: "2101",
    bankName: "Barclays",
    accountNumber: "****7832",
    routingNumber: "20-00-00",
    bankAddress: "1 Churchill Place, London E14 5HP",
    swiftCode: "BARCGB22",
    paymentTerms: "net-30",
    paymentInstructions: "Reference invoice number on transfer.",
    showBankDetails: true,
    enableStripe: false,
    hideTaxIfZero: false,
  },
  "sub-3": {
    name: "Maximor Europe",
    legalEntity: "Maximor GmbH",
    tradeName: "Maximor EU",
    addressLine1: "Friedrichstraße 68",
    addressLine2: "",
    country: "DE",
    city: "Berlin",
    state: "",
    zip: "10117",
    taxId: "DE123456789",
    timezone: "Europe/Berlin",
    currency: "EUR",
    logo: null,
    dueFrom: "1202",
    dueTo: "2102",
    bankName: "Deutsche Bank",
    accountNumber: "****3910",
    routingNumber: "DEUTDEFF",
    bankAddress: "Taunusanlage 12, 60325 Frankfurt",
    swiftCode: "DEUTDEFF",
    paymentTerms: "net-45",
    paymentInstructions: "SEPA transfer preferred. Include Rechnungsnummer.",
    showBankDetails: true,
    enableStripe: false,
    hideTaxIfZero: true,
  },
};

const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "GB", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "CA", label: "Canada" },
  { value: "FR", label: "France" },
  { value: "AU", label: "Australia" },
];

const TIMEZONES = [
  { value: "America/Los_Angeles", label: "Pacific Time (US)" },
  { value: "America/New_York", label: "Eastern Time (US)" },
  { value: "America/Chicago", label: "Central Time (US)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "America/Toronto", label: "Toronto (EST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
];

const CURRENCIES = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
];

const GL_ACCOUNTS = [
  { value: "1200", label: "1200 - Accounts Receivable" },
  { value: "1201", label: "1201 - AR - UK Entity" },
  { value: "1202", label: "1202 - AR - EU Entity" },
  { value: "1300", label: "1300 - Intercompany Receivable" },
  { value: "2100", label: "2100 - Accounts Payable" },
  { value: "2101", label: "2101 - AP - UK Entity" },
  { value: "2102", label: "2102 - AP - EU Entity" },
  { value: "2200", label: "2200 - Intercompany Payable" },
];

const PAYMENT_TERMS = [
  { value: "net-15", label: "Net 15" },
  { value: "net-30", label: "Net 30" },
  { value: "net-45", label: "Net 45" },
  { value: "net-60", label: "Net 60" },
  { value: "due-on-receipt", label: "Due on Receipt" },
];

export default function SubsidiaryDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const data = MOCK_SUBSIDIARIES[id];

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(
    data ?? {
      name: "",
      legalEntity: "",
      tradeName: "",
      addressLine1: "",
      addressLine2: "",
      country: "",
      city: "",
      state: "",
      zip: "",
      taxId: "",
      timezone: "",
      currency: "USD",
      logo: null as string | null,
      dueFrom: "",
      dueTo: "",
      bankName: "",
      accountNumber: "",
      routingNumber: "",
      bankAddress: "",
      swiftCode: "",
      paymentTerms: "net-30",
      paymentInstructions: "",
      showBankDetails: true,
      enableStripe: false,
      hideTaxIfZero: false,
    }
  );

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoError(null);

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      setLogoError("Only PNG and JPG files are allowed.");
      return;
    }
    if (file.size > 1024 * 1024) {
      setLogoError("File must be under 1MB.");
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width > 128 || img.height > 128) {
        setLogoError("Image must be 128×128 pixels or smaller.");
        URL.revokeObjectURL(url);
        return;
      }
      setLogoPreview(url);
    };
    img.src = url;
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const update = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg mx-text-secondary">Subsidiary not found.</p>
        <Link href="/settings/subsidiaries" className="mt-4 hover:underline" style={{color:'var(--mx-primary)'}}>
          Back to Subsidiaries
        </Link>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "accounting", label: "Accounting" },
    { key: "invoicing", label: "Invoicing" },
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm mx-text-secondary">
          <Link href="/settings/subsidiaries" className="hover:underline" style={{color:'var(--mx-primary)'}}>
            Subsidiaries
          </Link>
          <span>/</span>
          <span>{form.name}</span>
        </div>
        <h1 className="mt-2 mx-h1">{form.name}</h1>
      </div>

      <div className="mb-6 flex gap-1 border-b" style={{borderColor:'var(--mx-border)'}}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? ""
                : "border-transparent mx-text-secondary hover:border-gray-300"
            }`}
            style={activeTab === tab.key ? {borderColor:'var(--mx-primary)', color:'var(--mx-primary)'} : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="max-w-2xl space-y-6">
          <div className="mx-card mx-card-white p-6">
            <h3 className="mb-4 mx-h4">Logo</h3>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg border bg-white" style={{borderColor:'var(--mx-border)'}}>
                {logoPreview ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={logoPreview} alt="Logo" className="h-16 w-16 rounded-lg object-cover" />
                ) : (
                  <span className="text-2xl font-bold" style={{color:'var(--mx-primary)'}}>
                    {form.name.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Logo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <p className="mt-1 text-xs mx-text-secondary">PNG or JPG, max 128×128px, under 1MB</p>
                {logoError && <p className="mt-1 text-xs text-red-500">{logoError}</p>}
              </div>
            </div>
          </div>

          <div className="mx-card mx-card-white p-6">
            <h3 className="mb-4 mx-h4">Entity Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Legal Entity Name"
                  value={form.legalEntity}
                  onChange={(e) => update("legalEntity", e.target.value)}
                />
                <Input
                  label="Trade Name"
                  value={form.tradeName}
                  onChange={(e) => update("tradeName", e.target.value)}
                />
              </div>
              <Input
                label="Tax ID"
                value={form.taxId}
                onChange={(e) => update("taxId", e.target.value)}
              />
            </div>
          </div>

          <div className="mx-card mx-card-white p-6">
            <h3 className="mb-4 mx-h4">Address</h3>
            <div className="space-y-4">
              <Input
                label="Address Line 1"
                value={form.addressLine1}
                onChange={(e) => update("addressLine1", e.target.value)}
              />
              <Input
                label="Address Line 2"
                value={form.addressLine2}
                onChange={(e) => update("addressLine2", e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Country"
                  options={COUNTRIES}
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                />
                <Input
                  label="City"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="State / Province"
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                />
                <Input
                  label="Zip / Postal Code"
                  value={form.zip}
                  onChange={(e) => update("zip", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mx-card mx-card-white p-6">
            <h3 className="mb-4 mx-h4">Regional Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Timezone"
                options={TIMEZONES}
                value={form.timezone}
                onChange={(e) => update("timezone", e.target.value)}
              />
              <Select
                label="Local Currency"
                options={CURRENCIES}
                value={form.currency}
                onChange={(e) => update("currency", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button className="mx-btn-primary" onClick={handleSave}>
              {saved ? "Saved!" : "Save Profile"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "accounting" && (
        <div className="max-w-2xl space-y-6">
          <div className="mx-card mx-card-white p-6">
            <h3 className="mb-2 mx-h4">Intercompany Accounts</h3>
            <p className="mb-4 text-xs mx-text-secondary">
              Map the GL accounts used for intercompany balances with this subsidiary.
            </p>
            <div className="space-y-4">
              <Select
                label="Due From (Receivable — Asset)"
                options={GL_ACCOUNTS.filter((a) => a.value.startsWith("1"))}
                value={form.dueFrom}
                onChange={(e) => update("dueFrom", e.target.value)}
              />
              <Select
                label="Due To (Payable — Liability)"
                options={GL_ACCOUNTS.filter((a) => a.value.startsWith("2"))}
                value={form.dueTo}
                onChange={(e) => update("dueTo", e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="mx-btn-primary" onClick={handleSave}>
              {saved ? "Saved!" : "Save Accounting"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "invoicing" && (
        <div className="max-w-2xl space-y-6">
          <div className="mx-card mx-card-white p-6">
            <h3 className="mb-4 mx-h4">Bank Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Bank Name"
                  value={form.bankName}
                  onChange={(e) => update("bankName", e.target.value)}
                />
                <Input
                  label="Account Number"
                  value={form.accountNumber}
                  onChange={(e) => update("accountNumber", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Routing Number"
                  value={form.routingNumber}
                  onChange={(e) => update("routingNumber", e.target.value)}
                />
                <Input
                  label="SWIFT Code"
                  value={form.swiftCode}
                  onChange={(e) => update("swiftCode", e.target.value)}
                />
              </div>
              <Input
                label="Bank Address"
                value={form.bankAddress}
                onChange={(e) => update("bankAddress", e.target.value)}
              />
            </div>
          </div>

          <div className="mx-card mx-card-white p-6">
            <h3 className="mb-4 mx-h4">Payment Settings</h3>
            <div className="space-y-4">
              <Select
                label="Default Payment Terms"
                options={PAYMENT_TERMS}
                value={form.paymentTerms}
                onChange={(e) => update("paymentTerms", e.target.value)}
              />
              <div className="w-full">
                <label className="mb-1 block text-sm font-medium">
                  Payment Instructions
                </label>
                <textarea
                  value={form.paymentInstructions}
                  onChange={(e) => update("paymentInstructions", e.target.value)}
                  rows={3}
                  className="mx-input w-full"
                />
              </div>
            </div>
          </div>

          <div className="mx-card mx-card-white p-6">
            <h3 className="mb-4 mx-h4">Invoice Options</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between rounded-md border px-4 py-3 transition-colors hover:bg-gray-50" style={{borderColor:'var(--mx-border)'}}>
                <div>
                  <p className="text-sm font-medium">Show Bank Details on Invoices</p>
                  <p className="text-xs mx-text-secondary">Display bank account info on generated invoices</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.showBankDetails}
                  onClick={() => update("showBankDetails", !form.showBankDetails)}
                  className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors"
                  style={{backgroundColor: form.showBankDetails ? 'var(--mx-primary)' : 'var(--mx-border)'}}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      form.showBankDetails ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between rounded-md border px-4 py-3 transition-colors hover:bg-gray-50" style={{borderColor:'var(--mx-border)'}}>
                <div>
                  <p className="text-sm font-medium">Enable Online Payments (Stripe)</p>
                  <p className="text-xs mx-text-secondary">Allow customers to pay invoices via Stripe checkout</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.enableStripe}
                  onClick={() => update("enableStripe", !form.enableStripe)}
                  className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors"
                  style={{backgroundColor: form.enableStripe ? 'var(--mx-primary)' : 'var(--mx-border)'}}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      form.enableStripe ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </label>

              <label className="flex items-center justify-between rounded-md border px-4 py-3 transition-colors hover:bg-gray-50" style={{borderColor:'var(--mx-border)'}}>
                <div>
                  <p className="text-sm font-medium">Hide Tax Details if Total Tax = $0</p>
                  <p className="text-xs mx-text-secondary">Suppress tax line items when no tax applies</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.hideTaxIfZero}
                  onClick={() => update("hideTaxIfZero", !form.hideTaxIfZero)}
                  className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors"
                  style={{backgroundColor: form.hideTaxIfZero ? 'var(--mx-primary)' : 'var(--mx-border)'}}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      form.hideTaxIfZero ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button className="mx-btn-primary" onClick={handleSave}>
              {saved ? "Saved!" : "Save Invoicing"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

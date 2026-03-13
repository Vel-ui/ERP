"use client";

import { Select } from "@/components/ui";
import { useState } from "react";

const AMORTIZATION_OPTIONS = [
  { value: "daily", label: "Daily" },
  { value: "even_period", label: "Even Period (first/last prorated)" },
];

export default function AccountingPage() {
  const [prepaidAmortization, setPrepaidAmortization] = useState("daily");
  const [quickEntriesEnabled, setQuickEntriesEnabled] = useState(false);

  return (
    <div>
      <div className="mb-6">
        <h1 className="mx-h1">Accounting</h1>
        <p className="mt-1 text-sm mx-text-secondary">
          Prepaid amortization, usage min commitment, fixed asset defaults, multi-currency, SaaS
          P&amp;L mapping, Transaction Automation
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="mx-card mx-card-white p-6">
          <h3 className="mx-h4 mb-4">Prepaid Amortization</h3>
          <Select
            label="Amortization method"
            options={AMORTIZATION_OPTIONS}
            value={prepaidAmortization}
            onChange={(e) => setPrepaidAmortization(e.target.value)}
          />
          <p className="mt-2 text-xs mx-text-secondary">
            Daily or Even Period (first and last periods prorated)
          </p>
        </div>

        <div className="mx-card mx-card-white p-6">
          <h3 className="mx-h4 mb-4">Transaction Automation</h3>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="quick-entries"
              checked={quickEntriesEnabled}
              onChange={(e) => setQuickEntriesEnabled(e.target.checked)}
              className="h-4 w-4 rounded"
              style={{accentColor:'var(--mx-primary)'}}
            />
            <label htmlFor="quick-entries" className="text-sm">
              Quick Entries for Expenses: Auto-create reconciliation quick entries for existing
              vendors
            </label>
          </div>
        </div>

        <div className="mx-card p-6" style={{borderStyle:'dashed'}}>
          <p className="text-sm mx-text-secondary">
            Multi-currency, SaaS P&amp;L mapping, Fixed asset defaults — coming in Phase 7
          </p>
        </div>

        <button className="mx-btn-primary">Save Changes</button>
      </div>
    </div>
  );
}

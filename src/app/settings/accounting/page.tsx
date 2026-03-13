"use client";

import { Button, Select } from "@/components/ui";
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
        <h1 className="text-2xl font-semibold text-foreground">Accounting</h1>
        <p className="mt-1 text-sm text-muted">
          Prepaid amortization, usage min commitment, fixed asset defaults, multi-currency, SaaS
          P&L mapping, Transaction Automation
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="text-sm font-medium text-foreground mb-4">Prepaid Amortization</h3>
          <Select
            label="Amortization method"
            options={AMORTIZATION_OPTIONS}
            value={prepaidAmortization}
            onChange={(e) => setPrepaidAmortization(e.target.value)}
          />
          <p className="mt-2 text-xs text-muted">
            Daily or Even Period (first and last periods prorated)
          </p>
        </div>

        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="text-sm font-medium text-foreground mb-4">Transaction Automation</h3>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="quick-entries"
              checked={quickEntriesEnabled}
              onChange={(e) => setQuickEntriesEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-border bg-sidebar text-accent focus:ring-accent"
            />
            <label htmlFor="quick-entries" className="text-sm text-foreground">
              Quick Entries for Expenses: Auto-create reconciliation quick entries for existing
              vendors
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-dashed border-border p-6">
          <p className="text-sm text-muted">
            Multi-currency, SaaS P&L mapping, Fixed asset defaults — coming in Phase 7
          </p>
        </div>

        <Button>Save Changes</Button>
      </div>
    </div>
  );
}

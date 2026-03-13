"use client";

import { Button, Input } from "@/components/ui";
import { useState } from "react";

export default function ReportSettingsPage() {
  const [ignoreZero, setIgnoreZero] = useState(true);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Report Settings</h1>
        <p className="mt-1 text-sm text-muted">
          Recurring Revenue (MRR/ARR), CAC, SaaS P&L, Operating Expenses, Cost of Revenue, Budget
          Upload
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="text-sm font-medium text-foreground mb-4">Recurring Revenue</h3>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ignore-zero"
              checked={ignoreZero}
              onChange={(e) => setIgnoreZero(e.target.checked)}
              className="h-4 w-4 rounded border-border bg-sidebar text-accent focus:ring-accent"
            />
            <label htmlFor="ignore-zero" className="text-sm text-foreground">
              Ignore $0 contracts in MRR/ARR calculations
            </label>
          </div>
          <p className="mt-2 text-xs text-muted">
            Default metric: MRR or ARR. Count to MRR/ARR toggle per product.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="text-sm font-medium text-foreground mb-4">SaaS P&L Structure</h3>
          <Input
            label="Department field for grouping"
            placeholder="Department"
            disabled
          />
          <p className="mt-2 text-xs text-muted">
            Map departments in SaaS P&L Settings. Income Statement by Department.
          </p>
        </div>

        <div className="rounded-lg border border-dashed border-border p-6">
          <p className="text-sm text-muted">
            CAC (By Account or By Field), Operating Expenses (S&M, R&D, G&A), Cost of Revenue,
            Budget Upload — full configuration in Phase 6
          </p>
        </div>

        <Button>Save Changes</Button>
      </div>
    </div>
  );
}

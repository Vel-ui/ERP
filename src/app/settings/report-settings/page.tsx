"use client";

import { Input } from "@/components/ui";
import { useState } from "react";

export default function ReportSettingsPage() {
  const [ignoreZero, setIgnoreZero] = useState(true);

  return (
    <div>
      <div className="mb-6">
        <h1 className="mx-h1">Report Settings</h1>
        <p className="mt-1 text-sm mx-text-secondary">
          Recurring Revenue (MRR/ARR), CAC, SaaS P&amp;L, Operating Expenses, Cost of Revenue, Budget
          Upload
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="mx-card mx-card-white p-6">
          <h3 className="mx-h4 mb-4">Recurring Revenue</h3>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ignore-zero"
              checked={ignoreZero}
              onChange={(e) => setIgnoreZero(e.target.checked)}
              className="h-4 w-4 rounded"
              style={{accentColor:'var(--mx-primary)'}}
            />
            <label htmlFor="ignore-zero" className="text-sm">
              Ignore $0 contracts in MRR/ARR calculations
            </label>
          </div>
          <p className="mt-2 text-xs mx-text-secondary">
            Default metric: MRR or ARR. Count to MRR/ARR toggle per product.
          </p>
        </div>

        <div className="mx-card mx-card-white p-6">
          <h3 className="mx-h4 mb-4">SaaS P&amp;L Structure</h3>
          <Input
            label="Department field for grouping"
            placeholder="Department"
            disabled
          />
          <p className="mt-2 text-xs mx-text-secondary">
            Map departments in SaaS P&amp;L Settings. Income Statement by Department.
          </p>
        </div>

        <div className="mx-card p-6" style={{borderStyle:'dashed'}}>
          <p className="text-sm mx-text-secondary">
            CAC (By Account or By Field), Operating Expenses (S&amp;M, R&amp;D, G&amp;A), Cost of Revenue,
            Budget Upload — full configuration in Phase 6
          </p>
        </div>

        <button className="mx-btn-primary">Save Changes</button>
      </div>
    </div>
  );
}

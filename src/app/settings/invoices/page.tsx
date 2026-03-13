"use client";

import { Button, Input, Select } from "@/components/ui";
import { useState } from "react";

const PAYMENT_TIMING_OPTIONS = [
  { value: "sent", label: "Sent date" },
  { value: "invoice", label: "Invoice date" },
  { value: "due", label: "Due date" },
];

export default function InvoicesPage() {
  const [paymentTiming, setPaymentTiming] = useState("due");
  const [customEmail, setCustomEmail] = useState("");
  const [remindersDefault, setRemindersDefault] = useState(true);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Invoices — Communications</h1>
        <p className="mt-1 text-sm text-muted">
          Payment timing, custom email templates, and reminder defaults
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="text-sm font-medium text-foreground mb-4">Auto-Pay Timing</h3>
          <Select
            label="When to charge for auto-pay"
            options={PAYMENT_TIMING_OPTIONS}
            value={paymentTiming}
            onChange={(e) => setPaymentTiming(e.target.value)}
          />
          <p className="mt-2 text-xs text-muted">
            Choose Sent date, Invoice date, or Due date for automatic payment retries
          </p>
        </div>

        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="text-sm font-medium text-foreground mb-4">Custom Email</h3>
          <Input
            label="Custom email template (optional)"
            value={customEmail}
            onChange={(e) => setCustomEmail(e.target.value)}
            placeholder="Custom message for invoice emails"
          />
        </div>

        <div className="rounded-lg border border-border bg-sidebar p-6">
          <h3 className="text-sm font-medium text-foreground mb-4">Reminders</h3>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="reminders"
              checked={remindersDefault}
              onChange={(e) => setRemindersDefault(e.target.checked)}
              className="h-4 w-4 rounded border-border bg-sidebar text-accent focus:ring-accent"
            />
            <label htmlFor="reminders" className="text-sm text-foreground">
              Enable automatic reminders by default for new customers
            </label>
          </div>
          <p className="mt-2 text-xs text-muted">
            3 retry attempts (0h, +1h, +24h) before auto-pay disables
          </p>
        </div>

        <Button>Save Changes</Button>
      </div>
    </div>
  );
}

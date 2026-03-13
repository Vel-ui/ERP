"use client";

import Link from "next/link";

const INTEGRATION_CATEGORIES = [
  {
    name: "Payment Processing",
    description: "Payment processing and billing automation",
    integrations: [
      { name: "Stripe", status: "Available", description: "Payments, subscriptions, billing", href: "/settings/integrations/stripe" },
    ],
  },
  {
    name: "Banks",
    description: "Connect bank accounts for transaction sync",
    integrations: [
      { name: "Plaid", status: "Available", description: "Bank transaction sync, 2FA support", href: "/settings/integrations/plaid" },
    ],
  },
  {
    name: "Accounts Payable",
    description: "Expense management and card feeds",
    integrations: [
      { name: "Ramp", status: "Available", description: "Charges, bills, reimbursements", href: "/settings/integrations/ramp" },
      { name: "Brex", status: "Available", description: "Corporate card, vendors", href: "/settings/integrations/brex" },
      { name: "Expensify", status: "Available", description: "Expense reports, reimbursements", href: "/settings/integrations/expensify" },
    ],
  },
  {
    name: "CRM",
    description: "Sync deals and contracts",
    integrations: [
      { name: "HubSpot", status: "Available", description: "Deals (Closed Won) every 30 min", href: "/settings/integrations/hubspot" },
      { name: "Salesforce", status: "Available", description: "Bi-directional CRM sync", href: "/settings/integrations/salesforce" },
    ],
  },
  {
    name: "Payroll",
    description: "Payroll integration and journal entry automation",
    integrations: [
      { name: "Rippling", status: "Available", description: "Payroll, departments, allocations", href: "/settings/integrations/rippling" },
      { name: "Gusto", status: "Available", description: "Payroll, taxes, benefits", href: "/settings/integrations/gusto" },
    ],
  },
  {
    name: "Tax",
    description: "Tax calculation and compliance",
    integrations: [
      { name: "Avalara", status: "Available", description: "Tax calculation", href: "/settings/integrations/avalara" },
      { name: "Anrok", status: "Available", description: "SaaS sales tax automation", href: "/settings/integrations/anrok" },
    ],
  },
  {
    name: "Cash Flow",
    description: "Cash management and forecasting",
    integrations: [
      { name: "Float", status: "Available", description: "Cash flow forecasting", href: "/settings/integrations/float" },
    ],
  },
];

export default function IntegrationsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="mx-h1">Integrations</h1>
        <p className="mt-1 text-sm mx-text-secondary">
          Connect banks, expense tools, CRM, payroll, and tax. Browse by category.
        </p>
      </div>

      <div className="space-y-6">
        {INTEGRATION_CATEGORIES.map((category) => (
          <div
            key={category.name}
            className="mx-card mx-card-white p-6"
          >
            <h3 className="mx-h4">{category.name}</h3>
            <p className="mt-1 text-xs mx-text-secondary">{category.description}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.integrations.map((integration) => (
                <div
                  key={integration.name}
                  className="flex items-center justify-between rounded-md border border-border p-4 transition-colors hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{integration.name}</p>
                    <p className="mt-0.5 text-xs mx-text-secondary">{integration.description}</p>
                  </div>
                  {integration.href ? (
                    <Link
                      href={integration.href}
                      className="shrink-0 mx-btn-primary"
                    >
                      Setup
                    </Link>
                  ) : (
                    <span className="shrink-0 mx-btn-default opacity-50 cursor-not-allowed">
                      Coming Soon
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

const INTEGRATION_CATEGORIES = [
  {
    name: "Banks",
    description: "Connect bank accounts for transaction sync",
    integrations: [
      { name: "Plaid", status: "Available", description: "Bank transaction sync, 2FA support" },
    ],
  },
  {
    name: "Accounts Payable",
    description: "Expense management and card feeds",
    integrations: [
      { name: "Ramp", status: "Available", description: "Charges, bills, reimbursements" },
      { name: "Brex", status: "Available", description: "Charges, vendors" },
      { name: "Expensify", status: "Available", description: "Charges, reimbursements" },
    ],
  },
  {
    name: "CRM",
    description: "Sync deals and contracts",
    integrations: [
      { name: "HubSpot", status: "Available", description: "Deals (Closed Won) every 30 min" },
      { name: "Salesforce", status: "Available", description: "Opportunities (Closed Won)" },
    ],
  },
  {
    name: "Tax",
    description: "Tax calculation and compliance",
    integrations: [
      { name: "Avalara", status: "Available", description: "Tax calculation" },
      { name: "Anrok", status: "Available", description: "Tax on invoices" },
    ],
  },
];

export default function IntegrationsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Integrations</h1>
        <p className="mt-1 text-sm text-muted">
          Connect banks, expense tools, CRM, payroll, and tax. Browse by category.
        </p>
      </div>

      <div className="space-y-6">
        {INTEGRATION_CATEGORIES.map((category) => (
          <div
            key={category.name}
            className="rounded-lg border border-border bg-sidebar p-6"
          >
            <h3 className="text-sm font-medium text-foreground">{category.name}</h3>
            <p className="mt-1 text-xs text-muted">{category.description}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.integrations.map((integration) => (
                <div
                  key={integration.name}
                  className="flex items-center justify-between rounded-md border border-border p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">{integration.name}</p>
                    <p className="mt-0.5 text-xs text-muted">{integration.description}</p>
                  </div>
                  <button className="shrink-0 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";

export default function LaunchpadPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Launchpad</h1>
        <p className="mt-1 text-sm text-muted">Your financial overview at a glance</p>
      </div>

      {/* Metrics row */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">Metrics</h2>
          <button className="rounded-md border border-border bg-sidebar px-3 py-1.5 text-sm text-muted hover:bg-sidebar-hover hover:text-foreground">
            + Add metric
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "ARR", value: "—" },
            { label: "Outstanding AR", value: "—" },
            { label: "Outstanding AP", value: "—" },
            { label: "Cash Balance", value: "—" },
            { label: "Runway", value: "—" },
            { label: "Net Burn", value: "—" },
          ].map((m) => (
            <div
              key={m.label}
              className="rounded-lg border border-border bg-sidebar p-4"
            >
              <p className="text-xs text-muted">{m.label}</p>
              <p className="mt-1 text-xl font-semibold text-foreground">{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Snapshot */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-medium text-foreground">Workflow snapshot</h2>
        <div className="rounded-lg border border-border bg-sidebar">
          <div className="divide-y divide-border">
            {[
              { label: "Cash Transactions to be reconciled", value: "0", href: "/cash" },
              { label: "Journal entries pending approval", value: "0", href: "/close" },
              { label: "Invoices to be sent", value: "0", href: "/ar/invoices" },
              { label: "Bills to be paid", value: "0", href: "/ap/bills" },
              { label: "Contracts to be reviewed", value: "0", href: "/ar/contracts" },
              { label: "Last closed month", value: "—", href: "/close" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-sidebar-hover"
              >
                <span className="text-sm text-foreground">{item.label}</span>
                <span className="text-sm font-medium text-accent">{item.value}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Stack Monitoring */}
      <div>
        <h2 className="mb-4 text-lg font-medium text-foreground">Tech stack monitoring</h2>
        <div className="rounded-lg border border-border bg-sidebar p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20 text-2xl">
              🏦
            </div>
            <div>
              <p className="font-medium text-foreground">Banking</p>
              <p className="text-sm text-muted">No integrations set up yet</p>
            </div>
            <Link
              href="/settings/banks"
              className="ml-auto rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
            >
              Set up Banking →
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted">
            <Link href="/settings/integrations" className="text-accent hover:underline">
              Browse integrations
            </Link>
          </p>
        </div>
      </div>

      {/* Reports placeholder */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-medium text-foreground">Reports</h2>
        <div className="rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted">+ Add report</p>
        </div>
      </div>
    </div>
  );
}

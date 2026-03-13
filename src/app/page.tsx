import Link from "next/link";
import { Landmark, Plus } from "lucide-react";

export default function LaunchpadPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="mx-h1">Launchpad</h1>
        <p className="mt-1 text-sm mx-text-secondary">Your financial overview at a glance</p>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="mx-h3">Metrics</h2>
          <button className="mx-btn-default">
            <Plus size={14} />
            Add metric
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
            <div key={m.label} className="mx-card mx-card-white">
              <p className="text-xs mx-text-secondary">{m.label}</p>
              <p className="mt-1 text-xl font-semibold">{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 mx-h3">Workflow snapshot</h2>
        <div className="mx-table-container">
          <table className="mx-table">
            <tbody>
              {[
                { label: "Cash Transactions to be reconciled", value: "0", href: "/cash" },
                { label: "Journal entries pending approval", value: "0", href: "/period-close" },
                { label: "Invoices to be sent", value: "0", href: "/revenue/invoices" },
                { label: "Bills to be paid", value: "0", href: "/subledgers/ap/bills" },
                { label: "Contracts to be reviewed", value: "0", href: "/revenue/contracts" },
                { label: "Last closed month", value: "—", href: "/period-close" },
              ].map((item) => (
                <tr key={item.label}>
                  <td>
                    <Link href={item.href} className="hover:underline" style={{color:'var(--mx-primary)'}}>
                      {item.label}
                    </Link>
                  </td>
                  <td className="text-right font-medium" style={{color:'var(--mx-primary)'}}>{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-4 mx-h3">Tech stack monitoring</h2>
        <div className="mx-card mx-card-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg" style={{background:'var(--mx-primary-bg)'}}>
              <Landmark size={24} style={{color:'var(--mx-primary)'}} />
            </div>
            <div>
              <p className="font-medium">Banking</p>
              <p className="text-sm mx-text-secondary">No integrations set up yet</p>
            </div>
            <Link
              href="/settings/banks"
              className="mx-btn-primary ml-auto"
            >
              Set up Banking →
            </Link>
          </div>
          <p className="mt-4 text-sm mx-text-secondary">
            <Link href="/settings/integrations" className="mx-text-link">
              Browse integrations
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 mx-h3">Reports</h2>
        <div className="mx-card p-8 text-center" style={{borderStyle:'dashed'}}>
          <p className="text-sm mx-text-secondary">
            <Plus size={14} className="inline mr-1" />
            Add report
          </p>
        </div>
      </div>
    </div>
  );
}

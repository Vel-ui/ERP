"use client";

import Link from "next/link";

/* ───────────────── Mock Data ───────────────── */

const stats = [
  { label: "Outstanding AP", value: "$127,450.00", change: "+12.3%", changeType: "up" as const },
  { label: "Bills Due This Week", value: "7", change: "3 overdue", changeType: "warning" as const },
  { label: "Pending Bills", value: "12", change: "4 drafts", changeType: "neutral" as const },
  { label: "Paid This Month", value: "$84,320.00", change: "-8.1%", changeType: "down" as const },
];

const recentActivity = [
  { id: 1, action: "Bill #INV-2048 marked as paid", vendor: "AWS", amount: "$3,200.00", time: "2 hours ago", type: "payment" },
  { id: 2, action: "New bill created", vendor: "Gusto", amount: "$48,750.00", time: "5 hours ago", type: "created" },
  { id: 3, action: "Bill credit applied", vendor: "Google Cloud", amount: "-$150.00", time: "1 day ago", type: "credit" },
  { id: 4, action: "Vendor added", vendor: "Notion", amount: "—", time: "1 day ago", type: "vendor" },
  { id: 5, action: "Bill #INV-2045 approved", vendor: "Stripe", amount: "$890.00", time: "2 days ago", type: "approved" },
];

const quickLinks = [
  { href: "/ap/vendors", label: "Vendors", description: "Manage vendor directory", icon: "👥" },
  { href: "/ap/bills", label: "Bills", description: "View and create bills", icon: "📄" },
  { href: "/ap/charges", label: "Charges", description: "Review integration charges", icon: "💳" },
  { href: "/ap/bills/create", label: "New Bill", description: "Create a new bill", icon: "➕" },
];

/* ───────────────── Helpers ───────────────── */

function StatCard({ stat }: { stat: (typeof stats)[0] }) {
  const changeColors = {
    up: "text-red-400",
    down: "text-green-400",
    warning: "text-yellow-400",
    neutral: "text-muted",
  };
  return (
    <div className="rounded-lg border border-border bg-sidebar p-5">
      <p className="text-sm text-muted">{stat.label}</p>
      <p className="mt-1 text-2xl font-semibold text-foreground">{stat.value}</p>
      <p className={`mt-1 text-xs ${changeColors[stat.changeType]}`}>{stat.change}</p>
    </div>
  );
}

function ActivityIcon({ type }: { type: string }) {
  const colors: Record<string, string> = {
    payment: "bg-green-500/15 text-green-400",
    created: "bg-blue-500/15 text-blue-400",
    credit: "bg-yellow-500/15 text-yellow-400",
    vendor: "bg-purple-500/15 text-purple-400",
    approved: "bg-emerald-500/15 text-emerald-400",
  };
  const icons: Record<string, string> = {
    payment: "✓",
    created: "+",
    credit: "↩",
    vendor: "•",
    approved: "✓",
  };
  return (
    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${colors[type] ?? "bg-sidebar text-muted"}`}>
      {icons[type] ?? "•"}
    </div>
  );
}

/* ───────────────── Component ───────────────── */

export default function APPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">Accounts Payable</h1>
        <p className="mt-1 text-sm text-muted">Manage vendors, bills, and expense charges</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-sidebar">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
            </div>
            <div className="divide-y divide-border">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-sidebar-hover">
                  <ActivityIcon type={item.type} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{item.action}</p>
                    <p className="text-xs text-muted">{item.vendor} &middot; {item.time}</p>
                  </div>
                  <span className="text-sm font-mono text-muted">{item.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div className="rounded-lg border border-border bg-sidebar">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold text-foreground">Quick Links</h2>
            </div>
            <div className="divide-y divide-border">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-sidebar-hover"
                >
                  <span className="text-lg">{link.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{link.label}</p>
                    <p className="text-xs text-muted">{link.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* AP Aging Summary */}
          <div className="mt-4 rounded-lg border border-border bg-sidebar p-5">
            <h3 className="text-sm font-semibold text-foreground">AP Aging Summary</h3>
            <div className="mt-3 space-y-2">
              {[
                { label: "Current", amount: "$42,300", pct: 33 },
                { label: "1–30 days", amount: "$38,150", pct: 30 },
                { label: "31–60 days", amount: "$28,500", pct: 22 },
                { label: "61–90 days", amount: "$12,400", pct: 10 },
                { label: "90+ days", amount: "$6,100", pct: 5 },
              ].map((bucket) => (
                <div key={bucket.label}>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">{bucket.label}</span>
                    <span className="text-foreground">{bucket.amount}</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-sidebar-hover">
                    <div
                      className="h-1.5 rounded-full bg-accent"
                      style={{ width: `${bucket.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

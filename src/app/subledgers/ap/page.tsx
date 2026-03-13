"use client";

import Link from "next/link";
import { DollarSign, FileText, CreditCard, Users, Plus, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { Tag } from "@/components/ui";

const stats = [
  { label: "Outstanding AP", value: "$127,450.00", change: "+12.3%", changeType: "up" as const, icon: DollarSign },
  { label: "Bills Due This Week", value: "7", change: "3 overdue", changeType: "warning" as const, icon: AlertTriangle },
  { label: "Pending Bills", value: "12", change: "4 drafts", changeType: "neutral" as const, icon: FileText },
  { label: "Paid This Month", value: "$84,320.00", change: "-8.1%", changeType: "down" as const, icon: CheckCircle },
];

const recentActivity = [
  { id: 1, action: "Bill #INV-2048 marked as paid", vendor: "AWS", amount: "$3,200.00", time: "2 hours ago", type: "payment" },
  { id: 2, action: "New bill created", vendor: "Gusto", amount: "$48,750.00", time: "5 hours ago", type: "created" },
  { id: 3, action: "Bill credit applied", vendor: "Google Cloud", amount: "-$150.00", time: "1 day ago", type: "credit" },
  { id: 4, action: "Vendor added", vendor: "Notion", amount: "—", time: "1 day ago", type: "vendor" },
  { id: 5, action: "Bill #INV-2045 approved", vendor: "Stripe", amount: "$890.00", time: "2 days ago", type: "approved" },
];

const quickLinks = [
  { href: "/subledgers/ap/vendors", label: "Vendors", description: "Manage vendor directory", icon: Users },
  { href: "/subledgers/ap/bills", label: "Bills", description: "View and create bills", icon: FileText },
  { href: "/subledgers/ap/charges", label: "Charges", description: "Review integration charges", icon: CreditCard },
  { href: "/subledgers/ap/bills/create", label: "New Bill", description: "Create a new bill", icon: Plus },
];

function StatCard({ stat }: { stat: (typeof stats)[0] }) {
  const Icon = stat.icon;
  const changeColors = {
    up: { color: "#f03c46" },
    down: { color: "#067f54" },
    warning: { color: "#e8bf1b" },
    neutral: {},
  };
  return (
    <div className="mx-card" style={{ padding: 20 }}>
      <div className="flex items-center gap-3 mb-2">
        <div style={{ width: 36, height: 36, borderRadius: 8, background: '#e8edeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={18} style={{ color: '#154738' }} />
        </div>
        <p className="mx-text-secondary" style={{ fontSize: 13 }}>{stat.label}</p>
      </div>
      <p style={{ fontSize: 24, fontWeight: 600, color: '#2D2926' }}>{stat.value}</p>
      <p style={{ fontSize: 12, marginTop: 4, ...changeColors[stat.changeType] }} className="mx-text-secondary">{stat.change}</p>
    </div>
  );
}

function ActivityIcon({ type }: { type: string }) {
  const config: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
    payment: { bg: '#edfdec', color: '#067f54', icon: <CheckCircle size={14} /> },
    created: { bg: '#e8edeb', color: '#154738', icon: <Plus size={14} /> },
    credit: { bg: '#fffbe9', color: '#e8bf1b', icon: <TrendingDown size={14} /> },
    vendor: { bg: '#f3f1fb', color: '#a3a0af', icon: <Users size={14} /> },
    approved: { bg: '#edfdec', color: '#067f54', icon: <CheckCircle size={14} /> },
  };
  const c = config[type] ?? { bg: '#f3f3f4', color: '#61636a', icon: <FileText size={14} /> };
  return (
    <div style={{ width: 32, height: 32, borderRadius: '50%', background: c.bg, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {c.icon}
    </div>
  );
}

export default function APPage() {
  return (
    <div style={{ padding: 24, background: '#f9f9f9' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Accounts Payable</h1>
            <p className="mx-text-secondary mt-1">Manage vendors, bills, and expense charges</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mx-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E9E9E9' }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: '#2D2926' }}>Recent Activity</h2>
              </div>
              <div>
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-center gap-3" style={{ padding: '12px 20px', borderBottom: '1px solid #E9E9E9', transition: 'background 0.15s' }}>
                    <ActivityIcon type={item.type} />
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 14, color: '#2D2926' }}>{item.action}</p>
                      <p className="mx-text-secondary" style={{ fontSize: 12 }}>{item.vendor} &middot; {item.time}</p>
                    </div>
                    <span style={{ fontSize: 14, fontFamily: 'monospace', color: '#61636a' }}>{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="mx-card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #E9E9E9' }}>
                <h2 style={{ fontSize: 14, fontWeight: 600, color: '#2D2926' }}>Quick Links</h2>
              </div>
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3"
                    style={{ padding: '14px 20px', borderBottom: '1px solid #E9E9E9', transition: 'background 0.15s' }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 6, background: '#e8edeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={16} style={{ color: '#154738' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 500, color: '#2D2926' }}>{link.label}</p>
                      <p className="mx-text-secondary" style={{ fontSize: 12 }}>{link.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mx-card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: '#2D2926', marginBottom: 12 }}>AP Aging Summary</h3>
              <div className="space-y-3">
                {[
                  { label: "Current", amount: "$42,300", pct: 33 },
                  { label: "1–30 days", amount: "$38,150", pct: 30 },
                  { label: "31–60 days", amount: "$28,500", pct: 22 },
                  { label: "61–90 days", amount: "$12,400", pct: 10 },
                  { label: "90+ days", amount: "$6,100", pct: 5 },
                ].map((bucket) => (
                  <div key={bucket.label}>
                    <div className="flex justify-between" style={{ fontSize: 12 }}>
                      <span className="mx-text-secondary">{bucket.label}</span>
                      <span style={{ color: '#2D2926' }}>{bucket.amount}</span>
                    </div>
                    <div style={{ marginTop: 4, height: 6, borderRadius: 3, background: '#E9E9E9' }}>
                      <div style={{ height: 6, borderRadius: 3, background: '#154738', width: `${bucket.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

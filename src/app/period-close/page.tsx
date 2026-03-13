"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckSquare, FileText, GitCompare, BarChart3, Activity, Calendar, Clock, ArrowRight, TrendingUp, DollarSign } from "lucide-react";
import { Button, Tag } from "@/components/ui";

const currentPeriod = "March 2026";

const checklistTasks = [
  { name: "Reconcile bank accounts", done: true },
  { name: "Review outstanding AP", done: true },
  { name: "Post depreciation", done: true },
  { name: "Review AR aging", done: false },
  { name: "Post accruals", done: false },
  { name: "Reconcile payroll", done: false },
  { name: "Review prepaid schedule", done: false },
  { name: "Final review", done: false },
];

const areaStatuses = [
  { label: "Revenue", status: "Complete", variant: "success" as const, icon: TrendingUp, detail: "All schedules posted" },
  { label: "Expenses", status: "In Progress", variant: "processing" as const, icon: DollarSign, detail: "3 accruals pending" },
  { label: "Reconciliations", status: "Pending", variant: "warning" as const, icon: GitCompare, detail: "2 of 5 complete" },
  { label: "Journal Entries", status: "In Progress", variant: "processing" as const, icon: FileText, detail: "4 pending approval" },
];

const quickLinks = [
  { label: "Checklist", href: "/period-close/checklist", icon: CheckSquare, desc: "View close tasks" },
  { label: "Journal Entries", href: "/period-close/journal-entries", icon: FileText, desc: "Account register" },
  { label: "Reconciliations", href: "/period-close/reconciliations", icon: GitCompare, desc: "Account reconciliations" },
  { label: "Flux Analysis", href: "/period-close/flux-analysis", icon: BarChart3, desc: "Variance review" },
  { label: "Monitoring", href: "/period-close/monitoring", icon: Activity, desc: "Close monitoring" },
  { label: "Intercompany", href: "/period-close/intercompany", icon: ArrowRight, desc: "IC entries" },
];

function getCloseDeadline(): Date {
  const now = new Date();
  const year = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
  const month = now.getMonth() === 11 ? 0 : now.getMonth() + 1;
  return new Date(year, month, 15);
}

export default function PeriodClosePage() {
  const [tasks] = useState(checklistTasks);

  const completedCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  const deadline = getCloseDeadline();
  const now = new Date();
  const daysUntilClose = Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div style={{ padding: 24, background: '#f9f9f9' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="mx-h1">Period Close</h1>
            <p className="mx-text-secondary mt-1">Close insights and task management for {currentPeriod}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="mx-card" style={{ padding: 20 }}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#e8edeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckSquare size={18} style={{ color: '#154738' }} />
              </div>
              <p className="mx-text-secondary" style={{ fontSize: 13 }}>Close Progress</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: 14, fontWeight: 500, color: '#2D2926' }}>{completedCount}/{totalCount} tasks</span>
              <span className="mx-text-secondary" style={{ fontSize: 14 }}>{progressPct}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: '#E9E9E9', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 4, background: '#154738', width: `${progressPct}%`, transition: 'width 0.5s' }} />
            </div>
          </div>
          <div className="mx-card" style={{ padding: 20 }}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f3f1fb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={18} style={{ color: '#a3a0af' }} />
              </div>
              <p className="mx-text-secondary" style={{ fontSize: 13 }}>Current Period</p>
            </div>
            <p style={{ fontSize: 20, fontWeight: 600, color: '#2D2926' }}>{currentPeriod}</p>
          </div>
          <div className="mx-card" style={{ padding: 20 }}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: 36, height: 36, borderRadius: 8, background: daysUntilClose <= 3 ? '#feeced' : daysUntilClose <= 7 ? '#fffbe9' : '#edfdec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={18} style={{ color: daysUntilClose <= 3 ? '#f03c46' : daysUntilClose <= 7 ? '#e8bf1b' : '#067f54' }} />
              </div>
              <p className="mx-text-secondary" style={{ fontSize: 13 }}>Days Remaining</p>
            </div>
            <p style={{ fontSize: 20, fontWeight: 600, color: daysUntilClose <= 3 ? '#f03c46' : daysUntilClose <= 7 ? '#e8bf1b' : '#2D2926' }}>{daysUntilClose}</p>
          </div>
          <div className="mx-card" style={{ padding: 20 }}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ width: 36, height: 36, borderRadius: 8, background: '#e8edeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} style={{ color: '#154738' }} />
              </div>
              <p className="mx-text-secondary" style={{ fontSize: 13 }}>Tasks Remaining</p>
            </div>
            <p style={{ fontSize: 20, fontWeight: 600, color: '#2D2926' }}>{totalCount - completedCount}</p>
          </div>
        </div>

        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#2D2926', marginBottom: 16 }}>Status by Area</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {areaStatuses.map((area) => {
            const Icon = area.icon;
            return (
              <div key={area.label} className="mx-card" style={{ padding: 16 }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={16} style={{ color: '#154738' }} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#2D2926' }}>{area.label}</span>
                  </div>
                  <Tag variant={area.variant}>{area.status}</Tag>
                </div>
                <p className="mx-text-secondary" style={{ fontSize: 12 }}>{area.detail}</p>
              </div>
            );
          })}
        </div>

        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#2D2926', marginBottom: 16 }}>Quick Links</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className="mx-card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', transition: 'box-shadow 0.15s' }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: '#e8edeb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={20} style={{ color: '#154738' }} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: '#2D2926' }}>{link.label}</p>
                  <p className="mx-text-secondary" style={{ fontSize: 12 }}>{link.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

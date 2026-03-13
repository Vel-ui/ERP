"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";

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

const quickLinks = [
  { label: "Checklist", href: "/close/checklist", icon: "📋" },
  { label: "Account Register", href: "/close/account-register", icon: "📒" },
  { label: "Fixed Assets", href: "/close/fixed-assets", icon: "🏗️" },
  { label: "Intercompany", href: "/close/intercompany", icon: "🔄" },
];

function getCloseDeadline(): Date {
  const now = new Date();
  const year = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
  const month = now.getMonth() === 11 ? 0 : now.getMonth() + 1;
  return new Date(year, month, 15);
}

export default function ClosePage() {
  const [tasks] = useState(checklistTasks);

  const completedCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;
  const remainingCount = totalCount - completedCount;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  const deadline = getCloseDeadline();
  const now = new Date();
  const daysUntilClose = Math.max(
    0,
    Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Close Management</h1>
        <p className="mt-1 text-muted">Period close dashboard and task management</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-sidebar p-5">
          <p className="text-sm text-muted">Current Period</p>
          <p className="mt-1 text-xl font-semibold text-foreground">{currentPeriod}</p>
        </div>
        <div className="rounded-lg border border-border bg-sidebar p-5">
          <p className="text-sm text-muted">Checklist Progress</p>
          <div className="mt-2">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-foreground font-medium">
                {completedCount}/{totalCount} tasks
              </span>
              <span className="text-muted">{progressPct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-background overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-sidebar p-5">
          <p className="text-sm text-muted">Tasks Remaining</p>
          <p className="mt-1 text-xl font-semibold text-foreground">{remainingCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-sidebar p-5">
          <p className="text-sm text-muted">Days Until Close</p>
          <p className={`mt-1 text-xl font-semibold ${daysUntilClose <= 3 ? "text-red-400" : daysUntilClose <= 7 ? "text-yellow-400" : "text-foreground"}`}>
            {daysUntilClose}
          </p>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-lg font-medium text-foreground mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-3 rounded-lg border border-border bg-sidebar p-4 transition-colors hover:bg-sidebar-hover hover:border-accent/40"
            >
              <span className="text-2xl">{link.icon}</span>
              <span className="text-foreground font-medium group-hover:text-accent-hover transition-colors">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent checklist preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-foreground">Checklist Preview</h2>
          <Link href="/close/checklist">
            <Button variant="ghost" size="sm">View Full Checklist →</Button>
          </Link>
        </div>
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-sidebar">
                <th className="px-4 py-3 text-left font-medium text-muted">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Task</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, i) => (
                <tr
                  key={i}
                  className="border-b border-border last:border-0 hover:bg-sidebar-hover transition-colors"
                >
                  <td className="px-4 py-3">
                    {task.done ? (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-xs">
                        ✓
                      </span>
                    ) : (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border text-xs text-muted">
                        &nbsp;
                      </span>
                    )}
                  </td>
                  <td className={`px-4 py-3 ${task.done ? "text-muted line-through" : "text-foreground"}`}>
                    {task.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

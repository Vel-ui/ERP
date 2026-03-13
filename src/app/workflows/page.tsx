"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { Tag } from "@/components/ui";
import { Plus, Play, Pause, FileCheck, Bell, AlertTriangle, Zap, GitBranch, Clock } from "lucide-react";

interface Workflow {
  id: string;
  name: string;
  trigger: string;
  conditions: string;
  actions: string;
  status: "Active" | "Draft" | "Paused";
  lastRun: string;
}

const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: "WF-001",
    name: "JE Approval > $10,000",
    trigger: "Journal Entry Created",
    conditions: "Amount > $10,000",
    actions: "Route to Controller → CFO approval",
    status: "Active",
    lastRun: "03-13-2026 08:30 AM",
  },
  {
    id: "WF-002",
    name: "Auto-Post Recurring JEs",
    trigger: "Schedule (1st of month)",
    conditions: "Template = Recurring, Status = Approved",
    actions: "Auto-post to GL, notify preparer",
    status: "Active",
    lastRun: "03-01-2026 12:00 AM",
  },
  {
    id: "WF-003",
    name: "AP Invoice Approval",
    trigger: "AP Invoice Received",
    conditions: "Amount > $5,000 or new vendor",
    actions: "Route to AP Manager → Department Head",
    status: "Active",
    lastRun: "03-12-2026 03:45 PM",
  },
  {
    id: "WF-004",
    name: "Month-End Close Notification",
    trigger: "Close Period Initiated",
    conditions: "Period status = Open",
    actions: "Notify all assignees, create checklist tasks",
    status: "Active",
    lastRun: "03-01-2026 09:00 AM",
  },
  {
    id: "WF-005",
    name: "Expense Policy Violation",
    trigger: "Expense Report Submitted",
    conditions: "Exceeds policy limit or missing receipt",
    actions: "Flag for review, notify manager",
    status: "Paused",
    lastRun: "02-28-2026 11:00 AM",
  },
];

const QUICK_CREATE = [
  {
    title: "Approval Workflow",
    description: "Multi-level approval chain for journal entries, invoices, or expenses",
    icon: FileCheck,
    color: "text-green-600 bg-green-50",
  },
  {
    title: "Auto-Post Rule",
    description: "Automatically post approved entries on a schedule or trigger",
    icon: Zap,
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "Notification Rule",
    description: "Send alerts to teams when conditions are met",
    icon: Bell,
    color: "text-amber-600 bg-amber-50",
  },
  {
    title: "Escalation Rule",
    description: "Auto-escalate unresolved items after a time threshold",
    icon: AlertTriangle,
    color: "text-red-600 bg-red-50",
  },
];

function statusVariant(status: string): "success" | "default" | "warning" {
  if (status === "Active") return "success";
  if (status === "Paused") return "warning";
  return "default";
}

export default function WorkflowsPage() {
  const [filter, setFilter] = useState<"all" | "Active" | "Draft" | "Paused">("all");

  const filtered = filter === "all" ? MOCK_WORKFLOWS : MOCK_WORKFLOWS.filter((w) => w.status === filter);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mx-h1">Workflows</h1>
          <p className="mx-text-secondary mt-1">
            Configure approval chains, automation rules, and notifications
          </p>
        </div>
        <Button size="sm">
          <Plus size={14} className="mr-1.5 inline" />
          New Workflow
        </Button>
      </div>

      <div>
        <h2 className="mx-h3 mb-4">Quick Create</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_CREATE.map((item) => (
            <button
              key={item.title}
              className="group rounded-lg border border-border bg-white p-5 text-left transition-all hover:border-accent/40 hover:shadow-sm"
            >
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${item.color}`}>
                <item.icon size={20} />
              </div>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                {item.title}
              </h3>
              <p className="mt-1 text-xs text-muted">{item.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="mx-h3">Active Workflows</h2>
          <div className="flex gap-1">
            {(["all", "Active", "Draft", "Paused"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === f ? "bg-accent text-white" : "bg-sidebar text-muted hover:bg-sidebar-hover hover:text-foreground"
                }`}
              >
                {f === "all" ? "All" : f}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-table-container rounded-lg border border-border overflow-hidden">
          <table className="mx-table w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-sidebar">
                <th className="px-4 py-3 text-left font-medium text-muted">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Trigger</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Conditions</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Actions</th>
                <th className="px-4 py-3 text-center font-medium text-muted">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted">Last Run</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((wf) => (
                <tr key={wf.id} className="border-b border-border last:border-0 hover:bg-sidebar-hover transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <GitBranch size={14} className="text-accent" />
                      <span className="font-medium text-foreground">{wf.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{wf.trigger}</td>
                  <td className="px-4 py-3 text-muted text-xs">{wf.conditions}</td>
                  <td className="px-4 py-3 text-muted text-xs">{wf.actions}</td>
                  <td className="px-4 py-3 text-center">
                    <Tag variant={statusVariant(wf.status)}>{wf.status}</Tag>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                      <Clock size={12} />
                      {wf.lastRun}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted">No workflows match the selected filter</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

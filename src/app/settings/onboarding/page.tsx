"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { Landmark, FileSpreadsheet, DollarSign, Settings, Users, Rocket, CheckCircle, Circle, Loader2, Upload } from "lucide-react";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  status: "Complete" | "In Progress" | "Not Started";
  icon: React.ElementType;
  details: string;
}

const INITIAL_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: "Connect Bank Accounts",
    description: "Link your bank accounts via Plaid for automatic transaction import",
    status: "Complete",
    icon: Landmark,
    details: "3 accounts connected: Chase Checking, Chase Savings, Mercury Operating",
  },
  {
    id: 2,
    title: "Import Chart of Accounts",
    description: "Upload your chart of accounts or map from your existing ERP",
    status: "Complete",
    icon: FileSpreadsheet,
    details: "1,247 accounts imported from NetSuite on 03-05-2026",
  },
  {
    id: 3,
    title: "Set Opening Balances",
    description: "Enter or upload trial balance as of your go-live date",
    status: "In Progress",
    icon: DollarSign,
    details: "Upload a CSV with account balances or enter them manually below",
  },
  {
    id: 4,
    title: "Configure Custom Fields",
    description: "Set up departments, classes, locations, and custom dimensions",
    status: "Not Started",
    icon: Settings,
    details: "Define the tracking dimensions used across your accounting workflows",
  },
  {
    id: 5,
    title: "Add Team Members",
    description: "Invite your accounting team and assign roles",
    status: "Not Started",
    icon: Users,
    details: "Add controllers, staff accountants, and reviewers with appropriate permissions",
  },
  {
    id: 6,
    title: "Review & Go Live",
    description: "Final review of configuration before going live",
    status: "Not Started",
    icon: Rocket,
    details: "Run validation checks, review settings, and activate your Maximor instance",
  },
];

function statusIcon(status: string) {
  if (status === "Complete") return <CheckCircle size={20} className="text-green-500" />;
  if (status === "In Progress") return <Loader2 size={20} className="text-blue-500 animate-spin" />;
  return <Circle size={20} className="text-muted" />;
}

function statusBadge(status: string) {
  const colors: Record<string, string> = {
    "Complete": "bg-green-500/15 text-green-400",
    "In Progress": "bg-blue-500/15 text-blue-400",
    "Not Started": "bg-gray-500/15 text-gray-400",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colors[status]}`}>
      {status}
    </span>
  );
}

export default function OnboardingPage() {
  const [steps, setSteps] = useState(INITIAL_STEPS);
  const [activeStep, setActiveStep] = useState(3);
  const [csvUploaded, setCsvUploaded] = useState(false);

  const completedCount = steps.filter((s) => s.status === "Complete").length;
  const progressPct = Math.round((completedCount / steps.length) * 100);

  const handleStartStep = (stepId: number) => {
    setSteps((prev) =>
      prev.map((s) =>
        s.id === stepId && s.status === "Not Started" ? { ...s, status: "In Progress" as const } : s
      )
    );
    setActiveStep(stepId);
  };

  const handleCompleteStep = (stepId: number) => {
    setSteps((prev) =>
      prev.map((s) => {
        if (s.id === stepId) return { ...s, status: "Complete" as const };
        if (s.id === stepId + 1 && s.status === "Not Started") return { ...s, status: "In Progress" as const };
        return s;
      })
    );
    setActiveStep(stepId + 1);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="mx-h1">Onboarding & Go-Live</h1>
        <p className="mx-text-secondary mt-1">
          Complete these steps to set up your Maximor instance and go live
        </p>
      </div>

      <div className="rounded-lg border border-border bg-white p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Setup Progress</span>
          <span className="text-sm text-muted">{completedCount} of {steps.length} complete</span>
        </div>
        <div className="h-3 w-full rounded-full bg-sidebar overflow-hidden">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted">{progressPct}% complete</p>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`rounded-lg border bg-white p-5 transition-colors ${
              activeStep === step.id ? "border-accent/60 shadow-sm" : "border-border"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="mt-0.5">{statusIcon(step.status)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className={`text-sm font-semibold ${step.status === "Complete" ? "text-muted line-through" : "text-foreground"}`}>
                      Step {step.id}: {step.title}
                    </h3>
                    {statusBadge(step.status)}
                  </div>
                  <div>
                    {step.status === "Not Started" && (
                      <Button variant="default" size="sm" onClick={() => handleStartStep(step.id)}>
                        Start
                      </Button>
                    )}
                    {step.status === "In Progress" && (
                      <Button size="sm" onClick={() => handleCompleteStep(step.id)}>
                        Mark Complete
                      </Button>
                    )}
                    {step.status === "Complete" && (
                      <span className="text-xs text-green-500 font-medium">Done</span>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-xs text-muted">{step.description}</p>

                {activeStep === step.id && step.status !== "Complete" && (
                  <div className="mt-4 rounded-md border border-border bg-sidebar p-4">
                    <p className="text-xs text-muted mb-3">{step.details}</p>

                    {step.id === 3 && (
                      <div className="space-y-3">
                        <div
                          className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                            csvUploaded ? "border-green-400 bg-green-50" : "border-border hover:border-accent/40"
                          }`}
                        >
                          {csvUploaded ? (
                            <>
                              <CheckCircle size={24} className="text-green-500 mb-2" />
                              <p className="text-sm font-medium text-green-600">trial_balance_2026.csv uploaded</p>
                              <p className="text-xs text-muted mt-1">1,247 accounts with opening balances</p>
                            </>
                          ) : (
                            <>
                              <Upload size={24} className="text-muted mb-2" />
                              <p className="text-sm font-medium text-foreground">Upload Opening Balance CSV</p>
                              <p className="text-xs text-muted mt-1">Drag and drop or click to browse</p>
                              <Button
                                variant="default"
                                size="sm"
                                className="mt-3"
                                onClick={() => setCsvUploaded(true)}
                              >
                                Select File
                              </Button>
                            </>
                          )}
                        </div>
                        {csvUploaded && (
                          <div className="rounded-md border border-border">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b border-border bg-sidebar">
                                  <th className="px-3 py-2 text-left text-muted font-medium">Account</th>
                                  <th className="px-3 py-2 text-right text-muted font-medium">Debit</th>
                                  <th className="px-3 py-2 text-right text-muted font-medium">Credit</th>
                                </tr>
                              </thead>
                              <tbody>
                                {[
                                  { account: "1000 - Cash", debit: "$124,500.00", credit: "—" },
                                  { account: "1200 - Accounts Receivable", debit: "$45,000.00", credit: "—" },
                                  { account: "2000 - Accounts Payable", debit: "—", credit: "$32,150.00" },
                                  { account: "3000 - Retained Earnings", debit: "—", credit: "$150,000.00" },
                                  { account: "4000 - Revenue", debit: "—", credit: "$87,350.00" },
                                ].map((row, i) => (
                                  <tr key={i} className="border-b border-border last:border-0">
                                    <td className="px-3 py-2 text-foreground">{row.account}</td>
                                    <td className="px-3 py-2 text-right font-mono text-foreground">{row.debit}</td>
                                    <td className="px-3 py-2 text-right font-mono text-foreground">{row.credit}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

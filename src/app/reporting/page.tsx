"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui";
import Link from "next/link";
import {
  BarChart3,
  ClipboardList,
  Banknote,
  Rocket,
  Briefcase,
  TrendingUp,
  Waves,
  Receipt,
  FileText,
  Target,
  FlaskConical,
  FileSpreadsheet,
  Landmark,
  Globe,
  Calendar,
} from "lucide-react";

interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  href: string;
  icon: React.ReactNode;
  iconBg: string;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  "income-statement": <BarChart3 size={20} />,
  "balance-sheet": <ClipboardList size={20} />,
  "cash-flow": <Banknote size={20} />,
  "saas-pl": <Rocket size={20} />,
  "executive-pl": <Briefcase size={20} />,
  "mrr-arr": <TrendingUp size={20} />,
  "arr-waterfall": <Waves size={20} />,
  "ar-aging": <Receipt size={20} />,
  "ap-aging": <FileText size={20} />,
  "budget-vs-actuals": <Target size={20} />,
  "data-lab": <FlaskConical size={20} />,
  "1099": <FileSpreadsheet size={20} />,
  "sales-tax": <Landmark size={20} />,
  "vat": <Globe size={20} />,
  "prepaid-schedule": <Calendar size={20} />,
};

const REPORTS: Report[] = [
  { id: "income-statement", title: "Income Statement", description: "Revenue, expenses, and net income over a period", category: "Financial Statements", href: "/reporting/income-statement", icon: ICON_MAP["income-statement"], iconBg: "bg-violet-500/20 text-violet-600" },
  { id: "balance-sheet", title: "Balance Sheet", description: "Assets, liabilities, and equity at a point in time", category: "Financial Statements", href: "/reporting/balance-sheet", icon: ICON_MAP["balance-sheet"], iconBg: "bg-blue-500/20 text-blue-600" },
  { id: "cash-flow", title: "Cash Flow Statement", description: "Operating, investing, and financing cash flows", category: "Financial Statements", href: "/reporting/cash-flow", icon: ICON_MAP["cash-flow"], iconBg: "bg-emerald-500/20 text-emerald-600" },
  { id: "saas-pl", title: "SaaS P&L", description: "Departmental P&L with SaaS-specific metrics", category: "SaaS Metrics", href: "/reporting/saas-pl", icon: ICON_MAP["saas-pl"], iconBg: "bg-cyan-500/20 text-cyan-600" },
  { id: "executive-pl", title: "Executive P&L", description: "High-level P&L with S&M, R&D, G&A breakdown", category: "SaaS Metrics", href: "/reporting/executive-pl", icon: ICON_MAP["executive-pl"], iconBg: "bg-indigo-500/20 text-indigo-600" },
  { id: "mrr-arr", title: "MRR / ARR", description: "Monthly and annual recurring revenue trends", category: "SaaS Metrics", href: "/reporting/mrr-arr", icon: ICON_MAP["mrr-arr"], iconBg: "bg-purple-500/20 text-purple-600" },
  { id: "arr-waterfall", title: "ARR Waterfall", description: "New, expansion, contraction, and churn breakdown", category: "SaaS Metrics", href: "/reporting/arr-waterfall", icon: ICON_MAP["arr-waterfall"], iconBg: "bg-sky-500/20 text-sky-600" },
  { id: "ar-aging", title: "AR Aging", description: "Accounts receivable aging by customer", category: "Receivables & Payables", href: "/reporting/ar-aging", icon: ICON_MAP["ar-aging"], iconBg: "bg-amber-500/20 text-amber-600" },
  { id: "ap-aging", title: "AP Aging", description: "Accounts payable aging by vendor", category: "Receivables & Payables", href: "/reporting/ap-aging", icon: ICON_MAP["ap-aging"], iconBg: "bg-orange-500/20 text-orange-600" },
  { id: "budget-vs-actuals", title: "Budget vs Actuals", description: "Compare actual results against budget targets", category: "Analysis", href: "/reporting/budget-vs-actuals", icon: ICON_MAP["budget-vs-actuals"], iconBg: "bg-rose-500/20 text-rose-600" },
  { id: "data-lab", title: "Data Lab", description: "Custom analysis with drag-and-drop fields", category: "Analysis", href: "/reporting/data-lab", icon: ICON_MAP["data-lab"], iconBg: "bg-teal-500/20 text-teal-600" },
  { id: "1099", title: "1099 Report", description: "Vendor payments for 1099 filing", category: "Close Reports", href: "/reporting/close-reports/1099", icon: ICON_MAP["1099"], iconBg: "bg-red-500/20 text-red-600" },
  { id: "sales-tax", title: "Sales Tax", description: "Sales tax collected and remitted by jurisdiction", category: "Close Reports", href: "/reporting/close-reports/sales-tax", icon: ICON_MAP["sales-tax"], iconBg: "bg-slate-500/20 text-slate-600" },
  { id: "vat", title: "VAT Report", description: "Value-added tax summary for international ops", category: "Close Reports", href: "/reporting/close-reports/vat", icon: ICON_MAP["vat"], iconBg: "bg-green-500/20 text-green-600" },
  { id: "prepaid-schedule", title: "Prepaid Schedule", description: "Prepaid expense amortization schedule", category: "Close Reports", href: "/reporting/close-reports/prepaid", icon: ICON_MAP["prepaid-schedule"], iconBg: "bg-pink-500/20 text-pink-600" },
];

const CATEGORIES = [
  "Financial Statements",
  "SaaS Metrics",
  "Receivables & Payables",
  "Analysis",
  "Close Reports",
];

const MAX_PINNED = 5;

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function PinIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
    </svg>
  );
}

export default function ReportingPage() {
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["income-statement", "balance-sheet", "ar-aging"]));
  const [pinned, setPinned] = useState<Set<string>>(new Set(["income-statement", "balance-sheet"]));

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePin = (id: string) => {
    setPinned((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_PINNED) {
        next.add(id);
      }
      return next;
    });
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return REPORTS;
    const q = search.toLowerCase();
    return REPORTS.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
    );
  }, [search]);

  const favoriteReports = filtered.filter((r) => favorites.has(r.id));
  const grouped = useMemo(() => {
    const map: Record<string, Report[]> = {};
    for (const cat of CATEGORIES) map[cat] = [];
    for (const r of filtered) {
      if (map[r.category]) map[r.category].push(r);
    }
    return map;
  }, [filtered]);

  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mx-h1">Reports</h1>
          <p className="mt-1 text-sm mx-text-secondary">Browse, search, and favorite your reports</p>
        </div>
        <div className="w-72">
          <Input
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {favoriteReports.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider mx-text-secondary mb-3 flex items-center gap-2">
            <span className="text-amber-400"><StarIcon filled /></span>
            Favorites
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favoriteReports.map((r) => (
              <ReportCard
                key={r.id}
                report={r}
                isFavorite={favorites.has(r.id)}
                isPinned={pinned.has(r.id)}
                onToggleFavorite={() => toggleFavorite(r.id)}
                onTogglePin={() => togglePin(r.id)}
                pinnedCount={pinned.size}
              />
            ))}
          </div>
        </section>
      )}

      {CATEGORIES.map((cat) => {
        const reports = grouped[cat];
        if (!reports || reports.length === 0) return null;
        return (
          <section key={cat}>
            <h2 className="text-sm font-semibold uppercase tracking-wider mx-text-secondary mb-3">
              {cat}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {reports.map((r) => (
                <ReportCard
                  key={r.id}
                  report={r}
                  isFavorite={favorites.has(r.id)}
                  isPinned={pinned.has(r.id)}
                  onToggleFavorite={() => toggleFavorite(r.id)}
                  onTogglePin={() => togglePin(r.id)}
                  pinnedCount={pinned.size}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function ReportCard({
  report,
  isFavorite,
  isPinned,
  onToggleFavorite,
  onTogglePin,
  pinnedCount,
}: {
  report: Report;
  isFavorite: boolean;
  isPinned: boolean;
  onToggleFavorite: () => void;
  onTogglePin: () => void;
  pinnedCount: number;
}) {
  return (
    <div className="group relative mx-card mx-card-hoverable p-4">
      <Link href={report.href} className="absolute inset-0 z-0" />
      <div className="relative z-10 flex items-start justify-between">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${report.iconBg}`}>
          {report.icon}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.preventDefault(); onToggleFavorite(); }}
            className={`rounded p-1 transition-colors ${
              isFavorite ? "text-amber-400" : "mx-text-tertiary opacity-0 group-hover:opacity-100"
            } hover:text-amber-400`}
            title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <StarIcon filled={isFavorite} />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); onTogglePin(); }}
            className={`rounded p-1 transition-colors ${
              isPinned ? "" : "mx-text-tertiary opacity-0 group-hover:opacity-100"
            } ${!isPinned && pinnedCount >= MAX_PINNED ? "cursor-not-allowed" : ""}`}
            style={isPinned ? { color: "var(--mx-primary)" } : undefined}
            title={isPinned ? "Unpin from launchpad" : pinnedCount >= MAX_PINNED ? "Max 5 pinned" : "Pin to launchpad"}
            disabled={!isPinned && pinnedCount >= MAX_PINNED}
          >
            <PinIcon filled={isPinned} />
          </button>
        </div>
      </div>
      <div className="relative z-10 mt-3">
        <h3 className="text-sm font-medium">{report.title}</h3>
        <p className="mt-1 text-xs mx-text-secondary leading-relaxed">{report.description}</p>
      </div>
      {isPinned && (
        <span className="relative z-10 mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: "var(--mx-primary-bg)", color: "var(--mx-primary)" }}>
          Pinned
        </span>
      )}
    </div>
  );
}

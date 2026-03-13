"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DollarSign, Landmark, BookOpen, Calendar, BarChart3, Database, GitBranch, Settings, Bell, Search, User, ChevronDown, ChevronRight, PanelLeftClose } from "lucide-react";
import { Topbar } from "./Topbar";

interface NavChild {
  label: string;
  href: string;
}

interface NavGroup {
  key: string;
  icon: React.ReactNode;
  label: string;
  href: string;
  children?: NavChild[];
}

const menuGroups: NavGroup[] = [
  {
    key: "revenue", icon: <DollarSign size={16} />, label: "Revenue", href: "/revenue",
    children: [
      { label: "Overview", href: "/revenue/overview" },
      { label: "Recognition", href: "/revenue/recognition" },
      { label: "Reconciliation", href: "/revenue/reconciliation" },
      { label: "Reporting", href: "/revenue/reporting" },
      { label: "Policies", href: "/revenue/policies" },
    ],
  },
  {
    key: "cash", icon: <Landmark size={16} />, label: "Cash", href: "/cash",
    children: [
      { label: "Overview", href: "/cash/overview" },
      { label: "Accounting & Reconciliation", href: "/cash/accounting" },
      { label: "Reporting", href: "/cash/reporting" },
      { label: "Policies", href: "/cash/policies" },
    ],
  },
  {
    key: "subledgers", icon: <BookOpen size={16} />, label: "Subledgers", href: "/subledgers",
    children: [
      { label: "AP & Accruals", href: "/subledgers/ap" },
      { label: "Fixed Assets", href: "/subledgers/fixed-assets" },
      { label: "Prepaids", href: "/subledgers/prepaids" },
    ],
  },
  {
    key: "period-close", icon: <Calendar size={16} />, label: "Period Close", href: "/period-close",
    children: [
      { label: "Insights", href: "/period-close/insights" },
      { label: "Checklist", href: "/period-close/checklist" },
      { label: "Journal Entries", href: "/period-close/journal-entries" },
      { label: "Reconciliations", href: "/period-close/reconciliations" },
      { label: "Flux Analysis", href: "/period-close/flux-analysis" },
      { label: "Monitoring", href: "/period-close/monitoring" },
    ],
  },
  {
    key: "reporting", icon: <BarChart3 size={16} />, label: "Reporting", href: "/reporting",
    children: [
      { label: "Reports Hub", href: "/reporting/hub" },
      { label: "Consolidation Mapping", href: "/reporting/consolidation" },
      { label: "Intercompany Eliminations", href: "/reporting/intercompany" },
    ],
  },
  {
    key: "central-data-hub", icon: <Database size={16} />, label: "Central Data Hub", href: "/central-data-hub",
    children: [
      { label: "Unified Ledger", href: "/central-data-hub/unified-ledger" },
      { label: "Data Catalog", href: "/central-data-hub/data-catalog" },
      { label: "Mapping", href: "/central-data-hub/mapping" },
      { label: "Integrations", href: "/central-data-hub/integrations" },
    ],
  },
  { key: "workflows", icon: <GitBranch size={16} />, label: "Workflows", href: "/workflows" },
  { key: "settings", icon: <Settings size={16} />, label: "Settings", href: "/settings" },
];

function getBreadcrumbs(pathname: string): string[] {
  for (const group of menuGroups) {
    if (group.children) {
      for (const child of group.children) {
        if (pathname === child.href || pathname.startsWith(child.href + "/")) {
          return [group.label, child.label];
        }
      }
      if (pathname === group.href || pathname.startsWith(group.href + "/")) {
        return [group.label];
      }
    } else if (pathname === group.href || pathname.startsWith(group.href + "/")) {
      return [group.label];
    }
  }
  return ["Home"];
}

function isGroupActive(group: NavGroup, pathname: string): boolean {
  if (group.children) {
    return group.children.some(
      (c) => pathname === c.href || pathname.startsWith(c.href + "/")
    );
  }
  return pathname === group.href || pathname.startsWith(group.href + "/");
}

function isChildActive(href: string, pathname: string): boolean {
  return pathname === href || pathname.startsWith(href + "/");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const pathname = usePathname();

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div className={`mx-sidebar ${collapsed ? "mx-sidebar-collapsed" : ""}`}>
        {/* Logo + Collapse */}
        <div className="mx-sidebar-logo">
          <div
            className="mx-sidebar-logo-icon"
            onClick={() => collapsed && setCollapsed(false)}
            style={{ cursor: collapsed ? "pointer" : "default" }}
          >
            M
          </div>
          {!collapsed && <span className="mx-sidebar-logo-text">Maximor</span>}
          {!collapsed && (
            <button
              className="mx-sidebar-collapse-btn"
              onClick={() => setCollapsed(true)}
              title="Collapse sidebar"
            >
              <PanelLeftClose size={16} />
            </button>
          )}
        </div>

        {/* Workspace selector */}
        {!collapsed && (
          <select className="mx-sidebar-workspace">
            <option>Blue Star Inc</option>
          </select>
        )}
        {collapsed && (
          <div className="mx-sidebar-workspace-collapsed" title="Blue Star Inc">
            <div className="mx-sidebar-workspace-icon">B</div>
          </div>
        )}

        {/* Search */}
        {!collapsed ? (
          <div className="mx-sidebar-search">
            <Search size={14} style={{ opacity: 0.5 }} />
            <span style={{ flex: 1, opacity: 0.5 }}>Search</span>
            <span style={{ opacity: 0.4, fontSize: 11 }}>⌘K</span>
          </div>
        ) : (
          <div className="mx-sidebar-search-collapsed" title="Search (⌘K)">
            <Search size={16} />
          </div>
        )}

        {/* Nav */}
        <div className="mx-sidebar-nav">
          {menuGroups.map((group) => {
            const groupActive = isGroupActive(group, pathname);
            const isOpen = openMenus.includes(group.key) || groupActive;

            return (
              <div key={group.key}>
                {group.children ? (
                  <div
                    className={`mx-sidebar-item ${!group.children && groupActive ? "mx-sidebar-item-active" : ""}`}
                    onClick={() => toggleMenu(group.key)}
                    title={collapsed ? group.label : undefined}
                  >
                    {group.icon}
                    {!collapsed && <span style={{ flex: 1 }}>{group.label}</span>}
                    {!collapsed && (
                      isOpen
                        ? <ChevronDown size={14} style={{ opacity: 0.5 }} />
                        : <ChevronRight size={14} style={{ opacity: 0.5 }} />
                    )}
                  </div>
                ) : (
                  <Link
                    href={group.href}
                    className={`mx-sidebar-item ${groupActive ? "mx-sidebar-item-active" : ""}`}
                    title={collapsed ? group.label : undefined}
                  >
                    {group.icon}
                    {!collapsed && <span style={{ flex: 1 }}>{group.label}</span>}
                  </Link>
                )}
                {!collapsed && group.children && isOpen && (
                  <div className="mx-sidebar-submenu">
                    {group.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={`mx-sidebar-item ${isChildActive(child.href, pathname) ? "mx-sidebar-item-active" : ""}`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mx-sidebar-footer">
          <div
            className="mx-sidebar-footer-item"
            title={collapsed ? "Notifications" : undefined}
          >
            <Bell size={16} />
            {!collapsed && <span>Notifications</span>}
          </div>
          <div
            className="mx-sidebar-footer-item"
            title={collapsed ? "Ari Michaelides" : undefined}
          >
            <div className="mx-sidebar-avatar">AM</div>
            {!collapsed && <span>Ari Michaelides</span>}
          </div>
        </div>
      </div>

      {/* Main area */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <Topbar breadcrumbs={breadcrumbs} />
        <div style={{ flex: 1, overflowY: "auto", background: "#f9f9f9", padding: 24 }}>
          <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

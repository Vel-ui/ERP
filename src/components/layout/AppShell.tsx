"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Launchpad", href: "/", icon: "🏠" },
  { label: "Cash Reconciliation", href: "/cash", icon: "🏦" },
  { label: "Accounts Receivable", href: "/ar", icon: "📄", children: [
    { label: "Customers", href: "/ar/customers" },
    { label: "Products", href: "/ar/products" },
    { label: "Contracts", href: "/ar/contracts" },
    { label: "Invoices", href: "/ar/invoices" },
    { label: "Credit Memos", href: "/ar/credit-memos" },
  ]},
  { label: "Accounts Payable", href: "/ap", icon: "📋", children: [
    { label: "Vendors", href: "/ap/vendors" },
    { label: "Bills", href: "/ap/bills" },
    { label: "Charges", href: "/ap/charges" },
  ]},
  { label: "Close Management", href: "/close", icon: "📚", children: [
    { label: "Checklist", href: "/close/checklist" },
    { label: "Account Register", href: "/close/account-register" },
    { label: "Fixed Assets", href: "/close/fixed-assets" },
  ]},
  { label: "Reporting", href: "/reporting", icon: "📊" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-sidebar border-r border-border transition-all duration-200 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          {!sidebarCollapsed && (
            <span className="text-lg font-semibold text-foreground">Maximor</span>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="ml-auto rounded p-1 text-muted hover:bg-sidebar-hover hover:text-foreground"
            aria-label={sidebarCollapsed ? "Expand menu" : "Collapse menu"}
          >
            {sidebarCollapsed ? "→" : "←"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          {navItems.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                    ? "bg-accent/20 text-accent"
                    : "text-muted hover:bg-sidebar-hover hover:text-foreground"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.children && <span className="text-xs">▼</span>}
                  </>
                )}
              </Link>
              {!sidebarCollapsed && item.children && (
                <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-2">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={`block rounded px-2 py-1 text-xs transition-colors ${
                        pathname === child.href ? "text-accent" : "text-muted hover:text-foreground"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Organization selector */}
        <div className="border-t border-border p-2">
          <Link
            href="/settings"
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted hover:bg-sidebar-hover hover:text-foreground"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded bg-accent/30 text-xs font-medium text-accent">
              M
            </div>
            {!sidebarCollapsed && (
              <>
                <span className="flex-1 truncate">My Organization</span>
                <span className="text-xs">▲</span>
              </>
            )}
          </Link>
          {!sidebarCollapsed && (
            <p className="mt-1 px-3 text-xs text-muted">Collapse Menu</p>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

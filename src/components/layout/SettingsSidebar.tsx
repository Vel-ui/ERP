"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsNav = [
  { label: "Banks", href: "/settings/banks" },
  { label: "Chart of Accounts", href: "/settings/chart-of-accounts" },
  { label: "Fields", href: "/settings/fields" },
  { label: "Members & Roles", href: "/settings/members" },
  { label: "Invoices", href: "/settings/invoices" },
  { label: "Accounting", href: "/settings/accounting" },
  { label: "Report Settings", href: "/settings/report-settings" },
  { label: "Integrations", href: "/settings/integrations" },
];

export function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-border pr-6">
      <nav className="space-y-0.5">
        {settingsNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-md px-3 py-2 text-sm transition-colors ${
              pathname === item.href
                ? "bg-accent/20 font-medium text-accent"
                : "text-muted hover:bg-sidebar-hover hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

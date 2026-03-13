"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const settingsNav = [
  { label: "Banks", href: "/settings/banks" },
  { label: "Chart of Accounts", href: "/settings/chart-of-accounts" },
  { label: "Subsidiaries", href: "/settings/subsidiaries" },
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
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        background: "#ffffff",
        borderRight: "1px solid var(--mx-border)",
        padding: "16px 0",
      }}
    >
      <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {settingsNav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "block",
                padding: "8px 20px",
                fontSize: 14,
                fontWeight: active ? 500 : 400,
                color: active ? "#154738" : "#61636a",
                background: active ? "#e8edeb" : "transparent",
                borderRadius: 6,
                margin: "0 8px",
                transition: "background-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "#f3f3f4";
                  (e.currentTarget as HTMLElement).style.color = "#2D2926";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "#61636a";
                }
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

"use client";

import { Search, Bell, User } from "lucide-react";

interface TopbarProps {
  breadcrumbs: string[];
}

export function Topbar({ breadcrumbs }: TopbarProps) {
  return (
    <div className="mx-topbar">
      <div className="mx-breadcrumb">
        {breadcrumbs.map((crumb, i) => (
          <span key={i}>
            {i > 0 && <span className="mx-breadcrumb-separator">/</span>}
            <span className="mx-breadcrumb-item">{crumb}</span>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="mx-btn-icon" title="Search (⌘K)">
          <Search size={16} style={{ color: "#61636a" }} />
        </button>
        <div className="mx-badge">
          <Bell size={18} style={{ color: "#61636a", cursor: "pointer" }} />
          <span className="mx-badge-dot">3</span>
        </div>
        <div className="mx-avatar">
          <User size={16} />
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useRef, useEffect } from "react";

interface DropdownItem {
  key: string;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
}

export function Dropdown({ trigger, items }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <div onClick={() => setOpen((v) => !v)} style={{ cursor: "pointer" }}>{trigger}</div>
      {open && (
        <div className="mx-dropdown">
          {items.map((item) => (
            <button
              key={item.key}
              className={`mx-dropdown-item ${item.danger ? "mx-dropdown-item-danger" : ""}`}
              onClick={() => { item.onClick?.(); setOpen(false); }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

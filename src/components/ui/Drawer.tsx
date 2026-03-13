"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Drawer({ isOpen, onClose, title, children, footer }: DrawerProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => { document.removeEventListener("keydown", handleEscape); document.body.style.overflow = ""; };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="mx-drawer-overlay">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="mx-drawer" role="dialog" aria-modal="true">
        <div className="mx-drawer-header">
          <span>{title}</span>
          <button className="mx-modal-close" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        <div className="mx-drawer-body">{children}</div>
        {footer && <div className="mx-drawer-footer">{footer}</div>}
      </div>
    </div>
  );
}

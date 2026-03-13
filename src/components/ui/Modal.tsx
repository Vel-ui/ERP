"use client";
import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "fullscreen";
}

export function Modal({ isOpen, onClose, title, children, footer, size = "md" }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => { document.removeEventListener("keydown", handleEscape); document.body.style.overflow = ""; };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeStyles: Record<string, string> = {
    sm: "max-w-md",
    md: "",
    lg: "max-w-2xl",
    fullscreen: "mx-modal-fullscreen",
  };

  return (
    <div className="mx-modal-overlay">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className={`mx-modal relative ${sizeStyles[size]}`} role="dialog" aria-modal="true">
        <div className="mx-modal-header">
          <span>{title}</span>
          <button className="mx-modal-close" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        <div className="mx-modal-body">{children}</div>
        {footer && <div className="mx-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

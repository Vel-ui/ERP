import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "default" | "text" | "link" | "danger" | "danger-fill" | "icon";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    const variantClass = variant === "icon" ? "mx-btn-icon" : `mx-btn-${variant}`;
    const sizeClass = size === "sm" ? "mx-btn-sm" : size === "lg" ? "mx-btn-lg" : "";
    return (
      <button ref={ref} className={`${variantClass} ${sizeClass} ${className}`} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className={`mx-label ${required ? "mx-label-required" : ""}`}>{label}</label>
        )}
        <input
          ref={ref}
          className={`mx-input w-full ${error ? "mx-input-error" : ""} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm" style={{ color: "var(--mx-error)" }}>{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

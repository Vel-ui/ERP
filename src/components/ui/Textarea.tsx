import { forwardRef } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className={`mx-label ${required ? "mx-label-required" : ""}`}>{label}</label>
        )}
        <textarea
          ref={ref}
          className={`mx-textarea w-full ${error ? "mx-input-error" : ""} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm" style={{ color: "var(--mx-error)" }}>{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

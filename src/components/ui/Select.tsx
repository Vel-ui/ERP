import { forwardRef } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, placeholder, required, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className={`mx-label ${required ? "mx-label-required" : ""}`}>{label}</label>
        )}
        <select ref={ref} className={`mx-select w-full ${className}`} {...props}>
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  }
);
Select.displayName = "Select";

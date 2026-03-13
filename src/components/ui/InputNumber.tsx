"use client";
import { ChevronUp, ChevronDown } from "lucide-react";

interface InputNumberProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: "sm" | "md" | "lg";
  error?: string;
  label?: string;
  disabled?: boolean;
  required?: boolean;
}

export function InputNumber({
  value,
  onChange,
  min,
  max,
  step = 1,
  size = "md",
  error,
  label,
  disabled = false,
  required,
}: InputNumberProps) {
  const clamp = (v: number) => {
    if (min !== undefined && v < min) return min;
    if (max !== undefined && v > max) return max;
    return v;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseFloat(e.target.value);
    if (!isNaN(parsed)) onChange?.(clamp(parsed));
  };

  const increment = () => onChange?.(clamp((value ?? 0) + step));
  const decrement = () => onChange?.(clamp((value ?? 0) - step));

  const sizeClass = size === "sm" ? "mx-input-number-sm" : size === "lg" ? "mx-input-number-lg" : "";

  return (
    <div className="w-full">
      {label && (
        <label className={`mx-label ${required ? "mx-label-required" : ""}`}>{label}</label>
      )}
      <div className={`mx-input-number ${sizeClass} ${error ? "mx-input-error" : ""}`}>
        <input
          type="number"
          value={value ?? ""}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
        />
        <div className="mx-input-number-steppers">
          <button type="button" onClick={increment} disabled={disabled} tabIndex={-1} aria-label="Increment">
            <ChevronUp size={12} />
          </button>
          <button type="button" onClick={decrement} disabled={disabled} tabIndex={-1} aria-label="Decrement">
            <ChevronDown size={12} />
          </button>
        </div>
      </div>
      {error && <p className="mt-1 text-sm" style={{ color: "var(--mx-error)" }}>{error}</p>}
    </div>
  );
}

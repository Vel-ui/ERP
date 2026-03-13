interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
}

export function RadioGroup({ options, value, onChange }: RadioGroupProps) {
  return (
    <div className="mx-radio-group">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`mx-radio-btn ${value === opt.value ? "mx-radio-btn-active" : ""}`}
        >
          <input
            type="radio"
            name="mx-radio-group"
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange?.(opt.value)}
            style={{ display: "none" }}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({ label, checked = false, onChange, disabled = false }: CheckboxProps) {
  return (
    <label className="mx-checkbox" style={{ opacity: disabled ? 0.5 : 1 }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
      />
      {label && <span>{label}</span>}
    </label>
  );
}

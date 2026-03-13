interface SegmentedItem {
  key: string;
  label: string;
}

interface SegmentedTabsProps {
  items: SegmentedItem[];
  activeKey: string;
  onChange: (key: string) => void;
  variant?: "default" | "outlined" | "solid" | "text";
  size?: "sm" | "md" | "lg";
}

export function SegmentedTabs({ items, activeKey, onChange, variant = "default", size = "md" }: SegmentedTabsProps) {
  const variantClass = variant !== "default" ? `mx-segmented-${variant}` : "";
  const sizeClass = size === "sm" ? "mx-segmented-sm" : size === "lg" ? "mx-segmented-lg" : "";
  return (
    <div className={`mx-segmented ${variantClass} ${sizeClass}`}>
      {items.map((item) => (
        <button
          key={item.key}
          className={`mx-segmented-item ${activeKey === item.key ? "mx-segmented-item-active" : ""}`}
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

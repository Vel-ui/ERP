interface TabItem {
  key: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
}

export function Tabs({ items, activeKey, onChange }: TabsProps) {
  return (
    <div className="mx-tabs">
      {items.map((item) => (
        <button
          key={item.key}
          className={`mx-tab ${activeKey === item.key ? "mx-tab-active" : ""}`}
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

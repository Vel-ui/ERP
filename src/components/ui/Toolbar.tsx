interface ToolbarProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
}

export function Toolbar({ left, right }: ToolbarProps) {
  return (
    <div className="mx-toolbar">
      <div className="mx-toolbar-left">{left}</div>
      <div className="mx-toolbar-right">{right}</div>
    </div>
  );
}
